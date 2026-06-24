"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import FlagIcon from "@/components/FlagIcon";

import "./Navbar-Styles.css";

import CartButton from "@/components/CartButton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link as LocaleLink, routing, usePathname } from "@/i18n/routing";
import { findProductBySlug, getLocalizedProductSlug } from "@/lib/productSlugs";
import { mockBlogPosts } from "@/lib/blog-data";
import { findBlogPostBySlug, getLocalizedBlogHref, findCategoryNameBySlug, normalizeBlogSlug } from "@/lib/blogSlugs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ChevronDown,
  Facebook,
  Instagram,
  MapPin,
  ShoppingCart,
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
  es: "Español",
  fr: "Français",
  us: "English (US)",
};


type NavbarCatalogProduct = {
  id: string;
  slug?: string;
};

export default function Navbar({ initialCatalog }: { initialCatalog: NavbarCatalogProduct[] }) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams<{ prodotto?: string | string[]; slug?: string | string[]; category?: string | string[] }>();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [catalog, setCatalog] = useState<NavbarCatalogProduct[]>(initialCatalog);

  useEffect(() => {
    let alive = true;
    fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (alive && Array.isArray(data)) {
          setCatalog(data);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  // All localized variants of the "category" path segment, from pathnames.ts
  // it: "categoria", en: "category", de: "kategorie", nl: "categorie", da/no: "kategori"
  const BLOG_CATEGORY_SEGMENTS = new Set(["category", "categoria", "kategorie", "categorie", "kategori"]);
  const routeProduct = Array.isArray(params.prodotto) ? params.prodotto[0] : params.prodotto;
  const routeSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const routeCategory = Array.isArray(params.category) ? params.category[0] : params.category;

  function getLocaleSwitchHref(targetLocale: string) {
    const segments = pathname.split("/").filter(Boolean);

    // 1. Product details page: /shop/[prodotto] (e.g. /shop/vino-novello/)
    if (routeProduct && (pathname === "/shop/[prodotto]" || (segments[0] === "shop" && segments.length === 2))) {
      const currentSlug = routeProduct;
      const product = findProductBySlug(catalog, currentSlug);
      if (!product) return "/shop";

      return {
        pathname: "/shop/[prodotto]",
        params: { prodotto: getLocalizedProductSlug(product, targetLocale) },
      } as const;
    }

    // 2. Blog Category Post page: /blog/<categoria|category|kategorie|...>/[category]/[slug]
    //    usePathname() returns the localized path (e.g. "categoria" in Italian, "kategorie" in German)
    //    so we must check ALL localized variants, not just "category"
    if (
      routeSlug &&
      routeCategory &&
      (pathname === "/blog/category/[category]/[slug]" ||
        (segments[0] === "blog" && BLOG_CATEGORY_SEGMENTS.has(segments[1]) && segments.length === 4))
    ) {
      const currentSlug = routeSlug;
      const post = findBlogPostBySlug(mockBlogPosts, currentSlug);
      if (!post) return "/blog";

      return getLocalizedBlogHref(post, targetLocale);
    }

    // 3. Blog Category page: /blog/<categoria|category|...>/[category]
    if (
      routeCategory &&
      !routeSlug &&
      (pathname === "/blog/category/[category]" ||
        (segments[0] === "blog" && BLOG_CATEGORY_SEGMENTS.has(segments[1]) && segments.length === 3))
    ) {
      const currentCategory = routeCategory;
      const targetCategoryName = findCategoryNameBySlug(currentCategory, targetLocale);

      const targetCategorySlug = normalizeBlogSlug(targetCategoryName ?? currentCategory);

      return {
        pathname: "/blog/category/[category]",
        params: { category: targetCategorySlug },
      } as const;
    }

    // 4. Blog Post page (without category prefix): /blog/[slug]
    if (
      routeSlug &&
      !routeCategory &&
      (pathname === "/blog/[slug]" ||
        (segments[0] === "blog" && segments.length === 2 && !BLOG_CATEGORY_SEGMENTS.has(segments[1])))
    ) {
      const currentSlug = routeSlug;
      const post = findBlogPostBySlug(mockBlogPosts, currentSlug);
      if (!post) return "/blog";

      return getLocalizedBlogHref(post, targetLocale);
    }

    return pathname;
  }

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

  useEffect(() => {
    if (!languageOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && !languageMenuRef.current?.contains(target)) {
        setLanguageOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [languageOpen]);

  useEffect(() => {
    queueMicrotask(() => setLanguageOpen(false));
  }, [locale, pathname]);

  useEffect(() => {
    if (!mounted) return;

    const updateNavbarOffset = () => {
      const height = headerRef.current?.offsetHeight ?? (window.innerWidth >= 768 ? 118 : 98);
      const nextOffset = hidden && window.innerWidth >= 768 ? 0 : height;
      document.documentElement.style.setProperty("--main-navbar-offset", `${nextOffset}px`);
    };

    updateNavbarOffset();
    window.addEventListener("resize", updateNavbarOffset);
    window.visualViewport?.addEventListener("resize", updateNavbarOffset);

    return () => {
      window.removeEventListener("resize", updateNavbarOffset);
      window.visualViewport?.removeEventListener("resize", updateNavbarOffset);
    };
  }, [hidden, mounted]);

  if (!mounted) {
    return (
      <>
        <div className="h-[98px] md:h-[118px]" aria-hidden="true" />
        <header
          data-main-navbar
          data-navbar-hidden="false"
          className="fixed top-0 left-0 z-50 w-full bg-[#fdfaf7] font-sans"
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
              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden w-20 md:block" />
                <div className="hidden h-4 w-px bg-stone-200 md:block" />
                <div className="hidden h-10 w-10 md:block" />
                <div className="hidden h-10 w-10 md:block" />

                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-800 md:hidden">
                  <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                </div>

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
        ref={headerRef}
        data-main-navbar
        data-navbar-hidden={hidden ? "true" : "false"}
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
              <div className="flex items-center gap-2 md:gap-3">
                <div ref={languageMenuRef} className="relative hidden md:block">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={languageOpen}
                    aria-label={t("navbar.language")}
                    onClick={() => setLanguageOpen((open) => !open)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wider text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                  >
                    <FlagIcon locale={locale} className="h-3 w-5 rounded-[1px] shadow-sm" />
                    <span className="uppercase tracking-[0.1em]">{locale}</span>
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform", languageOpen && "rotate-180")}
                      strokeWidth={2}
                    />
                  </button>

                  {languageOpen && (
                    <div
                      role="menu"
                      aria-label={t("navbar.language")}
                      className="absolute top-full left-1/2 z-[9999] mt-2 w-28 -translate-x-1/2 overflow-hidden rounded-[5px] border border-stone-200/80 bg-white/95 p-1 text-stone-900 shadow-2xl backdrop-blur-xl outline-none"
                    >
                      {routing.locales.map((l) => (
                        <LocaleLink
                          key={l}
                          href={getLocaleSwitchHref(l)}
                          locale={l}
                          role="menuitem"
                          onClick={() => setLanguageOpen(false)}
                          className={cn(
                            "flex items-center gap-2 rounded-[3px] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] outline-none transition-colors",
                            l === locale
                              ? "bg-green-50/80 text-green-700"
                              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                          )}
                        >
                          <FlagIcon locale={l} className="h-2.5 w-4 shrink-0 rounded-[1px] shadow-sm" />
                          <span>{l}</span>
                        </LocaleLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* BARRA */}
                <div className="hidden h-4 w-px bg-stone-200 md:block" />

                {/* Cart icon */}
                <div className="hidden md:block">
                  <CartButton
                    icon={<ShoppingCart className="h-5 w-5" strokeWidth={1.5} />}
                    className="h-10 w-10 rounded-full transition-all duration-300 hover:bg-stone-100"
                    badgeColor="green"
                  />
                </div>

                {/* Desktop account */}
                <LocaleLink
                  href="/my-account"
                  className="hidden h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-all duration-300 hover:bg-stone-100 hover:text-stone-900 md:flex"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </LocaleLink>

                <CartButton
                  icon={<ShoppingCart className="h-5 w-5" strokeWidth={1.5} />}
                  ariaLabel={t("navbar.cart")}
                  mobileOnly
                  className="h-10 w-10 rounded-full border border-black/10 bg-white text-stone-800 transition-all duration-300 hover:bg-stone-100 hover:text-green-700"
                  badgeColor="green"
                />

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
                href="/my-account"
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
                  href={getLocaleSwitchHref(l)}
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
