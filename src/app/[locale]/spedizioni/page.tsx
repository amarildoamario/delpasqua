import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/i18n/pathnames";

const lastUpdated = "24/05/2026";

const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";

const translations = {
  it: {
    title: "Spedizioni",
    description: "Tempi, costi e modalita di spedizione di Frantoio Del Pasqua.",
    heading: "Spedizioni",
    updated: "Ultimo aggiornamento: ",
    intro: "Qui trovi tempi, costi e modalita di consegna. I tempi indicati sono medi e possono variare nei periodi festivi o in presenza di destinazioni particolari.",
    prep: "Preparazione ordine",
    prepVal: "Di norma entro 24/48 ore lavorative.",
    delivery: "Consegna stimata",
    deliveryVal: "In genere 2-3 giorni lavorativi dalla spedizione.",
    tracking: "Tracking",
    trackingVal: "Inviato all'email dell'ordine quando disponibile.",
    costs: {
      title: "Costi di spedizione",
      desc: "La spedizione e gratuita per ordini sopra 50 EUR. Per importi inferiori o condizioni particolari, l'eventuale costo viene mostrato al checkout prima del pagamento."
    },
    missing: {
      title: "Mancata consegna o giacenza",
      desc: (
        <p>
          Verifica sempre indirizzo, citofono e recapito telefonico. In caso di mancata
          consegna o giacenza, contattaci a{" "}
          <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
            {COMPANY_EMAIL}
          </a>{" "}
          o al numero{" "}
          <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
            {COMPANY_PHONE}
          </a>
          .
        </p>
      )
    }
  },
  en: {
    title: "Shipping",
    description: "Shipping times, costs, and methods of Frantoio Del Pasqua.",
    heading: "Shipping",
    updated: "Last updated: ",
    intro: "Here you will find delivery times, costs, and methods. The times indicated are average and may vary during holiday periods or for specific destinations.",
    prep: "Order preparation",
    prepVal: "Normally within 24/48 working hours.",
    delivery: "Estimated delivery",
    deliveryVal: "Generally 2-3 working days from shipment.",
    tracking: "Tracking",
    trackingVal: "Sent to the order email when available.",
    costs: {
      title: "Shipping costs",
      desc: "Shipping is free for orders over 50 EUR. For lower amounts or special conditions, any cost is shown at checkout before payment."
    },
    missing: {
      title: "Undelivered package or storage",
      desc: (
        <p>
          Always verify your address, intercom, and phone number. In case of failed delivery or storage, contact us at{" "}
          <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
            {COMPANY_EMAIL}
          </a>{" "}
          or at{" "}
          <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
            {COMPANY_PHONE}
          </a>
          .
        </p>
      )
    }
  },
  de: {
    title: "Versand",
    description: "Versandzeiten, Kosten und Methoden von Frantoio Del Pasqua.",
    heading: "Versand",
    updated: "Zuletzt aktualisiert: ",
    intro: "Hier finden Sie Lieferzeiten, Kosten und Methoden. Die angegebenen Zeiten sind Richtwerte und können in der Ferienzeit oder bei bestimmten Reisezielen abweichen.",
    prep: "Auftragsvorbereitung",
    prepVal: "In der Regel innerhalb von 24/48 Werktagen.",
    delivery: "Voraussichtliche Lieferung",
    deliveryVal: "In der Regel 2-3 Werktage ab Versand.",
    tracking: "Sendungsverfolgung",
    trackingVal: "Wird an die E-Mail-Adresse der Bestellung gesendet, sofern verfügbar.",
    costs: {
      title: "Versandkosten",
      desc: "Der Versand ist ab einem Bestellwert von 50 EUR kostenlos. Bei geringeren Beträgen oder besonderen Bedingungen werden die Kosten an der Kasse vor der Zahlung angezeigt."
    },
    missing: {
      title: "Nichtzustellung oder Lagerung",
      desc: (
        <p>
          Überprüfen Sie immer Adresse, Klingel und Telefonnummer. Bei Nichtzustellung oder Lagerung kontaktieren Sie uns unter{" "}
          <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
            {COMPANY_EMAIL}
          </a>{" "}
          oder unter der Nummer{" "}
          <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
            {COMPANY_PHONE}
          </a>
          .
        </p>
      )
    }
  },
  nl: {
    title: "Verzending",
    description: "Verzendtijden, kosten en methoden van Frantoio Del Pasqua.",
    heading: "Verzending",
    updated: "Laatst bijgewerkt: ",
    intro: "Hier vindt u levertijden, kosten en methoden. De aangegeven tijden zijn gemiddelden en kunnen variëren tijdens feestdagen of voor specifieke bestemmingen.",
    prep: "Orderbereiding",
    prepVal: "Normaal gesproken binnen 24/48 werkuren.",
    delivery: "Verwachte levering",
    deliveryVal: "Over het algemeen 2-3 werkdagen na verzending.",
    tracking: "Tracking",
    trackingVal: "Verzonden naar de bestelemail indien beschikbaar.",
    costs: {
      title: "Verzendkosten",
      desc: "Verzending is gratis voor bestellingen boven 50 EUR. Voor lagere bedragen of speciale voorwaarden worden eventuele kosten getoond bij het afrekenen voor betaling."
    },
    missing: {
      title: "Niet-geleverd pakket of opslag",
      desc: (
        <p>
          Controleer altijd uw adres, intercom en telefoonnummer. In het geval van mislukte levering of opslag, neem contact met ons op via{" "}
          <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
            {COMPANY_EMAIL}
          </a>{" "}
          of op het nummer{" "}
          <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
            {COMPANY_PHONE}
          </a>
          .
        </p>
      )
    }
  },
  da: {
    title: "Forsendelse",
    description: "Forsendelsestider, omkostninger og metoder for Frantoio Del Pasqua.",
    heading: "Forsendelse",
    updated: "Sidst opdateret: ",
    intro: "Her finder du leveringstider, omkostninger og metoder. De angivne tider er gennemsnitlige og kan variere i ferieperioder eller ved særlige destinationer.",
    prep: "Ordreforberedelse",
    prepVal: "Normalt inden for 24/48 arbejdstimer.",
    delivery: "Estimeret levering",
    deliveryVal: "Generelt 2-3 arbejdsdage efter afsendelse.",
    tracking: "Tracking",
    trackingVal: "Sendt til ordremailet, når det er tilgængeligt.",
    costs: {
      title: "Forsendelsesomkostninger",
      desc: "Forsendelse er gratis for ordrer over 50 EUR. For lavere beløb eller særlige betingelser vises eventuelle omkostninger ved kassen før betaling."
    },
    missing: {
      title: "Udebleven levering eller opbevaring",
      desc: (
        <p>
          Kontroller altid adresse, dørtelefon og telefonnummer. I tilfælde af manglende levering eller opbevaring, kontakt os på{" "}
          <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
            {COMPANY_EMAIL}
          </a>{" "}
          eller på nummeret{" "}
          <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
            {COMPANY_PHONE}
          </a>
          .
        </p>
      )
    }
  },
  no: {
    title: "Frakt",
    description: "Frakttider, kostnader og metoder for Frantoio Del Pasqua.",
    heading: "Frakt",
    updated: "Sist oppdatert: ",
    intro: "Her finner du leveringstider, kostnader og metoder. Tidene som er oppgitt er gjennomsnittlige og kan variere i høytider eller til spesielle destinasjoner.",
    prep: "Klargjøring av bestilling",
    prepVal: "Normalt innen 24/48 arbeidstimer.",
    delivery: "Estimert levering",
    deliveryVal: "Vanligvis 2-3 virkedager fra sending.",
    tracking: "Sporing",
    trackingVal: "Sendt til e-posten for bestillingen når den er tilgjengelig.",
    costs: {
      title: "Fraktkostnader",
      desc: "Frakt er gratis for bestillinger over 50 EUR. For lavere beløp eller spesielle betingelser, vil eventuelle kostnader vises i kassen før betaling."
    },
    missing: {
      title: "Ulevert pakke eller oppbevaring",
      desc: (
        <p>
          Sjekk alltid adresse, calling og telefonnummer. Ved ulevert pakke eller oppbevaring, kontakt oss på{" "}
          <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
            {COMPANY_EMAIL}
          </a>{" "}
          eller på nummeret{" "}
          <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
            {COMPANY_PHONE}
          </a>
          .
        </p>
      )
    }
  }
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-sm text-zinc-800">{value}</p>
    </div>
  );
}

export default async function SpedizioniPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t.heading}</h1>
          <p className="mt-2 text-sm text-zinc-600">
            {t.updated} <span className="font-medium">{lastUpdated}</span>
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-700">
            {t.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <InfoRow label={t.prep} value={t.prepVal} />
          <InfoRow label={t.delivery} value={t.deliveryVal} />
          <InfoRow label={t.tracking} value={t.trackingVal} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">{t.costs.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
              <p>
                {t.costs.desc}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">{t.missing.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
              {t.missing.desc}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return pageMetadata({
    title: t.title,
    description: t.description,
    path: "/spedizioni/",
    locale,
    hreflang: true,
  });
}
