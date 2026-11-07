import assert from "node:assert/strict";
import test from "node:test";

import { hasMixedTestAndCommercialItems, isTestOrderItems } from "./testOrders";

test("marks an order as test only when every item is the test product", () => {
  assert.equal(isTestOrderItems([{ isTestProduct: true }]), true);
  assert.equal(
    isTestOrderItems([
      { isTestProduct: true },
      { isTestProduct: true },
    ]),
    true
  );
  assert.equal(
    isTestOrderItems([
      { isTestProduct: true },
      { isTestProduct: false },
    ]),
    false
  );
  assert.equal(isTestOrderItems([]), false);
});

test("rejects carts that mix test and commercial products", () => {
  assert.equal(
    hasMixedTestAndCommercialItems([
      { isTestProduct: true },
      { isTestProduct: false },
    ]),
    true
  );
  assert.equal(
    hasMixedTestAndCommercialItems([
      { isTestProduct: true },
      { isTestProduct: true },
    ]),
    false
  );
  assert.equal(hasMixedTestAndCommercialItems([{ isTestProduct: false }]), false);
});
