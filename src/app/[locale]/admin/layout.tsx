import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";
import { prisma } from "@/lib/server/prisma";
import { requireAdminPage } from "@/lib/server/adminAuth";
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
} from "lucide-react";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-bold text-neutral-700">
      {n > 99 ? "99+" : n}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-3 text-[11px] font-bold uppercase tracking-wide text-neutral-400">
      {children}
    </div>
  );
}

function NavItem({
  href,
  label,
  badge,
  icon: Icon,
}: {
  href: string;
  label: string;
  badge?: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
    >
      <Icon className="h-4 w-4 text-neutral-500" />
      <span>{label}</span>
      {typeof badge === "number" ? <Badge n={badge} /> : null}
    </Link>
  );
}

// ─── Cache badge admin (TTL 30s) ───────────────────────────────────────────
// Il layout è un Server Component che viene ri-renderato ad ogni navigazione
// nel pannello admin. Senza cache = 4 query DB per ogni click sul menu.
// Con cache 30s: 0 query se i dati sono freschi, 4 query al massimo ogni 30s.
const ADMIN_BADGE_TTL_MS = 30_000;
interface AdminBadgeCache {
  data: [number, number, number, number];
  cachedAt: number;
}
let adminBadgeCache: AdminBadgeCache | null = null;

async function fetchAdminDashboardData() {
  if (adminBadgeCache && Date.now() - adminBadgeCache.cachedAt < ADMIN_BADGE_TTL_MS) {
    return adminBadgeCache.data;
  }

  const now = Date.now();
  const since24h = new Date(now - 24 * 60 * 60 * 1000);

  const data = await Promise.all([
    prisma.order.count({
      where: { shippedAt: null, status: { in: ["PAID", "PREPARING"] } },
    }),
    prisma.outboxEvent.count({
      where: { status: { in: ["failed", "pending", "processing"] } },
    }),
    prisma.stripeWebhookEvent.count({
      where: {
        receivedAt: { gte: since24h },
        outcome: { in: ["failed_signature", "failed_validation", "failed_processing", "review"] },
      },
    }),
    prisma.tastingBooking.count({
      where: { status: "PENDING", slotStart: { gte: new Date() } },
    }),
  ]) as [number, number, number, number];

  adminBadgeCache = { data, cachedAt: Date.now() };
  return data;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const nextPathWithSearch = "/admin";
  const guard = await requireAdminPage(nextPathWithSearch);

  if (!guard.ok) {
    redirect(`/login?next=${encodeURIComponent(nextPathWithSearch)}`);
  }

  const [toShip, outboxIssues, webhookIssues, pendingTastings] = await fetchAdminDashboardData();

  return (
    <div className="h-screen bg-neutral-50">
      <div className="mx-auto flex h-full max-w-7xl gap-4 px-4 py-4">
        <aside className="hidden w-[240px] shrink-0 lg:block">
          <div className="h-full rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between px-2 py-2">
                <div className="text-sm font-bold text-neutral-900">Admin</div>
                <AdminLogoutButton />
              </div>

              <div className="mt-2 flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1">
                <SectionLabel>Operazioni</SectionLabel>
                <NavItem href="/admin/ops" label="Operatività" icon={Activity} />
                <NavItem href="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />
                <NavItem href="/admin/orders" label="Ordini" badge={toShip} icon={ClipboardList} />

                <NavItem
                  href="/admin/degustazioni"
                  label="Degustazioni"
                  badge={pendingTastings}
                  icon={CalendarDays}
                />

                <SectionLabel>Marketing</SectionLabel>
                <NavItem href="/admin/sales" label="Merchandising" icon={BadgePercent} />
                <NavItem href="/admin/customers" label="Clienti" icon={Users} />
                <NavItem href="/admin/promotions" label="Promozioni" icon={Package} />

                <SectionLabel>Catalogo</SectionLabel>
                <NavItem href="/admin/inventory" label="Magazzino" icon={Boxes} />
                <NavItem href="/admin/products" label="Prodotti" icon={Package} />

                <SectionLabel>Utility</SectionLabel>
                <NavItem href="/admin/exports" label="Export" icon={Upload} />
                <NavItem href="/admin/settings" label="Impostazioni" icon={SettingsIcon} />

                <SectionLabel>Metriche</SectionLabel>
                <NavItem href="/admin/metrics" label="Metriche" icon={BarChart3} />

                <SectionLabel>Sistema</SectionLabel>
                <NavItem
                  href="/admin/system"
                  label="Webhooks & Outbox"
                  badge={webhookIssues + outboxIssues}
                  icon={Webhook}
                />
              </div>

              <div className="mt-3 border-t border-neutral-200 pt-3">
                <Link
                  href="/"
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  Vai allo shop
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto no-scrollbar">
          <header className="sticky top-0 z-10 mb-4 rounded-2xl border border-neutral-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-900">Pannello amministrazione</div>

              <div className="flex items-center gap-2 lg:hidden">
                <Link
                  href="/admin/orders"
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  Ordini
                </Link>
                <AdminLogoutButton />
              </div>
            </div>
          </header>

          <div className="pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
}