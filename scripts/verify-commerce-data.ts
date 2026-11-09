// Read-only reconciliation against the configured database. Prints aggregate values only.
// node --import tsx scripts/verify-commerce-data.ts
import assert from "node:assert/strict";
import { prisma } from "../src/lib/server/prisma";
import { metricsPeriod, readSalesMetrics } from "../src/lib/server/salesMetrics";
import { readCommerceInsights } from "../src/lib/server/commerceInsights";
import { readCustomerMetrics } from "../src/lib/server/customerMetrics";

async function main() {
  const now = new Date();
  const { start, endExclusive } = metricsPeriod(undefined, undefined, now, 30);
  try {
    const result = await prisma.$transaction(async (db) => {
      await db.$executeRaw`SET TRANSACTION READ ONLY`;
      const sales = await readSalesMetrics(db, start, endExclusive);
      const insights = await readCommerceInsights(db, start, endExclusive);
      const customers = await readCustomerMetrics(db, now);
      const paid = await db.order.aggregate({ where: { isTest: false, paidAt: { gte: start, lt: endExclusive } }, _count: { id: true }, _sum: { totalCents: true } });
      const [history] = await db.$queryRaw<{ customers: number; net: bigint }[]>`
        SELECT COUNT(*)::int AS customers, COALESCE(SUM(net), 0)::bigint AS net FROM (
          SELECT LOWER(BTRIM(email)) AS email,
            SUM("totalCents" - LEAST("totalCents", GREATEST(0, "refundCents"))) AS net
          FROM "Order" WHERE "isTest" = false AND "paidAt" <= ${now} AND currency = 'eur' AND BTRIM(email) <> ''
          GROUP BY LOWER(BTRIM(email))
        ) customers
      `;
      assert.equal(sales.paidOrders, paid._count.id);
      assert.equal(Math.round(sales.realizedRevenueEur * 100), paid._sum.totalCents ?? 0);
      assert.equal(insights.decision.paidOrders, paid._count.id);
      assert.equal(insights.hourly.reduce((n, row) => n + row.orders, 0), paid._count.id);
      assert.equal(insights.weekdays.reduce((n, row) => n + row.orders, 0), paid._count.id);
      assert.equal(customers.totalCustomers, history.customers);
      assert.equal(customers.totalLtvCents, Number(history.net));
      assert.equal(Object.values(customers.segments).reduce((n, count) => n + count, 0), customers.totalCustomers);
      assert.equal(insights.stripe.paid + insights.stripe.canceledUnpaid + insights.stripe.pendingOrUnobserved, insights.stripe.started);
      assert.equal(insights.acquisition.reduce((n, source) => n + source.sessions, 0), insights.hourly.reduce((n, row) => n + row.visits, 0));
      return { paidOrders: sales.paidOrders, decisionSamples: insights.decision.samples, customers: customers.totalCustomers, measuredVisits: insights.acquisition.reduce((n, row) => n + row.sessions, 0), stripeCohort: insights.stripe.started };
    }, { isolationLevel: "RepeatableRead", timeout: 30000 });
    console.log("PASS: read-only database reconciliation", JSON.stringify(result));
  } finally { await prisma.$disconnect(); }
}
void main();
