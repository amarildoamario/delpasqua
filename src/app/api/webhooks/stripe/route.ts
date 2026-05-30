import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/server/prisma";
import { releaseReserved } from "@/lib/server/inventory";
import { processOutboxBatch } from "@/lib/server/outbox";
import { applyPaidOrderInvariantsTx } from "@/lib/server/orderPayment";
import { sendTastingBookingAdminEmail, sendTastingConfirmedCustomerEmail } from "@/lib/server/tastingEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // se nel tuo progetto hai già un apiVersion diverso, lascia il tuo
  apiVersion: "2026-01-28.clover",
});

function safeSnippet(raw: string, maxLen = 800) {
  return raw.length > maxLen ? raw.slice(0, maxLen) : raw;
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
          payloadSnippet: safeSnippet(rawBody),
          processedAt: new Date(),
        },
      });
    } catch { }
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Idempotenza evento
  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        livemode: event.livemode,
        created: event.created,
        payloadSnippet: safeSnippet(rawBody),
        outcome: "ignored",
        attempts: 1,
      },
    });
  } catch {
    await prisma.stripeWebhookEvent.updateMany({
      where: { eventId: event.id },
      data: { outcome: "duplicate", processedAt: new Date() },
    });
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const { sessionId, paymentIntentId } = getSessionIds(session);
        const { email, name, phone, addr } = getCustomerFromSession(session);

        const order = await prisma.order.findUnique({
          where: { stripeCheckoutSessionId: sessionId },
          include: { items: true },
        });

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
            await releaseReserved(
              tx,
              {
                orderId: order.id,
                lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
              }
            );

            await tx.order.update({
              where: { id: order.id },
              data: {
                status: "FAILED",
                isFlagged: true,
                notes: "Invalid/missing address from Stripe customer_details",
                // opzionale: salvi comunque il metodo se vuoi diagnostica
                ...(paymentMethodLabel ? { paymentMethod: paymentMethodLabel } : {}),
              },
            });

            await tx.orderEvent.create({
              data: {
                orderId: order.id,
                type: "STRIPE_VALIDATION_FAILED",
                message: "Missing required shipping fields from Stripe",
                metaJson: JSON.stringify({ sessionId }),
              },
            });
          });

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              orderId: order.id,
              sessionId,
              paymentIntentId,
              outcome: "failed_validation",
              processedAt: new Date(),
              errorMessage: "Invalid customer_details.address/name (inventory released)",
            },
          });

          return NextResponse.json({ received: true }, { status: 200 });
        }

        if (!isPaidCheckout) {
          await prisma.$transaction(async (tx) => {
            if (order.status === "PENDING") {
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

        const order = await prisma.order.findUnique({
          where: { stripeCheckoutSessionId: sessionId },
          include: { items: true },
        });

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
            if (order.status === "PENDING") {
              await releaseReserved(
                tx,
                {
                  orderId: order.id,
                  lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
                }
              );

              await tx.order.update({
                where: { id: order.id },
                data: {
                  status: "FAILED",
                  isFlagged: true,
                  notes: "Invalid/missing address from Stripe customer_details",
                  ...(paymentMethodLabel ? { paymentMethod: paymentMethodLabel } : {}),
                },
              });
            }

            await tx.orderEvent.create({
              data: {
                orderId: order.id,
                type: "STRIPE_ASYNC_VALIDATION_FAILED",
                message: "Missing required shipping fields after async payment success",
                metaJson: JSON.stringify({ sessionId }),
              },
            });
          });

          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              orderId: order.id,
              sessionId,
              paymentIntentId,
              outcome: "failed_validation",
              processedAt: new Date(),
              errorMessage: "Invalid customer_details.address/name after async payment success",
            },
          });

          return NextResponse.json({ received: true }, { status: 200 });
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

        if (order && order.status === "PENDING") {
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
              data: { status: "FAILED" },
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
              data: { status: "EXPIRED" },
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
    const e = err as { message?: string };
    // ✅ usa un outcome valido del tuo enum
    await prisma.stripeWebhookEvent.update({
      where: { eventId: event.id },
      data: {
        outcome: "review",
        processedAt: new Date(),
        errorMessage: e?.message ?? "runtime error",
      },
    });
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
