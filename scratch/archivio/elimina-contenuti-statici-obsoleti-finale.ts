import fs from "node:fs";
import path from "node:path";

const filesToClear = [
  path.join(process.cwd(), "src", "lib", "blog-posts-info.ts"),
  path.join(process.cwd(), "src", "lib", "blog-posts-batch2.ts")
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
    const regex = /\bcontent:\s*`([\s\S]*?)`/g;
    content = content.replace(regex, 'content: ""');

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Cleared ${filePath} successfully!`);
  }
}

clearStaticContents();
