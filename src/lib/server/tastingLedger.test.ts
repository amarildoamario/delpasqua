import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { readTastingLedger, tastingPayment } from "./tastingLedger";

test("scorpora il 10% dal lordo e conserva una commissione Stripe pari a zero", () => {
  const paidAt = new Date("2026-11-27T09:52:00Z");
  assert.deepEqual(tastingPayment(paidAt, 7000, 0, 0), {
    paidAt, grossCents: 7000, vatCents: 636, stripeFeeCents: 0,
  });
  assert.equal(tastingPayment(paidAt, 7000, 635).vatCents, 635);
});

test("registra voucher, pagamenti diretti ed esiti asincroni una sola volta", async () => {
  const created = 1795773120;
  const completed = { type: "checkout.session.completed", created };
  const snapshot = JSON.stringify({ paymentStatus: "paid", amountTotal: 4000, amountTax: 364, currency: "eur" });
  const db = {
    tastingVoucher: { findMany: async () => [
      { paidAt: new Date(created * 1000), totalCents: 7000, checkout: { stripeSessionId: "cs_live_voucher" } },
    ] },
    tastingBooking: { findMany: async () => [
      { stripeSessionId: "cs_live_paid" }, { stripeSessionId: "cs_live_pending" }, { stripeSessionId: "cs_live_delayed" },
    ] },
    stripeWebhookEvent: { findMany: async () => [
      { ...completed, sessionId: "cs_live_paid", payloadSnippet: snapshot },
      { ...completed, sessionId: "cs_live_pending", payloadSnippet: '{"paymentStatus":"unpaid"}' },
      { ...completed, sessionId: "cs_live_delayed", payloadSnippet: null },
      { ...completed, sessionId: "cs_live_delayed", type: "checkout.session.async_payment_succeeded", created: created + 600, payloadSnippet: null },
    ] },
  } as unknown as Parameters<typeof readTastingLedger>[0];

  const stripe = { checkout: { sessions: { retrieve: async (id: string) => {
    assert.notEqual(id, "cs_live_pending");
    if (id === "cs_live_paid") return null;
    return {
      livemode: true, currency: "eur", payment_status: "paid",
      amount_total: id === "cs_live_voucher" ? 7000 : 3500,
      total_details: { amount_tax: id === "cs_live_voucher" ? 0 : 318 },
      payment_intent: { latest_charge: { balance_transaction: { fee: 130, currency: "eur" } } },
    };
  } } } } as unknown as Stripe;

  const { payments, unresolvedBookings } = await readTastingLedger(db, stripe);
  assert.equal(unresolvedBookings, 0);
  assert.deepEqual(payments.map(({ grossCents, vatCents, stripeFeeCents }) => [grossCents, vatCents, stripeFeeCents]), [
    [7000, 636, 130], [4000, 364, 85], [3500, 318, 130],
  ]);
  assert.equal(payments[2].paidAt.getTime(), (created + 600) * 1000);
});
