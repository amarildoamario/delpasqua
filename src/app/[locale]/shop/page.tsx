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

type ShopFilterId = "all" | "fruttato" | "aromatico" | "evo" | "vino" | "box";

type ShopProduct = ProductCardProduct & {
  category?: string;
  filterTags: ShopFilterId[];
};

function normalizeFilterText(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function inferFilterTags(product: ApiProduct): ShopFilterId[] {
  const haystack = [
    product.id,
    product.slug,
    product.title,
    product.subtitle,
    product.category,
    product.badge,
  ]
    .map(normalizeFilterText)
    .join(" ");

  const tags = new Set<ShopFilterId>();

  if (haystack.includes("fruttato")) tags.add("fruttato");
  if (haystack.includes("aromat") || haystack.includes("tartufo") || haystack.includes("peperoncino")) {
    tags.add("aromatico");
  }
  if (
    product.id === "evo" ||
    normalizeFilterText(product.slug) === "evo" ||
    normalizeFilterText(product.badge) === "evo"
  ) {
    tags.add("evo");
  }
  if (haystack.includes("vino") || haystack.includes("chianti") || haystack.includes("sangiovese")) {
    tags.add("vino");
  }
  if (haystack.includes("box") || haystack.includes("cofanetto") || haystack.includes("gift")) {
    tags.add("box");
  }

  return Array.from(tags);
}

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
    { id: "all" as ShopFilterId, label: t("categories.all") },
    { id: "fruttato" as ShopFilterId, label: t("categories.fruttato") },
    { id: "aromatico" as ShopFilterId, label: t("categories.aromatico") },
    { id: "evo" as ShopFilterId, label: "EVO" },
    { id: "vino" as ShopFilterId, label: "Vino" },
    { id: "box" as ShopFilterId, label: "Box" },
  ], [t]);

  const [products, setProducts] = useState<ShopProduct[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ShopProduct[] | null>(null);
  const [activeCategory, setActiveCategory] = useState<ShopFilterId>("all");
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

      const mappedProducts: ShopProduct[] = data.map((p) => {
        const title = tp(`${p.id}.title`) || p.title;
        const subtitle = tp(`${p.id}.subtitle`) || p.subtitle || "";
        const badge = tp(`${p.id}.badge`) || p.badge || "";
        const prices = (p.variants ?? [])
          .map((variant) => variant?.priceCents)
          .filter((price): price is number => typeof price === "number");
        const minPriceCents = prices.length > 0 ? Math.min(...prices) : null;
        const hasManyVariants = prices.length > 1;

        return {
          id: p.id,
          slug: p.slug,
          title,
          subtitle,
          badge,
          imageSrc: p.imageSrc ?? "",
          imageAlt: p.imageAlt ?? "",
          priceLabel:
            typeof minPriceCents === "number"
              ? `${new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
                style: "currency",
                currency: "EUR",
              }).format(minPriceCents / 100)}`
              : "",
          priceCaption: hasManyVariants ? "A partire da" : "Prezzo",
          priceCents: typeof minPriceCents === "number" ? minPriceCents : undefined,
          defaultVariantId: p.variants?.[0]?.id,
          category: p.category ?? "all",
          filterTags: inferFilterTags(p),
        };
      });

      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
    })();
  }, [locale, tp]);

  const handleFilter = useCallback((categoryId: ShopFilterId) => {
    setActiveCategory(categoryId);
    if (!products) return;

    const next =
      categoryId === "all"
        ? products
        : products.filter((product) => product.filterTags.includes(categoryId));

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
  }, [products, CATEGORIES]);

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
      <section className="min-h-screen bg-[linear-gradient(180deg,#f8f4ed_0%,#f6f1e8_36%,#f3ede3_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8a7258] uppercase">
                <span className="h-px w-6 bg-[#8a7258]" />
                {t("header.label")}
              </div>
              <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1f1a17] lg:text-5xl">
                {t("header.title_part1")} <span className="italic text-[#8f6d4c]">{t("header.title_italic")}</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5f554c] lg:text-base">
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
                  <div className="aspect-[4/5] animate-pulse rounded-3xl bg-[#e8dfd2]" />
                  <div className="mt-4 space-y-2 px-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-[#e8dfd2]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#e8dfd2]" />
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
              <p className="text-[#5f554c]">{t("empty.text")}</p>
              <button
                onClick={() => handleFilter("all")}
                className="mt-4 text-sm text-[#8f6d4c] hover:underline"
              >
                {t("empty.reset")}
              </button>
            </div>
          )}

          {/* Bottom info */}
          <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7cbbb] bg-white/72 px-4 py-2 text-xs font-medium text-[#5f554c] shadow-sm shadow-[#1f1a17]/5">
              <IconTruck className="h-4 w-4" />
              {t("info.shipping")}
            </div>
            <p className="text-xs text-[#8a7258]">
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
      className={`rounded-full border px-4 py-2 text-xs font-medium transition ${active
        ? "border-[#1f1a17] bg-[#1f1a17] text-[#fbf6ef] shadow-sm shadow-[#1f1a17]/10"
        : "border-[#ddd3c6] bg-white/75 text-[#5f554c] hover:border-[#bda589] hover:bg-white"
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
