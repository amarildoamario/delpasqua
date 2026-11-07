const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const archive = 'archivio/immagini-prodotti/2026-11-07-catalogo';
const origin = 'http://localhost:3000';

(async () => {
  const catalog = JSON.parse(await fs.readFile('src/db/products.json', 'utf8'));
  const before = JSON.parse(await fs.readFile(`${archive}/catalogo-prima-rinomina.json`, 'utf8'));
  const operational = products => products.map(p => ({ id: p.id, slug: p.slug, variants: p.variants.map(v => ({ id: v.id, sku: v.sku, priceCents: v.priceCents, imageSrc: v.imageSrc })) }));
  assert.deepEqual(operational(catalog), operational(before), 'Operational variant references changed');
  for (const p of catalog) {
    for (const v of p.variants) await fs.access(`public${v.imageSrc}`);
    if (p.homeVariantId) assert(p.variants.some(v => v.id === p.homeVariantId));
  }
  const brands = { 'fruttato-leggero': 'La Dama', 'fruttato-medio': 'Il Musico', 'fruttato-intenso': 'Il Cavaliere' };
  for (const locale of ['it', 'en', 'de', 'nl', 'da', 'no', 'es', 'fr']) {
    const messages = JSON.parse(await fs.readFile(`messages/${locale}.json`, 'utf8'));
    for (const [id, name] of Object.entries(brands)) {
      assert.equal(messages.Products[id].title, name);
      assert(messages.Products[`${id}-latta`].title.startsWith(name));
      for (const p of catalog.filter(p => p.id === id || p.id === `${id}-latta`)) {
        assert.deepEqual(Object.keys(messages.Products[p.id].variants).sort(), p.variants.map(v => v.id).sort());
      }
    }
  }
  const api = await (await fetch(origin + '/api/products/')).json();
  const home = api.filter(p => p.showInHome).sort((a, b) => a.homeRank - b.homeRank).map(p => p.id);
  assert.deepEqual(home, ['evo', 'fruttato-intenso', 'evo-latta', 'fruttato-medio']);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(origin, { waitUntil: 'networkidle' });
    const section = page.locator('section').filter({ has: page.locator('a[href*="olio-evo-latta"]') }).first();
    await section.scrollIntoViewIfNeeded();
    const cards = section.locator('div.hidden.md\\:block [data-testid="product-card"]');
    assert.equal(await cards.count(), 4);
    const titles = await cards.evaluateAll(cards => cards.map(card => card.parentElement.querySelector('h3').textContent));
    assert.deepEqual(titles, ['Extravergine - EVO', 'Il Cavaliere', 'Olio EVO Latta 750 ml', 'Il Musico']);
    const third = cards.nth(2);
    assert((await third.getAttribute('href')).includes('v=750ml'));
    assert((await third.locator('..').locator('img').getAttribute('src')).includes('EVO-latta-750ml-v2'));
    await page.screenshot({ path: `${archive}/home-desktop.png` });
    await third.click();
    await page.waitForURL(/olio-evo-latta.*v=750ml/);
    await assert.doesNotReject(() => page.getByRole('heading', { name: 'Olio EVO Latta 750 ml', exact: true }).waitFor());
    const formats = [];
    for (const [id, name] of Object.entries(brands)) {
      await page.goto(`${origin}/shop/${id}/?v=500ml`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: `${name} 500 ml`, exact: true }).waitFor();
      for (const [variant, label] of [['750ml', '750 ml'], ['1lt', '1 L'], ['3lt', '3 L'], ['5lt', '5 L']]) {
        await page.getByRole('button', { name: label, exact: true }).first().click();
        const isCan = ['3lt', '5lt'].includes(variant);
        await page.getByRole('heading', { name: `${name}${isCan ? ' Latta' : ''} ${label}`, exact: true }).waitFor();
        formats.push({ id, variant, titleMatches: true });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin, { waitUntil: 'networkidle' });
    const mobileCards = page.locator('[aria-label="Prodotti in evidenza"] [data-testid="product-card"]');
    assert.deepEqual(await mobileCards.evaluateAll(cards => cards.map(card => card.parentElement.querySelector('h3').textContent)), titles);
    await mobileCards.nth(2).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${archive}/home-mobile.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.goto(`${origin}/en/shop/medium-fruity/?v=750ml`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Il Musico 750 ml', exact: true }).waitFor();
    assert.deepEqual(errors, []);
    const report = { home, titles, formats, operationalReferencesPreserved: true, allVariantImagesExist: true, translations: 8, errors };
    await fs.writeFile(`${archive}/verifica.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
