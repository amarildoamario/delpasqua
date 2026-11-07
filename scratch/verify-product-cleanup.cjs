const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const origin = 'http://localhost:3000';
const archive = 'archivio/immagini-prodotti/2026-11-07-pulizia';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

(async () => {
  const catalog = JSON.parse(await fs.readFile('src/db/products.json', 'utf8'));
  const assets = [...new Set(catalog.flatMap(p => [p.imageSrc, ...p.variants.map(v => v.imageSrc)]))];
  assets.push('/products/del_pasqua_olive_grove.png', '/products_no_background/EVO-750-ml-gpt-no-background.png', '/products_no_background/vino-vittoria-no-background.png');
  const remaining = await fs.readdir('public/products', { withFileTypes: true });
  assert.equal(remaining.length, 27);
  assert(remaining.every(file => file.isFile()));
  const hashByPath = new Map();
  for (const path of assets) {
    const local = await fs.readFile(`public${path}`);
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(sha(bytes), sha(local), path);
    hashByPath.set(path, sha(local));
  }
  const legacy = [
    ...['750ml', '1lt', '3lt', '5lt'].map(format => [`/products/EVO-latta-${format}.webp`, `/products/EVO-latta-${format}-v2.webp`]),
    ...['3lt', '5lt'].map(format => [`/products/EVO-latta-${format}.png`, `/products/EVO-latta-${format}-v2.webp`]),
    ...['500ml', '750ml', '1lt'].map(format => [`/products/fruttato-medio-bottiglia-${format}.jpg`, `/products/fruttato-medio-bottiglia-${format}.webp`]),
  ];
  for (const [oldPath, currentPath] of legacy) {
    const response = await fetch(origin + oldPath);
    assert.equal(response.status, 200, oldPath);
    assert.equal(sha(Buffer.from(await response.arrayBuffer())), hashByPath.get(currentPath), oldPath);
  }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const brokenImages = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.request().resourceType() === 'image' && response.status() >= 400) brokenImages.push({ url: response.url(), status: response.status() });
  });
  try {
    for (const route of ['/', '/shop/', '/shop/olio-evo-latta/?v=750ml', '/shop/fruttato-medio/?v=500ml']) {
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      const cards = page.locator('[data-testid="product-card"]:visible');
      if (await cards.count()) await cards.first().scrollIntoViewIfNeeded();
    }
    await page.screenshot({ path: `${archive}/scheda-verificata.png` });
    assert.deepEqual(brokenImages, []);
    assert.deepEqual(errors, []);
    const report = { remainingFiles: remaining.length, activeUrlsVerified: assets.length, legacyUrlsVerified: legacy.length, brokenImages, errors };
    await fs.writeFile(`${archive}/verifica-sito.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
