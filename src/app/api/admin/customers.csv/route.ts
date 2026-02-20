export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const grouped = await prisma.order.groupBy({
    by: ["email"],
    where: { status: "PAID" },
    _count: { _all: true },
    _sum: { totalCents: true },
  });

  const header = ["email", "orders", "spentCents"];
  const lines = [header.join(",")];

  for (const r of grouped) {
    lines.push([r.email, String(r._count._all), String(r._sum.totalCents ?? 0)].map((x) => `"${x}"`).join(","));
  }

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="customers.csv"`,
    },
  });
}
