"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useEffect, useMemo, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Tag, ShoppingCart, MapPin, ChevronDown } from "lucide-react";
import FlagIcon from "@/components/FlagIcon";

import Footer from "@/components/Footer";
import ToggleMessage from "@/components/ui/ToggleMessage";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/analytics/track";
import { translateCartCheckoutError, translateCartPromoError } from "@/lib/cartI18n";
import { getLocalizedProductHref } from "@/lib/productSlugs";
import type { Product } from "@/lib/shopTypes";
import { getShippingRule } from "@/lib/shippingConfig";
import { cn } from "@/lib/utils";

function formatEUR(cents: number) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const intPart = Math.floor(abs / 100);
  const decPart = abs % 100;
  const grouped = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimals = String(decPart).padStart(2, "0");
  return `${sign}${grouped},${decimals} €`;
}

type Totals = {
  items: CheckoutPricingItem[];
  subtotalCents: number;
  discountCents: number;
  vatCents: number;
  shippingCents: number;
  totalCents: number;
  promotionApplied?: { code: string; percent?: number | null } | null;
};

type CheckoutPricingItem = {
  productId: string;
  variantId: string;
  unitPriceCents: number;
  qty: number;
  lineSubtotalCents: number;
  lineDiscountCents: number;
  lineTotalCents: number;
};

type PromoResult = {
  code: string;
  discountCents: number;
  percent: number | null;
  freeShipping: boolean;
};

const cartStatusCopy = {
  it: {
    lineReduced: (title: string, qty: number) => `${title} aggiornato a ${qty} per disponibilita limitata.`,
    lineRemoved: (title: string) => `${title} rimosso dal carrello per esaurimento stock.`,
    lineMigrated: (title: string) => `${title} aggiornato nel carrello dopo una modifica al catalogo.`,
    invalidRemoved: "Un prodotto non piu disponibile e stato rimosso dal carrello.",
    addAdjusted: (title: string, addedQty: number, availableQty: number | null) =>
      availableQty != null
        ? `${title}: disponibili solo ${availableQty} pezzi. Aggiunti ${addedQty}.`
        : `${title}: quantita ridotta per disponibilita limitata.`,
    addRejected: (title: string) => `${title} non disponibile.`,
  },
  en: {
    lineReduced: (title: string, qty: number) => `${title} updated to ${qty} because of limited stock.`,
    lineRemoved: (title: string) => `${title} was removed from the cart because it is sold out.`,
    lineMigrated: (title: string) => `${title} was updated in the cart after a catalog change.`,
    invalidRemoved: "A product that is no longer available was removed from the cart.",
    addAdjusted: (title: string, addedQty: number, availableQty: number | null) =>
      availableQty != null
        ? `${title}: only ${availableQty} available. Added ${addedQty}.`
        : `${title}: quantity reduced because of limited stock.`,
    addRejected: (title: string) => `${title} is unavailable.`,
  },
  de: {
    lineReduced: (title: string, qty: number) => `${title} wurde wegen begrenztem Bestand auf ${qty} angepasst.`,
    lineRemoved: (title: string) => `${title} wurde aus dem Warenkorb entfernt, da es ausverkauft ist.`,
    lineMigrated: (title: string) => `${title} wurde nach einer Katalogaenderung im Warenkorb aktualisiert.`,
    invalidRemoved: "Ein nicht mehr verfuegbares Produkt wurde aus dem Warenkorb entfernt.",
    addAdjusted: (title: string, addedQty: number, availableQty: number | null) =>
      availableQty != null
        ? `${title}: nur ${availableQty} verfuegbar. ${addedQty} hinzugefuegt.`
        : `${title}: Menge wegen begrenztem Bestand reduziert.`,
    addRejected: (title: string) => `${title} ist nicht verfuegbar.`,
  },
  nl: {
    lineReduced: (title: string, qty: number) => `${title} aangepast naar ${qty} vanwege beperkte voorraad.`,
    lineRemoved: (title: string) => `${title} is uit de winkelwagen verwijderd omdat het is uitverkocht.`,
    lineMigrated: (title: string) => `${title} is na een cataloguswijziging bijgewerkt in de winkelwagen.`,
    invalidRemoved: "Een product dat niet meer beschikbaar is, is uit de winkelwagen verwijderd.",
    addAdjusted: (title: string, addedQty: number, availableQty: number | null) =>
      availableQty != null
        ? `${title}: nog maar ${availableQty} beschikbaar. ${addedQty} toegevoegd.`
        : `${title}: aantal verlaagd door beperkte voorraad.`,
    addRejected: (title: string) => `${title} is niet beschikbaar.`,
  },
  da: {
    lineReduced: (title: string, qty: number) => `${title} blev justeret til ${qty} pga. begraenset lager.`,
    lineRemoved: (title: string) => `${title} blev fjernet fra kurven, fordi varen er udsolgt.`,
    lineMigrated: (title: string) => `${title} blev opdateret i kurven efter en katalogaendring.`,
    invalidRemoved: "Et produkt, der ikke laengere er tilgaengeligt, blev fjernet fra kurven.",
    addAdjusted: (title: string, addedQty: number, availableQty: number | null) =>
      availableQty != null
        ? `${title}: kun ${availableQty} tilbage. ${addedQty} tilfoejet.`
        : `${title}: antallet blev reduceret pga. begraenset lager.`,
    addRejected: (title: string) => `${title} er ikke tilgaengelig.`,
  },
  no: {
    lineReduced: (title: string, qty: number) => `${title} ble justert til ${qty} paa grunn av begrenset lager.`,
    lineRemoved: (title: string) => `${title} ble fjernet fra handlekurven fordi varen er utsolgt.`,
    lineMigrated: (title: string) => `${title} ble oppdatert i handlekurven etter en katalogendring.`,
    invalidRemoved: "Et produkt som ikke lenger er tilgjengelig, ble fjernet fra handlekurven.",
    addAdjusted: (title: string, addedQty: number, availableQty: number | null) =>
      availableQty != null
        ? `${title}: bare ${availableQty} tilgjengelig. ${addedQty} lagt til.`
        : `${title}: antallet ble redusert paa grunn av begrenset lager.`,
    addRejected: (title: string) => `${title} er ikke tilgjengelig.`,
  },
} as const;

function productHref(product: Product | undefined, locale: string) {
  return product ? (getLocalizedProductHref(product, locale) as never) : "/shop";
}

const labels = {
  it: {
    shippingTitle: "Calcolo Spedizione Internazionale",
    shippingDesc: "Per spedizioni al di fuori dell'Italia, seleziona il paese e inserisci il CAP per calcolare i costi e sbloccare la cassa.",
    country: "Nazione di Destinazione",
    zipCode: "CAP / Codice Postale",
    zipPlaceholder: "Inserisci il CAP...",
    blockMessage: "Inserisci nazione e CAP per calcolare la spedizione e sbloccare il checkout.",
    zipError: "Inserisci un CAP valido.",
  },
  en: {
    shippingTitle: "Calculate International Shipping",
    shippingDesc: "For shipping outside Italy, please select your country and enter your ZIP code.",
    country: "Destination Country",
    zipCode: "ZIP / Postal Code",
    zipPlaceholder: "Enter ZIP code...",
    blockMessage: "Enter country and ZIP code to calculate shipping and unlock checkout.",
    zipError: "Please enter a valid ZIP code.",
  },
  de: {
    shippingTitle: "Internationalen Versand berechnen",
    shippingDesc: "Für den Versand außerhalb Italiens wählen Sie bitte Ihr Land aus und geben Sie Ihre Postleitzahl ein.",
    country: "Bestimmungsland",
    zipCode: "PLZ / Postleitzahl",
    zipPlaceholder: "PLZ eingeben...",
    blockMessage: "Geben Sie Land und PLZ ein, um den Versand zu berechnen und die Kasse freizugeben.",
    zipError: "Bitte geben Sie eine gültige PLZ ein.",
  },
  nl: {
    shippingTitle: "Internationale verzending berekenen",
    shippingDesc: "Selecteer uw land en voer uw postcode in voor verzending buiten Italië.",
    country: "Land van bestemming",
    zipCode: "Postcode",
    zipPlaceholder: "Postcode invoeren...",
    blockMessage: "Voer land en postcode in om de verzending te berekenen en het afrekenen te ontgrendelen.",
    zipError: "Voer een geldige postcode in.",
  },
  da: {
    shippingTitle: "Beregn international forsendelse",
    shippingDesc: "For forsendelse uden for Italien skal du vælge dit land og indtaste dit postnummer.",
    country: "Modtagerland",
    zipCode: "Postnummer",
    zipPlaceholder: "Indtast postnummer...",
    blockMessage: "Indtast land og postnummer for at beregne forsendelse og låse op for kassen.",
    zipError: "Indtast venligst et gyldigt postnummer.",
  },
  no: {
    shippingTitle: "Beregn internasjonal frakt",
    shippingDesc: "For frakt utenfor Italia, velg land og skriv inn postnummer.",
    country: "Destinasjonsland",
    zipCode: "Postnummer",
    zipPlaceholder: "Skriv inn postnummer...",
    blockMessage: "Skriv inn land og postnummer for å beregne frakt og låse opp kassen.",
    zipError: "Vennligst skriv inn et gyldig postnummer.",
  },
} as const;

const countries = [
  { code: "DE", flag: "de", name: { it: "Germania", en: "Germany", de: "Deutschland", nl: "Duitsland", da: "Tyskland", no: "Tyskland" } },
  { code: "NL", flag: "nl", name: { it: "Paesi Bassi", en: "Netherlands", de: "Niederlande", nl: "Nederland", da: "Nederlandene", no: "Nederland" } },
  { code: "DK", flag: "da", name: { it: "Danimarca", en: "Denmark", de: "Dänemark", nl: "Denemarken", da: "Danmark", no: "Danmark" } },
  { code: "NO", flag: "no", name: { it: "Norvegia", en: "Norway", de: "Norwegen", nl: "Noorwegen", da: "Norge", no: "Norge" } },
  { code: "US", flag: "us", name: { it: "Stati Uniti", en: "United States", de: "Vereinigte Staaten", nl: "Verenigde Staten", da: "USA", no: "USA" } },
  { code: "GB", flag: "en", name: { it: "Regno Unito (Inghilterra)", en: "United Kingdom", de: "Vereinigtes Königreich", nl: "Verenigd Koninkrijk", da: "Storbritannien", no: "Storbritannia" } },
  { code: "IT", flag: "it", name: { it: "Italia", en: "Italy", de: "Italien", nl: "Italië", da: "Italien", no: "Italia" } },
];

function getFlagLocale(country: string): string {
  const c = country.toLowerCase();
  if (c === "dk") return "da";
  return c;
}

export default function CartPageClient() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const cart = useCart();
  const { getAvailableQty, refreshAvailability, catalog, lastAvailabilityNotice, clearAvailabilityNotice } = cart;
  const statusText = cartStatusCopy[(locale as keyof typeof cartStatusCopy)] ?? cartStatusCopy.it;

  const [payError, setPayError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<PromoResult | null>(null);
  const [cartToast, setCartToast] = useState("");
  const [cartToastOpen, setCartToastOpen] = useState(false);
  const defaultCountry = useMemo(() => {
    if (locale === "de") return "DE";
    if (locale === "nl") return "NL";
    if (locale === "da") return "DK";
    if (locale === "no") return "NO";
    if (locale === "it") return "IT";
    if (locale === "en") return "GB"; // Default fallback for en
    return "GB";
  }, [locale]);

  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [zipCode, setZipCode] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCountryCode(defaultCountry);
  }, [defaultCountry]);

  useEffect(() => {
    setZipCode("");
  }, [countryCode]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [dropdownOpen]);

  const isShippingRequired = locale !== "it" && countryCode !== "IT";
  const isZipValid = !isShippingRequired || zipCode.trim().length >= 3;
  const isCountryNotAllowed = countryCode !== "IT";
  const isCheckoutBlocked = (isShippingRequired && !isZipValid) || isCountryNotAllowed;

  const [totals, setTotals] = useState<Totals>({
    items: [],
    subtotalCents: 0,
    discountCents: 0,
    vatCents: 0,
    shippingCents: 0,
    totalCents: 0,
  });

  const cartLines = cart.lines;
  const lines = useMemo(() => cartLines ?? [], [cartLines]);
  const empty = lines.length === 0;

  const recommendations = useMemo(() => {
    const inCartIds = lines.map((line) => line.productId);
    return catalog.filter((prod) => !inCartIds.includes(prod.id)).slice(0, 3);
  }, [catalog, lines]);

  const shippingRule = getShippingRule(countryCode);
  const remainingForFreeShipping = Math.max(0, shippingRule.freeShippingThresholdCents + 1 - totals.subtotalCents);

  const linesCount = lines.length;
  useEffect(() => {
    track({ type: "view_cart", data: { itemsCount: linesCount } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void refreshAvailability();
  }, [refreshAvailability]);

  const computed = useMemo(() => {
    return lines.map((line) => {
      const product = catalog.find((item) => item.id === line.productId);
      const variant = product?.variants.find((item) => item.id === line.variantId);

      const title = product?.title ?? t("common.product_fallback");
      const subtitle = variant?.label ?? product?.subtitle ?? "";
      const unitPriceCents = variant?.priceCents ?? 0;
      const imageSrc = variant?.imageSrc ?? product?.imageSrc ?? "";
      const imageAlt = variant?.imageAlt ?? product?.imageAlt ?? title;
      const href = productHref(product, locale);

      return {
        productId: line.productId,
        variantId: line.variantId,
        qty: line.qty,
        title,
        subtitle,
        unitPriceCents,
        lineTotalCents: unitPriceCents * line.qty,
        imageSrc,
        imageAlt,
        href,
        valid: Boolean(product && variant),
      };
    });
  }, [catalog, lines, locale, t]);

  const pricingItemsByKey = useMemo(() => {
    return new Map(
      totals.items.map((item) => [`${item.productId}:${item.variantId}`, item] as const)
    );
  }, [totals.items]);

  useEffect(() => {
    if (!lastAvailabilityNotice) return;
    const product = catalog.find((item) => item.id === lastAvailabilityNotice.productId);
    const variant = product?.variants.find((item) => item.id === lastAvailabilityNotice.variantId);
    const title = [product?.title, variant?.label].filter(Boolean).join(" - ") || t("common.product_fallback");
    const message =
      lastAvailabilityNotice.kind === "invalid_removed"
        ? statusText.invalidRemoved
        : lastAvailabilityNotice.kind === "migrated"
          ? statusText.lineMigrated(title)
          : lastAvailabilityNotice.kind === "removed"
            ? statusText.lineRemoved(title)
            : statusText.lineReduced(title, lastAvailabilityNotice.nextQty);

    setCartToast(message);
    setCartToastOpen(true);
    clearAvailabilityNotice();
  }, [catalog, clearAvailabilityNotice, lastAvailabilityNotice, statusText, t]);

  useEffect(() => {
    let cancelled = false;

    async function refreshTotals() {
      if (lines.length === 0) {
        if (!cancelled) {
          setTotals({
            items: [],
            subtotalCents: 0,
            discountCents: 0,
            vatCents: 0,
            shippingCents: 0,
            totalCents: 0,
          });
        }
        return;
      }

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: lines.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              qty: item.qty,
            })),
            promotionCode: promoApplied?.code,
            countryCode,
          }),
        });

        if (!response.ok) return;

        const data = (await response.json()) as Totals;
        if (!cancelled) {
          if (promoApplied?.code && !data.promotionApplied) {
            setPromoApplied(null);
          }
          setTotals({
            items: Array.isArray(data.items) ? data.items : [],
            subtotalCents: Number(data.subtotalCents ?? 0),
            discountCents: Number(data.discountCents ?? 0),
            vatCents: Number(data.vatCents ?? 0),
            shippingCents: Number(data.shippingCents ?? 0),
            totalCents: Number(data.totalCents ?? 0),
            promotionApplied: data.promotionApplied,
          });
        }
      } catch {
        // ignore
      }
    }

    refreshTotals();
    return () => {
      cancelled = true;
    };
  }, [lines, promoApplied, countryCode]);

  async function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;

    setPromoLoading(true);
    setPromoError(null);
    setPromoApplied(null);

    try {
      const response = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          items: lines.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
          })),
        }),
      });
      const data = await response.json();

      if (data.valid) {
        setPromoApplied({
          code: data.code,
          discountCents: data.discountCents,
          percent: data.percent,
          freeShipping: data.freeShipping,
        });
        setPromoInput("");
      } else {
        setPromoError(translateCartPromoError(data.reason, t));
      }
    } catch {
      setPromoError(t("errors.network_retry"));
    } finally {
      setPromoLoading(false);
    }
  }

  async function handleCheckout() {
    setPayError(null);
    setPayLoading(true);

    try {
      if (lines.length === 0) throw new Error(t("errors.empty_cart"));

      if (computed.some((line) => !line.valid)) {
        throw new Error(t("errors.invalid_products"));
      }

      track({
        type: "begin_checkout",
        data: {
          itemsCount: lines.length,
          totalCents: totals.totalCents,
        },
      });

      const idemKey = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
        .toString()
        .slice(0, 200);

      const orderBody: Record<string, unknown> = {
        items: lines.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          qty: item.qty,
        })),
        locale,
        countryCode,
      };
      if (locale !== "it") {
        orderBody.customer = {
          countryCode,
          postalCode: zipCode.trim(),
        };
      }
      if (promoApplied?.code) {
        orderBody.promotionCode = promoApplied.code;
      }

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
        throw new Error(translateCartCheckoutError(message || "Checkout non disponibile", t));
      }

      const data = await response.json().catch(() => ({}));
      const url = data?.checkoutUrl;

      if (typeof url === "string" && url.startsWith("http")) {
        window.location.href = url;
        return;
      }

      throw new Error(t("errors.missing_checkout_url"));
    } catch (error: unknown) {
      setPayError(translateCartCheckoutError((error as Error)?.message, t));
    } finally {
      setPayLoading(false);
    }
  }

  return (
    <>
      <ToggleMessage open={cartToastOpen} message={cartToast} onClose={() => setCartToastOpen(false)} />
      <section className="bg-zinc-50 min-h-[calc(100vh-80px)]" data-testid="cart-page">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.22em] text-zinc-500 uppercase">{t("page.eyebrow")}</div>
              <h1 className="mt-2 font-serif text-3xl tracking-[0.06em] text-zinc-900">{t("page.title")}</h1>
            </div>

            <Link href="/shop" className="text-sm tracking-[0.10em] text-zinc-600 hover:text-zinc-900">
              {t("page.back_to_shop")}
            </Link>
          </div>

          {empty ? (
            <div className="mt-10 flex flex-col gap-8">
              {/* Sleek Minimalist empty state banner */}
              <div className="rounded-[5px] border border-black/[0.05] bg-white p-8 text-center shadow-[0_8px_24px_rgba(24,24,27,0.04)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-50">
                  <ShoppingCart className="h-6 w-6 text-zinc-400" strokeWidth={1.5} />
                </div>
                <h2 className="mt-4 font-serif text-xl font-medium text-zinc-900">{t("page.empty_title")}</h2>
                <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                  {t("page.empty_desc")}
                </p>
                <Link 
                  href="/shop" 
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-[5px] bg-zinc-900 px-6 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-zinc-700 active:scale-95"
                >
                  {t("page.back_to_shop")}
                </Link>
              </div>

              {/* GORGEOUS QUICK PURCHASE CARDS FOR EMPTY STATE */}
              <div className="rounded-[5px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_24px_rgba(24,24,27,0.04)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 tracking-wider uppercase">
                      {t("page.bestsellers_title")}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {t("page.bestsellers_desc")}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-1.5 rounded-full border border-black/5 bg-zinc-50 px-2.5 py-1 text-[10px] text-zinc-600">
                    <span>{t("page.free_shipping_notice")}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {recommendations.map((prod) => {
                    const firstVariant = prod.variants[0];
                    const price = firstVariant?.priceCents ?? 0;
                    return (
                      <div 
                        key={prod.id} 
                        className="group relative flex flex-col h-full overflow-hidden rounded-[5px] border border-[#ede8e0] bg-white text-[#1f1a17] shadow-[0_2px_8px_rgba(31,26,23,0.18)] transition-all duration-300 hover:-translate-y-[4px] hover:shadow-[0_8px_20px_rgba(31,26,23,0.25)] transform-gpu"
                      >
                        {/* Immagine prodotto in risalto - aspetto verticale */}
                        <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-white flex items-center justify-center p-3">
                          <Link 
                            href={productHref(prod, locale)}
                            className="relative h-full w-full block bg-transparent"
                            aria-label={prod.title}
                          >
                            {prod.imageSrc ? (
                              <Image
                                src={prod.imageSrc}
                                alt={prod.imageAlt ?? prod.title}
                                fill
                                sizes="(min-width: 640px) 250px, 100vw"
                                className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="h-full w-full bg-transparent" />
                            )}
                          </Link>

                          {/* Badge sovrapposto, stile premium */}
                          {prod.badge && (
                            <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-[#d29b46] px-1.5 py-[3px] text-[8px] font-bold tracking-[0.08em] text-white uppercase z-10 shadow-sm">
                              {prod.badge}
                            </span>
                          )}
                        </div>

                        {/* Area Dettagli */}
                        <div className="flex flex-1 flex-col p-3.5 bg-white border-t border-[#f0ece6]">
                          <span className="text-[8px] font-semibold tracking-[0.12em] text-[#8a7c6e] uppercase">
                            {t("page.bestseller_badge")}
                          </span>

                          <Link 
                            href={productHref(prod, locale)}
                            className="mt-1 font-serif text-[0.95rem] font-semibold leading-[1.25] tracking-tight text-[#1f1a17] hover:text-[#8f6d4c] transition-colors line-clamp-2"
                          >
                            {prod.title}
                          </Link>

                          <div className="mt-auto pt-3">
                            <div className="flex items-baseline gap-1">
                              <span className="font-sans text-[1.15rem] font-bold tracking-tight text-[#1f1a17]">
                                {formatEUR(price)}
                              </span>
                              <span className="text-[9px] font-medium text-[#8a7c6e] lowercase">
                                {t("panel.plus_vat")}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={async () => {
                                if (!firstVariant) return;
                                track({
                                  type: "add_to_cart",
                                  productKey: prod.id,
                                  variantKey: firstVariant.id,
                                  data: {
                                    qty: 1,
                                    unitPriceCents: price,
                                    variantLabel: firstVariant.label,
                                    slug: prod.slug,
                                  },
                                  cartId: null,
                                });
                                const result = await cart.add({ productId: prod.id, variantId: firstVariant.id, qty: 1 });
                                const title = [prod.title, firstVariant.label].filter(Boolean).join(" - ");
                                if (result.status === "rejected") {
                                  setCartToast(statusText.addRejected(title));
                                  setCartToastOpen(true);
                                  return;
                                }
                                if (result.status === "adjusted") {
                                  setCartToast(statusText.addAdjusted(title, result.addedQty, result.availableQty));
                                  setCartToastOpen(true);
                                }
                              }}
                              className="mt-3 w-full inline-flex h-8 items-center justify-center rounded-[5px] bg-emerald-600 px-3 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors active:scale-95 cursor-pointer shadow-sm"
                            >
                              {t("page.buy_now")}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* TOP PROMOTION BANNER FOR INTERNATIONAL LOCALES */}
              {locale !== "it" && (
                <div className="mt-8 rounded-[5px] border border-emerald-600/15 bg-emerald-50/50 p-4 text-xs font-semibold text-emerald-900 tracking-wide flex items-start gap-3 shadow-[0_4px_12px_rgba(16,185,129,0.03)]">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-serif text-[10px] select-none">
                    %
                  </div>
                  <p className="leading-relaxed">
                    {countryCode === "US" ? (
                      locale === "de" ? "Aktion: Flatrate-Versand ab 500 € Einkaufswert: 60 € für die USA." :
                      locale === "nl" ? "Promo: Flat-rate verzending vanaf 500 € aankoop: 60 € voor de VS." :
                      locale === "da" ? "Kampagne: Fast fragtpris over 500 € køb: 60 € for USA." :
                      locale === "no" ? "Kampanje: Flat-rate frakt over 500 € kjøp: 60 € for USA." :
                      "PROMO: Flat rate shipping for orders over 500 €: 60 € for United States."
                    ) : (
                      locale === "de" ? "Aktion: Flatrate-Versand ab 500 € Einkaufswert: 30 € für Europa." :
                      locale === "nl" ? "Promo: Flat-rate verzending vanaf 500 € aankoop: 30 € voor Europa." :
                      locale === "da" ? "Kampagne: Fast fragtpris over 500 € køb: 30 € for Europa." :
                      locale === "no" ? "Kampanje: Flat-rate frakt over 500 € kjøp: 30 € for Europa." :
                      "PROMO: Flat rate shipping for orders over 500 €: 30 € for Europe."
                    )}
                  </p>
                </div>
              )}

              <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
                <div className="flex flex-col gap-5 md:gap-6">
                  {/* SHIPPING CALCULATOR SECTION FOR INTERNATIONAL LOCALES */}
                  {locale !== "it" && (
                    <div className="rounded-[5px] border border-[#132c1c]/10 bg-[#132c1c]/[0.01] p-5 shadow-[0_4px_12px_rgba(19,44,28,0.02)]">
                      <h2 className="font-serif text-base font-semibold text-zinc-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#132c1c]" strokeWidth={1.5} />
                        {labels[locale as keyof typeof labels]?.shippingTitle || labels.en.shippingTitle}
                      </h2>
                      <p className="mt-1 text-xs text-zinc-500 max-w-xl">
                        {labels[locale as keyof typeof labels]?.shippingDesc || labels.en.shippingDesc}
                      </p>
                    
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
                      {/* Custom Flag Dropdown */}
                      <div className="w-full sm:w-64" ref={dropdownRef}>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] mb-1.5">
                          {labels[locale as keyof typeof labels]?.country || labels.en.country}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full h-10 flex items-center justify-between rounded-[5px] border border-black/10 bg-white px-3 text-xs tracking-wider font-semibold text-zinc-800 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-black/20"
                          >
                            <span className="flex items-center gap-2">
                              {countryCode && (
                                <FlagIcon 
                                  locale={getFlagLocale(countryCode)} 
                                  className="h-3 w-5 rounded-[1px] shadow-sm" 
                                />
                              )}
                              <span>
                                {countries.find(c => c.code === countryCode)?.name[locale as keyof typeof countries[0]["name"]] || 
                                 countries.find(c => c.code === countryCode)?.name.en || countryCode}
                              </span>
                            </span>
                            <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", dropdownOpen && "rotate-180")} />
                          </button>
                          
                          {dropdownOpen && (
                            <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-[5px] border border-stone-200 bg-white shadow-lg">
                              {countries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setCountryCode(c.code);
                                    setDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "w-full h-10 flex items-center gap-2 px-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors border-b border-zinc-50 last:border-0",
                                    c.code === countryCode 
                                      ? "bg-emerald-50 text-emerald-700" 
                                      : "text-zinc-700 hover:bg-zinc-50"
                                  )}
                                >
                                  <FlagIcon locale={c.flag} className="h-2.5 w-4 shrink-0 rounded-[1px] shadow-sm" />
                                  <span>{c.name[locale as keyof typeof c["name"]] || c.name.en}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ZIP / CAP Input */}
                      {countryCode !== "IT" && (
                        <div className="flex-1">
                          <label htmlFor="shipping-zip" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] mb-1.5">
                            {labels[locale as keyof typeof labels]?.zipCode || labels.en.zipCode}
                          </label>
                          <input
                            id="shipping-zip"
                            type="text"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder={labels[locale as keyof typeof labels]?.zipPlaceholder || labels.en.zipPlaceholder}
                            className="w-full h-10 rounded-[5px] border border-black/10 bg-white px-3 text-xs font-semibold text-zinc-800 placeholder-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                      )}
                    </div>
                    
                    {isCheckoutBlocked && (
                      <div className="mt-3 text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                        {labels[locale as keyof typeof labels]?.blockMessage || labels.en.blockMessage}
                      </div>
                    )}
                  </div>
                )}

                {computed.map((line) => (
                  (() => {
                    const pricingItem = pricingItemsByKey.get(`${line.productId}:${line.variantId}`);
                    const displayUnitPriceCents = pricingItem?.unitPriceCents ?? line.unitPriceCents;
                    const displayLineTotalCents = pricingItem?.lineSubtotalCents ?? line.lineTotalCents;
                    const maxQty = getAvailableQty(line.productId, line.variantId) ?? 99;
                    return (
                      <div
                        key={`${line.productId}:${line.variantId}`}
                        className="flex gap-4 rounded-[5px] border border-black/[0.06] bg-white p-5 shadow-[0_8px_24px_rgba(24,24,27,0.06)] sm:gap-6"
                      >
                        <Link
                          href={line.href}
                          className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[5px] bg-transparent sm:h-32 sm:w-28"
                          aria-label={t("page.open_product", { title: line.title })}
                        >
                          {line.imageSrc ? (
                            <Image
                              src={line.imageSrc}
                              alt={line.imageAlt}
                              fill
                              sizes="(max-width: 640px) 96px, 112px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="h-full w-full bg-transparent" />
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link href={line.href} className="truncate font-serif text-[17px] text-zinc-900 hover:underline sm:text-xl">
                                {line.title}
                              </Link>
                              {line.subtitle ? (
                                <div className="mt-1 truncate text-[11px] tracking-[0.18em] text-zinc-500 sm:text-[13px]">
                                  {line.subtitle}
                                </div>
                              ) : null}
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-medium tracking-[0.08em] text-zinc-900 sm:text-base">
                                {formatEUR(displayLineTotalCents)}
                              </div>
                              <div className="mt-1 text-[10px] text-zinc-400 sm:text-xs sm:text-zinc-500">
                                {t("common.per_item_with_price", { price: formatEUR(displayUnitPriceCents) })}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6">
                            <div className="flex h-9 items-center overflow-hidden rounded-[5px] border border-black/10 bg-white shadow-sm sm:h-10">
                              <button
                                type="button"
                                className="h-9 w-9 text-zinc-700 transition-colors hover:bg-black/5 disabled:opacity-30 sm:h-10 sm:w-10 border-r border-black/5"
                                onClick={() => {
                                  const nextQty = Math.max(1, line.qty - 1);
                                  const delta = nextQty - line.qty;

                                  track({
                                    type: "update_cart_quantity",
                                    productKey: line.productId,
                                    variantKey: line.variantId,
                                    data: {
                                      fromQty: line.qty,
                                      toQty: nextQty,
                                      delta,
                                      unitPriceCents: line.unitPriceCents,
                                    },
                                  });

                                  cart.setQty(line.productId, line.variantId, nextQty);
                                }}
                                disabled={line.qty <= 1}
                                aria-label={t("actions.decrease_quantity")}
                              >
                                -
                              </button>

                              <div className="flex h-9 w-10 items-center justify-center bg-transparent text-center text-[13px] font-medium text-zinc-900 sm:h-10 sm:w-12 sm:text-sm">
                                {line.qty}
                              </div>

                              <button
                                type="button"
                                className="h-9 w-9 text-zinc-700 transition-colors hover:bg-black/5 disabled:opacity-30 sm:h-10 sm:w-10 border-l border-black/5"
                                onClick={() => {
                                  const nextQty = Math.min(maxQty, line.qty + 1);
                                  const delta = nextQty - line.qty;

                                  track({
                                    type: "update_cart_quantity",
                                    productKey: line.productId,
                                    variantKey: line.variantId,
                                    data: {
                                      fromQty: line.qty,
                                      toQty: nextQty,
                                      delta,
                                      unitPriceCents: line.unitPriceCents,
                                    },
                                  });

                                  cart.setQty(line.productId, line.variantId, nextQty);
                                }}
                                disabled={line.qty >= maxQty}
                                aria-label={t("actions.increase_quantity")}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              className="inline-flex shrink-0 items-center gap-2 rounded-[5px] bg-red-50 px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-red-600 transition-colors hover:bg-red-100 sm:px-4 sm:py-2 sm:text-[11px]"
                              onClick={() => {
                                track({
                                  type: "remove_from_cart",
                                  productKey: line.productId,
                                  variantKey: line.variantId,
                                  data: {
                                    qty: line.qty,
                                    unitPriceCents: line.unitPriceCents,
                                    lineTotalCents: line.lineTotalCents,
                                  },
                                });

                                cart.remove(line.productId, line.variantId);
                              }}
                              aria-label={t("page.remove_from_cart_aria")}
                            >
                              {t("common.remove")}
                            </button>
                          </div>

                          {!line.valid ? <div className="mt-3 text-xs text-red-600">{t("page.invalid_line")}</div> : null}
                        </div>
                      </div>
                    );
                  })()
                ))}

                <div className="mt-2 flex items-center justify-between gap-3 px-2 py-2">
                  <button
                    type="button"
                    className="text-xs tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-900 sm:text-sm"
                    onClick={() => {
                      track({
                        type: "clear_cart",
                        data: {
                          itemsCount: lines.length,
                          totalCents: totals.totalCents,
                        },
                      });

                      cart.clear();
                    }}
                  >
                    {t("page.clear_cart")}
                  </button>

                  <Link href="/shop" className="text-xs tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-900 sm:text-sm">
                    {t("common.continue_shopping")} →
                  </Link>
                </div>

              </div>

              <aside className="h-fit rounded-[5px] border border-black/[0.06] bg-white p-6 shadow-[0_8px_24px_rgba(24,24,27,0.06)] lg:sticky lg:top-28">
                <div className="text-sm tracking-[0.12em] text-zinc-700">{t("page.summary")}</div>



                {/* PROGRESS BAR FOR FREE SHIPPING / FLAT RATE OVERRIDE */}
                {totals.subtotalCents > 0 && (
                  <div className="mt-4 rounded-[5px] border border-zinc-100 bg-zinc-50/50 p-3.5 text-xs text-zinc-600">
                    {locale === "it" ? (
                      remainingForFreeShipping > 0 ? (
                        <div>
                          <div className="flex items-center justify-between font-medium text-zinc-800">
                            <span>{t("page.free_shipping_progress", { amount: formatEUR(remainingForFreeShipping) })}</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                            <div 
                              className="h-full bg-emerald-600 transition-all duration-500 ease-out"
                              style={{ width: `${Math.min(100, (totals.subtotalCents / shippingRule.freeShippingThresholdCents) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 font-medium text-emerald-600">
                          <span>{t("page.free_shipping_unlocked")}</span>
                        </div>
                      )
                    ) : (
                      (() => {
                        const thresholdCents = 50000; // 500.00 EUR
                        const remainingCents = Math.max(0, thresholdCents - totals.subtotalCents);
                        const progressPct = Math.min(100, (totals.subtotalCents / thresholdCents) * 100);
                        const flatCostEUR = countryCode === "US" ? "60 €" : "30 €";
                        
                        return remainingCents > 0 ? (
                          <div>
                            <div className="flex flex-col gap-1.5">
                              <span className="font-semibold text-zinc-800">
                                {locale === "de" ? `Noch ${formatEUR(remainingCents)} bis zum Flatrate-Versand (${flatCostEUR})` :
                                 locale === "nl" ? `Nog ${formatEUR(remainingCents)} tot flat-rate verzending (${flatCostEUR})` :
                                 locale === "da" ? `Mangler ${formatEUR(remainingCents)} for fast fragtpris (${flatCostEUR})` :
                                 locale === "no" ? `Mangler ${formatEUR(remainingCents)} for flat-rate frakt (${flatCostEUR})` :
                                 `Add ${formatEUR(remainingCents)} more to unlock flat rate shipping (${flatCostEUR})`}
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                              <div 
                                className="h-full bg-emerald-600 transition-all duration-500 ease-out"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-semibold text-emerald-600">
                            <span>
                              {locale === "de" ? `Flatrate-Versand freigeschaltet! (${flatCostEUR})` :
                               locale === "nl" ? `Flat-rate verzending ontgrendeld! (${flatCostEUR})` :
                               locale === "da" ? `Fast fragtpris låst op! (${flatCostEUR})` :
                               locale === "no" ? `Flat-rate frakt låst opp! (${flatCostEUR})` :
                               `Flat rate shipping unlocked! (${flatCostEUR})`}
                            </span>
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}

                <div className="mt-5">
                  {promoApplied ? (
                    <div className="flex items-center justify-between rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span className="text-sm font-medium">{promoApplied.code}</span>
                        {promoApplied.percent ? <span className="text-xs text-emerald-600">-{promoApplied.percent}%</span> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPromoApplied(null)}
                        className="text-xs text-emerald-700 underline underline-offset-2 transition-colors hover:text-red-600"
                      >
                        {t("common.remove")}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" strokeWidth={1.5} />
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(event) => {
                              setPromoInput(event.target.value.toUpperCase());
                              setPromoError(null);
                            }}
                            onKeyDown={(event) => event.key === "Enter" && handleApplyPromo()}
                            placeholder={t("common.discount_code_placeholder")}
                            className="h-10 w-full rounded-[5px] border border-black/10 bg-white pl-9 pr-3 text-base text-zinc-900 placeholder-zinc-400 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            disabled={promoLoading}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoLoading || !promoInput.trim()}
                          className="h-10 whitespace-nowrap rounded-[5px] bg-zinc-900 px-4 text-xs tracking-[0.12em] text-white transition-colors hover:bg-zinc-700 disabled:opacity-40"
                        >
                          {promoLoading ? "..." : t("common.apply")}
                        </button>
                      </div>
                      {promoError ? <p className="mt-2 text-xs text-red-600">{promoError}</p> : null}
                    </>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="text-[13px]">{t("common.subtotal")}</span>
                    <span className="text-sm text-zinc-900">{formatEUR(totals.subtotalCents)}</span>
                  </div>

                  {totals.discountCents > 0 ? (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span className="text-[13px]">
                        {t("common.discount_with_code", { code: promoApplied?.code ?? totals.promotionApplied?.code ?? "" })}
                      </span>
                      <span className="text-sm font-medium">-{formatEUR(totals.discountCents)}</span>
                    </div>
                  ) : null}


                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="text-[13px]">{t("common.shipping")}</span>
                    <span className="text-sm text-zinc-900">{formatEUR(totals.shippingCents)}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="font-medium tracking-[0.08em] text-zinc-900">{t("common.total")}</span>
                    <span className="text-lg font-medium tracking-[0.08em] text-zinc-900">{formatEUR(totals.totalCents)}</span>
                  </div>
                </div>

                {payError ? (
                  <div className="mt-4 text-sm text-red-600" data-testid="cart-pay-error">
                    {payError}
                  </div>
                ) : null}

                <button
                  type="button"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[5px] bg-emerald-600 px-4 text-sm font-medium tracking-[0.10em] text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 disabled:opacity-50"
                  onClick={handleCheckout}
                  disabled={payLoading || empty || isCheckoutBlocked}
                >
                  {payLoading ? t("page.opening_checkout") : t("page.go_to_checkout")}
                </button>

                {isCheckoutBlocked && (
                  <p className="mt-2 text-center text-xs text-amber-600 font-semibold">
                    {isCountryNotAllowed ? (
                      locale === "de" ? "Käufe in diesem Land sind vorübergehend nicht möglich." :
                      locale === "nl" ? "Aankopen zijn tijdelijk niet beschikbaar in het geselecteerde land." :
                      locale === "da" ? "Køb er midlertidigt utilgængelige i det valgte land." :
                      locale === "no" ? "Kjøp er for øyeblikket ikke tilgjengelig i det valgte landet." :
                      locale === "it" ? "Acquisti momentaneamente non disponibili nella nazione selezionata." :
                      "Purchases temporarily unavailable in the selected country."
                    ) : (
                      labels[locale as keyof typeof labels]?.blockMessage || labels.en.blockMessage
                    )}
                  </p>
                )}

                <p className="mt-6 text-center text-[11px] text-zinc-400">
                  {t("page.secure_payment")}
                  <br />
                  {t("page.email_confirmation")}
                </p>
              </aside>

              {recommendations.length > 0 && (
                <div className="rounded-[5px] border border-black/[0.06] bg-white p-6 shadow-[0_8px_24px_rgba(24,24,27,0.06)] lg:col-start-1">
                  <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase">
                    {t("page.you_may_also_like")}
                  </h3>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {recommendations.map((prod) => {
                      const firstVariant = prod.variants[0];
                      const price = firstVariant?.priceCents ?? 0;
                      return (
                        <div
                          key={prod.id}
                          className="flex flex-row items-center gap-4 rounded-[5px] border border-zinc-100 bg-zinc-50/50 p-4 transition-colors hover:bg-zinc-50 sm:flex-col"
                        >
                          <Link
                            href={productHref(prod, locale)}
                            className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[5px] bg-transparent"
                            aria-label={prod.title}
                          >
                            {prod.imageSrc ? (
                              <Image
                                src={prod.imageSrc}
                                alt={prod.imageAlt ?? prod.title}
                                fill
                                sizes="80px"
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="h-full w-full bg-transparent" />
                            )}
                          </Link>

                          <div className="flex min-w-0 flex-1 flex-col text-left sm:w-full sm:text-center">
                            <Link href={productHref(prod, locale)} className="truncate text-sm font-medium text-zinc-800 hover:underline">
                              {prod.title}
                            </Link>
                            <div className="mt-1 text-xs font-medium text-zinc-500">
                              {formatEUR(price)}
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                if (!firstVariant) return;
                                track({
                                  type: "add_to_cart",
                                  productKey: prod.id,
                                  variantKey: firstVariant.id,
                                  data: {
                                    qty: 1,
                                    unitPriceCents: price,
                                    variantLabel: firstVariant.label,
                                    slug: prod.slug,
                                  },
                                });
                                const result = await cart.add({ productId: prod.id, variantId: firstVariant.id, qty: 1 });
                                const title = [prod.title, firstVariant.label].filter(Boolean).join(" - ");
                                if (result.status === "rejected") {
                                  setCartToast(statusText.addRejected(title));
                                  setCartToastOpen(true);
                                  return;
                                }
                                if (result.status === "adjusted") {
                                  setCartToast(statusText.addAdjusted(title, result.addedQty, result.availableQty));
                                  setCartToastOpen(true);
                                }
                              }}
                              className="mt-3 inline-flex h-8 items-center justify-center rounded-[5px] bg-emerald-600 px-3 text-xs font-medium tracking-wide text-white transition-colors hover:bg-emerald-700 active:scale-95 cursor-pointer"
                            >
                              {t("page.add_more")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
