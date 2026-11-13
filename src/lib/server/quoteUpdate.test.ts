import test from "node:test";
import assert from "node:assert/strict";
import type Stripe from "stripe";
import { QuoteInputSchema, calculateQuote } from "./quotes";

test("quote edits expire the old checkout, preserve the public link and block accepted or paid quotes", async () => {
  const state = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = state.prismaPostgres;
  let quote: Record<string, unknown>;
  let updates = 0;
  let expired = false;
  let sessionStatus = "open";
  let failExpire = false;
  const tx = {
    $queryRaw: async () => [],
    quote: {
      findUnique: async () => quote,
      update: async ({ data }: { data: Record<string, unknown> }) => { assert.ok(expired); updates++; quote = { ...quote, ...data }; return quote; },
    },
    quoteEvent: { create: async () => ({}) },
  };
  state.prismaPostgres = { $transaction: async (fn: (client: typeof tx) => Promise<unknown>) => fn(tx) };
  try {
    const { readCatalog } = await import("./catalog");
    const product = (await readCatalog()).find((p) => !p.isTestProduct && p.variants.length)!;
    const variant = product.variants[0];
    const input = QuoteInputSchema.parse({
      requestId: "0d62fd62-b918-4dd8-bdeb-e22055bd0532", fullName: "Demo", email: "demo@example.test", phone: "",
      addressLine1: "Via Demo 1", addressLine2: "", city: "Firenze", postalCode: "50100", province: "FI", countryCode: "IT",
      paymentTerms: "Stripe", notes: "Updated", validUntil: "2030-01-01", discountCents: 100, shippingCents: 500,
      items: [{ productId: product.id, variantId: variant.id, sku: "", title: "Demo", variantLabel: "Demo", qty: 2, unitPriceCents: 1500 }],
    });
    const original = { ...input, ...calculateQuote(input, 0.04), id: "quote-demo", paymentToken: "stable-link", stripeSessionId: "cs-old", stripeCustomerId: "cus-old", checkoutOrderId: null, paidAt: null, validUntil: new Date("2030-01-01") };
    quote = { ...original };
    const stripe = { checkout: { sessions: {
      retrieve: async () => ({ id: "cs-old", status: sessionStatus, payment_status: "unpaid" }),
      expire: async () => { if (failExpire) throw new Error("Stripe unavailable"); expired = true; },
    } } } as unknown as Stripe;
    const { updateQuote } = await import("./quoteUpdate");
    await updateQuote("quote-demo", input, stripe);
    assert.equal(quote.paymentToken, "stable-link");
    assert.equal(quote.stripeSessionId, null);
    assert.equal(quote.stripeCustomerId, null);
    assert.equal(quote.totalCents, 3400);
    assert.equal(quote.validUntil, original.validUntil);
    assert.equal(updates, 1);
    for (const blocked of [{ checkoutOrderId: "order-1" }, { paidAt: new Date() }]) {
      quote = { ...original, ...blocked };
      await assert.rejects(updateQuote("quote-demo", input, stripe), /accettato o pagato/);
    }
    quote = { ...original }; sessionStatus = "complete";
    await assert.rejects(updateQuote("quote-demo", input, stripe), /Pagamento già ricevuto/);
    sessionStatus = "open"; failExpire = true; expired = false;
    await assert.rejects(updateQuote("quote-demo", input, stripe), /Stripe unavailable/);
    assert.equal(updates, 1, "failed expiration must never change the stored quote");
  } finally { state.prismaPostgres = previous; }
});
