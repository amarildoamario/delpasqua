import type { PrismaClient } from "@/generated/prisma";

export type SalesOrderItem = {
  productId?: string;
  variantId?: string;
  qty?: number;
  sku?: string;
  unitPriceCents?: number;
  lineTotalCents?: number;
};

export type SalesOrder = {
  id: string;
  isTest: boolean;
  createdAt: Date;
  paidAt: Date | null;
  userAgent: string | null;
  totalCents?: number;
  subtotalCents?: number;
  discountCents?: number;
  email?: string | null;
  items?: SalesOrderItem[];
};

// Product IDs are stable order snapshots; SKU prefixes cover legacy orders.
export function productFamily(productKey?: string | null, sku?: string | null) {
  const pk = (productKey ?? "").trim().toLowerCase();
  const code = (sku ?? "").trim().toLowerCase();
  if (/^vino(?:-|$)/.test(pk) || /^(?:wine|vino)[-:]/.test(code)) return "wine";
  if (/^(?:evo|fruttato|tartufo|peperoncino)(?:-|$)/.test(pk) || /^(?:evo|fl|fm|fi|truf|pep)[-:]/.test(code)) return "oil";
  return null;
}

export function parseVariantLiters(variantKey?: string | null, productKey?: string | null): number {
  for (const value of [variantKey, productKey]) {
    const match = value?.toLowerCase().match(/(?:^|[^a-z0-9])(\d+(?:[.,]\d+)?)\s*-?\s*(ml|lt|litri|litro|l)(?=$|[^a-z])/);
    if (!match) continue;
    const size = Number(match[1].replace(",", "."));
    const liters = size / (match[2] === "ml" ? 1000 : 1);
    return liters > 0 && liters <= 1000 ? liters : 0;
  }
  return 0;
}

export function isCanFormat(variantKey?: string | null, productKey?: string | null): boolean {
  return /(?:^|[-_\s])latta(?:$|[-_\s])/.test(`${productKey ?? ""} ${variantKey ?? ""}`.toLowerCase());
}

export function isBottleFormat(variantKey?: string | null, productKey?: string | null): boolean {
  return !isCanFormat(variantKey, productKey) && parseVariantLiters(variantKey, productKey) > 0 && productFamily(productKey) !== null;
}

export type CartDemandEvent = {
  productKey: string | null;
  variantKey: string | null;
  cartId: string | null;
  data: unknown;
};

// Additions measure gross demand, not the final cart balance or lost revenue.
// Historical events without prices remain unavailable rather than using today's prices.
export function summarizeCartDemand(events: CartDemandEvent[]) {
  let litersOilDemanded = 0, litersWineDemanded = 0;
  let cansUnits = 0, bottlesUnits = 0, unknownFormatUnits = 0;
  let valueCents = 0, unpricedUnits = 0, addedUnits = 0;
  const carts = new Set<string>();
  const addsByProduct = new Map<string, number>();
  for (const ev of events) {
    if (!ev.productKey || ev.productKey === "prodotto-test") continue;
    const data = ev.data && typeof ev.data === "object" ? ev.data as Record<string, unknown> : {};
    const qty = data.qty === undefined ? 1 : data.qty;
    if (typeof qty !== "number" || !Number.isSafeInteger(qty) || qty <= 0 || qty > 10000) continue;
    addedUnits += qty;
    addsByProduct.set(ev.productKey, (addsByProduct.get(ev.productKey) ?? 0) + 1);
    if (ev.cartId) carts.add(ev.cartId);
    const liters = qty * parseVariantLiters(ev.variantKey, ev.productKey);
    const family = productFamily(ev.productKey);
    if (family === "wine") litersWineDemanded += liters;
    if (family === "oil") litersOilDemanded += liters;
    if (isCanFormat(ev.variantKey, ev.productKey)) cansUnits += qty;
    else if (isBottleFormat(ev.variantKey, ev.productKey)) bottlesUnits += qty;
    else unknownFormatUnits += qty;
    const price = data.unitPriceCents;
    if (typeof price === "number" && Number.isSafeInteger(price) && price >= 0 && Number.isSafeInteger(price * qty) && Number.isSafeInteger(valueCents + price * qty)) valueCents += price * qty;
    else unpricedUnits += qty;
  }
  const totalFormatUnits = cansUnits + bottlesUnits + unknownFormatUnits;
  const potentialCartRevenueEur = unpricedUnits ? null : valueCents / 100;
  return {
    litersDemandedTotal: +(litersOilDemanded + litersWineDemanded).toFixed(3),
    litersOilDemanded: +litersOilDemanded.toFixed(3), litersWineDemanded: +litersWineDemanded.toFixed(3),
    cansUnits, bottlesUnits, unknownFormatUnits,
    cansPct: totalFormatUnits ? +(cansUnits / totalFormatUnits * 100).toFixed(1) : 0,
    bottlesPct: totalFormatUnits ? +(bottlesUnits / totalFormatUnits * 100).toFixed(1) : 0,
    potentialCartRevenueEur,
    avgCartValueEur: potentialCartRevenueEur !== null && carts.size ? +(potentialCartRevenueEur / carts.size).toFixed(2) : null,
    lostCartRevenueEur: null,
    cartsWithAdditions: carts.size, addedUnits, unpricedUnits, addsByProduct,
  };
}

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

export function metricsPeriod(startParam?: string, endParam?: string, now = new Date(), defaultDays = 7) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((value) => value.type === type)!.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const requestedStart = validDay(startParam) ?? shiftDay(today, -defaultDays);
  const requestedEnd = validDay(endParam) ?? today;
  const startISO = requestedStart < requestedEnd ? requestedStart : requestedEnd;
  const endISO = requestedStart > requestedEnd ? requestedStart : requestedEnd;
  const endExclusiveISO = shiftDay(endISO, 1);
  return { startISO, endISO, endExclusiveISO, start: romeMidnight(startISO), endExclusive: romeMidnight(endExclusiveISO) };
}

export function metricsMonthKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit",
  }).formatToParts(date);
  return `${parts.find((part) => part.type === "year")!.value}-${parts.find((part) => part.type === "month")!.value}`;
}

export function metricsMonthWindow(startISO: string, endISO: string) {
  const nextMonth = new Date(`${endISO.slice(0, 7)}-01T00:00:00Z`);
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
  return {
    startMonthDate: romeMidnight(`${startISO.slice(0, 7)}-01`),
    endMonthDate: romeMidnight(nextMonth.toISOString().slice(0, 10)),
  };
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

  // --- Metriche commerciali ---
  const paidRevenueCents = paid.reduce((sum, o) => sum + (o.totalCents ?? 0), 0);
  const realizedRevenueEur = +(paidRevenueCents / 100).toFixed(2);
  const realizedAovEur = paid.length > 0 ? +((paidRevenueCents / 100) / paid.length).toFixed(2) : null;
  const realizedSubtotalCents = paid.reduce((sum, o) => sum + (o.subtotalCents ?? o.totalCents ?? 0), 0);
  const realizedDiscountCents = paid.reduce((sum, o) => sum + (o.discountCents ?? 0), 0);
  const netGoodsRevenueEur = +((realizedSubtotalCents - realizedDiscountCents) / 100).toFixed(2);
  const estimatedContributionMarginEur = +(netGoodsRevenueEur * 0.60).toFixed(2);

  const startedRevenueCents = started.reduce((sum, o) => sum + (o.totalCents ?? 0), 0);
  const potentialCheckoutRevenueEur = +(startedRevenueCents / 100).toFixed(2);

  const unpaidStarted = started.filter((order) => order.paidAt === null);
  const lostRevenueCents = unpaidStarted.reduce((sum, o) => sum + (o.totalCents ?? 0), 0);
  const lostCheckoutRevenueEur = +(lostRevenueCents / 100).toFixed(2);
  const potentialAovEur = started.length > 0 ? +((startedRevenueCents / 100) / started.length).toFixed(2) : null;

  // Repeat customers (email ordini pagati nel periodo)
  const paidEmails = new Map<string, { count: number; totalCents: number }>();
  for (const o of paid) {
    if (o.email) {
      const em = o.email.trim().toLowerCase();
      if (em) {
        const cur = paidEmails.get(em) ?? { count: 0, totalCents: 0 };
        cur.count++;
        cur.totalCents += (o.totalCents ?? 0);
        paidEmails.set(em, cur);
      }
    }
  }
  const uniquePayingCustomers = paidEmails.size;
  const repeatPayingCustomers = [...paidEmails.values()].filter((c) => c.count >= 2).length;
  const newPayingCustomers = uniquePayingCustomers - repeatPayingCustomers;
  const repeatCustomerRate = uniquePayingCustomers > 0 ? repeatPayingCustomers / uniquePayingCustomers : 0;
  const repeatRevenueCents = [...paidEmails.values()].filter((c) => c.count >= 2).reduce((sum, c) => sum + c.totalCents, 0);
  const newRevenueCents = paidRevenueCents - repeatRevenueCents;
  const repeatRevenueEur = +(repeatRevenueCents / 100).toFixed(2);
  const newRevenueEur = +(newRevenueCents / 100).toFixed(2);

  // Attach rate Olio + Vino
  let ordersWithBothOlioVino = 0;
  let ordersWithItems = 0;
  for (const o of paid) {
    if (!o.items || o.items.length === 0) continue;
    ordersWithItems++;
    const hasWine = o.items.some((it) => productFamily(it.productId, it.sku) === "wine");
    const hasOil = o.items.some((it) => productFamily(it.productId, it.sku) === "oil");
    if (hasWine && hasOil) ordersWithBothOlioVino++;
  }
  const bundleOlioVinoRate = ordersWithItems > 0 ? ordersWithBothOlioVino / ordersWithItems : 0;

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
    // Commerciali
    realizedRevenueEur,
    realizedAovEur,
    potentialCheckoutRevenueEur,
    lostCheckoutRevenueEur,
    potentialAovEur,
    repeatCustomerRate,
    repeatCustomerRatePct: repeatCustomerRate !== null ? +(repeatCustomerRate * 100).toFixed(1) : null,
    bundleOlioVinoRate,
    bundleOlioVinoRatePct: bundleOlioVinoRate !== null ? +(bundleOlioVinoRate * 100).toFixed(1) : null,
    uniquePayingCustomers,
    repeatPayingCustomers,
    newPayingCustomers,
    newRevenueEur,
    repeatRevenueEur,
    netGoodsRevenueEur,
    estimatedContributionMarginEur,
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
    select: {
      id: true,
      isTest: true,
      createdAt: true,
      paidAt: true,
      userAgent: true,
      totalCents: true,
      subtotalCents: true,
      discountCents: true,
      email: true,
      items: {
        select: {
          productId: true,
          variantId: true,
          qty: true,
          sku: true,
          unitPriceCents: true,
          lineTotalCents: true,
        },
      },
    },
  });
  return summarizeSales(orders, start, endExclusive);
}
