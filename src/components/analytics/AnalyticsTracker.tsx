"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsAllowed, track } from "@/lib/analytics/track";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!analyticsAllowed()) return;
    const pageId = crypto.randomUUID();
    let activeMs = 0;
    let visibleSince = document.visibilityState === "visible" ? performance.now() : null;
    track({ type: "page_view", eventId: `view-${pageId}`, pageId, path: pathname });

    const leave = () => {
      if (visibleSince !== null) activeMs += performance.now() - visibleSince;
      visibleSince = null;
      track({
        type: "page_leave", eventId: `leave-${pageId}`, occurredAt: new Date().toISOString(), pageId,
        path: pathname, durationMs: Math.min(Math.round(activeMs), 20 * 60_000),
      });
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") leave();
      else visibleSince ??= performance.now();
    };
    const pagehide = () => { leave(); };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", pagehide);
    return () => {
      leave();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", pagehide);
    };
  }, [pathname]);

  return null;
}
