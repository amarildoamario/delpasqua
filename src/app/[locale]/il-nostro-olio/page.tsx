"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { useTranslations } from "next-intl";

type OilSectionData = {
  id: string;
  title: string;
  shortTitle: string;
  body: string[];
  formats: string[];
  placeholderLabel: string;
  accent: "olive" | "gold" | "terracotta";
  imgSrc?: string;
  imgAlt?: string;
};

const OLIO_IMAGES = {
  fruttatoMedio: "/olio/fruttato-medio.jpg",
  evo: "/olio/evo.jpg",
  aromatizzato: "/olio/olio-aromatizzato.jpg",
} as const;

export default function IlNostroOlioPage() {
  const t = useTranslations("OlioPage");

  const SECTIONS: OilSectionData[] = [
    {
      id: "intro",
      title: t("sections.intro.title"),
      shortTitle: t("sections.intro.title"),
      body: t.raw("sections.intro.body"),
      formats: [],
      placeholderLabel: t("sections.intro.placeholder"),
      accent: "olive",
    },
    {
      id: "fruttato-leggero",
      title: t("sections.fruttato_leggero.title"),
      shortTitle: t("sections.fruttato_leggero.short_title"),
      body: t.raw("sections.fruttato_leggero.body"),
      formats: t.raw("sections.fruttato_leggero.formats"),
      placeholderLabel: t("sections.fruttato_leggero.placeholder"),
      accent: "gold",
      imgSrc: OLIO_IMAGES.fruttatoMedio,
      imgAlt: t("sections.fruttato_leggero.title"),
    },
    {
      id: "fruttato-intenso",
      title: t("sections.fruttato_intenso.title"),
      shortTitle: t("sections.fruttato_intenso.short_title"),
      body: t.raw("sections.fruttato_intenso.body"),
      formats: t.raw("sections.fruttato_intenso.formats"),
      placeholderLabel: t("sections.fruttato_intenso.placeholder"),
      accent: "olive",
      imgSrc: OLIO_IMAGES.fruttatoMedio,
      imgAlt: t("sections.fruttato_intenso.title"),
    },
    {
      id: "fruttato-medio",
      title: t("sections.fruttato_medio.title"),
      shortTitle: t("sections.fruttato_medio.short_title"),
      body: t.raw("sections.fruttato_medio.body"),
      formats: t.raw("sections.fruttato_medio.formats"),
      placeholderLabel: t("sections.fruttato_medio.placeholder"),
      accent: "gold",
      imgSrc: OLIO_IMAGES.fruttatoMedio,
      imgAlt: t("sections.fruttato_medio.title"),
    },
    {
      id: "evo",
      title: t("sections.evo.title"),
      shortTitle: t("sections.evo.short_title"),
      body: t.raw("sections.evo.body"),
      formats: t.raw("sections.evo.formats"),
      placeholderLabel: t("sections.evo.placeholder"),
      accent: "terracotta",
      imgSrc: OLIO_IMAGES.evo,
      imgAlt: t("sections.evo.title"),
    },
    {
      id: "aromatico",
      title: t("sections.aromatico.title"),
      shortTitle: t("sections.aromatico.short_title"),
      body: t.raw("sections.aromatico.body"),
      formats: t.raw("sections.aromatico.formats"),
      placeholderLabel: t("sections.aromatico.placeholder"),
      accent: "terracotta",
      imgSrc: OLIO_IMAGES.aromatizzato,
      imgAlt: t("sections.aromatico.title"),
    },
  ];

  return (
    <>
      <section className="bg-[#FDFCF8] min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              <span className="h-px w-6 bg-[#8B7355]" />
              {t("header.label")}
            </div>
            <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
              {t("header.title_part1")} <span className="italic text-[#3D5A3D]">{t("header.title_italic")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#57534E] lg:text-lg">
              {SECTIONS[0].body[0]}
            </p>
          </div>

          {/* Layout: Sidebar + contenuti */}
          <div className="mt-16 grid gap-10 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-sm">
                <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  {t("sidebar.id_label")}
                </div>

                <nav className="mt-4 space-y-1">
                  {SECTIONS.filter((s) => s.id !== "intro").map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#57534E] transition hover:bg-[#F5F5F4]"
                    >
                      <span
                        className={`h-2 w-2 rounded-full transition-colors ${s.accent === "olive"
                          ? "bg-[#3D5A3D]"
                          : s.accent === "gold"
                            ? "bg-[#B8860B]"
                            : "bg-[#8B7355]"
                          }`}
                      />
                      {s.shortTitle}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 border-t border-[#E7E5E4] pt-6">
                  <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                    {t("sidebar.note_label")}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#78716C]">
                    {t("sidebar.note_text1")}{" "}
                    <span className="font-mono">/public/olio</span>.
                  </p>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="space-y-8">
              {SECTIONS.filter((s) => s.id !== "intro").map((s, idx) => (
                <OilCard key={s.id} data={s} flip={idx % 2 === 1} />
              ))}

              {/* Bottom trust bar */}
              <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E5E4] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs tracking-[0.18em] text-[#8B7355]">
                  {t("trust_bar.text")}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#3D5A3D]/10 px-4 py-2 text-xs font-medium text-[#3D5A3D]">
                  <IconLeaf />
                  {t("trust_bar.badge")}
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
  const accentColor =
    data.accent === "olive" ? "#3D5A3D" : data.accent === "gold" ? "#B8860B" : "#8B7355";

  return (
    <section
      id={data.id}
      className="group relative overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white p-6 transition-all duration-300 hover:border-[#3D5A3D]/30 hover:shadow-lg lg:p-8"
    >
      <div
        className="absolute left-0 top-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: accentColor }}
      />

      <div className={`grid gap-8 lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        {/* Media */}
        <div>
          <MediaBox
            label={data.placeholderLabel}
            imgSrc={data.imgSrc}
            alt={data.imgAlt ?? data.title}
          />
        </div>

        {/* Text */}
        <div className={flip ? "lg:pr-4" : "lg:pl-4"}>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              Dettagli
            </span>
          </div>

          <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
            {data.title}
          </h2>

          <div className="mt-4 space-y-3">
            {data.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-[#57534E] lg:text-base">
                {p}
              </p>
            ))}
          </div>

          {data.formats.length > 0 ? (
            <div className="mt-6">
              <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                Formati disponibili
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {data.formats.map((f) => (
                  <li
                    key={f}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E4] bg-[#FDFCF8] px-3 py-1.5 text-xs text-[#57534E]"
                  >
                    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
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

function MediaBox({
  label,
  imgSrc,
  alt,
}: {
  label: string;
  imgSrc?: string;
  alt: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-[#F5F5F4]">
      <div className="relative aspect-[16/11] w-full">
        {imgSrc ? (
          <>
            <Image
              src={imgSrc}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/10 to-transparent" />
          </>
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

function IconLeaf() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 21c-4.5 0-8-3.6-8-8 0-6 7-10 18-11-1 11-5 19-10 19Z" />
      <path d="M7 13c2 0 5 0 9-4" />
    </svg>
  );
}