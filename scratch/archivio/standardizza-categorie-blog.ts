import fs from "node:fs";
import path from "node:path";
import { mockBlogPosts } from "../src/lib/blog-data";
import { BLOG_POST_TRANSLATIONS } from "../src/lib/blogTranslationsData";

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

// 1. Standardize blogTranslationsData.ts
function standardizeTranslationsFile() {
  const filePath = path.join(process.cwd(), "src", "lib", "blogTranslationsData.ts");
  let content = fs.readFileSync(filePath, "utf8");

  for (const [id, trans] of Object.entries(BLOG_POST_TRANSLATIONS)) {
    const itCat = trans.it?.category;
    if (!itCat || !CANONICAL_CATEGORIES[itCat]) {
      console.warn(`Post ${id} has no valid Italian category: "${itCat}"`);
      continue;
    }

    const canonGroup = CANONICAL_CATEGORIES[itCat];
    const escapedId = id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Find the block for this ID in the file
    const blockRegex = new RegExp(`("${escapedId}"):\\s*\\{([\\s\\S]*?)\\n  \\},`, "g");
    
    content = content.replace(blockRegex, (match, key, block) => {
      let updatedBlock = block;
      for (const loc of locales) {
        const canonCat = canonGroup[loc];
        // We match "loc": { ... category: "..." }
        // Let's use a regex to replace category inside that locale sub-block
        const locRegex = new RegExp(`("${loc}"):\\s*\\{([\\s\\S]*?)\\bcategory:\\s*"[^"]*"`, "g");
        updatedBlock = updatedBlock.replace(locRegex, `$1: {$2category: "${canonCat}"`);
      }
      return `${key}: {${updatedBlock}\n  },`;
    });
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Translations file categories standardized successfully!");
}

// 2. Standardize generated Markdown files
function standardizeMarkdownFiles() {
  const blogDir = path.join(process.cwd(), "content", "blog");
  if (!fs.existsSync(blogDir)) {
    console.log("No content/blog folder found.");
    return;
  }

  const folders = fs.readdirSync(blogDir).filter(f => fs.statSync(path.join(blogDir, f)).isDirectory());

  for (const folder of folders) {
    const folderPath = path.join(blogDir, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".md"));

    for (const file of files) {
      const locale = file.replace(".md", "");
      if (!locales.includes(locale as any)) continue;

      const filePath = path.join(folderPath, file);
      let content = fs.readFileSync(filePath, "utf8");

      // Extract category and id from frontmatter
      const idMatch = content.match(/^id:\s*"([^"]+)"/m);
      if (!idMatch) continue;
      const id = idMatch[1];

      const trans = BLOG_POST_TRANSLATIONS[id];
      const itCat = trans?.it?.category;
      if (!itCat || !CANONICAL_CATEGORIES[itCat]) continue;

      const canonCat = CANONICAL_CATEGORIES[itCat][locale];
      
      // Replace category in frontmatter
      content = content.replace(/^category:\s*"[^"]*"/m, `category: "${canonCat}"`);
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Standardized markdown category in ${filePath} to "${canonCat}"`);
    }
  }
}

// 3. Standardize TS files categories to match exactly Italian canonicals
const tsFiles = [
  path.join(process.cwd(), "src", "lib", "blog-posts-tecnici.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-commercial.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-recipes.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-extra.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-batch2.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-info.ts"),
  path.join(process.cwd(), "src", "lib", "blog-data.ts")
];

function standardizeTsFiles() {
  for (const filePath of tsFiles) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, "utf8");

    // Standardize category mappings in these files
    // Let's replace spelling variants of Italian categories
    const mappings: Record<string, string> = {
      '"Salute & Benessere"': '"Salute & Benessere"',
      '"Chimica dell\'olio di oliva"': '"Chimica dell\'olio di oliva"',
      '"Consigli di acquisto"': '"Consigli di acquisto"',
      '"Conservazione"': '"Conservazione"',
      '"Consumo corretto"': '"Consumo corretto"',
      '"Ricette e abbinamenti"': '"Ricette e abbinamenti"',
      '"Il nostro frantoio"': '"Il nostro frantoio"',
      '"Informazioni sull\'olio EVO"': '"Informazioni sull\'olio EVO"',
      '"Difetti dell\'olio EVO"': '"Difetti dell\'olio EVO"'
    };

    for (const [bad, good] of Object.entries(mappings)) {
      content = content.replace(new RegExp(`category:\\s*${bad}`, "g"), `category: ${good}`);
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Standardized category strings in TS file: ${filePath}`);
  }
}

async function main() {
  standardizeTranslationsFile();
  standardizeMarkdownFiles();
  standardizeTsFiles();
  console.log("\nAll category names successfully standardized across all files and locales!");
}

main().catch(console.error);
