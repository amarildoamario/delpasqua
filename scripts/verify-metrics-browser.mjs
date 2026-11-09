// Run against a local production server: node scripts/verify-metrics-browser.mjs http://localhost:3091
// Analytics deliveries and stock responses are intercepted; no business data is written.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseURL = process.argv[2] ?? "http://localhost:3091";
assert(["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname), "Use a local server");
const browser = await chromium.launch({ headless: true });
const errors = [];

async function session(consent = "1") {
  const context = await browser.newContext();
  const deliveries = [];
  await context.addCookies([{ name: "analytics_consent", value: consent, url: baseURL }]);
  await context.route("**/api/analytics/**", async (route) => {
    deliveries.push(...JSON.parse(route.request().postData() ?? "[]"));
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await context.addInitScript(() => {
    window.addEventListener("click", (event) => {
      if (event.target.closest?.('a[href^="tel:"],a[href^="mailto:"],a[href*="wa.me/"]')) event.preventDefault();
    });
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  return { context, page, deliveries };
}

const queued = (page) => page.evaluate(() => JSON.parse(sessionStorage.getItem("analytics_queue_v2") ?? "[]"));
try {
  const { context, page, deliveries } = await session();
  const denied = await context.request.get(`${baseURL}/admin/metrics/export/`);
  assert.equal(denied.status(), 401);
  await page.goto(`${baseURL}/contatti/`);
  for (const link of await page.locator('a[href*="wa.me/"]').all()) await link.click();
  for (const link of await page.locator('a[href^="tel:"],a[href^="mailto:"]').all()) await link.click();
  const contacts = (await queued(page)).filter((event) => event.type === "contact_click");
  assert.equal(contacts.filter((event) => event.productKey === "whatsapp").length, 2);
  assert.equal(contacts.filter((event) => event.productKey === "phone").length, 3);
  assert.equal(contacts.filter((event) => event.productKey === "email").length, 2);
  // A real pagehide triggers the beacon path, preserving event identities.
  await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
  await page.waitForTimeout(200);
  assert.equal(deliveries.filter((event) => event.type === "contact_click").length, 7);
  console.log("PASS: seven contact links, beacon delivery and export authorization");
  await context.close();

  const optedOut = await session("0");
  await optedOut.page.goto(`${baseURL}/contatti/`);
  await optedOut.page.locator('a[href*="wa.me/"]').first().click();
  assert.equal((await queued(optedOut.page)).length, 0);
  console.log("PASS: consent opt-out");
  await optedOut.context.close();

  const attribution = await session();
  await attribution.page.goto(`${baseURL}/contatti/`, { referer: "https://l.instagram.com/" });
  const initial = (await queued(attribution.page)).find((event) => event.type === "page_view");
  assert.equal(initial.referrer, "https://l.instagram.com/");
  await attribution.page.reload();
  const afterReload = (await queued(attribution.page)).filter((event) => event.type === "page_view");
  assert(afterReload.length >= 2);
  assert(afterReload.every((event) => event.referrer === "https://l.instagram.com/"));
  assert(afterReload.every((event) => event.sessionId === initial.sessionId));
  const ids = await attribution.context.cookies();
  assert(ids.some((cookie) => cookie.name === "v_id" && cookie.value === initial.visitorId));
  console.log("PASS: acquisition referrer and anonymous IDs survive reload in the same session");
  await attribution.context.close();

  for (const remaining of [2, 0]) {
    const cart = await session();
    await cart.page.setViewportSize({ width: 390, height: 844 });
    let stock = 10;
    await cart.context.route("**/api/inventory/availability**", async (route) => {
      const skus = (new URL(route.request().url()).searchParams.get("skus") ?? "").split(",");
      await route.fulfill({ json: { availability: Object.fromEntries(skus.map((sku) => [sku, stock])) } });
    });
    await cart.page.goto(`${baseURL}/shop/evo/`);
    const add = cart.page.getByTestId("add-to-cart").first();
    await add.waitFor();
    await cart.page.waitForFunction(() => !document.querySelector('[data-testid="add-to-cart"]')?.disabled);
    for (let n = 0; n < 3; n++) await cart.page.getByRole("button", { name: /^Aumenta/ }).click();
    stock = remaining;
    await add.click();
    await cart.page.waitForTimeout(1000);
    const additions = (await queued(cart.page)).filter((event) => event.type === "add_to_cart");
    assert.equal(additions.length, remaining ? 1 : 0);
    if (remaining) {
      assert.equal(additions[0].data.qty, 2);
      assert.equal(additions[0].data.unitPriceCents, 1500);
    }
    console.log(`PASS: cart addition with stock reduced to ${remaining}`);
    await cart.context.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS: contact links, delivery, consent, export authorization, adjusted/rejected cart additions, browser errors");
} finally {
  await browser.close();
}
