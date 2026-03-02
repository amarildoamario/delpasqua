import { prisma } from "@/lib/server/prisma";

export async function getAvailableBySku(sku: string) {
  const row = await prisma.inventoryItem.findUnique({ where: { sku } });
  if (!row) return 0;
  return Math.max(0, row.stock);
}
