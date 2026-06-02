/**
 * NOME FILE: costanti.ts (ex constants.ts)
 * SCOPO: Contiene tutte le costanti di configurazione e mappatura usate dai test SEO,
 *        inclusi gli indirizzi locali/live, le liste di parole proibite e i redirect storici.
 * UTILIZZO: Importato dai moduli della suite SEO (verifiche.ts, reportistica.ts, ecc.).
 */

import path from "node:path";
import { locales } from "../../../src/i18n/pathnames";
import type { Target, ComparisonTarget } from "./tipi";

const ROOT_DIR = process.cwd();

export const REPORT_FILE =
  process.env.SEO_SUITE_REPORT_FILE || path.resolve(ROOT_DIR, "scratch", "seo-risultati", "seo-suite-report.txt");
export const URL_OUTCOMES_JSON_FILE = path.resolve(ROOT_DIR, "scratch", "seo-risultati", "url-outcomes.json");
export const URL_OUTCOMES_CSV_FILE = path.resolve(ROOT_DIR, "scratch", "seo-risultati", "url-outcomes.csv");

export const ACTIVE_LOCALES = [...locales];

export const DIFF_LIMIT = Number.parseInt(
  process.env.SEO_SUITE_DIFF_LIMIT || process.env.DIFF_LIMIT || "200",
  10,
);
export const OUTCOME_DETAIL_LIMIT = Number.parseInt(process.env.SEO_OUTCOME_DETAIL_LIMIT || "50", 10);

export const FETCH_CONCURRENCY = 5;
export const FETCH_TIMEOUT_MS = 15000;
export const MAX_FETCH_RETRIES = 1;
export const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);

export const LOCAL_CHILD_SITEMAP_PATHS = ["/sitemap-pages.xml", "/sitemap-products.xml", "/sitemap-blog.xml"];
export const WORDPRESS_SITEMAP_INDEX_URL = "https://delpasqua.com/wp-sitemap.xml";
export const WORDPRESS_SITEMAP_URLS = [WORDPRESS_SITEMAP_INDEX_URL];

export const LEGACY_STAGING_HOST_TOKEN = ["delpasqua", "ver" + "cel", "app"].join(".");
export const ANTI_VERCEL_TOKENS = [
  LEGACY_STAGING_HOST_TOKEN,
  `environment=${"ver" + "cel"}`,
  `Project ${"Ver" + "cel"}`,
  `project-${"ver" + "cel"}-sitemap`,
  `Confronto ${"ver" + "cel"}.app -> produzione`,
];

export const TARGETS: Target[] = [
  {
    id: "local",
    label: "New Local Project",
    baseUrl: "http://localhost:3000",
    expectedSiteUrl: "http://localhost:3000",
  },
  {
    id: "live-wordpress",
    label: "Old Live WordPress",
    baseUrl: "https://delpasqua.com",
    expectedSiteUrl: "https://delpasqua.com",
  },
];

export const COMPARISON_TARGETS: ComparisonTarget[] = [
  {
    id: "compare-local-wordpress-live",
    label: "Confronto localhost -> WordPress live",
    sourceBaseUrl: "http://localhost:3000",
    targetBaseUrl: "https://delpasqua.com",
    sourceSitemapUrls: WORDPRESS_SITEMAP_URLS,
  },
];

export const TARGET_HEADERS = {
  Connection: "close",
};

export const XML_HEADERS = {
  ...TARGET_HEADERS,
  Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
};

export const HTML_HEADERS = {
  ...TARGET_HEADERS,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

export const LOCALE_ROUTE_MAPS: Record<string, Record<string, string>> = {
  "/": {
    it: "/",
    en: "/en",
    de: "/de",
    nl: "/nl",
    da: "/da",
    no: "/no",
  },
  "/shop": {
    it: "/shop",
    en: "/en/shop",
    de: "/de/laden",
    nl: "/nl/winkel",
    da: "/da/butik",
    no: "/no/butikk",
  },
  "/storia": {
    it: "/storia",
    en: "/en/about-us",
    de: "/de/ueber-uns",
    nl: "/nl/over-ons",
    da: "/da/om-os",
    no: "/no/om-oss",
  },
  "/produzione": {
    it: "/produzione",
    en: "/en/production",
    de: "/de/produktion",
    nl: "/nl/productie",
    da: "/da/produktion",
    no: "/no/produksjon",
  },
  "/degustazioni": {
    it: "/degustazioni",
    en: "/en/tastings",
    de: "/de/verkostungen",
    nl: "/nl/proeverijen",
    da: "/da/smagninger",
    no: "/no/smakinger",
  },
  "/contatti": {
    it: "/contatti",
    en: "/en/contact",
    de: "/de/kontakt",
    nl: "/nl/contact",
    da: "/da/kontakt",
    no: "/no/kontakt",
  },
  "/cart": {
    it: "/carrello",
    en: "/en/cart",
    de: "/de/warenkorb",
    nl: "/nl/winkelwagen",
    da: "/da/kurv",
    no: "/no/handlekurv",
  },
};

export const LOCALE_FORBIDDEN_WORDS = {
  it_words: [
    "aggiungi al carrello",
    "carrello vuoto",
    "spedizione gratuita",
    "spedizione rapida",
    "frantoio di famiglia",
    "degustazioni disponibili",
    "torna allo shop",
    "visualizza carrello",
    "continua lo shopping",
    "svuota carrello",
    "formato selezionato",
    "prodotto esaurito",
    "vai al checkout",
    "politica parita di genere",
    "pagamenti sicuri",
    "tutti i diritti riservati",
    "qualcosa si e rotto",
    "dettagli tecnici",
  ],
  en_words: [
    "add to cart",
    "shopping cart",
    "free shipping",
    "fast shipping",
    "family mill",
    "tastings available",
    "back to shop",
    "view cart",
    "continue shopping",
    "clear cart",
    "selected size",
    "product sold out",
    "go to checkout",
    "gender equality policy",
    "secure payments",
    "all rights reserved",
    "something went wrong",
    "technical details",
  ],
};

export const DIRECT_200_PATHS = [
  "/",
  "/acquista/",
  "/condizioni-generali-di-vendita/",
  "/contatti/",
  "/cookie-policy/",
  "/il-nostro-olio/",
  "/privacy-policy/",
  "/produzione/",
  "/storia/",
];

// Note: Slug mapped to /shop/vino-vittoria/ as configured in products.json and proxy.ts!
export const LEGACY_301_REDIRECTS = new Map<string, string>([
  ["/portfolio-category/details/", "/produzione/"],
  ["/portfolio-category/nature/", "/storia/"],
  ["/portfolio-category/photogrpahy/", "/storia/"],
  ["/portfolio-category/wine/", "/shop/vino-vittoria/"],
  ["/portfolio-tag/blanc-winery/", "/produzione/"],
  ["/portfolio-tag/countryside-bay/", "/storia/"],
  ["/portfolio-tag/organic-company/", "/storia/"],
  ["/portfolio-tag/organic-winery/", "/produzione/"],
  ["/portfolio-item/wine-shop/", "/shop/vino-vittoria/"],
  ["/portfolio-item/wine-shop-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/wine-shop-4/", "/shop/vino-vittoria/"],
  ["/portfolio-item/wine-club/", "/shop/vino-vittoria/"],
  ["/portfolio-item/wine-club-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/wine-club-3/", "/shop/vino-vittoria/"],
  ["/portfolio-item/red-wine/", "/shop/vino-vittoria/"],
  ["/portfolio-item/red-wine-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/red-wine-3/", "/shop/vino-vittoria/"],
  ["/portfolio-item/white-wine/", "/shop/vino-vittoria/"],
  ["/portfolio-item/white-wine-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/white-wine-3/", "/shop/vino-vittoria/"],
  ["/portfolio-item/white-wine-4/", "/shop/vino-vittoria/"],
  ["/portfolio-item/white-wine-4-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/desert-wine/", "/shop/vino-vittoria/"],
  ["/portfolio-item/desert-wine-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/desert-wine-3/", "/shop/vino-vittoria/"],
  ["/portfolio-item/desert-wine-3-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/green-wine/", "/shop/vino-vittoria/"],
  ["/portfolio-item/green-wine-2/", "/shop/vino-vittoria/"],
  ["/portfolio-item/the-winery/", "/produzione/"],
  ["/portfolio-item/the-winery-2/", "/produzione/"],
  ["/portfolio-item/the-winery-3/", "/produzione/"],
  ["/portfolio-item/wineyards/", "/storia/"],
  ["/portfolio-item/wineyards-2/", "/storia/"],
  ["/portfolio-item/wineyards-3/", "/storia/"],
  ["/product/olio-extravergine-di-oliva-evo/", "/shop/evo/"],
  ["/product/olio-extravergine-di-oliva-fruttato-medio-100-italiano/", "/shop/fruttato-medio/"],
  ["/product/olio-extravergine-di-oliva-fruttato-intenso-100-italiano/", "/shop/fruttato-intenso/"],
  ["/product/olio-aromatizzato-al-tartufo/", "/shop/tartufo/"],
  ["/product/olio-aromatico-al-peperoncino/", "/shop/peperoncino/"],
  ["/product/olio-aromatico-al-limone/", "/shop/"],
  ["/product-category/aromatici/", "/shop/"],
  ["/product-category/magnifico/", "/shop/"],
  ["/zblog-list-2/", "/blog/"],
]);

export const LEGACY_TECHNICAL_PATHS = ["/cart/", "/checkout/", "/my-account/"];

export const TECHNICAL_ROUTES = [
  { path: "/cart/", type: "legacy-it" },
  { path: "/carrello/", type: "it" },
  { path: "/checkout/", type: "it" },
  { path: "/my-account/", type: "it" },
  { path: "/en/cart/", type: "locale" },
  { path: "/de/warenkorb/", type: "locale" },
  { path: "/nl/winkelwagen/", type: "locale" },
  { path: "/da/kurv/", type: "locale" },
  { path: "/no/handlekurv/", type: "locale" },
  { path: "/en/checkout/", type: "locale" },
  { path: "/de/checkout/", type: "locale" },
  { path: "/nl/checkout/", type: "locale" },
  { path: "/da/checkout/", type: "locale" },
  { path: "/no/checkout/", type: "locale" },
  { path: "/en/my-account/", type: "locale" },
  { path: "/de/my-account/", type: "locale" },
  { path: "/nl/my-account/", type: "locale" },
  { path: "/da/my-account/", type: "locale" },
  { path: "/no/my-account/", type: "locale" },
];

export const HREFLANG_FORBIDDEN_WORDS = [
  "cart",
  "carrello",
  "warenkorb",
  "winkelwagen",
  "kurv",
  "handlekurv",
  "checkout",
  "account",
  "my-account",
  "login",
  "success",
];

export const CANONICAL_FORBIDDEN_WORDS = [
  "cart",
  "carrello",
  "checkout",
  "success",
  "account",
  "login",
  "api",
  "search",
];

export const TECHNICAL_PATH_SEGMENTS = new Set([
  "cart",
  "carrello",
  "checkout",
  "account",
  "my-account",
  "warenkorb",
  "winkelwagen",
  "kurv",
  "handlekurv",
  "login",
  "success",
]);

export const INDEXED_WORDPRESS_URLS = [
  "https://delpasqua.com/",
  "https://delpasqua.com/il-nostro-olio/",
  "https://delpasqua.com/en/",
  "https://delpasqua.com/en/shop/",
  "https://delpasqua.com/contatti/",
  "https://delpasqua.com/en/product/olio-extravergine-di-oliva-evo/",
  "https://delpasqua.com/cookie-policy/",
  "https://delpasqua.com/condizioni-generali-di-vendita/",
  "https://delpasqua.com/portfolio-item/desert-wine/",
  "https://delpasqua.com/produzione/",
  "https://delpasqua.com/product/olio-extravergine-di-oliva-fruttato-intenso-100-italiano/",
  "https://delpasqua.com/en/portfolio-item/red-wine-2/",
  "https://delpasqua.com/portfolio-tag/organic-winery/",
  "https://delpasqua.com/en/storia/",
  "https://delpasqua.com/en/il-nostro-olio/",
  "https://delpasqua.com/en/portfolio-item/the-winery-3/",
  "https://delpasqua.com/en/privacy-policy/",
  "https://delpasqua.com/privacy-policy/",
  "https://delpasqua.com/wp-content/uploads/2025/03/Politica-Parita-di-Genere-Frantoio-Del-Pasqua-gen-20251.pdf",
  "https://delpasqua.com/product-category/magnifico/",
  "https://delpasqua.com/acquista/",
  "https://delpasqua.com/storia/",
  "https://delpasqua.com/en/product/olio-aromatizzato-al-tartufo/",
  "https://delpasqua.com/en/portfolio-item/white-wine-4/",
  "https://delpasqua.com/portfolio-item/desert-wine-3-2/",
  "https://delpasqua.com/portfolio-item/green-wine/",
  "https://delpasqua.com/portfolio-item/white-wine-3/",
  "https://delpasqua.com/en/portfolio-item/white-wine-3/",
  "https://delpasqua.com/en/condizioni-generali-di-vendita/",
  "https://delpasqua.com/shop/",
  "https://delpasqua.com/en/acquista/",
  "https://delpasqua.com/en/produzione/",
  "https://delpasqua.com/en/product/olio-extravergine-di-oliva-fruttato-medio-100-italiano/",
  "https://delpasqua.com/product/olio-aromatico-al-limone/",
  "https://delpasqua.com/portfolio-item/white-wine-4/",
  "https://delpasqua.com/en/contatti/",
  "https://delpasqua.com/product/olio-extravergine-di-oliva-fruttato-medio-100-italiano/",
  "https://delpasqua.com/portfolio-tag/blanc-winery/",
  "https://delpasqua.com/en/portfolio-category/wine/",
  "https://delpasqua.com/product/olio-aromatizzato-al-tartufo/",
  "https://delpasqua.com/shop/?add-to-cart=12018",
];
