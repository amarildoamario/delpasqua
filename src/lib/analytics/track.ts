"use client";

import { getOrCreateCartId } from "./cartId";
import { ANALYTICS_TYPES, analyticsPath, isAdminPath, type AnalyticsEvent } from "./events";
import { AnalyticsQueue, ANALYTICS_BATCH_SIZE, ANALYTICS_FLUSH_MS } from "./queue";
import { browserAnalyticsExcluded } from "./exclusion";

type Track = Partial<Omit<AnalyticsEvent, "type" | "visitorId" | "sessionId">> & { type: string };
const STORAGE_KEY = "analytics_queue_v2";
let queue: AnalyticsQueue | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight = false;
let retryMs = ANALYTICS_FLUSH_MS;
let lastBeaconBody = "";
let lastBeaconAt = 0;

export function analyticsCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = document.cookie.split("; ").find((part) => part.startsWith(`${name}=`));
  try { return value ? decodeURIComponent(value.slice(name.length + 1)) : null; }
  catch { return null; }
}

function setCookie(name: string, value: string, seconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${seconds}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

export function analyticsAllowed() {
  if (typeof window === "undefined") return false;
  if (browserAnalyticsExcluded()) return false;
  const mode = new URLSearchParams(location.search).get("test_mode");
  if (mode === "1") setCookie("internal", "1", 86400);
  if (mode === "0") setCookie("internal", "", 0);
  return mode !== "1" && analyticsCookie("internal") !== "1" &&
    analyticsCookie("analytics_consent") !== "0" && !isAdminPath(location.pathname);
}

function persist() {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(queue?.snapshot() ?? [])); } catch { /* Memory fallback. */ }
}

function schedule() {
  if (timer || !queue?.snapshot().length) return;
  timer = setTimeout(() => { timer = undefined; void flushAnalytics(); }, retryMs);
}

function getQueue() {
  if (!queue) {
    let saved: unknown;
    try { saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { saved = []; }
    queue = new AnalyticsQueue(saved);
    window.addEventListener("online", () => { void flushAnalytics(); });
    const flushOnExit = () => queueMicrotask(() => { void flushAnalytics(true); });
    window.addEventListener("pagehide", flushOnExit);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushOnExit();
      else schedule();
    });
  }
  return queue;
}

export async function flushAnalytics(beacon = false) {
  if (!queue) return;
  if (browserAnalyticsExcluded() || analyticsCookie("analytics_consent") === "0" || analyticsCookie("internal") === "1") {
    queue.clear(); persist(); return;
  }
  const batch = queue.batch();
  if (!batch.length || !navigator.onLine) return;
  const body = JSON.stringify(batch);
  if (beacon && body === lastBeaconBody && Date.now() - lastBeaconAt < 5000) return;
  if (beacon && navigator.sendBeacon?.("/api/analytics/", new Blob([body], { type: "application/json" }))) {
    // Beacon has no acknowledgement. Retain IDs for safe replay on next load.
    lastBeaconBody = body; lastBeaconAt = Date.now();
    persist(); return;
  }
  if (inFlight) return;
  inFlight = true;
  try {
    const response = await fetch("/api/analytics/", {
      method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true,
    });
    if (response.ok || response.status === 400 || response.status === 413) {
      queue.acknowledge(batch);
      retryMs = ANALYTICS_FLUSH_MS;
      persist();
    } else retryMs = Math.min(retryMs * 2, 120_000);
  } catch { retryMs = Math.min(retryMs * 2, 120_000); }
  finally { inFlight = false; schedule(); }
}

function identity() {
  let visitorId = analyticsCookie("v_id");
  if (!visitorId || visitorId.length < 6 || visitorId.length > 128) { visitorId = crypto.randomUUID(); setCookie("v_id", visitorId, 365 * 86400); }
  let sessionId = analyticsCookie("s_id");
  if (!sessionId || sessionId.length < 6 || sessionId.length > 128) sessionId = crypto.randomUUID();
  setCookie("s_id", sessionId, 1800);
  return { visitorId, sessionId };
}

export function track(event: Track) {
  if (!analyticsAllowed() || !ANALYTICS_TYPES.includes(event.type as AnalyticsEvent["type"])) return;
  if (event.productKey === "prodotto-test") return;
  const data = event.data && typeof event.data === "object" ? event.data as Record<string, unknown> : {};
  if (data.isTest === true) return;
  const numbers: Record<string, number> = {};
  for (const key of ["qty", "unitPriceCents", "totalCents", "itemsCount", "fromQty", "toQty", "delta", "resultsCount"]) {
    if (typeof data[key] === "number" && Number.isFinite(data[key])) numbers[key] = data[key];
  }
  const env = location.hostname === "delpasqua.com" || location.hostname === "www.delpasqua.com" ? "prod" : "dev";
  const ids = identity();
  let referrer = document.referrer ? analyticsPath(document.referrer) : null;
  try {
    const saved = JSON.parse(sessionStorage.getItem("analytics_entry_v1") ?? "null");
    if (saved?.sessionId === ids.sessionId && (typeof saved.referrer === "string" || saved.referrer === null)) referrer = saved.referrer;
    else sessionStorage.setItem("analytics_entry_v1", JSON.stringify({ sessionId: ids.sessionId, referrer }));
  } catch { /* Attribution still works for the current document. */ }
  let cartId = event.cartId;
  try { cartId ||= getOrCreateCartId(); } catch { /* Storage can be disabled. */ }
  const item: AnalyticsEvent = {
    ...event, ...ids, type: event.type as AnalyticsEvent["type"],
    eventId: event.eventId ?? crypto.randomUUID(), occurredAt: event.occurredAt ?? new Date().toISOString(),
    path: analyticsPath(event.path ?? location.pathname),
    referrer,
    cartId, env, isInternal: env !== "prod", data: numbers,
  };
  const pending = getQueue();
  pending.add(item);
  // The existing report distinguishes checkout clicks from carts starting checkout.
  if (event.type === "begin_checkout") pending.add({ ...item, type: "checkout_click", eventId: crypto.randomUUID() });
  persist(); schedule();
  if (pending.snapshot().length >= ANALYTICS_BATCH_SIZE) void flushAnalytics();
}
