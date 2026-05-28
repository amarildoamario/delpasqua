"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import IqoBadgePair from "@/components/IqoBadgePair";
import { useScrollTextReveal } from "./useScrollTextReveal";

const SHOWCASE_BACKGROUND = "/home_bottiglie_e_selezione/bottiglie_e_selezione_background.png";

export default function HomeProductShowcase() {
  const t = useTranslations("HomePage.HomeProductShowcase");
  const mobileTextRef = useRef<HTMLDivElement | null>(null);
  const desktopTextRef = useRef<HTMLDivElement | null>(null);
  useScrollTextReveal(mobileTextRef);
  useScrollTextReveal(desktopTextRef);

  return (
    <section className="relative overflow-hidden bg-[#eee2d2] text-[#1f1a17] lg:min-h-[88svh]">
      <Image
        src={SHOWCASE_BACKGROUND}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center lg:block"
      />

      <Image
        src={SHOWCASE_BACKGROUND}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-contain object-left lg:block"
      />

      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(247,241,232,0)_0%,rgba(247,241,232,0)_50%,rgba(247,241,232,0.34)_68%,rgba(247,241,232,0.78)_100%)] lg:block" />

      <div className="relative z-10 lg:hidden">
        <div className="px-6 pb-8 pt-14 sm:px-10">
          <div ref={mobileTextRef} className="mx-auto w-full max-w-[31rem]">
            <span data-reveal-text className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7455]">
              {t("label")}
            </span>

            <h2 data-reveal-text className="mt-4 font-serif text-[2.35rem] font-light leading-[1.02] text-[#1f1a17] md:text-[3rem]">
              {t("title")}
            </h2>

            <p data-reveal-text className="mt-5 max-w-[28rem] text-sm leading-8 text-[#5f554c] md:text-[15px]">
              {t("description")}
            </p>

            <div className="mt-7 flex justify-start">
              <IqoBadgePair
                className="flex-row justify-start"
                badgeClassName="w-[92px] sm:w-[112px]"
                dividerClassName="hidden"
                gapClassName="gap-4"
              />
            </div>

            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-2 rounded-[5px] bg-[#244333] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#1c3528]"
            >
              {t("cta")}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>

        <div className="relative h-[430px] overflow-hidden bg-[#eee2d2] sm:h-[520px]">
          <Image
            src={SHOWCASE_BACKGROUND}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[19%_center]"
          />
        </div>
      </div>

      <div className="relative z-10 hidden min-h-[88svh] grid-cols-2 lg:grid">
        <div className="hidden lg:block" />

        <div className="flex flex-col justify-end px-6 py-12 sm:px-10 lg:justify-center lg:px-16 xl:px-20">
          <div ref={desktopTextRef} className="mx-auto w-full max-w-[31rem]">
            <span data-reveal-text className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7455]">
              {t("label")}
            </span>

            <h2 data-reveal-text className="mt-4 font-serif text-[2.35rem] font-light leading-[1.02] text-[#1f1a17] md:text-[3rem] lg:text-[3.3rem]">
              {t("title")}
            </h2>

            <p data-reveal-text className="mt-5 max-w-[28rem] text-sm leading-8 text-[#5f554c] md:text-[15px]">
              {t("description")}
            </p>

            <div className="mt-7 flex justify-center lg:justify-start">
              <IqoBadgePair
                className="flex-row justify-start"
                badgeClassName="w-full max-w-[118px] sm:max-w-[132px] lg:max-w-[144px]"
                dividerClassName="hidden h-20 w-px bg-[#dccbb5] md:block"
                gapClassName="gap-4 sm:gap-5"
              />
            </div>

            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-2 rounded-[5px] bg-[#244333] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#1c3528]"
            >
              {t("cta")}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
