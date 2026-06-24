import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { companyInfo } from "@/lib/companyInfo";
import { locales, type Locale } from "@/i18n/pathnames";

const lastUpdated = "24/05/2026";

const COMPANY_NAME = "Az. Agr. Del Pasqua";
const COMPANY_ADDRESS = companyInfo.addressLegal;
const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";

const translations = {
  it: {
    title: "Condizioni Generali di Vendita",
    description: "Termini, condizioni di vendita e informazioni commerciali del sito Frantoio Del Pasqua.",
    legalDoc: "Documentazione legale",
    heading: "Termini e Condizioni",
    updated: "Ultimo aggiornamento: ",
    scope: "Ambito",
    scopeText: "Queste condizioni si applicano agli acquisti conclusi tramite il sito Frantoio Del Pasqua.",
    indexTitle: "Indice",
    sections: {
      venditore: {
        title: "1. Informazioni sul venditore",
        content: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>
            <p>
              Email:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              <br />
              Telefono:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
            </p>
          </>
        )
      },
      oggetto: {
        title: "2. Oggetto",
        content: (
          <p>
            Il sito consente l&apos;acquisto online dei prodotti proposti da Frantoio Del Pasqua,
            con particolare riferimento a olio extra vergine di oliva e articoli collegati.
          </p>
        )
      },
      prezzi: {
        title: "3. Prezzi e pagamenti",
        content: (
          <>
            <p>
              I prezzi sono espressi in euro. Eventuali spese di spedizione e il totale finale
              vengono mostrati prima della conferma dell&apos;ordine.
            </p>
            <p>
              I metodi di pagamento disponibili sono quelli visualizzati al checkout al momento
              dell&apos;acquisto.
            </p>
          </>
        )
      },
      contratto: {
        title: "4. Conclusione del contratto",
        content: (
          <p>
            L&apos;invio dell&apos;ordine costituisce una richiesta di acquisto. Il contratto si considera
            concluso quando ricevi la conferma d&apos;ordine all&apos;indirizzo email indicato.
          </p>
        )
      },
      spedizioni: {
        title: "5. Spedizioni e consegna",
        content: (
          <>
            <p>
              La preparazione dell&apos;ordine avviene di norma entro 24/48 ore lavorative. La consegna
              e generalmente prevista in 2-3 giorni lavorativi dalla spedizione.
            </p>
            <p>
              Per dettagli aggiornati su costi, soglie e modalita consulta la pagina{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/spedizioni">
                Spedizioni
              </Link>
              .
            </p>
          </>
        )
      },
      recesso: {
        title: "6. Recesso e resi",
        content: (
          <>
            <p>
              Se acquisti come consumatore, puoi esercitare il diritto di recesso entro 14 giorni
              dalla consegna, salvo le esclusioni previste dalla legge.
            </p>
            <p>
              Procedura, condizioni e tempi di rimborso sono riepilogati nella pagina{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/resi">
                Resi e rimborsi
              </Link>
              .
            </p>
          </>
        )
      },
      garanzia: {
        title: "7. Garanzia legale",
        content: (
          <p>
            Per i clienti consumatori si applica la garanzia legale di conformita prevista dalla
            normativa vigente.
          </p>
        )
      },
      responsabilita: {
        title: "8. Limitazioni di responsabilita",
        content: (
          <p>
            Frantoio Del Pasqua non risponde di ritardi o disservizi dovuti a cause di forza
            maggiore, servizi di terzi o dati errati forniti dal cliente, nei limiti consentiti
            dalla legge.
          </p>
        )
      },
      legge: {
        title: "9. Legge applicabile e foro",
        content: (
          <>
            <p>
              I contratti conclusi tramite il sito sono regolati dalla legge italiana.
            </p>
            <p>
              Se acquisti come consumatore, per le controversie resta fermo il foro del tuo
              luogo di residenza o domicilio, quando previsto dalla normativa applicabile.
            </p>
          </>
        )
      }
    }
  },
  en: {
    title: "General Terms and Conditions of Sale",
    description: "Terms, sales conditions, and commercial information of the Frantoio Del Pasqua website.",
    legalDoc: "Legal documentation",
    heading: "Terms and Conditions",
    updated: "Last updated: ",
    scope: "Scope",
    scopeText: "These conditions apply to purchases made via the Frantoio Del Pasqua website.",
    indexTitle: "Index",
    sections: {
      venditore: {
        title: "1. Seller Information",
        content: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>
            <p>
              Email:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              <br />
              Phone:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
            </p>
          </>
        )
      },
      oggetto: {
        title: "2. Subject Matter",
        content: (
          <p>
            The website allows the online purchase of products offered by Frantoio Del Pasqua, with particular reference to extra virgin olive oil and related items.
          </p>
        )
      },
      prezzi: {
        title: "3. Prices and Payments",
        content: (
          <>
            <p>
              Prices are expressed in Euros. Any shipping costs and the final total are shown before order confirmation.
            </p>
            <p>
              The available payment methods are those displayed at checkout at the time of purchase.
            </p>
          </>
        )
      },
      contratto: {
        title: "4. Conclusion of the Contract",
        content: (
          <p>
            Sending the order constitutes a purchase request. The contract is considered concluded when you receive the order confirmation at the indicated email address.
          </p>
        )
      },
      spedizioni: {
        title: "5. Shipping and Delivery",
        content: (
          <>
            <p>
              Order preparation normally takes place within 24/48 working hours. Delivery is generally expected in 2-3 working days from shipping.
            </p>
            <p>
              For updated details on costs, thresholds, and methods, see the page{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/spedizioni">
                Shipping
              </Link>
              .
            </p>
          </>
        )
      },
      recesso: {
        title: "6. Withdrawal and Returns",
        content: (
          <>
            <p>
              If you purchase as a consumer, you can exercise the right of withdrawal within 14 days from delivery, subject to exclusions provided by law.
            </p>
            <p>
              Procedure, conditions, and refund times are summarized on the page{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/resi">
                Returns and refunds
              </Link>
              .
            </p>
          </>
        )
      },
      garanzia: {
        title: "7. Legal Warranty",
        content: (
          <p>
            For consumer customers, the legal warranty of conformity provided by current legislation applies.
          </p>
        )
      },
      responsabilita: {
        title: "8. Limitation of Liability",
        content: (
          <p>
            Frantoio Del Pasqua is not liable for delays or disservices due to force majeure, third-party services, or incorrect data provided by the customer, within the limits permitted by law.
          </p>
        )
      },
      legge: {
        title: "9. Applicable Law and Jurisdiction",
        content: (
          <>
            <p>
              Contracts concluded through the site are governed by Italian law.
            </p>
            <p>
              If you purchase as a consumer, for disputes, the court of your place of residence or domicile remains applicable, when provided by the applicable legislation.
            </p>
          </>
        )
      }
    }
  },
  de: {
    title: "Allgemeine Verkaufsbedingungen",
    description: "Allgemeine Geschäftsbedingungen, Verkaufsbedingungen und kommerzielle Informationen der Frantoio Del Pasqua Website.",
    legalDoc: "Rechtliche Dokumentation",
    heading: "Allgemeine Geschäftsbedingungen",
    updated: "Zuletzt aktualisiert: ",
    scope: "Geltungsbereich",
    scopeText: "Diese Bedingungen gelten für Einkäufe, die über die Frantoio Del Pasqua Website getätigt werden.",
    indexTitle: "Index",
    sections: {
      venditore: {
        title: "1. Informationen über den Verkäufer",
        content: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>
            <p>
              E-Mail:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              <br />
              Telefon:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
            </p>
          </>
        )
      },
      oggetto: {
        title: "2. Gegenstand",
        content: (
          <p>
            Die Website ermöglicht den Online-Kauf der von Frantoio Del Pasqua angebotenen Produkte, insbesondere von nativem Olivenöl extra und verwandten Artikeln.
          </p>
        )
      },
      prezzi: {
        title: "3. Preise und Zahlungen",
        content: (
          <>
            <p>
              Die Preise sind in Euro angegeben. Eventuelle Versandkosten und der Endbetrag werden vor der Auftragsbestätigung angezeigt.
            </p>
            <p>
              Die verfügbaren Zahlungsmethoden sind die, die an der Kasse zum Zeitpunkt des Kaufs angezeigt werden.
            </p>
          </>
        )
      },
      contratto: {
        title: "4. Zustandekommen des Vertrages",
        content: (
          <p>
            Das Absenden der Bestellung stellt eine Kaufanfrage dar. Der Vertrag gilt als geschlossen, wenn Sie die Auftragsbestätigung an der angegebenen E-Mail-Adresse erhalten.
          </p>
        )
      },
      spedizioni: {
        title: "5. Versand und Lieferung",
        content: (
          <>
            <p>
              Die Vorbereitung der Bestellung erfolgt in der Regel innerhalb von 24/48 Werktagen. Die Lieferung wird generell in 2-3 Werktagen ab Versand erwartet.
            </p>
            <p>
              Aktuelle Details zu Kosten, Schwellenwerten und Methoden finden Sie auf der Seite{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/spedizioni">
                Versand
              </Link>
              .
            </p>
          </>
        )
      },
      recesso: {
        title: "6. Widerruf und Rücksendung",
        content: (
          <>
            <p>
              Wenn Sie als Verbraucher einkaufen, können Sie das Widerrufsrecht innerhalb von 14 Tagen ab Lieferung ausüben, vorbehaltlich gesetzlicher Ausnahmen.
            </p>
            <p>
              Verfahren, Bedingungen und Erstattungsfristen sind auf der Seite zusammengefasst{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/resi">
                Rückgabe und Rückerstattung
              </Link>
              .
            </p>
          </>
        )
      },
      garanzia: {
        title: "7. Gesetzliche Gewährleistung",
        content: (
          <p>
            Für Verbraucherkunden gilt die gesetzliche Konformitätsgarantie nach geltendem Recht.
          </p>
        )
      },
      responsabilita: {
        title: "8. Haftungsbeschränkung",
        content: (
          <p>
            Frantoio Del Pasqua haftet nicht für Verzögerungen oder Störungen aufgrund höherer Gewalt, Diensten Dritter oder fehlerhafter Daten des Kunden, soweit gesetzlich zulässig.
          </p>
        )
      },
      legge: {
        title: "9. Anwendbares Recht und Gerichtsstand",
        content: (
          <>
            <p>
              Die über die Website geschlossenen Verträge unterliegen italienischem Recht.
            </p>
            <p>
              Wenn Sie als Verbraucher einkaufen, bleibt für Streitigkeiten das Gericht Ihres Wohnsitzes oder Aufenthaltsortes zuständig, sofern gesetzlich vorgesehen.
            </p>
          </>
        )
      }
    }
  },
  nl: {
    title: "Algemene Verkoopvoorwaarden",
    description: "Voorwaarden, verkoopvoorwaarden en commerciële informatie van de Frantoio Del Pasqua website.",
    legalDoc: "Juridische documentatie",
    heading: "Algemene Voorwaarden",
    updated: "Laatst bijgewerkt: ",
    scope: "Toepassingsgebied",
    scopeText: "Deze voorwaarden zijn van toepassing op aankopen gedaan via de Frantoio Del Pasqua website.",
    indexTitle: "Index",
    sections: {
      venditore: {
        title: "1. Informatie over de verkoper",
        content: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>
            <p>
              Email:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              <br />
              Telefoon:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
            </p>
          </>
        )
      },
      oggetto: {
        title: "2. Onderwerp",
        content: (
          <p>
            De website maakt de online aankoop mogelijk van de producten aangeboden door Frantoio Del Pasqua, in het bijzonder extra vergine olijfolie en aanverwante artikelen.
          </p>
        )
      },
      prezzi: {
        title: "3. Prijzen en Betalingen",
        content: (
          <>
            <p>
              De prijzen zijn uitgedrukt in Euro. Eventuele verzendkosten en het eindtotaal worden getoond voor de orderbevestiging.
            </p>
            <p>
              De beschikbare betalingsmethoden zijn de methoden die worden getoond bij het afrekenen op het moment van aankoop.
            </p>
          </>
        )
      },
      contratto: {
        title: "4. Totstandkoming van de overeenkomst",
        content: (
          <p>
            Het verzenden van de bestelling vormt een aankoopverzoek. De overeenkomst wordt als gesloten beschouwd wanneer u de orderbevestiging ontvangt op het opgegeven e-mailadres.
          </p>
        )
      },
      spedizioni: {
        title: "5. Verzending en Levering",
        content: (
          <>
            <p>
              De voorbereiding van de bestelling vindt normaal gesproken plaats binnen 24/48 werkuren. Levering wordt over het algemeen verwacht binnen 2-3 werkdagen na verzending.
            </p>
            <p>
              Voor actuele details over kosten, drempels en methoden, zie de pagina{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/spedizioni">
                Verzending
              </Link>
              .
            </p>
          </>
        )
      },
      recesso: {
        title: "6. Herroeping en Retourzendingen",
        content: (
          <>
            <p>
              Als u als consument koopt, kunt u het herroepingsrecht uitoefenen binnen 14 dagen na levering, behoudens wettelijke uitzonderingen.
            </p>
            <p>
              Procedure, voorwaarden en terugbetalingstijden zijn samengevat op de pagina{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/resi">
                Retourneren en terugbetaling
              </Link>
              .
            </p>
          </>
        )
      },
      garanzia: {
        title: "7. Wettelijke Garantie",
        content: (
          <p>
            Voor consumentenklanten is de wettelijke conformiteitsgarantie volgens de geldende wetgeving van toepassing.
          </p>
        )
      },
      responsabilita: {
        title: "8. Beperking van Aansprakelijkheid",
        content: (
          <p>
            Frantoio Del Pasqua is niet aansprakelijk voor vertragingen of storingen als gevolg van overmacht, diensten van derden of onjuiste gegevens verstrekt door de klant, binnen de wettelijk toegestane grenzen.
          </p>
        )
      },
      legge: {
        title: "9. Toepasselijk Recht en Bevoegde Rechter",
        content: (
          <>
            <p>
              Overeenkomsten gesloten via de site worden beheerst door het Italiaanse recht.
            </p>
            <p>
              Als u als consument koopt, blijft voor geschillen de rechter van uw woonplaats of domicilie bevoegd, indien wettelijk voorzien.
            </p>
          </>
        )
      }
    }
  },
  da: {
    title: "Generelle salgsbetingelser",
    description: "Vilkår, salgsbetingelser og kommerciel information for Frantoio Del Pasqua hjemmesiden.",
    legalDoc: "Juridisk dokumentation",
    heading: "Vilkår og betingelser",
    updated: "Sidst opdateret: ",
    scope: "Omfang",
    scopeText: "Disse betingelser gælder for køb foretaget via Frantoio Del Pasqua hjemmesiden.",
    indexTitle: "Indeks",
    sections: {
      venditore: {
        title: "1. Sælgerinformation",
        content: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>
            <p>
              E-mail:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              <br />
              Telefon:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
            </p>
          </>
        )
      },
      oggetto: {
        title: "2. Genstand",
        content: (
          <p>
            Hjemmesiden muliggør online køb af produkter tilbudt af Frantoio Del Pasqua, med særlig henvisning til ekstra jomfruolivenolie og relaterede varer.
          </p>
        )
      },
      prezzi: {
        title: "3. Priser og betaling",
        content: (
          <>
            <p>
              Priserne er angivet i Euro. Eventuelle forsendelsesomkostninger og det endelige samlede beløb vises før ordrebekræftelse.
            </p>
            <p>
              De tilgængelige betalingsmetoder er dem, der vises ved kassen på købstidspunktet.
            </p>
          </>
        )
      },
      contratto: {
        title: "4. Kontraktens indgåelse",
        content: (
          <p>
            Afsendelse af ordren udgør en købsanmodning. Kontrakten anses for indgået, når du modtager ordrebekræftelsen på den angivne e-mailadresse.
          </p>
        )
      },
      spedizioni: {
        title: "5. Forsendelse og levering",
        content: (
          <>
            <p>
              Forberedelse af ordren sker normalt inden for 24/48 arbejdstimer. Levering forventes generelt inden for 2-3 arbejdsdage efter afsendelse.
            </p>
            <p>
              For opdaterede detaljer om omkostninger, grænser og metoder, se siden{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/spedizioni">
                Forsendelse
              </Link>
              .
            </p>
          </>
        )
      },
      recesso: {
        title: "6. Fortrydelsesret og returnering",
        content: (
          <>
            <p>
              Hvis du køber som forbruger, kan du udøve fortrydelsesretten inden for 14 dage efter levering, medmindre andet er fastsat ved lov.
            </p>
            <p>
              Procedure, betingelser og refusionstider er opsummeret på siden{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/resi">
                Returnering og refusion
              </Link>
              .
            </p>
          </>
        )
      },
      garanzia: {
        title: "7. Lovpligtig garanti",
        content: (
          <p>
            For forbrugerkunder gælder den lovpligtige overensstemmelsesgaranti i henhold til gældende lovgivning.
          </p>
        )
      },
      responsabilita: {
        title: "8. Ansvarsbegrænsning",
        content: (
          <p>
            Frantoio Del Pasqua er ikke ansvarlig for forsinkelser eller forstyrrelser som følge af force majeure, tredjepartstjenester eller forkerte data leveret af kunden inden for lovens grænser.
          </p>
        )
      },
      legge: {
        title: "9. Gældende lov og værneting",
        content: (
          <>
            <p>
              Kontrakter indgået via webstedet er underlagt italiensk lovgivning.
            </p>
            <p>
              Hvis du køber som forbruger, er værnetinget i tilfælde af tvister din bopæl eller dit opholdssted, når det er fastsat i den gældende lovgivning.
            </p>
          </>
        )
      }
    }
  },
  no: {
    title: "Generelle salgsbetingelser",
    description: "Vilkår, salgsbetingelser og kommersiell informasjon for Frantoio Del Pasqua nettstedet.",
    legalDoc: "Juridisk dokumentasjon",
    heading: "Vilkår og betingelser",
    updated: "Sist oppdatert: ",
    scope: "Omfang",
    scopeText: "Disse betingelsene gjelder for kjøp gjort via Frantoio Del Pasqua nettstedet.",
    indexTitle: "Indeks",
    sections: {
      venditore: {
        title: "1. Selgerinformasjon",
        content: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>
            <p>
              E-post:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              <br />
              Telefon:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
            </p>
          </>
        )
      },
      oggetto: {
        title: "2. Gjenstand",
        content: (
          <p>
            Nettstedet muliggjør online kjøp av produkter tilbudt av Frantoio Del Pasqua, med spesiell referanse til ekstra jomfruolivenolje og relaterte varer.
          </p>
        )
      },
      prezzi: {
        title: "3. Priser og betaling",
        content: (
          <>
            <p>
              Prisene er oppgitt i Euro. Eventuelle fraktkostnader og det endelige beløpet vises før ordrebekreftelse.
            </p>
            <p>
              De tilgjengelige betalingsmetodene er de som vises ved kassen på kjøpstidspunktet.
            </p>
          </>
        )
      },
      contratto: {
        title: "4. Inngåelse av kontrakt",
        content: (
          <p>
            Innsending av bestillingen utgjør en kjøpsforespørsel. Kontrakten anses som inngått når du mottar ordrebekreftelsen på den angitte e-postadressen.
          </p>
        )
      },
      spedizioni: {
        title: "5. Frakt og levering",
        content: (
          <>
            <p>
              Klargjøring av bestillingen skjer normalt innen 24/48 arbeidstimer. Levering forventes vanligvis innen 2-3 virkedager etter sending.
            </p>
            <p>
              For oppdaterte detaljer om kostnader, grenser og metoder, se siden{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/spedizioni">
                Frakt
              </Link>
              .
            </p>
          </>
        )
      },
      recesso: {
        title: "6. Angrerett og retur",
        content: (
          <>
            <p>
              Hvis du kjøper som forbruker, kan du benytte deg av angreretten innen 14 dager etter levering, med forbehold om lovbestemte unntak.
            </p>
            <p>
              Prosedyre, betingelser og refusjonstider er oppsummert på siden{" "}
              <Link className="text-zinc-900 underline underline-offset-4" href="/resi">
                Retur og refusjon
              </Link>
              .
            </p>
          </>
        )
      },
      garanzia: {
        title: "7. Lovfestet garanti",
        content: (
          <p>
            For forbrukerkunder gjelder den lovfestede samsvarsgarantien i henhold til gjeldende lovgivning.
          </p>
        )
      },
      responsabilita: {
        title: "8. Ansvarsbegrensning",
        content: (
          <p>
            Frantoio Del Pasqua er ikke ansvarlig for forsinkelser eller forstyrrelser som skyldes force majeure, tredjepartstjenester eller feilaktige opplysninger oppgitt av kunden, innenfor lovens rammer.
          </p>
        )
      },
      legge: {
        title: "9. Gjeldende lov og verneting",
        content: (
          <>
            <p>
              Kontrakter inngått via nettstedet er underlagt italiensk lov.
            </p>
            <p>
              Hvis du kjøper som forbruker, er vernetinget i tilfelle tvister din bosteds- eller oppholdssted, når det er fastsatt i gjeldende lovgivning.
            </p>
          </>
        )
      }
    }
  }
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">{children}</div>
      <div className="my-8 h-px bg-zinc-200" />
    </section>
  );
}

export default async function TerminiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const t = translations[displayLocale];

  const toc = [
    { id: "venditore", label: t.sections.venditore.title },
    { id: "oggetto", label: t.sections.oggetto.title },
    { id: "prezzi", label: t.sections.prezzi.title },
    { id: "contratto", label: t.sections.contratto.title },
    { id: "spedizioni", label: t.sections.spedizioni.title },
    { id: "recesso", label: t.sections.recesso.title },
    { id: "garanzia", label: t.sections.garanzia.title },
    { id: "responsabilita", label: t.sections.responsabilita.title },
    { id: "legge", label: t.sections.legge.title },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {t.legalDoc}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {t.heading}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {t.updated} <span className="font-medium">{lastUpdated}</span>
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-medium text-zinc-900">{t.scope}</p>
            <p className="mt-1">
              {t.scopeText}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <Section id="venditore" title={t.sections.venditore.title}>
              {t.sections.venditore.content}
            </Section>

            <Section id="oggetto" title={t.sections.oggetto.title}>
              {t.sections.oggetto.content}
            </Section>

            <Section id="prezzi" title={t.sections.prezzi.title}>
              {t.sections.prezzi.content}
            </Section>

            <Section id="contratto" title={t.sections.contratto.title}>
              {t.sections.contratto.content}
            </Section>

            <Section id="spedizioni" title={t.sections.spedizioni.title}>
              {t.sections.spedizioni.content}
            </Section>

            <Section id="recesso" title={t.sections.recesso.title}>
              {t.sections.recesso.content}
            </Section>

            <Section id="garanzia" title={t.sections.garanzia.title}>
              {t.sections.garanzia.content}
            </Section>

            <Section id="responsabilita" title={t.sections.responsabilita.title}>
              {t.sections.responsabilita.content}
            </Section>

            <section id="legge" className="scroll-mt-24">
              <h2 className="text-lg font-semibold">{t.sections.legge.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
                {t.sections.legge.content}
              </div>
            </section>
          </div>

          <aside className="md:sticky md:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">{t.indexTitle}</p>
              <nav className="mt-3 space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const t = translations[displayLocale];

  return pageMetadata({
    title: t.title,
    description: t.description,
    path: "/termini/",
    locale,
    hreflang: true,
  });
}
