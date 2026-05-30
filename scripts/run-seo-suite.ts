import { TARGETS, COMPARISON_TARGETS, REPORT_FILE, WORDPRESS_SITEMAP_URLS } from "./seo-suite/constants";
import type { TaskResult } from "./seo-suite/types";
import { runTask, divider, timestamp } from "./seo-suite/utils";
import {
  auditLocales,
  auditSitemaps,
  auditLegacyRoutes,
  auditTechnicalNoindex,
  auditHreflang,
  auditCanonical,
  debugSitemapCounts,
  auditWordPressLiveSitemaps,
  compareSitemaps,
  auditAllUrlOutcomes,
  migrationReadinessTask,
} from "./seo-suite/audits";
import {
  warningsExplainedTask,
  goLiveBlockersTask,
  writeReport,
  assertNoVercelArtifacts,
} from "./seo-suite/reporting";

async function main() {
  const suiteStartedAt = timestamp();
  const results: TaskResult[] = [];

  console.log(divider());
  console.log("SEO Suite Runner (Modularized)");
  console.log(`Started at: ${suiteStartedAt}`);
  console.log(`TXT report:  ${REPORT_FILE}`);
  console.log(divider());
  console.log("");

  const localTarget = TARGETS.find((target) => target.id === "local");
  const liveWordPressTarget = TARGETS.find((target) => target.id === "live-wordpress");
  if (!localTarget || !liveWordPressTarget) {
    throw new Error("Configurazione target incompleta per local/live-wordpress.");
  }

  // 1. Audit Locales
  results.push(
    await runTask(
      {
        id: "local-audit-locales",
        label: `${localTarget.label} :: Locale audit`,
        description: "Controlla le pagine localizzate principali e segnala stringhe UI della lingua sbagliata.",
        context: { BASE_URL: localTarget.baseUrl },
      },
      async (recorder) => auditLocales(localTarget.baseUrl, recorder),
    ),
  );

  // 2. Audit Sitemaps
  results.push(
    await runTask(
      {
        id: "local-audit-sitemap",
        label: `${localTarget.label} :: Sitemap audit`,
        description: "Verifica indice sitemap, child sitemap, URL indicizzate, segmenti proibiti e homepage per locale.",
        context: { BASE_URL: localTarget.baseUrl },
      },
      async (recorder) => auditSitemaps(localTarget.baseUrl, recorder),
    ),
  );

  // 3. Audit Legacy Routes & 42 Indexed WordPress URLs
  results.push(
    await runTask(
      {
        id: "local-audit-legacy-routes",
        label: `${localTarget.label} :: Legacy routes audit`,
        description: "Controlla URL storiche, redirect 301/308 attesi e i 42 URL WordPress indicizzati su Google.",
        context: { BASE_URL: localTarget.baseUrl },
      },
      async (recorder) => auditLegacyRoutes(localTarget.baseUrl, recorder),
    ),
  );

  // 4. Audit Technical Noindex
  results.push(
    await runTask(
      {
        id: "local-audit-noindex",
        label: `${localTarget.label} :: Technical noindex audit`,
        description: "Verifica cart, checkout e account: noindex attivo, niente canonical/hreflang/og:url e niente sitemap.",
        context: { BASE_URL: localTarget.baseUrl },
      },
      async (recorder) => auditTechnicalNoindex(localTarget.baseUrl, recorder),
    ),
  );

  // 5. Audit Hreflang
  results.push(
    await runTask(
      {
        id: "local-audit-hreflang",
        label: `${localTarget.label} :: Hreflang audit`,
        description: "Controlla tag hreflang, x-default, self reference, URL assolute e bidirezionalita delle alternate.",
        context: { BASE_URL: localTarget.baseUrl },
      },
      async (recorder) => auditHreflang(localTarget.baseUrl, recorder),
    ),
  );

  // 6. Audit Canonical
  results.push(
    await runTask(
      {
        id: "local-audit-canonical",
        label: `${localTarget.label} :: Canonical audit`,
        description: "Verifica canonical unica, assoluta, coerente con localhost, locale, trailing slash e status 200.",
        context: {
          BASE_URL: localTarget.baseUrl,
          EXPECTED_SITE_URL: localTarget.expectedSiteUrl,
        },
      },
      async (recorder) => auditCanonical(localTarget.baseUrl, localTarget.expectedSiteUrl, recorder),
    ),
  );

  // 7. Sitemap counts debug
  results.push(
    await runTask(
      {
        id: "local-debug-sitemap-counts",
        label: `${localTarget.label} :: Sitemap counts debug`,
        description: "Confronta i conteggi delle sitemap con catalogo locale, post blog, pattern URL e possibili anomalie.",
        context: { BASE_URL: localTarget.baseUrl },
      },
      async (recorder) => debugSitemapCounts(localTarget.baseUrl, recorder),
    ),
  );

  // 8. WordPress Live sitemap diagnostic
  results.push(
    await runTask(
      {
        id: "live-wordpress-sitemap-diagnostic",
        label: `${liveWordPressTarget.label} :: Current sitemap diagnostic`,
        description: "Legge l'inventario URL del vecchio sito WordPress live tramite wp-sitemap.xml e child sitemap collegate.",
        context: {
          BASE_URL: liveWordPressTarget.baseUrl,
          WORDPRESS_SITEMAPS: WORDPRESS_SITEMAP_URLS.join(", "),
        },
      },
      async (recorder) => auditWordPressLiveSitemaps(recorder),
    ),
  );

  // 9. Compare Sitemaps
  for (const comparisonTarget of COMPARISON_TARGETS) {
    results.push(
      await runTask(
        {
          id: comparisonTarget.id,
          label: comparisonTarget.label,
          description: "Confronta la sitemap del progetto locale con l'inventario URL corrente di WordPress live.",
          context: {
            SOURCE_BASE_URL: comparisonTarget.sourceBaseUrl,
            TARGET_BASE_URL: comparisonTarget.targetBaseUrl,
            TARGET_SITEMAP_URLS: comparisonTarget.sourceSitemapUrls.join(", "),
          },
        },
        async (recorder) =>
          compareSitemaps(
            comparisonTarget.sourceBaseUrl,
            comparisonTarget.targetBaseUrl,
            recorder,
            comparisonTarget.sourceSitemapUrls,
          ),
      ),
    );
  }

  // 10. URL outcomes classifier
  results.push(
    await runTask(
      {
        id: "url-outcome-classifier",
        label: "URL Outcome Classifier",
        description: "Classifica solo gli ambienti local e live-wordpress usando sitemap locale, redirect legacy locali e inventario WordPress corrente.",
        context: {},
      },
      async (recorder) => auditAllUrlOutcomes(recorder),
    ),
  );

  // 11. Migration readiness
  results.push(
    await runTask(
      {
        id: "migration-readiness",
        label: "Migration Readiness",
        description: "Valuta la copertura della migrazione confrontando WordPress live con il progetto locale e testando i vecchi path su localhost.",
        context: {
          LOCAL_BASE_URL: localTarget.baseUrl,
          LIVE_WORDPRESS_BASE_URL: liveWordPressTarget.baseUrl,
        },
      },
      async (recorder) => migrationReadinessTask(recorder),
    ),
  );

  // 12. Warnings explained
  results.push(
    await runTask(
      {
        id: "warnings-explained",
        label: "Warnings Explained",
        description: "Spiega warning ed errori reali relativi a localhost, WordPress live diagnostico e readiness di migrazione.",
        context: {},
      },
      async (recorder) => warningsExplainedTask(results, recorder),
    ),
  );

  // 13. Go-live blockers
  results.push(
    await runTask(
      {
        id: "go-live-blockers",
        label: "Go-live blockers",
        description: "Tabella finale con blocker, severity, environment, why e action basata solo su local, live-wordpress e migration.",
        context: {},
      },
      async (recorder) => goLiveBlockersTask(results, recorder),
    ),
  );

  const suiteFinishedAt = timestamp();
  await writeReport(results, suiteStartedAt, suiteFinishedAt);
  await assertNoVercelArtifacts();

  const failedCount = results.filter((result) => result.status === "failed").length;
  console.log(divider());
  console.log("Final summary");
  console.log(`- Total tasks: ${results.length}`);
  console.log(`- Failed: ${failedCount}`);
  console.log(`- TXT report: ${REPORT_FILE}`);
  console.log(divider());

  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch(async (error) => {
  const fatalMessage = error instanceof Error ? error.stack || error.message : String(error);
  console.error("SEO Suite Fatal Error:", fatalMessage);
  process.exit(1);
});
