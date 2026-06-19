import { clampCartQty } from "@/lib/cartNormalization";
export { clampCartQty };

type InventoryAvailabilityReader = {
  inventoryItem: {
    findUnique: (args: {
      where: { sku: string };
      select?: { stock: true; reserved: true };
    }) => Promise<{ stock: number; reserved: number } | null>;
  };
};

export type CartQuantityValidationResult =
  | {
      ok: true;
      available: number;
      requested: number;
    }
  | {
      ok: false;
      error: "OUT_OF_STOCK" | "QTY_TOO_HIGH";
      available: number;
      requested: number;
    };

export function computeAvailableInventory(args: { stock: number; reserved: number }) {
  const stock = Number(args.stock ?? 0);
  const reserved = Number(args.reserved ?? 0);
  return Math.max(0, stock - reserved);
}

export async function getAvailableInventoryForSku(
  db: InventoryAvailabilityReader,
  sku: string
) {
  const normalizedSku = String(sku || "").trim();
  if (!normalizedSku) return 0;

  const row = await db.inventoryItem.findUnique({
    where: { sku: normalizedSku },
    select: { stock: true, reserved: true },
  });

  if (!row) return 0;
  return computeAvailableInventory(row);
}

export async function validateCartQuantityForSku(
  db: InventoryAvailabilityReader,
  args: { sku: string; qty: number }
): Promise<CartQuantityValidationResult> {
  const requested = clampCartQty(args.qty);
  const available = await getAvailableInventoryForSku(db, args.sku);

  if (available <= 0) {
    return {
      ok: false,
      error: "OUT_OF_STOCK",
      available: 0,
      requested,
    };
  }

  if (requested > available) {
    return {
      ok: false,
      error: "QTY_TOO_HIGH",
      available,
      requested,
    };
  }

  return {
    ok: true,
    available,
    requested,
  };
}
