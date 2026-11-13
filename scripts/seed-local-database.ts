import "dotenv/config";
import { readFile } from "node:fs/promises";
import { databasePolicy } from "../src/lib/server/databaseSafety.mjs";
import { makeInventorySku } from "../src/lib/inventorySku";

async function main() {
  if (databasePolicy().mode !== "local-development") throw new Error("Seed consentito esclusivamente sul database locale separato.");
  const { prisma } = await import("../src/lib/server/prisma");
  try {
    const products = JSON.parse(await readFile("src/db/products.json", "utf8")) as Array<{ id: string; variants: Array<{ id: string; sku?: string }> }>;
    let count = 0;
    for (const product of products) for (const variant of product.variants || []) {
      const sku = makeInventorySku(product.id, variant.id, variant.sku);
      await prisma.inventoryItem.upsert({ where: { sku }, update: {}, create: { sku, stock: 1000, reserved: 0 } });
      count++;
    }
    for (const [key, value] of Object.entries({ storeName: "Del Pasqua (sviluppo)", supportEmail: "info@delpasqua.com", shippingFlatCents: "990", freeShippingThresholdCents: "6900", vatRatePercent: "4" }))
      await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
    console.log(`Database locale pronto: ${count} SKU del catalogo e impostazioni iniziali. Nessun dato cliente copiato dalla produzione.`);
  } finally { await prisma.$disconnect(); }
}
main().then(() => process.exit(0)).catch(() => { console.error("Inizializzazione locale non riuscita. Nessuna scrittura remota eseguita."); process.exit(1); });
