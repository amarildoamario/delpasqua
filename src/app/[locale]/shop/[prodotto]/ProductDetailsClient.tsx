"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Check,
  X,
  Droplets,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Leaf,
} from "lucide-react";
import Link from "next/link";

import { localizedPathnames, type Locale } from "@/i18n/pathnames";
import ProductCard, { type ProductCardProduct } from "@/components/ProductCard";
import { makeInventorySku } from "@/lib/inventorySku";
import { getLocalizedProductSlug } from "@/lib/productSlugs";

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
  title?: string;
};

type PurchaseInfo = {
  caratteristiche?: string;
  imballaggio?: string;
  spedizione?: string;
  resi?: string;
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
  specsTitle?: string;
  specs?: Specs;
  purchaseInfo?: PurchaseInfo;
};

function formatEUR(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === "it" ? "it-IT" : locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

type FormatNavItem = {
  productId: string;
  variantId: string;
  label: string;
};

type FormatNavGroups = {
  bottle: FormatNavItem[];
  can: FormatNavItem[];
};

type GalleryImageItem = {
  src: string;
  alt: string;
  productId: string;
  variantId: string;
  label: string;
};

const FORMAT_FAMILY_BY_PRODUCT_ID: Record<string, string> = {
  evo: "evo",
  "evo-latta": "evo",
  "fruttato-leggero": "fruttato-leggero",
  "fruttato-leggero-latta": "fruttato-leggero",
  "fruttato-medio": "fruttato-medio",
  "fruttato-medio-latta": "fruttato-medio",
  "fruttato-intenso": "fruttato-intenso",
  "fruttato-intenso-latta": "fruttato-intenso",
};

const FORMAT_NAV_GROUPS: Record<string, FormatNavGroups> = {
  evo: {
    bottle: [{ productId: "evo", variantId: "500ml", label: "500 ml" }],
    can: [
      { productId: "evo-latta", variantId: "750ml", label: "750 ml" },
      { productId: "evo-latta", variantId: "3lt", label: "3 L" },
      { productId: "evo-latta", variantId: "5lt", label: "5 L" },
    ],
  },
  "fruttato-leggero": {
    bottle: [{ productId: "fruttato-leggero", variantId: "500ml", label: "500 ml" }],
    can: [
      { productId: "fruttato-leggero-latta", variantId: "3lt", label: "3 L" },
      { productId: "fruttato-leggero-latta", variantId: "5lt", label: "5 L" },
    ],
  },
  "fruttato-medio": {
    bottle: [
      { productId: "fruttato-medio", variantId: "500ml", label: "500 ml" },
      { productId: "fruttato-medio", variantId: "750ml", label: "750 ml" },
      { productId: "fruttato-medio", variantId: "1lt", label: "1 L" },
    ],
    can: [
      { productId: "fruttato-medio-latta", variantId: "3lt", label: "3 L" },
      { productId: "fruttato-medio-latta", variantId: "5lt", label: "5 L" },
    ],
  },
  "fruttato-intenso": {
    bottle: [
      { productId: "fruttato-intenso", variantId: "500ml", label: "500 ml" },
      { productId: "fruttato-intenso", variantId: "750ml", label: "750 ml" },
      { productId: "fruttato-intenso", variantId: "1lt", label: "1 L" },
    ],
    can: [
      { productId: "fruttato-intenso-latta", variantId: "3lt", label: "3 L" },
      { productId: "fruttato-intenso-latta", variantId: "5lt", label: "5 L" },
    ],
  },
};

function getFormatNavGroups(productId: string) {
  const familyId = FORMAT_FAMILY_BY_PRODUCT_ID[productId];
  return familyId ? FORMAT_NAV_GROUPS[familyId] : null;
}

function buildProductUrl(productId: string, locale: string, variantId?: string) {
  // Builds the full URL for cross-product navigation.
  // We use window.location.origin as base since router.push would double-add the locale prefix.
  const supportedLocale = locale as Locale;
  const localePrefix = supportedLocale === "it" ? "" : `/${supportedLocale}`;
  const shopPath = localizedPathnames["/shop"]?.[supportedLocale] ?? "/shop";
  const slug = getLocalizedProductSlug({ id: productId }, locale);
  const base = `${localePrefix}${shopPath}/${slug}`;
  return variantId ? `${base}?v=${variantId}` : base;
}

const copy = {
  it: {
    format: "FORMATO",
    bottleFormat: "Formato bottiglia",
    canFormat: "Formato latta",
    quantity: "QUANTITÀ",
    addToCart: "AGGIUNGI AL CARRELLO",
    goToCheckout: "VAI ALLA CASSA",
    shippingPromo: "Spedizione gratuita per ordini superiori a €50",
    description: "DESCRIZIONE",
    features: "CARATTERISTICHE",
    pairings: "ABBINAMENTI",
    ingredients: "INGREDIENTI",
    nutrition: "VALORI",
    philosophylabel: "FILOSOFIA",
    philosophyTitle: "Dalla nostra terra, il meglio per la tua tavola.",
    philosophyLink: "Scopri la nostra filosofia",
    relatedTitle: "POTREBBERO INTERESSARTI",
    outOfStock: "Esaurito",
    adding: "Aggiunta...",
    added: "Aggiunto!",
    available: "Disponibile",
    checking: "Controllo stock...",
    maxLimit: (max: number) => `Max ${max} disp.`,
    faqTitle: "DOMANDE FREQUENTI (FAQ)",
    technicalSpecs: {
      cultivar: "CULTIVAR",
      raccolta: "RACCOLTA",
      origine: "ORIGINE",
    },
    sensory: {
      fruttato: "FRUTTATO",
      amaro: "AMARO",
      piccante: "PICCANTE",
      colore: "COLORE",
      medio: "Medio",
      leggero: "Leggero",
      verdedorato: "Verde dorato",
    },
    faqs: [
      {
        q: "Come viene conservato l'olio extravergine Del Pasqua?",
        a: "Il nostro olio viene conservato in serbatoi di acciaio inox sotto azoto, a temperatura controllata e costantemente al riparo da luce e aria. Questo previene l'ossidazione e mantiene intatti i profumi e i polifenoli naturali fino al confezionamento.",
      },
      {
        q: "Cosa significa olio estratto a freddo?",
        a: "Significa che la temperatura della pasta delle olive durante la frangitura e la gramolazione non supera mai i 27°C. Questo processo garantisce la conservazione di tutte le vitamine, i profumi freschi e le proprietà organolettiche e nutrizionali dell'olio.",
      },
      {
        q: "Quali sono i tempi e i costi di spedizione?",
        a: "Spediamo in tutta Italia ed Europa in 24/48 ore con corriere espresso tracciato. La spedizione è gratuita per tutti gli ordini superiori a €50; per importi inferiori la tariffa è di €6.90.",
      },
      {
        q: "Posso richiedere formati personalizzati o latte per la ristorazione?",
        a: "Certamente. Produciamo olio in bottiglie da 250ml, 500ml, 750ml e in lattine da 3 L e 5 L. Per forniture speciali, regali aziendali o ristorazione puoi contattarci direttamente tramite il nostro form contatti.",
      },
    ],
  },
  en: {
    format: "SIZE",
    bottleFormat: "Bottle size",
    canFormat: "Can size",
    quantity: "QUANTITY",
    addToCart: "ADD TO CART",
    goToCheckout: "GO TO CHECKOUT",
    shippingPromo: "Free shipping for orders over €50",
    description: "DESCRIPTION",
    features: "CHARACTERISTICS",
    pairings: "PAIRINGS",
    ingredients: "INGREDIENTS",
    nutrition: "NUTRITION",
    philosophylabel: "PHILOSOPHY",
    philosophyTitle: "From our land, the very best for your table.",
    philosophyLink: "Discover our philosophy",
    relatedTitle: "YOU MIGHT ALSO LIKE",
    outOfStock: "Sold Out",
    adding: "Adding...",
    added: "Added!",
    available: "Available",
    checking: "Checking stock...",
    maxLimit: (max: number) => `Max ${max} avail.`,
    faqTitle: "FREQUENTLY ASKED QUESTIONS (FAQ)",
    technicalSpecs: {
      cultivar: "CULTIVAR",
      raccolta: "HARVEST",
      origine: "ORIGIN",
    },
    sensory: {
      fruttato: "FRUITY",
      amaro: "BITTER",
      piccante: "SPICY",
      colore: "COLOR",
      medio: "Medium",
      leggero: "Light",
      verdedorato: "Golden Green",
    },
    faqs: [
      {
        q: "How is Del Pasqua extra virgin olive oil stored?",
        a: "Our olive oil is stored in stainless steel tanks under nitrogen, at a controlled temperature and completely sheltered from light and air. This prevents oxidation and keeps the natural aromas and polyphenols intact until packaging.",
      },
      {
        q: "What does cold-extracted olive oil mean?",
        a: "It means that the temperature of the olive paste during crushing and malaxation never exceeds 27°C (80.6°F). This process guarantees the preservation of all vitamins, fresh aromas, and organoleptic properties of the oil.",
      },
      {
        q: "What are the shipping times and costs?",
        a: "We ship throughout Italy and Europe in 24/48 hours with tracked express courier. Shipping is free for all orders over €50; for lower amounts, the shipping fee is €6.90.",
      },
      {
        q: "Can I request custom sizes or tins for catering?",
        a: "Of course. We produce olive oil in 250ml, 500ml, and 750ml bottles, as well as 3 L and 5 L tins. For corporate gifts, custom sizes, or restaurant supplies, please contact us directly via our contact form.",
      },
    ],
  },
  de: {
    format: "FORMATO",
    bottleFormat: "Flaschenformat",
    canFormat: "Kanisterformat",
    quantity: "MENGE",
    addToCart: "IN DEN WARENKORB",
    goToCheckout: "ZUR KASSE",
    shippingPromo: "Kostenloser Versand ab 50 € Einkaufswert",
    description: "BESCHREIBUNG",
    features: "EIGENSCHAFTEN",
    pairings: "EMPFEHLUNGEN",
    ingredients: "ZUTATEN",
    nutrition: "NÄHRWERTE",
    philosophylabel: "PHILOSOPHIE",
    philosophyTitle: "Von unserem Land, das Beste für Ihren Tisch.",
    philosophyLink: "Entdecken Sie unsere Philosophie",
    relatedTitle: "DAS KÖNNTE SIE INTERESSIEREN",
    outOfStock: "Ausverkauft",
    adding: "Wird hinzugefügt...",
    added: "Hinzugefügt!",
    available: "Verfügbar",
    checking: "Prüfe Bestand...",
    maxLimit: (max: number) => `Max ${max} verf.`,
    faqTitle: "HÄUFIG GESTELLTE FRAGEN (FAQ)",
    technicalSpecs: {
      cultivar: "CULTIVAR",
      raccolta: "ERNTE",
      origine: "HERKUNFT",
    },
    sensory: {
      fruttato: "FRUCHTIG",
      amaro: "BITTER",
      piccante: "SCHARF",
      colore: "FARBE",
      medio: "Mittel",
      leggero: "Leicht",
      verdedorato: "Grüngold",
    },
    faqs: [
      {
        q: "Wie wird das native Olivenöl extra Del Pasqua gelagert?",
        a: "Unser Olivenöl wird in Edelstahltanks unter Stickstoff gelagert, bei kontrollierter Temperatur und geschützt vor Licht und Luft. Dies verhindert die Oxidation und bewahrt die natürlichen Aromen und Polyphenole.",
      },
      {
        q: "Was bedeutet kaltgepresstes Olivenöl?",
        a: "Es bedeutet, dass die Temperatur der Olivenpaste während des Mahlens und Knetens niemals 27 °C überschreitet. Dies sichert den Erhalt aller Vitamine und organoleptischen Qualitäten des Öls.",
      },
    ],
  },
  nl: {
    format: "FORMATO",
    bottleFormat: "Flesformaat",
    canFormat: "Blikformaat",
    quantity: "AANTAL",
    addToCart: "IN WINKELWAGEN",
    goToCheckout: "NAAR DE KASSA",
    shippingPromo: "Gratis verzending voor bestellingen vanaf €50",
    description: "BESCHRIJVING",
    features: "KENMERKEN",
    pairings: "COMBINATIES",
    ingredients: "INGREDIËNTEN",
    nutrition: "VOEDING",
    philosophylabel: "FILOSOFIE",
    philosophyTitle: "Van ons land, het beste voor uw tafel.",
    philosophyLink: "Ontdek onze filosofie",
    relatedTitle: "MISSCHIEN OOK INTERESSANT",
    outOfStock: "Uitverkocht",
    adding: "Toevoegen...",
    added: "Toegevoegd!",
    available: "Beschikbaar",
    checking: "Voorraad check...",
    maxLimit: (max: number) => `Max ${max} besk.`,
    faqTitle: "VEELGESTELDE VRAGEN (FAQ)",
    technicalSpecs: {
      cultivar: "CULTIVAR",
      raccolta: "OOGST",
      origine: "OORSPRONG",
    },
    sensory: {
      fruttato: "FRUITIG",
      amaro: "BITTER",
      piccante: "PITTIG",
      colore: "KLEUR",
      medio: "Gemiddeld",
      leggero: "Licht",
      verdedorato: "Goudgroen",
    },
    faqs: [
      {
        q: "Hoe wordt de extra vierge olijfolie van Del Pasqua bewaard?",
        a: "Onze olijfolie wordt opgeslagen in roestvrijstalen tanks onder stikstof, bij een gecontroleerde temperatuur en volledig beschermd tegen licht en lucht om oxidatie te voorkomen.",
      },
    ],
  },
  da: {
    format: "FORMATO",
    bottleFormat: "Flaskeformat",
    canFormat: "Dunkformat",
    quantity: "ANTAL",
    addToCart: "LÆG I KURV",
    goToCheckout: "GÅ TIL BETALING",
    shippingPromo: "Gratis fragt ved køb over €50",
    description: "BESKRIVELSE",
    features: "EGENSKABER",
    pairings: "SERVERINGSFORSLAG",
    ingredients: "INGREDIENSER",
    nutrition: "NÆRING",
    philosophylabel: "FILOSOFI",
    philosophyTitle: "Fra vores jord, det bedste til dit bord.",
    philosophyLink: "Oplev vores filosofi",
    relatedTitle: "DU VIL MÅSKE OGSÅ LIKE",
    outOfStock: "Udsolgt",
    adding: "Tilføjer...",
    added: "Tilføjet!",
    available: "På lager",
    checking: "Tjekker lager...",
    maxLimit: (max: number) => `Maks ${max} disp.`,
    faqTitle: "OFTE STILLEDE SPØRGSMÅL (FAQ)",
    technicalSpecs: {
      cultivar: "CULTIVAR",
      raccolta: "HØST",
      origine: "OPRINDELSE",
    },
    sensory: {
      fruttato: "FRUGTIG",
      amaro: "BITTER",
      piccante: "STÆRK",
      colore: "FARVE",
      medio: "Medium",
      leggero: "Mild",
      verdedorato: "Grøngylden",
    },
    faqs: [
      {
        q: "Hvordan opbevares Del Pasqua ekstra jomfruolivenolie?",
        a: "Vores olivenolie opbevares i rustfri ståltanke under nitrogen, ved en kontrolleret temperatur og fuldstændig beskyttet mod lys og luft for at forhindre iltning.",
      },
    ],
  },
  no: {
    format: "FORMATO",
    bottleFormat: "Flaskeformat",
    canFormat: "Kanneformat",
    quantity: "ANTALL",
    addToCart: "LEGG I HANDLEVOGN",
    goToCheckout: "GÅ TIL KASSEN",
    shippingPromo: "Gratis frakt for bestillinger over €50",
    description: "BESKRIVELSE",
    features: "EGENSKAPER",
    pairings: "ANBEFALINGER",
    ingredients: "INGREDIENSER",
    nutrition: "NÆRING",
    philosophylabel: "FILOSOFI",
    philosophyTitle: "Fra vår jord, det beste for ditt bord.",
    philosophyLink: "Oppdag vår filosofi",
    relatedTitle: "KANSKJE DU OGSÅ LIKER",
    outOfStock: "Utsolgt",
    adding: "Legger til...",
    added: "Lagt til!",
    available: "På lager",
    checking: "Sjekker lager...",
    maxLimit: (max: number) => `Maks ${max} tilgj.`,
    faqTitle: "OFTE STILTE SPØRSMÅL (FAQ)",
    technicalSpecs: {
      cultivar: "CULTIVAR",
      raccolta: "HØST",
      origine: "OPPRINDELSE",
    },
    sensory: {
      fruttato: "FRUKTIG",
      amaro: "BITTER",
      piccante: "SPISY",
      colore: "FARGE",
      medio: "Medium",
      leggero: "Mild",
      verdedorato: "Grønngyllen",
    },
    faqs: [
      {
        q: "Hvordan oppbevares Del Pasqua ekstra virgin olivenolje?",
        a: "Vår olivenolje lagres i rustfrie ståltanker under nitrogen, ved kontrollert temperatur og beskyttet mot lys og luft for å hindre oksidering.",
      },
    ],
  },
};

type SensoryIndicator = {
  label: string;
  value: string;
  type: "dots" | "color";
  dots?: number;
  color?: string;
};

type TechSpec = {
  label: string;
  value: string;
};

type ProductSpecData = {
  sensory: SensoryIndicator[];
  techSpecs: TechSpec[];
  caratteristiche: string;
  abbinamenti: string;
  ingredienti: string;
  valoriNutrizionali: Array<{ k: string; v: string }>;
};

function getProductSpecs(productId: string, locale: string): ProductSpecData {
  const isIt = locale === "it";
  const id = productId.replace("-latta", ""); // normalize evo-latta to evo, etc.

  const labels = {
    fruttato: isIt ? "FRUTTATO" : "FRUITY",
    amaro: isIt ? "AMARO" : "BITTER",
    piccante: isIt ? "PICCANTE" : "SPICY",
    colore: isIt ? "COLORE" : "COLOR",
    intensita: isIt ? "INTENSITÀ" : "INTENSITY",
    notaAromatica: isIt ? "NOTA AROMATICA" : "AROMATIC NOTE",
    baseOlio: isIt ? "BASE OLIO" : "OIL BASE",
    corposita: isIt ? "CORPOSITÀ" : "BODY",
    tannicita: isIt ? "TANNICITÀ" : "TANNINS",
    acidita: isIt ? "ACIDITÀ" : "ACIDITY",
    bouquet: isIt ? "BOUQUET" : "BOUQUET",
    cultivar: isIt ? "CULTIVAR" : "CULTIVAR",
    raccolta: isIt ? "RACCOLTA" : "HARVEST",
    origine: isIt ? "ORIGINE" : "ORIGIN",
    vitigno: isIt ? "VITIGNO" : "GRAPE VARIETY",
    vendemmia: isIt ? "VENDEMMIA" : "HARVEST",
    gradazione: isIt ? "GRADAZIONE" : "ALCOHOL VOL",
    infusione: isIt ? "INFUSIONE" : "INFUSION",
    base: isIt ? "BASE" : "BASE",
  };

  const data: Record<string, ProductSpecData> = {
    evo: {
      sensory: [
        { label: labels.fruttato, value: isIt ? "Medio" : "Medium", type: "dots", dots: 3 },
        { label: labels.amaro, value: isIt ? "Leggero" : "Light", type: "dots", dots: 2 },
        { label: labels.piccante, value: isIt ? "Leggero" : "Light", type: "dots", dots: 2 },
        { label: labels.colore, value: isIt ? "Verde dorato" : "Golden green", type: "color", color: "#606C38" },
      ],
      techSpecs: [
        { label: labels.cultivar, value: "Frantoio, Moraiolo, Leccino" },
        { label: labels.raccolta, value: isIt ? "Ottobre - Novembre" : "October - November" },
        { label: labels.origine, value: isIt ? "Toscana, Italia" : "Tuscany, Italy" },
      ],
      caratteristiche: isIt
        ? "Olio extravergine di oliva ottenuto a freddo unicamente da olive sane raccolte a mano al giusto livello di maturazione. Presenta un'acidità eccezionalmente bassa (< 0.25%) e un elevato contenuto di polifenoli naturali, che garantiscono proprietà antiossidanti superiori ed eccellente conservabilità nel tempo."
        : "Extra virgin olive oil cold-extracted solely from healthy hand-picked olives at the optimal ripening stage. It features exceptionally low acidity (< 0.25%) and a high natural polyphenol content, ensuring superior antioxidant properties and excellent shelf life.",
      abbinamenti: isIt
        ? "Ideale a crudo su zuppe di legumi, bruschette tradizionali, verdure fresche e grigliate. Perfetto anche per condire insalate o per rifinire carni rosse e pesci al forno con un filo dorato a fine cottura."
        : "Ideal raw on legume soups, traditional bruschetta, fresh and grilled vegetables. Also perfect for dressing salads or finishing red meats and baked fish with a golden drizzle at the end of cooking.",
      ingredienti: isIt
        ? "Olio Extra Vergine di Oliva (100% Italiano). Ottenuto direttamente dalle olive e unicamente mediante procedimenti meccanici. Senza allergeni. Senza conservanti."
        : "Extra Virgin Olive Oil (100% Italian). Obtained directly from olives and solely by mechanical means. Allergen-free. Preservative-free.",
      valoriNutrizionali: [
        { k: isIt ? "Valore Energetico" : "Energy", v: "3404 kJ / 828 kcal" },
        { k: isIt ? "Grassi" : "Fat", v: "92 g" },
        { k: isIt ? "- di cui acidi grassi saturi" : "- of which saturates", v: "14 g" },
        { k: isIt ? "- di cui acidi grassi monoinsaturi" : "- of which mono-unsaturates", v: "69 g" },
        { k: isIt ? "- di cui acidi grassi polinsaturi" : "- of which poly-unsaturates", v: "9 g" },
        { k: isIt ? "Carboidrati" : "Carbohydrate", v: "0 g" },
        { k: isIt ? "- di cui zuccheri" : "- of which sugars", v: "0 g" },
        { k: isIt ? "Proteine" : "Protein", v: "0 g" },
        { k: isIt ? "Sale" : "Salt", v: "0 g" },
      ],
    },
    "fruttato-leggero": {
      sensory: [
        { label: labels.fruttato, value: isIt ? "Leggero" : "Light", type: "dots", dots: 2 },
        { label: labels.amaro, value: isIt ? "Leggero" : "Light", type: "dots", dots: 1 },
        { label: labels.piccante, value: isIt ? "Leggero" : "Light", type: "dots", dots: 1 },
        { label: labels.colore, value: isIt ? "Giallo dorato" : "Golden yellow", type: "color", color: "#E9C46A" },
      ],
      techSpecs: [
        { label: labels.cultivar, value: "Leccino, Pendolino" },
        { label: labels.raccolta, value: isIt ? "Novembre" : "November" },
        { label: labels.origine, value: isIt ? "Toscana, Italia" : "Tuscany, Italy" },
      ],
      caratteristiche: isIt
        ? "Olio extravergine estremamente delicato e armonico, ottenuto a freddo da cultivar dolci raccolte a piena maturazione. Caratterizzato da un'acidità bassissima (< 0.22%) e note fruttate gentili ed erbacee."
        : "Extremely delicate and harmonious extra virgin olive oil, cold-extracted from sweet cultivars harvested at full ripeness. Characterized by very low acidity (< 0.22%) and gentle, herbaceous fruity notes.",
      abbinamenti: isIt
        ? "Eccellente a crudo su pesci bolliti o grigliati, crostacei, carni bianche delicate, insalate fresche, maionese artigianale e dolci all'olio d'oliva."
        : "Excellent raw on boiled or grilled fish, shellfish, delicate white meats, fresh salads, artisanal mayonnaise, and olive oil desserts.",
      ingredienti: isIt
        ? "Olio Extra Vergine di Oliva (100% Italiano). Ottenuto direttamente dalle olive e unicamente mediante procedimenti meccanici. Senza allergeni. Senza conservanti."
        : "Extra Virgin Olive Oil (100% Italian). Obtained directly from olives and solely by mechanical means. Allergen-free. Preservative-free.",
      valoriNutrizionali: [
        { k: isIt ? "Valore Energetico" : "Energy", v: "3404 kJ / 828 kcal" },
        { k: isIt ? "Grassi" : "Fat", v: "92 g" },
        { k: isIt ? "- di cui acidi grassi saturi" : "- of which saturates", v: "14 g" },
        { k: isIt ? "- di cui acidi grassi monoinsaturi" : "- of which mono-unsaturates", v: "69 g" },
        { k: isIt ? "- di cui acidi grassi polinsaturi" : "- of which poly-unsaturates", v: "9 g" },
        { k: isIt ? "Carboidrati" : "Carbohydrate", v: "0 g" },
        { k: isIt ? "- di cui zuccheri" : "- of which sugars", v: "0 g" },
        { k: isIt ? "Proteine" : "Protein", v: "0 g" },
        { k: isIt ? "Sale" : "Salt", v: "0 g" },
      ],
    },
    "fruttato-medio": {
      sensory: [
        { label: labels.fruttato, value: isIt ? "Medio" : "Medium", type: "dots", dots: 3.5 },
        { label: labels.amaro, value: isIt ? "Medio" : "Medium", type: "dots", dots: 3 },
        { label: labels.piccante, value: isIt ? "Medio" : "Medium", type: "dots", dots: 3 },
        { label: labels.colore, value: isIt ? "Verde smeraldo" : "Emerald green", type: "color", color: "#4F772D" },
      ],
      techSpecs: [
        { label: labels.cultivar, value: "Frantoio, Leccino, Moraiolo" },
        { label: labels.raccolta, value: isIt ? "Ottobre" : "October" },
        { label: labels.origine, value: isIt ? "Toscana, Italia" : "Tuscany, Italy" },
      ],
      caratteristiche: isIt
        ? "Olio extravergine di grande equilibrio e complessità aromatica, ottenuto a freddo all'inizio della maturazione delle olive. Elevato contenuto di polifenoli e acidità contenuta (< 0.24%)."
        : "Extra virgin olive oil of great balance and aromatic complexity, cold-extracted at the beginning of the olives' ripening. High polyphenol content and low acidity (< 0.24%).",
      abbinamenti: isIt
        ? "Estremamente versatile: perfetto su bruschette con pomodoro, zuppe di verdure, minestre di farro, carpacci di carne, verdure grigliate e pinzimoni."
        : "Extremely versatile: perfect on tomato bruschetta, vegetable soups, spelt soups, beef carpaccio, grilled vegetables, and fresh pinzimonio.",
      ingredienti: isIt
        ? "Olio Extra Vergine di Oliva (100% Italiano). Ottenuto direttamente dalle olive e unicamente mediante procedimenti meccanici. Senza allergeni. Senza conservanti."
        : "Extra Virgin Olive Oil (100% Italian). Obtained directly from olives and solely by mechanical means. Allergen-free. Preservative-free.",
      valoriNutrizionali: [
        { k: isIt ? "Valore Energetico" : "Energy", v: "3404 kJ / 828 kcal" },
        { k: isIt ? "Grassi" : "Fat", v: "92 g" },
        { k: isIt ? "- di cui acidi grassi saturi" : "- of which saturates", v: "14 g" },
        { k: isIt ? "- di cui acidi grassi monoinsaturi" : "- of which mono-unsaturates", v: "69 g" },
        { k: isIt ? "- di cui acidi grassi polinsaturi" : "- of which poly-unsaturates", v: "9 g" },
        { k: isIt ? "Carboidrati" : "Carbohydrate", v: "0 g" },
        { k: isIt ? "- di cui zuccheri" : "- of which sugars", v: "0 g" },
        { k: isIt ? "Proteine" : "Protein", v: "0 g" },
        { k: isIt ? "Sale" : "Salt", v: "0 g" },
      ],
    },
    "fruttato-intenso": {
      sensory: [
        { label: labels.fruttato, value: isIt ? "Intenso" : "Intense", type: "dots", dots: 5 },
        { label: labels.amaro, value: isIt ? "Deciso" : "Decided", type: "dots", dots: 4 },
        { label: labels.piccante, value: isIt ? "Deciso" : "Decided", type: "dots", dots: 4 },
        { label: labels.colore, value: isIt ? "Verde intenso" : "Deep green", type: "color", color: "#31572C" },
      ],
      techSpecs: [
        { label: labels.cultivar, value: "Moraiolo, Frantoio" },
        { label: labels.raccolta, value: isIt ? "Inizio Ottobre" : "Early October" },
        { label: labels.origine, value: isIt ? "Toscana, Italia" : "Tuscany, Italy" },
      ],
      caratteristiche: isIt
        ? "Olio extravergine potente e ricco di polifenoli, ottenuto a freddo da olive raccolte precocemente. Spiccata nota erbacea, sentori di carciofo e mandorla verde, con un retrogusto piccante persistente e benefico."
        : "Powerful extra virgin olive oil rich in polyphenols, cold-extracted from early-harvested olives. Distinct herbaceous note, hints of artichoke and green almond, with a persistent and beneficial spicy aftertaste.",
      abbinamenti: isIt
        ? "Ideale su piatti strutturati: bruschetta con aglio, zuppe toscane (ribollita, cacciucco), carni rosse alla griglia, selvaggina e formaggi pecorini stagionati."
        : "Ideal on structured dishes: garlic bruschetta, traditional Tuscan soups (ribollita, cacciucco), grilled red meats, game, and aged pecorino cheese.",
      ingredienti: isIt
        ? "Olio Extra Vergine di Oliva (100% Italiano). Ottenuto direttamente dalle olive e unicamente mediante procedimenti meccanici. Senza allergeni. Senza conservanti."
        : "Extra Virgin Olive Oil (100% Italian). Obtained directly from olives and solely by mechanical means. Allergen-free. Preservative-free.",
      valoriNutrizionali: [
        { k: isIt ? "Valore Energetico" : "Energy", v: "3404 kJ / 828 kcal" },
        { k: isIt ? "Grassi" : "Fat", v: "92 g" },
        { k: isIt ? "- di cui acidi grassi saturi" : "- of which saturates", v: "14 g" },
        { k: isIt ? "- di cui acidi grassi monoinsaturi" : "- of which mono-unsaturates", v: "69 g" },
        { k: isIt ? "- di cui acidi grassi polinsaturi" : "- of which poly-unsaturates", v: "9 g" },
        { k: isIt ? "Carboidrati" : "Carbohydrate", v: "0 g" },
        { k: isIt ? "- di cui zuccheri" : "- of which sugars", v: "0 g" },
        { k: isIt ? "Proteine" : "Protein", v: "0 g" },
        { k: isIt ? "Sale" : "Salt", v: "0 g" },
      ],
    },
    tartufo: {
      sensory: [
        { label: labels.intensita, value: isIt ? "Avvolgente" : "Enveloping", type: "dots", dots: 4 },
        { label: labels.notaAromatica, value: isIt ? "Tartufo Bianco" : "White Truffle", type: "dots", dots: 5 },
        { label: labels.baseOlio, value: isIt ? "EVO 100% Italiano" : "100% Italian EVO", type: "dots", dots: 5 },
        { label: labels.colore, value: isIt ? "Dorato cristallino" : "Crystalline gold", type: "color", color: "#E6C594" },
      ],
      techSpecs: [
        { label: labels.base, value: isIt ? "Olio Extra Vergine di Oliva" : "Extra Virgin Olive Oil" },
        { label: labels.infusione, value: isIt ? "Aroma di Tartufo Bianco" : "White Truffle Aroma" },
        { label: labels.origine, value: isIt ? "Toscana, Italia" : "Tuscany, Italy" },
      ],
      caratteristiche: isIt
        ? "Condimento d'eccellenza che unisce la stabilità e la morbidezza del nostro miglior olio extravergine di oliva all'aroma inconfondibile del tartufo bianco pregiato."
        : "A condiment of excellence that combines the stability and smoothness of our finest extra virgin olive oil with the unmistakable aroma of precious white truffle.",
      abbinamenti: isIt
        ? "Un vero tocco di classe a crudo su uova al tegamino, risotti in bianco, tagliolini fatti in casa, carpacci di manzo, fondute di formaggio e patate al forno."
        : "A true touch of class raw on fried eggs, white risottos, homemade tagliolini, beef carpaccio, cheese fondues, and baked potatoes.",
      ingredienti: isIt
        ? "Olio Extra Vergine di Oliva (100% Italiano) 98%, aroma naturale di Tartufo Bianco 2%. Senza conservanti. Senza OGM."
        : "Extra Virgin Olive Oil (100% Italian) 98%, natural White Truffle aroma 2%. Preservative-free. GMO-free.",
      valoriNutrizionali: [
        { k: isIt ? "Valore Energetico" : "Energy", v: "3404 kJ / 828 kcal" },
        { k: isIt ? "Grassi" : "Fat", v: "92 g" },
        { k: isIt ? "- di cui acidi grassi saturi" : "- of which saturates", v: "14 g" },
        { k: isIt ? "- di cui acidi grassi monoinsaturi" : "- of which mono-unsaturates", v: "69 g" },
        { k: isIt ? "- di cui acidi grassi polinsaturi" : "- of which poly-unsaturates", v: "9 g" },
        { k: isIt ? "Carboidrati" : "Carbohydrate", v: "0 g" },
        { k: isIt ? "- di cui zuccheri" : "- of which sugars", v: "0 g" },
        { k: isIt ? "Proteine" : "Protein", v: "0 g" },
        { k: isIt ? "Sale" : "Salt", v: "0 g" },
      ],
    },
    peperoncino: {
      sensory: [
        { label: labels.intensita, value: isIt ? "Decisa" : "Decided", type: "dots", dots: 4 },
        { label: labels.notaAromatica, value: isIt ? "Peperoncino Calabrese" : "Calabrian Chili", type: "dots", dots: 4 },
        { label: labels.baseOlio, value: isIt ? "EVO 100% Italiano" : "100% Italian EVO", type: "dots", dots: 5 },
        { label: labels.colore, value: isIt ? "Rosso dorato" : "Golden red", type: "color", color: "#D62246" },
      ],
      techSpecs: [
        { label: labels.base, value: isIt ? "Olio Extra Vergine di Oliva" : "Extra Virgin Olive Oil" },
        { label: labels.infusione, value: isIt ? "Peperoncini Calabresi Essiccati" : "Dried Calabrian Chili Peppers" },
        { label: labels.origine, value: isIt ? "Toscana e Calabria, Italia" : "Tuscany & Calabria, Italy" },
      ],
      caratteristiche: isIt
        ? "Olio aromatizzato dal gusto deciso e piccantezza equilibrata. Ottenuto lasciando in infusione peperoncini calabresi essiccati nel nostro extravergine estratto a freddo."
        : "Flavored oil with a strong taste and balanced spiciness. Obtained by infusing dried Calabrian chili peppers in our cold-extracted extra virgin olive oil.",
      abbinamenti: isIt
        ? "Ideale per accendere di gusto i primi piatti (penne all'arrabbiata, spaghetti aglio e olio), pizze, zuppe di legumi, cacciucco e grigliate di carne."
        : "Ideal for igniting flavor in pasta dishes (penne all'arrabbiata, spaghetti garlic and oil), pizzas, legume soups, cacciucco, and grilled meats.",
      ingredienti: isIt
        ? "Olio Extra Vergine di Oliva (100% Italiano) 97.5%, peperoncini calabresi essiccati 1.5%, aroma naturale di peperoncino 1%. Senza conservanti."
        : "Extra Virgin Olive Oil (100% Italian) 97.5%, dried Calabrian chili peppers 1.5%, natural chili aroma 1%. Preservative-free.",
      valoriNutrizionali: [
        { k: isIt ? "Valore Energetico" : "Energy", v: "3404 kJ / 828 kcal" },
        { k: isIt ? "Grassi" : "Fat", v: "92 g" },
        { k: isIt ? "- di cui acidi grassi saturi" : "- of which saturates", v: "14 g" },
        { k: isIt ? "- di cui acidi grassi monoinsaturi" : "- of which mono-unsaturates", v: "69 g" },
        { k: isIt ? "- di cui acidi grassi polinsaturi" : "- of which poly-unsaturates", v: "9 g" },
        { k: isIt ? "Carboidrati" : "Carbohydrate", v: "0 g" },
        { k: isIt ? "- di cui zuccheri" : "- of which sugars", v: "0 g" },
        { k: isIt ? "Proteine" : "Protein", v: "0 g" },
        { k: isIt ? "Sale" : "Salt", v: "0 g" },
      ],
    },
    vino: {
      sensory: [
        { label: labels.corposita, value: isIt ? "Strutturato" : "Structured", type: "dots", dots: 3.5 },
        { label: labels.tannicita, value: isIt ? "Elegante" : "Elegant", type: "dots", dots: 3 },
        { label: labels.acidita, value: isIt ? "Fresca" : "Fresh", type: "dots", dots: 3.5 },
        { label: labels.bouquet, value: isIt ? "Frutti rossi e viola" : "Red fruits & violet", type: "color", color: "#722F37" },
      ],
      techSpecs: [
        { label: labels.vitigno, value: "100% Sangiovese" },
        { label: labels.vendemmia, value: isIt ? "Settembre - Ottobre" : "September - October" },
        { label: labels.gradazione, value: "13.5% Vol" },
      ],
      caratteristiche: isIt
        ? "Vino rosso toscano IGP ottenuto da uve Sangiovese in purezza coltivate nelle nostre colline toscane. Vinificato in rosso a temperatura controllata e affinato in vasche di cemento e bottiglia per preservare la freschezza e la tipicità del frutto."
        : "Tuscan red wine IGP obtained from pure Sangiovese grapes grown in our Tuscan hills. Vinified at controlled temperatures and aged in concrete tanks and bottle to preserve the freshness and typicity of the fruit.",
      abbinamenti: isIt
        ? "Ottimo compagno per tutto il pasto toscano: perfetto con antipasti di salumi e crostini neri, primi piatti al ragù di carne, grigliate miste, arrosti e pecorino semistagionato."
        : "Excellent companion for the entire Tuscan meal: perfect with cold cuts and black crostini, pasta dishes with meat ragù, mixed grills, roasts, and semi-aged pecorino.",
      ingredienti: isIt
        ? "Uve Sangiovese 100%, solfiti (conservante naturale del vino). Contiene solfiti. Senza glutine. Senza OGM."
        : "Sangiovese Grapes 100%, sulfites (natural wine preservative). Contains sulfites. Gluten-free. GMO-free.",
      valoriNutrizionali: [
        { k: isIt ? "Valore Energetico" : "Energy", v: "80 kcal / 335 kJ" },
        { k: isIt ? "Alcol" : "Alcohol", v: "10.7 g" },
        { k: isIt ? "Carboidrati" : "Carbohydrate", v: "< 0.5 g" },
        { k: isIt ? "- di cui zuccheri" : "- of which sugars", v: "< 0.5 g" },
        { k: isIt ? "Grassi" : "Fat", v: "0 g" },
        { k: isIt ? "Proteine" : "Protein", v: "0 g" },
        { k: isIt ? "Sale" : "Salt", v: "0 g" },
      ],
    },
  };

  return data[id] || data.evo;
}

type PageLocale = keyof typeof copy;

export default function ProductDetailsClient({
  product,
  initialVariantId,
  relatedProducts = [],
}: {
  product: Product;
  initialVariantId?: string;
  relatedProducts?: Product[];
}) {
  const locale = useLocale();
  const text = copy[locale as PageLocale] ?? copy.it;

  const { add, lines, count: cartCount, catalog } = useCart();

  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  // Varianti e logica di selezione iniziale
  const variants = useMemo(() => (currentProduct.variants?.length ? currentProduct.variants : []), [currentProduct.variants]);
  const firstVariantId = variants[0]?.id;
  const safeInitialVariantId =
    initialVariantId && variants.some((v) => String(v.id) === String(initialVariantId))
      ? initialVariantId
      : firstVariantId;

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(safeInitialVariantId);
  const selectedVariant = useMemo(() => {
    return variants.find((v) => String(v.id) === String(selectedVariantId)) ?? variants[0];
  }, [variants, selectedVariantId]);

  const formatNavGroups = useMemo(() => getFormatNavGroups(currentProduct.id), [currentProduct.id]);

  function handleFormatSelect(item: FormatNavItem) {
    const allTranslatedProducts = [product, ...relatedProducts];
    const targetProduct = allTranslatedProducts.find((p) => p.id === item.productId);

    if (targetProduct) {
      setCurrentProduct(targetProduct);
      setSelectedVariantId(item.variantId);
      const newPath = buildProductUrl(item.productId, locale, item.variantId);
      window.history.replaceState(null, "", newPath);
    }
  }

  function handleVariantSelect(variant: ProductVariant) {
    setSelectedVariantId(variant.id);
    // Sync image with this variant
    if (variant.imageSrc) setActiveImage(variant.imageSrc);
    // Sync URL query param
    const url = new URL(window.location.href);
    url.searchParams.set("v", variant.id);
    window.history.replaceState(null, "", url.pathname + url.search);
  }

  // Clicking a gallery image selects the matching variant (and product)
  function handleImageClick(item: GalleryImageItem) {
    const allTranslatedProducts = [product, ...relatedProducts];
    const targetProduct = allTranslatedProducts.find((p) => p.id === item.productId);

    if (targetProduct) {
      setCurrentProduct(targetProduct);
      setSelectedVariantId(item.variantId);
      setActiveImage(item.src);
      const newPath = buildProductUrl(item.productId, locale, item.variantId);
      window.history.replaceState(null, "", newPath);
    }
  }

  // Gestione Galleria Immagini
  const galleryItems = useMemo<GalleryImageItem[]>(() => {
    const items: GalleryImageItem[] = [];
    const addedSrcs = new Set<string>();

    const addImage = (src: string, alt: string, prodId: string, varId: string, label: string) => {
      if (!src || addedSrcs.has(src)) return;
      addedSrcs.add(src);
      items.push({ src, alt, productId: prodId, variantId: varId, label });
    };

    if (formatNavGroups) {
      // It belongs to a format family! Let's pull from all family items
      const allFamilyItems: FormatNavItem[] = [
        ...(formatNavGroups.bottle || []),
        ...(formatNavGroups.can || []),
      ];

      allFamilyItems.forEach((item) => {
        // Find corresponding product in catalog
        const rawProd = (catalog as Product[]).find((p) => p.id === item.productId);
        if (!rawProd) return;
        const rawVar = rawProd.variants?.find((v) => String(v.id) === String(item.variantId));
        if (rawVar && rawVar.imageSrc) {
          addImage(
            rawVar.imageSrc,
            rawVar.imageAlt || rawVar.label || rawProd.title,
            item.productId,
            item.variantId,
            item.label
          );
        } else if (rawProd.imageSrc) {
          addImage(
            rawProd.imageSrc,
            rawProd.imageAlt || rawProd.title,
            item.productId,
            item.variantId,
            item.label
          );
        }
      });
    } else {
      // Normal single product, just map its own variants
      variants.forEach((v) => {
        if (v.imageSrc) {
          const cleanLabel = v.label
            .replace(/Bottiglia|Latta|Can/gi, "")
            .replace("ml", " ml")
            .replace("lt", " L")
            .replace("L", " L")
            .trim();
          addImage(v.imageSrc, v.imageAlt || v.label, currentProduct.id, v.id, cleanLabel);
        }
      });
      // Fallback to main product image if no images added
      if (items.length === 0 && currentProduct.imageSrc) {
        addImage(currentProduct.imageSrc, currentProduct.imageAlt || currentProduct.title, currentProduct.id, selectedVariantId || "", "");
      }
    }

    return items;
  }, [formatNavGroups, currentProduct, variants, selectedVariantId, catalog]);

  const galleryImages = useMemo(() => galleryItems.map((item) => item.src), [galleryItems]);

  const [activeImage, setActiveImage] = useState(
    selectedVariant?.imageSrc || (galleryImages.length > 0 ? galleryImages[0] : currentProduct.imageSrc)
  );

  // Quando cambia la variante, aggiorniamo l'immagine attiva
  useEffect(() => {
    const img = selectedVariant?.imageSrc || currentProduct.imageSrc;
    if (img) setActiveImage(img);
  }, [selectedVariant, currentProduct.imageSrc]);

  // Gestione Quantità
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);


  const cartTotalCents = useMemo(() => {
    return lines.reduce((sum, line) => {
      const cartProduct = catalog.find((item) => item.id === line.productId);
      const cartVariant = cartProduct?.variants.find((item) => item.id === line.variantId);
      return sum + (cartVariant?.priceCents ?? 0) * line.qty;
    }, 0);
  }, [lines, catalog]);

  // Controllo disponibilità in tempo reale
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availMap, setAvailMap] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let alive = true;
    if (!currentProduct.id || variants.length === 0) {
      setAvailMap({});
      return;
    }
    const skus = variants.map((v) => makeInventorySku(currentProduct.id, v.id));
    setLoadingAvail(true);

    fetch(`/api/inventory/availability?skus=${encodeURIComponent(skus.join(","))}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        return j?.availability ?? {};
      })
      .then((map) => {
        if (!alive) return;
        setAvailMap(map);
      })
      .catch(() => {
        if (!alive) return;
        setAvailMap({});
      })
      .finally(() => {
        if (!alive) return;
        setLoadingAvail(false);
      });

    return () => {
      alive = false;
    };
  }, [currentProduct.id, variants]);

  const selectedSku = selectedVariant ? makeInventorySku(currentProduct.id, selectedVariant.id) : "";
  const availableStock = availMap ? availMap[selectedSku] ?? 0 : null;
  const maxQty = availableStock == null ? 99 : Math.max(0, availableStock);
  const isOutOfStock = availableStock != null && availableStock <= 0;

  useEffect(() => {
    setQty((q) => {
      if (maxQty <= 0) return 1;
      return Math.min(Math.max(1, q), maxQty);
    });
    setAdded(false);
    setErrorMessage("");
  }, [maxQty, selectedVariantId]);

  // Gestione Tabs Descrizione Sotto
  const [activeTab, setActiveTab] = useState("descrizione");

  // Carrello ed Acquisto Diretto
  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    setErrorMessage("");
    const safeQty = Math.min(Math.max(1, qty), maxQty);

    await new Promise((r) => setTimeout(r, 450));

    add({
      productId: currentProduct.id,
      variantId: selectedVariant.id,
      qty: safeQty,
    });
    setIsAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleDirectCheckout = async () => {
    if (isOutOfStock || isAdding || checkoutLoading) return;
    setCheckoutLoading(true);
    setErrorMessage("");

    try {
      if (lines.length === 0) {
        throw new Error(
          locale === "it" ? "Il carrello è vuoto." : "Your cart is empty."
        );
      }

      // Track direct checkout event
      try {
        const { track } = await import("@/lib/analytics/track");
        track({
          type: "begin_checkout",
          data: {
            itemsCount: lines.length,
            totalCents: cartTotalCents,
          },
        });
      } catch (trackError) {
        console.error("Failed to track checkout:", trackError);
      }

      const idemKey = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
        .toString()
        .slice(0, 200);

      const orderBody = {
        items: lines.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          qty: item.qty,
        })),
        locale,
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idemKey,
        },
        body: JSON.stringify(orderBody),
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || "Checkout non disponibile");
      }

      const data = await response.json().catch(() => ({}));
      const url = data?.checkoutUrl;

      if (typeof url === "string" && url.startsWith("http")) {
        window.location.href = url;
        return;
      }

      throw new Error(
        locale === "it"
          ? "Sessione di pagamento non disponibile."
          : "Checkout session is not available."
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setErrorMessage(
        message ||
          (locale === "it"
            ? "Si è verificato un errore durante il reindirizzamento alla cassa."
            : "An error occurred while redirecting to checkout.")
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Prezzo calcolato
  const variantPriceCents = selectedVariant?.priceCents ?? variants[0]?.priceCents ?? 0;
  const totalPriceFormatted = formatEUR(variantPriceCents * qty, locale);
  const cartTotalFormatted = formatEUR(cartTotalCents, locale);

  // Lightbox Immagini Gallery
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Formatta l'ID per mostrare formati puliti
  const formatSizeLabel = (v: ProductVariant) => {
    const raw = v.label ?? v.id;
    return raw
      .replace(/Bottiglia|Latta|Can/gi, "")
      .replace("ml", " ml")
      .replace("lt", " L")
      .replace("L", " L")
      .trim();
  };

  // Dati statici personalizzati per gli oli principali
  const isEvo = currentProduct.id === "evo" || currentProduct.id === "evo-latta";

  const descriptionParagraph = selectedVariant?.description || currentProduct.description;

  let taglineText = currentProduct.subtitle || "";
  if (currentProduct.id === "evo" || currentProduct.id === "evo-latta") {
    taglineText = "Prestazioni, controllo, evoluzione";
  } else if (currentProduct.id === "fruttato-leggero" || currentProduct.id === "fruttato-leggero-latta") {
    taglineText = "Delicatezza, freschezza ed eccellenza toscana";
  } else if (currentProduct.id === "fruttato-medio" || currentProduct.id === "fruttato-medio-latta") {
    taglineText = "Equilibrio, vivacità e profumi della nostra terra";
  } else if (currentProduct.id === "fruttato-intenso" || currentProduct.id === "fruttato-intenso-latta") {
    taglineText = "Carattere deciso, intensità e passione toscana";
  } else if (currentProduct.id === "tartufo") {
    taglineText = "Note avvolgenti e ricercatezza gourmet in cucina";
  } else if (currentProduct.id === "peperoncino") {
    taglineText = "Piccantezza audace e vivacità mediterranea";
  } else if (currentProduct.id === "vino") {
    taglineText = "Vibrazioni toscane, eleganza e convivialità nel bicchiere";
  }

  // Icona personalizzata dell'Italia in SVG circolare ad alta qualità
  const ItalyIcon = (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <clipPath id="italy-circle-clip">
        <circle cx="12" cy="12" r="10" />
      </clipPath>
      <g clipPath="url(#italy-circle-clip)">
        <rect x="2" y="2" width="6.7" height="20" fill="#009246" />
        <rect x="8.7" y="2" width="6.7" height="20" fill="#ffffff" />
        <rect x="15.4" y="2" width="6.7" height="20" fill="#ce2b37" />
      </g>
      <circle cx="12" cy="12" r="10" stroke="#e5e5e5" strokeWidth="1" />
    </svg>
  );

  const currentTabContent = useMemo(() => {
    const specsData = getProductSpecs(currentProduct.id, locale);

    if (activeTab === "specifiche") {
      const mergedSpecs = {
        ...(currentProduct.specs || {}),
        ...(selectedVariant?.specs || {}),
      };
      
      const rows = Object.entries(mergedSpecs)
        .filter(([, v]) => v != null && String(v).trim().length > 0)
        .map(([k, v]) => ({ k, v: String(v) }));

      if (rows.length === 0) {
        return (
          <p className="text-neutral-500 text-sm italic">
            {locale === "it" ? "Nessuna specifica disponibile." : "No specifications available."}
          </p>
        );
      }

      return (
        <div className="animate-in fade-in duration-300">
          <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                <div className="text-neutral-700 font-medium">{r.k}</div>
                <div className="text-right text-neutral-900">{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "descrizione":
        return (
          <div className="animate-in fade-in duration-300">
            <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed mb-8">
              {descriptionParagraph || (locale === "it" ? "Lavorato e selezionato con cura per garantire profumi, equilibrio e qualità organolettiche eccellenti." : "Carefully crafted and selected to guarantee excellent aromas, balance, and organoleptic quality.") }
            </p>
            
            {/* Indicatori Sensoriali */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-neutral-200 mb-8">
              {specsData.sensory.map((indicator, idx) => (
                <div key={idx}>
                  <h5 className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                    {indicator.label}
                  </h5>
                  <div className="text-sm font-bold text-neutral-800 mt-1">
                    {indicator.value}
                  </div>
                  {indicator.type === "dots" ? (
                    <div className="flex items-center gap-1.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const dotsVal = indicator.dots || 0;
                        const isFull = i < Math.floor(dotsVal);
                        const isHalf = !isFull && (i < dotsVal);
                        return (
                          <span
                            key={i}
                            className={`h-2.5 w-2.5 rounded-full ${
                              isFull
                                ? "bg-[#3D5A3D]"
                                : isHalf
                                  ? "bg-[#3D5A3D]/65"
                                  : "bg-neutral-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-2.5">
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full border border-neutral-100/85 shadow-sm animate-in zoom-in duration-300"
                        style={{ backgroundColor: indicator.color }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Informazioni di Raccolta e Cultivar */}
            <div className="grid grid-cols-3 gap-6 pt-2">
              {specsData.techSpecs.map((spec, idx) => (
                <div key={idx}>
                  <div className="text-[11px] font-bold text-neutral-500 tracking-wider">
                    {spec.label}
                  </div>
                  <div className="text-sm font-bold text-neutral-900 mt-1">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "caratteristiche":
        return (
          <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed animate-in fade-in duration-300">
            {specsData.caratteristiche}
          </p>
        );
      case "abbinamenti":
        return (
          <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed animate-in fade-in duration-300">
            {specsData.abbinamenti}
          </p>
        );
      case "ingredienti":
        return (
          <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed animate-in fade-in duration-300">
            {specsData.ingredienti}
          </p>
        );
      case "valori nutrizionali":
        return (
          <div className="overflow-x-auto animate-in fade-in duration-300">
            <table className="min-w-full divide-y divide-neutral-200 text-sm text-[#1a1a1a] font-normal">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-2.5 text-left font-bold text-neutral-900">
                    {locale === "it" ? "Valori medi per 100ml" : "Average values per 100ml"}
                  </th>
                  <th className="py-2.5 text-right font-bold text-neutral-900">
                    {locale === "it" ? "Quantità" : "Quantity"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {specsData.valoriNutrizionali.map((row, idx) => (
                  <tr key={idx}>
                    <td className={`py-3 ${row.k.startsWith("-") ? "pl-4 text-neutral-500 font-medium" : "font-semibold text-neutral-800"}`}>
                      {row.k}
                    </td>
                    <td className="py-3 text-right font-bold text-neutral-900">
                      {row.v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, descriptionParagraph, currentProduct, locale, selectedVariant]);

  const recommendations = useMemo<ProductCardProduct[]>(() => {
    if (isEvo) {
      // Use real related products plus EVO latta as a recommendation
      const evoRelated = relatedProducts.slice(0, 3).map((p) => {
        const cheapestVariant = p.variants?.reduce((min, cur) => (cur.priceCents < min.priceCents ? cur : min), p.variants[0]);
        const priceCents = cheapestVariant ? cheapestVariant.priceCents : 1500;
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle ?? (cheapestVariant ? formatSizeLabel(cheapestVariant) : ""),
          badge: p.badge,
          imageSrc: p.imageSrc,
          imageAlt: p.imageAlt,
          priceLabel: formatEUR(priceCents, locale),
          priceCents,
          defaultVariantId: cheapestVariant?.id,
          variantsCount: p.variants?.length ?? 1,
        };
      });
      return evoRelated;
    }

    return relatedProducts.slice(0, 4).map((p) => {
      const cheapestVariant = p.variants?.reduce((min, cur) => (cur.priceCents < min.priceCents ? cur : min), p.variants[0]);
      const priceCents = cheapestVariant ? cheapestVariant.priceCents : 1500;
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle ?? (cheapestVariant ? formatSizeLabel(cheapestVariant) : ""),
        badge: p.badge,
        imageSrc: p.imageSrc,
        imageAlt: p.imageAlt,
        priceLabel: formatEUR(priceCents, locale),
        priceCents,
        defaultVariantId: cheapestVariant?.id,
        variantsCount: p.variants?.length ?? 1,
      };
    });
  }, [isEvo, locale, relatedProducts]);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const currentFaqs = text.faqs || [];

  const shopLabelMap: Record<string, string> = {
    it: "Shop",
    en: "Shop",
    de: "Online-Shop",
    nl: "Winkel",
    da: "Butik",
    no: "Butikk",
  };
  const shopLabel = shopLabelMap[locale] ?? "Shop";
  const homePath = locale === "it" ? "/" : `/${locale}`;
  const shopPath = locale === "it" ? "/shop" : `/${locale}/shop`;
  const breadcrumbTitle = selectedVariant?.title
    ? selectedVariant.title
    : (selectedVariant?.label ? `${currentProduct.title} - ${selectedVariant.label}` : currentProduct.title);

  const categoryLabel = currentProduct.id === "vino"
    ? (locale === "it" ? "VINO" : (locale === "en" ? "WINE" : (locale === "de" ? "WEIN" : (locale === "nl" ? "WIJN" : "VIN"))))
    : (locale === "it" ? "OLIO EXTRAVERGINE DI OLIVA" : (locale === "en" ? "EXTRA VIRGIN OLIVE OIL" : (locale === "de" ? "NATIVES OLIVENOEL EXTRA" : (locale === "nl" ? "EXTRA VIERGE OLIJFOLIE" : (locale === "da" ? "EKSTRA JOMFRUOLIVENOLIE" : "EXTRA VIRGIN OLIVENOLJE")))));

  return (
    <>
      {/* Breadcrumb sottile reattivo */}
      <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
        <Link href={homePath} className="hover:text-[#3D5A3D] transition-colors">Home</Link>
        <span className="text-[#D6D3D1]">/</span>
        <Link href={shopPath} className="hover:text-[#3D5A3D] transition-colors">{shopLabel}</Link>
        <span className="text-[#D6D3D1]">/</span>
        <span className="text-[#57534E]">{breadcrumbTitle}</span>
      </nav>

      {/* SEZIONE SUPERIORE: FOTO & ACQUISTO */}
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        
        {/* COLONNA SINISTRA: GALLERIA IMMAGINI PREMIUM (Foto riempie tutto - object-cover) */}
        <div className="flex flex-col">
          {/* Visualizzatore Principale */}
          <div className="relative overflow-hidden rounded-[5px] bg-[#F5F4EE] border border-neutral-100 aspect-[4/5] shadow-sm group">
            {/* Pill 100% Italiano */}
            {isEvo && (
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-[5px] bg-white px-3 py-1.5 text-[10px] font-bold tracking-widest text-neutral-800 shadow-sm uppercase">
                <span className="flex h-3.5 w-5 overflow-hidden rounded-[1px] border border-neutral-200 shrink-0">
                  <span className="h-full w-1/3 bg-[#009246]" />
                  <span className="h-full w-1/3 bg-[#FFFFFF]" />
                  <span className="h-full w-1/3 bg-[#CE2B37]" />
                </span>
                100% Italiano
              </div>
            )}

            {activeImage ? (
              <Image
                src={activeImage}
                alt={currentProduct.imageAlt || currentProduct.title}
                fill
                className="object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onClick={() => openLightbox(galleryImages.indexOf(activeImage))}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center text-xs font-semibold text-neutral-400">
                  Immagine non disponibile
                </div>
              </div>
            )}
          </div>

          {/* Miniature (Thumbnails - object-cover) */}
          {galleryItems.length > 1 && (
            <div className="flex flex-wrap gap-2.5 mt-4">
              {galleryItems.map((item, idx) => {
                const isActive = item.src === activeImage;
                const thumbLabel = item.label
                  .replace(/Bottiglia|Latta|Can/gi, "")
                  .trim();
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleImageClick(item)}
                    className="relative flex flex-col items-center gap-1 cursor-pointer group/thumb w-[72px]"
                  >
                    <div className={`relative aspect-square w-full overflow-hidden rounded-[5px] bg-[#F5F4EE] border transition-all ${
                      isActive ? "border-2 border-[#3D5A3D] ring-1 ring-[#3D5A3D]/20" : "border-neutral-200 hover:border-neutral-400"
                    }`}>
                      <Image
                        src={item.src}
                        alt={item.alt || `Miniatura ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                        sizes="72px"
                      />
                    </div>
                    {thumbLabel && (
                      <span className={`text-[9px] font-semibold tracking-wide text-center truncate w-full transition-colors ${
                        isActive ? "text-[#3D5A3D] font-bold" : "text-neutral-500 group-hover/thumb:text-neutral-700"
                      }`}>
                        {thumbLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* COLONNA DESTRA: DETTAGLI PRODOTTO E ACQUISTO */}
        <div className="flex flex-col">
          {/* Categoria */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold tracking-[0.15em] text-[#8f6d4c] uppercase">
              {categoryLabel}
            </span>
          </div>
          
          {/* Titolo Box (Spazio fissato per evitare lo shifting dei componenti sottostanti) */}
          <div className="mt-2 h-[90px] min-h-[90px] max-h-[90px] lg:h-[110px] lg:min-h-[110px] lg:max-h-[110px] shrink-0 grow-0 flex items-start">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-neutral-900 line-clamp-2">
              {selectedVariant?.title || currentProduct.title}
              {selectedVariant?.label && !selectedVariant?.title ? ` - ${selectedVariant.label}` : ""}
            </h1>
          </div>

          {/* Sottotitolo / Tagline */}
          {taglineText && (
            <p className="mt-3 text-base font-serif italic text-[#3D5A3D]">
              {taglineText}
            </p>
          )}

          {/* Prezzo e Informazioni Fiscali */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-neutral-900 font-light">
              {formatEUR(variantPriceCents, locale)}
            </span>
            <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
              {formatSizeLabel(selectedVariant)}
            </span>
            <span className="text-[10px] text-neutral-400 tracking-wider">
              | IVA inclusa
            </span>
          </div>

          {/* Descrizione Breve (Spazio fissato per evitare lo shifting dei componenti sottostanti) */}
          <div className="relative mt-6 h-[90px] min-h-[90px] max-h-[90px] shrink-0 grow-0">
            <div className="h-full w-full overflow-y-auto no-scrollbar text-[14.5px] leading-relaxed text-neutral-600 font-normal pb-4">
              {descriptionParagraph}
            </div>
            {/* Sfumatura premium sfocata per indicare altro testo scorribile */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#FDFCF8] to-transparent pointer-events-none" />
          </div>

          {/* Griglia dei 4 Badges Chiave */}
          {isEvo && (
            <div className="grid grid-cols-4 gap-2 py-6 border-y border-neutral-200 my-6 text-center">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D5A3D]/5 text-[#3D5A3D] shrink-0">
                  {ItalyIcon}
                </div>
                <span className="text-[10px] font-bold text-neutral-900 tracking-wide mt-2">100% Italiano</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Origine garantita</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D5A3D]/5 text-[#3D5A3D] shrink-0">
                  <Droplets className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-neutral-900 tracking-wide mt-2">Estratto a freddo</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Massima qualità</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D5A3D]/5 text-[#3D5A3D] shrink-0">
                  <Leaf className="h-5 w-5 text-[#3D5A3D]" />
                </div>
                <span className="text-[10px] font-bold text-neutral-900 tracking-wide mt-2">Raccolta precoce</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Gusto intenso</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D5A3D]/5 text-[#3D5A3D] shrink-0">
                  <Warehouse className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-neutral-900 tracking-wide mt-2">Frantoio di famiglia</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Dal 1954</span>
              </div>
            </div>
          )}

          {/* Formati navigabili */}
          {formatNavGroups ? (
            <div className="mt-2 space-y-4 rounded-[5px] border border-neutral-200/80 bg-[#FAFAF8] p-4">
              {([
                ["bottle", text.bottleFormat, formatNavGroups.bottle],
                ["can", text.canFormat, formatNavGroups.can],
              ] as const).map(([groupId, label, items]) => (
                <div key={groupId}>
                  <label className="mb-2 block text-[10px] font-bold tracking-[0.18em] text-neutral-500 uppercase">
                    {label}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((item) => {
                      const isSelected =
                        item.productId === currentProduct.id && String(item.variantId) === String(selectedVariantId);

                      return (
                        <button
                          key={`${item.productId}:${item.variantId}`}
                          type="button"
                          onClick={() => handleFormatSelect(item)}
                          className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-[5px] border px-4 py-2.5 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#3D5A3D] border-[#3D5A3D] text-white shadow-[0_4px_16px_rgba(61,90,61,0.15)]"
                              : "bg-white border-neutral-200 text-neutral-800 hover:border-[#3D5A3D] hover:text-[#3D5A3D] hover:bg-neutral-50/50"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : variants.length > 1 ? (
            <div className="mt-2">
              <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                {text.format}
              </label>

              <div className="grid grid-cols-3 gap-3">
                {variants.map((v) => {
                  const isSelected = String(v.id) === String(selectedVariantId);
                  const isVarOut = availMap ? (availMap[makeInventorySku(currentProduct.id, v.id)] ?? 0) <= 0 : false;

                  return (
                    <button
                      key={v.id}
                      disabled={isVarOut}
                      onClick={() => handleVariantSelect(v)}
                      className={`flex flex-col items-center justify-center py-3.5 border rounded-[5px] transition-all cursor-pointer ${
                        isVarOut 
                          ? "opacity-35 cursor-not-allowed border-neutral-100 bg-neutral-50"
                          : isSelected
                            ? "bg-[#3D5A3D] border-[#3D5A3D] text-white shadow-[0_4px_16px_rgba(61,90,61,0.15)]"
                            : "bg-white border-neutral-200 text-neutral-800 hover:border-[#3D5A3D] hover:text-[#3D5A3D] hover:bg-neutral-50/50 hover:scale-[1.01]"
                      }`}
                    >
                      <span className="text-sm font-semibold tracking-wide">
                        {formatSizeLabel(v)}
                      </span>
                      <span className={`text-[11px] mt-0.5 ${isSelected ? "text-white/80" : "text-neutral-400"}`}>
                        {formatEUR(v.priceCents, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Quantità */}
          <div className="mt-6 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                {text.quantity}
              </label>
              
              {/* Indicatore stock in tempo reale */}
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  loadingAvail 
                    ? "bg-neutral-300 animate-pulse" 
                    : isOutOfStock 
                      ? "bg-red-500" 
                      : "bg-emerald-500"
                }`} />
                <span className="text-[10px] font-semibold text-neutral-500">
                  {loadingAvail 
                    ? text.checking 
                    : isOutOfStock 
                      ? text.outOfStock 
                      : maxQty < 15 
                        ? text.maxLimit(maxQty) 
                        : text.available
                  }
                </span>
              </div>
            </div>

            <div className="inline-flex items-center border border-neutral-200 bg-white rounded-[5px] w-fit overflow-hidden self-start">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || isOutOfStock}
                className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-20 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold tabular-nums text-neutral-800">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty || isOutOfStock}
                className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="my-6 h-px bg-neutral-100" />

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 text-xs font-semibold text-red-500 bg-red-50/50 border border-red-100 p-3 rounded-[5px]">
              {errorMessage}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            {/* Aggiungi al Carrello */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`flex items-center justify-center gap-2.5 w-full py-4 text-xs font-semibold tracking-[0.1em] rounded-[5px] transition-all cursor-pointer active:scale-[0.985] ${
                isOutOfStock
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : isAdding
                    ? "bg-neutral-200 text-neutral-500 cursor-wait"
                    : "bg-[#3D5A3D] text-white hover:bg-[#324a32] shadow-[0_8px_24px_rgba(61,90,61,0.12)]"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4.5 w-4.5 text-white animate-bounce" />
                  {text.added}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  {isOutOfStock ? text.outOfStock : `${text.addToCart} • ${totalPriceFormatted}`}
                </>
              )}
            </button>

            {cartCount > 0 && cartTotalCents > 0 ? (
              <button
                disabled={checkoutLoading}
                onClick={handleDirectCheckout}
                className="flex w-full items-center justify-center gap-2.5 rounded-[5px] border border-[#263a2b] bg-white py-4 text-xs font-semibold tracking-[0.1em] text-[#263a2b] transition-all hover:bg-[#263a2b] hover:text-white active:scale-[0.985] disabled:opacity-50 disabled:cursor-wait cursor-pointer"
              >
                {checkoutLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
                    {locale === "it" ? "REINDIRIZZAMENTO..." : "REDIRECTING..."}
                  </>
                ) : (
                  `${text.goToCheckout} • ${cartTotalFormatted}`
                )}
              </button>
            ) : null}
          </div>

          {/* Promo Spedizione */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-500">
            <Truck className="h-3.5 w-3.5 text-neutral-400" />
            <span>{text.shippingPromo}</span>
          </div>
        </div>

      </div>

      {/* SEZIONE INFERIORE: SCHEDE DETTAGLIATE & FILOSOFIA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-16 border-t border-neutral-200 mt-20 items-start">
        
        {/* Tab + Contenuto Wrapper per unione a cartella su mobile */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-12 w-full">
          {/* Schede informative */}
          <div 
            className="flex overflow-x-auto pb-0 self-start lg:col-span-1 lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0 lg:pr-4 space-x-[-1px] w-full border-b border-neutral-200/80 lg:border-b-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(() => {
              const tabs = [
                { id: "descrizione", label: text.description },
                { id: "caratteristiche", label: text.features },
                { id: "abbinamenti", label: text.pairings },
                { id: "ingredienti", label: text.ingredients },
                { id: "valori nutrizionali", label: text.nutrition },
              ];

              const hasSpecs = (currentProduct.specs && Object.keys(currentProduct.specs).length > 0) || 
                               (selectedVariant?.specs && Object.keys(selectedVariant.specs).length > 0);

              if (hasSpecs) {
                tabs.push({ 
                  id: "specifiche", 
                  label: currentProduct.specsTitle || (locale === "it" ? "Specifiche" : "Specifications") 
                });
              }

              return tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 text-xs font-bold tracking-wider transition-all cursor-pointer border border-neutral-200/80 text-center lg:text-left ${
                      isActive 
                        ? "bg-white text-[#3D5A3D] rounded-t-[5px] border-b-transparent z-10 relative px-6 pt-3.5 pb-3.5 lg:bg-transparent lg:border-y-0 lg:border-r-0 lg:border-l-2 lg:border-[#263a2b] lg:text-[#263a2b] lg:rounded-none lg:px-0 lg:pl-4 lg:py-3 lg:z-auto" 
                        : "bg-[#F5F5F3]/60 text-neutral-500 rounded-t-[5px] mt-[4px] px-5 pt-2.5 pb-2.5 hover:bg-neutral-100/50 lg:bg-transparent lg:border-transparent lg:text-neutral-500 lg:hover:text-[#263a2b] lg:rounded-none lg:px-0 lg:pl-4 lg:py-3 lg:mt-0"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              });
            })()}
          </div>

          {/* Contenuto della scheda selezionata (Col 2 e 3) */}
          <div className="lg:col-span-2 flex flex-col justify-start bg-white border border-neutral-200/80 rounded-[5px] p-8 shadow-sm -mt-[1px] lg:bg-transparent lg:border-none lg:rounded-none lg:p-0 lg:shadow-none lg:mt-0 lg:px-6">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#8B7355] mb-6 uppercase lg:block hidden">
              {activeTab}
            </h3>
            
            <div className="animate-in fade-in duration-300">
              {currentTabContent}
            </div>
          </div>
        </div>

        {/* Filosofia Card con Immagine Uliveto (Col 4) - Stretches dynamically to match content height */}
        <div className="flex lg:col-span-1 w-full">
          <div className="relative overflow-hidden rounded-[5px] flex flex-col justify-between p-6 text-white h-[380px] w-full shadow-sm z-0">
            {/* Sfondo uliveto */}
            <Image
              src="/products/del_pasqua_olive_grove.png"
              alt="Uliveto Del Pasqua"
              fill
              className="object-cover -z-20 rounded-[5px]"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {/* Gradiente nero */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent -z-10 rounded-[5px]" />
            
            <span className="text-[9px] font-bold tracking-[0.25em] text-[#E0D8C8]">
              {text.philosophylabel}
            </span>
            
            <div className="mt-auto">
              <h4 className="font-serif text-xl font-light leading-tight mb-5">
                {text.philosophyTitle}
              </h4>
              
              <Link 
                href={`/${locale}/produzione`}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white hover:text-[#E0D8C8] group transition-colors uppercase"
              >
                <span>{text.philosophyLink}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* SEZIONE RACCOMANDATI */}
      <div className="border-t border-neutral-200 pt-16 mt-6">
        <h2 className="text-center font-serif text-2xl lg:text-3xl font-light text-neutral-900 tracking-tight mb-8">
          {text.relatedTitle}
        </h2>
        
        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((item) => (
            <div key={item.id} className="flex h-full">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>

      {/* SEZIONE FAQ (DOMANDE FREQUENTI) - IMPORTANT FOR SEO */}
      {currentFaqs.length > 0 && (
        <div className="border-t border-neutral-200 pt-16 mt-16 pb-8">
          <h2 className="text-center font-serif text-2xl lg:text-3xl font-light text-neutral-900 tracking-tight mb-10">
            {text.faqTitle}
          </h2>
          
          <div className="mx-auto max-w-3xl space-y-4">
            {currentFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              
              return (
                <div 
                  key={idx} 
                  className="border border-neutral-200 bg-white rounded-[5px] overflow-hidden transition-all shadow-none"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-serif text-[15px] font-semibold text-neutral-800 hover:bg-neutral-50/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      className={`h-4 w-4 text-[#3D5A3D] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-neutral-100 text-sm leading-relaxed text-neutral-600 font-light bg-neutral-50/20 animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIGHTBOX POPUP DI GALLERIA */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Bottone Chiudi */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-[5px] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Bottone Precedente */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
            className="absolute left-6 text-white/70 hover:text-white p-3 rounded-[5px] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Immagine Attiva */}
          <div 
            className="relative w-[90vw] h-[75dvh] md:w-[70vw] md:h-[80dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightboxIndex]}
              alt={`Galleria ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Bottone Successiva */}
          <button 
            onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
            className="absolute right-6 text-white/70 hover:text-white p-3 rounded-[5px] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Contatore in basso */}
          <div className="absolute bottom-6 text-white/60 text-xs font-semibold uppercase tracking-widest">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
}
