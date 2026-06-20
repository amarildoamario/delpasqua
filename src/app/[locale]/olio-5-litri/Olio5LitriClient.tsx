"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "motion/react";
import { ArrowRight, Leaf, ShieldCheck, ShoppingBag, Sparkles, CheckCircle2, Award, Wine, Info } from "lucide-react";
import Footer from "@/components/Footer";

export type LandingPageContent = {
  kicker: string;
  title: string;
  subtitle: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  features: {
    icon: "leaf" | "shield" | "sparkles" | "bag";
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

// Table cell rendering helper
const renderComparisonCell = (val: string, isTin: boolean) => {
  const isChecked = val.startsWith("✓");
  const displayVal = isChecked ? val.replace("✓", "").trim() : val;

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 text-center px-2 py-1">
      {isChecked && (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10B981]/15 text-[#10B981]">
          <CheckCircle2 className="h-4.5 w-4.5" />
        </span>
      )}
      <span className={`text-xs sm:text-sm leading-relaxed ${isTin ? "text-[#F5F5F4] font-semibold" : "text-[#A8A29E] font-light"}`}>
        {displayVal}
      </span>
    </div>
  );
};

export default function Olio5LitriClient({ locale, content, products }: Props) {
  const renderedIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        return <Leaf className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "shield":
        return <ShieldCheck className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "sparkles":
        return <Sparkles className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <Award className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E0B] text-[#F5F5F4] font-sans antialiased overflow-x-hidden">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#3D5A3D]/6 blur-[120px] pointer-events-none select-none" />
      <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B7355]/4 blur-[130px] pointer-events-none select-none" />
      <div className="absolute bottom-[25%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#3D5A3D]/5 blur-[110px] pointer-events-none select-none" />

      {/* 1. HERO SECTION */}
      <section className="relative h-[55vh] lg:h-[70vh] overflow-hidden bg-[#0A0E0B] flex items-center justify-center border-b border-[#2D3E30]/20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed opacity-40 select-none pointer-events-none"
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
                Olio Extravergine <br className="hidden sm:inline" />
                <span className="italic text-[#D5B27F] drop-shadow-[0_2px_10px_rgba(213,178,127,0.15)]">in Latta 5 Litri</span>
              </>
            ) : locale === "en" ? (
              <>
                5-Liter Extra Virgin <br className="hidden sm:inline" />
                <span className="italic text-[#D5B27F] drop-shadow-[0_2px_10px_rgba(213,178,127,0.15)]">Olive Oil Tin</span>
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

      {/* 3. INTRO SECTION WITH PHOTO AND FEATURES */}
      <section className="bg-[#0A0E0B] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column: Narrative Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "IL FORMATO CONVENIENZA" : "THE FAMILY SIZE"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight leading-[1.2]">
                {content.introTitle}
              </h2>
              <div className="w-12 h-px bg-[#3D5A3D]" />
              
              <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#D6D3D1] space-y-6 font-light">
                {content.introText.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right Column: Visual image card */}
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
                    src="/products/EVO-latta-5lt.png"
                    alt="Latta Olio Extravergine Del Pasqua"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0E0B] via-transparent to-transparent p-6 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D5B27F] bg-[#131914] border border-[#2D3E30] px-3 py-1.5 rounded-[3px]">
                      100% Protezione UV
                    </span>
                  </div>
                </div>
              </DoubleBgCard>
            </div>

          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES CARDS GRID */}
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

      {/* 5. MULTIPLE PHOTOS GALLERY SECTION - Showing the actual Frantoio Storage & Tinning */}
      <section className="bg-[#0D130E] py-20 border-t border-b border-[#2D3E30]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0D130E]/50 z-0" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
              {locale === "it" ? "LE IMMAGINI DEL NOSTRO LAVORO" : "THE STEPS IN PHOTOS"}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight">
              {locale === "it" ? "Conservazione e Confezionamento" : "Storage & Tin Filling"}
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#D6D3D1] font-light leading-relaxed">
              {locale === "it" 
                ? "Dalla conservazione sotto azoto nelle cisterne di acciaio inox fino all'imbottigliamento e alla sigillatura della latta."
                : "From nitrogen-controlled steel tanks to bottling and sealing the protective tin."
              }
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Photo 1: Steel Tanks Storage */}
            <div className="relative group isolate">
              <DoubleBgCard 
                offsetColor="bg-[#D5B27F]/15 border-[#D5B27F]/20" 
                borderColor="border-[#2D3E30]/80"
                paddingClass="p-0"
                pattern="lines"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[5px]">
                  <Image
                    src="/frantoio/conservazione.jpg"
                    alt="Cisterne stoccaggio olio frantoio"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-103 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0B]/80 via-[#0A0E0B]/30 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] font-bold text-[#D5B27F] uppercase tracking-wider mb-1">Stoccaggio Ottimale</span>
                    <h3 className="text-sm font-semibold text-[#F5F5F4]">Cisterne Inox sotto Azoto</h3>
                    <p className="text-[11px] text-[#A8A29E] mt-1 font-light leading-relaxed">
                      {locale === "it" 
                        ? "L'olio viene conservato a temperatura controllata e sotto azoto per eliminare l'ossigeno ed evitare qualsiasi ossidazione."
                        : "Oil is stored under nitrogen gas in temperature-controlled tanks to exclude oxygen and prevent oxidation."
                      }
                    </p>
                  </div>
                </div>
              </DoubleBgCard>
            </div>

            {/* Photo 2: Tin packaging */}
            <div className="relative group isolate">
              <DoubleBgCard 
                offsetColor="bg-[#3D5A3D]/15 border-[#3D5A3D]/25" 
                borderColor="border-[#2D3E30]/80"
                paddingClass="p-0"
                pattern="lines"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[5px]">
                  <Image
                    src="/frantoio/confezionamento.jpg"
                    alt="Linea confezionamento olio in latta"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-103 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0B]/80 via-[#0A0E0B]/30 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] font-bold text-[#D5B27F] uppercase tracking-wider mb-1">Confezionamento Diretto</span>
                    <h3 className="text-sm font-semibold text-[#F5F5F4]">Riempimento e Sigillatura Ermetica</h3>
                    <p className="text-[11px] text-[#A8A29E] mt-1 font-light leading-relaxed">
                      {locale === "it" 
                        ? "Le latte vengono riempite e sigillate ermeticamente direttamente prima della spedizione per garantire la massima freschezza."
                        : "Tins are filled and hermetically sealed directly before shipping to guarantee maximum freshness."
                      }
                    </p>
                  </div>
                </div>
              </DoubleBgCard>
            </div>
          </div>

        </div>
      </section>

      {/* 6. COMPARISON TABLE - Tins vs Glass Bottles */}
      {content.comparisonTable && (
        <section className="bg-[#0A0E0B] py-20 lg:py-28 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "CONFRONTO IN DETTAGLIO" : "COMPARISON TABLE"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight mt-3">
                {content.comparisonTable.title}
              </h2>
            </div>

            <DoubleBgCard 
              offsetColor="bg-[#D5B27F]/10 border-[#D5B27F]/20" 
              borderColor="border-[#2D3E30]" 
              paddingClass="p-0"
              pattern="grid"
              className="max-w-4xl mx-auto"
            >
              <div className="w-full overflow-x-auto rounded-[5px]">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-[#182019] border-b border-[#2D3E30]">
                      <th className="py-5 px-5 text-[10px] sm:text-xs font-bold text-[#D5B27F] uppercase tracking-wider w-[40%]">
                        {content.comparisonTable.headers[0]}
                      </th>
                      <th className="py-5 px-5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center w-[30%] bg-[#1E2720]/80 border-l border-r border-[#2D3E30] text-[#D5B27F]">
                        {content.comparisonTable.headers[1]}
                      </th>
                      <th className="py-5 px-5 text-[10px] sm:text-xs font-bold text-[#A8A29E] uppercase tracking-wider text-center w-[30%]">
                        {content.comparisonTable.headers[2]}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.comparisonTable.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={`border-b border-[#2D3E30]/40 last:border-b-0 hover:bg-[#182019]/45 transition-colors duration-200 ${
                          row.highlight ? "bg-[#3D5A3D]/5" : ""
                        }`}
                      >
                        <td className="p-4 sm:p-5 w-[40%] align-middle">
                          <span className="text-xs sm:text-sm font-semibold text-[#F5F5F4]">{row.name}</span>
                        </td>
                        <td className="p-4 sm:p-5 w-[30%] text-center bg-[#1E2720]/45 border-l border-r border-[#2D3E30]/65 align-middle">
                          {renderComparisonCell(row.values[0], true)}
                        </td>
                        <td className="p-4 sm:p-5 w-[30%] text-center align-middle">
                          {renderComparisonCell(row.values[1], false)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DoubleBgCard>
          </div>
        </section>
      )}

      {/* 7. RECOMMENDED PAIRINGS */}
      {content.pairings && content.pairings.length > 0 && (
        <section className="bg-[#0A0E0B] pb-20 lg:pb-28 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "UTILIZZO IN CUCINA" : "KITCHEN PAIRINGS"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D5B27F] mt-3">
                {locale === "it" ? "Come utilizzare la scorta di olio" : "Suggested culinary uses"}
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

      {/* 8. PRODUCTS CATALOG SELECTION (Exactly 3 Cards in the bottom) */}
      {products.length > 0 && (
        <section className="bg-[#0D130E] py-20 lg:py-28 border-t border-b border-[#2D3E30]/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "ACQUISTA ORA" : "BUY ONLINE"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D5B27F] mt-3">
                {locale === "it" ? "Le latte convenienza da 5 litri" : "Our 5-liter tins selection"}
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
                      className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-103 opacity-90 group-hover:opacity-100"
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

      {/* 9. SEO LONG-FORM CONTENT */}
      <section className="bg-[#0A0E0B] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-[#131914] border border-[#2D3E30] p-8 md:p-10 rounded-[5px]">
            <div className="flex gap-3 items-center mb-4 text-[#D5B27F]">
              <Info className="h-5 w-5 text-[#10B981]" />
              <h3 className="font-serif text-lg md:text-xl font-normal text-[#F5F5F4] leading-snug">
                {content.seoTitleText}
              </h3>
            </div>
            <div className="h-px w-8 bg-[#3D5A3D] my-4" />
            <p className="text-[#A8A29E] text-xs md:text-sm leading-relaxed font-light">
              {content.seoBodyText}
            </p>
          </div>
        </div>
      </section>

      {/* 10. BACK TO SHOP CTA */}
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
