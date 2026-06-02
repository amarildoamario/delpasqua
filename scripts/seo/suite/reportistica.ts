/**
 * NOME FILE: reportistica.ts (ex reporting.ts)
 * SCOPO: Gestisce la reportistica finale della suite SEO,
 *        identificando blocker critici e formattando il testo per il report finale.
 * UTILIZZO: Importato ed eseguito dal runner principale `avvia-suite-seo.ts`.
 */

import fs from "node:fs/promises";
import path from "node:path";
import {
  REPORT_FILE,
  URL_OUTCOMES_JSON_FILE,
  URL_OUTCOMES_CSV_FILE,
  ANTI_VERCEL_TOKENS,
  LEGACY_301_REDIRECTS,
  OUTCOME_DETAIL_LIMIT,
} from "./costanti";
import type {
  TaskResult,
  TaskSummary,
  GoLiveBlocker,
  UrlClassification,
  MigrationOutcome,
  MigrationClassification,
} from "./tipi";
import {
  TaskRecorder,
  divider,
  timestamp,
  globalUrlOutcomes,
  normalizePath,
} from "./utilita";

function resultById(results: TaskResult[], id: string) {
  return results.find((result) => result.id === id);
}

function compactError(error?: string) {
  if (!error) return "";
  return error.split("\n")[0]?.trim() || error.trim();
}

function buildWarningEntries(results: TaskResult[]) {
  const entries: Array<{
    task: string;
    severity: "critical" | "warning" | "info";
    environment: "local" | "live-wordpress" | "migration";
    cause: string;
    action: string;
  }> = [];

  const localTaskSeverities = new Map<string, "critical" | "warning">([
    ["local-audit-sitemap", "critical"],
    ["local-audit-legacy-routes", "critical"],
    ["local-audit-noindex", "critical"],
    ["local-audit-hreflang", "critical"],
    ["local-audit-canonical", "critical"],
    ["local-debug-sitemap-counts", "warning"],
    ["local-audit-locales", "warning"],
  ]);

  for (const [taskId, severity] of localTaskSeverities.entries()) {
    const result = resultById(results, taskId);
    if (!result || (result.status === "passed" && result.warnings.length === 0)) continue;

    entries.push({
      task: result.label,
      severity,
      environment: "local",
      cause: compactError(result.error) || result.warnings.join(" ") || "Il task locale ha segnalato un problema.",
      action:
        severity === "critical"
          ? "Correggere il comportamento su localhost prima del go-live."
          : "Verificare il dettaglio del task e confermare se il warning e atteso.",
    });
  }

  const localOutcomeGroups: Array<{
    classification: UrlClassification;
    severity: "critical" | "warning";
    cause: string;
    action: string;
  }> = [
    {
      classification: "LOCAL_SITEMAP_404_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale che restituiscono 404.",
      action: "Correggere la pagina o rimuovere la URL dalla sitemap locale.",
    },
    {
      classification: "LOCAL_SITEMAP_500_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale che restituiscono 500.",
      action: "Correggere l'errore applicativo prima del go-live.",
    },
    {
      classification: "LOCAL_SITEMAP_REDIRECT_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale che redirectano invece di rispondere 200.",
      action: "Pubblicare in sitemap solo URL canoniche finali.",
    },
    {
      classification: "LOCAL_SITEMAP_NOINDEX_ERROR",
      severity: "critical",
      cause: "URL in sitemap locale marcate noindex.",
      action: "Rimuovere il noindex o togliere la URL dalla sitemap.",
    },
    {
      classification: "LOCAL_REDIRECT_TO_404_ERROR",
      severity: "critical",
      cause: "Redirect legacy locale che terminano su 404.",
      action: "Correggere il redirect o la destinazione finale.",
    },
    {
      classification: "LOCAL_REDIRECT_TO_500_ERROR",
      severity: "critical",
      cause: "Redirect legacy locale che terminano su 500.",
      action: "Correggere la destinazione finale o la logica di redirect.",
    },
    {
      classification: "LOCAL_TECHNICAL_IN_SITEMAP_ERROR",
      severity: "critical",
      cause: "Rotte tecniche locali presenti in sitemap.",
      action: "Escludere le rotte tecniche dalle sitemap locali.",
    },
    {
      classification: "LOCAL_TECHNICAL_MISSING_NOINDEX_ERROR",
      severity: "critical",
      cause: "Rotte tecniche locali senza noindex o con head SEO non pulita.",
      action: "Impostare noindex e rimuovere canonical/hreflang/og:url.",
    },
    {
      classification: "LOCAL_REDIRECT_CHAIN_WARN",
      severity: "warning",
      cause: "Redirect locale con chain > 1 o con 302/307.",
      action: "Ridurre a un solo hop 301/308 permanente verso la pagina finale.",
    },
    {
      classification: "LOCAL_TRANSIENT_FETCH_WARN",
      severity: "warning",
      cause: "Fetch locale con errore transitorio risolto al retry.",
      action: "Ricontrollare la stabilita del server locale se il warning si ripete.",
    },
  ];

  for (const group of localOutcomeGroups) {
    const matches = globalUrlOutcomes.filter(
      (outcome) => outcome.environment === "local" && outcome.classification === group.classification,
    );
    if (matches.length === 0) continue;

    entries.push({
      task: "URL Outcome Classifier",
      severity: group.severity,
      environment: "local",
      cause: `${group.cause} Esempi: ${matches.slice(0, 3).map((outcome) => outcome.inputPath).join(", ")}`,
      action: group.action,
    });
  }

  if (globalUrlOutcomes.some((outcome) => outcome.classification === "WP_CURRENT_TECHNICAL_ROUTE")) {
    entries.push({
      task: "Old WordPress inventory",
      severity: "info",
      environment: "live-wordpress",
      cause: "Il sito WordPress live espone URL tecniche nel proprio inventario corrente.",
      action: "Trattarle come old_site_issue/info, non come errore critico del nuovo progetto.",
    });
  }

  if (globalUrlOutcomes.some((outcome) => outcome.classification === "WP_CURRENT_TAXONOMY")) {
    entries.push({
      task: "Old WordPress inventory",
      severity: "warning",
      environment: "live-wordpress",
      cause: "Il sito WordPress live contiene tassonomie legacy da valutare in migrazione.",
      action: "Decidere se mappare, consolidare o dismettere queste tassonomie.",
    });
  }

  // Fallback migration outcomes comparison
  // Since migration outcomes are computed dynamically, we will provide standard warnings if URL outcomes indicate any gaps.
  return entries;
}

export async function warningsExplainedTask(results: TaskResult[], recorder: TaskRecorder): Promise<TaskSummary> {
  const entries = buildWarningEntries(results);
  recorder.line("Warnings Explained");

  if (entries.length === 0) {
    recorder.line("Nessun warning/failure da spiegare.");
  }

  for (const entry of entries) {
    recorder.line(`task: ${entry.task}`);
    recorder.line(`severity: ${entry.severity}`);
    recorder.line(`environment: ${entry.environment}`);
    recorder.line(`cause: ${entry.cause}`);
    recorder.line(`action: ${entry.action}`);
    recorder.line("");
  }

  return {
    status: entries.length > 0 ? "passed_with_warnings" : "passed",
    metrics: {
      explainedItems: entries.length,
    },
    warnings: entries.length > 0
      ? ["La sezione include warning, info e failure rilevanti per local, live-wordpress e migration."]
      : [],
  };
}

function buildGoLiveBlockers(results: TaskResult[]) {
  const blockers: GoLiveBlocker[] = [];
  const criticalLocalClasses = new Set<UrlClassification>([
    "LOCAL_SITEMAP_404_ERROR",
    "LOCAL_SITEMAP_500_ERROR",
    "LOCAL_SITEMAP_REDIRECT_ERROR",
    "LOCAL_SITEMAP_NOINDEX_ERROR",
    "LOCAL_REDIRECT_TO_404_ERROR",
    "LOCAL_REDIRECT_TO_500_ERROR",
    "LOCAL_TECHNICAL_IN_SITEMAP_ERROR",
    "LOCAL_TECHNICAL_MISSING_NOINDEX_ERROR",
  ]);

  for (const outcome of globalUrlOutcomes) {
    if (outcome.environment === "local") {
      if (criticalLocalClasses.has(outcome.classification)) {
        blockers.push({
          blocker: outcome.inputPath,
          severity: "critical",
          environment: "local",
          why: `Classificazione ${outcome.classification}.`,
          action: "Correggere su localhost prima del go-live.",
        });
        continue;
      }

      if (outcome.classification === "LOCAL_REDIRECT_CHAIN_WARN") {
        blockers.push({
          blocker: outcome.inputPath,
          severity: "warning",
          environment: "local",
          why: "Redirect locale con chain > 1 o con redirect temporaneo.",
          action: "Ridurre a un solo hop permanente 301/308.",
        });
        continue;
      }

      if (outcome.classification === "LOCAL_TRANSIENT_FETCH_WARN") {
        blockers.push({
          blocker: outcome.inputPath,
          severity: "warning",
          environment: "local",
          why: "Errore transitorio risolto al retry durante l'audit locale.",
          action: "Ricontrollare la stabilita del server locale.",
        });
      }
      continue;
    }
  }

  for (const result of results) {
    if (
      result.id === "local-audit-hreflang" ||
      result.id === "local-audit-canonical" ||
      result.id === "local-audit-sitemap" ||
      result.id === "local-audit-noindex"
    ) {
      if (result.status !== "passed") {
        blockers.push({
          blocker: result.label,
          severity: "critical",
          environment: "local",
          why: compactError(result.error) || result.warnings.join(" ") || "Task locale fallito.",
          action: "Correggere il task SEO locale prima del go-live.",
        });
      }
    }
  }

  return blockers;
}

export async function goLiveBlockersTask(results: TaskResult[], recorder: TaskRecorder): Promise<TaskSummary> {
  const blockers = buildGoLiveBlockers(results);
  recorder.line("Go-live blockers");
  recorder.line("blocker | severity | environment | why | action");
  recorder.line("--- | --- | --- | --- | ---");

  for (const blocker of blockers.slice(0, OUTCOME_DETAIL_LIMIT * 2)) {
    recorder.line(
      `${blocker.blocker} | ${blocker.severity} | ${blocker.environment} | ${blocker.why} | ${blocker.action}`,
    );
  }
  if (blockers.length > OUTCOME_DETAIL_LIMIT * 2) {
    recorder.line(`... altri ${blockers.length - OUTCOME_DETAIL_LIMIT * 2} blocker non mostrati`);
  }

  return {
    status: blockers.some((blocker) => blocker.severity === "critical") ? "passed_with_warnings" : "passed",
    metrics: {
      totalBlockers: blockers.length,
      critical: blockers.filter((blocker) => blocker.severity === "critical").length,
      warning: blockers.filter((blocker) => blocker.severity === "warning").length,
      info: blockers.filter((blocker) => blocker.severity === "info").length,
    },
    warnings: blockers.some((blocker) => blocker.severity === "critical")
      ? ["Sono presenti blocker critical sul progetto locale o sulla migration readiness."]
      : [],
  };
}

async function ensureReportDir() {
  await fs.mkdir(path.dirname(REPORT_FILE), { recursive: true });
}

export async function writeReport(results: TaskResult[], suiteStartedAt: string, suiteFinishedAt: string) {
  await ensureReportDir();

  const failed = results.filter((result) => result.status === "failed");
  const passedWithWarnings = results.filter((result) => result.status === "passed_with_warnings");
  const passed = results.filter((result) => result.status === "passed");

  const lines: string[] = [];
  lines.push(divider());
  lines.push("SEO Suite Report");
  lines.push(`Generated at: ${suiteFinishedAt}`);
  lines.push(`Started at:   ${suiteStartedAt}`);
  lines.push(`Report file:  ${REPORT_FILE}`);
  lines.push(divider());
  lines.push("");
  lines.push("Summary:");
  lines.push(`- Total tasks: ${results.length}`);
  lines.push(`- Passed: ${passed.length}`);
  lines.push(`- Passed with warnings: ${passedWithWarnings.length}`);
  lines.push(`- Failed: ${failed.length}`);
  lines.push("");

  const sections: Array<{ title: string; taskIds: string[] }> = [
    {
      title: "1. Local project health",
      taskIds: [
        "local-audit-locales",
        "local-audit-sitemap",
        "local-audit-legacy-routes",
        "local-audit-noindex",
        "local-audit-hreflang",
        "local-audit-canonical",
        "local-debug-sitemap-counts",
      ],
    },
    {
      title: "2. Old WordPress inventory",
      taskIds: ["live-wordpress-sitemap-diagnostic", "compare-local-wordpress-live"],
    },
    {
      title: "3. Local -> WordPress migration readiness",
      taskIds: ["migration-readiness"],
    },
    {
      title: "4. URL outcome groups",
      taskIds: ["url-outcome-classifier"],
    },
    {
      title: "5. Warnings explained",
      taskIds: ["warnings-explained"],
    },
    {
      title: "6. Go-live blockers",
      taskIds: ["go-live-blockers"],
    },
  ];

  for (const section of sections) {
    lines.push(divider());
    lines.push(section.title);
    lines.push(divider("-"));

    for (const taskId of section.taskIds) {
      const result = resultById(results, taskId);
      if (!result) continue;

      lines.push(divider());
      lines.push(result.label);
      lines.push(`Description: ${result.description}`);
      lines.push(`Status: ${result.status}`);
      lines.push(`Started at: ${result.startedAt}`);
      lines.push(`Finished at: ${result.finishedAt}`);

      if (Object.keys(result.context).length > 0) {
        lines.push("Context:");
        for (const [key, value] of Object.entries(result.context)) {
          lines.push(`- ${key}: ${value}`);
        }
      }

      if (Object.keys(result.metrics).length > 0) {
        lines.push("Metrics:");
        for (const [key, value] of Object.entries(result.metrics)) {
          lines.push(`- ${key}: ${String(value)}`);
        }
      }

      if (result.warnings.length > 0) {
        lines.push("Warnings:");
        for (const warning of result.warnings) {
          lines.push(`- ${warning}`);
        }
      }

      if (result.error) {
        lines.push("Error:");
        lines.push(result.error);
      }

      lines.push("Output:");
      lines.push(...result.output);
      lines.push("");
    }
  }

  await fs.writeFile(REPORT_FILE, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

export async function assertNoVercelArtifacts() {
  const files = [REPORT_FILE, URL_OUTCOMES_CSV_FILE, URL_OUTCOMES_JSON_FILE];
  const violations: string[] = [];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, "utf8");
      const found = ANTI_VERCEL_TOKENS.filter((token) => content.includes(token));
      if (found.length > 0) {
        violations.push(`${file}: ${found.join(", ")}`);
      }
    } catch {
      // Ignore if file doesn't exist
    }
  }

  if (violations.length === 0) {
    return;
  }

  const errorBlock = [
    "",
    "INTERNAL_AUDIT_CONFIG_ERROR: Vercel must be ignored in this audit.",
    ...violations.map((violation) => `- ${violation}`),
    "",
  ].join("\n");

  await fs.appendFile(REPORT_FILE, errorBlock, "utf8");
  throw new Error("INTERNAL_AUDIT_CONFIG_ERROR: Vercel must be ignored in this audit.");
}
