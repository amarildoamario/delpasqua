export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAvailabilityBySkus } from "@/lib/server/inventoryRead";
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

  const availability = await getAvailabilityBySkus(skus);

  return NextResponse.json({ availability }, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
