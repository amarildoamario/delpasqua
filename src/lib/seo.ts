import type { Metadata } from "next";

export const SITE_URL = "https://delpasqua.com";
export const SITE_NAME = "Frantoio Del Pasqua";

export const REQUIRED_CORE_INDEXABLE_PATHS = [
  "/",
  "/storia/",
  "/produzione/",
  "/il-nostro-olio/",
  "/shop/",
  "/acquista/",
  "/contatti/",
  "/privacy-policy/",
  "/cookie-policy/",
  "/condizioni-generali-di-vendita/",
  "/en/",
  "/en/shop/",
  "/en/il-nostro-olio/",
  "/en/produzione/",
  "/en/contatti/",
] as const;

export const REQUIRED_UTILITY_NOINDEX_PATHS = [
  "/carrello/",
  "/checkout/",
  "/my-account/",
] as const;

const HREFLANG_CORE_PATHS = new Set([
  "/",
  "/shop/",
  "/produzione/",
  "/il-nostro-olio/",
  "/contatti/",
]);

export function normalizePath(path: string) {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") return "/";
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function localizedPath(path: string, locale: string) {
  const normalized = normalizePath(path);

  if (locale === "it") return normalized;
  if (normalized === "/") return `/${locale}/`;

  return normalizePath(`/${locale}${normalized}`);
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${normalizePath(path)}`;
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
    ? {
        "it-IT": absoluteUrl(localizedPath(normalizedPath, "it")),
        "en": absoluteUrl(localizedPath(normalizedPath, "en")),
        "x-default": absoluteUrl(localizedPath(normalizedPath, "it")),
      }
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
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
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === "it" ? "it_IT" : locale,
      type: "website",
    },
  };
}
