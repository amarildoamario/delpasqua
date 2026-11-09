export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { readCatalog } from "@/lib/server/catalog";
import { getStoreSettings } from "@/lib/server/settings";
import { metricsMonthKey, metricsMonthWindow, metricsPeriod } from "@/lib/server/salesMetrics";
import { getAnalyticsCountryCode, summarizeTrafficGeography } from "@/lib/server/trafficGeography";
import { SITE_ANALYTICS_FILTER } from "@/lib/server/analyticsFilters";

function deriveVatCents(order: { vatCents: number; subtotalCents: number }, vatRatePercent: number) {
  if (order.vatCents > 0) return order.vatCents;
  const vatRateDec = vatRatePercent / 100;
  return Math.round((order.subtotalCents * vatRateDec) / (1 + vatRateDec));
}

export async function GET(req: Request) {
  // ✅ Admin-only
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  // ✅ Rate limit
  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({
    key: `admin:${ip}:${url.pathname}`,
    limit: 60,
    windowSeconds: 60,
  });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  const { start, endExclusive, startISO, endISO } = metricsPeriod(startParam ?? undefined, endParam ?? undefined, new Date(), 30);

  const PAID_LIKE = [
    "PAGATO",
    "IN_PREPARAZIONE",
    "SPEDITO",
    "CONSEGNATO",
    "RIMBORSATO",
    "PARZIALMENTE_RIMBORSATO",
  ] as const;

  const ALLOWED_COUNTRIES = ["IT", "US", "GB", "DE", "NL", "DK", "NO", "ES", "FR"];

  const [
    totalOrders,
    paidOrders,
    pendingOrders,
    canceledOrders,
    checkoutCanceled,
    analyticsEvents,
    topPurchasedProduct,
    catalog,
    totalOrdersByCountry,
    ordersAndRevenueByCountry,
    pendingOrdersByCountry,
    canceledOrdersByCountry,
    checkoutCanceledByCountry,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, orderNumber: { not: null }, isTest: false } }),
    prisma.order.count({
      where: {
        createdAt: { gte: start, lt: endExclusive },
        status: { in: [...PAID_LIKE] },
        isTest: false,
      },
    }),
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "IN_ATTESA", orderNumber: { not: null }, isTest: false } }),
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "ANNULLATO", orderNumber: { not: null }, isTest: false } }),
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "ANNULLATO", orderNumber: null, isTest: false } }),
    // 1. Eventi analitici per calcoli geografici e visite/sessioni/views prodotti
    prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: start, lt: endExclusive },
        type: { in: ["page_view", "product_view"] },
        isInternal: false,
        env: "prod",
        ...SITE_ANALYTICS_FILTER,
      },
      select: {
        type: true,
        createdAt: true,
        visitorId: true,
        sessionId: true,
        productKey: true,
        data: true,
      },
    }),
    // 2. Prodotto più comprato (titolo)
    prisma.$queryRaw<
      Array<{
        title: string;
        qty: number;
      }>
    >`
      SELECT
        oi.title AS title,
        SUM(oi.qty)::int AS qty
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      WHERE o.status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
        AND o."isTest" = false
        AND o."createdAt" >= ${start.toISOString()}::timestamp AND o."createdAt" < ${endExclusive.toISOString()}::timestamp
      GROUP BY oi.title
      ORDER BY qty DESC
      LIMIT 1
    `,
    // 3. Catalogo per risolvere i nomi dei prodotti più visti
    readCatalog(),
    // 4. Ordini totali per nazione
    prisma.order.groupBy({
      by: ["countryCode"],
      where: {
        createdAt: { gte: start, lt: endExclusive },
        orderNumber: { not: null },
        isTest: false,
      },
      _count: { id: true },
    }),
    // 5. Ordini e dati finanziari pagati per nazione
    prisma.order.groupBy({
      by: ["countryCode"],
      where: {
        createdAt: { gte: start, lt: endExclusive },
        status: { in: [...PAID_LIKE] },
        isTest: false,
      },
      _sum: {
        totalCents: true,
        stripeFeeCents: true,
        refundCents: true,
      },
      _count: { id: true },
    }),
    // 6. Ordini in attesa per nazione
    prisma.order.groupBy({
      by: ["countryCode"],
      where: {
        createdAt: { gte: start, lt: endExclusive },
        status: "IN_ATTESA",
        orderNumber: { not: null },
        isTest: false,
      },
      _count: { id: true },
    }),
    // 7. Ordini annullati per nazione
    prisma.order.groupBy({
      by: ["countryCode"],
      where: {
        createdAt: { gte: start, lt: endExclusive },
        status: "ANNULLATO",
        orderNumber: { not: null },
        isTest: false,
      },
      _count: { id: true },
    }),
    // 8. Checkout annullati per nazione
    prisma.order.groupBy({
      by: ["countryCode"],
      where: {
        createdAt: { gte: start, lt: endExclusive },
        status: "ANNULLATO",
        orderNumber: null,
        isTest: false,
      },
      _count: { id: true },
    }),
  ]);

  void pendingOrdersByCountry;
  void canceledOrdersByCountry;
  void checkoutCanceledByCountry;

  const { uniqueVisitorsCount, uniqueSessionsCount, visitorCountriesData, sessionCountriesData } =
    summarizeTrafficGeography(analyticsEvents);
  const productViewCounts = new Map<string, number>();
  for (const event of analyticsEvents) {
    if (event.type === "product_view" && event.productKey) {
      productViewCounts.set(event.productKey, (productViewCounts.get(event.productKey) ?? 0) + 1);
    }
  }

  // Risoluzione prodotto più visto
  const sortedProductViews = Array.from(productViewCounts.entries()).sort((a, b) => b[1] - a[1]);
  const mostViewedKey = sortedProductViews[0]?.[0] ?? null;
  const mostViewedCount = sortedProductViews[0]?.[1] ?? 0;
  const mostViewedProductTitle = catalog.find((p) => p.id === mostViewedKey || p.slug === mostViewedKey)?.title || mostViewedKey || "—";

  // Aggregazione viste per nazione
  const countryProductViews = new Map<string, Map<string, number>>();
  for (const event of analyticsEvents) {
    if (event.type !== "product_view" || !event.productKey) continue;
    const country = getAnalyticsCountryCode(event.data);
    const products = countryProductViews.get(country) ?? new Map<string, number>();
    products.set(event.productKey, (products.get(event.productKey) ?? 0) + 1);
    countryProductViews.set(country, products);
  }

  const topProductViewsPerCountry = Array.from(countryProductViews.keys()).map((country) => {
    const prodMap = countryProductViews.get(country);
    if (!prodMap || prodMap.size === 0) {
      return { country, productSku: "—", count: 0 };
    }
    const sorted = Array.from(prodMap.entries()).sort((a, b) => b[1] - a[1]);
    const [topKey, count] = sorted[0];
    const prod = catalog.find((p) => p.id === topKey || p.slug === topKey);
    const sku = prod?.variants?.[0]?.sku || prod?.id || topKey;
    return { country, productSku: sku, count };
  }).filter((item) => item.count > 0);

  // Risoluzione prodotto più comprato
  const mostPurchasedProductTitle = topPurchasedProduct[0]?.title ?? "—";
  const mostPurchasedProductQty = Number(topPurchasedProduct[0]?.qty ?? 0);

  const productPurchasesByCountryRaw = mostPurchasedProductTitle !== "—" ? await prisma.$queryRaw<
    Array<{
      countryCode: string;
      qty: number;
    }>
  >`
    SELECT
      o."countryCode" AS "countryCode",
      SUM(oi.qty)::int AS qty
    FROM "OrderItem" oi
    JOIN "Order" o ON o.id = oi."orderId"
    WHERE o.status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
      AND o."isTest" = false
      AND o."createdAt" >= ${start.toISOString()}::timestamp AND o."createdAt" < ${endExclusive.toISOString()}::timestamp
      AND oi.title = ${mostPurchasedProductTitle}
    GROUP BY o."countryCode"
  ` : [];

  const productPurchasesCountryData = productPurchasesByCountryRaw.map(r => ({
    country: r.countryCode || "IT",
    qty: Number(r.qty),
  })).filter(r => ALLOWED_COUNTRIES.includes(r.country) && r.qty > 0);

  // 1. Visitatori e sessioni per nazione
  const visitorsByCountry = visitorCountriesData.map(({ label, value }) => ({ country: label, count: value }));
  const sessionsByCountry = sessionCountriesData.map(({ label, value }) => ({ country: label, count: value }));

  // 2. Fatturato e ordini per nazione
  const ordersByCountry = totalOrdersByCountry.map((r) => ({
    country: r.countryCode || "IT",
    count: r._count.id ?? 0,
  })).sort((a, b) => b.count - a.count);

  const revenueByCountry = ordersAndRevenueByCountry.map((r) => ({
    country: r.countryCode || "IT",
    revenueCents: r._sum.totalCents ?? 0,
  })).sort((a, b) => b.revenueCents - a.revenueCents);

  // Load Store Settings and Leonardo Overrides
  const [storeSettings, overridesRow, revenueAgg] = await Promise.all([
    getStoreSettings(),
    prisma.setting.findUnique({ where: { key: "leonardo_conti_data" } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: start, lt: endExclusive },
        status: { in: [...PAID_LIKE] },
        isTest: false,
      },
      _sum: { totalCents: true, stripeFeeCents: true, refundCents: true },
    }),
  ]);

  void revenueAgg;
  const vatRatePercent = storeSettings.vatRatePercent;
  const overrides = overridesRow ? JSON.parse(overridesRow.value) : {};

  // Fetch all orders in the monthly periods overlapping the selected date range
  const { startMonthDate, endMonthDate } = metricsMonthWindow(startISO, endISO);

  const monthlyOrders = await prisma.order.findMany({
    where: {
      status: { in: [...PAID_LIKE] },
      isTest: false,
      createdAt: { gte: startMonthDate, lt: endMonthDate },
    },
    select: {
      createdAt: true,
      totalCents: true,
      subtotalCents: true,
      shippingCents: true,
      vatCents: true,
      stripeFeeCents: true,
    },
  });

  // Group monthly orders by month key
  const monthsDbTotals: Record<
    string,
    {
      gross: number;
      shipping: number;
      vat: number;
      stripe: number;
    }
  > = {};

  for (const order of monthlyOrders) {
    const d = new Date(order.createdAt);
    const monthKey = metricsMonthKey(d);

    const autoStripe = order.stripeFeeCents > 0 ? order.stripeFeeCents : Math.round(order.totalCents * 0.015 + 25);
    const autoVat = deriveVatCents(order, vatRatePercent);

    if (!monthsDbTotals[monthKey]) {
      monthsDbTotals[monthKey] = { gross: 0, shipping: 0, vat: 0, stripe: 0 };
    }

    const m = monthsDbTotals[monthKey];
    m.gross += order.totalCents;
    m.shipping += order.shippingCents;
    m.vat += autoVat;
    m.stripe += autoStripe;
  }

  // Calculate overridden/actual totals for the selected range
  let rangeGrossCents = 0;
  let rangeShippingCents = 0;
  let rangeVatCents = 0;
  let rangeStripeCents = 0;
  let rangeLeonardoCents = 0;

  for (const order of monthlyOrders) {
    if (order.createdAt >= start && order.createdAt < endExclusive) {
      const d = new Date(order.createdAt);
      const monthKey = metricsMonthKey(d);

      const ov = overrides[monthKey] || {};
      const mDb = monthsDbTotals[monthKey];

      const hasOverrides =
         ov.manualGrossCents !== undefined ||
         ov.manualGlsCents !== undefined ||
         ov.manualVatCents !== undefined ||
         ov.manualStripeFeeCents !== undefined;

      if (!hasOverrides) {
        const stripeVal = order.stripeFeeCents > 0 ? order.stripeFeeCents : Math.round(order.totalCents * 0.015 + 25);
        const vatVal = deriveVatCents(order, vatRatePercent);

        rangeGrossCents += order.totalCents;
        rangeShippingCents += order.shippingCents;
        rangeVatCents += vatVal;
        rangeStripeCents += stripeVal;
        rangeLeonardoCents += Math.round(order.totalCents * 0.1);
      } else {
        const orderRatio = mDb && mDb.gross > 0 ? order.totalCents / mDb.gross : 0;

        const actualMonthGross = ov.manualGrossCents !== undefined ? ov.manualGrossCents : mDb.gross;
        const actualMonthShipping = ov.manualGlsCents !== undefined ? ov.manualGlsCents : mDb.shipping;
        const actualMonthVat = ov.manualVatCents !== undefined ? ov.manualVatCents : mDb.vat;
        const actualMonthStripe = ov.manualStripeFeeCents !== undefined ? ov.manualStripeFeeCents : mDb.stripe;
        const actualMonthLeonardo = Math.round(actualMonthGross * 0.1);

        rangeGrossCents += Math.round(actualMonthGross * orderRatio);
        rangeShippingCents += Math.round(actualMonthShipping * orderRatio);
        rangeVatCents += Math.round(actualMonthVat * orderRatio);
        rangeStripeCents += Math.round(actualMonthStripe * orderRatio);
        rangeLeonardoCents += Math.round(actualMonthLeonardo * orderRatio);
      }
    }
  }

  const revenueCents = rangeGrossCents;
  const stripeCents = rangeStripeCents;
  const vatCents = rangeVatCents;
  const shippingCents = rangeShippingCents;
  const leonardoCents = rangeLeonardoCents;

  const netCents = revenueCents - stripeCents - vatCents - shippingCents - leonardoCents;
  const aovCents = paidOrders > 0 ? Math.round(revenueCents / paidOrders) : 0;

  // ========= OPERATIVO =========
  const toShipInPeriod = await prisma.order.count({
    where: {
      status: { in: ["PAGATO", "IN_PREPARAZIONE"] },
      isTest: false,
      shippedAt: null,
      createdAt: { gte: start, lt: endExclusive },
    },
  });

  const shippedInPeriod = await prisma.order.findMany({
    where: {
      status: "SPEDITO",
      isTest: false,
      shippedAt: { not: null },
      paidAt: { not: null },
      createdAt: { gte: start, lt: endExclusive },
    },
    select: { paidAt: true, shippedAt: true },
    take: 1000,
  });

  const avgFulfillmentMs =
    shippedInPeriod.length === 0
      ? 0
      : Math.round(
          shippedInPeriod.reduce((acc, o) => {
            const a = o.paidAt ? new Date(o.paidAt).getTime() : 0;
            const b = o.shippedAt ? new Date(o.shippedAt).getTime() : 0;
            return acc + Math.max(0, b - a);
          }, 0) / shippedInPeriod.length
        );
  const avgFulfillmentHours = avgFulfillmentMs ? Math.round(avgFulfillmentMs / (1000 * 60 * 60)) : 0;

  // ========= PRODOTTI =========
  const topProducts =
    (await prisma.$queryRaw<
      Array<{
        productId: string;
        title: string;
        variantLabel: string;
        qty: number;
        revenueCents: number;
      }>
    >`
      SELECT
        oi."productId" AS "productId",
        oi.title AS title,
        oi."variantLabel" AS "variantLabel",
        SUM(oi.qty)::int AS qty,
        SUM(oi."lineTotalCents")::int AS "revenueCents"
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      WHERE o.status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
        AND o."isTest" = false
        AND o."createdAt" >= ${start.toISOString()}::timestamp
        AND o."createdAt" < ${endExclusive.toISOString()}::timestamp
      GROUP BY oi."productId", oi.title, oi."variantLabel"
      ORDER BY "revenueCents" DESC
      LIMIT 10
    `) ?? [];

  // ========= TREND GIORNALIERO =========
  const trendRows = (await prisma.$queryRaw<
    Array<{
      day: string;
      orders: number;
      paidOrders: number;
      grossCents: number | null;
      paidGrossCents: number | null;
    }>
  >`
    SELECT
      TO_CHAR("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Rome', 'YYYY-MM-DD') AS day,
      COUNT(*)::int AS orders,
      SUM(
        CASE
          WHEN status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
          THEN 1
          ELSE 0
        END
      )::int AS "paidOrders",
      SUM("totalCents")::int AS "grossCents",
      SUM(
        CASE
          WHEN status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
          THEN "totalCents"
          ELSE 0
        END
      )::int AS "paidGrossCents"
    FROM "Order"
    WHERE "createdAt" >= ${start.toISOString()}::timestamp AND "createdAt" < ${endExclusive.toISOString()}::timestamp
      AND "isTest" = false
    GROUP BY TO_CHAR("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Rome', 'YYYY-MM-DD')
    ORDER BY day ASC
  `) ?? [];

  const payload = {
    ok: true,
    period: {
      start: startISO,
      end: endISO,
    },
    kpis: {
      revenueCents,
      netEstimatedCents: netCents,
      aovCents,
      totalOrders,
      paidOrders,
      pendingOrders,
      canceledOrders,
      checkoutCanceled,
      toShip: toShipInPeriod,
      shipped: shippedInPeriod.length,
      avgFulfillmentHours,
      uniqueVisitors: uniqueVisitorsCount,
      totalSessions: uniqueSessionsCount,
      mostViewedProduct: {
        title: mostViewedProductTitle,
        count: mostViewedCount,
      },
      mostPurchasedProduct: {
        title: mostPurchasedProductTitle,
        qty: mostPurchasedProductQty,
      },
    },
    breakdowns: {
      visitorsByCountry,
      sessionsByCountry,
      ordersByCountry,
      revenueByCountry,
      topProductViewsPerCountry,
      productPurchasesCountryData,
    },
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      title: p.title,
      variantLabel: p.variantLabel,
      qty: Number(p.qty),
      revenueCents: Number(p.revenueCents),
    })),
    dailyTrend: trendRows.map((r) => ({
      day: r.day,
      orders: Number(r.orders),
      paidOrders: Number(r.paidOrders),
      grossCents: Number(r.grossCents ?? 0),
      paidGrossCents: Number(r.paidGrossCents ?? 0),
    })),
  };

  const filename = `dashboard_report_${startISO}__${endISO}.json`;

  return guard.attach(
    new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    })
  );
}
