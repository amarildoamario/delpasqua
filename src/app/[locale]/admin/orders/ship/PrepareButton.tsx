"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/generated/prisma/client";
import { adminFetch } from "@/lib/client/adminFetch";

export default function PrepareButton({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);

  const canPrepare = status === "PAGATO" && !prepared;
  if (!canPrepare) return null; // Only show if it's PAGATO

  async function prepare() {
    if (!canPrepare || loading) return;
    setLoading(true);
    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "IN_PREPARAZIONE" }),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("Prepare status patch failed:", r.status, t);
      } else {
        setPrepared(true);
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={prepare}
      disabled={loading}
      className={[
        "rounded-xl px-3 py-2 text-xs font-semibold transition border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 disabled:opacity-60",
        loading ? "cursor-not-allowed opacity-60" : "",
      ].join(" ")}
      title="Inizia la preparazione dell'ordine"
    >
      {loading ? "…" : "Prepara"}
    </button>
  );
}
