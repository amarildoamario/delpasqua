import test from "node:test";
import assert from "node:assert/strict";
import { activityWindow, summarizeActivityTimeline, readActivityTimeline } from "./activityTimeline";
import type { PrismaClient } from "@/generated/prisma";

const now = new Date("2026-11-10T15:37:00Z");
const event = (date: Date, id: string, type = "page_view") => ({ type, createdAt: date, sessionId: id, visitorId: id, cartId: id, path: "/shop/" });

test("quick ranges have continuous buckets including zero periods and use Rome calendar days", () => {
  for (const [key, count] of [["hour", 12], ["day", 24], ["week", 28], ["month", 30], ["quarter", 30]] as const) {
    const window = activityWindow(key, "2026-11-10", now);
    assert.equal(window.windows.length, count);
    assert.equal(window.windows[0].from, window.start.getTime());
    assert.equal(window.windows.at(-1)!.until, window.end.getTime());
    window.windows.slice(1).forEach((bucket, i) => assert.equal(bucket.from, window.windows[i].until));
    const rows = summarizeActivityTimeline([], [], window).rows;
    assert.equal(rows.length, count);
    assert(rows.every((row) => row.visits === 0 && row.orders === 0));
  }
  const day = activityWindow("day", "2026-11-10", now);
  assert.equal(day.start.toISOString(), "2026-11-09T23:00:00.000Z");
  assert.equal(day.end.toISOString(), "2026-11-10T23:00:00.000Z");
  assert.equal(activityWindow("invalid", "2026-11-10", now).key, "day");
  assert.equal(activityWindow("hour", "2026-11-09", now).start.toISOString(), "2026-11-09T22:00:00.000Z");
});

test("last hour can cross midnight without becoming a rolling-day chart", () => {
  const at = new Date("2026-11-09T23:20:00Z");
  const hour = activityWindow("hour", "2026-11-10", at);
  assert.equal(hour.start.toISOString(), "2026-11-09T22:20:00.000Z");
  assert.equal(hour.end.getTime(), at.getTime());
  assert.equal(activityWindow("day", "2026-11-10", at).start.toISOString(), "2026-11-09T23:00:00.000Z");
});

test("timeframes include all events, count visits/carts once, and assign payments to exact buckets", () => {
  const window = activityWindow("week", "2026-11-10", now);
  const first = new Date(window.windows[0].from), second = new Date(window.windows[1].from);
  const rows = summarizeActivityTimeline([
    event(second, "return"), event(first, "return"), event(second, "new"),
    event(first, "cart", "add_to_cart"), event(second, "cart", "add_to_cart"),
    event(window.end, "outside"), event(new Date(first.getTime() - 1), "before"),
    { ...event(first, "admin"), path: "/admin/" },
  ], [
    { id: "order", paidAt: second, isTest: false }, { id: "order", paidAt: second, isTest: false },
    { id: "test", paidAt: first, isTest: true }, { id: "future", paidAt: window.end, isTest: false },
  ], window).rows;
  assert.deepEqual(rows.slice(0, 2).map(({ visits, carts, orders }) => ({ visits, carts, orders })), [
    { visits: 1, carts: 1, orders: 0 }, { visits: 1, carts: 0, orders: 1 },
  ]);
  assert.equal(rows.reduce((sum, row) => sum + row.visits, 0), 2);
});

test("DST keeps daily boundaries accurate and repeated-hour buckets distinct", () => {
  for (const [day, count] of [["2026-03-29", 23], ["2026-10-25", 25]] as const) {
    const window = activityWindow("day", day, now);
    assert.equal(window.windows.length, count);
    assert.equal(new Set(window.windows.map((bucket) => bucket.label)).size, count);
    const rows = summarizeActivityTimeline(window.windows.map((bucket, i) => event(new Date(bucket.from), String(i))), [], window).rows;
    assert.equal(rows.reduce((sum, row) => sum + row.visits, 0), count);
    const month = activityWindow("month", day, now);
    assert.equal(month.windows.length, 30);
    assert.equal(month.end.getTime(), window.end.getTime());
    assert.equal(month.windows.at(-1)!.from, window.start.getTime());
  }
});

test("reader uses the selected timeframe for both sources and preserves quality filters", async () => {
  const queries: unknown[] = [];
  const db = { analyticsEvent: { findMany: async (args: unknown) => { queries.push(args); return []; } },
    order: { findMany: async (args: unknown) => { queries.push(args); return []; } } } as unknown as Pick<PrismaClient, "analyticsEvent" | "order">;
  const result = await readActivityTimeline(db, "quarter", "2026-11-10", false, now);
  const window = activityWindow("quarter", "2026-11-10", now);
  const [events, orders] = queries as { where: Record<string, unknown> }[];
  assert.equal(events.where.env, "prod");
  assert.equal(events.where.isInternal, false);
  assert.equal(orders.where.isTest, false);
  assert.deepEqual(events.where.createdAt, { gte: window.start, lt: window.end });
  assert.deepEqual(orders.where.paidAt, events.where.createdAt);
  assert.equal(result.rows.length, 30);
});
