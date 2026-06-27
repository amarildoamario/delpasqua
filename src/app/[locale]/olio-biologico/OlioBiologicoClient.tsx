"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "motion/react";
import { ArrowRight, Leaf, ShieldCheck, Percent, ShoppingBag, Droplet, Award, Wine, CheckCircle2, XCircle, MapPin, Clock, Heart, Sprout } from "lucide-react";
import Footer from "@/components/Footer";

export type BiologicoContent = {
  kicker: string;
  title: string;
  subtitle: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  features: {
    icon: "leaf" | "shield" | "droplet" | "bag";
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
  pairings: {
    name: string;
    description: string;
  }[];
  comparisonTable: {
    title: string;
    headers: string[];
    rows: {
      name: string;
      description?: string;
      values: string[];
      highlight?: boolean;
    }[];
  };
};

type Props = {
  locale: string;
  content: BiologicoContent;
  products: {
    id: string;
    title: string;
    priceLabel: string;
    imageSrc: string;
    slug: string;
  }[];
};

// Custom InView Hook to trigger animations only when elements enter the screen
function useInView(ref: React.RefObject<HTMLElement | null>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// Reusable Animated Counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { threshold: 0.1 });
  
  useEffect(() => {
    if (!isInView) return;
    
    // Parses structure like "100%", "ICEA Cert.", etc.
    const match = value.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
    if (!match) {
      const frameId = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(frameId);
    }
    
    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];
    
    const start = 0;
    const startTime = performance.now();
    let animationFrameId: number;
    
    const updateNumber = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const current = Math.round(start + (target - start) * easeProgress);
      
      setDisplayValue(`${prefix}${current}${suffix}`);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration, isInView]);
  
  return <span ref={ref}>{displayValue}</span>;
}

// Double Background Card design (Fixed/Static Offsets with custom patterns and hover shifting)
function DoubleBgCard({ 
  children, 
  className = "", 
  offsetColor = "bg-[#3D5A3D]/10 border-[#3D5A3D]/20", 
  borderColor = "border-[#2D3E30]",
  paddingClass = "p-6",
  pattern = "none" // "none" | "dots" | "grid" | "lines"
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
      {/* Shifted outline card (offset position shifts on hover) */}
      <div 
        className={`absolute inset-0 border ${offsetColor} rounded-[5px] translate-x-2 translate-y-2 z-0 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:shadow-[0_0_20px_rgba(76,110,79,0.15)]`}
        style={getPatternStyle()}
      />
      
      {/* Foreground card (lifts up-left on hover) */}
      <div className={`relative bg-[#131914] border ${borderColor} ${paddingClass} rounded-[5px] shadow-md transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-[#D5B27F]/30 group-hover:shadow-[0_0_20px_rgba(76,110,79,0.1)] h-full flex flex-col justify-between z-10`}>
        {children}
      </div>
    </div>
  );
}

// Helpers for Premium Comparison Table
const getCriteriaIcon = (idx: number) => {
  switch (idx) {
    case 0: return <ShieldCheck className="h-4.5 w-4.5 text-[#10B981]" />;
    case 1: return <MapPin className="h-4.5 w-4.5 text-[#10B981]" />;
    case 2: return <Sprout className="h-4.5 w-4.5 text-[#10B981]" />;
    case 3: return <Clock className="h-4.5 w-4.5 text-[#10B981]" />;
    case 4: return <Droplet className="h-4.5 w-4.5 text-[#10B981]" />;
    case 5: return <Award className="h-4.5 w-4.5 text-[#10B981]" />;
    case 6: return <Heart className="h-4.5 w-4.5 text-[#10B981]" />;
    case 7: return <Percent className="h-4.5 w-4.5 text-[#10B981]" />;
    case 8: return <Leaf className="h-4.5 w-4.5 text-[#10B981]" />;
    default: return <Award className="h-4.5 w-4.5 text-[#10B981]" />;
  }
};

const renderTableValue = (val: string, isPasqua: boolean) => {
  const cleanVal = val.replace(/^[✓✗]\s*/, "");
  const startsWithCheck = val.startsWith("✓");
  const startsWithCross = val.startsWith("✗");
  
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-2 py-1 text-center h-full">
      {startsWithCheck && (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 350, damping: 15, delay: 0.05 }}
          className="flex items-center justify-center w-6.5 h-6.5 rounded-full bg-[#10B981]/15 text-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 className="h-4.5 w-4.5" />
        </motion.div>
      )}
      {startsWithCross && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 350, damping: 15, delay: 0.05 }}
          className="flex items-center justify-center w-6.5 h-6.5 rounded-full bg-red-500/10 text-red-500/80"
        >
          <XCircle className="h-4.5 w-4.5" />
        </motion.div>
      )}
      <span className={`text-xs sm:text-sm leading-relaxed ${
        isPasqua 
          ? "text-[#F5F5F4] font-semibold" 
          : startsWithCross 
            ? "text-[#A8A29E]/60 font-light" 
            : "text-[#A8A29E]/85 font-light"
      }`}>
        {cleanVal}
      </span>
    </div>
  );
};

export default function OlioBiologicoClient({ locale, content, products }: Props) {
  const renderedIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        return <Leaf className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "shield":
        return <ShieldCheck className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "droplet":
        return <Droplet className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <Award className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E0B] text-[#F5F5F4] font-sans antialiased overflow-x-hidden">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#3D5A3D]/7 blur-[140px] pointer-events-none select-none" />
      <div className="absolute top-[45%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#8B7355]/5 blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#3D5A3D]/6 blur-[130px] pointer-events-none select-none" />

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
                Olio Extravergine <br className="hidden sm:inline" />
                <span className="italic text-[#10B981] drop-shadow-[0_2px_10px_rgba(16,185,129,0.15)]">Biologico</span>
              </>
            ) : locale === "en" ? (
              <>
                Organic Extra Virgin <br className="hidden sm:inline" />
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

      {/* 3. INTRO & NARRATIVE (Split grid with image on the left and narrative on the right) */}
      <section className="bg-[#0A0E0B] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left: Image inside double background card to break similarity */}
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
                    src="/frantoio/brucatura.jpg"
                    alt={locale === "it" ? "Raccolta manuale delle olive" : "Manual olive harvesting"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0B]/50 to-transparent" />
                </div>
              </DoubleBgCard>
            </div>

            {/* Right: Content Description */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "SCELTA ETICA" : "ETHICAL CHOICE"}
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

      {/* 3b. KEY BENEFITS SECTION (Horizontal 3-column row, breaking the vertical-stack layout of Tuscan page) */}
      <section className="bg-[#0A0E0B] pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xs font-bold tracking-[0.15em] text-[#D5B27F] uppercase mb-8 text-center sm:text-left pl-1">
              {locale === "it" ? "Parametri del Biologico" : "Organic Standards"}
            </h3>
            
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

      {/* 4. STATISTICS COUNTER SECTION (Dotted Pattern) */}
      {content.stats && content.stats.length > 0 && (
        <section className="bg-[#0A0E0B] py-16 lg:py-24 border-t border-[#2D3E30]/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {content.stats.map((stat, idx) => (
                <DoubleBgCard 
                  key={idx}
                  offsetColor="bg-[#D5B27F]/10 border-[#D5B27F]/20" 
                  borderColor="border-[#2D3E30]/70"
                  pattern="dots"
                >
                  <div className="text-center p-4">
                    <div className="text-4xl sm:text-5xl font-serif font-light text-[#10B981] tracking-tight mb-3">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <h4 className="text-xs font-bold text-[#F5F5F4] uppercase tracking-wider mb-2">{stat.label}</h4>
                    {stat.description && (
                      <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed font-light">{stat.description}</p>
                    )}
                  </div>
                </DoubleBgCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. PREMIUM ANIMATED COMPARISON TABLE (Detailed, 4-columns, criteria subtitles, animated icons) */}
      <section className="bg-[#0D130E] py-20 lg:py-28 border-t border-b border-[#2D3E30]/20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
              {locale === "it" ? "CONFRONTO TRASPARENTE" : "TRANSPARENT COMPARISON"}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight leading-tight">
              {content.comparisonTable.title}
            </h2>
          </div>

          {/* Custom style tag to hide horizontal scrollbar while preserving swipe functionality on mobile */}
          <style dangerouslySetInnerHTML={{ __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none !important;
            }
            .no-scrollbar {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
          `}} />

          <DoubleBgCard 
            offsetColor="bg-[#D5B27F]/10 border-[#D5B27F]/20" 
            borderColor="border-[#2D3E30]" 
            paddingClass="p-0"
            pattern="grid"
          >
            <div className="w-full overflow-x-auto rounded-[5px] no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#182019] border-b border-[#2D3E30]">
                    {/* Quality Criterion Header */}
                    <th className="py-5 px-3 md:px-5 text-[10px] md:text-xs font-bold text-[#D5B27F] uppercase tracking-wider w-[31%] leading-tight">
                      {content.comparisonTable.headers[0]}
                    </th>
                    {/* Bio Del Pasqua Header (Gold Highlighted) */}
                    <th className="py-5 px-3 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-center w-[27%] bg-[#1E2720]/80 border-l border-r border-[#2D3E30] leading-tight">
                      <span className="text-[#D5B27F] block">{content.comparisonTable.headers[1]}</span>
                    </th>
                    {/* Industrial Organic Header */}
                    <th className="py-5 px-3 md:px-5 text-[10px] md:text-xs font-bold text-[#A8A29E] uppercase tracking-wider text-center w-[21%] leading-tight">
                      {content.comparisonTable.headers[2]}
                    </th>
                    {/* Supermarket Oil Header */}
                    <th className="py-5 px-3 md:px-5 text-[10px] md:text-xs font-bold text-[#A8A29E] uppercase tracking-wider text-center w-[21%] leading-tight">
                      {content.comparisonTable.headers[3]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.comparisonTable.rows.map((row, rowIdx) => (
                    <motion.tr
                      key={rowIdx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: rowIdx * 0.05 }}
                      className={`border-b border-[#2D3E30]/40 last:border-b-0 hover:bg-[#182019]/45 transition-colors duration-200 ${
                        row.highlight ? "bg-[#3D5A3D]/5" : ""
                      }`}
                    >
                      {/* Quality Criterion Cell (Icon + Title + Description) */}
                      <td className="p-3.5 md:p-5 w-[31%] align-middle">
                        <div className="flex gap-2.5 md:gap-3 items-start">
                          <div className="mt-1 flex-shrink-0 text-[#10B981]">
                            {getCriteriaIcon(rowIdx)}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-semibold text-[#F5F5F4] leading-snug">{row.name}</div>
                            {row.description && (
                              <div className="text-[10px] text-[#A8A29E]/70 leading-relaxed font-light mt-1 max-w-[220px]">
                                {row.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Bio Del Pasqua Cell (Highlighted Middle Column) */}
                      <td className="p-3.5 md:p-5 w-[27%] text-center bg-[#1E2720]/45 border-l border-r border-[#2D3E30]/65 align-middle">
                        {renderTableValue(row.values[0], true)}
                      </td>

                      {/* Industrial Organic Cell */}
                      <td className="p-3.5 md:p-5 w-[21%] text-center align-middle">
                        {renderTableValue(row.values[1], false)}
                      </td>

                      {/* Commercial Supermarket Oil Cell */}
                      <td className="p-3.5 md:p-5 w-[21%] text-center align-middle">
                        {renderTableValue(row.values[2], false)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DoubleBgCard>
        </div>
      </section>

      {/* 6. RECOMMENDED CULINARY PAIRINGS (Compact & highly styled cards with lines pattern) */}
      <section className="bg-[#0A0E0B] py-20 lg:py-28 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
              {locale === "it" ? "IN CUCINA" : "IN THE KITCHEN"}
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

      {/* 7. PRODUCTS CATALOG SELECTION (Premium Dark Slabs - No White Backgrounds - Grid pattern) */}
      {products.length > 0 && (
        <section className="bg-[#0D130E] py-20 lg:py-28 border-t border-b border-[#2D3E30]/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "ACQUISTA IL NOSTRO BIO" : "SHOP OUR ORGANIC OIL"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D5B27F] mt-3">
                {locale === "it" ? "Le nostre selezioni biologiche" : "Our organic selections"}
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
                  {/* Darker Image Frame */}
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

      {/* 8. BACK TO SHOP CTA */}
      <section className="bg-[#0A0E0B] py-20 flex flex-col items-center justify-center">
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
