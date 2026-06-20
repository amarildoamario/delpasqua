import type { Metadata } from "next";
import { locales, localizedPathnames, type Locale } from "@/i18n/pathnames";
import { getLocalizedProductSlug } from "@/lib/productSlugs";
import { getLocalizedBlogSlug, getLocalizedBlogCategorySlug, type BlogSlugSource } from "@/lib/blogSlugs";
import { hasBlogPostTranslation } from "@/lib/blog-data";

const PRODUCTION_SITE_URL = "https://delpasqua.com";
const LOCAL_SITE_URL = "http://localhost:3000";

function isPrivateLanHost(hostname: string) {
  return (
    hostname === "0.0.0.0" ||
    hostname === "127.0.0.1" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

export function getSiteUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  
  if (!url) {
    if (process.env.NODE_ENV === "development") {
      url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    } else {
      const fallback =
        process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview"
          ? PRODUCTION_SITE_URL
          : process.env.VERCEL_PROJECT_PRODUCTION_URL
              ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
              : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : PRODUCTION_SITE_URL);
      
      if (typeof window === "undefined") {
        console.warn(`[SEO Warning] SITE_URL or NEXT_PUBLIC_SITE_URL is not configured in production! Using fallback: ${fallback}`);
      }
      url = fallback;
    }
  }

  // Normalizza il dominio:
  let normalized = url.trim();

  // Rimuove eventuale protocollo per manipolazione
  let protocol = "https://";
  if (normalized.startsWith("http://")) {
    protocol = "http://";
    normalized = normalized.slice(7);
  } else if (normalized.startsWith("https://")) {
    protocol = "https://";
    normalized = normalized.slice(8);
  } else {
    const isProd = process.env.NODE_ENV === "production";
    protocol = isProd ? "https://" : "http://";
  }

  // Rimuove path, query string, hash
  const slashIndex = normalized.indexOf("/");
  if (slashIndex !== -1) {
    normalized = normalized.slice(0, slashIndex);
  }
  const queryIndex = normalized.indexOf("?");
  if (queryIndex !== -1) {
    normalized = normalized.slice(0, queryIndex);
  }
  const hashIndex = normalized.indexOf("#");
  if (hashIndex !== -1) {
    normalized = normalized.slice(0, hashIndex);
  }

  // Rimuove slash finale
  normalized = normalized.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    const hostname = normalized.split(":")[0];
    if (isPrivateLanHost(hostname)) {
      return LOCAL_SITE_URL;
    }
  }

  // Garantisce protocollo https:// in produzione se manca o è http ed è un dominio reale (non localhost)
  if (process.env.NODE_ENV === "production" && !normalized.includes("localhost")) {
    protocol = "https://";
  }

  return `${protocol}${normalized}`;
}

export const SITE_URL = getSiteUrl();
export const SITE_NAME = "Frantoio Del Pasqua";

const REQUIRED_CORE_INTERNAL_PATHS = [
  "/",
  "/storia/",
  "/produzione/",
  "/il-nostro-olio/",
  "/shop/",
  "/acquista/",
  "/contatti/",
  "/privacy/",
  "/cookie/",
  "/termini/",
  "/degustazioni/",
  "/olio-toscano/",
  "/olio-biologico/",
  "/nuovo-raccolto/",
  "/olio-5-litri/",
] as const;

export const REQUIRED_CORE_INDEXABLE_PATHS = REQUIRED_CORE_INTERNAL_PATHS.flatMap((path) =>
  locales.map((locale) => localizedPath(path, locale))
);

export const REQUIRED_UTILITY_NOINDEX_PATHS = [
  "/carrello/",
  "/checkout/",
  "/my-account/",
 ] as const;

const HREFLANG_CORE_PATHS = new Set([
  "/",
  "/shop/",
  "/acquista/",
  "/produzione/",
  "/il-nostro-olio/",
  "/contatti/",
  "/storia/",
  "/privacy/",
  "/privacy-policy/",
  "/cookie/",
  "/cookie-policy/",
  "/termini/",
  "/condizioni-generali-di-vendita/",
  "/degustazioni/",
  "/parita-di-genere/",
  "/resi/",
  "/spedizioni/",
  "/blog/",
  "/olio-toscano/",
  "/olio-biologico/",
  "/nuovo-raccolto/",
  "/olio-5-litri/",
]);

const OG_LOCALES: Record<string, string> = {
  it: "it_IT",
  en: "en_US",
  de: "de_DE",
  nl: "nl_NL",
  da: "da_DK",
  no: "nb_NO",
};

export function normalizePath(path: string) {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") return "/";
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function localizedPath(path: string, locale: string) {
  const normalized = normalizePath(path);
  const supportedLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";

  if (normalized === "/") {
    return supportedLocale === "it" ? "/" : `/${supportedLocale}/`;
  }

  const internalPath = normalized.replace(/\/$/, "");
  const externalPath = localizedPathnames[internalPath]?.[supportedLocale] ?? normalized;

  if (supportedLocale === "it") {
    return normalizePath(externalPath);
  }

  return normalizePath(`/${supportedLocale}${externalPath}`);
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${normalizePath(path)}`;
}

export function getProductAlternateUrls(product: { id: string; slug?: string | null }) {
  const urls: Record<string, string> = {};
  for (const locale of locales) {
    const slug = getLocalizedProductSlug(product, locale);
    const template = localizedPathnames["/shop/[prodotto]"]?.[locale] || "/shop/[prodotto]";
    const resolvedPath = template.replace("[prodotto]", slug);
    const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
    urls[locale] = absoluteUrl(fullPath);
  }
  urls["x-default"] = urls["it"];
  return urls;
}

export function getBlogAlternateUrls(post: BlogSlugSource) {
  const urls: Record<string, string> = {};
  for (const locale of locales) {
    if (!hasBlogPostTranslation(post, locale)) continue;

    const categorySlug = getLocalizedBlogCategorySlug(post, locale);
    const postSlug = getLocalizedBlogSlug(post, locale);
    const template = localizedPathnames["/blog/category/[category]/[slug]"]?.[locale] || "/blog/category/[category]/[slug]";
    const resolvedPath = template
      .replace("[category]", categorySlug)
      .replace("[slug]", postSlug);
    const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
    urls[locale] = absoluteUrl(fullPath);
  }
  urls["x-default"] = urls["it"];
  return urls;
}

export function pageMetadata({
  title,
  description,
  path,
  locale,
  index = true,
  canonicalPath,
  hreflang = HREFLANG_CORE_PATHS.has(normalizePath(path)),
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  index?: boolean;
  canonicalPath?: string;
  hreflang?: boolean;
}): Metadata {
  const normalizedPath = normalizePath(path);
  const canonical = absoluteUrl(canonicalPath ?? localizedPath(normalizedPath, locale));
  const languages = hreflang
    ? Object.fromEntries([
        ...locales.map((l) => [l, absoluteUrl(localizedPath(normalizedPath, l))]),
        ["x-default", absoluteUrl(localizedPath(normalizedPath, "it"))],
      ])
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    ...(index ? {
      alternates: {
        canonical,
        ...(languages ? { languages } : {}),
      }
    } : {}),
    robots: index
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
    openGraph: {
      title,
      description,
      ...(index ? { url: canonical } : {}),
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale] ?? locale,
      type: "website",
    },
  };
}
