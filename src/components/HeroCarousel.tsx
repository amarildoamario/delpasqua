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
  const tTerritory = await getTranslations("HomePage.HomeAboutTerritory");
  const tFamily = await getTranslations("HomePage.HomeAboutFamily");

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

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[#120f0d]"
      aria-label={t("aria.hero_highlight")}
    >
      <h1 className="sr-only">Frantoio Del Pasqua</h1>
      <p className="sr-only">
        {tTerritory("description")} {tFamily("description")}
      </p>

      <div className="relative hero-container-height min-h-[500px] w-full md:min-h-[560px]">
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
