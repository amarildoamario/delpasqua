"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";
import DoubleConfirmDialog from "@/components/DoubleConfirmDialog";

type MailOk = { ok: true; status: "sent" | "skipped"; messageId?: string | null; reason?: string };
type MailFail = { ok: false; status: "failed"; error?: string };
type MailResult = MailOk | MailFail;

function isMailFail(m: MailResult): m is MailFail {
  return m.ok === false;
}

function alertFromMail(next: "CONFIRMED" | "CANCELED", m: MailResult | null | undefined) {
  const verb = next === "CONFIRMED" ? "Confermato" : "Cancellato";
  if (!m) return window.alert(`${verb} ✅`);
  if (m.ok && m.status === "sent") return window.alert(`${verb} ✅ Email al cliente inviata.`);
  if (m.ok && m.status === "skipped")
    return window.alert(`${verb} ⚠️ Email non inviata (skipped). ${m.reason ?? ""}`);
  if (isMailFail(m)) return window.alert(`${verb} ⚠️ Email fallita: ${m.error ?? "errore sconosciuto"}`);
  window.alert(`${verb} ✅`);
}

type ModalKind = null | "ACCEPT" | "CANCEL";

export default function TastingStatusActions({
  id,
  status,
}: {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<null | "PENDING" | "CONFIRMED" | "CANCELED">(null);

  // modal state (riuso)
  const [modal, setModal] = useState<ModalKind>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const busy = Boolean(loading);

  async function setStatus(next: "PENDING" | "CONFIRMED" | "CANCELED") {
    if (busy) return;
    setLoading(next);

    try {
      const r = await adminFetch("/api/admin/tastings/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("Update tasting status failed", r.status, t);
        window.alert("Errore cambio stato");
        return;
      }

      if (next === "CONFIRMED" || next === "CANCELED") {
        const j = (await r.json().catch(() => null)) as
          | { ok?: boolean; customerMail?: MailResult | null }
          | null;
        alertFromMail(next, j?.customerMail);
      }

      router.refresh();
    } catch (e) {
      console.error(e);
      window.alert("Errore imprevisto");
    } finally {
      setLoading(null);
    }
  }

  // ---- ACCEPT modal (1 step)
  function openAcceptModal() {
    if (busy || status === "CONFIRMED") return;
    setModal("ACCEPT");
    setStep(1); // 1 step
  }

  async function confirmAccept() {
    // single step: conferma e vai
    setModal(null);
    setStep(1);
    await setStatus("CONFIRMED");
  }

  // ---- CANCEL modal (2 step)
  function openCancelModal() {
    if (busy || status === "CANCELED") return;
    setModal("CANCEL");
    setStep(1);
  }

  async function confirmCancel() {
    if (step === 1) {
      setStep(2);
      return;
    }
    setModal(null);
    setStep(1);
    await setStatus("CANCELED");
  }

  function closeModal() {
    // evita chiusura mentre sta inviando cancellazione
    if (loading === "CANCELED" || loading === "CONFIRMED") return;
    setModal(null);
    setStep(1);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openAcceptModal}
          disabled={status === "CONFIRMED" || busy}
          className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading === "CONFIRMED" ? "…" : "Accetta"}
        </button>

        <button
          type="button"
          onClick={() => setStatus("PENDING")}
          disabled={status === "PENDING" || busy}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
        >
          {loading === "PENDING" ? "…" : "Ripristina"}
        </button>

        <button
          type="button"
          onClick={openCancelModal}
          disabled={status === "CANCELED" || busy}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
        >
          {loading === "CANCELED" ? "…" : "Cancella"}
        </button>
      </div>

      {/* MODAL: ACCEPT (1 step) */}
      <DoubleConfirmDialog
        open={modal === "ACCEPT"}
        title="Accetta degustazione"
        step={1}
        loading={loading === "CONFIRMED"}
        step1Text="Vuoi accettare questa prenotazione? Verrà inviata un'email di conferma al cliente."
        step2Text=""
        confirmLabel="Conferma accettazione"
        onCancel={closeModal}
        onBack={() => {}}
        onConfirm={confirmAccept}
      />

      {/* MODAL: CANCEL (2 step) */}
      <DoubleConfirmDialog
        open={modal === "CANCEL"}
        title="Cancella prenotazione"
        step={step}
        loading={loading === "CANCELED"}
        step1Text="Stai per cancellare la prenotazione. Vuoi procedere?"
        step2Text="Confermi definitivamente la cancellazione? Verrà inviata un'email al cliente."
        confirmLabel={step === 1 ? "Continua" : "Conferma cancellazione"}
        onCancel={closeModal}
        onBack={() => setStep(1)}
        onConfirm={confirmCancel}
      />
    </>
  );
}