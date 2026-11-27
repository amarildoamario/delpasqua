import assert from "node:assert/strict";
import test from "node:test";
import { computeDashboardFinance } from "./dashboardFinance";

const start = new Date("2026-10-27T23:00:00.000Z"); // 2026-10-28 00:00 Europe/Rome
const endExclusive = new Date("2026-11-27T23:00:00.000Z"); // 2026-11-28 00:00 Europe/Rome

const sampleOrder = {
  createdAt: new Date("2026-11-16T10:00:00.000Z"),
  totalCents: 30000,
  subtotalCents: 30000,
  shippingCents: 0,
  vatCents: 1154,
  stripeFeeCents: 475,
};

const sampleVoucher = {
  paidAt: new Date("2026-11-27T12:00:00.000Z"),
  totalCents: 7000,
};

test("computeDashboardFinance does not double-count vouchers when monthly override exists", () => {
  const result = computeDashboardFinance({
    monthlyOrders: [sampleOrder],
    monthlyVouchers: [sampleVoucher],
    overrides: {
      "2026-11": {
        manualGrossCents: 37000,
        manualGlsCents: 0,
        manualVatCents: 1154,
        manualStripeFeeCents: 475,
      },
    },
    vatRatePercent: 4,
    start,
    endExclusive,
  });

  assert.equal(result.revenueCents, 37000);
  assert.equal(result.leonardoCents, 3700);
  assert.equal(result.netCents, 37000 - 475 - 1154 - 0 - 3700);
});

test("computeDashboardFinance includes vouchers in both gross and net when no override exists", () => {
  const result = computeDashboardFinance({
    monthlyOrders: [sampleOrder],
    monthlyVouchers: [sampleVoucher],
    overrides: {},
    vatRatePercent: 4,
    start,
    endExclusive,
  });

  assert.equal(result.revenueCents, 37000);
  assert.equal(result.leonardoCents, 3700);
  // Voucher VAT = 10% included on 7000 -> 636; Voucher Stripe estimate = round(7000 * 0.015 + 25) = 130
  assert.equal(result.vatCents, 1154 + 636);
  assert.equal(result.stripeCents, 475 + 130);
  assert.equal(result.netCents, 37000 - (475 + 130) - (1154 + 636) - 3700);
});

test("computeDashboardFinance prorates monthly override accurately for partial-month ranges", () => {
  const partialEnd = new Date("2026-11-20T23:00:00.000Z");
  const result = computeDashboardFinance({
    monthlyOrders: [sampleOrder],
    monthlyVouchers: [sampleVoucher],
    overrides: {
      "2026-11": {
        manualGrossCents: 37000,
      },
    },
    vatRatePercent: 4,
    start,
    endExclusive: partialEnd,
  });

  assert.equal(result.revenueCents, 30000);
});
