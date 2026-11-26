import { NextResponse } from "next/server";
import { getClientIpFromHeaders, requireAdminApi } from "@/lib/server/adminAuth";
import { databaseReadOnly, prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (body: object, status = 200) =>
    guard.attach(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } }));
  if (databaseReadOnly) return respond({ error: "L'archivio è in sola lettura." }, 403);

  const id = VoucherProposalIdSchema.safeParse((await params).id);
  if (!id.success) return respond({ error: "Proposta non valida." }, 400);
  const limit = await rateLimit({ key: `admin:delete-voucher:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 20, windowSeconds: 60 });
  if (!limit.ok) return respond({ error: "Troppe richieste. Riprova tra un minuto." }, 429);

  try {
    const removed = await prisma.tastingVoucherProposal.deleteMany({
      where: { id: id.data, checkouts: { none: {} } },
    });
    if (!removed.count && await prisma.tastingVoucherProposal.findUnique({ where: { id: id.data }, select: { id: true } })) {
      return respond({ error: "La proposta ha un checkout associato. Il record di pagamento deve restare in archivio." }, 409);
    }
    return respond({ ok: true });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2003") {
      return respond({ error: "Un checkout è stato avviato per questa proposta." }, 409);
    }
    return respond({ error: "Impossibile eliminare la proposta. Riprova." }, 500);
  }
}
