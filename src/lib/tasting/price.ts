export type LocalizedTastingPrice = {
  hasFrom: boolean;
  amount: string;
  unit?: string;
};

const ON_REQUEST_MAP: Record<string, string> = {
  it: "Su richiesta",
  en: "On request",
  us: "On request",
  de: "Auf Anfrage",
  nl: "Op aanvraag",
  da: "På forespørgsel",
  no: "På forespørsel",
  es: "Bajo petición",
  fr: "Sur demande",
};

const PERSON_MAP: Record<string, string> = {
  it: "persona",
  en: "person",
  us: "person",
  de: "Person",
  nl: "persoon",
  da: "person",
  no: "person",
  es: "persona",
  fr: "personne",
};

export function splitTastingPrice(rawPrice?: string, locale = "it"): LocalizedTastingPrice | null {
  const raw = rawPrice?.trim();
  if (!raw) return null;

  if (raw.toLowerCase().includes("richiesta") || raw.toLowerCase().includes("request")) {
    return {
      hasFrom: false,
      amount: ON_REQUEST_MAP[locale] ?? ON_REQUEST_MAP.it,
    };
  }

  const hasFrom = /^da\s+/i.test(raw);
  const withoutFrom = raw.replace(/^da\s+/i, "");
  const [amount, unit] = withoutFrom.split("/");

  const trimmedUnit = unit?.trim();
  let localizedUnit = trimmedUnit;
  if (trimmedUnit && trimmedUnit.toLowerCase().includes("persona")) {
    localizedUnit = PERSON_MAP[locale] ?? PERSON_MAP.it;
  }

  return {
    hasFrom,
    amount: amount.trim(),
    unit: localizedUnit,
  };
}

export function getPriceFromLabel(locale: string): string {
  const labels: Record<string, string> = {
    it: "Da",
    en: "From",
    us: "From",
    de: "Ab",
    nl: "Vanaf",
    da: "Fra",
    no: "Fra",
    es: "Desde",
    fr: "Dès",
  };

  return labels[locale] ?? labels.it;
}
