import { NextResponse } from "next/server";
import { getClientIpFromHeaders, requireAdminApi } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { readVoucherRequest, VoucherProposalInput } from "@/lib/server/tastingVoucherProposal";
import { getTastingTypes } from "@/lib/tasting/slots";

export async function POST(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (body: object, status = 200) =>
    guard.attach(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } }));
  const limit = await rateLimit({ key: `admin:vouchers:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 20, windowSeconds: 60 });
  if (!limit.ok) return respond({ error: "Troppi salvataggi. Riprova tra un minuto." }, 429);

  const parsed = VoucherProposalInput.safeParse(await readVoucherRequest(req, 4_096));
  if (!parsed.success) return respond({ error: "Controlla degustazione, adulti, bambini e prezzo." }, 400);
  const input = parsed.data;
  try {
    let saved = await prisma.tastingVoucherProposal.findUnique({ where: { requestId: input.requestId } });
    if (!saved) {
      const tasting = getTastingTypes().find(({ id }) => id === input.tastingType);
      if (!tasting) return respond({ error: "Degustazione non disponibile." }, 400);
      await prisma.tastingVoucherProposal.createMany({
        data: { ...input, tastingTitle: tasting.title },
        skipDuplicates: true,
      });
      saved = await prisma.tastingVoucherProposal.findUniqueOrThrow({ where: { requestId: input.requestId } });
    }
    if (saved.tastingType !== input.tastingType || saved.people !== input.people ||
      saved.children !== input.children || saved.totalCents !== input.totalCents) {
      return respond({ error: "Questo tentativo di salvataggio contiene dati diversi." }, 409);
    }
    return respond({ id: saved.id });
  } catch {
    return respond({ error: "Impossibile salvare la proposta. Riprova." }, 500);
  }
}
