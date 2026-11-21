ALTER TABLE "Order"
  ADD COLUMN "paymentPricing" JSONB,
  ADD COLUMN "paymentRefundCents" INTEGER;
