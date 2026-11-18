import { locales } from "@/i18n/pathnames";
import { getBlogPosts } from "@/lib/blog-data";
import { latestSitemapDate } from "@/lib/sitemapDates";

// The restored formatting and working localized links were published on this date.
const BLOG_RESTORED_ON = "2026-11-19";

export async function readBlogSitemapDates() {
  const entries = await Promise.all(locales.map(async (locale) => {
    const posts = await getBlogPosts(locale);
    return [locale, new Map(posts.map((post) => [
      post.id,
      latestSitemapDate(BLOG_RESTORED_ON, post.updateDate, post.date) ?? BLOG_RESTORED_ON,
    ]))] as const;
  }));
  return Object.fromEntries(entries);
}
