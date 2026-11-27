import { NextResponse } from "next/server";
import { getClientIpFromHeaders, requireAdminApi } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { quoteAppOrigin } from "@/lib/server/quoteCheckout";
import { Id64Schema } from "@/lib/server/schemas";
import { decryptVoucherAttachment } from "@/lib/server/tastingVoucherEmail";
import { buildVoucherProposalPdf, VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;
  const respond = (error: string, status: number) => guard.attach(NextResponse.json({ error }, { status }));
  const id = VoucherProposalIdSchema.safeParse((await params).id);
  if (!id.success) return respond("Proposta non valida.", 400);
  const limit = await rateLimit({ key: `admin:voucher-pdf:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 15, windowSeconds: 60 });
  if (!limit.ok) return respond("Troppi download. Riprova tra un minuto.", 429);
  try {
    const query = new URL(req.url).searchParams;
    const emailId = query.get("email");
    const voucherId = query.get("voucher");
    if (emailId !== null && voucherId !== null) return respond("Allegato non valido.", 400);
    let attachment;
    if (emailId !== null) {
      if (!Id64Schema.safeParse(emailId).success) return respond("Allegato non valido.", 400);
      const email = await prisma.tastingVoucherProposalEmail.findFirst({
        where: { id: emailId, proposalId: id.data }, select: { pdf: true, filename: true },
      });
      if (!email) return respond("Allegato non trovato.", 404);
      attachment = { content: email.pdf, filename: email.filename };
    } else if (voucherId !== null) {
      if (!VoucherProposalIdSchema.safeParse(voucherId).success) return respond("Allegato non valido.", 400);
      const delivery = await prisma.tastingVoucherDelivery.findFirst({
        where: { voucherId, voucher: { checkout: { proposalId: id.data } } },
        select: { pdfEncrypted: true, filename: true },
      });
      if (!delivery) return respond("Allegato non trovato.", 404);
      attachment = { content: decryptVoucherAttachment(delivery.pdfEncrypted), filename: delivery.filename };
    } else {
      const proposal = await prisma.tastingVoucherProposal.findUnique({ where: { id: id.data } });
      if (!proposal) return respond("Proposta non trovata.", 404);
      attachment = await buildVoucherProposalPdf(proposal, quoteAppOrigin(req));
    }
    return guard.attach(new NextResponse(new Uint8Array(attachment.content), { headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${attachment.filename.replace(/[^a-zA-Z0-9._-]/g, "-")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    } }));
  } catch {
    return respond("Impossibile scaricare il PDF. Riprova.", 500);
  }
}
