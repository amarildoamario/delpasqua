import { NextResponse } from "next/server";
import { readCatalog, filterSeoCatalog } from "@/lib/server/catalog";
import { getLocalizedProductSlug } from "@/lib/productSlugs";
import { locales, localizedPathnames } from "@/i18n/pathnames";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = filterSeoCatalog(await readCatalog());
  const urls: string[] = [];

  for (const product of products) {
    for (const locale of locales) {
      const slug = getLocalizedProductSlug(product, locale);
      const template = localizedPathnames["/shop/[prodotto]"]?.[locale] || "/shop/[prodotto]";
      const resolvedPath = template.replace("[prodotto]", slug);
      const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
      const url = absoluteUrl(fullPath);
      const lastmod = new Date().toISOString().split("T")[0];

      urls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
