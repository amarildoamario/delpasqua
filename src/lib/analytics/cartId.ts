// src/lib/analytics/cartId.ts
"use client";

const COOKIE_NAME = "cart_id";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
}

function safeUuid(): string {
  // crypto.randomUUID è perfetto, ma fallbacko
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `cid_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

/**
 * Ritorna un cartId persistente (cookie + localStorage di backup).
 * - First-party
 * - stabile
 * - perfetto per funnel add_to_cart -> purchase
 */
export function getOrCreateCartId(): string {
  // 1) cookie
  const fromCookie = readCookie(COOKIE_NAME);
  if (fromCookie) return fromCookie;

  // 2) localStorage (backup)
  if (typeof window !== "undefined") {
    const fromLs = window.localStorage.getItem(COOKIE_NAME);
    if (fromLs) {
      writeCookie(COOKIE_NAME, fromLs);
      return fromLs;
    }
  }

  // 3) crea
  const id = safeUuid();
  writeCookie(COOKIE_NAME, id);
  if (typeof window !== "undefined") window.localStorage.setItem(COOKIE_NAME, id);
  return id;
}
