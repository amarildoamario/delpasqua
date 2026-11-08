import { NextResponse } from "next/server";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { Id64Schema } from "@/lib/server/schemas";
import { buildOrderPdfAttachment } from "@/lib/server/orderPdf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;
  const parsed = Id64Schema.safeParse((await params).id);
  if (!parsed.success) return guard.attach(NextResponse.json({ error: "Invalid order ID" }, { status: 400 }));
  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const limit = await rateLimit({ key: `admin:order-document:${ip}`, limit: 15, windowSeconds: 60 });
  if (!limit.ok) return guard.attach(NextResponse.json({ error: "Too Many Requests" }, { status: 429 }));
  const order = await prisma.order.findUnique({ where: { id: parsed.data }, include: { items: { orderBy: { title: "asc" } } } });
  if (!order || order.isTest) return guard.attach(NextResponse.json({ error: "Order not found" }, { status: 404 }));
  try {
    const attachment = await buildOrderPdfAttachment(order);
    return guard.attach(new NextResponse(new Uint8Array(attachment.content), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${attachment.filename}"`,
        "Cache-Control": "private, no-store",
      },
    }));
  } catch {
    return guard.attach(NextResponse.json({ error: "Unable to generate order document" }, { status: 500 }));
  }
}
