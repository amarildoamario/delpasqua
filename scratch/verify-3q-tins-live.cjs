const { chromium } = require('C:\\Users\\Utente\\Projects\\web\\delpasqua\\node_modules\\playwright');
const path = require('path');

(async () => {
  const outDir = 'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\15c43822-605e-472e-9088-13dbe37edbae\\scratch';
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop shop grid
  const page = await browser.newPage({ viewport: { width: 1440, height: 1150 } });
  await page.goto('http://localhost:3000/shop/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 320));
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(outDir, 'live-shop-desktop-3q.png') });

  // 2. Product detail page for Fruttato Intenso Latta (with 500ml/750ml/1L/3L/5L thumbnails)
  await page.goto('http://localhost:3000/shop/olio-extra-vergine-di-oliva-fruttato-intenso-latta/?v=5lt', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(outDir, 'live-detail-cavaliere-5lt.png') });

  // 3. Mobile shop view
  const mobile = await browser.newPage({ viewport: { width: 390, height: 950 } });
  await mobile.goto('http://localhost:3000/shop/', { waitUntil: 'networkidle' });
  await mobile.evaluate(() => window.scrollTo(0, 1280));
  await mobile.waitForTimeout(2200);
  await mobile.screenshot({ path: path.join(outDir, 'live-shop-mobile-3q.png') });

  await browser.close();
  console.log('LIVE SCREENSHOTS SAVED!');
})();
