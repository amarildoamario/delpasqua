import type { Prisma, PrismaClient } from "@/generated/prisma/client";

function pad6(n: number) {
  const s = String(n);
  return s.length >= 6 ? s : "0".repeat(6 - s.length) + s;
}

export async function allocateInvoiceNumber(prisma: PrismaClient): Promise<string> {
  const year = new Date().getFullYear();
  const key = `invoiceCounter:${year}`;

  const next = await prisma.$transaction(async (tx) => {
    const existing = await tx.setting.findUnique({ where: { key } });
    if (!existing) {
      await tx.setting.create({ data: { key, value: "1" } });
      return 1;
    }
    const current = Number(existing.value || "0");
    const updated = current + 1;
    await tx.setting.update({ where: { key }, data: { value: String(updated) } });
    return updated;
  });

  return `INV-${year}-${pad6(next)}`;
}

export async function allocateInvoiceNumberTx(tx: Prisma.TransactionClient): Promise<string> {
  const year = new Date().getFullYear();
  const key = `invoiceCounter:${year}`;

  const existing = await tx.setting.findUnique({ where: { key } });
  if (!existing) {
    await tx.setting.create({ data: { key, value: "1" } });
    return `INV-${year}-${pad6(1)}`;
  }
  const current = Number(existing.value || "0");
  const updated = current + 1;
  await tx.setting.update({ where: { key }, data: { value: String(updated) } });
  return `INV-${year}-${pad6(updated)}`;
}
