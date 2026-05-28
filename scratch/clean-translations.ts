import fs from "node:fs";
import path from "node:path";

const targetIds = [
  "post-use-2",
  "ric-1",
  "ric-2",
  "ric-3",
  "ric-4",
  "ric-5",
  "ric-6"
];

function cleanTranslations() {
  const filePath = path.join(process.cwd(), "src", "lib", "blogTranslationsData.ts");
  let content = fs.readFileSync(filePath, "utf8");

  for (const id of targetIds) {
    console.log(`Cleaning translation content for ${id}...`);
    const escapedId = id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const blockRegex = new RegExp(`("${escapedId}"):\\s*\\{([\\s\\S]*?)\\n  \\},`, "g");
    
    content = content.replace(blockRegex, (match, key, block) => {
      const cleanedBlock = block.replace(/\s*content:\s*`([\s\S]*?)`,?,?/g, "");
      return `${key}: {${cleanedBlock}\n  },`;
    });
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Translations cleaned successfully!");
}

cleanTranslations();
