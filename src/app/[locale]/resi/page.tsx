import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/i18n/pathnames";

const lastUpdated = "24/05/2026";

const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";

const translations = {
  it: {
    title: "Resi e rimborsi",
    description: "Informazioni su recesso, resi e rimborsi di Frantoio Del Pasqua.",
    heading: "Resi e rimborsi",
    updated: "Ultimo aggiornamento: ",
    intro: "Se acquisti come consumatore, puoi richiedere il recesso entro 14 giorni dalla consegna, salvo le eccezioni previste dalla legge.",
    labels: {
      recesso: "Recesso",
      recessoVal: "Entro 14 giorni dalla consegna.",
      rimborso: "Rimborso",
      rimborsoVal: "Dopo ricezione e verifica del reso.",
      condizioni: "Condizioni",
      condizioniVal: "Prodotto integro, non utilizzato, con imballo adeguato."
    },
    steps: {
      s1: {
        title: "Richiesta reso",
        desc: (
          <p>
            Scrivi a{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            oppure chiama il{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            , indicando numero ordine e motivo della richiesta.
          </p>
        )
      },
      s2: {
        title: "Istruzioni e spedizione",
        desc: (
          <p>
            Ti confermeremo la procedura e l&apos;indirizzo a cui inviare il reso. Imballa il prodotto
            con cura per evitare danni durante il trasporto.
          </p>
        )
      },
      s3: {
        title: "Verifica e rimborso",
        desc: (
          <p>
            Dopo il controllo del reso, il rimborso viene disposto sul metodo di pagamento
            originario, quando possibile.
          </p>
        )
      }
    },
    costs: {
      title: "Costi di reso",
      desc: "Se il prodotto arriva danneggiato o c'è un errore nell'ordine, contattaci subito. Negli altri casi, eventuali costi di restituzione vengono comunicati durante l'apertura della pratica."
    },
    exceptions: {
      title: "Eccezioni",
      desc: "Non possono essere accettati resi di prodotti aperti, alterati, privi di imballo idoneo o esclusi dal diritto di recesso secondo la normativa applicabile."
    },
    footer: {
      title: "Contatti utili",
      desc: "Per velocizzare la pratica, indica sempre numero ordine, nome usato all'acquisto e un recapito valido."
    }
  },
  en: {
    title: "Returns and refunds",
    description: "Information about withdrawals, returns, and refunds of Frantoio Del Pasqua.",
    heading: "Returns and refunds",
    updated: "Last updated: ",
    intro: "If you purchase as a consumer, you can request a withdrawal within 14 days of delivery, subject to exceptions provided by law.",
    labels: {
      recesso: "Withdrawal",
      recessoVal: "Within 14 days of delivery.",
      rimborso: "Refund",
      rimborsoVal: "After receipt and verification of the return.",
      condizioni: "Conditions",
      condizioniVal: "Intact, unused product, with suitable packaging."
    },
    steps: {
      s1: {
        title: "Return request",
        desc: (
          <p>
            Write to{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            or call{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            , indicating the order number and reason for the request.
          </p>
        )
      },
      s2: {
        title: "Instructions and shipping",
        desc: (
          <p>
            We will confirm the procedure and the address to send the return. Pack the product carefully to avoid damage during transport.
          </p>
        )
      },
      s3: {
        title: "Verification and refund",
        desc: (
          <p>
            After checking the return, the refund is made on the original payment method, when possible.
          </p>
        )
      }
    },
    costs: {
      title: "Return costs",
      desc: "If the product arrives damaged or there is an error in the order, contact us immediately. In other cases, any return costs are communicated during the opening of the file."
    },
    exceptions: {
      title: "Exceptions",
      desc: "Returns of products that have been opened, altered, lack suitable packaging, or are excluded from the right of withdrawal under applicable law cannot be accepted."
    },
    footer: {
      title: "Useful contacts",
      desc: "To speed up the process, always indicate the order number, name used at purchase, and a valid contact detail."
    }
  },
  de: {
    title: "Rückgabe und Rückerstattung",
    description: "Informationen über Widerrufe, Rückgaben und Rückerstattungen von Frantoio Del Pasqua.",
    heading: "Rückgabe und Rückerstattung",
    updated: "Zuletzt aktualisiert: ",
    intro: "Wenn Sie als Verbraucher einkaufen, können Sie innerhalb von 14 Tagen nach Lieferung einen Widerruf beantragen, vorbehaltlich gesetzlicher Ausnahmen.",
    labels: {
      recesso: "Widerruf",
      recessoVal: "Innerhalb von 14 Tagen nach Lieferung.",
      rimborso: "Rückerstattung",
      rimborsoVal: "Nach Erhalt und Überprüfung der Rücksendung.",
      condizioni: "Bedingungen",
      condizioniVal: "Unbeschädigtes, unbenutztes Produkt mit geeigneter Verpackung."
    },
    steps: {
      s1: {
        title: "Rückgabeantrag",
        desc: (
          <p>
            Schreiben Sie an{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            oder rufen Sie an unter{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            , unter Angabe der Bestellnummer und des Grundes für den Antrag.
          </p>
        )
      },
      s2: {
        title: "Anweisungen und Versand",
        desc: (
          <p>
            Wir bestätigen Ihnen das Verfahren und die Adresse, an die Sie die Rücksendung schicken müssen. Verpacken Sie das Produkt sorgfältig, um Schäden während des Transports zu vermeiden.
          </p>
        )
      },
      s3: {
        title: "Prüfung und Rückerstattung",
        desc: (
          <p>
            Nach Prüfung der Rücksendung erfolgt die Rückerstattung nach Möglichkeit auf die ursprüngliche Zahlungsmethode.
          </p>
        )
      }
    },
    costs: {
      title: "Rücksendekosten",
      desc: "Wenn das Produkt beschädigt ankommt oder ein Fehler in der Bestellung vorliegt, kontaktieren Sie uns bitte sofort. In anderen Fällen werden eventuelle Rücksendekosten bei Eröffnung des Vorgangs mitgeteilt."
    },
    exceptions: {
      title: "Ausnahmen",
      desc: "Rücksendungen von Produkten, die geöffnet oder verändert wurden, keine geeignete Verpackung aufweisen oder nach geltendem Recht vom Widerrufsrecht ausgeschlossen sind, können nicht akzeptiert werden."
    },
    footer: {
      title: "Nützliche Kontakte",
      desc: "Um das Verfahren zu beschleunigen, geben Sie bitte immer die Bestellnummer, den beim Kauf verwendeten Namen und eine gültige Kontaktmöglichkeit an."
    }
  },
  nl: {
    title: "Retourneren en terugbetaling",
    description: "Informatie over herroeping, retourneren en terugbetalingen van Frantoio Del Pasqua.",
    heading: "Retourneren en terugbetaling",
    updated: "Laatst bijgewerkt: ",
    intro: "Als u als consument koopt, kunt u binnen 14 dagen na levering een herroeping aanvragen, behoudens wettelijke uitzonderingen.",
    labels: {
      recesso: "Herroeping",
      recessoVal: "Binnen 14 dagen na levering.",
      rimborso: "Terugbetaling",
      rimborsoVal: "Na ontvangst en verificatie van de retourzending.",
      condizioni: "Voorwaarden",
      condizioniVal: "Onbeschadigd, ongebruikt product met geschikte verpakking."
    },
    steps: {
      s1: {
        title: "Retourverzoek",
        desc: (
          <p>
            Schrijf naar{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            of bel naar{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            , onder vermelding van het bestelnummer en de reden van het verzoek.
          </p>
        )
      },
      s2: {
        title: "Instructies en verzending",
        desc: (
          <p>
            We bevestigen de procedure en het adres waarnaar u de retourzending moet sturen. Pak het product zorgvuldig in om schade tijdens het transport te voorkomen.
          </p>
        )
      },
      s3: {
        title: "Verificatie en terugbetaling",
        desc: (
          <p>
            Na controle van de retourzending wordt de terugbetaling indien mogelijk op de oorspronkelijke betaalmethode teruggestort.
          </p>
        )
      }
    },
    costs: {
      title: "Retourkosten",
      desc: "Als het product beschadigd aankomt of als er een fout in de bestelling zit, neem dan onmiddellijk contact met ons op. In andere gevallen worden eventuele retourkosten gecommuniceerd bij het openen van het dossier."
    },
    exceptions: {
      title: "Uitzonderingen",
      desc: "Retourzendingen van geopende, gewijzigde producten, producten zonder geschikte verpakking of producten die uitgesloten zijn van het herroepingsrecht onder de toepasselijke wetgeving kunnen niet worden geaccepteerd."
    },
    footer: {
      title: "Handige contacten",
      desc: "Vermeld om het proces te versnellen altijd het bestelnummer, de naam die bij de aankoop is gebruikt en geldige contactgegevens."
    }
  },
  da: {
    title: "Returnering og refusion",
    description: "Information om fortrydelse, returnering og refusion af Frantoio Del Pasqua.",
    heading: "Returnering og refusion",
    updated: "Sidst opdateret: ",
    intro: "Hvis du køber som forbruger, kan du anmode om fortrydelse inden for 14 dage efter levering, medmindre andet er fastsat ved lov.",
    labels: {
      recesso: "Fortrydelse",
      recessoVal: "Inden for 14 dage efter levering.",
      rimborso: "Refusion",
      rimborsoVal: "Efter modtagelse og verifikation af returneringen.",
      condizioni: "Betingelser",
      condizioniVal: "Ubeskadiget, ubrugt produkt med passende emballage."
    },
    steps: {
      s1: {
        title: "Returanmodning",
        desc: (
          <p>
            Skriv til{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            eller ring på{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            , under angivelse af ordrenummer og årsag til anmodningen.
          </p>
        )
      },
      s2: {
        title: "Instruktioner og forsendelse",
        desc: (
          <p>
            Vi vil bekræfte proceduren og adressen, som returneringen skal sendes til. Pak produktet omhyggeligt for at undgå skader under transporten.
          </p>
        )
      },
      s3: {
        title: "Verifikation og refusion",
        desc: (
          <p>
            Efter kontrol af returneringen foretages refusionen så vidt muligt på den oprindelige betalingsmetode.
          </p>
        )
      }
    },
    costs: {
      title: "Returomkostninger",
      desc: "Hvis produktet ankommer beskadiget, eller der er en fejl i ordren, bedes du kontakte os med det samme. I andre tilfælde meddeles eventuelle returomkostninger under oprettelsen af sagen."
    },
    exceptions: {
      title: "Undtagelser",
      desc: "Returnering af produkter, der er åbnet, ændret, mangler passende emballage eller er udelukket fra fortrydelsesretten i henhold til gældende lovgivning, kan ikke accepteres."
    },
    footer: {
      title: "Nyttige kontakter",
      desc: "For at fremskynde processen bedes du altid angive ordrenummer, navn brugt ved køb og gyldig kontaktinformation."
    }
  },
  no: {
    title: "Retur og refusjon",
    description: "Informasjon om angrerett, retur og refusjon fra Frantoio Del Pasqua.",
    heading: "Retur og refusjon",
    updated: "Sist oppdatert: ",
    intro: "Hvis du kjøper som forbruker, kan du be om angrerett innen 14 dager etter levering, med forbehold om unntak fastsatt i loven.",
    labels: {
      recesso: "Angrerett",
      recessoVal: "Innen 14 dager etter levering.",
      rimborso: "Refusjon",
      rimborsoVal: "Etter mottak og verifisering av returen.",
      condizioni: "Betingelser",
      condizioniVal: "Uskadet, ubrukt produkt med egnet emballasje."
    },
    steps: {
      s1: {
        title: "Returforespørsel",
        desc: (
          <p>
            Skriv til{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            eller ring oss på{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            , og oppgi bestillingsnummer og årsak til forespørselen.
          </p>
        )
      },
      s2: {
        title: "Instruksjoner og frakt",
        desc: (
          <p>
            Vi vil bekrefte fremgangsmåten og adressen du skal sende returen til. Pakk produktet forsiktig for å unngå skade under transport.
          </p>
        )
      },
      s3: {
        title: "Verifisering og refusjon",
        desc: (
          <p>
            Etter kontroll av returen, blir refusjonen overført til den opprinnelige betalingsmåten der det er mulig.
          </p>
        )
      }
    },
    costs: {
      title: "Returkostnader",
      desc: "Hvis produktet kommer skadet eller det er feil ved bestillingen, må du kontakte oss umiddelbart. I andre tilfeller vil eventuelle returkostnader bli oppgitt under opprettelsen av saken."
    },
    exceptions: {
      title: "Unntak",
      desc: "Returer av produkter som er åpnet, endret, mangler egnet emballasje eller er unntatt fra angreretten i henhold til gjeldende lov, kan ikke aksepteres."
    },
    footer: {
      title: "Nyttige kontakter",
      desc: "For å fremskynde prosessen, må du alltid oppgi bestillingsnummer, navn som ble brukt ved kjøpet og gyldig kontaktinformasjon."
    }
  }
};

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-800">
          {n}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <div className="mt-2 text-sm leading-relaxed text-zinc-700">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default async function ResiPage({ params }: { params: Promise<{ locale: string }> }) {
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
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{t.labels.recesso}</p>
            <p className="mt-2 text-sm text-zinc-800">{t.labels.recessoVal}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{t.labels.rimborso}</p>
            <p className="mt-2 text-sm text-zinc-800">{t.labels.rimborsoVal}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{t.labels.condizioni}</p>
            <p className="mt-2 text-sm text-zinc-800">
              {t.labels.condizioniVal}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Step n={1} title={t.steps.s1.title}>
            {t.steps.s1.desc}
          </Step>
          <Step n={2} title={t.steps.s2.title}>
            {t.steps.s2.desc}
          </Step>
          <Step n={3} title={t.steps.s3.title}>
            {t.steps.s3.desc}
          </Step>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">{t.costs.title}</h2>
            <div className="mt-3 text-sm leading-relaxed text-zinc-700">
              <p>
                {t.costs.desc}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">{t.exceptions.title}</h2>
            <div className="mt-3 text-sm leading-relaxed text-zinc-700">
              <p>
                {t.exceptions.desc}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700 shadow-sm">
          <p className="font-medium text-zinc-900">{t.footer.title}</p>
          <p className="mt-1">
            {t.footer.desc}
          </p>
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
    path: "/resi/",
    locale,
    hreflang: false,
  });
}
