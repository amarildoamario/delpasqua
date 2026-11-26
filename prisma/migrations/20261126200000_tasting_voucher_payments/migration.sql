CREATE TABLE "TastingVoucherCheckout" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "internal" BOOLEAN NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TastingVoucherCheckout_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TastingVoucher" (
    "id" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "codeDigest" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isTest" BOOLEAN NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TastingVoucher_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TastingVoucherCheckout_stripeSessionId_key" ON "TastingVoucherCheckout"("stripeSessionId");
CREATE INDEX "TastingVoucherCheckout_proposalId_internal_livemode_createdAt_idx" ON "TastingVoucherCheckout"("proposalId", "internal", "livemode", "createdAt");
CREATE INDEX "TastingVoucherCheckout_internal_livemode_createdAt_idx" ON "TastingVoucherCheckout"("internal", "livemode", "createdAt");
CREATE UNIQUE INDEX "TastingVoucher_checkoutId_key" ON "TastingVoucher"("checkoutId");
CREATE UNIQUE INDEX "TastingVoucher_sequence_key" ON "TastingVoucher"("sequence");
CREATE UNIQUE INDEX "TastingVoucher_codeDigest_key" ON "TastingVoucher"("codeDigest");
CREATE UNIQUE INDEX "TastingVoucher_stripePaymentIntentId_key" ON "TastingVoucher"("stripePaymentIntentId");
CREATE INDEX "TastingVoucher_isTest_paidAt_idx" ON "TastingVoucher"("isTest", "paidAt");

ALTER TABLE "TastingVoucherCheckout" ADD CONSTRAINT "TastingVoucherCheckout_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "TastingVoucherProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TastingVoucher" ADD CONSTRAINT "TastingVoucher_checkoutId_fkey"
FOREIGN KEY ("checkoutId") REFERENCES "TastingVoucherCheckout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
