"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";

type MerchState = {
  showInHome: boolean;
  homeRank: number;
  isBestSeller: boolean;
  badge: string;
  promoLabel: string;
  discountPercent: number;
  discountCents: number;
  startsAt: string | null;
  endsAt: string | null;
};

type Row = {
  productKey: string;
  slug: string;
  title: string;
  basePriceCents: number;
  merch: MerchState | null;
};

const BADGES = [
  { value: "", label: "—" },
  { value: "PIU_VENDUTO", label: "Più venduto" },
  { value: "IN_OFFERTA", label: "In offerta" },
  { value: "NOVITA", label: "Novità" },
  { value: "HOT", label: "Hot" },
  { value: "IN_HOME", label: "In home" },
];

function euroFromCents(c: number) {
  return (c / 100).toFixed(2).replace(".", ",") + "€";
}

function toLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

function fromLocal(v: string) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function effectivePrice(priceCents: number, s: MerchState) {
  let p = priceCents;
  const pct = Number(s.discountPercent || 0);
  const fixed = Number(s.discountCents || 0);

  if (pct > 0) p = Math.round((p * (100 - pct)) / 100);
  if (fixed > 0) p = Math.max(0, p - fixed);
  return p;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-extrabold uppercase tracking-wide text-neutral-500">
      {children}
    </div>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={[
        "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 outline-none",
        "focus:ring-2 focus:ring-neutral-900/10",
        className,
      ].join(" ")}
    />
  );
}

function Select({
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 outline-none",
        "focus:ring-2 focus:ring-neutral-900/10",
        className,
      ].join(" ")}
    />
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2">
      <span className="text-xs font-semibold text-neutral-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-300"
      />
    </label>
  );
}

export default function SalesTable({ rows }: { rows: Row[] }) {
  const initial = useMemo(() => {
    const m: Record<string, MerchState> = {};
    for (const r of rows) {
      m[r.productKey] = {
        showInHome: r.merch?.showInHome ?? false,
        homeRank: r.merch?.homeRank ?? 0,
        isBestSeller: r.merch?.isBestSeller ?? false,
        badge: r.merch?.badge ?? "",
        promoLabel: r.merch?.promoLabel ?? "",
        discountPercent: r.merch?.discountPercent ?? 0,
        discountCents: r.merch?.discountCents ?? 0,
        startsAt: r.merch?.startsAt ?? null,
        endsAt: r.merch?.endsAt ?? null,
      };
    }
    return m;
  }, [rows]);

  const [state, setState] = useState<Record<string, MerchState>>(initial);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  function setField<K extends keyof MerchState>(key: string, field: K, value: MerchState[K]) {
    setState((s) => ({ ...s, [key]: { ...s[key], [field]: value } }));
  }

  async function save(productKey: string) {
    const s = state[productKey];

    const pct = Number(s.discountPercent || 0);
    const fixed = Number(s.discountCents || 0);
    if (pct < 0 || pct > 100) return alert("Sconto % deve essere 0..100");
    if (fixed < 0) return alert("Sconto fisso non valido");

    const startsAt = s.startsAt ? new Date(s.startsAt) : null;
    const endsAt = s.endsAt ? new Date(s.endsAt) : null;
    if (startsAt && endsAt && startsAt.getTime() > endsAt.getTime()) {
      return alert("Range date non valido (fine prima dell'inizio)");
    }

    setSavingKey(productKey);
    setSavedKey(null);

    try {
      const res = await adminFetch("/api/admin/sales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey,
          showInHome: Boolean(s.showInHome),
          homeRank: Number(s.homeRank || 0),
          isBestSeller: Boolean(s.isBestSeller),
          badge: s.badge ? String(s.badge) : null,
          promoLabel: s.promoLabel ? String(s.promoLabel) : null,
          discountPercent: pct > 0 ? pct : null,
          discountCents: fixed > 0 ? fixed : null,
          startsAt: s.startsAt ?? null,
          endsAt: s.endsAt ?? null,
        }),
      });

      const data: unknown = await res.json().catch(() => ({}));
      const msg =
        typeof data === "object" && data && "error" in data && typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : "Errore salvataggio";

      if (!res.ok) throw new Error(msg);

      // NIENTE reload: evita hydration mismatch e resta reattivo
      setSavedKey(productKey);
      setTimeout(() => setSavedKey((k) => (k === productKey ? null : k)), 1200);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Errore";
      alert(msg);
    } finally {
      setSavingKey(null);
    }
  }

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Nessun prodotto trovato.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map((r) => {
        const s = state[r.productKey];
        const promoPrice = effectivePrice(r.basePriceCents, s);
        const isSaving = savingKey === r.productKey;
        const isSaved = savedKey === r.productKey;

        return (
          <div
            key={r.productKey}
            className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-extrabold text-neutral-900">{r.title}</h3>
                  {s.badge ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-800">
                      {BADGES.find((b) => b.value === s.badge)?.label ?? s.badge}
                    </span>
                  ) : null}
                  {s.isBestSeller ? (
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-extrabold text-sky-700">
                      Best seller
                    </span>
                  ) : null}
                  {s.showInHome ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                      In home
                    </span>
                  ) : null}
                </div>

                <div className="mt-1 text-xs text-neutral-500">/shop/{r.slug}</div>

                <div className="mt-3 flex flex-wrap items-end gap-4">
                  <div>
                    <div className="text-xs text-neutral-500">Base</div>
                    <div className="text-sm font-extrabold text-neutral-900">
                      {euroFromCents(r.basePriceCents)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-neutral-500">Promo</div>
                    <div className="text-sm font-extrabold text-neutral-900">
                      {euroFromCents(promoPrice)}
                    </div>
                  </div>

                  {s.promoLabel ? (
                    <div className="text-xs font-semibold text-neutral-600">
                      Label: <span className="font-extrabold">{s.promoLabel}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isSaved ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-800">
                    Salvato ✅
                  </div>
                ) : null}

                <button
                  onClick={() => save(r.productKey)}
                  disabled={isSaving}
                  className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  {isSaving ? "Salvo..." : "Salva"}
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {/* Badge + Promo label */}
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3">
                <FieldLabel>Badge</FieldLabel>
                <div className="mt-2">
                  <Select value={s.badge} onChange={(e) => setField(r.productKey, "badge", e.target.value)}>
                    {BADGES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="mt-4">
                  <FieldLabel>Label promo</FieldLabel>
                  <Input
                    value={s.promoLabel}
                    onChange={(e) => setField(r.productKey, "promoLabel", e.target.value)}
                    placeholder="ES: Promo limitata"
                  />
                </div>

                <div className="mt-4">
                  <CheckRow
                    label="Più venduto"
                    checked={Boolean(s.isBestSeller)}
                    onChange={(v) => setField(r.productKey, "isBestSeller", v)}
                  />
                </div>
              </div>

              {/* Home settings */}
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3">
                <FieldLabel>Home</FieldLabel>

                <div className="mt-3 space-y-3">
                  <CheckRow
                    label="Mostra in home"
                    checked={Boolean(s.showInHome)}
                    onChange={(v) => setField(r.productKey, "showInHome", v)}
                  />

                  <div>
                    <FieldLabel>Priorità (homeRank)</FieldLabel>
                    <Input
                      type="number"
                      value={s.homeRank}
                      onChange={(e) => setField(r.productKey, "homeRank", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Discount */}
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3">
                <FieldLabel>Sconto</FieldLabel>

                <div className="mt-3 grid gap-3">
                  <div>
                    <FieldLabel>% sconto</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={s.discountPercent}
                      onChange={(e) => setField(r.productKey, "discountPercent", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <FieldLabel>Sconto fisso (cents)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={s.discountCents}
                      onChange={(e) => setField(r.productKey, "discountCents", Number(e.target.value))}
                    />
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700">
                    Prezzo promo calcolato: <span className="font-extrabold">{euroFromCents(promoPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3">
                <FieldLabel>Programmazione</FieldLabel>

                <div className="mt-3 grid gap-3">
                  <div>
                    <FieldLabel>Inizio</FieldLabel>
                    <Input
                      type="datetime-local"
                      value={toLocal(s.startsAt)}
                      onChange={(e) => setField(r.productKey, "startsAt", fromLocal(e.target.value))}
                    />
                  </div>

                  <div>
                    <FieldLabel>Fine</FieldLabel>
                    <Input
                      type="datetime-local"
                      value={toLocal(s.endsAt)}
                      onChange={(e) => setField(r.productKey, "endsAt", fromLocal(e.target.value))}
                    />
                  </div>

                  <div className="text-xs text-neutral-500">
                    Suggerimento: se imposti le date, puoi fare promo “a tempo”.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
