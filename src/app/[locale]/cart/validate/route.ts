import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { clampCartQty, validateCartQuantityForSku } from "@/lib/server/cartValidation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sku = String(body?.sku ?? "").trim();
  const qty = clampCartQty(Number(body?.qty ?? 0));

  if (!sku) return new Response("Bad Request", { status: 400 });

  const result = await validateCartQuantityForSku(prisma, { sku, qty });

  if (!result.ok) {
    return Response.json(result, { status: 409 });
  }

  return Response.json(result, { status: 200 });
}
