// Keep localized checkout/admin views out of the visit denominator as well.
import { locales } from "@/i18n/pathnames";
const prefixes = ["", ...locales.map((locale) => `/${locale}`)];
const routes = ["checkout", "payment", "payments", "stripe", "api", "_next", "admin", "developer"];
export const SITE_ANALYTICS_FILTER = {
  NOT: prefixes.flatMap((locale) => routes.flatMap((route) => [
    { path: { equals: `${locale}/${route}` } },
    { path: { startsWith: `${locale}/${route}/` } },
  ])),
};
