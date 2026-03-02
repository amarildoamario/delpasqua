"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/generated/prisma/client";
import { adminFetch } from "@/lib/client/adminFetch";

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

  const canShip = !shipped && status === "PREPARING";
  const canUnship = shipped && status === "SHIPPED";
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
        "rounded-xl px-3 py-2 text-xs font-semibold transition",
        shipped
          ? "border border-neutral-200/70 bg-white text-neutral-900 hover:bg-neutral-50 disabled:hover:bg-white"
          : "bg-neutral-900 text-white hover:opacity-90 disabled:hover:opacity-60",
        !enabled || loading ? "cursor-not-allowed opacity-60" : "",
      ].join(" ")}
      title={
        canShip
          ? "Segna come spedito"
          : canUnship
          ? "Annulla spedizione"
          : shipped
          ? "Puoi annullare solo se lo stato è SHIPPED"
          : "Puoi spedire solo se lo stato è PREPARING"
      }
    >
      {loading ? "…" : shipped ? "Annulla" : "Spedisci"}
    </button>
  );
}
