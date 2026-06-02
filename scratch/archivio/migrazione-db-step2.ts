import fs from "node:fs";
import path from "node:path";
import { mockBlogPosts } from "../src/lib/blog-data";
import { BLOG_POST_TRANSLATIONS } from "../src/lib/blogTranslationsData";

const TARGET_IDS = [
  "tec-1",
  "tec-2",
  "tec-3",
  "com-2",
  "com-4",
  "com-6",
  "com-8",
  "dif-1",
  "dif-2",
  "chim-1",
  "chim-2",
  "fid-1",
  "fid-2",
  "glos-1"
];

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

    for (const locale of locales) {
      let title = basePost.title;
      let excerpt = basePost.excerpt;
      let category = basePost.category;
      let slug = basePost.slug;
      let content = basePost.content;
      const references = basePost.references;

      if (locale !== "it") {
        const trans = translations?.[locale];
        if (trans) {
          title = trans.title;
          excerpt = trans.excerpt;
          category = trans.category;
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
      const cleanedBlock = block.replace(/\s*content:\s*`([\s\S]*?)`,?,?/g, "");
      return `${key}: {${cleanedBlock}\n  },`;
    });
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Translations file cleaned successfully!");
}

async function main() {
  await migrateMarkdown();
  await cleanTranslationsFile();
  console.log("\nMigration & translation cleanup completed successfully!");
}

main().catch(console.error);
