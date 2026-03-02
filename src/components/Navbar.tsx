"use client";


import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link as LocaleLink, usePathname, routing } from "@/i18n/routing";
import CartButton from "@/components/CartButton";
import {
  Menu,
  User,
  ShoppingBag,
  Store,
  ChevronDown,
  X,
  ArrowUpRight,
  Instagram,
  Facebook,
  MapPin,
  Home,
  Droplets,
} from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const LOCALE_NAMES: Record<string, string> = {
  it: "Italiano",
  en: "English",
  de: "Deutsch",
  nl: "Nederlands",
  da: "Dansk",
  no: "Norsk",
};

const FlagIcon = ({ locale, className }: { locale: string; className?: string }) => {
  const flags: Record<string, React.ReactNode> = {
    it: (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="1" height="2" fill="#009246" />
        <rect width="1" height="2" x="1" fill="#fff" />
        <rect width="1" height="2" x="2" fill="#ce2b37" />
      </svg>
    ),
    en: (
      <svg viewBox="0 0 60 30" className={className}>
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    ),
    de: (
      <svg viewBox="0 0 5 3" className={className}>
        <rect width="5" height="3" y="0" fill="#000" />
        <rect width="5" height="2" y="1" fill="#D00" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    ),
    nl: (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="3" height="2" fill="#AE1C28" />
        <rect width="3" height="1.33" y="0.66" fill="#FFF" />
        <rect width="3" height="0.66" y="1.33" fill="#21468B" />
      </svg>
    ),
    da: (
      <svg viewBox="0 0 37 28" className={className}>
        <rect width="37" height="28" fill="#C8102E" />
        <rect x="12" width="4" height="28" fill="#FFF" />
        <rect y="12" width="37" height="4" fill="#FFF" />
      </svg>
    ),
    no: (
      <svg viewBox="0 0 22 16" className={className}>
        <rect width="22" height="16" fill="#BA0C2F" />
        <path d="M0,8h22M8,0v16" stroke="#fff" strokeWidth="4" />
        <path d="M0,8h22M8,0v16" stroke="#00205B" strokeWidth="2" />
      </svg>
    )
  };
  return flags[locale] || null;
};

export default function Navbar() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();

  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTicking, setIsTicking] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lastScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement | null>(null);
  const tickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fix hydration - wait for mount
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // Top info ticker
  const tickerItems = [
    { id: "t1", text: t("ticker.shipping") },
    { id: "t2", text: t("ticker.artisanal") },
    { id: "t3", text: t("ticker.tastings") },
  ];

  useEffect(() => {
    if (!mounted) return;

    const interval = window.setInterval(() => {
      setIsTicking(true);
      tickerTimeoutRef.current = setTimeout(() => {
        setTickerIndex((i) => (i + 1) % tickerItems.length);
        setIsTicking(false);
      }, 400);
    }, 4000);

    return () => {
      window.clearInterval(interval);
      if (tickerTimeoutRef.current) clearTimeout(tickerTimeoutRef.current);
    };
  }, [mounted, tickerItems.length]);

  // Smart scroll behavior
  useEffect(() => {
    if (!mounted) return;

    let rafId: number;
    let currentScrollY = 0;

    const onScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 20);

        if (window.innerWidth >= 768) {
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setHidden(true);
          } else {
            setHidden(false);
          }
        } else {
          setHidden(false);
        }

        lastScrollY.current = currentScrollY;
        rafId = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  // Close lang dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Mobile drawer: esc + body/html lock
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    const html = document.documentElement;

    if (mobileOpen) {
      document.addEventListener("keydown", onKeyDown);

      // Lock scroll on both body + html (more robust across browsers)
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      html.style.overflow = "hidden";
      html.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      html.style.overflow = "";
      html.style.touchAction = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      html.style.overflow = "";
      html.style.touchAction = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/storia", label: t("navbar.storia") },
    { href: "/produzione", label: t("navbar.frantoio") },
    { href: "/il-nostro-olio", label: t("navbar.olio") },
    { href: "/degustazioni", label: t("navbar.degustazioni") },
  ];

  const rightLinks = [
    { href: "/shop", label: t("navbar.shop") },
    { href: "/contatti", label: t("navbar.contatti") },
  ];

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <>
        <div className="h-[98px] md:h-[118px]" aria-hidden="true" />
        <header className="fixed top-0 left-0 w-full z-50 bg-white">
          <div className="w-full bg-stone-950 text-stone-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-7 md:h-8 items-center justify-center">
                <span className="text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase text-stone-300">
                  {tickerItems[0].text}
                </span>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-[70px] md:h-[86px]">
              <div className="flex items-center gap-8 flex-1">
                <div className="md:hidden w-6" />
                <div className="hidden md:flex items-center gap-8 lg:gap-12">
                  {navLinks.map((link) => (
                    <span
                      key={link.href}
                      className="text-[13px] font-medium tracking-[0.1em] text-stone-600 uppercase"
                    >
                      {link.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 px-4">
                <div className="relative h-[40px] w-[140px] md:h-[50px] md:w-[180px] lg:h-[56px] lg:w-[200px]">
                  <div className="bg-stone-200 rounded animate-pulse w-full h-full" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-6 flex-1">
                <div className="hidden md:flex items-center gap-8 lg:gap-12">
                  {rightLinks.map((link) => (
                    <span
                      key={link.href}
                      className="text-[13px] font-medium tracking-[0.1em] text-stone-600 uppercase"
                    >
                      {link.label}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 md:gap-3">
                  <div className="hidden md:block w-20" />
                  <div className="h-4 w-px bg-stone-200 hidden md:block" />
                  <div className="hidden md:block w-10 h-10" />
                  <div className="md:hidden w-10 h-10" />
                  <div className="hidden md:block w-10 h-10" />
                </div>
              </div>
            </nav>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      {/* Spacer */}
      <div
        className="h-[98px] md:h-[118px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        aria-hidden="true"
      />

      {/* HEADER UNIFICATO */}
      <header
        className={[
          "fixed top-0 left-0 w-full z-50",
          "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hidden
            ? "md:-translate-y-[calc(100%+20px)] translate-y-0"
            : "translate-y-0",
        ].join(" ")}
      >
        {/* TOP INFO BAR */}
        <div className="w-full bg-stone-950 text-stone-100 border-b border-stone-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-7 md:h-8 items-center justify-center overflow-hidden">
              {tickerItems.map((item, idx) => {
                const isActive = idx === tickerIndex;
                return (
                  <div
                    key={item.id}
                    className={[
                      "absolute inset-0 flex items-center justify-center",
                      "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isActive && !isTicking
                        ? "opacity-100 translate-y-0 scale-100"
                        : isActive && isTicking
                          ? "opacity-0 -translate-y-2 scale-95"
                          : "opacity-0 translate-y-2 scale-95",
                    ].join(" ")}
                    aria-hidden={!isActive}
                  >
                    <span className="flex items-center gap-2 text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase text-stone-300">
                      <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* NAVBAR PRINCIPALE - Senza riga inferiore */}
        <div
          className={[
            "w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            scrolled
              ? "bg-white/95 backdrop-blur-xl shadow-xl"
              : "bg-white shadow-md",
          ].join(" ")}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-[70px] md:h-[86px]">
              {/* LEFT */}
              <div className="flex items-center gap-8 flex-1">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden group flex items-center gap-2 text-stone-800 hover:text-green-700 transition-all duration-300"
                  aria-label={t("navbar.open_menu")}
                >
                  <div className="flex flex-col gap-[5px] w-6 relative">
                    <span className="block h-[2px] w-full bg-current transition-all duration-300 ease-out group-hover:w-4 group-hover:translate-x-1" />
                    <span className="block h-[2px] w-4 bg-current transition-all duration-300 ease-out group-hover:w-full" />
                    <span className="block h-[2px] w-full bg-current transition-all duration-300 ease-out group-hover:w-4 group-hover:translate-x-1" />
                  </div>
                  <span className="text-xs font-medium tracking-[0.2em] uppercase hidden sm:block">
                    {t("navbar.menu")}
                  </span>
                </button>

                <div className="hidden md:flex items-center gap-8 lg:gap-12">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href}>
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* CENTER: Logo */}
              <div className="flex-shrink-0 px-4">
                <LocaleLink href="/" className="block relative group">
                  <div className="relative h-[40px] w-[140px] md:h-[50px] md:w-[180px] lg:h-[56px] lg:w-[200px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 200px"
                    />
                  </div>
                </LocaleLink>
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-end gap-6 flex-1">
                <div className="hidden md:flex items-center gap-8 lg:gap-12">
                  {rightLinks.map((link) => (
                    <NavLink key={link.href} href={link.href}>
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center gap-1 md:gap-3">
                  <div className="hidden md:block relative" ref={langRef}>
                    <button
                      type="button"
                      onClick={() => setLangOpen((v) => !v)}
                      className={[
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 rounded-full",
                        langOpen
                          ? "bg-stone-100 text-stone-900"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-50",
                      ].join(" ")}
                      aria-haspopup="menu"
                      aria-expanded={langOpen}
                    >
                      <FlagIcon locale={locale} className="h-3 w-5 rounded-[1px] shadow-sm" />
                      <span className="uppercase tracking-[0.1em]">{locale}</span>
                      <ChevronDown
                        className={[
                          "h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                          langOpen ? "rotate-180" : "",
                        ].join(" ")}
                        strokeWidth={2}
                      />
                    </button>

                    <div
                      className={[
                        "absolute right-0 top-full mt-2 w-28 rounded-xl border border-stone-100 bg-white/95 backdrop-blur-md py-2 shadow-xl",
                        "origin-top-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        langOpen
                          ? "scale-100 opacity-100 translate-y-0"
                          : "scale-95 opacity-0 -translate-y-2 pointer-events-none",
                      ].join(" ")}
                      role="menu"
                    >
                      {routing.locales.map((l, idx) => (
                        <LocaleLink
                          key={l}
                          href={pathname}
                          locale={l}
                          className={[
                            "flex items-center gap-3 w-full px-4 py-2.5 text-left text-xs font-medium tracking-wider transition-all duration-200 uppercase",
                            l === locale
                              ? "text-green-700 bg-green-50/80"
                              : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
                          ].join(" ")}
                          onClick={() => setLangOpen(false)}
                          style={{
                            transitionDelay: langOpen ? `${idx * 50}ms` : "0ms",
                          }}
                        >
                          <FlagIcon locale={l} className="h-2.5 w-4 rounded-[1px] shadow-sm shrink-0" />
                          {l}
                        </LocaleLink>
                      ))}
                    </div>
                  </div>

                  <div className="h-4 w-px bg-stone-200 hidden md:block" />

                  <div className="hidden md:block">
                    <CartButton
                      icon={
                        <ShoppingBag
                          className="w-[18px] h-[18px] md:w-5 md:h-5"
                          strokeWidth={1.5}
                        />
                      }
                      className="h-9 w-9 md:h-10 md:w-10 hover:bg-stone-100 rounded-full transition-all duration-300"
                      badgeColor="green"
                    />
                  </div>

                  <LocaleLink
                    href="/login"
                    className="md:hidden flex items-center justify-center h-10 w-10 text-stone-800 hover:text-green-700 hover:bg-stone-100 rounded-full transition-all duration-300"
                    aria-label="Account"
                  >
                    <User className="h-6 w-6" strokeWidth={1.5} />
                  </LocaleLink>

                  <LocaleLink
                    href="/login"
                    className="hidden md:flex items-center justify-center h-9 w-9 md:h-10 md:w-10 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-300"
                    aria-label="Account"
                  >
                    <User
                      className="h-[18px] w-[18px] md:h-5 md:w-5"
                      strokeWidth={1.5}
                    />
                  </LocaleLink>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={[
          "fixed inset-0 z-[60] md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-0 bg-stone-900/30 backdrop-blur-sm transition-all duration-500",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={[
            "absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl",
            "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-stone-100">
            <LocaleLink
              href="/"
              onClick={() => setMobileOpen(false)}
              className="relative h-10 w-32"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain object-left"
                sizes="128px"
              />
            </LocaleLink>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-all duration-300"
              aria-label={t("navbar.close_menu")}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          {/* ✅ scroll attivo ma scrollbar nascosta */}
          <div className="flex flex-col h-[calc(100%-72px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex-1 px-6 py-8">
              <div className="space-y-1">
                {[
                  ...navLinks,
                  { href: "/shop", label: t("navbar.shop") },
                  { href: "/blog", label: t("navbar.blog") || "Blog" },
                  { href: "/contatti", label: t("navbar.contatti") }
                ].map((link, idx) => (
                  <LocaleLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "group flex items-center justify-between py-4 border-b border-stone-100",
                      "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      mobileOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-8",
                    ].join(" ")}
                    style={{
                      transitionDelay: mobileOpen ? `${100 + idx * 75}ms` : "0ms",
                    }}
                  >
                    <span className="text-2xl font-light text-stone-800 group-hover:text-green-700 transition-colors duration-300">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 text-stone-400 group-hover:text-green-600 transition-all duration-300"
                      strokeWidth={1.5}
                    />
                  </LocaleLink>
                ))}
              </div>

              <div
                className={[
                  "mt-8 space-y-3 transition-all duration-500",
                  mobileOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4",
                ].join(" ")}
                style={{ transitionDelay: mobileOpen ? "500ms" : "0ms" }}
              >
                <LocaleLink
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-stone-50 text-stone-700 hover:bg-stone-100 transition-all duration-300"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-sm font-medium tracking-wide">
                    {t("navbar.login")}
                  </span>
                </LocaleLink>

                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-stone-50">
                  <MapPin className="h-5 w-5 text-stone-500" strokeWidth={1.5} />
                  <div className="flex items-center gap-2">
                    <FlagIcon locale="it" className="h-3 w-5 rounded-[1px] shadow-sm" />
                    <span className="text-sm font-medium text-stone-600">
                      {t("navbar.location")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={[
                "border-t border-stone-100 px-6 pt-5 bg-stone-50/50 transition-all duration-500",
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              ].join(" ")}
              style={{
                transitionDelay: mobileOpen ? "600ms" : "0ms",
                paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))",
              }}
            >
              {/* Social icons row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <SocialIcon href="https://instagram.com" label="Instagram">
                    <Instagram className="h-5 w-5" strokeWidth={1.5} />
                  </SocialIcon>
                  <SocialIcon href="https://facebook.com" label="Facebook">
                    <Facebook className="h-5 w-5" strokeWidth={1.5} />
                  </SocialIcon>
                  <SocialIcon href="https://tiktok.com" label="TikTok">
                    <TikTokIcon className="h-5 w-5" />
                  </SocialIcon>
                </div>
                <span className="text-[10px] font-medium tracking-[0.15em] text-stone-400 uppercase">
                  {t("navbar.language")}
                </span>
              </div>

              {/* Language grid — 3 columns × 2 rows */}
              <div className="grid grid-cols-3 gap-2">
                {routing.locales.map((l) => (
                  <LocaleLink
                    key={l}
                    href={pathname}
                    locale={l}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex flex-col items-center pt-3 pb-2.5 px-2 rounded-2xl border transition-all duration-200 active:scale-95",
                      l === locale
                        ? "bg-stone-900 border-stone-900 shadow-md"
                        : "bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50 shadow-sm",
                    ].join(" ")}
                  >
                    <FlagIcon
                      locale={l}
                      className="h-4 w-6 rounded-[2px] shadow-sm mb-2"
                    />
                    <span
                      className={[
                        "text-[10px] font-semibold tracking-wide leading-tight",
                        l === locale
                          ? "text-white"
                          : "text-stone-500",
                      ].join(" ")}
                    >
                      {LOCALE_NAMES[l] ?? l.toUpperCase()}
                    </span>
                  </LocaleLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM BAR - Semplificata e pulita */}
      <div
        className={[
          "md:hidden fixed left-0 right-0 bottom-0 z-[55]",
          "bg-white",
          "transition-all duration-500",
          mobileOpen ? "translate-y-full" : "translate-y-0",
        ].join(" ")}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="mx-auto max-w-md px-4">
          <div className="flex h-[72px] items-center justify-between">
            <MobileBottomButton
              href="/"
              icon={<Home className="h-5 w-5" strokeWidth={1.5} />}
              label="Home"
            />

            <MobileBottomButton
              href="/shop"
              icon={<Store className="h-5 w-5" strokeWidth={1.5} />}
              label="Shop"
            />

            {/* ✅ CART centrale - verde + icona bianca (forzato) */}
            <div className="relative -top-2 flex flex-col items-center">
              <CartButton
                icon={<ShoppingBag className="w-5 h-5" strokeWidth={1.5} />}
                className="h-12 w-12 rounded-full !bg-green-700 hover:!bg-green-800 !text-white shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center"
                badgeColor="default"
              />
              <span className="mt-1 text-[10px] font-medium tracking-wider text-stone-600 uppercase">
                {t("navbar.cart")}
              </span>
            </div>

            <MobileBottomButton
              href="/il-nostro-olio"
              icon={<Droplets className="h-5 w-5" strokeWidth={1.5} />}
              label="Olio"
            />

            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col items-center gap-1 px-2 py-1 text-stone-600 hover:text-green-700 transition-colors"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium tracking-wider uppercase">
                {t("navbar.menu")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Components

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <LocaleLink
      href={href}
      className="group relative py-2 text-[13px] font-medium tracking-[0.1em] text-stone-600 hover:text-stone-900 transition-colors duration-300 uppercase"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </LocaleLink>
  );
}

function MobileBottomButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <LocaleLink
      href={href}
      className="flex flex-col items-center gap-1 px-2 py-1 text-stone-600 hover:text-green-700 transition-colors active:scale-95"
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wider uppercase">
        {label}
      </span>
    </LocaleLink>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex items-center justify-center h-10 w-10 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-all duration-300"
    >
      {children}
    </a>
  );
}