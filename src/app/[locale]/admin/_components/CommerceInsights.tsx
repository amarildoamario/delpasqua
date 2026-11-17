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
const percent = (value: number | null) => value === null ? "—" : `${number(value * 100, 2)}%`;
const funnelCard = "min-w-0 rounded-[5px] border border-transparent bg-[linear-gradient(#fff,#fff),linear-gradient(120deg,#3b82f6,#ef4444)] [background-clip:padding-box,border-box] [background-origin:border-box] p-2.5 [overflow-wrap:anywhere]";

function FunnelCard({ label, value, detail }: { label: string; value: number; detail?: string }) {
  return (
    <div className={funnelCard}>
      <dt className="text-[11px] font-semibold leading-tight text-neutral-600">{label}</dt>
      <dd className="mt-1 text-base font-extrabold tabular-nums text-neutral-900">{number(value, 0)}</dd>
      {detail && <dd className="text-[11px] text-neutral-600">{detail}</dd>}
    </div>
  );
}

export default function CommerceInsights({ insights, customers, activity, activityLinks = [] }: {
  insights: Insights; customers: Customers;
  activity?: Awaited<ReturnType<typeof readActivityTimeline>>;
  activityLinks?: { key: string; label: string; href: string }[];
}) {
  const { stripe, decision, sessionFunnel, cartFunnel, checkoutCohort } = insights;
  const weeklyMax = Math.max(1, ...insights.weekdays.flatMap((row) => [row.visits, row.orders]));
  return <div className="space-y-3 sm:space-y-4 min-w-0 max-w-full">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
      <section className="col-span-2 md:col-span-1 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
        <h2 className="flex items-center gap-1 text-xs sm:text-sm font-bold">Provenienza automatica<InfoTooltip label="Provenienza automatica" description="Una sessione viene attribuita alla fonte della sua prima visita nel periodo. Riconosciamo Instagram, Facebook e Google tramite indizi specifici del browser o il dominio del referrer, senza link speciali. Chrome da solo non significa Google; senza segnali la fonte resta diretta o sconosciuta. Gli ordini senza sessione (es. Preventivo PDF aperto con redirect diretto) compaiono in Non attribuito così il totale ordini riconcilia sempre." /></h2>
        <p className="mt-0.5 text-[11px] text-neutral-500">Sessioni per firma browser/referrer (ordini tra parentesi).</p>
        <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:text-sm">{insights.acquisition.map((s) => (
          <div key={s.source} className="flex items-center justify-between gap-1.5 border-b border-neutral-100 pb-1">
            <dt className="text-neutral-700 truncate">{s.label}</dt>
            <dd className="text-right shrink-0 tabular-nums">
              <span className="font-bold text-neutral-900">{number(s.sessions, 0)}</span>
              {s.orders > 0 ? (
                <span className="ml-1 text-[10px] font-semibold text-emerald-700">
                  ({s.orders})
                </span>
              ) : null}
            </dd>
          </div>
        ))}</dl>
      </section>
      <section className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
        <h2 className="flex items-center gap-1 text-xs sm:text-sm font-bold leading-tight">Checkout annullati<InfoTooltip label="Checkout annullati o scaduti" description="Considera i checkout commerciali Stripe creati nel periodo. Conta una volta i checkout non pagati con ritorno di annullamento o con annullamento, scadenza o fallimento registrati nel database entro la fine del periodo. Il rapporto è checkout chiusi senza pagamento / (checkout chiusi senza pagamento + pagati della stessa coorte). Chi poi paga viene contato tra i pagati. I checkout ancora in corso restano separati. Gli ordini di prova sono esclusi." /></h2>
        <p className="mt-1.5 text-xl sm:text-2xl font-extrabold tabular-nums">{stripe.exitRate === null ? "—" : `${number(stripe.exitRate * 100)}%`}</p>
        <p className="mt-1 text-[11px] text-neutral-600 leading-tight">{stripe.canceledUnpaid} chiusi / ({stripe.canceledUnpaid} + {stripe.paid} pagati)</p>
        <p className="mt-1 text-[10px] text-neutral-500 leading-tight">{stripe.started} avviati · {stripe.recovered} rec. · {stripe.pendingOrUnobserved} in corso</p>
        {checkoutCohort ? (
          <p className="mt-1 text-[10px] text-neutral-500 leading-tight">
            Stati non pagati: {checkoutCohort.expiredUnpaid} scad. · {checkoutCohort.canceledUnpaid} annull. · {checkoutCohort.failedUnpaid} fall. · {checkoutCohort.canceledReturnOpen} ritorno cancel
          </p>
        ) : null}
      </section>
      <section className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
        <h2 className="flex items-center gap-1 text-xs sm:text-sm font-bold leading-tight">Tempo decisione<InfoTooltip label="Tempo di decisione" description="Media dei giorni e delle sessioni distinte dalla prima visita misurata al pagamento degli ordini del periodo. La prima visita può essere precedente alle date selezionate. Il collegamento anonimo viene salvato prima di aprire Stripe, quindi non serve tornare alla pagina di conferma. La copertura indica quanti ordini hanno una storia misurabile; cookie cancellati o altri dispositivi interrompono la storia." /></h2>
        <p className="mt-1.5 text-xl sm:text-2xl font-extrabold tabular-nums">{number(decision.avgDays, 2)} gg</p>
        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-neutral-700">{number(decision.avgSessions)} sess. medie</p>
        <p className="mt-1 text-[10px] text-neutral-500 leading-tight">Copertura: {decision.samples}/{decision.paidOrders} ordini</p>
      </section>
    </div>
    <div className="min-w-0 space-y-3" aria-labelledby="commerce-funnels">
      <h2 id="commerce-funnels" className="border-b border-neutral-200 pb-1.5 text-sm font-extrabold text-neutral-900 sm:text-base">Funnel di conversione</h2>
      {sessionFunnel ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1 text-xs sm:text-sm font-bold">
              Funnel per Sessione (Coorte)<InfoTooltip label="Funnel per Sessione (Coorte)" description="Misura sulla stessa popolazione di sessioni iniziate nel periodo quante visitano il blog, lo shop, aprono una scheda prodotto, aggiungono al carrello dopo la vista prodotto, avviano il checkout e completano un acquisto collegato. Ogni sessione conta al massimo una volta per step." />
            </h3>
            <span className="text-[11px] text-neutral-500">
              Sessioni coorte: <b>{number(sessionFunnel.sessions, 0)}</b> · Tasso acquisto sessione: <b>{sessionFunnel.purchaseRate === null ? "—" : `${number(sessionFunnel.purchaseRate * 100, 2)}%`}</b>
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 text-xs">
            <div className={funnelCard}>
              <div className="text-[10px] font-semibold uppercase text-neutral-500">Sessioni Blog</div>
              <div className="mt-0.5 text-sm font-extrabold text-neutral-900 tabular-nums">{number(sessionFunnel.blogSessions, 0)}</div>
              <div className="text-[10px] text-neutral-500">→ Prodotto: {sessionFunnel.blogToProductRate === null ? "—" : `${number(sessionFunnel.blogToProductRate * 100)}%`}</div>
            </div>
            <div className={funnelCard}>
              <div className="text-[10px] font-semibold uppercase text-neutral-500">Sessioni Shop</div>
              <div className="mt-0.5 text-sm font-extrabold text-neutral-900 tabular-nums">{number(sessionFunnel.shopSessions, 0)}</div>
              <div className="text-[10px] text-neutral-500">Lista o scheda</div>
            </div>
            <div className={funnelCard}>
              <div className="text-[10px] font-semibold uppercase text-neutral-500">Scheda Prodotto</div>
              <div className="mt-0.5 text-sm font-extrabold text-neutral-900 tabular-nums">{number(sessionFunnel.productDetailSessions, 0)}</div>
              <div className="text-[10px] text-neutral-500">Reach: {sessionFunnel.productReachRate === null ? "—" : `${number(sessionFunnel.productReachRate * 100)}%`}</div>
            </div>
            <div className={funnelCard}>
              <div className="text-[10px] font-semibold uppercase text-neutral-500">Sessioni Add-to-Cart</div>
              <div className="mt-0.5 text-sm font-extrabold text-neutral-900 tabular-nums">{number(sessionFunnel.addToCartSessions, 0)}</div>
              <div className="text-[10px] text-neutral-500">Da scheda: {sessionFunnel.productToCartRate === null ? "—" : `${number(sessionFunnel.productToCartRate * 100)}%`}</div>
            </div>
            <div className={funnelCard}>
              <div className="text-[10px] font-semibold uppercase text-neutral-500">Checkout Avviato</div>
              <div className="mt-0.5 text-sm font-extrabold text-neutral-900 tabular-nums">{number(sessionFunnel.checkoutStartedSessions, 0)}</div>
              <div className="text-[10px] text-neutral-500">Clic cassa: {number(sessionFunnel.checkoutClickedSessions, 0)}</div>
            </div>
            <div className={funnelCard}>
              <div className="text-[10px] font-semibold uppercase text-neutral-500">Sessioni Acquisto</div>
              <div className="mt-0.5 text-sm font-extrabold text-emerald-700 tabular-nums">{number(sessionFunnel.purchasingSessions, 0)}</div>
              <div className="text-[10px] text-neutral-500">Collegate a ordine</div>
            </div>
          </div>
        </section>
      ) : null}
      <section className="min-w-0 rounded-[5px] border border-neutral-200 bg-white p-3 sm:p-4">
        <h3 className="flex items-center gap-1 text-xs font-bold sm:text-sm">Funnel carrelli<InfoTooltip label="Funnel carrelli" description="Segue i carrelli che hanno ricevuto almeno un'aggiunta nel periodo selezionato. Un carrello può arrivare al checkout senza aprire la pagina del carrello." /></h3>
        <dl className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          <FunnelCard label="Con aggiunte" value={cartFunnel.cartsWithAdditions} />
          <FunnelCard label="Carrelli visualizzati" value={cartFunnel.cartsViewed} />
          <FunnelCard label="Clic al checkout" value={cartFunnel.cartsWithCheckoutClick} detail={percent(cartFunnel.checkoutStartRate)} />
          <FunnelCard label="Checkout senza vista del carrello" value={cartFunnel.cartsBypassingCartView} />
          <FunnelCard label="Carrelli con ordine pagato" value={cartFunnel.cartsWithPaidOrder} detail={percent(cartFunnel.purchaseRate)} />
        </dl>
      </section>
      <section className="min-w-0 rounded-[5px] border border-neutral-200 bg-white p-3 sm:p-4">
        <h3 className="flex items-center gap-1 text-xs font-bold sm:text-sm">Funnel checkout Stripe<InfoTooltip label="Funnel checkout Stripe" description="Segue i checkout Stripe avviati nel periodo. I recuperati sono già inclusi nei pagati. I ritorni dalla pagina di annullamento restano separati dalle chiusure definitive." /></h3>
        <dl className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          <FunnelCard label="Checkout avviati" value={checkoutCohort.stripeCheckoutsStarted} />
          <FunnelCard label="In corso" value={checkoutCohort.openPending} />
          <FunnelCard label="Ritorni da annullamento" value={checkoutCohort.canceledReturnOpen} />
          <FunnelCard label="Chiusi senza pagamento" value={checkoutCohort.definitiveClosedUnpaid} detail={percent(checkoutCohort.definitiveCloseRate)} />
          <FunnelCard label="Pagati" value={checkoutCohort.paid} detail={percent(checkoutCohort.paidRate)} />
          <FunnelCard label="Di cui recuperati" value={checkoutCohort.recoveredAfterCancelOrClose} />
        </dl>
      </section>
    </div>
    <section className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-1 text-xs sm:text-sm font-bold">Clienti e LTV storico<InfoTooltip label="Clienti e LTV storico" description="Usa l'intera cronologia dei pagamenti in euro fino a oggi, indipendentemente dal filtro temporale. Ogni email viene normalizzata prima di unire gli ordini; ordini test e non pagati sono esclusi. LTV netto = totale pagato meno rimborsi. Il valore medio divide il netto storico per i clienti identificabili. Nel dettaglio clienti trovi lordo, rimborsi, netto e storico." /></h2><Link href="/admin/customers" className="text-xs font-semibold underline">Apri clienti e segmenti</Link></div>
      <p className="mt-1.5 text-xs sm:text-sm">{customers.totalCustomers} clienti · LTV medio netto: <b>{customers.avgLtvCents === null ? "—" : new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(customers.avgLtvCents / 100)}</b></p>
      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-neutral-600">Segmenti clienti<InfoTooltip label="Segmenti clienti" description={`Segmenti esclusivi calcolati oggi su tutta la storia: prima i dormienti, senza acquisti da almeno ${CUSTOMER_RULES.dormantDays} giorni; poi VIP con almeno ${CUSTOMER_RULES.vipCanLiters} litri storici di olio in latta e LTV positivo; nuovi con un solo pagamento negli ultimi ${CUSTOMER_RULES.newDays} giorni; gli altri sono attivi. Ordini interamente rimborsati non qualificano per VIP. I link aprono la lista filtrata; non vengono inviati messaggi automaticamente.`} /></div>
      <div className="mt-2 grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">{Object.entries(CUSTOMER_SEGMENTS).map(([key, label]) => <Link key={key} href={`/admin/customers?segment=${key}`} className="rounded-xl bg-neutral-100 px-2.5 py-2 text-xs font-semibold text-center sm:text-left hover:bg-neutral-200 transition-colors">{label}: <b>{customers.segments[key as keyof typeof CUSTOMER_SEGMENTS]}</b></Link>)}</div>
      <p className="mt-2 text-[11px] text-neutral-500">Intera storia fino a oggi, indipendente dal filtro temporale. Netto = pagato − rimborsi.</p>
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
