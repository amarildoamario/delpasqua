export const ORDER_CHECKOUT_PAYMENT_METHOD_TYPES = ["card", "sepa_debit"] as const;

export const TASTING_CHECKOUT_PAYMENT_METHOD_TYPES = ["card"] as const;

export const PUBLIC_PAYMENT_METHOD_BADGES = [
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
  { id: "sepa", label: "SEPA" },
  { id: "card", label: "Card" },
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "amex", label: "American Express" },
] as const;
