import { BLOG_POST_TRANSLATIONS } from "../src/lib/blogTranslationsData";

const locales = ["it", "en", "de", "nl", "da", "no"] as const;

function checkCategories() {
  const categoryMapByLocale: Record<string, Set<string>> = {};
  for (const loc of locales) {
    categoryMapByLocale[loc] = new Set<string>();
  }

  for (const [id, trans] of Object.entries(BLOG_POST_TRANSLATIONS)) {
    for (const loc of locales) {
      const cat = trans[loc]?.category;
      if (cat) {
        categoryMapByLocale[loc].add(cat);
      }
    }
  }

  for (const loc of locales) {
    console.log(`\nLocale: ${loc.toUpperCase()}`);
    console.log("-------------------");
    for (const cat of Array.from(categoryMapByLocale[loc]).sort()) {
      console.log(` - "${cat}" (normalized: "${cat.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}")`);
    }
  }
}

checkCategories();
