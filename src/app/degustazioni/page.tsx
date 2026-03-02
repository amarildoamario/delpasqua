import { prisma } from "@/lib/server/prisma";
import { buildWeekSlots, getTastingTypes, getWeekStartMonday, type TastingType } from "@/lib/tasting/slots";
import TastingsCalendar from "@/app/[locale]/degustazioni/TastingCalendar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Degustazione Olio Extra Vergine in Toscana | Frantoio del Pasqua Arezzo",
  description: "Scopri i veri sapori dell'olio EVO toscano. Prenota una degustazione di olio extra vergine di oliva presso il Frantoio del Pasqua a Monte San Savino, Arezzo.",
  keywords: ["degustazione olio toscana", "degustazione olio arezzo", "frantoio arezzo", "olio extra vergine toscana", "visita frantoio toscana", "degustazione olio extra vergine"],
  openGraph: {
    title: "Degustazione Olio Extra Vergine in Toscana | Frantoio del Pasqua",
    description: "Vivi un'esperienza unica nel cuore della provincia di Arezzo. Scopri l'olio extra vergine di oliva toscano con una visita al frantoio e analisi sensoriale.",
    url: "https://www.delpasqua.com/degustazioni",
    siteName: "Frantoio del Pasqua srl",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "https://www.delpasqua.com/images/placeholder-degustazione.jpg", // Aggiornare URL con la foto reale
        width: 1200,
        height: 630,
        alt: "Degustazione di Olio Extra Vergine di Oliva toscano presso il Frantoio del Pasqua",
      }
    ]
  },
};

export const dynamic = "force-dynamic";

export default async function DegustazioniPage() {
  const types = getTastingTypes();

  const weekStart = getWeekStartMonday(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const bookings = await prisma.tastingBooking.findMany({
    where: {
      slotStart: { gte: weekStart, lt: weekEnd },
      status: { not: "CANCELED" },
    },
    orderBy: { slotStart: "asc" },
    select: {
      id: true,
      status: true,
      slotStart: true,
      slotEnd: true,
      tastingType: true,
      people: true,
    },
  });

  const slots = buildWeekSlots(weekStart).map((s) => ({
    start: s.start.toISOString(),
    end: s.end.toISOString(),
  }));

  return (
    <>
      <main className="bg-[#FDFCF8] min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F4] to-[#FDFCF8]" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3D5A3D]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8860B]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                <span className="h-px w-6 bg-[#8B7355]" />
                Visite & degustazioni
              </div>

              <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
                Prenota una <span className="italic text-[#3D5A3D]">degustazione</span> al frantoio
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#57534E] lg:text-lg">
                Un percorso sensoriale guidato per imparare a riconoscere profumi e note dell&apos;extravergine,
                conoscere le nostre cultivar e vivere il frantoio da vicino.
              </p>
            </div>

            {/* Tasting Types Cards */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {types.map((t: TastingType, idx: number) => {
                const accents = ["olive", "gold", "terracotta"] as const;
                const accent = accents[idx % 3];
                const accentColor = accent === "olive" ? "#3D5A3D" : accent === "gold" ? "#B8860B" : "#8B7355";

                return (
                  <div
                    key={t.id}
                    className="group relative overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white p-6 transition-all duration-300 hover:border-[#3D5A3D]/30 hover:shadow-lg lg:p-8"
                  >
                    <div
                      className="absolute left-0 top-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: accentColor }}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl font-light tracking-tight text-[#1C1917]">{t.title}</h3>
                        <p className="mt-1 text-sm text-[#57534E]">{t.subtitle}</p>
                      </div>
                      <div
                        className="shrink-0 rounded-2xl px-3 py-2 text-xs font-bold text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {t.durationMinutes} min
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {t.includes.slice(0, 4).map((x: string) => (
                        <li key={x} className="flex gap-3 text-sm text-[#57534E]">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>

                    {t.priceFrom ? (
                      <div className="mt-6 pt-4 border-t border-[#E7E5E4]">
                        <span className="text-xs font-medium tracking-[0.15em] text-[#8B7355] uppercase">A partire da</span>
                        <div className="mt-1 font-serif text-lg font-light text-[#1C1917]">{t.priceFrom}</div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
          <div className="rounded-3xl border border-[#E7E5E4] bg-white p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  <span className="h-px w-6 bg-[#8B7355]" />
                  Calendario
                </div>
                <h2 className="mt-3 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                  Prenota il tuo <span className="italic text-[#3D5A3D]">slot</span>
                </h2>
                <p className="mt-2 text-sm text-[#57534E]">
                  Seleziona uno slot disponibile e completa la richiesta. Riceverai conferma dagli amministratori.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#3D5A3D]/10 px-4 py-2 text-xs font-medium text-[#3D5A3D]">
                <IconLeaf className="h-3.5 w-3.5 shrink-0" />
                Estratto a freddo
              </div>
            </div>

            <div className="mt-8">
              <TastingsCalendar
                tastingTypes={types}
                initialWeekStartIso={weekStart.toISOString()}
                initialSlots={slots}
                initialBookings={bookings.map((b: typeof bookings[0]) => ({
                  id: b.id,
                  status: b.status,
                  slotStart: b.slotStart.toISOString(),
                  slotEnd: b.slotEnd.toISOString(),
                  tastingType: b.tastingType,
                  people: b.people,
                }))}
              />
            </div>
          </div>
        </section>
        {/* SEO & FAQ Section (Premium Dark Theme) */}
        <section className="relative overflow-hidden bg-[#1C1917] py-20 lg:py-28 lg:mt-20">
          {/* Decorative Blur Backgrounds */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#3D5A3D]/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#B8860B]/15 rounded-full blur-[80px] translate-y-1/3 translate-x-1/3 pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
              {/* Left: Intro & Highlights */}
              <div className="flex flex-col justify-start pt-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#B8860B] uppercase">
                  <span className="h-px w-6 bg-[#B8860B]" />
                  Scopri di più
                </div>
                <h2 className="mt-6 font-serif text-3xl font-light tracking-tight text-white lg:text-4xl xl:text-5xl leading-tight">
                  Esperienza di <span className="italic text-[#B8860B]">degustazione</span> in Toscana
                </h2>
                <p className="mt-6 text-base leading-relaxed text-[#A8A29E] lg:text-lg">
                  Vivi un&apos;esperienza unica nel cuore della provincia di <strong>Arezzo</strong>.
                  Il Frantoio del Pasqua ti accoglie a <strong>Monte San Savino</strong> per svelarti i segreti dell&apos;<strong>olio extra vergine di oliva toscano</strong>.
                  Un viaggio autentico dalla frangitura a freddo all&apos;analisi sensoriale.
                </p>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  <FeatureHighlight
                    icon={<IconMapPin className="h-5 w-5 text-[#B8860B]" />}
                    title="Arezzo, Toscana"
                    desc="Immersi nel tipico e suggestivo paesaggio toscano."
                  />
                  <FeatureHighlight
                    icon={<IconDrop className="h-5 w-5 text-[#B8860B]" />}
                    title="Olio EVO Autentico"
                    desc="Estratto a freddo nei macchinari del nostro frantoio."
                  />
                  <FeatureHighlight
                    icon={<IconStar className="h-4 w-4 text-[#B8860B]" />}
                    title="Analisi Sensoriale"
                    desc="Impara a riconoscere odori e sapori delle cultivar."
                  />
                </div>
              </div>

              {/* Right: Image & FAQs */}
              <div className="flex flex-col justify-center gap-8">
                {/* Image Placeholder with strong SEO alt text */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl group">
                  {/* Replace '/percorso/immagine.jpg' with the actual image path when ready */}
                  <Image
                    src="/images/placeholder-degustazione.jpg" // TODO: Update image path
                    alt="Degustazione professionale di Olio Extra Vergine di Oliva al Frantoio del Pasqua, Monte San Savino, Arezzo, Toscana"
                    fill
                    className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <span className="text-sm font-medium tracking-widest text-white/50 uppercase border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      [Immagine Degustazione]
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <FAQItemDark
                    question="Dove si svolgono le degustazioni?"
                    answer="Le visite si tengono all'interno del nostro Frantoio del Pasqua, situato in Loc. Infernaccio 510/B, Monte San Savino (in provincia di Arezzo). Scoprirai come nasce il nostro olio circondato dai macchinari di estrazione."
                  />
                  <FAQItemDark
                    question="In cosa consiste l'analisi in frantoio?"
                    answer="Ti guideremo alla scoperta delle nostre cultivar. Imparerai a riconoscere le note di fruttato, l'amaro e il piccante che caratterizzano un vero olio extra vergine di oliva toscano di alta qualità."
                  />
                  <FAQItemDark
                    question="Quanto dura l'esperienza e cosa include?"
                    answer="L'esperienza dura dai 30 ai 90 minuti. Include l'illustrazione del processo di frangitura a ciclo continuo e la degustazione tecnica, spesso arricchita da ricercati abbinamenti gastronomici."
                  />
                  <FAQItemDark
                    question="È possibile acquistare l'olio al termine?"
                    answer="Certamente. Potrai acquistare il nostro olio evo estratto a freddo direttamente nel punto vendita. Un ricordo perfetto ed esclusivo delle eccellenze di Arezzo."
                  />
                </div>
              </div>
            </div>

            {/* FAQ Schema Markup */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "Dove si svolgono le degustazioni?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Le visite si tengono all'interno del nostro Frantoio del Pasqua, situato in Loc. Infernaccio 510/B, Monte San Savino (in provincia di Arezzo). Scoprirai come nasce il nostro olio circondato dai macchinari di estrazione."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "In cosa consiste l'analisi in frantoio?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Ti guideremo alla scoperta delle nostre cultivar. Imparerai a riconoscere le note di fruttato, l'amaro e il piccante che caratterizzano un vero olio extra vergine di oliva toscano di alta qualità."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Quanto dura l'esperienza e cosa include?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "L'esperienza dura dai 30 ai 90 minuti. Include l'illustrazione del processo di frangitura a ciclo continuo e la degustazione tecnica, spesso arricchita da ricercati abbinamenti gastronomici."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "È possibile acquistare l'olio al termine?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Certamente. Potrai acquistare il nostro olio evo estratto a freddo direttamente nel punto vendita. Un ricordo perfetto ed esclusivo delle eccellenze di Arezzo."
                      }
                    }
                  ]
                })
              }}
            />

            {/* LocalBusiness / FoodEstablishment Schema Markup per Local SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FoodEstablishment", // o "Winery" / "LocalBusiness"
                  "name": "Frantoio del Pasqua - Degustazione Olio EVO",
                  "image": "https://www.delpasqua.com/images/placeholder-degustazione.jpg", // Aggiornare URL
                  "@id": "https://www.delpasqua.com/degustazioni",
                  "url": "https://www.delpasqua.com/degustazioni",
                  "telephone": "+390575810065", // Preso dai contatti
                  "priceRange": "€€",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Loc. Infernaccio 510/B",
                    "addressLocality": "Monte San Savino",
                    "addressRegion": "AR",
                    "postalCode": "52048",
                    "addressCountry": "IT"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 43.3323, // Inserire coordinate precise per Google Maps
                    "longitude": 11.7258
                  },
                  "description": "Degustazione professionale di Olio Extra Vergine di Oliva toscano, visita al frantoio e analisi sensoriale a Monte San Savino, Arezzo.",
                  "offers": {
                    "@type": "Offer",
                    "url": "https://www.delpasqua.com/degustazioni",
                    "priceCurrency": "EUR",
                    "availability": "https://schema.org/InStock",
                    "validFrom": new Date().toISOString()
                  }
                })
              }}
            />

            {/* Breadcrumb Schema Markup per la gerarchia del sito */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://www.delpasqua.com/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Degustazioni",
                      "item": "https://www.delpasqua.com/degustazioni"
                    }
                  ]
                })
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconDrop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 21c-4.5 0-8-3.6-8-8 0-6 7-10 18-11-1 11-5 19-10 19Z" />
      <path d="M7 13c2 0 5 0 9-4" />
    </svg>
  );
}

function FeatureHighlight({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md transition-colors hover:bg-white/10">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B8860B]/10">
        {icon}
      </div>
      <div className="pt-0.5">
        <h4 className="font-serif text-lg font-medium text-white">{title}</h4>
        <p className="mt-1 text-sm text-[#A8A29E] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FAQItemDark({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-[#B8860B]/30 hover:bg-white/10 lg:p-8">
      <h3 className="font-serif text-xl font-medium text-white transition-colors group-hover:text-[#B8860B]">
        {question}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#A8A29E]">
        {answer}
      </p>
    </div>
  );
}
