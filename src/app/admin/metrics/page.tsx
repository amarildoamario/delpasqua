import React from "react";
import RangePicker from "@/app/admin/dashboard/RangerPicker";
import { prisma } from "@/lib/server/prisma";
import PageHeader from "../_components/PageHeader";

export const dynamic = "force-dynamic";

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function truthy(v?: string) {
  if (!v) return false;
  const s = v.toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateOnly(s?: string) {
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pct(n: number) {
  return (n * 100).toFixed(1) + "%";
}

function nice(n: number) {
  return new Intl.NumberFormat("it-IT").format(n);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function msToNice(ms?: number | null) {
  if (!ms || ms <= 0) return "—";
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

function normalizeForDuration(path: string) {
  if (path.startsWith("/shop/")) {
    const q = path.indexOf("?");
    return q >= 0 ? path.slice(0, q) : path;
  }
  return path;
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

  const [pageViews, pageLeaves, ordersCount] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER } }),
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "page_leave", ...SITE_ONLY, ...QUALITY_FILTER } }),
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive } } }),
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

  const purchasesDistinct = await prisma.analyticsEvent.groupBy({
    by: ["cartId"],
    where: { ...rangeWhere, type: "purchase", ...QUALITY_FILTER, cartId: { not: "" } },
    _count: { cartId: true },
  });
  const cartsPaidN = purchasesDistinct.length;
  const conversionAnalytics = uniqueVisitors > 0 ? cartsPaidN / uniqueVisitors : 0;

  const avgPagesPerSession = uniqueSessions > 0 ? pageViews / uniqueSessions : 0;

  const topPages = await prisma.analyticsEvent.groupBy({
    by: ["path"],
    where: { ...rangeWhere, type: "page_view", ...SITE_ONLY, ...QUALITY_FILTER },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: 20,
  });

  const avgDurations = await prisma.analyticsEvent.groupBy({
    by: ["path"],
    where: { ...rangeWhere, type: "page_leave", durationMs: { not: null }, ...SITE_ONLY, ...QUALITY_FILTER },
    _avg: { durationMs: true },
  });

  const durationAgg = new Map<string, { sum: number; n: number }>();
  for (const a of avgDurations) {
    if (!a.path || !a._avg.durationMs) continue;
    const base = normalizeForDuration(a.path);
    const cur = durationAgg.get(base) ?? { sum: 0, n: 0 };
    cur.sum += a._avg.durationMs;
    cur.n += 1;
    durationAgg.set(base, cur);
  }

  const avgByPath = new Map<string, number>();
  for (const [base, v] of durationAgg.entries()) avgByPath.set(base, Math.round(v.sum / v.n));

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
  const cartAbandonedN = Math.max(0, cartTotalN - cartsPaidN);

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
  const avgPayMs = payDurations.length ? Math.round(payDurations.reduce((a, b) => a + b, 0) / payDurations.length) : null;

  const [pageViewsByDevice, visitorsByDevicePairs, sessionsByDevicePairs, purchasesByDeviceCartPairs, beginByDeviceCart, purchaseByDeviceCart2] =
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
    const k = row.device ?? "unknown";
    deviceVisitors.set(k, (deviceVisitors.get(k) ?? 0) + 1);
  }

  const deviceSessions = new Map<string, number>();
  for (const row of sessionsByDevicePairs) {
    const k = row.device ?? "unknown";
    deviceSessions.set(k, (deviceSessions.get(k) ?? 0) + 1);
  }

  const devicePurchases = new Map<string, number>();
  for (const row of purchasesByDeviceCartPairs) {
    const k = row.device ?? "unknown";
    devicePurchases.set(k, (devicePurchases.get(k) ?? 0) + 1);
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

  const allDevices = Array.from(new Set([...devicePageviews.keys(), ...deviceVisitors.keys(), ...deviceSessions.keys(), ...devicePurchases.keys()]));
  allDevices.sort((a, b) => (devicePageviews.get(b) ?? 0) - (devicePageviews.get(a) ?? 0));
  
    // --- v3: list CTR, checkout click rate, add_to_cart per variante, select_variant ---
  const [listViews, productClicks, checkoutClicks, cartsCheckoutClicked] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "view_item_list", ...QUALITY_FILTER } }),
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "product_click", ...QUALITY_FILTER } }),
    prisma.analyticsEvent.count({ where: { ...rangeWhere, type: "checkout_click", ...QUALITY_FILTER } }),
    prisma.analyticsEvent.groupBy({
      by: ["cartId"],
      where: { ...rangeWhere, type: "checkout_click", ...QUALITY_FILTER, cartId: { not: "" } },
      _count: { cartId: true },
    }),
  ]);

  const listCtr = listViews > 0 ? productClicks / listViews : 0;
  const cartsCheckoutClickedN = cartsCheckoutClicked.length;
  const checkoutClickRate = cartTotalN > 0 ? cartsCheckoutClickedN / cartTotalN : 0;

  const [addToCartByVariant, variantSelections] = await Promise.all([
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
  ]);

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
      className="shrink-0 inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-extrabold text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-950/40"
    >
      Scarica report (.json)
    </a>
  }
/>


    <RangePicker startISO={startISO} endISO={endISO} />

    {/* ✅ DEBUG BOX solo quando internal=1 */}
    {includeInternal ? (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100">
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

    {/* KPI (v2) */}
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <Kpi title="Visitatori unici" value={nice(uniqueVisitors)} subtitle="(solo sito)" />
      <Kpi title="Sessioni" value={nice(uniqueSessions)} subtitle="(solo sito)" />
      <Kpi title="Pageviews" value={nice(pageViews)} subtitle={`leave: ${nice(pageLeaves)}`} />
      <Kpi title="Pagine / sessione" value={round1(avgPagesPerSession)} subtitle="(media)" />
      <Kpi
        title="Conv. (analytics)"
        value={pct(conversionAnalytics)}
        subtitle={`${nice(cartsPaidN)} acquisti (cartId)`}
      />
      <Kpi title="Ordini (DB)" value={nice(ordersCount)} subtitle="(conteggio raw)" />
    </div>

    {/* Funnel + tempo pagamento */}
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Kpi title="Carrelli totali" value={nice(cartTotalN)} subtitle="add_to_cart / begin_checkout" />
      <Kpi title="Carrelli pagati" value={nice(cartsPaidN)} subtitle="purchase" />
      <Kpi
        title="Abbandono"
        value={cartTotalN > 0 ? pct(cartAbandonedN / cartTotalN) : "—"}
        subtitle={`${nice(cartAbandonedN)} abbandonati`}
      />
      <Kpi
        title="Tempo medio pagamento"
        value={msToNice(avgPayMs)}
        subtitle={`${nice(payDurations.length)} acquisti misurati`}
      />
    </div>

    {/* ✅ KPI v3 */}
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Kpi title="List CTR" value={pct(listCtr)} subtitle={`${nice(productClicks)} click / ${nice(listViews)} liste`} />
      <Kpi
        title="Checkout click rate"
        value={cartTotalN > 0 ? pct(checkoutClickRate) : "—"}
        subtitle={`${nice(cartsCheckoutClickedN)} carrelli con click su pagamento`}
      />
      <Kpi title="Checkout click (eventi)" value={nice(checkoutClicks)} subtitle="checkout_click" />
      <Kpi title="Product click (eventi)" value={nice(productClicks)} subtitle="product_click" />
    </div>

    {/* Device */}
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
        Device (pageviews, unici, sessioni, conv, tempo pagamento)
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {allDevices.map((dev) => {
          const pv = devicePageviews.get(dev) ?? 0;
          const vs = deviceVisitors.get(dev) ?? 0;
          const ss = deviceSessions.get(dev) ?? 0;
          const purchases = devicePurchases.get(dev) ?? 0;
          const pps = ss > 0 ? pv / ss : 0;
          const convDev = vs > 0 ? purchases / vs : 0;
          const avgPayDev = deviceAvgPayMs.get(dev) ?? null;

          return (
            <div
              key={dev}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950/40"
            >
              <div className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {dev}
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <Row label="Pageviews" value={nice(pv)} />
                <Row label="Visitatori unici" value={nice(vs)} />
                <Row label="Sessioni" value={nice(ss)} />
                <Row label="Pagine / sessione" value={String(round1(pps))} />
                <Row label="Acquisti" value={nice(purchases)} />
                <Row label="Conversione" value={pct(convDev)} />
                <Row label="Tempo pagamento" value={msToNice(avgPayDev)} />
              </div>
            </div>
          );
        })}
        {!allDevices.length ? <div className="text-sm text-neutral-600 dark:text-neutral-300">Nessun dato.</div> : null}
      </div>
    </div>

    {/* Tabelle */}
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">Pagine più viste</div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              <tr>
                <th className="px-3 py-2">Pagina</th>
                <th className="px-3 py-2 text-right">Views</th>
                <th className="px-3 py-2 text-right">Tempo medio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {topPages.map((p) => (
                <tr key={p.path ?? "null"} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40">
                  <td className="px-3 py-2">
                    <div className="truncate font-semibold text-neutral-900 dark:text-neutral-100">{p.path ?? "—"}</div>
                  </td>
                  <td className="px-3 py-2 text-right font-extrabold">{nice(p._count.path)}</td>
                  <td className="px-3 py-2 text-right text-neutral-600 dark:text-neutral-300">
                    {msToNice(avgByPath.get(normalizeForDuration(p.path ?? "")) ?? null)}
                  </td>
                </tr>
              ))}
              {!topPages.length ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-neutral-600 dark:text-neutral-300">
                    Nessun dato nel periodo.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">Prodotti più visti (per variante)</div>

        <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950/40">
          <div className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Prodotto più visto (somma varianti)
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
              {mostViewedProduct?.productKey ?? "—"}
            </div>
            <div className="shrink-0 text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
              {mostViewedProduct ? nice(mostViewedProduct._count.productKey) : "—"}
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2 text-right">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {topVariantViews.map((c, i) => (
                <tr
                  key={`${c.productKey ?? "x"}-${c.variantKey ?? "y"}-${i}`}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
                >
                  <td className="px-3 py-2 font-semibold text-neutral-900 dark:text-neutral-100">{c.productKey ?? "—"}</td>
                  <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{c.variantKey ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-extrabold">{nice(c._count.productKey)}</td>
                </tr>
              ))}
              {!topVariantViews.length ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-neutral-600 dark:text-neutral-300">
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
      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">Add to cart (per variante)</div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2 text-right">Adds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {addToCartByVariant.map((r, i) => (
                <tr
                  key={`${r.productKey ?? "x"}-${r.variantKey ?? "y"}-${i}`}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
                >
                  <td className="px-3 py-2 font-semibold text-neutral-900 dark:text-neutral-100">{r.productKey ?? "—"}</td>
                  <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{r.variantKey ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-extrabold">{nice(r._count.productKey)}</td>
                </tr>
              ))}
              {!addToCartByVariant.length ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-neutral-600 dark:text-neutral-300">
                    Nessun <code>add_to_cart</code> nel periodo.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">Select variant (per variante)</div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2 text-right">Selections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {variantSelections.map((r, i) => (
                <tr
                  key={`${r.productKey ?? "x"}-${r.variantKey ?? "y"}-${i}`}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
                >
                  <td className="px-3 py-2 font-semibold text-neutral-900 dark:text-neutral-100">{r.productKey ?? "—"}</td>
                  <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{r.variantKey ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-extrabold">{nice(r._count.productKey)}</td>
                </tr>
              ))}
              {!variantSelections.length ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-neutral-600 dark:text-neutral-300">
                    Nessun <code>select_variant</code> nel periodo.
                  </td>
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
      <span className="text-neutral-600 dark:text-neutral-300">{label}</span>
      <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  );
}

function Kpi({ title, value, subtitle }: { title: string; value: React.ReactNode; subtitle?: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{title}</div>
      <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">{value}</div>
      {subtitle ? <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{subtitle}</div> : null}
    </div>
  );
}
