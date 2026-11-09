import test from "node:test";
import assert from "node:assert/strict";
import { metricsMonthKey, metricsMonthWindow, metricsPeriod, salesConversion, summarizeSales, type SalesOrder } from "./salesMetrics";
import { parseVariantLiters, isCanFormat, summarizeCartDemand } from "./salesMetrics";

test("volume parsing uses exact units and formats distinguish one-litre bottles from cans", () => {
  for (const [key, expected] of [["500ml", .5], ["750ml", .75], ["1lt", 1], ["3lt", 3], ["5lt", 5], ["1500ml", 1.5], ["15lt", 15], ["0,75 L", .75], ["standard", 0]] as const) {
    assert.equal(parseVariantLiters(key), expected, key);
  }
  assert.equal(parseVariantLiters(null, "olio-5-litri"), 5);
  assert.equal(isCanFormat("1lt", "vino"), false);
  assert.equal(isCanFormat("1lt", "fruttato-intenso"), false);
  assert.equal(isCanFormat("750ml", "evo-latta"), true);
});

test("cart demand rejects malformed quantities and prices and reports incomplete history", () => {
  const ev = { productKey: "vino", variantKey: "1lt", cartId: "cart-1", data: { qty: 2, unitPriceCents: 2000 } };
  const summary = summarizeCartDemand([
    ev, { ...ev, data: { qty: -2 } }, { ...ev, data: { qty: Infinity } },
    { ...ev, data: { qty: 1.5 } }, { ...ev, data: { qty: 0 } },
    { ...ev, productKey: "prodotto-test" },
    { ...ev, productKey: "other", variantKey: "standard", data: { qty: 1, unitPriceCents: -100 } },
  ]);
  assert.equal(summary.addedUnits, 3);
  assert.equal(summary.litersWineDemanded, 2);
  assert.equal(summary.litersOilDemanded, 0);
  assert.equal(summary.unknownFormatUnits, 1);
  assert.equal(summary.potentialCartRevenueEur, null);
  assert.equal(summary.avgCartValueEur, null);
  assert.equal(summary.unpricedUnits, 1);
  assert.equal(summary.lostCartRevenueEur, null);
  assert.equal(summarizeCartDemand([]).avgCartValueEur, null);
  assert.equal(summarizeCartDemand([{ ...ev, data: { unitPriceCents: 0 } }]).potentialCartRevenueEur, 0);
});

test("commercial totals use payment cohorts, normalized customer emails and all oil families", () => {
  const sales = summarizeSales([
    order({ totalCents: 2500, email: " BUYER@example.com ", items: [{ productId: "vino" }, { productId: "peperoncino" }] }),
    order({ id: "second", totalCents: 5000, email: "buyer@example.com", items: [{ sku: "WINE-1LT" }, { sku: "TRUF-500ML" }] }),
    order({ id: "blank", totalCents: 0, email: "   " }),
    order({ id: "pending", totalCents: 10000, paidAt: null }),
    order({ id: "test", isTest: true, totalCents: 999999 }),
    order({ id: "later", totalCents: 3000, paidAt: end }),
  ], start, end);
  assert.equal(sales.realizedRevenueEur, 75);
  assert.equal(sales.realizedAovEur, 25);
  assert.equal(sales.potentialCheckoutRevenueEur, 205);
  assert.equal(sales.lostCheckoutRevenueEur, 100);
  assert.equal(sales.uniquePayingCustomers, 1);
  assert.equal(sales.repeatPayingCustomers, 1);
  assert.equal(sales.bundleOlioVinoRatePct, 100);
});

const start = new Date("2026-11-08T00:00:00Z");
const end = new Date("2026-11-09T00:00:00Z");
const order = (changes: Partial<SalesOrder> = {}): SalesOrder => ({
  id: "paid-order", isTest: false, createdAt: new Date("2026-11-08T10:00:00Z"),
  paidAt: new Date("2026-11-08T10:05:00Z"), userAgent: "Mozilla/5.0 Chrome/142", ...changes,
});

test("conversion uses paid commercial orders without any browser purchase or cart identity", () => {
  const sales = summarizeSales([order(), order({ id: "another-order" })], start, end);
  assert.equal(sales.paidOrders, 2);
  assert.equal(salesConversion(sales.paidOrders, 100), 0.02);
});

test("test orders and unpaid checkouts cannot inflate sales", () => {
  const sales = summarizeSales([order(), order({ id: "test", isTest: true }), order({ id: "unpaid", paidAt: null })], start, end);
  assert.equal(sales.paidOrders, 1);
  assert.equal(sales.startedCheckouts, 2);
  assert.equal(sales.unpaidCheckouts, 1);
});

test("sales are grouped by payment date with an exclusive end boundary", () => {
  const sales = summarizeSales([
    order({ id: "started-yesterday", createdAt: new Date("2026-11-07T23:00:00Z"), paidAt: start }),
    order({ id: "paid-tomorrow", paidAt: end }),
    order({ id: "paid-yesterday", createdAt: new Date("2026-11-07T10:00:00Z"), paidAt: new Date("2026-11-07T11:00:00Z") }),
  ], start, end);
  assert.equal(sales.paidOrders, 1);
  assert.equal(sales.startedCheckouts, 1);
});

test("order IDs prevent duplicate counting while repeat orders remain separate sales", () => {
  const sales = summarizeSales([order(), order(), order({ id: "second-purchase-same-browser" })], start, end);
  assert.equal(sales.paidOrders, 2);
});

test("device and payment duration use order data including delayed payments", () => {
  const sales = summarizeSales([
    order(),
    order({ id: "phone", userAgent: "Mozilla/5.0 iPhone", createdAt: new Date("2026-11-07T10:00:00Z") }),
    order({ id: "unknown", userAgent: null }),
  ], start, end);
  assert.equal(sales.paymentSamples, 3);
  assert(sales.avgPaymentMs! > 2 * 60 * 60_000);
  assert.deepEqual(sales.devices.map((row) => [row.device, row.purchases]), [["desktop", 1], ["mobile", 1], ["unknown", 1]]);
});

test("no measured sessions yields unavailable conversion; ratios are never clamped", () => {
  assert.equal(salesConversion(1, 0), null);
  assert.equal(salesConversion(0, 10), 0);
  assert.equal(salesConversion(2, 1), 2);
});

test("visits and payments use identical full calendar days in Europe/Rome", () => {
  const period = metricsPeriod("2026-11-08", "2026-11-08");
  assert.equal(period.start.toISOString(), "2026-11-07T23:00:00.000Z");
  assert.equal(period.endExclusive.toISOString(), "2026-11-08T23:00:00.000Z");
  const lateNight = metricsPeriod(undefined, undefined, new Date("2026-11-08T23:30:00Z"));
  assert.equal(lateNight.endISO, "2026-11-09");
});

test("calendar boundaries follow daylight saving changes and reject rolled dates", () => {
  const spring = metricsPeriod("2026-03-29", "2026-03-29");
  const fall = metricsPeriod("2026-10-25", "2026-10-25");
  assert.equal(spring.endExclusive.getTime() - spring.start.getTime(), 23 * 60 * 60_000);
  assert.equal(fall.endExclusive.getTime() - fall.start.getTime(), 25 * 60 * 60_000);
  assert.notEqual(metricsPeriod("2026-02-31", "2026-11-08", start).startISO, "2026-02-31");
});

test("dashboard keeps its thirty-day default while metrics retain their seven-day default", () => {
  const now = new Date("2026-11-08T12:00:00Z");
  assert.equal(metricsPeriod(undefined, undefined, now, 30).startISO, "2026-10-09");
  assert.equal(metricsPeriod(undefined, undefined, now).startISO, "2026-11-01");
});

test("monthly dashboard accounting follows Italian calendar months across UTC midnight and year rollover", () => {
  assert.equal(metricsMonthKey(new Date("2026-10-31T23:30:00Z")), "2026-11");
  const period = metricsMonthWindow("2026-11-05", "2026-12-31");
  assert.equal(period.startMonthDate.toISOString(), "2026-10-31T23:00:00.000Z");
  assert.equal(period.endMonthDate.toISOString(), "2026-12-31T23:00:00.000Z");
});

test("reversed URL dates are reordered just like the dashboard and metrics controls", () => {
  const normal = metricsPeriod("2026-10-25", "2026-11-09");
  const reversed = metricsPeriod("2026-11-09", "2026-10-25");
  assert.deepEqual(reversed, normal);
});

test("month, quarter and semester ranges include full last days and leap years", () => {
  for (const [startISO, endISO, days] of [["2024-02-01", "2024-02-29", 29], ["2026-01-01", "2026-03-31", 90], ["2026-07-01", "2026-12-31", 184]] as const) {
    const period = metricsPeriod(startISO, endISO);
    assert.equal(period.startISO, startISO);
    assert.equal(period.endISO, endISO);
    // Count Italian date labels, independent of the 23h/25h DST days.
    const dayCount = (Date.parse(`${period.endExclusiveISO}T00:00:00Z`) - Date.parse(`${startISO}T00:00:00Z`)) / 86_400_000;
    assert.equal(dayCount, days);
  }
});
