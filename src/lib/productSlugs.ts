import { locales, type Locale } from "@/i18n/pathnames";

type ProductSlugSource = {
  id: string;
  slug?: string | null;
};

const PRODUCT_LOCALE_SLUGS: Partial<Record<string, Partial<Record<Locale, string>>>> = {
  evo: {
    it: "evo",
    en: "evo",
    de: "evo",
    nl: "evo",
    da: "evo",
    no: "evo",
    es: "evo",
    fr: "evo",
    us: "evo",
  },
  "evo-latta": {
    it: "olio-evo-latta",
    en: "evo-oil-can",
    de: "evo-olivenoel-kanister",
    nl: "evo-olijfolie-blik",
    da: "evo-olivenolie-dunk",
    no: "evo-olivenolje-kanne",
    es: "lata-aceite-evo",
    fr: "bidon-huile-evo",
    us: "evo-oil-can",
  },
  "fruttato-leggero": {
    it: "fruttato-leggero",
    en: "light-fruity",
    de: "leicht-fruchtig",
    nl: "licht-fruitig",
    da: "let-frugtig",
    no: "lett-fruktig",
    es: "frutado-ligero",
    fr: "fruite-leger",
    us: "light-fruity",
  },
  "fruttato-leggero-latta": {
    it: "olio-extra-vergine-di-oliva-fruttato-leggero-latta",
    en: "light-fruity-extra-virgin-olive-oil-can",
    de: "leicht-fruchtiges-natives-olivenoel-extra-kanister",
    nl: "licht-fruitige-extra-vierge-olijfolie-blik",
    da: "let-frugtig-ekstra-jomfruolivenolie-dunk",
    no: "lett-fruktig-extra-virgin-olivenolje-kanne",
    es: "lata-aceite-virgen-extra-frutado-ligero",
    fr: "bidon-huile-d-olive-vierge-extra-fruite-leger",
    us: "light-fruity-extra-virgin-olive-oil-can",
  },
  "fruttato-medio": {
    it: "fruttato-medio",
    en: "medium-fruity",
    de: "mittel-fruchtig",
    nl: "medium-fruitig",
    da: "medium-frugtig",
    no: "middels-fruktig",
    es: "frutado-medio",
    fr: "fruite-moyen",
    us: "medium-fruity",
  },
  "fruttato-medio-latta": {
    it: "olio-extra-vergine-di-oliva-fruttato-medio-latta",
    en: "medium-fruity-extra-virgin-olive-oil-can",
    de: "mittel-fruchtiges-natives-olivenoel-extra-kanister",
    nl: "medium-fruitige-extra-vierge-olijfolie-blik",
    da: "medium-frugtig-ekstra-jomfruolivenolie-dunk",
    no: "middels-fruktig-extra-virgin-olivenolje-kanne",
    es: "lata-aceite-virgen-extra-frutado-medio",
    fr: "bidon-huile-d-olive-vierge-extra-fruite-moyen",
    us: "medium-fruity-extra-virgin-olive-oil-can",
  },
  "fruttato-intenso": {
    it: "fruttato-intenso",
    en: "intense-fruity",
    de: "intens-fruchtig",
    nl: "intens-fruitig",
    da: "intens-frugtig",
    no: "intens-fruktig",
    es: "frutado-intenso",
    fr: "fruite-intense",
    us: "intense-fruity",
  },
  "fruttato-intenso-latta": {
    it: "olio-extra-vergine-di-oliva-fruttato-intenso-latta",
    en: "intense-fruity-extra-virgin-olive-oil-can",
    de: "intens-fruchtiges-natives-olivenoel-extra-kanister",
    nl: "intens-fruitige-extra-vierge-olijfolie-blik",
    da: "intens-frugtig-ekstra-jomfruolivenolie-dunk",
    no: "intens-fruktig-extra-virgin-olivenolje-kanne",
    es: "lata-aceite-virgen-extra-frutado-intenso",
    fr: "bidon-huile-d-olive-vierge-extra-fruite-intense",
    us: "intense-fruity-extra-virgin-olive-oil-can",
  },
  tartufo: {
    it: "tartufo",
    en: "truffle",
    de: "trueffel",
    nl: "truffel",
    da: "troeffel",
    no: "troffel",
    es: "trufa",
    fr: "truffe",
    us: "truffle",
  },
  peperoncino: {
    it: "peperoncino",
    en: "chili-pepper",
    de: "chili",
    nl: "chilipeper",
    da: "chili",
    no: "chili",
    es: "guindilla",
    fr: "piment",
    us: "chili-pepper",
  },
  vino: {
    it: "vino-vittoria",
    en: "vittoria-wine",
    de: "vittoria-wein",
    nl: "vittoria-wijn",
    da: "vittoria-vin",
    no: "vittoria-vin",
    es: "vino-vittoria",
    fr: "vin-vittoria",
    us: "vittoria-wine",
  },
};

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeProductSlug(value: unknown): string {
  const decoded = safeDecodeURIComponent(String(value ?? ""));
  return decoded
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\/+$/, "");
}

export function getLocalizedProductSlug(product: ProductSlugSource, locale: string): string {
  const supportedLocale: Locale = isLocale(locale) ? locale : "it";
  const mapped = PRODUCT_LOCALE_SLUGS[product.id]?.[supportedLocale];
  return normalizeProductSlug(mapped ?? product.slug ?? product.id);
}

export function getLocalizedProductHref(product: ProductSlugSource, locale: string) {
  return {
    pathname: "/shop/[prodotto]",
    params: { prodotto: getLocalizedProductSlug(product, locale) },
  } as const;
}

export function findProductBySlug<T extends ProductSlugSource>(products: T[], routeParam: unknown): T | undefined {
  const wanted = normalizeProductSlug(routeParam);
  if (!wanted) return undefined;

  return products.find((product) => {
    const candidates = new Set<string>([
      normalizeProductSlug(product.id),
      normalizeProductSlug(product.slug ?? product.id),
    ]);

    const localized = PRODUCT_LOCALE_SLUGS[product.id];
    if (localized) {
      for (const slug of Object.values(localized)) {
        candidates.add(normalizeProductSlug(slug));
      }
    }

    return candidates.has(wanted);
  });
}

export function getCleanSize(variantId: string, locale: string) {
  const isL = ["en", "es", "fr", "us", "de"].includes(locale);
  if (variantId === "500ml") return "500 ml";
  if (variantId === "750ml") return "750 ml";
  if (variantId === "1lt") return isL ? "1 L" : "1 lt";
  if (variantId === "3lt") return isL ? "3 L" : "3 lt";
  if (variantId === "5lt") return isL ? "5 L" : "5 lt";
  return "";
}

export function translateVariantLabel(id: string, fallback: string, locale: string) {
  const targetLocale = locale === "us" ? "en" : locale;
  const labels: Record<string, Record<string, string>> = {
    "500ml": {
      it: "Bottiglia 500 ml",
      en: "Bottle 500 ml",
      de: "Flasche 500 ml",
      nl: "Fles 500 ml",
      da: "Flaske 500 ml",
      no: "Flaske 500 ml",
      es: "Botella 500 ml",
      fr: "Bouteille 500 ml",
    },
    "750ml": {
      it: "Bottiglia 750 ml",
      en: "Bottle 750 ml",
      de: "Flasche 750 ml",
      nl: "Fles 750 ml",
      da: "Flaske 750 ml",
      no: "Flaske 750 ml",
      es: "Botella 750 ml",
      fr: "Bouteille 750 ml",
    },
    "1lt": {
      it: "Bottiglia 1 L",
      en: "Bottle 1 L",
      de: "Flasche 1 L",
      nl: "Fles 1 L",
      da: "Flaske 1 L",
      no: "Flaske 1 L",
      es: "Botella 1 L",
      fr: "Bouteille 1 L",
    },
    "3lt": {
      it: "Latta 3 L",
      en: "Can 3 L",
      de: "Kanister 3 L",
      nl: "Blik 3 L",
      da: "Dunk 3 L",
      no: "Kanne 3 L",
      es: "Lata 3 L",
      fr: "Bidon 3 L",
    },
    "5lt": {
      it: "Latta 5 L",
      en: "Can 5 L",
      de: "Kanister 5 L",
      nl: "Blik 5 L",
      da: "Dunk 5 L",
      no: "Kanne 5 L",
      es: "Lata 5 L",
      fr: "Bidon 5 L",
    },
    bottiglia: {
      it: "Bottiglia",
      en: "Bottle",
      de: "Flasche",
      nl: "Fles",
      da: "Flaske",
      no: "Flaske",
      es: "Botella",
      fr: "Bouteille",
    },
  };

  return labels[id]?.[targetLocale] ?? labels[id]?.[locale] ?? fallback;
}

export function translateVariantTitle(
  variantId: string,
  variantTitle: string,
  translatedProductTitle: string,
  locale: string
) {
  if (locale === "it") return variantTitle;
  const size = getCleanSize(variantId, locale);
  return size ? `${translatedProductTitle} ${size}` : translatedProductTitle;
}

