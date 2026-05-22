// src/components/HomeUniqueness.tsx
"use client";

import { useTranslations } from "next-intl";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { Lightbulb } from "@/components/animate-ui/icons/lightbulb";
import { Sun } from "@/components/animate-ui/icons/sun";
import { Users } from "@/components/animate-ui/icons/users";

export default function HomeUniqueness() {
  const t = useTranslations("HomePage.HomeUniqueness");

  const items = [
    {
      icon: (
        <Sun
          aria-hidden="true"
          animateOnHover
          animateOnView
          animateOnViewOnce={false}
          className="h-5 w-5 sm:h-6 sm:w-6"
          loop
          loopDelay={1200}
          size={24}
        />
      ),
      title: t("items.tradition.title"),
      desc: t("items.tradition.desc"),
    },
    {
      icon: (
        <Users
          aria-hidden="true"
          animateOnHover
          animateOnView
          animateOnViewOnce={false}
          className="h-5 w-5 sm:h-6 sm:w-6"
          loop
          loopDelay={1400}
          size={24}
        />
      ),
      title: t("items.passion.title"),
      desc: t("items.passion.desc"),
    },
    {
      icon: (
        <Lightbulb
          aria-hidden="true"
          animateOnHover
          animateOnView
          animateOnViewOnce={false}
          className="h-5 w-5 sm:h-6 sm:w-6"
          loop
          loopDelay={1600}
          size={24}
        />
      ),
      title: t("items.innovation.title"),
      desc: t("items.innovation.desc"),
    },
    {
      icon: (
        <BadgeCheck
          aria-hidden="true"
          animateOnHover
          animateOnView
          animateOnViewOnce={false}
          className="h-5 w-5 sm:h-6 sm:w-6"
          loop
          loopDelay={1800}
          size={24}
        />
      ),
      title: t("items.quality.title"),
      desc: t("items.quality.desc"),
    },
  ];

  return (
    <section className="bg-[#fdfaf7] py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-8 lg:px-12">
        {/* Header with horizontal divider line */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-[#1f1a17] md:text-4xl">
            {t("title")}
          </h2>
          <div className="hidden h-px w-24 bg-[#ede8e0] md:block" />
        </div>

        {/* Scrollable list on mobile (showing 2 items at a time), standard grid on desktop */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-8 px-8 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {items.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex min-w-[calc(50%-12px)] snap-center flex-col items-center text-center sm:min-w-0"
              >
                {/* Circular Icon Container */}
                <div className="mb-3 sm:mb-5 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-[#ede8e0] bg-white text-[#434d34] shadow-[0_4px_12px_rgba(31,26,23,0.04)] transition-transform duration-300 hover:scale-105">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="mb-1 font-serif text-sm font-semibold sm:text-lg sm:font-medium text-[#1f1a17]">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-sm leading-normal sm:leading-relaxed text-[#5f554c] max-w-[130px] sm:max-w-[260px]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
