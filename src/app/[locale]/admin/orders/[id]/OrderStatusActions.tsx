"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { OrderStatus } from "@/generated/prisma/client";
import { adminFetch } from "@/lib/client/adminFetch";
import {
  Check,
  AlertCircle,
  XCircle,
  RotateCcw,
  Save,
  FileText,
  ShieldAlert,
  CreditCard,
  CheckCircle2,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  Loader2,
} from "lucide-react";

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

type Props = {
  orderId: string;
  status: OrderStatus;
  totalCents: number;
  refundCents: number;
  stripePaymentIntentId?: string | null;
  notes?: string | null;
  isFlagged?: boolean | null;
  riskScore?: number | null;
};

const STEPS: { id: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "IN_ATTESA", label: "In attesa", icon: CreditCard },
  { id: "PAGATO", label: "Pagato", icon: DollarSign },
  { id: "IN_PREPARAZIONE", label: "Preparazione", icon: Package },
  { id: "SPEDITO", label: "Spedito", icon: Truck },
  { id: "CONSEGNATO", label: "Consegnato", icon: CheckCircle2 },
];

export default function OrderStatusActions({
  orderId,
  status,
  totalCents,
  refundCents,
  stripePaymentIntentId,
}: Omit<Props, "notes" | "isFlagged" | "riskScore">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<OrderStatus>(status);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const trimmedMsg = useMemo(() => msg.trim(), [msg]);
  const eventMessage = trimmedMsg || undefined;

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmRefundOpen, setConfirmRefundOpen] = useState(false);

  const remainingRefundCents = Math.max(0, totalCents - refundCents);
  const canRefundWithStripe =
    Boolean(stripePaymentIntentId) &&
    remainingRefundCents > 0 &&
    ["PAGATO", "IN_PREPARAZIONE", "SPEDITO", "CONSEGNATO", "PARZIALMENTE_RIMBORSATO"].includes(localStatus);

  const can = (to: OrderStatus) => {
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      IN_ATTESA: ["PAGATO", "ANNULLATO", "SCADUTO", "FALLITO"],
      PAGATO: ["IN_PREPARAZIONE", "ANNULLATO", "FALLITO"],
      IN_PREPARAZIONE: ["SPEDITO", "ANNULLATO"],
      SPEDITO: ["CONSEGNATO"],
      CONSEGNATO: [],
      ANNULLATO: [],
      RIMBORSATO: [],
      PARZIALMENTE_RIMBORSATO: [],
      SCADUTO: [],
      FALLITO: [],
    };
    return (allowed[localStatus] ?? []).includes(to);
  };

  async function patch(payload: Record<string, unknown>, optimisticNextStatus?: OrderStatus) {
    setLoading(true);
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
        setLocalStatus(prev);
        return;
      }

      setMsg("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function refundWithStripe() {
    setLoading(true);
    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          confirm: true,
          reason: "requested_by_customer",
          message: eventMessage,
        }),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("Stripe refund failed:", r.status, t);
        return;
      }

      const data = (await r.json().catch(() => null)) as { order?: { status?: OrderStatus } } | null;
      if (data?.order?.status) setLocalStatus(data.order.status);
      setMsg("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  // Visual Stepper calculations
  const activeStepIndex = STEPS.findIndex((s) => s.id === localStatus);
  const isAltState = activeStepIndex === -1;

  return (
    <div className="space-y-6">
      {/* ─── VISUAL PROGRESS STEPPER ─── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-neutral-600" />
              Stato Avanzamento Ordine
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Percorso logistico e pagamento.</p>
          </div>
          <div>
            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                localStatus === "PAGATO"
                  ? "bg-emerald-100 text-emerald-800"
                  : localStatus === "IN_PREPARAZIONE"
                    ? "bg-indigo-100 text-indigo-800"
                    : localStatus === "SPEDITO"
                      ? "bg-sky-100 text-sky-800"
                      : localStatus === "CONSEGNATO"
                        ? "bg-emerald-500 text-white"
                        : localStatus === "ANNULLATO" || localStatus === "FALLITO"
                          ? "bg-red-100 text-red-800"
                          : "bg-neutral-100 text-neutral-800",
              ].join(" ")}
            >
              {localStatus}
            </span>
          </div>
        </div>

        {/* Stepper Steps UI */}
        {!isAltState ? (
          <div className="relative my-6 px-2">
            {/* Connecting progress lines */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-100 -z-10" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-neutral-900 transition-all duration-500 -z-10"
              style={{
                width: `${(activeStepIndex / (STEPS.length - 1)) * 100}%`,
              }}
            />

            <div className="flex items-center justify-between">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < activeStepIndex;
                const isActive = idx === activeStepIndex;
                return (
                  <div key={step.id} className="flex flex-col items-center group relative">
                    <div
                      className={[
                        "flex h-9.5 w-9.5 items-center justify-center rounded-full border-2 transition-all duration-300 bg-white",
                        isCompleted
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : isActive
                            ? "border-neutral-950 text-neutral-950 ring-4 ring-neutral-950/10 scale-105"
                            : "border-neutral-200 text-neutral-400 group-hover:border-neutral-300",
                      ].join(" ")}
                    >
                      {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={[
                        "mt-2 text-[10px] font-bold tracking-wide uppercase whitespace-nowrap text-center transition-colors",
                        isActive ? "text-neutral-900 font-extrabold" : "text-neutral-500",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className={[
              "my-4 flex items-start gap-3 rounded-xl border p-3 text-xs leading-relaxed",
              localStatus === "ANNULLATO"
                ? "border-red-200 bg-red-50 text-red-800"
                : localStatus === "RIMBORSATO" || localStatus === "PARZIALMENTE_RIMBORSATO"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-neutral-200 bg-neutral-50 text-neutral-700",
            ].join(" ")}
          >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Attenzione:</span> L&apos;ordine si trova in uno stato speciale (
                <span className="font-semibold">{localStatus}</span>) che ha interrotto la normale catena di avanzamento.
                {localStatus === "ANNULLATO" && " L'ordine può essere ripristinato tramite il pulsante apposito."}
              </div>
          </div>
        )}

        {/* Message and Controls */}
        <div className="mt-4 border-t border-neutral-100 pt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
              Messaggio di storico per l&apos;azione (opzionale)
            </label>
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Es: 'Ordine pronto, avviso inviato al cliente' o 'Pacco imballato'"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-300 transition-all"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Passa allo stato successivo
            </span>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <ActionButton
                label="Segna PAGATO"
                disabled={!can("PAGATO") || loading}
                onClick={() => patch({ status: "PAGATO", message: eventMessage }, "PAGATO")}
                activeColor="hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              />
              <ActionButton
                label="Avvia PREPARAZIONE"
                disabled={!can("IN_PREPARAZIONE") || loading}
                onClick={() => patch({ status: "IN_PREPARAZIONE", message: eventMessage }, "IN_PREPARAZIONE")}
                activeColor="hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800"
              />
              <ActionButton
                label="Segna CONSEGNATO"
                disabled={!can("CONSEGNATO") || loading}
                onClick={() => patch({ status: "CONSEGNATO", message: eventMessage }, "CONSEGNATO")}
                activeColor="hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              />
              <ActionButton
                label="Rimborsa con Stripe"
                disabled={!canRefundWithStripe || loading}
                onClick={() => setConfirmRefundOpen(true)}
                activeColor="hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
              />
            </div>
          </div>
        </div>

        {/* Cancellation Actions */}
        <div className="mt-4 border-t border-neutral-100 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">
            {localStatus === "ANNULLATO" ? "Ripristinando l'ordine tornerà a PAGATO." : "Cancella l'ordine se non è completabile."}
          </div>

          <div className="flex items-center gap-2">
            {localStatus === "ANNULLATO" ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => patch({ restore: true, message: eventMessage }, "PAGATO")}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition disabled:opacity-60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Ripristina Ordine
              </button>
            ) : (
              <button
                type="button"
                disabled={!can("ANNULLATO") || loading}
                onClick={() => setConfirmCancelOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-800 hover:bg-red-100 transition disabled:opacity-60"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancella Ordine
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm modal - Cancel */}
      {confirmCancelOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-base font-bold text-neutral-900">Confermi la cancellazione?</h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              L’ordine verrà marcato come <b className="text-neutral-900">ANNULLATO</b>.
              Sarà comunque possibile ripristinarlo in futuro se necessario.
            </p>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmCancelOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
              >
                No, torna indietro
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setConfirmCancelOpen(false);
                  await patch({ status: "ANNULLATO", message: eventMessage }, "ANNULLATO");
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-sm"
              >
                {loading ? "Cancellazione..." : "Sì, cancella l'ordine"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Confirm modal - Refund */}
      {confirmRefundOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 text-amber-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-base font-bold text-neutral-900">Confermi rimborso Stripe?</h3>
            </div>
            <div className="text-sm text-neutral-600 space-y-2.5 leading-relaxed">
              <p>
                Verrà emesso un rimborso reale su Stripe per un importo di <b>{euro(remainingRefundCents)}</b>.
              </p>
              <p>
                Dopo la conferma, lo stato dell&apos;ordine verrà aggiornato in <b>RIMBORSATO</b> o{" "}
                <b>PARZIALMENTE_RIMBORSATO</b> in base all&apos;esito su Stripe.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmRefundOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setConfirmRefundOpen(false);
                  await refundWithStripe();
                }}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-750 transition shadow-sm"
              >
                {loading ? "Rimborso in corso..." : "Sì, procedi al rimborso"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type InternalControlsProps = {
  orderId: string;
  notes: string;
  isFlagged: boolean;
  riskScore: number;
};

export function OrderInternalControls({
  orderId,
  notes,
  isFlagged,
  riskScore,
}: InternalControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);

  const [localNotes, setLocalNotes] = useState(notes);
  const [localFlagged, setLocalFlagged] = useState(isFlagged);
  const [localRisk, setLocalRisk] = useState<number>(riskScore);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  useEffect(() => {
    setLocalFlagged(isFlagged);
  }, [isFlagged]);

  useEffect(() => {
    setLocalRisk(riskScore);
  }, [riskScore]);

  async function save() {
    setLoading(true);
    setSavedRecently(false);
    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          notes: localNotes,
          isFlagged: localFlagged,
          riskScore: localRisk,
        }),
      });

      if (!r.ok) {
        console.error("Save internal controls failed:", r.status);
        return;
      }

      setSavedRecently(true);
      setTimeout(() => setSavedRecently(false), 2500);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-neutral-600" />
          Note Interne
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">Annotazioni interne visibili solo agli amministratori.</p>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          placeholder="Aggiungi una nota su questo ordine..."
          className="mt-2.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-300 transition duration-150 resize-y"
          rows={3}
          disabled={loading}
        />
      </div>

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4" />
          Prevenzione Frodi / Rischio
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50/30 px-3 py-2 cursor-pointer select-none hover:bg-neutral-50/80 transition">
            <input
              type="checkbox"
              checked={localFlagged}
              onChange={(e) => setLocalFlagged(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950/10"
              disabled={loading}
            />
            <div className="text-xs font-semibold text-neutral-950">Segnala Ordine (Flag)</div>
          </label>

          <label className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-neutral-50/30 px-3 py-1.5">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Punteggio Rischio</span>
            <input
              type="number"
              value={localRisk}
              onChange={(e) => setLocalRisk(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-semibold outline-none text-neutral-900"
              placeholder="0"
              disabled={loading}
            />
          </label>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2.5 text-xs font-bold text-white hover:opacity-90 transition active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : savedRecently ? (
            <>
              <Check className="h-4 w-4 stroke-[3] text-emerald-400 animate-bounce" />
              Salvato con successo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salva Modifiche
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  disabled,
  onClick,
  activeColor = "hover:border-neutral-300 hover:bg-neutral-50",
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  activeColor?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-bold text-neutral-800 transition duration-150 active:scale-[0.98]",
        disabled
          ? "cursor-not-allowed opacity-45 bg-neutral-50 text-neutral-400"
          : ["cursor-pointer shadow-xs", activeColor].join(" "),
      ].join(" ")}
    >
      {label}
    </button>
  );
}
