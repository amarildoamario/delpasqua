-- Add structured shipping address fields (P0.03)
ALTER TABLE "Order" ADD COLUMN "addressLine1" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "addressLine2" TEXT;
ALTER TABLE "Order" ADD COLUMN "province" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "postalCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "countryCode" TEXT NOT NULL DEFAULT 'IT';
ALTER TABLE "Order" ADD COLUMN "phone" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingNotes" TEXT;
