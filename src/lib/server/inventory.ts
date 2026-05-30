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

function linesEqual(a: StockLine[], b: StockLine[]) {
  if (a.length !== b.length) return false;
  const bySku = new Map(b.map((line) => [line.sku, line.qty] as const));
  return a.every((line) => bySku.get(line.sku) === line.qty);
}

async function writeInventoryEvent(
  tx: Tx,
  args: {
    orderId: string;
    type: "INVENTORY_RESERVED" | "INVENTORY_COMMITTED" | "INVENTORY_RELEASED";
    message: string;
    meta: unknown;
  }
) {
  await tx.orderEvent.create({
    data: {
      orderId: args.orderId,
      actor: "system",
      type: args.type,
      message: args.message,
      metaJson: JSON.stringify(args.meta),
    },
  });
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
export async function reserveStockOrThrow(
  tx: Tx,
  args: { orderId: string; lines: StockLine[] }
) {
  if (!isInventoryEnabled()) return;

  const orderId = String(args.orderId || "").trim();
  const norm = normalizeLines(args.lines);
  if (!orderId || norm.length === 0) return;

  const existingReservations = await tx.inventoryReservation.findMany({
    where: { orderId },
    select: { sku: true, qty: true },
  });
  const existingNorm = normalizeLines(existingReservations);
  if (existingNorm.length > 0) {
    if (linesEqual(existingNorm, norm)) return;
    throw new Error(`Inventory reservation mismatch for order ${orderId}`);
  }

  if (norm.length === 0) return;

  const rows = await tx.inventoryItem.findMany({
    where: { sku: { in: norm.map((x) => x.sku) } },
    select: { sku: true, stock: true, reserved: true },
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
    const updated = await tx.$executeRaw`
      UPDATE "InventoryItem"
      SET "reserved" = "reserved" + ${l.qty}
      WHERE "sku" = ${l.sku}
        AND ("stock" - "reserved") >= ${l.qty}
    `;

    if (updated !== 1) {
      throw new OutOfStockError(`SKU ${l.sku} non piu disponibile durante la riserva`);
    }
  }

  for (const l of norm) {
    await tx.inventoryReservation.upsert({
      where: {
        orderId_sku: {
          orderId,
          sku: l.sku,
        },
      },
      update: { qty: l.qty },
      create: {
        orderId,
        sku: l.sku,
        qty: l.qty,
      },
    });
  }

  await writeInventoryEvent(tx, {
    orderId,
    type: "INVENTORY_RESERVED",
    message: `Stock riservato per ${norm.length} righe`,
    meta: {
      lines: norm,
      totalQty: norm.reduce((sum, line) => sum + line.qty, 0),
    },
  });
}

/**
 * Decrements stock (converts to sold). Call this when order becomes PAID.
 */
export async function commitReservedToSoldOrThrow(
  tx: Tx,
  args: { orderId: string; lines: StockLine[] }
) {
  if (!isInventoryEnabled()) return;

  const orderId = String(args.orderId || "").trim();
  const norm = normalizeLines(args.lines);
  if (!orderId || norm.length === 0) return;

  const reservations = await tx.inventoryReservation.findMany({
    where: { orderId },
    select: { sku: true, qty: true },
  });
  const reservedNorm = normalizeLines(reservations);
  if (!linesEqual(reservedNorm, norm)) {
    throw new Error(`Inventory reservation missing or inconsistent for order ${orderId}`);
  }

  if (norm.length === 0) return;

  const rows = await tx.inventoryItem.findMany({
    where: { sku: { in: norm.map((x) => x.sku) } },
    select: { sku: true, stock: true, reserved: true },
  });
  const bySku = new Map(rows.map((r) => [r.sku, r] as const));

  for (const l of norm) {
    const r = bySku.get(l.sku);
    if (!r) throw new Error(`Inventory inconsistency: missing SKU ${l.sku}`);
    if (r.stock < l.qty) throw new Error(`Inventory inconsistency: stock < qty for ${l.sku}`);
    if (r.reserved < l.qty) throw new Error(`Inventory inconsistency: reserved < qty for ${l.sku}`);
  }

  for (const l of norm) {
    const updated = await tx.$executeRaw`
      UPDATE "InventoryItem"
      SET "stock" = "stock" - ${l.qty},
          "reserved" = "reserved" - ${l.qty}
      WHERE "sku" = ${l.sku}
        AND "stock" >= ${l.qty}
        AND "reserved" >= ${l.qty}
    `;

    if (updated !== 1) {
      throw new Error(`Inventory inconsistency while committing reservation for ${l.sku}`);
    }
  }

  await tx.inventoryReservation.deleteMany({
    where: { orderId, sku: { in: norm.map((x) => x.sku) } },
  });

  await writeInventoryEvent(tx, {
    orderId,
    type: "INVENTORY_COMMITTED",
    message: `Stock confermato per ${norm.length} righe`,
    meta: {
      lines: norm,
      totalQty: norm.reduce((sum, line) => sum + line.qty, 0),
    },
  });
}

export async function releaseReserved(
  tx: Tx,
  args: { orderId: string; lines: StockLine[] }
) {
  if (!isInventoryEnabled()) return;

  const orderId = String(args.orderId || "").trim();
  const norm = normalizeLines(args.lines);
  if (!orderId || norm.length === 0) return;

  const reservations = await tx.inventoryReservation.findMany({
    where: { orderId },
    select: { sku: true, qty: true },
  });
  if (reservations.length === 0) return;

  for (const reservation of reservations) {
    const updated = await tx.$executeRaw`
      UPDATE "InventoryItem"
      SET "reserved" = "reserved" - ${reservation.qty}
      WHERE "sku" = ${reservation.sku}
        AND "reserved" >= ${reservation.qty}
    `;

    if (updated !== 1) {
      throw new Error(`Inventory inconsistency while releasing reservation for ${reservation.sku}`);
    }
  }

  await tx.inventoryReservation.deleteMany({
    where: { orderId },
  });

  await writeInventoryEvent(tx, {
    orderId,
    type: "INVENTORY_RELEASED",
    message: `Stock rilasciato per ${reservations.length} righe`,
    meta: {
      lines: normalizeLines(reservations),
      totalQty: reservations.reduce((sum, reservation) => sum + clampQty(reservation.qty), 0),
    },
  });
}

/** Helper comodo fuori da tx */
export async function withTx<T>(prisma: PrismaClient, fn: (tx: Tx) => Promise<T>) {
  return prisma.$transaction(fn);
}
