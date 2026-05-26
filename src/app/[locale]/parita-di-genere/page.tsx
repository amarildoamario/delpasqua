import { locales, type Locale } from "@/i18n/pathnames";
import { pageMetadata } from "@/lib/seo";

const translations = {
  it: {
    title: "Parità di genere",
    description: "Informativa sulla parità di genere UNI PDR 125 del Frantoio Del Pasqua.",
    heading: "Parità di genere",
    content: "Inserisci qui la tua dichiarazione/policy (testo, obiettivi, contatti, eventuale PDF)."
  },
  en: {
    title: "Gender equality",
    description: "Gender equality policy UNI PDR 125 of Frantoio Del Pasqua.",
    heading: "Gender equality",
    content: "Insert here your statement/policy (text, objectives, contacts, eventual PDF)."
  },
  de: {
    title: "Gleichberechtigung der Geschlechter",
    description: "Gleichberechtigungspolitik UNI PDR 125 von Frantoio Del Pasqua.",
    heading: "Gleichberechtigung der Geschlechter",
    content: "Fügen Sie hier Ihre Erklärung/Richtlinie ein (Text, Ziele, Kontakte, eventuelles PDF)."
  },
  nl: {
    title: "Gendergelijkheid",
    description: "Gendergelijkheidsbeleid UNI PDR 125 van Frantoio Del Pasqua.",
    heading: "Gendergelijkheid",
    content: "Voeg hier uw verklaring/beleid toe (tekst, doelstellingen, contacten, eventuele PDF)."
  },
  da: {
    title: "Ligestilling mellem kønnene",
    description: "Ligestillingspolitik UNI PDR 125 for Frantoio Del Pasqua.",
    heading: "Ligestilling mellem kønnene",
    content: "Indsæt din erklæring/politik her (tekst, mål, kontakter, eventuel PDF)."
  },
  no: {
    title: "Likestilling",
    description: "Likestillingspolicy UNI PDR 125 for Frantoio Del Pasqua.",
    heading: "Likestilling",
    content: "Sett inn din erklæring/retningslinje her (tekst, mål, kontakter, eventuell PDF)."
  }
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
    hreflang: false,
  });
}

export default async function ParitaDiGenerePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t.heading}</h1>
      <p className="mt-6 leading-relaxed">
        {t.content}
      </p>
    </main>
  );
}
