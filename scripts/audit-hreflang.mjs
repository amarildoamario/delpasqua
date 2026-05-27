import { URL } from "url";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ACTIVE_LOCALES = new Set(["it", "en", "de", "nl", "da", "no"]);
const FORBIDDEN_WORDS = [
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

async function run() {
  console.log(`\n🚀 Starting Hreflang SEO Audit on base URL: ${BASE_URL}\n`);

  const fetchHeaders = {
    "Connection": "close",
    "User-Agent": "Mozilla/5.0 (compatible; HreflangAudit/1.0)",
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

  const pageAlternates = new Map();
  const errors = {};
  let checkedCount = 0;

  // Helper to map absolute URLs of alternate languages back to localhost/tested base
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

  // 2. Fetch each URL and extract alternates
  for (const urlStr of urlsToTest) {
    const pageErrors = [];
    const localUrl = getLocalUrl(urlStr);
    checkedCount++;

    await delay(15); // Add small pacing delay to prevent rate limits / socket limits

    // Print progress dot/indicator
    process.stdout.write(`[${checkedCount}/${urlsToTest.length}] Checking ${urlStr} ... `);

    try {
      // Avoid checking forbidden paths
      const lowerUrl = urlStr.toLowerCase();
      if (FORBIDDEN_WORDS.some((word) => lowerUrl.includes(word))) {
        pageErrors.push(`Contains forbidden word from list: ${FORBIDDEN_WORDS.join(", ")}`);
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

      // Extract alternates
      const alternateRegex = /<link\s+[^>]*rel=["']alternate["'][^>]*>/gi;
      const hreflangRegex = /hreflang=["']([^"']+)["']/i;
      const hrefRegex = /href=["']([^"']+)["']/i;

      const links = html.match(alternateRegex) || [];
      const alternates = {};

      for (const link of links) {
        const hreflangMatch = link.match(hreflangRegex);
        const hrefMatch = link.match(hrefRegex);
        if (hreflangMatch && hrefMatch) {
          const lang = hreflangMatch[1];
          const href = hrefMatch[1];
          alternates[lang] = href;
        }
      }

      pageAlternates.set(urlStr, alternates);

      // Validate alternates presence
      const keys = Object.keys(alternates);
      if (keys.length === 0) {
        pageErrors.push("No alternate hreflang tags found in page head.");
      } else {
        // Validate x-default
        if (!alternates["x-default"]) {
          pageErrors.push("Missing x-default hreflang tag.");
        }

        // Validate x-default is pointing to it
        if (alternates["x-default"] && alternates["it"] && alternates["x-default"] !== alternates["it"]) {
          pageErrors.push(`x-default (${alternates["x-default"]}) differs from 'it' alternate (${alternates["it"]}).`);
        }

        // Validate absolute URLs & allowed languages
        for (const [lang, href] of Object.entries(alternates)) {
          if (!href.startsWith("http://") && !href.startsWith("https://")) {
            pageErrors.push(`Hreflang for '${lang}' is not an absolute URL: '${href}'`);
          }

          if (lang !== "x-default" && !ACTIVE_LOCALES.has(lang)) {
            pageErrors.push(`Inactive/unsupported locale '${lang}' found in hreflangs.`);
          }

          // Validate that it doesn't contain forbidden directories
          const lowerHref = href.toLowerCase();
          if (FORBIDDEN_WORDS.some((word) => lowerHref.includes(word))) {
            pageErrors.push(`Alternate link for '${lang}' contains forbidden word: '${href}'`);
          }
        }

        // Validate self hreflang
        // We find which language matches this page's URL
        let matchedLang = null;
        for (const [lang, href] of Object.entries(alternates)) {
          if (lang !== "x-default" && getLocalUrl(href) === localUrl) {
            matchedLang = lang;
            break;
          }
        }
        if (!matchedLang) {
          pageErrors.push(`Missing self-referencing hreflang tag. Page URL '${urlStr}' not found in alternates.`);
        }
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

  // 3. Bidirectionality & Status 200 of alternate targets
  console.log("\n🔄 Validating Bidirectionality and Alternate Target Statuses...\n");

  // Create a set of crawled local URLs for instant O(1) status validation
  const crawledLocalUrls = new Set();
  for (const crawled of pageAlternates.keys()) {
    crawledLocalUrls.add(getLocalUrl(crawled));
  }

  for (const [urlStr, alternates] of pageAlternates.entries()) {
    const pageErrors = errors[urlStr] || [];

    // For every alternate declared
    for (const [lang, href] of Object.entries(alternates)) {
      if (lang === "x-default") continue;

      const altLocalUrl = getLocalUrl(href);

      // Verify that the alternate target responded with 200 in Phase 1
      if (!crawledLocalUrls.has(altLocalUrl)) {
        // Find if it was crawled but failed, or is missing from sitemaps
        let foundFailedUrl = null;
        for (const failed of Object.keys(errors)) {
          if (getLocalUrl(failed) === altLocalUrl) {
            foundFailedUrl = failed;
            break;
          }
        }

        if (foundFailedUrl) {
          pageErrors.push(`Alternate target for '${lang}' (${href}) failed to crawl in Phase 1: ${errors[foundFailedUrl].join(", ")}`);
        } else {
          pageErrors.push(`Alternate target for '${lang}' (${href}) is not part of crawled indexable URLs.`);
        }
      }

      // Check bidirectionality in pageAlternates in-memory
      let targetCrawledUrl = null;
      for (const crawled of pageAlternates.keys()) {
        if (getLocalUrl(crawled) === altLocalUrl) {
          targetCrawledUrl = crawled;
          break;
        }
      }

      if (targetCrawledUrl) {
        const targetAlts = pageAlternates.get(targetCrawledUrl);
        // Find if targetAlts references the source urlStr
        let backReferences = false;
        if (targetAlts) {
          for (const [tLang, tHref] of Object.entries(targetAlts)) {
            if (tLang !== "x-default" && getLocalUrl(tHref) === getLocalUrl(urlStr)) {
              backReferences = true;
              break;
            }
          }
        }

        if (!backReferences) {
          pageErrors.push(`Bidirectionality broken: this page points to '${href}' (${lang}), but that target page does not point back to this page.`);
        }
      } else {
        // If not in sitemaps, we already reported this in the status validation above
      }
    }

    if (pageErrors.length > 0) {
      errors[urlStr] = pageErrors;
    }
  }

  // 4. Output the final summary report
  const totalErrors = Object.keys(errors).length;
  console.log("\n=================== AUDIT REPORT ===================");
  console.log(`Total URLs Audited: ${urlsToTest.length}`);
  console.log(`Status 200 OK verified: Yes`);
  console.log(`Errors found: ${totalErrors > 0 ? "❌ Yes" : "💚 No"}`);
  console.log("===================================================\n");

  if (totalErrors > 0) {
    for (const [url, list] of Object.entries(errors)) {
      console.log(`📍 URL: ${url}`);
      for (const err of list) {
        console.log(`   🚨 ${err}`);
      }
      console.log("");
    }
    console.log("❌ Audit failed with errors.\n");
    process.exit(1);
  } else {
    console.log("💚 Hreflang SEO Audit passed successfully! 100% compliant.\n");
    process.exit(0);
  }
}

run();
