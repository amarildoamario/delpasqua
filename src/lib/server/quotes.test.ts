import test from "node:test";
import assert from "node:assert/strict";
import { QuoteInputSchema, calculateQuote, quotePayloadHash, renderQuoteHtml, quoteNumber } from "./quotes";
import type { Quote } from "@/generated/prisma";

export function quoteFixture() {
  const input = QuoteInputSchema.parse({
    requestId: "0d62fd62-b918-4dd8-bdeb-e22055bd0532", fullName: "Cliente dimostrativo", email: "cliente@example.test", phone: "+39 0000000000",
    addressLine1: "Via degli Ulivi 12", addressLine2: "Interno 3", city: "Firenze", postalCode: "50100", province: "FI", countryCode: "IT",
    paymentTerms: "Pagamento tramite il sito", notes: "Olio non filtrato. Consegna da concordare.", validUntil: "2026-12-13",
    items: [{ productId: "evo-latta", variantId: "5lt", sku: "EVO-L-5LT", title: "Olio EVO in latta", variantLabel: "Latta 5 L - Non filtrato - Fruttato medio", qty: 3, unitPriceCents: 12000 }],
    discountCents: 1000, shippingCents: 1500,
  });
  return { input, quote: { ...input, ...calculateQuote(input, 0.04), id: "quote-demo", sequence: 1, payloadHash: quotePayloadHash(input), validUntil: new Date("2026-12-13T12:00:00Z"), createdAt: new Date("2026-11-13T18:00:00Z"), paymentToken: null, stripeCustomerId: null, stripeSessionId: null, checkoutOrderId: null, paidAt: null } satisfies Quote };
}
test("quote totals preserve agreed prices, discount and shipping without adding VAT twice", () => {
  const { input } = quoteFixture();
  const totals = calculateQuote(input, 0.04);
  assert.equal(totals.subtotalCents, 36000);
  assert.equal(totals.totalCents, 36500);
  assert.equal(totals.vatCents, 1346);
  assert.equal(totals.items[0].lineTotalCents, 35000);
  assert.throws(() => calculateQuote({ ...input, discountCents: 36001 }, 0.04));
  assert.throws(() => calculateQuote(input, Number.NaN));
  assert.throws(() => QuoteInputSchema.parse({ ...input, items: [{ ...input.items[0], qty: -1 }] }));
  assert.throws(() => QuoteInputSchema.parse({ ...input, validUntil: "2026-02-30" }));
  assert.throws(() => QuoteInputSchema.parse({ ...input, totalCents: 1 }));
});
test("quote allocation reconciles every cent including zero-valued and fully discounted rows", () => {
  const { input } = quoteFixture();
  for (let discountCents = 0; discountCents <= 100; discountCents++) {
    const totals = calculateQuote({ ...input, discountCents, items: [0, 1, 19, 80].map((unitPriceCents) => ({ ...input.items[0], qty: 1, unitPriceCents })) }, 0.04);
    assert.equal(totals.items.reduce((s, i) => s + i.lineDiscountCents, 0), discountCents);
    assert.equal(totals.items.reduce((s, i) => s + i.lineVatCents, 0), totals.vatCents);
    assert.equal(totals.items.reduce((s, i) => s + i.lineTotalCents, 0) + input.shippingCents, totals.totalCents);
    assert.ok(totals.items.every((i) => i.lineTotalCents >= 0 && i.lineVatCents >= 0));
  }
});
test("quote uses the order document layout, red PREVENTIVO heading, validity and escaped customer content", () => {
  const { quote } = quoteFixture();
  const html = renderQuoteHtml({ ...quote, fullName: "<script>alert(1)</script>", notes: "<img src=x onerror=alert(2)>" }, "/logo.png", "https://delpasqua.com/preventivo/demo-non-attivo/");
  assert.match(html, /color: #b91c1c; font-size: 17px; font-weight: 900;">PREVENTIVO/);
  assert.match(html, /Totale Preventivo/);
  assert.match(html, /Spedizione:/);
  assert.match(html, /Se accetti il preventivo/);
  assert.match(html, /condizioni di spedizione/);
  assert.match(html, /href="https:\/\/delpasqua.com\/preventivo\/demo-non-attivo\/"/);
  assert.match(html, /365.00/);
  assert.match(html, /Valido fino al:/);
  assert.match(html, /13\/12\/2026/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<img src=x/);
  assert.doesNotMatch(html, /Data Pagamento|Totale Ordine|<strong>Stato:/);
  assert.equal(quoteNumber(quote), "PRE-2026-00001");
  const { input } = quoteFixture();
  assert.equal(quotePayloadHash(input), quotePayloadHash({ ...input }));
  assert.notEqual(quotePayloadHash(input), quotePayloadHash({ ...input, shippingCents: 0 }));
});
