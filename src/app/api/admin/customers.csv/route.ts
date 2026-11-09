export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { NextResponse } from "next/server";
import { readCustomerMetrics, CUSTOMER_SEGMENTS } from "@/lib/server/customerMetrics";

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const customers = await readCustomerMetrics(prisma);
  const segment = new URL(req.url).searchParams.get("segment");

  const header = ["email", "orders", "spentCents", "refundCents", "ltvNetCents", "segment", "firstPaidAt", "lastPaidAt", "oilCanLiters"];
  const lines = [header.join(",")];

  for (const r of customers.rows) {
    if (segment && Object.hasOwn(CUSTOMER_SEGMENTS, segment) && r.segment !== segment) continue;
    lines.push([r.email, r.ordersCount, r.grossCents, r.refundCents, r.ltvCents, CUSTOMER_SEGMENTS[r.segment], r.firstOrderAt.toISOString(), r.lastOrderAt.toISOString(), r.canLiters]
      .map((value) => {
        const text = String(value);
        const safe = /^[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
        return `"${safe.replaceAll('"', '""')}"`;
      }).join(","));
  }

  return guard.attach(new NextResponse("\uFEFF" + lines.join("\r\n"), {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="customers.csv"`,
      "cache-control": "no-store",
    },
  }));
}
