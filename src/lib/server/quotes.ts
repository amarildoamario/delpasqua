import { createHash } from "node:crypto";
import { z } from "zod";
import type { Quote } from "@/generated/prisma";
import { calcVatCentsFromSubtotal } from "./vat";
import { renderOrderPrintHtml, type PrintableOrder } from "./orderPrint";

const text = (max: number) => z.string().trim().max(max);
const cents = z.number().int().min(0).max(100_000_000);
export const QuoteLineSchema = z.object({
  productId: text(100), variantId: text(100), sku: text(100),
  title: text(200).min(1), variantLabel: text(1000),
  qty: z.number().int().min(1).max(10000), unitPriceCents: cents,
}).strict();
export const QuoteInputSchema = z.object({
  requestId: z.string().uuid(), fullName: text(200).min(1), email: z.email().max(254), phone: text(60),
  addressLine1: text(250).min(1), addressLine2: text(250), city: text(150).min(1),
  postalCode: text(20).min(1), province: text(100), countryCode: z.string().regex(/^[A-Z]{2}$/),
  paymentTerms: text(1000), notes: text(4000), validUntil: z.iso.date(),
  shippingTerms: text(2000).min(1).default("Spedizione all'indirizzo indicato nel preventivo, ai costi concordati."),
  items: z.array(QuoteLineSchema).min(1).max(50), discountCents: cents, shippingCents: cents,
}).strict();
export type QuoteInput = z.infer<typeof QuoteInputSchema>;
export type QuoteLine = z.infer<typeof QuoteLineSchema>;
export type QuoteSnapshot = ReturnType<typeof calculateQuote>;

export function calculateQuote(input: QuoteInput, vatRate: number) {
  if (!Number.isFinite(vatRate) || vatRate < 0 || vatRate > 1) throw new Error("Aliquota IVA del negozio non valida.");
  const subtotalCents = input.items.reduce((sum, item) => sum + item.qty * item.unitPriceCents, 0);
  if (input.discountCents > subtotalCents) throw new Error("Lo sconto supera il subtotale prodotti.");
  const totalCents = subtotalCents - input.discountCents + input.shippingCents;
  if (!Number.isSafeInteger(totalCents) || totalCents < 1 || totalCents > 100_000_000) throw new Error("Totale preventivo non valido (massimo 1.000.000 euro).");
  const base = subtotalCents - input.discountCents;
  // Match the site's VAT treatment: included VAT on products after discount, shipping separate.
  const vatCents = calcVatCentsFromSubtotal(base, vatRate);
  let allocatedDiscount = 0;
  let allocatedVat = 0;
  const items = input.items.map((item, index) => {
    const lineSubtotalCents = item.qty * item.unitPriceCents;
    const last = index === input.items.length - 1;
    const cumulativeSubtotal = input.items.slice(0, index + 1).reduce((s, line) => s + line.qty * line.unitPriceCents, 0);
    const nextDiscount = last ? input.discountCents : subtotalCents ? Math.round(input.discountCents * cumulativeSubtotal / subtotalCents) : 0;
    const lineDiscountCents = nextDiscount - allocatedDiscount;
    allocatedDiscount = nextDiscount;
    const cumulativeNet = cumulativeSubtotal - allocatedDiscount;
    const nextVat = last ? vatCents : base ? Math.round(vatCents * cumulativeNet / base) : 0;
    const lineVatCents = nextVat - allocatedVat;
    allocatedVat = nextVat;
    return { ...item, lineSubtotalCents, lineDiscountCents, lineTotalCents: lineSubtotalCents - lineDiscountCents, lineVatCents };
  });
  return { subtotalCents, totalCents, vatCents, vatRate, discountCents: input.discountCents, shippingCents: input.shippingCents, items };
}

export function quoteNumber(quote: { sequence: number; createdAt: Date }) {
  return `PRE-${quote.createdAt.toLocaleDateString("en-CA", { timeZone: "Europe/Rome", year: "numeric" })}-${String(quote.sequence).padStart(5, "0")}`;
}
export function quotePayloadHash(input: QuoteInput) {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}
export function oneCalendarMonthFrom(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const first = new Date(Date.UTC(part("year"), part("month"), 1));
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const wallClock = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(part("day"), lastDay), 23, 59, 59, 999));
  const zone = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", timeZoneName: "shortOffset" }).formatToParts(wallClock).find((p) => p.type === "timeZoneName")?.value;
  const offsetHours = Number(zone?.replace("GMT", ""));
  // Inclusive validity through the last second of the calendar date in Italy, including DST.
  return new Date(wallClock.getTime() - offsetHours * 3600000);
}

export const QuoteStoredLinesSchema = z.array(QuoteLineSchema.extend({
  lineSubtotalCents: cents, lineDiscountCents: cents, lineTotalCents: cents, lineVatCents: cents,
}));

export function renderQuoteHtml(quote: Quote, logoSrc: string, paymentUrl?: string) {
  const items = QuoteStoredLinesSchema.parse(quote.items);
  const printable: PrintableOrder = {
    ...quote, orderNumber: quoteNumber(quote), status: "IN_ATTESA", items,
    address: quote.addressLine1, zip: quote.postalCode, paymentMethod: quote.paymentTerms || "Da concordare",
    paymentProvider: "", paidAt: null, shippingNotes: null, previousPrintCount: 0, lastPrintedAt: null,
  };
  return renderOrderPrintHtml([printable], logoSrc, { kind: "quote", validUntil: quote.validUntil,
    notes: quote.notes, vatRate: quote.vatRate, paymentUrl, shippingTerms: quote.shippingTerms });
}
