-- CreateTable
CREATE TABLE "InventoryItem" (
    "sku" TEXT NOT NULL PRIMARY KEY,
    "stock" INTEGER NOT NULL,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "csrfHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME,
    "rotatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "ipAddress" TEXT,
    "userAgent" TEXT
);

-- CreateTable
CREATE TABLE "RateLimitCounter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "windowStart" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TransactionalEmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'skipped',
    "orderId" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "messageId" TEXT,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
