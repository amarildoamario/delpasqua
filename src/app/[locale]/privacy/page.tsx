import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { companyInfo } from "@/lib/companyInfo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: "Privacy Policy",
    description: "Informativa privacy del sito Frantoio Del Pasqua.",
    path: "/privacy/",
    locale,
    hreflang: true,
  });
}

const lastUpdated = "24/05/2026";

const COMPANY_NAME = "Az. Agr. Del Pasqua";
const COMPANY_ADDRESS = companyInfo.addressLegal;
const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";
const COMPANY_MOBILE = "+39 338 811 0356";

const sections = [
  { id: "titolare", title: "Titolare del trattamento" },
  { id: "dati", title: "Tipologie di dati trattati" },
  { id: "finalita", title: "Finalita e basi giuridiche" },
  { id: "conservazione", title: "Conservazione" },
  { id: "destinatari", title: "Destinatari" },
  { id: "trasferimenti", title: "Trasferimenti extra UE" },
  { id: "diritti", title: "Diritti dell'interessato" },
  { id: "contatti", title: "Contatti" },
];

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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Documentazione legale
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Ultimo aggiornamento: <span className="font-medium">{lastUpdated}</span>
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-medium text-zinc-900">In breve</p>
            <p className="mt-1">
              Trattiamo i dati che ci invii tramite moduli, ordini e navigazione per gestire
              richieste, acquisti, consegne e sicurezza del sito.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <Section id="titolare" title="1. Titolare del trattamento">
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
            </Section>

            <Section id="dati" title="2. Tipologie di dati trattati">
              <ul className="list-disc space-y-2 pl-5">
                <li>Dati di contatto inviati tramite form, email o telefono.</li>
                <li>Dati necessari per ordini, spedizioni, pagamenti e assistenza post vendita.</li>
                <li>Dati tecnici di navigazione, cookie e identificativi di sessione o carrello.</li>
              </ul>
            </Section>

            <Section id="finalita" title="3. Finalita e basi giuridiche">
              <ul className="list-disc space-y-2 pl-5">
                <li>Rispondere alle richieste: misure precontrattuali o richiesta dell&apos;utente.</li>
                <li>Gestire ordini, pagamenti, consegne e resi: esecuzione del contratto.</li>
                <li>Adempiere a obblighi amministrativi, fiscali e legali: obbligo di legge.</li>
                <li>Sicurezza del sito e prevenzione abusi: legittimo interesse del titolare.</li>
                <li>Statistiche di terze parti, se attivate: consenso, quando richiesto.</li>
              </ul>
            </Section>

            <Section id="conservazione" title="4. Conservazione">
              <p>
                Conserviamo i dati per il tempo necessario a gestire la richiesta o il rapporto
                commerciale. La documentazione amministrativa e fiscale viene conservata nei termini
                previsti dalla legge.
              </p>
              <p>
                Le durate dei cookie e degli identificativi tecnici sono indicate nella Cookie
                Policy.
              </p>
            </Section>

            <Section id="destinatari" title="5. Destinatari">
              <p>I dati possono essere trattati, nei limiti necessari, da:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>fornitori tecnici e hosting;</li>
                <li>servizi per gestione ordini, pagamenti e spedizioni;</li>
                <li>consulenti amministrativi o fiscali;</li>
                <li>autorita pubbliche, quando previsto dalla legge.</li>
              </ul>
            </Section>

            <Section id="trasferimenti" title="6. Trasferimenti extra UE">
              <p>
                Alcuni fornitori tecnici o statistici possono trattare dati anche fuori dallo Spazio
                Economico Europeo. In questi casi il trattamento avviene sulla base di garanzie
                adeguate previste dalla normativa applicabile.
              </p>
            </Section>

            <Section id="diritti" title="7. Diritti dell'interessato">
              <p>
                Puoi chiedere accesso, rettifica, cancellazione, limitazione del trattamento,
                opposizione e portabilita dei dati, nei casi previsti dalla legge.
              </p>
              <p>
                Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati
                personali.
              </p>
            </Section>

            <section id="contatti" className="scroll-mt-24">
              <h2 className="text-lg font-semibold">8. Contatti</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
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
              </div>
            </section>
          </div>

          <aside className="md:sticky md:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">Indice</p>
              <nav className="mt-3 space-y-1">
                {sections.map((section) => (
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
