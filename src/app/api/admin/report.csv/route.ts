export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  if (!start || !end) return new Response("Missing start/end", { status: 400 });

  const from = new Date(start);
  const to = new Date(end);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return new Response("Bad dates", { status: 400 });

  const rows = await prisma.order.findMany({
    where: {
      createdAt: { gte: from, lt: to },
      orderNumber: { not: null }
    },
    orderBy: { createdAt: "asc" },
    include: { items: true },
  });

  const header = [
    "orderNumber",
    "status",
    "createdAt",
    "paidAt",
    "fullName",
    "email",
    "totalCents",
    "itemsCount",
  ];

  const lines = [header.join(",")];

  for (const o of rows) {
    lines.push(
      [
        o.orderNumber ?? "",
        o.status,
        toISODate(o.createdAt),
        o.paidAt ? toISODate(o.paidAt) : "",
        (o.fullName ?? "").replaceAll('"', '""'),
        (o.email ?? "").replaceAll('"', '""'),
        String(o.totalCents),
        String(o.items?.length ?? 0),
      ]
        .map((x) => `"${x}"`)
        .join(",")
    );
  }

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="report_${start}_${end}.csv"`,
    },
  });
}
