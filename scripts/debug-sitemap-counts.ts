import { mockBlogPosts } from "../src/lib/blog-data";
import { readCatalog } from "../src/lib/server/catalog";
import { locales } from "../src/i18n/pathnames";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function fetchSitemapUrls(sitemapPath: string): Promise<string[]> {
  const url = `${BASE_URL}${sitemapPath}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const xml = await res.text();
    const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
    const urls: string[] = [];
    let match;
    while ((match = locRegex.exec(xml)) !== null) {
      urls.push(match[1].trim());
    }
    return urls;
  } catch (err: any) {
    console.error(`❌ Errore durante il download di ${sitemapPath}:`, err.message);
    return [];
  }
}

async function main() {
  console.log(`====================================================`);
  console.log(`🔍 AVVIO DIAGNOSTICA CONTEGGI SITEMAP`);
  console.log(`📍 Base URL target: ${BASE_URL}`);
  console.log(`====================================================\n`);

  // --- 1. DOWNLOAD SITEMAPS ---
  const sitemaps = {
    pages: "/sitemap-pages.xml",
    products: "/sitemap-products.xml",
    blog: "/sitemap-blog.xml"
  };

  const pagesUrls = await fetchSitemapUrls(sitemaps.pages);
  const productsUrls = await fetchSitemapUrls(sitemaps.products);
  const blogUrls = await fetchSitemapUrls(sitemaps.blog);

  console.log(`📊 Conteggi sitemaps scaricate:`);
  console.log(`  - sitemap-pages.xml    : ${pagesUrls.length} URL`);
  console.log(`  - sitemap-products.xml : ${productsUrls.length} URL`);
  console.log(`  - sitemap-blog.xml     : ${blogUrls.length} URL`);
  console.log(`  - Totale sitemap       : ${pagesUrls.length + productsUrls.length + blogUrls.length} URL\n`);

  const allUrlsList = [...pagesUrls, ...productsUrls, ...blogUrls];
  const uniqueUrls = new Set(allUrlsList);

  // --- 2. CONTEGGI PER LINGUA ---
  const countsByLocale: Record<string, number> = {};
  for (const locale of locales) {
    countsByLocale[locale] = 0;
  }
  countsByLocale["it"] = 0; // Italian has no prefix /it/

  for (const url of allUrlsList) {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      let lang = "it";
      if (parts.length > 0 && locales.includes(parts[0] as any) && parts[0] !== "it") {
        lang = parts[0];
      }
      countsByLocale[lang] = (countsByLocale[lang] || 0) + 1;
    } catch {
      // ignore
    }
  }

  console.log(`🌐 URL suddivisi per lingua:`);
  for (const [lang, count] of Object.entries(countsByLocale)) {
    console.log(`  - [${lang}]: ${count} URL`);
  }
  console.log("");

  // --- 3. CONTEGGI PER PATTERN ---
  const patternCounts = {
    shop: 0,
    blog: 0,
    others: 0
  };

  for (const url of allUrlsList) {
    try {
      const u = new URL(url);
      const path = u.pathname;
      if (path.includes("/shop") || path.includes("/laden") || path.includes("/winkel") || path.includes("/butik") || path.includes("/butikk")) {
        patternCounts.shop++;
      } else if (path.includes("/blog") || path.includes("/categoria")) {
        patternCounts.blog++;
      } else {
        patternCounts.others++;
      }
    } catch {}
  }

  console.log(`🎯 URL suddivisi per pattern:`);
  console.log(`  - Shop/Prodotti: ${patternCounts.shop} URL`);
  console.log(`  - Blog: ${patternCounts.blog} URL`);
  console.log(`  - Altro: ${patternCounts.others} URL\n`);

  // --- 4. CONTROLLO URL SOSPETTI ---
  console.log(`🕵️ URL SOSPETTI RILEVATI:`);
  let suspiciousCount = 0;

  const forbiddenWords = ["cart", "carrello", "checkout", "account", "login", "success", "api"];
  const testWords = ["test", "prova", "demo", "sandbox", "stripe", "payment"];

  for (const [sitemapName, urlList] of Object.entries({ pages: pagesUrls, products: productsUrls, blog: blogUrls })) {
    for (const url of urlList) {
      const u = new URL(url);
      const path = u.pathname;
      const segments = path.toLowerCase().split("/").filter(Boolean);

      // check forbidden
      const foundForbidden = forbiddenWords.find(w => segments.includes(w));
      if (foundForbidden) {
        console.log(`  [${sitemapName}] ❌ URL PROIBITO: ${url} (trovato segment: "${foundForbidden}")`);
        suspiciousCount++;
      }

      // check test
      const foundTest = testWords.find(w => segments.some(seg => seg.includes(w)));
      if (foundTest) {
        console.log(`  [${sitemapName}] ❌ URL DI TEST/SANBOX: ${url} (trovato segment contenente "${foundTest}")`);
        suspiciousCount++;
      }

      // check trailing slash
      if (path !== "/" && !path.endsWith("/")) {
        console.log(`  [${sitemapName}] ⚠️ MANCA TRAILING SLASH: ${url}`);
        suspiciousCount++;
      }

      // check classification mismatches
      if (sitemapName === "blog") {
        if (path.includes("/shop") || path.includes("/laden") || path.includes("/winkel") || path.includes("/butik") || path.includes("/butikk")) {
          console.log(`  [${sitemapName}] ❌ PRODOTTO NELLA SITEMAP BLOG: ${url}`);
          suspiciousCount++;
        }
      }
      if (sitemapName === "products") {
        if (path.includes("/blog") || path.includes("/categoria")) {
          console.log(`  [${sitemapName}] ❌ ARTICOLO BLOG NELLA SITEMAP PRODOTTI: ${url}`);
          suspiciousCount++;
        }
      }
    }
  }

  if (suspiciousCount === 0) {
    console.log(`  💚 Nessun URL proibito, di test, mal classificato o senza trailing slash rilevato nei file XML.`);
  }
  console.log("");

  // --- 5. ANALISI FONTI DATI (PRODOTTI & BLOG) ---
  console.log(`📁 DATI SORGENTE LOCALI:`);
  
  // Prodotti
  const catalog = await readCatalog();
  const indexableProducts = catalog.filter((p: any) => p.excludeFromSeo !== true);
  const excludedProducts = catalog.filter((p: any) => p.excludeFromSeo === true);

  console.log(`  - Prodotti Totali in products.json: ${catalog.length}`);
  console.log(`  - Prodotti Indicizzabili (Seo): ${indexableProducts.length}`);
  console.log(`  - Prodotti Esclusi Seo: ${excludedProducts.length}`);
  for (const p of excludedProducts) {
    console.log(`    - ID: "${p.id}", Slug: "${p.slug}" (Motivo: Prodotto di test o escluso da SEO)`);
  }
  console.log(`  - URL previsti per sitemap-products.xml: ${indexableProducts.length * 6} (6 lingue per prodotto)`);

  // Blog
  const totalBlogPosts = mockBlogPosts.length;
  console.log(`  - Articoli blog totali in blog-data.ts: ${totalBlogPosts}`);

  // Categorie Blog
  const blogCategories = new Set(mockBlogPosts.map(p => p.category));
  console.log(`  - Categorie blog uniche trovate: ${blogCategories.size} (${Array.from(blogCategories).join(", ")})`);
  console.log("");

  // --- 6. IDENTIFICAZIONE DISCREPANZA ---
  console.log(`🔍 DISCREPANZA CONTEGGI SITEMAP-PRODUCTS:`);
  if (productsUrls.length !== indexableProducts.length * 6) {
    console.log(`  ❌ Discrepanza trovata! La sitemap-products.xml ha ${productsUrls.length} URL anziché ${indexableProducts.length * 6}.`);
    // Vediamo quali prodotti del catalogo sono inclusi o mancanti
    const productSlugsInSitemap = new Set(productsUrls.map(url => {
      const parts = new URL(url).pathname.split("/").filter(Boolean);
      return parts[parts.length - 1]; // il penultimo o l'ultimo
    }));

    console.log(`  - Analisi corrispondenza slug prodotti in sitemap:`);
    for (const p of indexableProducts) {
      console.log(`    - Prodotto ID: "${p.id}"`);
      for (const loc of locales) {
        const slug = (p as any).slug || p.id;
        // get localized slug
        const hasIt = productSlugsInSitemap.has(slug);
        if (!hasIt) {
          // let's print localized slug checks later
        }
      }
    }
  } else {
    console.log(`  💚 sitemap-products.xml corrisponde esattamente al numero di prodotti indicizzabili (${indexableProducts.length}) * 6 lingue = ${productsUrls.length} URL.`);
  }

  console.log(`\n====================================================`);
  console.log(`✅ FINE CONTROLLI DIAGNOSTICI`);
  console.log(`====================================================`);
}

main().catch(err => {
  console.error("❌ Errore nello script di diagnostica:", err);
  process.exit(1);
});
