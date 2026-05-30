export function getVatRate() {
  const r = Number(process.env.VAT_RATE ?? "0.04");
  return Number.isFinite(r) && r >= 0 ? r : 0.04;
}

// IVA INCLUSA: scorporo dell'IVA incorporata nel prezzo subtotale
export function calcVatCentsFromSubtotal(subtotalCents: number, rate = getVatRate()) {
  return Math.round((subtotalCents * rate) / (1 + rate));
}
