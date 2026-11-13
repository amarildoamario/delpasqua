import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { databasePolicy } from "../src/lib/server/databaseSafety.mjs";

const require = createRequire(import.meta.url);
function run(module, args) {
  const result = spawnSync(process.execPath, [require.resolve(module), ...args], { stdio: "inherit", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

// Schema changes run only inside the authorized production deployment.
// Local builds and previews retain the database's read-only safeguards.
if (process.env.VERCEL_ENV === "production") {
  if (databasePolicy().mode !== "deployed-production") throw new Error("Production migrations require the remote Vercel production environment.");
  console.log("[build] Applying pending schema migrations in Vercel production before building the application.");
  run("prisma/build/index.js", ["migrate", "deploy"]);
}
run("next/dist/bin/next", ["build"]);
