const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [name, width, height] of [['desktop', 1440, 1100], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://localhost:3000/it/shop', { waitUntil: 'networkidle' });
    if (await page.locator('details').count()) console.log(await page.locator('details').allTextContents());
    await page.screenshot({ path: `scratch/shop-scale-${process.argv[2] || 'after'}-${name}.png`, fullPage: true });
    await page.evaluate(() => window.scrollTo(0, innerWidth < 640 ? 620 : 400));
    await page.screenshot({ path: `scratch/shop-scale-detail-${name}.png` });
    console.log(JSON.stringify({ name, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), images: await page.locator('main img').evaluateAll(images => images.map(image => ({ src: image.getAttribute('src'), alt: image.alt, loaded: image.complete && image.naturalWidth > 0 }))) }));
    await page.close();
  }
  await browser.close();
})();
