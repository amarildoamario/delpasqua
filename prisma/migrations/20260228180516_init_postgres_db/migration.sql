-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "StripeEventOutcome" AS ENUM ('processed', 'ignored', 'duplicate', 'failed_signature', 'failed_validation', 'failed_processing', 'review');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('pending', 'processing', 'done', 'failed');

-- CreateEnum
CREATE TYPE "TransactionalEmailType" AS ENUM ('ORDER_RECEIVED', 'ORDER_PAID', 'ORDER_SHIPPED', 'ORDER_CANCELED', 'ORDER_REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionalEmailStatus" AS ENUM ('sent', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "TastingBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
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
    "preparingAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "trackingCode" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "addressLine1" TEXT NOT NULL DEFAULT '',
    "addressLine2" TEXT,
    "province" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "countryCode" TEXT NOT NULL DEFAULT 'IT',
    "phone" TEXT,
    "shippingNotes" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT,
    "type" TEXT NOT NULL,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus",
    "message" TEXT,
    "metaJson" TEXT,

    CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "created" INTEGER NOT NULL,
    "orderId" TEXT,
    "sessionId" TEXT,
    "paymentIntentId" TEXT,
    "outcome" "StripeEventOutcome" NOT NULL DEFAULT 'ignored',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "errorStack" TEXT,
    "payloadSnippet" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "percent" INTEGER,
    "amountCents" INTEGER,
    "freeShipping" BOOLEAN NOT NULL DEFAULT false,
    "minOrderCents" INTEGER,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "ProductMerch" (
    "id" TEXT NOT NULL,
    "productKey" TEXT NOT NULL,
    "showInHome" BOOLEAN NOT NULL DEFAULT false,
    "homeRank" INTEGER NOT NULL DEFAULT 0,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "badge" TEXT,
    "promoLabel" TEXT,
    "discountPercent" INTEGER,
    "discountCents" INTEGER,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductMerch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT,
    "referrer" TEXT,
    "pageId" TEXT,
    "durationMs" INTEGER,
    "productKey" TEXT,
    "variantKey" TEXT,
    "cartId" TEXT,
    "orderId" TEXT,
    "device" TEXT,
    "userAgent" TEXT,
    "env" TEXT NOT NULL DEFAULT 'prod',
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "sku" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("sku")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "csrfHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitCounter" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "windowStart" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionalEmailLog" (
    "id" TEXT NOT NULL,
    "type" "TransactionalEmailType" NOT NULL,
    "status" "TransactionalEmailStatus" NOT NULL DEFAULT 'skipped',
    "orderId" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "messageId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionalEmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TastingBooking" (
    "id" TEXT NOT NULL,
    "status" "TastingBookingStatus" NOT NULL DEFAULT 'PENDING',
    "slotStart" TIMESTAMP(3) NOT NULL,
    "slotEnd" TIMESTAMP(3) NOT NULL,
    "tastingType" TEXT NOT NULL,
    "people" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TastingBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderPublicToken_key" ON "Order"("orderPublicToken");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_sku_idx" ON "OrderItem"("sku");

-- CreateIndex
CREATE INDEX "OrderEvent_orderId_createdAt_idx" ON "OrderEvent"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhookEvent_eventId_key" ON "StripeWebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_type_idx" ON "StripeWebhookEvent"("type");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_orderId_idx" ON "StripeWebhookEvent"("orderId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_sessionId_idx" ON "StripeWebhookEvent"("sessionId");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_runAt_idx" ON "OutboxEvent"("status", "runAt");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductMerch_productKey_key" ON "ProductMerch"("productKey");

-- CreateIndex
CREATE INDEX "ProductMerch_showInHome_homeRank_idx" ON "ProductMerch"("showInHome", "homeRank");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_path_createdAt_idx" ON "AnalyticsEvent"("path", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_productKey_variantKey_createdAt_idx" ON "AnalyticsEvent"("productKey", "variantKey", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_cartId_createdAt_idx" ON "AnalyticsEvent"("cartId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_visitorId_createdAt_idx" ON "AnalyticsEvent"("visitorId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_createdAt_idx" ON "AnalyticsEvent"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_env_isInternal_createdAt_idx" ON "AnalyticsEvent"("env", "isInternal", "createdAt");

-- CreateIndex
CREATE INDEX "InventoryItem_stock_idx" ON "InventoryItem"("stock");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_csrfHash_key" ON "AdminSession"("csrfHash");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE INDEX "AdminSession_revokedAt_idx" ON "AdminSession"("revokedAt");

-- CreateIndex
CREATE INDEX "RateLimitCounter_key_windowStart_idx" ON "RateLimitCounter"("key", "windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimitCounter_key_windowStart_key" ON "RateLimitCounter"("key", "windowStart");

-- CreateIndex
CREATE INDEX "TransactionalEmailLog_orderId_idx" ON "TransactionalEmailLog"("orderId");

-- CreateIndex
CREATE INDEX "TransactionalEmailLog_type_createdAt_idx" ON "TransactionalEmailLog"("type", "createdAt");

-- CreateIndex
CREATE INDEX "TransactionalEmailLog_status_createdAt_idx" ON "TransactionalEmailLog"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionalEmailLog_orderId_type_key" ON "TransactionalEmailLog"("orderId", "type");

-- CreateIndex
CREATE INDEX "TastingBooking_slotStart_idx" ON "TastingBooking"("slotStart");

-- CreateIndex
CREATE INDEX "TastingBooking_status_slotStart_idx" ON "TastingBooking"("status", "slotStart");

-- CreateIndex
CREATE UNIQUE INDEX "TastingBooking_slotStart_slotEnd_key" ON "TastingBooking"("slotStart", "slotEnd");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEvent" ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
