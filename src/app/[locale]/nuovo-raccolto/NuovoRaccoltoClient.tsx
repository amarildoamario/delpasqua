"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "motion/react";
import { ArrowRight, Leaf, ShieldCheck, ShoppingBag, Award, Wine } from "lucide-react";
import Footer from "@/components/Footer";

export type LandingPageContent = {
  kicker: string;
  title: string;
  subtitle: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  features: {
    icon: "leaf" | "shield" | "award" | "bag";
    title: string;
    description: string;
  }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  seoTitleText: string;
  seoBodyText: string;
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
};

// Double Background Card
function DoubleBgCard({ 
  children, 
  className = "", 
  offsetColor = "bg-[#3D5A3D]/10 border-[#3D5A3D]/20", 
  borderColor = "border-[#2D3E30]",
  paddingClass = "p-6",
  pattern = "none"
}: { 
  children: React.ReactNode; 
  className?: string; 
  offsetColor?: string; 
  borderColor?: string; 
  paddingClass?: string;
  pattern?: "none" | "dots" | "grid" | "lines";
}) {
  const getPatternStyle = () => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: "radial-gradient(rgba(213, 178, 127, 0.22) 1px, transparent 1px)",
          backgroundSize: "6px 6px"
        };
      case "grid":
        const isEmerald = offsetColor.includes("3D5A3D");
        const strokeColor = isEmerald ? "rgba(78, 128, 82, 0.16)" : "rgba(213, 178, 127, 0.16)";
        return {
          backgroundImage: `
            linear-gradient(${strokeColor} 1px, transparent 1px),
            linear-gradient(90deg, ${strokeColor} 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px"
        };
      case "lines":
        return {
          backgroundImage: "repeating-linear-gradient(45deg, rgba(213, 178, 127, 0.12), rgba(213, 178, 127, 0.12) 1px, transparent 1px, transparent 6px)",
        };
      default:
        return {};
    }
  };

  return (
    <div className={`relative group isolate ${className}`}>
      <div 
        className={`absolute inset-0 border ${offsetColor} rounded-[5px] translate-x-2 translate-y-2 z-0 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:shadow-[0_0_20px_rgba(76,110,79,0.15)]`}
        style={getPatternStyle()}
      />
      <div className={`relative bg-[#131914] border ${borderColor} ${paddingClass} rounded-[5px] shadow-md transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-[#D5B27F]/30 h-full flex flex-col justify-between z-10`}>
        {children}
      </div>
    </div>
  );
}

// Timeline Photos Map based on step index
const timelineImages = [
  "/frantoio/brucatura.jpg",      // Step 1: Early Harvest
  "/frantoio/tracciabilita.jpg",  // Step 2: Transport & Traceability
  "/frantoio/frangitura.jpg",     // Step 3: Cold Extraction/Milling
  "/frantoio/imbottigliamento.jpg"// Step 4: Immediate Bottling
];

export default function NuovoRaccoltoClient({ locale, content, products }: Props) {
  const renderedIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        return <Leaf className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "shield":
        return <ShieldCheck className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "award":
        return <Award className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <Award className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E0B] text-[#F5F5F4] font-sans antialiased overflow-x-hidden">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-[12%] right-[-5%] w-[480px] h-[480px] rounded-full bg-[#3D5A3D]/8 blur-[130px] pointer-events-none select-none" />
      <div className="absolute top-[40%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#8B7355]/4 blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[420px] h-[420px] rounded-full bg-[#3D5A3D]/6 blur-[110px] pointer-events-none select-none" />

      {/* 1. HERO SECTION */}
      <section className="relative h-[55vh] lg:h-[70vh] overflow-hidden bg-[#0A0E0B] flex items-center justify-center border-b border-[#2D3E30]/20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed opacity-45 select-none pointer-events-none"
          style={{ backgroundImage: `url('${content.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E0B]/30 via-[#0A0E0B]/60 to-[#0A0E0B]" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-[#D5B27F] uppercase mb-6"
          >
            <span className="h-px w-6 bg-[#D5B27F]/70" />
            {content.kicker}
            <span className="h-px w-6 bg-[#D5B27F]/70" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] tracking-tight text-stone-100"
          >
            {locale === "it" ? (
              <>
                Olio Nuovo <br className="hidden sm:inline" />
                <span className="italic text-[#10B981] drop-shadow-[0_2px_10px_rgba(16,185,129,0.15)]">Raccolto 2026</span>
              </>
            ) : locale === "en" ? (
              <>
                New Harvest <br className="hidden sm:inline" />
                <span className="italic text-[#10B981] drop-shadow-[0_2px_10px_rgba(16,185,129,0.15)]">Olive Oil</span>
              </>
            ) : (
              content.title
            )}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-3xl mx-auto text-[#D6D3D1] text-sm sm:text-base lg:text-lg font-light leading-relaxed opacity-95"
          >
            {content.subtitle}
          </motion.p>
        </div>
      </section>

      {/* 2. BREADCRUMBS */}
      <div className="bg-[#0A0E0B] pt-12 pb-6 border-b border-[#2D3E30]/20">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#D5B27F] uppercase">
            <Link href="/" className="hover:text-[#10B981] transition-colors font-semibold text-[#D5B27F]/80">Home</Link>
            <span className="text-[#3E4A3E]">/</span>
            <span className="text-[#A8A29E]">{content.title}</span>
          </nav>
        </div>
      </div>

      {/* 3. INTRO SECTION */}
      <section className="bg-[#0A0E0B] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column: Visual details card */}
            <div className="lg:col-span-5 relative group isolate">
              <DoubleBgCard 
                offsetColor="bg-[#3D5A3D]/15 border-[#3D5A3D]/25" 
                borderColor="border-[#2D3E30]/80"
                paddingClass="p-0"
                pattern="dots"
                className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-[5px] overflow-hidden"
              >
                <div className="relative w-full h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[450px] overflow-hidden rounded-[5px]">
                  <Image
                    src="/frantoio/estrazione.jpg"
                    alt="Estrazione olio extravergine nuovo"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0E0B] via-transparent to-transparent p-6 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D5B27F] bg-[#131914] border border-[#2D3E30] px-3 py-1.5 rounded-[3px]">
                      Non Filtrato • Freschissimo
                    </span>
                  </div>
                </div>
              </DoubleBgCard>
            </div>

            {/* Right Column: Narrative Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "FRESCHEZZA STAGIONALE" : "SEASONAL EMERALD"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight leading-[1.2]">
                {content.introTitle}
              </h2>
              <div className="w-12 h-px bg-[#10B981]" />
              
              <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#D6D3D1] space-y-6 font-light">
                {content.introText.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. KEY BENEFITS CARDS GRID */}
      <section className="bg-[#0A0E0B] pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {content.features.map((feature, idx) => (
                <DoubleBgCard 
                  key={idx}
                  offsetColor="bg-[#3D5A3D]/10 border-[#3D5A3D]/25" 
                  borderColor="border-[#2D3E30]/75"
                  pattern="dots"
                >
                  <div className="flex gap-5 items-start p-1 h-full flex-col justify-between">
                    <div className="flex-shrink-0 p-3 rounded-full bg-[#3D5A3D]/15 text-[#10B981] mb-2 self-start">
                      {renderedIcon(feature.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#F5F5F4] uppercase tracking-wider">{feature.title}</h4>
                      <p className="text-xs sm:text-sm text-[#D6D3D1] mt-2 leading-relaxed font-light">{feature.description}</p>
                    </div>
                  </div>
                </DoubleBgCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PHOTO-TIMELINE SECTION (Asymmetrical grid matching timeline phases) */}
      {content.timeline && content.timeline.length > 0 && (
        <section className="bg-[#0D130E] py-20 lg:py-28 border-t border-b border-[#2D3E30]/20 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "IL PROCESSO DI FRANGITURA" : "HOW WE PRESS IT"}
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight">
                {locale === "it" ? "Dalla raccolta alla bottiglia in 6 ore" : "Production & Processing Steps"}
              </h2>
            </div>

            <div className="space-y-16 max-w-4xl mx-auto">
              {content.timeline.map((step, idx) => {
                const isEven = idx % 2 === 0;
                const photoSrc = timelineImages[idx] || timelineImages[0];

                return (
                  <div 
                    key={idx} 
                    className={`grid gap-8 items-center md:grid-cols-12 ${
                      isEven ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Image Block */}
                    <div className={`md:col-span-5 relative group isolate ${
                      isEven ? "md:order-1" : "md:order-2"
                    }`}>
                      <DoubleBgCard 
                        offsetColor={isEven ? "bg-[#3D5A3D]/15 border-[#3D5A3D]/25" : "bg-[#D5B27F]/15 border-[#D5B27F]/20"} 
                        borderColor="border-[#2D3E30]/80"
                        paddingClass="p-0"
                        pattern="lines"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[5px]">
                          <Image
                            src={photoSrc}
                            alt={step.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-103 opacity-90 group-hover:opacity-100"
                          />
                        </div>
                      </DoubleBgCard>
                    </div>

                    {/* Text Block */}
                    <div className={`md:col-span-7 space-y-3 ${
                      isEven ? "md:order-2 md:pl-8" : "md:order-1 md:pr-8"
                    }`}>
                      <div className="inline-flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#10B981] bg-[#182019] px-2.5 py-1 rounded-[3px] border border-[#2D3E30]">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-light text-[#D5B27F] tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* 6. RECOMMENDED PAIRINGS */}
      {content.pairings && content.pairings.length > 0 && (
        <section className="bg-[#0A0E0B] py-20 lg:py-28 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "ECCELLENZA A TAVOLA" : "CULINARY MATCHES"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D5B27F] mt-3">
                {locale === "it" ? "Abbinamenti Consigliati" : "Recommended Pairings"}
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {content.pairings.map((pair, idx) => (
                <DoubleBgCard 
                  key={idx}
                  offsetColor="bg-[#8B7355]/10 border-[#8B7355]/20"
                  borderColor="border-[#2D3E30]"
                  pattern="lines"
                >
                  <div className="p-2 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4 text-[#10B981]">
                        <Wine className="h-5 w-5" />
                        <h4 className="font-serif text-lg font-semibold text-[#F5F5F4]">{pair.name}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed font-light">{pair.description}</p>
                    </div>
                  </div>
                </DoubleBgCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. PRODUCTS CATALOG SELECTION (3 Cards in the bottom) */}
      {products.length > 0 && (
        <section className="bg-[#0D130E] py-20 lg:py-28 border-t border-b border-[#2D3E30]/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "ACQUISTA IL NOVELLO" : "SHOP NEW OIL"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D5B27F] mt-3">
                {locale === "it" ? "Ordina le bottiglie della nuova stagione" : "Our new season selections"}
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {products.map((product) => (
                <DoubleBgCard 
                  key={product.id}
                  offsetColor="bg-[#3D5A3D]/10 border-[#3D5A3D]/25" 
                  borderColor="border-[#2D3E30]"
                  paddingClass="p-0"
                  className="h-full"
                  pattern="grid"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-[#0A0E0B] w-full overflow-hidden rounded-t-[5px] border-b border-[#2D3E30]/60">
                    <Image
                      src={product.imageSrc}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-103 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  {/* Content Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-semibold text-[#F5F5F4] group-hover:text-[#D5B27F] transition-colors leading-snug">
                        {product.title}
                      </h4>
                      <div className="mt-3 text-sm font-bold text-[#D5B27F]">
                        {product.priceLabel} <span className="text-[10px] text-[#A8A29E] font-normal">IVA incl.</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href={{ pathname: `/shop/${product.slug}` }}
                        prefetch={false}
                        className="w-full py-3 bg-[#3D5A3D] hover:bg-[#2C412C] text-[#F5F5F4] rounded-[5px] flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm border border-[#2D3E30]/35"
                      >
                        <span>{locale === "it" ? "Acquista ora" : "Buy now"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </DoubleBgCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. SEO EDUCATIONAL BLOCK */}
      <section className="bg-[#0A0E0B] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-[#131914] border border-[#2D3E30] p-8 md:p-10 rounded-[5px]">
            <h3 className="font-serif text-lg md:text-xl font-normal text-[#F5F5F4] leading-snug">
              {content.seoTitleText}
            </h3>
            <div className="h-px w-8 bg-[#3D5A3D] my-4" />
            <p className="text-[#A8A29E] text-xs md:text-sm leading-relaxed font-light">
              {content.seoBodyText}
            </p>
          </div>
        </div>
      </section>

      {/* 9. BACK TO SHOP CTA */}
      <section className="bg-[#0A0E0B] py-12 flex flex-col items-center justify-center border-t border-[#2D3E30]/10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 rounded-full border border-[#2D3E30] bg-[#131914] px-8 py-4 text-xs font-bold text-[#F5F5F4] uppercase tracking-wider hover:border-[#D5B27F] hover:text-[#D5B27F] hover:shadow-[0_0_15px_rgba(213,178,127,0.1)] transition-all shadow-sm"
        >
          <ShoppingBag className="h-4 w-4 text-[#10B981]" />
          <span>
            {locale === "it" ? "Torna allo Shop" : 
             locale === "en" ? "Back to Shop" : 
             locale === "de" ? "Zurück zum Shop" : 
             locale === "nl" ? "Terug naar Winkel" : 
             locale === "da" ? "Tilbage til Butik" : 
             "Tilbake til Butikk"}
          </span>
        </Link>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
