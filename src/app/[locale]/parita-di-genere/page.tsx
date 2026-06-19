import { locales, type Locale } from "@/i18n/pathnames";
import { pageMetadata } from "@/lib/seo";

const translations = {
  it: {
    title: "Parita di genere",
    description: "Impegno del Frantoio Del Pasqua per pari opportunita, inclusione e rispetto sul lavoro.",
    heading: "Parita di genere",
    intro: "Frantoio Del Pasqua promuove un ambiente di lavoro fondato su rispetto, equita e pari opportunita. La nostra organizzazione si impegna a prevenire discriminazioni, valorizzare le competenze e garantire condizioni trasparenti nelle relazioni professionali.",
    commitments: [
      "Selezione, crescita e collaborazione basate su competenze, responsabilita e merito.",
      "Rispetto della persona in ogni fase del rapporto di lavoro e nelle attivita con fornitori, partner e clienti.",
      "Attenzione alla conciliazione tra vita privata e lavoro, compatibilmente con le esigenze operative del frantoio.",
      "Gestione riservata di eventuali segnalazioni relative a comportamenti discriminatori o non coerenti con questi principi.",
    ],
    contact: "Per informazioni o segnalazioni e possibile contattare l'azienda tramite i riferimenti ufficiali presenti nella pagina Contatti.",
  },
  en: {
    title: "Gender equality",
    description: "Frantoio Del Pasqua commitment to equal opportunities, inclusion, and respect at work.",
    heading: "Gender equality",
    intro: "Frantoio Del Pasqua promotes a working environment based on respect, fairness, and equal opportunities. We are committed to preventing discrimination, valuing skills, and ensuring transparent professional relationships.",
    commitments: [
      "Selection, growth, and collaboration based on skills, responsibility, and merit.",
      "Respect for each person in employment relationships and in activities with suppliers, partners, and customers.",
      "Attention to work-life balance, consistently with the operational needs of the mill.",
      "Confidential handling of any reports concerning discriminatory conduct or behavior inconsistent with these principles.",
    ],
    contact: "For information or reports, please contact the company through the official details on the Contact page.",
  },
  de: {
    title: "Gleichberechtigung der Geschlechter",
    description: "Engagement von Frantoio Del Pasqua fur Chancengleichheit, Inklusion und Respekt am Arbeitsplatz.",
    heading: "Gleichberechtigung der Geschlechter",
    intro: "Frantoio Del Pasqua fordert ein Arbeitsumfeld, das auf Respekt, Fairness und Chancengleichheit basiert. Wir verpflichten uns, Diskriminierung zu vermeiden, Kompetenzen zu wertschatzen und transparente berufliche Beziehungen zu gewahrleisten.",
    commitments: [
      "Auswahl, Entwicklung und Zusammenarbeit auf Basis von Kompetenz, Verantwortung und Leistung.",
      "Respekt fur jede Person in Arbeitsbeziehungen sowie in Aktivitaten mit Lieferanten, Partnern und Kunden.",
      "Aufmerksamkeit fur die Vereinbarkeit von Privatleben und Arbeit, im Einklang mit den betrieblichen Anforderungen der Olmuhle.",
      "Vertrauliche Bearbeitung moglicher Meldungen zu diskriminierendem Verhalten oder Verhalten, das diesen Grundsatzen widerspricht.",
    ],
    contact: "Fur Informationen oder Meldungen kontaktieren Sie das Unternehmen bitte uber die offiziellen Angaben auf der Kontaktseite.",
  },
  nl: {
    title: "Gendergelijkheid",
    description: "Inzet van Frantoio Del Pasqua voor gelijke kansen, inclusie en respect op het werk.",
    heading: "Gendergelijkheid",
    intro: "Frantoio Del Pasqua bevordert een werkomgeving gebaseerd op respect, eerlijkheid en gelijke kansen. We zetten ons in om discriminatie te voorkomen, vaardigheden te waarderen en transparante professionele relaties te waarborgen.",
    commitments: [
      "Selectie, groei en samenwerking op basis van vaardigheden, verantwoordelijkheid en verdienste.",
      "Respect voor iedere persoon in werkrelaties en in activiteiten met leveranciers, partners en klanten.",
      "Aandacht voor de balans tussen prive en werk, in lijn met de operationele behoeften van de oliemolen.",
      "Vertrouwelijke behandeling van meldingen over discriminerend gedrag of gedrag dat niet past bij deze principes.",
    ],
    contact: "Voor informatie of meldingen kunt u contact opnemen met het bedrijf via de officiele gegevens op de contactpagina.",
  },
  da: {
    title: "Ligestilling mellem konnene",
    description: "Frantoio Del Pasquas engagement i lige muligheder, inklusion og respekt pa arbejdspladsen.",
    heading: "Ligestilling mellem konnene",
    intro: "Frantoio Del Pasqua fremmer et arbejdsmiljo baseret pa respekt, retfaerdighed og lige muligheder. Vi arbejder for at forebygge diskrimination, vaerdsaette kompetencer og sikre gennemsigtige professionelle relationer.",
    commitments: [
      "Udvaelgelse, udvikling og samarbejde baseret pa kompetencer, ansvar og fortjeneste.",
      "Respekt for hver person i arbejdsrelationer og i aktiviteter med leverandorer, partnere og kunder.",
      "Opmearksomhed pa balancen mellem privatliv og arbejde, i overensstemmelse med oliemollens driftsbehov.",
      "Fortrolig handtering af eventuelle indberetninger om diskriminerende adfaerd eller adfaerd, der ikke er i trad med disse principper.",
    ],
    contact: "For information eller indberetninger kan virksomheden kontaktes via de officielle oplysninger pa kontaktsiden.",
  },
  no: {
    title: "Likestilling",
    description: "Frantoio Del Pasquas arbeid for like muligheter, inkludering og respekt pa arbeidsplassen.",
    heading: "Likestilling",
    intro: "Frantoio Del Pasqua fremmer et arbeidsmiljo basert pa respekt, rettferdighet og like muligheter. Vi arbeider for a forebygge diskriminering, verdsette kompetanse og sikre apne profesjonelle relasjoner.",
    commitments: [
      "Utvelgelse, utvikling og samarbeid basert pa kompetanse, ansvar og fortjeneste.",
      "Respekt for hver person i arbeidsforhold og i aktiviteter med leverandorer, partnere og kunder.",
      "Oppmerksomhet pa balansen mellom privatliv og arbeid, i trad med oljemollens driftsbehov.",
      "Konfidensiell behandling av eventuelle meldinger om diskriminerende atferd eller atferd som ikke er i samsvar med disse prinsippene.",
    ],
    contact: "For informasjon eller meldinger kan selskapet kontaktes via de offisielle opplysningene pa kontaktsiden.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return pageMetadata({
    title: t.title,
    description: t.description,
    path: "/parita-di-genere/",
    locale,
    hreflang: true,
  });
}

export default async function ParitaDiGenerePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F7D58]">
        Frantoio Del Pasqua
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl">
        {t.heading}
      </h1>
      <p className="mt-6 leading-7 text-[#44403C]">
        {t.intro}
      </p>
      <ul className="mt-8 space-y-4">
        {t.commitments.map((item) => (
          <li
            key={item}
            className="rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] p-4 text-sm leading-6 text-[#44403C]"
          >
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-8 border-t border-[#E7E5E4] pt-6 text-sm leading-6 text-[#57534E]">
        {t.contact}
      </p>
    </main>
  );
}
