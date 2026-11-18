import { locales } from "../../src/i18n/pathnames";
import { localizedPath } from "../../src/lib/seo";

const base = new URL(process.env.BASE_URL || "http://localhost:3000");

async function readPage(path: string) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
}

async function auditShopLinks() {
  const sitemap = await readPage("/sitemap-products.xml");
  const productPaths = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname);
  if (!productPaths.length) throw new Error("Nessun prodotto nella sitemap.");

  const results = await Promise.all(locales.map(async (locale) => {
    const shop = localizedPath("/shop", locale);
    const expected = productPaths.filter((path) => path.startsWith(shop));
    const html = await readPage(shop);
    const links = new Set([...html.matchAll(/<a\s[^>]*data-testid="product-card"[^>]*>/g)]
      .map((match) => match[0].match(/\bhref="([^"]+)"/)?.[1])
      .filter((href): href is string => Boolean(href))
      .map((href) => new URL(href.replaceAll("&amp;", "&"), base))
      .filter((href) => href.origin === base.origin)
      .map((href) => href.pathname));
    const missing = expected.filter((path) => !links.has(path));
    const wrongLocale = [...links].filter((path) => !path.startsWith(shop));
    console.log(`${locale}: ${expected.length - missing.length}/${expected.length} prodotti collegati`);
    for (const path of missing) console.error(`  Link mancante: ${path}`);
    for (const path of wrongLocale) console.error(`  Link fuori lingua: ${path}`);
    return expected.length > 0 && !missing.length && !wrongLocale.length;
  }));

  if (results.includes(false)) process.exitCode = 1;
}

auditShopLinks().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
