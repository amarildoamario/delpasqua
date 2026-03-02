"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/client/adminFetch";
import { RefreshCw } from "lucide-react";

export default function OutboxRetryButton({
  outboxId,
  status,
}: {
  outboxId: string;
  status: "pending" | "processing" | "done" | "failed" | string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => status === "done" || loading, [status, loading]);

  async function onRetry() {
    if (disabled) return;

    setLoading(true);
    try {
      const r = await adminFetch("/api/admin/outbox/retry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ outboxId }),
      });

      // anche se fallisce, vogliamo refresh per vedere stato/errore aggiornati
      await r.json().catch(() => null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onRetry}
      disabled={disabled}
      title={status === "done" ? "Già DONE" : "Retry"}
      className={[
        "inline-flex items-center justify-center rounded-lg p-2",
        "border border-neutral-200 bg-white text-neutral-700",
        "hover:bg-neutral-50",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <RefreshCw className={["h-4 w-4", loading ? "animate-spin" : ""].join(" ")} />
    </button>
  );
}
