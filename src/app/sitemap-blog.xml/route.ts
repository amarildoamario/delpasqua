import { NextResponse } from "next/server";
import { mockBlogPosts, hasBlogPostTranslation } from "@/lib/blog-data";
import { getLocalizedBlogCategorySlug, getLocalizedBlogSlug } from "@/lib/blogSlugs";
import { locales, localizedPathnames } from "@/i18n/pathnames";
import { absoluteUrl, getBlogAlternateUrls, getBlogCategoryAlternateUrls } from "@/lib/seo";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  const urls: string[] = [];

  // 1. Blog Category pages across all locales
  const uniqueCategoryPosts = new Map<string, (typeof mockBlogPosts)[number]>();
  for (const post of mockBlogPosts) {
    const itCatSlug = getLocalizedBlogCategorySlug(post, "it");
    const existing = uniqueCategoryPosts.get(itCatSlug);
    if (!existing) {
      uniqueCategoryPosts.set(itCatSlug, post);
    } else {
      const existingDate = new Date(existing.updateDate || existing.date);
      const currentDate = new Date(post.updateDate || post.date);
      if (currentDate > existingDate) {
        uniqueCategoryPosts.set(itCatSlug, post);
      }
    }
  }

  for (const representativePost of uniqueCategoryPosts.values()) {
    const alternatesMap = getBlogCategoryAlternateUrls(representativePost);
    const altTags = Object.entries(alternatesMap)
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`)
      .join("\n");
    const lastmod = new Date(representativePost.updateDate || representativePost.date).toISOString().split("T")[0];

    for (const locale of locales) {
      if (!hasBlogPostTranslation(representativePost, locale)) continue;

      const categorySlug = getLocalizedBlogCategorySlug(representativePost, locale);
      const template = localizedPathnames["/blog/category/[category]"]?.[locale] || "/blog/category/[category]";
      const resolvedPath = template.replace("[category]", categorySlug);
      const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
      const url = absoluteUrl(fullPath);

      urls.push(`  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
${altTags}
  </url>`);
    }
  }

  // 2. Individual Blog Post pages across all locales
  for (const post of mockBlogPosts) {
    const alternatesMap = getBlogAlternateUrls(post);
    const altTags = Object.entries(alternatesMap)
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`)
      .join("\n");

    const imageUrl = post.imageUrl
      ? (post.imageUrl.startsWith("http") ? post.imageUrl : absoluteUrl(post.imageUrl))
      : null;
    const imageNode = imageUrl
      ? `\n    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(post.title || "")}</image:title>
    </image:image>`
      : "";

    for (const locale of locales) {
      if (!hasBlogPostTranslation(post, locale)) continue;

      const categorySlug = getLocalizedBlogCategorySlug(post, locale);
      const postSlug = getLocalizedBlogSlug(post, locale);
      const template = localizedPathnames["/blog/category/[category]/[slug]"]?.[locale] || "/blog/category/[category]/[slug]";
      const resolvedPath = template
        .replace("[category]", categorySlug)
        .replace("[slug]", postSlug);
      const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
      const url = absoluteUrl(fullPath);
      const lastmod = new Date(post.updateDate || post.date).toISOString().split("T")[0];

      urls.push(`  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${altTags}${imageNode}
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

