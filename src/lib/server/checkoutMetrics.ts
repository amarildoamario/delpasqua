import type { Prisma } from "@/generated/prisma";
import { COMMERCIAL_CHECKOUT_FILTER } from "./checkoutAudience";

// A cancellation remains an observed checkout exit after Stripe expires the
// session. Use the order history as well as the latest status, once per order.
export function closedCheckoutWhere(
  start: Date,
  endExclusive: Date,
  audience: "commercial" | "internal" = "commercial",
): Prisma.OrderWhereInput {
  return {
    createdAt: { gte: start, lt: endExclusive },
    isTest: false,
    orderNumber: null,
    stripeCheckoutSessionId: { not: null },
    paidAt: null,
    AND: [audience === "internal" ? { NOT: COMMERCIAL_CHECKOUT_FILTER } : COMMERCIAL_CHECKOUT_FILTER],
    OR: [
      {
        status: { in: ["ANNULLATO", "SCADUTO", "FALLITO"] },
        updatedAt: { lt: endExclusive },
      },
      {
        events: {
          some: {
            createdAt: { gte: start, lt: endExclusive },
            OR: [
              { type: { in: ["ORDER_CANCELED", "ORDER_EXPIRED"] } },
              { toStatus: { in: ["ANNULLATO", "SCADUTO", "FALLITO"] } },
            ],
          },
        },
      },
    ],
  };
}
