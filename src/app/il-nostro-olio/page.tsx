import Footer from "@/components/Footer";

type OilSectionData = {
  id: string;
  title: string;
  body: string[];
  formats: string[];
  placeholderLabel: string;
};

const SECTIONS: OilSectionData[] = [
  {
    id: "intro",
    title: "Il nostro olio EVO",
    body: [
      "Il nostro Olio extravergine di oliva italiano non nasce solamente da olive coltivate nel rispetto dell’ambiente; ma tutte le attività per la sua lavorazione sono assoggettate al regime di controllo di organismi riconosciuti per garantire al consumatore finale un prodotto naturale, controllato e certificato.",
    ],
    formats: [],
    placeholderLabel: "IMMAGINE — INTRO",
  },
  {
    id: "fruttato-intenso",
    title: "Olio Extravergine di oliva fruttato intenso 100% Italiano",
    body: [
      "Dal sapore deciso ma equilibrato, l’amaro e il piccante si collocano a un livello medio alto, con un retrogusto tendente al carciofo, colore verde brillante.",
      "La raccolta avviene in anticipo rispetto alla completa maturazione.",
    ],
    formats: ["Bottiglia: 250/500/750", "Lattina: 1/3/5L"],
    placeholderLabel: "IMMAGINE — FRUTTATO INTENSO",
  },
  {
    id: "fruttato-medio",
    title: "Olio Extravergine di oliva fruttato medio 100% Italiano",
    body: [
      "Blend di olive leccino frantoio e moraiolo; equilibrato nel piccante e nell’amaro, con sentori di mandorla e leggera sensazione di erba.",
      "Colore verde con venature gialle.",
    ],
    formats: ["Bottiglia: 250/500/750/1000ml", "Lattina: 1/3/5L"],
    placeholderLabel: "IMMAGINE — FRUTTATO MEDIO",
  },
  {
    id: "evo",
    title: "Olio Extravergine di oliva EVO",
    body: [
      "Con la selezione delle olive migliori nasce il nostro olio “EVO”, estratto a freddo secondo i principi della tradizione e con uno sguardo all’innovazione.Dal colore verde brillante e il profumo erbaceo con sentori di mandorla.",
    ],
    formats: ["Bottiglia: 500ml"],
    placeholderLabel: "IMMAGINE — EVO",
  },
  {
    id: "igp-toscano",
    title: "Olio Extravergine di oliva IGP Toscano",
    body: [
      "Il nostro Extravergine “Il Magnifico” IGP Toscano garantisce l’originalità dell’olio toscano.",
      "L’intero ciclo produttivo, dalla coltivazione delle olive fino all’imbottigliamento finale, avviene in Toscana come previsto dal Disciplinare di Produzione; la cui conformità è attestata da enti autorizzati dal Ministero delle attività agricole preposto alle attività di controllo. Dal sapore e dal retrogusto intenso con leggere note di amaro. Colore verde con venature gialle oro.",
    ],
    formats: ["Bottiglia: 500/750ml"],
    placeholderLabel: "IMMAGINE — IGP TOSCANO",
  },
  {
    id: "bio",
    title: "Olio Extravergine di oliva BIO",
    body: [
      "Olio Extravergine di oliva ottenuto nel rispetto dei principi dell’agricoltura biologica, coltivazione degli olivi senza l’utilizzo di concimi chimici e antiparassitari.",
      "Colore verde intenso.",
    ],
    formats: ["Bottiglia: 500/750ml"],
    placeholderLabel: "IMMAGINE — BIO",
  },
  {
    id: "aromatico",
    title: "Olio Extravergine AROMATICO",
    body: ["La nostra selezione speciale di aromatizzati.", "Versioni disponibili: tartufo, peperoncino e limone."],
    formats: ["Bottiglia: 250ml"],
    placeholderLabel: "IMMAGINE — AROMATICI",
  },
];

export default function IlNostroOlioPage() {
  return (
    <>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              IL NOSTRO OLIO
            </div>
            <h1 className="mt-3 font-serif text-4xl tracking-[0.06em] text-zinc-900 dark:text-white">
              Il nostro olio EVO
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              {SECTIONS[0].body[0]}
            </p>
          </div>

          {/* Separator */}
          <hr className="my-12 border-black/10 dark:border-white/12" />

          {/* Layout diverso: Sidebar (indice) + contenuti */}
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[16px] border border-black/10 bg-zinc-50 p-4 dark:border-white/12 dark:bg-white/5">
                <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  INDICE
                </div>

                <nav className="mt-3 space-y-1">
                  {SECTIONS.filter((s) => s.id !== "intro").map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-zinc-800 transition hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
                    >
                      {shortTitle(s.title)}
                    </a>
                  ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/12">
                  <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    NOTA
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Sezione descrittiva: quando aggiungi le foto reali, sostituisci i placeholder con immagini in <span className="font-mono">/public</span>.
                  </p>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="space-y-10">
              {SECTIONS.filter((s) => s.id !== "intro").map((s, idx) => (
                <OilCard
                  key={s.id}
                  data={s}
                  // alterna layout per non sembrare “sempre uguale”
                  flip={idx % 2 === 1}
                />
              ))}

              {/* Bottom separator */}
              <hr className="border-black/10 dark:border-white/12" />

              {/* Micro trust / info */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  QUALITÀ • TRADIZIONE • INNOVAZIONE
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-white/5 dark:text-zinc-200">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    <IconLeaf />
                  </span>
                  SELEZIONE ESTRATTA A FREDDO
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function OilCard({ data, flip }: { data: OilSectionData; flip: boolean }) {
  return (
    <section
      id={data.id}
      className="rounded-[18px] border border-black/10 bg-white p-6 dark:border-white/12 dark:bg-white/5"
    >
      <div className={`grid gap-8 md:grid-cols-2 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
        {/* Media */}
        <div className="md:pt-1">
          <ImagePlaceholder label={data.placeholderLabel} />
        </div>

        {/* Text */}
        <div>
          <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            DETTAGLI
          </div>
          <h2 className="mt-3 font-serif text-2xl tracking-[0.06em] text-zinc-900 dark:text-white">
            {data.title}
          </h2>

          <div className="mt-4 space-y-3">
            {data.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                {p}
              </p>
            ))}
          </div>

          {data.formats.length > 0 ? (
            <div className="mt-6">
              <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                FORMATI DISPONIBILI
              </div>
              <ul className="mt-3 space-y-2">
                {data.formats.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-black/10 bg-zinc-50 dark:border-white/12 dark:bg-white/5">
      <div className="aspect-[16/11] w-full">
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-black/40 dark:text-zinc-200">
            {label}
          </div>
        </div>
      </div>

      {/* decor leggero */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
        <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
      </div>
    </div>
  );
}

function IconLeaf() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 21c-4.5 0-8-3.6-8-8 0-6 7-10 18-11-1 11-5 19-10 19Z" />
      <path d="M7 13c2 0 5 0 9-4" />
    </svg>
  );
}

function shortTitle(full: string) {
  // versioni brevi per l’indice
  if (full.includes("fruttato intenso")) return "Fruttato intenso";
  if (full.includes("fruttato medio")) return "Fruttato medio";
  if (full.endsWith("EVO")) return "EVO";
  if (full.includes("IGP Toscano")) return "IGP Toscano";
  if (full.includes("BIO")) return "BIO";
  if (full.includes("AROMATICO")) return "Aromatico";
  return full;
}
