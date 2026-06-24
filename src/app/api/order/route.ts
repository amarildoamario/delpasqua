// src/app/api/order/route.ts
export const runtime = "nodejs";

import { randomUUID } from "crypto";
import Stripe from "stripe";
import { prisma } from "@/lib/server/prisma";
import { CreateOrderSchema } from "@/lib/server/schemas";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { rateLimitOrThrow } from "@/lib/server/rateLimit";
import { createOrderEvent } from "@/lib/server/orderEvents";
import { computeOrderPricing } from "@/lib/server/pricing";
import { evaluatePromotionEligibility, lockPromotionRow } from "@/lib/server/promotionUsage";
import { releaseReserved, reserveStockOrThrow } from "@/lib/server/inventory";
import { computeRiskScore } from "@/lib/server/antiFraud";
import { ORDER_PENDING_TTL_MINUTES } from "@/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
type StripeAllowedCountry = NonNullable<
  Stripe.Checkout.SessionCreateParams.ShippingAddressCollection["allowed_countries"]
>[number];

const SUPPORTED_STRIPE_COUNTRIES = ["IT"] as const satisfies readonly StripeAllowedCountry[];

function toStripeAllowedCountry(countryCode: string): StripeAllowedCountry {
  const normalized = countryCode.trim().toUpperCase();
  return (SUPPORTED_STRIPE_COUNTRIES as readonly string[]).includes(normalized)
    ? (normalized as StripeAllowedCountry)
    : "IT";
}

function getIP(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] ?? "unknown").trim();
}

function resolveAppUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const isLocalRequest = requestOrigin.includes("localhost:");

  if (process.env.NODE_ENV !== "production") {
    return (configuredAppUrl || requestOrigin || "http://localhost:3000").replace(/\/$/, "");
  }

  if (process.env.VERCEL_ENV === "production" && configuredAppUrl) {
    return configuredAppUrl.replace(/\/$/, "");
  }

  return (isLocalRequest ? "http://localhost:3000" : requestOrigin).replace(/\/$/, "");
}

async function failPendingOrderWithoutCheckoutSession(args: {
  orderId: string;
  reason: string;
}) {
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: args.orderId },
        include: { items: true },
      });

      if (!order) return;
      if (order.status !== "IN_ATTESA") return;
      if (order.stripeCheckoutSessionId) return;

      await releaseReserved(tx, {
        orderId: order.id,
        lines: order.items.map((item) => ({ sku: item.sku, qty: item.qty })),
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "FALLITO",
          notes: args.reason,
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          type: "STRIPE_SESSION_FAILED",
          message: args.reason,
        },
      });
    });
  } catch (cleanupError) {
    console.error("Failed to compensate pending order without checkout session", cleanupError);
  }
}

async function expireStripeSessionBestEffort(sessionId: string) {
  try {
    await stripe.checkout.sessions.expire(sessionId);
  } catch (expireError) {
    console.error("Failed to expire Stripe checkout session after local persistence error", {
      sessionId,
      expireError,
    });
  }
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
      const session = "data" in sessionResp ? (sessionResp as { data: Stripe.Checkout.Session }).data : sessionResp;

      if (!session.url) return new Response("Stripe session URL missing", { status: 500 });
      return Response.json({ orderId: existing.id, checkoutUrl: session.url }, { status: 200 });
    }
    if (existing && !existing.stripeCheckoutSessionId) {
      if (existing.status === "IN_ATTESA") {
        await failPendingOrderWithoutCheckoutSession({
          orderId: existing.id,
          reason: "Recovered incomplete idempotent order without Stripe checkout session",
        });
      }

      return Response.json(
        {
          error: "ORDER_SESSION_INCOMPLETE",
          message: "Existing order found without a Stripe checkout session. Retry with a new Idempotency-Key.",
        },
        { status: 409 }
      );
    }

    // parse body
    const json = await req.json().catch(() => null);
    const parsed = CreateOrderSchema.safeParse(json);
    if (!parsed.success) return new Response("Bad Request", { status: 400 });

    const customer = parsed.data.customer; // may be undefined in Stripe-first flow
    const selectedCountry = (parsed.data.countryCode || customer?.countryCode || "IT").toUpperCase();

    // compute pricing + snapshots (single source of truth)
    const pricing = await computeOrderPricing({
      lines: parsed.data.items,
      promotionCode: parsed.data.promotionCode,
      countryCode: selectedCountry,
    });

    // meta
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
      phase: "pre", // ✅ nuovo
    });

    // create order + items + reserve stock (P0.06)
    let order = await prisma.$transaction(async (tx) => {
      if (pricing.promotionApplied?.code) {
        await lockPromotionRow(tx, pricing.promotionApplied.code);
        const eligibility = await evaluatePromotionEligibility(tx, {
          code: pricing.promotionApplied.code,
          subtotalCents: pricing.subtotalCents,
        });

        if (!eligibility.ok) {
          const code =
            eligibility.reason === "USAGE_LIMIT_REACHED"
              ? "PROMO_LIMIT_EXCEEDED"
              : "PROMO_NO_LONGER_VALID";
          const message =
            eligibility.reason === "USAGE_LIMIT_REACHED"
              ? "Promotion code usage limit reached"
              : "Promotion code is no longer valid";
          throw Object.assign(new Error(message), { status: 409, code });
        }
      }

      const created = await tx.order.create({
        data: {
          idempotencyKey: idemKey,
          status: "IN_ATTESA",
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
          countryCode: selectedCountry,
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

              productSnapshot: it.productSnapshot as NonNullable<unknown>,
              pricingSnapshot: it.pricingSnapshot as NonNullable<unknown>,
            })),
          },

          orderPublicToken,
          ipAddress,
          userAgent,
          paymentProvider: "stripe",
          promotionCode: pricing.promotionApplied?.code ?? null,
        },
        include: { items: true },
      });

      await reserveStockOrThrow(tx, {
        orderId: created.id,
        lines: created.items.map((it) => ({ sku: it.sku, qty: it.qty })),
      });

      return created;
    });

    // Stripe checkout
    const appUrl = resolveAppUrl(req);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      ...order.items.map((it) => ({
        quantity: it.qty,
        price_data: {
          currency: "eur",
          unit_amount: it.unitPriceCents,
          product_data: {
            name: it.title,
            description: it.variantLabel,
          } as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData, // Explicit type casting
        },
      })),
    ];
    // IVA non viene aggiunta come riga separata poiché è già inclusa nei prezzi dei singoli prodotti.

    const traceId = randomUUID();

    try {
      await createOrderEvent({
        orderId: order.id,
        type: "ORDER_CREATED",
        message: `Ordine creato (${order.orderNumber ?? order.id})`,
        toStatus: order.status,
        meta: { promotion: pricing.promotionApplied },
      });

      // P0.10 event
      await createOrderEvent({
        orderId: order.id,
        type: "RISK_EVALUATED",
        message: risk.isFlagged ? "Ordine flaggato (anti-frode light)" : "Risk evaluated",
        meta: { riskScore: risk.score, reasons: risk.reasons },
      });
    } catch (orderEventError) {
      await failPendingOrderWithoutCheckoutSession({
        orderId: order.id,
        reason: "Order event recording failed before Stripe checkout session creation",
      });
      throw orderEventError;
    }

    // Se c'e uno sconto, crea un coupon Stripe al volo e aggiungilo alla sessione.
    let stripeCouponId: string | undefined;
    if (pricing.discountCents > 0 && pricing.promotionApplied) {
      try {
        const coupon = await stripe.coupons.create({
          amount_off: pricing.discountCents,
          currency: "eur",
          duration: "once",
          name: `Sconto ${pricing.promotionApplied.code}`,
          metadata: {
            orderId: order.id,
            promotionCode: pricing.promotionApplied.code,
          },
        });
        stripeCouponId = coupon.id;
      } catch (stripeCouponError) {
        await failPendingOrderWithoutCheckoutSession({
          orderId: order.id,
          reason: "Stripe coupon creation failed before checkout session creation",
        });
        throw stripeCouponError;
      }
    }

    let stripeCustomerId: string | undefined;
    if (selectedCountry !== "IT" && customer?.postalCode) {
      try {
        const stripeCust = await stripe.customers.create({
          email: customer.email || undefined,
          name: customer.fullName || "Cliente Internazionale",
          shipping: {
            name: customer.fullName || "Cliente Internazionale",
            address: {
              country: selectedCountry,
              postal_code: customer.postalCode,
              line1: customer.addressLine1 || "Indirizzo da definire",
              city: customer.city || "Citta da definire",
            },
          },
        });
        stripeCustomerId = stripeCust.id;
      } catch (stripeCustErr) {
        console.error("Failed to create Stripe customer on the fly:", stripeCustErr);
      }
    }

    let session: Stripe.Checkout.Session;
    try {
      const sessionResp = await stripe.checkout.sessions.create({
        mode: "payment",
        expires_at: Math.floor(Date.now() / 1000) + ORDER_PENDING_TTL_MINUTES * 60,
        ...(stripeCustomerId
          ? { customer: stripeCustomerId }
          : order.email
          ? { customer_email: order.email }
          : {}),
        shipping_address_collection: { allowed_countries: [toStripeAllowedCountry(selectedCountry)] },
        phone_number_collection: { enabled: true },
        line_items: lineItems,
        ...(stripeCouponId
          ? { discounts: [{ coupon: stripeCouponId }] }
          : {}),
        shipping_options: [
          {
            shipping_rate_data: {
              display_name: order.shippingCents > 0 ? "Spedizione" : "Spedizione gratuita",
              type: "fixed_amount",
              fixed_amount: { currency: "eur", amount: order.shippingCents },
            },
          },
        ],
        success_url: `${appUrl}${parsed.data.locale === "en" ? "/en" : ""}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}${parsed.data.locale === "en" ? "/en" : ""}/checkout/cancel/?session_id={CHECKOUT_SESSION_ID}`,
        client_reference_id: order.id,
        metadata: {
          orderId: order.id,
          traceId,
          promotionCode: parsed.data.promotionCode?.trim().toUpperCase() ?? "",
        },
      });

      session = "data" in sessionResp ? (sessionResp as { data: Stripe.Checkout.Session }).data : sessionResp;
    } catch (stripeCreateError) {
      await failPendingOrderWithoutCheckoutSession({
        orderId: order.id,
        reason: "Stripe checkout session creation failed",
      });
      throw stripeCreateError;
    }

    // log sicuro (no PII)
    console.log("✅ SESSION ID:", session.id);
    console.log("✅ payment_status:", session.payment_status);
    console.log("✅ has_customer_email:", Boolean(session.customer_email));
    console.log("✅ has_shipping_details:", Boolean((session as { shipping_details?: unknown }).shipping_details));

    if (!session.url) {
      await expireStripeSessionBestEffort(session.id);
      await failPendingOrderWithoutCheckoutSession({
        orderId: order.id,
        reason: "Stripe checkout session created without a checkout URL",
      });
      return new Response("Stripe session URL missing", { status: 500 });
    }

    try {
      order = await prisma.order.update({
        where: { id: order.id },
        data: { stripeCheckoutSessionId: session.id },
        include: { items: true },
      });
    } catch (persistSessionError) {
      await expireStripeSessionBestEffort(session.id);
      await failPendingOrderWithoutCheckoutSession({
        orderId: order.id,
        reason: "Stripe checkout session created but could not be persisted locally",
      });
      throw persistSessionError;
    }

    try {
      await createOrderEvent({
        orderId: order.id,
        type: "STRIPE_SESSION_CREATED",
        message: "Stripe checkout session creata",
        meta: { stripeCheckoutSessionId: session.id },
      });
    } catch (eventError) {
      console.error("Failed to record Stripe session creation event", {
        orderId: order.id,
        stripeCheckoutSessionId: session.id,
        eventError,
      });
    }

    return Response.json({ orderId: order.id, checkoutUrl: session.url }, { status: 200 });
  } catch (e: unknown) {
    const err = e as Error & {
      status?: number;
      statusCode?: number;
      retryAfterSec?: number;
      code?: string;
    };
    const status = err?.status ?? err?.statusCode;

    if (status === 429) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(err.retryAfterSec ?? 30) },
      });
    }

    if (status === 413) return new Response("Payload Too Large", { status: 413 });
    if (status === 400) return new Response(err.message ?? "Bad Request", { status: 400 });

    if (status === 409) {
      return Response.json(
        {
          error: err.code ?? "OUT_OF_STOCK",
          message: err.message ?? "Conflict",
        },
        { status: 409 }
      );
    }

    console.error(err);
    return new Response("Server Error", { status: 500 });
  }
}
