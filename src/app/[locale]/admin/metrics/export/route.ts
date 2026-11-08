import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { metricsPeriod, readSalesMetrics, salesConversion } from "@/lib/server/salesMetrics";

export const dynamic = "force-dynamic";

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function normalizeForDuration(path: string) {
  if (path.startsWith("/shop/")) {
    const q = path.indexOf("?");
    return q >= 0 ? path.slice(0, q) : path;
  }
  return path;
}

function pct(n: number | null) {
  return n === null ? null : +(n * 100).toFixed(2);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const startParam = getOne(searchParams.get("start") ?? undefined);
  const endParam = getOne(searchParams.get("end") ?? undefined);
  const internalRaw = (searchParams.get("internal") ?? "").toLowerCase();
const includeInternal = internalRaw === "1" || internalRaw === "true" || internalRaw === "yes" || internalRaw === "on";


  const { start, endExclusive, startISO, endISO, endExclusiveISO } = metricsPeriod(startParam, endParam);

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

  // Visits come from the tracker; confirmed sales come exclusively from orders.
  const [cartsTotal, sales] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["cartId"],
      where: { ...rangeWhere, type: { in: ["add_to_cart", "begin_checkout"] }, ...QUALITY_FILTER, cartId: { not: "" } },
      _count: { cartId: true },
    }),
    readSalesMetrics(prisma, start, endExclusive),
  ]);
  const cartTotalN = cartsTotal.length;
  const conversionAnalytics = salesConversion(sales.paidOrders, uniqueSessions);
  const avgPaymentMs = sales.avgPaymentMs;

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

  const devicePurchases = new Map(sales.devices.map((row) => [row.device, row.purchases]));
  const deviceAvgPayMs = new Map(sales.devices.map((row) => [row.device, row.avgPaymentMs]));
  const deviceSamples = new Map(sales.devices.map((row) => [row.device, row.paymentSamples]));

  const devices = Array.from(new Set([...devicePageviews.keys(), ...deviceVisitors.keys(), ...deviceSessions.keys(), ...devicePurchases.keys()]));
  devices.sort((a, b) => (devicePageviews.get(b) ?? 0) - (devicePageviews.get(a) ?? 0));

  const deviceRows = devices.map((dev) => {
    const pv = devicePageviews.get(dev) ?? 0;
    const vs = deviceVisitors.get(dev) ?? 0;
    const ss = deviceSessions.get(dev) ?? 0;
    const purchases = devicePurchases.get(dev) ?? 0;
    const pagesPerSession = ss > 0 ? +(pv / ss).toFixed(3) : 0;
    const conv = salesConversion(purchases, ss);
    return {
      device: dev,
      pageviews: pv,
      uniqueVisitors: vs,
      sessions: ss,
      pagesPerSession,
      purchases,
      conversion: conv,
      conversionPct: pct(conv),
      avgPaymentMs: deviceAvgPayMs.get(dev) ?? null,
      avgPaymentSamples: deviceSamples.get(dev) ?? 0,
    };
  });

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      period: { startISO, endISO, endExclusiveISO },
      quality: {
        includeInternal,
        filterApplied: includeInternal ? "none" : "env=prod & isInternal=false",
      },
      filters: {
        siteOnlyExcludedPrefixes: ["/checkout", "/payment", "/payments", "/stripe", "/api", "/_next", "/admin"],
        shopDurationNormalized: "For /shop/* the duration is aggregated ignoring query string (?v=...)",
      },
      version: "metrics-export-v4",
      salesSource: "Order.paidAt",
      conversionDenominator: "uniqueSessions",
    },

    kpis: {
      uniqueVisitors,
      uniqueSessions,
      pageViews,
      pageLeaves,
      avgPagesPerSession,
      paidOrders: sales.paidOrders,
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
      paidOrders: sales.paidOrders,
      checkoutsStarted: sales.startedCheckouts,
      unpaidCheckouts: sales.unpaidCheckouts,
      unpaidCheckoutRate: sales.unpaidCheckoutRate,
      unpaidCheckoutRatePct: pct(sales.unpaidCheckoutRate),
      avgPaymentMs,
      avgPaymentSamples: sales.paymentSamples,
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
      "kpis.paidOrders": "Ordini commerciali con paidAt nel periodo; ogni ordine conta una volta, indipendentemente da cookie, cartId e pagina di ritorno. I rimborsi successivi non cancellano il pagamento storico.",
      "kpis.conversionAnalytics": "paidOrders / uniqueSessions, oppure null se mancano visite misurate. Nessun evento purchase browser richiesto.",
      "funnel.cartsTotal": "Numero di carrelli distinti (cartId) che hanno avuto add_to_cart o begin_checkout nel periodo.",
      "funnel.paidOrders": "Ordini commerciali pagati nel periodo, da Order.paidAt.",
      "funnel.unpaidCheckouts": "Ordini commerciali creati nel periodo e attualmente privi di paidAt; include checkout ancora in corso, non equivale ad abbandoni definitivi.",
      "funnel.unpaidCheckoutRate": "unpaidCheckouts / checkoutsStarted, oppure null senza checkout. I carrelli tracciati sono separati dagli ordini.",
      "funnel.avgPaymentMs": "Media (Order.paidAt - Order.createdAt) degli ordini commerciali pagati nel periodo, inclusi pagamenti differiti.",
      "devices.rows[].uniqueVisitors": "Distinct visitorId per device (basato su page_view).",
      "devices.rows[].sessions": "Distinct sessionId per device (basato su page_view).",
      "devices.rows[].pagesPerSession": "pageviews / sessions per device.",
      "devices.rows[].purchases": "Ordini commerciali pagati, classificati tramite userAgent salvato sull ordine; unknown se assente/non classificabile.",
      "devices.rows[].conversion": "purchases / sessions per device; null se mancano sessioni misurate. Non richiede il ritorno dopo il pagamento.",
      "devices.rows[].avgPaymentMs": "Media (Order.paidAt - Order.createdAt) per dispositivo dell ordine.",
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
