import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "src");

const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      out.push(...walk(full));
    } else if (entry.isFile()) {
      if (exts.has(path.extname(entry.name))) out.push(full);
    }
  }
  return out;
}

const files = walk(TARGET_DIR);

const hits = [];
for (const file of files) {
  const txt = fs.readFileSync(file, "utf8");
  if (txt.includes("dark:") || /\b\.dark\b/.test(txt) || /\bhtml\.dark\b/.test(txt)) {
    // cerca righe “colpevoli”
    const lines = txt.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes("dark:") || /\b\.dark\b/.test(line) || /\bhtml\.dark\b/.test(line)) {
        hits.push({
          file: path.relative(ROOT, file),
          line: i + 1,
          text: line.trim().slice(0, 240),
        });
      }
    });
  }
}

if (hits.length) {
  console.error("\n❌ Dark mode references found:\n");
  for (const h of hits.slice(0, 200)) {
    console.error(`${h.file}:${h.line}  ${h.text}`);
  }
  if (hits.length > 200) console.error(`\n...and ${hits.length - 200} more`);
  process.exit(1);
}

console.log("✅ OK: no dark: / .dark found in src/");