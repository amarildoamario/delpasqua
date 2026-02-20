/*
  Warnings:

  - Added the required column `type` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Promotion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
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
INSERT INTO "new_Promotion" ("amountCents", "code", "createdAt", "description", "endsAt", "freeShipping", "id", "isActive", "minOrderCents", "percent", "startsAt", "updatedAt", "usageLimit", "usedCount") SELECT "amountCents", "code", "createdAt", "description", "endsAt", "freeShipping", "id", "isActive", "minOrderCents", "percent", "startsAt", "updatedAt", "usageLimit", "usedCount" FROM "Promotion";
DROP TABLE "Promotion";
ALTER TABLE "new_Promotion" RENAME TO "Promotion";
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
