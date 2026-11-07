import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function inspect() {
  const toShipOrders = await prisma.order.findMany({
    where: { shippedAt: null, status: { in: ["PAGATO", "IN_PREPARAZIONE"] }, isTest: false },
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
      totalCents: true,
    }
  });

  console.log("Found", toShipOrders.length, "orders matching layout toShip query:");
  console.table(toShipOrders.map(o => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    shippedAt: o.shippedAt,
    isTest: o.isTest,
    date: o.createdAt.toISOString(),
    name: o.fullName,
    email: o.email,
    eur: (o.totalCents / 100).toFixed(2)
  })));
}

inspect().catch(console.error).finally(() => pool.end());
