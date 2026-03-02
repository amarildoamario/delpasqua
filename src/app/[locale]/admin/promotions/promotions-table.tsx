"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";

type Row = {
  id: string;
  code: string;
  description: string | null;
  type: string;
  percent: number | null;
  amountCents: number | null;
  freeShipping: boolean;
  minOrderCents: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  isActive: boolean;
};

function euroFromCents(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + "€";
}

function fmt(it: string | null) {
  if (!it) return "—";
  const d = new Date(it);
  return d.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
}

export default function PromotionsTable({ rows }: { rows: Row[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sorted = useMemo(() => rows, [rows]);

  async function onDelete(id: string, code: string) {
    const ok = confirm(`Eliminare il codice "${code}"?`);
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await adminFetch(`/api/admin/promotions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as Record<string, unknown>)?.error as string || "Errore eliminazione");
      window.location.reload();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Errore";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-6 py-3">Codice</th>
            <th className="px-6 py-3">Sconto</th>
            <th className="px-6 py-3">Spedizione</th>
            <th className="px-6 py-3">Creato</th>
            <th className="px-6 py-3">Scadenza</th>
            <th className="px-6 py-3">Regole</th>
            <th className="px-6 py-3 text-right">Azioni</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-200">
          {sorted.map((p) => {
            const discountLabel =
              p.percent != null
                ? `${p.percent}%`
                : p.amountCents != null
                  ? `-${euroFromCents(p.amountCents)}`
                  : "—";

            const isExpiring = Boolean(p.endsAt);

            return (
              <tr key={p.id} className="text-neutral-800">
                <td className="px-6 py-4">
                  <div className="font-extrabold">{p.code}</div>
                  {p.description ? (
                    <div className="mt-1 text-xs text-neutral-500">{p.description}</div>
                  ) : null}
                </td>

                <td className="px-6 py-4">{discountLabel}</td>

                <td className="px-6 py-4">
                  {p.freeShipping ? (
                    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2 py-1 text-xs font-bold text-neutral-900">
                      Gratis
                    </span>
                  ) : (
                    <span className="text-neutral-500">Normale</span>
                  )}
                </td>

                <td className="px-6 py-4 text-neutral-600">{fmt(p.createdAt)}</td>

                <td className="px-6 py-4">
                  <div className="text-neutral-600">{fmt(p.endsAt)}</div>
                  {isExpiring && p.startsAt ? (
                    <div className="mt-1 text-xs text-neutral-500">dal {fmt(p.startsAt)}</div>
                  ) : null}
                </td>

                <td className="px-6 py-4 text-neutral-500">
                  {p.minOrderCents ? `Min ${euroFromCents(p.minOrderCents)} · ` : ""}
                  {p.usageLimit ? `${p.usedCount}/${p.usageLimit} usi` : `Usi ${p.usedCount}`}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(p.id, p.code)}
                    disabled={deletingId === p.id}
                    className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-extrabold text-neutral-900 shadow-sm hover:bg-neutral-50 disabled:opacity-60"
                  >
                    {deletingId === p.id ? "Elimino..." : "Elimina"}
                  </button>
                </td>
              </tr>
            );
          })}

          {!sorted.length && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-sm text-neutral-500">
                Nessuna promozione ancora.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
