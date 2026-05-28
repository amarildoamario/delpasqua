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
  },
  "evo-latta": {
    it: "olio-evo-latta",
    en: "evo-oil-can",
    de: "evo-olivenoel-kanister",
    nl: "evo-olijfolie-blik",
    da: "evo-olivenolie-dunk",
    no: "evo-olivenolje-kanne",
  },
  "fruttato-leggero": {
    it: "fruttato-leggero",
    en: "light-fruity",
    de: "leicht-fruchtig",
    nl: "licht-fruitig",
    da: "let-frugtig",
    no: "lett-fruktig",
  },
  "fruttato-leggero-latta": {
    it: "olio-extra-vergine-di-oliva-fruttato-leggero-latta",
    en: "light-fruity-extra-virgin-olive-oil-can",
    de: "leicht-fruchtiges-natives-olivenoel-extra-kanister",
    nl: "licht-fruitige-extra-vierge-olijfolie-blik",
    da: "let-frugtig-ekstra-jomfruolivenolie-dunk",
    no: "lett-fruktig-extra-virgin-olivenolje-kanne",
  },
  "fruttato-medio": {
    it: "fruttato-medio",
    en: "medium-fruity",
    de: "mittel-fruchtig",
    nl: "medium-fruitig",
    da: "medium-frugtig",
    no: "middels-fruktig",
  },
  "fruttato-medio-latta": {
    it: "olio-extra-vergine-di-oliva-fruttato-medio-latta",
    en: "medium-fruity-extra-virgin-olive-oil-can",
    de: "mittel-fruchtiges-natives-olivenoel-extra-kanister",
    nl: "medium-fruitige-extra-vierge-olijfolie-blik",
    da: "medium-frugtig-ekstra-jomfruolivenolie-dunk",
    no: "middels-fruktig-extra-virgin-olivenolje-kanne",
  },
  "fruttato-intenso": {
    it: "fruttato-intenso",
    en: "intense-fruity",
    de: "intens-fruchtig",
    nl: "intens-fruitig",
    da: "intens-frugtig",
    no: "intens-fruktig",
  },
  "fruttato-intenso-latta": {
    it: "olio-extra-vergine-di-oliva-fruttato-intenso-latta",
    en: "intense-fruity-extra-virgin-olive-oil-can",
    de: "intens-fruchtiges-natives-olivenoel-extra-kanister",
    nl: "intens-fruitige-extra-vierge-olijfolie-blik",
    da: "intens-frugtig-ekstra-jomfruolivenolie-dunk",
    no: "intens-fruktig-extra-virgin-olivenolje-kanne",
  },
  tartufo: {
    it: "tartufo",
    en: "truffle",
    de: "trueffel",
    nl: "truffel",
    da: "troeffel",
    no: "troffel",
  },
  peperoncino: {
    it: "peperoncino",
    en: "chili-pepper",
    de: "chili",
    nl: "chilipeper",
    da: "chili",
    no: "chili",
  },
  vino: {
    it: "vino-vittoria",
    en: "vittoria-wine",
    de: "vittoria-wein",
    nl: "vittoria-wijn",
    da: "vittoria-vin",
    no: "vittoria-vin",
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
