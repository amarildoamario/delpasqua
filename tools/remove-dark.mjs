import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "src");
const exts = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      out.push(...walk(full));
    } else if (e.isFile()) {
      if (exts.has(path.extname(e.name))) out.push(full);
    }
  }
  return out;
}

function stripDarkTokensInsideString(s) {
  // rimuove token dark:* preservando gli altri, senza “attaccare” parole
  // es: "a dark:bg-x b" -> "a b"
  const parts = s.split(/\s+/).filter(Boolean);
  const cleaned = parts.filter((t) => !t.startsWith("dark:"));
  return cleaned.join(" ");
}

// parser semplice: scorre il testo e riscrive solo dentro stringhe
function processSource(src) {
  let out = "";
  let i = 0;

  while (i < src.length) {
    const ch = src[i];

    // stringhe: ', ", `
    if (ch === "'" || ch === '"' || ch === "`") {
      const quote = ch;
      out += quote;
      i++;

      let buf = "";
      let escaped = false;

      while (i < src.length) {
        const c = src[i];

        if (quote !== "`") {
          // ' e "
          if (!escaped && c === quote) break;
          if (!escaped && c === "\\") {
            escaped = true;
            buf += c;
            i++;
            continue;
          }
          escaped = false;
          buf += c;
          i++;
        } else {
          // template literal `...`
          // se trovi ${...} lo copi com’è senza modificarlo
          if (!escaped && c === "`") break;
          if (!escaped && c === "\\" ) {
            escaped = true;
            buf += c;
            i++;
            continue;
          }
          escaped = false;

          if (c === "$" && src[i + 1] === "{") {
            // ripulisci la parte “testo” accumulata prima di ${}
            const cleaned = buf.includes("dark:")
              ? stripDarkTokensInsideString(buf)
              : buf;
            out += cleaned;
            buf = "";

            // copia ${ ... } bilanciando parentesi graffe
            out += "${";
            i += 2;
            let depth = 1;
            while (i < src.length && depth > 0) {
              const cc = src[i];
              out += cc;
              if (cc === "{") depth++;
              else if (cc === "}") depth--;
              i++;
            }
            continue;
          }

          buf += c;
          i++;
        }
      }

      // fine stringa
      const cleaned = buf.includes("dark:")
        ? stripDarkTokensInsideString(buf)
        : buf;

      out += cleaned;

      // chiusura quote
      if (i < src.length && src[i] === quote) {
        out += quote;
        i++;
      }
      continue;
    }

    // normale
    out += ch;
    i++;
  }

  return out;
}

const files = walk(TARGET_DIR);
let changed = 0;

for (const f of files) {
  const before = fs.readFileSync(f, "utf8");
  const after = processSource(before);
  if (after !== before) {
    fs.writeFileSync(f, after, "utf8");
    changed++;
    console.log("UPDATED:", path.relative(ROOT, f));
  }
}

console.log(`\nDone. Files updated: ${changed}/${files.length}`);