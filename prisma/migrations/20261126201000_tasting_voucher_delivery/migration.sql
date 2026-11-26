CREATE TABLE "TastingVoucherDelivery" (
    "voucherId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "replyTo" TEXT,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "pdfEncrypted" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "providerId" TEXT,
    CONSTRAINT "TastingVoucherDelivery_pkey" PRIMARY KEY ("voucherId")
);

ALTER TABLE "TastingVoucherDelivery" ADD CONSTRAINT "TastingVoucherDelivery_voucherId_fkey"
FOREIGN KEY ("voucherId") REFERENCES "TastingVoucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
