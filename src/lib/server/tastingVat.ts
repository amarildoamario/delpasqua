import { calcVatCentsFromSubtotal } from "./vat";

export const TASTING_VAT_PERCENT = 10;

export function tastingVatCents(grossCents: number) {
  return calcVatCentsFromSubtotal(grossCents, TASTING_VAT_PERCENT / 100);
}
