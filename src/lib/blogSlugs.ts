import { locales } from "@/i18n/pathnames";
import { type Locale } from "./blogTranslationsData";
export type { Locale };

export type BlogSlugSource = {
  id: string;
  slug?: string | null;
  category?: string | null;
};

export interface BlogTranslation {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content?: string;
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeBlogSlug(value: unknown): string {
  const decoded = safeDecodeURIComponent(String(value ?? ""));
  return decoded
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/\/+$/, "");
}

import { BLOG_POST_TRANSLATIONS } from "./blogTranslationsData";

const CATEGORY_SLUG_ALIASES = new Map<string, string>();

for (const translations of Object.values(BLOG_POST_TRANSLATIONS)) {
  const canonicalCategory =
    translations.it?.category ??
    Object.values(translations)[0]?.category;

  if (!canonicalCategory) continue;

  const canonicalSlug = normalizeBlogSlug(canonicalCategory);
  CATEGORY_SLUG_ALIASES.set(canonicalSlug, canonicalSlug);

  for (const translation of Object.values(translations)) {
    CATEGORY_SLUG_ALIASES.set(normalizeBlogSlug(translation.category), canonicalSlug);
  }
}

export function getLocalizedBlogSlug(post: BlogSlugSource, locale: string): string {
  const supportedLocale: Locale = isLocale(locale) ? locale : "it";
  const translations = BLOG_POST_TRANSLATIONS[post.id];
  const mapped = translations?.[supportedLocale]?.slug ?? translations?.en?.slug ?? translations?.it?.slug;
  return normalizeBlogSlug(mapped ?? post.slug ?? post.id);
}

export function getLocalizedBlogCategory(post: BlogSlugSource, locale: string): string {
  const supportedLocale: Locale = isLocale(locale) ? locale : "it";
  const translations = BLOG_POST_TRANSLATIONS[post.id];
  return translations?.[supportedLocale]?.category ?? translations?.en?.category ?? translations?.it?.category ?? post.category ?? "";
}

export function getBlogCategorySlug(category: string): string {
  return normalizeBlogSlug(category);
}

export function getLocalizedBlogCategorySlug(post: BlogSlugSource, locale: string): string {
  return normalizeBlogSlug(getLocalizedBlogCategory(post, locale));
}

export function findCategoryNameBySlug(routeParam: unknown, locale: string): string | undefined {
  const wanted = normalizeBlogSlug(routeParam);
  if (!wanted) return undefined;

  const supportedLocale: Locale = isLocale(locale) ? locale : "it";

  // Search in BLOG_POST_TRANSLATIONS
  for (const translations of Object.values(BLOG_POST_TRANSLATIONS)) {
    for (const trans of Object.values(translations)) {
      if (normalizeBlogSlug(trans.category) === wanted) {
        return translations[supportedLocale]?.category ?? trans.category;
      }
    }
  }

  return undefined;
}

export function getBlogCategoryHref(category: string) {
  return {
    pathname: "/blog/category/[category]",
    params: { category: getBlogCategorySlug(category) },
  } as const;
}

export function getLocalizedBlogHref(post: BlogSlugSource, locale: string) {
  return {
    pathname: "/blog/category/[category]/[slug]",
    params: {
      category: getLocalizedBlogCategorySlug(post, locale),
      slug: getLocalizedBlogSlug(post, locale),
    },
  } as const;
}

export function findBlogPostBySlug<T extends BlogSlugSource>(posts: T[], routeParam: unknown): T | undefined {
  const wanted = normalizeBlogSlug(routeParam);
  if (!wanted) return undefined;

  return posts.find((post) => {
    const candidates = new Set<string>([
      normalizeBlogSlug(post.id),
      normalizeBlogSlug(post.slug ?? post.id),
    ]);

    const localized = BLOG_POST_TRANSLATIONS[post.id];
    if (localized) {
      for (const trans of Object.values(localized)) {
        candidates.add(normalizeBlogSlug(trans.slug));
      }
    }

    return candidates.has(wanted);
  });
}
