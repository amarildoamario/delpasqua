"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "relative h-8 w-14 rounded-full border transition",
        on
          ? "border-neutral-900 bg-neutral-900"
          : "border-neutral-300 bg-white",
      ].join(" ")}
      aria-pressed={on}
    >
      <span
        className={[
          "absolute top-1 h-6 w-6 rounded-full transition",
          on ? "left-7 bg-white" : "left-1 bg-neutral-200",
        ].join(" ")}
      />
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 outline-none",
        "placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-200",
        "",
        props.className || "",
      ].join(" ")}
    />
  );
}

function toLocalDatetimeValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function fromLocalDatetimeValue(v: string) {
  // datetime-local -> ISO
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default function PromotionForm() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [percent, setPercent] = useState<number>(10);
  const [amountCents, setAmountCents] = useState<number>(0);
  const [freeShipping, setFreeShipping] = useState(false);

  const [minOrderCents, setMinOrderCents] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number>(0);

  // ✅ programmabile: range date
  const [startsAtIso, setStartsAtIso] = useState<string | null>(null);
  const [endsAtIso, setEndsAtIso] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const inferredType = useMemo(() => {
    if (freeShipping && percent === 0 && amountCents === 0) return "free_shipping";
    if (amountCents > 0) return "fixed";
    return "percent";
  }, [freeShipping, percent, amountCents]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const c = code.trim().toUpperCase();
    if (!c) return setMsg("Inserisci un codice.");
    if (percent < 0 || percent > 100) return setMsg("La percentuale deve essere tra 0 e 100.");
    if (amountCents < 0) return setMsg("Sconto fisso non valido.");
    if (minOrderCents < 0) return setMsg("Soglia minima non valida.");
    if (usageLimit < 0) return setMsg("Limite utilizzi non valido.");

    if (percent === 0 && amountCents === 0 && !freeShipping) {
      return setMsg("Imposta almeno uno sconto oppure spedizione gratis.");
    }

    const startsAt = startsAtIso ? new Date(startsAtIso) : null;
    const endsAt = endsAtIso ? new Date(endsAtIso) : null;
    if (startsAt && endsAt && startsAt.getTime() > endsAt.getTime()) {
      return setMsg("Il range date non è valido: la data di fine è prima dell'inizio.");
    }

    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: c,
          description: description.trim() || null,
          type: inferredType,
          percent: percent || null,
          amountCents: amountCents || null,
          freeShipping,
          minOrderCents: minOrderCents || null,
          usageLimit: usageLimit || null,
          // programmabile:
          startsAt: startsAtIso,
          endsAt: endsAtIso,
          // attiva di default
          isActive: true,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg =
          typeof data === "object" && data !== null && "error" in data && typeof (data as Record<string, unknown>).error === "string"
            ? ((data as Record<string, unknown>).error as string)
            : "Errore";
        throw new Error(errMsg);
      }

      setMsg("Promozione creata ✅");
      setCode("");
      setDescription("");
      setPercent(10);
      setAmountCents(0);
      setFreeShipping(false);
      setMinOrderCents(0);
      setUsageLimit(0);
      setStartsAtIso(null);
      setEndsAtIso(null);

      window.location.reload();
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Errore";
      setMsg(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sinistra */}
        <div className="space-y-4">
          <div>
            <FieldLabel>Codice</FieldLabel>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ES: TESTPAY" />
          </div>

          <div>
            <FieldLabel>Descrizione</FieldLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ES: per test sui pagamenti"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div>
              <div className="text-sm font-extrabold text-neutral-900">
                Spedizione gratis
              </div>
              <div className="text-xs text-neutral-500">Forza shipping a 0</div>
            </div>
            <Toggle on={freeShipping} onToggle={() => setFreeShipping((v) => !v)} />
          </div>

          {/* Range date */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <FieldLabel>Programmazione</FieldLabel>
                <div className="mt-1 text-sm font-semibold text-neutral-600">
                  Range date (opzionale)
                </div>
              </div>
              <div className="text-xs font-semibold text-neutral-400">
                Tipo: <span className="text-neutral-600">{inferredType}</span>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs font-bold text-neutral-500">Inizio</div>
                <Input
                  type="datetime-local"
                  value={toLocalDatetimeValue(startsAtIso)}
                  onChange={(e) => setStartsAtIso(fromLocalDatetimeValue(e.target.value))}
                />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-500">Fine</div>
                <Input
                  type="datetime-local"
                  value={toLocalDatetimeValue(endsAtIso)}
                  onChange={(e) => setEndsAtIso(fromLocalDatetimeValue(e.target.value))}
                />
              </div>
            </div>

            <div className="mt-2 text-xs text-neutral-500">
              Lascia vuoto per “sempre valida”. Se imposti solo la fine, la promo scade a quella data.
            </div>
          </div>
        </div>

        {/* Destra */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <FieldLabel>Sconto percentuale</FieldLabel>
            <div className="mt-1 text-sm font-semibold text-neutral-600">{percent}%</div>
            <input
              type="range"
              min={0}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="mt-3 w-full"
            />
          </div>

          <div>
            <FieldLabel>Sconto fisso (centesimi)</FieldLabel>
            <Input
              type="number"
              min={0}
              value={amountCents}
              onChange={(e) => setAmountCents(Number(e.target.value))}
              placeholder="ES: 500 = 5€"
            />
            <div className="mt-2 text-xs text-neutral-500">Lascia 0 se non ti serve.</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Ordine minimo (centesimi)</FieldLabel>
              <Input
                type="number"
                min={0}
                value={minOrderCents}
                onChange={(e) => setMinOrderCents(Number(e.target.value))}
                placeholder="0 = nessuna soglia"
              />
            </div>
            <div>
              <FieldLabel>Limite utilizzi</FieldLabel>
              <Input
                type="number"
                min={0}
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                placeholder="0 = illimitato"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Salvataggio..." : "Crea codice"}
        </button>

        {msg && (
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700">
            {msg}
          </div>
        )}
      </div>
    </form>
  );
}
