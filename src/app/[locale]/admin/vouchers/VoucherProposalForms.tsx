"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/client/adminFetch";

const field = "mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base font-normal sm:text-sm disabled:bg-neutral-50";
const action = "rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-50";
const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

type FormResult = { id?: string; error?: string };

function useProposalSubmit(url: string, onSuccess: (result: FormResult) => void) {
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const attempt = useRef<{ payload: string; id: string } | null>(null);

  async function submit(input: Record<string, unknown>) {
    if (inFlight.current) return;
    const payload = JSON.stringify(input);
    if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() };
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await adminFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, requestId: attempt.current.id }),
      });
      const result: FormResult = await response.json();
      if (!response.ok) throw new Error(result.error || "Operazione non riuscita.");
      onSuccess(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Operazione non riuscita. Riprova.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return { ready, busy, error, setError, submit };
}

export function VoucherProposalForm({ tastings, detailBase }: {
  tastings: { id: string; title: string }[];
  detailBase: string;
}) {
  const router = useRouter();
  const { ready, busy, error, setError, submit } = useProposalSubmit("/api/admin/vouchers/", ({ id }) => {
    if (!id) throw new Error("Salvataggio non confermato.");
    router.push(`${detailBase}${id}/`);
  });

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const price = String(form.get("total")).trim().replace(",", ".");
    if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(price) || Number(price) < 0.5) {
      setError("Inserisci un prezzo totale di almeno 0,50 € con al massimo due decimali.");
      return;
    }
    void submit({
      tastingType: form.get("tastingType"),
      people: Number(form.get("people")),
      children: Number(form.get("children")),
      totalCents: Math.round(Number(price) * 100),
    });
  }

  return <form method="post" onSubmit={save} className="border-t border-neutral-200 p-4 sm:p-5">
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1.2fr]">
      <div className="sm:col-span-3 lg:col-span-1">
        <label htmlFor="voucher-tasting" className="text-sm font-semibold">Degustazione</label>
        <select id="voucher-tasting" name="tastingType" defaultValue="" required disabled={busy} className={field}>
          <option value="" disabled>Scegli una degustazione</option>
          {tastings.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
        </select>
      </div>
      <label className="text-sm font-semibold">Persone (adulti)
        <input name="people" type="number" min={1} max={20} defaultValue={2} required disabled={busy} className={field} />
      </label>
      <label className="text-sm font-semibold">Bambini
        <input name="children" type="number" min={0} max={10} defaultValue={0} required disabled={busy} className={field} />
      </label>
      <label className="text-sm font-semibold">Prezzo totale (€)
        <input name="total" type="text" inputMode="decimal" placeholder="70,00" maxLength={9} required disabled={busy} className={field} />
      </label>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <button className={`mt-4 ${action}`} disabled={!ready || busy}>{busy ? "Salvataggio…" : "Crea proposta"}</button>
  </form>;
}

export function VoucherProposalEmailForm({ id, tastingTitle }: { id: string; tastingTitle: string }) {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const { ready, busy, error, submit } = useProposalSubmit(`/api/admin/vouchers/${id}/email/`, () => {
    setSent(true);
    router.refresh();
  });

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent) return;
    const form = new FormData(event.currentTarget);
    void submit({ recipient: form.get("recipient"), subject: form.get("subject"), body: form.get("body") });
  }

  return <form method="post" onSubmit={send} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
    <div>
      <h2 className="text-lg font-bold">Invia per email</h2>
      <p className="mt-1 text-sm text-neutral-600">Il PDF della proposta viene allegato automaticamente.</p>
    </div>
    <label className="block text-sm font-semibold">Email destinatario
      <input name="recipient" type="email" autoComplete="email" maxLength={254} required disabled={busy || sent} className={field} />
    </label>
    <label className="block text-sm font-semibold">Oggetto
      <input name="subject" defaultValue="Proposta degustazione | Frantoio Del Pasqua" maxLength={200} required disabled={busy || sent} className={field} />
    </label>
    <label className="block text-sm font-semibold">Messaggio
      <textarea name="body" rows={6} maxLength={20000} required disabled={busy || sent} className={field}
        defaultValue={`Buongiorno,\n\nin allegato trova la proposta per ${tastingTitle}. Nel PDF trova il riepilogo e il link della proposta.\n\nA presto,\nFrantoio Del Pasqua`} />
    </label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {sent ? <p role="status" className="text-sm font-semibold text-emerald-800">Email accettata dal servizio di invio e registrata in archivio.</p>
      : <button className={action} disabled={!ready || busy}>{busy ? "Invio in corso…" : "Invia email con PDF"}</button>}
  </form>;
}

export function DeleteVoucherProposal({ id, tastingTitle, testRun, returnTo }: {
  id: string; tastingTitle: string; testRun: boolean; returnTo: string;
}) {
  const router = useRouter();
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm(testRun
      ? `Eliminare definitivamente la prova «${tastingTitle}» da 0,50 €? Verranno rimossi anche il checkout e gli eventuali voucher e prenotazione di prova.`
      : `Eliminare definitivamente la proposta «${tastingTitle}»? Lo storico email e gli allegati saranno eliminati e il link della proposta smetterà di funzionare.`)) return;
    setDeleting(true);
    setError("");
    try {
      const response = await adminFetch(`/api/admin/vouchers/${id}/`, { method: "DELETE" });
      if (!response.ok) {
        const result: FormResult = await response.json();
        throw new Error(result.error || "Impossibile eliminare la proposta.");
      }
      router.replace(returnTo);
      router.refresh();
    } catch (error) {
      setDeleting(false);
      setError(error instanceof Error ? error.message : "Impossibile eliminare la proposta.");
    }
  }

  return <div className="text-right">
    <button type="button" onClick={remove} disabled={!ready || deleting} aria-label={`Elimina proposta ${tastingTitle}`}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
      {deleting ? "Eliminazione…" : "Elimina"}
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}
