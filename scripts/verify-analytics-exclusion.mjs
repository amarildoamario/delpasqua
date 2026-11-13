// Local browser verification. Activation has no visitor cookie, so no history
// is changed; all attempted analytics deliveries are intercepted.
import assert from "node:assert/strict";
import { chromium, devices } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3093";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext(mobile ? devices["iPhone 13"] : {});
    let deliveries = 0;
    await context.route(/\/api\/analytics\/$/, async (route) => {
      deliveries++;
      await route.fulfill({ status: 204 });
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${base}/api/analytics/exclude/`);
    assert.equal(response.status(), 200);
    assert.match(response.headers()["content-security-policy"], /frame-ancestors 'none'/);
    await page.getByRole("heading", { name: "Questo browser è escluso" }).waitFor();
    const cookie = (await context.cookies()).find((item) => item.name === "analytics_excluded");
    assert(cookie && cookie.value === "1");
    assert(cookie.expires > Date.now() / 1000 + 390 * 86400);
    assert.equal(await page.evaluate(() => localStorage.getItem("analytics_excluded_v1")), "1");
    await page.screenshot({ path: `scratch/analytics-exclusion-${mobile ? "mobile" : "desktop"}.png`, fullPage: true });

    // Restore opt-out from localStorage after only the cookie was removed.
    await context.clearCookies();
    await page.goto(`${base}/contatti/?test_mode=0`);
    await page.waitForFunction(() => document.cookie.includes("analytics_excluded=1"));
    await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
    assert.equal(await page.evaluate(() => sessionStorage.getItem("analytics_queue_v2")), null);
    assert.equal(deliveries, 0);

    // A new document with the cookie alone also stays excluded.
    await page.evaluate(() => localStorage.removeItem("analytics_excluded_v1"));
    await page.reload();
    await page.waitForFunction(() => localStorage.getItem("analytics_excluded_v1") === "1");
    assert.equal(deliveries, 0);
    const forbidden = await context.request.post(`${base}/api/analytics/exclude/`, { headers: { Origin: "https://evil.example" } });
    assert.equal(forbidden.status(), 403);
    assert.deepEqual(errors, []);
    results.push({ browser: mobile ? "Chromium mobile viewport" : "Chromium desktop", excluded: true, deliveries, storageRecovery: true, csrfRejected: true });
    await context.close();
  }
  // Server rejects excluded browsers even when the client is bypassed.
  const context = await browser.newContext();
  const excluded = await context.request.post(`${base}/api/analytics/`, { headers: { Cookie: "analytics_excluded=1" }, data: "invalid body that must never be parsed" });
  assert.equal(excluded.status(), 204);
  await context.close();
  await mkdir("scratch", { recursive: true });
  await writeFile("scratch/analytics-exclusion-local.json", JSON.stringify({ pass: true, serverGuard: true, results }, null, 2));
  console.log(JSON.stringify({ pass: true, serverGuard: true, results }));
} finally { await browser.close(); }
