import type { PrismaClient } from "@/generated/prisma";

export type SalesOrder = {
  id: string;
  isTest: boolean;
  createdAt: Date;
  paidAt: Date | null;
  userAgent: string | null;
};

function validDay(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : null;
}

function shiftDay(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function romeMidnight(day: string) {
  const utc = new Date(`${day}T00:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(utc);
  const hour = Number(parts.find((part) => part.type === "hour")!.value);
  const minute = Number(parts.find((part) => part.type === "minute")!.value);
  return new Date(utc.getTime() - (hour * 60 + minute) * 60_000);
}

export function metricsPeriod(startParam?: string, endParam?: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((value) => value.type === type)!.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const startISO = validDay(startParam) ?? shiftDay(today, -7);
  const requestedEnd = validDay(endParam) ?? today;
  const endISO = requestedEnd < startISO ? startISO : requestedEnd;
  const endExclusiveISO = shiftDay(endISO, 1);
  return { startISO, endISO, endExclusiveISO, start: romeMidnight(startISO), endExclusive: romeMidnight(endExclusiveISO) };
}

export function salesConversion(paidOrders: number, sessions: number) {
  // No measured visits means unavailable, not a fabricated 0% conversion rate.
  return sessions > 0 ? paidOrders / sessions : null;
}

function saleDevice(ua: string | null) {
  if (!ua || /bot|spider|crawl|headless|playwright|puppeteer/i.test(ua)) return "unknown";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function average(samples: number[]) {
  return samples.length ? Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length) : null;
}

export function summarizeSales(orders: SalesOrder[], start: Date, endExclusive: Date) {
  const inPeriod = (date: Date | null) => date !== null && date >= start && date < endExclusive;
  const unique = [...new Map(orders.filter((order) => !order.isTest).map((order) => [order.id, order])).values()];
  const paid = unique.filter((order) => inPeriod(order.paidAt));
  const started = unique.filter((order) => inPeriod(order.createdAt));
  const unpaidCheckouts = started.filter((order) => order.paidAt === null).length;
  const durations: number[] = [];
  const devices = new Map<string, { purchases: number; durations: number[] }>();

  for (const order of paid) {
    const device = saleDevice(order.userAgent);
    const group = devices.get(device) ?? { purchases: 0, durations: [] };
    group.purchases++;
    const ms = order.paidAt!.getTime() - order.createdAt.getTime();
    if (ms >= 0) { durations.push(ms); group.durations.push(ms); }
    devices.set(device, group);
  }

  return {
    paidOrders: paid.length,
    startedCheckouts: started.length,
    unpaidCheckouts,
    unpaidCheckoutRate: salesConversion(unpaidCheckouts, started.length),
    paymentSamples: durations.length,
    avgPaymentMs: average(durations),
    devices: [...devices].map(([device, group]) => ({
      device, purchases: group.purchases, paymentSamples: group.durations.length,
      avgPaymentMs: average(group.durations),
    })),
  };
}

export async function readSalesMetrics(db: Pick<PrismaClient, "order">, start: Date, endExclusive: Date) {
  // One read replaces the former purchase/cart/device analytics queries. The
  // payment record exists even when no success page, JS or tracking cookie runs.
  const orders = await db.order.findMany({
    where: {
      isTest: false,
      OR: [
        { paidAt: { gte: start, lt: endExclusive } },
        { createdAt: { gte: start, lt: endExclusive } },
      ],
    },
    select: { id: true, isTest: true, createdAt: true, paidAt: true, userAgent: true },
  });
  return summarizeSales(orders, start, endExclusive);
}
