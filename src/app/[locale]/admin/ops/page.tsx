import PageHeader from "../_components/PageHeader";
import { prisma } from "@/lib/server/prisma";
import { readCatalog } from "@/lib/server/catalog";
import { makeInventorySku } from "@/lib/inventorySku";
import OperationsCockpit, {
  type SerializedOrder,
  type LowStockItem,
  type SerializedMessage,
  type SerializedTasting,
} from "./OperationsCockpit";

export const dynamic = "force-dynamic";

type CatalogProduct = {
  id: string;
  title?: string;
  category?: string;
  variants: {
    id: string;
    label?: string;
    priceCents?: number;
    sku?: string;
  }[];
};

export default async function AdminOpsPage() {
  const now = new Date();

  // Cutoff 48h per backlog vecchio
  const cutoff48h = new Date(now);
  cutoff48h.setHours(now.getHours() - 48);

  // Inizio giornata odierna
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // Yesterday for upcoming tastings
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);

  // Parallel DB queries
  const [
    activeOrdersDb,
    pendingOldCount,
    attentionOrdersCount,
    shippedTodayCount,
    unreadMessagesDb,
    tastingsDb,
    catalogRaw,
  ] = await Promise.all([
    // 1. Ordini attivi da preparare o spedire
    prisma.order.findMany({
      where: {
        status: { in: ["PAGATO", "IN_PREPARAZIONE"] },
        isTest: false,
      },
      include: {
        items: {
          select: {
            id: true,
            sku: true,
            title: true,
            variantLabel: true,
            qty: true,
            unitPriceCents: true,
            lineTotalCents: true,
            imageUrl: true,
          },
          orderBy: { title: "asc" },
        },
      },
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      take: 100,
    }),

    // 2. Ordini IN_ATTESA bloccati > 48h
    prisma.order.count({
      where: {
        status: "IN_ATTESA",
        createdAt: { lt: cutoff48h },
        attentionDismissedAt: null,
        isTest: false,
      },
    }),

    // 3. Ordini che richiedono un controllo umano (oltre alle attese vecchie)
    prisma.order.count({
      where: {
        attentionDismissedAt: null,
        OR: [
          { status: { in: ["FALLITO", "SCADUTO"] } },
          { isFlagged: true },
          { status: "PAGATO", paidAt: null },
          { status: "IN_PREPARAZIONE", preparingAt: null },
        ],
        isTest: false,
      },
    }),

    // 4. Ordini spediti oggi
    prisma.order.count({
      where: {
        shippedAt: { gte: startOfToday },
        isTest: false,
      },
    }),

    // 4. Messaggi di contatto non letti
    prisma.contactMessage.findMany({
      where: { status: "UNREAD" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),

    // 5. Degustazioni da gestire / imminenti
    prisma.tastingBooking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        slotStart: { gte: yesterday },
      },
      orderBy: { slotStart: "asc" },
      take: 20,
    }),

    // 6. Catalogo per incrocio scorte
    readCatalog(),
  ]);

  // Serializzazione Ordini
  const serializedOrders: SerializedOrder[] = activeOrdersDb.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    fullName: o.fullName,
    email: o.email,
    phone: o.phone,
    address: o.addressLine1 || o.address,
    city: o.city,
    zip: o.postalCode || o.zip,
    province: o.province,
    countryCode: o.countryCode,
    shippingNotes: o.shippingNotes,
    totalCents: o.totalCents,
    subtotalCents: o.subtotalCents,
    paidAt: o.paidAt ? o.paidAt.toISOString() : null,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      sku: it.sku,
      title: it.title,
      variantLabel: it.variantLabel,
      qty: it.qty,
      unitPriceCents: it.unitPriceCents,
      lineTotalCents: it.lineTotalCents,
      imageUrl: it.imageUrl,
    })),
  }));

  // Calcolo Scorte Critiche
  const catalog = (catalogRaw || []) as CatalogProduct[];
  const skuMetaMap = new Map<string, { productTitle: string; variantLabel: string; category?: string }>();
  const skus: string[] = [];

  for (const p of catalog) {
    for (const v of p.variants || []) {
      if (!p?.id || !v?.id) continue;
      const sku = makeInventorySku(p.id, v.id, v.sku);
      skus.push(sku);
      skuMetaMap.set(sku, {
        productTitle: p.title || p.id,
        variantLabel: v.label || v.id,
        category: p.category,
      });
    }
  }

  const inventoryRows = await prisma.inventoryItem.findMany({
    where: { sku: { in: skus } },
    select: { sku: true, stock: true, updatedAt: true },
  });

  const inventoryMap = new Map<string, { stock: number; updatedAt: Date }>();
  for (const row of inventoryRows) {
    inventoryMap.set(row.sku, { stock: row.stock, updatedAt: row.updatedAt });
  }

  const lowStockItems: LowStockItem[] = [];
  for (const sku of skus) {
    const inv = inventoryMap.get(sku);
    const stock = inv ? inv.stock : 0; // se non esiste riga, stock = 0
    if (stock <= 5) {
      const meta = skuMetaMap.get(sku);
      lowStockItems.push({
        sku,
        productTitle: meta?.productTitle || sku,
        variantLabel: meta?.variantLabel || "Standard",
        category: meta?.category,
        stock,
        updatedAt: inv ? inv.updatedAt.toISOString() : now.toISOString(),
      });
    }
  }

  // Ordina le scorte: prima quelle a 0, poi per stock crescente
  lowStockItems.sort((a, b) => a.stock - b.stock);

  // Serializzazione Messaggi
  const serializedMessages: SerializedMessage[] = unreadMessagesDb.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  }));

  // Serializzazione Degustazioni
  const serializedTastings: SerializedTasting[] = tastingsDb.map((t) => ({
    id: t.id,
    status: t.status as "PENDING" | "CONFIRMED" | "CANCELED",
    slotStart: t.slotStart.toISOString(),
    slotEnd: t.slotEnd.toISOString(),
    tastingType: t.tastingType,
    people: t.people,
    children: t.children,
    fullName: t.fullName,
    email: t.email,
    phone: t.phone,
    notes: t.notes,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Centro Operativo & Evasione"
        subtitle="Cockpit quotidiano delle priorità: ordini da preparare e spedire, scorte a rischio, messaggi clienti e visite."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/admin/print-todo"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-neutral-800 transition flex items-center gap-1.5"
            >
              <span>🖨️ Stampa Ordini da Fare</span>
            </a>
          </div>
        }
      />

      <OperationsCockpit
        initialOrders={serializedOrders}
        initialLowStock={lowStockItems}
        initialMessages={serializedMessages}
        initialTastings={serializedTastings}
        shippedTodayCount={shippedTodayCount}
        pendingOldCount={pendingOldCount}
        attentionOrdersCount={attentionOrdersCount}
      />
    </div>
  );
}
