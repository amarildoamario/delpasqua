import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: "Condizioni Generali di Vendita",
    description: "Termini, condizioni di vendita e informazioni commerciali del sito Frantoio Del Pasqua.",
    path: "/condizioni-generali-di-vendita/",
    locale,
    hreflang: false,
  });
}

const lastUpdated = "24/05/2026";

const COMPANY_NAME = "FRANTOIO DEL PASQUA srl";
const COMPANY_ADDRESS = "Loc. Infernaccio 510/B, 52048 Monte San Savino (AR), Italia";
const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";

const toc = [
  { id: "venditore", label: "Informazioni sul venditore" },
  { id: "oggetto", label: "Oggetto" },
  { id: "prezzi", label: "Prezzi e pagamenti" },
  { id: "contratto", label: "Conclusione del contratto" },
  { id: "spedizioni", label: "Spedizioni e consegna" },
  { id: "recesso", label: "Recesso e resi" },
  { id: "garanzia", label: "Garanzia legale" },
  { id: "responsabilita", label: "Limitazioni di responsabilita" },
  { id: "legge", label: "Legge applicabile e foro" },
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">{children}</div>
      <div className="my-8 h-px bg-zinc-200" />
    </section>
  );
}

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Documentazione legale
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Termini e Condizioni
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Ultimo aggiornamento: <span className="font-medium">{lastUpdated}</span>
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-medium text-zinc-900">Ambito</p>
            <p className="mt-1">
              Queste condizioni si applicano agli acquisti conclusi tramite il sito Frantoio Del
              Pasqua.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <Section id="venditore" title="1. Informazioni sul venditore">
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
            </Section>

            <Section id="oggetto" title="2. Oggetto">
              <p>
                Il sito consente l&apos;acquisto online dei prodotti proposti da Frantoio Del Pasqua,
                con particolare riferimento a olio extra vergine di oliva e articoli collegati.
              </p>
            </Section>

            <Section id="prezzi" title="3. Prezzi e pagamenti">
              <p>
                I prezzi sono espressi in euro. Eventuali spese di spedizione e il totale finale
                vengono mostrati prima della conferma dell&apos;ordine.
              </p>
              <p>
                I metodi di pagamento disponibili sono quelli visualizzati al checkout al momento
                dell&apos;acquisto.
              </p>
            </Section>

            <Section id="contratto" title="4. Conclusione del contratto">
              <p>
                L&apos;invio dell&apos;ordine costituisce una richiesta di acquisto. Il contratto si considera
                concluso quando ricevi la conferma d&apos;ordine all&apos;indirizzo email indicato.
              </p>
            </Section>

            <Section id="spedizioni" title="5. Spedizioni e consegna">
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
            </Section>

            <Section id="recesso" title="6. Recesso e resi">
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
            </Section>

            <Section id="garanzia" title="7. Garanzia legale">
              <p>
                Per i clienti consumatori si applica la garanzia legale di conformita prevista dalla
                normativa vigente.
              </p>
            </Section>

            <Section id="responsabilita" title="8. Limitazioni di responsabilita">
              <p>
                Frantoio Del Pasqua non risponde di ritardi o disservizi dovuti a cause di forza
                maggiore, servizi di terzi o dati errati forniti dal cliente, nei limiti consentiti
                dalla legge.
              </p>
            </Section>

            <section id="legge" className="scroll-mt-24">
              <h2 className="text-lg font-semibold">9. Legge applicabile e foro</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
                <p>
                  I contratti conclusi tramite il sito sono regolati dalla legge italiana.
                </p>
                <p>
                  Se acquisti come consumatore, per le controversie resta fermo il foro del tuo
                  luogo di residenza o domicilio, quando previsto dalla normativa applicabile.
                </p>
              </div>
            </section>
          </div>

          <aside className="md:sticky md:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">Indice</p>
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
