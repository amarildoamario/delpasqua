import { setTimeout as wait } from "node:timers/promises";

const XML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
// Allow more in-flight requests while pacing batches below the 600/min site quota.
const BATCH_SIZE = 12;
const BATCH_INTERVAL_MS = 1500;

function sitemapLocations(xml, entry) {
  const pattern = new RegExp(`<${entry}(?:\\s[^>]*)?>\\s*<loc>\\s*([^<]+?)\\s*</loc>`, "g");
  return [...xml.matchAll(pattern)].map(([, location]) =>
    location.replace(/&(amp|lt|gt|quot|apos);/g, (_, name) => XML_ENTITIES[name]));
}

export async function discoverSitemapUrls(property) {
  const domain = property.startsWith("sc-domain:");
  const base = new URL(domain ? `https://${property.slice("sc-domain:".length)}` : property);
  if (!["http:", "https:"].includes(base.protocol) || base.username || base.password) {
    throw new Error("La proprietà deve essere un dominio o un prefisso URL http o https.");
  }

  const root = new URL("/sitemap.xml", base).href;
  const sitemaps = new Set([root]);
  const urls = new Set();

  for (const sitemap of sitemaps) {
    const response = await fetch(sitemap, { redirect: "error", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Sitemap ${sitemap}: HTTP ${response.status}.`);
    const xml = (await response.text()).replace(/^\uFEFF?\s*(?:<\?xml[^?]*\?>\s*)?/, "");
    if (/^<sitemapindex[\s>]/.test(xml)) {
      for (const location of sitemapLocations(xml, "sitemap")) {
        const child = new URL(location);
        if (child.origin !== base.origin || child.username || child.password) {
          throw new Error(`La sitemap ${sitemap} contiene una sitemap di un'altra origine.`);
        }
        sitemaps.add(child.href);
      }
    } else if (/^<urlset[\s>]/.test(xml)) {
      for (const location of sitemapLocations(xml, "url")) {
        const url = new URL(location);
        const inProperty = domain
          ? url.hostname === base.hostname || url.hostname.endsWith(`.${base.hostname}`)
          : url.href.startsWith(base.href);
        if (inProperty && ["http:", "https:"].includes(url.protocol) && !url.username && !url.password) {
          url.hash = "";
          urls.add(url.href);
        }
      }
    } else {
      throw new Error(`Formato XML non riconosciuto nella sitemap ${sitemap}.`);
    }
  }
  return { root, sitemaps: [...sitemaps], urls: [...urls] };
}

export async function auditIndexing({ property, limit, offset, inspect }) {
  const { root, sitemaps, urls } = await discoverSitemapUrls(property);
  const selected = urls.slice(offset, offset + limit);
  const pages = [];
  const byVerdict = new Map();
  const byCoverageState = new Map();
  let failed = 0;
  let resumeOffset;
  console.error(`Trovati ${urls.length} URL nelle sitemap pubbliche. Ispezione Google di ${selected.length} URL…`);

  for (let start = 0; start < selected.length;) {
    // Check the first URL alone to surface missing credentials or property permissions immediately.
    const batchSize = start === 0 ? 1 : BATCH_SIZE;
    const startedAt = Date.now();
    const batch = await Promise.all(selected.slice(start, start + batchSize).map(async url => {
      try {
        const { inspectionResult } = await inspect(url);
        const index = inspectionResult?.indexStatusResult;
        if (!index) throw new Error("Google non ha restituito lo stato di indicizzazione.");
        return { url, ...index, inspectionResultLink: inspectionResult.inspectionResultLink };
      } catch (error) {
        return { url, error: error.message, httpStatus: error.status };
      }
    }));
    pages.push(...batch);
    for (const page of batch) {
      if (page.error) {
        failed++;
      } else {
        const verdict = page.verdict ?? "VERDICT_UNSPECIFIED";
        const coverage = page.coverageState ?? "Non disponibile";
        byVerdict.set(verdict, (byVerdict.get(verdict) ?? 0) + 1);
        byCoverageState.set(coverage, (byCoverageState.get(coverage) ?? 0) + 1);
      }
    }

    const blocked = batch.findIndex(page => [401, 403, 429].includes(page.httpStatus));
    if (blocked !== -1 || (start === 0 && batch[0].error)) {
      resumeOffset = offset + start + Math.max(0, blocked);
      console.error("Ispezione interrotta. Il report contiene i risultati disponibili e l'errore restituito.");
      break;
    }
    if (Math.floor(pages.length / 100) > Math.floor(start / 100)) {
      console.error(`Elaborati ${pages.length}/${selected.length} URL.`);
    }
    start += batch.length;
    if (pages.length < selected.length) await wait(Math.max(0, BATCH_INTERVAL_MS - (Date.now() - startedAt)));
  }

  const next = offset + pages.length;
  return {
    property, sitemap: root, sitemaps, totalUrls: urls.length, offset, attempted: pages.length,
    inspected: pages.length - failed, failed, unattemptedInSelection: selected.length - pages.length,
    nextOffset: resumeOffset ?? (next < urls.length ? next : null),
    byVerdict: Object.fromEntries(byVerdict),
    byCoverageState: Object.fromEntries(byCoverageState),
    pages,
  };
}
