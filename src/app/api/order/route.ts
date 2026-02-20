// src/app/api/order/route.ts
export const runtime = "nodejs";

import { randomUUID } from "crypto";
import Stripe from "stripe";
import { prisma } from "@/lib/server/prisma";
import { CreateOrderSchema } from "@/lib/server/schemas";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { rateLimitOrThrow } from "@/lib/server/rateLimit";
import { allocateOrderNumber } from "@/lib/server/orderNumber";
import { createOrderEvent } from "@/lib/server/orderEvents";
import { computeOrderPricing } from "@/lib/server/pricing";
import { getVatRate } from "@/lib/server/vat";
import { reserveStockOrThrow } from "@/lib/server/inventory";
import { computeRiskScore } from "@/lib/server/antiFraud";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getIP(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] ?? "unknown").trim();
}

export async function POST(req: Request) {
  try {
    // basic hardening
    enforceBodyLimit(req, 80_000);
    rateLimitOrThrow({ key: `order:${getIP(req)}`, limit: 10, windowSeconds: 60 });

    // idempotency to avoid duplicate orders/stripe sessions
    const idemKey = req.headers.get("Idempotency-Key");
    if (!idemKey || idemKey.length < 8 || idemKey.length > 200) {
      return new Response("Missing Idempotency-Key", { status: 400 });
    }

    // if already created, return existing session url
    const existing = await prisma.order.findUnique({ where: { idempotencyKey: idemKey } });
    if (existing?.stripeCheckoutSessionId) {
      const sessionResp = await stripe.checkout.sessions.retrieve(existing.stripeCheckoutSessionId);
      const session = (sessionResp as any).data ?? sessionResp;

      if (!session.url) return new Response("Stripe session URL missing", { status: 500 });
      return Response.json({ orderId: existing.id, checkoutUrl: session.url }, { status: 200 });
    }

    // parse body
    const json = await req.json().catch(() => null);
    const parsed = CreateOrderSchema.safeParse(json);
    if (!parsed.success) return new Response("Bad Request", { status: 400 });

    const customer = parsed.data.customer; // may be undefined in Stripe-first flow

    // compute pricing + snapshots (single source of truth)
    const pricing = await computeOrderPricing({
      lines: parsed.data.items,
      promotionCode: parsed.data.promotionCode,
    });

    // meta
    const orderNumber = await allocateOrderNumber(prisma);
    const orderPublicToken = randomUUID().replace(/-/g, "");
    const ipAddress =
      (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "").trim() ||
      (req.headers.get("x-real-ip") ?? null);
    const userAgent = req.headers.get("user-agent") ?? null;

    // P0.10 anti-frode light: risk score (NON blocca)
    const risk = await computeRiskScore({
      prisma,
      ipAddress,
      userAgent,
      email: customer?.email ?? "",
      totalCents: pricing.totalCents,
      items: pricing.items.map((it) => ({ sku: it.sku, qty: it.qty })),
    });

    // create order + items + reserve stock (P0.06)
    const order = await prisma.$transaction(async (tx) => {
      await reserveStockOrThrow(
        tx,
        pricing.items.map((it) => ({ sku: it.sku, qty: it.qty }))
      );

      return tx.order.create({
        data: {
          idempotencyKey: idemKey,
          status: "PENDING",
          currency: "eur",

          subtotalCents: pricing.subtotalCents,
          vatCents: pricing.vatCents,
          shippingCents: pricing.shippingCents,
          discountCents: pricing.discountCents,
          taxCents: pricing.taxCents,
          totalCents: pricing.totalCents,

          // P0.10
          riskScore: risk.score,
          isFlagged: risk.isFlagged,

          // Se già hai email dal form, ok. Se no, verrà salvata dal webhook Stripe su PAID.
          fullName: customer?.fullName ?? "",
          email: customer?.email ?? "",

          // legacy compat
          address: customer?.addressLine1
            ? [customer.addressLine1, customer.addressLine2].filter(Boolean).join(", ")
            : "",
          city: customer?.city ?? "",
          zip: customer?.postalCode ?? "",

          // structured fields (P0.03)
          addressLine1: customer?.addressLine1 ?? "",
          addressLine2: customer?.addressLine2 ?? null,
          province: customer?.province ?? "",
          postalCode: customer?.postalCode ?? "",
          countryCode: (customer?.countryCode ?? "IT").toUpperCase(),
          phone: customer?.phone ?? null,
          shippingNotes: customer?.notes ?? null,

          items: {
            create: pricing.items.map((it) => ({
              productId: it.productId,
              variantId: it.variantId,

              sku: it.sku,
              imageUrl: it.imageUrl ?? null,

              title: it.title,
              variantLabel: it.variantLabel,

              unitPriceCents: it.unitPriceCents,
              qty: it.qty,

              lineTotalCents: it.lineTotalCents,
              lineSubtotalCents: it.lineSubtotalCents,
              lineDiscountCents: it.lineDiscountCents,
              lineVatCents: it.lineVatCents,
              lineTaxCents: it.lineTaxCents,

              productSnapshot: it.productSnapshot,
              pricingSnapshot: it.pricingSnapshot,
            })),
          },

          orderNumber,
          orderPublicToken,
          ipAddress,
          userAgent,
          paymentProvider: "stripe",
        },
        include: { items: true },
      });
    });

    await createOrderEvent({
      orderId: order.id,
      type: "ORDER_CREATED",
      message: `Ordine creato (${order.orderNumber ?? order.id})`,
      toStatus: order.status,
      meta: { ipAddress, userAgent, promotion: pricing.promotionApplied },
    });

    // P0.10 event
    await createOrderEvent({
      orderId: order.id,
      type: "RISK_EVALUATED",
      message: risk.isFlagged ? "Ordine flaggato (anti-frode light)" : "Risk evaluated",
      meta: { riskScore: risk.score, reasons: risk.reasons },
    });

    // Stripe checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const vatRatePct = Math.round(getVatRate() * 100);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      ...order.items.map((it) => ({
        quantity: it.qty,
        price_data: {
          currency: "eur",
          unit_amount: it.unitPriceCents,
          product_data: {
            name: it.title,
            description: it.variantLabel,
          },
        },
      })),
    ];

    // IVA as a separate line item
    if (order.vatCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: order.vatCents,
          product_data: {
            name: `IVA ${vatRatePct}%`,
            description: "Imposta sul valore aggiunto",
          },
        },
      });
    }

    const traceId = randomUUID();

    const sessionResp = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(order.email ? { customer_email: order.email } : {}),
      shipping_address_collection: { allowed_countries: ["IT"] },
      phone_number_collection: { enabled: true },
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: order.shippingCents > 0 ? "Spedizione" : "Spedizione gratuita",
            type: "fixed_amount",
            fixed_amount: { currency: "eur", amount: order.shippingCents },
          },
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        traceId,
        promotionCode: parsed.data.promotionCode?.trim().toUpperCase() ?? "",
      },
    });

    const session = (sessionResp as any).data ?? sessionResp;

    // log sicuro (no PII)
    console.log("✅ SESSION ID:", session.id);
    console.log("✅ payment_status:", session.payment_status);
    console.log("✅ has_customer_email:", Boolean(session.customer_email));
    console.log("✅ has_shipping_details:", Boolean((session as any).shipping_details));

    if (!session.url) return new Response("Stripe session URL missing", { status: 500 });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    await createOrderEvent({
      orderId: order.id,
      type: "STRIPE_SESSION_CREATED",
      message: "Stripe checkout session creata",
      meta: { stripeCheckoutSessionId: session.id },
    });

    return Response.json({ orderId: order.id, checkoutUrl: session.url }, { status: 200 });
  } catch (e: unknown) {
    const err = e as Error & { status?: number; retryAfterSec?: number };

    if (err?.status === 429) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(err.retryAfterSec ?? 30) },
      });
    }

    if (err?.status === 413) return new Response("Payload Too Large", { status: 413 });
    if (err?.status === 400) return new Response(err.message ?? "Bad Request", { status: 400 });

    if (err?.status === 409) {
      return Response.json(
        { error: "OUT_OF_STOCK", message: err.message ?? "Out of stock" },
        { status: 409 }
      );
    }

    console.error(err);
    return new Response("Server Error", { status: 500 });
  }
}
