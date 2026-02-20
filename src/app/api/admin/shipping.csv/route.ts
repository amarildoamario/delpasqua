export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const rows = await prisma.order.findMany({
    where: { status: "PAID", shippedAt: null },
    orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
    include: { items: true },
    take: 500,
  });

  const header = ["orderNumber", "paidAt", "fullName", "email", "address", "city", "zip", "items"];
  const lines = [header.join(",")];

  for (const o of rows) {
    const items = (o.items || [])
      .map((it) => `${it.title} ${it.variantLabel} x${it.qty}`)
      .join(" | ")
      .replaceAll('"', '""');

    lines.push(
      [
        o.orderNumber ?? "",
        o.paidAt ? o.paidAt.toISOString() : "",
        (o.fullName ?? "").replaceAll('"', '""'),
        (o.email ?? "").replaceAll('"', '""'),
        (o.address ?? "").replaceAll('"', '""'),
        (o.city ?? "").replaceAll('"', '""'),
        (o.zip ?? "").replaceAll('"', '""'),
        items,
      ]
        .map((x) => `"${x}"`)
        .join(",")
    );
  }

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="shipping.csv"`,
    },
  });
}
