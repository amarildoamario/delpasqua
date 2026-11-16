"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  message: string;
  durationMs?: number;
  onClose: () => void;
};

export default function ToggleMessage({ open, message, durationMs = 5000, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(id);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 top-3 sm:top-4 z-[9999] px-3 sm:px-4 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto mx-auto flex w-full max-w-md sm:max-w-lg items-center justify-between gap-3 rounded-2xl border border-[#d7cbbb] bg-white/95 px-4 py-3 text-neutral-900 shadow-[0_14px_32px_rgba(31,26,23,0.18)] backdrop-blur-md"
      >
        <div className="min-w-0 text-sm font-medium leading-snug text-neutral-900">{message}</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
