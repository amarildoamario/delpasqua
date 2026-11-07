import { setRequestLocale } from 'next-intl/server';
import Footer from "@/components/Footer";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import CompanyStats from "@/components/CompanyStats";
import { BadgeCheck, Lightbulb, Sprout } from "lucide-react";

const STORIA_IMAGES = {
  iniziale: "/storia/sezione_iniziale.webp",
  oliveti: "/storia/storia-1.webp",
  raccolta: "/storia/storia-3.webp",
  territorio: "/storia/storia-4.webp",
} as const;

const PHILOSOPHY_VALUES = [
  { key: "tradition", Icon: Sprout, color: "text-[#3D5A3D]" },
  { key: "innovation", Icon: Lightbulb, color: "text-[#B8860B]" },
  { key: "quality", Icon: BadgeCheck, color: "text-[#3D5A3D]" },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return pageMetadata({
    title: locale === "en" ? "Our Story" : "Storia",
    description:
      locale === "en"
        ? "Family history, olive groves and Tuscan agricultural tradition of Frantoio Del Pasqua."
        : "Storia familiare, oliveti e tradizione agricola toscana del Frantoio Del Pasqua.",
    path: "/storia/",
    locale,
    hreflang: true,
  });
}

async function StoriaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "StoriaPage" });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": absoluteUrl(localizedPath("/", locale))
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === "en" ? "Our Story" : "Storia",
        "item": absoluteUrl(localizedPath("/storia", locale))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Background Photo Section (Parallax / Copertura Ferma) */}
      <section className="relative h-[65vh] lg:h-[80vh] overflow-hidden bg-[#1C1917]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat md:bg-fixed"
          style={{ backgroundImage: `url('${STORIA_IMAGES.iniziale}')` }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* Main Content Sections */}
      <section className="bg-[#FDFCF8] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb sottile */}
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
            <Link href="/" className="hover:text-[#3D5A3D] transition-colors">Home</Link>
            <span className="text-[#D6D3D1]">/</span>
            <span className="text-[#57534E]">{locale === "en" ? "Our Story" : "Storia"}</span>
          </nav>

          {/* Header (Messo Sotto, Fuori dalla Foto) */}
          <div className="relative mb-14 max-w-5xl lg:mb-16">
            <div aria-hidden="true" className="absolute -left-16 -top-10 -z-10 h-52 w-52 rounded-full bg-[#B8860B]/[0.045] blur-3xl" />
            <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              {t("header.subtitle")}
            </div>

            <h1 className="mt-6 font-serif text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.15] tracking-tight text-[#1C1917] max-w-4xl">
              {t("header.title_part1")}<span className="italic text-[#3D5A3D]">{t("header.title_italic")}</span>
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-relaxed text-[#57534E] sm:text-base lg:text-lg">
              {t("header.description_top")} {t("header.description_bottom")}
            </p>
          </div>

          {/* Section 1 - Oliveti */}
          <div className="relative isolate grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="order-2 lg:order-1">
              <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                {t("section1.subtitle")}
              </div>

              <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                {t("section1.title_part1")}<span className="italic text-[#3D5A3D]">{t("section1.title_italic")}</span>
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-[#57534E] first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-4xl first-letter:leading-[0.85] first-letter:text-[#3D5A3D] lg:text-base">
                {t("section1.p1")} {t("section1.p2")}
              </p>

              <CompanyStats
                hectaresLabel={t("section1.stats.hectares")}
                cultivarsLabel={t("section1.stats.cultivars")}
                yearsLabel={t("section1.stats.years")}
              />
            </div>

            <div className="relative order-1 lg:order-2">
              <ImageBox
                src={STORIA_IMAGES.oliveti}
                alt="Oliveti"
                variant="light"
                aspect="portrait"
              />
              <span aria-hidden="true" className="absolute -bottom-6 right-0 text-[9px] font-semibold tracking-[0.24em] text-[#8B7355] uppercase">{t("section1.subtitle")}</span>
            </div>
          </div>

          {/* Section 2 - Raccolta */}
          <div className="relative isolate mt-16 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="relative">
              <ImageBox
                src={STORIA_IMAGES.raccolta}
                alt="Raccolta"
                variant="light"
                aspect="portrait"
              />
              <span aria-hidden="true" className="absolute -top-6 left-0 text-[9px] font-semibold tracking-[0.24em] text-[#8B7355] uppercase">{t("section2.subtitle")}</span>
            </div>

            <div className="lg:pl-8">
              <div className="text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                {t("section2.subtitle")}
              </div>

              <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                {t("section2.title_part1")}<span className="italic text-[#B8860B]">{t("section2.title_italic")}</span>
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-[#57534E] first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-4xl first-letter:leading-[0.85] first-letter:text-[#B8860B] lg:text-base">
                {t("section2.p1")} {t("section2.p2")}
              </p>

              <div className="mt-7 flex max-w-sm items-center gap-3 border-l-2 border-[#B8860B] py-2 pl-4 text-xs font-medium tracking-[0.04em] text-[#8B6914]">
                {t("section2.badge")}
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div className="relative isolate mt-14 border-t border-[#3D5A3D]/15 py-12 lg:mt-16 lg:py-16">
            <div aria-hidden="true" className="absolute -bottom-8 -left-[12%] -z-10 h-64 w-64 rounded-full bg-[#3D5A3D]/[0.035] blur-3xl" />
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div className="lg:py-6">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-[#8B6914] uppercase">
                  {t("philosophy.subtitle")}
                </div>

                <h2 className="mt-7 max-w-xl font-serif text-4xl font-light leading-[1.08] tracking-tight text-[#2E2A27] lg:text-5xl xl:text-6xl">
                  {t("philosophy.title_part1")}{" "}
                  <span className="italic text-[#3D5A3D]">{t("philosophy.title_italic")}</span>
                </h2>

                <p className="mt-7 max-w-lg text-sm leading-relaxed text-[#625C56] lg:text-base">
                  {t("philosophy.description")}
                </p>

                <div className="mt-10 border-y border-[#3D5A3D]/20">
                  {PHILOSOPHY_VALUES.map(({ key, Icon, color }, index) => (
                    <div
                      key={key}
                      className={`group flex items-center justify-between py-4 lg:py-5 ${index > 0 ? "border-t border-[#3D5A3D]/20" : ""}`}
                    >
                      <span className="font-serif text-2xl text-[#35312D] transition-colors group-hover:text-[#3D5A3D] lg:text-3xl">
                        {t(`philosophy.tags.${key}`)}
                      </span>
                      <Icon aria-hidden="true" strokeWidth={1.35} className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 lg:h-6 lg:w-6 ${color}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden shadow-[0_24px_60px_-32px_rgba(45,55,38,0.45)] lg:aspect-[5/4]">
                  <Image
                    src={STORIA_IMAGES.territorio}
                    alt="Territorio"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute inset-0 bg-[#3D5A3D]/[0.06]" />
                </div>
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
  aspect: "portrait" | "landscape" | "wide";
}) {
  const aspectClass =
    aspect === "portrait"
      ? "aspect-[4/5]"
      : aspect === "landscape"
      ? "aspect-[4/3]"
      : "aspect-[16/9] md:aspect-[21/9]";

  if (variant === "dark") {
    return (
      <div className="relative overflow-hidden rounded-[5px] border border-[#44403C] bg-[#292524]">
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
    <div className="relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#F5F5F4] shadow-[0_24px_55px_-34px_rgba(41,37,36,0.5)]">
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function StoriaPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <StoriaPage {...props} />;
}
