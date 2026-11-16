import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import { readCatalog } from "@/lib/server/catalog";
import { quoteNumber, oneCalendarMonthFrom } from "@/lib/server/quotes";
import { getStoreSettings } from "@/lib/server/settings";
import QuoteEditor from "./QuoteEditor";
import QuoteEmailComposer from "./QuoteEmailComposer";

export const dynamic = "force-dynamic";
export default async function QuotesPage() {
  const [storedQuotes, catalog, settings] = await Promise.all([
    prisma.quote.findMany({ orderBy: { createdAt: "desc" }, take: 100 }).catch((error: unknown) => {
      if (databaseReadOnly && typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return null;
      throw error;
    }), readCatalog(), getStoreSettings(),
  ]);
  const quotes = storedQuotes ?? [];
  const options = catalog.filter((p) => p.isTestProduct !== true && p.isPublished !== false).flatMap((p) =>
    p.variants.map((v) => ({ productId: p.id, variantId: v.id, title: p.title || p.id, variantLabel: v.label || v.id, sku: v.sku || `${p.id}:${v.id}`, unitPriceCents: v.priceCents || 0 })));
  const validUntil = oneCalendarMonthFrom(new Date()).toISOString().slice(0, 10);
  return <div className="mx-auto max-w-6xl space-y-6">
    <PageHeader title="Preventivi" subtitle="Prepara il preventivo, salvalo e scarica il PDF quando vuoi." />
    {databaseReadOnly ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      {storedQuotes === null ? "I preventivi non sono ancora disponibili nel database online. Puoi provarli nel database di sviluppo locale, senza modificare il sito online." : "I preventivi online sono consultabili. Per crearne di nuovi o predisporre pagamenti usa il database di sviluppo locale."}
    </p> : <QuoteEditor options={options} validUntil={validUntil} vatRate={settings.vatRatePercent / 100} />}
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
      <h2 className="mb-4 text-lg font-bold">Preventivi salvati</h2>
      {!quotes.length ? <p className="text-sm text-neutral-500">Non hai ancora creato preventivi.</p> : <>
        {/* Mobile Card View (< md) */}
        <div className="md:hidden divide-y divide-neutral-200 -mx-4 px-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link className="text-base font-bold text-neutral-900 underline" href={`/admin/quotes/${quote.id}`}>
                    {quoteNumber(quote)}
                  </Link>
                  <div className="mt-0.5 text-xs text-neutral-500">
                    Creato: {quote.createdAt.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })} · Valido fino: {quote.validUntil.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}
                  </div>
                </div>
                <div className="shrink-0 text-right text-base font-extrabold text-neutral-900">
                  {(quote.totalCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </div>
              </div>
              <div className="text-sm font-medium text-neutral-800 truncate">{quote.fullName}</div>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Link
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-100"
                  href={`/admin/quotes/${quote.id}`}
                >
                  Apri preventivo
                </Link>
                <QuoteEmailComposer id={quote.id} number={quoteNumber(quote)} email={quote.email} name={quote.fullName} localDevelopment={process.env.NODE_ENV !== "production"} disabled={databaseReadOnly || !!quote.paidAt || quote.validUntil.getTime() <= new Date().getTime()} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (md+) */}
        <div className="hidden md:block overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="border-b text-xs text-neutral-500"><tr><th className="p-3">Numero / data</th><th className="p-3">Cliente</th><th className="p-3">Validità</th><th className="p-3 text-right">Totale</th><th className="p-3">Documento</th></tr></thead>
          <tbody>{quotes.map((quote) => <tr key={quote.id} className="border-b last:border-0">
            <td className="p-3"><Link className="font-bold underline" href={`/admin/quotes/${quote.id}`}>{quoteNumber(quote)}</Link><div className="mt-1 text-xs text-neutral-500">{quote.createdAt.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}</div></td>
            <td className="p-3">{quote.fullName}</td><td className="p-3">{quote.validUntil.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}</td>
            <td className="p-3 text-right font-semibold">{(quote.totalCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</td>
            <td className="p-3"><div className="flex flex-wrap items-center gap-3"><Link className="underline" href={`/admin/quotes/${quote.id}`}>Apri preventivo</Link><QuoteEmailComposer id={quote.id} number={quoteNumber(quote)} email={quote.email} name={quote.fullName} localDevelopment={process.env.NODE_ENV !== "production"} disabled={databaseReadOnly || !!quote.paidAt || quote.validUntil.getTime() <= new Date().getTime()} /></div></td>
          </tr>)}</tbody>
        </table></div>
      </>}
      {quotes.length === 100 && <p className="mt-3 text-xs text-neutral-500">Mostrati gli ultimi 100 preventivi.</p>}
    </section>
  </div>;
}
