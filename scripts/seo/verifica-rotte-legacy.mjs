/**
 * NOME FILE: verifica-rotte-legacy.mjs (ex audit-legacy-routes.mjs)
 * SCOPO: Verifica che le rotte legacy (storiche) del vecchio sito WordPress redirectino
 *        correttamente in modo permanente (301/308) verso i nuovi slug in Next.js, testando anche i 42 URL indicizzati.
 * UTILIZZO: npm run seo:audit-legacy-routes o node scripts/verifica-rotte-legacy.mjs
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

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

const LEGACY_301_REDIRECTS = new Map([
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

const TECHNICAL_PATHS = ["/cart/", "/checkout/", "/my-account/"];

const FETCH_HEADERS = {
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function normalizePath(value) {
  const url = new URL(value, BASE_URL);
  const pathname = url.pathname || "/";
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "/");
}

function isRedirectStatus(status) {
  return status >= 300 && status < 400;
}

function isPermanentRedirect(status) {
  return status === 301 || status === 308;
}

function pathIsEnglish(path) {
  return normalizePath(path).startsWith("/en/");
}

async function fetchManual(path) {
  return fetch(absoluteUrl(path), {
    headers: FETCH_HEADERS,
    redirect: "manual",
  });
}

async function loadSitemapPaths() {
  const indexRes = await fetch(absoluteUrl("/sitemap.xml"), { headers: FETCH_HEADERS });
  if (!indexRes.ok) {
    throw new Error(`Sitemap index HTTP ${indexRes.status}`);
  }

  const indexXml = await indexRes.text();
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  const sitemapUrls = [];
  let match;
  while ((match = locRegex.exec(indexXml)) !== null) {
    sitemapUrls.push(match[1].trim());
  }

  const allPaths = new Set();
  for (const sitemapUrl of sitemapUrls) {
    const res = await fetch(sitemapUrl, { headers: FETCH_HEADERS });
    if (!res.ok) {
      throw new Error(`Child sitemap ${sitemapUrl} HTTP ${res.status}`);
    }
    const xml = await res.text();
    let childMatch;
    while ((childMatch = locRegex.exec(xml)) !== null) {
      allPaths.add(normalizePath(childMatch[1].trim()));
    }
  }

  return allPaths;
}

function extractRobotsNoindex(html) {
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html);
}

async function traceRequest(startPath, maxRedirects = 5) {
  const hops = [];
  let currentPath = normalizePath(startPath);

  for (let i = 0; i <= maxRedirects; i++) {
    const response = await fetchManual(currentPath);
    const location = response.headers.get("location");
    const status = response.status;

    if (!isRedirectStatus(status)) {
      const html = await response.text();
      hops.push({
        path: currentPath,
        status,
        location: null,
        finalPath: currentPath,
        robotsNoindex: extractRobotsNoindex(html),
      });
      return { hops, finalPath: currentPath, finalStatus: status, robotsNoindex: extractRobotsNoindex(html) };
    }

    const nextPath = location ? normalizePath(location) : null;
    hops.push({
      path: currentPath,
      status,
      location,
      finalPath: nextPath,
      robotsNoindex: false,
    });

    if (!nextPath) {
      return { hops, finalPath: currentPath, finalStatus: status, robotsNoindex: false };
    }

    currentPath = nextPath;
  }

  return { hops, finalPath: currentPath, finalStatus: 310, robotsNoindex: false };
}

function formatTrace(trace) {
  const first = trace.hops[0];
  return `status=${first?.status ?? "?"} location=${first?.location ?? "-"} final=${trace.finalPath} finalStatus=${trace.finalStatus}`;
}

async function auditDirect200Paths(failuresRef) {
  console.log(`Checking direct Italian URLs (${DIRECT_200_PATHS.length})`);
  for (const path of DIRECT_200_PATHS) {
    try {
      const trace = await traceRequest(path, 2);
      const ok =
        trace.hops.length === 1 &&
        trace.finalStatus === 200 &&
        normalizePath(trace.finalPath) === normalizePath(path);

      if (!ok) {
        console.log(`FAIL ${path} ${formatTrace(trace)}`);
        failuresRef.count++;
      } else {
        console.log(`OK   ${path} ${formatTrace(trace)}`);
      }
    } catch (error) {
      console.log(`ERROR ${path} ${error.message}`);
      failuresRef.count++;
    }
  }
  console.log("");
}

async function auditLegacyRedirects(failuresRef) {
  console.log(`Checking legacy redirects (${LEGACY_301_REDIRECTS.size})`);
  for (const [sourcePath, expectedDestination] of LEGACY_301_REDIRECTS.entries()) {
    try {
      const trace = await traceRequest(sourcePath, 2);
      const first = trace.hops[0];
      const ok =
        first &&
        isPermanentRedirect(first.status) &&
        normalizePath(trace.finalPath) === normalizePath(expectedDestination) &&
        trace.hops.length <= 2 &&
        !pathIsEnglish(trace.finalPath) &&
        trace.finalStatus === 200;

      if (!ok) {
        console.log(`FAIL ${sourcePath} ${formatTrace(trace)}`);
        failuresRef.count++;
      } else {
        console.log(`OK   ${sourcePath} ${formatTrace(trace)}`);
      }
    } catch (error) {
      console.log(`ERROR ${sourcePath} ${error.message}`);
      failuresRef.count++;
    }
  }
  console.log("");
}

async function auditTechnicalPaths(sitemapPaths, failuresRef) {
  console.log(`Checking technical/account URLs (${TECHNICAL_PATHS.length})`);
  for (const path of TECHNICAL_PATHS) {
    try {
      const trace = await traceRequest(path, 2);
      const redirectCount = trace.hops.filter((hop) => isRedirectStatus(hop.status)).length;
      const initialStatus = trace.hops[0]?.status ?? 0;
      const initialLocation = trace.hops[0]?.location ?? null;
      const initialInSitemap = sitemapPaths.has(normalizePath(path));
      const finalInSitemap = sitemapPaths.has(normalizePath(trace.finalPath));
      const landsInEnglish = pathIsEnglish(trace.finalPath) || (initialLocation ? pathIsEnglish(initialLocation) : false);

      let ok = true;
      if (initialStatus === 404 || trace.finalStatus === 404) ok = false;
      if (landsInEnglish) ok = false;
      if (redirectCount > 1) ok = false;
      if (initialInSitemap || finalInSitemap) ok = false;
      if (trace.finalStatus === 200 && !trace.robotsNoindex) ok = false;

      if (!ok) {
        console.log(
          `FAIL ${path} ${formatTrace(trace)} redirects=${redirectCount} initialInSitemap=${initialInSitemap} finalInSitemap=${finalInSitemap} noindex=${trace.robotsNoindex}`
        );
        failuresRef.count++;
      } else {
        console.log(
          `OK   ${path} ${formatTrace(trace)} redirects=${redirectCount} initialInSitemap=${initialInSitemap} finalInSitemap=${finalInSitemap} noindex=${trace.robotsNoindex}`
        );
      }
    } catch (error) {
      console.log(`ERROR ${path} ${error.message}`);
      failuresRef.count++;
    }
  }
  console.log("");
}

async function main() {
  console.log("========================================");
  console.log("Legacy Routes Audit");
  console.log("========================================");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Direct URLs: ${DIRECT_200_PATHS.length}`);
  console.log(`Legacy redirects: ${LEGACY_301_REDIRECTS.size}`);
  console.log(`Technical URLs: ${TECHNICAL_PATHS.length}`);
  console.log("");

  const sitemapPaths = await loadSitemapPaths();
  const failuresRef = { count: 0 };

  await auditDirect200Paths(failuresRef);
  await auditLegacyRedirects(failuresRef);
  await auditTechnicalPaths(sitemapPaths, failuresRef);

  console.log("Summary");
  console.log("-------");
  console.log(`Failures: ${failuresRef.count}`);

  if (failuresRef.count > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Audit failed:", error.message);
  process.exit(1);
});
