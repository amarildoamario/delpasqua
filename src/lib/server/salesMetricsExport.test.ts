import test from "node:test";
import assert from "node:assert/strict";

test("metrics export counts two paid orders without any browser purchase events, using visits rather than visitors or pageviews", async () => {
  let orderReads = 0;
  const findMany = async (args: unknown) => {
    orderReads++;
    const query = args as { where: { isTest: boolean; OR: unknown[] } };
    assert.equal(query.where.isTest, false);
    assert.equal(query.where.OR.length, 2);
    const fixture = { isTest: false, createdAt: new Date("2026-11-08T10:00:00Z"), paidAt: new Date("2026-11-08T10:05:00Z"), userAgent: "Mozilla/5.0 Chrome/142" };
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
    if (query.by.join() === "sessionId") return [{ sessionId: "session-1" }, { sessionId: "session-2" }];
    if (query.by.join() === "visitorId") return [{ visitorId: "same-visitor" }];
    if (query.by.join() === "device") return [{ device: "desktop", _count: { device: 4 } }];
    if (query.by.join() === "device,visitorId") return [{ device: "desktop", visitorId: "same-visitor" }];
    if (query.by.join() === "device,sessionId") return [{ device: "desktop", sessionId: "session-1" }, { device: "desktop", sessionId: "session-2" }];
    if (query.by.join() === "cartId" && typeof query.where.type === "object") return [{ cartId: "same-cart" }];
    return [];
  };
  const globalState = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = globalState.prismaPostgres;
  globalState.prismaPostgres = { order: { findMany }, analyticsEvent: { count, groupBy } };
  try {
    const { GET } = await import("../../app/[locale]/admin/metrics/export/route");
    const response = await GET(new Request("https://delpasqua.com/admin/metrics/export/?start=2026-11-08&end=2026-11-08"));
    assert.equal(response.status, 200);
    const report = await response.json();
    assert.equal(report.meta.version, "metrics-export-v4");
    assert.equal(report.meta.salesSource, "Order.paidAt");
    assert.equal(report.meta.conversionDenominator, "uniqueSessions");
    assert.equal(report.kpis.paidOrders, 2);
    assert.equal(report.kpis.uniqueSessions, 2);
    assert.equal(report.kpis.uniqueVisitors, 1);
    assert.equal(report.kpis.pageViews, 4);
    assert.equal(report.kpis.conversionAnalytics, 1);
    assert.equal(report.kpis.conversionAnalyticsPct, 100);
    assert.equal(report.devices.rows[0].purchases, 2);
    assert.equal(report.devices.rows[0].conversion, 1);
    assert.equal(report.funnel.cartsTotal, 1);
    assert.equal(report.funnel.paidOrders, 2);
    assert.equal(report.funnel.unpaidCheckouts, 1);
    assert.equal(report.funnel.avgPaymentMs, 300_000);
    assert.equal(orderReads, 1);
  } finally { globalState.prismaPostgres = previous; }
});
