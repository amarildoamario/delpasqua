import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function parseDateOnly(s?: string) {
  if (!s) return null;
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeForDuration(path: string) {
  if (path.startsWith("/shop/")) {
    const q = path.indexOf("?");
    return q >= 0 ? path.slice(0, q) : path;
  }
  return path;
}

function pct(n: number) {
  return +(n * 100).toFixed(2);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const startParam = getOne(searchParams.get("start") ?? undefined);
  const endParam = getOne(searchParams.get("end") ?? undefined);
  const internalRaw = (searchParams.get("internal") ?? "").toLowerCase();
const includeInternal = internalRaw === "1" || internalRaw === "true" || internalRaw === "yes" || internalRaw === "on";


  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 7);

  const start = parseDateOnly(startParam) ?? defaultStart;
  const end = parseDateOnly(endParam) ?? today;

  const startISO = toISODate(start);
  const endISO = toISODate(end);

  const endExclusive = new Date(end);
  endExclusive.setDate(end.getDate() + 1);

  const rangeWhere = { createdAt: { gte: start, lt: endExclusive } };

  const SITE_ONLY = {
    NOT: [
      { path: { startsWith: "/checkout" } },
      { path: { startsWith: "/payment" } },
      { path: { startsWith: "/payments" } },
      { path: { startsWith: "/stripe" } },
      { path: { startsWith: "/api" } },
      { path: { startsWith: "/_next" } },
      { path: { startsWith: "/admin" } },
    ],
  };

  const QUALITY_FILTER = includeInternal ? {} : { isInternal: false, env: "prod" as const };

  // --- KPI base (sito-only + quality) ---
  const [pageViews, pageLeaves] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER } }),
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "page_leave", ...SITE_ONLY, ...QUALITY_FILTER } }),
  ]);

  const [sessions, visitors] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["sessionId"],
      where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER, sessionId: { not: "" } },
      _count: { sessionId: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["visitorId"],
      where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER, visitorId: { not: "" } },
      _count: { visitorId: true },
    }),
  ]);

  const uniqueSessions = sessions.length;
  const uniqueVisitors = visitors.length;
  const avgPagesPerSession = uniqueSessions > 0 ? pageViews / uniqueSessions : 0;

  // --- Funnel (analytics-based) ---
  const [cartsTotal, cartsPaid] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["cartId"],
      where: { ...rangeWhere, type: { in: ["add_to_cart", "begin_checkout"] }, ...QUALITY_FILTER, cartId: { not: "" } },
      _count: { cartId: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["cartId"],
      where: { ...rangeWhere, type: "purchase", ...QUALITY_FILTER, cartId: { not: "" } },
      _count: { cartId: true },
    }),
  ]);

  const cartTotalN = cartsTotal.length;
  const cartPaidN = cartsPaid.length;
  const cartAbandonedN = Math.max(0, cartTotalN - cartPaidN);
  const abandonedRate = cartTotalN > 0 ? cartAbandonedN / cartTotalN : 0;

  const conversionAnalytics = uniqueVisitors > 0 ? cartPaidN / uniqueVisitors : 0;

  // --- tempo medio pagamento (overall) ---
  const [beginByCart, purchaseByCart] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["cartId"],
      where: { ...rangeWhere, type: "begin_checkout", ...QUALITY_FILTER, cartId: { not: "" } },
      _min: { createdAt: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["cartId"],
      where: { ...rangeWhere, type: "purchase", ...QUALITY_FILTER, cartId: { not: "" } },
      _min: { createdAt: true },
    }),
  ]);

  const beginMap = new Map<string, Date>();
  for (const b of beginByCart) if (b.cartId && b._min.createdAt) beginMap.set(b.cartId, b._min.createdAt);

  const payDurations: number[] = [];
  for (const p of purchaseByCart) {
    if (!p.cartId || !p._min.createdAt) continue;
    const t0 = beginMap.get(p.cartId);
    if (!t0) continue;
    const ms = p._min.createdAt.getTime() - t0.getTime();
    if (ms > 0 && ms < 1000 * 60 * 60 * 2) payDurations.push(ms);
  }

  const avgPaymentMs = payDurations.length ? Math.round(payDurations.reduce((a, b) => a + b, 0) / payDurations.length) : null;

  // --- Top pagine + tempo medio (normalizzato shop) ---
  const [topPages, avgDurations] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 50,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { ...rangeWhere, type: "page_leave", durationMs: { not: null }, ...SITE_ONLY, ...QUALITY_FILTER },
      _avg: { durationMs: true },
    }),
  ]);

  const durationAgg = new Map<string, { sum: number; n: number }>();
  for (const a of avgDurations) {
    if (!a.path || !a._avg.durationMs) continue;
    const base = normalizeForDuration(a.path);
    const cur = durationAgg.get(base) ?? { sum: 0, n: 0 };
    cur.sum += a._avg.durationMs;
    cur.n += 1;
    durationAgg.set(base, cur);
  }
  const avgByPath: Record<string, number> = {};
  for (const [base, v] of durationAgg.entries()) avgByPath[base] = Math.round(v.sum / v.n);

  // --- Prodotti visti (variante + totale) ---
  const [topVariantViews, topProductViews] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["productKey", "variantKey"],
      where: { ...rangeWhere, type: "product_view", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 50,
    }),
    
    prisma.analyticsEvent.groupBy({
      by: ["productKey"],
      where: { ...rangeWhere, type: "product_view", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 50,
    }),
  ]);

    // --- Nuove metriche (v3) ---
  const [
    listViews,
    productClicks,
    checkoutClicks,
    cartsCheckoutClicked,
    addToCartByVariant,
    addToCartTotal,
    variantSelections,
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { ...rangeWhere, type: "view_item_list", ...QUALITY_FILTER },
    }),
    prisma.analyticsEvent.count({
      where: { ...rangeWhere, type: "product_click", ...QUALITY_FILTER },
    }),
    prisma.analyticsEvent.count({
      where: { ...rangeWhere, type: "checkout_click", ...QUALITY_FILTER },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["cartId"],
      where: { ...rangeWhere, type: "checkout_click", ...QUALITY_FILTER, cartId: { not: "" } },
      _count: { cartId: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productKey", "variantKey"],
      where: { ...rangeWhere, type: "add_to_cart", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 50,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productKey"],
      where: { ...rangeWhere, type: "add_to_cart", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 50,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productKey", "variantKey"],
      where: { ...rangeWhere, type: "select_variant", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 50,
    }),
  ]);

  const listCtr = listViews > 0 ? productClicks / listViews : 0;
  const cartsCheckoutClickedN = cartsCheckoutClicked.length;
  const checkoutClickRate = cartTotalN > 0 ? cartsCheckoutClickedN / cartTotalN : 0;


  // --- Device metrics (business) ---
  const [
    pageViewsByDevice,
    visitorsByDevicePairs,
    sessionsByDevicePairs,
    purchasesByDeviceCartPairs,
    beginByDeviceCart,
    purchaseByDeviceCart2,
  ] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["device"],
      where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER },
      _count: { device: true },
      orderBy: { _count: { device: "desc" } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["device", "visitorId"],
      where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER, visitorId: { not: "" } },
      _count: { visitorId: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["device", "sessionId"],
      where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER, sessionId: { not: "" } },
      _count: { sessionId: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["device", "cartId"],
      where: { ...rangeWhere, type: "purchase", ...QUALITY_FILTER, cartId: { not: "" } },
      _count: { cartId: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["device", "cartId"],
      where: { ...rangeWhere, type: "begin_checkout", ...QUALITY_FILTER, cartId: { not: "" } },
      _min: { createdAt: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["device", "cartId"],
      where: { ...rangeWhere, type: "purchase", ...QUALITY_FILTER, cartId: { not: "" } },
      _min: { createdAt: true },
    }),
  ]);

  const devicePageviews = new Map<string, number>();
  for (const d of pageViewsByDevice) devicePageviews.set(d.device ?? "unknown", d._count.device);

  const deviceVisitors = new Map<string, number>();
  for (const row of visitorsByDevicePairs) {
    const key = row.device ?? "unknown";
    deviceVisitors.set(key, (deviceVisitors.get(key) ?? 0) + 1);
  }

  const deviceSessions = new Map<string, number>();
  for (const row of sessionsByDevicePairs) {
    const key = row.device ?? "unknown";
    deviceSessions.set(key, (deviceSessions.get(key) ?? 0) + 1);
  }

  const devicePurchases = new Map<string, number>();
  for (const row of purchasesByDeviceCartPairs) {
    const key = row.device ?? "unknown";
    devicePurchases.set(key, (devicePurchases.get(key) ?? 0) + 1);
  }

  const beginDCMap = new Map<string, Date>();
  for (const b of beginByDeviceCart) {
    const dev = b.device ?? "unknown";
    const cart = b.cartId ?? "";
    if (!cart || !b._min.createdAt) continue;
    beginDCMap.set(`${dev}__${cart}`, b._min.createdAt);
  }

  const devicePayAgg = new Map<string, { sum: number; n: number }>();
  for (const p of purchaseByDeviceCart2) {
    const dev = p.device ?? "unknown";
    const cart = p.cartId ?? "";
    if (!cart || !p._min.createdAt) continue;
    const t0 = beginDCMap.get(`${dev}__${cart}`);
    if (!t0) continue;
    const ms = p._min.createdAt.getTime() - t0.getTime();
    if (ms <= 0 || ms >= 1000 * 60 * 60 * 2) continue;
    const cur = devicePayAgg.get(dev) ?? { sum: 0, n: 0 };
    cur.sum += ms;
    cur.n += 1;
    devicePayAgg.set(dev, cur);
  }

  const deviceAvgPayMs = new Map<string, number>();
  for (const [dev, v] of devicePayAgg.entries()) deviceAvgPayMs.set(dev, Math.round(v.sum / v.n));

  const devices = Array.from(new Set([...devicePageviews.keys(), ...deviceVisitors.keys(), ...deviceSessions.keys(), ...devicePurchases.keys()]));
  devices.sort((a, b) => (devicePageviews.get(b) ?? 0) - (devicePageviews.get(a) ?? 0));

  const deviceRows = devices.map((dev) => {
    const pv = devicePageviews.get(dev) ?? 0;
    const vs = deviceVisitors.get(dev) ?? 0;
    const ss = deviceSessions.get(dev) ?? 0;
    const purchases = devicePurchases.get(dev) ?? 0;
    const pagesPerSession = ss > 0 ? +(pv / ss).toFixed(3) : 0;
    const conv = vs > 0 ? +(purchases / vs).toFixed(6) : 0;
    return {
      device: dev,
      pageviews: pv,
      uniqueVisitors: vs,
      sessions: ss,
      pagesPerSession,
      purchases,
      conversion: conv,
      conversionPct: vs > 0 ? pct(purchases / vs) : 0,
      avgPaymentMs: deviceAvgPayMs.get(dev) ?? null,
      avgPaymentSamples: devicePayAgg.get(dev)?.n ?? 0,
    };
  });

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      period: { startISO, endISO, endExclusiveISO: toISODate(endExclusive) },
      quality: {
        includeInternal,
        filterApplied: includeInternal ? "none" : "env=prod & isInternal=false",
      },
      filters: {
        siteOnlyExcludedPrefixes: ["/checkout", "/payment", "/payments", "/stripe", "/api", "/_next", "/admin"],
        shopDurationNormalized: "For /shop/* the duration is aggregated ignoring query string (?v=...)",
      },
      version: "metrics-export-v3",
    },

    kpis: {
      uniqueVisitors,
      uniqueSessions,
      pageViews,
      pageLeaves,
      avgPagesPerSession,
      conversionAnalytics,
      conversionAnalyticsPct: pct(conversionAnalytics),
      listViews,
      productClicks,
      listCtr,
      listCtrPct: pct(listCtr),
      checkoutClicks,
      cartsCheckoutClicked: cartsCheckoutClickedN,
      checkoutClickRate,
      checkoutClickRatePct: pct(checkoutClickRate),
    },

    funnel: {
      cartsTotal: cartTotalN,
      cartsPaid: cartPaidN,
      cartsAbandoned: cartAbandonedN,
      abandonedRate,
      abandonedRatePct: pct(abandonedRate),
      avgPaymentMs,
      avgPaymentSamples: payDurations.length,
    },

    devices: { rows: deviceRows },

    top: {
      pages: topPages.map((p) => ({
        path: p.path ?? "",
        views: p._count.path,
        avgDurationMsProductNormalized: avgByPath[normalizeForDuration(p.path ?? "")] ?? null,
      })),
      productViewsByVariant: topVariantViews.map((r) => ({
        productKey: r.productKey ?? "",
        variantKey: r.variantKey ?? null,
        views: r._count.productKey,
      })),
      productViewsTotal: topProductViews.map((r) => ({
        productKey: r.productKey ?? "",
        views: r._count.productKey,
      })),
      addToCartByVariant: addToCartByVariant.map((r) => ({
        productKey: r.productKey ?? "",
        variantKey: r.variantKey ?? null,
        adds: r._count.productKey,
      })),
      addToCartTotal: addToCartTotal.map((r) => ({
        productKey: r.productKey ?? "",
        adds: r._count.productKey,
      })),
      variantSelections: variantSelections.map((r) => ({
        productKey: r.productKey ?? "",
        variantKey: r.variantKey ?? null,
        selections: r._count.productKey,
      })),
    },

    definitions: {
      "meta.quality.includeInternal": "Se true include eventi interni/dev; se false filtra env=prod e isInternal=false.",
      "kpis.uniqueVisitors": "Numero di visitorId distinti che hanno generato almeno un page_view nel periodo (solo pagine sito, esclusi checkout/pagamenti/tecniche; con quality filter).",
      "kpis.uniqueSessions": "Numero di sessionId distinti che hanno generato almeno un page_view nel periodo (cookie s_id con scadenza ~30 min sliding; con quality filter).",
      "kpis.pageViews": "Conteggio totale eventi page_view nel periodo (solo pagine sito; con quality filter).",
      "kpis.pageLeaves": "Conteggio totale eventi page_leave nel periodo (solo pagine sito; con quality filter).",
      "kpis.avgPagesPerSession": "pageViews / uniqueSessions.",
      "kpis.conversionAnalytics": "cartsPaid / uniqueVisitors (tutto analytics, coerente e robusto).",
      "funnel.cartsTotal": "Numero di carrelli distinti (cartId) che hanno avuto add_to_cart o begin_checkout nel periodo.",
      "funnel.cartsPaid": "Numero di carrelli distinti (cartId) con evento purchase nel periodo.",
      "funnel.avgPaymentMs": "Media (purchase.createdAt - begin_checkout.createdAt) per cartId, outlier >2h esclusi.",
      "devices.rows[].uniqueVisitors": "Distinct visitorId per device (basato su page_view).",
      "devices.rows[].sessions": "Distinct sessionId per device (basato su page_view).",
      "devices.rows[].pagesPerSession": "pageviews / sessions per device.",
      "devices.rows[].purchases": "Numero di cartId distinti con purchase per device.",
      "devices.rows[].conversion": "purchases / uniqueVisitors per device.",
      "devices.rows[].avgPaymentMs": "Media (purchase - begin_checkout) per (device, cartId).",
      "top.pages[].avgDurationMsProductNormalized": "Tempo medio da page_leave.durationMs; per /shop/* aggrega ignorando ?v= (tutte le varianti).",
      "top.productViewsByVariant": "Ranking view prodotto per variante, da evento product_view su (productKey, variantKey).",
      "top.productViewsTotal": "Ranking view prodotto aggregate (somma varianti), da evento product_view su productKey.",
      "kpis.listViews": "Conteggio eventi view_item_list nel periodo.",
      "kpis.productClicks": "Conteggio eventi product_click nel periodo.",
      "kpis.listCtr": "productClicks / listViews.",
      "kpis.checkoutClicks": "Conteggio eventi checkout_click nel periodo.",
      "kpis.cartsCheckoutClicked": "Numero di cartId distinti che hanno checkout_click.",
      "kpis.checkoutClickRate": "cartsCheckoutClicked / cartsTotal.",
      "top.addToCartByVariant": "Ranking add_to_cart per (productKey, variantKey).",
      "top.addToCartTotal": "Ranking add_to_cart per productKey (somma varianti).",
      "top.variantSelections": "Ranking select_variant per (productKey, variantKey).",
    },
  };

  const filename = `metrics_${startISO}_to_${endISO}${includeInternal ? "_inclInternal" : ""}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
