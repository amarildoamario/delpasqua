"use client";

import { useEffect } from "react";
import { Check, ShoppingBag, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";
import { Link } from "@/i18n/routing";

const adjustedTemplates: Record<string, (available: number | null, added: number) => string> = {
  it: (available, added) =>
    available != null
      ? `Disponibili solo ${available} pezzi. Aggiunti ${added}.`
      : `Aggiunti ${added}. Quantità ridotta per disponibilità.`,
  en: (available, added) =>
    available != null
      ? `Only ${available} items available. Added ${added}.`
      : `Added ${added}. Quantity reduced based on availability.`,
  de: (available, added) =>
    available != null
      ? `Nur ${available} Stück verfügbar. ${added} hinzugefügt.`
      : `${added} hinzugefügt. Menge angepasst.`,
  nl: (available, added) =>
    available != null
      ? `Nog maar ${available} beschikbaar. ${added} toegevoegd.`
      : `${added} toegevoegd. Aantal aangepast.`,
  da: (available, added) =>
    available != null
      ? `Kun ${available} tilbage. ${added} tilføjet.`
      : `${added} tilføjet. Antal justeret.`,
  no: (available, added) =>
    available != null
      ? `Bare ${available} tilgjengelig. ${added} lagt til.`
      : `${added} lagt til. Antall justert.`,
  es: (available, added) =>
    available != null
      ? `Solo ${available} disponibles. ${added} añadidos.`
      : `${added} añadidos. Cantidad ajustada.`,
  fr: (available, added) =>
    available != null
      ? `Seulement ${available} disponibles. ${added} ajoutés.`
      : `${added} ajoutés. Quantité ajustée.`,
};

export default function GlobalCartToast() {
  const { lastCartToast, clearCartToast } = useCart();
  const tCart = useTranslations("Cart");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  useEffect(() => {
    if (!lastCartToast) return;
    const id = window.setTimeout(clearCartToast, 6000);
    return () => window.clearTimeout(id);
  }, [lastCartToast, clearCartToast]);

  if (!lastCartToast) return null;

  const baseTitle = lastCartToast.variantLabel
    ? `${lastCartToast.productTitle} — ${lastCartToast.variantLabel}`
    : lastCartToast.productTitle;
  const qtySuffix = lastCartToast.addedQty > 1 ? ` (×${lastCartToast.addedQty})` : "";
  const adjustedFn = adjustedTemplates[locale] ?? adjustedTemplates.en;

  return (
    <div className="fixed inset-x-0 top-3 sm:top-4 z-[9999] px-3 sm:px-4 pointer-events-none">
      <div
        key={lastCartToast.id}
        role="status"
        aria-live="polite"
        className="pointer-events-auto mx-auto flex w-full max-w-md sm:max-w-lg items-center gap-2.5 sm:gap-3 rounded-2xl border border-[#2a5439] bg-[#132c1c]/95 px-3.5 py-3 text-white shadow-[0_16px_36px_rgba(19,44,28,0.34)] backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-xs">
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300 leading-none">
            {tCart("panel.added_to_cart_toast")}
          </div>
          <div className="mt-1 truncate text-xs sm:text-sm font-semibold text-white leading-snug">
            {baseTitle}
            {qtySuffix}
          </div>
          {lastCartToast.status === "adjusted" ? (
            <div className="mt-0.5 text-[11px] text-amber-200 leading-tight">
              {adjustedFn(lastCartToast.availableQty, lastCartToast.addedQty)}
            </div>
          ) : null}
        </div>

        <Link
          href="/cart"
          onClick={clearCartToast}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/20 transition-colors"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{tCommon("navbar.cart")}</span>
        </Link>

        <button
          type="button"
          onClick={clearCartToast}
          aria-label={tCart("panel.close_toast_aria")}
          title={tCart("panel.close_toast_aria")}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/85 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
