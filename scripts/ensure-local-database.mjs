import dotenv from "dotenv";
import pg from "pg";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { databasePolicy } from "../src/lib/server/databaseSafety.mjs";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });
const policy = databasePolicy();
if (policy.mode !== "local-development" || process.env.LOCAL_DATABASE_PROVIDER !== "prisma-dev") {
  console.log(policy.readOnly ? "[dev] Database remoto protetto in sola lettura." : "[dev] Database di sviluppo configurato.");
} else {
  async function ready() {
    const client = new pg.Client({ connectionString: policy.connectionString, connectionTimeoutMillis: 1500 });
    try { await client.connect(); await client.query("SELECT 1"); return true; }
    catch { return false; }
    finally { await client.end().catch(() => undefined); }
  }
  if (!(await ready())) {
    console.log("[dev] Avvio del database locale isolato delpasqua-dev...");
    const require = createRequire(import.meta.url);
    let started = false;
    for (let attempt = 0; attempt < 4; attempt++) {
      const result = spawnSync(process.execPath, [require.resolve("prisma/build/index.js"), "dev", "--name", "delpasqua-dev", "--detach"], { encoding: "utf8", windowsHide: true });
      if (result.status === 0 || await ready()) { started = true; break; }
      // Prisma may still be flushing the local database just after a stop.
      if (!/lock file|already being held/i.test(`${result.stdout || ""} ${result.stderr || ""}`)) break;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
    if (!started) throw new Error("Impossibile avviare il database locale. Nessuna connessione di ripiego alla produzione.");
    let available = false;
    for (let i = 0; i < 20; i++) { if (await ready()) { available = true; break; } await new Promise((resolve) => setTimeout(resolve, 250)); }
    if (!available) throw new Error("Database locale non raggiungibile. Avvio interrotto senza usare la produzione.");
  }
  console.log("[dev] Database locale pronto. I salvataggi restano sul computer.");
}
