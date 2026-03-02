"use client";

import { useEffect } from "react";

export default function DoubleConfirmDialog(props: {
  open: boolean;
  title: string;
  step: 1 | 2;
  loading?: boolean;
  step1Text: string;
  step2Text: string;
  confirmLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const {
    open,
    title,
    step,
    loading,
    step1Text,
    step2Text,
    confirmLabel,
    cancelLabel = "Chiudi",
    onCancel,
    onBack,
    onConfirm,
  } = props;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50" onClick={onCancel} aria-label="Chiudi" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        <p className="mt-2 text-sm text-neutral-700">{step === 1 ? step1Text : step2Text}</p>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {step === 2 ? (
            <button
              type="button"
              onClick={onBack}
              disabled={Boolean(loading)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
            >
              Indietro
            </button>
          ) : null}

          <button
            type="button"
            onClick={onCancel}
            disabled={Boolean(loading)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={Boolean(loading)}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}