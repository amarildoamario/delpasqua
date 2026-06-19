import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/server/prisma";
import { releaseReserved } from "@/lib/server/inventory";
import { processOutboxBatch } from "@/lib/server/outbox";
import { applyPaidOrderInvariantsTx } from "@/lib/server/orderPayment";
import {
  extractOrderIdFromCheckoutSession,
  registerIncomingStripeWebhookEvent,
  safeWebhookPayloadSnippet,
} from "@/lib/server/stripeWebhook";
import { sendTastingBookingAdminEmail, sendTastingConfirmedCustomerEmail } from "@/lib/server/tastingEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // se nel tuo progetto hai già un apiVersion diverso, lascia il tuo
  apiVersion: "2026-01-28.clover",
});

type Tx = Prisma.TransactionClient;

function getStripeErrorMessage(err: unknown) {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err.trim()) return err;
  return "runtime error";
}

function getSessionOrderId(session: Stripe.Checkout.Session) {
  return extractOrderIdFromCheckoutSession(session);
}

function getSessionIds(session: Stripe.Checkout.Session) {
  const sessionId = session.id;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  return { sessionId, paymentIntentId };
}

function getCustomerFromSession(session: Stripe.Checkout.Session) {
  const cd = session.customer_details;

  const email = (cd?.email ?? session.customer_email ?? "").trim();
  const name = (cd?.name ?? "").trim();
  const phone = cd?.phone ?? null;
  const addr = cd?.address ?? null;

  return { email, name, phone, addr };
}

function isValidAddress(addr: Stripe.Address | null) {
  if (!addr) return false;
  return Boolean(addr.line1 && addr.city && addr.postal_code && addr.country);
}

function verifyShippingCountryAndZip(
  order: { countryCode: string | null; postalCode: string | null },
  addr: Stripe.Address | null
): { ok: boolean; error?: string } {
  if (!order.countryCode || order.countryCode.toUpperCase() === "IT") {
    // Italian order or no country code saved, bypass CAP check
    return { ok: true };
  }

  if (!addr) {
    return { ok: false, error: "Missing address" };
  }

  const finalCountry = (addr.country ?? "").trim().toUpperCase();
  const finalZip = (addr.postal_code ?? "").trim().replace(/\s+/g, "").toUpperCase();

  const expectedCountry = (order.countryCode ?? "").trim().toUpperCase();
  const expectedZip = (order.postalCode ?? "").trim().replace(/\s+/g, "").toUpperCase();

  if (finalCountry !== expectedCountry) {
    return {
      ok: false,
      error: `Country mismatch: calculated for ${expectedCountry} but checked out with ${finalCountry}`,
    };
  }

  if (finalZip !== expectedZip) {
    return {
      ok: false,
      error: `ZIP code mismatch: calculated for ${expectedZip} (${expectedCountry}) but checked out with ${finalZip} (${finalCountry})`,
    };
  }

  return { ok: true };
}

/** -------------------- PAYMENT METHOD (REAL USED) -------------------- **/

function titleCase(s: string) {
  return s
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function formatPaymentMethodLabelFromStripe(paymentIntent: unknown): string | null {
  // Prova PaymentMethod espanso su PI
  const pi = paymentIntent as {
    payment_method?: { type?: string; card?: { brand?: string; last4?: string }; paypal?: unknown; link?: unknown; sepa_debit?: { last4?: string }; us_bank_account?: { bank_name?: string; last4?: string } };
    latest_charge?: { payment_method_details?: { type?: string; card?: { brand?: string; last4?: string }; paypal?: unknown; link?: unknown; sepa_debit?: { last4?: string }; us_bank_account?: { bank_name?: string; last4?: string } } };
  };
  const pm = pi?.payment_method;

  // Fallback: latest_charge.payment_method_details
  const pmd = pi?.latest_charge?.payment_method_details;

  // ---- CARD
  if (pm?.type === "card") {
    const brand = pm.card?.brand ? titleCase(pm.card.brand) : "Carta";
    const last4 = pm.card?.last4 ? `•••• ${pm.card.last4}` : "";
    return `${brand} ${last4}`.trim();
  }
  if (pmd?.type === "card") {
    const brand = pmd.card?.brand ? titleCase(pmd.card.brand) : "Carta";
    const last4 = pmd.card?.last4 ? `•••• ${pmd.card.last4}` : "";
    return `${brand} ${last4}`.trim();
  }

  // ---- PAYPAL
  if (pm?.type === "paypal" || pmd?.type === "paypal") return "PayPal";

  // ---- LINK
  if (pm?.type === "link" || pmd?.type === "link") return "Link";

  // ---- SEPA DEBIT
  if (pm?.type === "sepa_debit") {
    const last4 = pm.sepa_debit?.last4 ? `•••• ${pm.sepa_debit.last4}` : "";
    return `Addebito SEPA ${last4}`.trim();
  }
  if (pmd?.type === "sepa_debit") {
    const last4 = pmd.sepa_debit?.last4 ? `•••• ${pmd.sepa_debit.last4}` : "";
    return `Addebito SEPA ${last4}`.trim();
  }

  // ---- US BANK ACCOUNT (ACH ecc.)
  if (pm?.type === "us_bank_account") {
    const bank = pm.us_bank_account?.bank_name ? pm.us_bank_account.bank_name : "Bank account";
    const last4 = pm.us_bank_account?.last4 ? `•••• ${pm.us_bank_account.last4}` : "";
    return `${bank} ${last4}`.trim();
  }
  if (pmd?.type === "us_bank_account") {
    const bank = pmd.us_bank_account?.bank_name ? pmd.us_bank_account.bank_name : "Bank account";
    const last4 = pmd.us_bank_account?.last4 ? `•••• ${pmd.us_bank_account.last4}` : "";
    return `${bank} ${last4}`.trim();
  }

  // ---- Local methods / BNPL / wallets
  const map: Record<string, string> = {
    ideal: "iDEAL",
    bancontact: "Bancontact",
    giropay: "Giropay",
    eps: "EPS",
    sofort: "Sofort",
    klarna: "Klarna",
    afterpay_clearpay: "Afterpay / Clearpay",
    affirm: "Affirm",
    alipay: "Alipay",
    wechat_pay: "WeChat Pay",
    revolut_pay: "Revolut Pay",
    blik: "BLIK",
    p24: "Przelewy24",
    boleto: "Boleto",
    oxxo: "OXXO",
    pix: "Pix",
    grabpay: "GrabPay",
    paynow: "PayNow",
    promptpay: "PromptPay",
    customer_balance: "Bonifico / Bank transfer",
    bank_transfer: "Bonifico / Bank transfer",
  };

  const typeFromPm: string | undefined = pm?.type;
  if (typeFromPm) return map[typeFromPm] ?? titleCase(typeFromPm);

  const typeFromPmd: string | undefined = pmd?.type;
  if (typeFromPmd) return map[typeFromPmd] ?? titleCase(typeFromPmd);

  return null;
}

async function getRealPaymentMethodLabelFromPaymentIntent(paymentIntentId: string | null) {
  if (!paymentIntentId) return null;

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["payment_method", "latest_charge"],
    });
    return formatPaymentMethodLabelFromStripe(pi);
  } catch {
    return null;
  }
}

/** ------------------------------------------------------------------- **/

async function loadOrderForSession(session: Stripe.Checkout.Session) {
  const order = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: session.id },
    include: { items: true },
  });

  if (order) return order;

  const orderId = getSessionOrderId(session);
  if (!orderId) return null;

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
}

type WebhookOrder = NonNullable<Awaited<ReturnType<typeof loadOrderForSession>>>;

async function markPaidOrderForManualReviewTx(
  tx: Tx,
  args: {
    order: WebhookOrder;
    eventId: string;
    sessionId: string;
    paymentIntentId: string | null;
    paymentMethodLabel: string | null;
    eventType: "STRIPE_VALIDATION_REQUIRES_REVIEW" | "STRIPE_ASYNC_VALIDATION_REQUIRES_REVIEW";
    message: string;
    note: string;
    customer: {
      email: string;
      name: string;
      phone: string | null;
      addr: Stripe.Address | null;
    };
  }
) {
  if (args.order.status === "IN_ATTESA") {
    await applyPaidOrderInvariantsTx(tx, {
      orderId: args.order.id,
      source: "stripe_webhook",
      paymentIntentId: args.paymentIntentId,
      paymentMethod: args.paymentMethodLabel,
      stripeEventId: args.eventId,
      stripeSessionId: args.sessionId,
      customer: {
        email: args.customer.email,
        fullName: args.customer.name,
        phone: args.customer.phone,
        addressLine1: args.customer.addr?.line1 ?? null,
        addressLine2: args.customer.addr?.line2 ?? null,
        city: args.customer.addr?.city ?? null,
        province: args.customer.addr?.state ?? "",
        postalCode: args.customer.addr?.postal_code ?? null,
        countryCode: args.customer.addr?.country ?? null,
      },
    });
  }

  await tx.order.update({
    where: { id: args.order.id },
    data: {
      isFlagged: true,
      notes: args.note,
      ...(args.paymentMethodLabel ? { paymentMethod: args.paymentMethodLabel } : {}),
      ...(args.paymentIntentId ? { stripePaymentIntentId: args.paymentIntentId } : {}),
    },
  });

  await tx.orderEvent.create({
    data: {
      orderId: args.order.id,
      type: args.eventType,
      message: args.message,
      metaJson: JSON.stringify({
        sessionId: args.sessionId,
        paymentIntentId: args.paymentIntentId,
        paymentMethod: args.paymentMethodLabel,
        reason: args.note,
        paymentCaptured: true,
        requiresManualReview: true,
      }),
    },
  });
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    try {
      const e = err as { message?: string };
      const surrogateId = `sigfail_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      await prisma.stripeWebhookEvent.create({
        data: {
          eventId: surrogateId,
          type: "failed_signature",
          livemode: false,
          created: Math.floor(Date.now() / 1000),
          outcome: "failed_signature",
          attempts: 1,
          errorMessage: e?.message ?? "signature verification failed",
          payloadSnippet: safeWebhookPayloadSnippet(rawBody),
          processedAt: new Date(),
        },
      });
    } catch { }
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const registration = await registerIncomingStripeWebhookEvent(prisma.stripeWebhookEvent, {
    event,
    rawBody,
  });
  if (!registration.shouldProcess) {
    return NextResponse.json(
      {
        received: true,
        duplicate: registration.duplicate,
        previousOutcome: registration.previousOutcome,
      },
      { status: 200 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const { sessionId, paymentIntentId } = getSessionIds(session);
        const { email, name, phone, addr } = getCustomerFromSession(session);

        const order = await loadOrderForSession(session);

        if (!order) {
          // Check if it matches a TastingBooking!
          const booking = await prisma.tastingBooking.findUnique({
            where: { stripeSessionId: sessionId },
          });

          if (booking) {
            await prisma.tastingBooking.update({
              where: { id: booking.id },
              data: { status: "CONFIRMED" },
            });

            console.log("[TASTING][WEBHOOK] booking paid and confirmed", {
              bookingId: booking.id,
              sessionId,
            });

            // Send notification emails after successful payment
            const adminMail = await sendTastingBookingAdminEmail({
              id: booking.id,
              status: "CONFIRMED",
              slotStart: booking.slotStart,
              slotEnd: booking.slotEnd,
              tastingType: booking.tastingType,
              people: booking.people,
              children: booking.children,
              fullName: booking.fullName,
              email: booking.email,
              phone: booking.phone,
              notes: booking.notes,
            }).catch((err) => {
              console.error("[TASTING][WEBHOOK] admin email dispatch failed", err);
              return { ok: false as const, status: "failed" as const, error: String(err) };
            });

            const customerMail = await sendTastingConfirmedCustomerEmail({
              toEmail: booking.email,
              fullName: booking.fullName,
              slotStart: booking.slotStart,
              slotEnd: booking.slotEnd,
              tastingType: booking.tastingType,
              people: booking.people,
              children: booking.children,
            }).catch((err) => {
              console.error("[TASTING][WEBHOOK] customer email dispatch failed", err);
              return { ok: false as const, status: "failed" as const, error: String(err) };
            });

            console.log("[TASTING][WEBHOOK] email dispatch results", {
              bookingId: booking.id,
              adminMail,
              customerMail,
            });

            await prisma.stripeWebhookEvent.update({
              where: { eventId: event.id },
              data: {
                sessionId,
                paymentIntentId,
                outcome: "processed",
                processedAt: new Date(),
              },
            });

            return NextResponse.json({ received: true, type: "tasting_booking" }, { status: 200 });
          }

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              sessionId,
              paymentIntentId,
              outcome: "review",
              processedAt: new Date(),
              errorMessage: "Order or TastingBooking not found for stripeCheckoutSessionId",
            },
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        // ✅ METODO DI PAGAMENTO USATO (REAL)
        // lo calcolo QUI prima della tx (chiamata esterna a Stripe)
        let paymentMethodLabel = await getRealPaymentMethodLabelFromPaymentIntent(paymentIntentId);

        // fallback minimo (non “usato”, ma meglio di vuoto)
        if (!paymentMethodLabel) {
          const types = (session.payment_method_types ?? []) as string[];
          if (types.length === 1) paymentMethodLabel = titleCase(types[0]);
          else if (types.length > 1) paymentMethodLabel = types.map(titleCase).join(", ");
        }

        const isPaidCheckout = (session.payment_status ?? "").toLowerCase() === "paid";

        // Validazione address+name
        if (!name || !isValidAddress(addr)) {
          await prisma.$transaction(async (tx) => {
            await markPaidOrderForManualReviewTx(tx, {
              order,
              eventId: event.id,
              sessionId,
              paymentIntentId,
              paymentMethodLabel,
              eventType: "STRIPE_VALIDATION_REQUIRES_REVIEW",
              message: "Pagamento ricevuto, ma i dati di spedizione richiedono revisione manuale",
              note: "Invalid/missing address from Stripe customer_details",
              customer: {
                email,
                name,
                phone,
                addr,
              },
            });
          });

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              orderId: order.id,
              sessionId,
              paymentIntentId,
              outcome: "processed",
              processedAt: new Date(),
              errorMessage: "Invalid customer_details.address/name (paid order flagged for manual review)",
            },
          });

          return NextResponse.json({ received: true, review: true }, { status: 200 });
        }

        // Validazione nazione/CAP per ordini internazionali
        const verification = verifyShippingCountryAndZip(order, addr);
        if (!verification.ok) {
          await prisma.$transaction(async (tx) => {
            await markPaidOrderForManualReviewTx(tx, {
              order,
              eventId: event.id,
              sessionId,
              paymentIntentId,
              paymentMethodLabel,
              eventType: "STRIPE_VALIDATION_REQUIRES_REVIEW",
              message: "Pagamento ricevuto, ma paese/CAP richiedono revisione manuale",
              note: verification.error || "CAP/Country mismatch",
              customer: {
                email,
                name,
                phone,
                addr,
              },
            });
          });

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              orderId: order.id,
              sessionId,
              paymentIntentId,
              outcome: "processed",
              processedAt: new Date(),
              errorMessage: `${verification.error || "CAP/Country mismatch"} (paid order flagged for manual review)`,
            },
          });

          return NextResponse.json({ received: true, review: true }, { status: 200 });
        }

        if (!isPaidCheckout) {
          await prisma.$transaction(async (tx) => {
            if (order.status === "IN_ATTESA") {
              await tx.order.update({
                where: { id: order.id },
                data: {
                  ...(paymentMethodLabel ? { paymentMethod: paymentMethodLabel } : {}),
                  ...(email ? { email } : {}),
                  ...(name ? { fullName: name } : {}),
                  ...(phone ? { phone } : {}),
                  ...(addr?.line1
                    ? {
                      addressLine1: addr.line1,
                      address: addr.line1,
                    }
                    : {}),
                  ...(typeof addr?.line2 !== "undefined" ? { addressLine2: addr?.line2 ?? null } : {}),
                  ...(addr?.city ? { city: addr.city } : {}),
                  ...(addr?.state ? { province: addr.state } : {}),
                  ...(addr?.postal_code
                    ? {
                      postalCode: addr.postal_code,
                      zip: addr.postal_code,
                    }
                    : {}),
                  ...(addr?.country ? { countryCode: addr.country } : {}),
                },
              });
            }

            await tx.orderEvent.create({
              data: {
                orderId: order.id,
                type: "STRIPE_CHECKOUT_PENDING",
                message: "Checkout completato, pagamento in attesa di conferma",
                metaJson: JSON.stringify({
                  sessionId,
                  paymentIntentId,
                  paymentStatus: session.payment_status ?? null,
                  paymentMethod: paymentMethodLabel ?? null,
                }),
              },
            });
          });

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              orderId: order.id,
              sessionId,
              paymentIntentId,
              outcome: "processed",
              processedAt: new Date(),
            },
          });

          return NextResponse.json({ received: true, pending: true }, { status: 200 });
        }

        // Commit inventario + update ordine + enqueue ORDER_PAID
        await prisma.$transaction(async (tx) => {
          await applyPaidOrderInvariantsTx(tx, {
            orderId: order.id,
            source: "stripe_webhook",
            paymentIntentId,
            paymentMethod: paymentMethodLabel,
            stripeEventId: event.id,
            stripeSessionId: sessionId,
            customer: {
              email,
              fullName: name,
              phone,
              addressLine1: addr!.line1!,
              addressLine2: addr!.line2 ?? null,
              city: addr!.city!,
              province: addr!.state ?? "",
              postalCode: addr!.postal_code!,
              countryCode: addr!.country!,
            },
          });

          await tx.orderEvent.create({
            data: {
              orderId: order.id,
              type: "STRIPE_CHECKOUT_COMPLETED",
              message: "Processed checkout.session.completed",
              metaJson: JSON.stringify({
                sessionId,
                paymentIntentId,
                paymentMethod: paymentMethodLabel ?? null,
              }),
            },
          });
        });

        await prisma.stripeWebhookEvent.update({
          where: { eventId: event.id },
          data: {
            orderId: order.id,
            sessionId,
            paymentIntentId,
            outcome: "processed",
            processedAt: new Date(),
          },
        });

        // Processa subito l'outbox (best-effort) per inviare la conferma ordine
        // immediatamente invece di aspettare il cron. Il cron resta come backup.
        processOutboxBatch({ limit: 5 }).catch((e: unknown) => {
          console.error("❌ outbox inline failed (stripe webhook):", e);
        });

        return NextResponse.json({ received: true }, { status: 200 });
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { sessionId, paymentIntentId } = getSessionIds(session);
        const { email, name, phone, addr } = getCustomerFromSession(session);

        const order = await loadOrderForSession(session);

        if (!order) {
          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              sessionId,
              paymentIntentId,
              outcome: "review",
              processedAt: new Date(),
              errorMessage: "Order not found for async payment success",
            },
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        let paymentMethodLabel = await getRealPaymentMethodLabelFromPaymentIntent(paymentIntentId);
        if (!paymentMethodLabel) {
          const types = (session.payment_method_types ?? []) as string[];
          if (types.length === 1) paymentMethodLabel = titleCase(types[0]);
          else if (types.length > 1) paymentMethodLabel = types.map(titleCase).join(", ");
        }

        if (!name || !isValidAddress(addr)) {
          await prisma.$transaction(async (tx) => {
            await markPaidOrderForManualReviewTx(tx, {
              order,
              eventId: event.id,
              sessionId,
              paymentIntentId,
              paymentMethodLabel,
              eventType: "STRIPE_ASYNC_VALIDATION_REQUIRES_REVIEW",
              message: "Pagamento asincrono ricevuto, ma i dati di spedizione richiedono revisione manuale",
              note: "Invalid/missing address from Stripe customer_details",
              customer: {
                email,
                name,
                phone,
                addr,
              },
            });
          });

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              orderId: order.id,
              sessionId,
              paymentIntentId,
              outcome: "processed",
              processedAt: new Date(),
              errorMessage: "Invalid customer_details.address/name after async payment success (paid order flagged for manual review)",
            },
          });

          return NextResponse.json({ received: true, review: true }, { status: 200 });
        }

        // Validazione nazione/CAP per ordini internazionali in pagamento asincrono
        const verification = verifyShippingCountryAndZip(order, addr);
        if (!verification.ok) {
          await prisma.$transaction(async (tx) => {
            await markPaidOrderForManualReviewTx(tx, {
              order,
              eventId: event.id,
              sessionId,
              paymentIntentId,
              paymentMethodLabel,
              eventType: "STRIPE_ASYNC_VALIDATION_REQUIRES_REVIEW",
              message: "Pagamento asincrono ricevuto, ma paese/CAP richiedono revisione manuale",
              note: verification.error || "CAP/Country mismatch",
              customer: {
                email,
                name,
                phone,
                addr,
              },
            });
          });

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              orderId: order.id,
              sessionId,
              paymentIntentId,
              outcome: "processed",
              processedAt: new Date(),
              errorMessage: `${verification.error || "CAP/Country mismatch"} (paid order flagged for manual review)`,
            },
          });

          return NextResponse.json({ received: true, review: true }, { status: 200 });
        }

        await prisma.$transaction(async (tx) => {
          await applyPaidOrderInvariantsTx(tx, {
            orderId: order.id,
            source: "stripe_webhook",
            paymentIntentId,
            paymentMethod: paymentMethodLabel,
            stripeEventId: event.id,
            stripeSessionId: sessionId,
            customer: {
              email,
              fullName: name,
              phone,
              addressLine1: addr!.line1!,
              addressLine2: addr!.line2 ?? null,
              city: addr!.city!,
              province: addr!.state ?? "",
              postalCode: addr!.postal_code!,
              countryCode: addr!.country!,
            },
          });

          await tx.orderEvent.create({
            data: {
              orderId: order.id,
              type: "STRIPE_ASYNC_PAYMENT_SUCCEEDED",
              message: "Processed checkout.session.async_payment_succeeded",
              metaJson: JSON.stringify({
                sessionId,
                paymentIntentId,
                paymentMethod: paymentMethodLabel ?? null,
              }),
            },
          });
        });

        await prisma.stripeWebhookEvent.update({
          where: { eventId: event.id },
          data: {
            orderId: order.id,
            sessionId,
            paymentIntentId,
            outcome: "processed",
            processedAt: new Date(),
          },
        });

        processOutboxBatch({ limit: 5 }).catch((e: unknown) => {
          console.error("❌ outbox inline failed (stripe async success):", e);
        });

        return NextResponse.json({ received: true }, { status: 200 });
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { sessionId, paymentIntentId } = getSessionIds(session);

        const order = await prisma.order.findUnique({
          where: { stripeCheckoutSessionId: sessionId },
          include: { items: true },
        });

        if (order && order.status === "IN_ATTESA") {
          await prisma.$transaction(async (tx) => {
            await releaseReserved(
              tx,
              {
                orderId: order.id,
                lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
              }
            );

            await tx.order.update({
              where: { id: order.id },
              data: { status: "FALLITO" },
            });

            await tx.orderEvent.create({
              data: {
                orderId: order.id,
                type: "STRIPE_ASYNC_PAYMENT_FAILED",
                message: "Pagamento Stripe fallito dopo autorizzazione iniziale",
                metaJson: JSON.stringify({
                  sessionId,
                  paymentIntentId,
                  paymentStatus: session.payment_status ?? null,
                }),
              },
            });
          });
        }

        await prisma.stripeWebhookEvent.update({
          where: { eventId: event.id },
          data: {
            orderId: order?.id ?? null,
            sessionId,
            paymentIntentId,
            outcome: "processed",
            processedAt: new Date(),
          },
        });

        return NextResponse.json({ received: true }, { status: 200 });
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { sessionId, paymentIntentId } = getSessionIds(session);

        const order = await prisma.order.findUnique({
          where: { stripeCheckoutSessionId: sessionId },
          include: { items: true },
        });

        if (order) {
          await prisma.$transaction(async (tx) => {
            await releaseReserved(
              tx,
              {
                orderId: order.id,
                lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
              }
            );

            await tx.order.update({
              where: { id: order.id },
              data: { status: "SCADUTO" },
            });
          });
        } else {
          // Check if it matches a TastingBooking!
          const booking = await prisma.tastingBooking.findUnique({
            where: { stripeSessionId: sessionId },
          });

          if (booking) {
            await prisma.tastingBooking.update({
              where: { id: booking.id },
              data: { status: "CANCELED" },
            });

            console.log("[TASTING][WEBHOOK] booking session expired, status updated to CANCELED (slot released)", {
              bookingId: booking.id,
              sessionId,
            });
          }
        }

        await prisma.stripeWebhookEvent.update({
          where: { eventId: event.id },
          data: {
            orderId: order?.id ?? null,
            sessionId,
            paymentIntentId,
            outcome: "processed",
            processedAt: new Date(),
          },
        });

        return NextResponse.json({ received: true }, { status: 200 });
      }

      default: {
        await prisma.stripeWebhookEvent.update({
          where: { eventId: event.id },
          data: { outcome: "ignored", processedAt: new Date() },
        });
        return NextResponse.json({ received: true }, { status: 200 });
      }
    }
  } catch (err: unknown) {
    // ✅ usa un outcome valido del tuo enum
    await prisma.stripeWebhookEvent.update({
      where: { eventId: event.id },
      data: {
        outcome: "failed_processing",
        processedAt: new Date(),
        errorMessage: getStripeErrorMessage(err),
      },
    });
    return NextResponse.json({ received: false, retry: true }, { status: 500 });
  }
}
