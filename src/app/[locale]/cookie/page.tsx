import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/i18n/pathnames";

const lastUpdated = "24/05/2026";

const COMPANY_EMAIL = "info@delpasqua.com";

const translations = {
  it: {
    title: "Cookie Policy",
    description: "Informazioni sui cookie e sulle tecnologie simili usate dal sito Frantoio Del Pasqua.",
    badge: "Documentazione legale",
    updated: "Ultimo aggiornamento: ",
    heading: "Cookie Policy",
    intro: "Il sito usa cookie tecnici e identificativi di prima parte collegati a preferenze, carrello e misurazioni di funzionamento. Non usiamo cookie pubblicitari sul frontend pubblico.",
    cookieRows: [
      {
        name: "theme",
        purpose: "Memorizza la preferenza di visualizzazione del sito.",
        duration: "12 mesi",
      },
      {
        name: "cart_id",
        purpose: "Mantiene associato il carrello al browser.",
        duration: "30 giorni",
      },
      {
        name: "v_id",
        purpose: "Identificatore anonimo di prima parte per misurazioni di utilizzo e performance.",
        duration: "12 mesi",
      },
      {
        name: "s_id",
        purpose: "Identificatore di sessione per continuita di navigazione e misurazioni tecniche.",
        duration: "30 minuti dall'ultima attivita",
      },
    ],
    sections: {
      cosaUsiamo: {
        title: "1. Cosa usiamo",
        p1: "I cookie servono a mantenere attive alcune funzioni del sito, ricordare preferenze e capire in modo aggregato come vengono usate pagine e checkout.",
        p2: "Oltre ai cookie, il browser puo conservare dati locali strettamente collegati a preferenze di visualizzazione o continuita del carrello."
      },
      statistiche: {
        title: "2. Servizi statistici di terze parti",
        p1: "Il sito puo integrare Google Analytics 4. Quando presente, il caricamento lato Google usa Consent Mode con analytics storage negato finche non viene registrata una scelta positiva.",
        p2: "Non vengono usati cookie marketing o di profilazione lato pubblico."
      },
      tabellaTitle: "3. Cookie e identificativi principali",
      gestione: {
        title: "4. Gestione dal browser",
        p: "Puoi limitare o cancellare i cookie dalle impostazioni del browser. Disattivando tutti i cookie alcune funzioni, come carrello o preferenze, potrebbero non funzionare correttamente."
      },
      contatti: {
        title: "5. Contatti",
        p: "Per richieste su cookie e privacy puoi scrivere a "
      }
    }
  },
  en: {
    title: "Cookie Policy",
    description: "Information about cookies and similar technologies used by the Frantoio Del Pasqua website.",
    badge: "Legal documentation",
    updated: "Last updated: ",
    heading: "Cookie Policy",
    intro: "The site uses technical and first-party identifiers linked to preferences, cart, and operation measurements. We do not use advertising cookies on the public frontend.",
    cookieRows: [
      {
        name: "theme",
        purpose: "Stores the website display preference.",
        duration: "12 months",
      },
      {
        name: "cart_id",
        purpose: "Keeps the cart associated with the browser.",
        duration: "30 days",
      },
      {
        name: "v_id",
        purpose: "First-party anonymous identifier for usage and performance measurements.",
        duration: "12 months",
      },
      {
        name: "s_id",
        purpose: "Session identifier for browsing continuity and technical measurements.",
        duration: "30 minutes from last activity",
      },
    ],
    sections: {
      cosaUsiamo: {
        title: "1. What we use",
        p1: "Cookies serve to keep certain functions of the site active, remember preferences, and understand in an aggregated way how pages and checkout are used.",
        p2: "In addition to cookies, the browser may store local data closely linked to display preferences or cart continuity."
      },
      statistiche: {
        title: "2. Third-party statistical services",
        p1: "The site may integrate Google Analytics 4. When present, the loading on the Google side uses Consent Mode with analytics storage denied until a positive choice is registered.",
        p2: "No marketing or profiling cookies are used on the public side."
      },
      tabellaTitle: "3. Main cookies and identifiers",
      gestione: {
        title: "4. Browser management",
        p: "You can limit or delete cookies from your browser settings. By disabling all cookies, some functions, such as the cart or preferences, may not work correctly."
      },
      contatti: {
        title: "5. Contacts",
        p: "For requests on cookies and privacy you can write to "
      }
    }
  },
  de: {
    title: "Cookie-Richtlinie",
    description: "Informationen zu Cookies und ähnlichen Technologien, die auf der Website von Frantoio Del Pasqua verwendet werden.",
    badge: "Rechtliche Dokumentation",
    updated: "Zuletzt aktualisiert: ",
    heading: "Cookie-Richtlinie",
    intro: "Die Website verwendet technische Identifikatoren und Erstanbieter-Cookies im Zusammenhang mit Präferenzen, dem Warenkorb und Betriebsmessungen. Wir verwenden keine Werbe-Cookies im öffentlichen Frontend.",
    cookieRows: [
      {
        name: "theme",
        purpose: "Speichert die Anzeigepräferenz der Website.",
        duration: "12 Monate",
      },
      {
        name: "cart_id",
        purpose: "Hält den Warenkorb mit dem Browser verknüpft.",
        duration: "30 Tage",
      },
      {
        name: "v_id",
        purpose: "Anonymer Erstanbieter-Identifikator für Nutzungs- und Leistungsmessungen.",
        duration: "12 Monate",
      },
      {
        name: "s_id",
        purpose: "Sitzungsidentifikator für kontinuierliche Navigation und technische Messungen.",
        duration: "30 Minuten nach der letzten Aktivität",
      },
    ],
    sections: {
      cosaUsiamo: {
        title: "1. Was wir verwenden",
        p1: "Cookies dienen dazu, bestimmte Funktionen der Website aktiv zu halten, Präferenzen zu speichern und aggregiert zu verstehen, wie Seiten und Kasse genutzt werden.",
        p2: "Zusätzlich zu Cookies kann der Browser lokale Daten speichern, die eng mit den Anzeigepräferenzen oder dem Warenkorb verknüpft sind."
      },
      statistiche: {
        title: "2. Statistische Dienste von Drittanbietern",
        p1: "Die Website kann Google Analytics 4 integrieren. Falls vorhanden, erfolgt das Laden auf Seiten von Google im Consent Mode, wobei die Speicherung von Analysedaten verweigert wird, bis eine positive Auswahl registriert wird.",
        p2: "Es werden keine Marketing- oder Profiling-Cookies auf der öffentlichen Seite verwendet."
      },
      tabellaTitle: "3. Wichtigste Cookies und Identifikatoren",
      gestione: {
        title: "4. Browser-Verwaltung",
        p: "Sie können Cookies in den Einstellungen Ihres Browsers einschränken oder löschen. Wenn Sie alle Cookies deaktivieren, funktionieren einige Funktionen wie der Warenkorb oder Präferenzen möglicherweise nicht richtig."
      },
      contatti: {
        title: "5. Kontakte",
        p: "Für Anfragen zu Cookies und Datenschutz können Sie sich wenden an "
      }
    }
  },
  nl: {
    title: "Cookiebeleid",
    description: "Informatie over cookies en soortgelijke technologieën die worden gebruikt door de Frantoio Del Pasqua website.",
    badge: "Juridische documentatie",
    updated: "Laatst bijgewerkt: ",
    heading: "Cookiebeleid",
    intro: "De site maakt gebruik van technische en first-party cookies die gekoppeld zijn aan voorkeuren, winkelwagen en werking. We gebruiken geen advertentiecookies op de openbare frontend.",
    cookieRows: [
      {
        name: "theme",
        purpose: "Slaat de weergavevoorkeur van de website op.",
        duration: "12 maanden",
      },
      {
        name: "cart_id",
        purpose: "Houdt de winkelwagen gekoppeld aan de browser.",
        duration: "30 dagen",
      },
      {
        name: "v_id",
        purpose: "Anonieme first-party identifier voor gebruiks- en prestatiemetingen.",
        duration: "12 maanden",
      },
      {
        name: "s_id",
        purpose: "Sessie-identifier voor continue navigatie en technische metingen.",
        duration: "30 minuten na de laatste activiteit",
      },
    ],
    sections: {
      cosaUsiamo: {
        title: "1. Wat we gebruiken",
        p1: "Cookies dienen om bepaalde functies van de site actief te houden, voorkeuren te onthouden en op geaggregeerde wijze te begrijpen hoe pagina's en checkout worden gebruikt.",
        p2: "Naast cookies kan de browser lokale gegevens opslaan die nauw verbonden zijn met weergavevoorkeuren of winkelwagencontinuïteit."
      },
      statistiche: {
        title: "2. Statistische diensten van derden",
        p1: "De site kan Google Analytics 4 integreren. Indien aanwezig, gebruikt het laden aan de Google-zijde Consent Mode waarbij opslag voor analyse wordt geweigerd totdat een positieve keuze is geregistreerd.",
        p2: "Er worden geen marketing- of profileringscookies gebruikt aan de openbare zijde."
      },
      tabellaTitle: "3. Belangrijkste cookies en identifiers",
      gestione: {
        title: "4. Browserbeheer",
        p: "U kunt cookies beperken of verwijderen via uw browserinstellingen. Door alle cookies uit te schakelen, werken sommige functies, zoals de winkelwagen of voorkeuren, mogelijk niet correct."
      },
      contatti: {
        title: "5. Contact",
        p: "Voor verzoeken over cookies en privacy kunt u schrijven naar "
      }
    }
  },
  da: {
    title: "Cookiepolitik",
    description: "Information om cookies og lignende teknologier, der bruges af Frantoio Del Pasqua hjemmesiden.",
    badge: "Juridisk dokumentation",
    updated: "Sidst opdateret: ",
    heading: "Cookiepolitik",
    intro: "Webstedet bruger tekniske og førstepartsidentifikatorer knyttet til præferencer, indkøbskurv og driftsmålinger. Vi bruger ikke reklamecookies på den offentlige frontend.",
    cookieRows: [
      {
        name: "theme",
        purpose: "Gemmer webstedets visningspræference.",
        duration: "12 måneder",
      },
      {
        name: "cart_id",
        purpose: "Holder indkøbskurven tilknyttet browseren.",
        duration: "30 dage",
      },
      {
        name: "v_id",
        purpose: "Førsteparts anonym identifikator til brugs- og præstationsmålinger.",
        duration: "12 måneder",
      },
      {
        name: "s_id",
        purpose: "Sessionsidentifikator for browserkontinuitet og tekniske målinger.",
        duration: "30 minutter fra sidste aktivitet",
      },
    ],
    sections: {
      cosaUsiamo: {
        title: "1. Hvad vi bruger",
        p1: "Cookies tjener til at holde visse funktioner på webstedet aktive, huske præferencer og forstå på en aggregeret måde, hvordan sider og kassen bruges.",
        p2: "Ud over cookies kan browseren gemme lokale data, der er tæt knyttet til visningspræferencer eller indkøbskurvens kontinuitet."
      },
      statistiche: {
        title: "2. Tredjeparts statistiske tjenester",
        p1: "Webstedet kan integrere Google Analytics 4. Når det er til stede, bruger indlæsningen på Google-siden Consent Mode med analytics storage afvist, indtil der registreres et positivt valg.",
        p2: "Der bruges ingen marketing- eller profileringscookies på den offentlige side."
      },
      tabellaTitle: "3. Hovedcookies og identifikatorer",
      gestione: {
        title: "4. Browserstyring",
        p: "Du kan begrænse eller slette cookies i dine browserindstillinger. Ved at deaktivere alle cookies fungerer visse funktioner, såsom indkøbskurv eller præferencer, muligvis ikke korrekt."
      },
      contatti: {
        title: "5. Kontakter",
        p: "For anmodninger om cookies og privatliv kan du skrive til "
      }
    }
  },
  no: {
    title: "Cookie Policy",
    description: "Informasjon om informasjonskapsler og lignende teknologier som brukes av Frantoio Del Pasqua nettstedet.",
    badge: "Juridisk dokumentasjon",
    updated: "Sist oppdatert: ",
    heading: "Cookie Policy",
    intro: "Nettstedet bruker tekniske informasjonskapsler og førstepartsidentifikatorer knyttet til preferanser, handlekurv og driftsmålinger. Vi bruker ikke markedsførings-informasjonskapsler på det offentlige nettstedet.",
    cookieRows: [
      {
        name: "theme",
        purpose: "Lagrer preferansen for visning av nettstedet.",
        duration: "12 måneder",
      },
      {
        name: "cart_id",
        purpose: "Holder handlekurven knyttet til nettleseren.",
        duration: "30 dager",
      },
      {
        name: "v_id",
        purpose: "Førsteparts anonym identifikator for bruks- og ytelsesmålinger.",
        duration: "12 måneder",
      },
      {
        name: "s_id",
        purpose: "Øktidentifikator for nettleserkontinuitet og tekniske målinger.",
        duration: "30 minutter fra siste aktivitet",
      },
    ],
    sections: {
      cosaUsiamo: {
        title: "1. Hva vi bruker",
        p1: "Informasjonskapsler tjener til å holde visse funksjoner på nettstedet aktive, huske preferanser og forstå på en aggregert måte hvordan sider og kassen brukes.",
        p2: "I tillegg til informasjonskapsler kan nettleseren lagre lokale data som er nært knyttet til visningspreferanser eller handlekurvkontinuitet."
      },
      statistiche: {
        title: "2. Tredjeparts statistiske tjenester",
        p1: "Nettstedet kan integrere Google Analytics 4. Når det er til stede, bruker innlasting på Google-siden Consent Mode med analytics storage avvist inntil et positivt valg er registrert.",
        p2: "Ingen markedsførings- eller profileringskapsler brukes på den offentlige siden."
      },
      tabellaTitle: "3. Hovedinformasjonskapsler og identifikatorer",
      gestione: {
        title: "4. Administrasjon i nettleser",
        p: "Du kan begrense eller slette informasjonskapsler i nettleserinnstillingene. Ved å deaktivere alle informasjonskapsler, kan enkelte funksjoner som handlekurv eller preferanser slutte å fungere ordentlig."
      },
      contatti: {
        title: "5. Kontakter",
        p: "For forespørsler om informasjonskapsler og personvern kan du skrive til "
      }
    }
  }
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">{children}</div>
    </div>
  );
}

export default async function CookiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge>{t.badge}</Badge>
            <p className="text-sm text-zinc-600">
              {t.updated} <span className="font-medium">{lastUpdated}</span>
            </p>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t.heading}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-700">
            {t.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title={t.sections.cosaUsiamo.title}>
            <p>{t.sections.cosaUsiamo.p1}</p>
            <p>{t.sections.cosaUsiamo.p2}</p>
          </Card>

          <Card title={t.sections.statistiche.title}>
            <p>{t.sections.statistiche.p1}</p>
            <p>{t.sections.statistiche.p2}</p>
          </Card>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">{t.sections.tabellaTitle}</h2>
          <div className="mt-4 space-y-3">
            {t.cookieRows.map((cookie) => (
              <div
                key={cookie.name}
                className="grid gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[140px_1fr_180px]"
              >
                <div className="text-sm font-medium text-zinc-900">{cookie.name}</div>
                <div className="text-sm text-zinc-700">{cookie.purpose}</div>
                <div className="text-sm text-zinc-600">{cookie.duration}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title={t.sections.gestione.title}>
            <p>{t.sections.gestione.p}</p>
          </Card>

          <Card title={t.sections.contatti.title}>
            <p>
              {t.sections.contatti.p}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              .
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
