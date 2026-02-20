-- CreateTable
CREATE TABLE "ProductMerch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productKey" TEXT NOT NULL,
    "showInHome" BOOLEAN NOT NULL DEFAULT false,
    "homeRank" INTEGER NOT NULL DEFAULT 0,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "badge" TEXT,
    "promoLabel" TEXT,
    "discountPercent" INTEGER,
    "discountCents" INTEGER,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductMerch_productKey_key" ON "ProductMerch"("productKey");

-- CreateIndex
CREATE INDEX "ProductMerch_showInHome_homeRank_idx" ON "ProductMerch"("showInHome", "homeRank");
