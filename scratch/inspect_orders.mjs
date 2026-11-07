import { prisma } from "../src/lib/server/prisma.ts";

async function inspect() {
  console.log("=== COUNTS ===");
  const allOrders = await prisma.order.count();
  const testOrders = await prisma.order.count({ where: { isTest: true } });
  const nonTestOrders = await prisma.order.count({ where: { isTest: false } });
  
  const toShipInLayout = await prisma.order.count({
    where: { shippedAt: null, status: { in: ["PAGATO", "IN_PREPARAZIONE"] }, isTest: false },
  });

  const toShipWithOrderNumber = await prisma.order.count({
    where: { shippedAt: null, status: { in: ["PAGATO", "IN_PREPARAZIONE"] }, isTest: false, orderNumber: { not: null } },
  });

  console.log({ allOrders, testOrders, nonTestOrders, toShipInLayout, toShipWithOrderNumber });

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      status: true,
      shippedAt: true,
      isTest: true,
      createdAt: true,
      paidAt: true,
      fullName: true,
      email: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  console.log("\n=== ORDERS LIST ===");
  console.table(orders);

  const contactMessages = await prisma.contactMessage.findMany({
    select: { id: true, status: true, name: true, email: true, createdAt: true },
  });
  console.log("\n=== CONTACT MESSAGES ===");
  console.table(contactMessages);

  const tastings = await prisma.tastingBooking.findMany({
    select: { id: true, status: true, fullName: true, slotStart: true },
  });
  console.log("\n=== TASTINGS ===");
  console.table(tastings);
}

inspect().catch(console.error).finally(() => process.exit(0));
