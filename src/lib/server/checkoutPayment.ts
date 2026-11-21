import { z } from "zod";
import { convertStorefrontCents, storefrontCurrency } from "@/lib/money";
import type { PricingResult } from "./pricing";

export function allocateProportionally(total: number, weights: number[]) {
  if (total <= 0) return weights.map(() => 0);
  const sumW = weights.reduce((a, b) => a + b, 0);
  if (sumW <= 0) return weights.map(() => 0);

  const raw = weights.map((w) => (total * w) / sumW);
  const base = raw.map((x) => Math.floor(x));
  let remainder = total - base.reduce((a, b) => a + b, 0);

  const fracIdx = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac);

  const out = [...base];
  for (let k = 0; k < fracIdx.length && remainder > 0; k++) {
    out[fracIdx[k].i] += 1;
    remainder -= 1;
  }
  return out;
}

const cents = z.number().int().nonnegative();
const checkoutPaymentItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  qty: z.number().int().positive(),
  unitPriceCents: cents,
  lineSubtotalCents: cents,
  lineDiscountCents: cents,
  lineTotalCents: cents,
});
const checkoutPaymentSchema = z.object({
  currency: z.enum(["EUR", "USD", "GBP"]),
  subtotalCents: cents,
  discountCents: cents,
  shippingCents: cents,
  totalCents: cents,
  items: z.array(checkoutPaymentItemSchema),
});

export type CheckoutPayment = z.infer<typeof checkoutPaymentSchema>;
type PricingAmounts = Pick<PricingResult, "subtotalCents" | "discountCents" | "shippingCents"> & {
  items: Pick<PricingResult["items"][number], "productId" | "variantId" | "qty" | "unitPriceCents">[];
};

export function storedCheckoutPayment(value: unknown): CheckoutPayment | null {
  if (value == null) return null;
  return checkoutPaymentSchema.parse(value);
}

export function storedCheckoutPaymentItem(snapshot: unknown) {
  if (!snapshot || typeof snapshot !== "object" || !("payment" in snapshot)) return null;
  return checkoutPaymentItemSchema.parse(snapshot.payment);
}

export function checkoutPayment(pricing: PricingAmounts, locale = "it"): CheckoutPayment {
  const currency = storefrontCurrency(locale);
  const convert = (value: number) => convertStorefrontCents(value, locale);
  const units = pricing.items.map((item) => convert(item.unitPriceCents));
  const weights = pricing.items.map((item, i) => units[i] * item.qty);
  const subtotalCents = weights.reduce((sum, value) => sum + value, 0);
  const discountCents = pricing.discountCents === pricing.subtotalCents
    ? subtotalCents
    : Math.min(subtotalCents, convert(pricing.discountCents));
  const discounts = allocateProportionally(discountCents, weights);
  const shippingCents = convert(pricing.shippingCents);

  return {
    currency,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: subtotalCents - discountCents + shippingCents,
    items: pricing.items.map(({ productId, variantId, qty }, i) => ({
      productId,
      variantId,
      qty,
      unitPriceCents: units[i],
      lineSubtotalCents: weights[i],
      lineDiscountCents: discounts[i],
      lineTotalCents: weights[i] - discounts[i],
    })),
  };
}

export function matchesCheckoutPayment(
  payment: Pick<CheckoutPayment, "currency" | "totalCents">,
  session: { currency: string | null; amount_total: number | null },
) {
  return session.currency === payment.currency.toLowerCase() && session.amount_total === payment.totalCents;
}
