export const locales = ["it", "en", "de", "nl", "da", "no"] as const;

export type Locale = (typeof locales)[number];

type LocalizedPathname = Record<Locale, string>;

export const localizedPathnames: Record<string, LocalizedPathname> = {
  "/privacy": {
    it: "/privacy-policy",
    en: "/privacy-policy",
    de: "/datenschutz",
    nl: "/privacybeleid",
    da: "/privatlivspolitik",
    no: "/personvernerklaering",
  },
  "/cookie": {
    it: "/cookie-policy",
    en: "/cookie-policy",
    de: "/cookie-richtlinie",
    nl: "/cookiebeleid",
    da: "/cookiepolitik",
    no: "/cookiepolicy",
  },
  "/termini": {
    it: "/condizioni-generali-di-vendita",
    en: "/terms",
    de: "/agb",
    nl: "/voorwaarden",
    da: "/vilkaar",
    no: "/vilkar",
  },
  "/cart": {
    it: "/carrello",
    en: "/cart",
    de: "/warenkorb",
    nl: "/winkelwagen",
    da: "/kurv",
    no: "/handlekurv",
  },
  "/shop": {
    it: "/shop",
    en: "/shop",
    de: "/laden",
    nl: "/winkel",
    da: "/butik",
    no: "/butikk",
  },
  "/shop/[prodotto]": {
    it: "/shop/[prodotto]",
    en: "/shop/[prodotto]",
    de: "/laden/[prodotto]",
    nl: "/winkel/[prodotto]",
    da: "/butik/[prodotto]",
    no: "/butikk/[prodotto]",
  },
  "/acquista": {
    it: "/acquista",
    en: "/buy",
    de: "/kaufen",
    nl: "/kopen",
    da: "/koeb",
    no: "/kjop",
  },
  "/storia": {
    it: "/storia",
    en: "/about-us",
    de: "/ueber-uns",
    nl: "/over-ons",
    da: "/om-os",
    no: "/om-oss",
  },
  "/produzione": {
    it: "/produzione",
    en: "/production",
    de: "/produktion",
    nl: "/productie",
    da: "/produktion",
    no: "/produksjon",
  },
  "/il-nostro-olio": {
    it: "/il-nostro-olio",
    en: "/olive-oil",
    de: "/olivenoel",
    nl: "/olijfolie",
    da: "/olivenolie",
    no: "/olivenolje",
  },
  "/contatti": {
    it: "/contatti",
    en: "/contact",
    de: "/kontakt",
    nl: "/contact",
    da: "/kontakt",
    no: "/kontakt",
  },
  "/degustazioni": {
    it: "/degustazioni",
    en: "/tastings",
    de: "/verkostungen",
    nl: "/proeverijen",
    da: "/smagninger",
    no: "/smakinger",
  },
};
