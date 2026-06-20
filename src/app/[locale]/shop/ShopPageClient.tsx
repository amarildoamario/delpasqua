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

  const selectionsHeader = useMemo(() => {
    const headers: Record<string, { title: string; subtitle: string }> = {
      it: {
        title: "Le nostre Selezioni & Formati",
        subtitle: "Scopri i percorsi dedicati del nostro frantoio toscano e i formati pensati per la tua cucina.",
      },
      en: {
        title: "Our Selections & Sizes",
        subtitle: "Discover our Tuscan mill's dedicated selections and formats tailored for your kitchen.",
      },
      de: {
        title: "Unsere Auswahlen & Größen",
        subtitle: "Entdecken Sie die speziellen Angebote und Formate unserer toskanischen Mühle für Ihre Küche.",
      },
      nl: {
        title: "Onze Selecties & Formaten",
        subtitle: "Ontdek de specifieke selecties en formaten van onze Toscaanse molen voor uw keuken.",
      },
      da: {
        title: "Vores Udvalg & Formater",
        subtitle: "Oplev vores toscanske mølles udvalg og format, der er skræddersyet til dit køkken.",
      },
      no: {
        title: "Vårt Utvalg & Formater",
        subtitle: "Oppdag vår toskanske mølles utvalg og format skreddersydd for ditt kjøkken.",
      },
    };
    return headers[locale] || headers.it;
  }, [locale]);

  const selectionsCards = useMemo(() => {
    const cards: Record<string, { badge: string; title: string; description: string; cta: string; href: string }[]> = {
      it: [
        {
          badge: "Territorio",
          title: "Olio Extravergine Toscano",
          description: "Ottenuto al 100% da olive toscane raccolte e frante ad Arezzo, dal sapore erbaceo e profondo.",
          cta: "Esplora la Selezione",
          href: "/olio-toscano",
        },
        {
          badge: "Sostenibilità",
          title: "Olio EVO Biologico",
          description: "La pura espressione della natura, ricavato da oliveti coltivati senza l'uso di pesticidi o sostanze chimiche.",
          cta: "Vedi il Biologico",
          href: "/olio-biologico",
        },
        {
          badge: "Stagionalità",
          title: "Nuovo Raccolto (Novello)",
          description: "Il profumo inebriante dell'olio freschissimo di frangitura, estratto a freddo e disponibile in autunno.",
          cta: "Scopri il Novello",
          href: "/nuovo-raccolto",
        },
        {
          badge: "Scorta Famiglia",
          title: "Latta 5 Litri",
          description: "La massima convenienza per il consumo quotidiano, in un contenitore che scherma luce e aria al 100%.",
          cta: "Scopri le Latte",
          href: "/olio-5-litri",
        },
      ],
      en: [
        {
          badge: "Origin",
          title: "Tuscan Extra Virgin Oil",
          description: "Obtained 100% from Tuscan olives harvested and pressed in Arezzo, with a deep and herbal taste.",
          cta: "Explore Selection",
          href: "/olio-toscano",
        },
        {
          badge: "Sustainability",
          title: "Organic EVO Oil",
          description: "The pure expression of nature, obtained from olive groves cultivated without pesticides or chemical inputs.",
          cta: "View Organic",
          href: "/olio-biologico",
        },
        {
          badge: "Seasonality",
          title: "New Harvest (Novello)",
          description: "The exhilarating aroma of fresh olive oil, cold-extracted and available during the autumn harvest.",
          cta: "Discover Novello",
          href: "/nuovo-raccolto",
        },
        {
          badge: "Family Reserve",
          title: "5 Liters Can",
          description: "The best value for daily cooking, in a container that blocks 100% of light and air to preserve quality.",
          cta: "Discover Cans",
          href: "/olio-5-litri",
        },
      ],
      de: [
        {
          badge: "Herkunft",
          title: "Toskanisches Olivenöl",
          description: "Zu 100 % aus toskanischen Oliven hergestellt, die in Arezzo geerntet und gepresst werden, mit tiefem Aroma.",
          cta: "Auswahl Erkunden",
          href: "/olio-toscano",
        },
        {
          badge: "Nachhaltigkeit",
          title: "Bio-Olivenöl",
          description: "Reiner Ausdruck der Natur, gewonnen aus Olivenhainen, die ohne Pestizide oder Chemie bewirtschaftet werden.",
          cta: "Bio Ansehen",
          href: "/olio-biologico",
        },
        {
          badge: "Saisonalität",
          title: "Frische Ernte (Novello)",
          description: "Das betörende Aroma von frisch gepresstem Olivenöl, kaltgepresst und im Herbst erhältlich.",
          cta: "Novello Entdecken",
          href: "/nuovo-raccolto",
        },
        {
          badge: "Familienvorrat",
          title: "5-Liter-Kanister",
          description: "Optimal für den täglichen Gebrauch, in einem Metallkanister, der Licht und Luft vollständig abhält.",
          cta: "Kanister Entdecken",
          href: "/olio-5-litri",
        },
      ],
      nl: [
        {
          badge: "Herkomst",
          title: "Toscaanse Olijfolie",
          description: "100% verkregen uit Toscaanse olijven geoogst en geperst in Arezzo, met een diepe, kruidige smaak.",
          cta: "Ontdek de Selectie",
          href: "/olio-toscano",
        },
        {
          badge: "Duurzaamheid",
          title: "Biologische Olijfolie",
          description: "De pure uitdrukking van de natuur, afkomstig van olijfgaarden geteeld zonder bestrijdingsmiddelen.",
          cta: "Bekijk Biologisch",
          href: "/olio-biologico",
        },
        {
          badge: "Seizoensgebonden",
          title: "Nieuwe Oogst (Novello)",
          description: "Het intense aroma van vers geperste olijfolie, koud geëxtraheerd en verkrijgbaar in de herfst.",
          cta: "Ontdek Nieuwe Oogst",
          href: "/nuovo-raccolto",
        },
        {
          badge: "Gezinsvoorraad",
          title: "5 Liter Blik",
          description: "De beste waarde voor dagelijks gebruik, in een verpakking die licht en lucht 100% buitensluit.",
          cta: "Ontdek Blikken",
          href: "/olio-5-litri",
        },
      ],
      da: [
        {
          badge: "Oprindelse",
          title: "Toscansk Olivenolie",
          description: "Fremstillet 100% af toscanske oliven høstet og presset i Arezzo, med en dyb og urteagtig smag.",
          cta: "Udforsk Udvalg",
          href: "/olio-toscano",
        },
        {
          badge: "Bæredygtighed",
          title: "Økologisk Olivenolie",
          description: "Det rene udtryk for naturen, fremstillet af olivenlunde dyrket uden brug af sprøjtemidler.",
          cta: "Se Økologisk",
          href: "/olio-biologico",
        },
        {
          badge: "Sæsonbestemt",
          title: "Ny Høst (Novello)",
          description: "Den fantastiske duft af friskpresset olivenolie, koldpresset og tilgængelig om efteråret.",
          cta: "Se Ny Høst",
          href: "/nuovo-raccolto",
        },
        {
          badge: "Familiereserve",
          title: "5 Liters Dunk",
          description: "Den bedste værdi til daglig madlavning, i en dunk der beskytter mod lys og luft 100%.",
          cta: "Udforsk Dunke",
          href: "/olio-5-litri",
        },
      ],
      no: [
        {
          badge: "Opprinnelse",
          title: "Toskansk Olivenolje",
          description: "Utvunnet 100% fra toscanske oliven høstet og presset i Arezzo, med en dyp og urteaktig smak.",
          cta: "Utforsk Utvalg",
          href: "/olio-toscano",
        },
        {
          badge: "Bærekraft",
          title: "Økologisk Olivenolje",
          description: "Det rene uttrykket for naturen, oppnådd fra olivenlunder dyrket uten kjemiske sprøytemidler.",
          cta: "Se Økologisk",
          href: "/olio-biologico",
        },
        {
          badge: "Sesong",
          title: "Ny Høst (Novello)",
          description: "Den herlige duften av ferskpresset olivenolje, kaldpresset og tilgjengelig om høsten.",
          cta: "Utforsk Ny Høst",
          href: "/nuovo-raccolto",
        },
        {
          badge: "Familiereserve",
          title: "5 Liters Kanne",
          description: "Beste verdi for daglig madlaging, i en kanne som blokkerer lys og luft 100%.",
          cta: "Se Kanner",
          href: "/olio-5-litri",
        },
      ],
    };
    return cards[locale] || cards.it;
  }, [locale]);

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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
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

            <div ref={sortRef} className="relative z-20 w-full sm:w-auto sm:min-w-[220px]">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-[5px] border border-[#d7cbbb] bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_58%,#f8f2ea_100%)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4f463d] shadow-[0_10px_24px_rgba(31,26,23,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-white/90 hover:-translate-y-0.5 hover:border-[#8b7355]/60 hover:text-[#132c1c] hover:shadow-[0_14px_30px_rgba(31,26,23,0.1),inset_0_1px_0_rgba(255,255,255,0.95)] active:translate-y-0"
              >
                <span className="truncate">{hCopy.sortLabel}: {currentSortText}</span>
                <IconChevronDown className={`h-3 w-3 text-[#8a7258] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-full overflow-hidden rounded-[5px] border border-[#d7cbbb] bg-white py-1 shadow-[0_18px_40px_rgba(31,26,23,0.12)] animate-in fade-in slide-in-from-top-1 duration-150">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortOrder(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-colors hover:bg-[#f8f2ea] ${
                        sortOrder === opt.value ? "bg-[#132c1c]/5 font-bold text-[#132c1c]" : "text-[#5f554c]"
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

          {/* SEZIONI E FORMATI SPECIALI */}
          <div className="mt-24 border-t border-[#e8dfd5] pt-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-serif text-3xl font-light tracking-tight text-[#1f1a17] sm:text-4xl">
                {selectionsHeader.title}
              </h2>
              <p className="mt-4 text-sm text-[#5f554c] leading-relaxed">
                {selectionsHeader.subtitle}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {selectionsCards.map((card, idx) => (
                <div key={idx} className="relative group flex flex-col h-full">
                  {/* Sfondo sfasato decorativo con pattern grigliato */}
                  <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[5px] bg-[radial-gradient(#d7cbbb_1px,transparent_1px)] [background-size:9px_9px] bg-[#fcf9f5] border border-[#e8dfd5] transition-all duration-300 group-hover:translate-x-2.5 group-hover:translate-y-2.5 group-hover:bg-[#132c1c]/5 group-hover:border-[#132c1c]/15" />

                  {/* Card principale */}
                  <Link
                    href={card.href}
                    className="relative flex-1 flex flex-col justify-between p-6 bg-white border border-[#e8dfd5] rounded-[5px] transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#8b7355]/40 group-hover:shadow-[0_6px_16px_rgba(139,115,85,0.06)]"
                  >
                    <div>
                      {/* Icon/Badge decorativo */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] font-bold tracking-[0.15em] text-[#8b7355] uppercase">
                          {card.badge}
                        </div>
                        <div className="p-1.5 rounded-full bg-[#fdfaf7] text-[#8b7355] group-hover:bg-[#132c1c] group-hover:text-white transition-colors duration-300">
                          <svg className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl font-medium text-[#1f1a17] group-hover:text-[#8b7355] transition-colors">
                        {card.title}
                      </h3>
                      <p className="mt-2.5 text-xs text-[#5f554c] leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#132c1c] uppercase group-hover:text-[#8b7355] transition-colors">
                      <span>{card.cta}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

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
      className={`relative isolate shrink-0 overflow-hidden rounded-[5px] border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-200 before:absolute before:inset-x-2 before:top-0 before:h-px before:transition-colors after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-[#b68a3a] after:transition-all after:duration-200 ${active
        ? "border-[#132c1c] bg-[linear-gradient(180deg,#173823_0%,#132c1c_100%)] text-white shadow-[0_12px_24px_rgba(19,44,28,0.22),inset_0_1px_0_rgba(255,255,255,0.16)] before:bg-white/25 after:w-8"
        : "border-[#d7cbbb] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf4_100%)] text-[#5f554c] shadow-[0_7px_18px_rgba(31,26,23,0.045),inset_0_1px_0_rgba(255,255,255,0.9)] before:bg-white/80 hover:-translate-y-0.5 hover:border-[#8b7355]/60 hover:text-[#132c1c] hover:shadow-[0_12px_26px_rgba(31,26,23,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] hover:after:w-6 active:translate-y-0"
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
