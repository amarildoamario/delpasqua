/**
 * NOME FILE: popola-prodotto-test.ts (ex seed-test-product.ts)
 * SCOPO: Popola il database Prisma/Postgres inserendo o ripristinando a 1000 unità
 *        lo stock del prodotto di test SKU `prodotto-test:standard` per le simulazioni di checkout.
 * UTILIZZO: npx tsx scripts/popola-prodotto-test.ts
 */

import * as dotenv from "dotenv";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import { databasePolicy, databaseGuardExtension } from "../src/lib/server/databaseSafety.mjs";

dotenv.config();

async function main() {
  const policy = databasePolicy();
  const connectionString = policy.connectionString;
  if (!connectionString) {
    console.error("❌ ERRORE: DATABASE_URL non configurato.");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });
  const prisma = policy.readOnly ? client.$extends(databaseGuardExtension(policy)) : client;

  console.log("🔄 Connessione al database e inserimento stock...");
  
  const sku = "prodotto-test:standard";
  
  const row = await prisma.inventoryItem.upsert({
    where: { sku },
    create: {
      sku,
      stock: 1000,
    },
    update: {
      stock: 1000,
    },
  });

  console.log("✅ Prodotto di test configurato con successo in InventoryItem:", row);
  
  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Errore durante il seeding:", err);
  process.exit(1);
});
