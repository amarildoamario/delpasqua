import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prismaPostgres?: PrismaClient };

const connectionString = `${process.env.DATABASE_URL}`;

// Creiamo un pool di connessioni personalizzato per evitare saturazione in ambiente serverless (Vercel)
const pool = new pg.Pool({
  connectionString,
  max: 2, // massimo 2 connessioni simultanee per istanza
  idleTimeoutMillis: 30000, // chiusura connessioni inattive dopo 30 secondi
  connectionTimeoutMillis: 2000, // timeout connessione di 2 secondi
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prismaPostgres ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaPostgres = prisma;
