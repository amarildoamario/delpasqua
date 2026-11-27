import InfoTooltip from "./InfoTooltip";
import ActivityHistogram from "./ActivityHistogram";
import BlogCardMetrics from "./BlogCardMetrics";
import Kpi, { KPI_VALUE_CLASS } from "./Kpi";
import Link from "next/link";
import type { readCommerceInsights } from "@/lib/server/commerceInsights";
import type { readCustomerMetrics } from "@/lib/server/customerMetrics";
import type { readActivityTimeline } from "@/lib/server/activityTimeline";
import { CUSTOMER_SEGMENTS, CUSTOMER_RULES } from "@/lib/server/customerMetrics";

type Insights = Awaited<ReturnType<typeof readCommerceInsights>>;
type Customers = Awaited<ReturnType<typeof readCustomerMetrics>>;
const number = (value: number | null, digits = 1) => value === null ? "—" : new Intl.NumberFormat("it-IT", { maximumFractionDigits: digits }).format(value);
const percent = (value: number | null) => value === null ? "—" : `${number(value * 100, 2)}%`;
const stripeChannelLabels = {
  shop: "Shop",
  quote: "Preventivi PDF",
  voucher: "Acquisto voucher degustazione",
  tasting: "Prenotazioni degustazione con pagamento diretto",
};
const cartFunnelSteps = {
  additions: {
    label: "Con aggiunte",
    description: "Carrelli distinti in cui è stato aggiunto almeno un prodotto nel periodo selezionato.",
  },
  viewed: {
    label: "Carrelli visualizzati",
    description: "Tra i carrelli con aggiunte, quanti sono stati visualizzati sul sito nel periodo.",
  },
  notViewed: {
    label: "Carrelli non visualizzati",
    description: "Tra i carrelli con aggiunte, quanti risultano senza una visualizzazione registrata nel periodo.",
  },
  checkout: {
    label: "Clic al checkout",
    description: "Carrelli distinti con almeno un clic per andare in cassa dopo un’aggiunta. La percentuale è calcolata sui carrelli con aggiunte.",
  },
  checkoutWithView: {
    label: "Clic con vista del carrello",
    description: "Carrelli che hanno registrato sia una visualizzazione del carrello sia un clic per andare in cassa nel periodo.",
  },
  checkoutWithoutView: {
    label: "Clic senza vista del carrello",
    description: "Carrelli con un clic per andare in cassa e senza una visualizzazione del carrello registrata nel periodo.",
  },
  paid: {
    label: "Carrelli con ordine pagato",
    description: "Carrelli con aggiunte collegati ad almeno un ordine pagato nel periodo. La percentuale è calcolata sui carrelli con aggiunte.",
  },
};

function FunnelCard({ label, value, detail, description }: { label: string; value: number; detail?: string; description?: string }) {
  return <Kpi title={label} value={number(value, 0)} subtitle={detail} description={description} funnel />;
}

function ShopSessionsDiagram({ funnel }: { funnel: Insights["sessionFunnel"] }) {
  const { listOnly, listAndDetail, detailOnly, listPageViews } = funnel.shopBreakdown;

  return (
    <figure className="mt-4 rounded-xl border border-neutral-200 bg-white p-3 sm:p-4">
      <figcaption className="text-sm font-bold text-neutral-900">Composizione delle sessioni Shop</figcaption>
      <div className="mt-3 grid items-stretch gap-1 text-center sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,3fr)] sm:gap-3">
        <div className="mx-auto w-full max-w-44 sm:max-w-none">
          <FunnelDiagramBlock label="Sessioni Shop" count={funnel.shopSessions} />
        </div>
        <span aria-hidden="true" className="self-center text-base font-semibold leading-none text-neutral-500">=</span>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-1 sm:gap-3">
          <FunnelDiagramBlock
            label="Solo elenco"
            count={listOnly}
            description="Sessioni in cui è stato aperto l’elenco Shop almeno una volta, senza aprire alcuna scheda prodotto."
          />
          <span aria-hidden="true" className="self-center text-base font-semibold text-neutral-500">+</span>
          <FunnelDiagramBlock
            label="Elenco e schede"
            count={listAndDetail}
            description="Sessioni in cui sono stati aperti sia l’elenco Shop sia almeno una scheda prodotto, in qualsiasi ordine. Ogni sessione conta una volta."
          />
          <span aria-hidden="true" className="self-center text-base font-semibold text-neutral-500">+</span>
          <FunnelDiagramBlock
            label="Solo schede"
            count={detailOnly}
            description="Sessioni in cui è stata aperta almeno una scheda prodotto, senza passare dall’elenco Shop. Ad esempio, da una card del blog o da un link diretto."
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-neutral-700">
        <strong>{number(listPageViews, 0)} visualizzazioni dell’elenco</strong> in tutte le lingue, comprese le riaperture.
      </p>
    </figure>
  );
}

function FunnelDiagramBlock({ label, count, description }: {
  label: string;
  count: number;
  description?: string;
}) {
  return (
    <div className={`cart-funnel-block relative grid min-h-20 min-w-0 content-center justify-items-center gap-1.5 rounded-lg border px-2 py-3 text-center text-neutral-900 shadow-xs sm:min-h-[5.25rem] sm:px-4`}>
      <strong className={`max-w-full break-all ${KPI_VALUE_CLASS}`}>{number(count, 0)}</strong>
      <span className="text-[11px] leading-snug font-bold tracking-wide text-pretty text-neutral-600 uppercase">{label}</span>
      {description ? (
        <div className="absolute top-0.5 right-0.5">
          <InfoTooltip label={label} description={description} />
        </div>
      ) : null}
    </div>
  );
}

function CartDiagramArrow({ warm = false, className = "" }: { warm?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={`cart-funnel-arrow ${className} ${warm ? "text-[#906b34]" : "text-[#758a83]"}`} />
  );
}

function CartFunnelDiagram({ funnel }: { funnel: Insights["cartFunnel"] }) {
  const paidWithoutClick = funnel.cartsWithPaidOrder - funnel.cartsWithCheckoutClickAndPaidOrder;
  const paths = [
    {
      view: cartFunnelSteps.viewed,
      count: funnel.cartsViewed,
      checkout: cartFunnelSteps.checkoutWithView,
      clicks: funnel.cartsWithCheckoutClick - funnel.cartsBypassingCartView,
      warm: false,
    },
    {
      view: cartFunnelSteps.notViewed,
      count: funnel.cartsWithAdditions - funnel.cartsViewed,
      checkout: cartFunnelSteps.checkoutWithoutView,
      clicks: funnel.cartsBypassingCartView,
      warm: true,
    },
  ] as const;

  return (
    <figure className="mt-4 rounded-xl border border-neutral-200 bg-white px-2.5 pt-5 pb-6 sm:px-6 sm:py-6">
      <figcaption className={`cart-funnel-caption text-center`}>
        <p className="inline-flex items-center gap-1 text-sm font-bold text-neutral-900">
          Percorso dei carrelli
          <InfoTooltip label="Percorso dei carrelli" description="Il diagramma parte dai carrelli con aggiunte e distingue quelli visualizzati da quelli senza una vista registrata. I due rami si riuniscono nei carrelli con un clic in cassa." />
        </p>
        {funnel.cartsWithAdditions === 0 && (
          <p className="mt-1 text-xs text-neutral-600">Nessun carrello con aggiunte nel periodo selezionato.</p>
        )}
      </figcaption>
      <div className={`cart-funnel-layout mx-auto mt-4 max-w-[32rem]`}>
        <div className={`cart-funnel-central mx-auto w-4/5 max-w-60`}>
          <FunnelDiagramBlock {...cartFunnelSteps.additions} count={funnel.cartsWithAdditions} />
        </div>
        <div aria-hidden="true" className="cart-funnel-split">
          <CartDiagramArrow className={`cart-funnel-arm cart-funnel-upper`} />
          <CartDiagramArrow className={`cart-funnel-arm cart-funnel-lower`} warm />
        </div>
        <div className={`cart-funnel-paths grid grid-cols-2`}>
          {paths.map((path) => (
            <div key={path.view.label} className={`cart-funnel-path row-span-5 mx-1.5 grid grid-rows-subgrid sm:mx-2.5`}>
              <CartDiagramArrow className="cart-funnel-vertical-only" warm={path.warm} />
              <FunnelDiagramBlock {...path.view} count={path.count} />
              <CartDiagramArrow warm={path.warm} />
              <FunnelDiagramBlock {...path.checkout} count={path.clicks} />
              <div aria-hidden="true" className={`cart-funnel-vertical-only mx-auto h-3 w-0.5 ${path.warm ? "bg-[#906b34]" : "bg-[#758a83]"}`} />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="cart-funnel-merge">
          <span className={`cart-funnel-tail cart-funnel-upper bg-[#758a83]`} />
          <span className={`cart-funnel-tail cart-funnel-lower bg-[#906b34]`} />
          <CartDiagramArrow className="cart-funnel-exit" />
        </div>
        <div className={`cart-funnel-central mx-auto w-4/5 max-w-60`}>
          <FunnelDiagramBlock {...cartFunnelSteps.checkout} count={funnel.cartsWithCheckoutClick} />
        </div>
        <CartDiagramArrow className={paidWithoutClick > 0 ? "invisible" : undefined} />
        <div className={`cart-funnel-central mx-auto w-4/5 max-w-60`}>
          <FunnelDiagramBlock {...cartFunnelSteps.paid} count={funnel.cartsWithPaidOrder} />
        </div>
        {paidWithoutClick > 0 && (
          <p className="col-span-full mt-2 text-center text-xs text-neutral-600">
            Tra i carrelli con ordine pagato, <strong>{number(funnel.cartsWithCheckoutClickAndPaidOrder, 0)}</strong> con clic al checkout tracciato e <strong>{number(paidWithoutClick, 0)}</strong> senza.
          </p>
        )}
      </div>
    </figure>
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
        <h2 className="flex items-center gap-1 text-xs sm:text-sm font-bold leading-tight">Uscite da Stripe senza pagamento<InfoTooltip label="Uscite da Stripe senza pagamento" description="Quota di uscite osservate tra i tentativi con pagamento, chiusura o ritorno di annullamento. Un ritorno di annullamento può lasciare la sessione Stripe aperta. Il funnel mostra il dettaglio per canale." /></h2>
        <p className="mt-1.5 text-xl sm:text-2xl font-extrabold tabular-nums">{stripe.exitRate === null ? "—" : `${number(stripe.exitRate * 100)}%`}</p>
        <p className="mt-1 text-[11px] text-neutral-600 leading-tight">{stripe.canceledUnpaid} uscite / ({stripe.canceledUnpaid} + {stripe.paid} pagati)</p>
        <p className="mt-1 text-[10px] text-neutral-500 leading-tight">{stripe.started} checkout Stripe creati · {stripe.recovered} rec. · {stripe.pendingOrUnobserved} in corso</p>
        {checkoutCohort ? (
          <p className="mt-1 text-[10px] text-neutral-500 leading-tight">
            {checkoutCohort.expiredUnpaid} scaduti · {checkoutCohort.canceledUnpaid} annullati · {checkoutCohort.failedUnpaid} falliti · {checkoutCohort.unknownClosedUnpaid} chiusi senza motivo registrato · {checkoutCohort.canceledReturnOpen} ritorni con sessione aperta
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
              Funnel per Sessione (Coorte)<InfoTooltip label="Funnel per Sessione (Coorte)" description="Conta le sessioni con almeno una pagina del sito vista nel periodo. Ogni sessione conta al massimo una volta per scheda, anche se genera più tentativi di checkout." />
            </h3>
            <span className="text-[11px] text-neutral-500">
              Sessioni coorte: <b>{number(sessionFunnel.sessions, 0)}</b> · Tasso acquisto sessione: <b>{sessionFunnel.purchaseRate === null ? "—" : `${number(sessionFunnel.purchaseRate * 100, 2)}%`}</b>
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6">
            <FunnelCard label="Sessioni Blog" value={sessionFunnel.blogSessions} detail={`→ Prodotto: ${sessionFunnel.blogToProductRate === null ? "—" : `${number(sessionFunnel.blogToProductRate * 100)}%`}`} />
            <FunnelCard label="Sessioni Shop" value={sessionFunnel.shopSessions} detail="Elenco o schede" description="Sessioni distinte con almeno una visita all’elenco Shop o a una scheda prodotto, in qualsiasi lingua." />
            <FunnelCard label="Sessioni con scheda prodotto" value={sessionFunnel.productDetailSessions} detail={sessionFunnel.productReachRate === null ? undefined : `${number(sessionFunnel.productReachRate * 100)}% di tutte le sessioni`} />
            <FunnelCard label="Sessioni Add-to-Cart" value={sessionFunnel.addToCartSessions} detail={`Da scheda: ${sessionFunnel.productToCartRate === null ? "—" : `${number(sessionFunnel.productToCartRate * 100)}%`}`} />
            <FunnelCard label="Visite con tentativo in cassa" value={sessionFunnel.checkoutStartedSessions} detail={`${number(sessionFunnel.checkoutClickedSessions, 0)} visite con clic in cassa`} />
            <FunnelCard label="Sessioni Acquisto" value={sessionFunnel.purchasingSessions} detail="Collegate a ordine" />
          </div>
          <ShopSessionsDiagram funnel={sessionFunnel} />
          <details className="mt-3 border-t border-neutral-200 pt-2 text-xs">
            <summary className="cursor-pointer font-semibold text-neutral-800">Sessioni shop per lingua</summary>
            <p className="mt-1 text-neutral-600">Lingua della pagina visitata. La stessa sessione può comparire in più lingue.</p>
            <table className="mt-2 w-full tabular-nums">
              <thead className="text-left text-neutral-600">
                <tr><th scope="col">Lingua</th><th scope="col" className="text-right">Elenco shop</th><th scope="col" className="text-right">Schede prodotto</th></tr>
              </thead>
              <tbody>
                {sessionFunnel.shopByLocale.map((row) => (
                  <tr key={row.locale} className="border-t border-neutral-100">
                    <th scope="row" className="py-1 text-left font-medium">{row.locale.toUpperCase()}</th>
                    <td className="text-right">{number(row.shopListSessions, 0)}</td>
                    <td className="text-right">{number(row.productDetailSessions, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>
      ) : null}
      <BlogCardMetrics report={insights.blogProductCards} />
      <section id="funnel-carrelli" aria-labelledby="funnel-carrelli-title" className={`cart-funnel-container min-w-0 scroll-mt-6 rounded-[5px] border border-neutral-200 bg-white p-3 sm:p-4`}>
        <h3 id="funnel-carrelli-title" className="flex items-center gap-1 text-xs font-bold sm:text-sm">Funnel carrelli<InfoTooltip label="Funnel carrelli" description="Segue i carrelli che hanno ricevuto almeno un'aggiunta nel periodo selezionato. Il clic indica che qualcuno ha premuto il pulsante per andare in cassa. È possibile farlo anche senza visualizzare il carrello." /></h3>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-5">
          <FunnelCard {...cartFunnelSteps.additions} value={cartFunnel.cartsWithAdditions} />
          <FunnelCard {...cartFunnelSteps.viewed} value={cartFunnel.cartsViewed} />
          <FunnelCard {...cartFunnelSteps.checkout} value={cartFunnel.cartsWithCheckoutClick} detail={percent(cartFunnel.checkoutStartRate)} />
          <FunnelCard {...cartFunnelSteps.checkoutWithoutView} value={cartFunnel.cartsBypassingCartView} />
          <FunnelCard {...cartFunnelSteps.paid} value={cartFunnel.cartsWithPaidOrder} detail={percent(cartFunnel.purchaseRate)} />
        </div>
        <CartFunnelDiagram funnel={cartFunnel} />
      </section>
      <section className="min-w-0 rounded-[5px] border border-neutral-200 bg-white p-3 sm:p-4">
        <h3 className="flex items-center gap-1 text-xs font-bold sm:text-sm">Funnel checkout Stripe<InfoTooltip label="Funnel checkout Stripe" description="Una riga per canale e un conteggio per sessione Stripe creata nel periodo. Gli esiti si riferiscono alla fine del periodo. I pagamenti recuperati sono inclusi nei pagati. I checkout di prova sono esclusi." /></h3>
        <p className="mt-1 text-xs text-neutral-600">Ogni tentativo Stripe conta una volta. Una prenotazione con un voucher già pagato non apre un nuovo checkout.</p>
        <p className="mt-1 text-xs text-neutral-600 tabular-nums">
          Con visita collegata <b>{number(checkoutCohort.stripeCheckoutsWithSiteSession, 0)}</b> (su <b>{number(checkoutCohort.siteSessionsWithStripeCheckout, 0)}</b> visite distinte)
          {" · "}Senza visita collegata <b>{number(checkoutCohort.stripeCheckoutsWithoutSiteSession, 0)}</b>
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6">
          <FunnelCard label="Checkout Stripe creati" value={checkoutCohort.stripeCheckoutsStarted} />
          <FunnelCard label="In corso o senza esito" value={checkoutCohort.openPending} />
          <FunnelCard label="Ritorni con Stripe ancora aperto" value={checkoutCohort.canceledReturnOpen} />
          <FunnelCard label="Chiusi senza pagamento" value={checkoutCohort.definitiveClosedUnpaid} detail={percent(checkoutCohort.definitiveCloseRate)} />
          <FunnelCard label="Pagati" value={checkoutCohort.paid} detail={percent(checkoutCohort.paidRate)} />
          <FunnelCard label="Di cui recuperati" value={checkoutCohort.recoveredAfterCancelOrClose} />
        </div>
        <div className="mt-3 overflow-x-auto">
          <table aria-label="Checkout Stripe per canale" className="w-full border-collapse text-left text-xs tabular-nums">
            <thead className="border-y border-neutral-200 bg-neutral-50 text-neutral-700">
              <tr>{["Canale", "Creati", "Pagati", "In corso o senza esito", "Ritorni con sessione aperta", "Chiusi senza pagamento", "Di cui pagati dopo un’uscita"].map((label, index) => (
                <th key={label} scope="col" className={`px-2.5 py-2 ${index > 0 ? "text-right" : ""}`}>{label}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {checkoutCohort.byChannel.map((row) => (
                <tr key={row.channel}>
                  <th scope="row" className="px-2.5 py-2 font-medium">{stripeChannelLabels[row.channel]}</th>
                  {[row.started, row.paid, row.openPending, row.canceledReturnOpen, row.definitiveClosedUnpaid, row.recovered].map((value, index) => (
                    <td key={index} className="px-2.5 py-2 text-right">{number(value, 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
