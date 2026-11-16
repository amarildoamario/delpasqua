import type { Prisma, PrismaClient } from "@/generated/prisma";
import { analyticsVisitorCookie, hasAnalyticsExclusion } from "@/lib/analytics/exclusion";

export const CHECKOUT_INTERNAL = "CHECKOUT_INTERNAL_BROWSER";
export const CHECKOUT_EXTERNAL = "CHECKOUT_CUSTOMER_BROWSER";
export const CHECKOUT_AUDIENCE_TYPES = [CHECKOUT_INTERNAL, CHECKOUT_EXTERNAL];
type AudienceIdentity = { visitorId: string; sessionId: string; env: string };

export function checkoutAudienceEvent(internal: boolean, analytics?: AudienceIdentity | null) {
  return {
    type: internal ? CHECKOUT_INTERNAL : CHECKOUT_EXTERNAL,
    metaJson: !internal && analytics ? JSON.stringify({ visitorId: analytics.visitorId, env: analytics.env }) : null,
  };
}

// This affects the unpaid-checkout funnel only, never fulfillment or actual sales.
// An external browser reaching the same shared quote restores its commercial use.
export const COMMERCIAL_CHECKOUT_FILTER: Prisma.OrderWhereInput = {
  OR: [
    { paidAt: { not: null } },
    { events: { none: { type: CHECKOUT_INTERNAL } } },
    { events: { some: { type: CHECKOUT_EXTERNAL } } },
  ],
};

export function excludedCheckout(order: { paidAt: Date | null; events?: { type?: string }[] }) {
  return order.paidAt === null && !!order.events?.some((event) => event.type === CHECKOUT_INTERNAL) &&
    !order.events.some((event) => event.type === CHECKOUT_EXTERNAL);
}

export async function requestCheckoutExcluded(db: Pick<PrismaClient, "analyticsEvent">, req: Request) {
  const cookies = req.headers.get("cookie") ?? "";
  if (hasAnalyticsExclusion(cookies) || cookies.split(/;\s*/).includes("internal=1")) return true;
  const visitorId = analyticsVisitorCookie(cookies);
  if (!visitorId) return false;
  const env = ["delpasqua.com", "www.delpasqua.com"].includes(new URL(req.url).hostname) ? "prod" : "dev";
  return !!await db.analyticsEvent.findUnique({ where: { id: `ana-excluded-${env}-${visitorId}` }, select: { id: true } });
}

export async function recordCheckoutAudience(db: Pick<PrismaClient, "orderEvent">, orderId: string, internal: boolean,
  analytics?: AudienceIdentity | null) {
  const event = checkoutAudienceEvent(internal, analytics);
  const identity = internal ? "" : `-${analytics ? `${analytics.env}-${analytics.visitorId}` : "unattributed"}`;
  await db.orderEvent.createMany({ data: [
    { id: `${event.type}-${orderId}${identity}`, orderId, ...event },
    ...(!internal && analytics ? [{ id: `ana-context-${orderId}-${analytics.env}-${analytics.visitorId}`,
      orderId, type: "ANALYTICS_CONTEXT", metaJson: JSON.stringify(analytics) }] : []),
  ], skipDuplicates: true });
}

// Restore only identities actually observed for this browser, never all uses of
// a quote, all iPhones, an IP address or a customer's email.
export async function excludeCheckoutHistory(db: Pick<PrismaClient, "analyticsEvent" | "orderEvent" | "order">, visitorId: string, env: string) {
  const [analytics, contexts] = await Promise.all([
    db.analyticsEvent.findMany({ where: { visitorId, env, orderId: { not: null } }, select: { orderId: true }, distinct: ["orderId"] }),
    db.orderEvent.findMany({ where: { type: "ANALYTICS_CONTEXT", metaJson: { contains: visitorId } }, select: { orderId: true, metaJson: true } }),
  ]);
  const orderIds = new Set(analytics.flatMap((row) => row.orderId ? [row.orderId] : []));
  for (const row of contexts) {
    try {
      const value = JSON.parse(row.metaJson ?? "null");
      if (value?.visitorId === visitorId && value.env === env) orderIds.add(row.orderId);
    } catch { /* Skip malformed legacy context. */ }
  }
  if (!orderIds.size) return;
  const existing = await db.order.findMany({ where: { id: { in: [...orderIds] } }, select: { id: true } });
  const ids = existing.map((order) => order.id);
  if (!ids.length) return;
  // Retract only this browser's marker. Another identified or unconsented
  // customer's commercial visit must survive the owner's self-exclusion.
  await db.orderEvent.deleteMany({ where: { orderId: { in: ids }, type: CHECKOUT_EXTERNAL,
    metaJson: JSON.stringify({ visitorId, env }) } });
  await db.orderEvent.createMany({ data: ids.map((orderId) => ({ id: `${CHECKOUT_INTERNAL}-${orderId}`, orderId, type: CHECKOUT_INTERNAL })), skipDuplicates: true });
}
