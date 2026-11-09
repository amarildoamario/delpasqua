import type { PrismaClient } from "@/generated/prisma";
import { acquisitionSource, ACQUISITION_LABELS, isSitePage } from "@/lib/analytics/acquisition";

type InsightEvent = {
  type: string; createdAt: Date; visitorId: string; sessionId: string;
  cartId: string | null; orderId: string | null; path: string | null;
  referrer: string | null; userAgent: string | null; data: unknown;
};
type InsightOrder = {
  id: string; createdAt: Date; paidAt: Date | null; isTest: boolean; stripeCheckoutSessionId: string | null;
  events: { metaJson: string | null }[];
};
const clock = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", hourCycle: "h23" });
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayLabels = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const avg = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

function context(order: InsightOrder, includeInternal: boolean) {
  for (const event of order.events) {
    try {
      const value = JSON.parse(event.metaJson ?? "null");
      if (typeof value?.visitorId === "string" && typeof value.sessionId === "string" && (includeInternal || value.env === "prod")) return value as { visitorId: string; sessionId: string };
    } catch { /* Historical orders may have no valid context. */ }
  }
  return null;
}

export function summarizeCommerceInsights(orders: InsightOrder[], events: InsightEvent[], history: InsightEvent[], start: Date, endExclusive: Date, includeInternal = false) {
  const inRange = (date: Date) => date >= start && date < endExclusive;
  const uniqueOrders = [...new Map(orders.filter((o) => !o.isTest).map((o) => [o.id, o])).values()];
  const paid = uniqueOrders.filter((o) => o.paidAt && inRange(o.paidAt));
  const cohort = uniqueOrders.filter((o) => o.stripeCheckoutSessionId && inRange(o.createdAt));
  const canceledIds = new Set(events.filter((e) => e.type === "checkout_canceled" && e.orderId && inRange(e.createdAt)).map((e) => e.orderId));
  const cohortPaid = cohort.filter((o) => o.paidAt && o.paidAt < endExclusive);
  const canceledUnpaid = cohort.filter((o) => canceledIds.has(o.id) && (!o.paidAt || o.paidAt >= endExclusive));
  const recovered = cohortPaid.filter((o) => canceledIds.has(o.id));
  const outcomes = canceledUnpaid.length + cohortPaid.length;

  const sessions = new Map<string, InsightEvent>();
  const visits = new Map<string, InsightEvent[]>();
  for (const event of [...history, ...events]) {
    if (event.type !== "page_view" || !isSitePage(event.path) || !event.visitorId || event.createdAt >= endExclusive) continue;
    const list = visits.get(event.visitorId) ?? [];
    list.push(event); visits.set(event.visitorId, list);
    if (inRange(event.createdAt) && event.sessionId) {
      const first = sessions.get(event.sessionId);
      if (!first || event.createdAt < first.createdAt) sessions.set(event.sessionId, event);
    }
  }
  const sourceCounts = new Map<keyof typeof ACQUISITION_LABELS, number>();
  for (const event of sessions.values()) {
    const meta = event.data && typeof event.data === "object" ? (event.data as { meta?: { acquisition?: { source?: string } } }).meta : undefined;
    const stored = meta?.acquisition?.source;
    const source = stored && Object.hasOwn(ACQUISITION_LABELS, stored) ? stored as keyof typeof ACQUISITION_LABELS : acquisitionSource(event.userAgent ?? "", event.referrer).source;
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  }
  const legacyLinks = new Map(events.filter((e) => e.type === "purchase" && e.orderId).map((e) => [e.orderId!, e]));
  const decisionDays: number[] = [], decisionSessions: number[] = [];
  for (const order of paid) {
    const saved = context(order, includeInternal);
    const legacy = legacyLinks.get(order.id);
    const visitorId = saved?.visitorId ?? legacy?.visitorId;
    if (!visitorId) continue;
    const before = (visits.get(visitorId) ?? []).filter((e) => e.createdAt <= order.paidAt!);
    if (!before.length) continue;
    const first = before.reduce((min, e) => Math.min(min, e.createdAt.getTime()), Infinity);
    decisionDays.push((order.paidAt!.getTime() - first) / 86_400_000);
    const measured = new Set(before.map((e) => e.sessionId).filter(Boolean));
    if (saved?.sessionId) measured.add(saved.sessionId);
    decisionSessions.push(measured.size);
  }

  const buckets = (count: number) => Array.from({ length: count }, () => ({ visits: new Set<string>(), carts: new Set<string>(), orders: new Set<string>() }));
  const hours = buckets(24), days = buckets(7);
  const bucketPair = (date: Date) => {
    const parts = clock.formatToParts(date);
    return [hours[Number(parts.find((p) => p.type === "hour")!.value)], days[weekdays.indexOf(parts.find((p) => p.type === "weekday")!.value)]];
  };
  // A visit/cart is counted once in its first observed bucket inside the selected period.
  const cartStarts = new Map<string, InsightEvent>();
  for (const e of events) if (e.type === "add_to_cart" && e.cartId && inRange(e.createdAt)) {
    const previous = cartStarts.get(e.cartId);
    if (!previous || e.createdAt < previous.createdAt) cartStarts.set(e.cartId, e);
  }
  for (const [id, e] of sessions) for (const bucket of bucketPair(e.createdAt)) bucket.visits.add(id);
  for (const [id, e] of cartStarts) for (const bucket of bucketPair(e.createdAt)) bucket.carts.add(id);
  for (const o of paid) for (const bucket of bucketPair(o.paidAt!)) bucket.orders.add(o.id);
  const serialize = (bucket: typeof hours[number], label: string) => ({ label, visits: bucket.visits.size, carts: bucket.carts.size, orders: bucket.orders.size });
  return {
    acquisition: Object.entries(ACQUISITION_LABELS).map(([source, label]) => ({ source, label, sessions: sourceCounts.get(source as keyof typeof ACQUISITION_LABELS) ?? 0 })),
    stripe: { started: cohort.length, paid: cohortPaid.length, canceledUnpaid: canceledUnpaid.length, recovered: recovered.length,
      pendingOrUnobserved: cohort.length - outcomes, exitRate: outcomes ? canceledUnpaid.length / outcomes : null },
    decision: { samples: decisionDays.length, paidOrders: paid.length, avgDays: avg(decisionDays), avgSessions: avg(decisionSessions) },
    hourly: hours.map((b, i) => serialize(b, `${String(i).padStart(2, "0")}:00`)),
    weekdays: days.map((b, i) => serialize(b, dayLabels[i])), timeZone: "Europe/Rome",
  };
}

export async function readCommerceInsights(db: Pick<PrismaClient, "order" | "analyticsEvent">, start: Date, endExclusive: Date, includeInternal = false) {
  const quality = includeInternal ? {} : { env: "prod", isInternal: false };
  const [orders, events] = await Promise.all([
    db.order.findMany({ where: { isTest: false, OR: [{ createdAt: { gte: start, lt: endExclusive } }, { paidAt: { gte: start, lt: endExclusive } }] },
      select: { id: true, isTest: true, createdAt: true, paidAt: true, stripeCheckoutSessionId: true,
        events: { where: { type: "ANALYTICS_CONTEXT" }, select: { metaJson: true } } } }),
    db.analyticsEvent.findMany({ where: { ...quality, createdAt: { gte: start, lt: endExclusive }, type: { in: ["page_view", "add_to_cart", "checkout_canceled", "purchase"] } },
      select: { type: true, createdAt: true, visitorId: true, sessionId: true, cartId: true, orderId: true, path: true, referrer: true, userAgent: true, data: true } }),
  ]);
  const visitorIds = new Set<string>();
  for (const order of orders) { const value = context(order, includeInternal); if (value) visitorIds.add(value.visitorId); }
  for (const event of events) if (event.type === "purchase") visitorIds.add(event.visitorId);
  const history = visitorIds.size ? await db.analyticsEvent.findMany({
    where: { ...quality, type: "page_view", visitorId: { in: [...visitorIds] }, createdAt: { lt: start } },
    select: { type: true, createdAt: true, visitorId: true, sessionId: true, cartId: true, orderId: true, path: true, referrer: true, userAgent: true, data: true },
  }) : [];
  return summarizeCommerceInsights(orders, events, history, start, endExclusive, includeInternal);
}
