import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
  console.table(orders.map(o => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    shipped: o.shippedAt ? "YES" : "NO",
    isTest: o.isTest,
    date: o.createdAt.toISOString().slice(0, 10),
    name: o.fullName,
  })));

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

inspect().catch(console.error).finally(() => pool.end());
