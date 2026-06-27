import test from "node:test";
import assert from "node:assert/strict";
import {
  checkoutLocaleFromPathname,
  checkoutLocalePrefix,
  normalizeCheckoutLocale,
} from "@/lib/checkoutLocale";

test("checkout locale helpers preserve every supported storefront locale", () => {
  assert.equal(normalizeCheckoutLocale("de"), "de");
  assert.equal(normalizeCheckoutLocale("us"), "us");
  assert.equal(normalizeCheckoutLocale("unknown"), "it");

  assert.equal(checkoutLocaleFromPathname("/fr/panier"), "fr");
  assert.equal(checkoutLocaleFromPathname("/checkout"), "it");

  assert.equal(checkoutLocalePrefix("it"), "");
  assert.equal(checkoutLocalePrefix("nl"), "/nl");
  assert.equal(checkoutLocalePrefix("bad"), "");
});
