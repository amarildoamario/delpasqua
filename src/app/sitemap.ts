import type { MetadataRoute } from "next";
import { REQUIRED_CORE_INDEXABLE_PATHS, absoluteUrl } from "@/lib/seo";

const shopPathPattern = /^\/(?:(?:en|de|nl|da|no)\/)?(?:shop|laden|winkel|butik|butikk)\/$/;

export default function sitemap(): MetadataRoute.Sitemap {
  return REQUIRED_CORE_INDEXABLE_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" || shopPathPattern.test(path) ? "weekly" : "monthly",
    priority: path === "/" ? 1 : shopPathPattern.test(path) ? 0.8 : 0.7,
  }));
}

export const dynamic = "force-static";
