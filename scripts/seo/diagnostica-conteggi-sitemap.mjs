/**
 * NOME FILE: diagnostica-conteggi-sitemap.mjs (ex debug-sitemap-counts.mjs)
 * SCOPO: Wrapper JavaScript one-shot per avviare il tool di diagnostica dei conteggi sitemap TypeScript.
 * UTILIZZO: npm run seo:debug-sitemap-counts o node scripts/diagnostica-conteggi-sitemap.mjs
 */

import { spawnSync } from "child_process";

// Esegue lo script TypeScript diagnostica-conteggi-sitemap.ts usando tsx
const result = spawnSync("npx", ["tsx", "scripts/diagnostica-conteggi-sitemap.ts"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status || 0);
