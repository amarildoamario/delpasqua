ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "promotionCode" TEXT;

CREATE INDEX IF NOT EXISTS "Order_promotionCode_status_idx"
ON "Order"("promotionCode", "status");

ALTER TABLE "TastingBooking"
ADD COLUMN IF NOT EXISTS "children" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "stripeSessionId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "TastingBooking_stripeSessionId_key"
ON "TastingBooking"("stripeSessionId");
