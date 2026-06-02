/**
 * NOME FILE: verifica-rotte-noindex.mjs (ex audit-technical-noindex-routes.mjs)
 * SCOPO: Verifica che le rotte tecniche (carrello, checkout, area account) siano escluse
 *        dalle sitemap, abbiano il tag meta `noindex` attivo e siano prive di tag canonical/hreflang/og:url.
 * UTILIZZO: npm run seo:audit-noindex o node scripts/verifica-rotte-noindex.mjs
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

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

function extractHeadInfo(html) {
  return {
    noindex: /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html),
    canonical: /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html),
    hreflang: /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/i.test(html),
    ogUrl: /<meta\s+[^>]*(property|name)=["']og:url["'][^>]*>/i.test(html),
    htmlLang: (html.match(/<html[^>]*lang=["']([^"']+)["']/i) || [])[1] || "",
  };
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

  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  const indexXml = await indexRes.text();
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

async function traceRequest(startPath, maxRedirects = 5) {
  const hops = [];
  let currentPath = normalizePath(startPath);

  for (let i = 0; i <= maxRedirects; i++) {
    const response = await fetchManual(currentPath);
    const location = response.headers.get("location");
    const status = response.status;

    if (!isRedirectStatus(status)) {
      const html = await response.text();
      const head = extractHeadInfo(html);
      hops.push({ path: currentPath, status, location: null });
      return { hops, finalPath: currentPath, finalStatus: status, head };
    }

    const nextPath = location ? normalizePath(location) : null;
    hops.push({ path: currentPath, status, location });

    if (!nextPath) {
      return { hops, finalPath: currentPath, finalStatus: status, head: null };
    }

    currentPath = nextPath;
  }

  return { hops, finalPath: currentPath, finalStatus: 310, head: null };
}

function formatTrace(trace) {
  const first = trace.hops[0];
  return `status=${first?.status ?? "?"} location=${first?.location ?? "-"} final=${trace.finalPath} finalStatus=${trace.finalStatus}`;
}

async function main() {
  console.log("========================================");
  console.log("Technical Noindex Audit");
  console.log("========================================");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Routes to verify: ${TECHNICAL_ROUTES.length}`);
  console.log("");

  const sitemapPaths = await loadSitemapPaths();
  const failures = [];
  const noindex200 = [];
  const redirects = [];
  const foundRoutes = [];
  let cartItalianConfirmed = false;

  for (const route of TECHNICAL_ROUTES) {
    try {
      const trace = await traceRequest(route.path, 2);
      const redirectCount = trace.hops.filter((hop) => isRedirectStatus(hop.status)).length;
      const initialLocation = trace.hops[0]?.location || "";
      const initialInSitemap = sitemapPaths.has(normalizePath(route.path));
      const finalInSitemap = sitemapPaths.has(normalizePath(trace.finalPath));
      const italianPath = route.type === "it" || route.type === "legacy-it";
      const redirectsToEnglish = initialLocation.startsWith("/en/") || normalizePath(trace.finalPath).startsWith("/en/");
      const resultLine = `${route.path} ${formatTrace(trace)}`;

      foundRoutes.push(route.path);

      let ok = true;
      if (trace.finalStatus === 404 || trace.hops[0]?.status === 404) ok = false;
      if (redirectCount > 1) ok = false;
      if (italianPath && redirectsToEnglish) ok = false;
      if (initialInSitemap || finalInSitemap) ok = false;

      if (redirectCount > 0) {
        redirects.push(route.path);
      }

      if (trace.finalStatus === 200) {
        const head = trace.head;
        const headOk = Boolean(
          head &&
            head.noindex &&
            !head.canonical &&
            !head.hreflang &&
            !head.ogUrl
        );

        if (!headOk) {
          ok = false;
        } else {
          noindex200.push(route.path);
        }

        if (normalizePath(route.path) === "/carrello/") {
          const isItalian = head?.htmlLang === "it";
          if (!isItalian) ok = false;
          cartItalianConfirmed = isItalian;
        }
      }

      if (!ok) {
        failures.push(resultLine);
        console.log(`FAIL ${resultLine}`);
      } else {
        console.log(`OK   ${resultLine}`);
      }
    } catch (error) {
      failures.push(`${route.path} ERROR ${error.message}`);
      console.log(`ERROR ${route.path} ${error.message}`);
    }
  }

  console.log("");
  console.log("Summary");
  console.log("-------");
  console.log(`Technical routes found: ${foundRoutes.length}`);
  console.log(`200 noindex routes: ${noindex200.length}`);
  console.log(`Redirecting routes: ${redirects.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Carrello Italian confirmed: ${cartItalianConfirmed ? "yes" : "no"}`);

  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Audit failed:", error.message);
  process.exit(1);
});
