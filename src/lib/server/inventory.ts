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
    if (r.stock < l.qty) {
      throw new OutOfStockError(`SKU ${l.sku} non disponibile (disp. ${r.stock}, richiesti ${l.qty})`);
    }
  }

  // No longer reserving stock; just checked availability.
}

/**
 * Decrements stock (converts to sold). Call this when order becomes PAID.
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
    if (r.stock < l.qty) throw new Error(`Inventory inconsistency: stock < qty for ${l.sku}`);
  }

  // Batch update: singola query UPDATE con CASE WHEN invece di N update separati.
  // Per un ordine con N prodotti: da N query a 1 query.
  const caseExpr = norm
    .map((l) => `WHEN sku = ${JSON.stringify(l.sku)} THEN stock - ${l.qty}`)
    .join(" ");
  const skuList = norm.map((l) => JSON.stringify(l.sku)).join(", ");

  await tx.$executeRawUnsafe(
    `UPDATE "InventoryItem" SET stock = CASE ${caseExpr} ELSE stock END WHERE sku IN (${skuList})`
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function releaseReserved(_tx: Tx, _lines: StockLine[]) {
  // No-op because we no longer allocate a "reserved" state
  return Promise.resolve();
}

/** Helper comodo fuori da tx */
export async function withTx<T>(prisma: PrismaClient, fn: (tx: Tx) => Promise<T>) {
  return prisma.$transaction(fn);
}
