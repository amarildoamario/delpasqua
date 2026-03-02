import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";

function clampQty(n: number) {
  const x = Math.trunc(n);
  if (!Number.isFinite(x) || x < 0) return 0;
  return Math.min(99, x);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sku = String(body?.sku ?? "").trim();
  const qty = clampQty(Number(body?.qty ?? 0));

  if (!sku) return new Response("Bad Request", { status: 400 });

  const row = await prisma.inventoryItem.findUnique({ where: { sku } });
  const available = row ? Math.max(0, row.stock) : 0;

  if (available <= 0) {
    return Response.json({ ok: false, error: "OUT_OF_STOCK", available: 0 }, { status: 409 });
  }

  if (qty > available) {
    return Response.json(
      { ok: false, error: "QTY_TOO_HIGH", available, requested: qty },
      { status: 409 }
    );
  }

  return Response.json({ ok: true, available }, { status: 200 });
}
