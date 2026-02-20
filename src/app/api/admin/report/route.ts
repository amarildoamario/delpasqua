import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { AdminReportMonthQuerySchema } from "@/lib/server/schemas";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Prefer admin session auth; allow optional secret header for server-to-server use.
  const guard = await requireAdminApi(req, { csrf: false });
  const authed = guard.ok;

  const url = new URL(req.url);
  const parsedQ = AdminReportMonthQuerySchema.safeParse({
    month: url.searchParams.get("month"),
  });

  if (!parsedQ.success) return new Response("Bad Request", { status: 400 });

  if (!authed) {
    const secret = req.headers.get("x-report-secret");
    if (secret !== process.env.REPORT_SECRET) return new Response("Unauthorized", { status: 401 });
  }

  const month = parsedQ.data.month; // "YYYY-MM"
  const [yStr, mStr] = month.split("-");
  const y = Number(yStr);
  const m = Number(mStr);

  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) {
    return new Response("Bad Request", { status: 400 });
  }

  const from = new Date(Date.UTC(y, m - 1, 1));
  const to = new Date(Date.UTC(y, m, 1));

  const rows = await prisma.order.findMany({
    where: { createdAt: { gte: from, lt: to } },
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ ok: true, rows });
}
