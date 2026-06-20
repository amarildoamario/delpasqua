"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "motion/react";
import { ArrowRight, Leaf, ShoppingBag, Droplet, Award, Wine, MapPin, Sprout } from "lucide-react";
import Footer from "@/components/Footer";

export type OlioToscanoContent = {
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
  stats: {
    value: string;
    label: string;
    description?: string;
  }[];
  pairings: {
    name: string;
    description: string;
  }[];
  // Custom additions for premium layout
  chemicalTitle: string;
  chemicalIntro: string;
  chemicalSpecs: {
    label: string;
    value: string;
    limit: string;
    description: string;
  }[];
  sensoryTitle: string;
  sensorySpecs: {
    label: string;
    value: number;
    description: string;
  }[];
  cultivarsTitle: string;
  cultivars: {
    name: string;
    description: string;
  }[];
};

type Props = {
  locale: string;
  content: OlioToscanoContent;
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
    
    // Parses structure like "< 6 ore", "100%", "3 Cultivar"
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

// Double Background Card design (Fixed/Static Offsets with custom patterns)
// Uses 'isolate' on the parent and z-index to avoid stacking bugs. Shifting animations are enabled on hover.
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
      
      {/* Foreground card (shifts slightly up-left on hover) */}
      <div className={`relative bg-[#131914] border ${borderColor} ${paddingClass} rounded-[5px] shadow-md transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-[#D5B27F]/30 h-full flex flex-col justify-between z-10`}>
        {children}
      </div>
    </div>
  );
}

// Interactive Sensory Rating progress bar
function SensoryBar({ label, value, max = 10, description }: { label: string; value: number; max?: number; description: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.1 });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isInView) {
      const id = requestAnimationFrame(() => {
        setWidth((value / max) * 100);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isInView, value, max]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-baseline text-[#F5F5F4]">
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className="font-serif text-sm font-semibold text-[#D5B27F]">{value.toFixed(1)} / {max}</span>
      </div>
      <div className="h-2 w-full bg-[#1A231B] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#4E8052] to-[#D5B27F] rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="text-[11px] text-[#A8A29E] italic leading-relaxed">{description}</p>
    </div>
  );
}

export default function OlioToscanoClient({ locale, content, products }: Props) {
  const renderedIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        // Maps to MapPin for territory/origin
        return <MapPin className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "shield":
        // Maps to Droplet for cold extraction
        return <Droplet className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "sparkles":
        // Maps to Sprout for historic cultivars
        return <Sprout className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      case "bag":
        return <ShoppingBag className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <Award className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E0B] text-[#F5F5F4] font-sans antialiased overflow-x-hidden">
      
      {/* BACKGROUND GLOWS (For a rich, premium atmosphere) */}
      <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#3D5A3D]/7 blur-[140px] pointer-events-none select-none" />
      <div className="absolute top-[40%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#8B7355]/5 blur-[120px] pointer-events-none select-none" />
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
                <span className="italic text-[#D5B27F] drop-shadow-[0_2px_10px_rgba(213,178,127,0.15)]">Toscano</span>
              </>
            ) : locale === "en" ? (
              <>
                Tuscan Extra Virgin <br className="hidden sm:inline" />
                <span className="italic text-[#D5B27F] drop-shadow-[0_2px_10px_rgba(213,178,127,0.15)]">Olive Oil</span>
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

      {/* 3. INTRO & KEY BENEFITS (Immediate rendering with dots pattern) */}
      <section className="bg-[#0A0E0B] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            
            {/* Left: Content Description (typography match 'chi siamo') */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "IL NOSTRO IMPEGNO" : "OUR COMMITMENT"}
              </span>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight leading-[1.2]">
                {content.introTitle}
              </h2>
              <div className="w-12 h-px bg-[#3D5A3D] my-8" />
              
              <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#D6D3D1] space-y-6 font-light">
                {content.introText.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right: Feature Cards (double backgrounds with dots pattern - always visible) */}
            <div className="lg:col-span-5 space-y-8 lg:pl-4">
              <h3 className="text-xs font-bold tracking-[0.15em] text-[#D5B27F] uppercase mb-4 pl-1">
                {locale === "it" ? "Punti di Eccellenza" : "Pillars of Excellence"}
              </h3>
              
              <div className="space-y-6">
                {content.features.map((feature, idx) => (
                  <DoubleBgCard 
                    key={idx}
                    offsetColor="bg-[#3D5A3D]/10 border-[#3D5A3D]/25" 
                    borderColor="border-[#2D3E30]/75"
                    pattern="dots"
                  >
                    <div className="flex gap-5 items-start p-1">
                      <div className="flex-shrink-0 p-3 rounded-full bg-[#3D5A3D]/15 text-[#10B981]">
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
        </div>
      </section>

      {/* 4. STATISTICS COUNTER SECTION (Immediate rendering with dots pattern - always visible) */}
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
                  <div className="text-4xl sm:text-5xl font-serif font-light text-[#D5B27F] tracking-tight mb-3">
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

      {/* 5. PREMIUM TECHNICAL & SENSORY SPECIFICATIONS (Symmetric Alignment & Immediate rendering) */}
      <section className="bg-[#0D130E] py-20 lg:py-28 border-t border-b border-[#2D3E30]/20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
              {locale === "it" ? "ANALISI DI LABORATORIO" : "LABORATORY ANALYSIS"}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight">
              {content.chemicalTitle}
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#D6D3D1] font-light leading-relaxed">
              {content.chemicalIntro}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            
            {/* Left: Chemical Sheet */}
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-light text-[#D5B27F] border-b border-[#2D3E30]/40 pb-3">
                {locale === "it" ? "Parametri Chimici Qualitativi" : "Chemical Quality Parameters"}
              </h3>
              
              <div className="grid gap-6">
                {content.chemicalSpecs.map((spec, idx) => (
                  <DoubleBgCard 
                    key={idx}
                    offsetColor="bg-[#D5B27F]/10 border-[#D5B27F]/20" 
                    borderColor="border-[#2D3E30]/60"
                    pattern="lines"
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F4]">{spec.label}</span>
                      <span className="font-serif text-lg font-light text-[#10B981]">{spec.value}</span>
                    </div>
                    <div className="text-[10px] text-[#D5B27F]/80 font-medium tracking-wide mb-3">{spec.limit}</div>
                    <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed font-light">{spec.description}</p>
                  </DoubleBgCard>
                ))}
              </div>
            </div>

            {/* Right: Sensory Profile Sliders (Aligned in height with chemical cards) */}
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-light text-[#D5B27F] border-b border-[#2D3E30]/40 pb-3">
                {content.sensoryTitle}
              </h3>
              
              <div className="bg-[#131914] border border-[#2D3E30] p-8 rounded-[5px] shadow-sm relative overflow-hidden">
                <div className="space-y-8">
                  {content.sensorySpecs.map((spec, idx) => (
                    <SensoryBar 
                      key={idx} 
                      label={spec.label} 
                      value={spec.value} 
                      description={spec.description} 
                    />
                  ))}
                </div>

                {/* Certified Banner */}
                <div className="mt-8 pt-6 border-t border-[#2D3E30]/40 flex gap-3 items-start text-[#D5B27F] bg-[#182019] p-4 rounded-[5px] border border-[#2D3E30]/80">
                  <Award className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] sm:text-xs leading-relaxed font-light text-[#D6D3D1]">
                    {locale === "it" 
                      ? "Questo profilo sensoriale è garantito dal nostro panel di assaggio professionale che ne certifica l'assenza di difetti e l'eccellente equilibrio aromatico."
                      : "This sensory profile is certified by our professional tasting panel, verifying zero defects and an outstanding aromatic harmony."
                    }
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CONDENSED CULTIVARS & CULINARY PAIRINGS SECTION (More decorated, equal height, no numbers, leaf zoom, immediate render) */}
      <section className="bg-[#0A0E0B] py-20 lg:py-28 relative">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
              {locale === "it" ? "LE CULTIVAR E LA TAVOLA" : "CULTIVARS & CULINARY HARMONY"}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#D5B27F] tracking-tight">
              {content.cultivarsTitle}
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#D6D3D1] font-light leading-relaxed">
              {locale === "it" 
                ? "Ogni cultivar apporta il suo profilo unico alla miscela finale. Scopri le loro caratteristiche organolettiche abbinate alla perfezione con i piatti della tradizione."
                : "Each cultivar provides its unique character to the final blend. Explore their properties paired to perfection with traditional dishes."
              }
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {content.cultivars.map((cultivar, idx) => {
              const pairing = content.pairings[idx] || content.pairings[0];
              
              let offsetColor = "bg-[#3D5A3D]/10 border-[#3D5A3D]/25";
              if (idx === 1) offsetColor = "bg-[#D5B27F]/10 border-[#D5B27F]/20";
              if (idx === 2) offsetColor = "bg-[#3D5A3D]/10 border-[#D5B27F]/15";

              return (
                <div key={idx} className="relative group isolate h-full">
                  {/* Double background offset (patterned - shifts on hover) */}
                  <div 
                    className={`absolute inset-0 border ${offsetColor} rounded-[5px] translate-x-2 translate-y-2 z-0 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:shadow-[0_0_25px_rgba(213,178,127,0.15)]`}
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, rgba(213, 178, 127, 0.12), rgba(213, 178, 127, 0.12) 1px, transparent 1px, transparent 6px)"
                    }}
                  />
                  
                  {/* Main card - z-10 for correct stacking - shifts up-left on hover */}
                  <div className="relative bg-[#131914] border border-[#2D3E30]/80 p-6 rounded-[5px] shadow-lg transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-[#D5B27F]/50 h-full flex flex-col justify-between overflow-hidden z-10">
                    
                    {/* Top gold bar decoration */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4E8052] via-[#D5B27F] to-[#4E8052]" />
                    
                    {/* Background watermark leaf that animates on hover */}
                    <div className="absolute -bottom-8 -right-8 text-[#2D3E30]/15 pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-12 group-hover:text-[#D5B27F]/5">
                      <Leaf className="w-36 h-36" />
                    </div>

                    <div className="relative z-10 space-y-4">
                      {/* Cultivar Name (Starts directly without header leaf/badge) */}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-semibold">Cultivar</span>
                        <h3 className="font-serif text-2xl font-light text-[#F5F5F4] mt-0.5">
                          <span className="italic text-[#D5B27F] font-normal group-hover:text-[#F5F5F4] transition-colors duration-300">{cultivar.name}</span>
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed font-light">
                        {cultivar.description}
                      </p>
                    </div>

                    {/* Spacer/Divider */}
                    <div className="relative z-10 my-5">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2D3E30] to-transparent" />
                    </div>

                    {/* Pairing sub-block */}
                    <div className="relative z-10 bg-[#182019]/90 border border-[#2D3E30]/90 p-4 rounded-[5px] overflow-hidden group/pairing transition-all duration-300 hover:border-[#D5B27F]/45 hover:bg-[#1E2620]">
                      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#D5B27F]/5 blur-[20px] pointer-events-none transition-all duration-300 group-hover/pairing:bg-[#D5B27F]/10" />
                      
                      <div className="flex items-center gap-2 mb-2 text-[#D5B27F]">
                        <Wine className="h-4 w-4 text-[#10B981] transition-transform duration-500 group-hover/pairing:scale-110" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D5B27F]">
                          {locale === "it" ? "Abbinamento Ideale" : "Ideal Pairing"}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-[#F5F5F4] mb-1.5">{pairing.name}</h4>
                      <p className="text-[11px] text-[#A8A29E] leading-relaxed font-light">
                        {pairing.description}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. PRODUCTS CATALOG SELECTION (Premium Dark Slabs - No White Backgrounds - Grid pattern - Immediate render) */}
      {products.length > 0 && (
        <section className="bg-[#0D130E] py-20 lg:py-28 border-t border-b border-[#2D3E30]/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D5B27F] uppercase">
                {locale === "it" ? "ACQUISTA DIRETTAMENTE" : "BUY DIRECTLY"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D5B27F] mt-3">
                {locale === "it" ? "I nostri formati consigliati" : "Our recommended sizes"}
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
