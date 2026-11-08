import test from "node:test";
import assert from "node:assert/strict";
import { getAnalyticsCountryCode, normalizeTrafficCountry, summarizeTrafficGeography } from "./trafficGeography";

const view = (id: string, country: unknown, extra = {}) => ({
  type: "page_view", visitorId: id, sessionId: `session-${id}`,
  createdAt: new Date("2026-11-08T17:00:00Z"), data: { meta: { countryCode: country } }, ...extra,
});

test("three Italian and two Maltese visitors reconcile with five total visitors/sessions", () => {
  const result = summarizeTrafficGeography([
    view("it1", "IT"), view("it2", "IT"), view("it3", "IT"), view("mt1", "MT"), view("mt2", "MT"),
  ]);
  assert.equal(result.uniqueVisitorsCount, 5);
  assert.equal(result.uniqueSessionsCount, 5);
  assert.deepEqual(result.visitorCountriesData, [{ label: "IT", value: 3 }, { label: "MT", value: 2 }]);
  assert.deepEqual(result.sessionCountriesData, result.visitorCountriesData);
});

test("non-sales countries and unknown locations remain in the traffic totals", () => {
  const result = summarizeTrafficGeography([view("ca", "CA"), view("unknown", null), view("mt", "mt")]);
  assert.equal(result.visitorCountriesData.length, 3);
  assert(result.visitorCountriesData.some((row) => row.label === "ND" && row.value === 1));
  assert.equal(getAnalyticsCountryCode(null), "ND");
  assert.equal(normalizeTrafficCountry("invalid"), "ND");
  assert.equal(normalizeTrafficCountry("XX"), "ND");
});

test("repeat pageviews and a country change do not double-count a visitor or session", () => {
  const result = summarizeTrafficGeography([
    view("same", "MT", { createdAt: new Date("2026-11-08T18:00:00Z") }),
    view("same", "IT"), view("same", "IT"),
  ]);
  assert.equal(result.uniqueVisitorsCount, 1);
  assert.deepEqual(result.visitorCountriesData, [{ label: "IT", value: 1 }]);
  assert.deepEqual(result.sessionCountriesData, [{ label: "IT", value: 1 }]);
});

test("a new session can have another country without creating another visitor", () => {
  const result = summarizeTrafficGeography([
    view("same", "IT"), view("same", "MT", { sessionId: "second-session", createdAt: new Date("2026-11-08T18:00:00Z") }),
    view("ignored", "IT", { type: "product_view" }),
  ]);
  assert.equal(result.uniqueVisitorsCount, 1);
  assert.equal(result.uniqueSessionsCount, 2);
  assert.equal(result.visitorCountriesData.reduce((sum, row) => sum + row.value, 0), 1);
  assert.equal(result.sessionCountriesData.reduce((sum, row) => sum + row.value, 0), 2);
});

test("an initially unknown country is resolved without losing the visitor", () => {
  const result = summarizeTrafficGeography([view("same", null), view("same", "MT", { createdAt: new Date("2026-11-08T18:00:00Z") })]);
  assert.deepEqual(result.visitorCountriesData, [{ label: "MT", value: 1 }]);
});
