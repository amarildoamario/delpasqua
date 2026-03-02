import type { PrismaClient } from "@/generated/prisma/client";

function pad6(n: number) {
  const s = String(n);
  return s.length >= 6 ? s : "0".repeat(6 - s.length) + s;
}

export async function allocateOrderNumber(prisma: PrismaClient): Promise<string> {
  const year = new Date().getFullYear();
  const key = `orderCounter:${year}`;

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

  return `DP-${year}-${pad6(next)}`;
}

/**
 * Versione ottimizzata: singola query UPSERT atomica invece di findUnique + create/update.
 * Usa INSERT ... ON CONFLICT DO UPDATE per essere atomica e senza race conditions.
 */
export async function allocateOrderNumberTx(
  tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
): Promise<string> {
  const year = new Date().getFullYear();
  const key = `orderCounter:${year}`;

  // Singola query atomica: INSERT se non esiste (value=1), altrimenti incrementa.
  // Restituisce il valore DOPO l'incremento.
  const rows = await tx.$queryRaw<{ value: string }[]>`
    INSERT INTO "Setting" (key, value, "createdAt", "updatedAt")
    VALUES (${key}, '1', NOW(), NOW())
    ON CONFLICT (key) DO UPDATE
      SET value = CAST(CAST("Setting".value AS int) + 1 AS text),
          "updatedAt" = NOW()
    RETURNING value
  `;

  const next = Number(rows[0]?.value ?? 1);
  return `DP-${year}-${pad6(next)}`;
}
