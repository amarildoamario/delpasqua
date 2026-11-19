import { locales, type Locale } from "@/i18n/pathnames";
import { BLOG_PRODUCT_POSITIONS, type BlogProductPosition } from "./events";

export function blogProductClickData(data: Record<string, unknown>) {
  const { article, locale, position } = data;
  if (
    typeof article !== "string" || article.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article) ||
    !locales.includes(locale as Locale) || !BLOG_PRODUCT_POSITIONS.includes(position as BlogProductPosition)
  ) return {};

  return { article, locale, position };
}
