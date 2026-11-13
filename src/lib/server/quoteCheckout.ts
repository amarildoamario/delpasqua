import { randomBytes, randomUUID } from "node:crypto";
import Stripe from "stripe";
import { localStripeTestError } from "./stripeEnvironment";
import { prisma } from "./prisma";
import { QuoteStoredLinesSchema, quoteNumber } from "./quotes";
import { reserveStockOrThrow, releaseReserved, OutOfStockError } from "./inventory";
import type { orderAnalyticsContext } from "./orderAnalytics";
import { ORDER_PENDING_TTL_MINUTES } from "@/lib/constants";

export class QuoteCheckoutError extends Error {
  constructor(public code: "expired" | "paid" | "unavailable" | "stock", message: string) { super(message); }
}
export function quoteAppOrigin(req: Request) {
  const origin = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL || "https://delpasqua.com"
    : new URL(req.url).origin;
  const url = new URL(origin);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new Error("Invalid payment origin");
  return url.origin;
}
export async function prepareQuoteCheckout(args: {
  quoteId: string; origin: string; accept?: boolean;
  analytics?: ReturnType<typeof orderAnalyticsContext>;
}, client?: Stripe) {
  const environmentError = client ? null : localStripeTestError();
  if (environmentError) throw new QuoteCheckoutError("unavailable", environmentError);
  const stripe = client ?? new Stripe(process.env.STRIPE_SECRET_KEY || "", { timeout: 8000, maxNetworkRetries: 0 });
  let sessionToCompensate: string | null = null;
  try {
    return await prisma.$transaction(async (tx) => {
      // Serialize PDF generation, retries and simultaneous payment clicks for this quote.
      await tx.$queryRaw`SELECT "id" FROM "Quote" WHERE "id" = ${args.quoteId} FOR UPDATE`;
      let quote = await tx.quote.findUnique({ where: { id: args.quoteId } });
      if (!quote) throw new QuoteCheckoutError("unavailable", "Preventivo non disponibile.");
      if (quote.paidAt) throw new QuoteCheckoutError("paid", "Questo preventivo risulta già pagato.");
      if (quote.validUntil.getTime() <= Date.now()) throw new QuoteCheckoutError("expired", "Il preventivo è scaduto. Contattaci per aggiornarlo.");
      const items = QuoteStoredLinesSchema.parse(quote.items);
      if (items.some((item) => !item.sku || !item.productId || !item.variantId)) {
        throw new QuoteCheckoutError("unavailable", "Associa tutte le righe a un prodotto del catalogo per predisporre il pagamento.");
      }
      let session = quote.stripeSessionId ? await stripe.checkout.sessions.retrieve(quote.stripeSessionId) : null;
      if (session?.status === "complete" || session?.payment_status === "paid") {
        throw new QuoteCheckoutError("paid", "Pagamento ricevuto o in elaborazione. Non effettuare un secondo pagamento.");
      }
      if (!session || session.status === "expired") {
        if (quote.checkoutOrderId) {
          const old = await tx.order.findUnique({ where: { id: quote.checkoutOrderId }, include: { items: true } });
          if (old && old.status !== "IN_ATTESA" && !["SCADUTO", "FALLITO", "ANNULLATO"].includes(old.status)) throw new QuoteCheckoutError("paid", "Ordine già elaborato.");
          if (old?.status === "IN_ATTESA") {
            await releaseReserved(tx, { orderId: old.id, lines: old.items });
            await tx.order.update({ where: { id: old.id }, data: { status: "SCADUTO" } });
          }
        }
        // Acceptance is checked against quote validity. A checkout begun just before
        // expiry still gets Stripe's minimum 30-minute completion window.
        const nowSeconds = Math.floor(Date.now() / 1000);
        const expiresAt = Math.max(nowSeconds + 1800, Math.min(Math.floor(quote.validUntil.getTime() / 1000), nowSeconds + ORDER_PENDING_TTL_MINUTES * 60));
        const address = { line1: quote.addressLine1, line2: quote.addressLine2 || undefined, city: quote.city, postal_code: quote.postalCode, state: quote.province || undefined, country: quote.countryCode };
        const customer = quote.stripeCustomerId || (await stripe.customers.create({
          name: quote.fullName, email: quote.email, phone: quote.phone || undefined, address,
          shipping: { name: quote.fullName, phone: quote.phone || undefined, address },
          metadata: { quoteId: quote.id },
        }, { idempotencyKey: `quote-customer/${quote.id}/${quote.payloadHash}` })).id;
        const coupon = quote.discountCents > 0 ? await stripe.coupons.create({
          currency: "eur", amount_off: quote.discountCents, duration: "once", name: `Sconto ${quoteNumber(quote)}`,
        }, { idempotencyKey: `quote-discount/${quote.id}/${quote.payloadHash}` }) : null;
        const token = quote.paymentToken || randomBytes(32).toString("base64url");
        const returnUrl = `${args.origin}/preventivo/${token}/`;
        session = await stripe.checkout.sessions.create({
          mode: "payment", customer, locale: "it", expires_at: expiresAt,
          line_items: items.map((item) => ({ quantity: item.qty, price_data: { currency: "eur", unit_amount: item.unitPriceCents,
            product_data: { name: item.title, ...(item.variantLabel ? { description: item.variantLabel } : {}) } } })),
          ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
          shipping_options: [{ shipping_rate_data: { type: "fixed_amount", display_name: "Spedizione concordata", fixed_amount: { currency: "eur", amount: quote.shippingCents } } }],
          // Shipping is immutable and specified in the PDF. Billing can differ.
          payment_intent_data: { shipping: { name: quote.fullName, phone: quote.phone || undefined, address }, metadata: { quoteId: quote.id, orderType: "commercial" } },
          custom_text: { submit: { message: `Pagamento ${quoteNumber(quote)}. Spedizione a: ${quote.fullName}, ${quote.addressLine1}, ${quote.postalCode} ${quote.city} (${quote.countryCode}).` } },
          metadata: { quoteId: quote.id, orderType: "commercial" },
          success_url: `${args.origin}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${returnUrl}?cancelled=1`,
        }, { idempotencyKey: `quote-session/${quote.id}/${randomUUID()}` });
        if (!session.url) throw new Error("Checkout URL missing");
        sessionToCompensate = session.id;
        quote = await tx.quote.update({ where: { id: quote.id }, data: { paymentToken: token, stripeCustomerId: customer, stripeSessionId: session.id, checkoutOrderId: null } });
        await tx.quoteEvent.create({ data: { quoteId: quote.id, type: "PAYMENT_PREPARED" } });
      }
      if (!session.url || session.amount_total !== quote.totalCents || session.currency !== "eur") throw new Error("Quote/Stripe amount mismatch");
      if (args.accept && !quote.checkoutOrderId) {
        const snapshot = quote;
        const order = await tx.order.create({ data: {
          quoteId: quote.id, idempotencyKey: `quote/${quote.id}/${session.id}`, status: "IN_ATTESA", currency: "eur",
          stripeCustomerId: quote.stripeCustomerId,
          fullName: quote.fullName, email: quote.email, phone: quote.phone || null,
          address: quote.addressLine1, addressLine1: quote.addressLine1, addressLine2: quote.addressLine2,
          city: quote.city, zip: quote.postalCode, postalCode: quote.postalCode, province: quote.province, countryCode: quote.countryCode,
          shippingNotes: quote.shippingTerms, notes: quote.notes, orderPublicToken: randomUUID(),
          subtotalCents: quote.subtotalCents, discountCents: quote.discountCents, vatCents: quote.vatCents, shippingCents: quote.shippingCents, totalCents: quote.totalCents,
          items: { create: items.map((item) => ({ ...item, lineTaxCents: 0, productSnapshot: { productId: item.productId, variantId: item.variantId, title: item.title, variantLabel: item.variantLabel }, pricingSnapshot: { source: "quote", quoteId: snapshot.id, vatRate: snapshot.vatRate } })) },
          events: { create: [
            { type: "ORDER_CREATED", actor: "customer", message: `Accettato preventivo ${quoteNumber(quote)}` },
            ...(args.analytics ? [{ type: "ANALYTICS_CONTEXT", metaJson: JSON.stringify(args.analytics) }] : []),
          ] },
        }, include: { items: true } });
        await reserveStockOrThrow(tx, { orderId: order.id, lines: order.items });
        sessionToCompensate = session.id;
        await stripe.checkout.sessions.update(session.id, { metadata: { quoteId: quote.id, orderId: order.id, orderType: "commercial" } });
        quote = await tx.quote.update({ where: { id: quote.id }, data: { checkoutOrderId: order.id } });
        await tx.quoteEvent.create({ data: { quoteId: quote.id, type: "ACCEPTED" } });
      } else if (args.accept && quote.checkoutOrderId) {
        const order = await tx.order.findUnique({ where: { id: quote.checkoutOrderId } });
        if (!order || order.status !== "IN_ATTESA") throw new QuoteCheckoutError("paid", "Ordine già elaborato. Non ripetere il pagamento.");
      }
      if (args.accept && quote.checkoutOrderId) {
        await tx.order.update({ where: { id: quote.checkoutOrderId }, data: { stripeCheckoutSessionId: session.id } });
      }
      return { quote, paymentUrl: `${args.origin}/preventivo/${quote.paymentToken}/`, checkoutUrl: session.url };
    }, { timeout: 45000, maxWait: 5000 });
  } catch (error) {
    // A failed DB commit must not leave a newly exposed checkout payable without its order.
    if (sessionToCompensate) await stripe.checkout.sessions.expire(sessionToCompensate).catch(() => undefined);
    if (error instanceof OutOfStockError) throw new QuoteCheckoutError("stock", "Disponibilità insufficiente. Contattaci prima di pagare.");
    throw error;
  }
}
