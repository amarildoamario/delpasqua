// src/app/shop/[prodotto]/page.tsx
import { notFound } from "next/navigation";
import { readCatalog } from "@/lib/server/catalog";
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

  const list = (await readCatalog()) as unknown as Product[];
  const product = safeFindProduct(list, prodotto);

  if (!product) notFound();

  const categoryLabel = product.category ?? "";

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        {/* Breadcrumb sottile */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          <span>Shop</span>
          <span className="text-[#D6D3D1]">/</span>
          <span className="text-[#57534E]">{categoryLabel || "Prodotti"}</span>
        </nav>

        <header className="mb-12">
          {/* Categoria */}
          {categoryLabel ? (
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              <span className="h-px w-6 bg-[#8B7355]" />
              {categoryLabel}
            </div>
          ) : null}

          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
            {product.title}
          </h1>

          {product.subtitle ? (
            <p className="mt-4 text-lg font-light italic text-[#3D5A3D]">
              {product.subtitle}
            </p>
          ) : null}

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#57534E] lg:text-lg">
            {product.description}
          </p>
        </header>

        {/* Griglia client */}
        <ProductDetailsClient product={product} initialVariantId={sp?.v} />
      </div>

      <Footer />
    </div>
  );
}