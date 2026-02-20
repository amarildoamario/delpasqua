import { chromium } from "playwright";

/**
 * Bot completo: random browsing + varianti + carrello + checkout + Stripe.
 * - Niente page.evaluate(handle, value) => elimina "Too many arguments"
 * - Inputs checkout React-safe via fill/type/Tab
 * - Stripe: gestisce popup o stessa tab
 * - Stripe: compilazione robusta (aria-label + name + placeholder + autocomplete)
 * - Logga STRIPE_FAIL_DETAILS quando stripe_result:fail
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const USERS = Number(process.env.USERS || 20);
const ROUNDS = Number(process.env.ROUNDS || 2);
const CONCURRENCY = Number(process.env.CONCURRENCY || 2);

const NAV_TIMEOUT_MS = Number(process.env.NAV_TIMEOUT_MS || 90_000);
const STEP_TIMEOUT_MS = Number(process.env.STEP_TIMEOUT_MS || 30_000);

const DO_PAYMENTS_RAW = String(process.env.DO_PAYMENTS || "0").toLowerCase();
const DO_PAYMENTS = DO_PAYMENTS_RAW === "1" || DO_PAYMENTS_RAW === "true" || DO_PAYMENTS_RAW === "yes";

const PAY_RATE = Number(process.env.PAY_RATE || 0.5);
const CARD_MODE = (process.env.CARD_MODE || "mixed").toLowerCase(); // success | decline | 3ds | mixed

// Stripe test cards
const CARD_POOL = [
  { label: "visa_success_4242", number: "4242424242424242", kind: "success", weight: 70 },
  { label: "visa_3ds_3184", number: "4000002760003184", kind: "3ds", weight: 20 },
  { label: "visa_decline_9995", number: "4000000000009995", kind: "decline", weight: 10 },
];

function normalizeCardPool(mode) {
  if (mode === "success") return CARD_POOL.filter((c) => c.kind === "success").map((c) => ({ ...c, weight: 100 }));
  if (mode === "decline") return CARD_POOL.filter((c) => c.kind === "decline").map((c) => ({ ...c, weight: 100 }));
  if (mode === "3ds") return CARD_POOL.filter((c) => c.kind === "3ds").map((c) => ({ ...c, weight: 100 }));
  return CARD_POOL;
}
const ACTIVE_CARDS = normalizeCardPool(CARD_MODE);

// ----------------- random helpers -----------------
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function pickWeighted(arr) {
  const total = arr.reduce((s, x) => s + (x.weight || 1), 0);
  let r = Math.random() * total;
  for (const x of arr) {
    r -= (x.weight || 1);
    if (r <= 0) return x;
  }
  return arr[arr.length - 1];
}
function randomIp() {
  return `${randInt(11, 223)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}
function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
}

const FIRST_NAMES = [
  "Marco","Luca","Andrea","Giulia","Sara","Francesca","Matteo","Davide","Elena","Chiara",
  "Simone","Federica","Giorgio","Alessia","Paolo","Irene","Valerio","Marta","Riccardo","Laura",
];
const LAST_NAMES = [
  "Rossi","Bianchi","Esposito","Ricci","Romano","Gallo","Costa","Fontana","Conti","Moretti",
  "Ferrari","Greco","Marino","Lombardi","Giordano","Rinaldi","Colombo","Barbieri","DeLuca","Mancini",
];
const CITY_ZIP = [
  { city: "Roma", zips: ["00118","00121","00124","00128","00133","00141","00144","00146","00151","00161","00171","00184","00191","00198"] },
  { city: "Milano", zips: ["20121","20124","20126","20129","20133","20137","20141","20143","20146","20149","20153","20158"] },
  { city: "Torino", zips: ["10121","10124","10126","10128","10131","10134","10136","10141","10146","10149","10152"] },
  { city: "Napoli", zips: ["80121","80124","80126","80128","80131","80134","80136","80138","80141","80144"] },
  { city: "Bari", zips: ["70121","70122","70124","70126","70128","70131"] },
  { city: "Bologna", zips: ["40121","40122","40123","40124","40126","40127","40128","40131"] },
  { city: "Firenze", zips: ["50121","50122","50123","50124","50125","50126","50127","50131","50134"] },
  { city: "Palermo", zips: ["90121","90124","90125","90127","90129","90133","90139","90142"] },
  { city: "Catania", zips: ["95121","95123","95124","95125","95126","95128"] },
  { city: "Verona", zips: ["37121","37122","37123","37124","37126","37129"] },
];
const STREETS = [
  "Via Roma", "Via Garibaldi", "Via Milano", "Via Napoli", "Corso Italia", "Via Dante",
  "Via Marconi", "Via Verdi", "Via Manzoni", "Viale Europa", "Via Leopardi", "Via Mazzini",
];

function randomPerson() {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const n = randInt(10, 999);
  const email = `${slugify(first)}.${slugify(last)}${n}@gmail.com`;
  return { fullName: `${first} ${last}`, email };
}
function randomAddress() {
  return `${pick(STREETS)} ${randInt(1, 180)}`;
}
function randomCityZip() {
  const row = pick(CITY_ZIP);
  return { city: row.city, zip: pick(row.zips) };
}

// ----------------- playwright helpers -----------------
async function gotoWithRetry(page, url, tries = 3) {
  let lastErr;
  for (let i = 1; i <= tries; i++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      return;
    } catch (e) {
      lastErr = e;
      await page.waitForTimeout(500 * i);
    }
  }
  throw lastErr;
}

async function clickVisible(locator, timeout = 10_000) {
  const el = locator.first();
  await el.scrollIntoViewIfNeeded({ timeout: 2_000 }).catch(() => {});
  await el.waitFor({ state: "visible", timeout });
  await el.click({ timeout, force: true });
}

async function readNavCartCount(page) {
  const badge = page.locator('[data-testid="nav-cart-count"]');
  if ((await badge.count()) === 0) return null;
  const t = (await badge.first().innerText()).trim();
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

async function waitNavCartCountAtLeast(page, min, timeout = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const n = await readNavCartCount(page);
    if (n !== null && n >= min) return n;
    await page.waitForTimeout(200);
  }
  return null;
}

// ----------------- shop/cart journey -----------------
async function openRandomProductFromShop(page) {
  await gotoWithRetry(page, `${BASE_URL}/shop`);
  const cards = page.locator('[data-testid="product-card"]');
  await cards.first().waitFor({ state: "visible", timeout: 20_000 });

  const n = await cards.count();
  const idx = randInt(0, Math.min(n - 1, 11));
  const card = cards.nth(idx);

  const slug = (await card.getAttribute("data-slug")) || `idx:${idx}`;
  await clickVisible(card);
  return { slug };
}

async function trySelectVariant(page) {
  const select = page.locator('[data-testid="variant-select"]');
  if ((await select.count()) === 0) {
    const u = new URL(page.url());
    const v = u.searchParams.get("v");
    return { changed: false, value: v };
  }

  const current = await select.inputValue().catch(() => null);
  const options = select.locator("option");
  const n = await options.count();
  if (n <= 1) return { changed: false, value: current };

  const values = [];
  for (let i = 0; i < n; i++) {
    const v = await options.nth(i).getAttribute("value");
    if (v) values.push(v);
  }
  if (!values.length) return { changed: false, value: current };

  const candidates = values.filter((v) => v !== current);
  if (!candidates.length) return { changed: false, value: current };

  const pickV = candidates[randInt(0, candidates.length - 1)];
  await select.selectOption(pickV);
  const after = await select.inputValue().catch(() => pickV);
  return { changed: after !== current, value: after };
}

async function addToCartOnProductPage(page) {
  const add = page.locator('[data-testid="add-to-cart"]');
  await add.first().waitFor({ state: "visible", timeout: 15_000 });
  await clickVisible(add);
}

async function getCartPageLinesCount(page) {
  const scope = page.locator('[data-testid="cart-page"]');
  if ((await scope.count()) === 0) return null;

  const empty = scope.locator('text=/carrello\\s+vuoto/i');
  if ((await empty.count()) > 0) return 0;

  const removes = scope.locator('[data-testid="cart-remove-line"], [data-testid="remove-line"], button:has-text("RIMUOVI"), button:has-text("Rimuovi")');
  const c = await removes.count();
  if (c > 0) return c;

  return null;
}

async function tweakCartPage(page) {
  await gotoWithRetry(page, `${BASE_URL}/cart`);
  await page.waitForTimeout(randInt(150, 600));

  const scope = page.locator('[data-testid="cart-page"]');
  await scope.first().waitFor({ state: "visible", timeout: 15_000 });

  const lines = await getCartPageLinesCount(page);
  if (lines === 0) return { empty: true, lines };

  if (Math.random() < 0.55) {
    const qty = scope.locator('[data-testid="cart-qty-input"]').first();
    if ((await qty.count()) > 0 && (await qty.isVisible())) {
      await qty.fill(String(randInt(1, 3))).catch(() => {});
      await page.waitForTimeout(randInt(150, 350));
    }
  }

  if (Math.random() < 0.10) {
    const rm = scope.locator('[data-testid="cart-remove-line"], [data-testid="remove-line"]').first();
    if ((await rm.count()) > 0 && (await rm.isVisible())) {
      await rm.click({ timeout: 5_000, force: true }).catch(() => {});
      await page.waitForTimeout(randInt(150, 350));
    }
  }

  const linesAfter = await getCartPageLinesCount(page);
  return { empty: linesAfter === 0, lines: linesAfter };
}

// ----------------- checkout helpers -----------------
async function waitServerSummaryReady(page, timeoutMs = 25_000) {
  const start = Date.now();
  const loadingText = page.locator('text=/Calcolo totale/i');
  const noDataText = page.locator('text=/Nessun dato\\./i');

  while (Date.now() - start < timeoutMs) {
    const loadingVisible = (await loadingText.count())
      ? await loadingText.first().isVisible().catch(() => false)
      : false;
    const noDataVisible = (await noDataText.count())
      ? await noDataText.first().isVisible().catch(() => false)
      : false;

    if (!loadingVisible && !noDataVisible) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

// React-safe input setter (NO evaluate)
async function setInputReactSafe(locator, value) {
  const el = locator.first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await el.waitFor({ state: "visible", timeout: 15_000 });

  await el.click({ timeout: 5_000 }).catch(() => {});
  await el.fill("").catch(() => {});
  await el.type(String(value), { delay: 10 }).catch(() => {});
  await el.press("Tab").catch(() => {});
}

async function fillCheckoutFormIfPresent(page) {
  const person = randomPerson();
  const loc = randomCityZip();
  const addr = randomAddress();

  const nameI = page.locator('label:has-text("Nome e cognome") input');
  const emailI = page.locator('label:has-text("Email") input');
  const addrI = page.locator('label:has-text("Indirizzo") input');
  const cityI = page.locator('label:has-text("Città") input');
  const zipI = page.locator('label:has-text("CAP") input');

  const hasAll =
    (await nameI.count()) &&
    (await emailI.count()) &&
    (await addrI.count()) &&
    (await cityI.count()) &&
    (await zipI.count());

  if (hasAll) {
    await setInputReactSafe(nameI, person.fullName);
    await setInputReactSafe(emailI, person.email);
    await setInputReactSafe(addrI, addr);
    await setInputReactSafe(cityI, loc.city);
    await setInputReactSafe(zipI, loc.zip);
  } else {
    const allInputs = page.locator("input");
    const n = await allInputs.count();
    const textInputs = [];
    for (let i = 0; i < n; i++) {
      const t = await allInputs.nth(i).getAttribute("type");
      if (!t || (t !== "number" && t !== "checkbox" && t !== "radio")) textInputs.push(allInputs.nth(i));
      if (textInputs.length >= 5) break;
    }
    if (textInputs.length >= 5) {
      await setInputReactSafe(textInputs[0], person.fullName);
      await setInputReactSafe(textInputs[1], person.email);
      await setInputReactSafe(textInputs[2], addr);
      await setInputReactSafe(textInputs[3], loc.city);
      await setInputReactSafe(textInputs[4], loc.zip);
    }
  }

  await waitServerSummaryReady(page, 30_000);

  const payBtn = page.locator('[data-testid="checkout-pay"]');
  if (await payBtn.count()) {
    const start = Date.now();
    while (Date.now() - start < 30_000) {
      const disabled = await payBtn.first().isDisabled().catch(() => true);
      if (!disabled) break;
      await page.waitForTimeout(250);
    }
  }

  return { person, loc, addr };
}

async function debugCheckoutDom(page) {
  const info = await page.evaluate(() => {
    const txt = (s) => (s || "").replace(/\s+/g, " ").trim();
    const inputs = Array.from(document.querySelectorAll("input")).map((i) => ({
      type: i.getAttribute("type"),
      name: i.getAttribute("name"),
      id: i.getAttribute("id"),
      placeholder: i.getAttribute("placeholder"),
      valueLen: (i.value || "").length,
      disabled: i.disabled === true ? true : undefined,
    }));

    const hasEmptyCart = !!Array.from(document.querySelectorAll("*")).find((n) =>
      /il carrello è vuoto/i.test(n.textContent || "")
    );
    const h1 = txt(document.querySelector("h1")?.textContent || "");
    const shippingTitle = !!Array.from(document.querySelectorAll("*")).find((n) =>
      /dati spedizione/i.test(n.textContent || "")
    );
    const payBtn = document.querySelector('[data-testid="checkout-pay"]');

    return {
      url: location.href,
      h1,
      shippingTitle,
      hasEmptyCart,
      inputCount: inputs.length,
      inputs: inputs.slice(0, 25),
      payBtnDisabled: payBtn ? payBtn.disabled === true : null,
    };
  });

  console.log("CHECKOUT_DOM_DEBUG", info);
}

async function debugCheckoutConsole(page) {
  const summary = await page.evaluate(() => {
    const hasLoading = !!Array.from(document.querySelectorAll("*")).find((n) => /calcolo totale/i.test(n.textContent || ""));
    const hasNoData = !!Array.from(document.querySelectorAll("*")).find((n) => /nessun dato\./i.test(n.textContent || ""));
    const pay = document.querySelector('[data-testid="checkout-pay"]');
    return {
      hasLoading,
      hasNoData,
      payDisabled: pay ? (pay.disabled === true) : null,
      payText: pay ? (pay.textContent || "").trim() : null,
    };
  });

  console.log("CHECKOUT_DEBUG url=", page.url());
  console.log("CHECKOUT_DEBUG summary=", summary);
}

async function clickPayButtonOnCheckout(page) {
  const primary = page.locator('[data-testid="checkout-pay"]');
  await primary.waitFor({ state: "attached", timeout: 20_000 }).catch(() => {});
  if (!(await primary.count())) return { ok: false, how: "not_found" };

  await primary.first().scrollIntoViewIfNeeded().catch(() => {});
  await primary.first().waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});

  let disabled = await primary.first().isDisabled().catch(() => true);
  if (disabled) {
    await waitServerSummaryReady(page, 10_000);
    await page.waitForTimeout(600);
    disabled = await primary.first().isDisabled().catch(() => true);
    if (disabled) return { ok: false, how: "disabled" };
  }

  await primary.first().click({ timeout: 15_000, force: true });
  return { ok: true, how: "data-testid" };
}

// ----------------- Stripe helpers -----------------
function isStripeCheckoutUrl(url) {
  return typeof url === "string" && url.includes("checkout.stripe.com");
}

// Aspetta: stripe sulla stessa tab, popup stripe, o cambio URL site
async function waitForStripeOrReturn(page, baseUrl, startUrl, timeoutMs = 25_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const u = page.url();
    if (isStripeCheckoutUrl(u)) return { where: "stripe", page };

    if (u.startsWith(baseUrl) && u !== startUrl) {
      if (/success|thank|grazie|ordine|completed/i.test(u)) return { where: "site_success", page };
      if (/cancel|canceled|annull/i.test(u)) return { where: "site_cancel", page };
      return { where: "site_other", page };
    }

    await page.waitForTimeout(200);
  }
  return { where: "timeout", page };
}

/**
 * Compila i campi Stripe Checkout con fallback multipli (aria-label, name, placeholder, autocomplete).
 * Ritorna dettagli (selector usato + frame url) per debug.
 */
async function fillStripeField(stripePage, kind, value) {
  const selectorsByKind = {
    card: [
      'input[aria-label="Card number"]',
      'input[name="cardNumber"]',
      'input[autocomplete="cc-number"]',
      'input[placeholder*="1234"]',
    ],
    exp: [
      'input[aria-label="Expiration"]',
      'input[name="cardExpiry"]',
      'input[autocomplete="cc-exp"]',
      'input[placeholder*="MM"]',
    ],
    cvc: [
      'input[aria-label="CVC"]',
      'input[name="cardCvc"]',
      'input[autocomplete="cc-csc"]',
      'input[placeholder*="CVC"]',
    ],
    zip: [
      'input[aria-label="ZIP"]',
      'input[aria-label="Postal code"]',
      'input[name="postal"]',
      'input[name="billingPostalCode"]',
      'input[autocomplete="postal-code"]',
    ],
  };

  const sels = selectorsByKind[kind] || [];
  for (const f of stripePage.frames()) {
    for (const sel of sels) {
      try {
        const loc = f.locator(sel);
        if (await loc.count()) {
          const el = loc.first();
          await el.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
          await el.click({ timeout: 5000 }).catch(() => {});
          await el.fill("").catch(() => {});
          await el.type(String(value), { delay: 15 }).catch(() => {});
          return { ok: true, via: sel, frame: f.url() };
        }
      } catch {}
    }
  }
  return { ok: false, via: null, frame: null };
}

async function fillStripeEmailIfAny(stripePage, email) {
  // email può essere nella main page o in iframe
  try {
    const emailMain = stripePage.locator('input[type="email"]');
    if (await emailMain.count()) {
      await emailMain.first().fill(email).catch(() => {});
      return { ok: true, where: "main" };
    }
  } catch {}
  for (const f of stripePage.frames()) {
    try {
      const emailInFrame = f.locator('input[type="email"]');
      if (await emailInFrame.count()) {
        await emailInFrame.first().fill(email).catch(() => {});
        return { ok: true, where: "frame", frame: f.url() };
      }
    } catch {}
  }
  return { ok: false };
}

async function clickStripePay(stripePage) {
  const candidates = [
    stripePage.getByRole("button", { name: /pay/i }),
    stripePage.getByRole("button", { name: /paga/i }),
    stripePage.getByRole("button", { name: /complete/i }),
    stripePage.getByRole("button", { name: /place order/i }),
  ];

  for (const b of candidates) {
    try {
      if (await b.count()) {
        const btn = b.first();
        await btn.scrollIntoViewIfNeeded().catch(() => {});
        await btn.waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});
        const disabled = await btn.isDisabled().catch(() => false);
        if (!disabled) {
          await btn.click({ timeout: 10_000 });
          return { ok: true, how: "role_button" };
        }
      }
    } catch {}
  }

  const submit = stripePage.locator('button[type="submit"]');
  if (await submit.count()) {
    const btn = submit.first();
    const disabled = await btn.isDisabled().catch(() => false);
    if (!disabled) {
      await btn.click({ timeout: 10_000 });
      return { ok: true, how: "submit" };
    }
  }

  return { ok: false, how: "not_found_or_disabled" };
}

async function maybeComplete3DS(stripePage) {
  const buttons = [
    stripePage.getByRole("button", { name: /complete/i }),
    stripePage.getByRole("button", { name: /authorize/i }),
    stripePage.getByRole("button", { name: /autorizza/i }),
    stripePage.getByRole("button", { name: /continua/i }),
    stripePage.getByRole("button", { name: /finish/i }),
  ];
  for (const b of buttons) {
    try {
      if (await b.count()) {
        await b.first().click({ timeout: 12_000 }).catch(() => {});
        return true;
      }
    } catch {}
  }
  return false;
}

async function completeStripeCheckout(stripePage, userId, card, emailForStripe) {
  await stripePage.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
  if (!isStripeCheckoutUrl(stripePage.url())) return { ok: false, reason: "not_on_stripe" };

  const emailRes = await fillStripeEmailIfAny(stripePage, emailForStripe);

  const cardRes = await fillStripeField(stripePage, "card", card.number);
  const expRes = await fillStripeField(stripePage, "exp", "12/34");
  const cvcRes = await fillStripeField(stripePage, "cvc", "123");
  const zipRes = await fillStripeField(stripePage, "zip", "00100"); // ok se non esiste

  if (!cardRes.ok || !expRes.ok || !cvcRes.ok) {
    return { ok: false, reason: "fields_missing", details: { emailRes, cardRes, expRes, cvcRes, zipRes } };
  }

  const clickRes = await clickStripePay(stripePage);
  if (!clickRes.ok) return { ok: false, reason: "pay_button_not_found", details: { emailRes, cardRes, expRes, cvcRes, zipRes, clickRes } };

  await stripePage.waitForTimeout(1200);
  await maybeComplete3DS(stripePage).catch(() => {});

  await stripePage.waitForURL((u) => u.toString().startsWith(BASE_URL), { timeout: 60_000 }).catch(() => {});
  const finalUrl = stripePage.url();
  if (!finalUrl.startsWith(BASE_URL)) {
    return { ok: false, reason: "no_return_to_site", details: { finalUrl, emailRes, cardRes, expRes, cvcRes, zipRes, clickRes } };
  }

  const isCancel = /cancel|canceled|annull/i.test(finalUrl);
  const isSuccess = /success|thank|grazie|ordine|completed/i.test(finalUrl);
  return { ok: isSuccess && !isCancel, finalUrl };
}

// ----------------- main user journey -----------------
async function userJourney(userId) {
  const ip = randomIp();
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    extraHTTPHeaders: {
      "X-Forwarded-For": ip,
      "X-Real-IP": ip,
      "User-Agent": `SimUser/${userId}`,
    },
  });

  context.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
  context.setDefaultTimeout(STEP_TIMEOUT_MS);

  await context.route("**/*", (route) => {
    const rt = route.request().resourceType();
    const url = route.request().url();
    if (rt === "image" || rt === "font" || rt === "media" || url.includes("/_next/image")) return route.abort();
    return route.continue();
  });

  const page = await context.newPage();

  const log = {
    userId,
    ip,
    result: null,
    products: [],
    navCountAfterAdds: [],
    cartLines: null,
    checkoutForm: null,
    paymentCardLabel: null,
    paymentCardKind: null,
    paymentOutcome: null,
    steps: [],
  };

  try {
    await gotoWithRetry(page, BASE_URL);
    log.steps.push("home");

    const howMany = Math.random() < 0.40 ? 2 : 1;
    const startCount = (await readNavCartCount(page)) ?? 0;

    for (let i = 0; i < howMany; i++) {
      const { slug } = await openRandomProductFromShop(page);
      const v = await trySelectVariant(page);
      const vLabel = v?.value ?? null;

      log.steps.push(`open_product:${slug}${vLabel ? `?v=${vLabel}` : ""}`);
      if (v.changed) log.steps.push(`variant_changed:${vLabel}`);
      log.products.push(vLabel ? `${slug}:${vLabel}` : slug);

      await addToCartOnProductPage(page);
      log.steps.push("add_to_cart");

      const expectedMin = startCount + i + 1;
      const newCount = await waitNavCartCountAtLeast(page, expectedMin, 8000);
      log.navCountAfterAdds.push(newCount);

      await page.waitForTimeout(randInt(150, 600));
    }

    const cartInfo = await tweakCartPage(page);
    log.cartLines = cartInfo.lines;
    log.steps.push(`cart_lines:${cartInfo.lines}`);

    if (cartInfo.empty) {
      log.result = "abandoned_empty";
      return log;
    }

    if (Math.random() < 0.30) {
      log.result = "abandoned_cart";
      return log;
    }

    await gotoWithRetry(page, `${BASE_URL}/checkout`);
    log.steps.push("checkout");

    await page.waitForTimeout(400);
    await debugCheckoutDom(page);

    if (!DO_PAYMENTS || Math.random() > PAY_RATE) {
      log.result = "checkout_reached";
      return log;
    }

    const form = await fillCheckoutFormIfPresent(page);
    log.checkoutForm = {
      fullName: form.person.fullName,
      email: form.person.email,
      city: form.loc.city,
      zip: form.loc.zip,
      address: form.addr,
    };
    log.steps.push("checkout_form_filled");

    await debugCheckoutDom(page);
    await debugCheckoutConsole(page);

    const card = pickWeighted(ACTIVE_CARDS);
    log.paymentCardLabel = card.label;
    log.paymentCardKind = card.kind;

    const popupPromise = page.waitForEvent("popup", { timeout: 20_000 }).catch(() => null);
    const startUrl = page.url();

    const clickRes = await clickPayButtonOnCheckout(page);
    if (!clickRes.ok) {
      log.steps.push("pay_click_failed");
      log.steps.push(`pay_click_reason:${clickRes.how}`);
      await debugCheckoutConsole(page);
      log.result = "checkout_reached";
      return log;
    }

    log.steps.push(`pay_clicked_via:${clickRes.how}`);
    log.steps.push(`pay_clicked:${card.label}`);

    const popup = await popupPromise;
    if (popup) {
      log.steps.push("stripe_opened_in_popup");
      await popup.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
      const pu = popup.url();
      log.steps.push(`popup_url:${pu}`);

      if (isStripeCheckoutUrl(pu)) {
        const paid = await completeStripeCheckout(popup, userId, card, form.person.email);
        log.steps.push(`stripe_result:${paid.ok ? "ok" : "fail"}`);
        if (!paid.ok) console.log("STRIPE_FAIL_DETAILS", paid);
        if (paid.finalUrl) log.steps.push(`return_url:${paid.finalUrl}`);

        log.paymentOutcome = paid.ok ? "success" : "fail";
        log.result = paid.ok ? "paid" : (card.kind === "decline" ? "payment_declined" : "payment_failed");
        return log;
      } else {
        log.steps.push("popup_not_stripe");
      }
    }

    const waited = await waitForStripeOrReturn(page, BASE_URL, startUrl, 25_000);
    log.steps.push(`after_pay_click:${waited.where}`);

    if (waited.where === "stripe") {
      const paid = await completeStripeCheckout(waited.page, userId, card, form.person.email);
      log.steps.push(`stripe_result:${paid.ok ? "ok" : "fail"}`);
      if (!paid.ok) console.log("STRIPE_FAIL_DETAILS", paid);
      if (paid.finalUrl) log.steps.push(`return_url:${paid.finalUrl}`);

      log.paymentOutcome = paid.ok ? "success" : "fail";
      log.result = paid.ok ? "paid" : (card.kind === "decline" ? "payment_declined" : "payment_failed");
      return log;
    }

    log.result = "checkout_reached";
    return log;
  } catch (e) {
    log.result = "error";
    log.error = String(e?.message || e);
    return log;
  } finally {
    try { await page.close({ runBeforeUnload: true }); } catch {}
    try { await context.close(); } catch {}
    try { await browser.close(); } catch {}
  }
}

// ----------------- runner -----------------
async function runRound(round) {
  console.log(`\n--- ROUND ${round} ---`);

  const queue = Array.from({ length: USERS }, (_, i) => i + 1);
  const results = [];

  while (queue.length) {
    const chunk = queue.splice(0, CONCURRENCY);
    const out = await Promise.all(chunk.map((id) => userJourney(`r${round}-u${id}`)));
    results.push(...out);

    out.forEach((r) => {
      console.log({
        userId: r.userId,
        ip: r.ip,
        result: r.result,
        products: r.products,
        navCountAfterAdds: r.navCountAfterAdds,
        cartLines: r.cartLines,
        checkoutForm: r.checkoutForm,
        paymentCardLabel: r.paymentCardLabel,
        paymentCardKind: r.paymentCardKind,
        paymentOutcome: r.paymentOutcome,
        steps: r.steps,
        ...(r.error ? { error: r.error } : {}),
      });
    });
  }

  const errors = results.filter((r) => r.result === "error").length;
  const abandoned = results.filter((r) => String(r.result || "").startsWith("abandoned")).length;
  const checkout = results.filter((r) => r.result === "checkout_reached").length;
  const paid = results.filter((r) => r.result === "paid").length;
  const declined = results.filter((r) => r.result === "payment_declined").length;

  console.log(
    `Round ${round} done. Errors=${errors}/${results.length} Abandoned=${abandoned} CheckoutOnly=${checkout} Paid=${paid} Declined=${declined}`
  );
  return results;
}

async function main() {
  console.log(
    `BASE_URL=${BASE_URL} USERS=${USERS} ROUNDS=${ROUNDS} CONCURRENCY=${CONCURRENCY} NAV_TIMEOUT_MS=${NAV_TIMEOUT_MS} DO_PAYMENTS=${DO_PAYMENTS} PAY_RATE=${PAY_RATE} CARD_MODE=${CARD_MODE}`
  );

  for (let round = 1; round <= ROUNDS; round++) {
    await runRound(round);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
