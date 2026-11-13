"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Download, Save, FileText, Pencil } from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";
import type { QuoteInput, QuoteLine } from "@/lib/server/quotes";

type CatalogOption = Omit<QuoteLine, "qty">;
type Saved = { id: string; number: string };
type Props = { options: CatalogOption[]; validUntil: string; vatRate: number; initial?: QuoteInput & Saved; readOnly?: boolean; locked?: boolean };
const inputClass = "mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm disabled:bg-neutral-50 disabled:text-neutral-700";
const euro = (cents: number) => (cents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
const blankLine = (): QuoteLine => ({ productId: "", variantId: "", sku: "", title: "", variantLabel: "", qty: 1, unitPriceCents: 0 });

export default function QuoteEditor({ options, validUntil, vatRate, initial, readOnly = false, locked = false }: Props) {
  const router = useRouter();
  const [lines, setLines] = useState(() => (initial?.items || [blankLine()]).map((line, i) => ({ ...line, key: String(i), price: (line.unitPriceCents / 100).toFixed(2) })));
  const [discount, setDiscount] = useState(String((initial?.discountCents || 0) / 100));
  const [shipping, setShipping] = useState(String((initial?.shippingCents || 0) / 100));
  const [saved, setSaved] = useState<Saved | null>(initial || null);
  const [editing, setEditing] = useState(false);
  const editable = !saved || editing;
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef("");
  const inFlight = useRef(false);
  const toCents = (value: string) => Math.round(Number(value.replace(",", ".")) * 100);
  const subtotal = lines.reduce((sum, line) => sum + line.qty * toCents(line.price), 0);
  const total = subtotal - toCents(discount) + toCents(shipping);
  const changeLine = (key: string, data: Partial<(typeof lines)[number]>) => setLines((prev) => prev.map((line) => line.key === key ? { ...line, ...data } : line));

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || (saved && !editing) || readOnly || locked) return;
    const data = new FormData(event.currentTarget);
    inFlight.current = true; setBusy(true); setError("");
    requestId.current ||= crypto.randomUUID();
    const get = (name: string) => String(data.get(name) || "").trim();
    try {
      const payload: QuoteInput = {
        requestId: initial?.requestId || requestId.current, fullName: get("fullName"), email: get("email"), phone: get("phone"),
        addressLine1: get("addressLine1"), addressLine2: get("addressLine2"), city: get("city"),
        postalCode: get("postalCode"), province: get("province"), countryCode: get("countryCode").toUpperCase(),
        paymentTerms: get("paymentTerms"), notes: get("notes"), validUntil: get("validUntil"), shippingTerms: get("shippingTerms"),
        items: lines.map(({ key: _key, price, ...line }) => { void _key; return { ...line, unitPriceCents: toCents(price) }; }),
        discountCents: toCents(discount), shippingCents: toCents(shipping),
      };
      const response = await adminFetch(saved ? `/api/admin/quotes/${saved.id}/` : "/api/admin/quotes/", { method: saved ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Salvataggio non riuscito.");
      setSaved({ id: result.id, number: result.number }); setEditing(false); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Salvataggio non riuscito. Riprova senza cambiare i dati."); }
    finally { inFlight.current = false; setBusy(false); }
  }

  async function download() {
    if (!saved || downloading || readOnly) return;
    setDownloading(true); setError("");
    try {
      const response = await adminFetch(`/api/admin/quotes/${saved.id}/document/`, { method: "POST" });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || "Download non riuscito."); }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `preventivo-${saved.number}.pdf`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); router.refresh();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) { setError(e instanceof Error ? e.message : "Download non riuscito. Riprova."); }
    finally { setDownloading(false); }
  }

  const fields = [
    ["fullName", "Nome / Ragione sociale", "text", true, 200], ["email", "Email", "email", true, 254],
    ["phone", "Telefono", "tel", false, 60], ["addressLine1", "Indirizzo di spedizione", "text", true, 250],
    ["addressLine2", "Interno / altre indicazioni", "text", false, 250], ["postalCode", "CAP", "text", true, 20],
    ["city", "Città", "text", true, 150], ["province", "Provincia", "text", false, 100],
    ["countryCode", "Paese (sigla, es. IT)", "text", true, 2],
  ] as const;
  return <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-red-700" />{saved ? saved.number : "Nuovo preventivo"}</h2><p className="mt-1 text-sm text-neutral-500">Prezzi IVA inclusa. Salvataggio e download del PDF sono separati.</p></div>
      {saved && !readOnly && <div className="flex flex-wrap gap-2">
        {!editing && !locked && <button type="button" disabled={downloading} onClick={() => { setEditing(true); setError(""); }} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Pencil className="h-4 w-4" />Modifica preventivo</button>}
        <button type="button" onClick={() => window.location.assign("/admin/quotes")} className="rounded-xl border px-4 py-2 text-sm font-semibold">Nuovo preventivo</button></div>}
    </div>
    <form onSubmit={save}>
      <fieldset disabled={busy || !editable || readOnly || locked} className="space-y-6">
        <legend className="sr-only">Dati del preventivo</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([name, label, type, required, maxLength]) =>
          <label key={name} className="text-xs font-semibold text-neutral-600">{label}{required ? " *" : ""}<input name={name} type={type} required={required} maxLength={maxLength} defaultValue={initial?.[name] ?? (name === "countryCode" ? "IT" : "")} className={inputClass} /></label>
        )}</div>
        <div className="space-y-3">
          <h3 className="font-bold">Prodotti e opzioni</h3>
          {lines.map((line, index) => <div key={line.key} className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-neutral-500">Riga {index + 1}</span>{editable && lines.length > 1 && <button type="button" aria-label={`Rimuovi riga ${index + 1}`} onClick={() => setLines((prev) => prev.filter((l) => l.key !== line.key))} className="rounded-lg p-2 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>}</div>
            {editable && <label className="block text-xs font-semibold text-neutral-600">Seleziona il prodotto dal catalogo<select required className={inputClass} value={line.productId ? `${line.productId}/${line.variantId}` : ""} onChange={(e) => {
              const option = options.find((o) => `${o.productId}/${o.variantId}` === e.target.value);
              changeLine(line.key, option ? { ...option, price: (option.unitPriceCents / 100).toFixed(2) } : { productId: "", variantId: "", sku: "" });
            }}><option value="">Seleziona un prodotto</option>{options.map((o) => <option key={`${o.productId}/${o.variantId}`} value={`${o.productId}/${o.variantId}`}>{o.title} - {o.variantLabel}</option>)}</select></label>}
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-semibold text-neutral-600 sm:col-span-2">Prodotto *<input required maxLength={200} value={line.title} onChange={(e) => changeLine(line.key, { title: e.target.value })} className={inputClass} /></label>
              <label className="text-xs font-semibold text-neutral-600">Quantità *<input type="number" min="1" max="10000" step="1" required value={line.qty || ""} onChange={(e) => changeLine(line.key, { qty: Number(e.target.value) })} className={inputClass} /></label>
              <label className="text-xs font-semibold text-neutral-600">Prezzo unitario (EUR IVA incl.) *<input type="number" min="0" max="1000000" step="0.01" required value={line.price} onChange={(e) => changeLine(line.key, { price: e.target.value })} className={inputClass} /></label>
              <label className="text-xs font-semibold text-neutral-600 sm:col-span-2 lg:col-span-3">Formato / opzioni concordate<input maxLength={1000} value={line.variantLabel} onChange={(e) => changeLine(line.key, { variantLabel: e.target.value })} className={inputClass} /></label>
              <div className="self-end pb-2 text-right text-sm font-bold">{euro(line.qty * toCents(line.price))}</div>
            </div>
          </div>)}
          {editable && <button disabled={lines.length >= 50} type="button" onClick={() => setLines((prev) => [...prev, { ...blankLine(), key: crypto.randomUUID(), price: "0.00" }])} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50"><Plus className="h-4 w-4" />Aggiungi prodotto</button>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-neutral-600">Sconto prodotti (EUR)<input type="number" min="0" step="0.01" required value={discount} onChange={(e) => setDiscount(e.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-neutral-600">Spedizione (EUR)<input type="number" min="0" step="0.01" required value={shipping} onChange={(e) => setShipping(e.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-neutral-600">Valido fino al (un mese)<input name="validUntil" type="date" readOnly required defaultValue={initial?.validUntil || validUntil} className={inputClass} /></label>
          <label className="text-xs font-semibold text-neutral-600">Condizioni di pagamento<input name="paymentTerms" maxLength={1000} defaultValue={initial?.paymentTerms || "Pagamento tramite il sito"} className={inputClass} /></label>
        </div>
        <label className="block text-xs font-semibold text-neutral-600">Condizioni di spedizione *<textarea name="shippingTerms" required maxLength={2000} rows={3} defaultValue={initial?.shippingTerms || "Spedizione all'indirizzo indicato nel preventivo, ai costi concordati."} className={inputClass} /></label>
        <label className="block text-xs font-semibold text-neutral-600">Note e condizioni per il cliente<textarea name="notes" maxLength={4000} rows={3} defaultValue={initial?.notes || ""} className={inputClass} /></label>
      </fieldset>
      <div className="mt-6 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-end">
        <div className="space-y-1 text-sm text-neutral-600"><p>Subtotale prodotti: {euro(subtotal)}</p><p>Sconto: -{euro(toCents(discount))} - Spedizione: {euro(toCents(shipping))}</p><p className="text-xl font-bold text-neutral-900">Totale preventivo: {euro(total)}</p><p className="text-xs">Di cui IVA prodotti {(vatRate * 100).toLocaleString("it-IT")}%: {euro(Math.round((subtotal - toCents(discount)) * vatRate / (1 + vatRate)))}</p></div>
        {editable && !readOnly && !locked && <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />{busy ? "Salvataggio..." : (editing ? "Salva modifiche" : "Salva preventivo")}</button>}
      </div>
    </form>
    {locked && <p className="mt-4 text-sm text-neutral-600">Preventivo gi? accettato o pagato: le modifiche sono bloccate.</p>}
    {saved && !editing && <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div><p className="text-sm font-bold text-emerald-900">Preventivo salvato</p><p className="mt-1 text-xs text-emerald-800">Puoi scaricare il PDF adesso o riaprirlo in seguito dall’elenco.</p></div><button type="button" onClick={download} disabled={downloading || readOnly} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Download className="h-4 w-4" />{downloading ? "Preparazione PDF..." : "Scarica PDF"}</button></div>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  </section>;
}
