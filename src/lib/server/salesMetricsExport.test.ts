import test from "node:test";
import assert from "node:assert/strict";

test("metrics export counts two paid orders without any browser purchase events, using visits rather than visitors or pageviews", async () => {
  let orderReads = 0;
  const findMany = async (args: unknown) => {
    orderReads++;
    const query = args as { where: { isTest: boolean; OR?: unknown[]; paidAt?: { gte: Date; lt: Date } }; select: { events?: unknown; fullName?: unknown } };
    assert.equal(query.where.isTest, false);
    if (query.select.fullName) return [];
    if (query.select.events) return [];
    if (query.where.paidAt) return [
      { id: "paid-without-return-1", isTest: false, paidAt: new Date("2026-11-08T10:05:00Z") },
      { id: "paid-without-return-2", isTest: false, paidAt: new Date("2026-11-08T10:05:00Z") },
    ];
    assert(query.where.OR);
    assert.equal(query.where.OR.length, 2);
    const fixture = { isTest: false, createdAt: new Date("2026-11-08T10:00:00Z"), paidAt: new Date("2026-11-08T10:05:00Z"), userAgent: "Mozilla/5.0 Chrome/142", totalCents: 3000, email: "buyer@example.com", items: [{ productId: "vino" }, { productId: "tartufo" }] };
    return [
      { ...fixture, id: "paid-without-return-1" },
      { ...fixture, id: "paid-without-return-2" },
      { ...fixture, id: "checkout-pending", paidAt: null },
    ];
  };
  const count = async (args: unknown) => {
    const query = args as { where: { type: string } };
    return query.where.type === "page_view" ? 4 : 0;
  };
  const groupBy = async (args: unknown) => {
    const query = args as { by: string[]; where: { type?: string | object } };
    assert.notEqual(query.where.type, "purchase", "No report section may depend on the success-page event");
    if (query.by.join() === "path" && query.where.type === "page_leave") return [
      { path: "/shop/evo/?v=small", _sum: { durationMs: 1000 }, _count: { durationMs: 1 }, _max: { durationMs: 1000 } },
      { path: "/shop/evo/?v=large", _sum: { durationMs: 18000 }, _count: { durationMs: 9 }, _max: { durationMs: 2000 } },
    ];
    if (query.by.join() === "path" && query.where.type === "page_view") return [{ path: "/shop/evo/", _count: { path: 4 } }];
    if (query.by.join() === "sessionId" && query.where.type === "add_to_cart") return [{ sessionId: "session-1" }, { sessionId: "orphan-session" }];
    if (query.by.join() === "productKey" && query.where.type === "contact_click") return [{ productKey: "phone", _count: { productKey: 3 } }];
    if (query.by.join() === "productKey" && query.where.type === "product_view") return [{ productKey: "vino", _count: { productKey: 4 } }];
    if (query.by.join() === "sessionId") return [{ sessionId: "session-1" }, { sessionId: "session-2" }];
    if (query.by.join() === "visitorId") return [{ visitorId: "same-visitor" }];
    if (query.by.join() === "device") return [{ device: "desktop", _count: { device: 4 } }];
    if (query.by.join() === "device,visitorId") return [{ device: "desktop", visitorId: "same-visitor" }];
    if (query.by.join() === "device,sessionId") return [{ device: "desktop", sessionId: "session-1" }, { device: "desktop", sessionId: "session-2" }];
    if (query.by.join() === "cartId" && typeof query.where.type === "object") return [{ cartId: "same-cart" }];
    if (query.by.join() === "cartId" && query.where.type === "checkout_click") return [{ cartId: "same-cart" }, { cartId: "orphan-cart" }];
    return [];
  };
  const globalState = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = globalState.prismaPostgres;
  const cartEvents = [
    { productKey: "vino", variantKey: "1lt", cartId: "cart-1", data: { qty: 2, unitPriceCents: 2000 } },
    { productKey: "evo-latta", variantKey: "750ml", cartId: "cart-1", data: { qty: 1, unitPriceCents: 2200 } },
  ];
  globalState.prismaPostgres = {
    order: { findMany, count: async () => 3 },
    analyticsEvent: { count, groupBy, findMany: async (args: unknown) => {
      const query = args as { where: { type: unknown } };
      return query.where.type === "add_to_cart" ? cartEvents : [];
    } },
    contactMessage: { count: async () => 5 }, tastingBooking: { count: async () => 2 },
    adminSession: { findFirst: async () => ({ id: "admin", createdAt: new Date(), rotatedAt: new Date() }) },
  };
  try {
    const { GET } = await import("../../app/[locale]/admin/metrics/export/route");
    const url = "https://delpasqua.com/admin/metrics/export/?start=2026-11-08&end=2026-11-08";
    const denied = await GET(new Request(url));
    assert.equal(denied.status, 401);
    assert.equal(orderReads, 0, "unauthenticated requests must not read sales");
    const response = await GET(new Request(url, { headers: { cookie: "admin_session=metrics-test-token" } }));
    assert.equal(response.status, 200);
    const report = await response.json();
    assert.equal(report.meta.version, "metrics-export-v5");
    assert.equal(report.meta.salesSource, "Order.paidAt");
    assert.equal(report.meta.conversionDenominator, "uniqueSessions");
    assert.equal(report.kpis.paidOrders, 2);
    assert.equal(report.kpis.uniqueSessions, 2);
    assert.equal(report.kpis.uniqueVisitors, 1);
    assert.equal(report.kpis.pageViews, 4);
    assert.equal(report.kpis.cartsCheckoutClicked, 1);
    assert.equal(report.kpis.checkoutClickRate, 1, "Orphan click events cannot inflate checkout conversion above measured carts");
    assert.equal(report.kpis.conversionAnalytics, 1);
    assert.equal(report.kpis.conversionAnalyticsPct, 100);
    assert.equal(report.devices.rows[0].purchases, 2);
    assert.equal(report.devices.rows[0].conversion, 1);
    assert.equal(report.funnel.cartsTotal, 1);
    assert.equal(report.funnel.paidOrders, 2);
    assert.equal(report.funnel.unpaidCheckouts, 1);
    assert.equal(report.funnel.avgPaymentMs, 300_000);
    assert.equal(report.funnel.sessionAddToCartRate, 0.5, "orphan add events cannot inflate measured-session rates");
    assert.equal(report.commercial.realizedRevenueEur, 60);
    assert.equal(report.commercial.realizedAovEur, 30);
    assert.equal(report.commercial.lostCheckoutRevenueEur, 30);
    assert.equal(report.commercial.potentialCartRevenueEur, 62);
    assert.equal(report.commercial.avgCartValueEur, 62);
    assert.equal(report.commercial.cartsWithAdditions, 1);
    assert.equal(report.commercial.lostCartRevenueEur, null);
    assert.equal(report.commercial.litersDemandedTotal, 2.75);
    assert.equal(report.commercial.formatDemand.bottlesUnits, 2);
    assert.equal(report.commercial.formatDemand.cansUnits, 1);
    assert.equal(report.commercial.bundleOlioVinoRatePct, 100);
    assert.equal(report.commercial.repeatCustomerRatePct, 100);
    assert.equal(report.leadsAndDirectSales.phoneClicks, 3);
    assert.equal(report.leadsAndDirectSales.contactMessagesCount, 5);
    assert.equal(report.leadsAndDirectSales.tastingBookingsCount, 2);
    assert.equal(report.top.productCartToDetail[0].adds, 1);
    assert.equal(report.top.pages[0].avgDurationMsProductNormalized, 1900, "Normalized page durations must weight every leave, not every variant equally");
    assert.equal(orderReads, 3);
    // Render the same fixtures through the server page and compare KPI props.
    const { default: MetricsPage } = await import("../../app/[locale]/admin/metrics/page");
    const tree = await MetricsPage({ searchParams: Promise.resolve({ start: "2026-11-08", end: "2026-11-08" }) });
    const kpis = new Map<string, unknown>();
    let pageInsights: unknown;
    let pageRankings: unknown;
    let activity: { rows: { orders: number }[] } | undefined;
    const visit = (node: unknown): void => {
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (!node || typeof node !== "object" || !("props" in node)) return;
      const props = (node as { props: { title?: string; value?: unknown; children?: unknown; insights?: unknown; rows?: { averageMs?: number }[]; activity?: { rows: { orders: number }[] } } }).props;
      if (props.insights) pageInsights = props.insights;
      if (props.rows?.some((row) => row.averageMs !== undefined)) pageRankings = props.rows;
      if (props.activity) activity = props.activity;
      if (props.title) kpis.set(props.title, props.value);
      visit(props.children);
    };
    visit(tree);
    assert.deepEqual(pageInsights, report.insights, "Dashboard component and export share the same insight calculations");
    assert.deepEqual(pageRankings, [{ path: "/shop/evo", views: 4, totalMs: 19000, samples: 10, averageMs: 1900, longestMs: 2000 }]);
    assert.equal(activity?.rows.reduce((sum, row) => sum + row.orders, 0), 2);
    assert.equal(kpis.get("Valore Prodotti Aggiunti"), new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(report.commercial.potentialCartRevenueEur));
    assert.equal(kpis.get("Litri Richiesti a Carrello"), "2.8 L");
    assert.equal(kpis.get("Valore Checkout Non Pagati"), new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(30));
  } finally { globalState.prismaPostgres = previous; }
});
