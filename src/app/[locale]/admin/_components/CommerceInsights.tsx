import InfoTooltip from "./InfoTooltip";
import ActivityHistogram from "./ActivityHistogram";
import Link from "next/link";
import type { readCommerceInsights } from "@/lib/server/commerceInsights";
import type { readCustomerMetrics } from "@/lib/server/customerMetrics";
import type { readActivityTimeline } from "@/lib/server/activityTimeline";
import { CUSTOMER_SEGMENTS, CUSTOMER_RULES } from "@/lib/server/customerMetrics";

type Insights = Awaited<ReturnType<typeof readCommerceInsights>>;
type Customers = Awaited<ReturnType<typeof readCustomerMetrics>>;
const number = (value: number | null, digits = 1) => value === null ? "—" : new Intl.NumberFormat("it-IT", { maximumFractionDigits: digits }).format(value);

export default function CommerceInsights({ insights, customers, activity, activityLinks = [] }: {
  insights: Insights; customers: Customers;
  activity?: Awaited<ReturnType<typeof readActivityTimeline>>;
  activityLinks?: { key: string; label: string; href: string }[];
}) {
  const { stripe, decision } = insights;
  const weeklyMax = Math.max(1, ...insights.weekdays.flatMap((row) => [row.visits, row.orders]));
  return <div className="space-y-4">
    <div className="grid gap-3 md:grid-cols-3">
      <section className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="flex items-center gap-1 text-sm font-bold">Provenienza automatica<InfoTooltip label="Provenienza automatica" description="Una sessione viene attribuita alla fonte della sua prima visita nel periodo. Riconosciamo Instagram, Facebook e Google tramite indizi specifici del browser o il dominio del referrer, senza link speciali. Chrome da solo non significa Google; senza segnali la fonte resta diretta o sconosciuta. I vecchi dati si possono riclassificare solo quando conservano questi indizi." /></h2>
        <p className="mt-1 text-xs text-neutral-500">Sessioni per firma del browser o referrer, senza link speciali.</p>
        <dl className="mt-3 space-y-2 text-sm">{insights.acquisition.map((s) => (
          <div key={s.source} className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-1">
            <dt className="text-neutral-700">{s.label}</dt>
            <dd className="text-right">
              <span className="font-bold text-neutral-900">{number(s.sessions, 0)}</span>
              {s.orders > 0 ? (
                <span className="ml-2 text-xs font-semibold text-emerald-700">
                  {s.orders} {s.orders === 1 ? "ordine" : "ordini"} ({s.conversionRate !== null ? `${number(s.conversionRate * 100)}%` : "—"})
                </span>
              ) : null}
            </dd>
          </div>
        ))}</dl>
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
    <div id="activity-timeline" className="scroll-mt-6 space-y-8 border-t border-neutral-200 pt-6">
      <ActivityHistogram
        title="Attività nel tempo"
        subtitle={activity?.subtitle ?? `${insights.hourlyDay.split("-").reverse().join("/")} · Dalle 00:00 alle 24:00`}
        rows={activity?.rows ?? insights.hourly}
        description="I pulsanti cambiano solo questo grafico, prendendo come riferimento la data finale del filtro in alto. Giorno va da mezzanotte a mezzanotte; 7, 30 e 90 giorni includono quella data e i giorni precedenti. Ultima ora mostra i 60 minuti più recenti per oggi, oppure l'ultima ora della data storica. Ogni visita e carrello sono contati una volta nella prima fascia osservata nell'intervallo, gli ordini alla data del pagamento. Le fasce sono consecutive: nessun evento viene saltato."
        footer="Orario italiano. Fasce consecutive, comprese quelle a zero. Nei cambi di ora legale i giorni possono durare 23 o 25 ore. Le altre sezioni seguono il filtro generale."
        controls={activityLinks.length ? <nav className="mt-4 flex flex-wrap gap-2" aria-label="Periodo del grafico attività">{activityLinks.map((item) => <Link key={item.key} href={item.href} scroll={false} prefetch={false} aria-current={activity?.key === item.key ? "page" : undefined} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${activity?.key === item.key ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>{item.label}</Link>)}</nav> : undefined}
      />
      <section aria-label="Attività per giorno della settimana" className="space-y-3">
        <div><h2 className="text-base font-bold text-neutral-900">Attività per giorno della settimana</h2><p className="mt-1 text-xs text-neutral-500">Intero periodo selezionato · Due grafici della stessa larghezza e con la stessa scala.</p></div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActivityHistogram title="Visite per giorno" subtitle="Sessioni uniche nel periodo" rows={insights.weekdays} seriesKeys={["visits"]} axisMaximum={weeklyMax} description="Ogni sessione è attribuita al primo giorno osservato nel periodo generale. I giorni con zero visite conservano la propria colonna, con altezza zero." />
          <ActivityHistogram title="Ordini per giorno" subtitle="Ordini pagati nel periodo" rows={insights.weekdays} seriesKeys={["orders"]} axisMaximum={weeklyMax} description="Ordini commerciali pagati, attribuiti al giorno del pagamento in Italia. Ogni ordine viene contato una volta. La scala è la stessa del grafico delle visite; gli zeri restano a zero." />
        </div>
      </section>
    </div>
  </div>;
}
