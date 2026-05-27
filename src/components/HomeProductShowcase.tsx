"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import IqoBadgePair from "@/components/IqoBadgePair";

type ProductKey = "evo" | "magnifico" | "vittoria";

type ProductSpot = {
  key: ProductKey;
  delay: number;
  className: string;
  imageClassName: string;
};

const PRODUCT_SOURCES: Record<ProductKey, string> = {
  evo: "/products_no_background/EVO-750-ml-gpt-no-background.png",
  magnifico: "/products_no_background/magnifico-no-background-v2.png",
  vittoria: "/products_no_background/vino-vittoria-no-background.png",
};

const PRODUCT_SPOTS: ProductSpot[] = [
  {
    key: "magnifico",
    delay: 120,
    className:
      "left-[0%] bottom-[9%] z-20 h-[382px] w-[152px] rotate-[-7deg] sm:left-[1%] sm:h-[470px] sm:w-[188px] md:left-[3%] md:h-[560px] md:w-[224px] lg:left-[7%] lg:h-[628px] lg:w-[250px]",
    imageClassName: "scale-[1.30]",
  },
  {
    key: "evo",
    delay: 0,
    className:
      "left-1/2 bottom-[3%] z-30 h-[430px] w-[212px] -translate-x-1/2 sm:h-[520px] sm:w-[256px] md:h-[610px] md:w-[300px] lg:h-[680px] lg:w-[334px]",
    imageClassName: "scale-[1.04]",
  },
  {
    key: "vittoria",
    delay: 220,
    className:
      "right-[0%] bottom-[9%] z-20 h-[382px] w-[152px] rotate-[7deg] sm:right-[1%] sm:h-[470px] sm:w-[188px] md:right-[3%] md:h-[560px] md:w-[224px] lg:right-[7%] lg:h-[628px] lg:w-[250px]",
    imageClassName: "scale-[2.55]",
  },
];

export default function HomeProductShowcase() {
  const t = useTranslations("HomePage.HomeProductShowcase");
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const fallbackId = window.setTimeout(() => {
      setIsVisible(true);
    }, 700);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        window.clearTimeout(fallbackId);
        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    observer.observe(stage);

    return () => {
      window.clearTimeout(fallbackId);
      observer.disconnect();
    };
  }, []);

  const products = useMemo(
    () => ({
      evo: {
        src: PRODUCT_SOURCES.evo,
        alt: t("products.evo"),
      },
      magnifico: {
        src: PRODUCT_SOURCES.magnifico,
        alt: t("products.magnifico"),
      },
      vittoria: {
        src: PRODUCT_SOURCES.vittoria,
        alt: t("products.vittoria"),
      },
    }),
    [t]
  );

  return (
    <section className="overflow-hidden bg-[#f7f1e8] pt-20 pb-14 text-[#1f1a17] lg:pt-24 lg:pb-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(0,1.16fr)_minmax(320px,0.84fr)] lg:items-center lg:px-12 xl:gap-14">
        <div
          ref={stageRef}
          aria-label={t("groups.signature.label")}
          className="group/stack relative min-h-[480px] overflow-visible sm:min-h-[570px] md:min-h-[650px] lg:min-h-[720px]"
        >
          {PRODUCT_SPOTS.map((spot) => {
            const product = products[spot.key];

            return (
              <button
                key={spot.key}
                type="button"
                aria-label={product.alt}
                style={{ transitionDelay: isVisible ? `${spot.delay}ms` : "0ms" }}
                className={[
                  "absolute cursor-pointer border-0 bg-transparent p-0 outline-none",
                  "transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "hover:duration-300 hover:ease-out hover:z-50 hover:scale-[1.08] hover:drop-shadow-[0_26px_32px_rgba(22,18,14,0.24)]",
                  "focus-visible:z-50 focus-visible:ring-2 focus-visible:ring-[#244333]/45 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f1e8]",
                  isVisible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-16 scale-[0.92] opacity-0",
                  spot.className,
                ].join(" ")}
              >
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 640px) 62vw, (max-width: 1024px) 34vw, 28vw"
                  className={[
                    "pointer-events-none object-contain drop-shadow-[0_22px_28px_rgba(22,18,14,0.28)]",
                    spot.imageClassName,
                  ].join(" ")}
                  priority={spot.key === "evo"}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center lg:justify-end">
          <div className="max-w-[31rem]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7455]">
              {t("label")}
            </span>

            <h2 className="mt-4 font-serif text-[2.35rem] font-light leading-[1.02] text-[#1f1a17] md:text-[3rem] lg:text-[3.3rem]">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-[28rem] text-sm leading-8 text-[#5f554c] md:text-[15px]">
              {t("description")}
            </p>

            <div className="mt-7 flex justify-center lg:justify-start">
              <IqoBadgePair
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
