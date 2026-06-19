// src/lib/shippingConfig.ts

export interface ShippingRule {
  countryCode: string;              // ISO country code, e.g. "IT", "DE"
  nameIt: string;                   // Display name in Italian
  nameEn: string;                   // Display name in English
  shippingFlatCents: number;        // Flat shipping rate in cents
  freeShippingThresholdCents: number; // Minimum order value for free shipping
  returnShippingFeeCents: number;    // Return shipping cost in cents (0 if free)
  deliveryDaysMin: number;          // Estimated delivery minimum days
  deliveryDaysMax: number;          // Estimated delivery maximum days
}

export const SHIPPING_RULES: Record<string, ShippingRule> = {
  IT: {
    countryCode: "IT",
    nameIt: "Italia",
    nameEn: "Italy",
    shippingFlatCents: 590, // 5.90 EUR
    freeShippingThresholdCents: 5000, // 50.00 EUR
    returnShippingFeeCents: 0, // Free returns in Italy
    deliveryDaysMin: 2,
    deliveryDaysMax: 3,
  },
  DE: {
    countryCode: "DE",
    nameIt: "Germania",
    nameEn: "Germany",
    shippingFlatCents: 1290, // 12.90 EUR
    freeShippingThresholdCents: 9000, // 90.00 EUR
    returnShippingFeeCents: 590, // 5.90 EUR return
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
  },
  NL: {
    countryCode: "NL",
    nameIt: "Paesi Bassi",
    nameEn: "Netherlands",
    shippingFlatCents: 1290, // 12.90 EUR
    freeShippingThresholdCents: 10000, // 100.00 EUR
    returnShippingFeeCents: 690, // 6.90 EUR return
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
  },
  DK: {
    countryCode: "DK",
    nameIt: "Danimarca",
    nameEn: "Denmark",
    shippingFlatCents: 1490, // 14.90 EUR
    freeShippingThresholdCents: 12000, // 120.00 EUR
    returnShippingFeeCents: 790, // 7.90 EUR return
    deliveryDaysMin: 4,
    deliveryDaysMax: 6,
  },
  NO: {
    countryCode: "NO",
    nameIt: "Norvegia",
    nameEn: "Norway",
    shippingFlatCents: 1990, // 19.90 EUR
    freeShippingThresholdCents: 15000, // 150.00 EUR
    returnShippingFeeCents: 990, // 9.90 EUR return
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
  },
  US: {
    countryCode: "US",
    nameIt: "Stati Uniti",
    nameEn: "United States",
    shippingFlatCents: 3900, // 39.00 EUR base
    freeShippingThresholdCents: 9999999, // Overrides handled dynamically (no free shipping)
    returnShippingFeeCents: 1990,
    deliveryDaysMin: 5,
    deliveryDaysMax: 9,
  },
  GB: {
    countryCode: "GB",
    nameIt: "Regno Unito",
    nameEn: "United Kingdom",
    shippingFlatCents: 1800, // 18.00 EUR base
    freeShippingThresholdCents: 15000, // 150.00 EUR
    returnShippingFeeCents: 990, // 9.90 EUR return
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
  },
  // Default fallback zone for other European countries
  EU: {
    countryCode: "EU",
    nameIt: "Resto d'Europa (UE)",
    nameEn: "Rest of Europe (EU)",
    shippingFlatCents: 1500, // 15.00 EUR
    freeShippingThresholdCents: 12000, // 120.00 EUR
    returnShippingFeeCents: 790, // 7.90 EUR return
    deliveryDaysMin: 4,
    deliveryDaysMax: 6,
  },
};

/**
 * Returns the shipping rule for a specific country code.
 * If the country is not explicitly defined, it falls back to the EU rule.
 */
export function getShippingRule(countryCode: string): ShippingRule {
  const code = countryCode.trim().toUpperCase();
  if (code in SHIPPING_RULES) {
    return SHIPPING_RULES[code];
  }
  // Fallback to generic EU shipping rate
  return SHIPPING_RULES.EU;
}

/**
 * Returns list of explicitly supported country codes for shipping
 */
export function getSupportedCountries(): string[] {
  return ["IT", "DE", "NL", "DK", "NO", "US", "GB"];
}
