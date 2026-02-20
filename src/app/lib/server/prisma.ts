import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

// ✅ Nel tuo client è REQUIRED: se manca, falliamo subito con errore chiaro.
if (!accelerateUrl) {
  throw new Error(
    "Missing PRISMA_ACCELERATE_URL. Add it to your .env (even in dev) because this Prisma Client requires Accelerate."
  );
}

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    accelerateUrl,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;
