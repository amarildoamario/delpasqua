"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Leaf, ShieldCheck, ShoppingBag, Droplet, Award, Sprout, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";

export type LandingPageContent = {
  kicker: string;
  title: string;
  subtitle: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  features: {
    icon: "leaf" | "shield" | "droplet" | "sprout" | "award" | "bag";
    title: string;
    description: string;
  }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  seoTitleText: string;
  seoBodyText: string;

  // Rich content additions for layout variation
  stats?: {
    value: string;
    label: string;
    description?: string;
  }[];
  timeline?: {
    step: string;
    title: string;
    description: string;
  }[];
  comparisonTable?: {
    title: string;
    headers: string[];
    rows: {
      name: string;
      values: string[];
      highlight?: boolean;
    }[];
  };
  pairings?: {
    name: string;
    description: string;
  }[];
};

type Props = {
  locale: string;
  content: LandingPageContent;
  products: {
    id: string;
    title: string;
    priceLabel: string;
    imageSrc: string;
    slug: string;
  }[];
  layoutVariant?: "standard" | "reversed";
  children?: React.ReactNode;
};

export default function SeoLandingPage({ locale, content, products, layoutVariant = "standard", children }: Props) {
  const renderedIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        return <Leaf className="h-5 w-5 text-emerald-600" />;
      case "shield":
        return <ShieldCheck className="h-5 w-5 text-emerald-600" />;
      case "droplet":
        return <Droplet className="h-5 w-5 text-emerald-600" />;
      case "sprout":
        return <Sprout className="h-5 w-5 text-emerald-600" />;
      case "award":
        return <Award className="h-5 w-5 text-emerald-600" />;
      case "bag":
        return <ShoppingBag className="h-5 w-5 text-emerald-600" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    }
  };

  const backToShopText = useMemo(() => {
    const dict: Record<string, string> = {
      it: "Torna allo Shop",
      en: "Back to Shop",
      de: "Zurück zum Shop",
      nl: "Terug naar Winkel",
      da: "Tilbage til Butik",
      no: "Tilbake til Butikk"
    };
    return dict[locale] || dict.it;
  }, [locale]);

  return (
    <div className="relative min-h-screen bg-[#fbf8f5] text-stone-900 font-sans antialiased overflow-x-hidden">
      {/* 1. FIXED HERO SECTION (Parallax Effect) */}
      <section className="sticky top-0 h-[48vh] min-h-[350px] w-full z-0 bg-[#0f110f] text-white flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 select-none pointer-events-none">
          <Image
            src={content.heroImage}
            alt={content.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f110f]/40 via-[#0f110f]/75 to-[#0f110f]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="text-[10px] font-bold tracking-[0.25em] text-emerald-500 uppercase mb-4 animate-fade-in">
            {content.kicker}
          </div>
          <h1 className="font-serif text-3xl font-light tracking-wide md:text-4xl lg:text-5xl text-stone-100 leading-tight">
            {content.title}
          </h1>
          <p className="mt-4 max-w-xl text-stone-300 text-xs md:text-sm font-light leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* 2. SCROLLABLE MAIN CONTENT AREA */}
      <main className="relative z-10 bg-[#fdfaf7] border-t border-[#ede8e0] shadow-[0_-12px_40px_rgba(0,0,0,0.08)] rounded-t-[20px] pb-1">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-8 md:py-20">
          
          {/* Section 2.1: Intro & Context */}
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start mb-20">
            <div className={`lg:col-span-7 ${layoutVariant === "reversed" ? "lg:order-2" : ""}`}>
              <h2 className="font-serif text-2xl md:text-3xl font-light tracking-tight text-[#1f1a17]">
                {content.introTitle}
              </h2>
              <div className="w-12 h-px bg-emerald-600 my-6" />
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
                {content.introText}
              </p>
            </div>

            {/* Sidebar quick checks */}
            <div className={`lg:col-span-5 bg-white border border-[#e8dfd5] p-6 md:p-8 rounded-[5px] shadow-[0_4px_20px_rgba(31,26,23,0.02)] ${layoutVariant === "reversed" ? "lg:order-1" : ""}`}>
              <h3 className="text-xs font-bold tracking-[0.15em] text-[#8b7355] uppercase mb-6">
                {content.kicker}
              </h3>
              <ul className="space-y-6">
                {content.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                      {renderedIcon(feature.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">{feature.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2.2: Stats Grid (Optional) */}
          {content.stats && content.stats.length > 0 && (
            <div className="border-t border-[#e8dfd5] pt-16 mb-20">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {content.stats.map((stat, idx) => (
                  <div key={idx} className="bg-white border border-[#e8dfd5] p-6 rounded-[5px] text-center shadow-[0_4px_20px_rgba(31,26,23,0.01)] hover:border-[#8b7355]/20 transition-all duration-300">
                    <div className="text-3xl font-serif font-light text-emerald-700 tracking-tight mb-2">{stat.value}</div>
                    <h4 className="text-[10px] font-bold text-stone-900 uppercase tracking-wider mb-2">{stat.label}</h4>
                    {stat.description && <p className="text-[11px] text-stone-500 leading-relaxed font-medium">{stat.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2.3: Timeline Process (Optional) */}
          {content.timeline && content.timeline.length > 0 && (
            <div className="border-t border-[#e8dfd5] pt-16 mb-20">
              <div className="max-w-2xl mx-auto">
                <h3 className="font-serif text-xl md:text-2xl font-light text-center text-[#1f1a17] mb-12">
                  {locale === "it" ? "Fasi di Produzione & Lavorazione" : "Production & Processing Steps"}
                </h3>
                <div className="relative border-l border-emerald-600/20 ml-4 md:ml-6 space-y-12">
                  {content.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-8 md:pl-10">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{item.step}</span>
                        <h4 className="font-serif text-sm font-bold text-[#1f1a17] mt-1 uppercase tracking-wider">{item.title}</h4>
                        <p className="text-stone-500 text-xs mt-2 leading-relaxed font-medium">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 2.4: Comparison Table (Optional) */}
          {content.comparisonTable && (
            <div className="border-t border-[#e8dfd5] pt-16 mb-20">
              <div className="max-w-4xl mx-auto">
                <h3 className="font-serif text-xl md:text-2xl font-light text-center text-[#1f1a17] mb-8">
                  {content.comparisonTable.title}
                </h3>
                <div className="overflow-x-auto border border-[#e8dfd5] rounded-[5px] bg-white shadow-[0_4px_20px_rgba(31,26,23,0.01)]">
                  <table className="w-full text-left border-collapse min-w-[550px]">
                    <thead>
                      <tr className="bg-stone-50 border-b border-[#e8dfd5]">
                        {content.comparisonTable.headers.map((header, idx) => (
                          <th key={idx} className="p-4 text-[10px] font-bold text-stone-700 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {content.comparisonTable.rows.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className={`border-b border-[#e8dfd5]/60 last:border-b-0 transition-colors hover:bg-stone-50/50 ${
                            row.highlight ? "bg-emerald-50/20" : ""
                          }`}
                        >
                          <td className="p-4 text-xs font-bold text-stone-900">{row.name}</td>
                          {row.values.map((val, valIdx) => (
                            <td key={valIdx} className="p-4 text-xs text-stone-600 font-medium">
                              {val === "✓" ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
                              ) : val === "✗" ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">✗</span>
                              ) : (
                                val
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Section 2.5: Recommended Culinary Pairings (Optional) */}
          {content.pairings && content.pairings.length > 0 && (
            <div className="border-t border-[#e8dfd5] pt-16 mb-20">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-600 uppercase">
                  {locale === "it" ? "In Cucina" : "In the Kitchen"}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-light tracking-tight text-[#1f1a17] mt-2">
                  {locale === "it" ? "Abbinamenti Consigliati" : "Recommended Pairings"}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {content.pairings.map((pair, idx) => (
                  <div key={idx} className="bg-white border border-[#e8dfd5] p-6 rounded-[5px] text-center shadow-[0_4px_20px_rgba(31,26,23,0.01)] hover:border-[#8b7355]/20 transition-all duration-300">
                    <div className="text-emerald-700 font-serif text-base font-semibold mb-2">{pair.name}</div>
                    <p className="text-stone-500 text-[11px] leading-relaxed font-medium">{pair.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2.6: Custom Children (Optional) */}
          {children && (
            <div className="border-t border-[#e8dfd5] pt-16 mb-20">
              {children}
            </div>
          )}

          {/* Section 2.7: Featured Target Products (Purchase Intent) */}
          {products.length > 0 && (
            <div className="border-t border-[#e8dfd5] pt-16 mb-20">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-600 uppercase">
                  {locale === "it" ? "Catalogo Selezionato" : "Selected Catalog"}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-light tracking-tight text-[#1f1a17] mt-2">
                  {locale === "it" ? "I nostri formati consigliati" : "Our recommended sizes"}
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {products.map((product) => (
                  <div key={product.id} className="relative group flex flex-col bg-white border border-[#e8dfd5] rounded-[5px] overflow-hidden hover:border-[#8b7355]/40 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(139,115,85,0.06)] transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-stone-50 w-full overflow-hidden">
                      <Image
                        src={product.imageSrc}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#1f1a17] group-hover:text-[#8b7355] transition-colors leading-snug">
                          {product.title}
                        </h4>
                        <div className="mt-2 text-xs font-bold text-[#1f1a17]">
                          {product.priceLabel} <span className="text-[9px] text-[#8a7c6e] font-normal font-sans">IVA incl.</span>
                        </div>
                      </div>
                      <Link
                        href={{ pathname: `/shop/${product.slug}` }}
                        className="mt-6 w-full py-2 bg-[#132c1c] hover:bg-[#1a3d27] text-white rounded-[5px] flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        <span>{locale === "it" ? "Acquista ora" : "Buy now"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2.8: SEO Long-form / Educational Content */}
          <div className="border-t border-[#e8dfd5] pt-16 mb-12">
            <div className="bg-[#fbf9f5] border border-[#e8dfd5]/60 p-6 md:p-10 rounded-[5px] max-w-4xl mx-auto">
              <h3 className="font-serif text-lg md:text-xl font-normal text-stone-900 leading-snug">
                {content.seoTitleText}
              </h3>
              <div className="w-8 h-px bg-stone-300 my-4" />
              <p className="text-stone-500 text-[11px] md:text-xs leading-relaxed font-medium">
                {content.seoBodyText}
              </p>
            </div>
          </div>

          {/* Section 2.8: Return to Shop CTA */}
          <div className="flex flex-col items-center justify-center pt-8 border-t border-[#e8dfd5]">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-[#d7cbbb] bg-white px-6 py-3 text-xs font-bold text-[#1f1a17] uppercase tracking-wider hover:border-[#8b7355] hover:text-[#8b7355] transition-all shadow-sm"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>{backToShopText}</span>
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

