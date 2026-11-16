import products from "@/db/products.json";
import { locales, localizedPathnames, type Locale } from "@/i18n/pathnames";
import { findProductBySlug, getLocalizedProductSlug } from "./productSlugs";
import { BLOG_POST_TRANSLATIONS } from "./blogTranslationsData";
import { findBlogPostBySlug, findPostByCategorySlug, normalizeBlogSlug } from "./blogSlugs";

const posts = Object.entries(BLOG_POST_TRANSLATIONS).map(([id, translations]) => ({
  id, slug: translations.it?.slug ?? id,
}));

// Recover only known content aliases, never arbitrary missing pages or assets.
export function getSeoAliasRedirect(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const prefixed = locales.includes(segments[0] as Locale);
  const locale: Locale = prefixed ? segments.shift() as Locale : "it";
  const prefix = locale === "it" ? "" : `/${locale}`;
  const shop = localizedPathnames["/shop"][locale].slice(1);
  let destination: string | undefined;

  if (segments.length === 2 && segments[0] === shop) {
    const product = findProductBySlug(products, segments[1]);
    if (product) destination = `${prefix}/${shop}/${getLocalizedProductSlug(product, locale)}/`;
  }

  const blogTemplate = localizedPathnames["/blog/category/[category]/[slug]"][locale];
  const blogBase = blogTemplate.split("/[category]")[0].slice(1);
  if (segments.length === 3 && segments.slice(0, 2).join("/") === blogBase) {
    const post = findPostByCategorySlug(posts, segments[2]);
    const translations = post && BLOG_POST_TRANSLATIONS[post.id];
    const translated = translations && (translations[locale] ?? (locale === "us" ? translations.en : undefined));
    if (translated) destination = `${prefix}/${blogBase}/${normalizeBlogSlug(translated.category)}/`;
  }
  if (segments.length === 4 && segments.slice(0, 2).join("/") === blogBase) {
    const post = findBlogPostBySlug(posts, segments[3]);
    const translations = post && BLOG_POST_TRANSLATIONS[post.id];
    const translated = translations && (translations[locale] ?? (locale === "us" ? translations.en : undefined));
    if (translated) {
      destination = `${prefix}/${blogBase}/${normalizeBlogSlug(translated.category)}/${normalizeBlogSlug(translated.slug)}/`;
    }
  }

  return destination && destination !== `${pathname.replace(/\/+$/, "")}/` ? destination : null;
}
