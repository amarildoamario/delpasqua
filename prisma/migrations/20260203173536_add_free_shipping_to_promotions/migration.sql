/*
  Warnings:

  - You are about to drop the column `type` on the `Promotion` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Promotion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "percent" INTEGER,
    "amountCents" INTEGER,
    "freeShipping" BOOLEAN NOT NULL DEFAULT false,
    "minOrderCents" INTEGER,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Promotion" ("amountCents", "code", "createdAt", "description", "endsAt", "id", "isActive", "minOrderCents", "percent", "startsAt", "updatedAt", "usageLimit", "usedCount") SELECT "amountCents", "code", "createdAt", "description", "endsAt", "id", "isActive", "minOrderCents", "percent", "startsAt", "updatedAt", "usageLimit", "usedCount" FROM "Promotion";
DROP TABLE "Promotion";
ALTER TABLE "new_Promotion" RENAME TO "Promotion";
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");
CREATE INDEX "Promotion_isActive_idx" ON "Promotion"("isActive");
CREATE INDEX "Promotion_code_idx" ON "Promotion"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
