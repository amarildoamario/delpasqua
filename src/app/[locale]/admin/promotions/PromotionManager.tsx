"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";

type Promo = {
  id: string;
  code: string;
  description: string | null;
  type: string;
  percent: number | null;
  amountCents: number | null;
  minOrderCents: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
};

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function PromotionManager({ initial }: { initial: Promo[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed" | "free_shipping">("percent");
  const [percent, setPercent] = useState<number>(10);
  const [amountCents, setAmountCents] = useState<number>(500);
  const [minOrderCents, setMinOrderCents] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number>(0);
  const [desc, setDesc] = useState("");

  const rows = useMemo(() => initial, [initial]);

  async function createPromo() {
    const c = code.trim().toUpperCase();
    if (!c) return;

    setSaving(true);
    try {
      await adminFetch("/api/admin/promotions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: c,
          description: desc.trim() || null,
          type,
          percent: type === "percent" ? percent : null,
          amountCents: type === "fixed" ? amountCents : null,
          minOrderCents: minOrderCents > 0 ? minOrderCents : null,
          usageLimit: usageLimit > 0 ? usageLimit : null,
          isActive: true,
        }),
      });
      router.refresh();
      setCode("");
      setDesc("");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    setSaving(true);
    try {
      await adminFetch(`/api/admin/promotions/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminare la promozione?")) return;
    setSaving(true);
    try {
      await adminFetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="text-base font-extrabold tracking-tight text-neutral-900">
          Nuova promozione
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-neutral-500">Codice</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ES: EVO10"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-neutral-500">Tipo</label>
            <select
              value={type}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "percent" || v === "fixed" || v === "free_shipping") setType(v);
              }}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
            >
              <option value="percent">Percentuale</option>
              <option value="fixed">Fisso</option>
              <option value="free_shipping">Spedizione gratis</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-neutral-500">Descrizione (opz.)</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Testo interno admin"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
            />
          </div>

          {type === "percent" ? (
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500">Percentuale</label>
              <input
                type="number"
                value={percent}
                min={1}
                max={90}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
              />
            </div>
          ) : null}

          {type === "fixed" ? (
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500">Sconto fisso (cents)</label>
              <input
                type="number"
                value={amountCents}
                min={0}
                onChange={(e) => setAmountCents(Number(e.target.value))}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
              />
              <div className="mt-1 text-xs text-neutral-500">{euro(amountCents)}</div>
            </div>
          ) : null}

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-neutral-500">Min ordine (cents)</label>
            <input
              type="number"
              value={minOrderCents}
              min={0}
              onChange={(e) => setMinOrderCents(Number(e.target.value))}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
            />
            <div className="mt-1 text-xs text-neutral-500">
              {minOrderCents > 0 ? euro(minOrderCents) : "Nessuna soglia"}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-neutral-500">Limite utilizzi</label>
            <input
              type="number"
              value={usageLimit}
              min={0}
              onChange={(e) => setUsageLimit(Number(e.target.value))}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
            />
            <div className="mt-1 text-xs text-neutral-500">
              {usageLimit > 0 ? `${usageLimit} max` : "Illimitato"}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={createPromo}
            disabled={saving}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Crea promozione
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-600">
            <tr>
              <th className="px-4 py-3">Codice</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Valore</th>
              <th className="px-4 py-3">Min ordine</th>
              <th className="px-4 py-3">Usi</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-extrabold text-neutral-900">{p.code}</td>
                <td className="px-4 py-3 text-neutral-700">{p.type}</td>
                <td className="px-4 py-3 text-neutral-700">
                  {p.type === "percent" ? `${p.percent ?? 0}%` : p.type === "fixed" ? euro(p.amountCents ?? 0) : "—"}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {p.minOrderCents ? euro(p.minOrderCents) : "—"}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {p.usedCount}/{p.usageLimit ?? "∞"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      p.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-neutral-100 text-neutral-700",
                    ].join(" ")}
                  >
                    {p.isActive ? "Attiva" : "Disattiva"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      disabled={saving}
                      onClick={() => toggleActive(p.id, p.isActive)}
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      {p.isActive ? "Disattiva" : "Attiva"}
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => remove(p.id)}
                      className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Elimina
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-600" colSpan={7}>
                  Nessuna promozione creata.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
