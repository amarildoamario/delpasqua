import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { readCatalog, filterSeoCatalog, getCatalogPath } from "@/lib/server/catalog";
import { getLocalizedProductSlug } from "@/lib/productSlugs";
import { locales, localizedPathnames } from "@/i18n/pathnames";
import { absoluteUrl, getProductAlternateUrls } from "@/lib/seo";
import { prisma } from "@/lib/server/prisma";

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
  const products = filterSeoCatalog(await readCatalog());
  const urls: string[] = [];

  // Fetch productMerch updates from DB
  const merchList = await prisma.productMerch.findMany({
    select: { productKey: true, updatedAt: true }
  });
  const merchMap = new Map(merchList.map(m => [m.productKey, m.updatedAt]));

  // Read file stat for fallback lastmod
  const filePath = getCatalogPath();
  const stat = await fs.stat(filePath);
  const fileDate = stat.mtime;

  for (const product of products) {
    // Determine the most specific update date available
    const productDateVal = (product.updatedAt || product.updateDate) ? new Date((product.updatedAt || product.updateDate) as string) : null;
    const merchDateVal = merchMap.get(product.id) || null;
    const finalDate = productDateVal || merchDateVal || fileDate;
    const lastmod = finalDate.toISOString().split("T")[0];

    // Pre-calculate alternates for hreflang
    const alternatesMap = getProductAlternateUrls(product);
    const altTags = Object.entries(alternatesMap)
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`)
      .join("\n");

    // Pre-calculate product image nodes
    const imageUrl = product.imageSrc
      ? (product.imageSrc.startsWith("http") ? product.imageSrc : absoluteUrl(product.imageSrc))
      : null;
    const imageNode = imageUrl
      ? `\n    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(product.title || "")}</image:title>
    </image:image>`
      : "";

    for (const locale of locales) {
      const slug = getLocalizedProductSlug(product, locale);
      const template = localizedPathnames["/shop/[prodotto]"]?.[locale] || "/shop/[prodotto]";
      const resolvedPath = template.replace("[prodotto]", slug);
      const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
      const url = absoluteUrl(fullPath);

      urls.push(`  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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

