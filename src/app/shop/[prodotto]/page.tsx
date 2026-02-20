// src/app/shop/[prodotto]/page.tsx
import { notFound } from "next/navigation";
import productsRaw from "@/db/products.json";
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

function getProductsList(): Product[] {
  const raw: any = productsRaw as any;
  if (Array.isArray(raw)) return raw as Product[];
  if (raw?.products && Array.isArray(raw.products)) return raw.products as Product[];
  return [];
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeSlug(value: unknown): string {
  const s = safeDecodeURIComponent(String(value ?? "")).trim().toLowerCase();
  return s.replace(/\s+/g, "-").replace(/\/+$/, "");
}

function safeFindProduct(list: Product[], routeParam: unknown): Product | undefined {
  const wanted = normalizeSlug(routeParam);
  if (!wanted) return undefined;

  const bySlug = list.find((p) => normalizeSlug(p.slug) === wanted);
  if (bySlug) return bySlug;

  const byId = list.find((p) => normalizeSlug(p.id) === wanted);
  if (byId) return byId;

  return undefined;
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ prodotto: string }>;
  searchParams?: Promise<{ v?: string }>;
}) {
  const { prodotto } = await params;
  const sp = searchParams ? await searchParams : undefined;

  const list = getProductsList();
  const product = safeFindProduct(list, prodotto);

  if (!product) notFound();

  const categoryLabel = product.category ?? "";

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          {/* ✅ Categoria sopra al titolo */}
          {categoryLabel ? (
            <div className="text-xs font-semibold tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {categoryLabel}
            </div>
          ) : null}

          <h1 className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {product.title}
          </h1>

          {product.subtitle ? (
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {product.subtitle}
            </p>
          ) : null}

          <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700 dark:text-neutral-200">
            {product.description}
          </p>
        </header>

        {/* ✅ QUI: griglia client che aggiorna variante senza cambiare URL */}
        <ProductDetailsClient product={product} initialVariantId={sp?.v} />
      </div>

      <Footer />
    </div>
  );
}
