export function getVatRate() {
  const r = Number(process.env.VAT_RATE ?? "0.04");
  return Number.isFinite(r) && r >= 0 ? r : 0.04;
}

// IVA ESCLUSA: VAT = subtotal * rate
export function calcVatCentsFromSubtotal(subtotalCents: number) {
  const rate = getVatRate();
  return Math.round(subtotalCents * rate);
}
