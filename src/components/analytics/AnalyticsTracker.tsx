"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === "undefined") return;

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Max-Age=${maxAgeSec}; Path=/; SameSite=Lax${secure}`;
}

function uuid() {
  // crypto.randomUUID è supportato su browser moderni
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type TrackEvent = {
  type: string;
  visitorId: string;
  sessionId: string;

  path?: string | null;
  referrer?: string | null;
  pageId?: string | null;
  durationMs?: number | null;

  productKey?: string | null;
  variantKey?: string | null;

  cartId?: string | null;
  orderId?: string | null;

  // qualità dato / segmentazione
  env?: string | null;
  isInternal?: boolean | null;

  data?: unknown;
};

function getEnv() {
  // in Next i NEXT_PUBLIC_* sono disponibili client-side
  const v = (process.env.NEXT_PUBLIC_APP_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) as
    | string
    | undefined;
  if (v) return v;
  // fallback
  return process.env.NODE_ENV === "production" ? "prod" : "dev";
}

function isInternalClient() {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname.toLowerCase();
  const internalCookie = getCookie("internal");
  // Se vuoi escluderti in modo facile: document.cookie = "internal=1; Path=/; Max-Age=31536000"
  return internalCookie === "1" || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

function pickUtm(sp: URLSearchParams | null) {
  if (!sp) return null;
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = sp.get(k);
    if (v) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

function storeMetaOnce(pathWithQuery: string, utm: Record<string, string> | null) {
  try {
    const key = "analytics_meta_v1";
    const raw = sessionStorage.getItem(key);
    if (raw) return; // già settato

    sessionStorage.setItem(
      key,
      JSON.stringify({
        landingPath: pathWithQuery,
        utm: utm ?? null,
        firstSeenAt: new Date().toISOString(),
      })
    );
  } catch {}
}

function send(events: TrackEvent[]) {
  const payload = JSON.stringify(events);

  // beacon è perfetto per unload
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator && navigator.sendBeacon) {
    const ok = navigator.sendBeacon(
      "/api/analytics",
      new Blob([payload], { type: "application/json" })
    );
    if (ok) return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

type Ids = { visitorId: string; sessionId: string };

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const sp = useSearchParams();

  const pathWithQuery = useMemo(() => {
    const q = sp?.toString();
    return q ? `${pathname}?${q}` : pathname;
  }, [pathname, sp]);

  const env = useMemo(() => getEnv(), []);
  const internal = useMemo(() => isInternalClient(), []);
  const utm = useMemo(() => pickUtm(sp ?? null), [sp]);

  // ✅ ids calcolati SOLO in client effect (mai in render)
  const [ids, setIds] = useState<Ids | null>(null);

  // page state (mai inizializzati con funzioni impure in render)
  const pageIdRef = useRef<string>("");
  const startRef = useRef<number>(0);

  // prev path in memoria (evitiamo window.__analytics_prev_path)
  const prevPathRef = useRef<string | null>(null);

  // evita doppio leave (beforeunload + visibilitychange + cleanup)
  const sentLeaveRef = useRef(false);

  useEffect(() => {
    const VISITOR = "v_id";
    const SESSION = "s_id";

    let v = getCookie(VISITOR);
    if (!v) {
      v = uuid();
      setCookie(VISITOR, v, 365 * 24 * 60 * 60);
    }

    let s = getCookie(SESSION);
    if (!s) s = uuid();

    // session 30 minuti (si rinnova ad ogni page view)
    setCookie(SESSION, s, 30 * 60);

    setIds({ visitorId: v, sessionId: s });
  }, []);

  useEffect(() => {
    if (!ids) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    sentLeaveRef.current = false;

    // chiudi eventuale pagina precedente (navigazione interna)
    if (prevPathRef.current && pageIdRef.current && startRef.current) {
      send([
        {
          type: "page_leave",
          visitorId: ids.visitorId,
          sessionId: ids.sessionId,
          env,
          isInternal: internal,
          path: prevPathRef.current,
          referrer: document.referrer || null,
          pageId: pageIdRef.current,
          durationMs: Date.now() - startRef.current,
        },
      ]);
    }

    // nuova view
    pageIdRef.current = uuid();
    startRef.current = Date.now();
    prevPathRef.current = pathWithQuery;
    storeMetaOnce(pathWithQuery, utm);

    // rinnova session cookie su page view (sliding expiration)
    setCookie("s_id", ids.sessionId, 30 * 60);

    send([
      {
        type: "page_view",
        visitorId: ids.visitorId,
        sessionId: ids.sessionId,
        path: pathWithQuery,
        referrer: document.referrer || null,
        pageId: pageIdRef.current,

        env,
        isInternal: internal,

        data: {
          utm,
          title: document.title || null,
        },
      },
    ]);

    // heartbeat: 15s finché visibile
    let alive = true;
    const interval = window.setInterval(() => {
      if (!alive) return;
      if (document.visibilityState !== "visible") return;

      send([
        {
          type: "page_heartbeat",
          visitorId: ids.visitorId,
          sessionId: ids.sessionId,
          path: pathWithQuery,
          pageId: pageIdRef.current,

          env,
          isInternal: internal,
        },
      ]);
    }, 15000);

    const onLeave = () => {
      if (sentLeaveRef.current) return;
      sentLeaveRef.current = true;

      alive = false;
      window.clearInterval(interval);

      send([
        {
          type: "page_leave",
          visitorId: ids.visitorId,
          sessionId: ids.sessionId,
          path: pathWithQuery,
          referrer: document.referrer || null,
          pageId: pageIdRef.current,
          durationMs: Date.now() - startRef.current,

          env,
          isInternal: internal,

          data: {
            utm,
            title: document.title || null,
          },
        },
      ]);
    };

    const onVisChange = () => {
      if (document.visibilityState === "hidden") onLeave();
    };

    window.addEventListener("beforeunload", onLeave);
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      alive = false;
      window.clearInterval(interval);
      window.removeEventListener("beforeunload", onLeave);
      document.removeEventListener("visibilitychange", onVisChange);
      // NOTA: non chiamiamo onLeave qui per evitare doppioni durante navigate
      // (il leave della pagina precedente lo gestiamo all'inizio dell'effetto successivo)
    };
  }, [ids, pathWithQuery]);

  return null;
}
