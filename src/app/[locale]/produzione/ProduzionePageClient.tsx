"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useRef } from "react";

const FRANTOIO_IMAGES = {
  // hero
  hero: "/frantoio/frantoio-esterno.jpg",

  // griglia macchine
  defogliazione: "/frantoio/defogliazione.jpg",
  gramolazione: "/frantoio/gramolazione.jpg",
  estrazione: "/frantoio/estrazione.jpg",
  separazione: "/frantoio/separazione.jpeg",
  filtrazione: "/frantoio/filtrazione.jpg",

  // sezioni presentative
  conservazione: "/frantoio/conservazione.jpg",
  pulizia: "/frantoio/pulizia.jpg",
  confezionamento: "/frantoio/confezionamento.jpg",
  tracciabilita: "/frantoio/tracciabilita.jpg",

  // timeline produzione
  brucatura: "/frantoio/brucatura.jpg",
  imbottigliamento: "/frantoio/imbottigliamento.jpg",
  evo: "/frantoio/evo.png",
  igpBio: "/frantoio/igp-bio.png",
} as const;

const stickySectionNavStyle = {
  top: "var(--main-navbar-offset, 98px)",
} as const;

const fixedSectionNavStyle = {
  ...stickySectionNavStyle,
  left: 0,
  right: 0,
} as const;

const chapterScrollMarginStyle = {
  scrollMarginTop: "calc(var(--main-navbar-offset, 98px) + 96px)",
} as const;

export default function ProduzionePageClient() {
  const t = useTranslations("ProduzionePage");
  const [activeSection, setActiveSection] = useState<string>("capitolo-1");
  const [sectionNavState, setSectionNavState] = useState({ pinned: false, height: 0 });
  const sectionNavWrapperRef = useRef<HTMLDivElement>(null);
  const sectionNavRef = useRef<HTMLDivElement>(null);

  const SECTIONS = useMemo(() => [
    { id: "capitolo-1", number: "I", label: t("nav.sections.capitolo-1.label"), kicker: t("nav.sections.capitolo-1.kicker") },
    { id: "capitolo-2", number: "II", label: t("nav.sections.capitolo-2.label"), kicker: t("nav.sections.capitolo-2.kicker") },
    { id: "capitolo-3", number: "III", label: t("nav.sections.capitolo-3.label"), kicker: t("nav.sections.capitolo-3.kicker") },
    { id: "capitolo-4", number: "IV", label: t("nav.sections.capitolo-4.label"), kicker: t("nav.sections.capitolo-4.kicker") },
    { id: "capitolo-5", number: "V", label: t("nav.sections.capitolo-5.label"), kicker: t("nav.sections.capitolo-5.kicker") },
  ], [t]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -45% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    SECTIONS.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [SECTIONS]);

  useEffect(() => {
    let rafId = 0;

    const getNavbarOffset = () => {
      const rawOffset = getComputedStyle(document.documentElement)
        .getPropertyValue("--main-navbar-offset");
      const offset = Number.parseFloat(rawOffset);

      return Number.isFinite(offset) ? offset : 98;
    };

    const updateSectionNavState = () => {
      const wrapper = sectionNavWrapperRef.current;
      const nav = sectionNavRef.current;
      if (!wrapper || !nav) return;

      const navbarOffset = getNavbarOffset();
      const nextHeight = nav.offsetHeight;
      const nextPinned = wrapper.getBoundingClientRect().top <= navbarOffset;

      setSectionNavState((current) => {
        if (
          current.pinned === nextPinned &&
          Math.abs(current.height - nextHeight) < 1
        ) {
          return current;
        }

        return { pinned: nextPinned, height: nextHeight };
      });
    };

    const scheduleUpdate = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateSectionNavState();
      });
    };

    updateSectionNavState();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="bg-[#FDFCF8] min-h-screen font-sans selection:bg-[#3D5A3D]/10 selection:text-[#3D5A3D]">
        
        {/* =========================
            HERO FRANTOIO
        ========================== */}
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(#3D5A3D/0.02_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
              
              {/* Left Column Content */}
              <div className="order-2 lg:order-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] text-[#8B7355] uppercase mb-6">
                  <span className="h-px w-8 bg-[#8B7355]" />
                  {t("hero.label")}
                </div>

                <h1 className="font-serif text-4xl font-light leading-[1.08] tracking-tight text-[#1C1917] sm:text-5xl lg:text-[3.5rem] xl:text-[4.2rem]">
                  {t("hero.title_part1")} <br />
                  <span className="italic font-normal text-[#3D5A3D] mt-2 block">{t("hero.title_italic")}</span>
                </h1>

                <p className="mt-8 max-w-xl text-base leading-relaxed text-[#57534E] sm:text-lg">
                  {t("hero.description")}
                </p>

                {/* Interactive Luxury Badges */}
                <div className="mt-10 flex flex-wrap gap-3">
                  <span className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest border rounded-[5px] bg-[#3D5A3D]/5 border-[#3D5A3D]/10 text-[#3D5A3D] transition-all hover:bg-[#3D5A3D]/10">
                    {t("hero.tag1")}
                  </span>
                  <span className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest border rounded-[5px] bg-[#B8860B]/5 border-[#B8860B]/10 text-[#B8860B] transition-all hover:bg-[#B8860B]/10">
                    {t("hero.tag2")}
                  </span>
                  <span className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest border rounded-[5px] bg-white border-[#E7E5E4] text-[#57534E] shadow-sm hover:border-[#8B7355]/40 transition-all">
                    {t("hero.tag3")}
                  </span>
                </div>
              </div>

              {/* Right Column Visual Image Frame */}
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative group w-full max-w-[540px] lg:max-w-none">
                  {/* Glowing background decor */}
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#3D5A3D]/5 to-[#B8860B]/5 blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Decorative luxury offset border behind the image */}
                  <div className="absolute -bottom-4 -right-4 h-full w-full border border-[#B8860B]/30 rounded-[5px] pointer-events-none transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
                  
                  {/* Main image container */}
                  <div className="relative overflow-hidden border-2 border-[#E7E5E4] bg-[#F5F5F4] rounded-[5px] aspect-[4/3] sm:aspect-[16/11] w-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src={FRANTOIO_IMAGES.hero}
                      alt={t("hero.img_alt")}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 620px"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            STICKY NARRATIVE CHAPTER NAVIGATION (Buttery Smooth Jump Links)
        ======================================================== */}
        <div
          ref={sectionNavWrapperRef}
          style={sectionNavState.pinned ? { height: sectionNavState.height } : undefined}
        >
          <div
            ref={sectionNavRef}
            style={sectionNavState.pinned ? fixedSectionNavStyle : stickySectionNavStyle}
            className={`${sectionNavState.pinned ? "fixed" : "sticky"} z-30 w-full backdrop-blur-md bg-[#FDFCF8]/95 border-y border-[#E7E5E4] shadow-sm transition-[top] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
          >
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex justify-between gap-3 overflow-x-auto scrollbar-hide py-3">
                {SECTIONS.map((ch) => {
                  const isActive = activeSection === ch.id;
                  return (
                    <a
                      key={ch.id}
                      href={`#${ch.id}`}
                      className={`group flex flex-col px-4 py-2 transition-all duration-300 rounded-[5px] border ${
                        isActive
                          ? "bg-[#3D5A3D] border-[#3D5A3D] text-white shadow-md shadow-[#3D5A3D]/10"
                          : "bg-white border-[#E7E5E4] text-[#57534E] hover:border-[#3D5A3D]/40 hover:text-[#1C1917]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-serif text-xs font-bold ${isActive ? "text-[#B8860B]" : "text-[#8B7355]"}`}>
                          {t("nav.section")} {ch.number}
                        </span>
                        <span className={`h-1 w-1 rounded-full ${isActive ? "bg-[#B8860B]" : "bg-[#8B7355]/40"}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                          {ch.label}
                        </span>
                      </div>
                      <span className={`text-[9px] mt-0.5 tracking-wider ${isActive ? "text-[#E8F0E8]" : "text-[#8B7355]"}`}>
                        {ch.kicker}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            CAPITOLO I: L'ORIGINE (Harvesting & The Fruit)
        ======================================================== */}
        <section id="capitolo-1" style={chapterScrollMarginStyle} className="py-24 bg-white border-b border-[#E7E5E4]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
              
              {/* Image Column */}
              <div className="relative group w-full max-w-[540px] mx-auto lg:max-w-none">
                <div className="absolute -bottom-4 -right-4 h-full w-full border border-[#B8860B]/20 rounded-[5px] pointer-events-none transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                <div className="relative overflow-hidden border border-[#E7E5E4] bg-[#F5F5F4] rounded-[5px] aspect-[16/11] shadow-lg">
                  <Image
                    src={FRANTOIO_IMAGES.brucatura}
                    alt={t("steps.brucatura.title")}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-serif text-lg font-bold text-[#B8860B] border border-[#B8860B]/30 px-3 py-1 rounded-[5px] bg-[#B8860B]/5">
                    {t("nav.section")} I
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#8B7355] uppercase">
                    {t("steps.brucatura.kicker")}
                  </span>
                </div>

                <h2 className="font-serif text-3xl font-light tracking-tight text-[#1C1917] sm:text-4xl lg:text-[2.75rem] leading-tight">
                  {t("steps.brucatura.title")}
                </h2>

                <div className="mt-8 space-y-5 text-base leading-relaxed text-[#57534E]">
                  {/* Brucatura translation paragraphs mapping */}
                  {((t.raw("steps.brucatura.paragraphs") as string[]) || []).map((p, i) => (
                    <p key={i} className={i === 0 ? "text-lg text-[#1C1917] font-light leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:text-[#3D5A3D] first-letter:float-left first-letter:mr-2" : ""}>
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-8 border-t border-[#E7E5E4] pt-6 flex flex-wrap gap-6 text-sm text-[#8B7355]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#3D5A3D]" />
                    <span>{t("origin.tag1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#3D5A3D]" />
                    <span>{t("origin.tag2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#3D5A3D]" />
                    <span>{t("origin.tag3")}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            CAPITOLO II: L'ARTE DELL'ESTRATTORE (6 Milling Steps)
        ======================================================== */}
        <section id="capitolo-2" style={chapterScrollMarginStyle} className="py-24 bg-[#FAF8F5] border-b border-[#E7E5E4]">
          <div className="mx-auto max-w-7xl px-6">
            
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-serif text-lg font-bold text-[#B8860B] border border-[#B8860B]/30 px-3 py-1 rounded-[5px] bg-[#B8860B]/5">
                    {t("nav.section")} II
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#8B7355] uppercase">
                    {t("machines.label")}
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-light tracking-tight text-[#1C1917] sm:text-4xl lg:text-[2.75rem] leading-tight">
                  {t("machines.title_part1")}{" "}
                  <span className="italic text-[#3D5A3D] font-normal">{t("machines.title_italic")}</span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#57534E] border-l-2 border-[#3D5A3D]/20 pl-4 lg:text-base">
                {t("machines.subtitle")}
              </p>
            </div>

            {/* Custom Machinery Grid Journey */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <MachineCard
                title={t("machines.defogliazione.title")}
                desc={t("machines.defogliazione.desc")}
                imgSrc={FRANTOIO_IMAGES.defogliazione}
                color="olive"
                icon="defogliazione"
              />
              <MachineCard
                title={t("machines.frangitura.title")}
                desc={t("machines.frangitura.desc")}
                imgSrc={FRANTOIO_IMAGES.pulizia}
                color="gold"
                icon="frangitura"
              />
              <MachineCard
                title={t("machines.gramolazione.title")}
                desc={t("machines.gramolazione.desc")}
                imgSrc={FRANTOIO_IMAGES.gramolazione}
                color="olive"
                icon="gramolazione"
              />
              <MachineCard
                title={t("machines.estrazione.title")}
                desc={t("machines.estrazione.desc")}
                imgSrc={FRANTOIO_IMAGES.estrazione}
                color="gold"
                icon="estrazione"
              />
              <MachineCard
                title={t("machines.separazione.title")}
                desc={t("machines.separazione.desc")}
                imgSrc={FRANTOIO_IMAGES.separazione}
                color="olive"
                icon="separazione"
              />
              <MachineCard
                title={t("machines.filtrazione.title")}
                desc={t("machines.filtrazione.desc")}
                imgSrc={FRANTOIO_IMAGES.filtrazione}
                color="gold"
                icon="filtrazione"
              />
            </div>

          </div>
        </section>

        {/* ========================================================
            CAPITOLO III: LA CUSTODIA DELLA QUALITÀ (Stainless & Nitrogen)
        ======================================================== */}
        <section id="capitolo-3" style={chapterScrollMarginStyle} className="py-24 bg-white border-b border-[#E7E5E4]">
          <div className="mx-auto max-w-7xl px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-lg font-bold text-[#B8860B] border border-[#B8860B]/30 px-3 py-1 rounded-[5px] bg-[#B8860B]/5">
                  {t("nav.section")} III
                </span>
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#8B7355] uppercase">
                  {t("machines.divider_1.label")}
                </span>
              </div>
              
              <h2 className="font-serif text-3xl font-light tracking-tight text-[#1C1917] sm:text-4xl lg:text-[2.75rem] leading-tight">
                {t("machines.divider_1.title_part1")}{" "}
                <span className="italic text-[#3D5A3D] font-normal">{t("machines.divider_1.title_italic")}</span>
              </h2>
              
              <p className="mt-6 text-sm leading-relaxed text-[#57534E] sm:text-base lg:text-lg">
                {t("machines.divider_1.text")}
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
              {/* Feature Showcase 1 - Trasporto */}
              <FeatureShowcase
                kicker={t("showcase.trasporto.kicker")}
                title={t("showcase.trasporto.title")}
                text={t("showcase.trasporto.text")}
                imgLabel={t("showcase.trasporto.img_label")}
                imgSrc={FRANTOIO_IMAGES.pulizia}
                alt={t("showcase.trasporto.title")}
                badgeColor="olive"
              />

              {/* Feature Showcase 2 - Stoccaggio */}
              <FeatureShowcase
                kicker={t("showcase.stoccaggio.kicker")}
                title={t("showcase.stoccaggio.title")}
                text={t("showcase.stoccaggio.text")}
                imgLabel={t("showcase.stoccaggio.img_label")}
                imgSrc={FRANTOIO_IMAGES.conservazione}
                alt={t("showcase.stoccaggio.title")}
                badgeColor="gold"
              />
            </div>

          </div>
        </section>

        {/* ========================================================
            CAPITOLO IV: IL SIGILLO E LA FIRMA (Bottling & Certifications)
        ======================================================== */}
        <section id="capitolo-4" style={chapterScrollMarginStyle} className="py-24 bg-[#FAF8F5] border-b border-[#E7E5E4]">
          <div className="mx-auto max-w-7xl px-6">
            
            {/* Section Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-serif text-lg font-bold text-[#B8860B] border border-[#B8860B]/30 px-3 py-1 rounded-[5px] bg-[#B8860B]/5">
                    {t("nav.section")} IV
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#8B7355] uppercase">
                    {t("machines.divider_2.label")}
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-light tracking-tight text-[#1C1917] sm:text-4xl lg:text-[2.75rem] leading-tight">
                  {t("machines.divider_2.title_part1")}{" "}
                  <span className="italic text-[#3D5A3D] font-normal">{t("machines.divider_2.title_italic")}</span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#57534E] border-l-2 border-[#3D5A3D]/20 pl-4 lg:text-base">
                {t("machines.divider_2.text")}
              </p>
            </div>

            {/* Visual Suites */}
            <div className="space-y-12">
              
              {/* Row 1: Imbottigliamento (Deep Charcoal Card) */}
              <div className="w-full bg-[#1C1917] rounded-[5px] p-8 lg:p-14 relative overflow-hidden text-white border border-[#3D3530] shadow-xl">
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#B8860B]/5 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#3D5A3D]/5 blur-[100px] pointer-events-none" />
                
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#B8860B]/10 border border-[#B8860B]/20 text-[10px] font-bold tracking-[0.25em] text-[#B8860B] uppercase">
                      {t("showcase.imbottigliamento.kicker")}
                    </div>
                    
                    <h3 className="mt-5 font-serif text-2xl font-light tracking-tight text-[#FAFAF9] sm:text-3xl leading-tight">
                      {t("showcase.imbottigliamento.title")}
                    </h3>
                    
                    <p className="mt-5 text-sm leading-relaxed text-[#A8A29E] sm:text-base">
                      {t("showcase.imbottigliamento.text")}
                    </p>

                    {/* Timeline connection - Imbottigliamento Paragraph Block */}
                    <div className="mt-6 border-t border-[#44403C] pt-6 space-y-4">
                      {((t.raw("steps.imbottigliamento.paragraphs") as string[]) || []).map((p, i) => (
                        <p key={i} className="text-xs text-[#A8A29E] italic leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-4 pt-2">
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

                  <div className="group relative">
                    <div className="absolute -bottom-3 -left-3 h-full w-full border border-[#B8860B]/20 rounded-[5px] pointer-events-none" />
                    <div className="relative overflow-hidden border border-[#44403C] bg-[#292524] rounded-[5px]">
                      <MediaPlaceholder
                        label={t("showcase.imbottigliamento.img_label")}
                        imgSrc={FRANTOIO_IMAGES.confezionamento}
                        alt={t("showcase.imbottigliamento.title")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Controllo Qualità & Tracciabilità */}
              <div className="relative overflow-hidden rounded-[5px] border-2 border-[#3D5A3D]/20 bg-white p-8 lg:p-12 shadow-lg">
                <div className="absolute right-10 top-10 hidden lg:block">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3D5A3D]/5 border border-[#3D5A3D]/10">
                    <IconShield className="h-6 w-6 text-[#3D5A3D]" />
                  </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                  
                  {/* Media */}
                  <div className="order-2 lg:order-1 relative group">
                    <div className="absolute -bottom-3 -right-3 h-full w-full border border-[#B8860B]/15 rounded-[5px] pointer-events-none" />
                    <div className="relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#F5F5F4]">
                      <MediaPlaceholder
                        label={t("showcase.controllo.img_label")}
                        imgSrc={FRANTOIO_IMAGES.tracciabilita}
                        alt={t("showcase.controllo.title")}
                      />
                    </div>
                  </div>

                  {/* Text Column */}
                  <div className="order-1 lg:order-2 lg:pl-6">
                    <div className="inline-flex items-center gap-2 rounded-[5px] bg-[#3D5A3D]/10 px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-[#3D5A3D] uppercase">
                      {t("showcase.controllo.kicker")}
                    </div>
                    
                    <h3 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917] sm:text-3xl">
                      {t("showcase.controllo.title")}
                    </h3>
                    
                    <p className="mt-4 text-sm leading-relaxed text-[#57534E] sm:text-base">
                      {t("showcase.controllo.text")}
                    </p>
                    
                    <ul className="mt-6 space-y-3.5 border-t border-[#E7E5E4] pt-6">
                      <li className="flex items-center gap-3 text-sm text-[#57534E] font-medium">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3D5A3D] text-[10px] text-white">
                          ✓
                        </span>
                        {t("showcase.controllo.list1")}
                      </li>
                      <li className="flex items-center gap-3 text-sm text-[#57534E] font-medium">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3D5A3D] text-[10px] text-white">
                          ✓
                        </span>
                        {t("showcase.controllo.list2")}
                      </li>
                      <li className="flex items-center gap-3 text-sm text-[#57534E] font-medium">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3D5A3D] text-[10px] text-white">
                          ✓
                        </span>
                        {t("showcase.controllo.list3")}
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Row 3: Le Certificazioni (IGP & BIO Suite) */}
              <div className="grid gap-8 lg:grid-cols-2">
                
                {/* Olio EVO Card */}
                <div className="group rounded-[5px] border border-[#E7E5E4] bg-white p-8 hover:border-[#3D5A3D]/40 transition-all duration-300 shadow-sm flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#3D5A3D]/5 border border-[#3D5A3D]/10 text-[10px] font-bold tracking-[0.25em] text-[#3D5A3D] uppercase">
                        {t("steps.evo.kicker")}
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-[#8B7355]">{t("badges.premium_quality")}</span>
                    </div>

                    <h4 className="font-serif text-2xl font-light text-[#1C1917] group-hover:text-[#3D5A3D] transition-colors">
                      {t("steps.evo.title")}
                    </h4>

                    <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-[#57534E]">
                      {((t.raw("steps.evo.paragraphs") as string[]) || []).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 relative group/media overflow-hidden border border-[#E7E5E4] bg-[#F5F5F4] rounded-[5px] aspect-[16/10]">
                    <Image
                      src={FRANTOIO_IMAGES.evo}
                      alt={t("steps.evo.title")}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover/media:scale-103"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </div>

                {/* IGP & BIO Card */}
                <div className="group rounded-[5px] border border-[#E7E5E4] bg-white p-8 hover:border-[#B8860B]/40 transition-all duration-300 shadow-sm flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#B8860B]/5 border border-[#B8860B]/10 text-[10px] font-bold tracking-[0.25em] text-[#B8860B] uppercase">
                        {t("steps.igp_bio.kicker")}
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-[#B8860B]">{t("badges.certified_origin")}</span>
                    </div>

                    <h4 className="font-serif text-2xl font-light text-[#1C1917] group-hover:text-[#B8860B] transition-colors">
                      {t("steps.igp_bio.title")}
                    </h4>

                    <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-[#57534E]">
                      {((t.raw("steps.igp_bio.paragraphs") as string[]) || []).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 relative group/media overflow-hidden border border-[#E7E5E4] bg-[#F5F5F4] rounded-[5px] aspect-[16/10]">
                    <Image
                      src={FRANTOIO_IMAGES.igpBio}
                      alt={t("steps.igp_bio.title")}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover/media:scale-103"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            CAPITOLO V: L'ANIMA DELL'IMPIANTO (Services & Experience)
        ======================================================== */}
        <section id="capitolo-5" style={chapterScrollMarginStyle} className="py-24 bg-[#1C1917] text-white relative overflow-hidden border-t border-[#3D3530]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              
              {/* Info Column */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-serif text-lg font-bold text-[#B8860B] border border-[#B8860B]/30 px-3 py-1 rounded-[5px] bg-[#B8860B]/5">
                    {t("nav.section")} V
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#8B7355] uppercase">
                    {t("technology.label")}
                  </span>
                </div>
                
                <h2 className="font-serif text-3xl font-light leading-[1.1] tracking-tight text-[#FAFAF9] sm:text-4xl lg:text-[2.75rem]">
                  {t("technology.title_part1")} <br />
                  <span className="italic text-[#B8860B] font-normal">{t("technology.title_italic")}</span>
                </h2>

                <p className="mt-6 text-sm leading-relaxed text-[#A8A29E] sm:text-base">
                  {t("technology.description")}
                </p>

                {/* Highly premium vertical list */}
                <ul className="mt-10 space-y-6">
                  <CheckItemDark title={t("technology.checks.chain.title")} desc={t("technology.checks.chain.desc")} />
                  <CheckItemDark title={t("technology.checks.clean.title")} desc={t("technology.checks.clean.desc")} />
                  <CheckItemDark title={t("technology.checks.extraction.title")} desc={t("technology.checks.extraction.desc")} />
                  <CheckItemDark title={t("technology.checks.storage.title")} desc={t("technology.checks.storage.desc")} />
                </ul>
              </div>

              {/* Right Column Services Dashboard */}
              <div className="grid gap-6 sm:grid-cols-2">
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
        </section>

        <Footer />
      </div>
    </>
  );
}

/* ========================================================
   COMPONENTS
======================================================== */

function MachineCard({
  title,
  desc,
  imgSrc,
  color,
  icon,
}: {
  title: string;
  desc: string;
  imgSrc: string;
  color: "olive" | "gold";
  icon: "defogliazione" | "frangitura" | "gramolazione" | "estrazione" | "separazione" | "filtrazione";
}) {
  const t_shared = useTranslations("ProduzionePage.shared");
  const accentColor = color === "olive" ? "#3D5A3D" : "#B8860B";
  const hoverShadow = color === "olive" ? "shadow-[#3D5A3D]/5" : "shadow-[#B8860B]/5";

  return (
    <div className={`group relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${hoverShadow} flex flex-col h-full`}>
      {/* Dynamic Slide Accent Bar */}
      <div
        className="absolute left-0 top-0 h-1 w-0 transition-all duration-500 ease-out group-hover:w-full"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex-grow">
        {/* Top Header Card Info */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E7E5E4] group-hover:border-[#3D5A3D]/10 transition-colors">
          <div className="text-[10px] font-bold tracking-[0.25em] text-[#8B7355] uppercase">
            {t_shared("machine")}
          </div>
          
          {/* Custom SVG Icon in place of number */}
          <div className="transition-colors duration-300" style={{ color: accentColor }}>
            {icon === "defogliazione" && <IconDefogliazione className="h-6 w-6" />}
            {icon === "frangitura" && <IconFrangitura className="h-6 w-6" />}
            {icon === "gramolazione" && <IconGramolazione className="h-6 w-6" />}
            {icon === "estrazione" && <IconEstrazione className="h-6 w-6" />}
            {icon === "separazione" && <IconSeparazione className="h-6 w-6" />}
            {icon === "filtrazione" && <IconFiltrazione className="h-6 w-6" />}
          </div>
        </div>

        <div className="font-serif text-xl font-light tracking-tight text-[#1C1917] group-hover:text-[#3D5A3D] transition-colors mt-2">
          {title}
        </div>
        
        <p className="mt-2 text-sm leading-relaxed text-[#57534E]">{desc}</p>
      </div>

      {/* Frame of image */}
      <div className="mt-6 relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#F5F5F4] aspect-[16/10] w-full shadow-inner">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
  badgeColor,
}: {
  kicker: string;
  title: string;
  text: string;
  imgLabel: string;
  imgSrc?: string;
  alt?: string;
  badgeColor: "olive" | "gold";
}) {
  const badgeBorder = badgeColor === "olive" ? "border-[#3D5A3D]/20 text-[#3D5A3D] bg-[#3D5A3D]/5" : "border-[#B8860B]/20 text-[#B8860B] bg-[#B8860B]/5";
  
  return (
    <div className="group relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#FAF8F5] p-6 transition-all duration-300 hover:border-[#3D5A3D]/30 hover:shadow-xl lg:p-10 flex flex-col h-full font-sans">
      <div className="absolute left-0 top-0 h-1 w-0 bg-[#3D5A3D] transition-all duration-500 group-hover:w-full" />

      <div className="flex-grow">
        <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase border rounded-[5px] ${badgeBorder}`}>
          {kicker}
        </div>
        
        <h3 className="mt-5 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl transition-colors group-hover:text-[#3D5A3D]">
          {title}
        </h3>
        
        <p className="mt-4 text-sm leading-relaxed text-[#57534E] lg:text-base">{text}</p>
      </div>

      <div className="mt-8 relative group-hover:translate-y-[-2px] transition-transform duration-300">
        <div className="absolute -bottom-3 -right-3 h-full w-full border border-[#B8860B]/15 rounded-[5px] pointer-events-none" />
        
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
    <div className="group rounded-[5px] border border-[#44403C] bg-[#292524] p-6 transition-all duration-300 hover:border-[#8B7355] hover:shadow-lg hover:shadow-[#B8860B]/5">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[10px] font-bold tracking-[0.25em] text-[#B8860B] uppercase">
          {badge}
        </div>
        <div className="h-2.5 w-2.5 rounded-full bg-[#3D5A3D] border border-[#FAFAF9]/10 group-hover:bg-[#B8860B] transition-colors duration-300" />
      </div>
      
      <div className="mt-4 font-serif text-lg font-light tracking-tight text-[#FAFAF9] transition-colors">
        {title}
      </div>
      
      <p className="mt-3 text-sm leading-relaxed text-[#A8A29E] group-hover:text-[#D6D3D1] transition-colors">{text}</p>
    </div>
  );
}

function CheckItemDark({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-4 group">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#44403C] bg-[#292524] text-[#B8860B] shadow-md group-hover:border-[#B8860B] transition-colors">
        <IconCheck className="h-4 w-4" />
      </span>
      <div>
        <div className="font-semibold text-[#FAFAF9] group-hover:text-[#B8860B] transition-colors">{title}</div>
        <div className="text-sm text-[#A8A29E] mt-1">{desc}</div>
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
    <div className="relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#F5F5F4] w-full">
      <div className={`w-full ${small ? "aspect-[16/10]" : "aspect-[16/11]"} relative`}>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={alt ?? label}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-full border border-[#D6D3D1] bg-white/90 px-4 py-2 text-[10px] font-medium tracking-wider text-[#78716C] shadow-sm">
              {label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================
   UTILITIES & SVGS
======================================================== */

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

// Custom Machinery SVG icons
function IconDefogliazione({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a4 4 0 0 1 4 4c0 2-3 6-4 6s-4-4-4-6a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 12a3 3 0 0 1 3 3c0 1.5-2.5 4.5-3 4.5s-3-3-3-4.5a3 3 0 0 1 3-3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14a2.5 2.5 0 0 1 2.5 2.5c0 1.2-2 3.8-2.5 3.8s-2.5-2.6-2.5-3.8A2.5 2.5 0 0 1 8 14z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h5M17 19h5M3 17h2" strokeLinecap="round" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function IconFrangitura({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12h.01M15 12h.01" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 6v12" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M5 6l2 2M19 6l-2 2M5 18l2-2M19 18l-2-2" strokeLinecap="round" strokeWidth="1" />
    </svg>
  );
}

// Gentle continuous spiral representing malaxation mixing
function IconGramolazione({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12c3-6 6-6 9 0s6 6 9 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16c3-6 6-6 9 0s6 6 9 0" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 8c3-6 6-6 9 0s6 6 9 0" opacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconEstrazione({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeDasharray="4 2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5" strokeLinecap="round" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v1M12 20v1M3 12h1M20 12h1" strokeLinecap="round" />
    </svg>
  );
}

function IconSeparazione({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 10a3 3 0 0 1 3 3c0 2-3 5-3 5s-3-3-3-5a3 3 0 0 1 3-3z" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function IconFiltrazione({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18M5 11h14M8 16h8M11 21h2" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <circle cx="6" cy="8" r="1" fill="currentColor" />
      <circle cx="18" cy="8" r="1" fill="currentColor" />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}
