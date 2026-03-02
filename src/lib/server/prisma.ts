import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prismaPostgres?: PrismaClient };

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prismaPostgres ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaPostgres = prisma;
