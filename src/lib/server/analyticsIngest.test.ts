import test from "node:test";
import assert from "node:assert/strict";
import { prepareAnalyticsEvents, saveAnalyticsBatch, allowAnalyticsRequest } from "./analyticsIngest";
import { AnalyticsPayloadSchema } from "./schemas";
import { AnalyticsQueue } from "../analytics/queue";
import type { AnalyticsEvent } from "../analytics/events";

const now = Date.parse("2026-11-08T17:00:00Z");
const event = (changes: Partial<AnalyticsEvent> = {}): AnalyticsEvent => ({
  eventId: "event-00001", occurredAt: new Date(now).toISOString(), type: "page_view",
  visitorId: "visitor-0001", sessionId: "session-0001", path: "/shop/?token=private", env: "prod", ...changes,
});
const request = (ua = "Mozilla/5.0 Chrome/130") => new Request("https://delpasqua.com/api/analytics/", {
  headers: { "user-agent": ua, "x-vercel-ip-country": "DE" },
});

test("contact clicks pass the public schema and ingestion without leaking contact details", () => {
  const payload = AnalyticsPayloadSchema.parse([event({ type: "contact_click", productKey: "whatsapp", variantKey: "contatti_page", data: { email: "private@example.com" } })]);
  assert(Array.isArray(payload));
  const [row] = prepareAnalyticsEvents(payload, request(), now);
  assert.equal(row.type, "contact_click");
  assert.equal(row.productKey, "whatsapp");
  assert.equal(row.variantKey, "contatti_page");
  assert.equal((row.data as Record<string, unknown>).email, undefined);
});

test("batches use one SQL call with parameterized data, with no read-before-write", async () => {
  const calls: unknown[][] = [];
  const db = { $executeRaw: async (sql: TemplateStringsArray, ...values: unknown[]) => {
    calls.push(values);
    assert.match(sql.join("?"), /ON CONFLICT/);
    assert.match(sql.join("?"), /o\."isTest" = false/);
    assert.match(sql.join("?"), /o\."paidAt" IS NOT NULL/);
    assert.match(sql.join("?"), /e\.type = 'checkout_canceled' AND o\."isTest" = false AND o\."stripeSessionId" IS NOT NULL/);
    return 30;
  } };
  await saveAnalyticsBatch(db, Array.from({ length: 30 }, (_, i) => event({ eventId: `event-${i}` })), request(), now);
  assert.equal(calls.length, 1);
  assert.equal(JSON.parse(String(calls[0][0])).length, 30);
});

test("bot, internal, admin, test product and stale events cause zero database calls", async () => {
  const bad = [event({ isInternal: true }), event({ path: "/en/admin/orders/" }),
    event({ productKey: "prodotto-test" }), event({ occurredAt: "2026-11-05T00:00:00Z" }),
    event({ env: "preview" })];
  const db = { $executeRaw: async () => { assert.fail("no query expected"); return 0; } };
  assert.equal(await saveAnalyticsBatch(db, bad, request(), now), 0);
  assert.equal(await saveAnalyticsBatch(db, [event()], request("HeadlessChrome"), now), 0);
});

test("ingestion removes query strings and arbitrary data and preserves event time", () => {
  const [row] = prepareAnalyticsEvents([event({ data: { qty: 2, email: "private@example.com", meta: { countryCode: "US" } } })], request(), now);
  assert.equal(row.path, "/shop/");
  assert.equal(row.createdAt, new Date(now).toISOString());
  assert.deepEqual(row.data, { qty: 2, meta: { source: "web", trafficType: "real", env: "prod", isInternal: false, device: "desktop", countryCode: "DE", acquisition: { source: "direct", evidence: "none" } } });
});

test("missing country headers remain unknown rather than being counted as Italian", () => {
  const [row] = prepareAnalyticsEvents([event()], new Request("https://delpasqua.com/api/analytics/", {
    headers: { "user-agent": "Mozilla/5.0 Chrome/130" },
  }), now);
  assert.equal((row.data as { meta: { countryCode: string } }).meta.countryCode, "ND");
});

test("leave and purchase have stable IDs across retry/reload", () => {
  const [a] = prepareAnalyticsEvents([event({ type: "page_leave", pageId: "page-000001" })], request(), now);
  const [b] = prepareAnalyticsEvents([event({ eventId: "another-id", type: "page_leave", pageId: "page-000001" })], request(), now);
  assert.equal(a.id, b.id);
  const [p] = prepareAnalyticsEvents([event({ type: "purchase", orderId: "paid-order" })], request(), now);
  assert.equal(p.id, "ana-purchase-paid-order");
});

test("queue acknowledgement cannot discard newer leave durations or events", () => {
  const queue = new AnalyticsQueue();
  queue.add(event({ type: "page_leave", durationMs: 1000 }));
  const sent = queue.batch();
  queue.add(event({ type: "page_leave", durationMs: 5000 }));
  queue.add(event({ eventId: "event-second" }));
  queue.acknowledge(sent);
  assert.equal(queue.snapshot().length, 2);
  assert.equal(queue.snapshot()[0].durationMs, 5000);
  queue.acknowledge(queue.batch());
  assert.equal(queue.snapshot().length, 0);
});

test("queue restores pending deliveries, bounds batches and expires old events", () => {
  const queue = new AnalyticsQueue(Array.from({ length: 50 }, (_, i) => event({ eventId: `event-${i}` })), now);
  assert.equal(queue.batch().length, 30);
  assert.equal(new AnalyticsQueue(queue.snapshot(), now + 25 * 60 * 60_000).batch().length, 0);
  assert.equal(AnalyticsPayloadSchema.safeParse([event({ type: "page_heartbeat" as never })]).success, false);
});

test("rate guard rejects excessive batches without touching the database", () => {
  for (let i = 0; i < 60; i++) assert.equal(allowAnalyticsRequest("analytics-test-ip", now), true);
  assert.equal(allowAnalyticsRequest("analytics-test-ip", now), false);
  assert.equal(allowAnalyticsRequest("analytics-test-ip", now + 60_001), true);
});

test("permanently excluded cookies reject every event before database access", async () => {
  const req = new Request(request(), { headers: { cookie: "analytics_excluded=1", "user-agent": "Mozilla/5.0 Chrome/130" } });
  const db = { $executeRaw: async () => { assert.fail("excluded browser must not write events"); return 0; } };
  assert.equal(await saveAnalyticsBatch(db, [event(), event({ type: "purchase", orderId: "paid-order" })], req, now), 0);
});

test("late batches check the persisted browser exclusion inside the ingestion query", async () => {
  const db = { $executeRaw: async (sql: TemplateStringsArray) => {
    assert.match(sql.join("?"), /WHERE NOT EXISTS/);
    assert.match(sql.join("?"), /excluded\.id = 'ana-excluded-' \|\| e\.env \|\| '-' \|\| e\."visitorId"/);
    assert.match(sql.join("?"), /excluded\.type = 'analytics_excluded' AND excluded\."isInternal" = true/);
    return 0;
  } };
  assert.equal(await saveAnalyticsBatch(db, [event()], request(), now), 0);
});
