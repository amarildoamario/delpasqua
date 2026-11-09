import InfoTooltip from "./InfoTooltip";
import ActivityHistogram from "./ActivityHistogram";
import Link from "next/link";
import type { readCommerceInsights } from "@/lib/server/commerceInsights";
import type { readCustomerMetrics } from "@/lib/server/customerMetrics";
import { CUSTOMER_SEGMENTS, CUSTOMER_RULES } from "@/lib/server/customerMetrics";

type Insights = Awaited<ReturnType<typeof readCommerceInsights>>;
type Customers = Awaited<ReturnType<typeof readCustomerMetrics>>;
const number = (value: number | null, digits = 1) => value === null ? "—" : new Intl.NumberFormat("it-IT", { maximumFractionDigits: digits }).format(value);

export default function CommerceInsights({ insights, customers }: { insights: Insights; customers: Customers }) {
  const { stripe, decision } = insights;
  return <div className="space-y-4">
    <div className="grid gap-3 md:grid-cols-3">
      <section className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="flex items-center gap-1 text-sm font-bold">Provenienza automatica<InfoTooltip label="Provenienza automatica" description="Una sessione viene attribuita alla fonte della sua prima visita nel periodo. Riconosciamo Instagram, Facebook e Google tramite indizi specifici del browser o il dominio del referrer, senza link speciali. Chrome da solo non significa Google; senza segnali la fonte resta diretta o sconosciuta. I vecchi dati si possono riclassificare solo quando conservano questi indizi." /></h2>
        <p className="mt-1 text-xs text-neutral-500">Sessioni per firma del browser o referrer, senza link speciali.</p>
        <dl className="mt-3 space-y-2 text-sm">{insights.acquisition.map((s) => <div key={s.source} className="flex justify-between gap-2"><dt>{s.label}</dt><dd className="font-bold">{number(s.sessions, 0)}</dd></div>)}</dl>
        <p className="mt-3 text-xs text-neutral-500">Attribuzione stimata sulle sessioni misurate nel periodo.</p>
      </section>
      <section className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="flex items-center gap-1 text-sm font-bold">Fuga da Stripe osservata<InfoTooltip label="Fuga da Stripe osservata" description="Considera i checkout commerciali Stripe creati nel periodo. Il rapporto è annullati non pagati / (annullati non pagati + pagati della stessa coorte), osservati fino alla fine del periodo. I ritorni checkout_canceled sono deduplicati per ordine. Chi annulla e poi paga viene contato tra i pagati. Checkout ancora in corso o senza ritorno misurato restano separati: non sono abbandoni certi. Senza esiti il tasso non è disponibile." /></h2>
        <p className="mt-2 text-2xl font-extrabold">{stripe.exitRate === null ? "—" : `${number(stripe.exitRate * 100)}%`}</p>
        <p className="mt-2 text-xs text-neutral-600">{stripe.canceledUnpaid} annullati non pagati / ({stripe.canceledUnpaid} annullati + {stripe.paid} pagati).</p>
        <p className="mt-2 text-xs text-neutral-500">{stripe.started} checkout nel periodo · {stripe.recovered} recuperati · {stripe.pendingOrUnobserved} in corso o senza ritorno misurato.</p>
      </section>
      <section className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="flex items-center gap-1 text-sm font-bold">Tempo di decisione<InfoTooltip label="Tempo di decisione" description="Media dei giorni e delle sessioni distinte dalla prima visita misurata al pagamento degli ordini del periodo. La prima visita può essere precedente alle date selezionate. Il collegamento anonimo viene salvato prima di aprire Stripe, quindi non serve tornare alla pagina di conferma. La copertura indica quanti ordini hanno una storia misurabile; cookie cancellati o altri dispositivi interrompono la storia." /></h2>
        <p className="mt-2 text-2xl font-extrabold">{number(decision.avgDays, 2)} giorni</p>
        <p className="mt-1 text-sm">{number(decision.avgSessions)} sessioni medie</p>
        <p className="mt-3 text-xs text-neutral-500">Prima visita misurata → pagamento. Copertura: {decision.samples} su {decision.paidOrders} ordini pagati nel periodo.</p>
      </section>
    </div>
    <section className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-1 text-sm font-bold">Clienti e LTV storico<InfoTooltip label="Clienti e LTV storico" description="Usa l'intera cronologia dei pagamenti in euro fino a oggi, indipendentemente dal filtro temporale. Ogni email viene normalizzata prima di unire gli ordini; ordini test e non pagati sono esclusi. LTV netto = totale pagato meno rimborsi. Il valore medio divide il netto storico per i clienti identificabili. Nel dettaglio clienti trovi lordo, rimborsi, netto e storico." /></h2><Link href="/admin/customers" className="text-xs font-semibold underline">Apri clienti e segmenti</Link></div>
      <p className="mt-2 text-sm">{customers.totalCustomers} clienti · LTV medio netto: <b>{customers.avgLtvCents === null ? "—" : new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(customers.avgLtvCents / 100)}</b></p>
      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-neutral-600">Segmenti clienti<InfoTooltip label="Segmenti clienti" description={`Segmenti esclusivi calcolati oggi su tutta la storia: prima i dormienti, senza acquisti da almeno ${CUSTOMER_RULES.dormantDays} giorni; poi VIP con almeno ${CUSTOMER_RULES.vipCanLiters} litri storici di olio in latta e LTV positivo; nuovi con un solo pagamento negli ultimi ${CUSTOMER_RULES.newDays} giorni; gli altri sono attivi. Ordini interamente rimborsati non qualificano per VIP. I link aprono la lista filtrata; non vengono inviati messaggi automaticamente.`} /></div>
      <div className="mt-2 flex flex-wrap gap-2">{Object.entries(CUSTOMER_SEGMENTS).map(([key, label]) => <Link key={key} href={`/admin/customers?segment=${key}`} className="rounded-xl bg-neutral-100 px-3 py-2 text-xs font-semibold">{label}: {customers.segments[key as keyof typeof CUSTOMER_SEGMENTS]}</Link>)}</div>
      <p className="mt-3 text-xs text-neutral-500">Intera storia fino a oggi, indipendente dal filtro temporale. Netto = pagato − rimborsi.</p>
    </section>
    <div className="space-y-4"><ActivityHistogram title="Attività nelle 24 ore" rows={insights.hourly} description="Somma visite (sessioni uniche), carrelli con almeno un'aggiunta e ordini pagati per ora italiana nel periodo selezionato. Ogni visita o carrello compare nella prima fascia osservata nel periodo; gli ordini sono collocati all'ora effettiva del pagamento. Le tre serie condividono la stessa scala, con gestione dell'ora legale. La tabella contiene i valori esatti." /><ActivityHistogram title="Attività per giorno della settimana" rows={insights.weekdays} description="Confronta visite, carrelli con aggiunte e ordini pagati dal lunedì alla domenica, sommando le occorrenze nel periodo selezionato. Sono conteggi totali, non medie per giorno. Visite e carrelli sono assegnati al primo giorno osservato nel periodo; ordini al giorno del pagamento, nel fuso Europe/Rome." /></div>
    <p className="text-xs text-neutral-500">Orario Europe/Rome, inclusa ora legale. Visite = sessioni; carrelli = carrelli con aggiunte. Ogni visita/carrello compare nella prima fascia osservata nel periodo; gli ordini all’ora del pagamento.</p>
  </div>;
}
