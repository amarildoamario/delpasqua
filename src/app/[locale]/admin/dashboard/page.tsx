import Link from "next/link";

import { prisma } from "@/lib/server/prisma";

import PageHeader from "@/app/[locale]/admin/_components/PageHeader";

import { readCatalog } from "@/lib/server/catalog";

import { Info } from "lucide-react";

import { getStoreSettings } from "@/lib/server/settings";



export const dynamic = "force-dynamic";



function euro(cents: number) {

  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);

}



function toISODate(d: Date) {

  const y = d.getFullYear();

  const m = String(d.getMonth() + 1).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;

}



function parseDate(s?: string) {

  if (!s) return null;

  // accetta solo YYYY-MM-DD

  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;

  const d = new Date(`${s}T00:00:00`);

  return Number.isNaN(d.getTime()) ? null : d;

}



function deriveVatCents(order: { vatCents: number; subtotalCents: number }, vatRatePercent: number) {

  if (order.vatCents > 0) return order.vatCents;

  const vatRateDec = vatRatePercent / 100;

  return Math.round((order.subtotalCents * vatRateDec) / (1 + vatRateDec));

}

function getAnalyticsCountryCode(data: unknown) {
  if (!data || typeof data !== "object") return "IT";
  const meta = (data as { meta?: unknown }).meta;
  if (!meta || typeof meta !== "object") return "IT";
  const countryCode = (meta as { countryCode?: unknown }).countryCode;
  return typeof countryCode === "string" && countryCode.trim()
    ? countryCode.trim().toUpperCase()
    : "IT";
}



function getCountryFlag(code: string): string {

  const flags: Record<string, string> = {

    IT: "🇮🇹",

    US: "🇺🇸",

    GB: "🇬🇧",

    DE: "🇩🇪",

    NL: "🇳🇱",

    DK: "🇩🇰",

    NO: "🇳🇴",

    ES: "🇪🇸",

    FR: "🇫🇷",

  };

  return flags[code.toUpperCase()] || code;

}



function Section({

  title,

  subtitle,

  children,

}: {

  title: string;

  subtitle?: string;

  children: React.ReactNode;

}) {

  return (

    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">

      <div className="mb-2.5">

        <div className="text-sm font-bold text-neutral-900 uppercase tracking-wide">{title}</div>

        {subtitle ? <div className="text-xs text-neutral-500">{subtitle}</div> : null}

      </div>

      {children}

    </div>

  );

}



function StatCard({

  title,

  value,

  hint,

  tooltip,

}: {

  title: string;

  value: string;

  hint?: string;

  tooltip?: string;

}) {

  return (

    <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 hover:bg-neutral-50 transition-colors relative">

      <div className="flex items-center gap-1">

        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{title}</span>

        {tooltip ? (

          <div className="group relative inline-block cursor-help">

            <Info className="h-3 w-3 text-neutral-300 hover:text-neutral-500 transition-colors" />

            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-48 -translate-x-1/2 scale-95 rounded-lg bg-neutral-900 p-2 text-[10px] font-medium leading-normal text-white opacity-0 shadow-md transition-all group-hover:scale-100 group-hover:opacity-100">

              {tooltip}

              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />

            </div>

          </div>

        ) : null}

      </div>

      <div className="mt-0.5 text-lg font-extrabold tracking-tight text-neutral-900">

        {value}

      </div>

      <div className="mt-0.5 text-[10px] font-medium text-neutral-500 truncate" title={hint ?? undefined}>

        {hint || "\u00A0"}

      </div>

    </div>

  );

}



function CountryBarChart({

  title,

  data,

  valueFormatter = (v) => String(v),

}: {

  title: string;

  data: Array<{ label: string; barLabel?: string; value: number }>;

  valueFormatter?: (v: number) => string;

}) {

  const maxValue = Math.max(1, ...data.map((d) => d.value));



  return (

    <div className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-3 mt-3 h-[176px] flex flex-col justify-between">

      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">{title}</div>

      <div className="space-y-2 flex-1 flex flex-col justify-start">

        {data.slice(0, 5).map((item, idx) => {
          const wPct = Math.min(100, Math.max(5, Math.round((item.value / maxValue) * 100)));
          const flag = getCountryFlag(item.label);
          const barBackground = `linear-gradient(to right, rgb(59 130 246 / 0.8) 0 ${wPct}%, rgb(245 245 245) ${wPct}% 100%)`;
          return (
            <div key={`${item.label}:${item.barLabel ?? ""}:${idx}`} className="flex items-center gap-3 text-xs">
              <div className="w-8 text-sm font-semibold text-neutral-700 truncate">{flag}</div>
              <div
                className="flex-1 h-5 rounded-lg overflow-hidden flex items-center justify-between px-2 text-[10px] font-bold text-neutral-900"
                style={{ background: barBackground }}
              >
                {item.barLabel ? (
                  <>
                    <span className="truncate pr-2 text-neutral-900">{item.barLabel}</span>
                    <span className="shrink-0 text-neutral-800">{valueFormatter(item.value)}</span>
                  </>
                ) : (
                  <span className="text-neutral-900">{valueFormatter(item.value)}</span>
                )}
              </div>
            </div>
          );
        })}

        {data.length === 0 ? (

          <div className="text-xs text-neutral-400 italic">Nessun dato per il periodo.</div>

        ) : null}

      </div>

    </div>

  );

}



export default async function AdminDashboard({

  searchParams,

}: {

  searchParams: Promise<Record<string, string | string[] | undefined>>;

}) {

  const sp = (await searchParams) ?? {};

  const startParam = Array.isArray(sp.start) ? sp.start[0] : sp.start;

  const endParam = Array.isArray(sp.end) ? sp.end[0] : sp.end;

  const marketParam = Array.isArray(sp.market) ? sp.market[0] : sp.market;

  const purchCountryParam = Array.isArray(sp.purchasedCountry) ? sp.purchasedCountry[0] : sp.purchasedCountry;



  const ALLOWED_COUNTRIES = ["IT", "US", "GB", "DE", "NL", "DK", "NO", "ES", "FR"];

  const activeMarket = marketParam ? marketParam.toUpperCase() : "";

  const marketFilter = activeMarket && ALLOWED_COUNTRIES.includes(activeMarket) ? activeMarket : null;



  const activePurchCountry = purchCountryParam ? purchCountryParam.toUpperCase() : "";

  const purchasedCountryFilter = activePurchCountry && ALLOWED_COUNTRIES.includes(activePurchCountry) ? activePurchCountry : null;



  const today = new Date();

  const defaultStart = new Date(today);

  defaultStart.setDate(today.getDate() - 30);



  const start = parseDate(startParam) ?? defaultStart;

  const end = parseDate(endParam) ?? today;



  // end inclusive -> endExclusive (giorno dopo)

  const endExclusive = new Date(end);

  endExclusive.setDate(end.getDate() + 1);



  const startISO = toISODate(start);

  const endISO = toISODate(end);



  // src/app/admin/dashboard/page.tsx



  const PAID_LIKE = [

    "PAGATO",

    "IN_PREPARAZIONE",

    "SPEDITO",

    "CONSEGNATO",

    "RIMBORSATO",

    "PARZIALMENTE_RIMBORSATO",

  ] as const;



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

    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, orderNumber: { not: null } } }),

    prisma.order.count({

      where: {

        createdAt: { gte: start, lt: endExclusive },

        status: { in: [...PAID_LIKE] },

      },

    }),

    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "IN_ATTESA", orderNumber: { not: null } } }),

    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "ANNULLATO", orderNumber: { not: null } } }),

    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "ANNULLATO", orderNumber: null } }),

    // 1. Eventi analitici per calcoli geografici e visite/sessioni/views prodotti

    prisma.analyticsEvent.findMany({

      where: {

        createdAt: { gte: start, lt: endExclusive },

        type: { in: ["page_view", "product_view"] },

        isInternal: false,

        env: "prod",

      },

      select: {

        type: true,

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
        AND o."createdAt" >= ${start.toISOString()}::timestamp AND o."createdAt" < ${endExclusive.toISOString()}::timestamp

        AND (${purchasedCountryFilter}::text IS NULL OR o."countryCode" = ${purchasedCountryFilter}::text)

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

      },

      _count: { id: true },

    }),

    // 5. Ordini e dati finanziari pagati per nazione

    prisma.order.groupBy({

      by: ["countryCode"],

      where: {

        createdAt: { gte: start, lt: endExclusive },

        status: { in: [...PAID_LIKE] },

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

      },

      _count: { id: true },

    }),

  ]);



  // Calcolo visite uniche, sessioni e geografia reali in-memoria

  const sessionsSet = new Set<string>();

  const visitorsSet = new Set<string>();

  const countryVisitorMap = new Map<string, Set<string>>();

  const countrySessionMap = new Map<string, Set<string>>();

  const productViewCounts = new Map<string, number>();

  const productViewCountryMap = new Map<string, Map<string, number>>();



  for (const ev of analyticsEvents) {

    const country = getAnalyticsCountryCode(ev.data);



    if (ev.type === "page_view") {

      if (ev.visitorId) visitorsSet.add(ev.visitorId);

      if (ev.sessionId) sessionsSet.add(ev.sessionId);



      if (ALLOWED_COUNTRIES.includes(country)) {

        if (ev.visitorId) {

          if (!countryVisitorMap.has(country)) {

            countryVisitorMap.set(country, new Set());

          }

          countryVisitorMap.get(country)!.add(ev.visitorId);

        }

        if (ev.sessionId) {

          if (!countrySessionMap.has(country)) {

            countrySessionMap.set(country, new Set());

          }

          countrySessionMap.get(country)!.add(ev.sessionId);

        }

      }

    } else if (ev.type === "product_view" && ev.productKey) {

      productViewCounts.set(ev.productKey, (productViewCounts.get(ev.productKey) || 0) + 1);

      if (!productViewCountryMap.has(ev.productKey)) {

        productViewCountryMap.set(ev.productKey, new Map());

      }

      const countryMap = productViewCountryMap.get(ev.productKey)!;

      countryMap.set(country, (countryMap.get(country) || 0) + 1);

    }

  }



  const uniqueVisitorsCount = visitorsSet.size;

  const uniqueSessionsCount = sessionsSet.size;



  const totalGeoVisitors = Array.from(countryVisitorMap.values()).reduce((acc, s) => acc + s.size, 0);

  const visitorCountries = Array.from(countryVisitorMap.entries()).map(([country, visitorSet]) => ({

    country,

    count: visitorSet.size,

  })).sort((a, b) => b.count - a.count).map(c => {

    const pct = totalGeoVisitors > 0 ? Math.round((c.count / totalGeoVisitors) * 100) : 100;

    const flag = getCountryFlag(c.country);

    return `${flag} (${pct}%)`;

  }).slice(0, 5).join("  ") || "🇮🇹 (100%)";



  // Risoluzione prodotto più visto

  void visitorCountries;

  const sortedProductViews = Array.from(productViewCounts.entries()).sort((a, b) => b[1] - a[1]);

  const mostViewedKey = sortedProductViews[0]?.[0] ?? null;

  const mostViewedCount = sortedProductViews[0]?.[1] ?? 0;

  const mostViewedProductTitle = catalog.find((p) => p.id === mostViewedKey || p.slug === mostViewedKey)?.title || mostViewedKey || "—";



  // Aggregazione viste per nazione (most viewed product per country with SKU)

  const countryProductViews = new Map<string, Map<string, number>>();



  for (const ev of analyticsEvents) {

    if (ev.type === "product_view" && ev.productKey) {

      const country = getAnalyticsCountryCode(ev.data);



      if (ALLOWED_COUNTRIES.includes(country)) {

        if (!countryProductViews.has(country)) {

          countryProductViews.set(country, new Map());

        }

        const prodMap = countryProductViews.get(country)!;

        prodMap.set(ev.productKey, (prodMap.get(ev.productKey) || 0) + 1);

      }

    }

  }



  const topProductViewsPerCountry = ALLOWED_COUNTRIES.map((country) => {

    const prodMap = countryProductViews.get(country);

    if (!prodMap || prodMap.size === 0) {

      return {

        label: country,

        barLabel: "—",

        value: 0,

      };

    }



    const sorted = Array.from(prodMap.entries()).sort((a, b) => b[1] - a[1]);

    const [topKey, count] = sorted[0];



    const prod = catalog.find((p) => p.id === topKey || p.slug === topKey);

    const sku = prod?.variants?.[0]?.sku || prod?.id || topKey;



    return {

      label: country,

      barLabel: sku,

      value: count,

    };

  }).filter((item) => item.value > 0).sort((a, b) => b.value - a.value);



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
      AND o."createdAt" >= ${start.toISOString()}::timestamp AND o."createdAt" < ${endExclusive.toISOString()}::timestamp

      AND oi.title = ${mostPurchasedProductTitle}

    GROUP BY o."countryCode"

  ` : [];



  const productPurchasesCountryData = productPurchasesByCountryRaw.map(r => ({

    label: r.countryCode || "IT",

    value: Number(r.qty),

  })).filter(r => ALLOWED_COUNTRIES.includes(r.label) && r.value > 0).sort((a, b) => b.value - a.value);



  // 1. Visitatori e sessioni per nazione

  const visitorCountriesData = Array.from(countryVisitorMap.entries()).map(([country, visitorSet]) => ({

    label: country,

    value: visitorSet.size,

  })).sort((a, b) => b.value - a.value);



  const sessionCountriesData = Array.from(countrySessionMap.entries()).map(([country, sessionSet]) => ({

    label: country,

    value: sessionSet.size,

  })).sort((a, b) => b.value - a.value);



  // 2. Fatturato e ordini per nazione

  const totalOrdersCountriesData = totalOrdersByCountry.map((r) => ({

    label: r.countryCode || "IT",

    value: r._count.id ?? 0,

  })).sort((a, b) => b.value - a.value);



  const paidOrdersCountriesData = ordersAndRevenueByCountry.map((r) => ({

    label: r.countryCode || "IT",

    value: r._count.id ?? 0,

  })).sort((a, b) => b.value - a.value);



  const pendingOrdersCountriesData = pendingOrdersByCountry.map((r) => ({

    label: r.countryCode || "IT",

    value: r._count.id ?? 0,

  })).sort((a, b) => b.value - a.value);



  const canceledOrdersCountriesData = canceledOrdersByCountry.map((r) => ({

    label: r.countryCode || "IT",

    value: r._count.id ?? 0,

  })).sort((a, b) => b.value - a.value);



  const checkoutCanceledCountriesData = checkoutCanceledByCountry.map((r) => ({

    label: r.countryCode || "IT",

    value: r._count.id ?? 0,

  })).sort((a, b) => b.value - a.value);



  const revenueCountriesData = ordersAndRevenueByCountry.map((r) => ({

    label: r.countryCode || "IT",

    value: r._sum.totalCents ?? 0,

  })).sort((a, b) => b.value - a.value);



  const netCountriesData = ordersAndRevenueByCountry.map((r) => {

    const revenue = r._sum.totalCents ?? 0;

    const fee = r._sum.stripeFeeCents ?? 0;

    const refund = r._sum.refundCents ?? 0;

    return {

      label: r.countryCode || "IT",

      value: revenue - fee - refund,

    };

  }).sort((a, b) => b.value - a.value);



  const aovCountriesData = ordersAndRevenueByCountry.map((r) => {

    const revenue = r._sum.totalCents ?? 0;

    const count = r._count.id ?? 0;

    return {

      label: r.countryCode || "IT",

      value: count > 0 ? Math.round(revenue / count) : 0,

    };

  }).sort((a, b) => b.value - a.value);



  const feeRefundCountriesData = ordersAndRevenueByCountry.map((r) => {

    const fee = r._sum.stripeFeeCents ?? 0;

    const refund = r._sum.refundCents ?? 0;

    return {

      label: r.countryCode || "IT",

      value: fee + refund,

    };

  }).sort((a, b) => b.value - a.value);



  const ordersCountriesData = paidOrdersCountriesData;



  // Load Store Settings and Leonardo Overrides

  const [storeSettings, overridesRow, revenueAgg] = await Promise.all([

    getStoreSettings(),

    prisma.setting.findUnique({ where: { key: "leonardo_conti_data" } }),

    prisma.order.aggregate({

      where: {

        createdAt: { gte: start, lt: endExclusive },

        status: { in: [...PAID_LIKE] },

      },

      _sum: { totalCents: true, stripeFeeCents: true, refundCents: true },

    }),

  ]);

  const vatRatePercent = storeSettings.vatRatePercent;

  const overrides = overridesRow ? JSON.parse(overridesRow.value) : {};



  // Fetch all orders in the monthly periods overlapping the selected date range

  const startMonthDate = new Date(start.getFullYear(), start.getMonth(), 1);

  const endMonthDate = new Date(endExclusive.getFullYear(), endExclusive.getMonth() + 1, 1);



  const monthlyOrders = await prisma.order.findMany({

    where: {

      status: { in: [...PAID_LIKE] },

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

    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;



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

    // Only process orders within the selected dashboard date range

    if (order.createdAt >= start && order.createdAt < endExclusive) {

      const d = new Date(order.createdAt);

      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;



      const ov = overrides[monthKey] || {};

      const mDb = monthsDbTotals[monthKey];



      const hasOverrides =

        ov.manualGrossCents !== undefined ||

        ov.manualGlsCents !== undefined ||

        ov.manualVatCents !== undefined ||

        ov.manualStripeFeeCents !== undefined;



      if (!hasOverrides) {

        // Use standard DB values

        const stripeVal = order.stripeFeeCents > 0 ? order.stripeFeeCents : Math.round(order.totalCents * 0.015 + 25);

        const vatVal = deriveVatCents(order, vatRatePercent);



        rangeGrossCents += order.totalCents;

        rangeShippingCents += order.shippingCents;

        rangeVatCents += vatVal;

        rangeStripeCents += stripeVal;

        rangeLeonardoCents += Math.round(order.totalCents * 0.1);

      } else {

        // Distribute overridden totals proportionally

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



  // Final finance aggregates

  const revenueCents = rangeGrossCents;

  const stripeCents = rangeStripeCents;

  const vatCents = rangeVatCents;

  const shippingCents = rangeShippingCents;

  const leonardoCents = rangeLeonardoCents;



  const netCents = revenueCents - stripeCents - vatCents - shippingCents - leonardoCents;

  const aovCents = paidOrders > 0 ? Math.round(revenueCents / paidOrders) : 0;



  const feeRate = revenueCents > 0 ? stripeCents / revenueCents : 0;

  const refundRate = revenueCents > 0 ? (revenueAgg._sum.refundCents ?? 0) / revenueCents : 0;



  // ========= OPERATIVO (filtrato per periodo) =========

  const toShipInPeriod = await prisma.order.count({

    where: {

      status: { in: ["PAGATO", "IN_PREPARAZIONE"] }, // oppure solo ["PAGATO","IN_PREPARAZIONE"] se preferisci

      shippedAt: null,

      createdAt: { gte: start, lt: endExclusive },

    },

  });





  const shippedInPeriod = await prisma.order.findMany({

    where: {

      status: "SPEDITO",

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



  // ========= PRODOTTI (filtrato per periodo) =========

  // key robusta: productId + variantLabel (evita warning key duplicate)

  const topProducts =

    (await prisma.$queryRaw<

      Array<{

        rowKey: string;

        productId: string;

        title: string;

        variantLabel: string;

        qty: number;

        revenueCents: number;

      }>

    >`

    SELECT

      (oi."productId" || '|' || oi.title || '|' || oi."variantLabel") AS "rowKey",

      oi."productId" AS "productId",

      oi.title AS title,

      oi."variantLabel" AS "variantLabel",

      SUM(oi.qty)::int AS qty,

      SUM(oi."lineTotalCents")::int AS "revenueCents"

    FROM "OrderItem" oi

    JOIN "Order" o ON o.id = oi."orderId"

    WHERE o.status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
      AND o."createdAt" >= ${start.toISOString()}::timestamp

      AND o."createdAt" < ${endExclusive.toISOString()}::timestamp

      AND (${marketFilter}::text IS NULL OR o."countryCode" = ${marketFilter}::text)

    GROUP BY oi."productId", oi.title, oi."variantLabel"

    ORDER BY "revenueCents" DESC

    LIMIT 8

  `) ?? [];







  // ========= TREND GIORNALIERO (filtrato per periodo) =========

  const rows = (await prisma.$queryRaw<

    Array<{

      day: string;

      orders: number;

      paidOrders: number;

      grossCents: number | null;

      paidGrossCents: number | null;

    }>

  >`

  SELECT

    TO_CHAR("createdAt", 'YYYY-MM-DD') AS day,

    COUNT(*)::int AS orders,



    -- conteggio ordini "pagati" (anche se avanzano di stato)

    SUM(

      CASE

        WHEN status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
        THEN 1

        ELSE 0

      END

    )::int AS "paidOrders",



    -- totale lordo di TUTTI gli ordini (anche pending/canceled)

    SUM("totalCents")::int AS "grossCents",



    -- fatturato "pagati" (anche se avanzano di stato)

    SUM(

      CASE

        WHEN status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
        THEN "totalCents"

        ELSE 0

      END

    )::int AS "paidGrossCents"



  FROM "Order"

  WHERE "createdAt" >= ${start.toISOString()}::timestamp AND "createdAt" < ${endExclusive.toISOString()}::timestamp

    AND (${marketFilter}::text IS NULL OR "countryCode" = ${marketFilter}::text)

  GROUP BY TO_CHAR("createdAt", 'YYYY-MM-DD')

  ORDER BY day ASC

`) ?? [];





  const maxPaidGross = Math.max(1, ...rows.map((r) => Number(r.paidGrossCents ?? 0)));



  function getMarketQuery(marketCode?: string) {

    const q: Record<string, string> = {};

    if (startParam) q.start = startParam;

    if (endParam) q.end = endParam;

    if (marketCode) q.market = marketCode;

    if (purchCountryParam) q.purchasedCountry = purchCountryParam;

    return "?" + new URLSearchParams(q).toString();

  }



  function getPurchasedCountryQuery(countryCode?: string) {

    const q: Record<string, string> = {};

    if (startParam) q.start = startParam;

    if (endParam) q.end = endParam;

    if (marketParam) q.market = marketParam;

    if (countryCode) q.purchasedCountry = countryCode;

    return "?" + new URLSearchParams(q).toString();

  }



  const marketsList = [

    { code: "", flag: "🌐", label: "Tutti" },

    { code: "IT", flag: "🇮🇹", label: "Italia" },

    { code: "US", flag: "🇺🇸", label: "USA" },

    { code: "GB", flag: "🇬🇧", label: "UK" },

    { code: "DE", flag: "🇩🇪", label: "Germania" },

    { code: "NL", flag: "🇳🇱", label: "Paesi Bassi" },

    { code: "DK", flag: "🇩🇰", label: "Danimarca" },

    { code: "NO", flag: "🇳🇴", label: "Norvegia" },

    { code: "ES", flag: "🇪🇸", label: "Spagna" },

    { code: "FR", flag: "🇫🇷", label: "Francia" },

  ];



  const filteredVisitorCountriesData = visitorCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredSessionCountriesData = sessionCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredOrdersCountriesData = ordersCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  void filteredOrdersCountriesData;

  const filteredRevenueCountriesData = revenueCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);



  const filteredTotalOrdersCountriesData = totalOrdersCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredPaidOrdersCountriesData = paidOrdersCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredPendingOrdersCountriesData = pendingOrdersCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredCanceledOrdersCountriesData = canceledOrdersCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredCheckoutCanceledCountriesData = checkoutCanceledCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);



  const filteredNetCountriesData = netCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredAovCountriesData = aovCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);

  const filteredFeeRefundCountriesData = feeRefundCountriesData.filter(d => ALLOWED_COUNTRIES.includes(d.label) && d.value > 0);



  return (

    <div className="space-y-3.5">

      {/* Header */}

      <PageHeader

        title="Dashboard"

        subtitle={

          <>

            Periodo: <span className="font-semibold">{startISO}</span> →{" "}

            <span className="font-semibold">{endISO}</span>

          </>

        }

        actions={

          <Link

            href={`/api/admin/report/dashboard.json?start=${startISO}&end=${endISO}`}

            className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 shadow-sm transition-all"

          >

            Export JSON

          </Link>

        }

      />



      {/* KPI Principali */}

      <Section title="KPI Principali" subtitle="I parametri chiave di performance nel periodo selezionato.">

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

          <div>

            <div className="h-[46px] lg:h-[64px] flex items-end pb-1.5">

              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Rendimento Globale</span>

            </div>

            <StatCard

              title="Fatturato"

              value={euro(revenueCents)}

              hint="Ricavi netti ordini pagati"

              tooltip="Somma totale degli incassi degli ordini pagati nel periodo selezionato. Al netto di ordini in sospeso o annullati."

            />

            <CountryBarChart title="Fatturato per Nazione" data={filteredRevenueCountriesData} valueFormatter={euro} />

          </div>

          <div>

            <div className="h-[46px] lg:h-[64px] flex items-end pb-1.5">

              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Interesse Globale</span>

            </div>

            <StatCard

              title="Prodotto Più Visto"

              value={mostViewedProductTitle}

              hint={mostViewedCount > 0 ? `${new Intl.NumberFormat("it-IT").format(mostViewedCount)} visualizzazioni` : "Nessuna visualizzazione"}

              tooltip="Il prodotto con il maggior numero di visualizzazioni reali (pagine dettaglio prodotto) registrate nel periodo."

            />

            <CountryBarChart title="Prodotto Più Visto per Nazione" data={topProductViewsPerCountry} />

          </div>

          <div>

            <div className="lg:h-[64px] flex flex-col justify-end pb-1.5">

              <div className="flex items-center justify-between mb-1">

                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Top Vendite</span>

                <span className="text-[9px] text-neutral-500 font-bold uppercase">Target: {activePurchCountry ? getCountryFlag(activePurchCountry) : "🌐"}</span>

              </div>

              <div className="flex flex-wrap gap-1 bg-neutral-50/50 p-1 rounded-lg border border-neutral-100">

                {marketsList.map((m) => {

                  const isActive = activePurchCountry === m.code;

                  return (

                    <Link

                      key={m.code}

                      href={getPurchasedCountryQuery(m.code || undefined)}

                      className={`px-1 py-0.5 rounded text-[10px] font-bold transition-all border ${

                        isActive

                          ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"

                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"

                      }`}

                      title={m.label}

                    >

                      <span>{m.flag}</span>

                    </Link>

                  );

                })}

              </div>

            </div>

            <StatCard

              title="Prodotto Più Comprato"

              value={mostPurchasedProductTitle}

              hint={mostPurchasedProductQty > 0 ? `${mostPurchasedProductQty} unità vendute` : "Nessuna vendita"}

              tooltip="Il prodotto che ha venduto la quantità totale più alta di unità negli ordini pagati nel periodo per il mercato filtrato sopra."

            />

            <CountryBarChart title="Acquisti per Nazione" data={productPurchasesCountryData} />

          </div>

        </div>

      </Section>



      {/* Traffico e Geografia */}

      <Section title="Traffico e Geografia" subtitle="Analisi geografica e volumi di traffico reali dei visitatori.">

        <div className="grid gap-3 md:grid-cols-2">

          {/* Colonna Visite */}

          <div className="flex flex-col">

            <StatCard

              title="Visite Uniche (Visitatori)"

              value={new Intl.NumberFormat("it-IT").format(uniqueVisitorsCount)}

              hint="Visitatori registrati nel periodo"

              tooltip="Rappresenta il numero di persone uniche (dispositivi/browser) che hanno visitato il sito. Se un utente accede 10 volte, conta comunque come 1 visitatore unico."

            />

            <CountryBarChart title="Visite per Nazione" data={filteredVisitorCountriesData} />

          </div>



          {/* Colonna Sessioni */}

          <div className="flex flex-col">

            <StatCard

              title="Sessioni Totali"

              value={new Intl.NumberFormat("it-IT").format(uniqueSessionsCount)}

              hint="Interazioni uniche sul sito"

              tooltip="Rappresenta una singola sessione di navigazione sul sito (scade dopo 30 minuti di inattività). Se un utente visita il sito al mattino e poi alla sera, conta come 2 sessioni."

            />

            <CountryBarChart title="Sessioni per Nazione" data={filteredSessionCountriesData} />

          </div>

        </div>

      </Section>



      {/* Panoramica */}

      <Section title="Panoramica ordini" subtitle="Volumi e stati nel periodo selezionato.">

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

          <div>

            <StatCard

              title="Ordini totali"

              value={String(totalOrders)}

              tooltip="Numero totale di ordini creati nel periodo selezionato, inclusi ordini pagati, in attesa e annullati (esclusi carrelli abbandonati)."

            />

            <CountryBarChart title="Ordini per Nazione" data={filteredTotalOrdersCountriesData} />

          </div>

          <div>

            <StatCard

              title="Pagati"

              value={String(paidOrders)}

              tooltip="Numero di ordini che hanno completato con successo il pagamento e sono in fase di preparazione, spediti o consegnati."

            />

            <CountryBarChart title="Pagati per Nazione" data={filteredPaidOrdersCountriesData} />

          </div>

          <div>

            <StatCard

              title="In attesa"

              value={String(pendingOrders)}

              tooltip="Ordini completati ma in attesa di ricezione del pagamento (es. bonifico bancario o transazione Stripe non conclusa)."

            />

            <CountryBarChart title="In attesa per Nazione" data={filteredPendingOrdersCountriesData} />

          </div>

          <div>

            <StatCard

              title="Annullati"

              value={String(canceledOrders)}

              tooltip="Ordini annullati manualmente dall'amministratore o scaduti automaticamente."

            />

            <CountryBarChart title="Annullati per Nazione" data={filteredCanceledOrdersCountriesData} />

          </div>

          <div>

            <StatCard

              title="Annullati al checkout"

              hint="In fase di pagamento"

              value={String(checkoutCanceled)}

              tooltip="Ordini avviati ma in cui l'utente ha interrotto il pagamento durante la sessione di checkout Stripe."

            />

            <CountryBarChart title="Checkout per Nazione" data={filteredCheckoutCanceledCountriesData} />

          </div>

        </div>

      </Section>



      {/* Finanza */}

      <Section title="Finanza" subtitle="Ricavi pagati, fee, rimborsi e medie nel periodo.">

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <div>

            <StatCard

              title="Fatturato (pagati)"

              value={euro(revenueCents)}

              tooltip="Somma lorda degli incassi ricevuti con successo per gli ordini pagati nel periodo."

            />

            <CountryBarChart title="Fatturato per Nazione" data={filteredRevenueCountriesData} valueFormatter={euro} />

          </div>

          <div>

            <StatCard

              title="Netto stimato"

              value={euro(netCents)}

              hint="fatturato − stripe − iva − spedizioni − leonardo"

              tooltip="Stima del ricavo netto trattenuto, calcolato come: fatturato lordo meno le commissioni Stripe, l'IVA, le spedizioni (GLS/manuali) e la quota Leonardo (10%). Allineato con la sezione Conti Leonardo."

            />

            <CountryBarChart title="Netto per Nazione" data={filteredNetCountriesData} valueFormatter={euro} />

          </div>

          <div>

            <StatCard

              title="Valore medio ordine"

              value={euro(aovCents)}

              tooltip="Fatturato lordo diviso per il numero di ordini pagati. Rappresenta la spesa media dei clienti per ogni acquisto."

            />

            <CountryBarChart title="AOV per Nazione" data={filteredAovCountriesData} valueFormatter={euro} />

          </div>

          <div>

            <StatCard

              title="Fee / Refund"

              value={`${(feeRate * 100).toFixed(2)}% / ${(refundRate * 100).toFixed(2)}%`}

              tooltip="Rapporto percentuale tra le commissioni Stripe pagate e il fatturato lordo, unito alla quota percentuale dei rimborsi emessi."

            />

            <CountryBarChart title="Fee e Rimborsi per Nazione" data={filteredFeeRefundCountriesData} valueFormatter={euro} />

          </div>

        </div>

      </Section>



      {/* Operativo */}

      <Section title="Operativo" subtitle="Logistica ed evasione, sempre sul periodo selezionato.">

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard title="Da spedire (nel periodo)" value={String(toShipInPeriod)} tooltip="Numero di ordini pagati e pronti per la logistica creati all'interno del periodo selezionato che non sono ancora stati spediti." />

          <StatCard

            title="Evasione media"

            value={avgFulfillmentMs ? `${avgFulfillmentHours}h` : "—"}

            hint="paidAt → shippedAt (ordini spediti nel periodo)"

            tooltip="Tempo medio trascorso tra la ricezione del pagamento dell'ordine e l'inserimento del tracking di spedizione (calcolato sugli ordini evasi nel periodo)."

          />

        </div>

      </Section>



      {/* Selettore Mercato (Prodotti & Trend) */}

      <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs">

        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Filtro Mercato (Filtra Prodotti e Trend sotto)</div>

        <div className="flex flex-wrap gap-1.5">

          {marketsList.map((m) => {

            const isActive = activeMarket === m.code;

            return (

              <Link

                key={m.code}

                href={getMarketQuery(m.code || undefined)}

                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${

                  isActive

                    ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"

                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:text-neutral-900 hover:bg-neutral-100"

                }`}

              >

                <span>{m.flag}</span>

                <span>{m.label}</span>

              </Link>

            );

          })}

        </div>

      </div>



      {/* Prodotti */}

      <Section title="Prodotti" subtitle="Top prodotti/varianti per ricavo (pagati) nel periodo.">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">

              <tr>

                <th className="py-1 pr-4">Prodotto</th>

                <th className="py-1 pr-4">Variante</th>

                <th className="py-1 pr-4">Qty</th>

                <th className="py-1 pr-4 text-right">Ricavi</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-200">

              {topProducts.map((p) => (

                <tr key={p.rowKey}>

                  <td className="py-1 pr-4 font-semibold text-neutral-900">{p.title}</td>

                  <td className="py-1 pr-4 text-neutral-600">{p.variantLabel}</td>

                  <td className="py-1 pr-4 text-neutral-700">{Number(p.qty)}</td>

                  <td className="py-1 pr-4 text-right font-extrabold text-neutral-900">

                    {euro(Number(p.revenueCents))}

                  </td>

                </tr>

              ))}



              {topProducts.length === 0 ? (

                <tr>

                  <td className="py-4 text-neutral-500" colSpan={4}>

                    Nessun dato prodotti per il periodo selezionato.

                  </td>

                </tr>

              ) : null}

            </tbody>

          </table>

        </div>

      </Section>



      {/* Trend */}

      <Section title="Trend" subtitle="Andamento giornaliero sul periodo selezionato (barre = fatturato pagato).">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">

              <tr>

                <th className="py-1 pr-4">Data</th>

                <th className="py-1 pr-4">Ordini</th>

                <th className="py-1 pr-4">Pagati</th>

                <th className="py-1 pr-4">Fatturato (pagati)</th>

                <th className="py-1 pr-4">Bar</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-200">

              {rows.map((r) => {

                const paidGross = Number(r.paidGrossCents ?? 0);

                const w = Math.round((paidGross / maxPaidGross) * 200);

                return (

                  <tr key={r.day}>

                    <td className="py-1 pr-4 font-semibold text-neutral-900">{r.day}</td>

                    <td className="py-1 pr-4 text-neutral-700">{r.orders}</td>

                    <td className="py-1 pr-4 text-neutral-700">{r.paidOrders}</td>

                    <td className="py-1 pr-4 font-extrabold text-neutral-900">

                      {euro(paidGross)}

                    </td>

                    <td className="py-1 pr-4">

                      <div className="h-1.5 w-[200px] rounded-full bg-neutral-100">

                        <div className="h-1.5 rounded-full bg-neutral-600 shadow-xs" style={{ width: `${w}px` }} />

                      </div>

                    </td>

                  </tr>

                );

              })}



              {rows.length === 0 ? (

                <tr>

                  <td className="py-4 text-neutral-500" colSpan={5}>

                    Nessun dato per il periodo selezionato.

                  </td>

                </tr>

              ) : null}

            </tbody>

          </table>

        </div>

      </Section>

    </div>

  );

}

