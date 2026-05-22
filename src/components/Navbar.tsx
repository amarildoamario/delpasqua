"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import "./Navbar-Styles.css";

import CartButton from "@/components/CartButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link as LocaleLink, routing, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ChevronDown,
  Facebook,
  Home,
  Instagram,
  MapPin,
  Menu,
  ShoppingBag,
  Store,
  Droplets,
  User,
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
        <clipPath id="nav-flag-en">
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
        <rect width="5" height="2" y="1" fill="#d00" />
        <rect width="5" height="1" y="2" fill="#ffce00" />
      </svg>
    ),
    nl: (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="3" height="2" fill="#ae1c28" />
        <rect width="3" height="1.33" y="0.66" fill="#fff" />
        <rect width="3" height="0.66" y="1.33" fill="#21468b" />
      </svg>
    ),
    da: (
      <svg viewBox="0 0 37 28" className={className}>
        <rect width="37" height="28" fill="#c8102e" />
        <rect x="12" width="4" height="28" fill="#fff" />
        <rect y="12" width="37" height="4" fill="#fff" />
      </svg>
    ),
    no: (
      <svg viewBox="0 0 22 16" className={className}>
        <rect width="22" height="16" fill="#ba0c2f" />
        <path d="M0,8h22M8,0v16" stroke="#fff" strokeWidth="4" />
        <path d="M0,8h22M8,0v16" stroke="#00205b" strokeWidth="2" />
      </svg>
    ),
  };

  return flags[locale] || null;
};

export default function Navbar() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const tickerItems = [
    { id: "t1", text: t("ticker.shipping") },
    { id: "t2", text: t("ticker.artisanal") },
    { id: "t3", text: t("ticker.family_mill") },
    { id: "t4", text: t("ticker.tastings") },
  ];

  const repeatedTickerItems = Array(10).fill(tickerItems).flat();

  const navLinks = [
    { href: "/", label: t("navbar.home") },
    { href: "/storia", label: t("navbar.about_us") },
    { href: "/shop", label: t("navbar.shop") },
    { href: "/produzione", label: t("navbar.frantoio") },
    { href: "/degustazioni", label: t("navbar.degustazioni") },
    { href: "/contatti", label: t("navbar.contatti") },
  ];

  const mobileLinks = [
    { href: "/", label: t("navbar.home") },
    { href: "/storia", label: t("navbar.about_us") },
    { href: "/shop", label: t("navbar.shop") },
    { href: "/produzione", label: t("navbar.frantoio") },
    { href: "/degustazioni", label: t("navbar.degustazioni") },
    { href: "/blog", label: t("navbar.blog") || "Blog" },
    { href: "/contatti", label: t("navbar.contatti") },
  ];


  useEffect(() => {
    if (!mounted) return;

    let rafId = 0;

    const onScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 20);

        if (window.innerWidth >= 768) {
          setHidden(currentScrollY > lastScrollY.current && currentScrollY > 100);
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

  if (!mounted) {
    return (
      <>
        <div className="h-[98px] md:h-[118px]" aria-hidden="true" />
        <header className="fixed top-0 left-0 z-50 w-full bg-[#fdfaf7] font-sans">
          <div className="w-full border-b border-[#0c1e13]/80 bg-[#132c1c] text-stone-100">
            <div className="w-full">
              <div className="relative flex h-7 items-center justify-center overflow-hidden md:h-8">
                <div className="marquee-container">
                  <div className="marquee-track">
                    {repeatedTickerItems.map((item, idx) => (
                      <span key={`${item.id}-${idx}`} className="marquee-item">
                        {item.text}
                        <span className="marquee-separator">|</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-4">
            <nav className="flex h-[70px] items-center justify-between md:h-[86px]">
              {/* LOGO (Far left) */}
              <div className="flex-shrink-0 -ml-8 md:ml-0">
                <div className="relative h-[40px] w-[140px] md:h-[50px] md:w-[180px] lg:h-[56px] lg:w-[200px]">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 200px"
                  />
                </div>
              </div>

              {/* DESKTOP NAV LINKS (Centered/Left-aligned next to logo) */}
              <div className="hidden flex-1 items-center gap-5 pl-4 md:flex lg:gap-6 xl:gap-7">
                {navLinks.map((link) => (
                  <span
                    key={link.href}
                    className="text-[13px] font-medium uppercase tracking-[0.1em] text-stone-600"
                  >
                    {link.label}
                  </span>
                ))}
              </div>

              {/* ACTIONS (Far right) */}
              <div className="flex items-center gap-1 md:gap-3">
                <div className="hidden w-20 md:block" />
                <div className="hidden h-4 w-px bg-stone-200 md:block" />
                <div className="hidden h-10 w-10 md:block" />
                <div className="hidden h-10 w-10 md:block" />

                {/* Mobile hamburger placeholder */}
                <div className="group inline-flex items-center gap-2 p-2 pr-0 text-stone-800 md:hidden">
                  <span className="flex w-6 flex-col gap-[5px]">
                    <span className="block h-[2px] w-full bg-current" />
                    <span className="block h-[2px] w-4 bg-current" />
                    <span className="block h-[2px] w-full bg-current" />
                  </span>
                  <span className="hidden text-xs font-medium uppercase tracking-[0.2em] sm:block">
                    {t("navbar.menu")}
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </header>
      </>
    );
  }

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <div className="h-[98px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:h-[118px]" aria-hidden="true" />

      <header
        className={cn(
          "fixed top-0 left-0 z-50 w-full font-sans transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hidden ? "translate-y-0 md:-translate-y-[calc(100%+20px)]" : "translate-y-0"
        )}
      >
        <div className="w-full border-b border-[#0c1e13]/80 bg-[#132c1c] text-stone-100">
          <div className="w-full">
            <div className="relative flex h-7 items-center justify-center overflow-hidden md:h-8">
              <div className="marquee-container">
                <div className="marquee-track">
                  {repeatedTickerItems.map((item, idx) => (
                    <span key={`${item.id}-${idx}`} className="marquee-item">
                      {item.text}
                      <span className="marquee-separator">|</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            scrolled ? "bg-[#fdfaf7]/95 shadow-xl backdrop-blur-xl" : "bg-[#fdfaf7] shadow-md"
          )}
        >
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-4">
            <nav className="flex h-[70px] items-center justify-between md:h-[86px]">
              {/* LOGO (Far left) */}
              <div className="flex-shrink-0 -ml-8 md:ml-0">
                <LocaleLink href="/" className="group block">
                  <div className="relative h-[40px] w-[140px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03] md:h-[50px] md:w-[180px] lg:h-[56px] lg:w-[200px]">
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

              {/* DESKTOP NAV LINKS (Left/Center-aligned next to logo) */}
              <div className="hidden flex-1 items-center gap-5 pl-4 md:flex lg:gap-6 xl:gap-7">
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* ACTIONS (Far right: language flag dropdown, BARRA, Cart icon, burger button on mobile) */}
              <div className="flex items-center gap-1 md:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wider text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 md:flex">
                    <FlagIcon locale={locale} className="h-3 w-5 rounded-[1px] shadow-sm" />
                    <span className="uppercase tracking-[0.1em]">{locale}</span>
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-28 p-1.5">
                    {routing.locales.map((l) => (
                      <DropdownMenuLinkItem
                        key={l}
                        closeOnClick
                        render={(props) => <LocaleLink {...props} href={pathname} locale={l} />}
                        className={l === locale ? "bg-green-50 text-green-700" : undefined}
                      >
                        <FlagIcon locale={l} className="h-2.5 w-4 shrink-0 rounded-[1px] shadow-sm" />
                        {l}
                      </DropdownMenuLinkItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* BARRA */}
                <div className="hidden h-4 w-px bg-stone-200 md:block" />

                {/* Cart icon */}
                <div className="hidden md:block">
                  <CartButton
                    icon={<ShoppingBag className="h-5 w-5" strokeWidth={1.5} />}
                    className="h-10 w-10 rounded-full transition-all duration-300 hover:bg-stone-100"
                    badgeColor="green"
                  />
                </div>

                {/* Desktop account */}
                <LocaleLink
                  href="/login"
                  className="hidden h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-all duration-300 hover:bg-stone-100 hover:text-stone-900 md:flex"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </LocaleLink>

                {/* Mobile hamburger menu (top right) */}
                <SheetTrigger
                  className="group inline-flex items-center gap-2 p-2 pr-0 text-stone-800 transition-colors hover:text-green-700 md:hidden"
                  aria-label={t("navbar.open_menu")}
                >
                  <span className="flex w-6 flex-col gap-[5px]">
                    <span className="block h-[2px] w-full bg-current transition-all duration-300 group-hover:w-4 group-hover:translate-x-1" />
                    <span className="block h-[2px] w-4 bg-current transition-all duration-300 group-hover:w-full" />
                    <span className="block h-[2px] w-full bg-current transition-all duration-300 group-hover:w-4 group-hover:translate-x-1" />
                  </span>
                  <span className="hidden text-xs font-medium uppercase tracking-[0.2em] sm:block">
                    {t("navbar.menu")}
                  </span>
                </SheetTrigger>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <SheetContent side="left" hideClose className="max-w-sm border-r border-stone-200">
        <div className="flex h-[72px] items-center justify-between border-b border-stone-100 px-6">
          <LocaleLink href="/" onClick={() => setMobileOpen(false)} className="relative h-10 w-32">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain object-left"
              sizes="128px"
            />
          </LocaleLink>

          <SheetClose
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-900"
            aria-label={t("navbar.close_menu")}
          >
            <span className="sr-only">{t("navbar.close_menu")}</span>
            <span className="relative block h-5 w-5">
              <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </SheetClose>
        </div>

        <SheetTitle className="sr-only">{t("navbar.menu")}</SheetTitle>
        <SheetDescription className="sr-only">Mobile navigation drawer</SheetDescription>

        <div className="flex flex-1 flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex-1 px-6 py-8">
            <div className="space-y-1">
              {mobileLinks.map((link) => (
                <LocaleLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center justify-between border-b border-stone-100 py-4 transition-colors hover:text-green-700"
                >
                  <span className="text-2xl font-light text-stone-800 transition-colors group-hover:text-green-700">
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-stone-400 transition-colors group-hover:text-green-600" strokeWidth={1.5} />
                </LocaleLink>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <LocaleLink
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3.5 text-stone-700 transition-colors hover:bg-stone-100"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-sm font-medium tracking-wide">{t("navbar.login")}</span>
              </LocaleLink>

              <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3.5">
                <MapPin className="h-5 w-5 text-stone-500" strokeWidth={1.5} />
                <div className="flex items-center gap-2">
                  <FlagIcon locale="it" className="h-3 w-5 rounded-[1px] shadow-sm" />
                  <span className="text-sm font-medium text-stone-600">{t("navbar.location")}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="border-t border-stone-100 bg-stone-50/50 px-6 pt-5"
            style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
          >
            <div className="mb-5 flex items-center justify-between">
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
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone-400">
                {t("navbar.language")}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {routing.locales.map((l) => (
                <LocaleLink
                  key={l}
                  href={pathname}
                  locale={l}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex flex-col items-center rounded-2xl border px-2 pt-3 pb-2.5 shadow-sm transition-all hover:border-stone-200 hover:bg-stone-50 active:scale-95",
                    l === locale ? "border-stone-900 bg-stone-900 shadow-md" : "border-stone-100 bg-white"
                  )}
                >
                  <FlagIcon locale={l} className="mb-2 h-4 w-6 rounded-[2px] shadow-sm" />
                  <span
                    className={cn(
                      "text-[10px] font-semibold leading-tight tracking-wide",
                      l === locale ? "text-white" : "text-stone-500"
                    )}
                  >
                    {LOCALE_NAMES[l] ?? l.toUpperCase()}
                  </span>
                </LocaleLink>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>

      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 z-[55] bg-white transition-all duration-500 md:hidden",
          mobileOpen ? "translate-y-full" : "translate-y-0"
        )}
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

            <div className="relative -top-2 flex flex-col items-center">
              <CartButton
                icon={<ShoppingBag className="h-5 w-5" strokeWidth={1.5} />}
                className="flex h-12 w-12 items-center justify-center rounded-full !bg-green-700 !text-white shadow-lg transition-all duration-200 active:scale-95 hover:!bg-green-800"
                badgeColor="default"
              />
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-stone-600">
                {t("navbar.cart")}
              </span>
            </div>

            <MobileBottomButton
              href="/il-nostro-olio"
              icon={<Droplets className="h-5 w-5" strokeWidth={1.5} />}
              label="Olio"
            />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex flex-col items-center gap-1 px-2 py-1 text-stone-600 transition-colors hover:text-green-700"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {t("navbar.menu")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

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
      className="group relative py-2 text-[13px] font-[560] uppercase tracking-[0.08em] text-stone-600 transition-colors duration-300 hover:text-green-600"
    >
      {children}
      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-green-500 transition-transform duration-500 group-hover:scale-x-100" />
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
      className="flex flex-col items-center gap-1 px-2 py-1 text-stone-600 transition-colors hover:text-green-700 active:scale-95"
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
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
      className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-all duration-300 hover:bg-stone-200/50 hover:text-stone-900"
    >
      {children}
    </a>
  );
}
