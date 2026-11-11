import { SITE_ANALYTICS_FILTER } from "@/lib/server/analyticsFilters";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { readCommerceInsights } from "@/lib/server/commerceInsights";
import { readCustomerMetrics } from "@/lib/server/customerMetrics";
import {
  metricsPeriod,
  readSalesMetrics,
  salesConversion,
  summarizeCartDemand,
} from "@/lib/server/salesMetrics";

export const dynamic = "force-dynamic";

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function normalizeForDuration(path: string) {
  if (/^\/(?:[a-z]{2}\/)?shop\//.test(path)) {
    const q = path.indexOf("?");
    return q >= 0 ? path.slice(0, q) : path;
  }
  return path;
}

function pct(n: number | null) {
  return n === null ? null : +(n * 100).toFixed(2);
}

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;
  const { searchParams } = new URL(req.url);

  const startParam = getOne(searchParams.get("start") ?? undefined);
  const endParam = getOne(searchParams.get("end") ?? undefined);
  const internalRaw = (searchParams.get("internal") ?? "").toLowerCase();
  const includeInternal = internalRaw === "1" || internalRaw === "true" || internalRaw === "yes" || internalRaw === "on";


  const { start, endExclusive, startISO, endISO, endExclusiveISO } = metricsPeriod(startParam, endParam);

  const rangeWhere = { createdAt: { gte: start, lt: endExclusive } };

  const SITE_ONLY = SITE_ANALYTICS_FILTER;

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
      _sum: { durationMs: true },
    _count: { durationMs: true },
    }),
  ]);

  const durationAgg = new Map<string, { sum: number; n: number }>();
  for (const a of avgDurations) {
    if (!a.path || !a._count.durationMs) continue;
    const base = normalizeForDuration(a.path);
    const cur = durationAgg.get(base) ?? { sum: 0, n: 0 };
    cur.sum += a._sum.durationMs ?? 0;
    cur.n += a._count.durationMs;
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

    // --- Nuove metriche (v3 + v4 commercial) ---
  const [
    listViews,
    productClicks,
    checkoutClicks,
    cartsCheckoutClicked,
    addToCartByVariant,
    addToCartTotal,
    variantSelections,
    contactClicksGroup,
    viewCartCount,
    sessionsWithAddToCartGroup,
    allAddToCartEvents,
    contactMessagesCount,
    tastingBookingsCount,
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
    prisma.analyticsEvent.groupBy({
      by: ["productKey"],
      where: { ...rangeWhere, type: "contact_click", ...QUALITY_FILTER },
      _count: { productKey: true },
    }),
    prisma.analyticsEvent.count({
      where: { ...rangeWhere, type: "view_cart", ...QUALITY_FILTER },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["sessionId"],
      where: { ...rangeWhere, type: "add_to_cart", ...QUALITY_FILTER, sessionId: { not: "" } },
      _count: { sessionId: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { ...rangeWhere, type: "add_to_cart", ...QUALITY_FILTER, productKey: { not: "" } },
      select: { productKey: true, variantKey: true, data: true, cartId: true },
    }),
    prisma.contactMessage.count({ where: rangeWhere }),
    prisma.tastingBooking.count({ where: rangeWhere }),
  ]);

  const listCtr = listViews > 0 ? productClicks / listViews : 0;
  const knownCarts = new Set(cartsTotal.map((row) => row.cartId));
  const cartsCheckoutClickedN = cartsCheckoutClicked.filter((row) => knownCarts.has(row.cartId)).length;
  const checkoutClickRate = cartTotalN > 0 ? cartsCheckoutClickedN / cartTotalN : 0;

  const contactMap = new Map<string, number>();
  for (const c of contactClicksGroup) {
    if (c.productKey) contactMap.set(c.productKey, c._count.productKey);
  }
  const contactClicksTotal = [...contactMap.values()].reduce((sum, n) => sum + n, 0);

  const measuredSessions = new Set(sessions.map((row) => row.sessionId));
  const sessionsWithAddToCartN = sessionsWithAddToCartGroup.filter((row) => measuredSessions.has(row.sessionId)).length;
  const sessionAddToCartRate = salesConversion(sessionsWithAddToCartN, uniqueSessions);

  const {
    litersDemandedTotal, litersOilDemanded, litersWineDemanded,
    cansUnits, bottlesUnits, cansPct, bottlesPct, unknownFormatUnits,
    potentialCartRevenueEur, avgCartValueEur, lostCartRevenueEur,
    cartsWithAdditions, unpricedUnits, addsByProduct,
  } = summarizeCartDemand(allAddToCartEvents);


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

  const [insights, customers] = await Promise.all([
    readCommerceInsights(prisma, start, endExclusive, includeInternal), readCustomerMetrics(prisma),
  ]);
  const payload = {
    insights,
    customers,
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
      version: "metrics-export-v5",
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
      sessionAddToCartRate,
      sessionAddToCartRatePct: pct(sessionAddToCartRate),
      sessionsWithAddToCart: sessionsWithAddToCartN,
      paidOrders: sales.paidOrders,
      checkoutsStarted: sales.startedCheckouts,
      unpaidCheckouts: sales.unpaidCheckouts,
      unpaidCheckoutRate: sales.unpaidCheckoutRate,
      unpaidCheckoutRatePct: pct(sales.unpaidCheckoutRate),
      avgPaymentMs,
      avgPaymentSamples: sales.paymentSamples,
      steps: {
        cartViewed: viewCartCount,
        checkoutClicked: checkoutClicks,
        checkoutsStarted: sales.startedCheckouts,
        paidOrders: sales.paidOrders,
      },
    },

    commercial: {
      realizedRevenueEur: sales.realizedRevenueEur,
      realizedAovEur: sales.realizedAovEur,
      potentialCheckoutRevenueEur: sales.potentialCheckoutRevenueEur,
      lostCheckoutRevenueEur: sales.lostCheckoutRevenueEur,
      potentialCartRevenueEur,
      lostCartRevenueEur,
      avgCartValueEur,
      cartsWithAdditions,
      unpricedUnits,
      litersDemandedTotal: +litersDemandedTotal.toFixed(2),
      litersOilDemanded: +litersOilDemanded.toFixed(2),
      litersWineDemanded: +litersWineDemanded.toFixed(2),
      formatDemand: {
        cansUnits,
        bottlesUnits,
        unknownFormatUnits,
        cansPct,
        bottlesPct,
      },
      bundleOlioVinoRatePct: sales.bundleOlioVinoRatePct,
      repeatCustomerRatePct: sales.repeatCustomerRatePct,
      uniquePayingCustomers: sales.uniquePayingCustomers,
      repeatPayingCustomers: sales.repeatPayingCustomers,
      newPayingCustomers: sales.newPayingCustomers,
      newRevenueEur: sales.newRevenueEur,
      repeatRevenueEur: sales.repeatRevenueEur,
      netGoodsRevenueEur: sales.netGoodsRevenueEur,
      estimatedContributionMarginEur: sales.estimatedContributionMarginEur,
    },

    leadsAndDirectSales: {
      whatsappClicks: contactMap.get("whatsapp") ?? 0,
      phoneClicks: contactMap.get("phone") ?? 0,
      emailClicks: contactMap.get("email") ?? 0,
      totalContactClicks: contactClicksTotal,
      contactMessagesCount,
      tastingBookingsCount,
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
      productCartToDetail: topProductViews.map((r) => {
        const pk = r.productKey ?? "";
        const views = r._count.productKey;
        const adds = addsByProduct.get(pk) ?? 0;
        const rate = views > 0 ? adds / views : 0;
        return {
          productKey: pk,
          views,
          adds,
          cartToDetailRate: +rate.toFixed(4),
          cartToDetailRatePct: pct(rate),
        };
      }),
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
      "commercial.realizedRevenueEur": "Fatturato complessivo incassato da ordini commerciali pagati nel periodo (in Euro).",
      "commercial.realizedAovEur": "Scontrino medio degli ordini pagati nel periodo (realizedRevenueEur / paidOrders).",
      "commercial.potentialCheckoutRevenueEur": "Valore totale degli ordini commerciali iniziati nel periodo.",
      "commercial.lostCheckoutRevenueEur": "Valore totale dei checkout iniziati nel periodo ma rimasti non pagati.",
      "commercial.potentialCartRevenueEur": "Somma prezzi registrati × quantità aggiunte nel periodo; null se mancano prezzi. Include successive rimozioni e aggiunte ripetute.",
      "commercial.lostCartRevenueEur": "Non disponibile: eventi add_to_cart e incassi non identificano la stessa coorte di carrelli.",
      "commercial.avgCartValueEur": "Valore lordo aggiunte / carrelli con aggiunte nel periodo; null senza carrelli o con prezzi mancanti. Non è il saldo del carrello.",
      "commercial.unpricedUnits": "Unità aggiunte senza un prezzo storico valido; rendono indisponibili valore e media delle aggiunte.",
      "commercial.formatDemand.unknownFormatUnits": "Unità con formato sconosciuto, incluse nel denominatore delle percentuali formato.",
      "commercial.litersDemandedTotal": "Litri totali di prodotto richiesti tramite aggiunta al carrello nel periodo.",
      "commercial.litersOilDemanded": "Litri di olio EVO richiesti a carrello.",
      "commercial.litersWineDemanded": "Litri di vino richiesti a carrello.",
      "commercial.formatDemand.cansPct": "Percentuale di unità richieste in formato latta, inclusa la 750ml.",
      "commercial.formatDemand.bottlesPct": "Percentuale di unità richieste in formato bottiglia, inclusa la 1L.",
      "commercial.bundleOlioVinoRatePct": "Percentuale di ordini pagati contenenti sia Olio che Vino (cross-selling).",
      "commercial.repeatCustomerRatePct": "Percentuale di clienti paganti identificati tramite email normalizzata con almeno 2 ordini pagati nello stesso periodo. Non misura il riordino storico.",
      "leadsAndDirectSales.whatsappClicks": "Click su link o pulsanti di contatto WhatsApp.",
      "leadsAndDirectSales.phoneClicks": "Click per chiamata telefonica al frantoio.",
      "leadsAndDirectSales.emailClicks": "Click per invio email diretta.",
      "leadsAndDirectSales.contactMessagesCount": "Richieste/messaggi di contatto ricevuti dal form del sito nel periodo.",
      "leadsAndDirectSales.tastingBookingsCount": "Prenotazioni di degustazione registrate nel periodo.",
      "funnel.cartsTotal": "Numero di carrelli distinti (cartId) che hanno avuto add_to_cart o begin_checkout nel periodo.",
      "funnel.sessionAddToCartRatePct": "Percentuale di sessioni con almeno un add_to_cart (sessionsWithAddToCart / uniqueSessions).",
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
      "top.productCartToDetail": "Tasso di conversione da visualizzazione prodotto ad add_to_cart per ciascun prodotto.",
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

  return guard.attach(new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  }));
}
