import type { Prisma, PrismaClient } from "@/generated/prisma/client";

type Tx = Prisma.TransactionClient;

export type StockLine = {
  sku: string;
  qty: number;
};

function clampQty(qty: number) {
  const n = Math.trunc(qty);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(99, n);
}

function normalizeLines(lines: StockLine[]) {
  const map = new Map<string, number>();
  for (const l of lines) {
    const sku = String(l.sku || "").trim();
    const qty = clampQty(l.qty);
    if (!sku || qty <= 0) continue;
    map.set(sku, (map.get(sku) ?? 0) + qty);
  }
  return [...map.entries()].map(([sku, qty]) => ({ sku, qty }));
}

export class OutOfStockError extends Error {
  status = 409;
  constructor(message = "Out of stock") {
    super(message);
  }
}

/**
 * STRICT MODE (default): se una SKU non esiste in InventoryItem => considerata stock=0 (quindi blocca).
 * Se vuoi disabilitare, setta INVENTORY_ENABLED=false.
 */
export function isInventoryEnabled() {
  return (process.env.INVENTORY_ENABLED ?? "true").toLowerCase() !== "false";
}

/** Riserva stock (aumenta reserved) per un set di righe; fallisce se available < qty. */
export async function reserveStockOrThrow(tx: Tx, lines: StockLine[]) {
  if (!isInventoryEnabled()) return;

  const norm = normalizeLines(lines);
  if (norm.length === 0) return;

  const rows = await tx.inventoryItem.findMany({
    where: { sku: { in: norm.map((x) => x.sku) } },
  });
  const bySku = new Map(rows.map((r) => [r.sku, r] as const));

  for (const l of norm) {
    const r = bySku.get(l.sku);
    if (!r) throw new OutOfStockError(`SKU ${l.sku} non configurata in magazzino (stock=0)`);

    const available = r.stock - r.reserved;
    if (available < l.qty) {
      throw new OutOfStockError(`SKU ${l.sku} non disponibile (disp. ${available}, richiesti ${l.qty})`);
    }
  }

  for (const l of norm) {
    await tx.inventoryItem.update({
      where: { sku: l.sku },
      data: { reserved: { increment: l.qty } },
    });
  }
}

/**
 * Converte reserved -> sold: stock -= qty e reserved -= qty.
 * Chiamala quando l'ordine passa a PAID.
 */
export async function commitReservedToSoldOrThrow(tx: Tx, lines: StockLine[]) {
  if (!isInventoryEnabled()) return;

  const norm = normalizeLines(lines);
  if (norm.length === 0) return;

  const rows = await tx.inventoryItem.findMany({
    where: { sku: { in: norm.map((x) => x.sku) } },
  });
  const bySku = new Map(rows.map((r) => [r.sku, r] as const));

  for (const l of norm) {
    const r = bySku.get(l.sku);
    if (!r) throw new Error(`Inventory inconsistency: missing SKU ${l.sku}`);
    if (r.reserved < l.qty) throw new Error(`Inventory inconsistency: reserved < qty for ${l.sku}`);
    if (r.stock < l.qty) throw new Error(`Inventory inconsistency: stock < qty for ${l.sku}`);
  }

  for (const l of norm) {
    await tx.inventoryItem.update({
      where: { sku: l.sku },
      data: { reserved: { decrement: l.qty }, stock: { decrement: l.qty } },
    });
  }
}

/** Rilascia prenotazioni (reserved -= qty). Chiamala su EXPIRED/CANCELED/FAILED. */
export async function releaseReserved(tx: Tx, lines: StockLine[]) {
  if (!isInventoryEnabled()) return;

  const norm = normalizeLines(lines);
  if (norm.length === 0) return;

  const rows = await tx.inventoryItem.findMany({
    where: { sku: { in: norm.map((x) => x.sku) } },
  });
  const bySku = new Map(rows.map((r) => [r.sku, r] as const));

  for (const l of norm) {
    const r = bySku.get(l.sku);
    if (!r) continue;
    const dec = Math.min(r.reserved, l.qty);
    if (dec <= 0) continue;

    await tx.inventoryItem.update({
      where: { sku: l.sku },
      data: { reserved: { decrement: dec } },
    });
  }
}

/** Helper comodo fuori da tx */
export async function withTx<T>(prisma: PrismaClient, fn: (tx: Tx) => Promise<T>) {
  return prisma.$transaction(fn);
}
