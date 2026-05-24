import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: "Cookie Policy",
    description: "Informazioni sui cookie e sulle tecnologie simili usate dal sito Frantoio Del Pasqua.",
    path: "/cookie-policy/",
    locale,
    hreflang: false,
  });
}

const lastUpdated = "24/05/2026";

const COMPANY_EMAIL = "info@delpasqua.com";

const cookieRows = [
  {
    name: "theme",
    purpose: "Memorizza la preferenza di visualizzazione del sito.",
    duration: "12 mesi",
  },
  {
    name: "cart_id",
    purpose: "Mantiene associato il carrello al browser.",
    duration: "30 giorni",
  },
  {
    name: "v_id",
    purpose: "Identificatore anonimo di prima parte per misurazioni di utilizzo e performance.",
    duration: "12 mesi",
  },
  {
    name: "s_id",
    purpose: "Identificatore di sessione per continuita di navigazione e misurazioni tecniche.",
    duration: "30 minuti dall'ultima attivita",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">{children}</div>
    </div>
  );
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge>Documentazione legale</Badge>
            <p className="text-sm text-zinc-600">
              Ultimo aggiornamento: <span className="font-medium">{lastUpdated}</span>
            </p>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Cookie Policy</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-700">
            Il sito usa cookie tecnici e identificativi di prima parte collegati a preferenze,
            carrello e misurazioni di funzionamento. Non usiamo cookie pubblicitari sul frontend
            pubblico.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="1. Cosa usiamo">
            <p>
              I cookie servono a mantenere attive alcune funzioni del sito, ricordare preferenze e
              capire in modo aggregato come vengono usate pagine e checkout.
            </p>
            <p>
              Oltre ai cookie, il browser puo conservare dati locali strettamente collegati a
              preferenze di visualizzazione o continuita del carrello.
            </p>
          </Card>

          <Card title="2. Servizi statistici di terze parti">
            <p>
              Il sito puo integrare Google Analytics 4. Quando presente, il caricamento lato Google
              usa Consent Mode con analytics storage negato finche non viene registrata una scelta
              positiva.
            </p>
            <p>Non vengono usati cookie marketing o di profilazione lato pubblico.</p>
          </Card>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">3. Cookie e identificativi principali</h2>
          <div className="mt-4 space-y-3">
            {cookieRows.map((cookie) => (
              <div
                key={cookie.name}
                className="grid gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[140px_1fr_180px]"
              >
                <div className="text-sm font-medium text-zinc-900">{cookie.name}</div>
                <div className="text-sm text-zinc-700">{cookie.purpose}</div>
                <div className="text-sm text-zinc-600">{cookie.duration}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="4. Gestione dal browser">
            <p>
              Puoi limitare o cancellare i cookie dalle impostazioni del browser. Disattivando tutti
              i cookie alcune funzioni, come carrello o preferenze, potrebbero non funzionare
              correttamente.
            </p>
          </Card>

          <Card title="5. Contatti">
            <p>
              Per richieste su cookie e privacy puoi scrivere a{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>
              .
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
