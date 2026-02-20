-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "data" JSONB
);
INSERT INTO "new_AnalyticsEvent" ("cartId", "createdAt", "data", "device", "durationMs", "id", "orderId", "pageId", "path", "productKey", "referrer", "sessionId", "type", "userAgent", "variantKey", "visitorId") SELECT "cartId", "createdAt", "data", "device", "durationMs", "id", "orderId", "pageId", "path", "productKey", "referrer", "sessionId", "type", "userAgent", "variantKey", "visitorId" FROM "AnalyticsEvent";
DROP TABLE "AnalyticsEvent";
ALTER TABLE "new_AnalyticsEvent" RENAME TO "AnalyticsEvent";
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");
CREATE INDEX "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");
CREATE INDEX "AnalyticsEvent_path_createdAt_idx" ON "AnalyticsEvent"("path", "createdAt");
CREATE INDEX "AnalyticsEvent_productKey_variantKey_createdAt_idx" ON "AnalyticsEvent"("productKey", "variantKey", "createdAt");
CREATE INDEX "AnalyticsEvent_cartId_createdAt_idx" ON "AnalyticsEvent"("cartId", "createdAt");
CREATE INDEX "AnalyticsEvent_visitorId_createdAt_idx" ON "AnalyticsEvent"("visitorId", "createdAt");
CREATE INDEX "AnalyticsEvent_sessionId_createdAt_idx" ON "AnalyticsEvent"("sessionId", "createdAt");
CREATE INDEX "AnalyticsEvent_env_isInternal_createdAt_idx" ON "AnalyticsEvent"("env", "isInternal", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
