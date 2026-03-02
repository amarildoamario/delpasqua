import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { AdminOutboxQuerySchema } from "@/lib/server/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const parsed = AdminOutboxQuerySchema.safeParse({
    take: searchParams.get("take"),
    status: searchParams.get("status") || undefined,
  });

  const take = parsed.success ? parsed.data.take : 200;
  const status = parsed.success ? parsed.data.status : undefined;

  const rows = await prisma.outboxEvent.findMany({
    where: status ? { status: status as "failed" | "pending" | "processing" | "done" } : {},
    orderBy: [{ status: "asc" }, { runAt: "asc" }],
    take,
  });

  return guard.attach(NextResponse.json({ rows }));
}
