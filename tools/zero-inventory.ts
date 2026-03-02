import { prisma } from "@/lib/server/prisma";

async function main() {
  const res = await prisma.inventoryItem.updateMany({
    data: {
      stock: 0,
    },
  });

  console.log(`✅ InventoryItem azzerato: ${res.count} righe (stock=0).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
