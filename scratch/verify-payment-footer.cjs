const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({ headless: true });
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 await page.goto('http://localhost:3000/it', { waitUntil: 'domcontentloaded' });
 const footer = page.locator('footer');
 await footer.scrollIntoViewIfNeeded();
 await page.waitForTimeout(1500);
 await footer.screenshot({ path: 'scratch/payment-footer-desktop.png' });
 console.log(await footer.locator('img').evaluateAll(imgs => imgs.filter(i => i.src.includes('/payments/')).map(i => ({ alt: i.alt, loaded: i.complete && i.naturalWidth > 0 }))));
 await page.setViewportSize({ width: 390, height: 844 });
 await footer.screenshot({ path: 'scratch/payment-footer-mobile.png' });
 await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
