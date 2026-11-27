import type { PrismaClient } from "@/generated/prisma";
import type { V6OrderInput } from "./metricsAnalyticsV6";

type CheckoutDb = Partial<Pick<PrismaClient, "tastingBooking" | "stripeWebhookEvent">>;

export async function readTastingStripeCheckouts(
  db: CheckoutDb, vouchers: V6OrderInput[], start: Date, endExclusive: Date,
): Promise<V6OrderInput[]> {
  const bookings = db.tastingBooking?.findMany ? await db.tastingBooking.findMany({
    where: {
      voucherId: null,
      stripeSessionId: { startsWith: "cs_live_" },
      createdAt: { gte: start, lt: endExclusive },
    },
    select: { id: true, stripeSessionId: true, createdAt: true, updatedAt: true, status: true },
  }) : [];
  const checkouts: V6OrderInput[] = [
    ...vouchers.filter(({ createdAt }) => createdAt >= start && createdAt < endExclusive),
    ...bookings.map((booking): V6OrderInput => ({
      id: `tasting:${booking.id}`,
      channel: "tasting",
      stripeCheckoutSessionId: booking.stripeSessionId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      status: booking.status === "CANCELED" ? "ANNULLATO" : undefined,
      isTest: false,
      paidAt: null,
      events: [],
    })),
  ];
  const bySession = new Map<string, V6OrderInput>();
  for (const checkout of checkouts) {
    if (checkout.stripeCheckoutSessionId) {
      bySession.set(checkout.stripeCheckoutSessionId, { ...checkout, events: [...checkout.events] });
    }
  }
  if (!db.stripeWebhookEvent || !bySession.size) return [...bySession.values()];

  const events = await db.stripeWebhookEvent.findMany({
    where: {
      sessionId: { in: [...bySession.keys()] },
      livemode: true,
      created: { gte: Math.floor(+start / 1000), lt: Math.ceil(+endExclusive / 1000) },
      OR: [
        { outcome: "processed", type: { in: ["checkout.session.completed", "checkout.session.expired", "checkout.session.async_payment_failed"] } },
        { outcome: { in: ["processed", "review"] }, type: "checkout.session.async_payment_succeeded" },
      ],
    },
    orderBy: { created: "asc" },
    select: { sessionId: true, type: true, created: true, paymentIntentId: true, payloadSnippet: true },
  });
  const asyncSessions = new Set(events.filter((event) => event.type.includes(".async_payment_")).map((event) => event.sessionId));
  for (const event of events) {
    const checkout = event.sessionId ? bySession.get(event.sessionId) : undefined;
    if (!checkout) continue;
    const createdAt = new Date(event.created * 1000);
    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      checkout.events.push({
        metaJson: null, createdAt, type: event.type === "checkout.session.expired" ? "ORDER_EXPIRED" : "STRIPE_SESSION_FAILED",
      });
    } else if (checkout.channel === "tasting" && !checkout.paidAt && event.paymentIntentId) {
      // Older completions only recorded the payment intent. A later async
      // outcome distinguishes a pending legacy completion from a payment.
      const explicitStatus = /"paymentStatus"\s*:\s*"([^"]+)"/.exec(event.payloadSnippet ?? "")?.[1];
      if (event.type === "checkout.session.async_payment_succeeded" || explicitStatus === "paid" ||
        (!explicitStatus && !asyncSessions.has(event.sessionId))) checkout.paidAt = createdAt;
    }
  }
  for (const checkout of bySession.values()) {
    // For a canceled booking, prefer the Stripe outcome over its booking status.
    if (checkout.channel === "tasting" && checkout.events.length) checkout.status = undefined;
  }
  return [...bySession.values()];
}
