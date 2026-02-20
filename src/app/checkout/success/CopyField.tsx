"use client";

import { useState } from "react";

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // fallback: selezione manuale
      const el = document.getElementById(`copy-${label}`) as HTMLInputElement | null;
      el?.focus();
      el?.select();
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/50">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[11px] tracking-[0.08em] text-gray-600 dark:text-gray-300">
          {label.toUpperCase()}
        </div>

        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-[#b7aa60] px-3 py-1 text-[11px] font-semibold text-white hover:opacity-90"
        >
          {copied ? "COPIATO" : "COPIA"}
        </button>
      </div>

      <input
        id={`copy-${label}`}
        readOnly
        value={value}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-mono text-gray-900 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-zinc-900 dark:text-gray-100 dark:focus:ring-white/10"
        onFocus={(e) => e.currentTarget.select()}
      />
    </div>
  );
}
