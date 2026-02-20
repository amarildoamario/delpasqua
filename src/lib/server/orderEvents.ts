import { prisma } from "@/lib/server/prisma";
import type { OrderStatus } from "@/generated/prisma/client";

type CreateEventArgs = {
  orderId: string;
  actor?: string | null;
  type: string;
  message?: string | null;
  fromStatus?: OrderStatus | null;
  toStatus?: OrderStatus | null;
  meta?: unknown;
};

export async function createOrderEvent(args: CreateEventArgs) {
  const metaJson = typeof args.meta === "undefined" ? null : JSON.stringify(args.meta);

  return prisma.orderEvent.create({
    data: {
      orderId: args.orderId,
      actor: args.actor ?? null,
      type: args.type,
      message: args.message ?? null,
      fromStatus: args.fromStatus ?? null,
      toStatus: args.toStatus ?? null,
      metaJson,
    },
  });
}
