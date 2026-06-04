/**
 * @file seed.mjs
 * @description Inizializzazione e coerenza del database locale (Seed).
 * Legge il catalogo prodotti da "src/db/products.json", popola le SKU
 * corrispondenti nella tabella InventoryItem e configura le impostazioni
 * predefinite del negozio nella tabella Setting se non già presenti.
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPrisma, closePrisma, makeInternalSku } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..", "..");

async function main() {
  console.log("==================================================");
  console.log("🔄 INIZIALIZZAZIONE E COERENZA DATABASE (SEED)");
  console.log("==================================================");

  const prisma = getPrisma();

  // 1. Carica il catalogo dei prodotti
  const catalogPath = path.join(rootDir, "src", "db", "products.json");
  console.log(`📖 Lettura catalogo da: ${catalogPath}`);

  let catalog;
  try {
    const raw = await fs.readFile(catalogPath, "utf8");
    catalog = JSON.parse(raw);
  } catch (err) {
    console.error("❌ ERRORE: Impossibile leggere il file products.json:", err.message);
    process.exit(1);
  }

  console.log(`📦 Prodotti trovati nel catalogo JSON: ${catalog.length}`);

  // 2. Popola le SKU in InventoryItem
  let skuCount = 0;
  const defaultStock = 1000;

  for (const product of catalog) {
    if (!product.variants || !Array.isArray(product.variants)) continue;

    for (const variant of product.variants) {
      const sku = makeInternalSku(product.id, variant.id);
      
      await prisma.inventoryItem.upsert({
        where: { sku },
        create: {
          sku,
          stock: defaultStock,
          reserved: 0,
        },
        update: {
          // Ripristina lo stock ma non tocca le prenotazioni attive
          stock: defaultStock,
        },
      });
      skuCount++;
    }
  }

  console.log(`✅ Upserted ${skuCount} varianti/SKU in InventoryItem con stock di default = ${defaultStock}`);

  // 3. Inizializza impostazioni del negozio (Setting) se non già esistenti
  const defaultSettings = [
    { key: "storeName", value: "Del Pasqua" },
    { key: "supportEmail", value: "info@delpasqua.com" },
    { key: "shippingFlatCents", value: "990" },
    { key: "freeShippingThresholdCents", value: "6900" },
    { key: "vatRatePercent", value: "4" },
  ];

  let settingCount = 0;
  for (const s of defaultSettings) {
    const existing = await prisma.setting.findUnique({ where: { key: s.key } });
    if (!existing) {
      await prisma.setting.create({ data: s });
      settingCount++;
    }
  }

  if (settingCount > 0) {
    console.log(`✅ Inizializzate ${settingCount} impostazioni di default in Setting`);
  } else {
    console.log("ℹ️ Impostazioni del negozio già configurate, nessuna scrittura necessaria.");
  }

  console.log("\n🎉 Database inizializzato/ripristinato con successo!");
  console.log("==================================================");
}

main()
  .then(async () => {
    await closePrisma();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("❌ Errore durante il seeding:", err);
    await closePrisma();
    process.exit(1);
  });
