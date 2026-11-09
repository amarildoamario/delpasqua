// Fixture-only browser review. Uses local app CSS/assets; never reads/writes business data.
// node --import tsx scripts/verify-commerce-insights.tsx http://localhost:3000
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import CommerceInsights from "../src/app/[locale]/admin/_components/CommerceInsights";
import CountryFlag from "../src/components/CountryFlag";
import { summarizeCommerceInsights } from "../src/lib/server/commerceInsights";
import { summarizeCustomers } from "../src/lib/server/customerMetrics";

async function main() {
  const baseURL = process.argv[2] ?? "http://localhost:3000";
  assert(["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname));
  const now = new Date("2026-11-09T12:00:00Z");
  const orders = Array.from({ length: 8 }, (_, i) => ({
    id: `fixture-order-${i}`, isTest: false, createdAt: new Date(`2026-11-09T0${i}:00:00Z`), paidAt: i < 6 ? new Date(`2026-11-09T0${i}:30:00Z`) : null,
    stripeCheckoutSessionId: `cs_fixture_${i}`, events: [{ metaJson: JSON.stringify({ visitorId: `visitor-${i}`, sessionId: `session-${i}`, env: "prod" }) }],
    email: `cliente${i}@example.test`, fullName: `Cliente demo ${i}`, totalCents: 12000, refundCents: i === 0 ? 2000 : 0,
    items: [{ productId: "evo-latta", variantId: "5lt", qty: 2 }],
  }));
  const events = Array.from({ length: 72 }, (_, i) => ({
    type: i < 48 ? "page_view" : "add_to_cart", createdAt: new Date(Date.UTC(2026, 10, 9, i % 24, 5)),
    visitorId: `visitor-${i}`, sessionId: `session-${i}`, cartId: `cart-${i % 6}`, orderId: null, path: "/shop/", referrer: i % 2 ? "https://www.google.it/" : "https://l.instagram.com/", userAgent: null, data: null,
  }));
  const insights = summarizeCommerceInsights(orders, events, [], new Date("2026-11-08T23:00:00Z"), new Date("2026-11-09T23:00:00Z"));
  const customers = summarizeCustomers(orders, now);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${baseURL}/contatti/`);
    const css = await page.locator('link[rel="stylesheet"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
    assert(css.length > 0, "Use the actual local app styles");
    const markup = renderToStaticMarkup(<main className="mx-auto max-w-7xl space-y-5 p-4">
      <h1 className="text-2xl font-bold">Anteprima metriche · dati di verifica</h1>
      <div className="flex items-center gap-3">{["IT", "DE", "US", "GB", "FR", "MT", "ND"].map((code) => <CountryFlag key={code} code={code} />)}</div>
      <CommerceInsights insights={insights} customers={customers} />
    </main>);
    await page.route("**/metrics-preview/", (route) => route.fulfill({ contentType: "text/html", body: `<!doctype html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${css.map((href) => `<link rel="stylesheet" href="${href}">`).join("")}</head><body style="background:#fafafa">${markup}</body></html>` }));
    await mkdir("scratch/gestionale-risultati", { recursive: true });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseURL}/metrics-preview/`);
      await page.getByText("Tempo di decisione", { exact: true }).waitFor();
      await page.locator("summary").first().click();
      assert(await page.getByRole("table").first().isVisible());
      const flags = page.locator('img[src^="/flags/"]');
      assert.equal(await flags.count(), 6);
      for (const flag of await flags.all()) assert(await flag.evaluate((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(overflow, false, `No document overflow at ${width}px`);
      await page.screenshot({ path: `scratch/gestionale-risultati/metrics-${width}.png`, fullPage: true });
      console.log(`PASS: ${width}px layout, SVG flags including Malta, expandable chart data, no overflow`);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
}
void main();
