"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/client/adminFetch";

export default function OrderAttentionControl({
  orderId,
  acknowledged,
}: {
  orderId: string;
  acknowledged: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(acknowledged);
  const [loading, setLoading] = useState(false);

  async function toggleAcknowledgement() {
    if (loading) return;
    const previous = checked;
    const next = !previous;
    setChecked(next);
    setLoading(true);
    try {
      const response = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attentionAcknowledged: next }),
      });
      if (!response.ok) {
        setChecked(previous);
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <label
      className="inline-flex items-center gap-2"
      title={checked ? "Ordine controllato: togli la spunta per riattivare l'allerta" : "Spunta per segnare questo ordine come controllato"}
    >
      <span aria-label="Attenzione" role="img" className="text-lg">⚠️</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={loading}
        onChange={toggleAcknowledgement}
        className={[
          "h-5 w-5 rounded border-2 disabled:opacity-60",
          checked
            ? "border-emerald-500 text-emerald-600 focus:ring-emerald-500"
            : "border-amber-400 text-amber-500 focus:ring-amber-400",
        ].join(" ")}
        aria-label={checked ? "Controllo completato" : "Allerta attiva: spunta per considerarla controllata"}
      />
    </label>
  );
}
