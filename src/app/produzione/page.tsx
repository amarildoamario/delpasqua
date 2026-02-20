import Footer from "@/components/Footer";

type Step = {
  id: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  placeholder: string;
};

const STEPS: Step[] = [
  {
    id: "brucatura",
    kicker: "RACCOLTA",
    title: "La brucatura a mano",
    paragraphs: [
      "Ancora oggi in Toscana, buona parte della raccolta delle olive avviene tradizionalmente, con brucatura a mano; le olive trasportate in frantoio vengono poi lavorate nell’arco delle 24 ore per salvaguardare l’integrità delle componenti aromatiche e fenoliche. Il Frantoio del Pasqua è dotato di un moderno impianto di lavorazione delle olive Alfalaval con estrazione a freddo.",
    ],
    placeholder: "IMMAGINE — RACCOLTA",
  },
  {
    id: "imbottigliamento",
    kicker: "IMPIANTO",
    title: "La linea per l’imbottigliamento",
    paragraphs: [
      "L’impianto è fornito di una linea per l’imbottigliamento e il confezionamento; e di uno stoccaggio sotto azoto per garantire le caratteristiche organolettiche del nostro olio “Il Magnifico” in attesa dell’imbottigliamento.",
      "Ma non ci fermiamo qui: svolgiamo lavorazioni di molitura e confezionamento per conto di terzi.",
    ],
    placeholder: "IMMAGINE — LINEA",
  },
  {
    id: "olio-evo",
    kicker: "QUALITÀ",
    title: "Il nostro Olio EVO",
    paragraphs: [
      "Tutti questi fattori sono un’assoluta garanzia per la produzione di olio extravergine d’oliva di altissima qualità, in grado di conservare più a lungo la freschezza e i profumi che caratterizzano l’olio appena spremuto.",
    ],
    placeholder: "IMMAGINE — EVO",
  },
  {
    id: "igp-bio",
    kicker: "CERTIFICAZIONI",
    title: "IGP E BIO",
    paragraphs: [
      "Il frantoio del Pasqua è certificato Suolo e Salute per la trasformazione e produzione di prodotti Bio ed è iscritto al Consorzio dell’olio Toscano, per la produzione di olio extravergine di oliva IGP Toscano.",
    ],
    placeholder: "IMMAGINE — IGP/BIO",
  },
];

export default function ProduzionePage() {
  return (
    <>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 pt-16">
          {/* HERO */}
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                PRODUZIONE
              </div>
              <h1 className="mt-3 font-serif text-4xl tracking-[0.06em] text-zinc-900 dark:text-white">
                Dal campo al frantoio
              </h1>

              <p className="mt-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                Tradizione e innovazione si incontrano: raccolta attenta, lavorazione rapida e impianti
                moderni per preservare profumi e qualità.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Pill>ESTRAZIONE A FREDDO</Pill>
                <Pill>LAVORAZIONE ENTRO 24H</Pill>
                <Pill>STOCCAGGIO SOTTO AZOTO</Pill>
              </div>
            </div>

            {/* Banner placeholder */}
            <div className="lg:pl-6">
              <BannerPlaceholder label="BANNER — FRANTOIO / PRODUZIONE" />
            </div>
          </div>

          <hr className="my-12 border-black/10 dark:border-white/12" />

          {/* PROCESS STRIP (design diverso: griglia step) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={[
                  "group rounded-[16px] border border-black/10 bg-white p-4 transition",
                  "hover:-translate-y-[1px] hover:bg-zinc-50",
                  "dark:border-white/12 dark:bg-white/5 dark:hover:bg-white/10",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    STEP {i + 1}
                  </div>
                  <span className="text-zinc-400 transition group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-2 text-sm text-zinc-900 dark:text-white">{shortTitle(s.title)}</div>
                <div className="mt-1 text-xs tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  {s.kicker}
                </div>
              </a>
            ))}
          </div>

          <hr className="my-12 border-black/10 dark:border-white/12" />
        </div>

        {/* TIMELINE (fondo alternato, senza card ripetute) */}
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <div className="relative">
            {/* Linea verticale */}
            <div className="absolute left-[13px] top-0 hidden h-full w-px bg-black/10 dark:bg-white/12 sm:block" />

            <div className="space-y-10">
              {STEPS.map((step, idx) => (
                <TimelineSection
                  key={step.id}
                  step={step}
                  index={idx + 1}
                  shaded={idx % 2 === 1}
                />
              ))}
            </div>
          </div>

          <hr className="my-12 border-black/10 dark:border-white/12" />

          {/* Footer note minimal */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              PRODUZIONE CONTROLLATA • QUALITÀ COSTANTE
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-white/5 dark:text-zinc-200">
              <span className="text-emerald-600 dark:text-emerald-400">
                <IconShield />
              </span>
              CONTROLLO E CERTIFICAZIONI
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function TimelineSection({
  step,
  index,
  shaded,
}: {
  step: Step;
  index: number;
  shaded: boolean;
}) {
  return (
    <section id={step.id} className="scroll-mt-28">
      <div
        className={[
          "relative overflow-hidden rounded-[18px] border border-black/10",
          shaded ? "bg-zinc-50" : "bg-white",
          "dark:border-white/12",
          shaded ? "dark:bg-white/5" : "dark:bg-black",
        ].join(" ")}
      >
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:p-8">
          {/* Dot + testo */}
          <div className="relative pl-0 sm:pl-10">
            {/* Pallino numerato */}
            <div className="hidden sm:flex absolute left-0 top-0 h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white text-[10px] tracking-[0.12em] text-zinc-700 dark:border-white/12 dark:bg-black/30 dark:text-zinc-200">
              {index}
            </div>

            <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              {step.kicker}
            </div>

            <h2 className="mt-3 font-serif text-2xl tracking-[0.06em] text-zinc-900 dark:text-white">
              {step.title}
            </h2>

            <div className="mt-4 space-y-3">
              {step.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Placeholder immagine */}
          <div className="lg:pt-1">
            <MediaPlaceholder label={step.placeholder} />
          </div>
        </div>

        {/* decor leggero */}
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -left-28 -top-28 h-56 w-56 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
          <div className="absolute -right-28 -bottom-28 h-56 w-56 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
        </div>
      </div>
    </section>
  );
}

/* ---------- UI Bits ---------- */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-white/5 dark:text-zinc-200">
      {children}
    </span>
  );
}

function BannerPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-black/10 bg-zinc-50 dark:border-white/12 dark:bg-white/5">
      <div className="aspect-[16/10] w-full">
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-black/40 dark:text-zinc-200">
            {label}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-55">
        <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
        <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
      </div>
    </div>
  );
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-black/10 bg-white dark:border-white/12 dark:bg-black/30">
      <div className="aspect-[16/11] w-full">
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-black/40 dark:text-zinc-200">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function shortTitle(full: string) {
  const t = full.toLowerCase();
  if (t.includes("brucatura")) return "Brucatura";
  if (t.includes("imbottigliamento")) return "Imbottigliamento";
  if (t.includes("olio evo")) return "Olio EVO";
  if (t.includes("igp")) return "IGP & BIO";
  return full;
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function IconShield() {
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
      <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}
