"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

type CartButtonProps = {
  /** icona custom (es: nuova icona SVG) */
  icon?: React.ReactNode;
  /** className extra per il bottone (es: h-12 w-12 p-3 ...) */
  className?: string;
  /** aria-label override (opzionale) */
  ariaLabel?: string;
};

export default function CartButton({
  icon,
  className = "",
  ariaLabel = "Apri carrello",
}: CartButtonProps) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  // ✅ evita hydration mismatch: renderizza badge solo dopo mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ESC close + lock scroll when drawer is open
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Se l'utente passa className con h-/w-/size- non imponiamo h-10 w-10
  const shouldApplyDefaultSize = useMemo(() => {
    const s = ` ${className} `;
    const hasH = /\sh-\d+/.test(s) || /\sh-\[/.test(s);
    const hasW = /\sw-\d+/.test(s) || /\sw-\[/.test(s);
    const hasSize = /\ssize-\d+/.test(s) || /\ssize-\[/.test(s);
    return !(hasH || hasW || hasSize);
  }, [className]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-testid="nav-cart-button"
        className={[
          "relative inline-flex items-center justify-center rounded-full",
          "border border-black/10 bg-white hover:bg-zinc-50",
          "dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900",
          shouldApplyDefaultSize ? "h-10 w-10" : "",
          className,
        ].join(" ")}
        aria-label={ariaLabel}
      >
        {/* ✅ icona nuova se passata, altrimenti emoji originale */}
        {icon ? icon : <span className="text-lg">🛒</span>}

        {/* ✅ badge sempre in DOM (robusto per Playwright), visibile solo se count>0 */}
        <span
          data-testid="nav-cart-count"
          className={[
            "absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px]",
            "bg-zinc-900 text-white dark:bg-white dark:text-black",
            mounted && count > 0 ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          {mounted ? count : 0}
        </span>
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
