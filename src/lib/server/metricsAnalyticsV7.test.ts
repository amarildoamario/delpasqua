import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCommercialTransactions,
  summarizeCommercialEconomics,
} from "./commercialTransactions";
import { computeFunnelsAndSeries, type V6EventInput, type V6OrderInput } from "./metricsAnalyticsV6";
import { summarizeCommerceInsights } from "./commerceInsights";
import { summarizeCustomers } from "./customerMetrics";
import { runV7ConsistencyChecks, SITE_LAUNCH_DATE } from "./metricsAnalyticsV7";
import { metricsPeriod } from "./salesMetrics";

// Helper to build a minimal valid V6OrderInput
function mkOrder(overrides: Partial<V6OrderInput> & { id: string }): V6OrderInput {
  return {
    isTest: false,
    createdAt: new Date("2026-11-16T10:00:00Z"),
    paidAt: null,
    stripeCheckoutSessionId: null,
    totalCents: 0,
    events: [],
    ...overrides,
  };
}

function mkEvent(overrides: Partial<V6EventInput>): V6EventInput {
  return {
    type: "page_view",
    createdAt: new Date("2026-11-16T10:00:00Z"),
    visitorId: "v-1",
    sessionId: "s-1",
    path: "/it/shop",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Reference dataset reconciliation (Spec Section 17)
// ---------------------------------------------------------------------------
test("V7 reference dataset: quote 300 EUR (Nov 16) + voucher 70 EUR (Nov 27) reconcile across global, channel, daily & CRM", () => {
  const period = metricsPeriod("2026-10-28", "2026-11-27");
  const now = new Date("2026-11-27T18:00:00Z");

  const quoteOrder = mkOrder({
    id: "ord-quote-1",
    quoteId: "q-1",
    totalCents: 30000,
    createdAt: new Date("2026-11-16T09:00:00Z"),
    paidAt: new Date("2026-11-16T09:15:00Z"),
    stripeCheckoutSessionId: "cs_live_quote_1",
    email: "quote.buyer@example.com",
  });

  const voucherOrder = mkOrder({
    id: "voucher:v-1",
    channel: "voucher",
    proposalId: "prop-1",
    totalCents: 7000,
    createdAt: new Date("2026-11-27T10:00:00Z"),
    paidAt: new Date("2026-11-27T10:05:00Z"),
    stripeCheckoutSessionId: "cs_live_voucher_1",
    email: "voucher.buyer@example.com",
  });

  const txs = normalizeCommercialTransactions({
    orders: [quoteOrder],
    vouchers: [voucherOrder],
  });
  const economics = summarizeCommercialEconomics(txs, period.start, period.endExclusive);

  assert.equal(economics.grossPaymentsEur, 370);
  assert.equal(economics.paidTransactions, 2);
  assert.equal(economics.averageTransactionEur, 185);
  assert.equal(economics.revenueByChannelMap.storefront.grossRevenueEur, 0);
  assert.equal(economics.revenueByChannelMap.storefront.averageTransactionEur, null);
  assert.equal(economics.revenueByChannelMap.quote.grossRevenueEur, 300);
  assert.equal(economics.revenueByChannelMap.quote.averageTransactionEur, 300);
  assert.equal(economics.revenueByChannelMap.voucher.grossRevenueEur, 70);
  assert.equal(economics.revenueByChannelMap.voucher.averageTransactionEur, 70);

  const insights = summarizeCommerceInsights(
    [quoteOrder, voucherOrder],
    [],
    [],
    period.start,
    period.endExclusive,
    false,
    [voucherOrder],
  );

  const nov16 = insights.daily.find((d) => d.date === "2026-11-16")!;
  const nov27 = insights.daily.find((d) => d.date === "2026-11-27")!;
  assert.equal(nov16.paidOrders, 1);
  assert.equal(nov16.quotePaidOrders, 1);
  assert.equal(nov16.revenueEur, 300);
  assert.equal(nov27.paidOrders, 1);
  assert.equal(nov27.voucherPaidOrders, 1);
  assert.equal(nov27.revenueEur, 70);

  const dailyRevTotal = insights.daily.reduce((s, d) => s + d.revenueCents, 0);
  const dailyPaidTotal = insights.daily.reduce((s, d) => s + d.paidOrders, 0);
  assert.equal(dailyRevTotal, 37000);
  assert.equal(dailyPaidTotal, 2);

  // CRM includes both quote & voucher buyers (totalCustomers = 2, LTV = 370 EUR)
  const crm = summarizeCustomers(
    [
      { id: quoteOrder.id, isTest: false, email: "quote.buyer@example.com", fullName: "Cliente Preventivo", paidAt: quoteOrder.paidAt, totalCents: 30000, refundCents: 0, items: [], channel: "quote" },
      { id: voucherOrder.id, isTest: false, email: "voucher.buyer@example.com", fullName: "Cliente Voucher", paidAt: voucherOrder.paidAt, totalCents: 7000, refundCents: 0, items: [], channel: "voucher" },
    ],
    now,
  );
  assert.equal(crm.totalCustomers, 2);
  assert.equal(crm.totalLtvCents, 37000);
  assert.equal(crm.byChannel.quote, 1);
  assert.equal(crm.byChannel.voucher, 1);

  const recon = runV7ConsistencyChecks({
    economics,
    daily: insights.daily,
    insightsDaily: insights.daily,
    checkoutCohort: insights.checkoutCohort,
    acquisition: insights.acquisition,
    sessionFunnel: insights.sessionFunnel,
    orderAttribution: insights.orderAttribution,
  });
  assert.equal(recon.status, "ok", `Failed checks: ${recon.failedChecks.join(", ")}`);
});

// ---------------------------------------------------------------------------
// Mandatory 20 Financial & Operational Test Cases (Spec Section 15)
// ---------------------------------------------------------------------------

test("Cases 1, 2, 3, 4: paid storefront, paid quote, paid voucher, and redeemed voucher (no double count)", () => {
  const period = metricsPeriod("2026-11-01", "2026-11-30");
  const txs = normalizeCommercialTransactions({
    orders: [
      { id: "sf-1", isTest: false, createdAt: new Date("2026-11-10T10:00:00Z"), paidAt: new Date("2026-11-10T10:05:00Z"), totalCents: 5500, subtotalCents: 4500, shippingCents: 1000, vatCents: 500, discountCents: 0, stripePaymentIntentId: "pi_sf1" },
      { id: "qt-1", quoteId: "q-1", isTest: false, createdAt: new Date("2026-11-12T10:00:00Z"), paidAt: new Date("2026-11-12T10:05:00Z"), totalCents: 30000, subtotalCents: 30000, shippingCents: 0, vatCents: 1154, discountCents: 0, stripePaymentIntentId: "pi_qt1" },
    ],
    vouchers: [
      { id: "v-1", isTest: false, createdAt: new Date("2026-11-15T10:00:00Z"), paidAt: new Date("2026-11-15T10:02:00Z"), totalCents: 7000, stripePaymentIntentId: "pi_v1" },
    ],
    // Voucher redemption does NOT pass through directTastings (voucherId != null is excluded at read time).
    // Even if a duplicate payment intent were accidentally passed, deduplication blocks double counting:
    directTastings: [
      { id: "t-dup", isTest: false, createdAt: new Date("2026-11-20T10:00:00Z"), paidAt: new Date("2026-11-20T10:00:00Z"), totalCents: 7000, stripePaymentIntentId: "pi_v1" },
    ],
  });
  const eco = summarizeCommercialEconomics(txs, period.start, period.endExclusive);
  assert.equal(eco.paidTransactions, 3);
  assert.equal(eco.grossPaymentsCents, 42500);
  assert.equal(eco.revenueByChannelMap.storefront.grossRevenueCents, 5500);
  assert.equal(eco.revenueByChannelMap.quote.grossRevenueCents, 30000);
  assert.equal(eco.revenueByChannelMap.voucher.grossRevenueCents, 7000);
  assert.equal(eco.revenueByChannelMap.tasting.grossRevenueCents, 0);
});

test("Cases 5, 6, 7, 8: expired checkout, open checkout, multi-attempt order, and recovered checkout", () => {
  const period = metricsPeriod("2026-11-01", "2026-11-30");
  const orders: V6OrderInput[] = [
    // Case 5: expired checkout
    mkOrder({
      id: "ord-exp",
      totalCents: 4500,
      stripeCheckoutSessionId: "cs_live_exp",
      createdAt: new Date("2026-11-10T10:00:00Z"),
      status: "SCADUTO",
      updatedAt: new Date("2026-11-10T11:00:00Z"),
    }),
    // Case 6: still open checkout
    mkOrder({
      id: "ord-open",
      totalCents: 6000,
      stripeCheckoutSessionId: "cs_live_open",
      createdAt: new Date("2026-11-20T10:00:00Z"),
      status: "IN_ATTESA",
    }),
    // Case 7 & 8: quote with 2 attempts — attempt 1 expired, attempt 2 paid (recovered opportunity!)
    mkOrder({
      id: "ord-q-try1",
      quoteId: "q-multi",
      totalCents: 12000,
      stripeCheckoutSessionId: "cs_live_q1",
      createdAt: new Date("2026-11-14T10:00:00Z"),
      status: "SCADUTO",
      updatedAt: new Date("2026-11-14T12:00:00Z"),
    }),
    mkOrder({
      id: "ord-q-try2",
      quoteId: "q-multi",
      totalCents: 12000,
      stripeCheckoutSessionId: "cs_live_q2",
      createdAt: new Date("2026-11-15T10:00:00Z"),
      paidAt: new Date("2026-11-15T10:05:00Z"),
      events: [{ metaJson: null, type: "ORDER_EXPIRED", createdAt: new Date("2026-11-15T10:02:00Z") }],
    }),
  ];

  const res = computeFunnelsAndSeries({
    orders,
    events: [],
    start: period.start,
    endExclusive: period.endExclusive,
    startISO: period.startISO,
    endISO: period.endISO,
    now: new Date("2026-11-30T20:00:00Z"),
  });

  const c = res.checkoutCohort;
  assert.equal(c.stripeCheckoutsStarted, 4);
  assert.equal(c.expiredUnpaid, 2);
  assert.equal(c.openPending, 1);
  assert.equal(c.paid, 1);
  assert.equal(c.recoveredAfterCancelOrClose, 1);
  assert.equal(c.amountsCents.started, 4500 + 6000 + 12000 + 12000);
  assert.equal(c.amountsCents.paid, 12000);
  assert.equal(c.amountsCents.openPending, 6000);
  assert.equal(c.amountsCents.definitiveClosedUnpaid, 4500 + 12000);
  // Multi-attempt opportunity deduplication: q-multi was eventually paid, so closedUnpaid opportunity is only ord-exp (4500)
  assert.equal(c.opportunities.uniqueStarted, 3);
  assert.equal(c.opportunities.uniquePaid, 1);
  assert.equal(c.opportunities.supersededAfterClosedAttempt, 1);
  assert.equal(c.opportunities.closedUnpaidCents, 4500);
});

test("Cases 9, 10, 11: partial refund, full refund, and refund of prior-period order", () => {
  const period = metricsPeriod("2026-11-01", "2026-11-30");
  const txs = normalizeCommercialTransactions({
    orders: [
      // Case 9: paid in Nov (100 EUR), partially refunded in Nov (25 EUR)
      { id: "r-partial", isTest: false, createdAt: new Date("2026-11-05T10:00:00Z"), paidAt: new Date("2026-11-05T10:05:00Z"), totalCents: 10000, refundCents: 2500, refundedAt: new Date("2026-11-10T10:00:00Z") },
      // Case 10: paid in Nov (50 EUR), fully refunded in Nov (50 EUR) — original gross payment is NOT erased!
      { id: "r-full", isTest: false, createdAt: new Date("2026-11-06T10:00:00Z"), paidAt: new Date("2026-11-06T10:05:00Z"), totalCents: 5000, refundCents: 5000, refundedAt: new Date("2026-11-12T10:00:00Z") },
      // Case 11: paid in Oct (80 EUR), refunded in Nov (40 EUR) — counts in Nov refundsInPeriod, NOT in Nov grossPayments!
      { id: "r-prior", isTest: false, createdAt: new Date("2026-10-15T10:00:00Z"), paidAt: new Date("2026-10-15T10:05:00Z"), totalCents: 8000, refundCents: 4000, refundedAt: new Date("2026-11-18T10:00:00Z") },
    ],
  });
  const eco = summarizeCommercialEconomics(txs, period.start, period.endExclusive);
  assert.equal(eco.paidTransactions, 2);
  assert.equal(eco.grossPaymentsCents, 15000);
  assert.equal(eco.refundsInPeriodCents, 11500);
  assert.equal(eco.cohortRefundsCents, 7500);
  assert.equal(eco.netCashCents, 3500);
});

test("Cases 12, 13, 14, 15, 16, 17: duplicate webhook/PI, unattributed order, cross-period payment, VAT/shipping/discount, multi-channel customer, test order exclusion", () => {
  const period = metricsPeriod("2026-11-01", "2026-11-30");

  // Case 12 (duplicate PI), Case 13 (no session), Case 14 (created Oct, paid Nov), Case 15 (VAT+shipping+discount), Case 17 (test order)
  const txs = normalizeCommercialTransactions({
    orders: [
      {
        id: "cross-period",
        isTest: false,
        createdAt: new Date("2026-10-31T20:00:00Z"),
        paidAt: new Date("2026-11-01T08:00:00Z"),
        totalCents: 9500,
        subtotalCents: 10000,
        discountCents: 1500,
        shippingCents: 1000,
        vatCents: 900,
        stripeFeeCents: 168,
        stripePaymentIntentId: "pi_cross",
        email: "multi@example.com",
      },
      // Duplicate payment intent (e.g. duplicate webhook replay)
      {
        id: "cross-period-dup",
        isTest: false,
        createdAt: new Date("2026-10-31T20:00:00Z"),
        paidAt: new Date("2026-11-01T08:00:00Z"),
        totalCents: 9500,
        stripePaymentIntentId: "pi_cross",
      },
      // Test order (Case 17)
      {
        id: "test-ord",
        isTest: true,
        createdAt: new Date("2026-11-10T10:00:00Z"),
        paidAt: new Date("2026-11-10T10:01:00Z"),
        totalCents: 99900,
      },
    ],
    vouchers: [
      {
        id: "v-multi",
        isTest: false,
        createdAt: new Date("2026-11-20T10:00:00Z"),
        paidAt: new Date("2026-11-20T10:05:00Z"),
        totalCents: 7000,
        email: "MULTI@EXAMPLE.COM",
      },
    ],
  });

  const eco = summarizeCommercialEconomics(txs, period.start, period.endExclusive);
  assert.equal(eco.paidTransactions, 2);
  assert.equal(eco.grossPaymentsCents, 16500);
  assert.equal(eco.fiscalBreakdown.goodsSubtotalCents, 10000);
  assert.equal(eco.fiscalBreakdown.goodsDiscountCents, 1500);
  assert.equal(eco.fiscalBreakdown.shippingCents, 1000);
  assert.equal(eco.fiscalBreakdown.goodsVatCents, 900);
  assert.equal(eco.contributionMargin.netGoodsRevenueCents, 8500);
  assert.equal(eco.contributionMargin.status, "estimated");

  // Case 16: customer present in multiple channels is deduplicated once in CRM
  const crm = summarizeCustomers(
    [
      { id: "cross-period", isTest: false, email: "multi@example.com", fullName: "Mario Rossi", paidAt: new Date("2026-11-01T08:00:00Z"), totalCents: 9500, refundCents: 0, items: [], channel: "storefront" },
      { id: "voucher:v-multi", isTest: false, email: "MULTI@EXAMPLE.COM", fullName: "Mario Rossi", paidAt: new Date("2026-11-20T10:05:00Z"), totalCents: 7000, refundCents: 0, items: [], channel: "voucher" },
    ],
    new Date("2026-11-25T12:00:00Z"),
  );
  assert.equal(crm.totalCustomers, 1);
  assert.equal(crm.rows[0].ordersCount, 2);
  assert.equal(crm.rows[0].ltvCents, 16500);
  assert.deepEqual(crm.rows[0].channels, ["storefront", "voucher"]);
  assert.equal(crm.byChannel.storefront, 1);
  assert.equal(crm.byChannel.voucher, 1);

  // Case 13: unattributed paid order stays in commercial totals & unattributed bucket
  const insights = summarizeCommerceInsights(
    [mkOrder({ id: "cross-period", totalCents: 9500, paidAt: new Date("2026-11-01T08:00:00Z") })],
    [],
    [],
    period.start,
    period.endExclusive,
  );
  assert.equal(insights.orderAttribution.paidOrders, 1);
  assert.equal(insights.orderAttribution.ordersWithoutSession, 1);
  assert.equal(insights.orderAttribution.unattributedOrders, 1);
});

test("Cases 18 & 19: payment near local Rome midnight and partial day operational forecast from 2026-11-08", () => {
  const period = metricsPeriod("2026-10-28", "2026-11-27");
  // 2026-11-16 23:30 UTC = 2026-11-17 00:30 Europe/Rome (CET = UTC+1)
  const midnightOrder = mkOrder({
    id: "near-midnight",
    totalCents: 4000,
    createdAt: new Date("2026-11-16T23:25:00Z"),
    paidAt: new Date("2026-11-16T23:30:00Z"),
  });

  // Create 541 sessions distributed across the 19 complete operational days (2026-11-08 .. 2026-11-26)
  // plus 31 sessions on the partial day 2026-11-27
  const events: V6EventInput[] = [];
  for (let day = 8; day <= 26; day++) {
    const count = day === 8 ? 37 : 28; // 37 + 18*28 = 541
    const isoDay = `2026-11-${String(day).padStart(2, "0")}`;
    for (let i = 0; i < count; i++) {
      events.push(mkEvent({
        sessionId: `s-${day}-${i}`,
        visitorId: `v-${day}-${i}`,
        createdAt: new Date(`${isoDay}T12:00:00Z`),
      }));
    }
  }
  for (let i = 0; i < 31; i++) {
    events.push(mkEvent({
      sessionId: `s-27-${i}`,
      visitorId: `v-27-${i}`,
      createdAt: new Date("2026-11-27T10:00:00Z"),
    }));
  }

  const res = computeFunnelsAndSeries({
    orders: [midnightOrder],
    events,
    start: period.start,
    endExclusive: period.endExclusive,
    startISO: period.startISO,
    endISO: period.endISO,
    now: new Date("2026-11-27T15:00:00Z"),
  });

  // Case 18: assigned to 2026-11-17 in Europe/Rome
  const nov16 = res.daily.find((d) => d.date === "2026-11-16")!;
  const nov17 = res.daily.find((d) => d.date === "2026-11-17")!;
  assert.equal(nov16.paidOrders, 0);
  assert.equal(nov17.paidOrders, 1);
  assert.equal(nov17.revenueEur, 40);

  // Case 19: partial day 2026-11-27 excluded from complete operational days
  const nov27 = res.daily.find((d) => d.date === "2026-11-27")!;
  assert.equal(nov27.isPartial, true);
  assert.equal(res.forecasts.operationalBaseline?.launchDate, SITE_LAUNCH_DATE);
  assert.equal(res.forecasts.operationalBaseline?.completeOperationalDays, 19);
  assert.equal(res.forecasts.operationalBaseline?.sessions, 541);
  assert.equal(res.forecasts.operationalBaseline?.avgSessionsPerDay, 28.47);
  assert.equal(res.forecasts.operationalBaseline?.projected30dSessions, 854.21);
});

test("Case 20: non-default variant selection followed by add_to_cart and purchase reconciles in variantFunnel", () => {
  const period = metricsPeriod("2026-11-10", "2026-11-10");
  const events: V6EventInput[] = [
    mkEvent({ type: "page_view", path: "/it/shop/fruttato-intenso", createdAt: new Date("2026-11-10T10:00:00Z") }),
    mkEvent({ type: "product_view", productKey: "fruttato-intenso", variantKey: "500ml", createdAt: new Date("2026-11-10T10:00:01Z") }),
    mkEvent({ type: "select_variant", productKey: "fruttato-intenso", variantKey: "5lt", createdAt: new Date("2026-11-10T10:01:00Z") }),
    mkEvent({ type: "product_view", productKey: "fruttato-intenso", variantKey: "5lt", createdAt: new Date("2026-11-10T10:01:01Z") }),
    mkEvent({ type: "add_to_cart", productKey: "fruttato-intenso", variantKey: "5lt", cartId: "c-1", data: { qty: 1, unitPriceCents: 7500 }, createdAt: new Date("2026-11-10T10:02:00Z") }),
  ];
  const order = mkOrder({
    id: "ord-5lt",
    totalCents: 7500,
    createdAt: new Date("2026-11-10T10:03:00Z"),
    paidAt: new Date("2026-11-10T10:04:00Z"),
    stripeCheckoutSessionId: "cs_live_5lt",
    events: [{ type: "ANALYTICS_CONTEXT", metaJson: JSON.stringify({ visitorId: "v-1", sessionId: "s-1", env: "prod" }) }],
  });

  const res = computeFunnelsAndSeries({
    orders: [order],
    events,
    start: period.start,
    endExclusive: period.endExclusive,
    startISO: period.startISO,
    endISO: period.endISO,
    now: new Date("2026-11-10T23:59:00Z"),
  });

  const v5lt = res.variantFunnel.find((v) => v.productKey === "fruttato-intenso" && v.variantKey === "5lt")!;
  assert.equal(v5lt.selectionSessions, 1);
  assert.equal(v5lt.addSessions, 1);
  assert.equal(v5lt.selectionThenAddSessions, 1);
  assert.equal(v5lt.defaultVariantAddSessions, 0);
  assert.equal(v5lt.selectionToCartRate, 1);
  assert.equal(res.sessionFunnel.purchasingSessions, 1);
});
