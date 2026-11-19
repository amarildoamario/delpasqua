import { SITE_ANALYTICS_FILTER } from "@/lib/server/analyticsFilters";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { readCommerceInsights } from "@/lib/server/commerceInsights";
import { readCustomerMetrics } from "@/lib/server/customerMetrics";
import {
  canonicalizeSitePath,
  computeHistoricalCustomerRetention,
} from "@/lib/server/metricsAnalyticsV6";
import {
  describePeriodWindow,
  ADMIN_REPORT_LOOKBACK_DAYS,
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


  const period = metricsPeriod(startParam, endParam, new Date(), ADMIN_REPORT_LOOKBACK_DAYS);
  const { start, endExclusive, startISO, endISO } = period;
  const periodMeta = describePeriodWindow(period);

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
  const avgPagesPerSession = uniqueSessions > 0 ? pageViews / uniqueSessions : null;

  // --- Device metrics (business) ---
  const [
    pageViewsByDevice,
    visitorsByDevicePairs,
    sessionsByDevicePairs,
    cartsTotal,
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
      by: ["cartId"],
      where: { ...rangeWhere, type: { in: ["add_to_cart", "begin_checkout"] }, ...QUALITY_FILTER, cartId: { not: "" } },
      _count: { cartId: true },
    }),
  ]);

  const seenDeviceSessions = new Set<string>();
  const sessionDeviceMap = new Map<string, string>();
  const deviceSessions = new Map<string, number>();
  for (const row of sessionsByDevicePairs) {
    if (row.sessionId && seenDeviceSessions.has(row.sessionId)) continue;
    if (row.sessionId) seenDeviceSessions.add(row.sessionId);
    const key = row.device ?? "unknown";
    if (row.sessionId) sessionDeviceMap.set(row.sessionId, key);
    deviceSessions.set(key, (deviceSessions.get(key) ?? 0) + 1);
  }

  // Visits come from the tracker; confirmed sales come exclusively from orders.
  const sales = await readSalesMetrics(prisma, start, endExclusive, sessionDeviceMap);
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

  const listCtr = listViews > 0 ? productClicks / listViews : null;
  const knownCarts = new Set(cartsTotal.map((row) => row.cartId));
  const cartsCheckoutClickedN = cartsCheckoutClicked.filter((row) => knownCarts.has(row.cartId)).length;
  const checkoutClickRate = cartTotalN > 0 ? cartsCheckoutClickedN / cartTotalN : null;

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
    cansUnits, bottlesUnits, cansPct, bottlesPct, unknownFormatPct, unknownFormatUnits,
    potentialCartRevenueEur, avgCartValueEur, lostCartRevenueEur,
    cartsWithAdditions, unpricedUnits, addsByProduct,
  } = summarizeCartDemand(allAddToCartEvents);

  const devicePageviews = new Map<string, number>();
  for (const d of pageViewsByDevice) devicePageviews.set(d.device ?? "unknown", d._count.device);

  const seenDeviceVisitors = new Set<string>();
  const deviceVisitors = new Map<string, number>();
  for (const row of visitorsByDevicePairs) {
    if (row.visitorId && seenDeviceVisitors.has(row.visitorId)) continue;
    if (row.visitorId) seenDeviceVisitors.add(row.visitorId);
    const key = row.device ?? "unknown";
    deviceVisitors.set(key, (deviceVisitors.get(key) ?? 0) + 1);
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
    const pagesPerSession = ss > 0 ? +(pv / ss).toFixed(3) : null;
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
  const historicalRetention = computeHistoricalCustomerRetention(
    sales.paidOrdersMeta,
    customers.rows,
    start,
  );
  const canonicalAgg = new Map<string, { canonicalPath: string; pageCategory: string; views: number; durationSum: number; durationSamples: number }>();
  for (const p of topPages) {
    const raw = p.path ?? "";
    const { canonicalPath, pageCategory } = canonicalizeSitePath(raw);
    const base = normalizeForDuration(raw);
    const dur = durationAgg.get(base);
    const cur = canonicalAgg.get(canonicalPath) ?? {
      canonicalPath,
      pageCategory,
      views: 0,
      durationSum: 0,
      durationSamples: 0,
    };
    cur.views += p._count.path;
    if (dur) {
      cur.durationSum += dur.sum;
      cur.durationSamples += dur.n;
    }
    canonicalAgg.set(canonicalPath, cur);
  }
  const canonicalPages = [...canonicalAgg.values()]
    .map((c) => ({
      canonicalPath: c.canonicalPath,
      pageCategory: c.pageCategory,
      views: c.views,
      avgDurationMs: c.durationSamples > 0 ? Math.round(c.durationSum / c.durationSamples) : null,
      durationSamples: c.durationSamples,
    }))
    .sort((a, b) => b.views - a.views);

  const prodFunnelByKey = new Map(insights.productFunnel.map((r) => [r.productKey, r]));
  const varFunnelByKey = new Map(insights.variantFunnel.map((r) => [`${r.productKey}::${r.variantKey}`, r]));

  const payload = {
    insights,
    customers: {
      ...customers,
      historicalReturningCustomers: historicalRetention.historicalReturningCustomers,
      historicalFirstTimeCustomers: historicalRetention.historicalFirstTimeCustomers,
      historicalReturningCustomerRate: historicalRetention.historicalReturningCustomerRate,
      historicalReturningCustomerRatePct: historicalRetention.historicalReturningCustomerRatePct,
    },
    meta: {
      schemaVersion: "metrics-export-v6",
      version: "metrics-export-v6",
      legacyVersionAlias: "metrics-export-v5",
      timeZone: "Europe/Rome",
      generatedAt: periodMeta.observedThrough,
      period: periodMeta,
      sessionCohort: "sessions_with_site_page_view_in_period",
      dailySessionAssignment: "local_session_start_date",
      quality: {
        includeInternal,
        filterApplied: includeInternal ? "none" : "env=prod & isInternal=false",
      },
      filters: {
        siteOnlyExcludedPrefixes: ["/checkout", "/payment", "/payments", "/stripe", "/api", "/_next", "/admin"],
        shopDurationNormalized: "For /shop/* the duration is aggregated ignoring query string (?v=...)",
        testOrderPolicy: "excluded_where_isTest_true",
        quoteOrderPolicy: "included_in_commercial_totals_and_separated_in_quotePaidOrders",
      },
      salesSource: "Order.paidAt",
      conversionDenominator: "uniqueSessions",
    },

    quality: {
      paidOrdersWithSession: insights.orderAttribution.ordersWithSession,
      paidOrdersWithoutSession: insights.orderAttribution.ordersWithoutSession,
      storefrontPaidOrders: sales.storefrontPaidOrders,
      quotePaidOrders: sales.quotePaidOrders,
      sourceAttributionCoverage: insights.orderAttribution.sourceCoverage,
      deviceAttributionCoverage: insights.orderAttribution.deviceCoverage,
      unpricedCartUnits: unpricedUnits,
      isPartialPeriod: periodMeta.isPartial,
      warnings: [
        ...(periodMeta.isPartial ? [`Periodo parziale: la data finale ${periodMeta.endDateInclusive} è ancora in corso (osservato fino a ${periodMeta.observedThrough}).`] : []),
        ...(sales.quotePaidOrders > 0 ? [`Presenti ${sales.quotePaidOrders} ordini pagati da Preventivo PDF (/preventivo/[token]): saltano il carrello dello shop e il redirect diretto a Stripe può non avere sessione browser.`] : []),
        ...(sales.paidOrders > 0 && sales.paidOrders < 5 ? [`Campione ordini ridotto (${sales.paidOrders}): non interpretare scontrino medio e tassi di conversione come stime stabili.`] : []),
      ],
    },

    series: {
      daily: insights.daily,
      dailyDefinition: "Sessioni assegnate alla data locale di inizio (Europe/Rome); vendite assegnate alla data locale di Order.paidAt; stato parziale esplicito.",
    },

    sessionFunnel: insights.sessionFunnel,
    cartFunnel: insights.cartFunnel,
    checkoutCohort: insights.checkoutCohort,
    productFunnel: insights.productFunnel,
    variantFunnel: insights.variantFunnel,
    forecasts: insights.forecasts,

    metrics: {
      sessionPurchaseRate: {
        value: insights.sessionFunnel.purchaseRate,
        unit: "ratio",
        countingEntity: "session",
        numerator: insights.sessionFunnel.purchasingSessions,
        denominator: insights.sessionFunnel.sessions,
        numeratorDefinition: "Sessioni della coorte con almeno un ordine pagato collegato tramite ANALYTICS_CONTEXT o evento purchase",
        denominatorDefinition: "Sessioni con almeno un page_view sul sito nel periodo",
        label: "Sessioni con acquisto (coorte)",
        description: "Percentuale delle sessioni della coorte con un acquisto collegato. Una sessione con più ordini conta una sola volta.",
        formula: "sessionFunnel.purchasingSessions / sessionFunnel.sessions",
        source: "session_records_joined_to_server_orders",
        status: insights.sessionFunnel.sessions === 0
          ? "zero_denominator"
          : insights.orderAttribution.ordersWithoutSession > 0
            ? "incomplete_attribution"
            : "available",
      },
      paidOrdersToObservedSessionsRatio: {
        value: conversionAnalytics,
        unit: "orders_per_session",
        countingEntity: "order_over_session",
        numerator: sales.paidOrders,
        denominator: uniqueSessions,
        label: "Ordini pagati / sessioni osservate",
        description: "Rapporto commerciale fra ordini pagati nel periodo (inclusi preventivi PDF) e sessioni osservate nel periodo; può includere popolazioni non collegate.",
        formula: "kpis.paidOrders / kpis.uniqueSessions",
        source: "server_orders_over_site_sessions",
        status: uniqueSessions === 0 ? "zero_denominator" : "available",
      },
    },

    migrationMap: {
      "kpis.conversionAnalytics": {
        retainedForCompatibility: true,
        clarifiedLabel: "Ordini pagati / sessioni osservate",
        recommendedCohortMetric: "sessionFunnel.purchaseRate",
      },
      "kpis.listCtr": {
        retainedForCompatibility: true,
        clarifiedLabel: "Rapporto clic / visualizzazioni lista (eventi)",
        note: "Rapporto tra eventi product_click e view_item_list; può superare 100%.",
      },
      "commercial.avgCartValueEur": {
        retainedForCompatibility: true,
        clarifiedLabel: "Valore lordo aggiunte per carrello",
        note: "Media delle aggiunte lorde su carrelli con add_to_cart; non è il saldo finale del carrello.",
      },
      "commercial.repeatCustomerRatePct": {
        retainedForCompatibility: true,
        clarifiedLabel: "Clienti con più acquisti nel periodo (%)",
        recommendedHistoricalMetric: "commercial.historicalReturningCustomerRatePct",
      },
    },

    kpis: {
      uniqueVisitors,
      uniqueSessions,
      pageViews,
      pageLeaves,
      avgPagesPerSession,
      paidOrders: sales.paidOrders,
      storefrontPaidOrders: sales.storefrontPaidOrders,
      quotePaidOrders: sales.quotePaidOrders,
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
      storefrontPaidOrders: sales.storefrontPaidOrders,
      quotePaidOrders: sales.quotePaidOrders,
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
        unknownFormatPct,
      },
      bundleOlioVinoRatePct: sales.bundleOlioVinoRatePct,
      repeatCustomerRatePct: sales.repeatCustomerRatePct,
      uniquePayingCustomers: sales.uniquePayingCustomers,
      repeatPayingCustomers: sales.repeatPayingCustomers,
      newPayingCustomers: sales.newPayingCustomers,
      newRevenueEur: sales.newRevenueEur,
      repeatRevenueEur: sales.repeatRevenueEur,
      historicalReturningCustomers: historicalRetention.historicalReturningCustomers,
      historicalFirstTimeCustomers: historicalRetention.historicalFirstTimeCustomers,
      historicalReturningCustomerRate: historicalRetention.historicalReturningCustomerRate,
      historicalReturningCustomerRatePct: historicalRetention.historicalReturningCustomerRatePct,
      historicalReturningRevenueEur: historicalRetention.historicalReturningRevenueEur,
      historicalFirstTimeRevenueEur: historicalRetention.historicalFirstTimeRevenueEur,
      netGoodsRevenueEur: sales.netGoodsRevenueEur,
      estimatedContributionMarginEur: sales.estimatedContributionMarginEur,
    },

    leadsAndDirectSales: {
      whatsappClicks: contactMap.get("whatsapp") ?? 0,
      phoneClicks: contactMap.get("phone") ?? 0,
      emailClicks: contactMap.get("email") ?? 0,
      totalContactClicks: contactClicksTotal,
      sessionsWithContactClick: insights.contactsSummary.sessionsWithContactClick,
      contactSessionRate: insights.contactsSummary.contactSessionRate,
      contactSessionRatePct: pct(insights.contactsSummary.contactSessionRate),
      contactMessagesCount,
      tastingBookingsCount,
    },

    devices: { rows: deviceRows },

    top: {
      pages: topPages.map((p) => {
        const raw = p.path ?? "";
        const base = normalizeForDuration(raw);
        const { canonicalPath, locale, pageCategory } = canonicalizeSitePath(raw);
        return {
          path: raw,
          canonicalPath,
          locale,
          pageCategory,
          views: p._count.path,
          avgDurationMsProductNormalized: avgByPath[base] ?? null,
          durationSamplesProductNormalized: durationAgg.get(base)?.n ?? 0,
        };
      }),
      canonicalPages,
      productViewsByVariant: topVariantViews.map((r) => {
        const pk = r.productKey ?? "";
        const vk = r.variantKey ?? "default";
        const vf = varFunnelByKey.get(`${pk}::${vk}`);
        return {
          productKey: pk,
          variantKey: r.variantKey ?? null,
          views: r._count.productKey,
          uniqueSessions: vf?.viewSessions ?? null,
        };
      }),
      productViewsTotal: topProductViews.map((r) => {
        const pk = r.productKey ?? "";
        const pf = prodFunnelByKey.get(pk);
        return {
          productKey: pk,
          views: r._count.productKey,
          uniqueSessions: pf?.viewSessions ?? null,
        };
      }),
      productCartToDetail: topProductViews.map((r) => {
        const pk = r.productKey ?? "";
        const views = r._count.productKey;
        const adds = addsByProduct.get(pk) ?? 0;
        const rate = views > 0 ? +(adds / views).toFixed(4) : null;
        const pf = prodFunnelByKey.get(pk);
        return {
          productKey: pk,
          views,
          adds,
          addedUnits: pf?.addedUnits ?? null,
          viewSessions: pf?.viewSessions ?? null,
          addSessions: pf?.addSessions ?? null,
          viewThenAddSessions: pf?.viewThenAddSessions ?? null,
          cartToDetailRate: rate,
          cartToDetailRatePct: pct(rate),
          sessionProductToCartRate: pf?.productToCartRate ?? null,
          sessionProductToCartRatePct: pct(pf?.productToCartRate ?? null),
        };
      }),
      addToCartByVariant: addToCartByVariant.map((r) => {
        const pk = r.productKey ?? "";
        const vk = r.variantKey ?? "default";
        const vf = varFunnelByKey.get(`${pk}::${vk}`);
        return {
          productKey: pk,
          variantKey: r.variantKey ?? null,
          adds: r._count.productKey,
          addedUnits: vf?.addedUnits ?? null,
          uniqueSessions: vf?.addSessions ?? null,
        };
      }),
      addToCartTotal: addToCartTotal.map((r) => {
        const pk = r.productKey ?? "";
        const pf = prodFunnelByKey.get(pk);
        return {
          productKey: pk,
          adds: r._count.productKey,
          addedUnits: pf?.addedUnits ?? null,
          uniqueSessions: pf?.addSessions ?? null,
        };
      }),
      variantSelections: variantSelections.map((r) => {
        const pk = r.productKey ?? "";
        const vk = r.variantKey ?? "default";
        const vf = varFunnelByKey.get(`${pk}::${vk}`);
        return {
          productKey: pk,
          variantKey: r.variantKey ?? null,
          selections: r._count.productKey,
          uniqueSessions: vf?.selectionSessions ?? null,
          selectionThenAddSessions: vf?.selectionThenAddSessions ?? null,
          selectionToCartRate: vf?.selectionToCartRate ?? null,
          selectionToCartRatePct: pct(vf?.selectionToCartRate ?? null),
        };
      }),
    },

    definitions: {
      "insights.blogProductCards.introductionDate": "Data di introduzione delle card prodotto nel progetto. Giorno di calendario in Europe/Rome.",
      "insights.blogProductCards.periods": "Il confronto include tutti gli articoli del blog in tutte le lingue. Ogni sessione è assegnata alla prima visita a un articolo nel periodo selezionato. Il tasso è la quota con una successiva vista prodotto nella stessa sessione e nel periodo selezionato. Il giorno della modifica è riportato separatamente.",
      "insights.blogProductCards.clicksByPosition": "Clic diretti sulle card di tutti gli articoli nel periodo selezionato, raggruppati per posizione. Una sessione può generare più clic.",
      "insights.blogProductCards.totalClicks": "Somma dei clic diretti sulle card di tutti gli articoli nel periodo selezionato.",
      "insights.blogProductCards.articles": "Tutti gli articoli del blog con i clic diretti nel periodo selezionato, sommati tra le edizioni linguistiche.",
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
