// src/app/shop/_components/ProductPurchaseBox.client.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  ChevronDown,
  Check,
  X,
  Info,
  Package,
  RotateCcw,
} from "lucide-react";

import PaymentMethodsBadges from "@/components/PaymentMethodsBadges";

type ProductVariant = {
  id: string;
  label: string;
  priceCents: number;
  sku?: string;
};

type PurchaseInfo = {
  caratteristiche?: string;
  imballaggio?: string;
  spedizione?: string;
  resi?: string;
};

function formatEUR(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === "it" ? "it-IT" : locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function makeSku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

function pickText(custom: unknown, fallback: string) {
  const s = typeof custom === "string" ? custom.trim() : "";
  return s.length ? s : fallback;
}

const labels = {
  it: {
    checking: "Controllo...",
    soldOut: "Esaurito",
    available: "Disponibile",
    size: "Formato",
    checkingStock: "Controllo stock...",
    availableCount: (count: number) => `${count} disponibili`,
    unavailable: "Non disponibile",
    inStock: (count: number) => `${count} in stock`,
    quantity: "Quantita",
    max: (count: number) => `Max ${count}`,
    add: "Aggiungi",
    added: (qty: number) => `Aggiunto al carrello (${qty})`,
    freeShipping: "Spedizione gratis",
    freeShippingSub: "Sopra i 50 euro",
    quality: "Qualita garantita",
    qualitySub: "100% italiano",
    productDetails: "Dettagli prodotto",
    details: {
      caratteristiche: "Caratteristiche",
      imballaggio: "Imballaggio",
      spedizione: "Spedizione",
      resi: "Resi",
    },
    defaults: {
      caratteristiche: "Olio extravergine di oliva ottenuto direttamente dalle olive e unicamente mediante processi meccanici. Acidita <0,3%. Estratto a freddo per preservare tutte le proprieta organolettiche.",
      imballaggio: "Bottiglia in vetro scuro per proteggere dall'ossidazione. Confezione riciclabile e protettiva.",
      spedizione: "Consegna in 2-3 giorni lavorativi. Tracking in tempo reale. Spedizione gratuita per ordini sopra i 50 euro.",
      resi: "Reso gratuito entro 14 giorni. Rimborso completo senza domande.",
    },
  },
  en: {
    checking: "Checking...",
    soldOut: "Sold out",
    available: "Available",
    size: "Size",
    checkingStock: "Checking stock...",
    availableCount: (count: number) => `${count} available`,
    unavailable: "Unavailable",
    inStock: (count: number) => `${count} in stock`,
    quantity: "Quantity",
    max: (count: number) => `Max ${count}`,
    add: "Add",
    added: (qty: number) => `Added to cart (${qty})`,
    freeShipping: "Free shipping",
    freeShippingSub: "Over EUR 50",
    quality: "Guaranteed quality",
    qualitySub: "100% Italian",
    productDetails: "Product details",
    details: {
      caratteristiche: "Characteristics",
      imballaggio: "Packaging",
      spedizione: "Shipping",
      resi: "Returns",
    },
    defaults: {
      caratteristiche: "Extra virgin olive oil obtained directly from olives and solely by mechanical processes. Cold extracted to preserve its sensory qualities.",
      imballaggio: "Dark glass bottle or protective tin packaging designed to preserve the oil from light and oxidation.",
      spedizione: "Delivery in 2-3 working days with tracking. Free shipping for orders over EUR 50.",
      resi: "Returns available within 14 days according to the sales conditions.",
    },
  },
  de: {
    checking: "Pruefung...",
    soldOut: "Ausverkauft",
    available: "Verfuegbar",
    size: "Format",
    checkingStock: "Bestand wird geprueft...",
    availableCount: (count: number) => `${count} verfuegbar`,
    unavailable: "Nicht verfuegbar",
    inStock: (count: number) => `${count} auf Lager`,
    quantity: "Menge",
    max: (count: number) => `Max ${count}`,
    add: "Hinzufuegen",
    added: (qty: number) => `In den Warenkorb gelegt (${qty})`,
    freeShipping: "Kostenloser Versand",
    freeShippingSub: "Ab EUR 50",
    quality: "Garantierte Qualitaet",
    qualitySub: "100% italienisch",
    productDetails: "Produktdetails",
    details: {
      caratteristiche: "Eigenschaften",
      imballaggio: "Verpackung",
      spedizione: "Versand",
      resi: "Rueckgabe",
    },
    defaults: {
      caratteristiche: "Natives Olivenoel extra, direkt aus Oliven und ausschliesslich mit mechanischen Verfahren gewonnen. Kaltextrahiert, um die sensorischen Eigenschaften zu bewahren.",
      imballaggio: "Dunkle Glasflasche oder schuetzende Dose, um das Oel vor Licht und Oxidation zu schuetzen.",
      spedizione: "Lieferung in 2-3 Werktagen mit Sendungsverfolgung. Kostenloser Versand ab EUR 50.",
      resi: "Rueckgabe innerhalb von 14 Tagen gemaess den Verkaufsbedingungen.",
    },
  },
  nl: {
    checking: "Controleren...",
    soldOut: "Uitverkocht",
    available: "Beschikbaar",
    size: "Formaat",
    checkingStock: "Voorraad controleren...",
    availableCount: (count: number) => `${count} beschikbaar`,
    unavailable: "Niet beschikbaar",
    inStock: (count: number) => `${count} op voorraad`,
    quantity: "Aantal",
    max: (count: number) => `Max ${count}`,
    add: "Toevoegen",
    added: (qty: number) => `Toegevoegd aan winkelwagen (${qty})`,
    freeShipping: "Gratis verzending",
    freeShippingSub: "Boven EUR 50",
    quality: "Gegarandeerde kwaliteit",
    qualitySub: "100% Italiaans",
    productDetails: "Productdetails",
    details: {
      caratteristiche: "Kenmerken",
      imballaggio: "Verpakking",
      spedizione: "Verzending",
      resi: "Retouren",
    },
    defaults: {
      caratteristiche: "Extra vierge olijfolie rechtstreeks uit olijven verkregen en uitsluitend met mechanische procedes. Koud geextraheerd om de sensorische kwaliteiten te behouden.",
      imballaggio: "Donkere glazen fles of beschermende blikverpakking om de olie tegen licht en oxidatie te beschermen.",
      spedizione: "Levering binnen 2-3 werkdagen met tracking. Gratis verzending bij bestellingen boven EUR 50.",
      resi: "Retour mogelijk binnen 14 dagen volgens de verkoopvoorwaarden.",
    },
  },
  da: {
    checking: "Kontrollerer...",
    soldOut: "Udsolgt",
    available: "Tilgaengelig",
    size: "Format",
    checkingStock: "Kontrollerer lager...",
    availableCount: (count: number) => `${count} tilgaengelige`,
    unavailable: "Ikke tilgaengelig",
    inStock: (count: number) => `${count} paa lager`,
    quantity: "Antal",
    max: (count: number) => `Maks ${count}`,
    add: "Tilfoej",
    added: (qty: number) => `Tilfoejet til kurv (${qty})`,
    freeShipping: "Gratis fragt",
    freeShippingSub: "Over EUR 50",
    quality: "Garanteret kvalitet",
    qualitySub: "100% italiensk",
    productDetails: "Produktdetaljer",
    details: {
      caratteristiche: "Egenskaber",
      imballaggio: "Emballage",
      spedizione: "Forsendelse",
      resi: "Returnering",
    },
    defaults: {
      caratteristiche: "Ekstra jomfruolivenolie fremstillet direkte af oliven og udelukkende ved mekaniske processer. Koldpresset for at bevare de sensoriske kvaliteter.",
      imballaggio: "Moerk glasflaske eller beskyttende dunk, der beskytter olien mod lys og oxidering.",
      spedizione: "Levering paa 2-3 hverdage med tracking. Gratis fragt ved ordrer over EUR 50.",
      resi: "Returnering inden for 14 dage i henhold til salgsbetingelserne.",
    },
  },
  no: {
    checking: "Kontrollerer...",
    soldOut: "Utsolgt",
    available: "Tilgjengelig",
    size: "Format",
    checkingStock: "Kontrollerer lager...",
    availableCount: (count: number) => `${count} tilgjengelig`,
    unavailable: "Ikke tilgjengelig",
    inStock: (count: number) => `${count} paa lager`,
    quantity: "Antall",
    max: (count: number) => `Maks ${count}`,
    add: "Legg til",
    added: (qty: number) => `Lagt i handlekurven (${qty})`,
    freeShipping: "Gratis frakt",
    freeShippingSub: "Over EUR 50",
    quality: "Garantert kvalitet",
    qualitySub: "100% italiensk",
    productDetails: "Produktdetaljer",
    details: {
      caratteristiche: "Egenskaper",
      imballaggio: "Emballasje",
      spedizione: "Frakt",
      resi: "Retur",
    },
    defaults: {
      caratteristiche: "Extra virgin olivenolje fremstilt direkte fra oliven og utelukkende med mekaniske prosesser. Kaldpresset for aa bevare de sensoriske kvalitetene.",
      imballaggio: "Moerk glassflaske eller beskyttende kanne som beskytter oljen mot lys og oksidasjon.",
      spedizione: "Levering paa 2-3 virkedager med sporing. Gratis frakt for bestillinger over EUR 50.",
      resi: "Retur innen 14 dager i henhold til salgsbetingelsene.",
    },
  },
};

type LabelLocale = keyof typeof labels;

export default function ProductPurchaseBox({
  productId,
  variants,
  selectedVariantId,
  onVariantChange,
  purchaseInfo,
}: {
  productId: string;
  variants: ProductVariant[];
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
  purchaseInfo?: PurchaseInfo;
}) {
  const locale = useLocale();
  const text = labels[(locale as LabelLocale)] ?? labels.it;
  const isControlled = selectedVariantId != null && typeof onVariantChange === "function";
  const [localVariantId, setLocalVariantId] = useState<string | undefined>(selectedVariantId ?? variants[0]?.id);

  const effectiveVariantId = isControlled ? selectedVariantId : localVariantId ?? variants[0]?.id;

  const selected = useMemo(() => {
    return variants.find((v) => String(v.id) === String(effectiveVariantId)) ?? variants[0];
  }, [variants, effectiveVariantId]);

  const priceCents = selected?.priceCents ?? variants[0]?.priceCents ?? 0;

  const { add } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [mobileSheetOffset, setMobileSheetOffset] = useState(0);

  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availMap, setAvailMap] = useState<Record<string, number> | null>(null);
  const mobileSheetTouchStartY = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!productId || variants.length === 0) {
      queueMicrotask(() => setAvailMap({}));
      return;
    }

    const skus = variants.map((v) => makeSku(productId, v.id));
    queueMicrotask(() => setLoadingAvail(true));

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
  }, [productId, variants]);

  const selectedSku = selected ? makeSku(productId, selected.id) : "";
  const selectedAvailable = availMap ? (availMap[selectedSku] ?? 0) : null;
  const maxQty = selectedAvailable == null ? 99 : Math.max(0, selectedAvailable);

  useEffect(() => {
    queueMicrotask(() => {
      setQty((q) => {
        if (maxQty <= 0) return 1;
        return Math.min(Math.max(1, q), maxQty);
      });
      setAdded(false);
    });
  }, [maxQty, selected?.id]);

  useEffect(() => {
    if (!showMobileDetails) return;

    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const previous = {
      bodyOverflow: bodyStyle.overflow,
      bodyPosition: bodyStyle.position,
      bodyTop: bodyStyle.top,
      bodyLeft: bodyStyle.left,
      bodyRight: bodyStyle.right,
      bodyWidth: bodyStyle.width,
      bodyOverscroll: bodyStyle.overscrollBehavior,
      htmlOverflow: htmlStyle.overflow,
      htmlOverscroll: htmlStyle.overscrollBehavior,
    };

    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.width = "100%";
    bodyStyle.overscrollBehavior = "none";
    htmlStyle.overflow = "hidden";
    htmlStyle.overscrollBehavior = "none";

    return () => {
      bodyStyle.overflow = previous.bodyOverflow;
      bodyStyle.position = previous.bodyPosition;
      bodyStyle.top = previous.bodyTop;
      bodyStyle.left = previous.bodyLeft;
      bodyStyle.right = previous.bodyRight;
      bodyStyle.width = previous.bodyWidth;
      bodyStyle.overscrollBehavior = previous.bodyOverscroll;
      htmlStyle.overflow = previous.htmlOverflow;
      htmlStyle.overscrollBehavior = previous.htmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [showMobileDetails]);

  const setVariant = (id: string) => {
    if (!isControlled) setLocalVariantId(id);
    onVariantChange?.(id);
    setShowVariantDropdown(false);
  };

  const isOut = selectedAvailable != null && selectedAvailable <= 0;
  const isDisabled = loadingAvail || !selected || isOut;

  const handleAddToCart = async () => {
    if (!selected || isDisabled) return;

    setIsAdding(true);
    const safeQty = Math.min(Math.max(1, qty), maxQty || 99);

    await new Promise((r) => setTimeout(r, 400));

    add({
      productId,
      variantId: selected.id,
      qty: safeQty,
    });

    setIsAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalPrice = priceCents * qty;

  const detailsTexts = {
    caratteristiche: pickText(locale === "it" ? purchaseInfo?.caratteristiche : undefined, text.defaults.caratteristiche),
    imballaggio: pickText(locale === "it" ? purchaseInfo?.imballaggio : undefined, text.defaults.imballaggio),
    spedizione: pickText(locale === "it" ? purchaseInfo?.spedizione : undefined, text.defaults.spedizione),
    resi: pickText(locale === "it" ? purchaseInfo?.resi : undefined, text.defaults.resi),
  };

  // Contenuto dettagli (condiviso tra desktop e mobile) — TITOLI + ICONE IDENTICI
  const detailsContent = (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">{text.details.caratteristiche}</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.caratteristiche}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Package className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">{text.details.imballaggio}</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.imballaggio}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Truck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">{text.details.spedizione}</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.spedizione}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <RotateCcw className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">{text.details.resi}</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.resi}
          </p>
        </div>
      </div>
    </div>
  );

  const closeMobileDetails = () => {
    setShowMobileDetails(false);
    setMobileSheetOffset(0);
    mobileSheetTouchStartY.current = null;
    setIsDragging(false);
  };

  const handleMobileSheetTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    mobileSheetTouchStartY.current = event.touches[0]?.clientY ?? null;
    setIsDragging(false);
  };

  const handleMobileSheetTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const startY = mobileSheetTouchStartY.current;
    if (startY == null) return;

    const currentY = event.touches[0]?.clientY ?? startY;
    const deltaY = currentY - startY;

    if (deltaY <= 0) {
      setMobileSheetOffset(0);
      return;
    }

    event.preventDefault();
    setIsDragging(true);
    setMobileSheetOffset(Math.min(deltaY, 260));
  };

  const handleMobileSheetTouchEnd = () => {
    if (mobileSheetOffset > 100) {
      closeMobileDetails();
      return;
    }

    setMobileSheetOffset(0);
    mobileSheetTouchStartY.current = null;
    setIsDragging(false);
  };

  return (
    <>
      <div style={{ borderRadius: '5px' }} className="border border-neutral-200 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm md:sticky md:top-6">
        {/* Header: Prezzo e disponibilità */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-medium tracking-[0.2em] text-neutral-400 uppercase">{productId}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-neutral-900">{formatEUR(priceCents, locale)}</span>
              {variants.length > 1 && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatEUR(Math.max(...variants.map((v) => v.priceCents)), locale)}
                </span>
              )}
            </div>
          </div>

          <div style={{ borderRadius: '5px' }} className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${loadingAvail ? "bg-neutral-300 animate-pulse" : isOut ? "bg-red-500" : "bg-emerald-500"
                }`}
            />
            <span className="text-[11px] font-medium text-neutral-600">
              {loadingAvail ? text.checking : isOut ? text.soldOut : text.available}
            </span>
          </div>
        </div>

        {/* Selettore varianti */}
        {variants.length > 1 && (
          <div className="mt-6 relative">
            <label className="mb-2 block text-[11px] font-medium tracking-[0.15em] text-neutral-500 uppercase">
              {text.size}
            </label>
            <button
              onClick={() => setShowVariantDropdown(!showVariantDropdown)}
              style={{ borderRadius: '5px' }} className="group w-full border border-neutral-200 bg-white px-4 py-3.5 text-left transition-all hover:border-neutral-300 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900">{selected?.label}</span>
                  <span className="text-xs text-neutral-400 mt-0.5">
                    {loadingAvail ? text.checkingStock : selectedAvailable != null ? text.availableCount(selectedAvailable) : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-900">{formatEUR(priceCents, locale)}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${showVariantDropdown ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>
            </button>

            {showVariantDropdown && (
              <div style={{ borderRadius: '5px' }} className="absolute z-20 mt-1 w-full border border-neutral-200 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                {variants.map((variant) => {
                  const sku = makeSku(productId, variant.id);
                  const avail = availMap ? (availMap[sku] ?? 0) : null;
                  const out = avail != null && avail <= 0;
                  const isSelected = String(variant.id) === String(selected?.id);

                  return (
                    <button
                      key={variant.id}
                      onClick={() => !out && setVariant(String(variant.id))}
                      disabled={out}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${isSelected ? "bg-neutral-50" : "hover:bg-neutral-50"
                        } ${out ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-sm ${isSelected ? "font-medium text-neutral-900" : "text-neutral-600"}`}>
                          {variant.label}
                        </span>
                        <span className="text-[11px] text-neutral-400">{out ? text.unavailable : avail != null ? text.inStock(avail) : "-"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-900">{formatEUR(variant.priceCents, locale)}</span>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quantità */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[11px] font-medium tracking-[0.15em] text-neutral-500 uppercase">{text.quantity}</label>
            {!loadingAvail && maxQty > 0 && <span className="text-[11px] text-neutral-400">{text.max(maxQty)}</span>}
          </div>
          <div style={{ borderRadius: '5px' }} className="inline-flex items-center border border-neutral-200 bg-white">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold tabular-nums text-neutral-900">{qty}</span>
            <button
              onClick={() => setQty(Math.min(maxQty || 99, qty + 1))}
              disabled={qty >= maxQty}
              className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="my-6 h-px bg-neutral-100" />

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isDisabled || isAdding}
          style={{ borderRadius: '5px' }} className={`group relative w-full overflow-hidden py-4 text-sm font-semibold tracking-wide transition-all ${isDisabled || isAdding
            ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-[0_8px_24px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.35)]"
            }`}
        >
          <span
            className={`flex items-center justify-center gap-2 transition-all duration-300 ${isAdding ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"
              }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOut ? text.soldOut : `${text.add} - ${formatEUR(totalPrice, locale)}`}
          </span>

          {isAdding && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          )}
        </button>

        {added && (
          <div style={{ borderRadius: '5px' }} className="mt-3 flex items-center justify-center gap-2 bg-emerald-50 py-3 text-sm text-emerald-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Check className="h-4 w-4" />
            {text.added(qty)}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div style={{ borderRadius: '5px' }} className="flex items-start gap-2 bg-neutral-50 p-3">
            <Truck className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-neutral-900">{text.freeShipping}</p>
              <p className="text-[10px] text-neutral-500">{text.freeShippingSub}</p>
            </div>
          </div>
          <div style={{ borderRadius: '5px' }} className="flex items-start gap-2 bg-neutral-50 p-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-neutral-900">{text.quality}</p>
              <p className="text-[10px] text-neutral-500">{text.qualitySub}</p>
            </div>
          </div>
        </div>

        {/* Metodi di Pagamento */}
        <PaymentMethodsBadges className="mt-5 mb-2" collapsible />

        {/* Dettagli - Desktop */}
        <div className="mt-4 hidden md:block space-y-1">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs text-neutral-500 transition-colors hover:text-neutral-900">
              <span>{text.productDetails}</span>
              <Plus className="h-3 w-3 transition-transform group-open:rotate-45" />
            </summary>
            <div className="pb-2">
              {detailsContent}
            </div>
          </details>
        </div>

        {/* Bottone dettagli - Mobile */}
        <button
          onClick={() => setShowMobileDetails(true)}
          style={{ borderRadius: '5px' }} className="mt-4 flex w-full items-center justify-center gap-2 border border-neutral-200 py-3 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 md:hidden"
        >
          <Info className="h-4 w-4" />
          {text.productDetails}
        </button>
      </div>

      {/* Bottom Sheet Mobile per dettagli */}
      {showMobileDetails && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={closeMobileDetails}
          />

          <div
            className="fixed inset-x-0 bottom-0 z-50 md:hidden"
          >
            <div
              className="rounded-t-3xl bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom duration-300"
              style={{
                transform: `translate3d(0, ${mobileSheetOffset}px, 0)`,
                transition: isDragging ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform",
              }}
            >
              <div
                className="flex justify-center pt-3 pb-1 touch-none"
                onTouchStart={handleMobileSheetTouchStart}
                onTouchMove={handleMobileSheetTouchMove}
                onTouchEnd={handleMobileSheetTouchEnd}
                onTouchCancel={handleMobileSheetTouchEnd}
              >
                <div className="h-1.5 w-12 rounded-full bg-neutral-200" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
                <h3 className="text-base font-semibold text-neutral-900">{text.productDetails}</h3>
                <button
                  onClick={closeMobileDetails}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain px-5 pt-5 [-webkit-overflow-scrolling:touch]"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
              >
                {detailsContent}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
