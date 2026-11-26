import "dotenv/config";
import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma";
import pg from "pg";
import { databasePolicy, databaseGuardExtension } from "./databaseSafety.mjs";

const globalForPrisma = globalThis as unknown as { prismaPostgres?: PrismaClient; prismaCacheKey?: string };
const policy = databasePolicy();
export const databaseReadOnly = policy.readOnly;
const cacheKey = createHash("sha256")
  .update(`${policy.mode}:${policy.connectionString}\0`)
  .update(JSON.stringify(Prisma.dmmf.datamodel))
  .digest("hex");

// A dev reload can retain the previous client even after Prisma regenerates the models.
if (globalForPrisma.prismaPostgres && typeof globalForPrisma.prismaPostgres.$extends === "function" && globalForPrisma.prismaCacheKey !== cacheKey) {
  void globalForPrisma.prismaPostgres.$disconnect();
  globalForPrisma.prismaPostgres = undefined;
}

function createClient(): PrismaClient {
  const pool = new pg.Pool({
    connectionString: policy.connectionString,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  const client = new PrismaClient({ adapter: new PrismaPg(pool), log: ["error", "warn"] });
  return policy.readOnly ? client.$extends(databaseGuardExtension(policy)) as unknown as PrismaClient : client;
}

export const prisma = globalForPrisma.prismaPostgres ?? createClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaPostgres = prisma;
  globalForPrisma.prismaCacheKey = cacheKey;
}
