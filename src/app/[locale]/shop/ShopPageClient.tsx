"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ProductCard, { ProductCardProduct } from "@/components/ProductCard";
import MobileListCard from "@/components/MobileListCard";
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
  merchBadge?: string | null;
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

type ShopFilterId = "all" | "evo" | "fruttato" | "latte" | "aromatico" | "vino" | "box";

type ShopProduct = ProductCardProduct & {
  cardKey: string;
  category?: string;
  filterTags: ShopFilterId[];
  formatsList?: string;
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

const shopHeaderCopy = {
  it: {
    title: "Le nostre eccellenze",
    sub1: "Olio EVO toscano, vini della tenuta e confezioni regalo.",
    sub2: "Qualità artigianale, formati per ogni esigenza.",
    badge1_title: "100% Artigianale",
    badge1_sub: "Olio, vino e specialità",
    badge2_title: "Molti Formati",
    badge2_sub: "Bottiglie, latte e confezioni",
    badge3_title: "Confezioni Regalo",
    badge3_sub: "Ideali per ogni occasione",
    sortLabel: "Ordina",
    sortPopular: "Più popolari",
    sortPriceAsc: "Prezzo: Crescente",
    sortPriceDesc: "Prezzo: Decrescente",
  },
  en: {
    title: "Our excellences",
    sub1: "Tuscan EVO oil, estate wines and gift boxes.",
    sub2: "Artisanal quality, sizes for every need.",
    badge1_title: "100% Artisanal",
    badge1_sub: "Oil, wine & specialties",
    badge2_title: "Many Sizes",
    badge2_sub: "Bottles, cans & packs",
    badge3_title: "Gift Boxes",
    badge3_sub: "Ideal for any occasion",
    sortLabel: "Sort",
    sortPopular: "Most popular",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
  },
  de: {
    title: "Unsere Spezialitäten",
    sub1: "Toskanisches EVO-Öl, Weine des Gutes und Geschenkboxen.",
    sub2: "Handwerkliche Qualität, Formate für jeden Bedarf.",
    badge1_title: "100% Handwerklich",
    badge1_sub: "Öl, Wein & Spezialitäten",
    badge2_title: "Viele Größen",
    badge2_sub: "Flaschen, Kanister & Boxen",
    badge3_title: "Geschenkboxen",
    badge3_sub: "Ideal für jeden Anlass",
    sortLabel: "Sortieren",
    sortPopular: "Beliebteste",
    sortPriceAsc: "Preis: Aufsteigend",
    sortPriceDesc: "Preis: Absteigend",
  },
  nl: {
    title: "Onze specialiteiten",
    sub1: "Toscaanse EVO-olie, landgoedwijnen en cadeauverpakkingen.",
    sub2: "Ambachtelijke kwaliteit, formaten voor elke behoefte.",
    badge1_title: "100% Ambachtelijk",
    badge1_sub: "Olie, wijn & specialiteiten",
    badge2_title: "Vele Formaten",
    badge2_sub: "Flaschen, blikken & boxen",
    badge3_title: "Cadeauverpakkingen",
    badge3_sub: "Ideaal voor elke gelegenheid",
    sortLabel: "Sorteer",
    sortPopular: "Meest populair",
    sortPriceAsc: "Prijs: Laag naar Hoog",
    sortPriceDesc: "Prijs: Hoog naar Laag",
  },
  da: {
    title: "Vores specialiteter",
    sub1: "Toscansk EVO-olie, ejendomsvine og gaveæsker.",
    sub2: "Håndværksmæssig kvalitet, størrelser til ethvert behov.",
    badge1_title: "100% Håndværksmæssig",
    badge1_sub: "Olie, vin & specialiteter",
    badge2_title: "Mange Formater",
    badge2_sub: "Flasker, dunke & æsker",
    badge3_title: "Gaveæsker",
    badge3_sub: "Ideel til enhver lejlighed",
    sortLabel: "Sorter",
    sortPopular: "Mest populære",
    sortPriceAsc: "Pris: Lav til Høj",
    sortPriceDesc: "Pris: Høj til Lav",
  },
  no: {
    title: "Våre spesialiteter",
    sub1: "Toskansk EVO-olje, eiendomsviner og gaveesker.",
    sub2: "Håndverksmessig kvalitet, størrelser for ethvert behov.",
    badge1_title: "100% Håndverksmessig",
    badge1_sub: "Olje, vin & spesialiteter",
    badge2_title: "Mange Formater",
    badge2_sub: "Flasker, kanner & esker",
    badge3_title: "Gaveesker",
    badge3_sub: "Ideell for enhver anledning",
    sortLabel: "Sorter",
    sortPopular: "Mest populære",
    sortPriceAsc: "Pris: Lav til Høy",
    sortPriceDesc: "Pris: Høy til Lav",
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
    haystack.includes("evo") ||
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
  if (haystack.includes("latta") || haystack.includes("latte") || haystack.includes("can")) {
    tags.add("latte");
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
  const hCopy = shopHeaderCopy[(locale as ShopCopyLocale)] ?? shopHeaderCopy.it;

  const categoriesCopy = useMemo(() => {
    const dict: Record<string, Record<ShopFilterId, string>> = {
      it: {
        all: "Tutti",
        evo: "EVO",
        fruttato: "Fruttati",
        latte: "Latte",
        aromatico: "Aromatici",
        vino: "Vino",
        box: "Box",
      },
      en: {
        all: "All",
        evo: "EVO",
        fruttato: "Fruity",
        latte: "Cans",
        aromatico: "Flavored",
        vino: "Wine",
        box: "Box",
      },
      de: {
        all: "Alle",
        evo: "EVO",
        fruttato: "Fruchtig",
        latte: "Kanister",
        aromatico: "Aromatisiert",
        vino: "Wein",
        box: "Box",
      },
      nl: {
        all: "Alle",
        evo: "EVO",
        fruttato: "Fruitig",
        latte: "Blikken",
        aromatico: "Gearomatiseerd",
        vino: "Wijn",
        box: "Box",
      },
      da: {
        all: "Alle",
        evo: "EVO",
        fruttato: "Frugtagtig",
        latte: "Dunke",
        aromatico: "Aromatiseret",
        vino: "Vin",
        box: "Box",
      },
      no: {
        all: "Alle",
        evo: "EVO",
        fruttato: "Fruktig",
        latte: "Kanner",
        aromatico: "Aromatisert",
        vino: "Vin",
        box: "Box",
      },
    };
    return dict[locale] ?? dict.it;
  }, [locale]);

  const CATEGORIES = useMemo(() => [
    { id: "all" as ShopFilterId, label: categoriesCopy.all },
    { id: "evo" as ShopFilterId, label: categoriesCopy.evo },
    { id: "fruttato" as ShopFilterId, label: categoriesCopy.fruttato },
    { id: "latte" as ShopFilterId, label: categoriesCopy.latte },
    { id: "aromatico" as ShopFilterId, label: categoriesCopy.aromatico },
    { id: "vino" as ShopFilterId, label: categoriesCopy.vino },
    { id: "box" as ShopFilterId, label: categoriesCopy.box },
  ], [categoriesCopy]);

  const [activeCategory, setActiveCategory] = useState<ShopFilterId>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortOrder, setSortOrder] = useState<"popular" | "price-asc" | "price-desc">("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const sentListRef = useRef(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const products = useMemo<ShopProduct[]>(() => {
    const data: ApiProduct[] = initialProducts.filter(isApiProduct);

    return data.map((p): ShopProduct => {
      const title = locale === "it" ? p.title : (tp(`${p.id}.title`) || p.title);
      const subtitle = locale === "it" ? (p.subtitle || "") : (tp(`${p.id}.subtitle`) || p.subtitle || "");
      const badge = locale === "it" ? (p.badge || "") : (tp(`${p.id}.badge`) || p.badge || "");
      const merchBadge = p.merchBadge || null;
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
          merchBadge,
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
          formatsList: undefined,
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

      const formatLabels = sortedVariants
        .map(v => v.label?.replace("Bottiglia ", "").replace("Latta ", "").trim() || "")
        .filter(Boolean)
        .join(" • ");

      return {
        cardKey: `${p.id}::multiple`,
        id: p.id,
        slug: p.slug,
        title: cardTitle,
        subtitle,
        badge,
        merchBadge,
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
        formatsList: formatLabels.toUpperCase(),
      };
    });
  }, [copy, initialProducts, locale, tp]);

  const filteredProducts = useMemo(() => {
    let list = activeCategory === "all"
      ? products
      : products.filter((product) => product.filterTags.includes(activeCategory));

    if (sortOrder === "price-asc") {
      list = [...list].sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0));
    } else if (sortOrder === "price-desc") {
      list = [...list].sort((a, b) => (b.priceCents ?? 0) - (a.priceCents ?? 0));
    }

    return list;
  }, [activeCategory, products, sortOrder]);

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

  const sortOptions = [
    { value: "popular" as const, label: hCopy.sortPopular },
    { value: "price-asc" as const, label: hCopy.sortPriceAsc },
    { value: "price-desc" as const, label: hCopy.sortPriceDesc },
  ];

  const currentSortText = sortOptions.find(o => o.value === sortOrder)?.label ?? hCopy.sortPopular;

  return (
    <>
      <section className="min-h-screen bg-[#fdfaf7]">
        <div className="mx-auto max-w-[1440px] px-6 py-12 lg:py-16">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
            <Link href="/" className="hover:text-[#3D5A3D] transition-colors">Home</Link>
            <span className="text-[#D6D3D1]">/</span>
            <span className="text-[#57534E]">{t("header.label") || "Shop"}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-end border-b border-[#e8dfd5] pb-10 mb-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8a7258] uppercase">
                <span className="h-px w-6 bg-[#8a7258]" />
                {t("header.label") || "Shop"}
              </div>
              <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1f1a17] lg:text-5xl">
                {hCopy.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#5f554c] lg:text-base">
                {hCopy.sub1}
                <br />
                {hCopy.sub2}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-row flex-nowrap items-center gap-2 sm:gap-4 lg:gap-8 justify-between lg:justify-end">
              <div className="flex items-center gap-2 sm:gap-3">
                <IconOlive className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 shrink-0 text-[#8B7355]" />
                <div>
                  <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-wider text-[#1f1a17] uppercase">{hCopy.badge1_title}</div>
                  <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#8a7258] mt-0.5 whitespace-nowrap">{hCopy.badge1_sub}</div>
                </div>
              </div>
              <div className="h-6 sm:h-8 w-px bg-[#d7cbbb]/60 self-center" />

              <div className="flex items-center gap-2 sm:gap-3">
                <IconFormats className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 shrink-0 text-[#8B7355]" />
                <div>
                  <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-wider text-[#1f1a17] uppercase">{hCopy.badge2_title}</div>
                  <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#8a7258] mt-0.5 whitespace-nowrap">{hCopy.badge2_sub}</div>
                </div>
              </div>
              <div className="h-6 sm:h-8 w-px bg-[#d7cbbb]/60 self-center" />

              <div className="flex items-center gap-2 sm:gap-3">
                <IconGift className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 shrink-0 text-[#8B7355]" />
                <div>
                  <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-wider text-[#1f1a17] uppercase">{hCopy.badge3_title}</div>
                  <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#8a7258] mt-0.5 whitespace-nowrap">{hCopy.badge3_sub}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 bg-white p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-[5px]">
            <div className="flex flex-wrap gap-1.5">
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

            <div ref={sortRef} className="relative self-end sm:self-auto min-w-[200px] z-20">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between gap-3 rounded-[5px] border border-neutral-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#5f554c] hover:border-neutral-400 hover:bg-neutral-50 transition"
              >
                <span>{hCopy.sortLabel}: {currentSortText}</span>
                <IconChevronDown className={`h-3 w-3 text-[#8a7258] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-1 w-full rounded-[5px] border border-neutral-200 bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortOrder(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-neutral-50 ${
                        sortOrder === opt.value ? "text-[#132c1c] font-bold bg-[#132c1c]/5" : "text-[#5f554c]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Toggle visualizzazione solo su mobile */}
          <div className="sm:hidden flex items-center justify-between border-b border-neutral-200/60 pb-3 mt-6">
            <div className="text-[11px] font-bold tracking-wider text-[#1f1a17] uppercase">
              {viewMode === "list"
                ? `${locale === "it" ? "Visualizzazione Lista" : "List View"}`
                : `${locale === "it" ? "Visualizzazione Griglia" : "Grid View"}`}
            </div>
            <div className="border border-neutral-200 bg-white p-0.5 rounded-[5px] flex items-center shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-[3px] transition ${
                  viewMode === "grid"
                    ? "bg-[#1f1a17] text-white"
                    : "bg-white text-neutral-400 hover:text-neutral-600"
                }`}
                aria-label="Grid View"
              >
                <IconGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-[3px] transition ${
                  viewMode === "list"
                    ? "bg-[#1f1a17] text-white"
                    : "bg-white text-neutral-400 hover:text-neutral-600"
                }`}
                aria-label="List View"
              >
                <IconList className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Griglia Mobile (List o Grid) */}
          <div className="sm:hidden mt-6 flex flex-col gap-4">
            {viewMode === "list" ? (
              filteredProducts.map((product) => (
                <MobileListCard
                  key={product.cardKey}
                  product={product}
                  onClick={() => handleProductClick(product)}
                  locale={locale}
                  copy={copy}
                />
              ))
            ) : (
              <div className="grid gap-6 grid-cols-1">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.cardKey}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Griglia Desktop/Tablet (Sempre Grid) */}
          <div className="hidden sm:grid mt-12 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
            {filteredProducts.map((product) => (
              <div key={product.cardKey} className="flex h-full">
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            ))}
          </div>

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
      className={`rounded-[5px] border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition ${active
        ? "border-transparent bg-[#132c1c] text-white shadow-sm"
        : "border-neutral-200 bg-white text-[#5f554c] hover:border-neutral-400 hover:bg-neutral-50"
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

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconOlive({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 12 13 8 9C6.5 7.5 4 7 4 7C4 7 4.5 9.5 6 11C10 15 12 22 12 22Z" />
      <path d="M12 15C12 15 15 11 17 9.5C18.5 8.5 20 8 20 8C20 8 19.5 9.5 18.5 11C17 13 12 17 12 17Z" />
      <path d="M12 11C12 11 9.5 7.5 9 6C8.5 5 8 3 8 3C8 3 9.5 3.5 10.5 4C12 5.5 12 11 12 11Z" />
    </svg>
  );
}

function IconFormats({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20V9c0-1 .8-2 1.8-2h1.4C10.2 7 11 8 11 9v11" />
      <path d="M7.5 7V4.5h2V7" />
      <path d="M13 20v-7c0-.8.6-1.5 1.5-1.5h1C16.4 11.5 17 12.2 17 13v7" />
      <path d="M14.2 11.5V9.5h1.6v2" />
      <path d="M3 20h18" />
    </svg>
  );
}

function IconGift({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="13" rx="1" />
      <line x1="12" y1="8" x2="12" y2="21" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M12 8c0-3-2-5-4-5-1.5 0-3 1.5-3 3 0 2 3 2 7 2Z" />
      <path d="M12 8c0-3 2-5 4-5 1.5 0 3 1.5 3 3 0 2-3 2-7 2Z" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

