"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ orderId }: { orderId: string }) {
  return (
    <button
      type="button"
      onClick={() => window.open(`/api/admin/print-todo?id=${encodeURIComponent(orderId)}`, "_blank", "noopener,noreferrer")}
      className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition shadow-xs cursor-pointer"
    >
      <Printer className="h-3.5 w-3.5" />
      Stampa Ordine
    </button>
  );
}
