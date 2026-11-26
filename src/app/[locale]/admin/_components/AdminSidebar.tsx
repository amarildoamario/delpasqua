"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgePercent,
  BellRing,
  ChartNoAxesCombined,
  FileDown,
  FileText,
  ListChecks,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Settings2,
  Tags,
  UsersRound,
  Webhook,
  CalendarClock,
  Ticket,
  Coins,
  Mail,
  MousePointerClick,
  Store,
  LogOut,
  Menu,
  X,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface AdminBadgeCounts {
  toShip: number;
  outboxIssues: number;
  webhookIssues: number;
  pendingTastings: number;
  unreadMessages: number;
}

interface NavItemConfig {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeVariant?: "orders" | "tastings" | "messages" | "system";
  badgePulse?: boolean;
}

interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

function ProminentBadge({
  count,
  variant = "orders",
  pulse = false,
}: {
  count?: number;
  variant?: "orders" | "tastings" | "messages" | "system";
  pulse?: boolean;
}) {
  if (!count || count <= 0) return null;

  // Ultra-evident high-contrast glowing badges for VS Code dark grey
  const variantStyles = {
    orders:
      "bg-[#f97316] text-white shadow-[0_0_10px_rgba(249,115,22,0.4)] ring-1 ring-orange-400/50",
    tastings:
      "bg-[#8b5cf6] text-white shadow-[0_0_10px_rgba(139,92,246,0.4)] ring-1 ring-purple-400/50",
    messages:
      "bg-[#0ea5e9] text-white shadow-[0_0_10px_rgba(14,165,233,0.4)] ring-1 ring-sky-400/50",
    system:
      "bg-[#ef4444] text-white shadow-[0_0_10px_rgba(239,68,68,0.45)] ring-1 ring-red-400/50 animate-pulse",
  };

  const selectedStyle = variantStyles[variant] || variantStyles.orders;

  return (
    <div className="relative ml-auto flex items-center shrink-0">
      {pulse && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 ring-1 ring-white/60" />
        </span>
      )}
      <span
        className={`inline-flex min-w-[22px] h-[20px] items-center justify-center rounded-full px-2 text-[11px] font-black tracking-tight leading-none text-center shadow-sm ${selectedStyle}`}
      >
        {count > 99 ? "99+" : count}
      </span>
    </div>
  );
}

function SidebarNavItem({
  item,
  active,
  onClick,
}: {
  item: NavItemConfig;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group flex items-center gap-3 px-3.5 py-2.5 text-[13.5px] font-medium rounded-[5px] transition-all duration-150 ${
        active
          ? "bg-[#37373d] text-white font-semibold shadow-xs border-l-[3px] border-[#007acc]"
          : "text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
          active ? "text-[#38bdf8]" : "text-[#858585] group-hover:text-[#cccccc]"
        }`}
      />

      <span className="truncate tracking-tight">{item.label}</span>

      {/* Prominent High-Visibility Badge */}
      {typeof item.badge === "number" && item.badge > 0 ? (
        <ProminentBadge
          count={item.badge}
          variant={item.badgeVariant}
          pulse={item.badgePulse}
        />
      ) : active ? (
        <ChevronRight className="ml-auto h-4 w-4 text-[#858585] opacity-50" />
      ) : null}
    </Link>
  );
}

export default function AdminSidebar({
  counts,
}: {
  counts: AdminBadgeCounts;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    setMobileOpen(false);
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (!window.matchMedia("(min-width: 64rem)").matches && !window.location.hash) {
      document.getElementById("admin-content")?.scrollTo({ top: 0 });
    }
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const totalSystemIssues = counts.webhookIssues + counts.outboxIssues;
  const totalPendingNotifications =
    counts.toShip +
    counts.pendingTastings +
    counts.unreadMessages +
    totalSystemIssues;
  const alertsBadgeClassName = `inline-flex items-center gap-2 rounded-[5px] px-3 py-2 text-xs font-bold transition-colors ${
    totalPendingNotifications > 0
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
  }`;

  const sections: NavSectionConfig[] = [
    {
      title: "Operazioni",
      items: [
        { href: "/admin/ops", label: "Operatività", icon: ListChecks },
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        {
          href: "/admin/orders",
          label: "Ordini",
          badge: counts.toShip,
          badgeVariant: "orders",
          badgePulse: counts.toShip > 0,
          icon: ShoppingBag,
        },
        { href: "/admin/quotes", label: "Preventivi", icon: FileText },
        { href: "/admin/vouchers", label: "Voucher", icon: Ticket },
        {
          href: "/admin/degustazioni",
          label: "Degustazioni",
          badge: counts.pendingTastings,
          badgeVariant: "tastings",
          badgePulse: counts.pendingTastings > 0,
          icon: CalendarClock,
        },
        {
          href: "/admin/messages",
          label: "Messaggi",
          badge: counts.unreadMessages,
          badgeVariant: "messages",
          badgePulse: counts.unreadMessages > 0,
          icon: Mail,
        },
      ],
    },
    {
      title: "Marketing & Clienti",
      items: [
        { href: "/admin/sales", label: "Merchandising", icon: Tags },
        { href: "/admin/customers", label: "Clienti", icon: UsersRound },
        { href: "/admin/promotions", label: "Promozioni", icon: BadgePercent },
      ],
    },
    {
      title: "Catalogo & Magazzino",
      items: [
        { href: "/admin/inventory", label: "Magazzino", icon: Warehouse },
        { href: "/admin/products", label: "Prodotti", icon: Package },
      ],
    },
    {
      title: "Metriche & Export",
      items: [
        { href: "/admin/metrics", label: "Metriche", icon: ChartNoAxesCombined },
        { href: "/admin/metrics/#card-prodotti-blog", label: "Clic prodotti nel blog", icon: MousePointerClick },
        { href: "/admin/exports", label: "Export Dati", icon: FileDown },
      ],
    },
    {
      title: "Finanza & Gestione",
      items: [
        { href: "/admin/conti-leonardo", label: "Conti Leonardo", icon: Coins },
        { href: "/admin/settings", label: "Impostazioni", icon: Settings2 },
      ],
    },
    {
      title: "Infrastruttura",
      items: [
        {
          href: "/admin/system",
          label: "Webhooks & Outbox",
          badge: totalSystemIssues,
          badgeVariant: "system",
          badgePulse: totalSystemIssues > 0,
          icon: Webhook,
        },
      ],
    },
  ];

  const isItemActive = (href: string) => {
    if (pathname === href) return true;
    if (href !== "/admin" && pathname.startsWith(href + "/")) return true;
    return false;
  };

  const mobileQuickLinks: NavItemConfig[] = [
    { href: "/admin/ops", label: "Operatività", icon: ListChecks },
    {
      href: "/admin/orders",
      label: "Ordini",
      badge: counts.toShip,
      icon: ShoppingBag,
    },
    { href: "/admin/quotes", label: "Preventivi", icon: FileText },
    { href: "/admin/vouchers", label: "Voucher", icon: Ticket },
    { href: "/admin/metrics", label: "Metriche", icon: ChartNoAxesCombined },
    { href: "/admin/conti-leonardo", label: "Conti", icon: Coins },
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await adminFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  const renderSidebarContent = (onItemClick?: () => void) => (
    <div className="flex h-full flex-col justify-between bg-[#252526] text-[#cccccc] border-r border-[#333333] select-none overflow-hidden font-sans">
      {/* Brand & Status Header (Always Pinned) */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#333333] bg-[#252526] px-4 py-3.5">
        <Link
          href="/admin/ops"
          onClick={onItemClick}
          aria-label={`${totalPendingNotifications} avvisi - Operazioni`}
          className={alertsBadgeClassName}
        >
          <BellRing aria-hidden="true" className="h-4 w-4" />
          <span>{totalPendingNotifications} avvisi</span>
        </Link>
        {onItemClick && (
          <SheetClose
            aria-label="Chiudi menu gestionale"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-[5px] border border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="size-5" />
          </SheetClose>
        )}
      </div>

      {/* Navigation Scrollable Area (Only Middle Menu Scrolls If Needed) */}
      <nav aria-label="Sezioni del gestionale" className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain px-3 py-3">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-3.5 pt-1 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#858585] flex items-center justify-between">
              <span>{sec.title}</span>
            </div>

            <div className="space-y-1">
              {sec.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  active={isItemActive(item.href)}
                  onClick={onItemClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Card & Actions (Always Pinned) */}
      <div className="shrink-0 px-3 py-3 border-t border-[#333333] bg-[#252526] space-y-2">
        {/* Go to shop link */}
        <Link
          href="/"
          target="_blank"
          className="group flex items-center justify-between rounded-[5px] px-3 py-2 text-xs font-semibold bg-[#1e1e1e] border border-[#333333] text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white hover:border-[#444444] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Vai allo Shop</span>
          </div>
          <span className="text-xs text-[#858585] group-hover:text-white">↗</span>
        </Link>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between rounded-[5px] bg-[#1e1e1e] border border-[#333333] p-2 pl-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-[#007acc] text-xs font-bold text-white">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">
                Amministratore
              </span>
              <span className="text-[9.5px] font-medium text-emerald-400 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Sessione Protetta
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Disconnetti"
            className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#858585] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR (VISUAL STUDIO DARK GREY) ─── */}
      <aside className="sticky top-0 self-start hidden lg:flex w-[280px] h-full shrink-0 flex-col bg-[#252526] border-r border-[#333333] z-20 overflow-hidden">
        {renderSidebarContent()}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} swipeDirection="left">
        <header className="relative z-30 min-w-0 shrink-0 border-b border-white/10 bg-[#1f1f23] text-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
            <Link
              href="/admin/ops"
              aria-label={`${totalPendingNotifications} avvisi - Operazioni`}
              className={alertsBadgeClassName}
            >
              <BellRing aria-hidden="true" className="h-4 w-4" />
              <span>{totalPendingNotifications} avvisi</span>
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <SheetTrigger
                aria-label="Apri menu gestionale"
                className="flex size-11 items-center justify-center rounded-[5px] border border-white/10 bg-white/5 text-neutral-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Menu aria-hidden="true" className="size-5" />
              </SheetTrigger>
            </div>
          </div>

          {/* Quick-Jump Horizontal Strip */}
          <nav
            aria-label="Accesso rapido gestionale"
            className="no-scrollbar flex w-full min-w-0 items-center gap-1.5 overflow-x-auto overscroll-x-contain px-3.5 pb-2.5 pt-0.5"
          >
            {mobileQuickLinks.map((qItem) => {
              const QIcon = qItem.icon;
              const active = isItemActive(qItem.href);
              return (
                <Link
                  key={qItem.href}
                  href={qItem.href}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-[#007acc] text-white shadow-xs ring-1 ring-sky-400/40"
                      : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  <QIcon aria-hidden="true" className={`h-3.5 w-3.5 ${active ? "text-white" : "text-neutral-400"}`} />
                  <span>{qItem.label}</span>
                  {typeof qItem.badge === "number" && qItem.badge > 0 ? (
                    <span className="ml-0.5 inline-flex min-w-[16px] h-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-black text-white">
                      {qItem.badge > 99 ? "99+" : qItem.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </header>
        <SheetContent side="left" hideClose aria-modal="true" className="bottom-auto h-dvh max-h-dvh w-[min(20rem,88vw)] overflow-hidden border-[#333333] bg-[#252526] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:hidden">
          <SheetTitle className="sr-only">Menu gestionale</SheetTitle>
          {renderSidebarContent(() => setMobileOpen(false))}
        </SheetContent>
      </Sheet>
    </>
  );
}
