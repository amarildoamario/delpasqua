const { chromium } = require('C:\\Users\\Utente\\Projects\\web\\delpasqua\\node_modules\\playwright');
const path = require('path');
(async () => {
  const outDir = 'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\15c43822-605e-472e-9088-13dbe37edbae\\scratch';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1150 } });
  await page.goto('http://localhost:3000/shop/olio-extra-vergine-di-oliva-fruttato-intenso-latta/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, 'live-detail-cavaliere-3lt.png') });
  await page.getByRole('button', { name: '5 L', exact: true }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, 'live-detail-cavaliere-5lt-clicked.png') });
  await browser.close();
})();
