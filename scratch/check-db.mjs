import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log("--- INVENTORY ---");
  const items = await prisma.inventoryItem.findMany();
  console.log(items);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
