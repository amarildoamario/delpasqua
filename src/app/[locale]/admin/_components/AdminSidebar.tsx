"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BadgePercent,
  ClipboardList,
  LayoutDashboard,
  Package,
  Boxes,
  Settings as SettingsIcon,
  Upload,
  Users,
  Webhook,
  CalendarDays,
  Coins,
  Mail,
  BarChart3,
  Sparkles,
  Store,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
} from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";
import { useRouter } from "next/navigation";

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
  icon: React.ComponentType<{ className?: string }>;
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
      className={`group flex items-center gap-3 px-3.5 py-2.5 text-[13.5px] font-medium rounded-lg transition-all duration-150 ${
        active
          ? "bg-[#37373d] text-white font-semibold shadow-xs border-l-[3px] border-[#007acc]"
          : "text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
      }`}
    >
      <Icon
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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const totalSystemIssues = counts.webhookIssues + counts.outboxIssues;
  const totalPendingNotifications =
    counts.toShip +
    counts.pendingTastings +
    counts.unreadMessages +
    totalSystemIssues;

  const sections: NavSectionConfig[] = [
    {
      title: "Operazioni",
      items: [
        { href: "/admin/ops", label: "Operatività", icon: Activity },
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        {
          href: "/admin/orders",
          label: "Ordini",
          badge: counts.toShip,
          badgeVariant: "orders",
          badgePulse: counts.toShip > 0,
          icon: ClipboardList,
        },
        { href: "/admin/quotes", label: "Preventivi", icon: ClipboardList },
        {
          href: "/admin/degustazioni",
          label: "Degustazioni",
          badge: counts.pendingTastings,
          badgeVariant: "tastings",
          badgePulse: counts.pendingTastings > 0,
          icon: CalendarDays,
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
        { href: "/admin/sales", label: "Merchandising", icon: BadgePercent },
        { href: "/admin/customers", label: "Clienti", icon: Users },
        { href: "/admin/promotions", label: "Promozioni", icon: Sparkles },
      ],
    },
    {
      title: "Catalogo & Magazzino",
      items: [
        { href: "/admin/inventory", label: "Magazzino", icon: Boxes },
        { href: "/admin/products", label: "Prodotti", icon: Package },
      ],
    },
    {
      title: "Metriche & Export",
      items: [
        { href: "/admin/metrics", label: "Metriche", icon: BarChart3 },
        { href: "/admin/exports", label: "Export Dati", icon: Upload },
      ],
    },
    {
      title: "Finanza & Gestione",
      items: [
        { href: "/admin/conti-leonardo", label: "Conti Leonardo", icon: Coins },
        { href: "/admin/settings", label: "Impostazioni", icon: SettingsIcon },
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

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex h-full flex-col justify-between bg-[#252526] text-[#cccccc] border-r border-[#333333] select-none overflow-hidden font-sans">
      {/* Brand & Status Header (Always Pinned) */}
      <div className="shrink-0 px-4 py-3.5 border-b border-[#333333] bg-[#252526]">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            onClick={onItemClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007acc] text-white shadow-xs group-hover:bg-[#0062a3] transition-colors">
              <Shield className="h-4 w-4" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide text-white group-hover:text-[#38bdf8] transition-colors">
                Del Pasqua
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Live system pill indicator */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#1e1e1e] px-2.5 py-1 border border-[#333333] text-[10.5px] font-semibold text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9.5px] uppercase tracking-wider text-emerald-400 font-bold">Live</span>
          </div>
        </div>
      </div>

      {/* Navigation Scrollable Area (Only Middle Menu Scrolls If Needed) */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 py-3 space-y-4">
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
      </div>

      {/* Footer / User Card & Actions (Always Pinned) */}
      <div className="shrink-0 px-3 py-3 border-t border-[#333333] bg-[#252526] space-y-2">
        {/* Go to shop link */}
        <Link
          href="/"
          target="_blank"
          className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold bg-[#1e1e1e] border border-[#333333] text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white hover:border-[#444444] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Vai allo Shop</span>
          </div>
          <span className="text-xs text-[#858585] group-hover:text-white">↗</span>
        </Link>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between rounded-lg bg-[#1e1e1e] border border-[#333333] p-2 pl-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#007acc] text-xs font-bold text-white">
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
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#858585] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
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
      <aside className="hidden lg:flex w-[280px] h-full shrink-0 flex-col bg-[#252526] border-r border-[#333333] z-20 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* ─── MOBILE STICKY TOPBAR (< lg) ─── */}
      <header className="lg:hidden z-30 border-b border-[#333333] bg-[#252526] px-4 py-3 shadow-xs shrink-0 text-white">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#007acc] text-white">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <span>Del Pasqua Admin</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Quick Pending Counter Badge if any pending */}
            {totalPendingNotifications > 0 && (
              <Link
                href="/admin/ops"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f97316] text-white text-[10px] font-black shadow-xs animate-pulse"
              >
                <span>{totalPendingNotifications}</span>
                <span className="text-[9px] font-bold">avvisi</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Apri menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e1e1e] border border-[#333333] text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] transition-colors"
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE SLIDE-OVER DRAWER (< lg) ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-100"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-150">
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
