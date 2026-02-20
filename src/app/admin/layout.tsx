import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";
import { prisma } from "@/lib/server/prisma";
import { requireAdminPage } from "@/lib/server/adminAuth";
import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";
import {
  Activity,
  BadgePercent,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  Package,
  Settings as SettingsIcon,
  Truck,
  Upload,
  Users,
  Webhook,
} from "lucide-react";

export const dynamic = "force-dynamic";

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
      {n > 99 ? "99+" : n}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-3 text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
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
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      <Icon className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
      <span>{label}</span>
      {typeof badge === "number" ? <Badge n={badge} /> : null}
    </Link>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // P0.07: server-side auth guard for admin pages (no edge middleware)
  const nextPathWithSearch = "/admin"; // layout doesn't receive current path; keep simple
  const guard = await requireAdminPage(nextPathWithSearch);
  if (!guard.ok) {
    redirect(`/login?next=${encodeURIComponent(nextPathWithSearch)}`);
  }

  const now = +new Date();
  const since24h = new Date(now - 24 * 60 * 60 * 1000);

  const [toShip, outboxIssues, webhookIssues] = await Promise.all([
    prisma.order.count({
      where: {
        shippedAt: null,
        status: { in: ["PAID", "PREPARING"] },
      },
    }),
    prisma.outboxEvent.count({
      where: { status: { in: ["failed", "pending", "processing"] } },
    }),
    prisma.stripeWebhookEvent.count({
      where: {
        receivedAt: { gte: since24h },
        outcome: {
          in: [
            "failed_signature",
            "failed_validation",
            "failed_processing",
            "review",
          ],
        },
      },
    }),
  ]);

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto flex h-full max-w-7xl gap-4 px-4 py-4">
        <aside className="hidden w-[240px] shrink-0 lg:block">
          <div className="h-full rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between px-2 py-2">
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Admin
                </div>
                <AdminLogoutButton />
              </div>

              <div className="mt-2 flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1">
                <SectionLabel>Operazioni</SectionLabel>
                <NavItem href="/admin/ops" label="Operatività" icon={Activity} />
                <NavItem href="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />

                {/* badge = ordini pagati/non spediti */}
                <NavItem
                  href="/admin/orders"
                  label="Ordini"
                  badge={toShip}
                  icon={ClipboardList}
                />
                

                <SectionLabel>Marketing</SectionLabel>
                <NavItem
                  href="/admin/sales"
                  label="Merchandising"
                  icon={BadgePercent}
                />
                <NavItem href="/admin/customers" label="Clienti" icon={Users} />
                <NavItem href="/admin/promotions" label="Promozioni" icon={Package} />

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

              <div className="mt-3 border-t border-neutral-200 pt-3 dark:border-neutral-800">
                <Link
                  href="/"
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Vai allo shop
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto no-scrollbar">
          <header className="sticky top-0 z-10 mb-4 rounded-2xl border border-neutral-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Pannello amministrazione
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <Link
                  href="/admin/orders"
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
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
