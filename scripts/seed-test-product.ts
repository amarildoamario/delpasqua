import * as dotenv from "dotenv";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ ERRORE: DATABASE_URL non configurato.");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

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
