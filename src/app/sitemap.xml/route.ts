import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { readBlogSitemapDates } from "@/lib/server/blogSitemap";
import { readProductSitemapEntries } from "@/lib/server/productSitemap";
import { latestSitemapDate } from "@/lib/sitemapDates";

export const dynamic = "force-dynamic";

export async function GET() {
  const [blogDates, products] = await Promise.all([readBlogSitemapDates(), readProductSitemapEntries()]);
  const blogLastmod = latestSitemapDate(...Object.values(blogDates).flatMap((dates) => [...dates.values()]));
  const productsLastmod = latestSitemapDate(...products.map(({ lastmod }) => lastmod));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-products.xml</loc>${productsLastmod ? `\n    <lastmod>${productsLastmod}</lastmod>` : ""}
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-blog.xml</loc>${blogLastmod ? `\n    <lastmod>${blogLastmod}</lastmod>` : ""}
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
