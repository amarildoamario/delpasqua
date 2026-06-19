export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { rateLimit } from "@/lib/server/rateLimit";
import { AdminOrderRefundSchema } from "@/lib/server/schemas";
import { applyStripeRefundToOrderTx, isRefundableOrderStatus } from "@/lib/server/orderRefund";
import { processOutboxBatch } from "@/lib/server/outbox";
import { OrderInvariantError } from "@/lib/server/orderStatus";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function stripeId(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 10, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id } = await ctx.params;

  try {
    enforceBodyLimit(req, 10_000);
    const body = await req.json().catch(() => null);
    const parsed = AdminOrderRefundSchema.safeParse(body ?? {});
    if (!parsed.success) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        totalCents: true,
        refundCents: true,
        stripePaymentIntentId: true,
        stripeChargeId: true,
      },
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!isRefundableOrderStatus(order.status)) {
      return NextResponse.json({ error: "ORDER_NOT_REFUNDABLE" }, { status: 400 });
    }
    if (!order.stripePaymentIntentId) {
      return NextResponse.json({ error: "MISSING_STRIPE_PAYMENT_INTENT" }, { status: 409 });
    }

    const remainingRefundCents = order.totalCents - order.refundCents;
    if (remainingRefundCents <= 0) {
      return NextResponse.json({ error: "ORDER_ALREADY_REFUNDED" }, { status: 409 });
    }

    const refund = await stripe.refunds.create(
      {
        payment_intent: order.stripePaymentIntentId,
        amount: remainingRefundCents,
        reason: parsed.data.reason,
        metadata: {
          orderId: order.id,
          source: "admin_refund",
          message: parsed.data.message ?? "",
        },
      },
      {
        idempotencyKey: `order-refund:${order.id}:${order.refundCents}:${remainingRefundCents}`,
      }
    );

    if (refund.status === "failed" || refund.status === "canceled") {
      return NextResponse.json(
        {
          error: "STRIPE_REFUND_NOT_COMPLETED",
          refundId: refund.id,
          status: refund.status,
        },
        { status: 502 }
      );
    }

    let stripeChargeId = stripeId(refund.charge) ?? order.stripeChargeId;
    let cumulativeRefundCents = Math.min(order.totalCents, order.refundCents + refund.amount);

    if (stripeChargeId) {
      const charge = await stripe.charges.retrieve(stripeChargeId);
      stripeChargeId = charge.id;
      cumulativeRefundCents = charge.amount_refunded;
    }

    const updated = await prisma.$transaction((tx) =>
      applyStripeRefundToOrderTx(tx, {
        orderId: order.id,
        cumulativeRefundCents,
        source: "admin_refund",
        actor: guard.session.id,
        stripeRefundId: refund.id,
        stripeChargeId,
        stripePaymentIntentId: order.stripePaymentIntentId,
        reason: parsed.data.message ?? parsed.data.reason,
      })
    );

    processOutboxBatch({ limit: 10 }).catch((error) => {
      console.error("outbox auto-process failed (admin refund):", error);
    });

    return guard.attach(
      NextResponse.json(
        {
          ok: true,
          order: updated,
          refund: {
            id: refund.id,
            status: refund.status,
            amount: refund.amount,
          },
        },
        { status: 200 }
      )
    );
  } catch (error: unknown) {
    const err = error as Error & { status?: number; statusCode?: number };
    if (err.status === 413) return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    if (err instanceof OrderInvariantError) {
      return NextResponse.json(
        { error: err.code, violations: err.violations },
        { status: 409 }
      );
    }
    console.error("Admin Stripe refund failed", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
