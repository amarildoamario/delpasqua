"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Leaf, Search, HelpCircle, Recycle } from "lucide-react";

type TranslationType = {
  title: string;
  description: string;
  heroTitle: string;
  heroSub: string;
  searchPlaceholder: string;
  filterAll: string;
  filterGlass: string;
  filterCan: string;
  emptyState: string;
  tipsTitle: string;
  tipsIntro: string;
  tipsList: string[];
  components: {
    bottle: string;
    cap: string;
    pourer: string;
    label: string;
    can: string;
    handle: string;
    cork: string;
    capsule: string;
  };
  bins: {
    glass: string;
    plasticMetal: string;
    paper: string;
    organic: string;
    unsorted: string;
  };
  quickLinks: {
    title: string;
    home: string;
    shop: string;
    contacts: string;
  };
};

const translations: Record<string, TranslationType> = {
  it: {
    title: "Smaltimento Imballaggi",
    description: "Guida alla raccolta differenziata e allo smaltimento degli imballaggi dei prodotti Frantoio Del Pasqua.",
    heroTitle: "Raccolta Differenziata",
    heroSub: "Guida al riciclo e allo smaltimento corretto degli imballaggi per la salvaguardia dell'ambiente.",
    searchPlaceholder: "Cerca un prodotto...",
    filterAll: "Tutti i prodotti",
    filterGlass: "Bottiglie",
    filterCan: "Latte in Metallo",
    emptyState: "Nessun prodotto trovato per i filtri selezionati.",
    tipsTitle: "Linee Guida",
    tipsIntro: "Semplici regole per un riciclo corretto:",
    tipsList: [
      "Svuota i contenitori dai residui.",
      "Sciacqua brevemente il vetro.",
      "Separa i diversi componenti (es. salvagoccia).",
      "Verifica le regole del tuo Comune."
    ],
    components: {
      bottle: "Bottiglia in Vetro",
      cap: "Tappo",
      pourer: "Dosatore / Salvagoccia",
      label: "Etichetta",
      can: "Latta in Metallo",
      handle: "Maniglia",
      cork: "Tappo in Sughero",
      capsule: "Capsula"
    },
    bins: {
      glass: "Vetro",
      plasticMetal: "Plastica e Metallo",
      paper: "Carta",
      organic: "Organico",
      unsorted: "Indifferenziato"
    },
    quickLinks: {
      title: "Navigazione rapida",
      home: "Home",
      shop: "Shop",
      contacts: "Contatti"
    }
  },
  en: {
    title: "Packaging Disposal Guide",
    description: "Guide to waste separation and recycling of Frantoio Del Pasqua product packaging.",
    heroTitle: "Waste Separation",
    heroSub: "Guide to recycling and correct disposal of packaging to help protect the environment.",
    searchPlaceholder: "Search products...",
    filterAll: "All Products",
    filterGlass: "Bottles",
    filterCan: "Metal Cans",
    emptyState: "No products found matching your criteria.",
    tipsTitle: "Disposal Guidelines",
    tipsIntro: "Simple rules for correct recycling:",
    tipsList: [
      "Empty containers of product residue.",
      "Rinse glass bottles briefly.",
      "Separate different components (e.g. pourer).",
      "Check your local regulations."
    ],
    components: {
      bottle: "Glass Bottle",
      cap: "Cap",
      pourer: "Pourer / Dispenser",
      label: "Label",
      can: "Metal Can",
      handle: "Handle",
      cork: "Cork",
      capsule: "Capsule"
    },
    bins: {
      glass: "Glass",
      plasticMetal: "Plastic & Metal",
      paper: "Paper",
      organic: "Organic Waste",
      unsorted: "Unsorted Waste"
    },
    quickLinks: {
      title: "Quick links",
      home: "Home",
      shop: "Shop",
      contacts: "Contact"
    }
  },
  de: {
    title: "Entsorgungshandbuch",
    description: "Leitfaden zur Mülltrennung und Entsorgung von Verpackungen der Produkte von Frantoio Del Pasqua.",
    heroTitle: "Mülltrennung",
    heroSub: "Leitfaden zum Recycling und zur korrekten Entsorgung von Verpackungen zum Schutz der Umwelt.",
    searchPlaceholder: "Produkte suchen...",
    filterAll: "Alle Produkte",
    filterGlass: "Flaschen",
    filterCan: "Metallkanister",
    emptyState: "Keine Produkte fuer Ihre Suche gefunden.",
    tipsTitle: "Entsorgungsrichtlinien",
    tipsIntro: "Einfache Regeln fuer richtiges Recycling:",
    tipsList: [
      "Behaelter vollstaendig entleeren.",
      "Glasflaschen kurz ausspuelen.",
      "Komponenten trennen (z. B. Ausgiesser).",
      "Oertliche Abfallregeln beachten."
    ],
    components: {
      bottle: "Glasflasche",
      cap: "Verschluss",
      pourer: "Ausgiesser / Spender",
      label: "Etikett",
      can: "Metallkanister",
      handle: "Griff",
      cork: "Korken",
      capsule: "Kapsel"
    },
    bins: {
      glass: "Glas",
      plasticMetal: "Kunststoff & Metall",
      paper: "Papier",
      organic: "Bioabfall",
      unsorted: "Restmuell"
    },
    quickLinks: {
      title: "Schnelllinks",
      home: "Home",
      shop: "Shop",
      contacts: "Kontakt"
    }
  },
  nl: {
    title: "Afvalwijzer Verpakkingen",
    description: "Gids voor afvalscheiding en recycling van productverpakkingen van Frantoio Del Pasqua.",
    heroTitle: "Afvalscheiding",
    heroSub: "Gids voor recycling en correcte verwijdering van verpakkingen om het milieu te beschermen.",
    searchPlaceholder: "Zoek producten...",
    filterAll: "Alle Producten",
    filterGlass: "Flessen",
    filterCan: "Metalen Blikken",
    emptyState: "Geen producten gevonden die voldoen aan uw criteria.",
    tipsTitle: "Afvalwijzer Verpakkingen",
    tipsIntro: "Eenvoudige regels voor correcte recycling:",
    tipsList: [
      "Maak verpakkingen volledig leeg.",
      "Spoel glazen flessen kort om.",
      "Scheid de componenten (bijv. schenktuit).",
      "Controleer de lokale gemeenteregels."
    ],
    components: {
      bottle: "Glazen Fles",
      cap: "Dop",
      pourer: "Schenktuit / Doseerder",
      label: "Etiket",
      can: "Metalen Blik",
      handle: "Handvat",
      cork: "Kurk",
      capsule: "Capsule"
    },
    bins: {
      glass: "Glas",
      plasticMetal: "Plastic & Metaal",
      paper: "Papier",
      organic: "GFT-afval",
      unsorted: "Restafval"
    },
    quickLinks: {
      title: "Snelkoppelingen",
      home: "Home",
      shop: "Winkel",
      contacts: "Contact"
    }
  },
  da: {
    title: "Affaldsguide for emballage",
    description: "Guide til affaldssortering og genanvendelse av Frantoio Del Pasqua-produktemballage.",
    heroTitle: "Affaldssortering",
    heroSub: "Guide til genanvendelse og korrekt bortskaffelse af emballage for at beskytte miljoeet.",
    searchPlaceholder: "Soeg efter produkter...",
    filterAll: "Alle produkter",
    filterGlass: "Flasker",
    filterCan: "Metaldåser",
    emptyState: "Ingen produkter fundet matching dine kriterier.",
    tipsTitle: "Retningslinjer",
    tipsIntro: "Simple regler for sortering af emballage:",
    tipsList: [
      "Toem emballagen helt for rester.",
      "Skyl hurtigt glasflasker.",
      "Adskil komponenter (f.eks. hældetud).",
      "Tjek din kommunes sorteringsregler."
    ],
    components: {
      bottle: "Glasflaske",
      cap: "Laag / Hætte",
      pourer: "Hældetud / Dispenser",
      label: "Etiket",
      can: "Metaldåse",
      handle: "Haandtag",
      cork: "Korkprop",
      capsule: "Kapsel"
    },
    bins: {
      glass: "Glasaffald",
      plasticMetal: "Plast & Metal",
      paper: "Papiraffald",
      organic: "Bioaffald",
      unsorted: "Restaffald"
    },
    quickLinks: {
      title: "Genveje",
      home: "Home",
      shop: "Butik",
      contacts: "Kontakt"
    }
  },
  no: {
    title: "Avfallsguide for emballasje",
    description: "Guide til kildesortering og gjenvinning av emballasje fra Frantoio Del Pasqua-produkter.",
    heroTitle: "Kildesortering",
    heroSub: "Guide til gjenvinning og riktig avfallshaandtering av emballasje for aa beskytte miljoeet.",
    searchPlaceholder: "Soek etter produkter...",
    filterAll: "Alle produkter",
    filterGlass: "Flasker",
    filterCan: "Metallbokser",
    emptyState: "Ingen produkter funnet for gjeldende soek.",
    tipsTitle: "Kildesorteringsregler",
    tipsIntro: "Simple regler for riktig kildesortering:",
    tipsList: [
      "Toem beholderne helt for rester.",
      "Skyll glassflasker raskt.",
      "Separer komponenter (f.eks. hellesut).",
      "Sjekk reglene i din kommune."
    ],
    components: {
      bottle: "Glassflaske",
      cap: "Kork / Lokk",
      pourer: "Hellesut / Dispenser",
      label: "Etikett",
      can: "Metallboks",
      handle: "Haandtak",
      cork: "Kork",
      capsule: "Kapsel"
    },
    bins: {
      glass: "Glassavfall",
      plasticMetal: "Plast & Metall",
      paper: "Papiravfall",
      organic: "Matavfall",
      unsorted: "Restavfall"
    },
    quickLinks: {
      title: "Hurtigkoblinger",
      home: "Hjem",
      shop: "Butikk",
      contacts: "Kontakt"
    }
  }
};

type DisposalComponent = {
  nameKey: keyof TranslationType["components"];
  materialCode: string;
  materialDesc: string;
  binKey: keyof TranslationType["bins"];
};

type PackagingProfile = {
  id: string;
  components: DisposalComponent[];
};

const packagingProfiles: Record<string, PackagingProfile> = {
  "glass-bottle-oil": {
    id: "glass-bottle-oil",
    components: [
      { nameKey: "bottle", materialCode: "GL 71", materialDesc: "Vetro Scuro", binKey: "glass" },
      { nameKey: "cap", materialCode: "ALU 41", materialDesc: "Alluminio", binKey: "plasticMetal" },
      { nameKey: "pourer", materialCode: "LDPE 4", materialDesc: "Plastica", binKey: "plasticMetal" },
      { nameKey: "label", materialCode: "PAP 22", materialDesc: "Carta", binKey: "paper" }
    ]
  },
  "metal-can-oil": {
    id: "metal-can-oil",
    components: [
      { nameKey: "can", materialCode: "FE 40", materialDesc: "Acciaio", binKey: "plasticMetal" },
      { nameKey: "cap", materialCode: "HDPE 2", materialDesc: "Plastica", binKey: "plasticMetal" },
      { nameKey: "handle", materialCode: "LDPE 4", materialDesc: "Plastica", binKey: "plasticMetal" }
    ]
  },
  "glass-bottle-wine": {
    id: "glass-bottle-wine",
    components: [
      { nameKey: "bottle", materialCode: "GL 71", materialDesc: "Vetro Scuro", binKey: "glass" },
      { nameKey: "cork", materialCode: "FOR 51", materialDesc: "Sughero Naturale", binKey: "organic" },
      { nameKey: "capsule", materialCode: "C/ALU 90", materialDesc: "Alluminio/Plastica", binKey: "plasticMetal" },
      { nameKey: "label", materialCode: "PAP 22", materialDesc: "Carta", binKey: "paper" }
    ]
  }
};

type ClientProduct = {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  slug: string;
};

type Props = {
  locale: string;
  products: ClientProduct[];
};

export default function SmaltimentiClient({ locale, products }: Props) {
  const t = translations[locale] || translations.it;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "glass" | "can">("all");

  const getDisposalProfile = (product: ClientProduct): PackagingProfile => {
    if (product.id.includes("latta")) {
      return packagingProfiles["metal-can-oil"];
    }
    if (product.id === "vino" || product.category?.toLowerCase() === "vino") {
      return packagingProfiles["glass-bottle-wine"];
    }
    return packagingProfiles["glass-bottle-oil"];
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const profile = getDisposalProfile(product);

    if (activeTab === "glass") {
      return titleMatch && profile.id.includes("glass");
    }
    if (activeTab === "can") {
      return titleMatch && profile.id.includes("can");
    }
    return titleMatch;
  });

  return (
    <div className="min-h-screen bg-stone-50/40 text-stone-900 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative bg-[#131713] py-16 text-white md:py-20 border-b border-stone-800">
        <div className="relative mx-auto max-w-[1360px] px-6 text-center md:px-8">
          <div className="flex justify-center mb-5">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes recycle-step {
                0%, 28% { transform: rotate(0deg); }
                33%, 61% { transform: rotate(120deg); }
                66%, 94% { transform: rotate(240deg); }
                99%, 100% { transform: rotate(360deg); }
              }
              .animate-recycle-step {
                animation: recycle-step 4.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
                transform-origin: center;
                display: inline-block;
              }
            `}} />
            <span className="animate-recycle-step text-emerald-500">
              <Recycle className="h-10 w-10" strokeWidth={2.5} />
            </span>
          </div>
          <div className="text-[10px] font-semibold tracking-[0.25em] text-emerald-500 uppercase mb-4">
            Frantoio Del Pasqua
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-wide md:text-4xl lg:text-5xl text-stone-100">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-stone-400 text-sm md:text-base font-light leading-relaxed">
            {t.heroSub}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1360px] px-6 py-12 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Filter Controls and Product Cards */}
          <div className="lg:col-span-8 space-y-8">
            {/* Filter controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-stone-200 p-4 rounded-[5px]">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-[5px] border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-xs text-stone-900 outline-none transition-all focus:border-stone-400 focus:bg-white"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-[5px] text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "all"
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {t.filterAll}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("glass")}
                  className={`px-4 py-2 rounded-[5px] text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "glass"
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {t.filterGlass}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("can")}
                  className={`px-4 py-2 rounded-[5px] text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "can"
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {t.filterCan}
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-[5px] border border-dashed border-stone-300 bg-white/50 p-16 text-center">
                <HelpCircle className="h-10 w-10 text-stone-400" />
                <p className="mt-4 text-stone-600 text-xs font-semibold">{t.emptyState}</p>
              </div>
            )}

            {/* Product Disposal Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredProducts.map((product) => {
                const profile = getDisposalProfile(product);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col bg-white border border-stone-200 rounded-[5px] overflow-hidden hover:border-stone-400 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-5 p-5 border-b border-stone-100">
                      <div className="relative h-24 w-24 flex-shrink-0 bg-stone-50 border border-stone-100 rounded-[5px] overflow-hidden flex items-center justify-center p-1.5">
                        {product.imageSrc ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.imageSrc}
                            alt={product.title}
                            className="object-contain max-h-full max-w-full"
                          />
                        ) : (
                          <div className="h-full w-full bg-stone-100 flex items-center justify-center rounded-[5px]">
                            <Leaf className="h-6 w-6 text-stone-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-stone-400 block mb-1">
                          {product.category || "Olio"}
                        </span>
                        <h3 className="font-serif text-base font-normal text-stone-950 leading-tight">
                          {product.title}
                        </h3>
                      </div>
                    </div>

                    {/* Body - Disposal items */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        {profile.components.map((comp, idx) => {
                          const componentName = t.components[comp.nameKey] || String(comp.nameKey);
                          const binName = t.bins[comp.binKey] || String(comp.binKey);

                          return (
                            <div key={idx} className="flex justify-between items-center py-2.5 border-b border-stone-100 last:border-0 last:pb-0">
                              <div>
                                <div className="text-xs font-semibold text-stone-900">{componentName}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] font-bold font-mono bg-[#f4f7f5] text-[#14532d] border border-[#10b981]/15 px-1.5 py-0.5 rounded-[3px] uppercase tracking-wide">
                                    {comp.materialCode}
                                  </span>
                                  <span className="text-stone-300 text-[10px]">-</span>
                                  <span className="text-[10px] text-stone-500 font-medium">
                                    {comp.materialDesc}
                                  </span>
                                </div>
                              </div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-50 border border-stone-200/80 px-2.5 py-1 rounded-[5px]">
                                {binName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sidebar with recycling guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-48 md:top-52 bg-[#f1f6f1] border border-emerald-800/20 rounded-[5px] p-6 md:p-8 shadow-sm">
              <span className="inline-block text-[9px] font-bold tracking-[0.2em] text-emerald-800 bg-emerald-100 border border-emerald-200/50 px-2 py-0.5 rounded-[3px] uppercase mb-3">
                Eco-Filosofia
              </span>
              <h2 className="font-serif text-xl font-normal text-stone-950 leading-snug">
                {t.tipsTitle}
              </h2>
              <div className="w-10 h-px bg-emerald-600 my-4" />

              <p className="text-xs leading-relaxed text-stone-600 mb-6 font-medium">
                {t.tipsIntro}
              </p>

              <ul className="space-y-5 text-xs">
                {t.tipsList.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-4 leading-relaxed">
                    <span className="font-serif text-[#14532d] font-bold select-none flex-shrink-0 mt-0.5 text-sm">
                      0{idx + 1}.
                    </span>
                    <span className="text-stone-600 font-medium">{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-stone-200/60 pt-5">
                <div className="text-[10px] text-stone-400 font-medium italic leading-relaxed">
                  &ldquo;L&apos;impegno per la terra continua nel rispetto dell&apos;ambiente.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Menu requested by USER */}
        <div className="my-12 flex flex-col items-center justify-center gap-5 border-t border-stone-200 pt-10">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
            {t.quickLinks.title}
          </span>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="font-medium text-stone-600 hover:text-stone-950 transition-colors uppercase tracking-wider text-xs"
            >
              {t.quickLinks.home}
            </Link>
            <span className="text-stone-300 font-light text-xs">|</span>
            <Link
              href="/shop"
              className="font-medium text-stone-600 hover:text-stone-950 transition-colors uppercase tracking-wider text-xs"
            >
              {t.quickLinks.shop}
            </Link>
            <span className="text-stone-300 font-light text-xs">|</span>
            <Link
              href="/contatti"
              className="font-medium text-stone-600 hover:text-stone-950 transition-colors uppercase tracking-wider text-xs"
            >
              {t.quickLinks.contacts}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
