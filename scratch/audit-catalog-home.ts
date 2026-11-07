import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { prisma } from '../src/lib/server/prisma';
import { pickHomeMerchSlots } from '../src/lib/homeMerch';

async function main() {
  const catalog = JSON.parse(await readFile('src/db/products.json', 'utf8'));
  const [inventory, merch] = await Promise.all([
    prisma.inventoryItem.findMany({ select: { sku: true, stock: true, reserved: true }, orderBy: { sku: 'asc' } }),
    prisma.productMerch.findMany({ orderBy: { homeRank: 'asc' } }),
  ]);
  const expected = catalog.flatMap((p: { id: string; variants: { id: string; sku: string }[] }) => p.variants.map(v => ({ productId: p.id, variantId: v.id, sku: v.sku })));
  const inventorySet = new Set(inventory.map(i => i.sku));
  const expectedSet = new Set(expected.map((v: { sku: string }) => v.sku));
  const products = catalog.filter((p: { isPublished?: boolean; isPurchasable?: boolean }) => p.isPublished !== false && p.isPurchasable !== false).map((p: { id: string }) => ({ ...p, ...merch.find(m => m.productKey === p.id), id: p.id }));
  const report = {
    catalogProducts: catalog.length,
    catalogVariants: expected.length,
    variants: expected,
    missingInventory: expected.filter((v: { sku: string }) => !inventorySet.has(v.sku)),
    extraInventory: inventory.filter(i => !expectedSet.has(i.sku)),
    invalidInventory: inventory.filter(i => i.stock < 0 || i.reserved < 0 || i.reserved > i.stock),
    merch,
    home: pickHomeMerchSlots(products).map(({ item, rank }) => ({ rank, ...item })),
  };
  await mkdir('archivio/immagini-prodotti/2026-11-07-catalogo', { recursive: true });
  await writeFile('archivio/immagini-prodotti/2026-11-07-catalogo/audit-prima.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, home: report.home.map(p => ({ rank: p.rank, id: p.id, title: p.title })), variants: undefined }, null, 2));
}

main().finally(() => prisma.$disconnect());
