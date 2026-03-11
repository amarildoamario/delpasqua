type TranslateFn = (key: string) => string;

const PROMO_ERROR_KEYS: Record<string, string> = {
  "Codice non valido.": "errors.promo_invalid",
  "Codice sconto non trovato o non attivo.": "errors.promo_not_active",
  "Codice sconto non valido.": "errors.promo_invalid_discount",
  "Errore di rete. Riprova.": "errors.network_retry",
};

const CHECKOUT_ERROR_KEYS: Record<string, string> = {
  "Carrello vuoto": "errors.empty_cart",
  "Il carrello è vuoto.": "errors.empty_cart",
  "Prodotto non disponibile.": "errors.product_unavailable",
  "Troppe richieste. Riprova tra poco.": "errors.too_many_requests",
  "Carrello non valido.": "errors.invalid_cart",
  "Errore durante la creazione dell'ordine.": "errors.order_creation",
  "Risposta server non valida.": "errors.invalid_server_response",
  "Errore di rete.": "errors.network",
  "Checkout non disponibile": "errors.checkout_unavailable",
  "URL checkout mancante": "errors.missing_checkout_url",
  "Errore checkout": "errors.checkout_generic",
  "Nel carrello ci sono prodotti non validi. Svuota il carrello e riprova.": "errors.invalid_products",
};

function translateByMap(
  message: string | null | undefined,
  t: TranslateFn,
  map: Record<string, string>,
  fallbackKey: string
) {
  const normalized = message?.trim();
  if (!normalized) return t(fallbackKey);
  const key = map[normalized];
  return key ? t(key) : normalized;
}

export function translateCartPromoError(message: string | null | undefined, t: TranslateFn) {
  return translateByMap(message, t, PROMO_ERROR_KEYS, "errors.promo_invalid");
}

export function translateCartCheckoutError(message: string | null | undefined, t: TranslateFn) {
  return translateByMap(message, t, CHECKOUT_ERROR_KEYS, "errors.checkout_generic");
}
