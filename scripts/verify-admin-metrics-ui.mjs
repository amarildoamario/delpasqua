// Authenticated local browser checks. Only login/logout sessions change; no business data is written.
// node scripts/verify-admin-metrics-ui.mjs http://localhost:3000
import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import dotenv from "dotenv";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const env = { ...dotenv.parse(readFileSync(".env")), ...dotenv.parse(readFileSync(".env.local")) };
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, timezoneId: "America/Los_Angeles" });
const page = await context.newPage();
const errors = [];
const report = { passed: false, routes: [], timezone: "America/Los_Angeles", businessDataMutated: false };
page.on("pageerror", (error) => errors.push(error.message));
let loggedIn = false;

async function range(start, end, preserved) {
  await page.waitForFunction(({ start, end }) => {
    const inputs = document.querySelectorAll('input[type="date"]');
    return inputs[0]?.value === start && inputs[1]?.value === end;
  }, { start, end }, { timeout: 60000 });
  const url = new URL(page.url());
  for (const [key, value] of Object.entries(preserved)) assert.equal(url.searchParams.get(key), value);
  const href = await page.getByRole("link", { name: /^(?:Export JSON|Scarica report)/ }).getAttribute("href");
  const exportUrl = new URL(href, base);
  assert.equal(exportUrl.searchParams.get("start"), start);
  assert.equal(exportUrl.searchParams.get("end"), end);
}

async function controlsReady() {
  await page.waitForFunction(() => {
    const input = document.querySelector('input[type="month"]');
    return input && Object.keys(input).some((key) => key.startsWith("__reactProps$"));
  }, undefined, { timeout: 60000 });
}

try {
  console.log("Checking local admin UI with authenticated session; no commercial writes");
  const login = await context.request.post(`${base}/api/auth/login/`, { data: { email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }, headers: { Origin: base } });
  assert.equal(login.status(), 200); loggedIn = true;
  for (const route of process.argv[3] === "metrics" ? ["metrics"] : ["dashboard", "metrics"]) {
    const preserved = route === "dashboard" ? { market: "IT", purchasedCountry: "DE" } : { internal: "0" };
    await page.goto(`${base}/admin/${route}/?${new URLSearchParams(preserved)}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByLabel("Mese", { exact: true }).waitFor({ timeout: 60000 });
    await controlsReady();
    if (route === "dashboard") {
      assert.equal(await page.getByText("Provenienza automatica", { exact: true }).count(), 0);
      assert.equal(await page.getByText("Clienti e LTV storico", { exact: true }).count(), 0);
      assert.equal(await page.getByText("Attività nelle 24 ore", { exact: true }).count(), 0);
    }
    await page.getByLabel("Mese", { exact: true }).fill("2026-09"); await range("2026-09-01", "2026-09-30", preserved);
    const exportLink = page.getByRole("link", { name: /^(?:Export JSON|Scarica report)/ });
    let response = await context.request.get(new URL(await exportLink.getAttribute("href"), base).href);
    assert.equal(response.status(), 200);
    const empty = await response.json();
    assert.equal(route === "dashboard" ? empty.kpis.uniqueVisitors : empty.kpis.uniqueSessions, 0);
    if (route === "dashboard") assert.equal(empty.insights, undefined);
    else assert(empty.insights.hourly.every((row) => row.visits === 0 && row.orders === 0));
    await page.getByLabel("Mese", { exact: true }).fill("2026-11"); await range("2026-11-01", "2026-11-30", preserved);
    response = await context.request.get(new URL(await exportLink.getAttribute("href"), base).href);
    const filled = await response.json();
    assert((route === "dashboard" ? filled.kpis.uniqueVisitors : filled.kpis.uniqueSessions) > 0);
    await page.getByLabel("Anno", { exact: true }).selectOption("2025"); await range("2025-11-01", "2025-11-30", preserved);
    await page.getByLabel("Trimestre", { exact: true }).selectOption("Q1"); await range("2025-01-01", "2025-03-31", preserved);
    await page.getByLabel("Anno", { exact: true }).selectOption("2024"); await range("2024-01-01", "2024-03-31", preserved);
    await page.getByLabel("Semestre", { exact: true }).selectOption("H2"); await range("2024-07-01", "2024-12-31", preserved);
    await page.getByLabel("Anno", { exact: true }).selectOption("2026"); await range("2026-07-01", "2026-12-31", preserved);
    await page.getByLabel("Mese", { exact: true }).fill("2026-11"); await range("2026-11-01", "2026-11-30", preserved);
    await page.getByLabel("Da", { exact: true }).fill("2026-11-08"); await range("2026-11-08", "2026-11-30", preserved);
    await page.getByLabel("A", { exact: true }).fill("2026-11-08"); await range("2026-11-08", "2026-11-08", preserved);
    await page.getByLabel("Da", { exact: true }).fill("2026-11-10"); await range("2026-11-08", "2026-11-10", preserved);
    await page.goto(`${base}/admin/${route}/?${new URLSearchParams({ ...preserved, start: "2026-11-10", end: "2026-11-08" })}`);
    await range("2026-11-08", "2026-11-10", preserved);
    await controlsReady();
    await page.getByLabel("Mese", { exact: true }).fill("2026-11"); await range("2026-11-01", "2026-11-30", preserved);
    const flags = page.locator('img[src^="/flags/"]');
    if (route === "dashboard") assert(await flags.count() > 0);
    for (const flag of await flags.all()) assert.equal(await flag.evaluate((node) => getComputedStyle(node).borderRadius), "0px");
    if (route === "metrics") {
      assert(await page.getByRole("button", { name: /^Informazioni:/ }).count() >= 35);
      for (const name of ["Provenienza automatica", "Fuga da Stripe osservata", "Tempo di decisione", "Clienti e LTV storico", "Segmenti clienti", "Attività nelle 24 ore", "Attività per giorno della settimana", "Fatturato Incassato", "Click WhatsApp", "Litri Richiesti a Carrello"]) {
        const button = page.getByRole("button", { name: `Informazioni: ${name}`, exact: true });
        await button.click();
        await page.getByRole("tooltip").waitFor();
        assert((await page.getByRole("tooltip").innerText()).length > 60);
        await page.keyboard.press("Escape");
        await page.getByRole("tooltip").waitFor({ state: "hidden" });
      }
      const plot = page.getByRole("region", { name: "Attività nelle 24 ore: grafico scorrevole" });
      const width = await plot.locator('[data-histogram-bar="visits"]').first().evaluate((node) => node.getBoundingClientRect().width);
      assert(width >= 11, `Hourly bar width ${width}px`);
      await plot.locator("..").screenshot({ path: "scratch/gestionale-risultati/metrics-hourly-histogram.png" });
      const sum = filled.insights.hourly.reduce((n, row) => n + row.visits, 0);
      assert.equal(sum, filled.kpis.uniqueSessions);
      await page.getByText("Valori e picchi", { exact: true }).first().click();
      assert(await page.locator("details").first().getByRole("table").isVisible());
    }
    mkdirSync("scratch/gestionale-risultati", { recursive: true });
    await page.screenshot({ path: `scratch/gestionale-risultati/${route}-review-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByLabel("Da", { exact: true }).scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (route === "metrics") {
      await page.getByRole("button", { name: "Informazioni: Provenienza automatica", exact: true }).click();
      const tip = page.getByRole("tooltip"); await tip.waitFor();
      const bounds = await tip.boundingBox(); assert(bounds.x >= 0 && bounds.x + bounds.width <= 390);
      await page.keyboard.press("Escape");
    }
    await page.screenshot({ path: `scratch/gestionale-risultati/${route}-review-mobile.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1050 });
    report.routes.push({ route, dateControls: true, exportMatchesRange: true, otherFiltersPreserved: true, mobileOverflow: false });
    console.log(`PASS: ${route}: month/year/quarter/semester, day, reversed dates, export, rectangular flags, desktop/mobile`);
  }
  assert.deepEqual(errors, []); report.passed = true;
  writeFileSync("scratch/gestionale-risultati/admin-metrics-ui.json", JSON.stringify(report, null, 2));
  console.log("PASS: metrics tooltips, hourly bars at least 11px, separate dashboard, no browser errors");
} catch (error) {
  mkdirSync("scratch/gestionale-risultati", { recursive: true });
  await page.screenshot({ path: "scratch/gestionale-risultati/admin-metrics-error.png" });
  console.log(JSON.stringify({ stage: "browser-check", url: page.url(), dates: await page.locator('input[type="date"]').evaluateAll((inputs) => inputs.map((input) => input.value)), errors }));
  throw error;
} finally {
  if (loggedIn) await context.request.post(`${base}/api/auth/logout/`, { headers: { Origin: base } });
  await browser.close();
}
