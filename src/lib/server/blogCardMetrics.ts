import { locales } from "@/i18n/pathnames";
import { BLOG_PRODUCT_POSITIONS } from "@/lib/analytics/events";
import { hasBlogPostTranslation, mockBlogPosts } from "@/lib/blog-data";
import { getLocalizedBlogSlug } from "@/lib/blogSlugs";
import { isSitePage } from "@/lib/analytics/acquisition";
import { canonicalizeSitePath, toRomeDateISO, type computeFunnelsAndSeries, type V6EventInput } from "./metricsAnalyticsV6";
import { metricsPeriod } from "./salesMetrics";

const articleSlugs = new Map<string, string>();
const articles = mockBlogPosts.map((post) => {
  for (const locale of locales) {
    if (!hasBlogPostTranslation(post, locale)) continue;
    articleSlugs.set(`${locale}/${getLocalizedBlogSlug(post, locale)}`, post.id);
  }
  return { id: post.id, title: post.title };
});

const introductionDate = "2026-11-20";
const trackingStart = metricsPeriod(introductionDate, introductionDate).start;

export function summarizeBlogCards(
  events: V6EventInput[],
  { firstVisitAt, productSessionIds, productFirstAt }: ReturnType<typeof computeFunnelsAndSeries>["blogCohort"],
  start: Date,
  endExclusive: Date,
  now: Date,
) {
  const observedUntil = Math.min(+endExclusive, +now + 1);
  const clicksFrom = Math.max(+start, +trackingStart);
  const clicksByPosition = { title: 0, after_first_paragraph: 0, end: 0 };
  const articleClicks = new Map<string, number>();
  const cardClickBeforeProduct = new Set<string>();
  const shopListBeforeProduct = new Set<string>();

  for (const event of events) {
    const at = event.createdAt.getTime();
    if (at < clicksFrom || at >= observedUntil || !event.sessionId) continue;
    if (event.type !== "blog_product_click" && event.type !== "page_view") continue;

    const blogAt = firstVisitAt.get(event.sessionId);
    const productAt = productFirstAt.get(event.sessionId);
    const onWayToProduct = blogAt !== undefined && productAt !== undefined && blogAt <= at && at <= productAt;

    if (event.type === "page_view") {
      if (onWayToProduct && isSitePage(event.path) && canonicalizeSitePath(event.path).pageCategory === "shop_list") {
        shopListBeforeProduct.add(event.sessionId);
      }
      continue;
    }

    const data = event.data as { article?: string; locale?: string; position?: string } | null;
    if (!data || typeof data.locale !== "string" || typeof data.article !== "string") continue;
    const id = articleSlugs.get(`${data.locale}/${data.article}`);
    const position = BLOG_PRODUCT_POSITIONS.find((p) => p === data.position);
    if (id && position) {
      clicksByPosition[position]++;
      articleClicks.set(id, (articleClicks.get(id) ?? 0) + 1);
      if (onWayToProduct) cardClickBeforeProduct.add(event.sessionId);
    }
  }

  const ranges = [
    { phase: "before", from: +start, until: Math.min(observedUntil, +trackingStart) },
    { phase: "after", from: Math.max(+start, +trackingStart), until: observedUntil },
  ] as const;
  const periods = ranges.filter(({ from, until }) => from < until).map(({ phase, from, until }) => {
    let blogSessions = 0;
    let productSessions = 0;
    const routes = phase === "after" ? { withCardClick: 0, viaShopList: 0, other: 0 } : null;
    for (const [session, at] of firstVisitAt) {
      if (at < from || at >= until) continue;
      blogSessions++;
      if (!productSessionIds.has(session)) continue;
      productSessions++;
      if (routes) {
        if (cardClickBeforeProduct.has(session)) routes.withCardClick++;
        else if (shopListBeforeProduct.has(session)) routes.viaShopList++;
        else routes.other++;
      }
    }
    return {
      phase, startDate: toRomeDateISO(new Date(from)), endDate: toRomeDateISO(new Date(until - 1)),
      blogSessions, productSessions, rate: blogSessions ? productSessions / blogSessions : null, routes,
    };
  });

  const before = periods.find((period) => period.phase === "before")?.rate;
  const after = periods.find((period) => period.phase === "after")?.rate;
  return {
    introductionDate, trackingStartsAt: trackingStart.toISOString(), periods, clicksByPosition,
    totalBlogSessions: firstVisitAt.size,
    totalProductSessions: productSessionIds.size,
    totalClicks: Object.values(clicksByPosition).reduce((total, clicks) => total + clicks, 0),
    changePercentagePoints: before != null && after != null ? (after - before) * 100 : null,
    articles: articles.map((article) => ({ ...article, clicks: articleClicks.get(article.id) ?? 0 })),
  };
}
