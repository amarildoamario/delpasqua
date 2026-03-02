import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy" };

const lastUpdated = "17/02/2026";

const sections = [
  { id: "titolare", title: "Titolare del trattamento" },
  { id: "dati", title: "Tipologie di dati trattati" },
  { id: "finalita", title: "Finalità e basi giuridiche" },
  { id: "conservazione", title: "Conservazione" },
  { id: "destinatari", title: "Destinatari" },
  { id: "trasferimenti", title: "Trasferimenti extra UE" },
  { id: "diritti", title: "Diritti dell’interessato" },
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
          <h2 className="text-lg font-semibold text-zinc-900">
            {title}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
            {children}
          </div>
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
        {/* Header */}
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
            <p className="font-medium text-zinc-900">Nota rapida</p>
            <p className="mt-1">
              Template informativo: completa i campi in <span className="italic">corsivo</span> con
              i tuoi dati (azienda, provider, tempi, contatti).
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          {/* Content */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <Section id="titolare" title="1. Titolare del trattamento">
              <p className="italic">
                Inserisci ragione sociale, P.IVA, sede legale, email/PEC.
              </p>
            </Section>

            <Section id="dati" title="2. Tipologie di dati trattati">
              <ul className="list-disc space-y-2 pl-5">
                <li>Dati identificativi e di contatto (nome, email, telefono, indirizzo).</li>
                <li>Dati di acquisto e fatturazione.</li>
                <li>
                  Dati tecnici di navigazione (log, IP, user-agent) per sicurezza e funzionamento.
                </li>
              </ul>
            </Section>

            <Section id="finalita" title="3. Finalità e basi giuridiche">
              <ul className="list-disc space-y-2 pl-5">
                <li>Esecuzione del contratto (ordini, consegne, assistenza).</li>
                <li>Adempimenti legali e fiscali.</li>
                <li>Prevenzione frodi e sicurezza del sito (legittimo interesse).</li>
                <li>Marketing (solo se previsto e con consenso, quando applicabile).</li>
              </ul>
            </Section>

            <Section id="conservazione" title="4. Conservazione">
              <p>
                I dati vengono conservati per il tempo necessario alle finalità sopra indicate e,
                per i dati contabili/fiscali, secondo gli obblighi di legge.{" "}
                <span className="italic">(Inserisci periodi specifici se li hai.)</span>
              </p>
            </Section>

            <Section id="destinatari" title="5. Destinatari">
              <p>
                I dati possono essere trattati da fornitori (hosting, pagamenti, spedizionieri,
                assistenza) nominati responsabili del trattamento, ove necessario.
              </p>
            </Section>

            <Section id="trasferimenti" title="6. Trasferimenti extra UE">
              <p className="italic">
                Indica se utilizzi servizi con trasferimenti extra UE e le relative garanzie (es.
                SCC).
              </p>
            </Section>

            <Section id="diritti" title="7. Diritti dell’interessato">
              <p>
                Hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione,
                portabilità e reclamo all’Autorità Garante competente.
              </p>
            </Section>

            <section id="contatti" className="scroll-mt-24">
              <h2 className="text-lg font-semibold">8. Contatti</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
                <p className="italic">Per richieste privacy: inserisci email/PEC.</p>
                <p className="text-xs text-zinc-500">
                  Nota: questo testo non costituisce consulenza legale.
                </p>
              </div>
            </section>
          </div>

          {/* TOC */}
          <aside className="md:sticky md:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">Indice</p>
              <nav className="mt-3 space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    {s.title}
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
