"use client";

import Image from "next/image";

type IqoBadgePairProps = {
  className?: string;
  badgeClassName?: string;
  dividerClassName?: string;
  gapClassName?: string;
};

export default function IqoBadgePair({
  className = "",
  badgeClassName = "w-[150px] sm:w-[180px] md:w-[220px]",
  dividerClassName = "hidden h-24 w-px bg-[#E7E5E4] md:block",
  gapClassName = "gap-4 sm:gap-5 md:gap-6",
}: IqoBadgePairProps) {
  return (
    <a
      href="https://www.iqo.it/"
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "flex w-full items-center justify-center",
        "flex-col md:flex-row",
        gapClassName,
        className,
      ].join(" ").trim()}
      title="Visita il sito ufficiale IQO"
    >
      <div className={["relative aspect-square overflow-hidden transition-transform duration-300 hover:scale-105", badgeClassName].join(" ").trim()}>
        <Image
          src="/loghi/bollino_IQO_1.avif"
          alt="Bollino IQO 1"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 150px, 220px"
        />
      </div>

      <div className={dividerClassName} />

      <div className={["relative aspect-square overflow-hidden transition-transform duration-300 hover:scale-105", badgeClassName].join(" ").trim()}>
        <Image
          src="/loghi/bollino_IQO_2.avif"
          alt="Bollino IQO 2"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 150px, 220px"
        />
      </div>
    </a>
  );
}
