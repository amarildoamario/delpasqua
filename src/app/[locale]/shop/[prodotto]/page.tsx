// src/app/shop/[prodotto]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readCatalog } from "@/lib/server/catalog";
import { findProductBySlug } from "@/lib/productSlugs";
import Footer from "@/components/Footer";
import ProductDetailsClient from "./ProductDetailsClient";
import { getProductAlternateUrls } from "@/lib/seo";
import type { Metadata } from "next";

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
};

type Product = {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  variants: ProductVariant[];
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; prodotto: string }>;
}): Promise<Metadata> {
  const { locale, prodotto } = await params;
  const list = (await readCatalog()) as unknown as Product[];
  const product = findProductBySlug(list, prodotto);

  if (!product) return { title: "Prodotto non trovato" };

  const tp = await getTranslations({ locale, namespace: "Products" });
  const title = hasTranslation(tp, `${product.id}.title`) ? tp(`${product.id}.title`) : product.title;
  const description = hasTranslation(tp, `${product.id}.description`)
    ? tp(`${product.id}.description`)
    : product.description;

  const languages = getProductAlternateUrls(product);
  const canonical = languages[locale];

  if ((product as any).excludeFromSeo === true) {
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

  const list = (await readCatalog()) as unknown as Product[];
  const product = findProductBySlug(list, prodotto);

  if (!product) notFound();

  const translatedProduct: Product = {
    ...product,
    category: translateCategory(product.category, locale),
    title: hasTranslation(tp, `${product.id}.title`) ? tp(`${product.id}.title`) : product.title,
    subtitle: hasTranslation(tp, `${product.id}.subtitle`) ? tp(`${product.id}.subtitle`) : product.subtitle,
    badge: hasTranslation(tp, `${product.id}.badge`) ? tp(`${product.id}.badge`) : product.badge,
    description: hasTranslation(tp, `${product.id}.description`)
      ? tp(`${product.id}.description`)
      : product.description,
    variants: product.variants.map((variant) => ({
      ...variant,
      label: hasTranslation(tp, `${product.id}.variants.${variant.id}`)
        ? tp(`${product.id}.variants.${variant.id}`)
        : translateVariantLabel(variant.id, variant.label, locale),
      description: hasTranslation(tp, `${product.id}.variantDescriptions.${variant.id}`)
        ? tp(`${product.id}.variantDescriptions.${variant.id}`)
        : variant.description,
    })),
  };

  const categoryLabel = translatedProduct.category ?? "";

  // Traduce tutti gli altri prodotti per passarli come raccomandati
  const relatedProducts: Product[] = list
    .filter((p) => p.id !== product.id && p.excludeFromSeo !== true)
    .map((p) => ({
      ...p,
      category: translateCategory(p.category, locale),
      title: hasTranslation(tp, `${p.id}.title`) ? tp(`${p.id}.title`) : p.title,
      subtitle: hasTranslation(tp, `${p.id}.subtitle`) ? tp(`${p.id}.subtitle`) : p.subtitle,
      badge: hasTranslation(tp, `${p.id}.badge`) ? tp(`${p.id}.badge`) : p.badge,
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

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        {/* Breadcrumb sottile */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          <span>Shop</span>
          <span className="text-[#D6D3D1]">/</span>
          <span className="text-[#57534E]">{categoryLabel}</span>
        </nav>

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
