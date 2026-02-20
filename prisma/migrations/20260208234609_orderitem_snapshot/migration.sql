/*
  Warnings:

  - Added the required column `lineSubtotalCents` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT NOT NULL,
    "variantLabel" TEXT NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "lineTotalCents" INTEGER NOT NULL,
    "lineSubtotalCents" INTEGER NOT NULL,
    "lineDiscountCents" INTEGER NOT NULL DEFAULT 0,
    "lineVatCents" INTEGER NOT NULL DEFAULT 0,
    "lineTaxCents" INTEGER NOT NULL DEFAULT 0,
    "productSnapshot" JSONB,
    "pricingSnapshot" JSONB,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "lineTotalCents", "orderId", "productId", "qty", "title", "unitPriceCents", "variantId", "variantLabel") SELECT "id", "lineTotalCents", "orderId", "productId", "qty", "title", "unitPriceCents", "variantId", "variantLabel" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_sku_idx" ON "OrderItem"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
