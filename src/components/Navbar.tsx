"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CartButton from "@/components/CartButton";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { 
  Menu, 
  User, 
  ShoppingBag, 
  Store, 
  ChevronDown,
  X,
  ArrowRight,
  Instagram,
  Facebook
} from "lucide-react";

// TikTok non esiste in Lucide, teniamo SVG custom o usiamo alternativa
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3v10.5a4.5 4.5 0 1 1-4.5-4.5" />
    <path d="M14 3c1.2 2.4 3.2 4 6 4v4c-2.8 0-4.8-1.1-6-2.6" />
  </svg>
);

export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    if (mobileOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navText =
    "text-sm tracking-[0.06em] text-gray-600 hover:text-gray-900 transition-colors duration-150 dark:text-gray-300 dark:hover:text-white";
  const topText =
    "text-xs tracking-[0.06em] text-gray-600 hover:text-gray-900 transition-colors duration-150 dark:text-gray-300 dark:hover:text-white";

  return (
    <>
      {/* MINI TOPBAR (NON sticky) */}
      <div className="w-full border-b border-black/5 bg-white dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3 text-xs tracking-[0.06em] text-gray-600 dark:text-gray-300">
            <span
              className="inline-flex h-4 w-6 overflow-hidden rounded-[3px] ring-1 ring-black/10 dark:ring-white/15"
              aria-label="Italia"
              title="Italia"
            >
              <span className="h-full w-1/3 bg-green-600" />
              <span className="h-full w-1/3 bg-white" />
              <span className="h-full w-1/3 bg-red-600" />
            </span>

            <span className="select-none">IT</span>
            <span className="h-4 w-px bg-black/10 dark:bg-white/10" />
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className={`flex items-center gap-2 ${topText}`}
                aria-haspopup="menu"
                aria-expanded={langOpen}
              >
                IT <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <div
                className={[
                  "absolute right-0 mt-3 w-28 rounded-md border bg-white py-1 shadow-sm",
                  "dark:border-white/10 dark:bg-zinc-900",
                  "origin-top-right transition-all duration-150",
                  langOpen
                    ? "scale-100 opacity-100 pointer-events-auto"
                    : "scale-95 opacity-0 pointer-events-none",
                ].join(" ")}
                role="menu"
              >
                <LangItem label="IT" onClick={() => setLangOpen(false)} />
                <LangItem label="EN" onClick={() => setLangOpen(false)} />
                <LangItem label="DE" onClick={() => setLangOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER MOBILE */}
      <div
        className={[
          "fixed inset-0 z-[60] md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={[
            "absolute inset-0 transition-opacity duration-200",
            "bg-black/25 dark:bg-black/40",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMobileOpen(false)}
          aria-label="Chiudi menu"
        />

        <div
          className={[
            "absolute left-0 top-0 h-full w-[86%] max-w-[360px]",
            "bg-white shadow-2xl dark:bg-zinc-950",
            "border-r border-black/10 dark:border-white/10",
            "transition-transform duration-250 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="h-12 border-b border-black/5 dark:border-white/10" />

          <div className="flex h-[84px] items-center justify-between px-5">
            <Link href="/" onClick={() => setMobileOpen(false)} aria-label="Home" className="flex items-center">
              <div className="relative h-[62px] w-[210px]">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  priority
                  sizes="210px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-2 text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10"
              aria-label="Chiudi"
              title="Chiudi"
            >
              <X className="h-7 w-7" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex h-[calc(100%-48px-84px)] flex-col">
            <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
              <MobileLink href="/shop" onClick={() => setMobileOpen(false)} primary>
                SHOP
              </MobileLink>

              <div className="my-4 h-px bg-black/10 dark:bg-white/10" />

              <div className="space-y-0">
                <MobileLink href="/storia" onClick={() => setMobileOpen(false)}>
                  STORIA
                </MobileLink>
                <MobileLink href="/produzione" onClick={() => setMobileOpen(false)}>
                  PRODUZIONE
                </MobileLink>
                <MobileLink href="/il-nostro-olio" onClick={() => setMobileOpen(false)}>
                  IL NOSTRO OLIO
                </MobileLink>
                <MobileLink href="/contatti" onClick={() => setMobileOpen(false)}>
                  CONTATTI
                </MobileLink>
              </div>

              <div className="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
                <MobileLink href="/login" onClick={() => setMobileOpen(false)}>
                  ACCOUNT
                </MobileLink>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs tracking-[0.08em] text-gray-600 dark:text-gray-300">
                    TEMA
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 px-5 py-4 dark:border-white/10">
              <div className="flex items-center justify-end gap-3">
                <SocialIcon href="https://instagram.com/" label="Instagram" onClick={() => setMobileOpen(false)}>
                  <Instagram className="h-5 w-5" strokeWidth={1.5} />
                </SocialIcon>
                <SocialIcon href="https://facebook.com/" label="Facebook" onClick={() => setMobileOpen(false)}>
                  <Facebook className="h-5 w-5" strokeWidth={1.5} />
                </SocialIcon>
                <SocialIcon href="https://tiktok.com/" label="TikTok" onClick={() => setMobileOpen(false)}>
                  <TikTokIcon className="h-5 w-5" />
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR PRINCIPALE (sticky) */}
      <div className="sticky top-0 z-50 w-full">
        <div className="w-full bg-white dark:bg-zinc-950">
          <nav className="mx-auto max-w-6xl px-6 py-0">
            {/* MOBILE TOP BAR */}
            <div className="md:hidden grid grid-cols-3 items-center h-[92px]">
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="rounded-full p-3 text-gray-700 hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10"
                  aria-label="Apri menu"
                  title="Menu"
                >
                  <Menu className="h-7 w-7" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex items-center justify-center">
                <Link href="/" aria-label="Home" className="flex items-center justify-center">
                  <div className="relative h-[64px] w-[230px]">
                    <Image src="/logo.png" alt="Logo" fill priority sizes="230px" className="object-contain" />
                  </div>
                </Link>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full p-3 text-gray-700 hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10"
                  aria-label="Account"
                  title="Account"
                >
                  <User className="h-6 w-6" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* DESKTOP (Lucide icons) */}
            <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="relative z-10 hidden items-center gap-10 md:flex">
                <NavLink href="/storia" className={navText}>
                  STORIA
                </NavLink>
                <NavLink href="/produzione" className={navText}>
                  PRODUZIONE
                </NavLink>
                <NavLink href="/il-nostro-olio" className={navText}>
                  OLIO
                </NavLink>
              </div>

              <div className="relative z-0 flex items-center justify-center">
                <Link href="/" aria-label="Home" className="flex items-center justify-center">
                  <div className="relative h-[78px] w-[360px] lg:h-[88px] lg:w-[480px]">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      fill
                      priority
                      sizes="(min-width: 1024px) 480px, 360px"
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>

              <div className="relative z-10 flex items-center justify-end gap-6">
                <div className="hidden items-center gap-10 md:flex">
                  <NavLink href="/shop" className={navText}>
                    SHOP
                  </NavLink>
                  <NavLink href="/contatti" className={navText}>
                    CONTATTI
                  </NavLink>
                </div>

                <div className="flex items-center gap-3">
                  {/* Desktop: Cart con icona Lucide e badge verde */}
                  <CartButton 
                    icon={<ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-200" strokeWidth={1.5} />}
                    className="h-10 w-10"
                    badgeColor="green"
                  />
                  
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-full p-2 text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10"
                    aria-label="Account"
                    title="Account"
                  >
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* MOBILE BOTTOM BAR - Lucide icons */}
      <div
        className={[
          "md:hidden fixed left-0 right-0 bottom-0 z-[55]",
          "transition-all duration-200 ease-out",
          mobileOpen ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
          "bg-white dark:bg-zinc-950",
          "border-t border-black/5 dark:border-white/10",
        ].join(" ")}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-hidden={mobileOpen}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-[76px] items-center justify-between">
            {/* SHOP - Store icon */}
            <Link
              href="/shop"
              className="relative inline-flex items-center justify-center rounded-full p-3 text-gray-800 hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10"
              aria-label="Shop"
              title="Shop"
            >
              <Store className="h-7 w-7" strokeWidth={1.5} />
            </Link>

            {/* CART - ShoppingBag icon con badge VERDE */}
            <CartButton 
              icon={<ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-200" strokeWidth={1.5} />}
              className="h-12 w-12"
              badgeColor="green"
              mobileOnly={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Shared Components ---------- */

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "flex items-center justify-between px-0 py-3",
        "text-sm tracking-[0.12em]",
        primary ? "text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-100",
        "hover:text-gray-900 dark:hover:text-white transition-colors",
      ].join(" ")}
    >
      <span>{children}</span>
      <span className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </span>
    </Link>
  );
}

function SocialIcon({
  href,
  label,
  children,
  onClick,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-full p-2 text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10"
    >
      {children}
    </a>
  );
}

function LangItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
      type="button"
      role="menuitem"
      onClick={onClick}
    >
      {label}
    </button>
  );
}