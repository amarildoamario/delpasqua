"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useScrollTextReveal } from "./useScrollTextReveal";

export default function HomeTastingsFeature() {
  const t = useTranslations("HomePage.HomeAboutFamily");
  const textRef = useRef<HTMLDivElement | null>(null);
  useScrollTextReveal(textRef);

  return (
    <section className="relative w-full bg-[#f4f1ea] text-[#1f1a17]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex min-h-[54svh] flex-col justify-center px-6 py-10 sm:px-10 md:py-12 lg:min-h-[88svh] lg:px-16 xl:px-20">
          <div
            ref={textRef}
            className="mx-auto w-full max-w-[31rem]"
          >
            <span data-reveal-text className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a3906b]">
              {t("label")}
            </span>

            <h2 data-reveal-text className="mt-4 font-serif text-[2.4rem] font-light leading-[0.98] tracking-[-0.02em] text-[#1e3528] md:text-[3rem] lg:text-[3.35rem]">
              {t("title")}
            </h2>

            <div data-reveal-text className="my-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#a3906b]/20" />
              <svg className="h-3.5 w-3.5 text-[#a3906b]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="8" r="2.5" />
                <circle cx="9.5" cy="13" r="2.5" />
                <circle cx="14.5" cy="13" r="2.5" />
              </svg>
              <span className="h-px w-10 bg-[#a3906b]/20" />
            </div>

            <p data-reveal-text className="mb-7 max-w-[28rem] text-sm font-light leading-8 text-[#6a655e] md:text-[15px]">
              {t("description")}
            </p>
          </div>

          <div className="mx-auto mt-7 w-full max-w-[31rem]">
            <Link
              href="/degustazioni"
              className="inline-block rounded-[5px] bg-[#244333] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#1c3528]"
            >
              {t("cta")}
            </Link>
          </div>
        </div>

        <div className="relative h-[42svh] overflow-hidden bg-stone-200 lg:h-auto lg:min-h-[88svh] lg:[clip-path:inset(0)]">
          <div className="absolute inset-0 lg:fixed lg:inset-y-0 lg:left-1/2 lg:right-auto lg:h-svh lg:w-1/2">
            <Image
              src="/home_component_degustazioni/home_degustazioni.jpg"
              alt={t("title")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[46%_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,15,0.08)_0%,rgba(20,18,15,0.02)_45%,rgba(20,18,15,0.18)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
