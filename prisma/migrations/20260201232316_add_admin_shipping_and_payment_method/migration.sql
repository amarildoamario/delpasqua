-- AlterTable
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippedAt" DATETIME;
ALTER TABLE "Order" ADD COLUMN "trackingCode" TEXT;
