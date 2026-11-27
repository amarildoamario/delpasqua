import type Stripe from "stripe";
import { TASTING_VAT_PERCENT } from "./tastingVat";

const scope = "delpasqua_tasting_vat";
const inFlight = new WeakMap<Stripe, Promise<string>>();

async function findOrCreateTastingTaxRate(stripe: Stripe) {
  for await (const rate of stripe.taxRates.list({ active: true, inclusive: true, limit: 100 })) {
    if (rate.percentage === TASTING_VAT_PERCENT && rate.country === "IT"
      && !rate.state && rate.tax_type === "vat") return rate.id;
  }

  const rate = await stripe.taxRates.create({
    display_name: "IVA",
    description: "IVA inclusa su degustazioni e voucher",
    country: "IT",
    jurisdiction: "IT",
    tax_type: "vat",
    inclusive: true,
    percentage: TASTING_VAT_PERCENT,
    metadata: { scope },
  }, { idempotencyKey: `${scope}/${TASTING_VAT_PERCENT}` });
  if (!rate.active) throw new Error("Aliquota Stripe degustazioni non attiva.");
  return rate.id;
}

export function getTastingStripeTaxRate(stripe: Stripe) {
  const current = inFlight.get(stripe);
  if (current) return current;
  const rate = findOrCreateTastingTaxRate(stripe).finally(() => inFlight.delete(stripe));
  inFlight.set(stripe, rate);
  return rate;
}
