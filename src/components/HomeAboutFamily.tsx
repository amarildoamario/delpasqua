"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useScrollTextReveal } from "./useScrollTextReveal";

const READ_MORE_LABELS: Record<string, string> = {
  it: "Continua a leggere",
  en: "Continue reading",
  de: "Weiterlesen",
  nl: "Lees verder",
  no: "Les mer",
  da: "Laes videre",
};

export default function HomeAboutFamily() {
  const locale = useLocale();
  const navT = useTranslations("Common.navbar");
  const heroStoryT = useTranslations("HomePage.HeroCarousel.slides.storia");
  const storiaHeaderT = useTranslations("StoriaPage.header");
  const textRef = useRef<HTMLDivElement | null>(null);

  const ctaLabel = READ_MORE_LABELS[locale] ?? READ_MORE_LABELS.en;
  useScrollTextReveal(textRef);

  return (
    <section className="overflow-hidden bg-[#4a5839] text-white">
      <div className="grid min-h-[680px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div className="flex items-center px-6 py-16 sm:px-10 md:py-20 lg:px-16 xl:px-20">
          <div className="max-w-[36rem]">
            <div ref={textRef}>
              <span data-reveal-text className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/80">
                {navT("about_us")}
              </span>

              <h2 data-reveal-text className="mt-5 font-serif text-4xl font-light leading-[0.96] tracking-[0.01em] text-white sm:text-5xl lg:text-[4rem]">
                {heroStoryT("title")}
              </h2>

              <div data-reveal-text className="my-7 flex items-center gap-3 text-[#d9ddcf]">
                <span className="h-px w-10 bg-current/30" />
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="12" cy="8" r="2.5" />
                  <circle cx="9.5" cy="13" r="2.5" />
                  <circle cx="14.5" cy="13" r="2.5" />
                </svg>
                <span className="h-px w-10 bg-current/30" />
              </div>

              <p data-reveal-text className="max-w-[34rem] text-[15px] leading-8 text-white/86 sm:text-base">
                {storiaHeaderT("description")}
              </p>
            </div>

            <div className="mt-9">
              <Link
                href="/storia"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#405032] transition-colors duration-300 hover:bg-[#ece8df]"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[360px] lg:min-h-full">
          <Image
            src="/home_component_chi_siamo/famiglia.jpeg"
            alt={heroStoryT("title")}
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
