"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

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
      el.style.transform = `translate3d(${odd ? "-10px" : "10px"}, 18px, 0) rotate(${
        odd ? "0.9deg" : "-0.9deg"
      })`;
      el.style.filter = "blur(10px)";
      el.style.willChange = "transform, opacity, filter";

      el.animate(
        [
          {
            opacity: 0,
            transform: `translate3d(${odd ? "-10px" : "10px"}, 18px, 0) rotate(${
              odd ? "0.9deg" : "-0.9deg"
            })`,
            filter: "blur(10px)",
          },
          { opacity: 1, transform: "translate3d(0,0,0) rotate(0deg)", filter: "blur(0px)" },
        ],
        {
          duration: 860,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );
    };

    const animateNumberIn = (el: HTMLElement) => {
      el.getAnimations?.().forEach((a) => a.cancel());
      el.style.opacity = "0";
      el.style.transform = "translate3d(0,10px,0) rotate(-10deg) scale(0.75)";
      el.style.filter = "blur(8px)";
      el.style.willChange = "transform, opacity, filter";

      // “Stamp/flip + bounce”
      el.animate(
        [
          {
            opacity: 0,
            transform: "translate3d(0,10px,0) rotate(-10deg) scale(0.75)",
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            transform: "translate3d(0,-2px,0) rotate(2deg) scale(1.06)",
            filter: "blur(0px)",
          },
          { opacity: 1, transform: "translate3d(0,0,0) rotate(0deg) scale(1)", filter: "blur(0px)" },
        ],
        {
          duration: 780,
          easing: "cubic-bezier(0.2, 1, 0.2, 1)",
          fill: "forwards",
        }
      );
    };

    const all: Array<HTMLElement | null> = [headerRef.current, specsRef.current, processRef.current, guaranteeRef.current];

    // Set initial state for major blocks
    all.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translate3d(0, 16px, 0) rotate(${i % 2 ? "0.6deg" : "-0.6deg"})`;
      el.style.filter = "blur(10px)";
      el.style.willChange = "transform, opacity, filter";
    });

    processCardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translate3d(${i % 2 ? "-10px" : "10px"}, 18px, 0) rotate(${i % 2 ? "0.9deg" : "-0.9deg"})`;
      el.style.filter = "blur(10px)";
      el.style.willChange = "transform, opacity, filter";
    });

    guaranteeCardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translate3d(${i % 2 ? "10px" : "-10px"}, 16px, 0) rotate(${i % 2 ? "-0.7deg" : "0.7deg"})`;
      el.style.filter = "blur(10px)";
      el.style.willChange = "transform, opacity, filter";
    });

    processNumRefs.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translate3d(0,10px,0) rotate(-10deg) scale(0.75)";
      el.style.filter = "blur(8px)";
      el.style.willChange = "transform, opacity, filter";
    });

    const played = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target as HTMLElement;
          if (played.has(el)) continue;
          played.add(el);

          const kind = el.getAttribute("data-kind") ?? "block";
          const idx = Number(el.getAttribute("data-idx") ?? "0");
          const delay = Math.min(idx * 90, 360);

          if (kind === "num") {
            setTimeout(() => animateNumberIn(el), delay);
            io.unobserve(el);
            continue;
          }

          setTimeout(() => animateCardIn(el, idx), delay);
          io.unobserve(el);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );

    // Observe major blocks
    all.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("data-kind", "block");
      el.setAttribute("data-idx", String(i));
      io.observe(el);
    });

    // Observe process cards + numbers
    processCardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("data-kind", "card");
      el.setAttribute("data-idx", String(i + 2));
      io.observe(el);
    });

    processNumRefs.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("data-kind", "num");
      el.setAttribute("data-idx", String(i));
      io.observe(el);
    });

    // Observe guarantee cards
    guaranteeCardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("data-kind", "card");
      el.setAttribute("data-idx", String(i + 6));
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* LEFT COPY */}
          <div className="md:col-span-5">
            <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">METODO BIO</div>

            <h2 className="mt-2 font-serif text-3xl tracking-[0.08em] text-zinc-900 dark:text-white md:text-4xl">
              Piccola scala.
              <br className="hidden md:block" /> Qualità controllata.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Un olio artigianale non nasce da una linea industriale: nasce da tempi corretti, lotti piccoli e attenzione
              costante. Così preserviamo profumi, freschezza e identità sensoriale.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
              <Bullet>
                <b className="font-medium">Controllo reale</b> su ogni passaggio, senza compromessi da produzione di massa.
              </Bullet>
              <Bullet>
                <b className="font-medium">Aromi integri</b> grazie a lavorazioni delicate e temperature controllate.
              </Bullet>
              <Bullet>
                <b className="font-medium">Stabilità</b> con stoccaggio protetto e gestione accurata.
              </Bullet>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produzione"
                className="inline-flex items-center gap-2 border border-black/10 bg-zinc-900 px-5 py-2.5 text-sm tracking-[0.10em] text-white hover:bg-zinc-800 dark:border-white/15 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Scopri la produzione <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/olio"
                className="inline-flex items-center gap-2 border border-black/10 bg-white px-5 py-2.5 text-sm tracking-[0.10em] text-zinc-900 hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:text-white dark:hover:bg-white/5"
              >
                Le qualità dell’olio <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT “TECH SHEET” */}
          <div className="md:col-span-7">
            <div className="border border-black/10 bg-white shadow-sm dark:border-white/12 dark:bg-zinc-950">
              <div className="p-6 md:p-8">
                {/* Header + Specs */}
                <div className="grid gap-6 md:grid-cols-12 md:items-start">
                  <div className="md:col-span-7" ref={headerRef}>
                    <div className="flex items-start gap-4">
                      <StampBio />
                      <div>
                        <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">CARTA DI PRODUZIONE</div>
                        <div className="mt-1 font-serif text-xl tracking-[0.08em] text-zinc-900 dark:text-white">
                          Metodo BIO – Artigianale
                        </div>
                        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                          Qualità da filiera corta, non da volumi industriali.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ FIX SPECS: no overflow + icone verdi + accento verde */}
                  <div className="md:col-span-5" ref={specsRef}>
  <div className="border border-black/10 border-l-2 border-l-emerald-600/35 bg-white/70 p-4 dark:border-white/15 dark:border-l-emerald-400/25 dark:bg-black/30">
    <div className="mb-3 h-[2px] w-16 bg-emerald-600/40 dark:bg-emerald-400/35" />

    <div className="space-y-3">
      <SpecRow k="Produzione" v="Piccoli lotti" icon={<IconLayers />} />
      <SpecRow k="Lavorazione" v="Temperatura controllata" icon={<IconThermo />} />
      <SpecRow k="Filiera" v="Tracciabilità interna" icon={<IconRoute />} />
      <SpecRow k="Stoccaggio" v="Acciaio • Buio • Stabilità" icon={<IconShield />} />
    </div>
  </div>
</div>
                </div>

                <div className="mt-6 h-px bg-black/10 dark:bg-white/10" />

                {/* Process */}
                <div className="mt-6" ref={processRef}>
                  <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">PROCESSO</div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <ProcessItem
                      idx={0}
                      setCardRef={(el) => (processCardRefs.current[0] = el)}
                      setNumRef={(el) => (processNumRefs.current[0] = el)}
                      n="01"
                      icon={<IconLeaf />}
                      title="Raccolta selettiva"
                      text="Cura del frutto e conferimento rapido: si lavora sulla freschezza."
                    />
                    <ProcessItem
                      idx={1}
                      setCardRef={(el) => (processCardRefs.current[1] = el)}
                      setNumRef={(el) => (processNumRefs.current[1] = el)}
                      n="02"
                      icon={<IconSnow />}
                      title="Frangitura a freddo"
                      text="Lavorazione precisa per preservare profumi, equilibrio e complessità."
                    />
                    <ProcessItem
                      idx={2}
                      setCardRef={(el) => (processCardRefs.current[2] = el)}
                      setNumRef={(el) => (processNumRefs.current[2] = el)}
                      n="03"
                      icon={<IconFilter />}
                      title="Separazione pulita"
                      text="Controllo del processo per un profilo sensoriale nitido."
                    />
                    <ProcessItem
                      idx={3}
                      setCardRef={(el) => (processCardRefs.current[3] = el)}
                      setNumRef={(el) => (processNumRefs.current[3] = el)}
                      n="04"
                      icon={<IconBarrel />}
                      title="Conservazione protetta"
                      text="Acciaio e condizioni stabili per mantenere qualità nel tempo."
                    />
                  </div>
                </div>

                <div className="mt-7 h-px bg-black/10 dark:bg-white/10" />

                {/* Guarantees */}
                <div className="mt-6" ref={guaranteeRef}>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Guarantee
                      setRef={(el) => (guaranteeCardRefs.current[0] = el)}
                      icon={<IconNoFactory />}
                      title="Non industriale"
                      text="Scelte orientate alla qualità, non alla quantità."
                    />
                    <Guarantee
                      setRef={(el) => (guaranteeCardRefs.current[1] = el)}
                      icon={<IconSparkle />}
                      title="Fresco e pulito"
                      text="Aromi netti, equilibrio, e sensazione di olio “vivo”."
                    />
                    <Guarantee
                      setRef={(el) => (guaranteeCardRefs.current[2] = el)}
                      icon={<IconCheck />}
                      title="Controllo continuo"
                      text="Ogni fase è curata fino alla bottiglia."
                    />
                  </div>

                  <div className="mt-7 flex items-center justify-between gap-4">
                    <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                      PRODUZIONE BIO • ARTIGIANALE • PICCOLA SCALA
                    </div>
                    <Link
                      href="/produzione"
                      className="text-sm tracking-[0.10em] text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                    >
                      Dettagli <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 h-px w-16 bg-zinc-300/70 dark:bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- UI bits ---------- */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-[7px] h-1.5 w-1.5 bg-emerald-600/70 dark:bg-emerald-400/60" />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

/* ✅ overflow-safe, compatto, pro */
function SpecRow({ k, v, icon }: { k: string; v: string; icon: React.ReactNode }) {
  return (
    <div className="relative pl-9">
      {/* icon */}
      <span className="absolute left-0 top-[2px] text-emerald-600 dark:text-emerald-400">
        {icon}
      </span>

      {/* label */}
      <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {k.toUpperCase()}
      </div>

      {/* value */}
      <div className="mt-1 text-sm leading-snug text-zinc-900 dark:text-zinc-100">
        {v}
      </div>

      {/* divider */}
      <div className="mt-3 h-px bg-black/5 dark:bg-white/10" />
    </div>
  );
}


function ProcessItem({
  n,
  title,
  text,
  icon,
  idx,
  setCardRef,
  setNumRef,
}: {
  n: string;
  title: string;
  text: string;
  icon: React.ReactNode;
  idx: number;
  setCardRef: (el: HTMLDivElement | null) => void;
  setNumRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={setCardRef}
      className="border border-black/10 bg-white/70 p-4 dark:border-white/15 dark:bg-black/30"
      data-idx={idx}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            ref={setNumRef}
            className="grid h-10 w-10 place-items-center border border-black/15 bg-white/80 text-xs tracking-[0.22em] text-zinc-700 shadow-sm dark:border-white/20 dark:bg-black/40 dark:text-zinc-200"
          >
            {n}
          </div>

          {/* ✅ verde */}
          <div className="text-emerald-600 dark:text-emerald-400">{icon}</div>
        </div>

        <div className="h-px flex-1 bg-black/10 dark:bg-white/10 mt-[14px]" />
      </div>

      <div className="mt-3 font-serif text-base tracking-[0.06em] text-zinc-900 dark:text-white">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{text}</div>
    </div>
  );
}

function Guarantee({
  title,
  text,
  icon,
  setRef,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={setRef} className="border border-black/10 bg-zinc-50 p-4 dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center gap-2">
        {/* ✅ verde */}
        <span className="text-emerald-600 dark:text-emerald-400">{icon}</span>
        <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">{title.toUpperCase()}</div>
      </div>

      <div className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{text}</div>
    </div>
  );
}

function StampBio() {
  return (
    <div className="grid h-14 w-14 place-items-center border border-black/15 bg-white/70 shadow-sm dark:border-white/20 dark:bg-black/30">
      <svg
        className="h-7 w-7 text-emerald-700 dark:text-emerald-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2c2.8 2.4 4.8 5.3 5.5 8.5" />
        <path d="M12 2C9.2 4.4 7.2 7.3 6.5 10.5" />
        <path d="M6.7 11.5c2.2.3 3.9-.6 5.3-2" />
        <path d="M17.3 11.5c-2.2.3-3.9-.6-5.3-2" />
        <path d="M7.2 14.2c1.6 3.3 4 5.8 4.8 7.8" />
        <path d="M16.8 14.2c-1.6 3.3-4 5.8-4.8 7.8" />
      </svg>
    </div>
  );
}

/* ---------- Icons (inline, no deps) ---------- */

function I({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-5 w-5 items-center justify-center">{children}</span>;
}

function IconLeaf() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 3C10 3 4 9 4 15c0 3 2 6 6 6 6 0 11-6 10-18z" />
        <path d="M8 15c3-1 6-4 8-8" />
      </svg>
    </I>
  );
}

function IconSnow() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M4.5 6.5l15 11" />
        <path d="M19.5 6.5l-15 11" />
        <path d="M7 4.5l10 17" />
        <path d="M17 4.5L7 21.5" />
      </svg>
    </I>
  );
}

function IconFilter() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16" />
        <path d="M7 12h10" />
        <path d="M10 19h4" />
        <path d="M6 5l6 8v6" />
        <path d="M18 5l-6 8" />
      </svg>
    </I>
  );
}

function IconBarrel() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h10" />
        <path d="M7 21h10" />
        <path d="M6 3c2 3 2 15 0 18" />
        <path d="M18 3c-2 3-2 15 0 18" />
        <path d="M7 12h10" />
      </svg>
    </I>
  );
}

function IconLayers() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </svg>
    </I>
  );
}

function IconThermo() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0z" />
        <path d="M12 17a1.5 1.5 0 0 0 0-3" />
      </svg>
    </I>
  );
}

function IconRoute() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M6 15c2-6 6-6 12-10" />
      </svg>
    </I>
  );
}

function IconShield() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
      </svg>
    </I>
  );
}

function IconNoFactory() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M6 21V8l6 3V8l6 3v10" />
        <path d="M3 3l18 18" />
      </svg>
    </I>
  );
}

function IconSparkle() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l1.2 4.2L17 7.5l-3.8 1.3L12 13l-1.2-4.2L7 7.5l3.8-1.3L12 2z" />
        <path d="M5 14l.8 2.6L8 17.5l-2.2.9L5 21l-.8-2.6L2 17.5l2.2-.9L5 14z" />
      </svg>
    </I>
  );
}

function IconCheck() {
  return (
    <I>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </I>
  );
}
