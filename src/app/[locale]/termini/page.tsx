import Footer from "@/components/Footer";

export const metadata = { title: "Termini e Condizioni" };

const lastUpdated = "17/02/2026";

const toc = [
  { id: "venditore", label: "Informazioni sul venditore" },
  { id: "oggetto", label: "Oggetto" },
  { id: "prezzi", label: "Prezzi e pagamenti" },
  { id: "contratto", label: "Conclusione del contratto" },
  { id: "spedizioni", label: "Spedizioni e consegna" },
  { id: "recesso", label: "Recesso e resi" },
  { id: "garanzia", label: "Garanzia legale" },
  { id: "responsabilita", label: "Limitazioni di responsabilità" },
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
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
        {children}
      </div>
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
            <p className="font-medium text-zinc-900">Suggerimento</p>
            <p className="mt-1">
              Dove vedi testo in <span className="italic">corsivo</span>, completa con i tuoi dati.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <Section id="venditore" title="1. Informazioni sul venditore">
              <p className="italic">
                Inserisci ragione sociale, P.IVA, sede, contatti, PEC, REA (se applicabile).
              </p>
            </Section>

            <Section id="oggetto" title="2. Oggetto">
              <p>Il presente documento disciplina l’acquisto di prodotti tramite il sito.</p>
            </Section>

            <Section id="prezzi" title="3. Prezzi e pagamenti">
              <p className="italic">
                Indica valuta, IVA inclusa/esclusa, metodi di pagamento e eventuali costi extra.
              </p>
            </Section>

            <Section id="contratto" title="4. Conclusione del contratto">
              <p>L’ordine si intende confermato al ricevimento della conferma d’ordine via email.</p>
            </Section>

            <Section id="spedizioni" title="5. Spedizioni e consegna">
              <p>
                Per costi e tempi, fai riferimento alla pagina <strong>Spedizioni</strong>.
              </p>
            </Section>

            <Section id="recesso" title="6. Recesso e resi">
              <p>
                Per condizioni, tempi e procedure, fai riferimento alla pagina{" "}
                <strong>Resi e rimborsi</strong>.
              </p>
              <p className="text-xs text-zinc-500">
                Nota: per alcuni beni possono valere esclusioni previste dalla legge (es. beni
                sigillati/deperibili).
              </p>
            </Section>

            <Section id="garanzia" title="7. Garanzia legale">
              <p className="italic">
                Inserisci info sulla garanzia legale di conformità (per consumatori).
              </p>
            </Section>

            <Section id="responsabilita" title="8. Limitazioni di responsabilità">
              <p className="italic">
                Inserisci eventuali limitazioni consentite e condizioni d’uso del sito.
              </p>
            </Section>

            <section id="legge" className="scroll-mt-24">
              <h2 className="text-lg font-semibold">9. Legge applicabile e foro</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
                <p className="italic">
                  Indica legge applicabile e foro competente nel rispetto delle norme consumeristiche.
                </p>
                <p className="text-xs text-zinc-500">
                  Nota: questo testo non costituisce consulenza legale.
                </p>
              </div>
            </section>
          </div>

          <aside className="md:sticky md:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">Indice</p>
              <nav className="mt-3 space-y-1">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    {t.label}
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
