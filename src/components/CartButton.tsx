"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

type CartButtonProps = {
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  mobileOnly?: boolean;
  badgeColor?: "default" | "green";
};

export default function CartButton({
  icon,
  className = "",
  ariaLabel = "Apri carrello",
  mobileOnly = false,
  badgeColor = "default",
}: CartButtonProps) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { queueMicrotask(() => setMounted(true)); }, []);

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

  const shouldApplyDefaultSize = useMemo(() => {
    const s = ` ${className}`;
    const hasH = /\sh-\d+/.test(s) || /\sh-\[/.test(s);
    const hasW = /\sw-\d+/.test(s) || /\sw-\[/.test(s);
    const hasSize = /\ssize-\d+/.test(s) || /\ssize-\[/.test(s);
    return !(hasH || hasW || hasSize);
  }, [className]);

  const badgeClasses =
    badgeColor === "green"
      ? "bg-emerald-500 text-white"
      : "bg-zinc-900 text-white";

  return (
    <div className={mobileOnly ? "md:hidden" : ""}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          data-testid="nav-cart-button"
          className={[
            "relative inline-flex items-center justify-center rounded-full",
            "border border-black/10 bg-white hover:bg-zinc-50",
            shouldApplyDefaultSize ? "h-10 w-10" : className,
          ].join(" ")}
          aria-label={ariaLabel}
        >
          {icon ? icon : <span className="text-lg">🛒</span>}

          <span
            data-testid="nav-cart-count"
            className={[
              "absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-medium",
              badgeClasses,
              mounted && count > 0
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none",
              "transition-all duration-200",
            ].join(" ")}
          >
            {mounted ? (count > 99 ? "99+" : count) : 0}
          </span>
        </button>

        <CartDrawer open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}