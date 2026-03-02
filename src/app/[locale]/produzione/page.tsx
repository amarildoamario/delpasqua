"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Step = {
  id: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  placeholder: string;
};

const FRANTOIO_IMAGES = {
  // hero
  hero: "/frantoio/frantoio-esterno.jpg",

  // griglia macchine
  defogliazione: "/frantoio/defogliazione.jpg",
  gramolazione: "/frantoio/gramolazione.jpg",
  estrazione: "/frantoio/estrazione.jpg",
  separazione: "/frantoio/separazione.jpg",
  filtrazione: "/frantoio/filtrazione.jpg",

  // sezioni presentative
  conservazione: "/frantoio/conservazione.jpg",
  pulizia: "/frantoio/pulizia.jpg",
  confezionamento: "/frantoio/confezionamento.jpg",
  tracciabilita: "/frantoio/tracciabilità.jpg", // se dà problemi su deploy, rinomina in tracciabilita.jpg

  // timeline produzione
  brucatura: "/frantoio/brucatura.jpg",
  imbottigliamento: "/frantoio/imbottigliamento.jpg",
  evo: "/frantoio/evo.png",
  igpBio: "/frantoio/igp-bio.png",
} as const;

export default function ProduzionePage() {
  const t = useTranslations("ProduzionePage");

  const PRODUCTION_STEPS: Step[] = [
    {
      id: "brucatura",
      kicker: t("steps.brucatura.kicker"),
      title: t("steps.brucatura.title"),
      paragraphs: t.raw("steps.brucatura.paragraphs"),
      placeholder: t("steps.brucatura.placeholder"),
    },
    {
      id: "imbottigliamento",
      kicker: t("steps.imbottigliamento.kicker"),
      title: t("steps.imbottigliamento.title"),
      paragraphs: t.raw("steps.imbottigliamento.paragraphs"),
      placeholder: t("steps.imbottigliamento.placeholder"),
    },
    {
      id: "olio-evo",
      kicker: t("steps.evo.kicker"),
      title: t("steps.evo.title"),
      paragraphs: t.raw("steps.evo.paragraphs"),
      placeholder: t("steps.evo.placeholder"),
    },
    {
      id: "igp-bio",
      kicker: t("steps.igp_bio.kicker"),
      title: t("steps.igp_bio.title"),
      paragraphs: t.raw("steps.igp_bio.paragraphs"),
      placeholder: t("steps.igp_bio.placeholder"),
    },
  ];

  const STEP_IMAGE_BY_ID: Record<string, string> = {
    brucatura: FRANTOIO_IMAGES.brucatura,
    imbottigliamento: FRANTOIO_IMAGES.imbottigliamento,
    "olio-evo": FRANTOIO_IMAGES.evo,
    "igp-bio": FRANTOIO_IMAGES.igpBio,
  };

  return (
    <>
      <section className="bg-[#FDFCF8] min-h-screen">
        {/* =========================
            FRANTOIO — PRESENTAZIONE
        ========================== */}
        <div className="mx-auto max-w-7xl px-6 pt-20 lg:pt-28">
          {/* HERO FRANTOIO */}
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                <span className="h-px w-6 bg-[#8B7355]" />
                {t("hero.label")}
              </div>

              <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
                {t("hero.title_part1")} <br />
                <span className="italic text-[#3D5A3D]">{t("hero.title_italic")}</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#57534E] lg:text-lg">
                {t("hero.description")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3D5A3D]/10 px-4 py-2 text-xs font-medium text-[#3D5A3D]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3D5A3D]" />
                  {t("hero.tag1")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B8860B]/10 px-4 py-2 text-xs font-medium text-[#8B6914]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
                  {t("hero.tag2")}
                </span>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#3D5A3D]/5 to-[#B8860B]/5 blur-2xl" />
                <div
                  className="relative overflow-hidden border border-[#E7E5E4] bg-[#F5F5F4]
                             rounded-2xl lg:rounded-xl
                             aspect-[4/3] lg:aspect-[16/10]
                             w-full lg:w-[520px] xl:w-[620px]"
                >
                  <Image
                    src={FRANTOIO_IMAGES.hero}
                    alt={t("hero.img_alt")}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 620px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GALLERIA MACCHINE */}
          <div className="mt-24 lg:mt-32">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  {t("machines.label")}
                </div>
                <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-[#1C1917] lg:text-4xl">
                  {t("machines.title_part1")}{" "}
                  <span className="italic text-[#3D5A3D]">{t("machines.title_italic")}</span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#57534E]">
                {t("machines.subtitle")}
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MachineCard
                title={t("machines.defogliazione.title")}
                desc={t("machines.defogliazione.desc")}
                imgSrc={FRANTOIO_IMAGES.defogliazione}
                color="olive"
              />
              <MachineCard
                title={t("machines.frangitura.title")}
                desc={t("machines.frangitura.desc")}
                imgSrc={FRANTOIO_IMAGES.pulizia}
                color="gold"
              />
              <MachineCard
                title={t("machines.gramolazione.title")}
                desc={t("machines.gramolazione.desc")}
                imgSrc={FRANTOIO_IMAGES.gramolazione}
                color="olive"
              />
              <MachineCard
                title={t("machines.estrazione.title")}
                desc={t("machines.estrazione.desc")}
                imgSrc={FRANTOIO_IMAGES.estrazione}
                color="gold"
              />
              <MachineCard
                title={t("machines.separazione.title")}
                desc={t("machines.separazione.desc")}
                imgSrc={FRANTOIO_IMAGES.separazione}
                color="olive"
              />
              <MachineCard
                title={t("machines.filtrazione.title")}
                desc={t("machines.filtrazione.desc")}
                imgSrc={FRANTOIO_IMAGES.filtrazione}
                color="gold"
              />
            </div>
          </div>

          {/* DIVISORE 1 (Tra macchine e showcase) */}
          <div className="mt-20 lg:mt-28 flex flex-col items-center justify-center text-center px-4">
            <div className="flex items-center justify-center gap-4 opacity-50 mb-8">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#8B7355]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#8B7355]" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B7355]" />
            </div>

            <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              {t("machines.divider_1.label")}
            </div>
            <h3 className="mt-3 font-serif text-3xl font-light tracking-tight text-[#1C1917] lg:text-4xl">
              {t("machines.divider_1.title_part1")}
              <span className="italic text-[#3D5A3D]">{t("machines.divider_1.title_italic")}</span>
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#57534E] lg:text-base">
              {t("machines.divider_1.text")}
            </p>
          </div>

          {/* SEZIONI PRESENTATIVE - NUOVO LAYOUT */}
          <div className="mt-16 lg:mt-24 space-y-6">
            {/* Prima riga */}
            <div className="grid gap-6 lg:grid-cols-2">
              <FeatureShowcase
                kicker={t("showcase.trasporto.kicker")}
                title={t("showcase.trasporto.title")}
                text={t("showcase.trasporto.text")}
                imgLabel={t("showcase.trasporto.img_label")}
                imgSrc={FRANTOIO_IMAGES.pulizia}
                alt={t("showcase.trasporto.title")}
              />
              <FeatureShowcase
                kicker={t("showcase.stoccaggio.kicker")}
                title={t("showcase.stoccaggio.title")}
                text={t("showcase.stoccaggio.text")}
                imgLabel={t("showcase.stoccaggio.img_label")}
                imgSrc={FRANTOIO_IMAGES.conservazione}
                alt={t("showcase.stoccaggio.title")}
              />
            </div>

            {/* Seconda riga: Imbottigliamento */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1C1917] p-8 lg:p-12">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#B8860B]/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#3D5A3D]/10 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div>
                  <div className="text-[11px] font-medium tracking-[0.2em] text-[#B8860B] uppercase">
                    {t("showcase.imbottigliamento.kicker")}
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-light tracking-tight text-[#FAFAF9] lg:text-3xl">
                    {t("showcase.imbottigliamento.title")}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#A8A29E] lg:text-base">
                    {t("showcase.imbottigliamento.text")}
                  </p>
                  <div className="mt-6 flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-[#D6D3D1]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
                      {t("showcase.imbottigliamento.tag1")}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#D6D3D1]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
                      {t("showcase.imbottigliamento.tag2")}
                    </div>
                  </div>
                </div>
                <div>
                  <MediaPlaceholder
                    label={t("showcase.imbottigliamento.img_label")}
                    imgSrc={FRANTOIO_IMAGES.confezionamento}
                    alt={t("showcase.imbottigliamento.title")}
                  />
                </div>
              </div>
            </div>

            {/* DIVISORE 2 */}
            <div className="py-16 lg:py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="flex items-center justify-center gap-4 opacity-50 mb-8">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#8B7355]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[#8B7355]" />
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B7355]" />
              </div>

              <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                {t("machines.divider_2.label")}
              </div>
              <h3 className="mt-3 font-serif text-3xl font-light tracking-tight text-[#1C1917] lg:text-4xl">
                {t("machines.divider_2.title_part1")}
                <span className="italic text-[#3D5A3D]">{t("machines.divider_2.title_italic")}</span>
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#57534E] lg:text-base">
                {t("machines.divider_2.text")}
              </p>
            </div>

            {/* Terza riga: Controllo qualità */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#3D5A3D]/20 bg-white p-8 lg:p-12">
              <div className="absolute right-8 top-8 hidden lg:block">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3D5A3D]/10">
                  <IconShield className="h-8 w-8 text-[#3D5A3D]" />
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div className="order-2 lg:order-1">
                  <MediaPlaceholder
                    label={t("showcase.controllo.img_label")}
                    imgSrc={FRANTOIO_IMAGES.tracciabilita}
                    alt={t("showcase.controllo.title")}
                  />
                </div>
                <div className="order-1 lg:order-2 lg:pl-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#3D5A3D]/10 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-[#3D5A3D] uppercase">
                    {t("showcase.controllo.kicker")}
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                    {t("showcase.controllo.title")}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#57534E] lg:text-base">
                    {t("showcase.controllo.text")}
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3 text-sm text-[#57534E]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3D5A3D] text-[10px] text-white">
                        ✓
                      </span>
                      {t("showcase.controllo.list1")}
                    </li>
                    <li className="flex items-center gap-3 text-sm text-[#57534E]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3D5A3D] text-[10px] text-white">
                        ✓
                      </span>
                      {t("showcase.controllo.list2")}
                    </li>
                    <li className="flex items-center gap-3 text-sm text-[#57534E]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3D5A3D] text-[10px] text-white">
                        ✓
                      </span>
                      {t("showcase.controllo.list3")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCCO TECNOLOGIA */}
          <div className="mt-24 rounded-[2rem] bg-[#1C1917] p-8 lg:p-12 xl:p-16">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  {t("technology.label")}
                </div>
                <h2 className="mt-4 font-serif text-3xl font-light leading-[1.1] tracking-tight text-[#FAFAF9] lg:text-4xl">
                  {t("technology.title_part1")} <br />
                  <span className="italic text-[#B8860B]">{t("technology.title_italic")}</span>
                </h2>

                <p className="mt-6 text-sm leading-relaxed text-[#A8A29E] lg:text-base">
                  {t("technology.description")}
                </p>

                <ul className="mt-8 space-y-4">
                  <CheckItemDark title={t("technology.checks.chain.title")} desc={t("technology.checks.chain.desc")} />
                  <CheckItemDark title={t("technology.checks.clean.title")} desc={t("technology.checks.clean.desc")} />
                  <CheckItemDark title={t("technology.checks.extraction.title")} desc={t("technology.checks.extraction.desc")} />
                  <CheckItemDark title={t("technology.checks.storage.title")} desc={t("technology.checks.storage.desc")} />
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCardDark
                  title={t("technology.cards.molitura.title")}
                  text={t("technology.cards.molitura.text")}
                  badge={t("technology.cards.molitura.badge")}
                />
                <InfoCardDark
                  title={t("technology.cards.conferimento.title")}
                  text={t("technology.cards.conferimento.text")}
                  badge={t("technology.cards.conferimento.badge")}
                />
                <InfoCardDark
                  title={t("technology.cards.controlli.title")}
                  text={t("technology.cards.controlli.text")}
                  badge={t("technology.cards.controlli.badge")}
                />
                <InfoCardDark
                  title={t("technology.cards.visite.title")}
                  text={t("technology.cards.visite.text")}
                  badge={t("technology.cards.visite.badge")}
                />
              </div>
            </div>
          </div>

          {/* PRODUZIONE */}
          <div className="mt-24 lg:mt-32 pb-20">
            <div className="text-center">
              <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                {t("steps_section.label")}
              </div>
              <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-[#1C1917] lg:text-4xl">
                {t("steps_section.title_part1")} <span className="italic text-[#3D5A3D]">{t("steps_section.title_italic")}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#57534E]">
                {t("steps_section.subtitle")}
              </p>
            </div>

            {/* PROCESS STRIP */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTION_STEPS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#3D5A3D]/30 hover:shadow-lg hover:shadow-[#3D5A3D]/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355]">
                      STEP {i + 1}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#D6D3D1] transition-colors group-hover:text-[#3D5A3D]" />
                  </div>
                  <div className="mt-3 font-serif text-lg text-[#1C1917]">{shortTitle(s.title)}</div>
                  <div className="mt-1 text-xs text-[#8B7355]">{s.kicker}</div>
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#3D5A3D] to-[#B8860B] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* TIMELINE */}
            <div className="mt-16 space-y-8">
              {PRODUCTION_STEPS.map((step, idx) => (
                <TimelineSection
                  key={step.id}
                  step={step}
                  index={idx + 1}
                  isLast={idx === PRODUCTION_STEPS.length - 1}
                  imageSrc={STEP_IMAGE_BY_ID[step.id]}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* =========================
   PRODUZIONE — TIMELINE
========================= */

function TimelineSection({
  step,
  index,
  isLast,
  imageSrc,
}: {
  step: Step;
  index: number;
  isLast: boolean;
  imageSrc: string;
}) {
  return (
    <section id={step.id} className="scroll-mt-28">
      <div className="relative">
        {/* Timeline line */}
        {!isLast && (
          <div className="absolute left-6 top-16 hidden h-[calc(100%+2rem)] w-px bg-gradient-to-b from-[#D6D3D1] to-transparent lg:block" />
        )}

        <div className="rounded-3xl border border-[#E7E5E4] bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:gap-12">
            {/* Number */}
            <div className="hidden lg:flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#E7E5E4] bg-[#FDFCF8] font-serif text-lg text-[#3D5A3D]">
              {index}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 lg:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3D5A3D] text-xs font-medium text-white">
                  {index}
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  {step.kicker}
                </span>
              </div>

              <div className="hidden text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase lg:block">
                {step.kicker}
              </div>

              <h3 className="mt-3 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                {step.title}
              </h3>

              <div className="mt-4 space-y-3">
                {step.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-[#57534E] lg:text-base">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="lg:w-80 xl:w-96">
              <MediaPlaceholder
                label={step.placeholder}
                imgSrc={imageSrc}
                alt={step.title}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   COMPONENTI
========================= */

function MachineCard({
  title,
  desc,
  imgSrc,
  color,
}: {
  title: string;
  desc: string;
  imgSrc: string;
  color: "olive" | "gold";
}) {
  const t_shared = useTranslations("ProduzionePage.shared");
  const accentColor = color === "olive" ? "#3D5A3D" : "#B8860B";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className="absolute left-0 top-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: accentColor }}
      />
      <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
        {t_shared("machine")}
      </div>
      <div className="mt-2 font-serif text-xl font-light tracking-tight text-[#1C1917]">
        {title}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#57534E]">{desc}</p>

      <div className="mt-4 relative overflow-hidden rounded-xl border border-[#E7E5E4] bg-[#F5F5F4] aspect-[16/10] w-full">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

function FeatureShowcase({
  kicker,
  title,
  text,
  imgLabel,
  imgSrc,
  alt,
}: {
  kicker: string;
  title: string;
  text: string;
  imgLabel: string;
  imgSrc?: string;
  alt?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white p-6 transition-all duration-300 hover:border-[#3D5A3D]/30 hover:shadow-lg lg:p-8">
      <div className="absolute left-0 top-0 h-1 w-0 bg-[#3D5A3D] transition-all duration-300 group-hover:w-full" />

      <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
        {kicker}
      </div>
      <h3 className="mt-3 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#57534E]">{text}</p>

      <div className="mt-5">
        <MediaPlaceholder
          label={imgLabel}
          small
          imgSrc={imgSrc}
          alt={alt ?? title}
        />
      </div>
    </div>
  );
}

function InfoCardDark({
  title,
  text,
  badge,
}: {
  title: string;
  text: string;
  badge: string;
}) {
  return (
    <div className="rounded-2xl border border-[#44403C] bg-[#292524] p-5 transition-colors hover:border-[#57534E]">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[10px] font-medium tracking-[0.2em] text-[#B8860B] uppercase">
          {badge}
        </div>
        <div className="h-2 w-2 rounded-full bg-[#3D5A3D]" />
      </div>
      <div className="mt-3 font-serif text-lg font-light tracking-tight text-[#FAFAF9]">
        {title}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#A8A29E]">{text}</p>
    </div>
  );
}

function CheckItemDark({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#44403C] bg-[#292524] text-[#B8860B]">
        <IconCheck className="h-3.5 w-3.5" />
      </span>
      <div>
        <div className="font-medium text-[#FAFAF9]">{title}</div>
        <div className="text-sm text-[#A8A29E]">{desc}</div>
      </div>
    </li>
  );
}


function MediaPlaceholder({
  label,
  small,
  imgSrc,
  alt,
}: {
  label: string;
  small?: boolean;
  imgSrc?: string;
  alt?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#E7E5E4] bg-[#F5F5F4]">
      <div className={`w-full ${small ? "aspect-[16/10]" : "aspect-[16/11]"}`}>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={alt ?? label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-full border border-[#D6D3D1] bg-white/90 px-4 py-2 text-[10px] font-medium tracking-wider text-[#78716C]">
              {label}
            </div>
          </div>
        )}
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
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}