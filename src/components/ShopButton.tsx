"use client";

import Link from "next/link";
import { Store } from "lucide-react";

type ShopButtonProps = {
  /** className extra per il bottone */
  className?: string;
  /** Se true, mostra solo su mobile (md:hidden) */
  mobileOnly?: boolean;
};

export default function ShopButton({
  className = "",
  mobileOnly = false,
}: ShopButtonProps) {
  const baseClasses = mobileOnly ? "md:hidden" : "";
  
  return (
    <div className={baseClasses}>
      <Link
        href="/shop"
        className={[
          "relative inline-flex items-center justify-center rounded-full",
          "border border-black/10 bg-white hover:bg-zinc-50",
          "dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900",
          "h-10 w-10",
          className,
        ].join(" ")}
        aria-label="Vai allo shop"
        title="Shop"
      >
        <Store className="h-5 w-5 text-gray-700 dark:text-gray-200" strokeWidth={1.5} />
      </Link>
    </div>
  );
}