"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "fast" | "medium" | "slow" | "manual";

export default function SuccessAutoRefresh({
  orderId,
  isPaid,
  stripePaymentStatus,
  delayed,
  maxAutoSeconds = 120,
}: {
  orderId: string;
  isPaid: boolean;
  stripePaymentStatus?: string | null;
  delayed: boolean;
  maxAutoSeconds?: number;
}) {
  const router = useRouter();

  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<Phase>("fast");

  const intervalMs = useMemo(() => {
    if (phase === "fast") return 2000;
    if (phase === "medium") return 5000;
    if (phase === "slow") return 10000;
    return 0;
  }, [phase]);

  useEffect(() => {
    if (isPaid) return;
    if (phase === "manual") return;

    const startedAt = Date.now();

    const t = setInterval(() => {
      const e = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(e);
      router.refresh();

      if (e >= maxAutoSeconds) {
        setPhase("manual");
        clearInterval(t);
        return;
      }

      if (e >= 60) setPhase("slow");
      else if (e >= 20) setPhase("medium");
      else setPhase("fast");
    }, intervalMs);

    return () => clearInterval(t);
  }, [router, isPaid, phase, intervalMs, maxAutoSeconds]);

  if (isPaid) return null;

  const remaining = Math.max(0, maxAutoSeconds - elapsed);

  if (phase === "manual") {
    return (
      <div className="mx-auto mb-4 max-w-4xl rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-100 text-neutral-800">
              i
            </div>
            <div className="text-sm">
              <div className="font-semibold text-neutral-900">
                {delayed ? "Pagamento non immediato" : "Conferma in corso"}
              </div>
              <div className="mt-1 text-neutral-600">
                {delayed ? (
                  <>
                    Hai scelto un metodo lento (es. bonifico). La conferma può arrivare anche dopo 1–3 giorni lavorativi.
                    Riceverai un’email quando il pagamento sarà confermato.
                  </>
                ) : (
                  <>
                    A volte la conferma richiede più tempo. Puoi controllare manualmente quando vuoi.
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="shrink-0 rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            Controlla ora
          </button>
        </div>

        <div className="mt-3 text-xs text-neutral-500">
          ID ordine:{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5">
            {orderId}
          </code>
          {stripePaymentStatus ? (
            <>
              {" "}
              • Stripe:{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5">
                {stripePaymentStatus}
              </code>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-4 max-w-4xl rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-900">
            ⏳
          </div>
          <div className="text-sm">
            <div className="font-semibold text-neutral-900">
              {delayed ? "Pagamento in attesa" : "Pagamento in conferma"}
            </div>
            <div className="text-neutral-600">
              {delayed
                ? "Se è un bonifico può richiedere tempo. Controllo automatico breve…"
                : "Aggiorniamo automaticamente lo stato."}{" "}
              ({remaining}s)
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
          {phase === "fast" ? "rapido" : phase === "medium" ? "medio" : "lento"}
        </div>
      </div>
    </div>
  );
}
