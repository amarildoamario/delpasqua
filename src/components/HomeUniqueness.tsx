// src/components/HomeUniqueness.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { Lightbulb } from "@/components/animate-ui/icons/lightbulb";
import { Sun } from "@/components/animate-ui/icons/sun";
import { Users } from "@/components/animate-ui/icons/users";

interface DoubleBgCardProps {
  children: React.ReactNode;
  className?: string;
  offsetColor?: string;
  borderColor?: string;
  paddingClass?: string;
  pattern?: "none" | "dots" | "grid";
}

function DoubleBgCard({
  children,
  className = "",
  offsetColor = "bg-[#434d34]/6 border-[#434d34]/15",
  borderColor = "border-[#ede8e0]",
  paddingClass = "p-6",
  pattern = "dots"
}: DoubleBgCardProps) {
  const getPatternStyle = () => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: "radial-gradient(rgba(67, 77, 52, 0.18) 1px, transparent 1px)",
          backgroundSize: "6px 6px"
        };
      case "grid":
        return {
          backgroundImage: `
            linear-gradient(rgba(67, 77, 52, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(67, 77, 52, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px"
        };
      default:
        return {};
    }
  };

  return (
    <div className={`relative group isolate ${className}`}>
      {/* Shifted outline card */}
      <div
        className={`absolute inset-0 border ${offsetColor} rounded-[5px] translate-x-1.5 translate-y-1.5 z-0 transition-transform duration-300 group-hover:translate-x-2.5 group-hover:translate-y-2.5`}
        style={getPatternStyle()}
      />

      {/* Foreground card */}
      <div className={`relative bg-white border ${borderColor} ${paddingClass} rounded-[5px] shadow-[0_4px_12px_rgba(31,26,23,0.02)] transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#434d34]/30 h-full flex flex-col justify-between z-10`}>
        {children}
      </div>
    </div>
  );
}

export default function HomeUniqueness() {
  const t = useTranslations("HomePage.HomeUniqueness");

  const items = [
    {
      icon: (
        <Sun
          aria-hidden="true"
          animateOnHover
          className="h-6 w-6 sm:h-7 sm:w-7 text-[#434d34]"
          loop
          loopDelay={1200}
          size={28}
        />
      ),
      title: t("items.tradition.title"),
      desc: t("items.tradition.desc"),
      pattern: "dots" as const,
    },
    {
      icon: (
        <Users
          aria-hidden="true"
          animateOnHover
          className="h-6 w-6 sm:h-7 sm:w-7 text-[#434d34]"
          loop
          loopDelay={1400}
          size={28}
        />
      ),
      title: t("items.passion.title"),
      desc: t("items.passion.desc"),
      pattern: "grid" as const,
    },
    {
      icon: (
        <Lightbulb
          aria-hidden="true"
          animateOnHover
          className="h-6 w-6 sm:h-7 sm:w-7 text-[#434d34]"
          loop
          loopDelay={1600}
          size={28}
        />
      ),
      title: t("items.innovation.title"),
      desc: t("items.innovation.desc"),
      pattern: "dots" as const,
    },
    {
      icon: (
        <BadgeCheck
          aria-hidden="true"
          animateOnHover
          className="h-6 w-6 sm:h-7 sm:w-7 text-[#434d34]"
          loop
          loopDelay={1800}
          size={28}
        />
      ),
      title: t("items.quality.title"),
      desc: t("items.quality.desc"),
      pattern: "grid" as const,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#fdfaf7] via-[#faf5ee] to-[#f8f1e5] py-10 sm:py-16 lg:py-22 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* Header with horizontal divider line */}
        <div className="mb-6 sm:mb-12 flex flex-col gap-4 md:flex-row md:items-center">
          <h2 className="font-serif text-2xl font-light tracking-tight text-[#1f1a17] sm:text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <div className="hidden h-px w-24 bg-[#ede8e0] md:block" />
        </div>

        {/* On Mobile: Continuous Marquee Banner */}
        <div className="relative -mx-6 block sm:hidden">
          {/* Gradient Masks */}
          <div className="absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-[#faf5ee] to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 z-10 w-8 bg-gradient-to-l from-[#faf5ee] to-transparent pointer-events-none" />

          {/* Marquee Track */}
          <div className="animate-marquee-horizontal flex py-3">
            {/* First Set of Items */}
            <div className="flex gap-6 pr-6 shrink-0">
              {items.map((item, idx) => (
                <DoubleBgCard
                  key={`m1-${idx}`}
                  pattern={item.pattern}
                  paddingClass="p-3"
                  className="w-[260px] shrink-0"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="text-[#434d34] shrink-0">
                      {item.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-serif text-xs font-semibold text-[#1f1a17] leading-snug truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-[#5f554c] leading-normal mt-0.5 line-clamp-2 font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </DoubleBgCard>
              ))}
            </div>

            {/* Second Set of Items for Seamless Loop */}
            <div className="flex gap-6 pr-6 shrink-0" aria-hidden="true">
              {items.map((item, idx) => (
                <DoubleBgCard
                  key={`m2-${idx}`}
                  pattern={item.pattern}
                  paddingClass="p-3"
                  className="w-[260px] shrink-0"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="text-[#434d34] shrink-0">
                      {item.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-serif text-xs font-semibold text-[#1f1a17] leading-snug truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-[#5f554c] leading-normal mt-0.5 line-clamp-2 font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </DoubleBgCard>
              ))}
            </div>
          </div>
        </div>

        {/* On Desktop: Standard Grid with DoubleBgCard */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-10">
          {items.map((item, idx) => (
            <DoubleBgCard
              key={`d-${idx}`}
              pattern={item.pattern}
              className="h-full"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon Container (Without Circular Box Wrapper) */}
                <div className="mb-4 text-[#434d34] transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="mb-2 font-serif text-lg font-medium text-[#1f1a17] group-hover:text-[#434d34] transition-colors duration-200">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-[#5f554c] max-w-[260px]">
                  {item.desc}
                </p>
              </div>
            </DoubleBgCard>
          ))}
        </div>
      </div>
    </section>
  );
}
