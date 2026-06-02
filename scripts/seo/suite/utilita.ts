/**
 * NOME FILE: utilita.ts (ex utils.ts)
 * SCOPO: Fornisce funzioni di supporto riusabili e un client HTTP resiliente con retry,
 *        usati per la scansione delle sitemap, le richieste HTTP e il tracciamento dei redirect.
 * UTILIZZO: Importato dai vari moduli della suite SEO (verifiche.ts, costanti.ts, reportistica.ts).
 */

import fs from "node:fs/promises";

import {
  XML_HEADERS,
  HTML_HEADERS,
  ACTIVE_LOCALES,
  DIFF_LIMIT,
  OUTCOME_DETAIL_LIMIT,
  FETCH_CONCURRENCY,
  FETCH_TIMEOUT_MS,
  MAX_FETCH_RETRIES,
  RETRYABLE_STATUS_CODES,
  LOCAL_CHILD_SITEMAP_PATHS,
  TECHNICAL_PATH_SEGMENTS,
  TECHNICAL_ROUTES,
  REPORT_FILE,
} from "./costanti";
import type {
  TaskStatus,
  TaskResult,
  TaskSummary,
  UrlClassification,
  RedirectType,
  UrlOutcomeInput,
  UrlOutcome,
  Environment,
} from "./tipi";

export class TaskRecorder {
  readonly lines: string[] = [];

  line(value = "") {
    this.lines.push(value);
    console.log(value);
  }
}

export function divider(char = "=", length = 88) {
  return char.repeat(length);
}

export function timestamp() {
  return new Date().toISOString();
}

export function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function absoluteUrl(baseUrl: string, pathname: string) {
  return new URL(pathname, baseUrl).toString();
}

export function remapUrlToBase(urlStr: string, baseUrl: string) {
  const source = new URL(urlStr, baseUrl);
  const base = new URL(baseUrl);
  source.protocol = base.protocol;
  source.host = base.host;
  return source.toString();
}

export function normalizePath(value: string, baseUrl = "http://localhost") {
  const url = new URL(value, baseUrl);
  const pathname = url.pathname || "/";
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "/");
}

export function normalizeComparablePath(urlStr: string) {
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

export function getUrlPath(urlStr: string, baseUrl = "http://localhost:3000") {
  try {
    return normalizeComparablePath(new URL(urlStr, baseUrl).toString());
  } catch {
    return urlStr.startsWith("/") ? normalizePath(urlStr) : urlStr;
  }
}

export function pathToUrl(baseUrl: string, pathname: string) {
  return new URL(pathname, baseUrl).toString();
}

export function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function normalizeUrlInput(input: string | UrlOutcomeInput): UrlOutcomeInput {
  return typeof input === "string" ? { url: input } : input;
}

export function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function extractLocs(xml: string) {
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  const urls: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

export function decodeHtml(html: string) {
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

export function extractVisibleText(html: string) {
  let clean = html
    .replace(/<head[^>]*>([\s\S]*?)<\/head>/gi, "")
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, "")
    .replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, "");

  clean = clean.replace(/<[^>]+>/g, " ");
  return decodeHtml(clean).replace(/\s+/g, " ").trim();
}

export function extractAttributes(html: string) {
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

export function getLocaleFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const firstSegment = parts[0];
  return ACTIVE_LOCALES.includes(firstSegment as (typeof ACTIVE_LOCALES)[number])
    ? firstSegment
    : "it";
}

export function extractHeadInfo(html: string) {
  return {
    noindex: /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html),
    canonical: /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html),
    hreflang: /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/i.test(html),
    ogUrl: /<meta\s+[^>]*(property|name)=["']og:url["'][^>]*>/i.test(html),
    htmlLang: (html.match(/<html[^>]*lang=["']([^"']+)["']/i) || [])[1] || "",
  };
}

export function extractAlternateLinks(html: string) {
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

export function extractCanonicalLinks(html: string) {
  const canonicalRegex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi;
  return html.match(canonicalRegex) || [];
}

export function extractCanonicalUrl(html: string) {
  const canonicalTag = extractCanonicalLinks(html)[0];
  if (!canonicalTag) return "";
  return (canonicalTag.match(/href=["']([^"']+)["']/i) || [])[1] || "";
}

export function hasRobotsNoindex(html: string) {
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html);
}

export function isRedirectStatus(status: number) {
  return status >= 300 && status < 400;
}

export function isPermanentRedirect(status: number) {
  return status === 301 || status === 308;
}

export function isTemporaryRedirect(status: number) {
  return status === 302 || status === 307;
}

export function pathIsEnglish(pathname: string) {
  return normalizePath(pathname).startsWith("/en/");
}

export function isTechnicalPath(pathname: string) {
  const segments = pathname.toLowerCase().split("/").filter(Boolean);
  return segments.some((segment) => TECHNICAL_PATH_SEGMENTS.has(segment));
}

export function isWordPressTaxonomyPath(pathname: string) {
  return (
    pathname.includes("/portfolio-category/") ||
    pathname.includes("/portfolio-tag/") ||
    pathname.includes("/product-category/")
  );
}

export function isWordPressPortfolioPath(pathname: string) {
  return pathname.includes("/portfolio-item/");
}

export function isWordPressProductPath(pathname: string) {
  return pathname.includes("/product/");
}

export function isUnexpectedIndexablePath(pathname: string) {
  return isTechnicalPath(pathname) || isWordPressTaxonomyPath(pathname);
}

export function getRedirectType(statuses: number[]): RedirectType {
  if (statuses.length === 0) return "none";
  const hasPermanent = statuses.some(isPermanentRedirect);
  const hasTemporary = statuses.some(isTemporaryRedirect);
  if (hasPermanent && hasTemporary) return "mixed";
  if (hasTemporary) return "temporary";
  if (hasPermanent) return "permanent";
  return "mixed";
}

export function formatTrace(trace: {
  hops: Array<{ status: number; location: string | null }>;
  finalPath: string;
  finalStatus: number;
}) {
  const first = trace.hops[0];
  return `status=${first?.status ?? "?"} location=${first?.location ?? "-"} final=${trace.finalPath} finalStatus=${trace.finalStatus}`;
}

export function summarizeMetrics(metrics: Record<string, string | number | boolean>) {
  return Object.entries(metrics).map(([key, value]) => `${key}=${String(value)}`);
}

export function isRetryableStatus(status: number | null | undefined) {
  return status !== null && status !== undefined && RETRYABLE_STATUS_CODES.has(status);
}

export async function mapWithConcurrency<T, TResult>(
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

export async function fetchWithRetry(url: string, init?: RequestInit) {
  let attempts = 0;
  let hadRetryableFailure = false;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_FETCH_RETRIES; attempt += 1) {
    attempts += 1;

    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      } as any);

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

export function categorizePath(pathname: string) {
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

export async function fetchText(url: string, init?: RequestInit) {
  const { response, attempts, transientRecovered } = await fetchWithRetry(url, init);
  return {
    response,
    text: await response.text(),
    attempts,
    transientRecovered,
  };
}

export async function fetchXml(url: string) {
  const { response, text } = await fetchText(url, {
    headers: XML_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching XML ${url}`);
  }

  return text;
}

export async function fetchHtml(url: string, headers: HeadersInit = HTML_HEADERS) {
  const { response, text, attempts, transientRecovered } = await fetchText(url, {
    headers,
  });

  return { response, html: text, attempts, transientRecovered };
}

export async function fetchManual(baseUrl: string, pathname: string, headers: HeadersInit = HTML_HEADERS) {
  return fetchWithRetry(absoluteUrl(baseUrl, pathname), {
    headers,
    redirect: "manual",
  });
}

export async function loadIndexedUrls(baseUrl: string) {
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

export async function loadSitemapPathSet(baseUrl: string) {
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

export async function traceRequest(baseUrl: string, startPath: string, maxRedirects = 5) {
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

export function printComparisonList(
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

export function reportCategoryBreakdown(recorder: TaskRecorder, label: string, paths: string[]) {
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

export async function collectSitemapPaths(entryUrl: string, baseUrl: string, seen = new Set<string>()) {
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

export async function collectRecursiveSitemapUrls(
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

export async function collectExplicitSitemapPaths(
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

export async function collectExplicitSitemapUrls(
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

export async function collectProjectSitemapUrls(baseUrl: string, recorder: TaskRecorder, label: string) {
  try {
    return await loadIndexedUrls(baseUrl);
  } catch (error) {
    recorder.line(`WARN ${label} sitemap progetto non scaricabile: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

export async function runTask(
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

export async function fetchOutcome(inputUrl: string, maxRedirects = 8) {
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
    response = fetched.response as any;
    attempts += fetched.attempts;
    transientRecovered = transientRecovered || fetched.transientRecovered;
    contentType = response!.headers.get("content-type") || "";
    const location = response!.headers.get("location") || "";

    if (!isRedirectStatus(response!.status)) {
      if (response!.status !== 204) {
        html = await response!.text();
      }
      break;
    }

    redirectChain.push({ url: currentUrl, status: response!.status, location });
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

export function classifyLocalOutcome(outcome: Omit<UrlOutcome, "classification">): UrlClassification {
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

export function classifyWordPressOutcome(outcome: Omit<UrlOutcome, "classification">): UrlClassification {
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

export function classifyUrlOutcome(outcome: Omit<UrlOutcome, "classification">): UrlClassification {
  return outcome.environment === "local"
    ? classifyLocalOutcome(outcome)
    : classifyWordPressOutcome(outcome);
}

export const globalUrlOutcomes: UrlOutcome[] = [];

export async function auditUrlOutcomes({
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

  let completed = 0;
  const outcomes = await mapWithConcurrency(
    normalizedInputs,
    FETCH_CONCURRENCY,
    async (input): Promise<UrlOutcome> => {
      const inputUrl = input.url.startsWith("http://") || input.url.startsWith("https://")
        ? input.url
        : pathToUrl(baseUrl, input.url);
      const inputPath = getUrlPath(inputUrl, baseUrl);
      const emptyOutcome: UrlOutcome = {
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
        redirectType: "none",
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
        classification: "LOCAL_FETCH_ERROR", // temporary placeholder
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
      } finally {
        completed += 1;
        if (completed % 50 === 0 || completed === normalizedInputs.length) {
          console.log(`[URL Outcomes Classifier] Progress: processed ${completed}/${normalizedInputs.length} URLs...`);
        }
      }
    },
  );

  globalUrlOutcomes.push(...outcomes);
  return outcomes;
}

export function summarizeOutcomes(outcomes: UrlOutcome[]) {
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

export function printOutcomeSummary(recorder: TaskRecorder, outcomes: UrlOutcome[]) {
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

export function printOutcomeGroups(recorder: TaskRecorder, outcomes: UrlOutcome[]) {
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
