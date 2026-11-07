"use client";

import { useEffect, useRef } from "react";

type CompanyStatsProps = {
  hectaresLabel: string;
  cultivarsLabel: string;
  yearsLabel: string;
};

const stats = [
  { value: 4, suffix: "", labelKey: "hectaresLabel" },
  { value: 3, suffix: "", labelKey: "cultivarsLabel" },
  { value: 60, suffix: "+", labelKey: "yearsLabel" },
] as const;

export default function CompanyStats(props: CompanyStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const numberElements = Array.from(container.querySelectorAll<HTMLElement>("[data-counter]"));
    const showFinalValues = () => {
      numberElements.forEach((element, index) => {
        const stat = stats[index];
        element.textContent = `${stat.value}${stat.suffix}`;
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showFinalValues();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const startedAt = performance.now();
        const duration = 1200;

        const update = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          numberElements.forEach((element, index) => {
            const stat = stats[index];
            element.textContent = `${Math.round(stat.value * easedProgress)}${stat.suffix}`;
          });

          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-7 grid max-w-md grid-cols-3 border-y border-[#3D5A3D]/15 py-4 max-lg:mx-auto"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.labelKey}
          className={`text-center lg:text-left ${index > 0 ? "border-l border-[#3D5A3D]/15 lg:pl-6" : ""}`}
        >
          <span className="sr-only">{stat.value}{stat.suffix}</span>
          <div
            aria-hidden="true"
            data-counter
            className="font-serif text-3xl font-light tabular-nums text-[#3D5A3D] sm:text-4xl"
          >
            0{stat.suffix}
          </div>
          <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-[#8B7355] sm:text-[10px] sm:tracking-[0.12em]">
            {props[stat.labelKey]}
          </div>
        </div>
      ))}
    </div>
  );
}
