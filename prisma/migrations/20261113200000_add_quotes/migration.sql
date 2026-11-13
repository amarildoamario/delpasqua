CREATE TABLE "Quote" (
 "id" TEXT NOT NULL PRIMARY KEY, "sequence" SERIAL NOT NULL, "requestId" TEXT NOT NULL, "payloadHash" TEXT NOT NULL,
 "fullName" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT NOT NULL,
 "addressLine1" TEXT NOT NULL, "addressLine2" TEXT NOT NULL, "city" TEXT NOT NULL,
 "postalCode" TEXT NOT NULL, "province" TEXT NOT NULL, "countryCode" TEXT NOT NULL,
 "paymentTerms" TEXT NOT NULL, "notes" TEXT NOT NULL, "validUntil" TIMESTAMP(3) NOT NULL,
 "items" JSONB NOT NULL, "subtotalCents" INTEGER NOT NULL, "discountCents" INTEGER NOT NULL,
 "shippingCents" INTEGER NOT NULL, "vatCents" INTEGER NOT NULL, "vatRate" DOUBLE PRECISION NOT NULL,
 "totalCents" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Quote_sequence_key" ON "Quote"("sequence");
CREATE UNIQUE INDEX "Quote_requestId_key" ON "Quote"("requestId");
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");
CREATE TABLE "QuoteEvent" (
 "id" TEXT NOT NULL PRIMARY KEY, "quoteId" TEXT NOT NULL, "type" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "QuoteEvent_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "QuoteEvent_quoteId_createdAt_idx" ON "QuoteEvent"("quoteId", "createdAt");
