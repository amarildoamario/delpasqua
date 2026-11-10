import test from "node:test";
import assert from "node:assert/strict";
import { acquisitionSource, isSitePage } from "../analytics/acquisition";
import { summarizeCommerceInsights, readCommerceInsights } from "./commerceInsights";
import { summarizeCustomers } from "./customerMetrics";
import { orderAnalyticsContext } from "./orderAnalytics";
import { prepareAnalyticsEvents } from "./analyticsIngest";
import type { PrismaClient } from "@/generated/prisma";

const start = new Date("2026-11-08T23:00:00Z"), end = new Date("2026-11-09T23:00:00Z");
type Event = Parameters<typeof summarizeCommerceInsights>[1][number];
type Order = Parameters<typeof summarizeCommerceInsights>[0][number];
const event = (extra: Partial<Event> = {}): Event => ({ type: "page_view", createdAt: new Date("2026-11-09T09:00:00Z"), visitorId: "visitor-0001", sessionId: "session-0001", cartId: "cart-00001", orderId: null, path: "/shop/", referrer: null, userAgent: null, data: null, ...extra });
const order = (extra: Partial<Order> = {}): Order => ({ id: "order-00001", isTest: false, createdAt: new Date("2026-11-09T09:00:00Z"), paidAt: new Date("2026-11-09T10:00:00Z"), stripeCheckoutSessionId: "cs_1", events: [{ metaJson: JSON.stringify({ visitorId: "visitor-0001", sessionId: "session-0001", env: "prod" }) }], ...extra });

test("acquisition uses specific app signatures and bounded referrer domains, never Chrome alone", () => {
  assert.deepEqual(acquisitionSource("Instagram 300 FBAV/123", null), { source: "instagram", evidence: "browser" });
  for (const ua of ["[FBAN/FBIOS;FBAV/123]", "FB_IAB/FB4A"]) assert.equal(acquisitionSource(ua).source, "facebook");
  for (const url of ["https://l.instagram.com/path", "https://instagram.com/?secret=1"]) assert.equal(acquisitionSource("", url).source, "instagram");
  assert.equal(acquisitionSource("", "https://l.facebook.com/l.php").source, "facebook");
  for (const url of ["https://www.google.it/search", "https://www.google.co.uk/", "https://google.com/", "https://www.google.co.in/", "https://images.google.com.br/"]) assert.equal(acquisitionSource("", url).source, "google");
  assert.equal(acquisitionSource("GSA/123 Mobile").source, "google");
  assert.equal(acquisitionSource("Chrome/145 Safari/537.36").source, "direct");
  for (const url of ["https://google.com.evil.test/", "https://notfacebook.com/", "https://instagram.com.evil.test/", "https://notgoogle.com/"]) assert.equal(acquisitionSource("", url).source, "referral");
  for (const url of ["https://checkout.stripe.com/", "https://delpasqua.com/shop/", "bad", "/shop/", "javascript:alert(1)"]) assert.equal(acquisitionSource("", url).source, "direct");
});

test("site traffic excludes localized checkout and admin paths without excluding similarly named pages", () => {
  for (const path of ["/en/checkout/success/", "/de/admin/", "/checkout", "/api/order", "/developer/", null]) assert.equal(isSitePage(path), false);
  for (const path of ["/en/shop/", "/", "/apicoltura/", "/payments-guide/"]) assert.equal(isSitePage(path), true);
});

test("Stripe exits deduplicate returns, exclude recovered payments and retain unknown outcomes", () => {
  const orders = [order(), order({ id: "canceled", paidAt: null }), order({ id: "pending", paidAt: null }), order({ id: "failed-before-stripe", paidAt: null, stripeCheckoutSessionId: null }), order({ id: "old", createdAt: new Date("2026-01-01"), paidAt: null }), order({ id: "future-payment", paidAt: end }), order({ id: "test", isTest: true, paidAt: null })];
  const events = ["order-00001", "canceled", "canceled", "old", "test", "forged", "future-payment"].map((id) => event({ type: "checkout_canceled", orderId: id }));
  const result = summarizeCommerceInsights(orders, events, [], start, end);
  assert.deepEqual(result.stripe, { started: 4, paid: 1, canceledUnpaid: 2, recovered: 1, pendingOrUnobserved: 1, exitRate: 2 / 3 });
  assert.equal(summarizeCommerceInsights([], [], [], start, end).stripe.exitRate, null);
});

test("decision history predates selected period and does not require purchase browser events", () => {
  const first = event({ createdAt: new Date("2026-11-06T10:00:00Z"), sessionId: "session-earlier" });
  const current = event();
  const result = summarizeCommerceInsights([order(), order({ id: "unmatched", events: [] }), order({ id: "test", isTest: true })], [current, current, event({ createdAt: new Date("2026-11-09T12:00:00Z"), sessionId: "session-after-payment" })], [first], start, end);
  assert.deepEqual(result.decision, { samples: 1, paidOrders: 2, avgDays: 3, avgSessions: 2 });
});

test("decision can use a legacy purchase link and never blends different visitors or local context", () => {
  const local = order({ events: [{ metaJson: JSON.stringify({ visitorId: "visitor-0001", sessionId: "session-0001", env: "dev" }) }] });
  const rows = [event(), event({ visitorId: "someone-else", createdAt: new Date("2026-01-01") })];
  assert.equal(summarizeCommerceInsights([local], rows, [], start, end).decision.samples, 0);
  const linked = [...rows, event({ type: "purchase", orderId: local.id })];
  assert.equal(summarizeCommerceInsights([local], linked, [], start, end).decision.samples, 1);
});

test("hour/day charts count unique visits and carts, all paid orders, in Rome local time", () => {
  const at = new Date("2026-11-08T23:30:00Z"); // Monday 00:30 in Rome, Sunday in UTC.
  const rows = [event({ createdAt: at }), event({ createdAt: new Date("2026-11-09T05:00:00Z") }), event({ type: "add_to_cart", createdAt: at }), event({ type: "add_to_cart", createdAt: at }), event({ type: "page_view", path: "/en/checkout/success/", sessionId: "ignore", createdAt: at })];
  const result = summarizeCommerceInsights([order({ paidAt: at }), order({ id: "second", paidAt: at })], rows, [], start, end);
  assert.equal(result.hourly.length, 24);
  assert.equal(result.weekdays.length, 7);
  assert.deepEqual(result.hourly[0], { label: "00:00", visits: 1, carts: 1, orders: 2 });
  assert.deepEqual(result.weekdays[0], { label: "Lun", visits: 1, carts: 1, orders: 2 });
  assert.equal(result.hourly.reduce((sum, row) => sum + row.visits, 0), 1);
  assert.equal(result.acquisition.reduce((sum, row) => sum + row.sessions, 0), 1);
});

test("Rome summer time is used rather than a fixed UTC offset", () => {
  const at = new Date("2026-07-05T22:30:00Z");
  const result = summarizeCommerceInsights([], [event({ createdAt: at })], [], new Date("2026-07-05T22:00:00Z"), new Date("2026-07-06T22:00:00Z"));
  assert.equal(result.hourly[0].visits, 1);
  assert.equal(result.weekdays[0].visits, 1);
});

test("hourly totals use only the final Rome calendar day and deduplicate independently of previous days", () => {
  const rangeStart = new Date("2026-11-07T23:00:00Z");
  const midnight = new Date("2026-11-08T23:00:00Z");
  const events = [
    event({ createdAt: new Date(midnight.getTime() - 1) }),
    event({ type: "add_to_cart", createdAt: new Date(midnight.getTime() - 1) }),
    event({ createdAt: midnight }),
    event({ createdAt: new Date(midnight.getTime() + 1000) }),
    event({ type: "add_to_cart", createdAt: midnight }),
    event({ createdAt: new Date(end.getTime() - 1), sessionId: "late-session" }),
    event({ createdAt: end, sessionId: "tomorrow" }),
  ];
  const result = summarizeCommerceInsights([
    order({ id: "previous", paidAt: new Date(midnight.getTime() - 1) }),
    order({ id: "midnight", paidAt: midnight }),
    order({ id: "end-boundary", paidAt: end }),
  ], events, [], rangeStart, end);
  assert.equal(result.hourlyDay, "2026-11-09");
  assert.deepEqual(result.hourly[0], { label: "00:00", visits: 1, carts: 1, orders: 1 });
  assert.equal(result.hourly[23].visits, 1);
  assert.equal(result.hourly.reduce((sum, row) => sum + row.visits, 0), 2);
  assert.equal(result.hourly.reduce((sum, row) => sum + row.orders, 0), 1);
  assert.equal(result.weekdays.reduce((sum, row) => sum + row.orders, 0), 2);
});

test("daily activity follows Rome midnight through both daylight saving transitions", () => {
  for (const [from, to, day, hours] of [
    ["2026-03-28T23:00:00Z", "2026-03-29T22:00:00Z", "2026-03-29", 23],
    ["2026-10-24T22:00:00Z", "2026-10-25T23:00:00Z", "2026-10-25", 25],
  ] as const) {
    const fromDate = new Date(from), toDate = new Date(to);
    const rows = Array.from({ length: hours }, (_, i) => event({ createdAt: new Date(fromDate.getTime() + i * 3600000), sessionId: `session-${i}` }));
    const result = summarizeCommerceInsights([], rows, [], new Date(fromDate.getTime() - 86400000), toDate);
    assert.equal(result.hourlyDay, day);
    assert.equal(result.hourly.reduce((sum, row) => sum + row.visits, 0), hours);
    assert.equal(result.hourly[0].visits, 1);
    assert.equal(result.hourly[23].visits, 1);
    assert.equal(result.hourly[2].visits, hours === 23 ? 0 : 2);
  }
});

test("LTV normalizes emails across all history, subtracts refunds, deduplicates and segments customers", () => {
  const now = new Date("2026-11-09T12:00:00Z");
  const base = { id: "a", isTest: false, email: " VIP@example.com ", fullName: "VIP", paidAt: now, totalCents: 10000, refundCents: 1000, items: [{ productId: "evo-latta", variantId: "5lt", qty: 2 }] };
  const rows = [base, base, { ...base, id: "b", email: "vip@example.com", paidAt: new Date("2024-01-01"), totalCents: 20000, refundCents: 5000, items: [] },
    { ...base, id: "d", email: "dormant@example.com", paidAt: new Date("2025-01-01") },
    { ...base, id: "n", email: "new@example.com", items: [] },
    { ...base, id: "r", email: "refunded@example.com", refundCents: 10000 },
    { ...base, id: "t", email: "test@example.com", isTest: true }, { ...base, id: "blank", email: "  " },
    { ...base, id: "unpaid", email: "unpaid@example.com", paidAt: null }];
  const result = summarizeCustomers(rows, now);
  const vip = result.rows.find((r) => r.email === "vip@example.com")!;
  assert.equal(vip.ordersCount, 2);
  assert.equal(vip.grossCents, 30000);
  assert.equal(vip.refundCents, 6000);
  assert.equal(vip.ltvCents, 24000);
  assert.equal(vip.canLiters, 10);
  assert.equal(vip.segment, "vip");
  assert.equal(result.totalCustomers, 4);
  assert.deepEqual(result.segments, { vip: 1, dormant: 1, new: 2, active: 0 });
  assert.equal(result.rows.find((r) => r.email === "refunded@example.com")!.canLiters, 0);
  assert.equal(summarizeCustomers([], now).avgLtvCents, null);
});

test("order attribution validates anonymous IDs and honors consent/internal exclusions", () => {
  const req = (cookie: string) => new Request("https://delpasqua.com/api/order", { headers: { cookie } });
  const cookie = "v_id=visitor-0001; s_id=session-0001";
  assert.deepEqual(orderAnalyticsContext(req(cookie)), { visitorId: "visitor-0001", sessionId: "session-0001", env: "prod" });
  for (const extra of ["; analytics_consent=0", "; internal=1", "; v_id=%3Cscript%3E", "; s_id=bad", "; v_id=%broken"]) assert.equal(orderAnalyticsContext(req(cookie + extra)), null);
});

test("cancel ingestion has an order-stable key across reloads", () => {
  const incoming = { eventId: "event-00001", type: "checkout_canceled" as const, visitorId: "visitor-0001", sessionId: "session-0001", orderId: "order-00001", path: "/checkout/cancel/" };
  const req = new Request("https://delpasqua.com/api/analytics", { headers: { "user-agent": "Instagram 300" } });
  const a = prepareAnalyticsEvents([incoming], req);
  const b = prepareAnalyticsEvents([{ ...incoming, eventId: "different" }], req);
  assert.equal(a[0].id, b[0].id);
  assert.equal((a[0].data as { meta: { acquisition: { source: string } } }).meta.acquisition.source, "instagram");
});

test("reader fetches pre-period visitor history without requiring success events", async () => {
  const calls: { where: unknown }[] = [];
  const db = {
    order: { findMany: async () => [order()] },
    analyticsEvent: { findMany: async (args: { where: unknown }) => { calls.push(args); return calls.length === 1 ? [event()] : [event({ createdAt: new Date("2026-10-01T10:00:00Z") })]; } },
  } as unknown as Pick<PrismaClient, "order" | "analyticsEvent">;
  const result = await readCommerceInsights(db, start, end);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1].where, { env: "prod", isInternal: false, type: "page_view", visitorId: { in: ["visitor-0001"] }, createdAt: { lt: start } });
  assert.equal(result.decision.samples, 1);
  assert.equal(result.decision.avgDays, 39);
});
