import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { promises as fs } from "fs";
import { readCatalog, getCatalogPath } from "@/lib/server/catalog";
import { mockBlogPosts } from "@/lib/blog-data";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Calculate latest blog post update date
  const latestBlogPostDate = mockBlogPosts.reduce((latest, post) => {
    const date = new Date(post.updateDate || post.date);
    return date > latest ? date : latest;
  }, new Date(0));
  const blogLastmod = latestBlogPostDate.toISOString().split("T")[0];

  // 2. Calculate latest product update date
  const products = await readCatalog();
  const merchList = await prisma.productMerch.findMany({ select: { updatedAt: true } });
  const filePath = getCatalogPath();
  const stat = await fs.stat(filePath);

  let latestProductDate = stat.mtime;
  for (const product of products) {
    if (product.updatedAt || product.updateDate) {
      const d = new Date((product.updatedAt || product.updateDate) as string);
      if (d > latestProductDate) latestProductDate = d;
    }
  }
  for (const m of merchList) {
    if (m.updatedAt > latestProductDate) {
      latestProductDate = m.updatedAt;
    }
  }
  const productsLastmod = latestProductDate.toISOString().split("T")[0];

  // 3. Pages lastmod can be today's date
  const pagesLastmod = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${pagesLastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-products.xml</loc>
    <lastmod>${productsLastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-blog.xml</loc>
    <lastmod>${blogLastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
