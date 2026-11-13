import test from "node:test";
import assert from "node:assert/strict";
import type { Prisma } from "@/generated/prisma";
import { applyPaidOrderInvariantsTx } from "./orderPayment";

test("quote payment uses the existing paid-order/email flow and marks the quote paid only once", async () => {
  const previous = process.env.INVENTORY_ENABLED; process.env.INVENTORY_ENABLED = "false";
  let order = { id: "order-quote", quoteId: "quote-demo", status: "IN_ATTESA", items: [], orderNumber: "DP-2026-000001", orderPublicToken: "private-order-token", stripeCheckoutSessionId: "cs-demo", paymentProvider: "stripe", isTest: false, promotionCode: null };
  let paid = 0, emails = 0;
  const events: string[] = [];
  const tx = {
    order: { findUnique: async () => order, update: async ({ data }: { data: Partial<typeof order> }) => (order = { ...order, ...data }) },
    quote: { update: async ({ data }: { data: { paidAt: Date } }) => { assert.ok(data.paidAt); paid++; } },
    quoteEvent: { create: async ({ data }: { data: { type: string } }) => { events.push(data.type); } },
    orderEvent: { findFirst: async () => ({ id: "assigned-invoice" }) },
    outboxEvent: { create: async ({ data }: { data: { type: string } }) => { assert.equal(data.type, "ORDER_PAID"); emails++; } },
  } as unknown as Prisma.TransactionClient;
  try {
    await applyPaidOrderInvariantsTx(tx, { orderId: order.id, source: "stripe_webhook", stripeSessionId: "cs-demo", paymentIntentId: "pi-demo" });
    await applyPaidOrderInvariantsTx(tx, { orderId: order.id, source: "stripe_webhook", stripeSessionId: "cs-demo", paymentIntentId: "pi-demo" });
    assert.equal(order.status, "PAGATO"); assert.equal(paid, 1); assert.equal(emails, 1); assert.deepEqual(events, ["PAID"]);
  } finally { if (previous === undefined) delete process.env.INVENTORY_ENABLED; else process.env.INVENTORY_ENABLED = previous; }
});
