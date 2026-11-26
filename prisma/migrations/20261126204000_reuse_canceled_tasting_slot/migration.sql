DROP INDEX IF EXISTS "TastingBooking_slotStart_slotEnd_key";

CREATE UNIQUE INDEX "TastingBooking_active_slot_key" ON "TastingBooking"("slotStart", "slotEnd")
WHERE "status" <> 'CANCELED';
