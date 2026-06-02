/**
 * NOME FILE: confronta-sitemaps.mjs (ex compare-sitemaps.mjs)
 * SCOPO: Scarica ed analizza in parallelo le sitemap del sito live (WordPress)
 *        e del progetto locale (Next.js) evidenziando le differenze (pagine rimosse, nuove o in comune).
 * UTILIZZO: npm run seo:compare-sitemaps o node scripts/confronta-sitemaps.mjs
 */

import fs from "fs";
import path from "path";

const LIVE_BASE_URL = process.env.LIVE_BASE_URL || process.env.SOURCE_BASE_URL || "https://delpasqua.com";
const PROJECT_BASE_URL = process.env.PROJECT_BASE_URL || process.env.TARGET_BASE_URL || "http://localhost:3000";

const LIVE_SITEMAP_URL = process.env.LIVE_SITEMAP_URL || `${LIVE_BASE_URL.replace(/\/$/, "")}/sitemap.xml`;
const PROJECT_SITEMAP_URL = process.env.PROJECT_SITEMAP_URL || `${PROJECT_BASE_URL.replace(/\/$/, "")}/sitemap.xml`;

const SHOW_MATCHES = process.env.SHOW_MATCHES === "1";
const SHOW_LIVE_ALL = process.env.SHOW_LIVE_ALL === "1";
const SHOW_PROJECT_ALL = process.env.SHOW_PROJECT_ALL === "1";
const DIFF_LIMIT = Number.parseInt(process.env.DIFF_LIMIT || "200", 10);
const REPORT_DIR = process.env.REPORT_DIR || path.resolve(process.cwd(), "scratch", "seo-risultati", "seo-compare");

const FETCH_HEADERS = {
  Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
  Connection: "close",
};

function extractLocs(xml) {
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

function remapUrlToBase(urlStr, baseUrl) {
  const source = new URL(urlStr);
  const base = new URL(baseUrl);
  source.protocol = base.protocol;
  source.host = base.host;
  return source.toString();
}

function normalizeComparablePath(urlStr) {
  const url = new URL(urlStr);
  let path = decodeURIComponent(url.pathname || "/");

  if (path !== "/" && !path.endsWith("/")) {
    const lastSegment = path.split("/").filter(Boolean).at(-1) || "";
    const looksLikeFile = /\.[a-z0-9]+$/i.test(lastSegment);
    if (!looksLikeFile) {
      path = `${path}/`;
    }
  }

  return path || "/";
}

function sortPaths(paths) {
  return [...paths].sort((a, b) => a.localeCompare(b, "it"));
}

function categorizePath(path) {
  if (path === "/") return "home";
  if (path.includes("/blog/")) return "blog";
  if (
    path.includes("/shop/") ||
    path.includes("/laden/") ||
    path.includes("/winkel/") ||
    path.includes("/butik/") ||
    path.includes("/butikk/")
  ) {
    return "shop";
  }
  if (
    path.includes("/privacy") ||
    path.includes("/cookie") ||
    path.includes("/termini") ||
    path.includes("/condizioni-generali-di-vendita/")
  ) {
    return "legal";
  }
  if (
    path.includes("/carrello/") ||
    path.includes("/checkout/") ||
    path.includes("/my-account/") ||
    path.includes("/cart/") ||
    path.includes("/warenkorb/") ||
    path.includes("/winkelwagen/") ||
    path.includes("/kurv/") ||
    path.includes("/handlekurv/")
  ) {
    return "utility";
  }
  return "pages";
}

function printCategoryBreakdown(label, paths) {
  const counts = {
    home: 0,
    pages: 0,
    shop: 0,
    blog: 0,
    legal: 0,
    utility: 0,
  };

  for (const path of paths) {
    counts[categorizePath(path)]++;
  }

  console.log(`${label}:`);
  for (const [category, count] of Object.entries(counts)) {
    console.log(`  - ${category}: ${count}`);
  }
}

function printPathList(title, paths) {
  console.log(`\n${title} (${paths.length})`);
  console.log("-".repeat(title.length + String(paths.length).length + 3));

  const limited = paths.slice(0, DIFF_LIMIT);
  for (const path of limited) {
    console.log(path);
  }

  if (paths.length > limited.length) {
    console.log(`... altri ${paths.length - limited.length} path non mostrati (DIFF_LIMIT=${DIFF_LIMIT})`);
  }
}

function ensureReportDir() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function writePathReport(filename, paths) {
  ensureReportDir();
  const filePath = path.join(REPORT_DIR, filename);
  fs.writeFileSync(filePath, `${paths.join("\n")}\n`, "utf8");
  return filePath;
}

async function fetchXml(url) {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.text();
  } catch (error) {
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      throw new Error(`fetch fallito per ${url}. Assicurati che il server di sviluppo locale sia avviato (es. con 'npm run dev'). Dettaglio: ${error.message}`);
    }
    throw new Error(`fetch fallito per ${url}. Verifica la connessione o l'indirizzo. Dettaglio: ${error.message}`);
  }
}

async function collectSitemapPaths(entryUrl, baseUrl, seen = new Set()) {
  const normalizedEntryUrl = remapUrlToBase(entryUrl, baseUrl);
  if (seen.has(normalizedEntryUrl)) {
    return [];
  }
  seen.add(normalizedEntryUrl);

  const xml = await fetchXml(normalizedEntryUrl);
  const locs = extractLocs(xml);

  if (xml.includes("<sitemapindex")) {
    let nestedPaths = [];
    for (const loc of locs) {
      const remappedChildUrl = remapUrlToBase(loc, baseUrl);
      const childPaths = await collectSitemapPaths(remappedChildUrl, baseUrl, seen);
      nestedPaths = nestedPaths.concat(childPaths);
    }
    return nestedPaths;
  }

  if (!xml.includes("<urlset")) {
    throw new Error(`Formato sitemap non riconosciuto: ${normalizedEntryUrl}`);
  }

  return locs.map(normalizeComparablePath);
}

async function main() {
  console.log("========================================");
  console.log("Confronto Sitemap Live vs Progetto");
  console.log("========================================");
  console.log(`Live sitemap:     ${LIVE_SITEMAP_URL}`);
  console.log(`Project sitemap:  ${PROJECT_SITEMAP_URL}`);
  console.log(`Diff limit:       ${DIFF_LIMIT}`);
  console.log("");

  const [livePathsRaw, projectPathsRaw] = await Promise.all([
    collectSitemapPaths(LIVE_SITEMAP_URL, LIVE_BASE_URL),
    collectSitemapPaths(PROJECT_SITEMAP_URL, PROJECT_BASE_URL),
  ]);

  const livePaths = sortPaths(new Set(livePathsRaw));
  const projectPaths = sortPaths(new Set(projectPathsRaw));

  const liveSet = new Set(livePaths);
  const projectSet = new Set(projectPaths);

  const onlyLive = livePaths.filter((path) => !projectSet.has(path));
  const onlyProject = projectPaths.filter((path) => !liveSet.has(path));
  const common = livePaths.filter((path) => projectSet.has(path));

  console.log("Riepilogo");
  console.log("---------");
  console.log(`URL live:               ${livePaths.length}`);
  console.log(`URL progetto:           ${projectPaths.length}`);
  console.log(`URL in comune:          ${common.length}`);
  console.log(`Solo live (da valutare): ${onlyLive.length}`);
  console.log(`Solo progetto:          ${onlyProject.length}`);
  console.log("");

  printCategoryBreakdown("Distribuzione solo live", onlyLive);
  console.log("");
  printCategoryBreakdown("Distribuzione solo progetto", onlyProject);

  printPathList("Path presenti solo nel live", onlyLive);
  printPathList("Path presenti solo nel progetto", onlyProject);

  if (SHOW_MATCHES) {
    printPathList("Path presenti in entrambi", common);
  }

  if (SHOW_LIVE_ALL) {
    printPathList("Tutti i path trovati nel live", livePaths);
  }

  if (SHOW_PROJECT_ALL) {
    printPathList("Tutti i path trovati nel progetto", projectPaths);
  }

  const liveAllFile = writePathReport("live-all-paths.txt", livePaths);
  const projectAllFile = writePathReport("project-all-paths.txt", projectPaths);
  const onlyLiveFile = writePathReport("only-live-paths.txt", onlyLive);
  const onlyProjectFile = writePathReport("only-project-paths.txt", onlyProject);
  const commonFile = writePathReport("common-paths.txt", common);

  console.log("");
  console.log("File report");
  console.log("-----------");
  console.log(`Live completo:      ${liveAllFile}`);
  console.log(`Progetto completo:  ${projectAllFile}`);
  console.log(`Solo live:          ${onlyLiveFile}`);
  console.log(`Solo progetto:      ${onlyProjectFile}`);
  console.log(`In comune:          ${commonFile}`);

  process.exit(0);
}

main().catch((error) => {
  console.error("\n❌ Confronto fallito:", error.message);
  process.exit(1);
});
