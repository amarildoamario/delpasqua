"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useScrollTextReveal } from "./useScrollTextReveal";

export default function HomeMillFeature() {
  const t = useTranslations("HomePage.HomeAboutTerritory");
  const contentRef = useRef<HTMLDivElement | null>(null);
  useScrollTextReveal(contentRef);

  return (
    <section className="relative w-full bg-[#4a5a38] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative order-2 h-[42svh] overflow-hidden bg-[#353e2a] lg:order-1 lg:h-auto lg:min-h-[88svh] lg:[clip-path:inset(0)]">
          <div className="absolute inset-0 lg-parallax-fixed lg:left-0 lg:right-auto lg:w-1/2">
            <Image
              src="/home_component_frantoio/home_frantoio.jpg"
              alt={t("title")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,12,0.1)_0%,rgba(12,18,12,0.03)_44%,rgba(12,18,12,0.22)_100%)]" />
          </div>
        </div>

        <div className="order-1 flex min-h-[54svh] flex-col justify-center px-6 py-10 sm:px-10 md:py-12 lg:order-2 lg:min-h-[88svh] lg:px-16 xl:px-20">
          <div
            ref={contentRef}
            className="mx-auto w-full max-w-[31rem]"
          >
            <span data-reveal-text className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#d6ded8]">
              {t("label")}
            </span>

            <h2 data-reveal-text className="mt-4 font-serif text-[2.3rem] font-light leading-[1.02] tracking-[-0.02em] text-white md:text-[2.9rem] lg:text-[3.15rem]">
              {t("title")}
            </h2>

            <div data-reveal-text className="my-5 flex items-center gap-3">
              <span className="h-px w-10 bg-white/20" />
              <svg className="h-3.5 w-3.5 text-white/80" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="8" r="2.5" />
                <circle cx="9.5" cy="13" r="2.5" />
                <circle cx="14.5" cy="13" r="2.5" />
              </svg>
              <span className="h-px w-10 bg-white/20" />
            </div>

            <p data-reveal-text className="mb-7 max-w-[28rem] text-sm font-light leading-8 text-[#f0eee8]/88 md:text-[15px]">
              {t("description")}
            </p>
          </div>

          <div className="mx-auto mt-7 w-full max-w-[31rem]">
            <Link
              href="/produzione"
              className="inline-block rounded-[5px] bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#435036] transition-all duration-300 hover:bg-[#ece8df]"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
