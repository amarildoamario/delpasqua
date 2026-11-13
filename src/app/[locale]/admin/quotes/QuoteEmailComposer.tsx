"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Paperclip, Send, X } from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";

export default function QuoteEmailComposer({ id, number, email, name, disabled = false, localDevelopment = false }: {
  id: string; number: string; email: string; name: string; disabled?: boolean; localDevelopment?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const requestId = useRef("");
  const inFlight = useRef(false);
  const router = useRouter();
  const [subject, setSubject] = useState(`Preventivo ${number} — Frantoio Del Pasqua`);
  const [body, setBody] = useState(`Gentile ${name},\n\nin allegato trova il preventivo ${number} con i prodotti e le condizioni concordate.\n\nNel PDF è presente il link per procedere direttamente al pagamento sicuro.\n\nRestiamo a disposizione per qualsiasi chiarimento.\n\nCordiali saluti,\nFrantoio Del Pasqua`);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [historySaved, setHistorySaved] = useState(true);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || sent) return;
    requestId.current ||= crypto.randomUUID();
    inFlight.current = true; setBusy(true); setError("");
    try {
      const response = await adminFetch(`/api/admin/quotes/${id}/email/`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject, body, requestId: requestId.current }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Invio non riuscito.");
      setSent(true); setHistorySaved(result.historySaved !== false); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Impossibile confermare l'invio. Riprova con lo stesso testo."); }
    finally { inFlight.current = false; setBusy(false); }
  }

  return <>
    <button type="button" disabled={disabled} onClick={() => dialog.current?.showModal()} className="inline-flex items-center gap-2 rounded-[5px] bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-40"><Mail className="h-4 w-4" />Invia per email</button>
    <dialog ref={dialog} aria-labelledby={`email-title-${id}`} onCancel={(event) => { if (busy) event.preventDefault(); }} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-xl border border-neutral-200 p-0 text-left shadow-xl backdrop:bg-black/40">
      <div className="flex items-center justify-between gap-4 border-b p-5"><h2 id={`email-title-${id}`} className="text-lg font-bold">Invia preventivo {number}</h2><button type="button" disabled={busy} aria-label="Chiudi email" onClick={() => dialog.current?.close()} className="rounded-lg p-2 hover:bg-neutral-100 disabled:opacity-40"><X className="h-5 w-5" /></button></div>
      <form onSubmit={send} className="space-y-4 p-5">
        <p className="break-words text-sm text-neutral-600">A: <strong className="text-neutral-900">{name} &lt;{email}&gt;</strong></p>
        <label className="block text-sm font-semibold">Oggetto<input required maxLength={200} disabled={busy || sent} value={subject} onChange={(event) => { setSubject(event.target.value); requestId.current = ""; }} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal disabled:bg-neutral-50" /></label>
        <label className="block text-sm font-semibold">Messaggio<textarea required maxLength={20000} rows={10} disabled={busy || sent} value={body} onChange={(event) => { setBody(event.target.value); requestId.current = ""; }} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-normal leading-relaxed disabled:bg-neutral-50" /></label>
        <p className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"><Paperclip aria-hidden="true" className="h-4 w-4 shrink-0" />{`preventivo-${number}.pdf`} — allegato automaticamente</p>
        {localDevelopment && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Se invii da locale, il PDF contiene un link di pagamento che funziona solo su questo computer. Per far pagare un cliente esterno, invia il preventivo dal sito pubblicato.</p>}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {sent ? <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">{historySaved ? "Email inviata con PDF allegato. La trovi anche in Messaggi." : "Email accettata dal servizio di invio. La conferma nello storico è da verificare: non reinviare."}</p>
          : <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-sky-600 px-4 py-3 font-bold text-white hover:bg-sky-700 disabled:opacity-50"><Send className="h-4 w-4" />{busy ? "Preparazione PDF e invio…" : "Invia email con PDF"}</button>}
      </form>
    </dialog>
  </>;
}
