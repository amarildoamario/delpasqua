import Footer from "@/components/Footer";

export const metadata = { title: "Cookie Policy" };

const lastUpdated = "17/02/2026";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200/90">
      {children}
    </span>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200/90">
        {children}
      </div>
    </div>
  );
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge>Documentazione legale</Badge>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Ultimo aggiornamento: <span className="font-medium">{lastUpdated}</span>
            </p>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Cookie Policy</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-200/90">
            Qui trovi informazioni sui cookie e su tecnologie simili utilizzate dal sito. Se in
            futuro attiveremo cookie non necessari (es. statistiche), aggiungeremo un sistema di
            consenso.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="1. Cosa sono i cookie">
            <p>
              I cookie sono piccoli file di testo salvati sul tuo dispositivo quando visiti un
              sito. Servono a far funzionare alcune funzionalità e a migliorare l’esperienza.
            </p>
          </Card>

          <Card title="2. Tipologie di cookie">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Necessari</strong>: indispensabili per il funzionamento.
              </li>
              <li>
                <strong>Preferenze</strong>: memorizzano scelte come lingua/tema (se presenti).
              </li>
              <li>
                <strong>Statistiche</strong>: misurano utilizzo in forma aggregata (se attivate).
              </li>
              <li>
                <strong>Marketing</strong>: profilazione e ads (se attivate).
              </li>
            </ul>
          </Card>

          <Card title="3. Gestione dal browser">
            <p>
              Puoi gestire o eliminare i cookie dalle impostazioni del browser. Disattivando i
              cookie necessari alcune parti del sito potrebbero non funzionare correttamente.
            </p>
          </Card>

          <Card title="4. Elenco cookie (da completare)">
            <p className="italic">
              Inserisci qui l’elenco reale dei cookie: nome, provider, finalità, durata.
            </p>
          </Card>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200/90">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">Nota</p>
          <p className="mt-1">Questo testo è un template informativo e non costituisce consulenza legale.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
