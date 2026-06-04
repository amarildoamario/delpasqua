"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/generated/prisma/client";
import { adminFetch } from "@/lib/client/adminFetch";
import { Truck, RotateCcw, Loader2 } from "lucide-react";

export default function ShipToggleButton({
  orderId,
  shipped,
  status,
}: {
  orderId: string;
  shipped: boolean;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canShip = !shipped && status === "IN_PREPARAZIONE";
  const canUnship = shipped && status === "SPEDITO";
  const enabled = canShip || canUnship;

  async function toggle() {
    if (!enabled || loading) return;
    setLoading(true);
    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ shipped: !shipped }),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("Ship toggle failed:", r.status, t);
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!enabled || loading}
      className={[
        "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs",
        shipped
          ? "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 disabled:hover:bg-white"
          : "bg-neutral-900 text-white hover:opacity-90 disabled:opacity-60",
        !enabled || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
      title={
        canShip
          ? "Segna come spedito"
          : canUnship
          ? "Annulla spedizione"
          : shipped
          ? "Puoi annullare solo se lo stato è SPEDITO"
          : "Puoi spedire solo se lo stato è IN_PREPARAZIONE"
      }
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : shipped ? (
        <>
          <RotateCcw className="h-3.5 w-3.5 text-neutral-500" />
          Annulla Spedizione
        </>
      ) : (
        <>
          <Truck className="h-3.5 w-3.5" />
          Spedisci
        </>
      )}
    </button>
  );
}
