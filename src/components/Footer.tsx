"use client";

import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { companyInfo } from "@/lib/companyInfo";
import PaymentMethodsBadges from "@/components/PaymentMethodsBadges";
import {
  ArrowUp,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Facebook,
  Instagram
} from "lucide-react";

export default function Footer() {
  const t = useTranslations("Common.footer");
  const tNav = useTranslations("Common.navbar");
  const locale = useLocale();

  const selectionLinks = {
    it: [
      { href: "/olio-toscano", label: "Olio Extravergine Toscano" },
      { href: "/olio-biologico", label: "Olio EVO Biologico" },
      { href: "/nuovo-raccolto", label: "Olio Nuovo Raccolto" },
      { href: "/olio-5-litri", label: "Latta da 5 Litri" }
    ],
    en: [
      { href: "/olio-toscano", label: "Tuscan Extra Virgin Oil" },
      { href: "/olio-biologico", label: "Organic EVO Oil" },
      { href: "/nuovo-raccolto", label: "New Harvest Olive Oil" },
      { href: "/olio-5-litri", label: "5 Liters Can" }
    ],
    de: [
      { href: "/olio-toscano", label: "Toskanisches Olivenöl" },
      { href: "/olio-biologico", label: "Bio-Olivenöl extra" },
      { href: "/nuovo-raccolto", label: "Frische Olivenernte" },
      { href: "/olio-5-litri", label: "5-Liter-Kanister" }
    ],
    nl: [
      { href: "/olio-toscano", label: "Toscaanse Olijfolie" },
      { href: "/olio-biologico", label: "Biologische Olijfolie" },
      { href: "/nuovo-raccolto", label: "Nieuwe Oogst" },
      { href: "/olio-5-litri", label: "5 Liter Blik" }
    ],
    da: [
      { href: "/olio-toscano", label: "Toscansk Olivenolie" },
      { href: "/olio-biologico", label: "Økologisk Olivenolie" },
      { href: "/nuovo-raccolto", label: "Ny Høst" },
      { href: "/olio-5-litri", label: "5 Liters Dunk" }
    ],
    no: [
      { href: "/olio-toscano", label: "Toskansk Olivenolje" },
      { href: "/olio-biologico", label: "Økologisk Olivenolje" },
      { href: "/nuovo-raccolto", label: "Ny Høst" },
      { href: "/olio-5-litri", label: "5 Liters Kanne" }
    ]
  };

  const currentSelectionLinks = selectionLinks[locale as keyof typeof selectionLinks] || selectionLinks.it;
  const selectionsLabel = {
    it: "Le nostre Selezioni",
    en: "Our Selections",
    de: "Unsere Auswahlen",
    nl: "Onze Selecties",
    da: "Vores Udvalg",
    no: "Vårt Utvalg"
  }[locale] || "Le nostre Selezioni";

  const navLinks = [
    { href: "/", label: tNav("home") },
    { href: "/storia", label: tNav("about_us") },
    { href: "/il-nostro-olio", label: tNav("olio") },
    { href: "/produzione", label: tNav("frantoio") },
    { href: "/degustazioni", label: tNav("degustazioni") },
    { href: "/shop", label: tNav("shop") },
    { href: "/blog", label: tNav("blog") },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] text-stone-300">
      {/* Gradient overlay per profondità */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-transparent pointer-events-none" />

      {/* Glow decorativo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[1360px] px-6 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
          {/* Brand */}
          <div className="md:col-span-3">
            <div className="font-serif text-2xl tracking-[0.08em] text-stone-100 uppercase leading-snug">
              Frantoio
              <br />
              Del Pasqua
            </div>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone-400">
              {t("brand.description")}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <SocialIcon
                href="https://facebook.com/"
                label="Facebook"
                icon={<Facebook className="h-5 w-5" />}
              />
              <SocialIcon
                href="https://instagram.com/"
                label="Instagram"
                icon={<Instagram className="h-5 w-5" />}
              />
            </div>
          </div>

          {/* Contatti */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 text-xs tracking-[0.16em] text-emerald-500 font-medium">
              <span className="h-px w-4 bg-emerald-500/50" />
              {t("contacts.title")}
            </div>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="leading-relaxed text-stone-400 group-hover:text-stone-300 transition-colors font-sans">
                  {companyInfo.addressSingleLine}
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <a
                  className="text-stone-400 hover:text-emerald-400 transition-colors font-sans"
                  href="tel:+390575810065"
                  aria-label="Chiama"
                >
                  +39 0575 810065
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <a
                  className="text-stone-400 hover:text-emerald-400 transition-colors font-sans"
                  href="mailto:info@delpasqua.com"
                  aria-label="Email"
                >
                  info@delpasqua.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <Link
                  href="/parita-di-genere"
                  className="text-stone-400 hover:text-emerald-400 transition-colors font-sans"
                >
                  {t("contacts.gender_policy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Link utili */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 text-xs tracking-[0.16em] text-emerald-500 font-medium">
              <span className="h-px w-4 bg-emerald-500/50" />
              {t("info.title")}
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <Link className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors" href="/privacy">
                  <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                  {t("info.privacy")}
                </Link>
              </li>
              <li>
                <Link className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors" href="/cookie">
                  <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                  {t("info.cookie")}
                </Link>
              </li>
              <li>
                <Link className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors" href="/termini">
                  <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                  {t("info.terms")}
                </Link>
              </li>
              <li>
                <Link className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors" href="/spedizioni">
                  <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                  {t("info.shipping")}
                </Link>
              </li>
              <li>
                <Link className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors" href="/resi">
                  <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                  {t("info.returns")}
                </Link>
              </li>
              <li>
                <Link className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors" href="/contatti">
                  <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                  {t("info.contacts")}
                </Link>
              </li>
              <li>
                <Link className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors" href="/smaltimenti">
                  <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                  {t("info.disposal")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigazione */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 text-xs tracking-[0.16em] text-emerald-500 font-medium">
              <span className="h-px w-4 bg-emerald-500/50" />
              {t("navigation.title")}
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="group flex items-center gap-2 text-stone-400 hover:text-emerald-400 transition-colors"
                    href={link.href}
                  >
                    <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Quick Links Bar */}
        <div className="mt-16 border-t border-stone-900/60 pt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-center text-xs text-stone-500">
          <span className="font-semibold tracking-[0.1em] text-emerald-500/80 uppercase sm:border-r sm:border-stone-800/80 sm:pr-6 whitespace-nowrap">
            {selectionsLabel}
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2">
            {currentSelectionLinks.map((link, idx) => (
              <span key={idx} className="flex items-center gap-3">
                {idx > 0 && <span className="hidden sm:inline text-stone-850">•</span>}
                <Link href={link.href} className="hover:text-emerald-400 transition-colors font-sans font-medium">
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>

        {/* Divider con gradient */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-stone-500">
            <div>{t("bottom.rights", { year: new Date().getFullYear() })}</div>
            <div className="mt-1 text-[11px] leading-relaxed text-stone-600">
              {t("bottom.legal_office")}: {companyInfo.addressLegal}
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/50 px-5 py-2.5 text-xs text-stone-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
            aria-label={t("bottom.back_to_top")}
            title={t("bottom.back_to_top")}
          >
            {t("bottom.back_to_top")}
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* TECH STACK BAR - Sezione più scura */}
      <div className="relative bg-[#050505] border-t border-stone-900">
        <div className="mx-auto max-w-[1360px] px-6 py-8 md:px-8 lg:px-12">
          {/* Metodi di Pagamento Sicuri */}
          <div className="flex flex-col gap-4">
            <PaymentMethodsBadges dark />
            <div className="flex items-center gap-2 text-[10px] text-stone-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
              {t("bottom.secure_payments")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-stone-800 bg-stone-900 text-stone-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-stone-800 transition-all"
    >
      {icon}
    </a>
  );
}
