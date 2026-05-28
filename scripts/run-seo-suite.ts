import fs from "node:fs/promises";
import path from "node:path";

import { mockBlogPosts } from "../src/lib/blog-data";
import { readCatalog } from "../src/lib/server/catalog";
import { locales } from "../src/i18n/pathnames";

type Environment = "local" | "live-wordpress";

type Target = {
  id: Environment;
  label: string;
  baseUrl: string;
  expectedSiteUrl: string;
};

type ComparisonTarget = {
  id: string;
  label: string;
  sourceBaseUrl: string;
  targetBaseUrl: string;
  sourceSitemapUrls: string[];
};

type TaskStatus = "passed" | "passed_with_warnings" | "failed";

type TaskResult = {
  id: string;
  label: string;
  description: string;
  context: Record<string, string>;
  status: TaskStatus;
  startedAt: string;
  finishedAt: string;
  metrics: Record<string, string | number | boolean>;
  warnings: string[];
  error?: string;
  output: string[];
};

type TaskSummary = {
  status?: TaskStatus;
  metrics?: Record<string, string | number | boolean>;
  warnings?: string[];
};

type UrlClassification =
  | "LOCAL_INDEXABLE_200"
  | "LOCAL_SITEMAP_404_ERROR"
  | "LOCAL_SITEMAP_500_ERROR"
  | "LOCAL_SITEMAP_REDIRECT_ERROR"
  | "LOCAL_SITEMAP_NOINDEX_ERROR"
  | "LOCAL_REDIRECT_301_OK"
  | "LOCAL_REDIRECT_TO_404_ERROR"
  | "LOCAL_REDIRECT_TO_500_ERROR"
  | "LOCAL_REDIRECT_CHAIN_WARN"
  | "LOCAL_TECHNICAL_NOINDEX_OK"
  | "LOCAL_TECHNICAL_IN_SITEMAP_ERROR"
  | "LOCAL_TECHNICAL_MISSING_NOINDEX_ERROR"
  | "LOCAL_FETCH_ERROR"
  | "LOCAL_TRANSIENT_FETCH_WARN"
  | "WP_CURRENT_INDEXABLE_200"
  | "WP_CURRENT_REDIRECT"
  | "WP_CURRENT_404"
  | "WP_CURRENT_TECHNICAL_ROUTE"
  | "WP_CURRENT_TAXONOMY"
  | "WP_CURRENT_PRODUCT"
  | "WP_CURRENT_PORTFOLIO"
  | "WP_CURRENT_PAGE"
  | "WP_CURRENT_FETCH_ERROR";

type RedirectType = "none" | "permanent" | "temporary" | "mixed";

type UrlOutcomeInput = {
  url: string;
  source?: string;
};

type UrlOutcome = {
  environment: Environment;
  label: string;
  source: string;
  inputUrl: string;
  inputPath: string;
  initialStatus: number | null;
  initialLocation: string;
  finalUrl: string;
  finalPath: string;
  finalStatus: number | null;
  redirectChain: Array<{ url: string; status: number; location: string }>;
  redirectCount: number;
  redirectType: RedirectType;
  isInSitemapInitial: boolean;
  isInSitemapFinal: boolean;
  hasNoindex: boolean;
  canonicalUrl: string;
  canonicalHostMatchesExpected: boolean | null;
  hasHreflang: boolean;
  hasOgUrl: boolean;
  contentType: string;
  classification: UrlClassification;
  fetchError: string;
  attempts: number;
  transientRecovered: boolean;
};

type MigrationClassification =
  | "SAME_PATH_OK"
  | "COVERED_BY_LOCAL_REDIRECT"
  | "NEEDS_LOCAL_REDIRECT_OR_410"
  | "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX"
  | "TAXONOMY_LEGACY_DECISION"
  | "PRODUCT_LEGACY_DECISION"
  | "PORTFOLIO_LEGACY_DECISION"
  | "PAGE_LEGACY_DECISION"
  | "PROJECT_ONLY_NEW_URL";

type MigrationOutcome = {
  path: string;
  livePath: string;
  projectPath: string;
  classification: MigrationClassification;
  localCheckUrl: string;
  targetPath: string;
  localInitialStatus: number | null;
  localFinalStatus: number | null;
  redirectCount: number;
  note: string;
};

type GoLiveBlocker = {
  blocker: string;
  severity: "critical" | "warning" | "info";
  environment: string;
  why: string;
  action: string;
};

const ROOT_DIR = process.cwd();
const REPORT_FILE =
  process.env.SEO_SUITE_REPORT_FILE || path.resolve(ROOT_DIR, "scratch", "seo-suite-report.txt");
const URL_OUTCOMES_JSON_FILE = path.resolve(ROOT_DIR, "scratch", "url-outcomes.json");
const URL_OUTCOMES_CSV_FILE = path.resolve(ROOT_DIR, "scratch", "url-outcomes.csv");
const ACTIVE_LOCALES = [...locales];
const DIFF_LIMIT = Number.parseInt(
  process.env.SEO_SUITE_DIFF_LIMIT || process.env.DIFF_LIMIT || "200",
  10,
);
const OUTCOME_DETAIL_LIMIT = Number.parseInt(process.env.SEO_OUTCOME_DETAIL_LIMIT || "50", 10);
const FETCH_CONCURRENCY = 5;
const FETCH_TIMEOUT_MS = 15000;
const MAX_FETCH_RETRIES = 1;
const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);
const LOCAL_CHILD_SITEMAP_PATHS = ["/sitemap-pages.xml", "/sitemap-products.xml", "/sitemap-blog.xml"];
const WORDPRESS_SITEMAP_INDEX_URL = "https://delpasqua.com/wp-sitemap.xml";
const WORDPRESS_SITEMAP_URLS = [WORDPRESS_SITEMAP_INDEX_URL];
const LEGACY_STAGING_HOST_TOKEN = ["delpasqua", "ver" + "cel", "app"].join(".");
const ANTI_VERCEL_TOKENS = [
  LEGACY_STAGING_HOST_TOKEN,
  `environment=${"ver" + "cel"}`,
  `Project ${"Ver" + "cel"}`,
  `project-${"ver" + "cel"}-sitemap`,
  `Confronto ${"ver" + "cel"}.app -> produzione`,
];

const TARGETS: Target[] = [
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

const COMPARISON_TARGETS: ComparisonTarget[] = [
  {
    id: "compare-local-wordpress-live",
    label: "Confronto localhost -> WordPress live",
    sourceBaseUrl: "http://localhost:3000",
    targetBaseUrl: "https://delpasqua.com",
    sourceSitemapUrls: WORDPRESS_SITEMAP_URLS,
  },
];

const TARGET_HEADERS = {
  Connection: "close",
  "User-Agent": "Mozilla/5.0 (compatible; DelPasquaSeoSuite/2.0)",
};

const XML_HEADERS = {
  ...TARGET_HEADERS,
  Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
};

const HTML_HEADERS = {
  ...TARGET_HEADERS,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const LOCALE_ROUTE_MAPS: Record<string, Record<string, string>> = {
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

const LOCALE_FORBIDDEN_WORDS = {
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

const DIRECT_200_PATHS = [
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

const LEGACY_301_REDIRECTS = new Map<string, string>([
  ["/portfolio-category/details/", "/produzione/"],
  ["/portfolio-category/nature/", "/storia/"],
  ["/portfolio-category/photogrpahy/", "/storia/"],
  ["/portfolio-category/wine/", "/shop/vino/"],
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

const LEGACY_TECHNICAL_PATHS = ["/cart/", "/checkout/", "/my-account/"];

const TECHNICAL_ROUTES = [
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

const HREFLANG_FORBIDDEN_WORDS = [
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

const CANONICAL_FORBIDDEN_WORDS = [
  "cart",
  "carrello",
  "checkout",
  "success",
  "account",
  "login",
  "api",
  "search",
];

const TECHNICAL_PATH_SEGMENTS = new Set([
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

const urlOutcomes: UrlOutcome[] = [];
let migrationOutcomes: MigrationOutcome[] = [];

class TaskRecorder {
  readonly lines: string[] = [];

  line(value = "") {
    this.lines.push(value);
    console.log(value);
  }
}

function divider(char = "=", length = 88) {
  return char.repeat(length);
}

function timestamp() {
  return new Date().toISOString();
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function absoluteUrl(baseUrl: string, pathname: string) {
  return new URL(pathname, baseUrl).toString();
}

function remapUrlToBase(urlStr: string, baseUrl: string) {
  const source = new URL(urlStr, baseUrl);
  const base = new URL(baseUrl);
  source.protocol = base.protocol;
  source.host = base.host;
  return source.toString();
}

function normalizePath(value: string, baseUrl = "http://localhost") {
  const url = new URL(value, baseUrl);
  const pathname = url.pathname || "/";
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "/");
}

function normalizeComparablePath(urlStr: string) {
  const url = new URL(urlStr);
  let pathname = decodeURIComponent(url.pathname || "/");

  if (pathname !== "/" && !pathname.endsWith("/")) {
    const lastSegment = pathname.split("/").filter(Boolean).at(-1) || "";
    const looksLikeFile = /\.[a-z0-9]+$/i.test(lastSegment);
    if (!looksLikeFile) {
      pathname = `${pathname}/`;
    }
  }

  return pathname || "/";
}

function getUrlPath(urlStr: string, baseUrl = "http://localhost:3000") {
  try {
    return normalizeComparablePath(new URL(urlStr, baseUrl).toString());
  } catch {
    return urlStr.startsWith("/") ? normalizePath(urlStr) : urlStr;
  }
}

function pathToUrl(baseUrl: string, pathname: string) {
  return new URL(pathname, baseUrl).toString();
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeUrlInput(input: string | UrlOutcomeInput): UrlOutcomeInput {
  return typeof input === "string" ? { url: input } : input;
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function extractLocs(xml: string) {
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  const urls: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

function decodeHtml(html: string) {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"');
}

function extractVisibleText(html: string) {
  let clean = html
    .replace(/<head[^>]*>([\s\S]*?)<\/head>/gi, "")
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, "")
    .replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, "");

  clean = clean.replace(/<[^>]+>/g, " ");
  return decodeHtml(clean).replace(/\s+/g, " ").trim();
}

function extractAttributes(html: string) {
  const attributes: string[] = [];
  const regexes = [
    /placeholder=["']([^"']+)["']/gi,
    /aria-label=["']([^"']+)["']/gi,
    /title=["']([^"']+)["']/gi,
    /alt=["']([^"']+)["']/gi,
  ];

  for (const regex of regexes) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      attributes.push(decodeHtml(match[1]));
    }
  }

  return attributes;
}

function getLocaleFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const firstSegment = parts[0];
  return ACTIVE_LOCALES.includes(firstSegment as (typeof ACTIVE_LOCALES)[number])
    ? firstSegment
    : "it";
}

function extractHeadInfo(html: string) {
  return {
    noindex: /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html),
    canonical: /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html),
    hreflang: /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/i.test(html),
    ogUrl: /<meta\s+[^>]*(property|name)=["']og:url["'][^>]*>/i.test(html),
    htmlLang: (html.match(/<html[^>]*lang=["']([^"']+)["']/i) || [])[1] || "",
  };
}

function extractAlternateLinks(html: string) {
  const alternateRegex = /<link\s+[^>]*rel=["']alternate["'][^>]*>/gi;
  const hreflangRegex = /hreflang=["']([^"']+)["']/i;
  const hrefRegex = /href=["']([^"']+)["']/i;
  const alternates: Record<string, string> = {};
  const links = html.match(alternateRegex) || [];

  for (const link of links) {
    const hreflangMatch = link.match(hreflangRegex);
    const hrefMatch = link.match(hrefRegex);
    if (hreflangMatch && hrefMatch) {
      alternates[hreflangMatch[1]] = hrefMatch[1];
    }
  }

  return alternates;
}

function extractCanonicalLinks(html: string) {
  const canonicalRegex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi;
  return html.match(canonicalRegex) || [];
}

function extractCanonicalUrl(html: string) {
  const canonicalTag = extractCanonicalLinks(html)[0];
  if (!canonicalTag) return "";
  return (canonicalTag.match(/href=["']([^"']+)["']/i) || [])[1] || "";
}

function hasRobotsNoindex(html: string) {
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html);
}

function isRedirectStatus(status: number) {
  return status >= 300 && status < 400;
}

function isPermanentRedirect(status: number) {
  return status === 301 || status === 308;
}

function isTemporaryRedirect(status: number) {
  return status === 302 || status === 307;
}

function pathIsEnglish(pathname: string) {
  return normalizePath(pathname).startsWith("/en/");
}

function isTechnicalPath(pathname: string) {
  const segments = pathname.toLowerCase().split("/").filter(Boolean);
  return segments.some((segment) => TECHNICAL_PATH_SEGMENTS.has(segment));
}

function isWordPressTaxonomyPath(pathname: string) {
  return (
    pathname.includes("/portfolio-category/") ||
    pathname.includes("/portfolio-tag/") ||
    pathname.includes("/product-category/")
  );
}

function isWordPressPortfolioPath(pathname: string) {
  return pathname.includes("/portfolio-item/");
}

function isWordPressProductPath(pathname: string) {
  return pathname.includes("/product/");
}

function isUnexpectedIndexablePath(pathname: string) {
  return isTechnicalPath(pathname) || isWordPressTaxonomyPath(pathname);
}

function getRedirectType(statuses: number[]): RedirectType {
  if (statuses.length === 0) return "none";
  const hasPermanent = statuses.some(isPermanentRedirect);
  const hasTemporary = statuses.some(isTemporaryRedirect);
  if (hasPermanent && hasTemporary) return "mixed";
  if (hasTemporary) return "temporary";
  if (hasPermanent) return "permanent";
  return "mixed";
}

function formatTrace(trace: {
  hops: Array<{ status: number; location: string | null }>;
  finalPath: string;
  finalStatus: number;
}) {
  const first = trace.hops[0];
  return `status=${first?.status ?? "?"} location=${first?.location ?? "-"} final=${trace.finalPath} finalStatus=${trace.finalStatus}`;
}

function summarizeMetrics(metrics: Record<string, string | number | boolean>) {
  return Object.entries(metrics).map(([key, value]) => `${key}=${String(value)}`);
}

function isRetryableStatus(status: number | null | undefined) {
  return status !== null && status !== undefined && RETRYABLE_STATUS_CODES.has(status);
}

async function mapWithConcurrency<T, TResult>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<TResult>,
) {
  const results = new Array<TResult>(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      if (currentIndex >= items.length) {
        return;
      }

      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, Math.max(items.length, 1)) }, () => runWorker()),
  );

  return results;
}

async function fetchWithRetry(url: string, init?: RequestInit) {
  let attempts = 0;
  let hadRetryableFailure = false;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_FETCH_RETRIES; attempt += 1) {
    attempts += 1;

    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (attempt < MAX_FETCH_RETRIES && isRetryableStatus(response.status)) {
        hadRetryableFailure = true;
        continue;
      }

      return {
        response,
        attempts,
        transientRecovered: hadRetryableFailure && !isRetryableStatus(response.status),
      };
    } catch (error) {
      lastError = error;
      if (attempt < MAX_FETCH_RETRIES) {
        hadRetryableFailure = true;
        continue;
      }
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error(`Unable to fetch ${url}`);
}

function categorizePath(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.includes("/blog/")) return "blog";
  if (
    pathname.includes("/shop/") ||
    pathname.includes("/laden/") ||
    pathname.includes("/winkel/") ||
    pathname.includes("/butik/") ||
    pathname.includes("/butikk/")
  ) {
    return "shop";
  }
  if (
    pathname.includes("/privacy") ||
    pathname.includes("/cookie") ||
    pathname.includes("/termini") ||
    pathname.includes("/condizioni-generali-di-vendita/")
  ) {
    return "legal";
  }
  if (
    pathname.includes("/carrello/") ||
    pathname.includes("/checkout/") ||
    pathname.includes("/my-account/") ||
    pathname.includes("/cart/") ||
    pathname.includes("/warenkorb/") ||
    pathname.includes("/winkelwagen/") ||
    pathname.includes("/kurv/") ||
    pathname.includes("/handlekurv/")
  ) {
    return "utility";
  }
  return "pages";
}

async function fetchText(url: string, init?: RequestInit) {
  const { response, attempts, transientRecovered } = await fetchWithRetry(url, init);
  return {
    response,
    text: await response.text(),
    attempts,
    transientRecovered,
  };
}

async function fetchXml(url: string) {
  const { response, text } = await fetchText(url, {
    headers: XML_HEADERS,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${url}`);
  }

  return text;
}

async function fetchHtml(url: string, headers: HeadersInit = HTML_HEADERS) {
  const { response, text, attempts, transientRecovered } = await fetchText(url, {
    headers,
    redirect: "follow",
  });

  return { response, html: text, attempts, transientRecovered };
}

async function fetchManual(baseUrl: string, pathname: string, headers: HeadersInit = HTML_HEADERS) {
  return fetchWithRetry(absoluteUrl(baseUrl, pathname), {
    headers,
    redirect: "manual",
  });
}

async function loadIndexedUrls(baseUrl: string) {
  const allUrls = new Set<string>();

  for (const sitemapPath of LOCAL_CHILD_SITEMAP_PATHS) {
    const sitemapUrl = absoluteUrl(baseUrl, sitemapPath);
    const xml = await fetchXml(sitemapUrl);
    for (const url of extractLocs(xml)) {
      allUrls.add(url);
    }
  }

  return [...allUrls];
}

async function loadSitemapPathSet(baseUrl: string) {
  const indexXml = await fetchXml(absoluteUrl(baseUrl, "/sitemap.xml"));
  const sitemapUrls = extractLocs(indexXml);
  const allPaths = new Set<string>();

  for (const sitemapUrl of sitemapUrls) {
    const remappedSitemapUrl = remapUrlToBase(sitemapUrl, baseUrl);
    const xml = await fetchXml(remappedSitemapUrl);
    for (const loc of extractLocs(xml)) {
      allPaths.add(normalizePath(loc));
    }
  }

  return allPaths;
}

async function traceRequest(baseUrl: string, startPath: string, maxRedirects = 5) {
  const hops: Array<{ path: string; status: number; location: string | null }> = [];
  let currentPath = normalizePath(startPath);

  for (let index = 0; index <= maxRedirects; index += 1) {
    const { response } = await fetchManual(baseUrl, currentPath);
    const location = response.headers.get("location");
    const status = response.status;

    if (!isRedirectStatus(status)) {
      const html = await response.text();
      hops.push({ path: currentPath, status, location: null });
      return {
        hops,
        finalPath: currentPath,
        finalStatus: status,
        html,
        head: extractHeadInfo(html),
        robotsNoindex: /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(
          html,
        ),
      };
    }

    const nextPath = location ? normalizePath(location, baseUrl) : null;
    hops.push({ path: currentPath, status, location });
    if (!nextPath) {
      return {
        hops,
        finalPath: currentPath,
        finalStatus: status,
        html: "",
        head: null,
        robotsNoindex: false,
      };
    }

    currentPath = nextPath;
  }

  return {
    hops,
    finalPath: currentPath,
    finalStatus: 310,
    html: "",
    head: null,
    robotsNoindex: false,
  };
}

function printComparisonList(
  recorder: TaskRecorder,
  title: string,
  paths: string[],
  limit = DIFF_LIMIT,
) {
  recorder.line(`${title} (${paths.length})`);
  recorder.line("-".repeat(title.length + String(paths.length).length + 3));

  const limited = paths.slice(0, limit);
  for (const pathname of limited) {
    recorder.line(pathname);
  }

  if (paths.length > limited.length) {
    recorder.line(`... altri ${paths.length - limited.length} path non mostrati (DIFF_LIMIT=${limit})`);
  }

  recorder.line("");
}

function reportCategoryBreakdown(recorder: TaskRecorder, label: string, paths: string[]) {
  const counts: Record<string, number> = {
    home: 0,
    pages: 0,
    shop: 0,
    blog: 0,
    legal: 0,
    utility: 0,
  };

  for (const pathname of paths) {
    counts[categorizePath(pathname)] += 1;
  }

  recorder.line(`${label}:`);
  for (const [category, count] of Object.entries(counts)) {
    recorder.line(`- ${category}: ${count}`);
  }
}

async function collectSitemapPaths(entryUrl: string, baseUrl: string, seen = new Set<string>()) {
  const normalizedEntryUrl = remapUrlToBase(entryUrl, baseUrl);
  if (seen.has(normalizedEntryUrl)) {
    return [];
  }

  seen.add(normalizedEntryUrl);
  const xml = await fetchXml(normalizedEntryUrl);
  const locs = extractLocs(xml);

  if (xml.includes("<sitemapindex")) {
    let nestedPaths: string[] = [];
    for (const loc of locs) {
      const childPaths = await collectSitemapPaths(loc, baseUrl, seen);
      nestedPaths = nestedPaths.concat(childPaths);
    }
    return nestedPaths;
  }

  if (!xml.includes("<urlset")) {
    throw new Error(`Formato sitemap non riconosciuto: ${normalizedEntryUrl}`);
  }

  return locs.map(normalizeComparablePath);
}

async function collectRecursiveSitemapUrls(
  entryUrl: string,
  baseUrl: string,
  recorder: TaskRecorder,
  label: string,
  seen = new Set<string>(),
): Promise<string[]> {
  const normalizedSitemapUrl = remapUrlToBase(entryUrl, baseUrl);
  if (seen.has(normalizedSitemapUrl)) {
    return [];
  }

  seen.add(normalizedSitemapUrl);
  let xml = "";

  try {
    xml = await fetchXml(normalizedSitemapUrl);
  } catch (error) {
    recorder.line(`WARN ${label} sitemap non scaricabile ${normalizedSitemapUrl}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }

  const locs = extractLocs(xml);
  if (xml.includes("<sitemapindex")) {
    recorder.line(`${label} sitemap index ${normalizedSitemapUrl} -> ${locs.length} sitemap reference`);
    let nestedUrls: string[] = [];
    for (const childUrl of locs) {
      nestedUrls = nestedUrls.concat(
        await collectRecursiveSitemapUrls(childUrl, baseUrl, recorder, label, seen),
      );
    }
    return nestedUrls;
  }

  if (!xml.includes("<urlset")) {
    recorder.line(`WARN ${label} sitemap formato non riconosciuto ${normalizedSitemapUrl}`);
    return [];
  }

  recorder.line(`${label} sitemap urlset ${normalizedSitemapUrl} -> ${locs.length} URL`);
  return locs;
}

async function collectExplicitSitemapPaths(
  sitemapUrls: string[],
  baseUrl: string,
  recorder: TaskRecorder,
  label: string,
) {
  let paths: string[] = [];

  for (const sitemapUrl of sitemapUrls) {
    const urls = await collectRecursiveSitemapUrls(sitemapUrl, baseUrl, recorder, label);
    paths = paths.concat(urls.map(normalizeComparablePath));
  }

  return uniqueStrings(paths);
}

async function collectExplicitSitemapUrls(
  sitemapUrls: string[],
  baseUrl: string,
  recorder: TaskRecorder,
  label: string,
) {
  let urls: string[] = [];

  for (const sitemapUrl of sitemapUrls) {
    urls = urls.concat(await collectRecursiveSitemapUrls(sitemapUrl, baseUrl, recorder, label));
  }

  return uniqueStrings(urls);
}

async function collectProjectSitemapUrls(baseUrl: string, recorder: TaskRecorder, label: string) {
  try {
    return await loadIndexedUrls(baseUrl);
  } catch (error) {
    recorder.line(`WARN ${label} sitemap progetto non scaricabile: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

async function runTask(
  config: {
    id: string;
    label: string;
    description: string;
    context: Record<string, string>;
  },
  runner: (recorder: TaskRecorder) => Promise<TaskSummary>,
) {
  const recorder = new TaskRecorder();
  const startedAt = timestamp();

  recorder.line(divider());
  recorder.line(config.label);
  recorder.line(`Descrizione: ${config.description}`);
  for (const [key, value] of Object.entries(config.context)) {
    recorder.line(`${key}: ${value}`);
  }
  recorder.line(`Started at: ${startedAt}`);
  recorder.line(divider("-"));

  let status: TaskStatus = "passed";
  let metrics: Record<string, string | number | boolean> = {};
  let warnings: string[] = [];
  let error: string | undefined;

  try {
    const summary = await runner(recorder);
    status = summary.status || "passed";
    metrics = summary.metrics || {};
    warnings = summary.warnings || [];
    if (warnings.length > 0 && status === "passed") {
      status = "passed_with_warnings";
    }
  } catch (caughtError) {
    status = "failed";
    error = caughtError instanceof Error ? caughtError.stack || caughtError.message : String(caughtError);
    recorder.line("");
    recorder.line("Task error");
    recorder.line(error);
  }

  const finishedAt = timestamp();
  recorder.line(divider("-"));
  recorder.line(`Finished at: ${finishedAt}`);
  recorder.line(`Status: ${status}`);
  if (Object.keys(metrics).length > 0) {
    recorder.line(`Metrics: ${summarizeMetrics(metrics).join(" | ")}`);
  }
  if (warnings.length > 0) {
    recorder.line("Warnings:");
    for (const warning of warnings) {
      recorder.line(`- ${warning}`);
    }
  }
  recorder.line(divider());
  recorder.line("");

  return {
    id: config.id,
    label: config.label,
    description: config.description,
    context: config.context,
    status,
    startedAt,
    finishedAt,
    metrics,
    warnings,
    error,
    output: recorder.lines,
  } satisfies TaskResult;
}

async function fetchOutcome(inputUrl: string, maxRedirects = 8) {
  const redirectChain: Array<{ url: string; status: number; location: string }> = [];
  let currentUrl = inputUrl;
  let response: Response | null = null;
  let html = "";
  let contentType = "";
  let attempts = 0;
  let transientRecovered = false;

  for (let index = 0; index <= maxRedirects; index += 1) {
    const fetched = await fetchWithRetry(currentUrl, {
      headers: HTML_HEADERS,
      redirect: "manual",
    });
    response = fetched.response;
    attempts += fetched.attempts;
    transientRecovered = transientRecovered || fetched.transientRecovered;
    contentType = response.headers.get("content-type") || "";
    const location = response.headers.get("location") || "";

    if (!isRedirectStatus(response.status)) {
      if (response.status !== 204) {
        html = await response.text();
      }
      break;
    }

    redirectChain.push({ url: currentUrl, status: response.status, location });
    if (!location) {
      break;
    }

    currentUrl = new URL(location, currentUrl).toString();
  }

  return {
    response,
    html,
    contentType,
    finalUrl: currentUrl,
    redirectChain,
    attempts,
    transientRecovered,
  };
}

function classifyLocalOutcome(outcome: Omit<UrlOutcome, "classification">): UrlClassification {
  const source = outcome.source;
  const isProjectSitemap = source === "local-project-sitemap";
  const isLegacyRedirect = source === "local-legacy-redirects";
  const isTechnicalRoute = source === "local-technical-routes";
  const technicalMetaOk =
    outcome.hasNoindex &&
    !outcome.canonicalUrl &&
    !outcome.hasHreflang &&
    !outcome.hasOgUrl;

  if (outcome.fetchError) return "LOCAL_FETCH_ERROR";

  if (isProjectSitemap) {
    if (outcome.redirectCount > 0) return "LOCAL_SITEMAP_REDIRECT_ERROR";
    if (outcome.finalStatus === 404) return "LOCAL_SITEMAP_404_ERROR";
    if ((outcome.finalStatus || 0) >= 500) return "LOCAL_SITEMAP_500_ERROR";
    if (outcome.hasNoindex) return "LOCAL_SITEMAP_NOINDEX_ERROR";
    if (outcome.transientRecovered && outcome.finalStatus === 200) return "LOCAL_TRANSIENT_FETCH_WARN";
    if (outcome.finalStatus === 200) return "LOCAL_INDEXABLE_200";
    return "LOCAL_FETCH_ERROR";
  }

  if (isLegacyRedirect) {
    if (outcome.finalStatus === 404) return "LOCAL_REDIRECT_TO_404_ERROR";
    if ((outcome.finalStatus || 0) >= 500) return "LOCAL_REDIRECT_TO_500_ERROR";
    if (outcome.transientRecovered && outcome.finalStatus === 200) return "LOCAL_TRANSIENT_FETCH_WARN";
    if (
      outcome.redirectCount >= 1 &&
      (outcome.redirectType === "temporary" || outcome.redirectType === "mixed" || outcome.redirectCount > 1)
    ) {
      return "LOCAL_REDIRECT_CHAIN_WARN";
    }
    if (outcome.redirectType === "permanent" && outcome.finalStatus === 200) {
      return "LOCAL_REDIRECT_301_OK";
    }
    return "LOCAL_FETCH_ERROR";
  }

  if (isTechnicalRoute) {
    if (outcome.isInSitemapInitial || outcome.isInSitemapFinal) return "LOCAL_TECHNICAL_IN_SITEMAP_ERROR";
    if (outcome.finalStatus === 200 && technicalMetaOk) {
      return outcome.transientRecovered ? "LOCAL_TRANSIENT_FETCH_WARN" : "LOCAL_TECHNICAL_NOINDEX_OK";
    }
    if (outcome.finalStatus === 200) return "LOCAL_TECHNICAL_MISSING_NOINDEX_ERROR";
    return "LOCAL_FETCH_ERROR";
  }

  return "LOCAL_FETCH_ERROR";
}

function classifyWordPressOutcome(outcome: Omit<UrlOutcome, "classification">): UrlClassification {
  if (outcome.fetchError) return "WP_CURRENT_FETCH_ERROR";
  if (outcome.redirectCount > 0) return "WP_CURRENT_REDIRECT";
  if (outcome.finalStatus === 404) return "WP_CURRENT_404";
  if (isTechnicalPath(outcome.finalPath)) return "WP_CURRENT_TECHNICAL_ROUTE";
  if (isWordPressTaxonomyPath(outcome.finalPath)) return "WP_CURRENT_TAXONOMY";
  if (isWordPressProductPath(outcome.finalPath)) return "WP_CURRENT_PRODUCT";
  if (isWordPressPortfolioPath(outcome.finalPath)) return "WP_CURRENT_PORTFOLIO";
  if (outcome.finalStatus === 200) return "WP_CURRENT_PAGE";
  return "WP_CURRENT_FETCH_ERROR";
}

function classifyUrlOutcome(outcome: Omit<UrlOutcome, "classification">): UrlClassification {
  return outcome.environment === "local"
    ? classifyLocalOutcome(outcome)
    : classifyWordPressOutcome(outcome);
}

async function auditUrlOutcomes({
  environment,
  label,
  baseUrl,
  urls,
  sitemapUrls,
  expectedCanonicalHost,
}: {
  environment: Environment;
  label: string;
  baseUrl: string;
  urls: Array<string | UrlOutcomeInput>;
  sitemapUrls: string[];
  expectedCanonicalHost: string;
}) {
  const normalizedInputs = urls.map(normalizeUrlInput);
  const sitemapPathSet = new Set(sitemapUrls.map((url) => getUrlPath(url, baseUrl)));
  const expectedHost = new URL(expectedCanonicalHost).host;

  const outcomes = await mapWithConcurrency(
    normalizedInputs,
    FETCH_CONCURRENCY,
    async (input): Promise<UrlOutcome> => {
      const inputUrl = input.url.startsWith("http://") || input.url.startsWith("https://")
        ? input.url
        : pathToUrl(baseUrl, input.url);
      const inputPath = getUrlPath(inputUrl, baseUrl);
      const emptyOutcome = {
        environment,
        label,
        source: input.source || "",
        inputUrl,
        inputPath,
        initialStatus: null,
        initialLocation: "",
        finalUrl: inputUrl,
        finalPath: inputPath,
        finalStatus: null,
        redirectChain: [],
        redirectCount: 0,
        redirectType: "none" as RedirectType,
        isInSitemapInitial: sitemapPathSet.has(inputPath),
        isInSitemapFinal: sitemapPathSet.has(inputPath),
        hasNoindex: false,
        canonicalUrl: "",
        canonicalHostMatchesExpected: null,
        hasHreflang: false,
        hasOgUrl: false,
        contentType: "",
        fetchError: "",
        attempts: 0,
        transientRecovered: false,
      };

      try {
        const fetched = await fetchOutcome(inputUrl);
        const response = fetched.response;
        const finalPath = getUrlPath(fetched.finalUrl, baseUrl);
        const redirectStatuses = fetched.redirectChain.map((hop) => hop.status);
        const canonicalUrl = fetched.html ? extractCanonicalUrl(fetched.html) : "";
        const canonicalHostMatchesExpected = canonicalUrl
          ? new URL(canonicalUrl, fetched.finalUrl).host === expectedHost
          : null;
        const hasNoindex = fetched.html ? hasRobotsNoindex(fetched.html) : false;
        const hasHreflang = fetched.html
          ? /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/i.test(fetched.html)
          : false;
        const hasOgUrl = fetched.html
          ? /<meta\s+[^>]*(property|name)=["']og:url["'][^>]*>/i.test(fetched.html)
          : false;
        const isHtmlLike =
          !fetched.contentType ||
          fetched.contentType.includes("text/html") ||
          fetched.contentType.includes("application/xhtml") ||
          fetched.contentType.includes("application/xml") ||
          fetched.contentType.includes("text/xml");

        const baseOutcome = {
          ...emptyOutcome,
          initialStatus: fetched.redirectChain[0]?.status ?? response?.status ?? null,
          initialLocation: fetched.redirectChain[0]?.location || "",
          finalUrl: fetched.finalUrl,
          finalPath,
          finalStatus: response?.status ?? null,
          redirectChain: fetched.redirectChain,
          redirectCount: fetched.redirectChain.length,
          redirectType: getRedirectType(redirectStatuses),
          isInSitemapFinal: sitemapPathSet.has(finalPath),
          hasNoindex,
          canonicalUrl,
          canonicalHostMatchesExpected,
          hasHreflang,
          hasOgUrl,
          contentType: fetched.contentType,
          fetchError: isHtmlLike ? "" : `Unexpected content-type: ${fetched.contentType}`,
          attempts: fetched.attempts,
          transientRecovered: fetched.transientRecovered,
        };

        return {
          ...baseOutcome,
          classification: classifyUrlOutcome(baseOutcome),
        };
      } catch (error) {
        const baseOutcome = {
          ...emptyOutcome,
          fetchError: error instanceof Error ? error.message : String(error),
        };
        return {
          ...baseOutcome,
          classification: classifyUrlOutcome(baseOutcome),
        };
      }
    },
  );

  urlOutcomes.push(...outcomes);
  return outcomes;
}

function summarizeOutcomes(outcomes: UrlOutcome[]) {
  const byClassification: Record<string, number> = {};
  for (const outcome of outcomes) {
    byClassification[outcome.classification] = (byClassification[outcome.classification] || 0) + 1;
  }

  return {
    total: outcomes.length,
    byClassification,
    local: outcomes.filter((outcome) => outcome.environment === "local").length,
    liveWordPress: outcomes.filter((outcome) => outcome.environment === "live-wordpress").length,
  };
}

function printOutcomeSummary(recorder: TaskRecorder, outcomes: UrlOutcome[]) {
  const summary = summarizeOutcomes(outcomes);
  recorder.line("URL Outcome Summary");
  recorder.line(`- Totale URL analizzate: ${summary.total}`);
  recorder.line(`- Local project URLs: ${summary.local}`);
  recorder.line(`- Live WordPress URLs: ${summary.liveWordPress}`);
  for (const [classification, count] of Object.entries(summary.byClassification).sort((a, b) =>
    a[0].localeCompare(b[0], "it")
  )) {
    recorder.line(`- ${classification}: ${count}`);
  }
  recorder.line("");
}

function printOutcomeGroups(recorder: TaskRecorder, outcomes: UrlOutcome[]) {
  const grouped = new Map<UrlClassification, UrlOutcome[]>();
  for (const outcome of outcomes) {
    grouped.set(outcome.classification, [...(grouped.get(outcome.classification) || []), outcome]);
  }

  recorder.line("URL Outcome Groups");
  for (const classification of [...grouped.keys()].sort()) {
    const group = grouped.get(classification) || [];
    recorder.line(`${classification} (${group.length})`);
    for (const outcome of group.slice(0, OUTCOME_DETAIL_LIMIT)) {
      recorder.line(
        `[${outcome.environment}] ${outcome.initialStatus ?? "-"} -> ${outcome.finalStatus ?? "-"} | ${outcome.inputPath} -> ${outcome.finalPath} | source=${outcome.source} | redirects=${outcome.redirectCount} | noindex=${outcome.hasNoindex} | canonical=${outcome.canonicalUrl || "-"} | transientRecovered=${outcome.transientRecovered}`,
      );
    }
    if (group.length > OUTCOME_DETAIL_LIMIT) {
      recorder.line(`... altri ${group.length - OUTCOME_DETAIL_LIMIT} outcome non mostrati`);
    }
    recorder.line("");
  }
}

async function auditLocales(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  let totalViolations = 0;
  let skippedPages = 0;
  let pagesChecked = 0;

  for (const [route, localeMap] of Object.entries(LOCALE_ROUTE_MAPS)) {
    recorder.line(`Route: ${route}`);

    for (const locale of ACTIVE_LOCALES) {
      const relativePath = localeMap[locale];
      const url = absoluteUrl(baseUrl, relativePath);
      pagesChecked += 1;

      try {
        const { response, html } = await fetchHtml(url, TARGET_HEADERS);
        if (!response.ok) {
          skippedPages += 1;
          recorder.line(`SKIPPED [${locale}] ${url} -> HTTP ${response.status}`);
          continue;
        }

        const visibleText = extractVisibleText(html);
        const attributes = extractAttributes(html);
        const allTextToScan = [visibleText, ...attributes].join(" | ").toLowerCase();
        const violations: string[] = [];

        if (locale !== "it") {
          for (const word of LOCALE_FORBIDDEN_WORDS.it_words) {
            if (allTextToScan.includes(word.toLowerCase())) {
              violations.push(word);
            }
          }
        }

        if (locale === "it") {
          for (const word of LOCALE_FORBIDDEN_WORDS.en_words) {
            if (allTextToScan.includes(word.toLowerCase())) {
              violations.push(word);
            }
          }
        }

        if (violations.length === 0) {
          recorder.line(`OK      [${locale}] ${url}`);
        } else {
          totalViolations += violations.length;
          recorder.line(`FAIL    [${locale}] ${url}`);
          for (const violation of violations) {
            recorder.line(`- mixed string detected: "${violation}"`);
          }
        }
      } catch (error) {
        skippedPages += 1;
        recorder.line(
          `SKIPPED [${locale}] ${url} -> ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    recorder.line("");
  }

  if (totalViolations > 0) {
    throw new Error(`Mixed language violations found: ${totalViolations}`);
  }

  return {
    status: skippedPages > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      routesChecked: Object.keys(LOCALE_ROUTE_MAPS).length,
      pagesChecked,
      mixedLanguageViolations: totalViolations,
      skippedPages,
    },
    warnings:
      skippedPages > 0
        ? [`${skippedPages} pagine non raggiungibili o saltate durante il controllo locale.`]
        : [],
  };
}

async function auditSitemaps(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const sitemapIndexUrl = absoluteUrl(baseUrl, "/sitemap.xml");
  recorder.line(`Sitemap index: ${sitemapIndexUrl}`);

  const indexXml = await fetchXml(sitemapIndexUrl);
  if (!indexXml.includes("<?xml") || !indexXml.includes("<sitemapindex")) {
    throw new Error("Sitemap index non valida o senza tag <sitemapindex>.");
  }

  const childSitemaps = extractLocs(indexXml);
  const expectedChildren = LOCAL_CHILD_SITEMAP_PATHS.map((sitemapPath) => sitemapPath.replace(/^\//, ""));

  recorder.line(`Child sitemap trovate: ${childSitemaps.length}`);
  for (const child of expectedChildren) {
    const found = childSitemaps.some((sitemapUrl) => sitemapUrl.endsWith(child));
    recorder.line(`${found ? "OK" : "FAIL"} child sitemap ${child}`);
    if (!found) {
      throw new Error(`Child sitemap mancante: ${child}`);
    }
  }

  let allUrls: string[] = [];
  for (const childSitemapUrl of childSitemaps) {
    const localChildSitemapUrl = remapUrlToBase(childSitemapUrl, baseUrl);
    const xml = await fetchXml(localChildSitemapUrl);
    if (!xml.includes("<?xml") || !xml.includes("<urlset")) {
      throw new Error(`Child sitemap non valida: ${localChildSitemapUrl}`);
    }

    const urls = extractLocs(xml);
    recorder.line(`Child sitemap ${localChildSitemapUrl} -> ${urls.length} URL`);
    allUrls = allUrls.concat(urls);
  }

  const uniqueUrls = [...new Set(allUrls)];
  const failures: string[] = [];

  for (const url of uniqueUrls) {
    try {
      const urlObject = new URL(url);
      if (urlObject.search) {
        failures.push(`${url} -> contiene query params ${urlObject.search}`);
        recorder.line(`FAIL ${url} -> query params ${urlObject.search}`);
        continue;
      }

      const forbiddenSegments = [
        "cart",
        "carrello",
        "checkout",
        "account",
        "my-account",
        "login",
        "success",
        "api",
      ];

      const badSegment = urlObject.pathname
        .split("/")
        .filter(Boolean)
        .find((segment) => forbiddenSegments.includes(segment.toLowerCase()));

      if (badSegment) {
        failures.push(`${url} -> segmento proibito ${badSegment}`);
        recorder.line(`FAIL ${url} -> forbidden path segment ${badSegment}`);
        continue;
      }

      const localCheckUrl = remapUrlToBase(url, baseUrl);
      const { response: headResponse } = await fetchWithRetry(localCheckUrl, {
        method: "HEAD",
        headers: TARGET_HEADERS,
      });
      if (!headResponse.ok) {
        const { response: getResponse } = await fetchWithRetry(localCheckUrl, {
          headers: TARGET_HEADERS,
        });
        if (!getResponse.ok) {
          failures.push(`${url} -> HTTP ${getResponse.status} (local test ${localCheckUrl})`);
          recorder.line(`FAIL ${url} -> HTTP ${getResponse.status} (local test ${localCheckUrl})`);
          continue;
        }
      }

      recorder.line(`OK   ${url}`);
    } catch (error) {
      failures.push(`${url} -> ${error instanceof Error ? error.message : String(error)}`);
      recorder.line(`FAIL ${url} -> ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const missingHomepages: string[] = [];
  for (const locale of ACTIVE_LOCALES) {
    const expectedPath = locale === "it" ? "/" : `/${locale}/`;
    const found = uniqueUrls.some((url) => new URL(url).pathname === expectedPath);
    recorder.line(`${found ? "OK" : "FAIL"} homepage locale ${locale} -> ${expectedPath}`);
    if (!found) {
      missingHomepages.push(locale);
    }
  }

  if (failures.length > 0 || missingHomepages.length > 0) {
    throw new Error(
      `Sitemap issues detected. verificationFailures=${failures.length}, missingHomepages=${missingHomepages.length}`,
    );
  }

  return {
    metrics: {
      childSitemaps: childSitemaps.length,
      uniqueUrls: uniqueUrls.length,
      verificationFailures: failures.length,
      missingHomepages: missingHomepages.length,
    },
  };
}

async function auditLegacyRoutes(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const sitemapPaths = await loadSitemapPathSet(baseUrl);
  let failures = 0;

  recorder.line(`Checking direct URLs (${DIRECT_200_PATHS.length})`);
  for (const pathname of DIRECT_200_PATHS) {
    try {
      const trace = await traceRequest(baseUrl, pathname, 2);
      const ok =
        trace.hops.length === 1 &&
        trace.finalStatus === 200 &&
        normalizePath(trace.finalPath) === normalizePath(pathname);

      recorder.line(`${ok ? "OK  " : "FAIL"} ${pathname} ${formatTrace(trace)}`);
      if (!ok) {
        failures += 1;
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${pathname} ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  recorder.line("");
  recorder.line(`Checking legacy redirects (${LEGACY_301_REDIRECTS.size})`);
  for (const [sourcePath, expectedDestination] of LEGACY_301_REDIRECTS.entries()) {
    try {
      const trace = await traceRequest(baseUrl, sourcePath, 2);
      const firstHop = trace.hops[0];
      const ok =
        Boolean(firstHop && isPermanentRedirect(firstHop.status)) &&
        normalizePath(trace.finalPath) === normalizePath(expectedDestination) &&
        trace.hops.length <= 2 &&
        !pathIsEnglish(trace.finalPath) &&
        trace.finalStatus === 200;

      recorder.line(`${ok ? "OK  " : "FAIL"} ${sourcePath} ${formatTrace(trace)}`);
      if (!ok) {
        failures += 1;
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${sourcePath} ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  recorder.line("");
  recorder.line(`Checking technical/account URLs (${LEGACY_TECHNICAL_PATHS.length})`);
  for (const pathname of LEGACY_TECHNICAL_PATHS) {
    try {
      const trace = await traceRequest(baseUrl, pathname, 2);
      const redirectCount = trace.hops.filter((hop) => isRedirectStatus(hop.status)).length;
      const initialStatus = trace.hops[0]?.status ?? 0;
      const initialLocation = trace.hops[0]?.location ?? "";
      const initialInSitemap = sitemapPaths.has(normalizePath(pathname));
      const finalInSitemap = sitemapPaths.has(normalizePath(trace.finalPath));
      const landsInEnglish =
        pathIsEnglish(trace.finalPath) || (initialLocation ? pathIsEnglish(initialLocation) : false);

      let ok = true;
      if (initialStatus === 404 || trace.finalStatus === 404) ok = false;
      if (landsInEnglish) ok = false;
      if (redirectCount > 1) ok = false;
      if (initialInSitemap || finalInSitemap) ok = false;
      if (trace.finalStatus === 200 && !trace.robotsNoindex) ok = false;

      recorder.line(
        `${ok ? "OK  " : "FAIL"} ${pathname} ${formatTrace(trace)} redirects=${redirectCount} initialInSitemap=${initialInSitemap} finalInSitemap=${finalInSitemap} noindex=${trace.robotsNoindex}`,
      );
      if (!ok) {
        failures += 1;
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${pathname} ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures > 0) {
    throw new Error(`Legacy route failures found: ${failures}`);
  }

  return {
    metrics: {
      direct200Paths: DIRECT_200_PATHS.length,
      legacyRedirects: LEGACY_301_REDIRECTS.size,
      technicalPaths: LEGACY_TECHNICAL_PATHS.length,
      failures,
    },
  };
}

async function auditTechnicalNoindex(
  baseUrl: string,
  recorder: TaskRecorder,
): Promise<TaskSummary> {
  const sitemapPaths = await loadSitemapPathSet(baseUrl);
  const failures: string[] = [];
  const noindex200: string[] = [];
  const redirects: string[] = [];
  let cartItalianConfirmed = false;

  for (const route of TECHNICAL_ROUTES) {
    try {
      const trace = await traceRequest(baseUrl, route.path, 2);
      const redirectCount = trace.hops.filter((hop) => isRedirectStatus(hop.status)).length;
      const initialLocation = trace.hops[0]?.location || "";
      const initialInSitemap = sitemapPaths.has(normalizePath(route.path));
      const finalInSitemap = sitemapPaths.has(normalizePath(trace.finalPath));
      const italianPath = route.type === "it" || route.type === "legacy-it";
      const redirectsToEnglish =
        initialLocation.startsWith("/en/") || normalizePath(trace.finalPath).startsWith("/en/");

      let ok = true;
      if (trace.finalStatus === 404 || trace.hops[0]?.status === 404) ok = false;
      if (redirectCount > 1) ok = false;
      if (italianPath && redirectsToEnglish) ok = false;
      if (initialInSitemap || finalInSitemap) ok = false;

      if (redirectCount > 0) {
        redirects.push(route.path);
      }

      if (trace.finalStatus === 200) {
        const headOk = Boolean(
          trace.head &&
            trace.head.noindex &&
            !trace.head.canonical &&
            !trace.head.hreflang &&
            !trace.head.ogUrl,
        );

        if (!headOk) {
          ok = false;
        } else {
          noindex200.push(route.path);
        }

        if (normalizePath(route.path) === normalizePath(LOCALE_ROUTE_MAPS["/cart"].it)) {
          const isItalian = trace.head?.htmlLang === "it";
          if (!isItalian) {
            ok = false;
          }
          cartItalianConfirmed = isItalian;
        }
      }

      const resultLine = `${route.path} ${formatTrace(trace)}`;
      recorder.line(`${ok ? "OK  " : "FAIL"} ${resultLine}`);
      if (!ok) {
        failures.push(resultLine);
      }
    } catch (error) {
      const message = `${route.path} ${error instanceof Error ? error.message : String(error)}`;
      failures.push(message);
      recorder.line(`ERROR ${message}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Technical noindex failures found: ${failures.length}`);
  }

  return {
    metrics: {
      technicalRoutesFound: TECHNICAL_ROUTES.length,
      noindex200Routes: noindex200.length,
      redirectingRoutes: redirects.length,
      failures: failures.length,
      carrelloItalianConfirmed: cartItalianConfirmed,
    },
  };
}

async function auditHreflang(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const urlsToTest = await loadIndexedUrls(baseUrl);
  const pageAlternates = new Map<string, Record<string, string>>();
  const errors: Record<string, string[]> = {};

  for (const urlStr of urlsToTest) {
    const pageErrors: string[] = [];
    const localUrl = remapUrlToBase(urlStr, baseUrl);
    recorder.line(`Checking ${urlStr}`);

    try {
      const lowerUrl = urlStr.toLowerCase();
      if (HREFLANG_FORBIDDEN_WORDS.some((word) => lowerUrl.includes(word))) {
        pageErrors.push(`Contains forbidden word from list: ${HREFLANG_FORBIDDEN_WORDS.join(", ")}`);
      }

      const { response, html } = await fetchHtml(encodeURI(decodeURI(localUrl)), TARGET_HEADERS);
      if (!response.ok) {
        pageErrors.push(`Page returned status code ${response.status}`);
        errors[urlStr] = pageErrors;
        recorder.line(`FAIL ${urlStr} -> HTTP ${response.status}`);
        continue;
      }

      const alternates = extractAlternateLinks(html);
      pageAlternates.set(urlStr, alternates);

      const keys = Object.keys(alternates);
      if (keys.length === 0) {
        pageErrors.push("No alternate hreflang tags found in page head.");
      } else {
        if (!alternates["x-default"]) {
          pageErrors.push("Missing x-default hreflang tag.");
        }

        if (alternates["x-default"] && alternates["it"] && alternates["x-default"] !== alternates["it"]) {
          pageErrors.push(`x-default (${alternates["x-default"]}) differs from 'it' alternate (${alternates["it"]}).`);
        }

        for (const [lang, href] of Object.entries(alternates)) {
          if (!href.startsWith("http://") && !href.startsWith("https://")) {
            pageErrors.push(`Hreflang for '${lang}' is not an absolute URL: '${href}'`);
          }

          if (lang !== "x-default" && !ACTIVE_LOCALES.includes(lang as (typeof ACTIVE_LOCALES)[number])) {
            pageErrors.push(`Inactive/unsupported locale '${lang}' found in hreflangs.`);
          }

          if (HREFLANG_FORBIDDEN_WORDS.some((word) => href.toLowerCase().includes(word))) {
            pageErrors.push(`Alternate link for '${lang}' contains forbidden word: '${href}'`);
          }
        }

        let matchedLang: string | null = null;
        for (const [lang, href] of Object.entries(alternates)) {
          if (lang !== "x-default" && remapUrlToBase(href, baseUrl) === localUrl) {
            matchedLang = lang;
            break;
          }
        }

        if (!matchedLang) {
          pageErrors.push(`Missing self-referencing hreflang tag. Page URL '${urlStr}' not found in alternates.`);
        }
      }

      if (pageErrors.length > 0) {
        errors[urlStr] = pageErrors;
        recorder.line(`FAIL ${urlStr}`);
        for (const issue of pageErrors) {
          recorder.line(`- ${issue}`);
        }
      } else {
        recorder.line(`OK   ${urlStr}`);
      }
    } catch (error) {
      pageErrors.push(`Error fetching/parsing page: ${error instanceof Error ? error.message : String(error)}`);
      errors[urlStr] = pageErrors;
      recorder.line(`ERROR ${urlStr}`);
      recorder.line(`- ${pageErrors[0]}`);
    }
  }

  const crawledLocalUrls = new Set<string>();
  for (const crawled of pageAlternates.keys()) {
    crawledLocalUrls.add(remapUrlToBase(crawled, baseUrl));
  }

  for (const [urlStr, alternates] of pageAlternates.entries()) {
    const pageErrors = errors[urlStr] || [];

    for (const [lang, href] of Object.entries(alternates)) {
      if (lang === "x-default") continue;

      const alternateLocalUrl = remapUrlToBase(href, baseUrl);
      if (!crawledLocalUrls.has(alternateLocalUrl)) {
        let failedUrl: string | null = null;
        for (const knownFailedUrl of Object.keys(errors)) {
          if (remapUrlToBase(knownFailedUrl, baseUrl) === alternateLocalUrl) {
            failedUrl = knownFailedUrl;
            break;
          }
        }

        if (failedUrl) {
          pageErrors.push(
            `Alternate target for '${lang}' (${href}) failed to crawl in phase 1: ${errors[failedUrl].join(", ")}`,
          );
        } else {
          pageErrors.push(`Alternate target for '${lang}' (${href}) is not part of crawled indexable URLs.`);
        }
      }

      let targetCrawledUrl: string | null = null;
      for (const crawled of pageAlternates.keys()) {
        if (remapUrlToBase(crawled, baseUrl) === alternateLocalUrl) {
          targetCrawledUrl = crawled;
          break;
        }
      }

      if (targetCrawledUrl) {
        const targetAlternates = pageAlternates.get(targetCrawledUrl);
        let backReferences = false;
        if (targetAlternates) {
          for (const [targetLang, targetHref] of Object.entries(targetAlternates)) {
            if (targetLang !== "x-default" && remapUrlToBase(targetHref, baseUrl) === remapUrlToBase(urlStr, baseUrl)) {
              backReferences = true;
              break;
            }
          }
        }

        if (!backReferences) {
          pageErrors.push(
            `Bidirectionality broken: this page points to '${href}' (${lang}), but that target page does not point back to this page.`,
          );
        }
      }
    }

    if (pageErrors.length > 0) {
      errors[urlStr] = pageErrors;
    }
  }

  const totalErrors = Object.keys(errors).length;
  if (totalErrors > 0) {
    throw new Error(`Hreflang errors found: ${totalErrors}`);
  }

  return {
    metrics: {
      urlsAudited: urlsToTest.length,
      pagesWithErrors: totalErrors,
    },
  };
}

async function auditCanonical(
  baseUrl: string,
  expectedSiteUrl: string,
  recorder: TaskRecorder,
): Promise<TaskSummary> {
  const urlsToTest = await loadIndexedUrls(baseUrl);
  const errors: Record<string, string[]> = {};

  for (const urlStr of urlsToTest) {
    const pageErrors: string[] = [];
    const localUrl = remapUrlToBase(urlStr, baseUrl);

    try {
      const urlObject = new URL(urlStr);
      const segments = urlObject.pathname.toLowerCase().split("/").filter(Boolean);
      const forbiddenWord = CANONICAL_FORBIDDEN_WORDS.find((word) => segments.includes(word));
      if (forbiddenWord) {
        pageErrors.push(`Sitemap URL contains forbidden word: ${forbiddenWord}`);
      }

      const { response, html } = await fetchHtml(encodeURI(decodeURI(localUrl)), TARGET_HEADERS);
      if (!response.ok) {
        pageErrors.push(`Page returned status code ${response.status}`);
        errors[urlStr] = pageErrors;
        recorder.line(`FAIL ${urlStr} -> HTTP ${response.status}`);
        continue;
      }

      const links = extractCanonicalLinks(html);
      const hrefRegex = /href=["']([^"']+)["']/i;

      if (links.length === 0) {
        pageErrors.push("Missing canonical tag on page.");
      } else if (links.length > 1) {
        pageErrors.push(`Multiple canonical tags found on page: ${links.length}`);
      } else {
        const canonicalTag = links[0];
        const hrefMatch = canonicalTag?.match(hrefRegex);
        if (!hrefMatch) {
          pageErrors.push(`Canonical tag has no href attribute: ${canonicalTag}`);
        } else {
          const canonicalUrlStr = hrefMatch[1];
          if (!canonicalUrlStr.startsWith("http://") && !canonicalUrlStr.startsWith("https://")) {
            pageErrors.push(`Canonical is not an absolute URL: '${canonicalUrlStr}'`);
          } else {
            try {
              const canonicalUrl = new URL(canonicalUrlStr);
              const expectedUrl = new URL(expectedSiteUrl);
              const pageUrl = new URL(urlStr);

              if (canonicalUrl.host !== expectedUrl.host) {
                pageErrors.push(
                  `Canonical domain '${canonicalUrl.host}' does not match expected domain '${expectedUrl.host}'`,
                );
              }
              if (canonicalUrl.protocol !== expectedUrl.protocol) {
                pageErrors.push(
                  `Canonical protocol '${canonicalUrl.protocol}' does not match expected protocol '${expectedUrl.protocol}'`,
                );
              }

              const canonicalPath = canonicalUrl.pathname.replace(/\/$/, "");
              const pagePath = pageUrl.pathname.replace(/\/$/, "");
              if (canonicalPath !== pagePath) {
                pageErrors.push(`Canonical path '${canonicalUrl.pathname}' does not match page path '${pageUrl.pathname}'`);
              }

              if (canonicalUrl.pathname !== "/" && !canonicalUrl.pathname.endsWith("/")) {
                pageErrors.push(`Canonical URL lacks trailing slash: '${canonicalUrlStr}'`);
              }

              if (canonicalUrl.search || canonicalUrl.hash) {
                pageErrors.push(`Canonical URL contains query parameters or hash: '${canonicalUrlStr}'`);
              }

              const canonicalLocale = getLocaleFromPath(canonicalUrl.pathname);
              const pageLocale = getLocaleFromPath(pageUrl.pathname);
              if (canonicalLocale !== pageLocale) {
                pageErrors.push(
                  `Language mismatch: canonical points to language '${canonicalLocale}' but page is '${pageLocale}'`,
                );
              }

              const canonicalLocalUrl = remapUrlToBase(canonicalUrlStr, baseUrl);
              const { response: canonicalResponse } = await fetchWithRetry(canonicalLocalUrl, {
                headers: TARGET_HEADERS,
              });
              if (!canonicalResponse.ok) {
                pageErrors.push(
                  `Canonical target '${canonicalUrlStr}' returned status code ${canonicalResponse.status} (local test: ${canonicalLocalUrl})`,
                );
              }
            } catch {
              pageErrors.push(`Failed to parse canonical URL: '${canonicalUrlStr}'`);
            }
          }
        }
      }

      if (pageErrors.length > 0) {
        errors[urlStr] = pageErrors;
        recorder.line(`FAIL ${urlStr}`);
        for (const issue of pageErrors) {
          recorder.line(`- ${issue}`);
        }
      } else {
        recorder.line(`OK   ${urlStr}`);
      }
    } catch (error) {
      pageErrors.push(`Error fetching/parsing page: ${error instanceof Error ? error.message : String(error)}`);
      errors[urlStr] = pageErrors;
      recorder.line(`ERROR ${urlStr}`);
      recorder.line(`- ${pageErrors[0]}`);
    }
  }

  const totalErrors = Object.keys(errors).length;
  if (totalErrors > 0) {
    throw new Error(`Canonical errors found: ${totalErrors}`);
  }

  return {
    metrics: {
      urlsAudited: urlsToTest.length,
      pagesWithErrors: totalErrors,
    },
  };
}

async function fetchSitemapUrlsForDebug(baseUrl: string, sitemapPath: string) {
  const url = absoluteUrl(baseUrl, sitemapPath);
  try {
    const xml = await fetchXml(url);
    return { urls: extractLocs(xml), warning: null as string | null };
  } catch (error) {
    return {
      urls: [] as string[],
      warning: `Errore durante il download di ${sitemapPath}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function debugSitemapCounts(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const warnings: string[] = [];
  const pages = await fetchSitemapUrlsForDebug(baseUrl, "/sitemap-pages.xml");
  const products = await fetchSitemapUrlsForDebug(baseUrl, "/sitemap-products.xml");
  const blog = await fetchSitemapUrlsForDebug(baseUrl, "/sitemap-blog.xml");

  for (const warning of [pages.warning, products.warning, blog.warning].filter(Boolean) as string[]) {
    warnings.push(warning);
    recorder.line(`WARN ${warning}`);
  }

  const pagesUrls = pages.urls;
  const productsUrls = products.urls;
  const blogUrls = blog.urls;
  const allUrls = [...pagesUrls, ...productsUrls, ...blogUrls];

  recorder.line(`sitemap-pages.xml    : ${pagesUrls.length}`);
  recorder.line(`sitemap-products.xml : ${productsUrls.length}`);
  recorder.line(`sitemap-blog.xml     : ${blogUrls.length}`);
  recorder.line(`Totale sitemap       : ${allUrls.length}`);
  recorder.line("");

  const countsByLocale: Record<string, number> = {};
  for (const locale of ACTIVE_LOCALES) {
    countsByLocale[locale] = 0;
  }

  for (const url of allUrls) {
    try {
      const pathParts = new URL(url).pathname.split("/").filter(Boolean);
      let locale = "it";
      if (pathParts.length > 0 && ACTIVE_LOCALES.includes(pathParts[0] as (typeof ACTIVE_LOCALES)[number]) && pathParts[0] !== "it") {
        locale = pathParts[0];
      }
      countsByLocale[locale] = (countsByLocale[locale] || 0) + 1;
    } catch {
      // ignored on purpose
    }
  }

  recorder.line("URL per lingua:");
  for (const [locale, count] of Object.entries(countsByLocale)) {
    recorder.line(`- ${locale}: ${count}`);
  }
  recorder.line("");

  const patternCounts = {
    shop: 0,
    blog: 0,
    others: 0,
  };

  for (const url of allUrls) {
    try {
      const pathname = new URL(url).pathname;
      if (
        pathname.includes("/shop") ||
        pathname.includes("/laden") ||
        pathname.includes("/winkel") ||
        pathname.includes("/butik") ||
        pathname.includes("/butikk")
      ) {
        patternCounts.shop += 1;
      } else if (pathname.includes("/blog") || pathname.includes("/categoria")) {
        patternCounts.blog += 1;
      } else {
        patternCounts.others += 1;
      }
    } catch {
      // ignored on purpose
    }
  }

  recorder.line("URL per pattern:");
  recorder.line(`- Shop/Prodotti: ${patternCounts.shop}`);
  recorder.line(`- Blog: ${patternCounts.blog}`);
  recorder.line(`- Altro: ${patternCounts.others}`);
  recorder.line("");

  const forbiddenWords = ["cart", "carrello", "checkout", "account", "login", "success", "api"];
  const testWords = ["test", "prova", "demo", "sandbox", "stripe", "payment"];
  let suspiciousCount = 0;

  for (const [sitemapName, sitemapUrls] of Object.entries({
    pages: pagesUrls,
    products: productsUrls,
    blog: blogUrls,
  })) {
    for (const url of sitemapUrls) {
      const pathSegments = new URL(url).pathname.toLowerCase().split("/").filter(Boolean);
      const forbidden = forbiddenWords.find((word) => pathSegments.includes(word));
      if (forbidden) {
        suspiciousCount += 1;
        recorder.line(`[${sitemapName}] URL proibito: ${url} (segmento ${forbidden})`);
      }

      const testToken = testWords.find((word) => pathSegments.some((segment) => segment.includes(word)));
      if (testToken) {
        suspiciousCount += 1;
        recorder.line(`[${sitemapName}] URL di test: ${url} (match ${testToken})`);
      }

      const pathname = new URL(url).pathname;
      if (pathname !== "/" && !pathname.endsWith("/")) {
        suspiciousCount += 1;
        recorder.line(`[${sitemapName}] manca trailing slash: ${url}`);
      }

      if (
        sitemapName === "blog" &&
        (pathname.includes("/shop") ||
          pathname.includes("/laden") ||
          pathname.includes("/winkel") ||
          pathname.includes("/butik") ||
          pathname.includes("/butikk"))
      ) {
        suspiciousCount += 1;
        recorder.line(`[${sitemapName}] prodotto nella sitemap blog: ${url}`);
      }

      if (sitemapName === "products" && (pathname.includes("/blog") || pathname.includes("/categoria"))) {
        suspiciousCount += 1;
        recorder.line(`[${sitemapName}] articolo blog nella sitemap prodotti: ${url}`);
      }
    }
  }

  const catalog = await readCatalog();
  const indexableProducts = catalog.filter((product) => product.excludeFromSeo !== true);
  const excludedProducts = catalog.filter((product) => product.excludeFromSeo === true);
  const expectedProductUrls = indexableProducts.length * ACTIVE_LOCALES.length;
  const productCountMismatch = productsUrls.length !== expectedProductUrls;

  recorder.line("");
  recorder.line("Dati sorgente locali:");
  recorder.line(`- Prodotti totali: ${catalog.length}`);
  recorder.line(`- Prodotti indicizzabili: ${indexableProducts.length}`);
  recorder.line(`- Prodotti esclusi SEO: ${excludedProducts.length}`);
  recorder.line(`- URL attese in sitemap-products.xml: ${expectedProductUrls}`);
  recorder.line(`- Articoli blog totali: ${mockBlogPosts.length}`);
  recorder.line(`- Categorie blog uniche: ${new Set(mockBlogPosts.map((post) => post.category)).size}`);

  if (productCountMismatch) {
    warnings.push(
      `Discrepanza sitemap-products.xml: trovate ${productsUrls.length} URL invece di ${expectedProductUrls}.`,
    );
    recorder.line(
      `WARN Discrepanza sitemap-products.xml: ${productsUrls.length} URL invece di ${expectedProductUrls}`,
    );
  }

  if (suspiciousCount > 0) {
    warnings.push(`Trovati ${suspiciousCount} URL sospetti nelle sitemap.`);
  }

  return {
    status: warnings.length > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      totalSitemapUrls: allUrls.length,
      suspiciousCount,
      excludedProducts: excludedProducts.length,
      expectedProductUrls,
      actualProductUrls: productsUrls.length,
      productCountMismatch,
    },
    warnings,
  };
}

async function compareSitemaps(
  sourceBaseUrl: string,
  targetBaseUrl: string,
  recorder: TaskRecorder,
  sourceSitemapUrls: string[],
): Promise<TaskSummary> {
  const localSitemapUrl = `${stripTrailingSlash(sourceBaseUrl)}/sitemap.xml`;

  recorder.line("WordPress live sitemaps:");
  for (const sitemapUrl of sourceSitemapUrls) {
    recorder.line(`- ${sitemapUrl}`);
  }
  recorder.line(`Local project sitemap: ${localSitemapUrl}`);
  recorder.line(`Diff limit: ${DIFF_LIMIT}`);
  recorder.line("");

  const [wordpressPathsRaw, localPathsRaw] = await Promise.all([
    collectExplicitSitemapPaths(sourceSitemapUrls, targetBaseUrl, recorder, "Live WordPress"),
    collectSitemapPaths(localSitemapUrl, sourceBaseUrl),
  ]);

  const wordpressPaths = [...new Set(wordpressPathsRaw)].sort((a, b) => a.localeCompare(b, "it"));
  const localPaths = [...new Set(localPathsRaw)].sort((a, b) => a.localeCompare(b, "it"));

  const wordpressSet = new Set(wordpressPaths);
  const localSet = new Set(localPaths);
  const onlyWordPress = wordpressPaths.filter((pathname) => !localSet.has(pathname));
  const onlyLocal = localPaths.filter((pathname) => !wordpressSet.has(pathname));
  const common = wordpressPaths.filter((pathname) => localSet.has(pathname));

  recorder.line("Riepilogo");
  recorder.line(`- URL WordPress live: ${wordpressPaths.length}`);
  recorder.line(`- URL progetto locale: ${localPaths.length}`);
  recorder.line(`- URL in comune: ${common.length}`);
  recorder.line(`- Solo WordPress live: ${onlyWordPress.length}`);
  recorder.line(`- Solo progetto locale: ${onlyLocal.length}`);
  recorder.line("");

  reportCategoryBreakdown(recorder, "Distribuzione solo WordPress live", onlyWordPress);
  recorder.line("");
  reportCategoryBreakdown(recorder, "Distribuzione solo progetto locale", onlyLocal);
  recorder.line("");

  printComparisonList(recorder, "Path presenti solo nel vecchio live WordPress", onlyWordPress);
  printComparisonList(recorder, "Path presenti solo nel nuovo progetto locale", onlyLocal);

  const warnings: string[] = [];
  if (onlyWordPress.length > 0) {
    warnings.push(`Il live WordPress ha ${onlyWordPress.length} path non presenti nel progetto locale.`);
  }
  if (onlyLocal.length > 0) {
    warnings.push(`Il progetto locale ha ${onlyLocal.length} path non presenti nel live WordPress.`);
  }

  return {
    status: warnings.length > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      wordpressLiveUrls: wordpressPaths.length,
      localProjectUrls: localPaths.length,
      commonUrls: common.length,
      onlyWordPress: onlyWordPress.length,
      onlyLocal: onlyLocal.length,
    },
    warnings,
  };
}

function dedupeOutcomeInputs(inputs: UrlOutcomeInput[]) {
  const seen = new Set<string>();
  const deduped: UrlOutcomeInput[] = [];

  for (const input of inputs) {
    const key = `${input.url}|${input.source || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(input);
  }

  return deduped;
}

function buildProjectOnlyMigrationOutcomes(
  localPaths: string[],
  wordpressPaths: string[],
  localBaseUrl: string,
) {
  const wordpressSet = new Set(wordpressPaths.map((pathname) => normalizePath(pathname)));
  return localPaths
    .map((pathname) => normalizePath(pathname))
    .filter((pathname) => !wordpressSet.has(pathname))
    .map(
      (pathname): MigrationOutcome => ({
        path: pathname,
        livePath: "",
        projectPath: pathname,
        classification: "PROJECT_ONLY_NEW_URL",
        localCheckUrl: pathToUrl(localBaseUrl, pathname),
        targetPath: pathname,
        localInitialStatus: 200,
        localFinalStatus: 200,
        redirectCount: 0,
        note: "Path presente solo nel nuovo progetto locale.",
      }),
    );
}

function classifyMissingLocalCoverage(
  oldPath: string,
  localFinalStatus: number | null,
): MigrationClassification {
  if (localFinalStatus === 404) {
    if (isWordPressTaxonomyPath(oldPath)) return "TAXONOMY_LEGACY_DECISION";
    if (isWordPressPortfolioPath(oldPath)) return "PORTFOLIO_LEGACY_DECISION";
    if (isWordPressProductPath(oldPath)) return "PRODUCT_LEGACY_DECISION";
    if (isTechnicalPath(oldPath)) return "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX";
    return "PAGE_LEGACY_DECISION";
  }

  if (isTechnicalPath(oldPath)) return "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX";
  return "NEEDS_LOCAL_REDIRECT_OR_410";
}

async function buildMigrationReadiness(
  livePaths: string[],
  localPaths: string[],
  localBaseUrl: string,
) {
  const localPathSet = new Set(localPaths.map((pathname) => normalizePath(pathname)));
  const normalizedLivePaths = uniqueStrings(livePaths.map((pathname) => normalizePath(pathname)));

  const liveOutcomes = await mapWithConcurrency(
    normalizedLivePaths,
    FETCH_CONCURRENCY,
    async (livePath): Promise<MigrationOutcome> => {
      if (localPathSet.has(livePath)) {
        return {
          path: livePath,
          livePath,
          projectPath: livePath,
          classification: "SAME_PATH_OK",
          localCheckUrl: pathToUrl(localBaseUrl, livePath),
          targetPath: livePath,
          localInitialStatus: 200,
          localFinalStatus: 200,
          redirectCount: 0,
          note: "Lo stesso path esiste nella sitemap locale.",
        };
      }

      try {
        const localCheckUrl = pathToUrl(localBaseUrl, livePath);
        const fetched = await fetchOutcome(localCheckUrl, 8);
        const initialStatus = fetched.redirectChain[0]?.status ?? fetched.response?.status ?? null;
        const finalStatus = fetched.response?.status ?? null;
        const finalPath = getUrlPath(fetched.finalUrl, localBaseUrl);
        const redirectType = getRedirectType(fetched.redirectChain.map((hop) => hop.status));

        if (
          fetched.redirectChain.length >= 1 &&
          redirectType === "permanent" &&
          finalStatus === 200
        ) {
          return {
            path: livePath,
            livePath,
            projectPath: "",
            classification: "COVERED_BY_LOCAL_REDIRECT",
            localCheckUrl,
            targetPath: finalPath,
            localInitialStatus: initialStatus,
            localFinalStatus: finalStatus,
            redirectCount: fetched.redirectChain.length,
            note: `Redirect permanente locale verso ${finalPath}.`,
          };
        }

        const classification = classifyMissingLocalCoverage(livePath, finalStatus);
        return {
          path: livePath,
          livePath,
          projectPath: "",
          classification,
          localCheckUrl,
          targetPath: finalPath,
          localInitialStatus: initialStatus,
          localFinalStatus: finalStatus,
          redirectCount: fetched.redirectChain.length,
          note:
            finalStatus === 404
              ? "Il vecchio path non e coperto sul progetto locale."
              : `Risposta locale ${finalStatus ?? "n/a"} da classificare per la migrazione.`,
        };
      } catch (error) {
        const localCheckUrl = pathToUrl(localBaseUrl, livePath);
        return {
          path: livePath,
          livePath,
          projectPath: "",
          classification: classifyMissingLocalCoverage(livePath, null),
          localCheckUrl,
          targetPath: "",
          localInitialStatus: null,
          localFinalStatus: null,
          redirectCount: 0,
          note: `Errore durante il test locale: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    },
  );

  return [
    ...liveOutcomes,
    ...buildProjectOnlyMigrationOutcomes(localPaths, normalizedLivePaths, localBaseUrl),
  ];
}

function printMigrationReadiness(recorder: TaskRecorder, outcomes: MigrationOutcome[]) {
  const counts: Record<MigrationClassification, number> = {
    SAME_PATH_OK: 0,
    COVERED_BY_LOCAL_REDIRECT: 0,
    NEEDS_LOCAL_REDIRECT_OR_410: 0,
    TECHNICAL_ROUTE_IGNORE_OR_NOINDEX: 0,
    TAXONOMY_LEGACY_DECISION: 0,
    PRODUCT_LEGACY_DECISION: 0,
    PORTFOLIO_LEGACY_DECISION: 0,
    PAGE_LEGACY_DECISION: 0,
    PROJECT_ONLY_NEW_URL: 0,
  };

  for (const outcome of outcomes) {
    counts[outcome.classification] += 1;
  }

  recorder.line("Local -> WordPress Migration Readiness");
  recorder.line(`- samePathOk count: ${counts.SAME_PATH_OK}`);
  recorder.line(`- coveredByLocalRedirect count: ${counts.COVERED_BY_LOCAL_REDIRECT}`);
  recorder.line(`- needsLocalRedirectOr410 count: ${counts.NEEDS_LOCAL_REDIRECT_OR_410}`);
  recorder.line(`- technicalRouteIgnore count: ${counts.TECHNICAL_ROUTE_IGNORE_OR_NOINDEX}`);
  recorder.line(`- taxonomyLegacyDecision count: ${counts.TAXONOMY_LEGACY_DECISION}`);
  recorder.line(`- productLegacyDecision count: ${counts.PRODUCT_LEGACY_DECISION}`);
  recorder.line(`- portfolioLegacyDecision count: ${counts.PORTFOLIO_LEGACY_DECISION}`);
  recorder.line(`- pageLegacyDecision count: ${counts.PAGE_LEGACY_DECISION}`);
  recorder.line(`- projectOnlyNewUrl count: ${counts.PROJECT_ONLY_NEW_URL}`);
  recorder.line("");

  const covered = outcomes.filter((outcome) =>
    outcome.classification === "SAME_PATH_OK" || outcome.classification === "COVERED_BY_LOCAL_REDIRECT"
  );
  const needsRedirect = outcomes.filter((outcome) =>
    outcome.classification === "NEEDS_LOCAL_REDIRECT_OR_410" || outcome.classification === "PAGE_LEGACY_DECISION"
  );
  const taxonomies = outcomes.filter((outcome) => outcome.classification === "TAXONOMY_LEGACY_DECISION");
  const products = outcomes.filter((outcome) => outcome.classification === "PRODUCT_LEGACY_DECISION");
  const portfolio = outcomes.filter((outcome) => outcome.classification === "PORTFOLIO_LEGACY_DECISION");
  const technical = outcomes.filter((outcome) => outcome.classification === "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX");
  const projectOnly = outcomes.filter((outcome) => outcome.classification === "PROJECT_ONLY_NEW_URL");

  printComparisonList(
    recorder,
    "Old live URLs already covered",
    covered.map((outcome) => `${outcome.livePath} -> ${outcome.targetPath || outcome.projectPath} [${outcome.classification}]`),
    OUTCOME_DETAIL_LIMIT,
  );
  printComparisonList(
    recorder,
    "Old live URLs needing redirect or 410",
    needsRedirect.map((outcome) => `${outcome.livePath} [${outcome.classification}] status=${outcome.localFinalStatus ?? "n/a"}`),
    OUTCOME_DETAIL_LIMIT,
  );
  printComparisonList(
    recorder,
    "Old WordPress taxonomies to decide",
    taxonomies.map((outcome) => outcome.livePath),
    OUTCOME_DETAIL_LIMIT,
  );
  printComparisonList(
    recorder,
    "Old WordPress products to decide",
    products.map((outcome) => outcome.livePath),
    OUTCOME_DETAIL_LIMIT,
  );
  printComparisonList(
    recorder,
    "Old WordPress portfolio items to decide",
    portfolio.map((outcome) => outcome.livePath),
    OUTCOME_DETAIL_LIMIT,
  );
  printComparisonList(
    recorder,
    "Technical old URLs ignored/noindex",
    technical.map((outcome) => outcome.livePath),
    OUTCOME_DETAIL_LIMIT,
  );
  printComparisonList(
    recorder,
    "New project-only URLs",
    projectOnly.map((outcome) => outcome.projectPath),
    OUTCOME_DETAIL_LIMIT,
  );
}

async function writeUrlOutcomeExports() {
  await fs.mkdir(path.dirname(URL_OUTCOMES_JSON_FILE), { recursive: true });
  await fs.writeFile(URL_OUTCOMES_JSON_FILE, JSON.stringify(urlOutcomes, null, 2) + "\n", "utf8");

  const csvHeaders = [
    "environment",
    "label",
    "source",
    "inputUrl",
    "inputPath",
    "initialStatus",
    "initialLocation",
    "finalUrl",
    "finalPath",
    "finalStatus",
    "redirectCount",
    "redirectType",
    "isInSitemapInitial",
    "isInSitemapFinal",
    "hasNoindex",
    "canonicalUrl",
    "classification",
    "attempts",
    "transientRecovered",
  ];

  const rows = urlOutcomes.map((outcome) =>
    [
      outcome.environment,
      outcome.label,
      outcome.source,
      outcome.inputUrl,
      outcome.inputPath,
      outcome.initialStatus ?? "",
      outcome.initialLocation,
      outcome.finalUrl,
      outcome.finalPath,
      outcome.finalStatus ?? "",
      outcome.redirectCount,
      outcome.redirectType,
      outcome.isInSitemapInitial,
      outcome.isInSitemapFinal,
      outcome.hasNoindex,
      outcome.canonicalUrl,
      outcome.classification,
      outcome.attempts,
      outcome.transientRecovered,
    ]
      .map(csvEscape)
      .join(","),
  );

  await fs.writeFile(URL_OUTCOMES_CSV_FILE, `${csvHeaders.join(",")}\n${rows.join("\n")}\n`, "utf8");
}

async function auditAllUrlOutcomes(recorder: TaskRecorder): Promise<TaskSummary> {
  urlOutcomes.length = 0;
  const localTarget = TARGETS.find((target) => target.id === "local") || TARGETS[0];
  const liveTarget = TARGETS.find((target) => target.id === "live-wordpress") || TARGETS[1];

  const [localSitemapUrls, liveSitemapUrls] = await Promise.all([
    collectProjectSitemapUrls(localTarget.baseUrl, recorder, "Local project"),
    collectExplicitSitemapUrls(WORDPRESS_SITEMAP_URLS, liveTarget.baseUrl, recorder, "Live WordPress"),
  ]);

  const localProjectPaths = uniqueStrings(localSitemapUrls.map((url) => getUrlPath(url, localTarget.baseUrl)));
  const livePaths = uniqueStrings(liveSitemapUrls.map((url) => getUrlPath(url, liveTarget.baseUrl)));
  migrationOutcomes = await buildMigrationReadiness(livePaths, localProjectPaths, localTarget.baseUrl);

  const legacyInputs = [...LEGACY_301_REDIRECTS.keys()].map((pathname) => ({
    url: pathname,
    source: "local-legacy-redirects",
  }));
  const technicalInputs = TECHNICAL_ROUTES.map((route) => ({
    url: route.path,
    source: "local-technical-routes",
  }));

  const localInputs = dedupeOutcomeInputs([
    ...localSitemapUrls.map((url) => ({ url, source: "local-project-sitemap" })),
    ...legacyInputs,
    ...technicalInputs,
  ]);
  const liveInputs = dedupeOutcomeInputs([
    ...liveSitemapUrls.map((url) => ({ url, source: "wordpress-current-sitemap" })),
  ]);

  const [localOutcomes, liveOutcomes] = await Promise.all([
    auditUrlOutcomes({
      environment: "local",
      label: "New Local Project",
      baseUrl: localTarget.baseUrl,
      urls: localInputs,
      sitemapUrls: localSitemapUrls,
      expectedCanonicalHost: localTarget.expectedSiteUrl,
    }),
    auditUrlOutcomes({
      environment: "live-wordpress",
      label: "Old Live WordPress",
      baseUrl: liveTarget.baseUrl,
      urls: liveInputs,
      sitemapUrls: liveSitemapUrls,
      expectedCanonicalHost: liveTarget.expectedSiteUrl,
    }),
  ]);

  const allOutcomes = [...localOutcomes, ...liveOutcomes];
  printOutcomeSummary(recorder, allOutcomes);
  printOutcomeGroups(recorder, allOutcomes);
  await writeUrlOutcomeExports();

  recorder.line("CSV/JSON export");
  recorder.line(`- ${URL_OUTCOMES_JSON_FILE}`);
  recorder.line(`- ${URL_OUTCOMES_CSV_FILE}`);

  const summary = summarizeOutcomes(allOutcomes);
  return {
    status: "passed_with_warnings",
    metrics: {
      totalAnalyzed: summary.total,
      localProjectUrls: summary.local,
      liveWordPressUrls: summary.liveWordPress,
      localSitemapErrors:
        (summary.byClassification.LOCAL_SITEMAP_404_ERROR || 0) +
        (summary.byClassification.LOCAL_SITEMAP_500_ERROR || 0) +
        (summary.byClassification.LOCAL_SITEMAP_REDIRECT_ERROR || 0) +
        (summary.byClassification.LOCAL_SITEMAP_NOINDEX_ERROR || 0),
      localRedirectWarnings: (summary.byClassification.LOCAL_REDIRECT_CHAIN_WARN || 0),
    },
    warnings: [
      "Il classifier usa solo `environment=local` e `environment=live-wordpress`.",
    ],
  };
}

async function auditWordPressLiveSitemaps(recorder: TaskRecorder): Promise<TaskSummary> {
  const liveTarget = TARGETS.find((target) => target.id === "live-wordpress") || TARGETS[1];
  const urls = await collectExplicitSitemapUrls(
    WORDPRESS_SITEMAP_URLS,
    liveTarget.baseUrl,
    recorder,
    "Live WordPress",
  );

  const counts = {
    technical: 0,
    taxonomy: 0,
    product: 0,
    portfolio: 0,
    page: 0,
  };

  for (const url of urls) {
    const path = getUrlPath(url, liveTarget.baseUrl);
    if (isTechnicalPath(path)) counts.technical += 1;
    else if (isWordPressTaxonomyPath(path)) counts.taxonomy += 1;
    else if (isWordPressProductPath(path)) counts.product += 1;
    else if (isWordPressPortfolioPath(path)) counts.portfolio += 1;
    else counts.page += 1;
  }

  recorder.line(`WordPress URL raccolte: ${urls.length}`);
  recorder.line(`- pagine: ${counts.page}`);
  recorder.line(`- prodotti: ${counts.product}`);
  recorder.line(`- portfolio: ${counts.portfolio}`);
  recorder.line(`- tassonomie: ${counts.taxonomy}`);
  recorder.line(`- tecniche: ${counts.technical}`);
  recorder.line("Il live delpasqua.com viene usato solo come inventario WordPress corrente.");

  return {
    status: "passed_with_warnings",
    metrics: {
      wordpressSitemapUrls: WORDPRESS_SITEMAP_URLS.length,
      collectedUrls: urls.length,
      pages: counts.page,
      products: counts.product,
      portfolio: counts.portfolio,
      taxonomies: counts.taxonomy,
      technical: counts.technical,
    },
    warnings: [
      "Diagnostica inventario WordPress: non vengono richieste sitemap Next sul dominio live.",
    ],
  };
}

async function migrationReadinessTask(recorder: TaskRecorder): Promise<TaskSummary> {
  printMigrationReadiness(recorder, migrationOutcomes);

  const counts = {
    samePathOk: migrationOutcomes.filter((outcome) => outcome.classification === "SAME_PATH_OK").length,
    coveredByLocalRedirect: migrationOutcomes.filter((outcome) => outcome.classification === "COVERED_BY_LOCAL_REDIRECT").length,
    needsLocalRedirectOr410: migrationOutcomes.filter((outcome) => outcome.classification === "NEEDS_LOCAL_REDIRECT_OR_410").length,
    technicalRouteIgnore: migrationOutcomes.filter((outcome) => outcome.classification === "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX").length,
    taxonomyLegacyDecision: migrationOutcomes.filter((outcome) => outcome.classification === "TAXONOMY_LEGACY_DECISION").length,
    productLegacyDecision: migrationOutcomes.filter((outcome) => outcome.classification === "PRODUCT_LEGACY_DECISION").length,
    portfolioLegacyDecision: migrationOutcomes.filter((outcome) => outcome.classification === "PORTFOLIO_LEGACY_DECISION").length,
    pageLegacyDecision: migrationOutcomes.filter((outcome) => outcome.classification === "PAGE_LEGACY_DECISION").length,
    projectOnlyNewUrl: migrationOutcomes.filter((outcome) => outcome.classification === "PROJECT_ONLY_NEW_URL").length,
  };

  return {
    status:
        counts.needsLocalRedirectOr410 > 0 ||
        counts.pageLegacyDecision > 0 ||
        counts.taxonomyLegacyDecision > 0 ||
        counts.productLegacyDecision > 0 ||
        counts.portfolioLegacyDecision > 0
      ? "passed_with_warnings"
      : "passed",
    metrics: counts,
    warnings:
      counts.needsLocalRedirectOr410 > 0 || counts.pageLegacyDecision > 0
      ? [
          `${counts.needsLocalRedirectOr410 + counts.pageLegacyDecision} URL live WordPress non risultano coperte dal progetto locale.`,
        ]
      : [],
  };
}

function resultById(results: TaskResult[], id: string) {
  return results.find((result) => result.id === id);
}

function compactError(error?: string) {
  if (!error) return "";
  return error.split("\n")[0]?.trim() || error.trim();
}

function buildWarningEntries(results: TaskResult[]) {
  const entries: Array<{
    task: string;
    severity: "critical" | "warning" | "info";
    environment: "local" | "live-wordpress" | "migration";
    cause: string;
    action: string;
  }> = [];

  const localTaskSeverities = new Map<string, "critical" | "warning">([
    ["local-audit-sitemap", "critical"],
    ["local-audit-legacy-routes", "critical"],
    ["local-audit-noindex", "critical"],
    ["local-audit-hreflang", "critical"],
    ["local-audit-canonical", "critical"],
    ["local-debug-sitemap-counts", "warning"],
    ["local-audit-locales", "warning"],
  ]);

  for (const [taskId, severity] of localTaskSeverities.entries()) {
    const result = resultById(results, taskId);
    if (!result || (result.status === "passed" && result.warnings.length === 0)) continue;

    entries.push({
      task: result.label,
      severity,
      environment: "local",
      cause: compactError(result.error) || result.warnings.join(" ") || "Il task locale ha segnalato un problema.",
      action:
        severity === "critical"
          ? "Correggere il comportamento su localhost prima del go-live."
          : "Verificare il dettaglio del task e confermare se il warning e atteso.",
    });
  }

  const localOutcomeGroups: Array<{
    classification: UrlClassification;
    severity: "critical" | "warning";
    cause: string;
    action: string;
  }> = [
    {
      classification: "LOCAL_SITEMAP_404_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale che restituiscono 404.",
      action: "Correggere la pagina o rimuovere la URL dalla sitemap locale.",
    },
    {
      classification: "LOCAL_SITEMAP_500_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale che restituiscono 500.",
      action: "Correggere l'errore applicativo prima del go-live.",
    },
    {
      classification: "LOCAL_SITEMAP_REDIRECT_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale che redirectano invece di rispondere 200.",
      action: "Pubblicare in sitemap solo URL canoniche finali.",
    },
    {
      classification: "LOCAL_SITEMAP_NOINDEX_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale marcate noindex.",
      action: "Rimuovere il noindex o togliere la URL dalla sitemap.",
    },
    {
      classification: "LOCAL_REDIRECT_TO_404_ERROR",
      severity: "critical",
      cause: "Redirect legacy locale che terminano su 404.",
      action: "Correggere il redirect o la destinazione finale.",
    },
    {
      classification: "LOCAL_REDIRECT_TO_500_ERROR",
      severity: "critical",
      cause: "Redirect legacy locale che terminano su 500.",
      action: "Correggere la destinazione finale o la logica di redirect.",
    },
    {
      classification: "LOCAL_TECHNICAL_IN_SITEMAP_ERROR",
      severity: "critical",
      cause: "Rotte tecniche locali presenti in sitemap.",
      action: "Escludere le rotte tecniche dalle sitemap locali.",
    },
    {
      classification: "LOCAL_TECHNICAL_MISSING_NOINDEX_ERROR",
      severity: "critical",
      cause: "Rotte tecniche locali senza noindex o con head SEO non pulita.",
      action: "Impostare noindex e rimuovere canonical/hreflang/og:url.",
    },
    {
      classification: "LOCAL_REDIRECT_CHAIN_WARN",
      severity: "warning",
      cause: "Redirect locale con chain > 1 o con 302/307.",
      action: "Ridurre a un solo hop 301/308 permanente verso la pagina finale.",
    },
    {
      classification: "LOCAL_TRANSIENT_FETCH_WARN",
      severity: "warning",
      cause: "Fetch locale con errore transitorio risolto al retry.",
      action: "Ricontrollare la stabilita del server locale se il warning si ripete.",
    },
  ];

  for (const group of localOutcomeGroups) {
    const matches = urlOutcomes.filter(
      (outcome) => outcome.environment === "local" && outcome.classification === group.classification,
    );
    if (matches.length === 0) continue;

    entries.push({
      task: "URL Outcome Classifier",
      severity: group.severity,
      environment: "local",
      cause: `${group.cause} Esempi: ${matches.slice(0, 3).map((outcome) => outcome.inputPath).join(", ")}`,
      action: group.action,
    });
  }

  if (urlOutcomes.some((outcome) => outcome.classification === "WP_CURRENT_TECHNICAL_ROUTE")) {
    entries.push({
      task: "Old WordPress inventory",
      severity: "info",
      environment: "live-wordpress",
      cause: "Il sito WordPress live espone URL tecniche nel proprio inventario corrente.",
      action: "Trattarle come old_site_issue/info, non come errore critico del nuovo progetto.",
    });
  }

  if (urlOutcomes.some((outcome) => outcome.classification === "WP_CURRENT_TAXONOMY")) {
    entries.push({
      task: "Old WordPress inventory",
      severity: "warning",
      environment: "live-wordpress",
      cause: "Il sito WordPress live contiene tassonomie legacy da valutare in migrazione.",
      action: "Decidere se mappare, consolidare o dismettere queste tassonomie.",
    });
  }

  const migrationGroups: Array<{
    classification: MigrationClassification;
    severity: "critical" | "warning" | "info";
    cause: string;
    action: string;
  }> = [
    {
      classification: "NEEDS_LOCAL_REDIRECT_OR_410",
      severity: "critical",
      cause: "Vecchi URL live WordPress senza copertura locale chiara.",
      action: "Aggiungere redirect locale o decidere un 410 esplicito.",
    },
    {
      classification: "PAGE_LEGACY_DECISION",
      severity: "critical",
      cause: "Vecchie pagine WordPress non coperte dal progetto locale.",
      action: "Mappare verso nuove URL pertinenti o decidere la dismissione controllata.",
    },
    {
      classification: "TAXONOMY_LEGACY_DECISION",
      severity: "warning",
      cause: "Tassonomie WordPress legacy da decidere.",
      action: "Stabilire se mantenere, consolidare o dismettere via redirect/410.",
    },
    {
      classification: "PRODUCT_LEGACY_DECISION",
      severity: "warning",
      cause: "Vecchi prodotti WordPress non ancora coperti da redirect locale.",
      action: "Mappare i prodotti legacy alle pagine prodotto nuove.",
    },
    {
      classification: "PORTFOLIO_LEGACY_DECISION",
      severity: "warning",
      cause: "Vecchi portfolio item WordPress da decidere.",
      action: "Mappare verso pagine equivalenti o gestire con redirect/410.",
    },
    {
      classification: "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX",
      severity: "info",
      cause: "Vecchie URL tecniche WordPress da ignorare o tenere noindex.",
      action: "Assicurarsi che sul progetto locale restino fuori sitemap e non indicizzabili.",
    },
    {
      classification: "PROJECT_ONLY_NEW_URL",
      severity: "info",
      cause: "URL presenti solo nel nuovo progetto locale.",
      action: "Nessuna azione se il contenuto e nuovo e intenzionale.",
    },
  ];

  for (const group of migrationGroups) {
    const matches = migrationOutcomes.filter((outcome) => outcome.classification === group.classification);
    if (matches.length === 0) continue;

    entries.push({
      task: "Migration Readiness",
      severity: group.severity,
      environment: "migration",
      cause: `${group.cause} Esempi: ${matches
        .slice(0, 3)
        .map((outcome) => outcome.path || outcome.livePath || outcome.projectPath)
        .join(", ")}`,
      action: group.action,
    });
  }

  return entries;
}

async function warningsExplainedTask(results: TaskResult[], recorder: TaskRecorder): Promise<TaskSummary> {
  const entries = buildWarningEntries(results);
  recorder.line("Warnings Explained");

  if (entries.length === 0) {
    recorder.line("Nessun warning/failure da spiegare.");
  }

  for (const entry of entries) {
    recorder.line(`task: ${entry.task}`);
    recorder.line(`severity: ${entry.severity}`);
    recorder.line(`environment: ${entry.environment}`);
    recorder.line(`cause: ${entry.cause}`);
    recorder.line(`action: ${entry.action}`);
    recorder.line("");
  }

  return {
    status: entries.length > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      explainedItems: entries.length,
    },
    warnings: entries.length > 0
      ? ["La sezione include warning, info e failure rilevanti per local, live-wordpress e migration."]
      : [],
  };
}

function buildGoLiveBlockers(results: TaskResult[]) {
  const blockers: GoLiveBlocker[] = [];
  const migrationByLivePath = new Map(
    migrationOutcomes
      .filter((outcome) => outcome.livePath)
      .map((outcome) => [normalizePath(outcome.livePath), outcome]),
  );
  const criticalLocalClasses = new Set<UrlClassification>([
    "LOCAL_SITEMAP_404_ERROR",
    "LOCAL_SITEMAP_500_ERROR",
    "LOCAL_SITEMAP_REDIRECT_ERROR",
    "LOCAL_SITEMAP_NOINDEX_ERROR",
    "LOCAL_REDIRECT_TO_404_ERROR",
    "LOCAL_REDIRECT_TO_500_ERROR",
    "LOCAL_TECHNICAL_IN_SITEMAP_ERROR",
    "LOCAL_TECHNICAL_MISSING_NOINDEX_ERROR",
  ]);

  for (const outcome of urlOutcomes) {
    if (outcome.environment === "local") {
      if (criticalLocalClasses.has(outcome.classification)) {
        blockers.push({
          blocker: outcome.inputPath,
          severity: "critical",
          environment: "local",
          why: `Classificazione ${outcome.classification}.`,
          action: "Correggere su localhost prima del go-live.",
        });
        continue;
      }

      if (outcome.classification === "LOCAL_REDIRECT_CHAIN_WARN") {
        blockers.push({
          blocker: outcome.inputPath,
          severity: "warning",
          environment: "local",
          why: "Redirect locale con chain > 1 o con redirect temporaneo.",
          action: "Ridurre a un solo hop permanente 301/308.",
        });
        continue;
      }

      if (outcome.classification === "LOCAL_TRANSIENT_FETCH_WARN") {
        blockers.push({
          blocker: outcome.inputPath,
          severity: "warning",
          environment: "local",
          why: "Errore transitorio risolto al retry durante l'audit locale.",
          action: "Ricontrollare la stabilita del server locale.",
        });
      }
      continue;
    }

    if (outcome.environment === "live-wordpress" && outcome.classification === "WP_CURRENT_TECHNICAL_ROUTE") {
      blockers.push({
        blocker: outcome.inputPath,
        severity: "info",
        environment: "live-wordpress",
        why: "Rotta tecnica presente nell'inventario WordPress corrente.",
        action: "Trattarla come problema del vecchio sito, non come blocker del nuovo progetto.",
      });
      continue;
    }

    if (outcome.environment === "live-wordpress" && outcome.classification === "WP_CURRENT_TAXONOMY") {
      const migrationOutcome = migrationByLivePath.get(normalizePath(outcome.inputPath));
      if (migrationOutcome?.classification === "COVERED_BY_LOCAL_REDIRECT") {
        blockers.push({
          blocker: outcome.inputPath,
          severity: "info",
          environment: "live-wordpress",
          why: "Tassonomia WordPress legacy gia coperta da redirect locale.",
          action: "Nessuna azione bloccante; verificare solo che la destinazione resti intenzionale.",
        });
        continue;
      }

      blockers.push({
        blocker: outcome.inputPath,
        severity: "warning",
        environment: "live-wordpress",
        why: "Tassonomia WordPress legacy nel sito corrente.",
        action: "Decidere la strategia di migrazione o dismissione.",
      });
    }
  }

  for (const result of results) {
    if (
      result.id === "local-audit-hreflang" ||
      result.id === "local-audit-canonical" ||
      result.id === "local-audit-sitemap" ||
      result.id === "local-audit-noindex"
    ) {
      if (result.status !== "passed") {
        blockers.push({
          blocker: result.label,
          severity: "critical",
          environment: "local",
          why: compactError(result.error) || result.warnings.join(" ") || "Task locale fallito.",
          action: "Correggere il task SEO locale prima del go-live.",
        });
      }
    }
  }

  for (const outcome of migrationOutcomes) {
    if (outcome.classification === "SAME_PATH_OK" || outcome.classification === "COVERED_BY_LOCAL_REDIRECT") {
      continue;
    }

    if (outcome.classification === "NEEDS_LOCAL_REDIRECT_OR_410" || outcome.classification === "PAGE_LEGACY_DECISION") {
      blockers.push({
        blocker: outcome.livePath,
        severity: "critical",
        environment: "migration",
        why: "Vecchio URL live importante non coperto dal progetto locale.",
        action: "Aggiungere redirect locale o decidere 410 prima del go-live.",
      });
      continue;
    }

    if (
      outcome.classification === "TAXONOMY_LEGACY_DECISION" ||
      outcome.classification === "PRODUCT_LEGACY_DECISION" ||
      outcome.classification === "PORTFOLIO_LEGACY_DECISION"
    ) {
      blockers.push({
        blocker: outcome.livePath,
        severity: "warning",
        environment: "migration",
        why: `Decisione legacy richiesta (${outcome.classification}).`,
        action: "Definire redirect, consolidamento o 410 in base al contenuto.",
      });
      continue;
    }

    if (outcome.classification === "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX") {
      blockers.push({
        blocker: outcome.livePath,
        severity: "info",
        environment: "migration",
        why: "Vecchia URL tecnica WordPress da ignorare o mantenere noindex.",
        action: "Confermare che sul progetto locale resti fuori sitemap e non indicizzabile.",
      });
      continue;
    }

    if (outcome.classification === "PROJECT_ONLY_NEW_URL") {
      blockers.push({
        blocker: outcome.projectPath,
        severity: "info",
        environment: "migration",
        why: "Nuova URL presente solo nel progetto locale.",
        action: "Nessuna azione se il contenuto e nuovo e intenzionale.",
      });
    }
  }

  return blockers;
}

async function goLiveBlockersTask(results: TaskResult[], recorder: TaskRecorder): Promise<TaskSummary> {
  const blockers = buildGoLiveBlockers(results);
  recorder.line("Go-live blockers");
  recorder.line("blocker | severity | environment | why | action");
  recorder.line("--- | --- | --- | --- | ---");

  for (const blocker of blockers.slice(0, OUTCOME_DETAIL_LIMIT * 2)) {
    recorder.line(
      `${blocker.blocker} | ${blocker.severity} | ${blocker.environment} | ${blocker.why} | ${blocker.action}`,
    );
  }
  if (blockers.length > OUTCOME_DETAIL_LIMIT * 2) {
    recorder.line(`... altri ${blockers.length - OUTCOME_DETAIL_LIMIT * 2} blocker non mostrati`);
  }

  return {
    status: blockers.some((blocker) => blocker.severity === "critical") ? "passed_with_warnings" : "passed",
    metrics: {
      totalBlockers: blockers.length,
      critical: blockers.filter((blocker) => blocker.severity === "critical").length,
      warning: blockers.filter((blocker) => blocker.severity === "warning").length,
      info: blockers.filter((blocker) => blocker.severity === "info").length,
    },
    warnings: blockers.some((blocker) => blocker.severity === "critical")
      ? ["Sono presenti blocker critical sul progetto locale o sulla migration readiness."]
      : [],
  };
}

async function ensureReportDir() {
  await fs.mkdir(path.dirname(REPORT_FILE), { recursive: true });
}

async function writeReport(results: TaskResult[], suiteStartedAt: string, suiteFinishedAt: string) {
  await ensureReportDir();

  const failed = results.filter((result) => result.status === "failed");
  const passedWithWarnings = results.filter((result) => result.status === "passed_with_warnings");
  const passed = results.filter((result) => result.status === "passed");

  const lines: string[] = [];
  lines.push(divider());
  lines.push("SEO Suite Report");
  lines.push(`Generated at: ${suiteFinishedAt}`);
  lines.push(`Started at:   ${suiteStartedAt}`);
  lines.push(`Report file:  ${REPORT_FILE}`);
  lines.push(divider());
  lines.push("");
  lines.push("Summary:");
  lines.push(`- Total tasks: ${results.length}`);
  lines.push(`- Passed: ${passed.length}`);
  lines.push(`- Passed with warnings: ${passedWithWarnings.length}`);
  lines.push(`- Failed: ${failed.length}`);
  lines.push("");

  const sections: Array<{ title: string; taskIds: string[] }> = [
    {
      title: "1. Local project health",
      taskIds: [
        "local-audit-locales",
        "local-audit-sitemap",
        "local-audit-legacy-routes",
        "local-audit-noindex",
        "local-audit-hreflang",
        "local-audit-canonical",
        "local-debug-sitemap-counts",
      ],
    },
    {
      title: "2. Old WordPress inventory",
      taskIds: ["live-wordpress-sitemap-diagnostic", "compare-local-wordpress-live"],
    },
    {
      title: "3. Local -> WordPress migration readiness",
      taskIds: ["migration-readiness"],
    },
    {
      title: "4. URL outcome groups",
      taskIds: ["url-outcome-classifier"],
    },
    {
      title: "5. Warnings explained",
      taskIds: ["warnings-explained"],
    },
    {
      title: "6. Go-live blockers",
      taskIds: ["go-live-blockers"],
    },
  ];

  for (const section of sections) {
    lines.push(divider());
    lines.push(section.title);
    lines.push(divider("-"));

    for (const taskId of section.taskIds) {
      const result = resultById(results, taskId);
      if (!result) continue;

      lines.push(divider());
      lines.push(result.label);
      lines.push(`Description: ${result.description}`);
      lines.push(`Status: ${result.status}`);
      lines.push(`Started at: ${result.startedAt}`);
      lines.push(`Finished at: ${result.finishedAt}`);

      if (Object.keys(result.context).length > 0) {
        lines.push("Context:");
        for (const [key, value] of Object.entries(result.context)) {
          lines.push(`- ${key}: ${value}`);
        }
      }

      if (Object.keys(result.metrics).length > 0) {
        lines.push("Metrics:");
        for (const [key, value] of Object.entries(result.metrics)) {
          lines.push(`- ${key}: ${String(value)}`);
        }
      }

      if (result.warnings.length > 0) {
        lines.push("Warnings:");
        for (const warning of result.warnings) {
          lines.push(`- ${warning}`);
        }
      }

      if (result.error) {
        lines.push("Error:");
        lines.push(result.error);
      }

      lines.push("Output:");
      lines.push(...result.output);
      lines.push("");
    }
  }

  await fs.writeFile(REPORT_FILE, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

async function assertNoVercelArtifacts() {
  const files = [REPORT_FILE, URL_OUTCOMES_CSV_FILE, URL_OUTCOMES_JSON_FILE];
  const violations: string[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const found = ANTI_VERCEL_TOKENS.filter((token) => content.includes(token));
    if (found.length > 0) {
      violations.push(`${file}: ${found.join(", ")}`);
    }
  }

  if (violations.length === 0) {
    return;
  }

  const errorBlock = [
    "",
    "INTERNAL_AUDIT_CONFIG_ERROR: Vercel must be ignored in this audit.",
    ...violations.map((violation) => `- ${violation}`),
    "",
  ].join("\n");

  await fs.appendFile(REPORT_FILE, errorBlock, "utf8");
  throw new Error("INTERNAL_AUDIT_CONFIG_ERROR: Vercel must be ignored in this audit.");
}

async function main() {
  const suiteStartedAt = timestamp();
  const results: TaskResult[] = [];

  console.log(divider());
  console.log("SEO Suite Runner");
  console.log(`Started at: ${suiteStartedAt}`);
  console.log(`TXT report:  ${REPORT_FILE}`);
  console.log(divider());
  console.log("");

  const localTarget = TARGETS.find((target) => target.id === "local");
  const liveWordPressTarget = TARGETS.find((target) => target.id === "live-wordpress");
  if (!localTarget || !liveWordPressTarget) {
    throw new Error("Configurazione target incompleta per local/live-wordpress.");
  }

  results.push(
    await runTask(
      {
        id: "local-audit-locales",
        label: `${localTarget.label} :: Locale audit`,
        description:
          "Controlla le pagine localizzate principali e segnala stringhe UI della lingua sbagliata.",
        context: {
          BASE_URL: localTarget.baseUrl,
        },
      },
      async (recorder) => auditLocales(localTarget.baseUrl, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "local-audit-sitemap",
        label: `${localTarget.label} :: Sitemap audit`,
        description:
          "Verifica indice sitemap, child sitemap, URL indicizzate, segmenti proibiti e homepage per locale.",
        context: {
          BASE_URL: localTarget.baseUrl,
        },
      },
      async (recorder) => auditSitemaps(localTarget.baseUrl, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "local-audit-legacy-routes",
        label: `${localTarget.label} :: Legacy routes audit`,
        description:
          "Controlla URL storiche, redirect 301/308 attesi e rotte tecniche che non devono entrare in sitemap.",
        context: {
          BASE_URL: localTarget.baseUrl,
        },
      },
      async (recorder) => auditLegacyRoutes(localTarget.baseUrl, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "local-audit-noindex",
        label: `${localTarget.label} :: Technical noindex audit`,
        description:
          "Verifica cart, checkout e account: noindex attivo, niente canonical/hreflang/og:url e niente sitemap.",
        context: {
          BASE_URL: localTarget.baseUrl,
        },
      },
      async (recorder) => auditTechnicalNoindex(localTarget.baseUrl, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "local-audit-hreflang",
        label: `${localTarget.label} :: Hreflang audit`,
        description:
          "Controlla tag hreflang, x-default, self reference, URL assolute e bidirezionalita delle alternate.",
        context: {
          BASE_URL: localTarget.baseUrl,
        },
      },
      async (recorder) => auditHreflang(localTarget.baseUrl, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "local-audit-canonical",
        label: `${localTarget.label} :: Canonical audit`,
        description:
          "Verifica canonical unica, assoluta, coerente con localhost, locale, trailing slash e status 200.",
        context: {
          BASE_URL: localTarget.baseUrl,
          EXPECTED_SITE_URL: localTarget.expectedSiteUrl,
        },
      },
      async (recorder) => auditCanonical(localTarget.baseUrl, localTarget.expectedSiteUrl, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "local-debug-sitemap-counts",
        label: `${localTarget.label} :: Sitemap counts debug`,
        description:
          "Confronta i conteggi delle sitemap con catalogo locale, post blog, pattern URL e possibili anomalie.",
        context: {
          BASE_URL: localTarget.baseUrl,
        },
      },
      async (recorder) => debugSitemapCounts(localTarget.baseUrl, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "live-wordpress-sitemap-diagnostic",
        label: `${liveWordPressTarget.label} :: Current sitemap diagnostic`,
        description:
          "Legge l'inventario URL del vecchio sito WordPress live tramite wp-sitemap.xml e child sitemap collegate.",
        context: {
          BASE_URL: liveWordPressTarget.baseUrl,
          WORDPRESS_SITEMAPS: WORDPRESS_SITEMAP_URLS.join(", "),
        },
      },
      async (recorder) => auditWordPressLiveSitemaps(recorder),
    ),
  );

  for (const comparisonTarget of COMPARISON_TARGETS) {
    results.push(
      await runTask(
        {
          id: comparisonTarget.id,
          label: comparisonTarget.label,
          description:
            "Confronta la sitemap del progetto locale con l'inventario URL corrente di WordPress live.",
          context: {
            SOURCE_BASE_URL: comparisonTarget.sourceBaseUrl,
            TARGET_BASE_URL: comparisonTarget.targetBaseUrl,
            TARGET_SITEMAP_URLS: comparisonTarget.sourceSitemapUrls.join(", "),
          },
        },
        async (recorder) =>
          compareSitemaps(
            comparisonTarget.sourceBaseUrl,
            comparisonTarget.targetBaseUrl,
            recorder,
            comparisonTarget.sourceSitemapUrls,
          ),
      ),
    );
  }

  results.push(
    await runTask(
      {
        id: "url-outcome-classifier",
        label: "URL Outcome Classifier",
        description:
          "Classifica solo gli ambienti local e live-wordpress usando sitemap locale, redirect legacy locali e inventario WordPress corrente.",
        context: {
          URL_OUTCOMES_JSON_FILE,
          URL_OUTCOMES_CSV_FILE,
        },
      },
      async (recorder) => auditAllUrlOutcomes(recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "migration-readiness",
        label: "Migration Readiness",
        description:
          "Valuta la copertura della migrazione confrontando WordPress live con il progetto locale e testando i vecchi path su localhost.",
        context: {
          LOCAL_BASE_URL: localTarget.baseUrl,
          LIVE_WORDPRESS_BASE_URL: liveWordPressTarget.baseUrl,
        },
      },
      async (recorder) => migrationReadinessTask(recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "warnings-explained",
        label: "Warnings Explained",
        description:
          "Spiega warning ed errori reali relativi a localhost, WordPress live diagnostico e readiness di migrazione.",
        context: {},
      },
      async (recorder) => warningsExplainedTask(results, recorder),
    ),
  );

  results.push(
    await runTask(
      {
        id: "go-live-blockers",
        label: "Go-live blockers",
        description:
          "Tabella finale con blocker, severity, environment, why e action basata solo su local, live-wordpress e migration.",
        context: {},
      },
      async (recorder) => goLiveBlockersTask(results, recorder),
    ),
  );

  const suiteFinishedAt = timestamp();
  await writeReport(results, suiteStartedAt, suiteFinishedAt);
  await assertNoVercelArtifacts();

  const failedCount = results.filter((result) => result.status === "failed").length;
  console.log(divider());
  console.log("Final summary");
  console.log(`- Total tasks: ${results.length}`);
  console.log(`- Failed: ${failedCount}`);
  console.log(`- TXT report: ${REPORT_FILE}`);
  console.log(divider());

  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch(async (error) => {
  const fatalMessage = error instanceof Error ? error.stack || error.message : String(error);
  await ensureReportDir();
  await fs.writeFile(
    REPORT_FILE,
    `SEO Suite fatal error\nGenerated at: ${timestamp()}\n\n${fatalMessage}\n`,
    "utf8",
  );
  console.error(fatalMessage);
  process.exit(1);
});
