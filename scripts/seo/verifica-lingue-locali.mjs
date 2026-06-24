/**
 * NOME FILE: verifica-lingue-locali.mjs (ex audit-locales.mjs)
 * SCOPO: Naviga le pagine localizzate principali e segnala la presenza di parole UI della lingua sbagliata
 *        (ad es. controllando che testi italiani non compaiano nella versione inglese e viceversa).
 * UTILIZZO: npm run seo:audit-locales o node scripts/verifica-lingue-locali.mjs
 */

import fetch from "node-fetch";

// Default base URL to local environment
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Active locales configured in Del Pasqua
const LOCALES = ["it", "en", "de", "nl", "da", "no", "es", "fr", "us"];

// Route mapping per language
const ROUTE_MAPS = {
  "/": {
    it: "/",
    en: "/en",
    de: "/de",
    nl: "/nl",
    da: "/da",
    no: "/no",
    es: "/es",
    fr: "/fr",
    us: "/us",
  },
  "/shop": {
    it: "/shop",
    en: "/en/shop",
    de: "/de/laden",
    nl: "/nl/winkel",
    da: "/da/butik",
    no: "/no/butikk",
    es: "/es/tienda",
    fr: "/fr/boutique",
    us: "/us/shop",
  },
  "/storia": {
    it: "/storia",
    en: "/en/about-us",
    de: "/de/ueber-uns",
    nl: "/nl/over-ons",
    da: "/da/om-os",
    no: "/no/om-oss",
    es: "/es/sobre-nosotros",
    fr: "/fr/a-propos",
    us: "/us/about-us",
  },
  "/produzione": {
    it: "/produzione",
    en: "/en/production",
    de: "/de/produktion",
    nl: "/nl/productie",
    da: "/da/produktion",
    no: "/no/produksjon",
    es: "/es/produccion",
    fr: "/fr/production",
    us: "/us/production",
  },
  "/degustazioni": {
    it: "/degustazioni",
    en: "/en/tastings",
    de: "/de/verkostungen",
    nl: "/nl/proeverijen",
    da: "/da/smagninger",
    no: "/no/smakinger",
    es: "/es/degustaciones",
    fr: "/fr/degustations",
    us: "/us/tastings",
  },
  "/contatti": {
    it: "/contatti",
    en: "/en/contact",
    de: "/de/kontakt",
    nl: "/nl/contact",
    da: "/da/kontakt",
    no: "/no/kontakt",
    es: "/es/contacto",
    fr: "/fr/contact",
    us: "/us/contact",
  },
  "/cart": {
    it: "/carrello",
    en: "/en/cart",
    de: "/de/warenkorb",
    nl: "/nl/winkelwagen",
    da: "/da/kurv",
    no: "/no/handlekurv",
    es: "/es/carrito",
    fr: "/fr/panier",
    us: "/us/cart",
  },
};

// Lists of strictly language-specific UI keywords that should NOT appear in other languages
const FORBIDDEN_WORDS = {
  // Italian words that must NOT appear on non-Italian pages
  it_words: [
    "aggiungi al carrello",
    "carrello vuoto",
    "spedizione gratuita",
    "spedizione rapida",
    "frantoio di famiglia",
    "degustazioni disponibili",
    "torna allo shop",
    "visualizza carrello",
    "continua lo shopping",
    "svuota carrello",
    "formato selezionato",
    "prodotto esaurito",
    "vai al checkout",
    "politica parità di genere",
    "pagamenti sicuri",
    "tutti i diritti riservati",
    "qualcosa si è rotto",
    "dettagli tecnici",
  ],
  // English words/phrases that must NOT appear on Italian pages (or other non-English pages)
  en_words: [
    "add to cart",
    "shopping cart",
    "free shipping",
    "fast shipping",
    "family mill",
    "tastings available",
    "back to shop",
    "view cart",
    "continue shopping",
    "clear cart",
    "selected size",
    "product sold out",
    "go to checkout",
    "gender equality policy",
    "secure payments",
    "all rights reserved",
    "something went wrong",
    "technical details",
  ],
};

// Decode basic HTML entities
function decodeHtml(html) {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"');
}

// Clean and extract visible text from HTML
function extractVisibleText(html) {
  // Strip out non-renderable blocks
  let clean = html
    .replace(/<head[^>]*>([\s\S]*?)<\/head>/gi, "")
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, "")
    .replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, "");

  // Extract all text content
  clean = clean.replace(/<[^>]+>/g, " ");
  return decodeHtml(clean).replace(/\s+/g, " ").trim();
}

// Extract attributes like alt, title, placeholder, aria-label from HTML
function extractAttributes(html) {
  const attributes = [];
  const regexes = [
    /placeholder=["']([^"']+)["']/gi,
    /aria-label=["']([^"']+)["']/gi,
    /title=["']([^"']+)["']/gi,
    /alt=["']([^"']+)["']/gi,
  ];

  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(html)) !== null) {
      attributes.push(decodeHtml(match[1]));
    }
  }

  return attributes;
}

async function auditPage(url, locale) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { success: false, error: `HTTP status ${res.status}` };
    }

    const html = await res.text();
    const visibleText = extractVisibleText(html);
    const attributes = extractAttributes(html);

    // Combine all scanned text
    const allTextToScan = [visibleText, ...attributes].join(" | ");

    const violations = [];

    // If page is NOT Italian, it should NOT contain Italian-only UI words
    if (locale !== "it") {
      for (const word of FORBIDDEN_WORDS.it_words) {
        if (allTextToScan.toLowerCase().includes(word.toLowerCase())) {
          violations.push({ word, detectedIn: locale, expected: `NOT it` });
        }
      }
    }

    // If page is Italian, it should NOT contain English UI words
    if (locale === "it") {
      for (const word of FORBIDDEN_WORDS.en_words) {
        if (allTextToScan.toLowerCase().includes(word.toLowerCase())) {
          violations.push({ word, detectedIn: locale, expected: `NOT en` });
        }
      }
    }

    return { success: true, violations };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log(`========================================`);
  console.log(`Starting SEO Locales Audit`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Locales to test: ${LOCALES.join(", ")}`);
  console.log(`========================================\n`);

  let totalViolations = 0;
  let skippedPages = 0;

  for (const [route, localesMap] of Object.entries(ROUTE_MAPS)) {
    console.log(`Auditing route: ${route}`);
    for (const locale of LOCALES) {
      const path = localesMap[locale];
      const url = `${BASE_URL}${path}`;

      process.stdout.write(`  - Locale [${locale}] -> ${url} ... `);

      const result = await auditPage(url, locale);

      if (!result.success) {
        console.log(`⚠️ SKIPPED (${result.error})`);
        skippedPages++;
        continue;
      }

      if (result.violations.length === 0) {
        console.log(`✅ OK`);
      } else {
        console.log(`❌ FAIL`);
        totalViolations += result.violations.length;
        for (const v of result.violations) {
          console.log(`     > Found suspicious string: "${v.word}" (Language should be coherent with ${locale})`);
        }
      }
    }
    console.log("");
  }

  console.log(`========================================`);
  console.log(`Audit Summary:`);
  console.log(`- Mixed language violations found: ${totalViolations}`);
  console.log(`- Pages skipped/offline: ${skippedPages}`);
  console.log(`========================================`);

  if (totalViolations > 0) {
    console.log(`\nResult: ❌ FAILED (Mixed strings found!)`);
    process.exit(1);
  } else if (skippedPages > 0) {
    console.log(`\nResult: ⚠️ PASSED WITH WARNINGS (Some pages could not be reached, ensure the dev server is running at ${BASE_URL})`);
    process.exit(0);
  } else {
    console.log(`\nResult: ✅ SUCCESS (Clean languages, no mixed strings found!)`);
    process.exit(0);
  }
}

main();
