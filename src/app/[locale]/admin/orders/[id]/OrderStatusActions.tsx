"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { OrderStatus } from "@/generated/prisma/client";
import { adminFetch } from "@/lib/client/adminFetch";

type Props = {
  orderId: string;
  status: OrderStatus;
  isFlagged?: boolean | null;
  riskScore?: number | null;
  notes?: string | null;
};

export default function OrderStatusActions({ orderId, status, isFlagged, riskScore, notes }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // ✅ mantiene “sempre” la label/chip e i bottoni in pagina anche durante refresh
  const [localStatus, setLocalStatus] = useState<OrderStatus>(status);
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const [msg, setMsg] = useState("");
  const trimmedMsg = useMemo(() => msg.trim(), [msg]);

  const [localNotes, setLocalNotes] = useState(notes ?? "");
  const [localFlagged, setLocalFlagged] = useState(Boolean(isFlagged));
  const [localRisk, setLocalRisk] = useState<number>(Number(riskScore ?? 0));

  useEffect(() => {
    setLocalNotes(notes ?? "");
  }, [notes]);

  useEffect(() => {
    setLocalFlagged(Boolean(isFlagged));
  }, [isFlagged]);

  useEffect(() => {
    setLocalRisk(Number(riskScore ?? 0));
  }, [riskScore]);

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const eventMessage = trimmedMsg || undefined;

  const can = (to: OrderStatus) => {
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ["PAID", "CANCELED", "EXPIRED", "FAILED"],
      PAID: ["PREPARING", "REFUNDED", "CANCELED", "FAILED"],
      PREPARING: ["SHIPPED", "CANCELED", "REFUNDED"],
      SHIPPED: ["DELIVERED", "REFUNDED"],
      DELIVERED: ["REFUNDED"],
      CANCELED: [],
      REFUNDED: [],
      PARTIALLY_REFUNDED: ["REFUNDED"],
      EXPIRED: [],
      FAILED: [],
    };
    return (allowed[localStatus] ?? []).includes(to);
  };

  async function patch(payload: Record<string, unknown>, optimisticNextStatus?: OrderStatus) {
    setLoading(true);

    // ✅ optimistic: aggiorna la label subito e resta “lì”
    const prev = localStatus;
    if (optimisticNextStatus) setLocalStatus(optimisticNextStatus);

    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("Status patch failed:", r.status, t);

        // rollback se fallisce
        setLocalStatus(prev);
        return;
      }

      // refresh per riallineare server state (events/timeline ecc.)
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const statusBadgeClass =
    localStatus === "PAID"
      ? "bg-emerald-50 text-emerald-700"
      : localStatus === "PREPARING"
        ? "bg-indigo-50 text-indigo-700"
        : localStatus === "SHIPPED"
          ? "bg-sky-50 text-sky-700"
          : localStatus === "CANCELED"
            ? "bg-red-50 text-red-700"
            : "bg-neutral-100 text-neutral-700";

  return (
    <div className="space-y-4">
      {/* Card azioni */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-neutral-900">Azioni ordine</div>
            <div className="mt-1 text-xs text-neutral-500">
              Ogni azione può registrare un messaggio nello storico (stampabile).
            </div>
          </div>

          {/* ✅ badge sempre visibile, usa localStatus */}
          <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", statusBadgeClass].join(" ")}>
            {localStatus}
          </span>
        </div>

        <div className="mt-3">
          <label className="block text-xs font-semibold text-neutral-500">
            Messaggio evento (opz.)
          </label>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Es: 'Ordine preso in carico', 'Cliente contattato'…"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/20"
            disabled={loading}
          />
        </div>

        {/* ✅ bottoni sempre renderizzati, solo disabilitati */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ActionButton
            label="Segna PAID"
            disabled={!can("PAID") || loading}
            onClick={() => patch({ status: "PAID", message: eventMessage }, "PAID")}
          />
          <ActionButton
            label="Segna PREPARING"
            disabled={!can("PREPARING") || loading}
            onClick={() => patch({ status: "PREPARING", message: eventMessage }, "PREPARING")}
          />
          <ActionButton
            label="Segna DELIVERED"
            disabled={!can("DELIVERED") || loading}
            onClick={() => patch({ status: "DELIVERED", message: eventMessage }, "DELIVERED")}
          />
          <ActionButton
            label="Segna REFUNDED"
            disabled={!can("REFUNDED") || loading}
            onClick={() => patch({ status: "REFUNDED", message: eventMessage }, "REFUNDED")}
          />
        </div>

        {/* Cancel / Restore */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-neutral-500">
            Cancella = ordine recuperabile (ripristino disponibile).
          </div>

          <div className="flex items-center gap-2">
            {localStatus === "CANCELED" ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => patch({ restore: true, message: eventMessage }, "PAID")}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:opacity-90 disabled:opacity-60"
              >
                Ripristina ordine
              </button>
            ) : (
              <button
                type="button"
                disabled={!can("CANCELED") || loading}
                onClick={() => setConfirmCancelOpen(true)}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 hover:opacity-90 disabled:opacity-60"
              >
                Cancella ordine
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Risk / flag / notes */}
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-neutral-900">Note interne</div>
          <div className="mt-1 text-xs text-neutral-500">Non visibili al cliente.</div>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            className="mt-3 w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Controlli</div>

          <label className="mt-3 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={localFlagged}
              onChange={(e) => setLocalFlagged(e.target.checked)}
              className="h-4 w-4"
              disabled={loading}
            />
            <span className="text-neutral-900">Flag ordine</span>
          </label>

          <label className="mt-3 block rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm">
            <div className="text-xs font-semibold text-neutral-500">Risk score</div>
            <input
              type="number"
              value={localRisk}
              onChange={(e) => setLocalRisk(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1 text-sm outline-none"
              disabled={loading}
            />
          </label>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              patch({
                status: localStatus, // non cambiare status qui
                isFlagged: localFlagged,
                riskScore: localRisk,
                notes: localNotes,
                message: eventMessage,
              })
            }
            className="mt-3 w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            Salva
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmCancelOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-neutral-900">Confermi cancellazione?</div>
            <div className="mt-2 text-sm text-neutral-600">
              L’ordine verrà marcato come <b>CANCELED</b>. Potrai comunque ripristinarlo dopo.
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmCancelOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
              >
                No, torna indietro
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setConfirmCancelOpen(false);
                  await patch({ status: "CANCELED", message: eventMessage }, "CANCELED");
                }}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 hover:opacity-90 disabled:opacity-60"
              >
                Sì, cancella
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ActionButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
