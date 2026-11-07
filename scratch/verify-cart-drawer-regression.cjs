const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const origin = 'http://localhost:3000';
const fixture = [
  { productId: 'evo', variantId: '500ml', qty: 1 },
  { productId: 'fruttato-intenso', variantId: '500ml', qty: 1 },
  { productId: 'fruttato-medio', variantId: '500ml', qty: 1 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await page.addInitScript(lines => {
      if (!sessionStorage.getItem('cart-regression-seeded')) {
        localStorage.setItem('dp_cart_v1', JSON.stringify(lines));
        sessionStorage.setItem('cart-regression-seeded', '1');
      }
    }, fixture);
    await page.goto(origin + '/shop/', { waitUntil: 'networkidle' });
    await page.locator('[data-testid="nav-cart-button"]:visible').first().click();
    const rows = page.locator('[data-testid="remove-line"]');
    await rows.nth(2).click();
    await rows.nth(1).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('dp_cart_v1')).length === 1);
    await page.keyboard.press('Escape');
    const card = page.locator('[data-testid="product-card"][data-slug="fruttato-medio"]:visible').locator('..');
    await card.getByRole('button', { name: 'Aggiungi al carrello', exact: true }).click();
    await page.waitForTimeout(400);
    const actual = await page.evaluate(() => JSON.parse(localStorage.getItem('dp_cart_v1')));
    console.log('Cart after removing two products and adding Musico:', JSON.stringify(actual));
    assert.deepEqual(actual, [fixture[0], fixture[2]], 'Removed products reappeared');
    await page.reload({ waitUntil: 'networkidle' });
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('dp_cart_v1'))), actual);
    await page.locator('[data-testid="nav-cart-button"]:visible').first().click();
    await rows.nth(1).waitFor();
    assert.equal(await rows.count(), 2);
    await rows.nth(1).click();
    await rows.first().click();
    await page.keyboard.press('Escape');
    await card.getByRole('button', { name: 'Aggiungi al carrello', exact: true }).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('dp_cart_v1')).length > 0);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('dp_cart_v1'))), [fixture[2]]);
    await fs.mkdir('scratch/ux-refinements', { recursive: true });
    await fs.writeFile('scratch/ux-refinements/cart-regression.json', JSON.stringify({ passed: true, afterReAdd: actual, afterEmptyCart: [fixture[2]] }, null, 2));
    console.log('PASS: removed products stay removed, including after reload and after emptying the cart.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
