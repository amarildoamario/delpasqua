import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/server/prisma";
import { QuoteStoredLinesSchema, quoteNumber } from "@/lib/server/quotes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Il tuo preventivo | Frantoio Del Pasqua", robots: { index: false, follow: false }, referrer: "no-referrer" };
const euro = (cents: number) => (cents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
const errors: Record<string, string> = { rate: "Troppi tentativi. Attendi un minuto prima di riprovare.", expired: "Il preventivo è scaduto o prossimo alla scadenza. Contattaci per aggiornarlo.", paid: "Pagamento ricevuto o in elaborazione. Non effettuare un secondo pagamento.", stock: "Disponibilità insufficiente. Contattaci prima di pagare.", unavailable: "Il pagamento non è disponibile al momento. Riprova tra poco o contattaci." };
export default async function QuotePaymentPage({ params, searchParams }: {
  params: Promise<{ token: string }>; searchParams: Promise<{ error?: string; cancelled?: string }>;
}) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();
  const quote = await prisma.quote.findUnique({ where: { paymentToken: token } });
  if (!quote) notFound();
  const expired = quote.validUntil.getTime() <= new Date().getTime();
  const { error, cancelled } = await searchParams;
  if (!quote.paidAt && !expired && !error && cancelled !== "1") redirect(`/api/quotes/${token}/checkout/`);
  const items = QuoteStoredLinesSchema.parse(quote.items);
  return <main className="mx-auto max-w-3xl px-5 py-12">
    <div className="rounded-[5px] border border-neutral-200 bg-white p-6 sm:p-8">
      <p className="text-sm font-extrabold tracking-widest text-red-700">PREVENTIVO</p>
      <h1 className="mt-2 text-2xl font-bold">{quoteNumber(quote)}</h1>
      <p className="mt-2 text-sm text-neutral-500">Valido fino al {quote.validUntil.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}</p>
      <section className="mt-6 border-t pt-5"><h2 className="font-bold">Indirizzo di spedizione</h2>
        <p className="mt-2 text-sm leading-relaxed">{quote.fullName}<br />{quote.addressLine1}{quote.addressLine2 ? `, ${quote.addressLine2}` : ""}<br />{quote.postalCode} {quote.city} {quote.province} · {quote.countryCode}</p>
        <p className="mt-2 break-words text-sm text-neutral-600">{quote.email}{quote.phone ? ` · ${quote.phone}` : ""}</p>
      </section>
      <section className="mt-6 border-t pt-5"><h2 className="font-bold">Prodotti concordati</h2>
        <div className="mt-3 divide-y">{items.map((item, i) => <div key={i} className="flex items-start justify-between gap-4 py-3 text-sm">
          <div className="min-w-0"><p className="break-words font-semibold">{item.qty} × {item.title}</p><p className="mt-1 break-words text-neutral-500">{item.variantLabel}</p></div><span className="shrink-0 font-semibold">{euro(item.lineSubtotalCents)}</span>
        </div>)}</div>
        <div className="mt-3 space-y-2 border-t pt-4 text-sm"><p className="flex justify-between">Subtotale prodotti <span>{euro(quote.subtotalCents)}</span></p>
          {quote.discountCents > 0 && <p className="flex justify-between">Sconto <span>−{euro(quote.discountCents)}</span></p>}
          <p className="flex justify-between">Spedizione <span>{euro(quote.shippingCents)}</span></p>
          <p className="flex justify-between rounded-[5px] bg-emerald-50 px-3 py-3 text-lg font-bold text-emerald-900">Totale IVA inclusa <span>{euro(quote.totalCents)}</span></p>
        </div>
      </section>
      <section className="mt-6 border-t pt-5 text-sm"><h2 className="font-bold">Condizioni di spedizione</h2><p className="mt-2 whitespace-pre-wrap break-words text-neutral-600">{quote.shippingTerms}</p>
        {quote.notes && <p className="mt-3 whitespace-pre-wrap break-words text-neutral-600">{quote.notes}</p>}
      </section>
      {quote.paidAt ? <p role="status" className="mt-6 rounded-[5px] bg-emerald-50 p-4 font-bold text-emerald-900">Questo preventivo risulta pagato. Grazie!</p>
        : expired ? <p role="status" className="mt-6 rounded-[5px] bg-red-50 p-4 text-red-800">Il preventivo è scaduto. Contattaci per aggiornarlo.</p>
        : <div className="mt-6 space-y-4 border-t pt-5">
          {cancelled === "1" && <p className="text-sm text-neutral-600">Pagamento non completato. Puoi riprenderlo quando vuoi, entro la validit? del preventivo.</p>}
          <Link prefetch={false} href={`/api/quotes/${token}/checkout/`} className="inline-flex w-full items-center justify-center gap-3 rounded-[5px] bg-sky-600 px-5 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600">Vai al pagamento <ArrowRight aria-hidden="true" className="h-5 w-5" /></Link>
          <p className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-800"><ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0" />Pagamento sicuro tramite Stripe</p>
        </div>}
      {error && errors[error] && !quote.paidAt && <p role="alert" className="mt-4 rounded-[5px] bg-red-50 p-3 text-sm text-red-800">{errors[error]}</p>}
    </div>
  </main>;
}
