import { getTastingTypes } from "@/lib/tasting/slots";
import TastingsCalendar from "./TastingCalendar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { companyInfo } from "@/lib/companyInfo";
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import { Link } from "@/i18n/routing";
import TastingsSeoSection from "./TastingsSeoSection";

const TASTING_IMAGE_PATH = "/blog/degustazione-olio.avif";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TastingsPage.metadata" });

  return pageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/degustazioni/",
    locale,
    hreflang: true,
  });
}

export default async function DegustazioniPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TastingsPage" });

  const labelMap: Record<string, string> = {
    it: "Degustazioni",
    en: "Tastings",
    de: "Verkostungen",
    nl: "Proeverijen",
    da: "Smagninger",
    no: "Smakinger",
  };
  const pageLabel = labelMap[locale] ?? "Degustazioni";

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
        "name": pageLabel,
        "item": absoluteUrl(localizedPath("/degustazioni", locale))
      }
    ]
  };

  const rawTypes = getTastingTypes();
  const types = rawTypes.map((type) => ({
    ...type,
    title: t(`hero.types.${type.id}.title`),
    subtitle: t(`hero.types.${type.id}.subtitle`),
    includes: (t.raw(`hero.types.${type.id}.includes`) as string[]) || [],
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="bg-[#FDFCF8] min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F4] to-[#FDFCF8]" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3D5A3D]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8860B]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
            {/* Breadcrumb sottile */}
            <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
              <Link href="/" className="hover:text-[#3D5A3D] transition-colors">Home</Link>
              <span className="text-[#D6D3D1]">/</span>
              <span className="text-[#57534E]">{pageLabel}</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                <span className="h-px w-6 bg-[#8B7355]" />
                {t("hero.subtitle")}
              </div>

              <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
                {t("hero.title_part1")} <span className="italic text-[#3D5A3D]">{t("hero.title_italic")}</span> {t("hero.title_part2")}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#292524] lg:text-lg">
                {t("hero.description")}
              </p>
            </div>

            {/* Tasting Types Cards */}
            <div className="mt-16 grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-7xl mx-auto">
              {[...types]
                .sort((a, b) => {
                  const order: Record<string, number> = { classica: 1, intermedia: 2, premium: 3 };
                  return (order[a.id] || 99) - (order[b.id] || 99);
                })
                .map((tastingType) => {
                  const isPremium = tastingType.id === "premium";
                  const isIntermedia = tastingType.id === "intermedia";
                  const accentColor = isPremium ? "#B8860B" : isIntermedia ? "#8B7355" : "#3D5A3D";
                  const accentBgLight = isPremium 
                    ? "bg-gradient-to-br from-white to-[#B8860B]/[0.02]" 
                    : isIntermedia 
                      ? "bg-gradient-to-br from-white to-[#8B7355]/[0.02]" 
                      : "bg-gradient-to-br from-white to-[#3D5A3D]/[0.02]";
                  const borderHoverClass = isPremium 
                    ? "hover:border-[#B8860B]/40 hover:shadow-[0_10px_30px_rgba(184,134,11,0.06)]" 
                    : isIntermedia 
                      ? "hover:border-[#8B7355]/40 hover:shadow-[0_10px_30px_rgba(139,115,85,0.06)]" 
                      : "hover:border-[#3D5A3D]/40 hover:shadow-[0_10px_30px_rgba(61,90,61,0.06)]";

                  return (
                    <div
                      key={tastingType.id}
                      className={`group relative overflow-hidden rounded-[5px] border border-[#E7E5E4] p-6 lg:p-8 transition-all duration-500 hover:-translate-y-1.5 ${accentBgLight} ${borderHoverClass}`}
                    >
                      <div
                        className="absolute left-0 top-0 h-1.5 w-0 transition-all duration-500 group-hover:w-full"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col">
                          {isPremium ? (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8860B]/10 text-[#B8860B] mb-5">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 20h18" />
                                <path d="M6 20l6-10 4 6 2-3 3 7" />
                                <circle cx="12" cy="6" r="2" />
                              </svg>
                            </div>
                          ) : isIntermedia ? (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B7355]/10 text-[#8B7355] mb-5">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15.2 3a2 2 0 0 1 1.8 2v5.3a6.7 6.7 0 0 1-5 6.5V21h3a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h3v-4.2a6.7 6.7 0 0 1-5-6.5V5a2 2 0 0 1 1.8-2h6.4Z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3D5A3D]/10 text-[#3D5A3D] mb-5">
                              <IconLeaf className="h-6 w-6" />
                            </div>
                          )}
                          <h3 className="font-serif text-2xl font-light tracking-tight text-[#1C1917]">{tastingType.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#292524] min-h-[40px]">{tastingType.subtitle}</p>
                        </div>
                        <div
                          className="shrink-0 rounded-2xl px-3.5 py-2 text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                          style={{ backgroundColor: accentColor }}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{tastingType.durationMinutes} {t("hero.duration")}</span>
                        </div>
                      </div>

                      <ul className="mt-8 space-y-3.5">
                        {tastingType.includes.map((x: string) => (
                          <li key={x} className="flex gap-3 text-sm leading-relaxed text-[#292524]">
                            <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: accentColor }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>

                      {tastingType.priceFrom ? (
                        <div className="mt-8 pt-5 border-t border-[#E7E5E4]">
                          <span className="text-[10px] font-semibold tracking-[0.15em] text-[#8B7355] uppercase block">{t("hero.from")}</span>
                          <div className="mt-1.5 font-serif text-xl font-light text-[#1C1917]" style={{ color: accentColor }}>{tastingType.priceFrom}</div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
            </div>

            {/* Child policy disclaimer */}
            <div className="mt-12 text-center">
              <span className="inline-block px-5 py-2.5 rounded-2xl border border-[#E7E5E4] bg-white text-xs font-semibold text-[#8B7355] tracking-wide shadow-sm">
                🌿 {t("hero.child_policy")}
              </span>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
          <div className="rounded-[5px] border border-[#E7E5E4] bg-white p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  <span className="h-px w-6 bg-[#8B7355]" />
                  {t("calendar.subtitle")}
                </div>
                <h2 className="mt-3 font-serif text-2xl font-light tracking-tight text-[#1C1917] lg:text-3xl">
                  {t("calendar.title_part1")} <span className="italic text-[#3D5A3D]">{t("calendar.title_italic")}</span>
                </h2>
                <p className="mt-2 text-sm text-[#292524]">
                  {t("calendar.description")}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#3D5A3D]/10 px-4 py-2 text-xs font-medium text-[#3D5A3D]">
                <IconLeaf className="h-3.5 w-3.5 shrink-0" />
                {t("calendar.badge")}
              </div>
            </div>

            <div className="mt-8">
              <TastingsCalendar
                tastingTypes={types}
              />
            </div>
          </div>
        </section>

        <TastingsSeoSection
          seoSubtitle={t("seo.subtitle")}
          seoTitlePart1={t("seo.title_part1")}
          seoTitleItalic={t("seo.title_italic")}
          seoTitlePart2={t("seo.title_part2")}
          seoDescription={t("seo.description")}
          imageSrc={TASTING_IMAGE_PATH}
          imageAlt={t("image_alt")}
          imageBadge={t("image_badge")}
          features={[
            { id: "map", title: t("features.f1_title"), desc: t("features.f1_desc") },
            { id: "drop", title: t("features.f2_title"), desc: t("features.f2_desc") },
            { id: "star", title: t("features.f3_title"), desc: t("features.f3_desc") },
          ]}
          faqs={[
            { question: t("faq.q1"), answer: t("faq.a1") },
            { question: t("faq.q2"), answer: t("faq.a2") },
            { question: t("faq.q3"), answer: t("faq.a3") },
            { question: t("faq.q4"), answer: t("faq.a4") },
          ]}
        />

        {/* SEO Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: t("faq.q1"),
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: t("faq.a1")
                  }
                },
                {
                  "@type": "Question",
                  name: t("faq.q2"),
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: t("faq.a2")
                  }
                },
                {
                  "@type": "Question",
                  name: t("faq.q3"),
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: t("faq.a3")
                  }
                },
                {
                  "@type": "Question",
                  name: t("faq.q4"),
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: t("faq.a4")
                  }
                }
              ]
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodEstablishment",
              "name": "Az. Agr. Del Pasqua - Degustazione Olio EVO",
              "image": absoluteUrl(TASTING_IMAGE_PATH),
              "@id": "https://www.delpasqua.com/degustazioni",
              "url": "https://www.delpasqua.com/degustazioni",
              "telephone": "+390575810065",
              "priceRange": "€€",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": companyInfo.postalAddress.streetAddress,
                "addressLocality": companyInfo.postalAddress.addressLocality,
                "addressRegion": companyInfo.postalAddress.addressRegion,
                "postalCode": companyInfo.postalAddress.postalCode,
                "addressCountry": companyInfo.postalAddress.addressCountry
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": companyInfo.geo.latitude,
                "longitude": companyInfo.geo.longitude
              },
              "description": t("seo.description"),
              "offers": {
                "@type": "Offer",
                "url": "https://www.delpasqua.com/degustazioni",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString()
              }
            })
          }}
        />
      </main>
      <Footer />
    </>
  );
}

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 21c-4.5 0-8-3.6-8-8 0-6 7-10 18-11-1 11-5 19-10 19Z" />
      <path d="M7 13c2 0 5 0 9-4" />
    </svg>
  );
}
