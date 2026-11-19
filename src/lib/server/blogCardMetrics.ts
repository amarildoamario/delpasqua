import { locales, localizedPathnames } from "@/i18n/pathnames";
import { BLOG_PRODUCT_POSITIONS } from "@/lib/analytics/events";
import { hasBlogPostTranslation, mockBlogPosts } from "@/lib/blog-data";
import { blogCardIntroductionDate } from "@/lib/blog-product-placements";
import { getLocalizedBlogHref } from "@/lib/blogSlugs";
import { canonicalizeSitePath, toRomeDateISO, type V6EventInput } from "./metricsAnalyticsV6";
import { metricsPeriod } from "./salesMetrics";

const articlePaths = new Map<string, string>();
const articles = mockBlogPosts.map((post) => {
  for (const locale of locales) {
    if (!hasBlogPostTranslation(post, locale)) continue;
    const { pathname, params } = getLocalizedBlogHref(post, locale);
    const path = localizedPathnames[pathname][locale].replace("[category]", params.category).replace("[slug]", params.slug);
    articlePaths.set(locale + path, post.id);
    articlePaths.set(locale + "/blog/" + params.slug, post.id);
  }
  return { id: post.id, title: post.title };
});

const introductionDay = metricsPeriod(blogCardIntroductionDate, blogCardIntroductionDate);

export function summarizeBlogCards(events: V6EventInput[], start: Date, endExclusive: Date, now = new Date()) {
  const observedUntil = Math.min(endExclusive.getTime(), now.getTime());
  const firstArticle = new Map<string, number>();
  const lastProduct = new Map<string, number>();
  const clicksByPosition = { title: 0, after_first_paragraph: 0, end: 0 };
  const articleClicks = new Map<string, number>();

  for (const event of events) {
    const at = event.createdAt.getTime();
    if (event.createdAt < start || at >= observedUntil || !event.sessionId) continue;

    if (event.type === "blog_product_click") {
      const data = event.data as { article?: string; locale?: string; position?: string } | null;
      if (!data || typeof data.locale !== "string" || typeof data.article !== "string") continue;
      const id = articlePaths.get(data.locale + "/blog/" + data.article);
      const position = BLOG_PRODUCT_POSITIONS.find((p) => p === data.position);
      if (id && position) {
        clicksByPosition[position]++;
        articleClicks.set(id, (articleClicks.get(id) ?? 0) + 1);
      }
      continue;
    }

    if (event.type === "page_view") {
      const { canonicalPath, locale, pageCategory } = canonicalizeSitePath(event.path);
      if (pageCategory === "blog" && articlePaths.has(locale + canonicalPath)) {
        firstArticle.set(event.sessionId, Math.min(firstArticle.get(event.sessionId) ?? Infinity, at));
      }
      if (pageCategory !== "product_detail") continue;
    } else if (event.type !== "product_view" || !event.productKey || event.productKey === "prodotto-test") {
      continue;
    }
    lastProduct.set(event.sessionId, Math.max(lastProduct.get(event.sessionId) ?? -Infinity, at));
  }

  const ranges = [
    { phase: "before", from: +start, until: Math.min(observedUntil, +introductionDay.start) },
    { phase: "day", from: Math.max(+start, +introductionDay.start), until: Math.min(observedUntil, +introductionDay.endExclusive) },
    { phase: "after", from: Math.max(+start, +introductionDay.endExclusive), until: observedUntil },
  ] as const;
  const periods = ranges.filter(({ from, until }) => from < until).map(({ phase, from, until }) => {
    let articleSessions = 0;
    let productSessions = 0;
    for (const [session, at] of firstArticle) {
      if (at < from || at >= until) continue;
      articleSessions++;
      const productAt = lastProduct.get(session);
      if (productAt !== undefined && productAt > at) productSessions++;
    }
    return {
      phase, startDate: toRomeDateISO(new Date(from)), endDate: toRomeDateISO(new Date(until - 1)),
      articleSessions, productSessions, rate: articleSessions ? productSessions / articleSessions : null,
    };
  });

  const before = periods.find((period) => period.phase === "before")?.rate;
  const after = periods.find((period) => period.phase === "after")?.rate;
  return {
    introductionDate: blogCardIntroductionDate, periods, clicksByPosition,
    totalClicks: Object.values(clicksByPosition).reduce((total, clicks) => total + clicks, 0),
    changePercentagePoints: before != null && after != null ? (after - before) * 100 : null,
    articles: articles.map((article) => ({ ...article, clicks: articleClicks.get(article.id) ?? 0 })),
  };
}
