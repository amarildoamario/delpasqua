import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const isVercelStaging =
    process.env.VERCEL_ENV === "preview" || SITE_URL.includes("vercel.app");

  if (isVercelStaging) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/category/",
        "/tag/",
        "/author/",
        "/search/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

export const dynamic = "force-static";
