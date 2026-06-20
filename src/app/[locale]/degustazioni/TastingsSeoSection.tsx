"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Droplet, Star, ChevronDown, Award } from "lucide-react";

// Double Background Card design (similar to OlioBiologicoClient but with custom colors and patterns)
interface DoubleBgCardProps {
  children: React.ReactNode;
  className?: string;
  offsetColor?: string;
  borderColor?: string;
  paddingClass?: string;
  pattern?: "none" | "dots" | "grid" | "lines";
}

function DoubleBgCard({
  children,
  className = "",
  offsetColor = "bg-[#3D5A3D]/10 border-[#3D5A3D]/20",
  borderColor = "border-[#2D3E30]",
  paddingClass = "p-6",
  pattern = "none"
}: DoubleBgCardProps) {
  const getPatternStyle = () => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: "radial-gradient(rgba(184, 134, 11, 0.22) 1px, transparent 1px)",
          backgroundSize: "6px 6px"
        };
      case "grid":
        const strokeColor = "rgba(184, 134, 11, 0.16)";
        return {
          backgroundImage: `
            linear-gradient(${strokeColor} 1px, transparent 1px),
            linear-gradient(90deg, ${strokeColor} 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px"
        };
      case "lines":
        return {
          backgroundImage: "repeating-linear-gradient(45deg, rgba(184, 134, 11, 0.12), rgba(184, 134, 11, 0.12) 1px, transparent 1px, transparent 6px)",
        };
      default:
        return {};
    }
  };

  return (
    <div className={`relative group isolate ${className}`}>
      {/* Shifted outline card */}
      <div
        className={`absolute inset-0 border ${offsetColor} rounded-[5px] translate-x-2 translate-y-2 z-0 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:shadow-[0_0_20px_rgba(184,134,11,0.15)]`}
        style={getPatternStyle()}
      />

      {/* Foreground card */}
      <div className={`relative bg-[#131914] border ${borderColor} ${paddingClass} rounded-[5px] shadow-md transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-[#B8860B]/30 group-hover:shadow-[0_0_20px_rgba(61,90,61,0.15)] h-full flex flex-col justify-between z-10`}>
        {children}
      </div>
    </div>
  );
}

interface Feature {
  id: string;
  title: string;
  desc: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface TastingsSeoSectionProps {
  seoSubtitle: string;
  seoTitlePart1: string;
  seoTitleItalic: string;
  seoTitlePart2: string;
  seoDescription: string;
  imageSrc: string;
  imageAlt: string;
  imageBadge: string;
  features: Feature[];
  faqs: FAQItem[];
}

export default function TastingsSeoSection({
  seoSubtitle,
  seoTitlePart1,
  seoTitleItalic,
  seoTitlePart2,
  seoDescription,
  imageSrc,
  imageAlt,
  imageBadge,
  features,
  faqs
}: TastingsSeoSectionProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case "map":
        return <MapPin className="h-5 w-5 text-[#B8860B]" />;
      case "drop":
        return <Droplet className="h-5 w-5 text-[#B8860B]" />;
      case "star":
        return <Star className="h-4.5 w-4.5 text-[#B8860B]" />;
      default:
        return <Award className="h-5 w-5 text-[#B8860B]" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 14
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A0E0B] py-20 lg:py-28 lg:mt-20 border-t border-[#2D3E30]/20">
      {/* Premium Decorative Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#3D5A3D]/12 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4 pointer-events-none select-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#B8860B]/10 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 pointer-events-none select-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1.4fr] lg:gap-20 items-start">
          
          {/* LEFT COLUMN: Header, Description & Animated Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-start"
          >
            {/* Kicker subtitle */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-[#B8860B] uppercase">
              <span className="h-px w-6 bg-[#B8860B]/70" />
              {seoSubtitle}
            </motion.div>

            {/* Main Title */}
            <motion.h2 variants={itemVariants} className="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              {seoTitlePart1} <span className="italic text-[#B8860B] drop-shadow-[0_2px_8px_rgba(184,134,11,0.15)]">{seoTitleItalic}</span> {seoTitlePart2}
            </motion.h2>

            {/* Description */}
            <motion.p variants={itemVariants} className="mt-6 text-sm sm:text-base leading-relaxed text-[#D6D3D1] font-light">
              {seoDescription}
            </motion.p>

            {/* Feature Cards Grid */}
            <motion.div variants={itemVariants} className="mt-12 grid gap-6">
              {features.map((feat) => (
                <DoubleBgCard
                  key={feat.id}
                  offsetColor="bg-[#3D5A3D]/10 border-[#3D5A3D]/25"
                  borderColor="border-[#2D3E30]/75"
                  paddingClass="p-5"
                  pattern="dots"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 p-3 rounded-full bg-[#B8860B]/10 text-[#B8860B] group-hover:scale-105 transition-transform duration-300">
                      {getFeatureIcon(feat.id)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-medium text-white transition-colors group-hover:text-[#B8860B]">
                        {feat.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed font-light">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </DoubleBgCard>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Interactive Image Frame & Premium Accordion FAQs */}
          <div className="flex flex-col gap-10">
            
            {/* Image Card wrapped in custom DoubleBgCard with zoom and border animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <DoubleBgCard
                offsetColor="bg-[#B8860B]/10 border-[#B8860B]/20"
                borderColor="border-[#2D3E30]"
                paddingClass="p-0"
                pattern="grid"
                className="w-full overflow-hidden rounded-[5px]"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[5px] bg-black/45">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-80 transition-all duration-700 ease-out group-hover:scale-103 group-hover:opacity-95 mix-blend-overlay"
                  />
                  {/* Badge overlay inside styled frame */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center select-none pointer-events-none">
                    <span className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase border border-white/20 px-5 py-2.5 rounded-full bg-[#131914]/70 backdrop-blur-md transition-all duration-300 group-hover:border-[#B8860B]/40 group-hover:text-[#B8860B]">
                      {imageBadge}
                    </span>
                  </div>
                </div>
              </DoubleBgCard>
            </motion.div>

            {/* Collapsible FAQ Section with premium styling */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isActive = openFaqIdx === idx;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className={`group rounded-[5px] border transition-all duration-300 overflow-hidden ${
                      isActive 
                        ? "bg-[#182019]/60 border-[#B8860B]/45 shadow-[0_4px_20px_rgba(184,134,11,0.08)]" 
                        : "bg-[#131914] border-[#2D3E30] hover:border-[#B8860B]/25 hover:bg-[#182019]/30"
                    }`}
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      onClick={() => setOpenFaqIdx(isActive ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left gap-4 cursor-pointer focus:outline-none"
                    >
                      <h3 className={`font-serif text-base sm:text-lg font-medium transition-colors duration-300 ${
                        isActive ? "text-[#B8860B]" : "text-white group-hover:text-[#B8860B]"
                      }`}>
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={`flex-shrink-0 p-1.5 rounded-full border transition-colors ${
                          isActive 
                            ? "bg-[#B8860B]/10 border-[#B8860B]/30 text-[#B8860B]" 
                            : "bg-white/5 border-white/10 text-stone-400 group-hover:text-white group-hover:border-white/20"
                        }`}
                      >
                        <ChevronDown className="h-4.5 w-4.5" />
                      </motion.div>
                    </button>

                    {/* Accordion Collapsible Panel Content */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-6 border-t border-[#2D3E30]/40 pt-4">
                            <p className="text-xs sm:text-sm leading-relaxed text-[#A8A29E] font-light">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
