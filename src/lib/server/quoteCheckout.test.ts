import test from "node:test";
import assert from "node:assert/strict";
import type Stripe from "stripe";
import { calculateQuote, QuoteInputSchema, oneCalendarMonthFrom } from "./quotes";
import { analyticsPath } from "@/lib/analytics/events";

test("one calendar month clamps month ends and private payment tokens never enter analytics", () => {
  assert.equal(oneCalendarMonthFrom(new Date("2026-01-31T14:00:00Z")).toISOString(), "2026-02-28T22:59:59.999Z");
  assert.equal(oneCalendarMonthFrom(new Date("2028-01-31T14:00:00Z")).toISOString(), "2028-02-29T22:59:59.999Z");
  assert.equal(oneCalendarMonthFrom(new Date("2026-12-13T14:00:00Z")).toISOString(), "2027-01-13T22:59:59.999Z");
  assert.equal(oneCalendarMonthFrom(new Date("2026-03-31T20:00:00Z")).toISOString(), "2026-04-30T21:59:59.999Z");
  assert.equal(oneCalendarMonthFrom(new Date("2026-01-30T23:30:00Z")).toISOString(), "2026-02-28T22:59:59.999Z");
  assert.equal(analyticsPath("/it/preventivo/private-secret/?error=stock"), "/it/preventivo");
  assert.equal(analyticsPath("https://delpasqua.com/preventivo/private-secret/"), "https://delpasqua.com/preventivo");
});

test("PDF preparation creates prefilled Stripe checkout; acceptance creates exactly one stock-backed order; expiry renews and paid quotes stop", async () => {
  const globalState = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = globalState.prismaPostgres;
  const previousInventory = process.env.INVENTORY_ENABLED;
  process.env.INVENTORY_ENABLED = "true";
  const input = QuoteInputSchema.parse({ requestId: "0d62fd62-b918-4dd8-bdeb-e22055bd0532", fullName: "Cliente demo", email: "demo@example.test", phone: "",
    addressLine1: "Via Demo 1", addressLine2: "", city: "Firenze", postalCode: "50100", province: "FI", countryCode: "IT", paymentTerms: "Stripe", notes: "", validUntil: "2030-01-01",
    items: [{ productId: "evo", variantId: "500ml", sku: "EVO", title: "Olio EVO", variantLabel: "Non filtrato", qty: 120, unitPriceCents: 100 }], discountCents: 100, shippingCents: 500 });
  let quote = { ...input, ...calculateQuote(input, 0.04), id: "quote-demo", sequence: 1, createdAt: new Date(), validUntil: oneCalendarMonthFrom(new Date()), paymentToken: null as string | null, stripeCustomerId: null as string | null, stripeSessionId: null as string | null, checkoutOrderId: null as string | null, paidAt: null as Date | null };
  type Order = { id: string; status: string; items: typeof quote.items; [key: string]: unknown };
  const orders = new Map<string, Order>();
  const sessions = new Map<string, Record<string, unknown>>();
  const reservations = new Map<string, number>();
  const events: string[] = [];
  let creates = 0, customers = 0, expires = 0;
  let stock = 1000;
  let customerPayload: Record<string, unknown> = {};
  let sessionPayload: Record<string, unknown> = {};
  let serial = Promise.resolve();
  const tx = {
    $queryRaw: async () => [{ id: quote.id }],
    $executeRaw: async (_strings: TemplateStringsArray, ...values: unknown[]) => { if (typeof values[0] === "number") reservations.set("EVO", Number(values[0])); return 1; },
    quote: { findUnique: async () => quote, update: async ({ data }: { data: Partial<typeof quote> }) => (quote = { ...quote, ...data }) },
    quoteEvent: { create: async ({ data }: { data: { type: string } }) => { events.push(data.type); } },
    order: {
      create: async ({ data }: { data: Record<string, unknown> & { items: { create: typeof quote.items } } }) => {
        const order = { ...data, id: `order-${orders.size + 1}`, status: "IN_ATTESA", items: data.items.create };
        orders.set(order.id, order); return order;
      },
      findUnique: async ({ where }: { where: { id: string } }) => orders.get(where.id),
      update: async ({ where, data }: { where: { id: string }; data: Partial<Order> }) => { const order = { ...orders.get(where.id)!, ...data }; orders.set(where.id, order); return order; },
    },
    inventoryReservation: { findMany: async ({ where }: { where: { orderId: string } }) => orders.get(where.orderId)?.status === "IN_ATTESA" && reservations.has("EVO") ? [{ sku: "EVO", qty: reservations.get("EVO") }] : [], upsert: async () => ({}), deleteMany: async () => { reservations.clear(); } },
    inventoryItem: { findMany: async () => [{ sku: "EVO", stock, reserved: 0 }] },
    orderEvent: { create: async () => ({}) },
  };
  globalState.prismaPostgres = { $transaction: async (fn: (client: typeof tx) => Promise<unknown>) => {
    const run = serial.then(() => fn(tx)); serial = run.then(() => undefined, () => undefined); return run;
  } };
  const stripe = {
    customers: { create: async (data: Record<string, unknown>) => { customers++; customerPayload = data; return { id: "cus-demo" }; } },
    coupons: { create: async () => ({ id: "coupon-demo" }) },
    checkout: { sessions: {
      create: async (data: Record<string, unknown>) => { creates++; sessionPayload = data; const session = { id: `cs-${creates}`, url: `https://checkout.stripe.com/c/pay/cs-${creates}`, status: "open", payment_status: "unpaid", amount_total: quote.totalCents, currency: "eur" }; sessions.set(session.id, session); return session; },
      retrieve: async (id: string) => sessions.get(id),
      update: async (id: string, data: Record<string, unknown>) => { const session = { ...sessions.get(id)!, ...data }; sessions.set(id, session); return session; },
      expire: async (id: string) => { expires++; sessions.get(id)!.status = "expired"; },
    } },
  } as unknown as Stripe;
  try {
    const { prepareQuoteCheckout } = await import("./quoteCheckout");
    const args = { quoteId: quote.id, origin: "https://delpasqua.com" };
    const [prepared, again] = await Promise.all([prepareQuoteCheckout(args, stripe), prepareQuoteCheckout(args, stripe)]);
    assert.equal(creates, 1); assert.equal(customers, 1); assert.equal(orders.size, 0); assert.equal(reservations.size, 0);
    assert.equal(prepared.paymentUrl, again.paymentUrl); assert.match(prepared.paymentUrl, /\/preventivo\/[A-Za-z0-9_-]{43}\//);
    assert.equal(customerPayload.email, input.email); assert.deepEqual((customerPayload.shipping as { address: unknown }).address, { line1: input.addressLine1, line2: undefined, city: input.city, postal_code: input.postalCode, state: input.province, country: "IT" });
    assert.ok(Number(sessionPayload.expires_at) <= Math.floor(Date.now() / 1000) + 3600);
    assert.ok(sessionPayload.discounts); assert.equal(events.filter((e) => e === "PAYMENT_PREPARED").length, 1);
    await Promise.all([prepareQuoteCheckout({ ...args, accept: true }, stripe), prepareQuoteCheckout({ ...args, accept: true }, stripe)]);
    assert.equal(orders.size, 1); assert.equal(reservations.get("EVO"), 120, "B2B quantities must never be silently capped at 99");
    assert.equal(events.filter((e) => e === "ACCEPTED").length, 1);
    assert.equal((sessions.get("cs-1")!.metadata as { orderId: string }).orderId, "order-1");
    assert.equal(orders.get("order-1")!.totalCents, 12400);
    assert.equal(orders.get("order-1")!.addressLine1, input.addressLine1);
    sessions.get("cs-1")!.status = "complete";
    await assert.rejects(prepareQuoteCheckout(args, stripe), /Pagamento ricevuto/);
    sessions.get("cs-1")!.status = "expired";
    await prepareQuoteCheckout(args, stripe);
    assert.equal(creates, 2); assert.equal(orders.get("order-1")!.status, "SCADUTO");
    assert.equal(reservations.size, 0); assert.equal(quote.checkoutOrderId, null);
    stock = 0;
    await assert.rejects(prepareQuoteCheckout({ ...args, accept: true }, stripe), /Disponibilità insufficiente/);
    quote.paidAt = new Date();
    await assert.rejects(prepareQuoteCheckout(args, stripe), /già pagato/);
    quote.paidAt = null; quote.validUntil = new Date(Date.now() - 1000);
    await assert.rejects(prepareQuoteCheckout(args, stripe), /scaduto/);
    assert.equal(expires, 0);
  } finally {
    globalState.prismaPostgres = previous;
    if (previousInventory === undefined) delete process.env.INVENTORY_ENABLED; else process.env.INVENTORY_ENABLED = previousInventory;
  }
});
