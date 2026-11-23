import assert from "node:assert/strict";
import test from "node:test";
import { locales, localizedPathnames } from "@/i18n/pathnames";
import { hasBlogPostTranslation, mockBlogPosts } from "@/lib/blog-data";
import { getBlogProductSelections } from "@/lib/blog-product-placements";
import { BLOG_PRODUCT_POSITIONS } from "@/lib/analytics/events";
import { getLocalizedBlogHref } from "@/lib/blogSlugs";
import catalog from "@/db/products.json";
import { summarizeBlogCards } from "./blogCardMetrics";
import { computeFunnelsAndSeries, type V6EventInput } from "./metricsAnalyticsV6";
import { metricsPeriod } from "./salesMetrics";

const italian = "/blog/categoria/conservazione/bottiglia-scura-o-latta/";
const pizzaSlug = "olivenoel-fuer-pizza-roh-oder-nach-dem-backen";
const german = "/de/blog/kategorie/rezepte-kombinationen/" + pizzaSlug + "/";
const range = metricsPeriod("2026-11-18", "2026-11-20");
function visit(sessionId: string, timestamp: string, path: string, extra?: Partial<V6EventInput>): V6EventInput {
  return { sessionId, visitorId: sessionId, type: "page_view", createdAt: new Date(timestamp), path, ...extra };
}

function analyze(events: V6EventInput[], period = range, now = period.endExclusive) {
  const { start, endExclusive, startISO, endISO } = period;
  const { blogCohort, sessionFunnel } = computeFunnelsAndSeries({ orders: [], events, start, endExclusive, startISO, endISO, now });
  const report = summarizeBlogCards(events, blogCohort, start, endExclusive, now);
  assert.equal(report.periods.reduce((sum, p) => sum + p.blogSessions, 0), sessionFunnel.blogSessions);
  assert.equal(report.periods.reduce((sum, p) => sum + p.productSessions, 0), sessionFunnel.blogToProductSessions);
  return report;
}

test("matches the funnel across Rome midnight for index, category and article sessions", () => {
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
    visit("index", "2026-11-19T22:59Z", "/en/blog/"),
    visit("index", "2026-11-19T23:02Z", italian),
    visit("index", "2026-11-19T23:03Z", "/shop/evo/"),
    visit("category", "2026-11-19T11:00Z", "/blog/categoria/conservazione/"),
    visit("category", "2026-11-19T11:05Z", "/shop/evo/"),
    visit("outside", "2026-11-20T23:00Z", italian),
  ];
  const report = analyze(events.reverse());
  assert.equal(report.introductionDate, "2026-11-20");
  assert.equal(report.trackingStartsAt, "2026-11-19T23:00:00.000Z");
  assert.deepEqual(report.periods.map((p) => [p.phase, p.startDate, p.endDate, p.blogSessions, p.productSessions, p.rate]), [
    ["before", "2026-11-18", "2026-11-19", 5, 2, 0.4],
    ["after", "2026-11-20", "2026-11-20", 1, 1, 1],
  ]);
  assert.equal(report.totalBlogSessions, 6);
  assert.equal(report.totalProductSessions, 3);
  assert.equal(report.changePercentagePoints, 60);
});

test("counts direct clicks apart from page views and limits both breakdowns to the selected scope", () => {
  const click = (position: string, article = pizzaSlug, locale = "de") =>
    visit("reader", "2026-11-19T23:00Z", german, { type: "blog_product_click", data: { article, locale, position } });
  const day = metricsPeriod("2026-11-20", "2026-11-20");
  const report = analyze([
    click("title"), click("title"), click("after_first_paragraph"), click("end"),
    click("other"), click("title", "other"), click("title", pizzaSlug, "fr"),
    { ...click("title"), createdAt: new Date("2026-11-19T22:59:59.999Z") },
    { ...click("end"), createdAt: day.endExclusive },
  ]);
  assert.deepEqual(report.clicksByPosition, { title: 2, after_first_paragraph: 1, end: 1 });
  assert.equal(report.totalClicks, 4);
  assert.equal(report.articles.find((a) => a.id === "ric-9")?.clicks, 4);
  assert.equal(report.periods.length, 2);
  assert.equal(report.periods[1].rate, null);
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
  const report = analyze(events);
  assert.equal(report.articles.length, mockBlogPosts.length);
  assert.deepEqual(report.periods.map((p) => p.blogSessions), [editions.length, editions.length]);
  assert.equal(report.clicksByPosition.end, editions.length);
  for (const post of mockBlogPosts) {
    assert.equal(report.articles.find((article) => article.id === post.id)?.clicks,
      locales.filter((locale) => hasBlogPostTranslation(post, locale)).length, post.id);
  }
});

test("counts one route per product session and keeps later or repeated card clicks in the event total", () => {
  const click = (sessionId: string, time: string) => visit(sessionId, `2026-11-20T${time}Z`, german, {
    type: "blog_product_click", data: { article: pizzaSlug, locale: "de", position: "title" },
  });
  const events = ["card", "shop-list", "other", "no-product"].flatMap((sessionId) => [
    visit(sessionId, "2026-11-20T10:00Z", german),
    ...(sessionId === "no-product" ? [] : [visit(sessionId, "2026-11-20T10:10Z", "/de/laden/fruchtig/")]),
  ]);
  const report = analyze([
    ...events,
    click("card", "10:01"), click("card", "10:02"), click("shop-list", "10:20"), click("no-product", "10:04"),
    visit("card", "2026-11-20T10:05Z", "/de/laden/"),
    visit("shop-list", "2026-11-20T10:05Z", "/de/laden/"),
    visit("other", "2026-11-20T09:55Z", "/de/laden/"),
  ].reverse());

  assert.equal(report.periods[0].routes, null);
  assert.equal(report.periods[1].productSessions, 3);
  assert.deepEqual(report.periods[1].routes, { withCardClick: 1, viaShopList: 1, other: 1 });
  assert.equal(report.totalClicks, 4);
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
  const report = analyze([visit("future", "2026-11-20T11:00Z", italian)], range, now);
  assert.deepEqual(report.periods.map((period) => period.phase), ["before"]);
  assert.equal(report.changePercentagePoints, null);
});
