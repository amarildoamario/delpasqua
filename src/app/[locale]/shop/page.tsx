"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ProductCard, { ProductCardProduct } from "@/components/ProductCard";
import { track } from "@/lib/analytics/track";
import Footer from "@/components/Footer";
import { useTranslations, useLocale } from "next-intl";

type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  variants?: { id?: string; priceCents: number }[] | null;
  category?: string | null;
};

function isApiProduct(x: unknown): x is ApiProduct {
  if (!x || typeof x !== "object") return false;
  const p = x as Record<string, unknown>;
  return typeof p.id === "string" && typeof p.slug === "string" && typeof p.title === "string";
}

export default function ShopPage() {
  const t = useTranslations("ShopPage");
  const tp = useTranslations("Products");
  const locale = useLocale();

  const CATEGORIES = useMemo(() => [
    { id: "all", label: t("categories.all") },
    { id: "fruttato", label: t("categories.fruttato") },
    { id: "igp", label: t("categories.igp") },
    { id: "bio", label: t("categories.bio") },
    { id: "aromatico", label: t("categories.aromatico") },
  ], [t]);

  const [products, setProducts] = useState<ProductCardProduct[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductCardProduct[] | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const sentListRef = useRef(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", { cache: "no-store" });
      const raw: unknown = await res.json();

      const data: ApiProduct[] = Array.isArray(raw) ? raw.filter(isApiProduct) : [];

      if (!sentListRef.current) {
        sentListRef.current = true;
        track({
          type: "view_item_list",
          data: {
            listId: "shop",
            itemsShown: data.map((p) => ({ productKey: p.id, slug: p.slug })),
            itemsCount: data.length,
          },
        });
      }

      const mappedProducts = data.map((p) => {
        const title = tp(`${p.id}.title`) || p.title;
        const subtitle = tp(`${p.id}.subtitle`) || p.subtitle || "";
        const badge = tp(`${p.id}.badge`) || p.badge || "";

        return {
          id: p.id,
          slug: p.slug,
          title,
          subtitle,
          badge,
          imageSrc: p.imageSrc ?? "",
          imageAlt: p.imageAlt ?? "",
          priceLabel:
            p.variants?.[0] && typeof p.variants[0].priceCents === "number"
              ? `${new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
                style: "currency",
                currency: "EUR",
              }).format(p.variants[0].priceCents / 100)}`
              : "",
          category: p.category ?? "all",
        };
      });

      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
    })();
  }, []);

  const handleFilter = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    if (!products) return;

    const next =
      categoryId === "all"
        ? products
        : products.filter((p: ProductCardProduct & { category?: string }) =>
          p.category?.toLowerCase().includes(categoryId.toLowerCase()) ||
          p.title.toLowerCase().includes(categoryId.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(categoryId.toLowerCase())
        );

    setFilteredProducts(next);

    // ✅ GA4: filter apply
    const catLabel = CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
    track({
      type: "filter_apply",
      data: {
        filterId: categoryId,
        filterLabel: catLabel,
        resultsCount: next.length,
        listId: "shop",
      },
    });
  }, [products]);

  const handleProductClick = useCallback((product: ProductCardProduct) => {
    track({
      type: "product_click",
      productKey: product.id,
      variantKey: null,
      data: { slug: product.slug },
    });
  }, []);

  return (
    <>
      <section className="bg-[#FDFCF8] min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                <span className="h-px w-6 bg-[#8B7355]" />
                {t("header.label")}
              </div>
              <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl">
                {t("header.title_part1")} <span className="italic text-[#3D5A3D]">{t("header.title_italic")}</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#57534E] lg:text-base">
                {t("header.description")}
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <FilterPill
                  key={cat.id}
                  active={activeCategory === cat.id}
                  onClick={() => handleFilter(cat.id)}
                >
                  {cat.label}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Grid prodotti - Altezza uniforme */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
            {!filteredProducts
              ? // Skeleton loading
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="aspect-[4/5] animate-pulse rounded-3xl bg-[#E7E5E4]" />
                  <div className="mt-4 space-y-2 px-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-[#E7E5E4]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#E7E5E4]" />
                  </div>
                </div>
              ))
              : filteredProducts.map((product) => (
                <div key={product.id} className="flex h-full">
                  <ProductCard
                    product={product}
                    onClick={() => handleProductClick(product)}
                  // Rimuovi onOpen se vuoi il link diretto, o tienilo per modal
                  // onOpen={handleProductOpen} 
                  />
                </div>
              ))}
          </div>

          {/* Empty state */}
          {filteredProducts && filteredProducts.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-[#57534E]">{t("empty.text")}</p>
              <button
                onClick={() => handleFilter("all")}
                className="mt-4 text-sm text-[#3D5A3D] hover:underline"
              >
                {t("empty.reset")}
              </button>
            </div>
          )}

          {/* Bottom info */}
          <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#3D5A3D]/10 px-4 py-2 text-xs font-medium text-[#3D5A3D]">
              <IconTruck className="h-4 w-4" />
              {t("info.shipping")}
            </div>
            <p className="text-xs text-[#8B7355]">
              {t("info.notes")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function FilterPill({
  children,
  active,
  onClick
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-medium transition ${active
        ? "bg-[#1C1917] text-white"
        : "border border-[#E7E5E4] bg-white text-[#57534E] hover:border-[#3D5A3D]/30"
        }`}
    >
      {children}
    </button>
  );
}

function IconTruck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}