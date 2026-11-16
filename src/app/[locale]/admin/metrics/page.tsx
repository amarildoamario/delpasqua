import { SITE_ANALYTICS_FILTER } from "@/lib/server/analyticsFilters";
import React from "react";
import RangePicker from "@/app/[locale]/admin/dashboard/RangerPicker";
import { prisma } from "@/lib/server/prisma";
import {
  metricsPeriod,
  readSalesMetrics,
  salesConversion,
  summarizeCartDemand,
} from "@/lib/server/salesMetrics";
import PageHeader from "../_components/PageHeader";
import CommerceInsights from "../_components/CommerceInsights";
import PageRankings from "../_components/PageRankings";
import { summarizePageRankings } from "@/lib/pageRankings";
import { ACTIVITY_TIMEFRAMES, readActivityTimeline } from "@/lib/server/activityTimeline";
import { readCommerceInsights } from "@/lib/server/commerceInsights";
import { readCustomerMetrics } from "@/lib/server/customerMetrics";
import InfoTooltip from "../_components/InfoTooltip";
import { METRIC_DESCRIPTIONS } from "../_components/metricDescriptions";

export const dynamic = "force-dynamic";

function formatEur(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function truthy(v?: string) {
  if (!v) return false;
  const s = v.toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function pct(n: number | null) {
  return n === null ? "—" : (n * 100).toFixed(1) + "%";
}

function nice(n: number) {
  return new Intl.NumberFormat("it-IT").format(n);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function msToNice(ms?: number | null) {
  if (ms === null || ms === undefined || ms < 0) return "—";
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export default async function AdminMetricsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const startParam = getOne(sp.start);
  const endParam = getOne(sp.end);

  // ✅ internal robusto
  const includeInternal = truthy(getOne(sp.internal));

  const { start, endExclusive, startISO, endISO } = metricsPeriod(startParam, endParam);

  const rangeWhere = { createdAt: { gte: start, lt: endExclusive } };

  const SITE_ONLY = SITE_ANALYTICS_FILTER;

  // ✅ Se internal=1 NON filtriamo nulla (né env né isInternal)
  // ✅ Se internal=0 applichiamo filtro qualità
  const QUALITY_FILTER = includeInternal ? {} : { isInternal: false, env: "prod" as const };

  // ✅ DEBUG: se con internal=1 risultano 0 qui, significa che nel DB NON stai salvando eventi
  const [dbgTotal, dbgRange, dbgRangePV, dbgRangeProd] = includeInternal
    ? await Promise.all([
        prisma.analyticsEvent.count(),
        prisma.analyticsEvent.count({ where: rangeWhere }),
        prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "page_view" } }),
        prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "product_view" } }),
      ])
    : [0, 0, 0, 0];

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

  const sales = await readSalesMetrics(prisma, start, endExclusive);
  const conversionAnalytics = salesConversion(sales.paidOrders, uniqueSessions);

  const avgPagesPerSession = uniqueSessions > 0 ? pageViews / uniqueSessions : 0;

  const sessionPageCounts = sessions.map((s) => s._count?.sessionId ?? 1).sort((a, b) => a - b);
  let medianPagesPerSession: number | null = null;
  if (sessionPageCounts.length > 0) {
    const mid = Math.floor(sessionPageCounts.length / 2);
    medianPagesPerSession = sessionPageCounts.length % 2 !== 0
      ? sessionPageCounts[mid]
      : Math.round(((sessionPageCounts[mid - 1] + sessionPageCounts[mid]) / 2) * 10) / 10;
  }
  const bounceSessions = sessionPageCounts.filter((c) => c === 1).length;
  const bounceRate = uniqueSessions > 0 ? bounceSessions / uniqueSessions : null;
  const revenuePerSessionEur = uniqueSessions > 0 ? +(sales.realizedRevenueEur / uniqueSessions).toFixed(2) : null;

  const [pageViewGroups, pageDurationGroups] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER },
      _count: { path: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { ...rangeWhere, type: "page_leave", durationMs: { gte: 0 }, ...SITE_ONLY, ...QUALITY_FILTER },
      _sum: { durationMs: true }, _count: { durationMs: true }, _max: { durationMs: true },
    }),
  ]);
  const pageRankings = summarizePageRankings(pageViewGroups, pageDurationGroups);

  const [topVariantViews, topProductViews] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["productKey", "variantKey"],
      where: { ...rangeWhere, type: "product_view", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 20,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productKey"],
      where: { ...rangeWhere, type: "product_view", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 10,
    }),
  ]);
  const mostViewedProduct = topProductViews[0] ?? null;

  const cartsTotal = await prisma.analyticsEvent.groupBy({
    by: ["cartId"],
    where: {
      ...rangeWhere,
      type: { in: ["add_to_cart", "begin_checkout"] },
      ...QUALITY_FILTER,
      cartId: { not: "" },
    },
    _count: { cartId: true },
  });

  const cartTotalN = cartsTotal.length;
  const avgPayMs = sales.avgPaymentMs;

  const [pageViewsByDevice, visitorsByDevicePairs, sessionsByDevicePairs] =
    await Promise.all([
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
    const k = row.device ?? "unknown";
    deviceVisitors.set(k, (deviceVisitors.get(k) ?? 0) + 1);
  }

  const deviceSessions = new Map<string, number>();
  for (const row of sessionsByDevicePairs) {
    const k = row.device ?? "unknown";
    deviceSessions.set(k, (deviceSessions.get(k) ?? 0) + 1);
  }

  const devicePurchases = new Map(sales.devices.map((row) => [row.device, row.purchases]));
  const deviceAvgPayMs = new Map(sales.devices.map((row) => [row.device, row.avgPaymentMs]));

  const allDevices = Array.from(new Set([...devicePageviews.keys(), ...deviceVisitors.keys(), ...deviceSessions.keys(), ...devicePurchases.keys()]));
  allDevices.sort((a, b) => (devicePageviews.get(b) ?? 0) - (devicePageviews.get(a) ?? 0));
  
  // --- v3 & v4: metriche commerciali, lead, contatti, litraggio ---
  const [
    listViews,
    productClicks,
    checkoutClicks,
    cartsCheckoutClicked,
    addToCartByVariant,
    variantSelections,
    contactClicksGroup,
    viewCartCount,
    sessionsWithAddToCartGroup,
    allAddToCartEvents,
    contactMessagesCount,
    tastingBookingsCount,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "view_item_list", ...QUALITY_FILTER } }),
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "product_click", ...QUALITY_FILTER } }),
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "checkout_click", ...QUALITY_FILTER } }),
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
      take: 20,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productKey", "variantKey"],
      where: { ...rangeWhere, type: "select_variant", ...QUALITY_FILTER, productKey: { not: "" } },
      _count: { productKey: true },
      orderBy: { _count: { productKey: "desc" } },
      take: 20,
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

  const measuredSessions = new Set(sessions.map((row) => row.sessionId));
  const sessionsWithAddToCartN = sessionsWithAddToCartGroup.filter((row) => measuredSessions.has(row.sessionId)).length;
  const sessionAddToCartRate = salesConversion(sessionsWithAddToCartN, uniqueSessions);

  const {
    litersDemandedTotal, litersOilDemanded, litersWineDemanded,
    cansUnits, bottlesUnits, cansPct, bottlesPct, unknownFormatUnits,
    potentialCartRevenueEur, avgCartValueEur,
    cartsWithAdditions, unpricedUnits, addsByProduct,
  } = summarizeCartDemand(allAddToCartEvents);

  const addToCartTotalMap = addsByProduct;
  const [insights, customers, activity] = await Promise.all([
    readCommerceInsights(prisma, start, endExclusive, includeInternal),
    readCustomerMetrics(prisma),
    readActivityTimeline(prisma, getOne(sp.activity), endISO, includeInternal),
  ]);
  const adSpendSetting = await (prisma as { setting?: { findUnique: (args: unknown) => Promise<{ value: string } | null> } }).setting?.findUnique?.({ where: { key: "monthlyAdSpendEur" } })?.catch(() => null);
  const monthlyAdSpendEur = adSpendSetting && !Number.isNaN(Number(adSpendSetting.value)) ? Number(adSpendSetting.value) : 0;
  const cacEur = monthlyAdSpendEur > 0 && sales.newPayingCustomers > 0 ? +(monthlyAdSpendEur / sales.newPayingCustomers).toFixed(2) : null;
  const roas = monthlyAdSpendEur > 0 ? +(sales.realizedRevenueEur / monthlyAdSpendEur).toFixed(2) : null;

  const activityLinks = ACTIVITY_TIMEFRAMES.map((item) => {
    const query = new URLSearchParams({ start: startISO, end: endISO, activity: item.key });
    if (includeInternal) query.set("internal", "1");
    return { key: item.key, label: item.label, href: `?${query.toString()}#activity-timeline` };
  });

 return (
  <div className="space-y-5">
    <PageHeader
  title="Metrics"
  subtitle={
    <>
      Periodo: <span className="font-semibold">{startISO}</span> → <span className="font-semibold">{endISO}</span>
      {includeInternal ? <span className="ml-2 text-xs font-bold text-amber-600">(include internal)</span> : null}
    </>
  }
  actions={
    <a
      href={`/admin/metrics/export?start=${startISO}&end=${endISO}${includeInternal ? "&internal=1" : ""}`}
      className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 sm:py-2 text-sm font-extrabold text-neutral-900 shadow-sm hover:bg-neutral-50"
    >
      Scarica report (.json)
    </a>
  }
/>


    <RangePicker startISO={startISO} endISO={endISO} />
    <CommerceInsights insights={insights} customers={customers} activity={activity} activityLinks={activityLinks} />

    {/* ✅ DEBUG BOX solo quando internal=1 */}
    {includeInternal ? (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-extrabold">Debug (internal=1)</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            Eventi totali DB: <b>{nice(dbgTotal)}</b>
          </div>
          <div>
            Eventi nel range: <b>{nice(dbgRange)}</b>
          </div>
          <div>
            page_view nel range: <b>{nice(dbgRangePV)}</b>
          </div>
          <div>
            product_view nel range: <b>{nice(dbgRangeProd)}</b>
          </div>
        </div>
        <div className="mt-2 text-xs opacity-80">
          Se questi sono 0, NON stai salvando eventi nel DB (o stai usando un DB diverso tra API e dashboard).
        </div>
      </div>
    ) : null}

    {/* 💼 INTELLIGENCE COMMERCIALE & FATTURATO */}
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 border-b border-neutral-200 pb-1.5">
        <h2 className="text-sm sm:text-base font-extrabold text-neutral-900">
          Commerciale & Valore Economico
        </h2>
        <span className="text-[11px] sm:text-xs font-semibold text-neutral-500">
          Incassato, ordini, scontrino medio e valore carrelli
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Kpi
          title="Fatturato Incassato"
          value={formatEur(sales.realizedRevenueEur)}
          subtitle={`${nice(sales.paidOrders)} ordini pagati nel periodo`}
        />
        <Kpi
          title="Scontrino Medio (AOV)"
          value={formatEur(sales.realizedAovEur)}
          subtitle="Media valore ordini pagati"
        />
        <Kpi
          title="Valore Prodotti Aggiunti"
          value={formatEur(potentialCartRevenueEur)}
          subtitle={`Media: ${formatEur(avgCartValueEur)} (${nice(cartsWithAdditions)} carrelli; ${nice(unpricedUnits)} n/d)`}
        />
        <Kpi
          title="Valore Checkout Non Pagati"
          value={formatEur(sales.lostCheckoutRevenueEur)}
          subtitle={`${nice(sales.unpaidCheckouts)} non pagati (inclusi in corso)`}
        />
        <Kpi
          title="Attach Rate Olio + Vino"
          value={pct(sales.bundleOlioVinoRate)}
          subtitle="Ordini pagati con olio e vino"
        />
        <Kpi
          title="Riordini nel Periodo"
          value={pct(sales.repeatCustomerRate)}
          subtitle={`${nice(sales.repeatPayingCustomers)} clienti con ≥ 2 ordini`}
        />
        <Kpi
          title="Litri Richiesti a Carrello"
          value={`${round1(litersDemandedTotal)} L`}
          subtitle={`Olio: ${round1(litersOilDemanded)}L · Vino: ${round1(litersWineDemanded)}L`}
        />
        <Kpi
          title="Formato: Latte vs Bottiglie"
          value={`${cansPct}% / ${bottlesPct}%`}
          subtitle={`${nice(cansUnits)} latte · ${nice(bottlesUnits)} bott. · ${nice(unknownFormatUnits)} altri`}
        />
        <Kpi
          title="Revenue per Session (RPS)"
          value={formatEur(revenuePerSessionEur)}
          subtitle={`${nice(uniqueSessions)} visite totali`}
        />
        <Kpi
          title="Margine Contribuzione Stimato"
          value={formatEur(sales.estimatedContributionMarginEur)}
          subtitle={`~60% su ${formatEur(sales.netGoodsRevenueEur)} netto`}
        />
        <Kpi
          title="Nuovi Acquirenti vs Riacquisti"
          value={`${nice(sales.newPayingCustomers)} / ${nice(sales.repeatPayingCustomers)}`}
          subtitle={`Nuovi: ${formatEur(sales.newRevenueEur)} · Riord.: ${formatEur(sales.repeatRevenueEur)}`}
        />
        <Kpi
          title="CAC e ROAS"
          value={monthlyAdSpendEur > 0 ? `${formatEur(cacEur)} / ${roas}x` : "—"}
          subtitle={monthlyAdSpendEur > 0 ? `Ads: ${formatEur(monthlyAdSpendEur)}/mese` : "Ads non configurate"}
        />
      </div>
    </div>

    {/* 📞 LEAD & CONTATTI DIRETTI */}
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 border-b border-neutral-200 pb-1.5">
        <h2 className="text-sm sm:text-base font-extrabold text-neutral-900">
          Lead & Conversioni Dirette (B2B / Off-line)
        </h2>
        <span className="text-[11px] sm:text-xs font-semibold text-neutral-500">
          Contatti, messaggi e visite in frantoio fuori dal carrello
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <Kpi
          title="Click WhatsApp"
          value={nice(contactMap.get("whatsapp") ?? 0)}
          subtitle="Chat diretta avviata"
        />
        <Kpi
          title="Click Telefono"
          value={nice(contactMap.get("phone") ?? 0)}
          subtitle="Chiamate al frantoio"
        />
        <Kpi
          title="Click Email"
          value={nice(contactMap.get("email") ?? 0)}
          subtitle="Email dirette"
        />
        <Kpi
          title="Messaggi Form"
          value={nice(contactMessagesCount)}
          subtitle="Richieste ricevute dal form"
        />
        <Kpi
          title="Degustazioni"
          value={nice(tastingBookingsCount)}
          subtitle="Prenotazioni tour/visite"
        />
      </div>
    </div>

    {/* KPI (v2) */}
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3">
      <Kpi title="Visitatori unici" value={nice(uniqueVisitors)} subtitle="(solo sito)" />
      <Kpi title="Sessioni" value={nice(uniqueSessions)} subtitle="(solo sito)" />
      <Kpi title="Pageviews" value={nice(pageViews)} subtitle={`leave: ${nice(pageLeaves)} (${pageViews > 0 ? pct(pageLeaves / pageViews) : "—"})`} />
      <Kpi title="Pagine / sessione" value={round1(avgPagesPerSession)} subtitle={`med: ${medianPagesPerSession ?? "—"} · 1p: ${pct(bounceRate)}`} />
      <Kpi
        title="Conversione vendite"
        value={pct(conversionAnalytics)}
        subtitle={`${nice(sales.paidOrders)} / ${nice(uniqueSessions)} visite`}
      />
      <Kpi title="Ordini effettuati" value={nice(sales.paidOrders)} subtitle="pagati · test esclusi" />
    </div>

    {/* Funnel + tempo pagamento */}
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
      <Kpi title="Carrelli totali" value={nice(cartTotalN)} subtitle="add_to_cart / checkout" />
      <Kpi
        title="Session Add-to-Cart"
        value={pct(sessionAddToCartRate)}
        subtitle={`${nice(sessionsWithAddToCartN)} / ${nice(uniqueSessions)} sess.`}
      />
      <Kpi title="Vendite confermate" value={nice(sales.paidOrders)} subtitle="ordini commerciali" />
      <Kpi
        title="Checkout non pagati"
        value={pct(sales.unpaidCheckoutRate)}
        subtitle={`${nice(sales.unpaidCheckouts)} / ${nice(sales.startedCheckouts)} creati`}
      />
      <Kpi
        title="Tempo medio pagamento"
        value={msToNice(avgPayMs)}
        subtitle={`${nice(sales.paymentSamples)} campioni`}
      />
    </div>

    {/* Step Funnel & List CTR */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <Kpi title="Carrelli visti (view_cart)" value={nice(viewCartCount)} subtitle="Aperture carrello" />
      <Kpi title="List CTR" value={pct(listCtr)} subtitle={`${nice(productClicks)} / ${nice(listViews)} liste`} />
      <Kpi
        title="Checkout click rate"
        value={cartTotalN > 0 ? pct(checkoutClickRate) : "—"}
        subtitle={`${nice(cartsCheckoutClickedN)} carrelli (${nice(checkoutClicks)} clic)`}
      />
      <Kpi
        title="Abbandono Funnel"
        value={pct(sales.unpaidCheckoutRate)}
        subtitle={`Drop-off: ${cartTotalN > 0 ? pct(1 - checkoutClickRate) : "—"}`}
      />
    </div>

    {/* Device */}
    <div className="rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-3.5 sm:p-4 shadow-sm">
      <div className="text-xs sm:text-sm font-extrabold text-neutral-900">
        Device (pageviews, unici, sessioni, conv, tempo pagamento)
      </div>

      <div className="mt-2.5 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {allDevices.map((dev) => {
          const pv = devicePageviews.get(dev) ?? 0;
          const vs = deviceVisitors.get(dev) ?? 0;
          const ss = deviceSessions.get(dev) ?? 0;
          const purchases = devicePurchases.get(dev) ?? 0;
          const pps = ss > 0 ? pv / ss : 0;
          const convDev = salesConversion(purchases, ss);
          const avgPayDev = deviceAvgPayMs.get(dev) ?? null;

          return (
            <div
              key={dev}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-2.5 sm:p-3"
            >
              <div className="text-[11px] font-black uppercase tracking-wide text-neutral-600 border-b border-neutral-200/80 pb-1">
                {dev}
              </div>
              <div className="mt-1.5 space-y-0.5 text-[11px] sm:text-xs tabular-nums">
                <Row label="PV" value={nice(pv)} />
                <Row label="Unici" value={nice(vs)} />
                <Row label="Sessioni" value={nice(ss)} />
                <Row label="Pag/sess" value={String(round1(pps))} />
                <Row label="Ordini" value={nice(purchases)} />
                <Row label="Conv" value={pct(convDev)} />
                <Row label="T. pag." value={msToNice(avgPayDev)} />
              </div>
            </div>
          );
        })}
        {!allDevices.length ? <div className="text-sm text-neutral-600">Nessun dato.</div> : null}
      </div>
    </div>

    {/* Tabelle */}
    <div className="grid gap-4 xl:grid-cols-2">
      <PageRankings rows={pageRankings} />

      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-extrabold text-neutral-900">Prodotti più visti (per variante)</div>

        <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <div className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            Prodotto più visto (somma varianti)
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="truncate font-semibold text-neutral-900">
              {mostViewedProduct?.productKey ?? "—"}
            </div>
            <div className="shrink-0 text-lg font-extrabold text-neutral-900">
              {mostViewedProduct ? nice(mostViewedProduct._count.productKey) : "—"}
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {topVariantViews.map((c, i) => (
                <tr
                  key={`${c.productKey ?? "x"}-${c.variantKey ?? "y"}-${i}`}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-3 py-2 font-semibold text-neutral-900 break-words max-w-[160px] sm:max-w-none">{c.productKey ?? "—"}</td>
                  <td className="px-3 py-2 text-neutral-600 break-words">{c.variantKey ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap">{nice(c._count.productKey)}</td>
                </tr>
              ))}
              {!topVariantViews.length ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-neutral-600">
                    Nessuna view prodotto nel periodo (evento <code>product_view</code> mancante).
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* ✅ Tabelle v3 */}
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-extrabold text-neutral-900">Add to cart (per variante)</div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Adds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {addToCartByVariant.map((r, i) => (
                <tr
                  key={`${r.productKey ?? "x"}-${r.variantKey ?? "y"}-${i}`}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-3 py-2 font-semibold text-neutral-900 break-words max-w-[160px] sm:max-w-none">{r.productKey ?? "—"}</td>
                  <td className="px-3 py-2 text-neutral-600 break-words">{r.variantKey ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap">{nice(r._count.productKey)}</td>
                </tr>
              ))}
              {!addToCartByVariant.length ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-neutral-600">
                    Nessun <code>add_to_cart</code> nel periodo.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-extrabold text-neutral-900">Select variant (per variante)</div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Selections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {variantSelections.map((r, i) => (
                <tr
                  key={`${r.productKey ?? "x"}-${r.variantKey ?? "y"}-${i}`}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-3 py-2 font-semibold text-neutral-900 break-words max-w-[160px] sm:max-w-none">{r.productKey ?? "—"}</td>
                  <td className="px-3 py-2 text-neutral-600 break-words">{r.variantKey ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap">{nice(r._count.productKey)}</td>
                </tr>
              ))}
              {!variantSelections.length ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-neutral-600">
                    Nessun <code>select_variant</code> nel periodo.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm xl:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="text-sm font-extrabold text-neutral-900">
            Cart-to-Detail Rate per Prodotto (Conversione Scheda)
          </div>
          <span className="text-xs text-neutral-500">
            Aggiunte a carrello / Visualizzazioni scheda prodotto
          </span>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-2">Prodotto</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Views Totali</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Aggiunte a Carrello</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Cart-to-Detail Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {topProductViews.map((p) => {
                const adds = addToCartTotalMap.get(p.productKey ?? "") ?? 0;
                const views = p._count.productKey;
                const rate = views > 0 ? adds / views : 0;
                return (
                  <tr key={p.productKey ?? "x"} className="hover:bg-neutral-50">
                    <td className="px-3 py-2 font-semibold text-neutral-900 break-words max-w-[160px] sm:max-w-none">{p.productKey ?? "—"}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{nice(views)}</td>
                    <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap">{nice(adds)}</td>
                    <td className="px-3 py-2 text-right font-extrabold text-emerald-700 whitespace-nowrap">{pct(rate)}</td>
                  </tr>
                );
              })}
              {!topProductViews.length ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-neutral-600">Nessuna view prodotto nel periodo.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-600">{label}</span>
      <span className="font-extrabold text-neutral-900">{value}</span>
    </div>
  );
}

function Kpi({ title, value, subtitle }: { title: string; value: React.ReactNode; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-2.5 sm:p-3.5 shadow-xs flex flex-col justify-between min-w-0">
      <div className="flex items-start justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-neutral-500 leading-tight">
        <span className="line-clamp-2">{title}</span>
        <InfoTooltip label={title} description={METRIC_DESCRIPTIONS[title] ?? subtitle ?? title} />
      </div>
      <div className="mt-1 text-base sm:text-xl font-extrabold text-neutral-900 tabular-nums truncate">{value}</div>
      {subtitle ? <div className="mt-0.5 text-[10px] sm:text-[11px] text-neutral-500 leading-tight line-clamp-2">{subtitle}</div> : null}
    </div>
  );
}
