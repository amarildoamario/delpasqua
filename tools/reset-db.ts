/**
 * tools/reset-db.ts (HARD)
 *
 * Uso:
 *   npx tsx tools/reset-db.ts
 */

import "dotenv/config";
import { PrismaClient, Prisma } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

function assertNotProduction() {
  const env = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  if (env === "production" || vercelEnv === "production") {
    console.error("❌ Refused: environment looks like PRODUCTION.");
    process.exit(1);
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

type ResetResult = { model: string; deleted?: number; skipped?: boolean };

type DeleteManyResult = { count?: number };
type DeleteManyCapable = {
  deleteMany: (args: Record<string, never>) => Promise<DeleteManyResult>;
};

function isDeleteManyCapable(value: unknown): value is DeleteManyCapable {
  return (
    typeof value === "object" &&
    value !== null &&
    "deleteMany" in value &&
    typeof (value as { deleteMany?: unknown }).deleteMany === "function"
  );
}

async function main() {
  assertNotProduction();

  console.log("🧹 HARD reset — starting...");
  console.log("DATABASE_URL =", process.env.DATABASE_URL || "(fallback) file:./dev.db");

  const results: ResetResult[] = [];

  const deleteOrder = [
    "tastingBooking", // ✅ AGGIUNTO: cancella prenotazioni degustazioni
    "orderItem",
    "order",
    "analyticsEvent",
    "stripeWebhookEvent",
    "outboxEvent",
    "promotion",
    "productMerch",
    "setting",
  ] as const satisfies ReadonlyArray<keyof Prisma.TransactionClient>;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const modelName of deleteOrder) {
      const delegate = (tx as unknown as Record<string, unknown>)[modelName];

      if (!isDeleteManyCapable(delegate)) {
        results.push({ model: modelName, skipped: true });
        continue;
      }

      const res = await delegate.deleteMany({});
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
  .catch((e: unknown) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });