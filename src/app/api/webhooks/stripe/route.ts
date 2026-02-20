import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/server/prisma";
import { commitReservedToSoldOrThrow, releaseReserved } from "@/lib/server/inventory";
import { processOutboxBatch } from "@/lib/server/outbox";
import { allocateInvoiceNumberTx } from "@/lib/server/invoiceNumber";

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

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    try {
      const surrogateId = `sigfail_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      await prisma.stripeWebhookEvent.create({
        data: {
          eventId: surrogateId,
          type: "failed_signature",
          livemode: false,
          created: Math.floor(Date.now() / 1000),
          outcome: "failed_signature",
          attempts: 1,
          errorMessage: err?.message ?? "signature verification failed",
          payloadSnippet: safeSnippet(rawBody),
          processedAt: new Date(),
        },
      });
    } catch {}
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
          await prisma.stripeWebhookEvent.update({
            where: { eventId: event.id },
            data: {
              sessionId,
              paymentIntentId,
              outcome: "review",
              processedAt: new Date(),
              errorMessage: "Order not found for stripeCheckoutSessionId",
            },
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        // Validazione address+name
        if (!name || !isValidAddress(addr)) {
          await prisma.$transaction(async (tx) => {
            await releaseReserved(
              tx,
              order.items.map((it) => ({ sku: it.sku, qty: it.qty }))
            );

            await tx.order.update({
              where: { id: order.id },
              data: {
                status: "FAILED",
                isFlagged: true,
                notes: "Invalid/missing address from Stripe customer_details",
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

        // Commit inventario + update ordine + enqueue ORDER_PAID
        await prisma.$transaction(async (tx) => {
          await commitReservedToSoldOrThrow(
            tx,
            order.items.map((it) => ({ sku: it.sku, qty: it.qty }))
          );

          await tx.order.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              paidAt: new Date(),
              stripePaymentIntentId: paymentIntentId ?? null,

              // ✅ fondamentale: salva email Stripe
              ...(email ? { email } : {}),
              ...(name ? { fullName: name } : {}),

              addressLine1: addr!.line1!,
              addressLine2: addr!.line2 ?? null,
              city: addr!.city!,
              province: addr!.state ?? "",
              postalCode: addr!.postal_code!,
              countryCode: addr!.country!,
              phone,

              // legacy compat
              address: addr!.line1!,
              zip: addr!.postal_code!,
            },
          });


          // ✅ assegna progressivo fattura al pagamento (idempotente)
const alreadyAssigned = await tx.orderEvent.findFirst({
  where: { orderId: order.id, type: "INVOICE_ASSIGNED" },
  select: { id: true },
});

if (!alreadyAssigned) {
  const invoiceNumber = await allocateInvoiceNumberTx(tx);

  await tx.orderEvent.create({
    data: {
      orderId: order.id,
      type: "INVOICE_ASSIGNED",
      message: `Invoice assigned: ${invoiceNumber}`,
      metaJson: JSON.stringify({
        invoiceNumber,
        invoiceYear: new Date().getFullYear(),
        assignedAt: new Date().toISOString(),
        stripeSessionId: sessionId,
        stripeEventId: event.id,
      }),
    },
  });
}

          await tx.outboxEvent.create({
            data: {
              type: "ORDER_PAID",
              payload: {
                orderId: order.id,
                stripeEventId: event.id,
                stripeSessionId: sessionId,
                paymentIntentId,
                at: new Date().toISOString(),
              },
              runAt: new Date(),
            },
          });

          await tx.orderEvent.create({
            data: {
              orderId: order.id,
              type: "STRIPE_CHECKOUT_COMPLETED",
              message: "Processed checkout.session.completed",
              metaJson: JSON.stringify({ sessionId, paymentIntentId }),
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

        // ✅ AUTO: processa subito l’outbox (best-effort)
        processOutboxBatch({ limit: 10 }).catch((e) => {
          console.error("❌ outbox auto-process failed (stripe webhook):", e);
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
              order.items.map((it) => ({ sku: it.sku, qty: it.qty }))
            );

            await tx.order.update({
              where: { id: order.id },
              data: { status: "EXPIRED" },
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

      default: {
        await prisma.stripeWebhookEvent.update({
          where: { eventId: event.id },
          data: { outcome: "ignored", processedAt: new Date() },
        });
        return NextResponse.json({ received: true }, { status: 200 });
      }
    }
  } catch (err: any) {
    // ✅ usa un outcome valido del tuo enum
    await prisma.stripeWebhookEvent.update({
      where: { eventId: event.id },
      data: {
        outcome: "review",
        processedAt: new Date(),
        errorMessage: err?.message ?? "runtime error",
      },
    });
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
