-- CreateTable
CREATE TABLE "OrderEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT,
    "type" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "message" TEXT,
    "metaJson" TEXT,
    CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idempotencyKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "orderNumber" TEXT,
    "orderPublicToken" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "subtotalCents" INTEGER NOT NULL,
    "vatCents" INTEGER NOT NULL,
    "shippingCents" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "discountCents" INTEGER NOT NULL DEFAULT 0,
    "taxCents" INTEGER NOT NULL DEFAULT 0,
    "stripeFeeCents" INTEGER NOT NULL DEFAULT 0,
    "refundCents" INTEGER NOT NULL DEFAULT 0,
    "paymentProvider" TEXT NOT NULL DEFAULT 'stripe',
    "stripeCustomerId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeChargeId" TEXT,
    "stripeBalanceTxnId" TEXT,
    "paymentMethod" TEXT,
    "shippedAt" DATETIME,
    "trackingCode" TEXT,
    "deliveredAt" DATETIME,
    "canceledAt" DATETIME,
    "refundedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paidAt" DATETIME,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT
);
INSERT INTO "new_Order" ("address", "city", "createdAt", "currency", "email", "fullName", "id", "idempotencyKey", "paidAt", "paymentMethod", "refundCents", "shippedAt", "shippingCents", "status", "stripeBalanceTxnId", "stripeChargeId", "stripeFeeCents", "stripePaymentIntentId", "stripeSessionId", "subtotalCents", "totalCents", "trackingCode", "updatedAt", "vatCents", "zip") SELECT "address", "city", "createdAt", "currency", "email", "fullName", "id", "idempotencyKey", "paidAt", "paymentMethod", "refundCents", "shippedAt", "shippingCents", "status", "stripeBalanceTxnId", "stripeChargeId", "stripeFeeCents", "stripePaymentIntentId", "stripeSessionId", "subtotalCents", "totalCents", "trackingCode", "updatedAt", "vatCents", "zip" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Order_orderPublicToken_key" ON "Order"("orderPublicToken");
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "OrderEvent_orderId_createdAt_idx" ON "OrderEvent"("orderId", "createdAt");
