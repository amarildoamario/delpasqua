import test from "node:test";
import assert from "node:assert/strict";
import { summarizePageRankings, rankPages, formatPageTime } from "../pageRankings";

test("page rankings combine normalized paths using weighted averages and retain missing versus zero durations", () => {
  const pages = summarizePageRankings([
    { path: "/shop/?utm=a", _count: { path: 10 } }, { path: "/shop", _count: { path: 2 } },
    { path: "/no-duration/", _count: { path: 3 } }, { path: "/zero/", _count: { path: 1 } },
  ], [
    { path: "/shop/?utm=a", _sum: { durationMs: 9000 }, _count: { durationMs: 9 }, _max: { durationMs: 1500 } },
    { path: "/shop/", _sum: { durationMs: 11000 }, _count: { durationMs: 1 }, _max: { durationMs: 11000 } },
    { path: "/zero/", _sum: { durationMs: 0 }, _count: { durationMs: 1 }, _max: { durationMs: 0 } },
  ]);
  assert.deepEqual(pages.find((row) => row.path === "/shop"), { path: "/shop", views: 12, totalMs: 20000, averageMs: 2000, longestMs: 11000, samples: 10 });
  assert.equal(pages.find((row) => row.path === "/no-duration")!.averageMs, null);
  assert.equal(pages.find((row) => row.path === "/zero")!.averageMs, 0);
  assert.equal(formatPageTime(null), "—");
  assert.equal(formatPageTime(3600000), "1h 0m");
});

test("duration rankings search the full dataset before taking top rows", () => {
  const pages = Array.from({ length: 30 }, (_, i) => ({ path: `/page-${i}`, views: 30 - i, totalMs: i * 1000, averageMs: (30 - i) * 1000, longestMs: i === 25 ? 100000 : i * 1000, samples: 1 }));
  assert.equal(rankPages(pages, "views")[0].path, "/page-0");
  assert.equal(rankPages(pages, "totalMs").slice(0, 20)[0].path, "/page-29");
  assert.equal(rankPages(pages, "averageMs")[0].path, "/page-0");
  assert.equal(rankPages(pages, "longestMs")[0].path, "/page-25");
  assert.equal(rankPages(pages, "totalMs", "PAGE-2").length, 11);
  assert.equal(pages[0].path, "/page-0");
});
