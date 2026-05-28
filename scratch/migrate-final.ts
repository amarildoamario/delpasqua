import fs from "node:fs";
import path from "node:path";
import { mockBlogPosts } from "../src/lib/blog-data";
import { BLOG_POST_TRANSLATIONS } from "../src/lib/blogTranslationsData";

const TARGET_IDS = [
  "info-1",
  "info-2",
  "info-4",
  "info-5",
  "info-6",
  "info-7",
  "info-8",
  "info-9",
  "info-10",
  "chim-3",
  "chim-4",
  "chim-5",
  "chim-6",
  "chim-7",
  "dif-3",
  "dif-4",
  "ric-7",
  "ric-8",
  "ric-9",
  "fid-3",
  "fid-4",
  "fid-5",
  "faq-1"
];

const CANONICAL_CATEGORIES: Record<string, Record<string, string>> = {
  "Salute & Benessere": {
    it: "Salute & Benessere",
    en: "Health & Wellbeing",
    de: "Gesundheit & Wohlbefinden",
    nl: "Gezondheid & Welzijn",
    da: "Sundhed & Velvære",
    no: "Helse & Velvære"
  },
  "Chimica dell'olio di oliva": {
    it: "Chimica dell'olio di oliva",
    en: "Olive Oil Chemistry",
    de: "Olivenölchemie",
    nl: "Olijfoliechemie",
    da: "Olivenoliekemi",
    no: "Olivenoljekjemi"
  },
  "Consigli di acquisto": {
    it: "Consigli di acquisto",
    en: "Buying Guide",
    de: "Einkaufsführer",
    nl: "Koopgids",
    da: "Købsguide",
    no: "Kjøpsguide"
  },
  "Conservazione": {
    it: "Conservazione",
    en: "Storage & Preservation",
    de: "Lagerung & Aufbewahrung",
    nl: "Opslag & Bewaring",
    da: "Opbevaring",
    no: "Lagring"
  },
  "Consumo corretto": {
    it: "Consumo corretto",
    en: "Proper Usage",
    de: "Richtiges Genießen",
    nl: "Correct Gebruik",
    da: "Korrekt Forbrug",
    no: "Riktig Bruk"
  },
  "Ricette e abbinamenti": {
    it: "Ricette e abbinamenti",
    en: "Recipes & Pairings",
    de: "Rezepte & Kombinationen",
    nl: "Recepten & Combinaties",
    da: "Opskrifter & Parringer",
    no: "Oppskrifter & Parringer"
  },
  "Il nostro frantoio": {
    it: "Il nostro frantoio",
    en: "Our Mill",
    de: "Unsere Ölmühle",
    nl: "Onze Perserij",
    da: "Vores Mølle",
    no: "Vår Mølle"
  },
  "Informazioni sull'olio EVO": {
    it: "Informazioni sull'olio EVO",
    en: "Olive Oil Information",
    de: "Olivenöl-Informationen",
    nl: "Olijfolie-informatie",
    da: "Olivenolie-information",
    no: "Olivenolje-informasjon"
  },
  "Difetti dell'olio EVO": {
    it: "Difetti dell'olio EVO",
    en: "Olive Oil Defects",
    de: "Olivenölfehler",
    nl: "Olijfolie-defecten",
    da: "Olivenoliefejl",
    no: "Olivenoljefeil"
  }
};

const locales = ["it", "en", "de", "nl", "da", "no"] as const;

async function migrateMarkdown() {
  for (const id of TARGET_IDS) {
    console.log(`\nMigrating post ${id}...`);
    const basePost = mockBlogPosts.find(p => p.id === id);
    if (!basePost) {
      console.error(`Post with ID ${id} not found in mockBlogPosts!`);
      continue;
    }

    const folderName = basePost.slug;
    const folderPath = path.join(process.cwd(), "content", "blog", folderName);
    fs.mkdirSync(folderPath, { recursive: true });

    const translations = BLOG_POST_TRANSLATIONS[id];
    const itCat = basePost.category;
    const canonGroup = CANONICAL_CATEGORIES[itCat];

    if (!canonGroup) {
      console.error(`Invalid Italian category: "${itCat}" for post ${id}`);
      continue;
    }

    for (const locale of locales) {
      let title = basePost.title;
      let excerpt = basePost.excerpt;
      let category = canonGroup[locale]; // Use standardized category
      let slug = basePost.slug;
      let content = basePost.content;
      const references = basePost.references;

      if (locale !== "it") {
        const trans = translations?.[locale];
        if (trans) {
          title = trans.title;
          excerpt = trans.excerpt;
          slug = trans.slug;
          content = trans.content ?? basePost.content;
        } else {
          console.warn(`Translation for locale ${locale} not found for post ${id}!`);
        }
      }

      // Format references as YAML if present
      let refYaml = "";
      if (references && references.length > 0) {
        refYaml = "\nreferences:\n" + references.map(ref => {
          let str = `  - label: ${JSON.stringify(ref.label)}\n    url: ${JSON.stringify(ref.url)}`;
          if (ref.note) {
            str += `\n    note: ${JSON.stringify(ref.note)}`;
          }
          return str;
        }).join("\n");
      }

      const mdContent = `---
id: "${id}"
title: ${JSON.stringify(title)}
excerpt: ${JSON.stringify(excerpt)}
category: ${JSON.stringify(category)}
date: "${basePost.date}"
updateDate: "${basePost.updateDate}"
readingTime: "${basePost.readingTime}"
author: "${basePost.author}"
imageUrl: "${basePost.imageUrl}"${refYaml}
---

${content.trim()}
`;

      const mdPath = path.join(folderPath, `${locale}.md`);
      fs.writeFileSync(mdPath, mdContent, "utf8");
      console.log(`Created file ${mdPath}`);
    }
  }
}

async function cleanTranslationsFile() {
  const filePath = path.join(process.cwd(), "src", "lib", "blogTranslationsData.ts");
  let content = fs.readFileSync(filePath, "utf8");

  for (const id of TARGET_IDS) {
    console.log(`Cleaning translation content for ${id} in translations file...`);
    const escapedId = id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const blockRegex = new RegExp(`("${escapedId}"):\\s*\\{([\\s\\S]*?)\\n  \\},`, "g");
    
    content = content.replace(blockRegex, (match, key, block) => {
      // 1. Strip content property
      let cleanedBlock = block.replace(/\s*content:\s*`([\s\S]*?)`,?,?/g, "");
      
      // 2. Standardize categories inside this block
      const basePost = mockBlogPosts.find(p => p.id === id);
      const itCat = basePost?.category;
      if (itCat && CANONICAL_CATEGORIES[itCat]) {
        const canonGroup = CANONICAL_CATEGORIES[itCat];
        for (const loc of locales) {
          const canonCat = canonGroup[loc];
          const locRegex = new RegExp(`("${loc}"):\\s*\\{([\\s\\S]*?)\\bcategory:\\s*"[^"]*"`, "g");
          cleanedBlock = cleanedBlock.replace(locRegex, `$1: {$2category: "${canonCat}"`);
        }
      }

      return `${key}: {${cleanedBlock}\n  },`;
    });
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Translations file cleaned and standardized successfully!");
}

async function main() {
  await migrateMarkdown();
  await cleanTranslationsFile();
  console.log("\nMigration, cleanup, and category standardization completed successfully!");
}

main().catch(console.error);
