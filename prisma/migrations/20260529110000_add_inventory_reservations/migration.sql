ALTER TABLE "InventoryItem"
ADD COLUMN "reserved" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "InventoryReservation" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "qty" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "InventoryReservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InventoryReservation_orderId_sku_key"
ON "InventoryReservation"("orderId", "sku");

CREATE INDEX "InventoryReservation_orderId_idx"
ON "InventoryReservation"("orderId");

CREATE INDEX "InventoryReservation_sku_idx"
ON "InventoryReservation"("sku");

CREATE INDEX "InventoryItem_reserved_idx"
ON "InventoryItem"("reserved");

ALTER TABLE "InventoryReservation"
ADD CONSTRAINT "InventoryReservation_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InventoryReservation"
ADD CONSTRAINT "InventoryReservation_sku_fkey"
FOREIGN KEY ("sku") REFERENCES "InventoryItem"("sku")
ON DELETE CASCADE ON UPDATE CASCADE;
