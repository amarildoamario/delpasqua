import assert from "node:assert/strict";
import test from "node:test";
import { locales, localizedPathnames } from "@/i18n/pathnames";
import { hasBlogPostTranslation, mockBlogPosts } from "@/lib/blog-data";
import { getBlogProductSelections } from "@/lib/blog-product-placements";
import { BLOG_PRODUCT_POSITIONS } from "@/lib/analytics/events";
import { getLocalizedBlogHref } from "@/lib/blogSlugs";
import catalog from "@/db/products.json";
import { summarizeBlogCards } from "./blogCardMetrics";
import type { V6EventInput } from "./metricsAnalyticsV6";
import { metricsPeriod } from "./salesMetrics";

const italian = "/blog/categoria/conservazione/bottiglia-scura-o-latta/";
const pizzaSlug = "olivenoel-fuer-pizza-roh-oder-nach-dem-backen";
const german = "/de/blog/kategorie/rezepte-kombinationen/" + pizzaSlug + "/";
const range = metricsPeriod("2026-11-18", "2026-11-20");
function visit(sessionId: string, timestamp: string, path: string, extra?: Partial<V6EventInput>): V6EventInput {
  return { sessionId, visitorId: sessionId, type: "page_view", createdAt: new Date(timestamp), path, ...extra };
}

test("assigns sessions to the first affected article in Rome and counts a later product once", () => {
  const events = [
    visit("return", "2026-11-18T22:55Z", italian),
    visit("return", "2026-11-18T22:50Z", "/shop/evo/"),
    visit("return", "2026-11-18T23:00Z", german),
    visit("return", "2026-11-18T23:05Z", "/shop/evo/"),
    visit("no-shop", "2026-11-18T22:59Z", italian),
    visit("day", "2026-11-18T23:00Z", german),
    visit("day", "2026-11-18T23:01Z", "/de/shop/"),
    visit("after", "2026-11-19T23:00Z", italian),
    visit("after", "2026-11-19T23:01Z", "/shop/evo/", { type: "product_view", productKey: "evo" }),
    visit("unrelated", "2026-11-19T11:00Z", "/blog/categoria/conservazione/"),
    visit("unrelated", "2026-11-19T11:05Z", "/shop/evo/"),
    visit("outside", "2026-11-20T23:00Z", italian),
  ];
  const report = summarizeBlogCards(events.reverse(), range.start, range.endExclusive, range.endExclusive);
  assert.equal(report.introductionDate, "2026-11-19");
  assert.deepEqual(report.periods.map((p) => [p.phase, p.startDate, p.endDate, p.articleSessions, p.productSessions, p.rate]), [
    ["before", "2026-11-18", "2026-11-18", 2, 1, 0.5],
    ["day", "2026-11-19", "2026-11-19", 1, 0, 0],
    ["after", "2026-11-20", "2026-11-20", 1, 1, 1],
  ]);
  assert.equal(report.changePercentagePoints, 50);
});

test("counts direct clicks apart from page views and limits both breakdowns to the selected scope", () => {
  const click = (position: string, article = pizzaSlug, locale = "de") =>
    visit("reader", "2026-11-19T12:00Z", german, { type: "blog_product_click", data: { article, locale, position } });
  const day = metricsPeriod("2026-11-19", "2026-11-19");
  const report = summarizeBlogCards([
    click("title"), click("title"), click("after_first_paragraph"), click("end"),
    click("other"), click("title", "other"), click("title", pizzaSlug, "fr"),
    { ...click("end"), createdAt: day.endExclusive },
  ], day.start, day.endExclusive, day.endExclusive);
  assert.deepEqual(report.clicksByPosition, { title: 2, after_first_paragraph: 1, end: 1 });
  assert.equal(report.totalClicks, 4);
  assert.equal(report.articles.find((a) => a.id === "ric-9")?.clicks, 4);
  assert.equal(report.periods.length, 1);
  assert.equal(report.periods[0].rate, null);
  assert.equal(report.changePercentagePoints, null);
});

test("includes all published editions and their card clicks before and after the change", () => {
  const editions = mockBlogPosts.flatMap((post) => locales.filter((locale) => hasBlogPostTranslation(post, locale)).map((locale) => {
    const { pathname, params } = getLocalizedBlogHref(post, locale);
    const path = localizedPathnames[pathname][locale].replace("[category]", params.category).replace("[slug]", params.slug);
    return { id: post.id + locale, path: (locale === "it" ? "" : "/" + locale) + path + "/?ref=magazine", article: params.slug, locale };
  }));
  const events = editions.flatMap(({ id, path, article, locale }) => [
    visit(id + "-before", "2026-11-18T12:00Z", path),
    visit(id + "-after", "2026-11-20T12:00Z", path),
    visit(id + "-after", "2026-11-20T12:01Z", path, { type: "blog_product_click", data: { article, locale, position: "end" } }),
  ]);
  const report = summarizeBlogCards(events, range.start, range.endExclusive, range.endExclusive);
  assert.equal(report.articles.length, mockBlogPosts.length);
  assert.deepEqual(report.periods.map((p) => p.articleSessions), [editions.length, 0, editions.length]);
  assert.equal(report.clicksByPosition.end, editions.length);
  for (const post of mockBlogPosts) {
    assert.equal(report.articles.find((article) => article.id === post.id)?.clicks,
      locales.filter((locale) => hasBlogPostTranslation(post, locale)).length, post.id);
  }
});

test("every article selects a catalog variant for each card position", () => {
  for (const { id } of mockBlogPosts) {
    const selections = getBlogProductSelections(id);
    assert.deepEqual(selections.map(({ position }) => position), BLOG_PRODUCT_POSITIONS, id);
    for (const { productKey, variantKey } of selections) {
      assert.ok(catalog.find((product) => product.id === productKey)?.variants.some((variant) => variant.id === variantKey), id);
    }
  }
});

test("a date filter spanning future days only reports the time already observed", () => {
  const now = new Date("2026-11-19T14:00Z");
  const report = summarizeBlogCards([visit("future", "2026-11-20T11:00Z", italian)], range.start, range.endExclusive, now);
  assert.deepEqual(report.periods.map((period) => period.phase), ["before", "day"]);
  assert.equal(report.changePercentagePoints, null);
});
