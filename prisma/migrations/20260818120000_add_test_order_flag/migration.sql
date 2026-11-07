ALTER TABLE "Order"
ADD COLUMN "isTest" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Order_isTest_createdAt_idx"
ON "Order"("isTest", "createdAt");
