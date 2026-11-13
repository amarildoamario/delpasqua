import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import { Id64Schema } from "@/lib/server/schemas";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;
  const id = Id64Schema.safeParse((await params).id);
  if (!id.success) return guard.attach(NextResponse.json({ error: "Allegato non valido." }, { status: 400 }));
  const email = await prisma.quoteEmail.findUnique({ where: { id: id.data }, select: { pdf: true, filename: true } });
  if (!email) return guard.attach(NextResponse.json({ error: "Allegato non trovato." }, { status: 404 }));
  return guard.attach(new NextResponse(new Uint8Array(email.pdf), { headers: {
    "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${email.filename.replace(/[^a-zA-Z0-9._-]/g, "-")}"`,
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
  } }));
}
