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
    select: { sku: true, stock: true },
  });

  for (const r of rows) {
    const stock = Number(r.stock ?? 0);
    availability[r.sku] = Math.max(0, stock);
  }

  return NextResponse.json({ availability }, {
    headers: {
      // CDN (Vercel Edge) cache per 30s, poi serve stale mentre rigenera (60s).
      // Lo stock cambia raramente: evita una query DB per ogni visita al negozio.
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
