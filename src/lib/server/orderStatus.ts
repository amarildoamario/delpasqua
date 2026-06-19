import type { OrderStatus } from "@/generated/prisma/client";

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  IN_ATTESA: ["PAGATO", "ANNULLATO", "SCADUTO", "FALLITO"],
  PAGATO: ["IN_PREPARAZIONE", "ANNULLATO", "FALLITO"],
  IN_PREPARAZIONE: ["SPEDITO", "ANNULLATO"],
  SPEDITO: ["CONSEGNATO"],
  CONSEGNATO: [],
  ANNULLATO: [],
  RIMBORSATO: [],
  PARZIALMENTE_RIMBORSATO: [],
  SCADUTO: [],
  FALLITO: [],
};

type OrderInvariantSnapshot = {
  status: OrderStatus;
  orderNumber?: string | null;
  orderPublicToken?: string | null;
  paidAt?: Date | null;
  preparingAt?: Date | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  refundedAt?: Date | null;
  refundCents?: number | null;
  paymentProvider?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  notes?: string | null;
};

export class OrderInvariantError extends Error {
  code = "ORDER_INVARIANT_VIOLATION" as const;
  violations: string[];

  constructor(violations: string[]) {
    super(`Order invariant violation: ${violations.join(", ")}`);
    this.violations = violations;
  }
}

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus) {
  return ORDER_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getOrderInvariantViolations(order: OrderInvariantSnapshot) {
  const violations: string[] = [];
  const hasPublicToken = Boolean(order.orderPublicToken?.trim());
  const hasStripeSession = Boolean(order.stripeCheckoutSessionId?.trim());
  const hasRefundTrace =
    Boolean(order.stripePaymentIntentId?.trim()) || Boolean(order.notes?.trim());
  const isRefundedStatus =
    order.status === "RIMBORSATO" || order.status === "PARZIALMENTE_RIMBORSATO";

  if (order.status === "PAGATO") {
    if (!order.paidAt) violations.push("PAID_MISSING_PAID_AT");
    if (!order.orderNumber?.trim()) violations.push("PAID_MISSING_ORDER_NUMBER");
  }

  if (order.status === "SPEDITO") {
    if (!order.preparingAt) violations.push("SHIPPED_MISSING_PREPARING_AT");
    if (!order.shippedAt) violations.push("SHIPPED_MISSING_SHIPPED_AT");
  }

  if (order.status === "CONSEGNATO") {
    if (!order.preparingAt) violations.push("DELIVERED_MISSING_PREPARING_AT");
    if (!order.shippedAt) violations.push("DELIVERED_MISSING_SHIPPED_AT");
    if (!order.deliveredAt) violations.push("DELIVERED_MISSING_DELIVERED_AT");
  }

  if (isRefundedStatus) {
    if (!order.refundedAt) violations.push("REFUNDED_MISSING_REFUNDED_AT");
    if ((order.refundCents ?? 0) <= 0) violations.push("REFUNDED_MISSING_REFUND_AMOUNT");
    if (!hasRefundTrace) violations.push("REFUNDED_MISSING_REFUND_TRACE");
  }

  if (order.paymentProvider === "stripe" && !hasStripeSession) {
    if (order.status === "FALLITO") {
      if (!order.notes?.trim()) violations.push("FAILED_STRIPE_ORDER_MISSING_FAILURE_REASON");
    } else {
      violations.push("STRIPE_ORDER_MISSING_CHECKOUT_SESSION");
    }
  }

  if (order.status !== "FALLITO" && !hasPublicToken) {
    violations.push("CUSTOMER_ORDER_MISSING_PUBLIC_TOKEN");
  }

  return violations;
}

export function assertOrderInvariants(order: OrderInvariantSnapshot) {
  const violations = getOrderInvariantViolations(order);
  if (violations.length > 0) {
    throw new OrderInvariantError(violations);
  }
}
