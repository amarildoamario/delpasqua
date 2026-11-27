import type { PrismaClient } from "@/generated/prisma";
import { CHECKOUT_AUDIENCE_TYPES } from "./checkoutAudience";
import { computeFunnelsAndSeries, type V6EventInput } from "./metricsAnalyticsV6";

export async function readCommercialFunnel(
  db: Pick<PrismaClient, "analyticsEvent" | "order">,
  period: { start: Date; endExclusive: Date; startISO: string; endISO: string },
  siteEvents: Promise<V6EventInput[]>,
) {
  const range = { gte: period.start, lt: period.endExclusive };
  const [pages, interactions, orders] = await Promise.all([
    siteEvents,
    db.analyticsEvent.findMany({
      where: { env: "prod", isInternal: false, createdAt: range, type: { in: ["add_to_cart", "purchase"] } },
      select: { type: true, createdAt: true, visitorId: true, sessionId: true, orderId: true, productKey: true, data: true },
    }),
    db.order.findMany({
      where: {
        isTest: false,
        quoteId: null,
        OR: [{ createdAt: range, stripeCheckoutSessionId: { not: null } }, { paidAt: range }],
      },
      select: {
        id: true, createdAt: true, paidAt: true, isTest: true, stripeCheckoutSessionId: true,
        events: {
          where: { type: { in: ["ANALYTICS_CONTEXT", ...CHECKOUT_AUDIENCE_TYPES] } },
          select: { type: true, metaJson: true },
        },
      },
    }),
  ]);
  const { sessionFunnel, checkoutCohort } = computeFunnelsAndSeries({
    ...period, events: [...pages, ...interactions], orders,
  });
  return {
    sessions: sessionFunnel.sessions,
    shop: sessionFunnel.shopSessions,
    product: sessionFunnel.productDetailSessions,
    cart: sessionFunnel.addToCartSessions,
    checkout: checkoutCohort.siteSessionsWithStripeCheckout,
    purchase: sessionFunnel.purchasingSessions,
  };
}
