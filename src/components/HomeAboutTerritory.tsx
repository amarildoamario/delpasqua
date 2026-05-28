"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { useScrollTextReveal } from "./useScrollTextReveal";

type TerritoryCopy = {
  label: string;
  titleStart: string;
  titleAccent: string;
  description: string;
};

const TERRITORY_COPY: Record<string, TerritoryCopy> = {
  it: {
    label: "Chi siamo",
    titleStart: "La Toscana e il nostro ",
    titleAccent: "territorio",
    description:
      "Nel cuore della Toscana, tra colline, oliveti e tradizioni tramandate nel tempo, nasce il carattere autentico del nostro olio e del nostro vino. Ogni raccolta racconta una storia vera fatta di paesaggio, persone e gesti ripetuti bene.",
  },
  en: {
    label: "About us",
    titleStart: "Tuscany and our ",
    titleAccent: "territory",
    description:
      "In the heart of Tuscany, among hills, olive groves, and traditions handed down over time, the authentic character of our oil and our wine takes shape. Every harvest tells a real story of landscape, people, and carefully repeated gestures.",
  },
  de: {
    label: "Uber uns",
    titleStart: "Die Toskana und unser ",
    titleAccent: "Gebiet",
    description:
      "Im Herzen der Toskana, zwischen Hugeln, Olivenhainen und uberlieferten Traditionen, entsteht der authentische Charakter unseres Ols und unseres Weins. Jede Ernte erzahlt eine echte Geschichte aus Landschaft, Menschen und sorgfaltig wiederholten Handgriffen.",
  },
  nl: {
    label: "Over ons",
    titleStart: "Toscane en ons ",
    titleAccent: "territorium",
    description:
      "In het hart van Toscane, tussen heuvels, olijfgaarden en doorgegeven tradities, ontstaat het authentieke karakter van onze olie en onze wijn. Elke oogst vertelt een echt verhaal van landschap, mensen en zorgvuldig herhaalde gebaren.",
  },
  no: {
    label: "Om oss",
    titleStart: "Toscana og vart ",
    titleAccent: "territorium",
    description:
      "I hjertet av Toscana, mellom aaser, olivenlunder og tradisjoner som er fort videre, formes den autentiske karakteren til oljen og vinen var. Hver innhosting forteller en ekte historie om landskap, mennesker og velutforte bevegelser.",
  },
  da: {
    label: "Om os",
    titleStart: "Toscana og vores ",
    titleAccent: "territorium",
    description:
      "I hjertet af Toscana, mellem bakker, olivenlunde og traditioner givet videre gennem tiden, formes den autentiske karakter i vores olie og vores vin. Hver host fortaeller en aekte historie om landskab, mennesker og veludforte bevagelser.",
  },
};

export default function HomeAboutTerritory() {
  const locale = useLocale();
  const copy = TERRITORY_COPY[locale] ?? TERRITORY_COPY.en;
  const textRef = useRef<HTMLDivElement | null>(null);

  useScrollTextReveal(textRef);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1c2416] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: "url('/home_component_chi_siamo/frantoio_alto.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,5,0.48)_0%,rgba(5,8,5,0.58)_45%,rgba(5,8,5,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_32%)]" />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-20 sm:px-10 lg:px-16">
        <div ref={textRef} className="mx-auto max-w-4xl text-center">
          <div data-reveal-text className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/84">
            {copy.label}
          </div>

          <h2 data-reveal-text className="font-serif text-4xl font-light leading-[1.02] tracking-[0.01em] text-white sm:text-5xl lg:text-[4rem]">
            {copy.titleStart}
            <span className="italic">{copy.titleAccent}</span>
          </h2>

          <p data-reveal-text className="mx-auto mt-6 max-w-[48rem] text-[15px] leading-8 text-white/88 sm:text-base">
            {copy.description}
          </p>
        </div>
      </div>
    </section>
  );
}
