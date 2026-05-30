import fs from "node:fs/promises";
import { mockBlogPosts } from "../../src/lib/blog-data";
import { readCatalog } from "../../src/lib/server/catalog";
import {
  ACTIVE_LOCALES,
  LOCALE_ROUTE_MAPS,
  LOCALE_FORBIDDEN_WORDS,
  DIRECT_200_PATHS,
  LEGACY_301_REDIRECTS,
  LEGACY_TECHNICAL_PATHS,
  TECHNICAL_ROUTES,
  HREFLANG_FORBIDDEN_WORDS,
  CANONICAL_FORBIDDEN_WORDS,
  INDEXED_WORDPRESS_URLS,
  URL_OUTCOMES_JSON_FILE,
  URL_OUTCOMES_CSV_FILE,
  WORDPRESS_SITEMAP_URLS,
  FETCH_CONCURRENCY,
} from "./constants";
import type {
  TaskSummary,
  TaskResult,
  MigrationOutcome,
  MigrationClassification,
  UrlClassification,
} from "./types";
import {
  TaskRecorder,
  absoluteUrl,
  fetchHtml,
  extractVisibleText,
  extractAttributes,
  getLocaleFromPath,
  fetchXml,
  extractLocs,
  normalizePath,
  traceRequest,
  isRedirectStatus,
  isPermanentRedirect,
  formatTrace,
  pathIsEnglish,
  isWordPressTaxonomyPath,
  isTechnicalPath,
  isWordPressProductPath,
  isWordPressPortfolioPath,
  printComparisonList,
  reportCategoryBreakdown,
  collectExplicitSitemapPaths,
  collectExplicitSitemapUrls,
  collectProjectSitemapUrls,
  auditUrlOutcomes,
  globalUrlOutcomes,
  printOutcomeSummary,
  printOutcomeGroups,
  loadSitemapPathSet,
  loadIndexedUrls,
  getUrlPath,
  categorizePath,
  uniqueStrings,
  csvEscape,
  remapUrlToBase,
  extractAlternateLinks,
  mapWithConcurrency,
} from "./utils";

// ----------------------------------------------------------------------------
// 1. LOCALE AUDIT
// ----------------------------------------------------------------------------
export async function auditLocales(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  let failures = 0;

  for (const [route, localeMap] of Object.entries(LOCALE_ROUTE_MAPS)) {
    recorder.line(`Checking route: ${route}`);
    for (const [locale, pathname] of Object.entries(localeMap)) {
      try {
        const url = absoluteUrl(baseUrl, pathname);
        const { html, transientRecovered } = await fetchHtml(url);
        const visibleText = extractVisibleText(html).toLowerCase();
        const attributes = extractAttributes(html).join(" ").toLowerCase();
        const fullText = `${visibleText} ${attributes}`;
        const activeLocale = getLocaleFromPath(pathname);

        let ok = true;
        const matchedForbidden: string[] = [];

        if (activeLocale === "it") {
          for (const word of LOCALE_FORBIDDEN_WORDS.en_words) {
            if (fullText.includes(word)) {
              ok = false;
              matchedForbidden.push(word);
            }
          }
        } else if (activeLocale === "en") {
          for (const word of LOCALE_FORBIDDEN_WORDS.it_words) {
            if (fullText.includes(word)) {
              ok = false;
              matchedForbidden.push(word);
            }
          }
        }

        recorder.line(
          `${ok ? "OK  " : "WARN"} [${locale}] ${pathname} -> languageDetected=${activeLocale} transientRecovered=${transientRecovered}`
        );

        if (!ok) {
          failures += 1;
          recorder.line(`  Matched forbidden words: ${matchedForbidden.join(", ")}`);
        }
      } catch (error) {
        failures += 1;
        recorder.line(`  ERROR ${pathname}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    recorder.line("");
  }

  if (failures > 0) {
    recorder.line(`Locale audit finished with ${failures} warnings.`);
  }

  return {
    status: failures > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      routesChecked: Object.keys(LOCALE_ROUTE_MAPS).length * ACTIVE_LOCALES.length,
      warnings: failures,
    },
    warnings: failures > 0 ? [`${failures} locale mismatches found during text analysis.`] : [],
  };
}

// ----------------------------------------------------------------------------
// 2. SITEMAP AUDIT
// ----------------------------------------------------------------------------
export async function auditSitemaps(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  let failures = 0;
  const warningsList: string[] = [];

  try {
    const indexXml = await fetchXml(absoluteUrl(baseUrl, "/sitemap.xml"));
    const sitemapUrls = extractLocs(indexXml);
    recorder.line(`Sitemap index: found ${sitemapUrls.length} child sitemaps.`);

    if (sitemapUrls.length === 0) {
      failures += 1;
      warningsList.push("Sitemap index has zero child sitemaps.");
    }

    const sitemapPathSet = new Set<string>();

    for (const sitemapUrl of sitemapUrls) {
      const xml = await fetchXml(sitemapUrl);
      const locs = extractLocs(xml);
      recorder.line(`Child sitemap ${sitemapUrl}: found ${locs.length} URLs.`);

      if (locs.length === 0) {
        failures += 1;
        warningsList.push(`Child sitemap ${sitemapUrl} has zero URLs.`);
      }

      for (const loc of locs) {
        const pathname = normalizePath(loc);
        sitemapPathSet.add(pathname);

        // Check for forbidden segments in URLs
        if (
          pathname.includes("cart") ||
          pathname.includes("carrello") ||
          pathname.includes("checkout") ||
          pathname.includes("account") ||
          pathname.includes("my-account")
        ) {
          failures += 1;
          warningsList.push(`Sitemap URL contains forbidden technical segment: ${pathname}`);
        }
      }
    }

    // Verify sitemap has homepage for each locale
    for (const locale of ACTIVE_LOCALES) {
      const expectedPath = locale === "it" ? "/" : `/` + locale + `/`;
      if (!sitemapPathSet.has(expectedPath)) {
        failures += 1;
        warningsList.push(`Sitemap is missing homepage for locale [${locale}] (expected: ${expectedPath})`);
      }
    }
  } catch (error) {
    failures += 1;
    warningsList.push(`Sitemap audit critical failure: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    status: failures > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      failures,
    },
    warnings: warningsList,
  };
}

// ----------------------------------------------------------------------------
// 3. LEGACY ROUTES AUDIT (WITH NEW 42 INDEXED URLS CHECK!)
// ----------------------------------------------------------------------------
export async function auditLegacyRoutes(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const sitemapPaths = await loadSitemapPathSet(baseUrl);
  let failures = 0;
  const warningsList: string[] = [];

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
        warningsList.push(`Direct URL failed: ${pathname} lands on status ${trace.finalStatus}`);
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${pathname} ${error instanceof Error ? error.message : String(error)}`);
      warningsList.push(`Direct URL fetch error: ${pathname} -> ${error instanceof Error ? error.message : String(error)}`);
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
        warningsList.push(`Legacy redirect mismatch: ${sourcePath} -> expected ${expectedDestination}, got ${trace.finalPath} (status ${trace.finalStatus})`);
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${sourcePath} ${error instanceof Error ? error.message : String(error)}`);
      warningsList.push(`Legacy redirect fetch error: ${sourcePath} -> ${error instanceof Error ? error.message : String(error)}`);
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
        `${ok ? "OK  " : "FAIL"} ${pathname} ${formatTrace(trace)} redirects=${redirectCount} initialInSitemap=${initialInSitemap} finalInSitemap=${finalInSitemap} noindex=${trace.robotsNoindex}`
      );
      if (!ok) {
        failures += 1;
        warningsList.push(`Technical path SEO error: ${pathname}`);
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${pathname} ${error instanceof Error ? error.message : String(error)}`);
      warningsList.push(`Technical path fetch error: ${pathname} -> ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  recorder.line("");
  recorder.line(`Checking 42 Indexed WordPress URLs in Next.js (${INDEXED_WORDPRESS_URLS.length})`);
  for (const urlStr of INDEXED_WORDPRESS_URLS) {
    try {
      const prodUrl = new URL(urlStr);
      const pathname = prodUrl.pathname + prodUrl.search;

      const trace = await traceRequest(baseUrl, pathname, 3);
      const firstHop = trace.hops[0];
      const isRedirect = trace.hops.length > 1;

      let ok = true;
      let note = "";

      if (isRedirect && firstHop) {
        if (!isPermanentRedirect(firstHop.status)) {
          ok = false;
          note += `Non-permanent redirect (${firstHop.status}); `;
        }
      }

      if (trace.finalStatus !== 200) {
        ok = false;
        note += `Final status is ${trace.finalStatus} (expected 200); `;
      }

      const wasEnglish = urlStr.includes("/en/");
      const landsInEnglish = pathIsEnglish(trace.finalPath);
      if (wasEnglish && !landsInEnglish) {
        ok = false;
        note += "English legacy page did not land on English local page; ";
      }

      recorder.line(
        `${ok ? "OK  " : "FAIL"} ${pathname} ${formatTrace(trace)} wasEnglish=${wasEnglish} landsInEnglish=${landsInEnglish} hops=${trace.hops.length} ${note}`
      );
      if (!ok) {
        failures += 1;
        warningsList.push(`Indexed SEO URL failed: ${pathname} -> finalPath=${trace.finalPath} (status=${trace.finalStatus}) [${note.trim()}]`);
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${urlStr} ${error instanceof Error ? error.message : String(error)}`);
      warningsList.push(`Indexed SEO URL fetch error: ${urlStr} -> ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures > 0) {
    throw new Error(`Legacy route and indexed URLs failures found: ${failures}`);
  }

  return {
    metrics: {
      direct200Paths: DIRECT_200_PATHS.length,
      legacyRedirects: LEGACY_301_REDIRECTS.size,
      technicalPaths: LEGACY_TECHNICAL_PATHS.length,
      indexedUrlsChecked: INDEXED_WORDPRESS_URLS.length,
      failures,
    },
  };
}

// ----------------------------------------------------------------------------
// 4. TECHNICAL NOINDEX AUDIT
// ----------------------------------------------------------------------------
export async function auditTechnicalNoindex(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const sitemapPaths = await loadSitemapPathSet(baseUrl);
  let failures = 0;
  const warningsList: string[] = [];

  recorder.line(`Checking technical routes (${TECHNICAL_ROUTES.length})`);
  for (const route of TECHNICAL_ROUTES) {
    try {
      const trace = await traceRequest(baseUrl, route.path, 2);
      const isHtml = trace.html.length > 0;
      const initialInSitemap = sitemapPaths.has(normalizePath(route.path));
      const finalInSitemap = sitemapPaths.has(normalizePath(trace.finalPath));

      let ok = true;
      let note = "";

      if (trace.finalStatus !== 200) {
        ok = false;
        note += `Status ${trace.finalStatus} (expected 200); `;
      }

      if (initialInSitemap || finalInSitemap) {
        ok = false;
        note += "Found in sitemap; ";
      }

      if (isHtml) {
        if (!trace.robotsNoindex) {
          ok = false;
          note += "Missing robots noindex meta; ";
        }
        if (trace.head?.canonical) {
          ok = false;
          note += "Should not have canonical; ";
        }
        if (trace.head?.hreflang) {
          ok = false;
          note += "Should not have hreflang alternate; ";
        }
        if (trace.head?.ogUrl) {
          ok = false;
          note += "Should not have og:url; ";
        }
      }

      recorder.line(`${ok ? "OK  " : "FAIL"} ${route.path} -> ${trace.finalPath} (status=${trace.finalStatus}) [${note.trim()}]`);
      if (!ok) {
        failures += 1;
        warningsList.push(`Technical route SEO leakage: ${route.path} [${note.trim()}]`);
      }
    } catch (error) {
      failures += 1;
      recorder.line(`ERROR ${route.path} ${error instanceof Error ? error.message : String(error)}`);
      warningsList.push(`Technical route fetch error: ${route.path} -> ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures > 0) {
    throw new Error(`Technical noindex audit failed with ${failures} leakages.`);
  }

  return {
    metrics: {
      technicalRoutesChecked: TECHNICAL_ROUTES.length,
      leakages: failures,
    },
  };
}

// ----------------------------------------------------------------------------
// 5. HREFLANG AUDIT
// ----------------------------------------------------------------------------
export async function auditHreflang(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const indexXml = await fetchXml(absoluteUrl(baseUrl, "/sitemap.xml"));
  const childSitemaps = extractLocs(indexXml);
  const allUrls: string[] = [];

  for (const sitemapUrl of childSitemaps) {
    const remapped = remapUrlToBase(sitemapUrl, baseUrl);
    const xml = await fetchXml(remapped);
    allUrls.push(...extractLocs(xml));
  }

  const uniqueUrls = uniqueStrings(allUrls);
  recorder.line(`Loaded ${uniqueUrls.length} unique sitemap URLs to check for hreflang.`);

  let failures = 0;
  const warningsList: string[] = [];

  // Parse page headers and find alternates
  const urlHeadersMap = new Map<string, { hreflang: Record<string, string>; htmlLang: string }>();

  let completed = 0;
  await mapWithConcurrency(uniqueUrls, FETCH_CONCURRENCY, async (url) => {
    try {
      const { html } = await fetchHtml(url);
      const alternates = extractVisibleText(html); // dummy check
      const head = extractAttributes(html); // dummy check
      // For the sake of refactoring, we extract the head details:
      const meta = extractAlternateLinks(html);
      const htmlLang = (html.match(/<html[^>]*lang=["']([^"']+)["']/i) || [])[1] || "";
      urlHeadersMap.set(url, { hreflang: meta, htmlLang });
    } catch (error) {
      failures += 1;
      warningsList.push(`Hreflang fetch error for ${url}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      completed += 1;
      if (completed % 50 === 0 || completed === uniqueUrls.length) {
        recorder.line(`Progress: fetched ${completed}/${uniqueUrls.length} URLs...`);
      }
    }
  });

  recorder.line("Verifying hreflang alternate maps...");
  for (const [url, data] of urlHeadersMap.entries()) {
    const alternates = data.hreflang;
    const selfHreflang = alternates[data.htmlLang];
    const xDefault = alternates["x-default"];

    let ok = true;
    let note = "";

    if (Object.keys(alternates).length === 0) {
      ok = false;
      note += "Missing alternates; ";
    } else {
      if (!selfHreflang) {
        ok = false;
        note += `Self reference missing for lang ${data.htmlLang}; `;
      }
      if (!xDefault) {
        ok = false;
        note += "x-default alternate missing; ";
      }

      // Bidirectional check
      for (const [lang, altUrl] of Object.entries(alternates)) {
        if (lang === "x-default") continue;
        const altData = urlHeadersMap.get(altUrl);
        if (!altData) {
          // If the alternative page is not indexable or not in sitemap
          ok = false;
          note += `Alternate page ${altUrl} for lang ${lang} is missing or not in sitemap; `;
        } else {
          const backReference = altData.hreflang[data.htmlLang];
          if (backReference !== url) {
            ok = false;
            note += `Alternate page ${altUrl} lacks bidirectional return reference to this URL; `;
          }
        }
      }
    }

    if (!ok) {
      failures += 1;
      warningsList.push(`Hreflang mismatch for ${url}: ${note.trim()}`);
    }
  }

  return {
    status: failures > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      urlsAudited: uniqueUrls.length,
      failures,
    },
    warnings: warningsList,
  };
}

// ----------------------------------------------------------------------------
// 6. CANONICAL AUDIT
// ----------------------------------------------------------------------------
export async function auditCanonical(
  baseUrl: string,
  expectedSiteUrl: string,
  recorder: TaskRecorder
): Promise<TaskSummary> {
  const indexXml = await fetchXml(absoluteUrl(baseUrl, "/sitemap.xml"));
  const childSitemaps = extractLocs(indexXml);
  const allUrls: string[] = [];

  for (const sitemapUrl of childSitemaps) {
    const remapped = remapUrlToBase(sitemapUrl, baseUrl);
    const xml = await fetchXml(remapped);
    allUrls.push(...extractLocs(xml));
  }

  const uniqueUrls = uniqueStrings(allUrls);
  recorder.line(`Loaded ${uniqueUrls.length} unique sitemap URLs to check for canonical.`);

  let failures = 0;
  const warningsList: string[] = [];
  const expectedHost = new URL(expectedSiteUrl).host;

  let completed = 0;
  await mapWithConcurrency(uniqueUrls, FETCH_CONCURRENCY, async (url) => {
    try {
      const { html } = await fetchHtml(url);
      const canonicalTagList = extractAlternateLinks(html); // dummy check
      const canonicalTag = (html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi) || [])[0];
      const canonicalUrl = canonicalTag ? (canonicalTag.match(/href=["']([^"']+)["']/i) || [])[1] || "" : "";

      let ok = true;
      let note = "";

      if (!canonicalUrl) {
        ok = false;
        note += "Missing canonical link; ";
      } else {
        const parsed = new URL(canonicalUrl, url);
        if (parsed.host !== expectedHost) {
          ok = false;
          note += `Canonical host mismatch: got ${parsed.host}, expected ${expectedHost}; `;
        }
        if (normalizePath(canonicalUrl) !== normalizePath(url)) {
          ok = false;
          note += `Canonical URL is not self-referential (got ${canonicalUrl}); `;
        }
      }

      if (!ok) {
        failures += 1;
        warningsList.push(`Canonical mismatch for ${url}: ${note.trim()}`);
      }
    } catch (error) {
      failures += 1;
      warningsList.push(`Canonical fetch error for ${url}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      completed += 1;
      if (completed % 50 === 0 || completed === uniqueUrls.length) {
        recorder.line(`Progress: fetched ${completed}/${uniqueUrls.length} URLs...`);
      }
    }
  });

  return {
    status: failures > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      urlsAudited: uniqueUrls.length,
      failures,
    },
    warnings: warningsList,
  };
}

// ----------------------------------------------------------------------------
// 7. SITEMAP COUNTS DEBUG
// ----------------------------------------------------------------------------
export async function debugSitemapCounts(baseUrl: string, recorder: TaskRecorder): Promise<TaskSummary> {
  const catalog = await readCatalog();
  const blogPosts = mockBlogPosts;

  const activeCatalogCount = catalog.length;
  const activeBlogCount = blogPosts.length;

  recorder.line(`Catalog products: ${activeCatalogCount}`);
  recorder.line(`Published blog posts: ${activeBlogCount}`);

  const sitemapPages = await fetchXml(absoluteUrl(baseUrl, "/sitemap-pages.xml"));
  const pagesLocs = extractLocs(sitemapPages);
  recorder.line(`Sitemap pages: found ${pagesLocs.length} entries.`);

  const sitemapProducts = await fetchXml(absoluteUrl(baseUrl, "/sitemap-products.xml"));
  const productsLocs = extractLocs(sitemapProducts);
  recorder.line(`Sitemap products: found ${productsLocs.length} entries.`);

  const sitemapBlog = await fetchXml(absoluteUrl(baseUrl, "/sitemap-blog.xml"));
  const blogLocs = extractLocs(sitemapBlog);
  recorder.line(`Sitemap blog: found ${blogLocs.length} entries.`);

  return {
    metrics: {
      catalogProducts: activeCatalogCount,
      blogPosts: activeBlogCount,
      sitemapPages: pagesLocs.length,
      sitemapProducts: productsLocs.length,
      sitemapBlog: blogLocs.length,
    },
  };
}

// ----------------------------------------------------------------------------
// 8. WORDPRESS LIVE SITEMAP DIAGNOSTIC
// ----------------------------------------------------------------------------
export async function auditWordPressLiveSitemaps(recorder: TaskRecorder): Promise<TaskSummary> {
  recorder.line("Gathering sitemap URLs from production WordPress...");
  const sitemapUrls = await collectExplicitSitemapUrls(WORDPRESS_SITEMAP_URLS, "https://delpasqua.com", recorder, "WP_LIVE");
  recorder.line(`Sitemap URLs successfully loaded: ${sitemapUrls.length}`);

  return {
    metrics: {
      wpSitemapUrls: sitemapUrls.length,
    },
  };
}

// ----------------------------------------------------------------------------
// 9. COMPARE SITEMAPS
// ----------------------------------------------------------------------------
export async function compareSitemaps(
  sourceBaseUrl: string,
  targetBaseUrl: string,
  recorder: TaskRecorder,
  targetSitemaps: string[]
): Promise<TaskSummary> {
  const localUrls = await loadIndexedUrls(sourceBaseUrl);
  const liveUrls = await collectExplicitSitemapUrls(targetSitemaps, targetBaseUrl, recorder, "WP_LIVE");

  const localPaths = localUrls.map((url) => getUrlPath(url, sourceBaseUrl));
  const livePaths = liveUrls.map((url) => getUrlPath(url, targetBaseUrl));

  const localSet = new Set(localPaths);
  const liveSet = new Set(livePaths);

  const missingInLocal = livePaths.filter((path) => !localSet.has(path));
  const onlyInLocal = localPaths.filter((path) => !liveSet.has(path));

  recorder.line(`Paths in Local Next.js: ${localPaths.length}`);
  recorder.line(`Paths in Live WordPress: ${livePaths.length}`);
  recorder.line(`Missing in Next.js: ${missingInLocal.length}`);
  recorder.line(`New in Next.js: ${onlyInLocal.length}`);

  printComparisonList(recorder, "Missing in Next.js", missingInLocal, 20);
  printComparisonList(recorder, "Only in Local Next.js", onlyInLocal, 20);

  return {
    metrics: {
      localUrlsCount: localPaths.length,
      liveUrlsCount: livePaths.length,
      missingInLocalCount: missingInLocal.length,
      onlyInLocalCount: onlyInLocal.length,
    },
  };
}

// ----------------------------------------------------------------------------
// 10. URL OUTCOMES CLASSIFICATION
// ----------------------------------------------------------------------------
export async function auditAllUrlOutcomes(recorder: TaskRecorder): Promise<TaskSummary> {
  const localUrls = await loadIndexedUrls("http://localhost:3000");
  const localTechnicalUrls = TECHNICAL_ROUTES.map((route) => route.path);
  const localLegacyPaths = [...LEGACY_301_REDIRECTS.keys()];

  recorder.line("Starting Local outcome fetches...");
  const localOutcomes = await auditUrlOutcomes({
    environment: "local",
    label: "Local",
    baseUrl: "http://localhost:3000",
    urls: [
      ...localUrls.map((url) => ({ url, source: "local-project-sitemap" })),
      ...localTechnicalUrls.map((url) => ({ url, source: "local-technical-routes" })),
      ...localLegacyPaths.map((url) => ({ url, source: "local-legacy-redirects" })),
    ],
    sitemapUrls: localUrls,
    expectedCanonicalHost: "http://localhost:3000",
  });

  printOutcomeSummary(recorder, localOutcomes);
  printOutcomeGroups(recorder, localOutcomes);

  // Write outcomes to JSON/CSV files
  await fs.writeFile(URL_OUTCOMES_JSON_FILE, JSON.stringify(globalUrlOutcomes, null, 2), "utf8");
  recorder.line(`JSON outcomes written to ${URL_OUTCOMES_JSON_FILE}`);

  return {
    metrics: {
      localOutcomesCount: localOutcomes.length,
    },
  };
}

// ----------------------------------------------------------------------------
// 11. MIGRATION READINESS
// ----------------------------------------------------------------------------
export async function migrationReadinessTask(recorder: TaskRecorder): Promise<TaskSummary> {
  const liveUrls = await collectExplicitSitemapUrls(WORDPRESS_SITEMAP_URLS, "https://delpasqua.com", recorder, "WP_LIVE");
  const localUrls = await loadIndexedUrls("http://localhost:3000");
  const sitemapPaths = new Set(localUrls.map((url) => getUrlPath(url, "http://localhost:3000")));

  const migrationOutcomes: MigrationOutcome[] = [];

  recorder.line(`Evaluating migration readiness for ${liveUrls.length} WordPress URLs...`);
  for (const urlStr of liveUrls) {
    const path = getUrlPath(urlStr, "https://delpasqua.com");
    let classification: MigrationClassification = "NEEDS_LOCAL_REDIRECT_OR_410";
    let note = "";

    if (sitemapPaths.has(path)) {
      classification = "SAME_PATH_OK";
    } else {
      // Check legacy redirects mapping
      const localRedirect = LEGACY_301_REDIRECTS.get(path);
      if (localRedirect) {
        classification = "COVERED_BY_LOCAL_REDIRECT";
        note = `Redirects to ${localRedirect}`;
      } else if (isWordPressTaxonomyPath(path)) {
        classification = "TAXONOMY_LEGACY_DECISION";
        note = "WordPress category/tag page to ignore.";
      } else if (isTechnicalPath(path)) {
        classification = "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX";
        note = "Technical path (cart/account/checkout).";
      } else if (isWordPressProductPath(path)) {
        classification = "PRODUCT_LEGACY_DECISION";
      } else if (isWordPressPortfolioPath(path)) {
        classification = "PORTFOLIO_LEGACY_DECISION";
      }
    }

    migrationOutcomes.push({
      path,
      livePath: path,
      projectPath: sitemapPaths.has(path) ? path : "",
      classification,
      localCheckUrl: `http://localhost:3000${path}`,
      targetPath: sitemapPaths.has(path) ? path : LEGACY_301_REDIRECTS.get(path) || "",
      localInitialStatus: null,
      localFinalStatus: null,
      redirectCount: 0,
      note,
    });
  }

  const counts = {
    SAME_PATH_OK: migrationOutcomes.filter((o) => o.classification === "SAME_PATH_OK").length,
    COVERED_BY_LOCAL_REDIRECT: migrationOutcomes.filter((o) => o.classification === "COVERED_BY_LOCAL_REDIRECT").length,
    TAXONOMY_LEGACY_DECISION: migrationOutcomes.filter((o) => o.classification === "TAXONOMY_LEGACY_DECISION").length,
    TECHNICAL_ROUTE_IGNORE_OR_NOINDEX: migrationOutcomes.filter((o) => o.classification === "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX").length,
    NEEDS_LOCAL_REDIRECT_OR_410: migrationOutcomes.filter((o) => o.classification === "NEEDS_LOCAL_REDIRECT_OR_410").length,
  };

  recorder.line("Migration Readiness breakdown:");
  for (const [key, count] of Object.entries(counts)) {
    recorder.line(`- ${key}: ${count}`);
  }

  return {
    metrics: {
      totalMigrationUrls: migrationOutcomes.length,
      samePathOk: counts.SAME_PATH_OK,
      coveredByLocalRedirect: counts.COVERED_BY_LOCAL_REDIRECT,
      needsLocalRedirectOr410: counts.NEEDS_LOCAL_REDIRECT_OR_410,
    },
  };
}
