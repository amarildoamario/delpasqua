export type Environment = "local" | "live-wordpress";

export type Target = {
  id: Environment;
  label: string;
  baseUrl: string;
  expectedSiteUrl: string;
};

export type ComparisonTarget = {
  id: string;
  label: string;
  sourceBaseUrl: string;
  targetBaseUrl: string;
  sourceSitemapUrls: string[];
};

export type TaskStatus = "passed" | "passed_with_warnings" | "failed";

export type TaskResult = {
  id: string;
  label: string;
  description: string;
  context: Record<string, string>;
  status: TaskStatus;
  startedAt: string;
  finishedAt: string;
  metrics: Record<string, string | number | boolean>;
  warnings: string[];
  error?: string;
  output: string[];
};

export type TaskSummary = {
  status?: TaskStatus;
  metrics?: Record<string, string | number | boolean>;
  warnings?: string[];
};

export type UrlClassification =
  | "LOCAL_INDEXABLE_200"
  | "LOCAL_SITEMAP_404_ERROR"
  | "LOCAL_SITEMAP_500_ERROR"
  | "LOCAL_SITEMAP_REDIRECT_ERROR"
  | "LOCAL_SITEMAP_NOINDEX_ERROR"
  | "LOCAL_REDIRECT_301_OK"
  | "LOCAL_REDIRECT_TO_404_ERROR"
  | "LOCAL_REDIRECT_TO_500_ERROR"
  | "LOCAL_REDIRECT_CHAIN_WARN"
  | "LOCAL_TECHNICAL_NOINDEX_OK"
  | "LOCAL_TECHNICAL_IN_SITEMAP_ERROR"
  | "LOCAL_TECHNICAL_MISSING_NOINDEX_ERROR"
  | "LOCAL_FETCH_ERROR"
  | "LOCAL_TRANSIENT_FETCH_WARN"
  | "WP_CURRENT_INDEXABLE_200"
  | "WP_CURRENT_REDIRECT"
  | "WP_CURRENT_404"
  | "WP_CURRENT_TECHNICAL_ROUTE"
  | "WP_CURRENT_TAXONOMY"
  | "WP_CURRENT_PRODUCT"
  | "WP_CURRENT_PORTFOLIO"
  | "WP_CURRENT_PAGE"
  | "WP_CURRENT_FETCH_ERROR";

export type RedirectType = "none" | "permanent" | "temporary" | "mixed";

export type UrlOutcomeInput = {
  url: string;
  source?: string;
};

export type UrlOutcome = {
  environment: Environment;
  label: string;
  source: string;
  inputUrl: string;
  inputPath: string;
  initialStatus: number | null;
  initialLocation: string;
  finalUrl: string;
  finalPath: string;
  finalStatus: number | null;
  redirectChain: Array<{ url: string; status: number; location: string }>;
  redirectCount: number;
  redirectType: RedirectType;
  isInSitemapInitial: boolean;
  isInSitemapFinal: boolean;
  hasNoindex: boolean;
  canonicalUrl: string;
  canonicalHostMatchesExpected: boolean | null;
  hasHreflang: boolean;
  hasOgUrl: boolean;
  contentType: string;
  classification: UrlClassification;
  fetchError: string;
  attempts: number;
  transientRecovered: boolean;
};

export type MigrationClassification =
  | "SAME_PATH_OK"
  | "COVERED_BY_LOCAL_REDIRECT"
  | "NEEDS_LOCAL_REDIRECT_OR_410"
  | "TECHNICAL_ROUTE_IGNORE_OR_NOINDEX"
  | "TAXONOMY_LEGACY_DECISION"
  | "PRODUCT_LEGACY_DECISION"
  | "PORTFOLIO_LEGACY_DECISION"
  | "PAGE_LEGACY_DECISION"
  | "PROJECT_ONLY_NEW_URL";

export type MigrationOutcome = {
  path: string;
  livePath: string;
  projectPath: string;
  classification: MigrationClassification;
  localCheckUrl: string;
  targetPath: string;
  localInitialStatus: number | null;
  localFinalStatus: number | null;
  redirectCount: number;
  note: string;
};

export type GoLiveBlocker = {
  blocker: string;
  severity: "critical" | "warning" | "info";
  environment: string;
  why: string;
  action: string;
};
