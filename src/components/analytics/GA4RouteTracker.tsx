"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GA4RouteTracker() {
  const GA_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    if (!window.gtag) return;

    const q = sp?.toString();
    const page_path = q ? `${pathname}?${q}` : pathname;

    // Questo produce la page_view corretta in GA4 in SPA
    window.gtag("config", GA_ID, { page_path });
  }, [GA_ID, pathname, sp]);

  return null;
}