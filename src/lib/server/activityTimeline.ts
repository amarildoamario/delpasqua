import type { PrismaClient } from "@/generated/prisma";
import { isSitePage } from "@/lib/analytics/acquisition";
import { metricsPeriod } from "./salesMetrics";

export const ACTIVITY_TIMEFRAMES = [
  { key: "hour", label: "Ultima ora", days: 1, stepHours: 1 / 12, resolution: "Fasce di 5 minuti" },
  { key: "day", label: "Giorno", days: 1, stepHours: 1, resolution: "Fasce di 1 ora" },
  { key: "week", label: "7 giorni", days: 7, stepHours: 6, resolution: "Fasce di 6 ore" },
  { key: "month", label: "30 giorni", days: 30, stepHours: 24, resolution: "Fasce di 24 ore" },
  { key: "quarter", label: "90 giorni", days: 90, stepHours: 72, resolution: "Fasce di 3 giorni" },
] as const;
export type ActivityTimeframe = typeof ACTIVITY_TIMEFRAMES[number]["key"];
export type ActivityRow = { label: string; visits: number; carts: number; orders: number; shortLabel?: string };
const dateFormat = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit" });
const timeFormat = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const hourMs = 3_600_000;

function shiftDay(day: string, amount: number) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function activityWindow(value: string | undefined, anchorDay: string, now = new Date()) {
  const config = ACTIVITY_TIMEFRAMES.find((item) => item.key === value) ?? ACTIVITY_TIMEFRAMES[1];
  const anchor = metricsPeriod(anchorDay, anchorDay);
  const period = metricsPeriod(shiftDay(anchor.endISO, 1 - config.days), anchor.endISO);
  let start = period.start;
  let end = period.endExclusive;
  const boundaries: number[] = [];
  if (config.key === "hour") {
    // For today use the most recent hour; historical dates use 23:00–24:00.
    if (anchor.endISO === metricsPeriod(undefined, undefined, now, 0).endISO) end = new Date(now);
    start = new Date(end.getTime() - hourMs);
    for (let i = 0; i <= 12; i++) boundaries.push(start.getTime() + i * hourMs / 12);
  } else if (config.stepHours >= 24) {
    // Calendar boundaries stay at Italian midnight through DST changes.
    for (let i = 0; i < config.days; i += config.stepHours / 24) {
      boundaries.push(metricsPeriod(shiftDay(period.startISO, i), shiftDay(period.startISO, i)).start.getTime());
    }
    boundaries.push(end.getTime());
  } else {
    for (let at = start.getTime(); at < end.getTime(); at += config.stepHours * hourMs) boundaries.push(at);
    boundaries.push(end.getTime());
  }
  const windows = boundaries.slice(0, -1).map((from, i) => {
    const until = boundaries[i + 1];
    const date = new Date(from), last = new Date(until);
    const label = `${dateFormat.format(date)} ${timeFormat.format(date)} – ${dateFormat.format(last)} ${timeFormat.format(last)}`;
    return { from, until, label, shortLabel: config.key === "hour" || config.key === "day" ? timeFormat.format(date)
      : config.key === "week" ? `${dateFormat.format(date)} ${timeFormat.format(date)}` : dateFormat.format(date) };
  });
  return { key: config.key, resolution: config.resolution, anchorDay: anchor.endISO, start, end, windows,
    subtitle: `${dateFormat.format(start)} ${timeFormat.format(start)} – ${dateFormat.format(end)} ${timeFormat.format(end)} · ${config.resolution}` };
}

type TimelineEvent = { type: string; createdAt: Date; sessionId: string; visitorId: string; cartId: string | null; path: string | null };
type TimelineOrder = { id: string; paidAt: Date | null; isTest: boolean };

export function summarizeActivityTimeline(events: TimelineEvent[], orders: TimelineOrder[], window: ReturnType<typeof activityWindow>) {
  const rows: ActivityRow[] = window.windows.map((bucket) => ({ label: bucket.label, shortLabel: bucket.shortLabel, visits: 0, carts: 0, orders: 0 }));
  const firstVisits = new Map<string, Date>(), firstCarts = new Map<string, Date>();
  const inside = (date: Date) => date >= window.start && date < window.end;
  for (const event of events) {
    if (!inside(event.createdAt)) continue;
    const target = event.type === "page_view" && event.visitorId && event.sessionId && isSitePage(event.path) ? firstVisits
      : event.type === "add_to_cart" && event.cartId ? firstCarts : null;
    const key = target === firstVisits ? event.sessionId : event.cartId;
    if (!target || !key) continue;
    const previous = target.get(key);
    if (!previous || event.createdAt < previous) target.set(key, event.createdAt);
  }
  const increment = (date: Date, key: "visits" | "carts" | "orders") => {
    const index = window.windows.findIndex((bucket) => date.getTime() >= bucket.from && date.getTime() < bucket.until);
    if (index >= 0) rows[index][key]++;
  };
  for (const date of firstVisits.values()) increment(date, "visits");
  for (const date of firstCarts.values()) increment(date, "carts");
  for (const order of new Map(orders.map((order) => [order.id, order])).values()) {
    if (!order.isTest && order.paidAt && inside(order.paidAt)) increment(order.paidAt, "orders");
  }
  return { key: window.key, resolution: window.resolution, anchorDay: window.anchorDay, subtitle: window.subtitle, rows };
}

export async function readActivityTimeline(db: Pick<PrismaClient, "analyticsEvent" | "order">, value: string | undefined, anchorDay: string, includeInternal = false, now = new Date()) {
  const window = activityWindow(value, anchorDay, now);
  const range = { gte: window.start, lt: window.end };
  const [events, orders] = await Promise.all([
    db.analyticsEvent.findMany({ where: { createdAt: range, type: { in: ["page_view", "add_to_cart"] }, ...(includeInternal ? {} : { env: "prod", isInternal: false }) },
      select: { type: true, createdAt: true, sessionId: true, visitorId: true, cartId: true, path: true } }),
    db.order.findMany({ where: { isTest: false, paidAt: range }, select: { id: true, paidAt: true, isTest: true } }),
  ]);
  return summarizeActivityTimeline(events, orders, window);
}
