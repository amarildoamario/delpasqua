import type { Prisma } from "@/generated/prisma/client";
import { allocateInvoiceNumberTx } from "@/lib/server/invoiceNumber";
import { commitReservedToSoldOrThrow } from "@/lib/server/inventory";
import { allocateOrderNumberTx } from "@/lib/server/orderNumber";

type Tx = Prisma.TransactionClient;

type CustomerDetails = {
  email?: string | null;
  fullName?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
};

type ApplyPaidOrderInvariantsArgs = {
  orderId: string;
  actor?: string | null;
  source: "stripe_webhook" | "admin_manual";
  paymentIntentId?: string | null;
  paymentMethod?: string | null;
  stripeEventId?: string | null;
  stripeSessionId?: string | null;
  customer?: CustomerDetails;
};

export async function applyPaidOrderInvariantsTx(
  tx: Tx,
  args: ApplyPaidOrderInvariantsArgs
) {
  const order = await tx.order.findUnique({
    where: { id: args.orderId },
    include: { items: true },
  });
  if (!order) throw new Error(`Order ${args.orderId} not found`);
  if (order.status === "PAGATO") return order;
  if (order.status !== "IN_ATTESA") {
    throw new Error(`Cannot mark order ${order.id} as PAGATO from status ${order.status}`);
  }

  let currentOrderNumber = order.orderNumber;
  if (!currentOrderNumber) {
    currentOrderNumber = await allocateOrderNumberTx(tx);
  }

  await commitReservedToSoldOrThrow(tx, {
    orderId: order.id,
    lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
  });

  const customer = args.customer;
  const updated = await tx.order.update({
    where: { id: order.id },
    data: {
      status: "PAGATO",
      orderNumber: currentOrderNumber,
      paidAt: order.paidAt ?? new Date(),
      ...(args.paymentIntentId ? { stripePaymentIntentId: args.paymentIntentId } : {}),
      ...(args.paymentMethod ? { paymentMethod: args.paymentMethod } : {}),
      ...(customer?.email ? { email: customer.email } : {}),
      ...(customer?.fullName ? { fullName: customer.fullName } : {}),
      ...(customer?.addressLine1
        ? {
          addressLine1: customer.addressLine1,
          address: customer.addressLine1,
        }
        : {}),
      ...(typeof customer?.addressLine2 !== "undefined" ? { addressLine2: customer.addressLine2 } : {}),
      ...(customer?.city ? { city: customer.city } : {}),
      ...(customer?.province ? { province: customer.province } : {}),
      ...(customer?.postalCode
        ? {
          postalCode: customer.postalCode,
          zip: customer.postalCode,
        }
        : {}),
      ...(customer?.countryCode ? { countryCode: customer.countryCode } : {}),
      ...(typeof customer?.phone !== "undefined" ? { phone: customer.phone } : {}),
    },
    include: { items: true },
  });

  if (order.promotionCode) {
    await tx.promotion.update({
      where: { code: order.promotionCode },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }

  const alreadyAssigned = await tx.orderEvent.findFirst({
    where: { orderId: order.id, type: "INVOICE_ASSIGNED" },
    select: { id: true },
  });

  if (!alreadyAssigned) {
    const invoiceNumber = await allocateInvoiceNumberTx(tx);

    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        type: "INVOICE_ASSIGNED",
        message: `Invoice assigned: ${invoiceNumber}`,
        metaJson: JSON.stringify({
          invoiceNumber,
          invoiceYear: new Date().getFullYear(),
          assignedAt: new Date().toISOString(),
          source: args.source,
          stripeSessionId: args.stripeSessionId ?? null,
          stripeEventId: args.stripeEventId ?? null,
        }),
      },
    });
  }

  await tx.outboxEvent.create({
    data: {
      type: "ORDER_PAID",
      payload: {
        orderId: order.id,
        actor: args.actor ?? null,
        source: args.source,
        stripeEventId: args.stripeEventId ?? null,
        stripeSessionId: args.stripeSessionId ?? null,
        paymentIntentId: args.paymentIntentId ?? null,
        paymentMethod: args.paymentMethod ?? null,
        at: new Date().toISOString(),
      },
      runAt: new Date(),
    },
  });

  return updated;
}
