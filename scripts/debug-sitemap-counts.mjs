import { spawnSync } from "child_process";

// Esegue lo script TypeScript debug-sitemap-counts.ts usando tsx
const result = spawnSync("npx", ["tsx", "scripts/debug-sitemap-counts.ts"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status || 0);
