const CHECKOUT_LOCALES = ["it", "en", "de", "nl", "da", "no", "es", "fr", "us"] as const;

type CheckoutLocale = (typeof CHECKOUT_LOCALES)[number];

export function normalizeCheckoutLocale(value: unknown): CheckoutLocale {
  return typeof value === "string" && CHECKOUT_LOCALES.includes(value as CheckoutLocale)
    ? (value as CheckoutLocale)
    : "it";
}

export function checkoutLocalePrefix(value: unknown) {
  const locale = normalizeCheckoutLocale(value);
  return locale === "it" ? "" : `/${locale}`;
}

export function checkoutLocaleFromPathname(pathname: string) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return normalizeCheckoutLocale(firstSegment);
}
