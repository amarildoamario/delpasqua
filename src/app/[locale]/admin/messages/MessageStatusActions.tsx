"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, Mail, MailOpen } from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";
import type { ContactMessageStatus } from "@/generated/prisma";

export default function MessageStatusActions({
  id,
  status,
}: {
  id: string;
  status: ContactMessageStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<ContactMessageStatus | null>(null);

  async function setStatus(nextStatus: ContactMessageStatus) {
    if (loading || status === nextStatus) return;
    setLoading(nextStatus);

    try {
      const response = await adminFetch(`/api/admin/contact-messages/${id}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error("Contact message status update failed", response.status, text);
        window.alert("Errore aggiornamento messaggio");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Errore imprevisto");
    } finally {
      setLoading(null);
    }
  }

  const busy = Boolean(loading);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setStatus("READ")}
        disabled={busy || status === "READ"}
        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        <MailOpen className="h-3.5 w-3.5" />
        {loading === "READ" ? "..." : "Letto"}
      </button>

      <button
        type="button"
        onClick={() => setStatus("UNREAD")}
        disabled={busy || status === "UNREAD"}
        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
      >
        <Mail className="h-3.5 w-3.5" />
        {loading === "UNREAD" ? "..." : "Non letto"}
      </button>

      <button
        type="button"
        onClick={() => setStatus("ARCHIVED")}
        disabled={busy || status === "ARCHIVED"}
        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
      >
        <Archive className="h-3.5 w-3.5" />
        {loading === "ARCHIVED" ? "..." : "Archivia"}
      </button>
    </div>
  );
}
