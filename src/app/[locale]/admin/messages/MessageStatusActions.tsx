"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, Mail, MailOpen, Reply, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";
import type { ContactMessageStatus } from "@/generated/prisma";

export default function MessageStatusActions({
  id,
  status,
  email,
  subject,
}: {
  id: string;
  status: ContactMessageStatus;
  email?: string;
  subject?: string;
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
        window.alert("Errore durante l'aggiornamento dello stato del messaggio.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Errore imprevisto.");
    } finally {
      setLoading(null);
    }
  }

  const busy = Boolean(loading);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Tasto Rispondi via email */}
      {email && (
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject || "Contatto Del Pasqua"}`)}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
          title="Rispondi via email"
        >
          <Reply className="h-3.5 w-3.5 text-blue-600" />
          <span>Rispondi</span>
        </a>
      )}

      {/* Segna come Letto */}
      {status === "UNREAD" && (
        <button
          type="button"
          onClick={() => setStatus("READ")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {loading === "READ" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MailOpen className="h-3.5 w-3.5" />
          )}
          <span>Segna Letto</span>
        </button>
      )}

      {/* Segna come Non Letto */}
      {status === "READ" && (
        <button
          type="button"
          onClick={() => setStatus("UNREAD")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {loading === "UNREAD" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Mail className="h-3.5 w-3.5 text-amber-600" />
          )}
          <span>Non letto</span>
        </button>
      )}

      {/* Archivia */}
      {status !== "ARCHIVED" ? (
        <button
          type="button"
          onClick={() => setStatus("ARCHIVED")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          title="Archivia messaggio"
        >
          {loading === "ARCHIVED" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Archive className="h-3.5 w-3.5 text-neutral-500" />
          )}
          <span>Archivia</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setStatus("READ")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          title="Ripristina nei letti"
        >
          <MailOpen className="h-3.5 w-3.5 text-neutral-500" />
          <span>Ripristina</span>
        </button>
      )}
    </div>
  );
}
