import products from "@/db/products.json";
import type { Product } from "@/lib/shopTypes";
import { prisma } from "@/lib/server/prisma";

function makeSku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

async function main() {
  const catalog = products as unknown as Product[];

  // ✅ sempre 50, senza input/env
  const safeDefault = 50;

  const skus: string[] = [];
  for (const p of catalog) for (const v of p.variants) skus.push(makeSku(p.id, v.id));

  const existing = await prisma.inventoryItem.findMany({
    where: { sku: { in: skus } },
    select: { sku: true, stock: true },
  });

  const existingMap = new Map(existing.map((x) => [x.sku, x] as const));

  const missing = skus.filter((s) => !existingMap.has(s));
  const updatable = skus.filter((s) => {
    const row = existingMap.get(s);
    // aggiorna solo se esiste e stock == 0 e DEFAULT_STOCK > 0
    return Boolean(row && row.stock === 0 && safeDefault > 0);
  });

  // 1) crea mancanti
  if (missing.length > 0) {
    await prisma.inventoryItem.createMany({
      data: missing.map((sku) => ({ sku, stock: safeDefault })),
    });
  }

  // 2) aggiorna esistenti a 0
  for (const sku of updatable) {
    await prisma.inventoryItem.update({
      where: { sku },
      data: { stock: safeDefault },
    });
  }

  console.log(
    `✅ InventoryItem: create ${missing.length} righe + update ${updatable.length} righe (stock=${safeDefault}).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
