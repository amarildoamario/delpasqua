import Stripe from "stripe";
import { prisma } from "./prisma";
import { calculateQuote, quotePayloadHash, type QuoteInput } from "./quotes";
import { readCatalog } from "./catalog";
import { makeInventorySku } from "@/lib/inventorySku";
import { localStripeTestError } from "./stripeEnvironment";

export class QuoteUpdateError extends Error {}

export async function updateQuote(id: string, input: QuoteInput, client?: Stripe) {
  const catalog = await readCatalog();
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Quote" WHERE "id" = ${id} FOR UPDATE`;
    const stored = await tx.quote.findUnique({ where: { id } });
    if (!stored) throw new QuoteUpdateError("Preventivo non trovato.");
    if (stored.paidAt || stored.checkoutOrderId) throw new QuoteUpdateError("Il preventivo è già stato accettato o pagato e non può essere modificato.");
    if (input.requestId !== stored.requestId) throw new QuoteUpdateError("Ricarica il preventivo prima di modificarlo.");
    const totals = calculateQuote(input, stored.vatRate);
    const items = totals.items.map((line) => {
      const product = catalog.find((p) => p.id === line.productId && p.isTestProduct !== true);
      const variant = product?.variants.find((v) => v.id === line.variantId);
      if (!product || !variant) throw new QuoteUpdateError("Seleziona un prodotto del catalogo per ogni riga.");
      return { ...line, sku: makeInventorySku(product.id, variant.id, variant.sku) };
    });
    if (stored.stripeSessionId) {
      const error = client ? null : localStripeTestError();
      if (error) throw new QuoteUpdateError(error);
      const stripe = client ?? new Stripe(process.env.STRIPE_SECRET_KEY || "", { timeout: 8000, maxNetworkRetries: 0 });
      const session = await stripe.checkout.sessions.retrieve(stored.stripeSessionId);
      if (session.status === "complete" || session.payment_status === "paid") throw new QuoteUpdateError("Pagamento già ricevuto o in elaborazione: il preventivo non può essere modificato.");
      // Expiration must succeed before changing the payable amount or customer data.
      if (session.status === "open") await stripe.checkout.sessions.expire(session.id);
    }
    const { items: _items, validUntil: _validUntil, requestId: _requestId, ...fields } = input;
    void _items; void _validUntil; void _requestId;
    const quote = await tx.quote.update({ where: { id }, data: {
      ...fields, ...totals, items, payloadHash: quotePayloadHash(input),
      stripeSessionId: null, stripeCustomerId: null,
    } });
    await tx.quoteEvent.create({ data: { quoteId: id, type: "UPDATED" } });
    return quote;
  }, { timeout: 45000, maxWait: 5000 });
}
