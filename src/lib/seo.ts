import type { Metadata } from "next";
import { locales, localizedPathnames, type Locale } from "@/i18n/pathnames";

export const SITE_URL = "https://delpasqua.com";
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
        ...locales.map((l) => [l === "it" ? "it-IT" : l, absoluteUrl(localizedPath(normalizedPath, l))]),
        ["x-default", absoluteUrl(localizedPath(normalizedPath, "it"))],
      ])
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
      locale: OG_LOCALES[locale] ?? locale,
      type: "website",
    },
  };
}
