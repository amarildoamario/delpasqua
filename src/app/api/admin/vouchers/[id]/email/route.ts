import { NextResponse } from "next/server";
import { getClientIpFromHeaders, requireAdminApi } from "@/lib/server/adminAuth";
import { quoteAppOrigin } from "@/lib/server/quoteCheckout";
import { rateLimit } from "@/lib/server/rateLimit";
import {
  readVoucherRequest, sendVoucherProposalEmail, VoucherProposalEmailError,
  VoucherProposalEmailInput, VoucherProposalIdSchema,
} from "@/lib/server/tastingVoucherProposal";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (body: object, status = 200) =>
    guard.attach(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } }));
  const id = VoucherProposalIdSchema.safeParse((await params).id);
  if (!id.success) return respond({ error: "Proposta non valida." }, 400);
  const limit = await rateLimit({ key: `admin:voucher-email:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 10, windowSeconds: 60 });
  if (!limit.ok) return respond({ error: "Troppi invii. Riprova tra un minuto." }, 429);
  const parsed = VoucherProposalEmailInput.safeParse(await readVoucherRequest(req, 100_000));
  if (!parsed.success) return respond({ error: "Controlla l'indirizzo email, l'oggetto e il messaggio." }, 400);
  try {
    await sendVoucherProposalEmail(id.data, parsed.data, quoteAppOrigin(req));
    return respond({ ok: true });
  } catch (error) {
    if (error instanceof VoucherProposalEmailError) return respond({ error: error.message }, error.status);
    console.error("[VOUCHER_PROPOSAL_EMAIL] request failed", { proposalId: id.data });
    return respond({ error: "Impossibile confermare l'invio. Riprova con gli stessi dati per evitare duplicati." }, 502);
  }
}
