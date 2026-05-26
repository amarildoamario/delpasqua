import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { companyInfo } from "@/lib/companyInfo";
import { locales, type Locale } from "@/i18n/pathnames";

const lastUpdated = "24/05/2026";

const COMPANY_NAME = "Az. Agr. Del Pasqua";
const COMPANY_ADDRESS = companyInfo.addressLegal;
const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";
const COMPANY_MOBILE = "+39 338 811 0356";

const translations = {
  it: {
    title: "Privacy Policy",
    description: "Informativa privacy del sito Frantoio Del Pasqua.",
    legalDoc: "Documentazione legale",
    updated: "Ultimo aggiornamento: ",
    inShort: "In breve",
    inShortText: "Trattiamo i dati che ci invii tramite moduli, ordini e navigazione per gestire richieste, acquisti, consegne e sicurezza del sito.",
    indexTitle: "Indice",
    sections: {
      titolare: {
        title: "1. Titolare del trattamento",
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
              <br />
              Mobile:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+393388110356">
                {COMPANY_MOBILE}
              </a>
            </p>
          </>
        )
      },
      dati: {
        title: "2. Tipologie di dati trattati",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Dati di contatto inviati tramite form, email o telefono.</li>
            <li>Dati necessari per ordini, spedizioni, pagamenti e assistenza post vendita.</li>
            <li>Dati tecnici di navigazione, cookie e identificativi di sessione o carrello.</li>
          </ul>
        )
      },
      finalita: {
        title: "3. Finalita e basi giuridiche",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Rispondere alle richieste: misure precontrattuali o richiesta dell&apos;utente.</li>
            <li>Gestire ordini, pagamenti, consegne e resi: esecuzione del contratto.</li>
            <li>Adempiere a obblighi amministrativi, fiscali e legali: obbligo di legge.</li>
            <li>Sicurezza del sito e prevenzione abusi: legittimo interesse del titolare.</li>
            <li>Statistiche di terze parti, se attivate: consenso, quando richiesto.</li>
          </ul>
        )
      },
      conservazione: {
        title: "4. Conservazione",
        content: (
          <>
            <p>
              Conserviamo i dati per il tempo necessario a gestire la richiesta o il rapporto
              commerciale. La documentazione amministrativa e fiscale viene conservata nei termini
              previsti dalla legge.
            </p>
            <p>
              Le durate dei cookie e degli identificativi tecnici sono indicate nella Cookie
              Policy.
            </p>
          </>
        )
      },
      destinatari: {
        title: "5. Destinatari",
        content: (
          <>
            <p>I dati possono essere trattati, nei limiti necessari, da:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>fornitori tecnici e hosting;</li>
              <li>servizi per gestione ordini, pagamenti e spedizioni;</li>
              <li>consulenti amministrativi o fiscali;</li>
              <li>autorita pubbliche, quando previsto dalla legge.</li>
            </ul>
          </>
        )
      },
      trasferimenti: {
        title: "6. Trasferimenti extra UE",
        content: (
          <p>
            Alcuni fornitori tecnici o statistici possono trattare dati anche fuori dallo Spazio
            Economico Europeo. In questi casi il trattamento avviene sulla base di garanzie
            adeguate previste dalla normativa applicabile.
          </p>
        )
      },
      diritti: {
        title: "7. Diritti dell'interessato",
        content: (
          <>
            <p>
              Puoi chiedere accesso, rettifica, cancellazione, limitazione del trattamento,
              opposizione e portabilita dei dati, nei casi previsti dalla legge.
            </p>
            <p>
              Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati
              personali.
            </p>
          </>
        )
      },
      contatti: {
        title: "8. Contatti",
        content: (
          <p>
            Per richieste privacy puoi scrivere a{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            o chiamare il numero{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            .
          </p>
        )
      }
    }
  },
  en: {
    title: "Privacy Policy",
    description: "Privacy policy of the Frantoio Del Pasqua website.",
    legalDoc: "Legal documentation",
    updated: "Last updated: ",
    inShort: "In short",
    inShortText: "We process the data you send us through forms, orders, and browsing to manage requests, purchases, deliveries, and site security.",
    indexTitle: "Index",
    sections: {
      titolare: {
        title: "1. Data Controller",
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
              <br />
              Mobile:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+393388110356">
                {COMPANY_MOBILE}
              </a>
            </p>
          </>
        )
      },
      dati: {
        title: "2. Types of Data Processed",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Contact data sent via forms, email, or phone.</li>
            <li>Data necessary for orders, shipping, payments, and post-sales assistance.</li>
            <li>Technical browsing data, cookies, and session or cart identifiers.</li>
          </ul>
        )
      },
      finalita: {
        title: "3. Purposes and Legal Basis",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Responding to requests: pre-contractual measures or user request.</li>
            <li>Managing orders, payments, deliveries, and returns: execution of the contract.</li>
            <li>Fulfilling administrative, tax, and legal obligations: legal obligation.</li>
            <li>Site security and abuse prevention: legitimate interest of the controller.</li>
            <li>Third-party statistics, if enabled: consent, when required.</li>
          </ul>
        )
      },
      conservazione: {
        title: "4. Storage",
        content: (
          <>
            <p>
              We keep data for the time necessary to manage the request or the commercial relationship.
              Administrative and tax documentation is kept within the terms provided by law.
            </p>
            <p>
              The duration of cookies and technical identifiers is indicated in the Cookie Policy.
            </p>
          </>
        )
      },
      destinatari: {
        title: "5. Recipients",
        content: (
          <>
            <p>The data may be processed, within the limits necessary, by:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>technical and hosting providers;</li>
              <li>services for order management, payments, and shipping;</li>
              <li>administrative or tax consultants;</li>
              <li>public authorities, when required by law.</li>
            </ul>
          </>
        )
      },
      trasferimenti: {
        title: "6. Transfers outside the EU",
        content: (
          <p>
            Some technical or statistical providers may also process data outside the European Economic Area.
            In these cases, processing takes place on the basis of adequate guarantees provided by the applicable legislation.
          </p>
        )
      },
      diritti: {
        title: "7. Rights of the Data Subject",
        content: (
          <>
            <p>
              You can request access, rectification, erasure, restriction of processing, opposition, and portability of data, in the cases provided by law.
            </p>
            <p>
              You also have the right to lodge a complaint with the Authority for the protection of personal data.
            </p>
          </>
        )
      },
      contatti: {
        title: "8. Contacts",
        content: (
          <p>
            For privacy requests you can write to{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            or call the number{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            .
          </p>
        )
      }
    }
  },
  de: {
    title: "Datenschutzerklärung",
    description: "Datenschutzerklärung der Frantoio Del Pasqua Website.",
    legalDoc: "Rechtliche Dokumentation",
    updated: "Zuletzt aktualisiert: ",
    inShort: "Kurz gesagt",
    inShortText: "Wir verarbeiten die Daten, die Sie uns über Formulare, Bestellungen und das Surfen senden, um Anfragen, Einkäufe, Lieferungen und die Sicherheit der Website zu verwalten.",
    indexTitle: "Index",
    sections: {
      titolare: {
        title: "1. Verantwortlicher für die Datenverarbeitung",
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
              <br />
              Mobil:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+393388110356">
                {COMPANY_MOBILE}
              </a>
            </p>
          </>
        )
      },
      dati: {
        title: "2. Arten der verarbeiteten Daten",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Kontaktdaten, die über Formulare, E-Mail oder Telefon gesendet werden.</li>
            <li>Für Bestellungen, Versand, Zahlungen und Kundendienst erforderliche Daten.</li>
            <li>Technische Browserdaten, Cookies sowie Sitzungs- oder Warenkorbkennungen.</li>
          </ul>
        )
      },
      finalita: {
        title: "3. Zwecke und Rechtsgrundlagen",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Beantwortung von Anfragen: vorvertragliche Maßnahmen oder Anfrage des Nutzers.</li>
            <li>Verwaltung von Bestellungen, Zahlungen, Lieferungen und Rücksendungen: Vertragserfüllung.</li>
            <li>Erfüllung administrativer, steuerlicher und gesetzlicher Verpflichtungen: gesetzliche Verpflichtung.</li>
            <li>Sicherheit der Website und Vorbeugung von Missbrauch: berechtigtes Interesse des Verantwortlichen.</li>
            <li>Statistiken von Drittanbietern, falls aktiviert: Einwilligung, falls erforderlich.</li>
          </ul>
        )
      },
      conservazione: {
        title: "4. Aufbewahrung",
        content: (
          <>
            <p>
              Wir bewahren die Daten so lange auf, wie es für die Verwaltung der Anfrage oder der Geschäftsbeziehung erforderlich ist.
              Administrative und steuerliche Unterlagen werden im Rahmen der gesetzlich vorgeschriebenen Fristen aufbewahrt.
            </p>
            <p>
              Die Dauer von Cookies und technischen Kennungen ist in der Cookie-Richtlinie angegeben.
            </p>
          </>
        )
      },
      destinatari: {
        title: "5. Empfänger",
        content: (
          <>
            <p>Die Daten können im erforderlichen Umfang verarbeitet werden durch:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>technische Dienstleister und Hosting-Anbieter;</li>
              <li>Dienste für Bestellverwaltung, Zahlungen und Versand;</li>
              <li>Verwaltungs- oder Steuerberater;</li>
              <li>öffentliche Behörden, wenn dies gesetzlich vorgeschrieben ist.</li>
            </ul>
          </>
        )
      },
      trasferimenti: {
        title: "6. Übertragungen außerhalb der EU",
        content: (
          <p>
            Einige technische oder statistische Anbieter können Daten auch außerhalb des Europäischen Wirtschaftsraums verarbeiten.
            In diesen Fällen erfolgt die Verarbeitung auf der Grundlage angemessener Garantien, die durch die geltenden Rechtsvorschriften vorgesehen sind.
          </p>
        )
      },
      diritti: {
        title: "7. Rechte der betroffenen Person",
        content: (
          <>
            <p>
              Sie können in den gesetzlich vorgesehenen Fällen Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit verlangen.
            </p>
            <p>
              Sie haben außerdem das Recht, eine Beschwerde bei der Aufsichtsbehörde für den Schutz personenbezogener Daten einzureichen.
            </p>
          </>
        )
      },
      contatti: {
        title: "8. Kontakte",
        content: (
          <p>
            Für Datenschutzanfragen können Sie an folgende E-Mail-Adresse schreiben:{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            oder rufen Sie an unter{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            .
          </p>
        )
      }
    }
  },
  nl: {
    title: "Privacybeleid",
    description: "Privacybeleid van de Frantoio Del Pasqua website.",
    legalDoc: "Juridische documentatie",
    updated: "Laatst bijgewerkt: ",
    inShort: "In het kort",
    inShortText: "We verwerken de gegevens die u ons stuurt via formulieren, bestellingen en browsen om verzoeken, aankopen, leveringen en sitebeveiliging te beheren.",
    indexTitle: "Index",
    sections: {
      titolare: {
        title: "1. Verwerkingsverantwoordelijke",
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
              Telefoon:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
              <br />
              Mobiel:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+393388110356">
                {COMPANY_MOBILE}
              </a>
            </p>
          </>
        )
      },
      dati: {
        title: "2. Soorten verwerkte gegevens",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Contactgegevens verzonden via formulieren, e-mail of telefoon.</li>
            <li>Gegevens die nodig zijn voor bestellingen, verzending, betalingen en nazorg.</li>
            <li>Technische browsegegevens, cookies en sessie- of winkelwagen-identifiers.</li>
          </ul>
        )
      },
      finalita: {
        title: "3. Doeleinden en juridische grondslagen",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Beantwoorden van verzoeken: precontractuele maatregelen of verzoek van de gebruiker.</li>
            <li>Beheren van bestellingen, betalingen, leveringen en retourzendingen: uitvoering van de overeenkomst.</li>
            <li>Voldoen aan administratieve, fiscale en wettelijke verplichtingen: wettelijke verplichting.</li>
            <li>Sitebeveiliging en preventie van misbruik: gerechtvaardigd belang van de verwerkingsverantwoordelijke.</li>
            <li>Statistieken van derden, indien geactiveerd: toestemming, indien vereist.</li>
          </ul>
        )
      },
      conservazione: {
        title: "4. Bewaring",
        content: (
          <>
            <p>
              We bewaren de gegevens zo lang als nodig is om het verzoek of de commerciële relatie te beheren.
              Administratieve en fiscale documentatie wordt bewaard binnen de wettelijke termijnen.
            </p>
            <p>
              De duur van cookies en technische identifiers is aangegeven in het Cookiebeleid.
            </p>
          </>
        )
      },
      destinatari: {
        title: "5. Ontvangers",
        content: (
          <>
            <p>De gegevens kunnen, binnen de nodige limieten, worden verwerkt door:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>technische leveranciers en hosting;</li>
              <li>diensten voor bestelbeheer, betalingen en verzending;</li>
              <li>administratieve of fiscale adviseurs;</li>
              <li>openbare autoriteiten, wanneer wettelijk vereist.</li>
            </ul>
          </>
        )
      },
      trasferimenti: {
        title: "6. Doorgifte buiten de EU",
        content: (
          <p>
            Sommige technische of statistische leveranciers kunnen ook gegevens verwerken buiten de Europese Economische Ruimte.
            In deze gevallen vindt de verwerking plaats op basis van passende garanties die door de toepasselijke wetgeving worden geboden.
          </p>
        )
      },
      diritti: {
        title: "7. Rechten van de betrokkene",
        content: (
          <>
            <p>
              U kunt verzoeken om toegang, rectificatie, wissing, beperking van de verwerking, bezwaar en overdraagbaarheid van gegevens, in de gevallen voorzien door de wet.
            </p>
            <p>
              U hebt ook het recht om een klacht in te dienen bij de Autoriteit voor de bescherming van persoonsgegevens.
            </p>
          </>
        )
      },
      contatti: {
        title: "8. Contact",
        content: (
          <p>
            Voor privacyverzoeken kunt u schrijven naar{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            of bellen naar{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            .
          </p>
        )
      }
    }
  },
  da: {
    title: "Privatlivspolitik",
    description: "Privatlivspolitik for Frantoio Del Pasqua hjemmesiden.",
    legalDoc: "Juridisk dokumentation",
    updated: "Sidst opdateret: ",
    inShort: "Kort sagt",
    inShortText: "Vi behandler de data, du sender os via formularer, ordrer og browsing for at administrere anmodninger, køb, leverancer og webstedssikkerhed.",
    indexTitle: "Indeks",
    sections: {
      titolare: {
        title: "1. Dataansvarlig",
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
              <br />
              Mobil:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+393388110356">
                {COMPANY_MOBILE}
              </a>
            </p>
          </>
        )
      },
      dati: {
        title: "2. Typer af behandlede data",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Kontaktdata sendt via formularer, e-mail eller telefon.</li>
            <li>Nødvendige data til ordrer, forsendelse, betalinger og eftersalgsservice.</li>
            <li>Tekniske browsingdata, cookies og sessions- eller kurvidentifikatorer.</li>
          </ul>
        )
      },
      finalita: {
        title: "3. Formål og retsgrundlag",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Besvarelse af anmodninger: prækontraktuelle foranstaltninger eller brugeranmodning.</li>
            <li>Administrere ordrer, betalinger, leverancer og returneringer: opfyldelse af kontrakten.</li>
            <li>Opfyldelse af administrative, skattemæssige og juridiske forpligtelser: retlig forpligtelse.</li>
            <li>Webstedssikkerhed og forebyggelse af misbrug: legitim interesse for den dataansvarlige.</li>
            <li>Tredjepartsstatistikker, hvis aktiveret: samtykke, når det er påkrævet.</li>
          </ul>
        )
      },
      conservazione: {
        title: "4. Opbevaring",
        content: (
          <>
            <p>
              Vi opbevarer data i den tid, der er nødvendig for at administrere anmodningen eller det kommercielle forhold.
              Administrativ og skattemæssig dokumentation opbevares inden for de rammer, der er fastsat i lovgivningen.
            </p>
            <p>
              Varigheden af cookies og tekniske identifikatorer er angivet i cookiepolitikken.
            </p>
          </>
        )
      },
      destinatari: {
        title: "5. Modtagere",
        content: (
          <>
            <p>Dataene kan behandles, inden for de nødvendige grænser, af:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>tekniske udbydere og hosting;</li>
              <li>tjenester til ordrestyring, betalinger og forsendelse;</li>
              <li>administrative eller skattemæssige konsulenter;</li>
              <li>offentlige myndigheder, når det kræves ved lov.</li>
            </ul>
          </>
        )
      },
      trasferimenti: {
        title: "6. Overførsler uden for EU",
        content: (
          <p>
            Nogle tekniske eller statistiske udbydere kan også behandle data uden for Det Europæiske Økonomiske Samarbejdsområde.
            I disse tilfælde sker behandlingen på grundlag af passende garantier i henhold til gældende lovgivning.
          </p>
        )
      },
      diritti: {
        title: "7. Den registreredes rettigheder",
        content: (
          <>
            <p>
              Du kan anmode om indsigt, berigtigelse, sletning, begrænsning af behandling, indsigelse og dataportabilitet i de tilfælde, der er fastsat ved lov.
            </p>
            <p>
              Du har også ret til at indgive en klage til Datatilsynet.
            </p>
          </>
        )
      },
      contatti: {
        title: "8. Kontakter",
        content: (
          <p>
            For privatlivsforespørgsler kan du skrive til{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            eller ringe på nummeret{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            .
          </p>
        )
      }
    }
  },
  no: {
    title: "Personvernerklæring",
    description: "Personvernerklæring for Frantoio Del Pasqua nettstedet.",
    legalDoc: "Juridisk dokumentasjon",
    updated: "Sist oppdatert: ",
    inShort: "Kort sagt",
    inShortText: "Vi behandler dataene du sender oss via skjemaer, bestillinger og surfing for å administrere forespørsler, kjøp, leveranser og nettstedsikkerhet.",
    indexTitle: "Indeks",
    sections: {
      titolare: {
        title: "1. Behandlingsansvarlig",
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
              <br />
              Mobil:{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+393388110356">
                {COMPANY_MOBILE}
              </a>
            </p>
          </>
        )
      },
      dati: {
        title: "2. Typer data som behandles",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Kontaktdata sendt via skjemaer, e-post eller telefon.</li>
            <li>Nødvendige data for bestillinger, frakt, betalinger og ettersalgsservice.</li>
            <li>Tekniske nettleserdata, informasjonskapsler og økt- eller handlekurvidentifikatorer.</li>
          </ul>
        )
      },
      finalita: {
        title: "3. Formål og rettslig grunnlag",
        content: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Besvare forespørsler: prekontraktuelle tiltak eller brukerforespørsel.</li>
            <li>Administrere bestillinger, betalinger, leveranser og returer: oppfyllelse av kontrakten.</li>
            <li>Oppfyllelse av administrative, skattemessige og juridiske forpliktelser: rettslig forpliktelse.</li>
            <li>Nettstedsikkerhet og forebygging av misbruk: behandlingsansvarliges berettigede interesse.</li>
            <li>Tredjepartsstatistikk, hvis aktivert: samtykke når det er påkrevet.</li>
          </ul>
        )
      },
      conservazione: {
        title: "4. Lagring",
        content: (
          <>
            <p>
              Vi oppbevarer data i den tiden som er nødvendig for å administrere forespørselen eller det kommersielle forholdet.
              Administrativ og skattemessig dokumentasjon oppbevares innenfor de rammene som følger av loven.
            </p>
            <p>
              Varigheten av informasjonskapsler og tekniske identifikatorer er angitt i Cookie Policy.
            </p>
          </>
        )
      },
      destinatari: {
        title: "5. Mottakere",
        content: (
          <>
            <p>Dataene kan behandles, innenfor de nødvendige grensene, av:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>tekniske leverandører og hosting;</li>
              <li>tjenester for bestillingshåndtering, betalinger og frakt;</li>
              <li>administrative eller skattemessige konsulenter;</li>
              <li>offentlige myndigheter, når det kreves ved lov.</li>
            </ul>
          </>
        )
      },
      trasferimenti: {
        title: "6. Overføringer utenfor EU",
        content: (
          <p>
            Enkelte tekniske eller statistiske leverandører kan også behandle data utenfor Det europeiske økonomiske samarbeidsområdet.
            I disse tilfellene skjer behandlingen på grunnlag av tilstrekkelige garantier gitt av gjeldende lovgivning.
          </p>
        )
      },
      diritti: {
        title: "7. Den registrertes rettigheter",
        content: (
          <>
            <p>
              Du kan be om innsyn, retting, sletting, begrensning av behandling, innsigelse og dataportabilitet i de tilfellene som følger av loven.
            </p>
            <p>
              Du har også rett til å klage til Datatilsynet.
            </p>
          </>
        )
      },
      contatti: {
        title: "8. Kontakter",
        content: (
          <p>
            For personvernforespørsler kan du skrive til{" "}
            <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>{" "}
            eller ringe på nummeret{" "}
            <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
              {COMPANY_PHONE}
            </a>
            .
          </p>
        )
      }
    }
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return pageMetadata({
    title: t.title,
    description: t.description,
    path: "/privacy/",
    locale,
    hreflang: true,
  });
}

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
      <div className="flex items-start gap-3">
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-zinc-900" />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">{children}</div>
        </div>
      </div>
      <div className="my-8 h-px w-full bg-zinc-200" />
    </section>
  );
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  const sectionsList = [
    { id: "titolare", title: t.sections.titolare.title },
    { id: "dati", title: t.sections.dati.title },
    { id: "finalita", title: t.sections.finalita.title },
    { id: "conservazione", title: t.sections.conservazione.title },
    { id: "destinatari", title: t.sections.destinatari.title },
    { id: "trasferimenti", title: t.sections.trasferimenti.title },
    { id: "diritti", title: t.sections.diritti.title },
    { id: "contatti", title: t.sections.contatti.title },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {t.legalDoc}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {t.updated} <span className="font-medium">{lastUpdated}</span>
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-medium text-zinc-900">{t.inShort}</p>
            <p className="mt-1">
              {t.inShortText}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <Section id="titolare" title={t.sections.titolare.title}>
              {t.sections.titolare.content}
            </Section>

            <Section id="dati" title={t.sections.dati.title}>
              {t.sections.dati.content}
            </Section>

            <Section id="finalita" title={t.sections.finalita.title}>
              {t.sections.finalita.content}
            </Section>

            <Section id="conservazione" title={t.sections.conservazione.title}>
              {t.sections.conservazione.content}
            </Section>

            <Section id="destinatari" title={t.sections.destinatari.title}>
              {t.sections.destinatari.content}
            </Section>

            <Section id="trasferimenti" title={t.sections.trasferimenti.title}>
              {t.sections.trasferimenti.content}
            </Section>

            <Section id="diritti" title={t.sections.diritti.title}>
              {t.sections.diritti.content}
            </Section>

            <section id="contatti" className="scroll-mt-24">
              <h2 className="text-lg font-semibold">{t.sections.contatti.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
                {t.sections.contatti.content}
              </div>
            </section>
          </div>

          <aside className="md:sticky md:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">{t.indexTitle}</p>
              <nav className="mt-3 space-y-1">
                {sectionsList.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    {section.title}
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
