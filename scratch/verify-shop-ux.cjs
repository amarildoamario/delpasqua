const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const origin = 'http://localhost:3000';
const out = 'scratch/ux-refinements';

(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(origin, { waitUntil: 'networkidle' });
    const home = page.locator('section').filter({ has: page.locator('a[data-slug="olio-evo-latta"]') }).first();
    const homeTitles = await home.locator('div.hidden.md\\:block h3').allTextContents();
    assert(homeTitles.includes('Il Cavaliere - Fruttato Intenso'));
    assert(homeTitles.includes('Il Musico - Fruttato Medio'));
    await home.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/home-desktop.png` });
    await page.goto(origin + '/shop/', { waitUntil: 'networkidle' });
    const shopTitles = await page.locator('h3:visible').allTextContents();
    for (const title of ['La Dama - Fruttato Leggero', 'Il Musico - Fruttato Medio', 'Il Cavaliere - Fruttato Intenso']) {
      assert(shopTitles.includes(title), title);
      if (!title.startsWith('La Dama')) assert(homeTitles.includes(title));
    }
    const card = page.locator('[data-testid="product-card"][data-slug="fruttato-intenso"]:visible').locator('..');
    await card.hover();
    await page.waitForTimeout(550);
    const hover = await card.evaluate(el => {
      const css = getComputedStyle(el);
      return { translate: css.translate, boxShadow: css.boxShadow };
    });
    assert.equal(hover.translate, '0px -2px');
    await page.screenshot({ path: `${out}/shop-hover.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + '/shop/', { waitUntil: 'networkidle' });
    const trigger = page.getByRole('button', { name: 'Apri menu', exact: true });
    await trigger.click();
    const panel = page.locator('.mobile-menu-panel');
    await panel.waitFor();
    const animation = await panel.locator('.mobile-menu-item').evaluateAll(items => items.map(el => {
      const css = getComputedStyle(el);
      const animation = el.getAnimations().find(a => a.animationName === 'mobile-menu-enter');
      if (!animation) throw new Error('Missing menu animation');
      animation.pause();
      animation.currentTime = parseFloat(css.animationDelay) * 1000 + 150;
      const during = new DOMMatrix(getComputedStyle(el).transform).m41;
      animation.currentTime = 1200;
      return { text: el.textContent, name: css.animationName, duration: css.animationDuration, delay: css.animationDelay, during, final: new DOMMatrix(getComputedStyle(el).transform).m41 };
    }));
    assert(animation.length >= 6);
    assert(animation.every(a => a.during < 0 && a.during > -36 && a.final === 0));
    assert(parseFloat(animation[1].delay) > parseFloat(animation[0].delay));
    await page.screenshot({ path: `${out}/mobile-menu.png` });
    await page.getByRole('button', { name: 'Chiudi menu', exact: true }).click();
    await panel.waitFor({ state: 'hidden' });
    await trigger.click();
    assert.equal(await panel.locator('.mobile-menu-item').first().evaluate(el => getComputedStyle(el).animationName), 'mobile-menu-enter');
    await page.getByRole('button', { name: 'Chiudi menu', exact: true }).click();
    await panel.waitFor({ state: 'hidden' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await trigger.click();
    const reducedMotion = await panel.locator('.mobile-menu-item').evaluateAll(items => items.every(el => getComputedStyle(el).animationName === 'none' && getComputedStyle(el).opacity === '1'));
    assert(reducedMotion);
    assert.deepEqual(errors, []);
    const report = { homeTitles, shopTitles, hover, animation, reducedMotion, errors };
    await fs.writeFile(`${out}/shop-menu-verification.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
