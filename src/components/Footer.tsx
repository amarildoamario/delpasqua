"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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

  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] text-stone-300">
      {/* Gradient overlay per profondità */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-transparent pointer-events-none" />

      {/* Glow decorativo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="font-serif text-2xl tracking-[0.12em] text-stone-100">
              FRANTOIO DEL PASQUA
            </div>
            <div className="mt-2 text-xs tracking-[0.2em] text-emerald-500 font-medium">
              SRL
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
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-xs tracking-[0.16em] text-emerald-500 font-medium">
              <span className="h-px w-4 bg-emerald-500/50" />
              {t("contacts.title")}
            </div>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="mt-0.5 p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="leading-relaxed text-stone-400 group-hover:text-stone-300 transition-colors">
                  {t("contacts.address")}
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <a
                  className="text-stone-400 hover:text-emerald-400 transition-colors"
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
                  className="text-stone-400 hover:text-emerald-400 transition-colors"
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
                  className="text-stone-400 hover:text-emerald-400 transition-colors"
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
            </ul>
          </div>
        </div>

        {/* Divider con gradient */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-stone-500">
            {t("bottom.rights", { year: new Date().getFullYear() })}
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
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Label */}
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] tracking-[0.2em] text-stone-600 uppercase font-medium">
                {t("bottom.powered_by")}
              </span>
            </div>

            {/* Tech Stack Icons */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              <TechItem label="Next.js">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </TechItem>

              <TechItem label="React">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c-1.1 0-2 .9-2 2 0 .4.1.7.3 1-.6.1-1.2.3-1.8.5-.6.2-1.1.5-1.6.8s-.9.7-1.3 1.1c-.4.4-.7.9-1 1.4-.3.5-.5 1-.7 1.6-.2.6-.3 1.2-.4 1.8-.1.3-.3.5-.6.5s-.6-.2-.6-.5c0-.6.1-1.2.3-1.8.2-.6.4-1.1.7-1.6.3-.5.7-1 1.1-1.4.4-.4.9-.8 1.4-1.1.5-.3 1.1-.6 1.7-.8.6-.2 1.2-.4 1.9-.5.2-.3.5-.5.9-.5.4 0 .7.2.9.5.6.1 1.2.3 1.9.5.6.2 1.2.5 1.7.8.5.3 1 .7 1.4 1.1.4.4.8.9 1.1 1.4.3.5.5 1 .7 1.6.2.6.3 1.2.3 1.8 0 .3-.3.5-.6.5s-.5-.2-.6-.5c-.1-.6-.2-1.2-.4-1.8-.2-.6-.4-1.1-.7-1.6-.3-.5-.6-1-1-1.4-.4-.4-.8-.8-1.3-1.1s-1-.6-1.6-.8c-.6-.2-1.2-.4-1.8-.5.2-.3.3-.6.3-1 0-1.1-.9-2-2-2zm0 4.5c-2.5 0-4.8.6-6.7 1.6-1.9 1-3.4 2.4-4.4 4.1-1 1.7-1.5 3.6-1.5 5.6 0 2 1.1 3.7 2.8 4.6 1.7.9 3.8 1.1 5.9.6 2.1-.5 4.2-1.6 6-3.1 1.8-1.5 3.2-3.3 4-5.3.8-2 1-4 .6-5.9-.4-1.9-1.4-3.5-2.8-4.6-1.4-1.1-3.2-1.7-5.1-1.7-.6 0-1.2 0-1.8.1zm0 2c.5 0 1 0 1.5.1 1.4.2 2.6.8 3.5 1.7.9.9 1.5 2.1 1.7 3.5.2 1.4-.1 2.9-.8 4.3-.7 1.4-1.8 2.7-3.2 3.7-1.4 1-3 1.7-4.6 1.9-1.6.2-3.1-.1-4.3-.8-1.2-.7-2-1.8-2.2-3.2-.2-1.4.1-2.9.8-4.3.7-1.4 1.8-2.7 3.2-3.7 1.4-1 3-1.7 4.6-1.9.5-.1 1-.1 1.5-.1zm0 2.5c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5z" />
                </svg>
              </TechItem>

              <TechItem label="TypeScript">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v18H3V3zm10.5 10.5v-1.8H9v1.2h1.5V18h1.5v-4.5h1.5v-1.5h-1.5zm3 3.75c0 .75-.45 1.2-1.2 1.2-.45 0-.9-.15-1.2-.45l-.75.9c.45.45 1.05.75 1.95.75 1.35 0 2.25-.75 2.25-2.1 0-1.35-1.35-1.65-1.95-1.8-.3-.075-.525-.15-.525-.45 0-.3.225-.525.6-.525.375 0 .75.15 1.05.375l.6-.975c-.45-.375-1.05-.6-1.65-.6-1.2 0-2.1.675-2.1 1.95 0 1.2.825 1.65 1.8 1.875.45.075.675.225.675.525z" />
                </svg>
              </TechItem>

              <TechItem label="Stripe">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                </svg>
              </TechItem>

              <TechItem label="Vercel">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L24 22H0L12 1z" />
                </svg>
              </TechItem>

              <div className="h-4 w-px bg-stone-800 mx-2" />

              <div className="flex items-center gap-2 text-[10px] text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                {t("bottom.secure_payments")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- components ---------- */

function TechItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group flex items-center gap-2 text-stone-500 hover:text-emerald-400 transition-colors cursor-default">
      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
        {children}
      </div>
      <span className="text-[10px] tracking-wider uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </div>
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