ALTER TABLE "Quote" ADD COLUMN "shippingTerms" TEXT NOT NULL DEFAULT 'Spedizione all''indirizzo indicato nel preventivo, ai costi concordati.',
ADD COLUMN "paymentToken" TEXT, ADD COLUMN "stripeCustomerId" TEXT, ADD COLUMN "stripeSessionId" TEXT,
ADD COLUMN "checkoutOrderId" TEXT, ADD COLUMN "paidAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "quoteId" TEXT;
ALTER TABLE "Order" ADD CONSTRAINT "Order_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX "Quote_paymentToken_key" ON "Quote"("paymentToken");
CREATE UNIQUE INDEX "Quote_stripeSessionId_key" ON "Quote"("stripeSessionId");
CREATE INDEX "Order_quoteId_idx" ON "Order"("quoteId");
