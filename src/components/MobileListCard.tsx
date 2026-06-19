"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useCart } from "@/context/CartContext";
import { getOrCreateCartId } from "@/lib/analytics/cartId";
import { track } from "@/lib/analytics/track";
import ToggleMessage from "@/components/ui/ToggleMessage";
import type { ProductCardProduct } from "@/components/ProductCard";

export type MobileListCardProduct = ProductCardProduct & {
  formatsList?: string;
};

const MERCH_BADGES: Record<string, Record<string, string>> = {
  PIU_VENDUTO: {
    it: "Più venduto",
    en: "Best seller",
    de: "Bestseller",
    nl: "Bestseller",
    da: "Bestseller",
    no: "Bestseller",
  },
  IN_OFFERTA: {
    it: "In offerta",
    en: "Special offer",
    de: "Im Angebot",
    nl: "Aanbieding",
    da: "Tilbud",
    no: "Tilbud",
  },
  NOVITA: {
    it: "Novità",
    en: "New",
    de: "Neu",
    nl: "Nieuw",
    da: "Nyhed",
    no: "Nyhet",
  },
  HOT: {
    it: "Hot",
    en: "Hot",
    de: "Hot",
    nl: "Hot",
    da: "Hot",
    no: "Hot",
  },
  IN_HOME: {
    it: "In home",
    en: "Featured",
    de: "Empfohlen",
    nl: "Aanbevolen",
    da: "Udvalgt",
    no: "Utvalgt",
  },
};

export default function MobileListCard({
  product,
  onClick,
  locale,
  copy,
}: {
  product: MobileListCardProduct;
  onClick?: () => void;
  locale: string;
  copy: { from: string; price: string; [key: string]: string };
}) {
  const { add } = useCart();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(`wishlist::${product.id}`) === "true";
    } catch {
      return false;
    }
  });

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      localStorage.setItem(`wishlist::${product.id}`, String(next));
    } catch {
      // Ignored
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.defaultVariantId) return;

    const result = await add({
      productId: product.id,
      variantId: product.defaultVariantId,
      qty: 1,
    });

    track({
      type: "add_to_cart",
      cartId: getOrCreateCartId(),
      productKey: product.id,
      variantKey: product.defaultVariantId,
      data: {
        qty: 1,
        unitPriceCents: product.priceCents ?? null,
        slug: product.slug,
      },
    });

    if (result.status === "rejected") {
      setToastMsg(locale === "it" ? "Prodotto esaurito." : "Product out of stock.");
      setToastOpen(true);
      return;
    }

    if (result.status === "adjusted") {
      setToastMsg(
        locale === "it"
          ? `Disponibili solo ${result.availableQty} pezzi. Carrello aggiornato.`
          : `Only ${result.availableQty} items available. Cart updated.`
      );
      setToastOpen(true);
      return;
    }

    const toastTitle = product.variantLabel ? `${product.title} ${product.variantLabel}` : product.title;
    setToastMsg(locale === "it" ? `${toastTitle} aggiunto al carrello` : `${toastTitle} added to cart`);
    setToastOpen(true);
  };

  const hrefBase = { pathname: `/shop/${product.slug}` as const };
  const href = product.defaultVariantId
    ? { ...hrefBase, query: { v: product.defaultVariantId } }
    : hrefBase;

  const isWine = product.id === "vino" || product.slug.includes("vino");

  const categoryLabel = isWine
    ? locale === "it"
      ? "Vino della tenuta"
      : "Estate wine"
    : locale === "it"
    ? "Olio extravergine di oliva"
    : "Extra virgin olive oil";

  const formatCaption =
    product.variantsCount && product.variantsCount > 1
      ? locale === "it"
        ? `Disponibile in ${product.variantsCount} formati`
        : `Available in ${product.variantsCount} formats`
      : product.variantLabel
      ? product.variantLabel
      : locale === "it"
      ? "Formato singolo"
      : "Single format";

  const spec1Label = isWine
    ? locale === "it"
      ? "Vitigno Sangiovese"
      : "Sangiovese grape"
    : product.id.includes("tartufo") || product.id.includes("peperoncino")
    ? locale === "it"
      ? "Base EVO"
      : "EVO base"
    : locale === "it"
    ? "Estratto a freddo"
    : locale === "en"
    ? "Cold extracted"
    : locale === "de"
    ? "Kalt gepresst"
    : locale === "nl"
    ? "Koud geperst"
    : locale === "da"
    ? "Koldpresset"
    : "Kaldpresset";

  const spec2Label =
    product.variantsCount && product.variantsCount > 1
      ? product.formatsList
        ? product.formatsList
        : isWine
        ? "500 ML • 1 L"
        : "500 ML • 750 ML • 1 L"
      : product.variantLabel
      ? product.variantLabel.toUpperCase()
      : "500 ML";

  const spec1Icon = <IconOlive className="h-3.5 w-3.5 text-[#8B7355] shrink-0" />;
  const spec2Icon = <IconFormats className="h-3.5 w-3.5 text-[#8B7355] shrink-0" />;

  const descriptionText =
    product.subtitle ||
    (locale === "it"
      ? "Eccellente prodotto toscano di qualità artigianale."
      : "Excellent Tuscan product of artisanal quality.");

  return (
    <>
      <ToggleMessage open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      <div className="relative flex flex-col bg-white border border-[#ede8e0] rounded-[5px] p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)] text-[#1f1a17] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <Link
          href={href}
          onClick={onClick}
          aria-label={product.title}
          className="absolute inset-0 z-10 block opacity-0"
        />

        {/* Parte Superiore: Foto (Sinistra) e Dettagli (Destra) */}
        <div className="flex items-stretch gap-3">
          {/* Foto Prodotto Ingrandita */}
          <div className="relative w-[145px] min-w-[145px] h-[175px] bg-[#fdfaf7] rounded-[5px] overflow-hidden shrink-0 border border-[#f0eae0]/30 flex items-center justify-center">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt || product.title}
              fill
              sizes="145px"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-1.5 left-1.5 bg-[#bda589] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-wider z-20">
                {product.badge}
              </span>
            )}
            {product.merchBadge && (
              <span className="absolute top-1.5 right-1.5 border border-[#ddd7ce] bg-white/92 text-[#1f1a17] text-[8px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-wider z-20 shadow-sm backdrop-blur-sm">
                {(() => {
                  const raw = product.merchBadge || "";
                  const upper = raw.toUpperCase();
                  return MERCH_BADGES[upper]
                    ? (MERCH_BADGES[upper][locale] ?? MERCH_BADGES[upper].it)
                    : raw;
                })()}
              </span>
            )}
          </div>

          {/* Dettagli Prodotto */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="text-[8px] xs:text-[9px] font-semibold text-neutral-400 tracking-wider uppercase leading-none">
                {categoryLabel}
              </div>
              <h3 className="font-serif text-[1.05rem] font-semibold text-[#1f1a17] mt-1.5 leading-snug line-clamp-2">
                {product.title}
              </h3>
              <div className="text-[8px] xs:text-[9px] font-bold text-[#8a7258] mt-1.5 uppercase tracking-wider leading-none">
                {formatCaption}
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed line-clamp-2">
                {descriptionText}
              </p>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-100/80">
              <div className="flex items-center gap-1 min-w-0">
                {spec1Icon}
                <span className="text-[8px] font-bold text-[#8a7258] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                  {spec1Label}
                </span>
              </div>
              <div className="h-3 w-px bg-neutral-200 shrink-0" />
              <div className="flex items-center gap-1 min-w-0">
                {spec2Icon}
                <span className="text-[8px] font-bold text-[#8a7258] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                  {spec2Label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Parte Inferiore: Riga Separata per Prezzo e Carrello */}
        <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100/80 mt-3 relative z-20">
          {/* Prezzo */}
          <div className="flex items-baseline gap-1.5">
            {product.variantsCount && product.variantsCount > 1 && (
              <span className="text-[8px] xs:text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                {copy.from}
              </span>
            )}
            <span className="text-base font-extrabold text-[#1f1a17]">
              {product.priceLabel}
            </span>
            <span className="text-[9px] text-neutral-400">{locale === "it" ? "IVA incl." : "VAT incl."}</span>
          </div>

          {/* Azioni: Cuore + Bottone Aggiungi */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <button
              onClick={handleWishlistToggle}
              className="text-[#8B7355] hover:text-[#722F37] transition-colors p-1 flex items-center justify-center cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors ${
                  isFavorite ? "fill-[#722F37] text-[#722F37]" : "text-neutral-400"
                }`}
              />
            </button>

            {/* Aggiungi al Carrello */}
            <button
              onClick={handleAddToCart}
              className="h-8 rounded-[5px] bg-[#132c1c] hover:bg-[#1a3d27] text-white px-3.5 py-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm shadow-[#132c1c]/10 cursor-pointer"
              aria-label="Carrello"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{locale === "it" ? "Aggiungi" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function IconOlive({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22C12 22 12 13 8 9C6.5 7.5 4 7 4 7C4 7 4.5 9.5 6 11C10 15 12 22 12 22Z" />
      <path d="M12 15C12 15 15 11 17 9.5C18.5 8.5 20 8 20 8C20 8 19.5 9.5 18.5 11C17 13 12 17 12 17Z" />
      <path d="M12 11C12 11 9.5 7.5 9 6C8.5 5 8 3 8 3C8 3 9.5 3.5 10.5 4C12 5.5 12 11 12 11Z" />
    </svg>
  );
}

function IconFormats({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 20V9c0-1 .8-2 1.8-2h1.4C10.2 7 11 8 11 9v11" />
      <path d="M7.5 7V4.5h2V7" />
      <path d="M13 20v-7c0-.8.6-1.5 1.5-1.5h1C16.4 11.5 17 12.2 17 13v7" />
      <path d="M14.2 11.5V9.5h1.6v2" />
      <path d="M3 20h18" />
    </svg>
  );
}
