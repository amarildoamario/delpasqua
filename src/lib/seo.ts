import type { Metadata } from "next";
import { locales, localizedPathnames, type Locale } from "@/i18n/pathnames";
import { getLocalizedProductSlug } from "@/lib/productSlugs";
import { getLocalizedBlogSlug, getLocalizedBlogCategorySlug, type BlogSlugSource } from "@/lib/blogSlugs";
import { hasBlogPostTranslation } from "@/lib/blog-data";

const PRODUCTION_SITE_URL = "https://delpasqua.com";
const LOCAL_SITE_URL = "http://localhost:3000";

function isPrivateLanHost(hostname: string) {
  return (
    hostname === "0.0.0.0" ||
    hostname === "127.0.0.1" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

export function getSiteUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  
  if (!url) {
    if (process.env.NODE_ENV === "development") {
      url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    } else {
      const fallback =
        process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview"
          ? PRODUCTION_SITE_URL
          : process.env.VERCEL_PROJECT_PRODUCTION_URL
              ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
              : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : PRODUCTION_SITE_URL);
      
      if (typeof window === "undefined") {
        console.warn(`[SEO Warning] SITE_URL or NEXT_PUBLIC_SITE_URL is not configured in production! Using fallback: ${fallback}`);
      }
      url = fallback;
    }
  }

  // Normalizza il dominio:
  let normalized = url.trim();

  // Rimuove eventuale protocollo per manipolazione
  let protocol = "https://";
  if (normalized.startsWith("http://")) {
    protocol = "http://";
    normalized = normalized.slice(7);
  } else if (normalized.startsWith("https://")) {
    protocol = "https://";
    normalized = normalized.slice(8);
  } else {
    const isProd = process.env.NODE_ENV === "production";
    protocol = isProd ? "https://" : "http://";
  }

  // Rimuove path, query string, hash
  const slashIndex = normalized.indexOf("/");
  if (slashIndex !== -1) {
    normalized = normalized.slice(0, slashIndex);
  }
  const queryIndex = normalized.indexOf("?");
  if (queryIndex !== -1) {
    normalized = normalized.slice(0, queryIndex);
  }
  const hashIndex = normalized.indexOf("#");
  if (hashIndex !== -1) {
    normalized = normalized.slice(0, hashIndex);
  }

  // Rimuove slash finale
  normalized = normalized.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    const hostname = normalized.split(":")[0];
    if (isPrivateLanHost(hostname)) {
      return LOCAL_SITE_URL;
    }
  }

  // Garantisce protocollo https:// in produzione se manca o è http ed è un dominio reale (non localhost)
  if (process.env.NODE_ENV === "production" && !normalized.includes("localhost")) {
    protocol = "https://";
  }

  return `${protocol}${normalized}`;
}

export const SITE_URL = getSiteUrl();
export const SITE_NAME = "Frantoio Del Pasqua";

/**
 * Route locale identifiers are intentionally short because they are part of the URL
 * (for example, /us/). SEO annotations must use BCP 47 language tags instead.
 */
const SEO_LOCALE_CODES: Record<Locale, string> = {
  it: "it",
  en: "en",
  de: "de",
  nl: "nl",
  da: "da",
  no: "no",
  es: "es",
  fr: "fr",
  us: "en-US",
};

export function getSeoLocale(locale: string) {
  return SEO_LOCALE_CODES[locale as Locale] ?? locale;
}

const REQUIRED_CORE_INTERNAL_PATHS = [
  "/",
  "/storia/",
  "/produzione/",
  "/il-nostro-olio/",
  "/shop/",
  "/acquista/",
  "/contatti/",
  "/privacy/",
  "/cookie/",
  "/termini/",
  "/degustazioni/",
  "/olio-toscano/",
  "/olio-biologico/",
  "/nuovo-raccolto/",
  "/olio-5-litri/",
] as const;

export const REQUIRED_CORE_INDEXABLE_PATHS = REQUIRED_CORE_INTERNAL_PATHS.flatMap((path) =>
  locales.map((locale) => localizedPath(path, locale))
);

export const REQUIRED_UTILITY_NOINDEX_PATHS = [
  "/carrello/",
  "/checkout/",
  "/my-account/",
 ] as const;

const HREFLANG_CORE_PATHS = new Set([
  "/",
  "/shop/",
  "/acquista/",
  "/produzione/",
  "/il-nostro-olio/",
  "/contatti/",
  "/storia/",
  "/privacy/",
  "/privacy-policy/",
  "/cookie/",
  "/cookie-policy/",
  "/termini/",
  "/condizioni-generali-di-vendita/",
  "/degustazioni/",
  "/parita-di-genere/",
  "/resi/",
  "/spedizioni/",
  "/blog/",
  "/olio-toscano/",
  "/olio-biologico/",
  "/nuovo-raccolto/",
  "/olio-5-litri/",
]);

const OG_LOCALES: Record<string, string> = {
  it: "it_IT",
  en: "en_US",
  de: "de_DE",
  nl: "nl_NL",
  da: "da_DK",
  no: "nb_NO",
  es: "es_ES",
  fr: "fr_FR",
  us: "en_US",
};

export function getOpenGraphLocale(locale: string) {
  return OG_LOCALES[locale] ?? locale;
}

type LocalizedSeoCopy = {
  title: string;
  description: string;
};

/**
 * Page modules still own their default (legacy) copy. This table supplies the
 * search-facing text for the new language markets in one place, so title,
 * description and Open Graph cannot silently fall back to Italian.
 */
const SEO_COPY_BY_PATH: Partial<Record<string, Partial<Record<"es" | "fr" | "us", LocalizedSeoCopy>>>> = {
  "/": {
    es: {
      title: "Frantoio Del Pasqua",
      description: "Aceite de oliva virgen extra, tradición del molino toscano y productos Del Pasqua seleccionados.",
    },
    fr: {
      title: "Frantoio Del Pasqua",
      description: "Huile d'olive vierge extra, tradition du moulin toscan et produits Del Pasqua sélectionnés.",
    },
    us: {
      title: "Frantoio Del Pasqua",
      description: "Extra virgin olive oil, Tuscan mill tradition and selected Del Pasqua products.",
    },
  },
  "/storia/": {
    es: { title: "Nuestra historia", description: "Historia familiar, olivares y tradición agrícola toscana de Frantoio Del Pasqua." },
    fr: { title: "Notre histoire", description: "Histoire familiale, oliveraies et tradition agricole toscane de Frantoio Del Pasqua." },
    us: { title: "Our Story", description: "Family history, olive groves and Tuscan agricultural tradition of Frantoio Del Pasqua." },
  },
  "/produzione/": {
    es: { title: "Producción y almazara", description: "Descubre la producción de Frantoio Del Pasqua: extracción en frío, proceso controlado y trazabilidad." },
    fr: { title: "Production et moulin à huile", description: "Découvrez la production de Frantoio Del Pasqua : extraction à froid, procédé contrôlé et traçabilité." },
    us: { title: "Production and Oil Mill", description: "Discover Del Pasqua oil mill production: cold extraction, controlled process and traceability." },
  },
  "/il-nostro-olio/": {
    es: { title: "Nuestro aceite de oliva", description: "Descubre los aceites de oliva virgen extra Del Pasqua, sus formatos y perfiles sensoriales." },
    fr: { title: "Notre huile d'olive", description: "Découvrez les huiles d'olive vierge extra Del Pasqua, leurs formats et leurs profils sensoriels." },
    us: { title: "Our Olive Oil", description: "Discover Del Pasqua extra virgin olive oils, formats and sensory profiles." },
  },
  "/shop/": {
    es: { title: "Tienda", description: "Compra online aceite de oliva virgen extra Del Pasqua y productos seleccionados." },
    fr: { title: "Boutique", description: "Achetez en ligne l'huile d'olive vierge extra Del Pasqua et une sélection de produits." },
    us: { title: "Shop", description: "Buy Del Pasqua extra virgin olive oil and selected products online." },
  },
  "/acquista/": {
    es: { title: "Comprar aceite de oliva Del Pasqua", description: "Compra online aceite de oliva virgen extra Del Pasqua en la tienda oficial." },
    fr: { title: "Acheter l'huile d'olive Del Pasqua", description: "Achetez en ligne l'huile d'olive vierge extra Del Pasqua dans la boutique officielle." },
    us: { title: "Buy Del Pasqua Olive Oil", description: "Buy Del Pasqua extra virgin olive oil online from the official shop." },
  },
  "/contatti/": {
    es: { title: "Contacto", description: "Contacta con Frantoio Del Pasqua en Monte San Savino para productos, pedidos y solicitudes comerciales." },
    fr: { title: "Contact", description: "Contactez Frantoio Del Pasqua à Monte San Savino pour les produits, commandes et demandes commerciales." },
    us: { title: "Contact", description: "Contact Frantoio Del Pasqua in Monte San Savino for products, orders and business requests." },
  },
  "/degustazioni/": {
    es: { title: "Catas de aceite de oliva", description: "Descubre las catas de aceite de oliva virgen extra de Frantoio Del Pasqua en Toscana." },
    fr: { title: "Dégustations d'huile d'olive", description: "Découvrez les dégustations d'huile d'olive vierge extra de Frantoio Del Pasqua en Toscane." },
    us: { title: "Olive Oil Tastings", description: "Discover Frantoio Del Pasqua extra virgin olive oil tastings in Tuscany." },
  },
  "/olio-toscano/": {
    es: { title: "Aceite de oliva toscano", description: "Descubre el aceite de oliva virgen extra toscano de Frantoio Del Pasqua, elaborado con aceitunas seleccionadas." },
    fr: { title: "Huile d'olive toscane", description: "Découvrez l'huile d'olive vierge extra toscane de Frantoio Del Pasqua, élaborée avec des olives sélectionnées." },
    us: { title: "Tuscan Olive Oil", description: "Discover Frantoio Del Pasqua Tuscan extra virgin olive oil, made from selected olives." },
  },
  "/olio-biologico/": {
    es: { title: "Comprar aceite de oliva ecológico", description: "Compra aceite de oliva virgen extra ecológico Del Pasqua en la tienda oficial." },
    fr: { title: "Acheter de l'huile d'olive biologique", description: "Achetez l'huile d'olive vierge extra biologique Del Pasqua dans la boutique officielle." },
    us: { title: "Buy Organic Olive Oil", description: "Buy Del Pasqua organic extra virgin olive oil from the official shop." },
  },
  "/nuovo-raccolto/": {
    es: { title: "Aceite de oliva de nueva cosecha", description: "Descubre el aceite de oliva virgen extra de nueva cosecha de Frantoio Del Pasqua." },
    fr: { title: "Huile d'olive de nouvelle récolte", description: "Découvrez l'huile d'olive vierge extra de nouvelle récolte de Frantoio Del Pasqua." },
    us: { title: "New Harvest Olive Oil", description: "Discover Frantoio Del Pasqua new harvest extra virgin olive oil." },
  },
  "/olio-5-litri/": {
    es: { title: "Aceite de oliva de 5 litros", description: "Compra la lata de 5 litros de aceite de oliva virgen extra Del Pasqua en la tienda oficial." },
    fr: { title: "Huile d'olive 5 litres", description: "Achetez le bidon de 5 litres d'huile d'olive vierge extra Del Pasqua dans la boutique officielle." },
    us: { title: "5 Liter Olive Oil", description: "Buy the 5 liter can of Del Pasqua extra virgin olive oil from the official shop." },
  },
  "/blog/": {
    es: { title: "Blog y noticias | Frantoio Del Pasqua", description: "Descubre noticias, consejos de cata y secretos de nuestra almazara. Un blog dedicado al aceite de oliva virgen extra." },
    fr: { title: "Blog et actualités | Frantoio Del Pasqua", description: "Découvrez les actualités, conseils de dégustation et secrets de notre moulin. Un blog dédié à l'huile d'olive vierge extra." },
    us: { title: "Blog & News | Frantoio Del Pasqua", description: "Discover the latest news, tasting tips, and secrets of our olive mill. A blog dedicated to extra virgin olive oil." },
  },
  "/privacy/": {
    es: { title: "Política de privacidad", description: "Información sobre el tratamiento de datos personales en el sitio web de Frantoio Del Pasqua." },
    fr: { title: "Politique de confidentialité", description: "Informations sur le traitement des données personnelles sur le site de Frantoio Del Pasqua." },
    us: { title: "Privacy Policy", description: "Information about the processing of personal data on the Frantoio Del Pasqua website." },
  },
  "/cookie/": {
    es: { title: "Política de cookies", description: "Información sobre las cookies y tecnologías similares utilizadas por el sitio web de Frantoio Del Pasqua." },
    fr: { title: "Politique de cookies", description: "Informations sur les cookies et technologies similaires utilisés par le site de Frantoio Del Pasqua." },
    us: { title: "Cookie Policy", description: "Information about cookies and similar technologies used by the Frantoio Del Pasqua website." },
  },
  "/termini/": {
    es: { title: "Condiciones generales de venta", description: "Condiciones de venta e información comercial del sitio web de Frantoio Del Pasqua." },
    fr: { title: "Conditions générales de vente", description: "Conditions de vente et informations commerciales du site web de Frantoio Del Pasqua." },
    us: { title: "Terms and Conditions", description: "Terms, sales conditions, and commercial information of the Frantoio Del Pasqua website." },
  },
  "/resi/": {
    es: { title: "Devoluciones", description: "Información sobre devoluciones y derecho de desistimiento para compras en Frantoio Del Pasqua." },
    fr: { title: "Retours", description: "Informations sur les retours et le droit de rétractation pour les achats Frantoio Del Pasqua." },
    us: { title: "Returns", description: "Information about returns and the right of withdrawal for Frantoio Del Pasqua purchases." },
  },
  "/spedizioni/": {
    es: { title: "Envíos", description: "Información sobre envíos, plazos de entrega y costes de los pedidos Frantoio Del Pasqua." },
    fr: { title: "Livraison", description: "Informations sur la livraison, les délais et les frais des commandes Frantoio Del Pasqua." },
    us: { title: "Shipping", description: "Information about shipping, delivery times and costs for Frantoio Del Pasqua orders." },
  },
  "/parita-di-genere/": {
    es: { title: "Igualdad de género", description: "Política de igualdad de género de Frantoio Del Pasqua." },
    fr: { title: "Égalité femmes-hommes", description: "Politique d'égalité femmes-hommes de Frantoio Del Pasqua." },
    us: { title: "Gender Equality", description: "Frantoio Del Pasqua gender equality policy." },
  },
  "/smaltimenti/": {
    es: { title: "Eliminación de residuos", description: "Información sobre la eliminación correcta de los envases de Frantoio Del Pasqua." },
    fr: { title: "Élimination des déchets", description: "Informations sur l'élimination correcte des emballages Frantoio Del Pasqua." },
    us: { title: "Waste Disposal", description: "Information about proper disposal of Frantoio Del Pasqua packaging." },
  },
};

function getLocalizedSeoCopy(path: string, locale: string, fallback: LocalizedSeoCopy): LocalizedSeoCopy {
  const normalizedPath = normalizePath(path);
  const marketLocale = locale === "es" || locale === "fr" || locale === "us" ? locale : null;
  return (marketLocale && SEO_COPY_BY_PATH[normalizedPath]?.[marketLocale]) ?? fallback;
}

export function normalizePath(path: string) {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") return "/";
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function localizedPath(path: string, locale: string) {
  const normalized = normalizePath(path);
  const supportedLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";

  if (normalized === "/") {
    return supportedLocale === "it" ? "/" : `/${supportedLocale}/`;
  }

  const internalPath = normalized.replace(/\/$/, "");
  const externalPath = localizedPathnames[internalPath]?.[supportedLocale] ?? normalized;

  if (supportedLocale === "it") {
    return normalizePath(externalPath);
  }

  return normalizePath(`/${supportedLocale}${externalPath}`);
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${normalizePath(path)}`;
}

export function getProductAlternateUrls(product: { id: string; slug?: string | null }) {
  const urls: Record<string, string> = {};
  for (const locale of locales) {
    const slug = getLocalizedProductSlug(product, locale);
    const template = localizedPathnames["/shop/[prodotto]"]?.[locale] || "/shop/[prodotto]";
    const resolvedPath = template.replace("[prodotto]", slug);
    const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
    urls[getSeoLocale(locale)] = absoluteUrl(fullPath);
  }
  urls["x-default"] = urls["it"];
  return urls;
}

export function getBlogAlternateUrls(post: BlogSlugSource) {
  const urls: Record<string, string> = {};
  for (const locale of locales) {
    if (!hasBlogPostTranslation(post, locale)) continue;

    const categorySlug = getLocalizedBlogCategorySlug(post, locale);
    const postSlug = getLocalizedBlogSlug(post, locale);
    const template = localizedPathnames["/blog/category/[category]/[slug]"]?.[locale] || "/blog/category/[category]/[slug]";
    const resolvedPath = template
      .replace("[category]", categorySlug)
      .replace("[slug]", postSlug);
    const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
    urls[getSeoLocale(locale)] = absoluteUrl(fullPath);
  }
  urls["x-default"] = urls["it"];
  return urls;
}

export function pageMetadata({
  title,
  description,
  path,
  locale,
  index = true,
  canonicalPath,
  hreflang = HREFLANG_CORE_PATHS.has(normalizePath(path)),
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  index?: boolean;
  canonicalPath?: string;
  hreflang?: boolean;
}): Metadata {
  const normalizedPath = normalizePath(path);
  const localizedCopy = getLocalizedSeoCopy(normalizedPath, locale, { title, description });
  const canonical = absoluteUrl(canonicalPath ?? localizedPath(normalizedPath, locale));
  const languages = hreflang
    ? Object.fromEntries([
        ...locales.map((l) => [getSeoLocale(l), absoluteUrl(localizedPath(normalizedPath, l))]),
        ["x-default", absoluteUrl(localizedPath(normalizedPath, "it"))],
      ])
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: localizedCopy.title,
    description: localizedCopy.description,
    ...(index ? {
      alternates: {
        canonical,
        ...(languages ? { languages } : {}),
      }
    } : {}),
    robots: index
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
    openGraph: {
      title: localizedCopy.title,
      description: localizedCopy.description,
      ...(index ? { url: canonical } : {}),
      siteName: SITE_NAME,
      locale: getOpenGraphLocale(locale),
      type: "website",
    },
  };
}
