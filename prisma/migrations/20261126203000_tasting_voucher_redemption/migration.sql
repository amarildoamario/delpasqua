ALTER TABLE "TastingBooking" ADD COLUMN "voucherId" TEXT;

ALTER TABLE "TastingBooking" ADD CONSTRAINT "TastingBooking_voucherId_fkey"
FOREIGN KEY ("voucherId") REFERENCES "TastingVoucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "TastingBooking_voucherId_idx" ON "TastingBooking"("voucherId");
CREATE UNIQUE INDEX "TastingBooking_active_voucher_key" ON "TastingBooking"("voucherId")
WHERE "voucherId" IS NOT NULL AND "status" <> 'CANCELED';
