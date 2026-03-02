import Footer from "@/components/Footer";
import Image from "next/image";
import { useTranslations } from "next-intl";

const STORIA_IMAGES = {
  oliveti: "/storia/storia-1.jpg",
  raccolta: "/storia/storia-3.jpg",
  territorio: "/storia/storia-4.jpg",
} as const;

export default function StoriaPage() {
  const t = useTranslations("StoriaPage");

  return (
    <>
      <section className="bg-[#FDFCF8] min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              <span className="h-px w-6 bg-[#8B7355]" />
              {t("header.subtitle")}
            </div>

            <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
              {t("header.title_part1")}<span className="italic text-[#3D5A3D]">{t("header.title_italic")}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#57534E] lg:text-lg">
              {t("header.description")}
            </p>
          </div>

          {/* Section 1 - Oliveti */}
          <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                {t("section1.subtitle")}
              </div>

              <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                {t("section1.title_part1")}<span className="italic text-[#3D5A3D]">{t("section1.title_italic")}</span>
              </h2>

              <div className="mt-6 space-y-4">
                <p className="text-sm leading-relaxed text-[#57534E] lg:text-base">
                  {t("section1.p1")}
                </p>
                <p className="text-sm leading-relaxed text-[#57534E] lg:text-base">
                  {t("section1.p2")}
                </p>
              </div>

              <div className="mt-8 flex gap-6">
                <div className="text-center">
                  <div className="font-serif text-3xl font-light text-[#3D5A3D]">4</div>
                  <div className="mt-1 text-xs text-[#8B7355]">{t("section1.stats.hectares")}</div>
                </div>
                <div className="h-12 w-px bg-[#E7E5E4]" />
                <div className="text-center">
                  <div className="font-serif text-3xl font-light text-[#3D5A3D]">3</div>
                  <div className="mt-1 text-xs text-[#8B7355]">{t("section1.stats.cultivars")}</div>
                </div>
                <div className="h-12 w-px bg-[#E7E5E4]" />
                <div className="text-center">
                  <div className="font-serif text-3xl font-light text-[#3D5A3D]">60+</div>
                  <div className="mt-1 text-xs text-[#8B7355]">{t("section1.stats.years")}</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <ImageBox
                src={STORIA_IMAGES.oliveti}
                alt="Oliveti"
                variant="light"
                aspect="portrait"
              />
            </div>
          </div>

          {/* Section 2 - Raccolta */}
          <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <ImageBox
                src={STORIA_IMAGES.raccolta}
                alt="Raccolta"
                variant="light"
                aspect="portrait"
              />
            </div>

            <div className="lg:pl-8">
              <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                {t("section2.subtitle")}
              </div>

              <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                {t("section2.title_part1")}<span className="italic text-[#B8860B]">{t("section2.title_italic")}</span>
              </h2>

              <div className="mt-6 space-y-4">
                <p className="text-sm leading-relaxed text-[#57534E] lg:text-base">
                  {t("section2.p1")}
                </p>
                <p className="text-sm leading-relaxed text-[#57534E] lg:text-base">
                  {t("section2.p2")}
                </p>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#B8860B]/10 px-4 py-2 text-xs font-medium text-[#8B6914]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
                {t("section2.badge")}
              </div>
            </div>
          </div>

          {/* Closing statement - Full width card */}
          <div className="mt-24 rounded-[2rem] bg-[#1C1917] p-8 lg:p-12 xl:p-16">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  {t("philosophy.subtitle")}
                </div>

                <h2 className="mt-4 font-serif text-3xl font-light leading-[1.1] tracking-tight text-[#FAFAF9] lg:text-4xl xl:text-5xl">
                  {t("philosophy.title_part1")} <br />
                  <span className="italic text-[#B8860B]">{t("philosophy.title_italic")}</span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#A8A29E] lg:text-base">
                  {t("philosophy.description")}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#44403C] px-4 py-2 text-xs text-[#D6D3D1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3D5A3D]" />
                    {t("philosophy.tags.tradition")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#44403C] px-4 py-2 text-xs text-[#D6D3D1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
                    {t("philosophy.tags.innovation")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#44403C] px-4 py-2 text-xs text-[#D6D3D1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8B7355]" />
                    {t("philosophy.tags.quality")}
                  </span>
                </div>
              </div>

              <div className="lg:pl-8">
                <ImageBox
                  src={STORIA_IMAGES.territorio}
                  alt="Territorio"
                  variant="dark"
                  aspect="landscape"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}


/**
 * Box immagine unico (light/dark) che sostituisce i placeholder.
 * - variant: "light" usa bordo chiaro + gradient overlay leggero
 * - variant: "dark" usa bordo scuro
 * - aspect: "portrait" ~ 4/5, "landscape" ~ 4/3
 */
function ImageBox({
  src,
  alt,
  variant,
  aspect,
}: {
  src: string;
  alt: string;
  variant: "light" | "dark";
  aspect: "portrait" | "landscape";
}) {
  const aspectClass = aspect === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]";

  if (variant === "dark") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-[#44403C] bg-[#292524]">
        <div className={`relative w-full ${aspectClass}`}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E7E5E4] bg-[#F5F5F4]">
      <div className={`relative w-full ${aspectClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/10 to-transparent" />
      </div>
    </div>
  );
}