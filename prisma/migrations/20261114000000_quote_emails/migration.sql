CREATE TABLE "QuoteEmail" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "replyTo" TEXT,
    "filename" TEXT NOT NULL,
    "pdf" BYTEA NOT NULL,
    "emailId" TEXT,
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuoteEmail_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "QuoteEmail_idempotencyKey_key" ON "QuoteEmail"("idempotencyKey");
CREATE UNIQUE INDEX "QuoteEmail_emailId_key" ON "QuoteEmail"("emailId");
CREATE INDEX "QuoteEmail_quoteId_createdAt_idx" ON "QuoteEmail"("quoteId", "createdAt");
CREATE INDEX "QuoteEmail_createdAt_idx" ON "QuoteEmail"("createdAt");
ALTER TABLE "QuoteEmail" ADD CONSTRAINT "QuoteEmail_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
