const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const origin = 'http://localhost:3000';
const out = 'scratch/evo-photo-framing';

(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const report = [];
  try {
    for (const [device, viewport] of [['desktop', { width: 1440, height: 1050 }], ['mobile', { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${origin}/shop/evo/?v=500ml`, { waitUntil: 'networkidle' });
      const bottle = page.locator('img[src*="EVO-750-ml-gpt.png"]').filter({ visible: true }).first();
      await bottle.scrollIntoViewIfNeeded();
      await bottle.evaluate(img => img.decode());
      const detail = await bottle.evaluate(img => {
        const css = getComputedStyle(img);
        const frame = img.closest('.aspect-\\[4\\/5\\]');
        const imageBounds = img.getBoundingClientRect();
        const contentWidth = imageBounds.width - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
        const contentHeight = imageBounds.height - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
        const scale = Math.min(contentWidth / img.naturalWidth, contentHeight / img.naturalHeight);
        return { objectFit: css.objectFit, padding: parseFloat(css.paddingTop), photoWidth: img.naturalWidth * scale, photoHeight: img.naturalHeight * scale, frameWidth: frame.clientWidth, frameHeight: frame.clientHeight };
      });
      assert.equal(detail.objectFit, 'contain');
      assert(detail.padding >= 24);
      assert(detail.photoWidth < detail.frameWidth && detail.photoHeight < detail.frameHeight);
      await page.screenshot({ path: `${out}/evo-${device}.png` });
      report.push({ device, route: '/shop/evo/', detail });
      for (const route of ['/olio-toscano/', '/olio-biologico/', '/nuovo-raccolto/']) {
        await page.goto(origin + route, { waitUntil: 'networkidle' });
        const section = page.locator('section').filter({ has: page.locator('h4') }).filter({ has: page.locator('a[href*="/shop/"]') }).last();
        await section.scrollIntoViewIfNeeded();
        const pictures = section.locator('img');
        assert(await pictures.count() >= 1, route);
        await pictures.evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        const frames = await pictures.evaluateAll(imgs => imgs.map(img => {
          const frame = img.closest('.aspect-\\[4\\/5\\]');
          const css = getComputedStyle(frame);
          const layout = img.closest('.mix-blend-multiply');
          return { alt: img.alt, objectFit: getComputedStyle(img).objectFit, background: css.backgroundColor, productHeightPercent: parseFloat(layout.style.height), complete: img.complete && img.naturalWidth > 0 };
        }));
        assert(frames.every(f => f.background === 'rgb(255, 255, 255)' && f.objectFit === 'contain' && f.productHeightPercent <= 84 && f.complete), route);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, route);
        await page.screenshot({ path: `${out}/${route.replaceAll('/', '')}-${device}.png` });
        report.push({ device, route, frames });
      }
      await page.close();
    }
    assert.deepEqual(errors, []);
    await fs.writeFile(`${out}/report.json`, JSON.stringify({ report, errors }, null, 2));
    console.log(JSON.stringify({ viewsVerified: report.length, errors, report }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
