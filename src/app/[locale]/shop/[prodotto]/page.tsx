// src/app/shop/[prodotto]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readCatalog } from "@/lib/server/catalog";
import { findProductBySlug } from "@/lib/productSlugs";
import Footer from "@/components/Footer";
import ProductDetailsClient from "./ProductDetailsClient";

type Specs = Record<string, string>;

type ProductVariant = {
  id: string;
  label: string;
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
    })),
  };

  const categoryLabel = translatedProduct.category ?? "";

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        {/* Breadcrumb sottile */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          <span>Shop</span>
          <span className="text-[#D6D3D1]">/</span>
          <span className="text-[#57534E]">{categoryLabel}</span>
        </nav>

        <header className="mb-12">
          {/* Categoria */}
          {categoryLabel ? (
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              <span className="h-px w-6 bg-[#8B7355]" />
              {translatedProduct.badge || categoryLabel}
            </div>
          ) : null}

          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
            {translatedProduct.title}
          </h1>

          {translatedProduct.subtitle ? (
            <p className="mt-4 text-lg font-light italic text-[#3D5A3D]">
              {translatedProduct.subtitle}
            </p>
          ) : null}

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#57534E] lg:text-lg">
            {translatedProduct.description}
          </p>
        </header>

        {/* Griglia client */}
        <ProductDetailsClient product={translatedProduct} initialVariantId={sp?.v} />
      </div>

      <Footer />
    </div>
  );
}
