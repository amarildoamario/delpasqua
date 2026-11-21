const marketPricing = {
  // Fixed storefront price multipliers in basis points.
  us: { currency: "USD", format: "en-US", multiplier: 11_000 },
  en: { currency: "GBP", format: "en-GB", multiplier: 8_400 },
} as const;

export type Currency = (typeof marketPricing)[keyof typeof marketPricing]["currency"] | "EUR";

function marketForLocale(locale: string) {
  return locale === "us" || locale === "en" ? marketPricing[locale] : null;
}

export function storefrontCurrency(locale: string): Currency {
  return marketForLocale(locale)?.currency ?? "EUR";
}

export function convertStorefrontCents(eurCents: number, locale: string): number {
  const market = marketForLocale(locale);
  return market
    ? Math.sign(eurCents) * Math.round(Math.abs(eurCents) * market.multiplier / 10_000)
    : eurCents;
}

export function formatMoney(cents: number, currency: Currency, locale = currency === "USD" ? "us" : currency === "GBP" ? "en" : "it") {
  return new Intl.NumberFormat(marketForLocale(locale)?.format ?? (locale === "it" ? "it-IT" : locale), {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatEUR(cents: number, locale = "it") {
  return formatMoney(cents, "EUR", locale);
}

export function formatStorefrontPrice(eurCents: number, locale: string) {
  return formatMoney(convertStorefrontCents(eurCents, locale), storefrontCurrency(locale), locale);
}
