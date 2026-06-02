/**
 * NOME FILE: controlla-traduzioni-blog.ts (ex check-blog-translations.ts)
 * SCOPO: Analizza e verifica l'integrità delle traduzioni degli articoli del blog
 *        rispetto alla sorgente italiana, individuando campi mancanti o fallback errati.
 * UTILIZZO: npm run check:blog-translations o npx tsx tools/controlla-traduzioni-blog.ts
 */

import fs from "node:fs";
import path from "node:path";

import { mockBlogPosts, type BlogPost } from "../src/lib/blog-data";
import { localizedPathnames, locales, type Locale } from "../src/i18n/pathnames";
import { BLOG_POST_TRANSLATIONS, type BlogTranslation } from "../src/lib/blogTranslationsData";
import { getLocalizedBlogCategorySlug, getLocalizedBlogSlug, normalizeBlogSlug } from "../src/lib/blogSlugs";

type CheckLocale = Exclude<Locale, "it">;

type CliOptions = {
  locales: CheckLocale[];
  full: boolean;
  json: boolean;
  out?: string;
};

type PostLocaleStatus = {
  id: string;
  locale: CheckLocale;
  sourceTitle: string;
  sourceCategory: string;
  sourceSlug: string;
  sourceUrl: string;
  translationExists: boolean;
  missingFields: string[];
  contentTranslated: boolean;
  hasOwnSlug: boolean;
  hasOwnCategory: boolean;
  resolvedSlug: string;
  resolvedCategorySlug: string;
  resolvedUrl: string;
  localizedSlug?: string;
  localizedCategorySlug?: string;
  localizedUrl?: string;
  issues: string[];
  info: string[];
};

type LocaleSummary = {
  locale: CheckLocale;
  totalPosts: number;
  translationEntries: number;
  completeTranslations: number;
  missingTranslations: number;
  missingContent: number;
  missingOwnSlug: number;
  missingOwnCategory: number;
  duplicateResolvedUrls: string[];
  duplicateLocalizedUrls: string[];
  actionable: PostLocaleStatus[];
  all: PostLocaleStatus[];
};

type JsonReport = {
  generatedAt: string;
  source: string;
  totalPosts: number;
  locales: LocaleSummary[];
  orphanTranslationIds: string[];
};

type LocaleMeta = {
  flag: string;
  label: string;
};

type GroupedPost = {
  id: string;
  sourceTitle: string;
  sourceCategory: string;
  sourceSlug: string;
  sourceUrl: string;
  statuses: PostLocaleStatus[];
};

const HELP = `Usage:
  npm run check:blog-translations -- [--locale de] [--locale en] [--full] [--json] [--out docs/blog-translation-check.md]

Options:
  --locale <code>   Filter one or more locales among: en, de, nl, da, no
  --full            Print full matrix, not only actionable items
  --json            Print JSON instead of Markdown
  --out <path>      Write the report to a file
  --help            Show this help
`;

const LOCALE_META: Record<Locale, LocaleMeta> = {
  it: { flag: "🇮🇹", label: "IT" },
  en: { flag: "🇬🇧", label: "EN" },
  de: { flag: "🇩🇪", label: "DE" },
  nl: { flag: "🇳🇱", label: "NL" },
  da: { flag: "🇩🇰", label: "DA" },
  no: { flag: "🇳🇴", label: "NO" },
};

function parseArgs(argv: string[]): CliOptions {
  const selectedLocales: CheckLocale[] = [];
  let full = false;
  let json = false;
  let out: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      console.log(HELP);
      process.exit(0);
    }

    if (arg === "--full") {
      full = true;
      continue;
    }

    if (arg === "--json") {
      json = true;
      continue;
    }

    if (arg === "--locale") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("Missing value after --locale");
      }
      index += 1;
      selectedLocales.push(parseLocale(next));
      continue;
    }

    if (arg.startsWith("--locale=")) {
      selectedLocales.push(parseLocale(arg.slice("--locale=".length)));
      continue;
    }

    if (arg === "--out") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("Missing value after --out");
      }
      index += 1;
      out = next;
      continue;
    }

    if (arg.startsWith("--out=")) {
      out = arg.slice("--out=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  const uniqueLocales = Array.from(new Set(selectedLocales));

  return {
    locales: uniqueLocales.length > 0 ? uniqueLocales : getDefaultLocales(),
    full,
    json,
    out,
  };
}

function parseLocale(value: string): CheckLocale {
  const locale = value.trim() as Locale;
  if (!locales.includes(locale) || locale === "it") {
    throw new Error(`Unsupported locale "${value}". Use one of: en, de, nl, da, no`);
  }
  return locale;
}

function getDefaultLocales(): CheckLocale[] {
  return locales.filter((locale): locale is CheckLocale => locale !== "it");
}

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function buildLocalizedBlogUrl(locale: Locale, categorySlug: string, slug: string) {
  const template = localizedPathnames["/blog/category/[category]/[slug]"][locale];
  const pathWithoutPrefix = template
    .replace("[category]", categorySlug)
    .replace("[slug]", slug);

  return locale === "it" ? pathWithoutPrefix : `/${locale}${pathWithoutPrefix}`;
}

function getMissingFields(translation: BlogTranslation | undefined, postId: string, locale: string, postSlug: string) {
  if (!translation) {
    return ["translation", "slug", "title", "excerpt", "category", "content"];
  }

  const missing: string[] = [];
  if (!isFilled(translation.slug)) missing.push("slug");
  if (!isFilled(translation.title)) missing.push("title");
  if (!isFilled(translation.excerpt)) missing.push("excerpt");
  if (!isFilled(translation.category)) missing.push("category");

  let hasContent = isFilled(translation.content);
  if (!hasContent) {
    const mdPath = path.join(process.cwd(), "content", "blog", postSlug, `${locale}.md`);
    if (fs.existsSync(mdPath)) {
      const fileContent = fs.readFileSync(mdPath, "utf8");
      if (fileContent.trim().length > 0) {
        hasContent = true;
      }
    }
  }

  if (!hasContent) missing.push("content");
  return missing;
}

function getSourceUrl(post: BlogPost) {
  const sourceCategorySlug = normalizeBlogSlug(post.category);
  const sourceSlug = normalizeBlogSlug(post.slug);
  return buildLocalizedBlogUrl("it", sourceCategorySlug, sourceSlug);
}

function inspectPostLocale(post: BlogPost, locale: CheckLocale): PostLocaleStatus {
  const translation = BLOG_POST_TRANSLATIONS[post.id]?.[locale];
  const translationExists = Boolean(translation);
  const missingFields = getMissingFields(translation, post.id, locale, post.slug);
  
  let contentTranslated = isFilled(translation?.content);
  if (!contentTranslated) {
    const mdPath = path.join(process.cwd(), "content", "blog", post.slug, `${locale}.md`);
    if (fs.existsSync(mdPath)) {
      const fileContent = fs.readFileSync(mdPath, "utf8");
      if (fileContent.trim().length > 0) {
        contentTranslated = true;
      }
    }
  }
  
  const hasOwnSlug = isFilled(translation?.slug);
  const hasOwnCategory = isFilled(translation?.category);
  const resolvedSlug = getLocalizedBlogSlug(post, locale);
  const resolvedCategorySlug = getLocalizedBlogCategorySlug(post, locale);
  const resolvedUrl = buildLocalizedBlogUrl(locale, resolvedCategorySlug, resolvedSlug);
  const localizedSlug = hasOwnSlug ? normalizeBlogSlug(translation?.slug) : undefined;
  const localizedCategorySlug = hasOwnCategory ? normalizeBlogSlug(translation?.category) : undefined;
  const localizedUrl =
    localizedSlug && localizedCategorySlug
      ? buildLocalizedBlogUrl(locale, localizedCategorySlug, localizedSlug)
      : undefined;

  const issues: string[] = [];
  const info: string[] = [];
  if (!translationExists) {
    issues.push("missing translation entry");
  }
  if (translationExists && !contentTranslated) {
    issues.push("content falls back to Italian");
  }
  if (!hasOwnSlug) {
    issues.push("slug falls back to Italian");
  }
  if (!hasOwnCategory) {
    issues.push("category falls back to Italian");
  }
  if (hasOwnSlug && normalizeBlogSlug(translation?.slug) === normalizeBlogSlug(post.slug)) {
    info.push("localized slug equals Italian slug");
  }
  if (hasOwnCategory && normalizeBlogSlug(translation?.category) === normalizeBlogSlug(post.category)) {
    info.push("localized category equals Italian category");
  }

  return {
    id: post.id,
    locale,
    sourceTitle: post.title,
    sourceCategory: post.category,
    sourceSlug: normalizeBlogSlug(post.slug),
    sourceUrl: getSourceUrl(post),
    translationExists,
    missingFields,
    contentTranslated,
    hasOwnSlug,
    hasOwnCategory,
    resolvedSlug,
    resolvedCategorySlug,
    resolvedUrl,
    localizedSlug,
    localizedCategorySlug,
    localizedUrl,
    issues,
    info,
  };
}

function findDuplicates(values: Array<string | undefined>) {
  const seen = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    seen.set(value, (seen.get(value) ?? 0) + 1);
  }
  return Array.from(seen.entries())
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort();
}

function buildLocaleSummary(posts: BlogPost[], locale: CheckLocale): LocaleSummary {
  const all = posts.map((post) => inspectPostLocale(post, locale));
  const duplicateResolvedUrls = findDuplicates(all.map((item) => item.resolvedUrl));
  const duplicateLocalizedUrls = findDuplicates(all.map((item) => item.localizedUrl));

  const actionable = all.filter((item) => {
    if (!item.translationExists) return true;
    if (item.missingFields.length > 0) return true;
    if (item.issues.length > 0) return true;
    return false;
  });

  return {
    locale,
    totalPosts: posts.length,
    translationEntries: all.filter((item) => item.translationExists).length,
    completeTranslations: all.filter(
      (item) =>
        item.translationExists &&
        item.missingFields.length === 0 &&
        item.issues.length === 0,
    ).length,
    missingTranslations: all.filter((item) => !item.translationExists).length,
    missingContent: all.filter((item) => item.translationExists && !item.contentTranslated).length,
    missingOwnSlug: all.filter((item) => !item.hasOwnSlug).length,
    missingOwnCategory: all.filter((item) => !item.hasOwnCategory).length,
    duplicateResolvedUrls,
    duplicateLocalizedUrls,
    actionable,
    all,
  };
}

function getOrphanTranslationIds(posts: BlogPost[]) {
  const validIds = new Set(posts.map((post) => post.id));
  return Object.keys(BLOG_POST_TRANSLATIONS)
    .filter((id) => !validIds.has(id))
    .sort();
}

function renderStatusLine(item: PostLocaleStatus) {
  const checkbox = item.translationExists && item.missingFields.length === 0 ? "[x]" : "[ ]";
  const missing = item.missingFields.length > 0 ? item.missingFields.join(", ") : "none";
  const issues = item.issues.length > 0 ? item.issues.join("; ") : "ok";
  const localizedUrl = item.localizedUrl ?? "(missing localized slug/category)";

  return [
    `${checkbox} ${item.id}`,
    `IT: ${item.sourceUrl}`,
    `TARGET: ${localizedUrl}`,
    `RESOLVED_NOW: ${item.resolvedUrl}`,
    `MISSING: ${missing}`,
    `ISSUES: ${issues}`,
    `TITLE_IT: ${item.sourceTitle}`,
  ].join(" | ");
}

function getLocaleBadge(locale: Locale) {
  const meta = LOCALE_META[locale];
  return `${meta.flag} ${meta.label}`;
}

function getLocaleState(item: PostLocaleStatus) {
  if (!item.translationExists) return "❌ missing translation";
  if (item.issues.length > 0) return "⚠️ needs work";
  return "✅ ready";
}

function groupPosts(report: JsonReport, localeOrder: CheckLocale[]) {
  const grouped = new Map<string, GroupedPost>();

  for (const locale of report.locales) {
    for (const item of locale.all) {
      const existing = grouped.get(item.id);
      if (existing) {
        existing.statuses.push(item);
        continue;
      }

      grouped.set(item.id, {
        id: item.id,
        sourceTitle: item.sourceTitle,
        sourceCategory: item.sourceCategory,
        sourceSlug: item.sourceSlug,
        sourceUrl: item.sourceUrl,
        statuses: [item],
      });
    }
  }

  return Array.from(grouped.values())
    .map((post) => ({
      ...post,
      statuses: [...post.statuses].sort(
        (left, right) => localeOrder.indexOf(left.locale) - localeOrder.indexOf(right.locale),
      ),
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function getPostIssueSummary(post: GroupedPost) {
  return post.statuses
    .filter((item) => item.issues.length > 0 || item.missingFields.length > 0)
    .map((item) => `${getLocaleBadge(item.locale)} ${item.missingFields.join(", ")}`)
    .join(" | ");
}

function renderMarkdown(report: JsonReport, options: CliOptions) {
  const lines: string[] = [];
  const groupedPosts = groupPosts(report, options.locales);
  const postsToRender = options.full
    ? groupedPosts
    : groupedPosts.filter((post) =>
        post.statuses.some((item) => item.issues.length > 0 || item.missingFields.length > 0),
      );

  lines.push("# Blog Translation Check");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Source: ${report.source}`);
  lines.push(`Posts: ${report.totalPosts}`);
  lines.push(`Locales: ${report.locales.map((entry) => entry.locale).join(", ")}`);
  lines.push("");
  lines.push("Legend: ✅ ready, ⚠️ fallback or missing field, ❌ translation entry missing");
  lines.push("");
  lines.push("## Global Summary");
  lines.push("");

  for (const locale of report.locales) {
    lines.push(
      `- ${locale.locale}: entries ${locale.translationEntries}/${locale.totalPosts}, missing translations ${locale.missingTranslations}, missing content ${locale.missingContent}, missing own slug ${locale.missingOwnSlug}, missing own category ${locale.missingOwnCategory}, duplicate resolved urls ${locale.duplicateResolvedUrls.length}, duplicate localized urls ${locale.duplicateLocalizedUrls.length}`,
    );
  }

  lines.push("");
  lines.push("## Quick Index By Post");
  lines.push("");
  lines.push(options.full ? "Includes all selected posts." : "Shows only posts that still need work.");
  lines.push("");

  for (const post of postsToRender) {
    const summary = getPostIssueSummary(post) || "all selected locales ready";
    lines.push(`- ${post.id} | ${post.sourceTitle} | ${getLocaleBadge("it")} ${post.sourceUrl} | TODO: ${summary}`);
  }

  lines.push("");
  lines.push("## Worklist By Post");
  lines.push("");

  for (const post of postsToRender) {
    const incompleteStatuses = post.statuses.filter((item) => item.issues.length > 0 || item.missingFields.length > 0);
    const readyStatuses = post.statuses.filter((item) => item.issues.length === 0 && item.missingFields.length === 0);

    lines.push(`### ${post.id} | ${post.sourceTitle}`);
    lines.push("");
    lines.push(`- ${getLocaleBadge("it")} title: ${post.sourceTitle}`);
    lines.push(`- ${getLocaleBadge("it")} category: ${post.sourceCategory}`);
    lines.push(`- ${getLocaleBadge("it")} slug: ${post.sourceSlug}`);
    lines.push(`- ${getLocaleBadge("it")} url: ${post.sourceUrl}`);
    lines.push(
      `- Needs work in: ${incompleteStatuses.length > 0 ? incompleteStatuses.map((item) => `${getLocaleBadge(item.locale)} ${item.missingFields.join(", ")}`).join(" | ") : "none"}`,
    );
    lines.push(
      `- Ready in: ${readyStatuses.length > 0 ? readyStatuses.map((item) => getLocaleBadge(item.locale)).join(" | ") : "none"}`,
    );
    lines.push("");

    for (const item of post.statuses) {
      const expectedUrl = item.localizedUrl ?? "(missing localized url)";
      const missing = item.missingFields.length > 0 ? item.missingFields.join(", ") : "none";
      const issues = item.issues.length > 0 ? item.issues.join("; ") : "none";
      const info = item.info.length > 0 ? item.info.join("; ") : "none";

      lines.push(`- ${getLocaleBadge(item.locale)} ${getLocaleState(item)}`);
      lines.push(`  expected url: ${expectedUrl}`);
      lines.push(`  resolved now: ${item.resolvedUrl}`);
      lines.push(`  missing fields: ${missing}`);
      lines.push(`  issues: ${issues}`);
      lines.push(`  info: ${info}`);
    }

    lines.push("");
  }

  if (report.orphanTranslationIds.length > 0) {
    lines.push("");
    lines.push("## Orphan Translation IDs");
    lines.push("");
    for (const id of report.orphanTranslationIds) {
      lines.push(`- ${id}`);
    }
  }

  lines.push("");
  lines.push("## Locale Appendix");
  lines.push("");

  for (const locale of report.locales) {
    lines.push("");
    lines.push(`### ${getLocaleBadge(locale.locale)}`);
    lines.push("");
    lines.push(
      `Coverage: ${locale.translationEntries}/${locale.totalPosts} translation entries, ${locale.completeTranslations} complete translations.`,
    );

    if (locale.duplicateResolvedUrls.length > 0) {
      lines.push("");
      lines.push("Duplicate resolved URLs:");
      for (const url of locale.duplicateResolvedUrls) {
        lines.push(`- ${url}`);
      }
    }

    if (locale.duplicateLocalizedUrls.length > 0) {
      lines.push("");
      lines.push("Duplicate localized URLs:");
      for (const url of locale.duplicateLocalizedUrls) {
        lines.push(`- ${url}`);
      }
    }

    const items = options.full ? locale.all : locale.actionable;

    lines.push("");
    lines.push(options.full ? "Full checklist:" : "Actionable checklist:");
    if (items.length === 0) {
      lines.push("- none");
      continue;
    }

    for (const item of items) {
      lines.push(`- ${renderStatusLine(item)}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function writeOutputIfNeeded(output: string, outPath: string | undefined) {
  if (!outPath) return;

  const absolutePath = path.resolve(process.cwd(), outPath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, output, "utf8");
  console.error(`Report written to ${absolutePath}`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const sortedPosts = [...mockBlogPosts].sort((a, b) => a.id.localeCompare(b.id));
  const report: JsonReport = {
    generatedAt: new Date().toISOString(),
    source: "src/lib/blogTranslationsData.ts",
    totalPosts: sortedPosts.length,
    locales: options.locales.map((locale) => buildLocaleSummary(sortedPosts, locale)),
    orphanTranslationIds: getOrphanTranslationIds(sortedPosts),
  };

  const output = options.json
    ? `${JSON.stringify(report, null, 2)}\n`
    : renderMarkdown(report, options);

  process.stdout.write(output);
  writeOutputIfNeeded(output, options.out);
}

main();
