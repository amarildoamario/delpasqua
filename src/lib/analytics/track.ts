"use client";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

type Track = {
  type: string;
  path?: string | null;
  productKey?: string | null;
  variantKey?: string | null;
  cartId?: string | null;
  orderId?: string | null;
  data?: unknown;
};

function getEnv() {
  const v = (process.env.NEXT_PUBLIC_APP_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) as string | undefined;
  if (v) return v;
  return process.env.NODE_ENV === "production" ? "prod" : "dev";
}

function isInternalClient() {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname.toLowerCase();
  const internalCookie = getCookie("internal");
  return internalCookie === "1" || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

function readAnalyticsMeta(): Record<string, any> {
  try {
    const raw = sessionStorage.getItem("analytics_meta_v1");
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

function mergeMeta(data: unknown) {
  const base = (data && typeof data === "object" && !Array.isArray(data)) ? (data as any) : {};
  const meta = (base.meta && typeof base.meta === "object" && !Array.isArray(base.meta)) ? base.meta : {};

  const env = getEnv();
  const isInternal = isInternalClient();

  // playwright/automation: navigator.webdriver spesso true
  const isBot = typeof navigator !== "undefined" && (navigator as any).webdriver === true;

  const stored = readAnalyticsMeta();

  return {
    ...base,
    meta: {
      schema: "analytics-meta-v1",
      env,
      isInternal,
      source: isBot ? "playwright" : "web",
      trafficType: isBot ? "bot" : isInternal ? "internal" : "real",
      ...stored, // utm, landingPath, ecc.
      ...meta,   // se caller passa meta custom, ha priorità
    },
  };
}

export function track(e: Track) {
  const visitorId = getCookie("v_id");
  const sessionId = getCookie("s_id");
  if (!visitorId || !sessionId) return;

  const env = getEnv();
  const isInternal = isInternalClient();

  const payload = [
    {
      type: e.type,
      visitorId,
      sessionId,
      env,
      isInternal,
      path: e.path ?? (typeof window !== "undefined" ? window.location.pathname : null),
      productKey: e.productKey ?? null,
      variantKey: e.variantKey ?? null,
      cartId: e.cartId ?? null,
      orderId: e.orderId ?? null,
      data: mergeMeta(e.data),
    },
  ];

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const ok = navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    if (ok) return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
