import { setRequestLocale } from 'next-intl/server';
// src/app/shop/[prodotto]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readPublicCatalog, readPublicCatalogWithMerch } from "@/lib/server/catalog";
import { findProductBySlug, getLocalizedProductSlug } from "@/lib/productSlugs";
import { makeInventorySku } from "@/lib/inventorySku";
import { prisma } from "@/lib/server/prisma";
import { SHIPPING_RULES } from "@/lib/shippingConfig";
import Footer from "@/components/Footer";
import ProductDetailsClient from "./ProductDetailsClient";
import { copy, detailCopy, getProductSpecs, type ProductSpecData } from "./productDetailsData";
import {
  getProductAlternateUrls,
  getSeoLocale,
  absoluteUrl,
  localizedPath,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import type { Metadata } from "next";
import { locales } from "@/i18n/pathnames";

export const revalidate = 3600;
export const dynamic = "force-static";

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
  setRequestLocale(locale);
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

function parseMeasurement(label: string, id: string) {
  const str = `${label} ${id}`.toLowerCase();

  // Match "500 ml", "750ml", "3 l", "3lt", "5lt", "5 l"
  const volMatch = str.match(/(\d+(?:\.\d+)?)\s*(ml|l|lt|litre|litri|litro)/i);
  if (volMatch) {
    const value = parseFloat(volMatch[1]);
    const unit = volMatch[2].toLowerCase();
    const unitCode = (unit === "ml") ? "MLT" : "LTR";
    return {
      type: "netVolume",
      value,
      unitCode,
    };
  }

  // Match weights: "500 g", "1 kg", "500g", "1kg"
  const wtMatch = str.match(/(\d+(?:\.\d+)?)\s*(g|kg|grammi|chili|kg)/i);
  if (wtMatch) {
    const value = parseFloat(wtMatch[1]);
    const unit = wtMatch[2].toLowerCase();
    const unitCode = (unit === "g" || unit === "grammi") ? "GRM" : "KGM";
    return {
      type: "weight",
      value,
      unitCode,
    };
  }

  // Fallback for standard wine bottles if it says "bottiglia" or "bottle" without specific ml:
  if (str.includes("bottiglia") || str.includes("bottle")) {
    return {
      type: "netVolume",
      value: 750,
      unitCode: "MLT",
    };
  }

  return null;
}

async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; prodotto: string }>;
}) {
  const { locale, prodotto } = await params;
  setRequestLocale(locale);
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
  const canonical = languages[getSeoLocale(locale)];
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

  // Fetch real availability for each variant SKU from the database
  const skus = variants.map(v => makeInventorySku(product.id, v.id, v.sku));
  let inventoryItems: { sku: string; stock: number; reserved: number }[] = [];
  try {
    inventoryItems = await prisma.inventoryItem.findMany({
      where: { sku: { in: skus } },
      select: { sku: true, stock: true, reserved: true }
    });
  } catch (err) {
    console.warn("⚠️ Fallback: Database unreachable in product page. Using default availability.", err);
  }
  const availabilityMap = new Map(
    skus.map(sku => {
      const item = inventoryItems.find(i => i.sku === sku);
      return [sku, item ? Math.max(0, item.stock - item.reserved) : 99];
    })
  );

  const returnUrl = absoluteUrl(localizedPath("/resi", locale));

  const shippingDetails = Object.values(SHIPPING_RULES)
    .filter(rule => rule.countryCode !== "EU")
    .map(rule => ({
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": (rule.shippingFlatCents / 100).toFixed(2),
        "currency": "EUR"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": rule.countryCode
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 0,
          "maxValue": 1,
          "unitCode": "d"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": rule.deliveryDaysMin,
          "maxValue": rule.deliveryDaysMax,
          "unitCode": "d"
        }
      }
    }));

  const returnPolicies = Object.values(SHIPPING_RULES)
    .filter(rule => rule.countryCode !== "EU")
    .map(rule => {
      const isFree = rule.returnShippingFeeCents === 0;
      return {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": rule.countryCode,
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": isFree ? "https://schema.org/FreeReturn" : "https://schema.org/ReturnShippingFees",
        ...(isFree ? {} : {
          "returnShippingFeesAmount": {
            "@type": "MonetaryAmount",
            "value": (rule.returnShippingFeeCents / 100).toFixed(2),
            "currency": "EUR"
          }
        }),
        "merchantReturnLink": returnUrl
      };
    });

  const offersList = variants.map((variant) => {
    const variantUrl = `${canonical}?v=${variant.id}`;
    const variantSku = makeInventorySku(product.id, variant.id, variant.sku);
    const variantImage = variantImageAbsolute(variant.imageSrc);
    const availableQty = availabilityMap.get(variantSku) ?? 0;
    const availability = availableQty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

    const measurement = parseMeasurement(variant.label || "", variant.id || "");
    const measurementFields = measurement
      ? {
          [measurement.type]: {
            "@type": "QuantitativeValue",
            "value": measurement.value,
            "unitCode": measurement.unitCode,
          },
        }
      : {};

    return {
      "@type": "Offer",
      "sku": variantSku,
      "mpn": variantSku,
      "price": (variant.priceCents / 100).toFixed(2),
      "priceCurrency": "EUR",
      "url": variantUrl,
      "image": variantImage,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": availability,
      "priceValidUntil": new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split("T")[0],
      "seller": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL
      },
      "shippingDetails": shippingDetails,
      "hasMerchantReturnPolicy": returnPolicies,
      ...measurementFields
    };
  });

  const offersJson = variants.length === 1 ? offersList[0] : {
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
  const labels = copy[locale as keyof typeof copy] ?? copy.en;
  const detailLabels = detailCopy[locale as keyof typeof detailCopy] ?? detailCopy.en;
  const specsMap: Record<string, ProductSpecData> = {};
  const allProductIds = ["evo", "fruttato-leggero", "fruttato-medio", "fruttato-intenso", "tartufo", "peperoncino", "vino"];
  for (const pid of allProductIds) {
    specsMap[pid] = getProductSpecs(pid, locale);
  }

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
          relatedProducts={relatedProducts} 
          labels={labels}
          detailLabels={detailLabels}
          specsMap={specsMap}
        />
      </div>

      <Footer />
    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProductPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <ProductPage {...props} />;
}
