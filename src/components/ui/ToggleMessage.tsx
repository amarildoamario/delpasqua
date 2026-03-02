"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  message: string;
  durationMs?: number;
  onClose: () => void;
};

export default function ToggleMessage({ open, message, durationMs = 2500, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(id);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed right-4 top-4 z-[9999]">
      <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-lg">
        <div className="text-sm text-neutral-900">{message}</div>
      </div>
    </div>
  );
}
