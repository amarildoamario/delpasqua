"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ProductCard, { ProductCardProduct } from "@/components/ProductCard";
import { track } from "@/lib/analytics/track";
import Footer from "@/components/Footer";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  variants?: {
    id?: string;
    label?: string | null;
    priceCents: number;
    imageSrc?: string | null;
    imageAlt?: string | null;
    title?: string | null;
  }[] | null;
  category?: string | null;
};

type ShopFilterId = "all" | "fruttato" | "aromatico" | "evo" | "vino" | "box";

type ShopProduct = ProductCardProduct & {
  cardKey: string;
  category?: string;
  filterTags: ShopFilterId[];
};

const shopCopy = {
  it: {
    evo: "EVO",
    wine: "Vino",
    box: "Box",
    from: "A partire da",
    price: "Prezzo",
  },
  en: {
    evo: "EVO",
    wine: "Wine",
    box: "Box",
    from: "From",
    price: "Price",
  },
  de: {
    evo: "EVO",
    wine: "Wein",
    box: "Box",
    from: "Ab",
    price: "Preis",
  },
  nl: {
    evo: "EVO",
    wine: "Wijn",
    box: "Box",
    from: "Vanaf",
    price: "Prijs",
  },
  da: {
    evo: "EVO",
    wine: "Vin",
    box: "Box",
    from: "Fra",
    price: "Pris",
  },
  no: {
    evo: "EVO",
    wine: "Vin",
    box: "Box",
    from: "Fra",
    price: "Pris",
  },
};

type ShopCopyLocale = keyof typeof shopCopy;

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

export default function ShopPageClient({ initialProducts }: { initialProducts: ApiProduct[] }) {
  const t = useTranslations("ShopPage");
  const tp = useTranslations("Products");
  const locale = useLocale();
  const copy = shopCopy[(locale as ShopCopyLocale)] ?? shopCopy.it;

  const CATEGORIES = useMemo(() => [
    { id: "all" as ShopFilterId, label: t("categories.all") },
    { id: "fruttato" as ShopFilterId, label: t("categories.fruttato") },
    { id: "aromatico" as ShopFilterId, label: t("categories.aromatico") },
    { id: "evo" as ShopFilterId, label: copy.evo },
    { id: "vino" as ShopFilterId, label: copy.wine },
    { id: "box" as ShopFilterId, label: copy.box },
  ], [t, copy]);

  const [activeCategory, setActiveCategory] = useState<ShopFilterId>("all");
  const sentListRef = useRef(false);

  const products = useMemo<ShopProduct[]>(() => {
    const data: ApiProduct[] = initialProducts.filter(isApiProduct);

    return data.map((p): ShopProduct => {
      const title = locale === "it" ? p.title : (tp(`${p.id}.title`) || p.title);
      const subtitle = locale === "it" ? (p.subtitle || "") : (tp(`${p.id}.subtitle`) || p.subtitle || "");
      const badge = locale === "it" ? (p.badge || "") : (tp(`${p.id}.badge`) || p.badge || "");
      const filterTags = inferFilterTags(p);
      const variants = (p.variants ?? []).filter(
        (variant): variant is NonNullable<ApiProduct["variants"]>[number] & { id: string } =>
          typeof variant?.id === "string" && variant.id.length > 0
      );

      if (variants.length === 0) {
        return {
          cardKey: `${p.id}::default`,
          id: p.id,
          slug: p.slug,
          title,
          subtitle,
          badge,
          imageSrc: p.imageSrc ?? "",
          imageAlt: p.imageAlt ?? "",
          priceLabel: "",
          priceCaption: copy.price,
          priceCents: undefined,
          defaultVariantId: undefined,
          variantLabel: undefined,
          category: p.category ?? "all",
          filterTags,
          variantsCount: 1,
        };
      }

      const hasMultiple = variants.length > 1;
      const sortedVariants = [...variants].sort((a, b) => a.priceCents - b.priceCents);
      const cheapestVariant = sortedVariants[0];

      const cardTitle = hasMultiple ? title : (cheapestVariant.title || title);

      const priceLabel = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
        style: "currency",
        currency: "EUR",
      }).format(cheapestVariant.priceCents / 100);

      return {
        cardKey: `${p.id}::multiple`,
        id: p.id,
        slug: p.slug,
        title: cardTitle,
        subtitle,
        badge,
        imageSrc: cheapestVariant.imageSrc ?? p.imageSrc ?? "",
        imageAlt: cheapestVariant.imageAlt ?? p.imageAlt ?? "",
        priceLabel,
        priceCaption: hasMultiple ? copy.from : copy.price,
        priceCents: cheapestVariant.priceCents,
        defaultVariantId: cheapestVariant.id,
        variantLabel: hasMultiple ? undefined : (variants[0].label || undefined),
        category: p.category ?? "all",
        filterTags,
        variantsCount: variants.length,
      };
    });
  }, [copy, initialProducts, locale, tp]);

  const filteredProducts = useMemo(() => (
    activeCategory === "all"
      ? products
      : products.filter((product) => product.filterTags.includes(activeCategory))
  ), [activeCategory, products]);

  useEffect(() => {
    if (sentListRef.current) return;

    sentListRef.current = true;
    track({
      type: "view_item_list",
      data: {
        listId: "shop",
        itemsShown: products.map((p) => ({
          productKey: p.id,
          variantKey: p.defaultVariantId ?? null,
          slug: p.slug,
        })),
        itemsCount: products.length,
      },
    });
  }, [products]);

  const handleFilter = useCallback((categoryId: ShopFilterId) => {
    setActiveCategory(categoryId);

    const next =
      categoryId === "all"
        ? products
        : products.filter((product) => product.filterTags.includes(categoryId));

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
      variantKey: product.defaultVariantId ?? null,
      data: { slug: product.slug },
    });
  }, []);

  return (
    <>
      <section className="min-h-screen bg-[#fdfaf7]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:py-28">
          {/* Breadcrumb sottile */}
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
            <Link href="/" className="hover:text-[#3D5A3D] transition-colors">Home</Link>
            <span className="text-[#D6D3D1]">/</span>
            <span className="text-[#57534E]">{t("header.label") || "Shop"}</span>
          </nav>

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
            {filteredProducts.map((product) => (
              <div key={product.cardKey} className="flex h-full">
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
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
