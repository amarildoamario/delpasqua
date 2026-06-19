import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { assertOrderInvariants } from "@/lib/server/orderStatus";

type Tx = Prisma.TransactionClient;

const REFUNDABLE_STATUSES: OrderStatus[] = [
  "PAGATO",
  "IN_PREPARAZIONE",
  "SPEDITO",
  "CONSEGNATO",
  "PARZIALMENTE_RIMBORSATO",
  "RIMBORSATO",
];

type ApplyStripeRefundArgs = {
  orderId: string;
  cumulativeRefundCents: number;
  source: "stripe_webhook" | "admin_refund";
  actor?: string | null;
  stripeEventId?: string | null;
  stripeRefundId?: string | null;
  stripeChargeId?: string | null;
  stripePaymentIntentId?: string | null;
  reason?: string | null;
};

export function isRefundableOrderStatus(status: OrderStatus) {
  return REFUNDABLE_STATUSES.includes(status);
}

export async function applyStripeRefundToOrderTx(tx: Tx, args: ApplyStripeRefundArgs) {
  const order = await tx.order.findUnique({
    where: { id: args.orderId },
  });

  if (!order) throw new Error(`Order ${args.orderId} not found`);

  if (!isRefundableOrderStatus(order.status)) {
    throw new Error(`Cannot apply refund to order ${order.id} from status ${order.status}`);
  }

  const previousStatus = order.status;
  const safeRefundCents = Math.max(0, Math.min(order.totalCents, Math.trunc(args.cumulativeRefundCents)));
  const nextStatus: OrderStatus =
    safeRefundCents >= order.totalCents ? "RIMBORSATO" : "PARZIALMENTE_RIMBORSATO";
  const now = new Date();

  const updated = await tx.order.update({
    where: { id: order.id },
    data: {
      status: nextStatus,
      refundCents: safeRefundCents,
      refundedAt: order.refundedAt ?? now,
      ...(args.stripeChargeId ? { stripeChargeId: args.stripeChargeId } : {}),
      ...(args.stripePaymentIntentId ? { stripePaymentIntentId: args.stripePaymentIntentId } : {}),
    },
  });

  await tx.orderEvent.create({
    data: {
      orderId: order.id,
      actor: args.actor ?? null,
      type: "STRIPE_REFUND_SYNCED",
      fromStatus: previousStatus,
      toStatus: nextStatus,
      message:
        nextStatus === "RIMBORSATO"
          ? "Rimborso Stripe completo sincronizzato"
          : "Rimborso Stripe parziale sincronizzato",
      metaJson: JSON.stringify({
        source: args.source,
        refundCents: safeRefundCents,
        totalCents: order.totalCents,
        stripeEventId: args.stripeEventId ?? null,
        stripeRefundId: args.stripeRefundId ?? null,
        stripeChargeId: args.stripeChargeId ?? null,
        stripePaymentIntentId: args.stripePaymentIntentId ?? null,
        reason: args.reason ?? null,
        syncedAt: now.toISOString(),
      }),
    },
  });

  if (nextStatus === "RIMBORSATO" && previousStatus !== "RIMBORSATO") {
    await tx.outboxEvent.create({
      data: {
        type: "ORDER_REFUNDED",
        payload: {
          orderId: order.id,
          actor: args.actor ?? null,
          source: args.source,
          stripeEventId: args.stripeEventId ?? null,
          stripeRefundId: args.stripeRefundId ?? null,
          stripeChargeId: args.stripeChargeId ?? null,
          stripePaymentIntentId: args.stripePaymentIntentId ?? null,
          at: now.toISOString(),
        },
        runAt: now,
      },
    });
  }

  assertOrderInvariants(updated);
  return updated;
}
