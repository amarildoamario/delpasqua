import type { MetadataRoute } from "next";
import { REQUIRED_CORE_INDEXABLE_PATHS, absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return REQUIRED_CORE_INDEXABLE_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/shop/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.includes("/shop/") || path === "/shop/" ? 0.8 : 0.7,
  }));
}

export const dynamic = "force-static";
