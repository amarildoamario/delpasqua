// BioMethodSection.tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import {
  Leaf,
  Thermometer,
  Route,
  ShieldCheck,
  Snowflake,
  Filter,
  Warehouse,
  Factory,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";

import styles from "./BioMethodSection.module.css";

export default function BioMethodSection() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const specsRef = useRef<HTMLDivElement | null>(null);
  const processRef = useRef<HTMLDivElement | null>(null);
  const guaranteeRef = useRef<HTMLDivElement | null>(null);
  const processCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const processNumRefs = useRef<Array<HTMLDivElement | null>>([]);
  const guaranteeCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const animateCardIn = (el: HTMLElement, index = 0) => {
      const odd = index % 2 === 1;
      el.getAnimations?.().forEach((a) => a.cancel());
      el.style.opacity = "0";
      el.style.transform = `translate3d(${odd ? "-8px" : "8px"}, 16px, 0)`;
      el.style.filter = "blur(8px)";
      el.animate(
        [
          { opacity: 0, transform: `translate3d(${odd ? "-8px" : "8px"}, 16px, 0)`, filter: "blur(8px)" },
          { opacity: 1, transform: "translate3d(0,0,0)", filter: "blur(0px)" },
        ],
        { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );
    };

    const animateNumberIn = (el: HTMLElement) => {
      el.getAnimations?.().forEach((a) => a.cancel());
      el.style.opacity = "0";
      el.style.transform = "scale(0.8)";
      el.animate(
        [
          { opacity: 0, transform: "scale(0.8)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: 500, easing: "cubic-bezier(0.2, 1, 0.2, 1)", fill: "forwards" }
      );
    };

    const all = [headerRef.current, specsRef.current, processRef.current, guaranteeRef.current];

    all.forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translate3d(0, 12px, 0)";
    });

    processCardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translate3d(${i % 2 ? "-8px" : "8px"}, 16px, 0)`;
    });

    const played = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || played.has(entry.target)) continue;
          played.add(entry.target);
          const el = entry.target as HTMLElement;
          const kind = el.getAttribute("data-kind") ?? "block";
          const idx = Number(el.getAttribute("data-idx") ?? "0");
          const delay = Math.min(idx * 80, 300);

          if (kind === "num") setTimeout(() => animateNumberIn(el), delay);
          else setTimeout(() => animateCardIn(el, idx), delay);

          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    all.forEach((el, i) => {
      if (el) {
        el.setAttribute("data-kind", "block");
        el.setAttribute("data-idx", String(i));
        io.observe(el);
      }
    });
    processCardRefs.current.forEach((el, i) => {
      if (el) {
        el.setAttribute("data-kind", "card");
        el.setAttribute("data-idx", String(i));
        io.observe(el);
      }
    });
    processNumRefs.current.forEach((el, i) => {
      if (el) {
        el.setAttribute("data-kind", "num");
        el.setAttribute("data-idx", String(i));
        io.observe(el);
      }
    });
    guaranteeCardRefs.current.forEach((el, i) => {
      if (el) {
        el.setAttribute("data-kind", "card");
        el.setAttribute("data-idx", String(i + 4));
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);

  const setProcessCardRef = (index: number) => (el: HTMLDivElement | null) => {
    processCardRefs.current[index] = el;
  };

  const setProcessNumRef = (index: number) => (el: HTMLDivElement | null) => {
    processNumRefs.current[index] = el;
  };

  const setGuaranteeRef = (index: number) => (el: HTMLDivElement | null) => {
    guaranteeCardRefs.current[index] = el;
  };

  return (
    // ✅ UN SOLO CONTENITORE che gestisce lo sfondo (niente absolute, niente svg)
    <section className={styles.section}>
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-start md:gap-12">
          {/* LEFT COPY */}
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-medium tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Leaf className="h-3.5 w-3.5" />
              METODO BIO
            </div>

            <h2 className="mt-4 font-serif text-2xl leading-tight text-stone-900 dark:text-white md:mt-5 md:text-4xl">
              Piccola scala.
              <br />
              <span className="text-emerald-700 dark:text-emerald-400">Qualità controllata.</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-emerald-100/60 md:mt-4">
              Un olio artigianale non nasce da una linea industriale: nasce da tempi corretti, lotti piccoli e attenzione costante.
            </p>

            <ul className="mt-5 space-y-3 text-sm text-stone-700 dark:text-emerald-50/80 md:mt-6">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span><b className="text-emerald-700 dark:text-emerald-400">Controllo reale</b> su ogni passaggio</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span><b className="text-emerald-700 dark:text-emerald-400">Aromi integri</b> grazie a lavorazioni delicate</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span><b className="text-emerald-700 dark:text-emerald-400">Stabilità</b> con stoccaggio protetto</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row md:mt-8 md:gap-3">
              <Link href="/produzione" className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400">
                Scopri la produzione <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/olio" className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-800 transition-all hover:bg-emerald-100 dark:border-emerald-600/30 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                Le qualità dell&apos;olio
              </Link>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-7">
            <div className={`overflow-hidden rounded-[2rem]  bg-white p-4 shadow-xl dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:shadow-2xl dark:shadow-black/40 md:rounded-[2.5rem] md:p-8 ${styles.cardTransparent}`} ref={headerRef}>
              {/* Header */}
              <div className="flex items-start gap-3 md:gap-4" ref={specsRef}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg dark:from-emerald-500 dark:to-green-600 md:h-14 md:w-14">
                  <Leaf className="h-5 w-5 md:h-7 md:w-7" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-emerald-600 dark:text-emerald-400 md:text-xs">
                    <span className="h-px w-4 bg-emerald-500" />
                    CARTA DI PRODUZIONE
                  </div>
                  <div className="mt-0.5 font-serif text-base text-stone-900 dark:text-white md:mt-1 md:text-xl">Metodo BIO – Artigianale</div>
                  <div className="mt-1 text-xs text-stone-500 dark:text-emerald-200/50 md:text-sm">Qualità da filiera corta, non da volumi industriali.</div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:gap-4">
                <Spec icon={<Layers className="h-3.5 w-3.5 md:h-4 md:w-4" />} label="Produzione" value="Piccoli lotti" />
                <Spec icon={<Thermometer className="h-3.5 w-3.5 md:h-4 md:w-4" />} label="Lavorazione" value="Temp. controllata" />
                <Spec icon={<Route className="h-3.5 w-3.5 md:h-4 md:w-4" />} label="Filiera" value="Tracciabilità" />
                <Spec icon={<ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4" />} label="Stoccaggio" value="Acciaio • Buio" />
              </div>

              <div className="my-4 h-px bg-stone-200 dark:bg-emerald-800/30 md:my-6" />

              {/* Process */}
              <div ref={processRef}>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-widest text-emerald-600 dark:text-emerald-400 md:mb-4 md:text-xs">
                  <span className="h-px w-4 bg-emerald-500" />
                  PROCESSO
                </div>
                <div className="grid gap-2 sm:grid-cols-2 md:gap-3">
                  <ProcessCard n="01" icon={<Leaf className="h-3.5 w-3.5 md:h-4 md:w-4" />} title="Raccolta selettiva" text="Cura del frutto e conferimento rapido" setCardRef={setProcessCardRef(0)} setNumRef={setProcessNumRef(0)} />
                  <ProcessCard n="02" icon={<Snowflake className="h-3.5 w-3.5 md:h-4 md:w-4" />} title="Frangitura a freddo" text="Lavorazione precisa per preservare profumi" setCardRef={setProcessCardRef(1)} setNumRef={setProcessNumRef(1)} />
                  <ProcessCard n="03" icon={<Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />} title="Separazione pulita" text="Controllo per profilo sensoriale nitido" setCardRef={setProcessCardRef(2)} setNumRef={setProcessNumRef(2)} />
                  <ProcessCard n="04" icon={<Warehouse className="h-3.5 w-3.5 md:h-4 md:w-4" />} title="Conservazione protetta" text="Acciaio e condizioni stabili" setCardRef={setProcessCardRef(3)} setNumRef={setProcessNumRef(3)} />
                </div>
              </div>

              <div className="my-4 h-px bg-stone-200 dark:bg-emerald-800/30 md:my-6" />

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 md:gap-4" ref={guaranteeRef}>
                <GuaranteeCard icon={<Factory className="h-4 w-4 md:h-5 md:w-5" />} title="Non industriale" text="Qualità prima della quantità" setRef={setGuaranteeRef(0)} />
                <GuaranteeCard icon={<Sparkles className="h-4 w-4 md:h-5 md:w-5" />} title="Fresco e pulito" text="Olio vivo e aromatico" setRef={setGuaranteeRef(1)} />
                <GuaranteeCard icon={<CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />} title="Controllo totale" text="Ogni fase curata" setRef={setGuaranteeRef(2)} />
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-stone-200 pt-4 dark:border-emerald-800/30 md:mt-6 md:pt-5">
                <div className="flex items-center gap-2 text-[10px] tracking-widest text-stone-500 dark:text-emerald-400/70 md:text-xs">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  PRODUZIONE BIO • ARTIGIANALE
                </div>
                <Link href="/produzione" className="group flex items-center gap-1 text-xs tracking-widest text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 md:text-sm">
                  Dettagli <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 md:h-4 md:w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-4 flex justify-end md:mt-6">
              <div className="h-1 w-20 rounded-full bg-emerald-500 md:w-24" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  n,
  icon,
  title,
  text,
  setCardRef,
  setNumRef,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  setCardRef: (el: HTMLDivElement | null) => void;
  setNumRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={setCardRef} className="group flex gap-2.5 rounded-2xl border border-stone-200 bg-stone-50 p-2.5 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800/30 dark:bg-emerald-900/30 dark:hover:border-emerald-600/40 dark:hover:bg-emerald-900/50 md:gap-3 md:p-4">
      <div ref={setNumRef} className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-emerald-600 text-[10px] font-bold text-white shadow-md dark:bg-emerald-500 md:h-8 md:w-8 md:text-xs">{n}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-400">{icon}</span>
          <span className="truncate text-sm font-medium text-stone-900 dark:text-white">{title}</span>
        </div>
        <p className="mt-0.5 text-[10px] leading-snug text-stone-500 dark:text-emerald-200/50 md:text-xs">{text}</p>
      </div>
    </div>
  );
}

function GuaranteeCard({ icon, title, text, setRef }: { icon: React.ReactNode; title: string; text: string; setRef: (el: HTMLDivElement | null) => void; }) {
  return (
    <div ref={setRef} className="group rounded-2xl border border-stone-200 bg-stone-50 p-2 text-center transition-all hover:border-emerald-300 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:hover:border-emerald-600/40 md:p-4">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-800/40 dark:text-emerald-400 dark:group-hover:bg-emerald-500 md:h-10 md:w-10">
        {icon}
      </div>
      <div className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-stone-700 dark:text-emerald-200 md:mt-2 md:text-[10px]">{title}</div>
      <div className="mt-0.5 text-[8px] leading-tight text-stone-500 dark:text-emerald-300/50 md:text-[11px]">{text}</div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="text-emerald-600 dark:text-emerald-400">{icon}</div>
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-wider text-stone-400 dark:text-emerald-500/60 md:text-[10px]">{label}</div>
        <div className="truncate text-xs font-medium text-stone-900 dark:text-emerald-50 md:text-sm">{value}</div>
      </div>
    </div>
  );
}