import test from "node:test";
import assert from "node:assert/strict";
import type { PrismaClient } from "@/generated/prisma";
import { CHECKOUT_INTERNAL, CHECKOUT_EXTERNAL, excludedCheckout, requestCheckoutExcluded, excludeCheckoutHistory } from "./checkoutAudience";
import { summarizeSales } from "./salesMetrics";
import { summarizeCommerceInsights } from "./commerceInsights";

test("browser exclusion is explicit, survives a lost opt-out cookie, and never guesses from a device or quote", async () => {
  const reads: string[] = [];
  const db = { analyticsEvent: { findUnique: async ({ where }: { where: { id: string } }) => {
    reads.push(where.id); return where.id === "ana-excluded-prod-owner-phone" ? { id: where.id } : null;
  } } } as unknown as Pick<PrismaClient, "analyticsEvent">;
  const req = (cookie: string) => new Request("https://delpasqua.com/api/quotes/token/checkout/", { headers: { cookie, "user-agent": "iPhone Safari" } });
  assert.equal(await requestCheckoutExcluded(db, req("analytics_excluded=1")), true);
  assert.equal(reads.length, 0);
  assert.equal(await requestCheckoutExcluded(db, req("v_id=owner-phone")), true);
  assert.equal(await requestCheckoutExcluded(db, req("v_id=customer-phone")), false);
  assert.equal(await requestCheckoutExcluded(db, req("")), false);
});

test("owner-only attempts disappear from lost checkout count/value; external use of a shared quote and real payments survive", () => {
  const start = new Date("2026-11-15T00:00:00Z"), end = new Date("2026-11-16T00:00:00Z");
  const at = new Date("2026-11-15T12:00:00Z");
  const base = { id: "owner", isTest: false, createdAt: at, paidAt: null, userAgent: null, totalCents: 30000,
    stripeCheckoutSessionId: "cs_test", status: "SCADUTO", updatedAt: at, events: [{ type: CHECKOUT_INTERNAL, metaJson: null }] };
  const shared = { ...base, id: "shared", totalCents: 7200, events: [...base.events, { type: CHECKOUT_EXTERNAL, metaJson: null }] };
  const paid = { ...base, id: "paid", paidAt: at };
  const sales = summarizeSales([base, shared, paid], start, end);
  assert.equal(excludedCheckout(base), true);
  assert.equal(excludedCheckout(shared), false);
  assert.equal(sales.unpaidCheckouts, 1);
  assert.equal(sales.lostCheckoutRevenueEur, 72);
  assert.equal(sales.startedCheckouts, 2);
  assert.equal(sales.paidOrders, 1);
  assert.equal(sales.realizedRevenueEur, 300);
  const insights = summarizeCommerceInsights([base, shared, paid], [], [], start, end);
  assert.equal(insights.stripe.started, 2);
  assert.equal(insights.stripe.canceledUnpaid, 1);
  assert.equal(insights.stripe.paid, 1);
});

test("retroactive exclusion uses exact browser/environment and retracts only its own audience marker", async () => {
  const removed: unknown[] = [], inserted: unknown[] = [];
  const db = {
    order: { findMany: async () => [{ id: "own-order" }, { id: "context-order" }] },
    analyticsEvent: { findMany: async () => [{ orderId: "own-order" }] },
    orderEvent: {
      findMany: async () => [
        { orderId: "context-order", metaJson: JSON.stringify({ visitorId: "owner-phone", env: "prod" }) },
        { orderId: "other-browser", metaJson: JSON.stringify({ visitorId: "owner-phone-other", env: "prod" }) },
        { orderId: "local", metaJson: JSON.stringify({ visitorId: "owner-phone", env: "dev" }) },
        { orderId: "malformed", metaJson: "not json" },
      ],
      deleteMany: async (args: unknown) => { removed.push(args); return { count: 1 }; },
      createMany: async (args: unknown) => { inserted.push(args); return { count: 2 }; },
    },
  } as unknown as Pick<PrismaClient, "analyticsEvent" | "orderEvent" | "order">;
  await excludeCheckoutHistory(db, "owner-phone", "prod");
  assert.deepEqual(removed, [{ where: { orderId: { in: ["own-order", "context-order"] }, type: CHECKOUT_EXTERNAL,
    metaJson: JSON.stringify({ visitorId: "owner-phone", env: "prod" }) } }]);
  assert.deepEqual(inserted, [{ data: ["own-order", "context-order"].map((orderId) => ({ id: `${CHECKOUT_INTERNAL}-${orderId}`, orderId, type: CHECKOUT_INTERNAL })), skipDuplicates: true }]);
});
