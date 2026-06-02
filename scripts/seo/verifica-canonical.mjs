/**
 * NOME FILE: verifica-canonical.mjs (ex audit-canonical.mjs)
 * SCOPO: Analizza le pagine indicate nelle sitemap locali e valida che il tag canonical
 *        sia unico, assoluto, coerente con la lingua della pagina e con trailing slash corretti.
 * UTILIZZO: npm run seo:audit-canonical o node scripts/verifica-canonical.mjs
 */

import { URL } from "url";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const EXPECTED_SITE_URL = process.env.EXPECTED_SITE_URL || BASE_URL;

const ACTIVE_LOCALES = ["it", "en", "de", "nl", "da", "no"];
const FORBIDDEN_WORDS = [
  "cart",
  "carrello",
  "checkout",
  "success",
  "account",
  "login",
  "api",
  "search",
];

async function run() {
  console.log(`\n🚀 Starting Canonical SEO Audit ...`);
  console.log(`📍 Testing against BASE_URL: ${BASE_URL}`);
  console.log(`📍 Comparing domain against EXPECTED_SITE_URL: ${EXPECTED_SITE_URL}\n`);

  const fetchHeaders = {
    "Connection": "close",
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 1. Fetch the sitemaps
  const sitemaps = ["/sitemap-pages.xml", "/sitemap-products.xml", "/sitemap-blog.xml"];
  const allUrls = new Set();

  for (const path of sitemaps) {
    const sitemapUrl = `${BASE_URL}${path}`;
    try {
      const res = await fetch(sitemapUrl, { headers: fetchHeaders });
      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      const xml = await res.text();
      const regex = /<loc>(https?:\/\/[^\s<]+)<\/loc>/g;
      let match;
      let count = 0;
      while ((match = regex.exec(xml)) !== null) {
        allUrls.add(match[1]);
        count++;
      }
      console.log(`✅ Loaded ${count} URLs from ${path}`);
    } catch (err) {
      console.error(`❌ Error fetching sitemap ${sitemapUrl}:`, err.message);
      process.exit(1);
    }
  }

  const urlsToTest = Array.from(allUrls);
  console.log(`\n📋 Found ${urlsToTest.length} total unique URLs to audit.\n`);

  const errors = {};
  let checkedCount = 0;

  // Helper to map absolute URLs back to localhost/tested base for testing page response
  function getLocalUrl(urlStr) {
    try {
      const url = new URL(urlStr);
      const base = new URL(BASE_URL);
      url.protocol = base.protocol;
      url.host = base.host;
      return url.toString();
    } catch (e) {
      return urlStr;
    }
  }

  // 2. Fetch each URL and extract + validate canonical
  for (const urlStr of urlsToTest) {
    const pageErrors = [];
    const localUrl = getLocalUrl(urlStr);
    checkedCount++;

    await delay(15); // Add small pacing delay to prevent rate limits / socket limits

    // Print progress
    process.stdout.write(`[${checkedCount}/${urlsToTest.length}] Checking ${urlStr} ... `);

    try {
      // Avoid checking forbidden paths in the sitemap itself (shouldn't have been there anyway)
      const urlObj = new URL(urlStr);
      const segments = urlObj.pathname.toLowerCase().split("/").filter(Boolean);
      const forbiddenWord = FORBIDDEN_WORDS.find((word) => segments.includes(word));
      if (forbiddenWord) {
        pageErrors.push(`Sitemap URL contains forbidden word: ${forbiddenWord}`);
      }

      const cleanUrl = encodeURI(decodeURI(localUrl));
      const res = await fetch(cleanUrl, { headers: fetchHeaders });
      if (!res.ok) {
        pageErrors.push(`Page returned status code ${res.status}`);
        console.log(`❌ FAIL (Status ${res.status})`);
        errors[urlStr] = pageErrors;
        continue;
      }

      const html = await res.text();

      // Extract canonical tags from <head>
      const canonicalRegex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi;
      const hrefRegex = /href=["']([^"']+)["']/i;

      const links = html.match(canonicalRegex) || [];

      if (links.length === 0) {
        pageErrors.push("Missing canonical tag on page.");
      } else if (links.length > 1) {
        pageErrors.push(`Multiple canonical tags found on page: ${links.length}`);
      } else {
        const canonicalTag = links[0];
        const hrefMatch = canonicalTag.match(hrefRegex);
        if (!hrefMatch) {
          pageErrors.push(`Canonical tag has no href attribute: ${canonicalTag}`);
        } else {
          const canonicalUrlStr = hrefMatch[1];

          // 1. absolute URL check
          if (!canonicalUrlStr.startsWith("http://") && !canonicalUrlStr.startsWith("https://")) {
            pageErrors.push(`Canonical is not an absolute URL: '${canonicalUrlStr}'`);
          } else {
            // 2. EXPECTED_SITE_URL domain check
            try {
              const canonicalUrl = new URL(canonicalUrlStr);
              const expectedUrl = new URL(EXPECTED_SITE_URL);
              if (canonicalUrl.host !== expectedUrl.host) {
                pageErrors.push(`Canonical domain '${canonicalUrl.host}' does not match expected domain '${expectedUrl.host}'`);
              }
              if (canonicalUrl.protocol !== expectedUrl.protocol) {
                pageErrors.push(`Canonical protocol '${canonicalUrl.protocol}' does not match expected protocol '${expectedUrl.protocol}'`);
              }

              // 3. same page check (no query/hash, path equivalence)
              const pageUrl = new URL(urlStr);
              
              // Normalize pathnames by removing trailing slashes for comparison
              const canonicalPath = canonicalUrl.pathname.replace(/\/$/, "");
              const pagePath = pageUrl.pathname.replace(/\/$/, "");

              if (canonicalPath !== pagePath) {
                pageErrors.push(`Canonical path '${canonicalUrl.pathname}' does not match page path '${pageUrl.pathname}'`);
              }

              // 4. check trailing slash is present (unless it is root)
              if (canonicalUrl.pathname !== "/" && !canonicalUrl.pathname.endsWith("/")) {
                pageErrors.push(`Canonical URL lacks trailing slash: '${canonicalUrlStr}'`);
              }

              // 5. check for query/hash inside canonical URL
              if (canonicalUrl.search || canonicalUrl.hash) {
                pageErrors.push(`Canonical URL contains query parameters or hash: '${canonicalUrlStr}'`);
              }

              // 6. non-Italian pages should not canonicalize to Italian version (e.g. en/shop should not point to /shop)
              const getLocaleFromPath = (path) => {
                const parts = path.split("/").filter(Boolean);
                if (parts.length > 0 && ACTIVE_LOCALES.includes(parts[0])) {
                  return parts[0];
                }
                return "it"; // default locale
              };
              const canonicalLocale = getLocaleFromPath(canonicalUrl.pathname);
              const pageLocale = getLocaleFromPath(pageUrl.pathname);
              if (canonicalLocale !== pageLocale) {
                pageErrors.push(`Language mismatch: Canonical points to language '${canonicalLocale}' but page is '${pageLocale}'`);
              }

              // 7. Verify the canonical URL responds with 200 OK
              const canonicalLocalUrl = getLocalUrl(canonicalUrlStr);
              const canonicalCleanUrl = encodeURI(decodeURI(canonicalLocalUrl));
              const canonicalRes = await fetch(canonicalCleanUrl, { headers: fetchHeaders });
              if (!canonicalRes.ok) {
                pageErrors.push(`Canonical target '${canonicalUrlStr}' returned status code ${canonicalRes.status} (local test: ${canonicalCleanUrl})`);
              }
            } catch (e) {
              pageErrors.push(`Failed to parse canonical URL: '${canonicalUrlStr}'`);
            }
          }
        }
      }

      // 8. Ensure no canonical on forbidden paths
      const urlObjForPath = new URL(urlStr);
      const pathSegments = urlObjForPath.pathname.toLowerCase().split("/").filter(Boolean);
      const forbiddenSegment = FORBIDDEN_WORDS.find((word) => pathSegments.includes(word));
      if (forbiddenSegment) {
        pageErrors.push(`Forbidden path segment found: ${forbiddenSegment}`);
      }

      if (pageErrors.length > 0) {
        console.log("❌ FAIL");
        errors[urlStr] = pageErrors;
      } else {
        console.log("💚 OK");
      }
    } catch (err) {
      pageErrors.push(`Error fetching/parsing page: ${err.message}`);
      console.log("❌ ERROR");
      errors[urlStr] = pageErrors;
    }
  }

  // 4. Output the final summary report
  const totalErrors = Object.keys(errors).length;
  console.log("\n=================== CANONICAL AUDIT REPORT ===================");
  console.log(`Total URLs Audited: ${urlsToTest.length}`);
  console.log(`Errors found: ${totalErrors > 0 ? "❌ Yes" : "💚 No"}`);
  console.log("==============================================================\n");

  if (totalErrors > 0) {
    for (const [url, list] of Object.entries(errors)) {
      console.log(`📍 URL: ${url}`);
      for (const err of list) {
        console.log(`   🚨 ${err}`);
      }
      console.log("");
    }
    console.log("❌ Canonical Audit failed with errors.\n");
    process.exit(1);
  } else {
    console.log("💚 Canonical SEO Audit passed successfully! 100% compliant.\n");
    process.exit(0);
  }
}

run();
