import { setRequestLocale } from 'next-intl/server';
import Footer from "@/components/Footer";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";

const STORIA_IMAGES = {
  iniziale: "/storia/sezione_iniziale.webp",
  oliveti: "/storia/storia-1.webp",
  raccolta: "/storia/storia-3.webp",
  territorio: "/storia/storia-4.webp",
} as const;

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
          <div className="max-w-5xl mb-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              <span className="h-px w-6 bg-[#8B7355]" />
              {t("header.subtitle")}
            </div>

            <h1 className="mt-6 font-serif text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.15] tracking-tight text-[#1C1917] max-w-4xl">
              {t("header.title_part1")}<span className="italic text-[#3D5A3D]">{t("header.title_italic")}</span>
            </h1>

            <div className="mt-6 max-w-4xl space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-[#57534E]">
              <p>{t("header.description_top")}</p>
              <p>{t("header.description_bottom")}</p>
            </div>
          </div>

          {/* Section 1 - Oliveti */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
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
          <div className="group/card relative mt-24 overflow-hidden rounded-[5px] border border-[#2E2A27] bg-gradient-to-br from-[#262220] via-[#1C1917] to-[#12100F] p-8 lg:p-12 xl:p-16 shadow-xl transition-all duration-500 hover:border-[#8B7355]/40">
            {/* Subtle background glow */}
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#8B7355]/5 blur-[120px] pointer-events-none transition-all duration-700 group-hover/card:bg-[#8B7355]/10" />
            <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-[#3D5A3D]/5 blur-[120px] pointer-events-none transition-all duration-700 group-hover/card:bg-[#3D5A3D]/10" />

            <div className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.25em] text-[#8B7355] uppercase">
                  <span className="h-px w-8 bg-[#8B7355]/50" />
                  {t("philosophy.subtitle")}
                </div>

                <h2 className="mt-6 font-serif text-3xl font-light leading-[1.15] tracking-tight text-[#FAFAF9] lg:text-4xl xl:text-5xl">
                  {t("philosophy.title_part1")} <br />
                  <span className="italic text-[#B8860B]">{t("philosophy.title_italic")}</span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#D6D3D1] lg:text-base">
                  {t("philosophy.description")}
                </p>

                <div className="mt-8 flex flex-wrap gap-2.5">
                  <span className="inline-flex rounded-full border border-[#8B7355]/25 bg-[#FAFAF9]/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7E5E4] transition-all duration-300 hover:border-[#B8860B]/45 hover:bg-[#B8860B]/10 hover:text-white">
                    {t("philosophy.tags.tradition")}
                  </span>
                  <span className="inline-flex rounded-full border border-[#8B7355]/25 bg-[#FAFAF9]/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7E5E4] transition-all duration-300 hover:border-[#B8860B]/45 hover:bg-[#B8860B]/10 hover:text-white">
                    {t("philosophy.tags.innovation")}
                  </span>
                  <span className="inline-flex rounded-full border border-[#8B7355]/25 bg-[#FAFAF9]/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7E5E4] transition-all duration-300 hover:border-[#B8860B]/45 hover:bg-[#B8860B]/10 hover:text-white">
                    {t("philosophy.tags.quality")}
                  </span>
                </div>
              </div>

              <div className="lg:pl-8">
                <div className="group/img relative overflow-hidden rounded-[5px] border border-[#44403C] bg-[#292524] shadow-lg">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={STORIA_IMAGES.territorio}
                      alt="Territorio"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity duration-500 group-hover/img:opacity-85" />
                  </div>
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
    <div className="relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#F5F5F4]">
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
