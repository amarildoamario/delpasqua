export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { z } from "zod";

const QuerySchema = z.object({
  skus: z.string().trim().min(1).max(5000), // comma-separated
});

export async function GET(req: Request) {
  const url = new URL(req.url);

  const parsed = QuerySchema.safeParse({
    skus: url.searchParams.get("skus") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const skus = parsed.data.skus
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);

  // strict: se SKU non esiste -> available 0
  const availability: Record<string, number> = {};
  for (const sku of skus) availability[sku] = 0;

  const rows = await prisma.inventoryItem.findMany({
    where: { sku: { in: skus } },
    select: { sku: true, stock: true, reserved: true },
  });

  for (const r of rows) {
    const stock = Number(r.stock ?? 0);
    const reserved = Number(r.reserved ?? 0);
    availability[r.sku] = Math.max(0, stock - reserved);
  }

  return NextResponse.json({ availability });
}
