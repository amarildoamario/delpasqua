"use client";

import { track } from "@/lib/analytics/track";
import { getOrCreateCartId } from "@/lib/analytics/cartId";

export type CartLine = { productId: string; variantId: string; qty: number };

type GoToCassaResult =
  | { ok: true }
  | { ok: false; message: string; status?: number };

function safeUuid(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }

  // fallback migliore (anche su iOS http)
  try {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
      const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  } catch {
    // ignore
  }

  return `id_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export async function goToCassa(
  lines: CartLine[],
  options?: { promotionCode?: string }
): Promise<GoToCassaResult> {
  if (!lines?.length) return { ok: false, message: "Il carrello è vuoto." };

  try {
    const idempotencyKey = safeUuid();
    const cartId = getOrCreateCartId();

    track({ type: "begin_checkout", cartId, data: { linesCount: lines.length } });
    track({ type: "checkout_click", cartId, data: { itemsCount: lines.length } });

    const body: Record<string, unknown> = { items: lines, cartId };
    if (options?.promotionCode) {
      body.promotionCode = options.promotionCode.trim().toUpperCase();
    }

    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let serverMsg = "";
      try {
        const j = await res.json();
        serverMsg = typeof j?.message === "string" ? j.message : "";
      } catch { }

      if (res.status === 409) {
        return { ok: false, message: serverMsg || "Prodotto non disponibile.", status: 409 };
      }

      const msg =
        res.status === 429
          ? "Troppe richieste. Riprova tra poco."
          : res.status === 400
            ? "Carrello non valido."
            : serverMsg || "Errore durante la creazione dell'ordine.";

      return { ok: false, message: msg, status: res.status };
    }

    const data = (await res.json()) as { orderId: string; checkoutUrl: string };
    if (!data?.checkoutUrl) return { ok: false, message: "Risposta server non valida." };

    window.location.href = data.checkoutUrl;
    return { ok: true };
  } catch {
    return { ok: false, message: "Errore di rete." };
  }

}

