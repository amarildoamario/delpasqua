export function formatEUR(cents: number, locale = "it") {
  return new Intl.NumberFormat(locale === "us" ? "en-US" : locale === "it" ? "it-IT" : locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
