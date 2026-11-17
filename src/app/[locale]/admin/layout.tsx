import { redirect } from "next/navigation";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import { databasePolicy } from "@/lib/server/databaseSafety.mjs";
import { requireAdminPage } from "@/lib/server/adminAuth";
import AdminSidebar from "./_components/AdminSidebar";

export const dynamic = "force-dynamic";

// ─── Cache badge admin (TTL 30s) ───────────────────────────────────────────
// Il layout è un Server Component che viene ri-renderato ad ogni navigazione
// nel pannello admin. Senza cache = 5 query DB per ogni click sul menu.
// Con cache 30s: 0 query se i dati sono freschi, 5 query al massimo ogni 30s.
const ADMIN_BADGE_TTL_MS = process.env.NODE_ENV === "production" ? 30_000 : 0;
interface AdminBadgeCache {
  data: [number, number, number, number, number];
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
      where: { shippedAt: null, status: { in: ["PAGATO", "IN_PREPARAZIONE"] }, isTest: false },
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
    prisma.contactMessage.count({
      where: { status: "UNREAD" },
    }),
  ]) as [number, number, number, number, number];

  adminBadgeCache = { data, cachedAt: Date.now() };
  return data;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const nextPathWithSearch = "/admin";
  const guard = await requireAdminPage(nextPathWithSearch);

  if (!guard.ok) {
    redirect(`/login?next=${encodeURIComponent(nextPathWithSearch)}`);
  }

  const [toShip, outboxIssues, webhookIssues, pendingTastings, unreadMessages] = await fetchAdminDashboardData();

  return (
    <div className="admin-panel fixed inset-x-0 bottom-0 top-[var(--main-navbar-offset,98px)] flex min-w-0 flex-col overflow-hidden bg-neutral-50 md:top-[var(--main-navbar-offset,118px)] lg:static lg:h-[calc(var(--viewport-height,100svh)-118px)] lg:flex-row">
      {/* Modern Executive Sidebar (Desktop aside + Mobile topbar & drawer) */}
      <AdminSidebar
        counts={{
          toShip,
          outboxIssues,
          webhookIssues,
          pendingTastings,
          unreadMessages,
        }}
      />

      {/* Main Content Side Column */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-neutral-50">
        {/* Scrollable inner content box */}
        <div className="no-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3.5 py-4 pb-20 sm:px-6 sm:py-6">
          {databaseReadOnly ? (
            <div role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <strong>Modalità consultazione.</strong> Il database online è in sola lettura. I salvataggi richiedono un database di sviluppo separato.
            </div>
          ) : databasePolicy().mode === "local-development" ? (
            <div role="status" className="mb-5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              <strong>Ambiente di sviluppo locale.</strong> I dati salvati qui sono separati da quelli del sito online.
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
