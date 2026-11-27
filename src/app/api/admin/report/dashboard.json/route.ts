import { closedCheckoutWhere } from "@/lib/server/checkoutMetrics";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { readCatalog } from "@/lib/server/catalog";
import { getStoreSettings } from "@/lib/server/settings";
import { ADMIN_REPORT_LOOKBACK_DAYS, metricsMonthWindow, metricsPeriod, readSalesMetrics, salesConversion } from "@/lib/server/salesMetrics";
import { paidVouchersInPeriod, readVoucherCheckouts, summarizeVoucherCheckouts } from "@/lib/server/voucherMetrics";
import { computeDashboardFinance } from "@/lib/server/dashboardFinance";
import { readDashboardTrend } from "@/lib/server/dashboardTrend";
import { getAnalyticsCountryCode, summarizeTrafficGeography } from "@/lib/server/trafficGeography";
import { SITE_ANALYTICS_FILTER } from "@/lib/server/analyticsFilters";

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

  const { start, endExclusive, startISO, endISO } = metricsPeriod(startParam ?? undefined, endParam ?? undefined, new Date(), ADMIN_REPORT_LOOKBACK_DAYS);

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
    prisma.order.count({ where: closedCheckoutWhere(start, endExclusive) }),
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
      where: closedCheckoutWhere(start, endExclusive),
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

  // 2. Fatturato e ordini per nazione (integrati con i voucher dopo il caricamento)
  const ordersByCountryMap = new Map<string, number>();
  for (const r of totalOrdersByCountry) {
    const country = r.countryCode || "IT";
    ordersByCountryMap.set(country, (ordersByCountryMap.get(country) ?? 0) + (r._count.id ?? 0));
  }

  const revenueByCountryMap = new Map<string, number>();
  for (const r of ordersAndRevenueByCountry) {
    const country = r.countryCode || "IT";
    revenueByCountryMap.set(country, (revenueByCountryMap.get(country) ?? 0) + (r._sum.totalCents ?? 0));
  }

  // Load Store Settings, Monthly Orders/Vouchers and Leonardo Overrides
  const { startMonthDate, endMonthDate } = metricsMonthWindow(startISO, endISO);
  const voucherCheckouts = readVoucherCheckouts(prisma, startMonthDate, endMonthDate);
  const [voucherRows, sales, storeSettings, overridesRow, monthlyOrders] = await Promise.all([
    voucherCheckouts,
    readSalesMetrics(prisma, start, endExclusive, undefined, voucherCheckouts),
    getStoreSettings(),
    prisma.setting.findUnique({ where: { key: "leonardo_conti_data" } }),
    prisma.order.findMany({
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
    }),
  ]);

  const vatRatePercent = storeSettings.vatRatePercent;
  const overrides = overridesRow ? JSON.parse(overridesRow.value) : {};
  const vouchers = summarizeVoucherCheckouts(voucherRows, start, endExclusive);
  const monthlyVouchers = paidVouchersInPeriod(voucherRows, startMonthDate, endMonthDate);

  if (vouchers.paid.length > 0) {
    ordersByCountryMap.set("ND", (ordersByCountryMap.get("ND") ?? 0) + vouchers.paid.length);
  }
  if (vouchers.grossCents > 0) {
    revenueByCountryMap.set("ND", (revenueByCountryMap.get("ND") ?? 0) + vouchers.grossCents);
  }

  const ordersByCountry = Array.from(ordersByCountryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  const revenueByCountry = Array.from(revenueByCountryMap.entries())
    .map(([country, revenueCents]) => ({ country, revenueCents }))
    .sort((a, b) => b.revenueCents - a.revenueCents);

  const { revenueCents, netCents } = computeDashboardFinance({
    monthlyOrders,
    monthlyVouchers,
    overrides,
    vatRatePercent,
    start,
    endExclusive,
  });

  const paidCount = paidOrders + vouchers.paid.length;
  const aovCents = paidCount > 0 ? Math.round(revenueCents / paidCount) : 0;

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
      status: { in: ["SPEDITO", "CONSEGNATO"] },
      isTest: false,
      createdAt: { gte: start, lt: endExclusive },
    },
    select: { paidAt: true, shippedAt: true },
    take: 1000,
  });

  const fulfillmentSamples = shippedInPeriod.filter(
    (o): o is { paidAt: Date; shippedAt: Date } => o.paidAt !== null && o.shippedAt !== null,
  );
  const avgFulfillmentMs =
    fulfillmentSamples.length === 0
      ? 0
      : Math.round(
          fulfillmentSamples.reduce((acc, o) => {
            const a = new Date(o.paidAt).getTime();
            const b = new Date(o.shippedAt).getTime();
            return acc + Math.max(0, b - a);
          }, 0) / fulfillmentSamples.length
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
  const dailyTrend = await readDashboardTrend(prisma, start, endExclusive, null, PAID_LIKE, vouchers);

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
      totalOrders: totalOrders + vouchers.paid.length,
      paidOrders: paidCount,
      pendingOrders,
      canceledOrders,
      checkoutCanceled: checkoutCanceled + vouchers.closed.length,
      voucherPaidOrders: vouchers.paid.length,
      voucherRevenueCents: vouchers.grossCents,
      avgPaymentMs: sales.avgPaymentMs,
      paymentSamples: sales.paymentSamples,
      salesConversion: salesConversion(sales.paidOrders, uniqueSessionsCount),
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
    dailyTrend,
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
