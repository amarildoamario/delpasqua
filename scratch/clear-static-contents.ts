import fs from "node:fs";
import path from "node:path";

const filesToClear = [
  path.join(process.cwd(), "src", "lib", "blog-posts-tecnici.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-commercial.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-extra.ts")
];

function clearStaticContents() {
  for (const filePath of filesToClear) {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    console.log(`Clearing content fields in ${filePath}...`);
    let content = fs.readFileSync(filePath, "utf8");

    // Replace content: `...` with content: ""
    // We match any spacing and the backticks
    const regex = /\bcontent:\s*`([\s\S]*?)`/g;
    content = content.replace(regex, 'content: ""');

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Cleared ${filePath} successfully!`);
  }
}

clearStaticContents();
