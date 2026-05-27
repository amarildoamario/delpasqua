// scripts/audit-sitemap.mjs
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ACTIVE_LOCALES = ["it", "en", "de", "nl", "da", "no"];

function extractLocs(xml) {
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

async function auditSitemapFile(filename, expectedSitemaps) {
  const url = `${BASE_URL}/${filename}`;
  console.log(`\n========================================`);
  console.log(`Auditing Sitemap Index: ${url}`);
  console.log(`========================================`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap index: HTTP status ${res.status}`);
    }
    const xml = await res.text();

    if (!xml.includes("<?xml") || !xml.includes("<sitemapindex") || !xml.includes("</sitemapindex>")) {
      throw new Error("Invalid XML or missing <sitemapindex> tag structure.");
    }

    const sitemaps = extractLocs(xml);
    console.log(`Found ${sitemaps.length} child sitemaps in index.`);

    for (const expected of expectedSitemaps) {
      const match = sitemaps.find((s) => s.endsWith(expected));
      if (!match) {
        throw new Error(`Sitemap index is missing child sitemap: ${expected}`);
      }
      console.log(`  - Verified expected child sitemap link: ${expected}`);
    }

    return sitemaps;
  } catch (error) {
    console.error(`❌ Sitemap Index Audit Failed: ${error.message}`);
    process.exit(1);
  }
}

async function auditChildSitemap(url) {
  console.log(`\nAuditing child sitemap: ${url} ...`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP status ${res.status}`);
    }
    const xml = await res.text();

    if (!xml.includes("<?xml") || !xml.includes("<urlset") || !xml.includes("</urlset>")) {
      throw new Error("Invalid XML or missing <urlset> tag structure.");
    }

    const urls = extractLocs(xml);
    console.log(`✅ OK - Found ${urls.length} URLs in sitemap.`);
    return urls;
  } catch (error) {
    console.error(`❌ Child sitemap fetch failed: ${error.message}`);
    process.exit(1);
  }
}

async function verifyUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // 1. Check for query parameters (e.g., "?")
    if (urlObj.search && urlObj.search !== "") {
      return { success: false, reason: `URL contains query parameters: "${urlObj.search}"` };
    }

    // 2. Check path segments against forbidden words
    const pathSegments = urlObj.pathname.split("/").filter(Boolean);
    const FORBIDDEN_SEGMENTS = [
      "cart",
      "carrello",
      "checkout",
      "account",
      "my-account",
      "login",
      "success",
      "api"
    ];

    for (const segment of pathSegments) {
      const lowerSegment = segment.toLowerCase();
      if (FORBIDDEN_SEGMENTS.includes(lowerSegment)) {
        return { success: false, reason: `URL contains forbidden path segment: "${segment}"` };
      }
    }
  } catch (err) {
    return { success: false, reason: `Invalid URL: ${err.message}` };
  }

  // 3. Fetch the URL to ensure it returns 200
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      // Fallback to GET if HEAD method is not allowed/implemented on route handler
      const getRes = await fetch(url);
      if (!getRes.ok) {
        return { success: false, reason: `HTTP status ${getRes.status}` };
      }
    }
    return { success: true };
  } catch (error) {
    return { success: false, reason: `Network/fetch error: ${error.message}` };
  }
}

async function main() {
  console.log(`Starting Sitemap SEO Audit`);
  console.log(`Target Base URL: ${BASE_URL}`);

  const childSitemaps = await auditSitemapFile("sitemap.xml", [
    "sitemap-pages.xml",
    "sitemap-products.xml",
    "sitemap-blog.xml"
  ]);

  let allUrls = [];
  for (const childUrl of childSitemaps) {
    const urls = await auditChildSitemap(childUrl);
    allUrls = allUrls.concat(urls);
  }

  // Remove duplicates just in case
  const uniqueUrls = Array.from(new Set(allUrls));
  console.log(`\nTotal unique URLs found across all sitemaps: ${uniqueUrls.length}`);

  let failuresCount = 0;
  console.log(`\nVerifying HTTP status and pattern rules for each URL...`);

  for (const url of uniqueUrls) {
    process.stdout.write(`  - Checking ${url} ... `);
    const result = await verifyUrl(url, uniqueUrls);
    if (result.success) {
      console.log(`✅ OK (200)`);
    } else {
      console.log(`❌ FAIL - ${result.reason}`);
      failuresCount++;
    }
  }

  // 3. Verify that homepages for all active locales are present
  console.log(`\nVerifying active language homepages are present...`);
  const missingHomepages = [];
  for (const locale of ACTIVE_LOCALES) {
    const expectedSuffix = locale === "it" ? "/" : `/${locale}/`;
    const found = uniqueUrls.some((url) => {
      const u = new URL(url);
      return u.pathname === expectedSuffix;
    });

    if (found) {
      console.log(`  - Homepage for [${locale}] -> found.`);
    } else {
      console.log(`  - Homepage for [${locale}] -> ❌ MISSING!`);
      missingHomepages.push(locale);
    }
  }

  console.log(`\n========================================`);
  console.log(`Audit Summary:`);
  console.log(`- Total URLs Audited: ${uniqueUrls.length}`);
  console.log(`- Verification Failures: ${failuresCount}`);
  console.log(`- Missing Language Homepages: ${missingHomepages.length}`);
  console.log(`========================================`);

  if (failuresCount > 0 || missingHomepages.length > 0) {
    console.log(`\nResult: ❌ FAILED (Issues detected in sitemaps!)`);
    process.exit(1);
  } else {
    console.log(`\nResult: ✅ SUCCESS (All sitemaps are perfectly valid and verified!)`);
    process.exit(0);
  }
}

main();
