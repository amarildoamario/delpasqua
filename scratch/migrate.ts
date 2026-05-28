import fs from "node:fs";
import path from "node:path";
import { mockBlogPosts } from "../src/lib/blog-data";
import { BLOG_POST_TRANSLATIONS } from "../src/lib/blogTranslationsData";

// List of post IDs to migrate in this run
const TARGET_IDS = [
  "ric-1",
  "ric-2",
  "ric-3",
  "ric-4",
  "ric-5",
  "ric-6"
];

const locales = ["it", "en", "de", "nl", "da", "no"] as const;

async function main() {
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
  console.log("\nMigration completed!");
}

main().catch(console.error);
