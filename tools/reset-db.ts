/**
 * tools/reset-db.ts (HARD)
 *
 * Uso:
 *   npx tsx tools/reset-db.ts
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function assertNotProduction() {
  const env = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  if (env === "production" || vercelEnv === "production") {
    console.error("❌ Refused: environment looks like PRODUCTION.");
    process.exit(1);
  }
}

const adapter = new PrismaBetterSqlite3({
  // 🔥 IDENTICO a src/lib/server/prisma.ts
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

async function main() {
  assertNotProduction();

  console.log("🧹 HARD reset — starting...");
  console.log("DATABASE_URL =", process.env.DATABASE_URL || "(fallback) file:./dev.db");

  const results: Array<{ model: string; deleted?: number; skipped?: boolean }> = [];

  const deleteOrder = [
    "orderItem",
    "order",
    "analyticsEvent",
    "stripeWebhookEvent",
    "outboxEvent",
    "promotion",
    "productMerch",
    "setting",
  ] as const;

  await prisma.$transaction(async (tx) => {
    for (const modelName of deleteOrder) {
      const model: any = (tx as any)[modelName];

      if (!model?.deleteMany) {
        results.push({ model: modelName, skipped: true });
        continue;
      }

      const res = await model.deleteMany({});
      results.push({ model: modelName, deleted: res.count ?? 0 });
    }
  });

  for (const r of results) {
    if (r.skipped) console.log(`- ${r.model}: (skip)`);
    else console.log(`- ${r.model}: deleted ${r.deleted}`);
  }

  console.log("✅ HARD reset completed.");
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
