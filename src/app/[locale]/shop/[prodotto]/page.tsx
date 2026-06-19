// src/app/shop/[prodotto]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readPublicCatalog, readPublicCatalogWithMerch } from "@/lib/server/catalog";
import { findProductBySlug, getLocalizedProductSlug } from "@/lib/productSlugs";
import { makeInventorySku } from "@/lib/inventorySku";
import Footer from "@/components/Footer";
import ProductDetailsClient from "./ProductDetailsClient";
import { getProductAlternateUrls, absoluteUrl, localizedPath, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { locales } from "@/i18n/pathnames";

type Specs = Record<string, string>;

type ProductVariant = {
  id: string;
  label: string;
  description?: string;
  priceCents: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  specs?: Specs;
  stock?: number;
  title?: string;
};

type Product = {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  badge?: string;
  merchBadge?: string | null;
  imageSrc: string;
  imageAlt: string;
  description: string;
  variants: ProductVariant[];
  specsTitle?: string;
  specs?: Specs;
  excludeFromSeo?: boolean;
};

function hasTranslation(t: { has?: (key: string) => boolean }, key: string) {
  return typeof t.has === "function" && t.has(key);
}

function translateVariantLabel(id: string, fallback: string, locale: string) {
  const labels: Record<string, Record<string, string>> = {
    "500ml": {
      it: "Bottiglia 500 ml",
      en: "Bottle 500 ml",
      de: "Flasche 500 ml",
      nl: "Fles 500 ml",
      da: "Flaske 500 ml",
      no: "Flaske 500 ml",
    },
    "750ml": {
      it: "Bottiglia 750 ml",
      en: "Bottle 750 ml",
      de: "Flasche 750 ml",
      nl: "Fles 750 ml",
      da: "Flaske 750 ml",
      no: "Flaske 750 ml",
    },
    "1lt": {
      it: "Bottiglia 1 L",
      en: "Bottle 1 L",
      de: "Flasche 1 L",
      nl: "Fles 1 L",
      da: "Flaske 1 L",
      no: "Flaske 1 L",
    },
    "3lt": {
      it: "Latta 3 L",
      en: "Can 3 L",
      de: "Kanister 3 L",
      nl: "Blik 3 L",
      da: "Dunk 3 L",
      no: "Kanne 3 L",
    },
    "5lt": {
      it: "Latta 5 L",
      en: "Can 5 L",
      de: "Kanister 5 L",
      nl: "Blik 5 L",
      da: "Dunk 5 L",
      no: "Kanne 5 L",
    },
    bottiglia: {
      it: "Bottiglia",
      en: "Bottle",
      de: "Flasche",
      nl: "Fles",
      da: "Flaske",
      no: "Flaske",
    },
  };

  return labels[id]?.[locale] ?? fallback;
}

function translateCategory(value: string | undefined, locale: string) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const categories: Record<string, Record<string, string>> = {
    olio: {
      it: "Olio",
      en: "Oil",
      de: "Olivenoel",
      nl: "Olijfolie",
      da: "Olivenolie",
      no: "Olivenolje",
    },
    vino: {
      it: "Vino",
      en: "Wine",
      de: "Wein",
      nl: "Wijn",
      da: "Vin",
      no: "Vin",
    },
  };

  return categories[normalized]?.[locale] ?? value ?? "";
}

export async function generateStaticParams() {
  const list = await readPublicCatalog();
  const params: { locale: string; prodotto: string }[] = [];

  for (const locale of locales) {
    for (const product of list) {
      params.push({
        locale,
        prodotto: getLocalizedProductSlug(product, locale),
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; prodotto: string }>;
}): Promise<Metadata> {
  const { locale, prodotto } = await params;
  const list = (await readPublicCatalogWithMerch()) as unknown as Product[];
  const product = findProductBySlug(list, prodotto);

  if (!product) return { title: "Prodotto non trovato" };

  const tp = await getTranslations({ locale, namespace: "Products" });
  const title = hasTranslation(tp, `${product.id}.title`) ? tp(`${product.id}.title`) : product.title;
  const description = hasTranslation(tp, `${product.id}.description`)
    ? tp(`${product.id}.description`)
    : product.description;

  const languages = getProductAlternateUrls(product);
  const canonical = languages[locale];

  if (product.excludeFromSeo === true) {
    return {
      title: `${title} | Frantoio Del Pasqua`,
      description,
      robots: "noindex, nofollow",
    };
  }

  return {
    title: `${title} | Frantoio Del Pasqua`,
    description,
    alternates: {
      canonical,
      languages,
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; prodotto: string }>;
  searchParams?: Promise<{ v?: string }>;
}) {
  const { locale, prodotto } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const tp = await getTranslations({ locale, namespace: "Products" });

  const list = (await readPublicCatalogWithMerch()) as unknown as Product[];
  const product = findProductBySlug(list, prodotto);

  if (!product) notFound();

  const translatedProduct: Product = {
    ...product,
    category: translateCategory(product.category, locale),
    title: locale === "it" ? product.title : (hasTranslation(tp, `${product.id}.title`) ? tp(`${product.id}.title`) : product.title),
    subtitle: locale === "it" ? product.subtitle : (hasTranslation(tp, `${product.id}.subtitle`) ? tp(`${product.id}.subtitle`) : product.subtitle),
    badge: locale === "it" ? product.badge : (hasTranslation(tp, `${product.id}.badge`) ? tp(`${product.id}.badge`) : product.badge),
    merchBadge: product.merchBadge ?? null,
    description: locale === "it" ? product.description : (hasTranslation(tp, `${product.id}.description`) ? tp(`${product.id}.description`) : product.description),
    variants: product.variants.map((variant) => ({
      ...variant,
      label: locale === "it" ? variant.label : (hasTranslation(tp, `${product.id}.variants.${variant.id}`) ? tp(`${product.id}.variants.${variant.id}`) : translateVariantLabel(variant.id, variant.label, locale)),
      description: locale === "it" ? variant.description : (hasTranslation(tp, `${product.id}.variantDescriptions.${variant.id}`) ? tp(`${product.id}.variantDescriptions.${variant.id}`) : variant.description),
    })),
  };


  // Traduce tutti gli altri prodotti per passarli come raccomandati
  const relatedProducts: Product[] = list
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      ...p,
      category: translateCategory(p.category, locale),
      title: hasTranslation(tp, `${p.id}.title`) ? tp(`${p.id}.title`) : p.title,
      subtitle: hasTranslation(tp, `${p.id}.subtitle`) ? tp(`${p.id}.subtitle`) : p.subtitle,
      badge: hasTranslation(tp, `${p.id}.badge`) ? tp(`${p.id}.badge`) : p.badge,
      merchBadge: p.merchBadge ?? null,
      description: hasTranslation(tp, `${p.id}.description`)
        ? tp(`${p.id}.description`)
        : p.description ?? "",
      variants: p.variants.map((variant) => ({
        ...variant,
        label: hasTranslation(tp, `${p.id}.variants.${variant.id}`)
          ? tp(`${p.id}.variants.${variant.id}`)
          : translateVariantLabel(variant.id, variant.label, locale),
        description: hasTranslation(tp, `${p.id}.variantDescriptions.${variant.id}`)
          ? tp(`${p.id}.variantDescriptions.${variant.id}`)
          : variant.description,
      })),
    }));

  const languages = getProductAlternateUrls(product);
  const canonical = languages[locale];
  const homeUrl = absoluteUrl(localizedPath("/", locale));
  const shopUrl = absoluteUrl(localizedPath("/shop", locale));

  const shopLabelMap: Record<string, string> = {
    it: "Shop",
    en: "Shop",
    de: "Online-Shop",
    nl: "Winkel",
    da: "Butik",
    no: "Butikk",
  };
  const shopLabel = shopLabelMap[locale] ?? "Shop";
  const homeLabel = "Home";

  const variants = translatedProduct.variants || [];
  const prices = variants.map(v => v.priceCents);
  const lowPrice = prices.length > 0 ? (Math.min(...prices) / 100).toFixed(2) : "0.00";
  const highPrice = prices.length > 0 ? (Math.max(...prices) / 100).toFixed(2) : "0.00";
  const offerCount = prices.length;

  const mainImageAbsolute = translatedProduct.imageSrc
    ? (translatedProduct.imageSrc.startsWith("http") ? translatedProduct.imageSrc : `${SITE_URL}${translatedProduct.imageSrc}`)
    : "";

  const variantImageAbsolute = (vSrc: string | undefined) => {
    if (!vSrc) return mainImageAbsolute;
    return vSrc.startsWith("http") ? vSrc : `${SITE_URL}${vSrc}`;
  };

  const offersList = variants.map((variant) => {
    const variantUrl = `${canonical}?v=${variant.id}`;
    const variantSku = makeInventorySku(product.id, variant.id, variant.sku);
    const variantImage = variantImageAbsolute(variant.imageSrc);
    return {
      "@type": "Offer",
      "sku": variantSku,
      "price": (variant.priceCents / 100).toFixed(2),
      "priceCurrency": "EUR",
      "url": variantUrl,
      "image": variantImage,
      "itemCondition": "https://schema.org/NewCondition",
      "priceValidUntil": new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split("T")[0]
    };
  });

  const offersJson = variants.length === 1 ? {
    "@type": "Offer",
    "sku": offersList[0].sku,
    "price": offersList[0].price,
    "priceCurrency": "EUR",
    "url": offersList[0].url,
    "image": offersList[0].image,
    "itemCondition": "https://schema.org/NewCondition",
    "priceValidUntil": offersList[0].priceValidUntil
  } : {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": lowPrice,
    "highPrice": highPrice,
    "offerCount": offerCount,
    "offers": offersList
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": translatedProduct.title,
    "image": mainImageAbsolute,
    "description": translatedProduct.description,
    "sku": product.id,
    "category": translatedProduct.category,
    "brand": {
      "@type": "Brand",
      "name": "Frantoio Del Pasqua"
    },
    "offers": offersJson
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": homeLabel,
        "item": homeUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": shopLabel,
        "item": shopUrl
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": translatedProduct.title,
        "item": canonical
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:py-20">
        {/* Griglia client */}
        <ProductDetailsClient 
          product={translatedProduct} 
          initialVariantId={sp?.v} 
          relatedProducts={relatedProducts} 
        />
      </div>

      <Footer />
    </div>
  );
}
