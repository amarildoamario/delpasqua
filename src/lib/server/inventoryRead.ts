import { prisma } from "@/lib/server/prisma";

export async function getAvailableBySku(sku: string) {
  const row = await prisma.inventoryItem.findUnique({ where: { sku } });
  if (!row) return 0;
  return Math.max(0, row.stock - row.reserved);
}

export async function getAvailabilityBySkus(skus: string[]) {
  const rows = await prisma.inventoryItem.findMany({
    where: { sku: { in: skus } },
    select: { sku: true, stock: true, reserved: true },
  });
  const availability = new Map(skus.map((sku) => [sku, 0]));
  for (const { sku, stock, reserved } of rows) {
    availability.set(sku, Math.max(0, stock - reserved));
  }
  return Object.fromEntries(availability);
}
