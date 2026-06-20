import { NextResponse } from "next/server";
import { locales } from "@/i18n/pathnames";
import { localizedPath, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const CORE_PATHS = [
  "/",
  "/storia",
  "/produzione",
  "/il-nostro-olio",
  "/shop",
  "/acquista",
  "/contatti",
  "/privacy",
  "/cookie",
  "/termini",
  "/degustazioni",
  "/parita-di-genere",
  "/resi",
  "/spedizioni",
  "/blog",
  "/olio-toscano",
  "/olio-biologico",
  "/nuovo-raccolto",
  "/olio-5-litri",
];

function getPageParams(path: string) {
  if (path === "/") {
    return { priority: "1.0", changefreq: "weekly" };
  }
  if (path === "/shop") {
    return { priority: "0.9", changefreq: "weekly" };
  }
  if (
    path === "/privacy" ||
    path === "/cookie" ||
    path === "/termini" ||
    path === "/resi" ||
    path === "/spedizioni" ||
    path === "/parita-di-genere"
  ) {
    return { priority: "0.5", changefreq: "monthly" };
  }
  return { priority: "0.7", changefreq: "monthly" };
}

export async function GET() {
  const urls: string[] = [];

  for (const path of CORE_PATHS) {
    const { priority, changefreq } = getPageParams(path);
    for (const locale of locales) {
      const locPath = localizedPath(path, locale);
      const url = absoluteUrl(locPath);
      const lastmod = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      urls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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
