import "dotenv/config";
import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";
import pg from "pg";
import { databasePolicy, databaseGuardExtension } from "./databaseSafety.mjs";

const globalForPrisma = globalThis as unknown as { prismaPostgres?: PrismaClient; databasePolicyKey?: string };
const policy = databasePolicy();
export const databaseReadOnly = policy.readOnly;
const policyKey = createHash("sha256").update(`${policy.mode}:${policy.connectionString}`).digest("hex");

// A hot reload must not reuse a connection created under an older, writable policy.
if (globalForPrisma.prismaPostgres && typeof globalForPrisma.prismaPostgres.$extends === "function" && globalForPrisma.databasePolicyKey !== policyKey) {
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
  globalForPrisma.databasePolicyKey = policyKey;
}
