import test from "node:test";
import assert from "node:assert/strict";
import {
  canonicalizeSitePath,
  computeFunnelsAndSeries,
  computeHistoricalCustomerRetention,
  type V6EventInput,
  type V6OrderInput,
} from "./metricsAnalyticsV6";

const start = new Date("2026-11-09T23:00:00Z"); // 2026-11-10 00:00 Europe/Rome (Tue)
const end = new Date("2026-11-17T23:00:00Z");   // 2026-11-18 00:00 Europe/Rome

const ev = (overrides: Partial<V6EventInput> = {}): V6EventInput => ({
  type: "page_view",
  createdAt: new Date("2026-11-10T10:00:00Z"),
  visitorId: "v-1",
  sessionId: "s-1",
  cartId: "c-1",
  orderId: null,
  path: "/shop/",
  productKey: null,
  variantKey: null,
  referrer: null,
  userAgent: "Mozilla/5.0 Chrome/142",
  data: null,
  ...overrides,
});

const ord = (overrides: Partial<V6OrderInput> = {}): V6OrderInput => ({
  id: "o-1",
  quoteId: null,
  userAgent: "Mozilla/5.0 Chrome/142",
  email: "cliente@example.com",
  totalCents: 6900,
  isTest: false,
  createdAt: new Date("2026-11-10T10:10:00Z"),
  paidAt: new Date("2026-11-10T10:15:00Z"),
  stripeCheckoutSessionId: "cs_1",
  status: "PAGATO",
  updatedAt: new Date("2026-11-10T10:15:00Z"),
  events: [{ type: "ANALYTICS_CONTEXT", metaJson: JSON.stringify({ visitorId: "v-1", sessionId: "s-1", env: "prod" }) }],
  ...overrides,
});

test("canonicalizeSitePath strips locale prefixes and trailing slashes while preserving rawPath", () => {
  assert.deepEqual(canonicalizeSitePath("/en/shop/fruttato-leggero/?v=500ml"), {
    rawPath: "/en/shop/fruttato-leggero/",
    canonicalPath: "/shop/fruttato-leggero",
    locale: "en",
    pageCategory: "product_detail",
  });
  assert.deepEqual(canonicalizeSitePath("/it/blog/olio-evo/"), {
    rawPath: "/it/blog/olio-evo/",
    canonicalPath: "/blog/olio-evo",
    locale: "it",
    pageCategory: "blog",
  });
  assert.deepEqual(canonicalizeSitePath("/de/shop/"), {
    rawPath: "/de/shop/",
    canonicalPath: "/shop",
    locale: "de",
    pageCategory: "shop_list",
  });
});

test("shop sessions use localized paths and count each session once per language and page type", () => {
  const events = [
    ev({ path: "/fr/boutique/" }),
    ev({ path: "/fr/boutique/fruite-leger/?v=500ml" }),
    ev({ path: "/fr/boutique/fruite-leger/?v=750ml" }),
    ev({ path: "/us/shop/" }),
    ev({ path: "/de/laden/leicht-fruchtig/", sessionId: "s-2" }),
    ev({ path: "/de/warenkorb/", sessionId: "s-2" }),
  ];
  const { sessionFunnel } = computeFunnelsAndSeries({
    orders: [], events, start, endExclusive: end, startISO: "2026-11-10", endISO: "2026-11-17", now: end,
  });

  assert.equal(sessionFunnel.shopSessions, 2);
  assert.equal(sessionFunnel.productDetailSessions, 2);
  assert.equal(sessionFunnel.cartViewedSessions, 1);
  assert.deepEqual(sessionFunnel.shopByLocale.filter((row) => row.shopListSessions || row.productDetailSessions), [
    { locale: "de", shopListSessions: 0, productDetailSessions: 1 },
    { locale: "fr", shopListSessions: 1, productDetailSessions: 1 },
    { locale: "us", shopListSessions: 1, productDetailSessions: 0 },
  ]);
  assert.equal(canonicalizeSitePath("/fr/boutique/").canonicalPath, "/shop");
  assert.equal(canonicalizeSitePath("/fr/boutique/fruite-leger/").canonicalPath, "/shop/fruite-leger");
});

test("sessionFunnel and variantFunnel respect event ordering and deduplicate repeated 5L selections per session", () => {
  const events: V6EventInput[] = [
    // Session s-1: blog -> product detail -> 4 repeated 5lt selections -> 2 add_to_cart -> checkout -> purchase
    ev({ sessionId: "s-1", path: "/blog/guida-olio/", createdAt: new Date("2026-11-10T10:00:00Z") }),
    ev({ sessionId: "s-1", path: "/shop/fruttato-leggero/", createdAt: new Date("2026-11-10T10:02:00Z") }),
    ev({ sessionId: "s-1", type: "product_view", productKey: "fruttato-leggero", variantKey: "500ml", createdAt: new Date("2026-11-10T10:02:01Z") }),
    ev({ sessionId: "s-1", type: "select_variant", productKey: "fruttato-leggero", variantKey: "5lt", createdAt: new Date("2026-11-10T10:03:00Z") }),
    ev({ sessionId: "s-1", type: "select_variant", productKey: "fruttato-leggero", variantKey: "5lt", createdAt: new Date("2026-11-10T10:03:10Z") }),
    ev({ sessionId: "s-1", type: "select_variant", productKey: "fruttato-leggero", variantKey: "5lt", createdAt: new Date("2026-11-10T10:03:20Z") }),
    ev({ sessionId: "s-1", type: "select_variant", productKey: "fruttato-leggero", variantKey: "5lt", createdAt: new Date("2026-11-10T10:03:30Z") }),
    ev({ sessionId: "s-1", type: "add_to_cart", productKey: "fruttato-leggero", variantKey: "5lt", data: { qty: 1 }, createdAt: new Date("2026-11-10T10:04:00Z") }),
    ev({ sessionId: "s-1", type: "add_to_cart", productKey: "fruttato-leggero", variantKey: "5lt", data: { qty: 2 }, createdAt: new Date("2026-11-10T10:04:30Z") }),
    ev({ sessionId: "s-1", type: "checkout_click", createdAt: new Date("2026-11-10T10:05:00Z") }),

    // Session s-2: reverse order (product detail first, then blog later) -> must NOT count as blogToProduct!
    ev({ sessionId: "s-2", visitorId: "v-2", cartId: "c-2", path: "/shop/evo/", createdAt: new Date("2026-11-11T10:00:00Z") }),
    ev({ sessionId: "s-2", visitorId: "v-2", cartId: "c-2", path: "/blog/ricette/", createdAt: new Date("2026-11-11T10:05:00Z") }),
  ];

  const orders: V6OrderInput[] = [
    ord({ id: "o-1" }),
    ord({ id: "o-2" }), // Second order in same session s-1 still counts as 1 purchasingSession!
  ];

  const res = computeFunnelsAndSeries({
    orders,
    events,
    start,
    endExclusive: end,
    startISO: "2026-11-10",
    endISO: "2026-11-17",
    now: new Date("2026-11-17T14:00:00Z"),
  });

  assert.equal(res.sessionFunnel.sessions, 2);
  assert.equal(res.sessionFunnel.blogSessions, 2);
  assert.equal(res.sessionFunnel.blogToProductSessions, 1, "Only blog followed by product detail counts");
  assert.equal(res.sessionFunnel.blogToProductRate, 0.5);
  assert.equal(res.sessionFunnel.productDetailSessions, 2);
  assert.equal(res.sessionFunnel.addToCartSessions, 1);
  assert.equal(res.sessionFunnel.addToCartAfterProductViewSessions, 1);
  assert.equal(res.sessionFunnel.purchasingSessions, 1, "Multiple orders in the same session count once");
  assert.equal(res.sessionFunnel.purchaseRate, 0.5);

  const v5lt = res.variantFunnel.find((v) => v.productKey === "fruttato-leggero" && v.variantKey === "5lt");
  assert.ok(v5lt);
  assert.equal(v5lt.selectionEvents, 4, "All 4 clicks are preserved in selectionEvents");
  assert.equal(v5lt.selectionSessions, 1, "Repeated clicks in one session count as 1 session");
  assert.equal(v5lt.addedUnits, 3);
  assert.equal(v5lt.selectionThenAddSessions, 1);
  assert.equal(v5lt.selectionToCartRate, 1);
});

test("checkoutCohort separates open, cancel_url return, expired, failed, canceled, paid and recovered", () => {
  const closedAt = new Date("2026-11-12T12:00:00Z");
  const orders: V6OrderInput[] = [
    ord({ id: "open-1", paidAt: null, status: "IN_ATTESA", events: [] }),
    ord({ id: "cancel-return-open", paidAt: null, status: "IN_ATTESA", events: [] }),
    ord({ id: "expired-1", paidAt: null, status: "SCADUTO", updatedAt: closedAt, events: [{ metaJson: null, type: "ORDER_EXPIRED", createdAt: closedAt, toStatus: "SCADUTO" }] }),
    ord({ id: "failed-1", paidAt: null, status: "FALLITO", updatedAt: closedAt, events: [{ metaJson: null, type: "STRIPE_SESSION_FAILED", createdAt: closedAt, toStatus: "FALLITO" }] }),
    ord({ id: "canceled-1", paidAt: null, status: "ANNULLATO", updatedAt: closedAt, events: [{ metaJson: null, type: "ORDER_CANCELED", createdAt: closedAt, toStatus: "ANNULLATO" }] }),
    ord({ id: "paid-direct", paidAt: closedAt, status: "PAGATO", events: [] }),
    ord({ id: "paid-recovered", paidAt: closedAt, status: "PAGATO", events: [] }),
  ];
  const events: V6EventInput[] = [
    ev({ type: "checkout_canceled", orderId: "cancel-return-open", createdAt: closedAt }),
    ev({ type: "checkout_canceled", orderId: "paid-recovered", createdAt: new Date("2026-11-12T11:50:00Z") }),
  ];

  const res = computeFunnelsAndSeries({
    orders,
    events,
    start,
    endExclusive: end,
    startISO: "2026-11-10",
    endISO: "2026-11-17",
    now: new Date("2026-11-17T14:00:00Z"),
  });

  assert.equal(res.checkoutCohort.stripeCheckoutsStarted, 7);
  assert.equal(res.checkoutCohort.openPending, 1);
  assert.equal(res.checkoutCohort.canceledReturnOpen, 1, "cancel_url return with open DB status is separated from definitive close");
  assert.equal(res.checkoutCohort.expiredUnpaid, 1);
  assert.equal(res.checkoutCohort.failedUnpaid, 1);
  assert.equal(res.checkoutCohort.canceledUnpaid, 1);
  assert.equal(res.checkoutCohort.definitiveClosedUnpaid, 3);
  assert.equal(res.checkoutCohort.paid, 2);
  assert.equal(res.checkoutCohort.recoveredAfterCancelOrClose, 1);
});

test("daily series is additive on session start date and weekdayExposure reports two Tuesdays in 8-day window", () => {
  const events: V6EventInput[] = [
    ev({ sessionId: "s-tue-1", createdAt: new Date("2026-11-10T10:00:00Z") }), // Tue 10 Nov (complete)
    ev({ sessionId: "s-tue-2", createdAt: new Date("2026-11-17T10:00:00Z") }), // Tue 17 Nov (partial today)
  ];
  const res = computeFunnelsAndSeries({
    orders: [],
    events,
    start,
    endExclusive: end,
    startISO: "2026-11-10",
    endISO: "2026-11-17",
    now: new Date("2026-11-17T14:00:00Z"),
  });

  assert.equal(res.daily.length, 8);
  assert.equal(res.daily[0].date, "2026-11-10");
  assert.equal(res.daily[0].isPartial, false);
  assert.equal(res.daily[7].date, "2026-11-17");
  assert.equal(res.daily[7].isPartial, true);
  assert.equal(res.daily.reduce((s, d) => s + d.sessions, 0), 2);

  const tuesday = res.weekdayExposure.find((w) => w.label === "Mar")!;
  assert.equal(tuesday.calendarDays, 2);
  assert.equal(tuesday.completeDays, 1);
  assert.equal(tuesday.partialDays, 1);
  assert.equal(tuesday.visits, 2);
  assert.equal(tuesday.avgVisitsPerCalendarDay, 1);
  assert.equal(tuesday.avgVisitsPerCompleteDay, 1);
});

test("computeHistoricalCustomerRetention recognizes a customer with a single order in period as returning if they bought before start", () => {
  const paidInPeriod = [
    { email: "returning@example.com", totalCents: 10000, paidAt: new Date("2026-11-12T10:00:00Z") },
    { email: "newbuyer@example.com", totalCents: 5000, paidAt: new Date("2026-11-13T10:00:00Z") },
  ];
  const historicalRows = [
    {
      email: "returning@example.com",
      fullName: "Cliente Storico",
      ordersCount: 2,
      grossCents: 20000,
      refundCents: 0,
      ltvCents: 20000,
      firstOrderAt: "2026-09-15",
      lastOrderAt: "2026-11-12",
      canLiters: 10,
      daysSinceOrder: 5,
      segment: "vip" as const,
    },
    {
      email: "newbuyer@example.com",
      fullName: "Cliente Nuovo",
      ordersCount: 1,
      grossCents: 5000,
      refundCents: 0,
      ltvCents: 5000,
      firstOrderAt: "2026-11-13",
      lastOrderAt: "2026-11-13",
      canLiters: 0,
      daysSinceOrder: 4,
      segment: "new" as const,
    },
  ];

  const ret = computeHistoricalCustomerRetention(paidInPeriod, historicalRows, start);
  assert.equal(ret.uniquePayingCustomers, 2);
  assert.equal(ret.historicalReturningCustomers, 1);
  assert.equal(ret.historicalFirstTimeCustomers, 1);
  assert.equal(ret.historicalReturningCustomerRate, 0.5);
  assert.equal(ret.historicalReturningCustomerRatePct, 50);
  assert.equal(ret.historicalReturningRevenueEur, 100);
  assert.equal(ret.historicalFirstTimeRevenueEur, 50);
});
