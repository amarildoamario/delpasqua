const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const out = 'archivio/immagini-prodotti/2026-11-07-evo';
const origin = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const report = { variants: [], legacy: [], errors: [] };
  page.on('pageerror', error => report.errors.push(error.message));
  try {
    await page.goto(origin + '/shop/olio-evo-latta/?v=750ml', { waitUntil: 'networkidle' });
    console.log('Format buttons:', await page.getByRole('button').allTextContents());
    for (const [format, label] of [['750ml', '750 ml'], ['1lt', '1 L'], ['3lt', '3 L'], ['5lt', '5 L']]) {
      if (format !== '750ml') await page.getByRole('button', { name: label, exact: true }).first().click();
      const expected = `/products/EVO-latta-${format}-v2.webp`;
      await page.waitForFunction(expected => {
        const imgs = [...document.images].filter(img => decodeURIComponent(img.currentSrc).includes(expected) && img.getBoundingClientRect().width > 200);
        return imgs.some(img => img.complete && img.naturalWidth > 0);
      }, expected);
      report.variants.push({ format, expected, url: page.url(), loaded: true });
      await page.screenshot({ path: `${out}/scheda-${format}.png` });
    }
    await page.goto(origin + '/shop/', { waitUntil: 'networkidle' });
    const card = page.locator('a[href*="olio-evo-latta"]:visible').first();
    await card.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/shop-desktop.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + '/shop/olio-evo-latta/?v=750ml', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/scheda-mobile-750ml.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Mobile horizontal overflow');
    await page.goto(origin + '/olio-5-litri/', { waitUntil: 'networkidle' });
    const landingImage = page.locator('img').filter({ visible: true });
    assert(await landingImage.evaluateAll(imgs => imgs.some(img => decodeURIComponent(img.currentSrc).includes('EVO-latta-5lt-v2.webp') && img.complete && img.naturalWidth > 0)));
    for (const format of ['750ml', '1lt', '3lt', '5lt']) {
      const current = await (await fetch(`${origin}/products/EVO-latta-${format}-v2.webp`)).arrayBuffer();
      for (const ext of ['webp', ...(['3lt', '5lt'].includes(format) ? ['png'] : [])]) {
        const url = `/products/EVO-latta-${format}.${ext}`;
        const response = await fetch(origin + url);
        assert.equal(response.status, 200);
        assert(Buffer.from(await response.arrayBuffer()).equals(Buffer.from(current)), url);
        report.legacy.push({ url, matchesNewImage: true });
      }
    }
    assert.deepEqual(report.errors, []);
    await fs.writeFile(`${out}/verifica.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
