import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import HeroCarouselClient from "@/components/HeroCarouselClient";
import { Link } from "@/i18n/routing";

export type HeroSlide = {
  id: string;
  title: string;
  excerpt: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export default async function HeroCarousel() {
  const t = await getTranslations("HomePage.HeroCarousel");

  const slides: HeroSlide[] = [
    {
      id: "tradizione",
      title: t("slides.tradizione.title"),
      excerpt: t("slides.tradizione.excerpt"),
      cta: t("slides.tradizione.cta"),
      href: "/produzione",
      imageSrc: "/hero/tradizione.webp",
      imageAlt: t("slides.tradizione.alt"),
    },
    {
      id: "storia",
      title: t("slides.storia.title"),
      excerpt: t("slides.storia.excerpt"),
      cta: t("slides.storia.cta"),
      href: "/storia",
      imageSrc: "/hero/storia.webp",
      imageAlt: t("slides.storia.alt"),
    },
    {
      id: "oli",
      title: t("slides.oli.title"),
      excerpt: t("slides.oli.excerpt"),
      cta: t("slides.oli.cta"),
      href: "/shop",
      imageSrc: "/hero/oli.webp",
      imageAlt: t("slides.oli.alt"),
    },
  ];

  const firstSlide = slides[0];

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[#120f0d]"
      aria-label={t("aria.hero_highlight")}
    >
      <h1 className="sr-only">{t("sr_title")}</h1>

      <div className="relative hero-container-height min-h-[500px] w-full md:min-h-[560px]">
        <figure className="absolute inset-0 w-full">
          <Image
            src={firstSlide.imageSrc}
            alt={firstSlide.imageAlt}
            fill
            priority
            quality={78}
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,11,8,0.68)_0%,rgba(18,11,8,0.38)_38%,rgba(18,11,8,0.16)_62%,rgba(18,11,8,0.46)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,164,97,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(98,128,72,0.14),transparent_24%)]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/40 to-transparent" />

          <figcaption className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-6 py-14 text-center sm:px-10">
              <div className="w-full max-w-4xl text-white">
                <div className="flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
                  <span>Frantoio Del Pasqua</span>
                  <span className="h-px w-10 bg-[#c0a36b]/60" aria-hidden="true" />
                  <span>01</span>
                </div>

                <h2 className="mx-auto mt-5 max-w-[220px] font-serif text-4xl leading-[0.95] tracking-[0.02em] text-white xs:max-w-[280px] sm:max-w-[12ch] sm:text-5xl sm:leading-[0.9] lg:text-6xl xl:text-7xl">
                  {firstSlide.title}
                </h2>

                <p className="mx-auto mt-5 max-w-[260px] text-sm leading-6 text-white/85 xs:max-w-[320px] sm:max-w-[46rem] sm:text-base sm:leading-8 lg:text-lg">
                  {firstSlide.excerpt}
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link
                    href={firstSlide.href}
                    className="inline-flex items-center gap-2 rounded-[5px] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#120f0d] transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-100 hover:text-black hover:shadow-[0_12px_24px_rgba(255,255,255,0.12)] active:scale-[0.98]"
                    aria-label={`${firstSlide.cta}: ${firstSlide.title}`}
                  >
                    {firstSlide.cta}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </figcaption>
        </figure>

        <HeroCarouselClient
          slides={slides}
          labels={{
            prev: t("aria.prev"),
            next: t("aria.next"),
          }}
        />
      </div>

      <nav className="sr-only" aria-label={t("aria.main_sections")}>
        <ul>
          {slides.map((slide) => (
            <li key={slide.id}>
              <Link href={slide.href}>{slide.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
