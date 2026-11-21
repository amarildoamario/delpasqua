import assert from "node:assert/strict";
import test from "node:test";
import { checkoutPayment, matchesCheckoutPayment, storedCheckoutPayment } from "./checkoutPayment";

const pricing = {
  items: [
    { productId: "olive-oil", variantId: "500ml", unitPriceCents: 1005, qty: 2 },
    { productId: "olive-oil", variantId: "1l", unitPriceCents: 1022, qty: 1 },
  ],
  subtotalCents: 3032,
  discountCents: 200,
  shippingCents: 990,
};

test("derives the charge from the locale and rounded unit prices, discount and shipping", () => {
  for (const [locale, currency, amounts] of [
    ["us", "USD", [1106, 1124, 220, 1089, 4205]],
    ["en", "GBP", [844, 858, 168, 832, 3210]],
    ["it", "EUR", [1005, 1022, 200, 990, 3822]],
  ] as const) {
    const payment = checkoutPayment(pricing, locale);
    const [first, second, discount, shipping, total] = amounts;
    assert.equal(payment.currency, currency);
    assert.equal(payment.items[0].lineSubtotalCents, first * 2);
    assert.equal(payment.items[1].lineSubtotalCents, second);
    assert.equal(payment.items.reduce((sum, item) => sum + item.lineDiscountCents, 0), discount);
    assert.equal(payment.shippingCents, shipping);
    assert.equal(payment.totalCents, total);
    assert.deepEqual(storedCheckoutPayment(JSON.parse(JSON.stringify(payment))), payment);
    assert.equal(matchesCheckoutPayment(payment, { currency: currency.toLowerCase(), amount_total: total }), true);
    assert.equal(matchesCheckoutPayment(payment, { currency: currency.toLowerCase(), amount_total: total + 1 }), false);
  }
});

test("a full discount covers all rounded item amounts in the checkout currency", () => {
  const payment = checkoutPayment({ ...pricing, discountCents: pricing.subtotalCents, shippingCents: 0 }, "us");
  assert.equal(payment.discountCents, payment.subtotalCents);
  assert.equal(payment.totalCents, 0);
  assert.equal(storedCheckoutPayment(null), null);
  assert.equal(matchesCheckoutPayment(payment, { currency: "eur", amount_total: 0 }), false);
});
