"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/generated/prisma/client";
import { adminFetch } from "@/lib/client/adminFetch";

export default function ShipWithTracking({
  orderId,
  status,
  shipped,
}: {
  orderId: string;
  status: OrderStatus;
  shipped: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState("");

  const canPrepare = status === "PAID";
  const canShip = status === "PREPARING" && !shipped;
  const canUnship = status === "SHIPPED" && shipped;

  async function setPreparing() {
    if (!canPrepare || loading) return;
    setLoading(true);
    try {
      // ✅ FIX: /status è PATCH, non POST
      const r = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "PREPARING" }),
      });

      if (!r.ok) console.error("Set PREPARING failed", r.status, await r.text().catch(() => ""));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function shipToggle(nextShipped: boolean) {
    if (loading) return;
    if (nextShipped && !canShip) return;
    if (!nextShipped && !canUnship) return;

    setLoading(true);
    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          shipped: nextShipped,
          trackingCode: tracking.trim() || undefined,
        }),
      });
      if (!r.ok) console.error("Ship toggle failed", r.status, await r.text().catch(() => ""));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-neutral-200/60">
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">
        Operazioni
      </div>

      {status === "PREPARING" ? (
        <div className="mt-2">
          <label className="block text-[11px] text-neutral-500">
            Tracking (opzionale)
          </label>
          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="es. SDA123..."
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/10"
            disabled={loading}
          />
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={setPreparing}
          disabled={!canPrepare || loading}
          className={[
            "rounded-xl px-3 py-2 text-xs font-semibold transition",
            "border border-neutral-200/70 bg-white text-neutral-900 hover:bg-neutral-50",
            !canPrepare || loading ? "cursor-not-allowed opacity-60" : "",
          ].join(" ")}
          title={canPrepare ? "Porta in PREPARING" : "Disponibile solo se lo stato è PAID"}
        >
          Prepara
        </button>

        {!shipped ? (
          <button
            type="button"
            onClick={() => shipToggle(true)}
            disabled={!canShip || loading}
            className={[
              "rounded-xl px-3 py-2 text-xs font-semibold transition",
              "bg-neutral-900 text-white hover:opacity-90",
              !canShip || loading ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
            title={canShip ? "Segna come spedito" : "Disponibile solo se lo stato è PREPARING"}
          >
            Spedisci
          </button>
        ) : (
          <button
            type="button"
            onClick={() => shipToggle(false)}
            disabled={!canUnship || loading}
            className={[
              "rounded-xl px-3 py-2 text-xs font-semibold transition",
              "border border-neutral-200/70 bg-white text-neutral-900 hover:bg-neutral-50",
              !canUnship || loading ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
            title={canUnship ? "Annulla spedizione" : "Disponibile solo se lo stato è SHIPPED"}
          >
            Annulla
          </button>
        )}
      </div>
    </div>
  );
}
