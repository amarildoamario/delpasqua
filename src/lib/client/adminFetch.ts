"use client";

/**
 * P0.07b CSRF client helper.
 * Reads admin_csrf cookie (non httpOnly) and sends it as x-csrf-token.
 */

export function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const parts = document.cookie.split(/;\s*/g);
  for (const p of parts) {
    const i = p.indexOf("=");
    if (i <= 0) continue;
    const k = p.slice(0, i).trim();
    if (k !== name) continue;
    return decodeURIComponent(p.slice(i + 1));
  }
  return "";
}

export function adminCsrfToken() {
  return getCookie("admin_csrf");
}

export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const csrf = adminCsrfToken();
  const headers = new Headers(init.headers || {});
  if (csrf) headers.set("x-csrf-token", csrf);
  return fetch(input, { ...init, headers });
}
