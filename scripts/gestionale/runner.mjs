/**
 * @file runner.mjs
 * @description Orchestratore principale dei test del gestionale.
 * Scansiona ed esegue in ordine sequenziale tutti i file di test "test-*.mjs"
 * presenti in questa cartella, raccoglie i risultati e genera un report
 * finale salvandolo in "scratch/gestionale-risultati/report.txt".
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { closePrisma } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..", "..");

async function main() {
  const reportDir = path.join(rootDir, "scratch", "gestionale-risultati");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "report.txt");

  let logOutput = "";
  function log(msg) {
    console.log(msg);
    logOutput += msg + "\n";
  }
  function logErr(msg) {
    console.error(msg);
    logOutput += msg + "\n";
  }

  log("==================================================");
  log("🚀 STARTING GESTIONALE ADMIN TEST SUITE");
  log("==================================================");

  const files = fs.readdirSync(__dirname);
  const testFiles = files
    .filter((f) => f.startsWith("test-") && f.endsWith(".mjs"))
    .sort();

  log(`Found ${testFiles.length} test script(s) to execute:`);
  testFiles.forEach((f) => log(`  - ${f}`));
  log("--------------------------------------------------\n");

  const results = [];

  for (const file of testFiles) {
    const filePath = path.join(__dirname, file);
    const fileUrl = new URL(`file://${filePath}`).href;

    log(`▶ Running ${file}...`);
    const startTime = Date.now();

    try {
      const module = await import(fileUrl);
      if (typeof module.run === "function") {
        // Intercept console.log to include inside our file report
        const origLog = console.log;
        const origErr = console.error;
        console.log = (...args) => {
          origLog(...args);
          logOutput += "   " + args.join(" ") + "\n";
        };
        console.error = (...args) => {
          origErr(...args);
          logOutput += "   ❌ " + args.join(" ") + "\n";
        };

        await module.run();

        console.log = origLog;
        console.error = origErr;

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        results.push({ file, success: true, duration });
      } else {
        throw new Error(`Exported function 'run' not found in ${file}`);
      }
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      logErr(`❌ Error executing ${file}: ${error.message}`);
      if (error.stack) {
        logOutput += error.stack + "\n";
      }
      results.push({ file, success: false, duration, error: error.message });
    }
  }

  // Ensure Prisma/DB connections are closed
  await closePrisma().catch((err) => {
    logErr(`Error closing Prisma client connection: ${err.message}`);
  });

  log("\n==================================================");
  log("📊 GESTIONALE ADMIN TEST SUITE SUMMARY");
  log("==================================================");

  let passedCount = 0;
  let failedCount = 0;

  results.forEach((r) => {
    if (r.success) {
      passedCount++;
      log(`✅ ${r.file} PASSED (${r.duration}s)`);
    } else {
      failedCount++;
      log(`❌ ${r.file} FAILED (${r.duration}s) - Error: ${r.error}`);
    }
  });

  log("--------------------------------------------------");
  log(`Total: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
  log("==================================================");

  // Write report text to file
  const reportHeader = `==================================================
GESTIONALE ADMIN TEST SUITE REPORT
Run Date: ${new Date().toISOString()}
==================================================\n\n`;

  fs.writeFileSync(reportPath, reportHeader + logOutput, "utf8");
  console.log(`\n💾 Report salvato con successo in: ${reportPath}\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal error running test suite:", err);
  process.exit(1);
});
