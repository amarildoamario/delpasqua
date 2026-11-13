import { NextResponse } from "next/server";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { QuoteInputSchema, quoteNumber } from "@/lib/server/quotes";
import { Id64Schema } from "@/lib/server/schemas";
import { updateQuote, QuoteUpdateError } from "@/lib/server/quoteUpdate";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (body: object, status = 200) => guard.attach(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } }));
  const id = Id64Schema.safeParse((await params).id);
  if (!id.success) return respond({ error: "Preventivo non valido." }, 400);
  const limit = await rateLimit({ key: `admin:quote-update:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 20, windowSeconds: 60 });
  if (!limit.ok) return respond({ error: "Troppe modifiche. Riprova tra un minuto." }, 429);
  let input;
  try {
    const reader = req.body?.getReader();
    if (!reader) return respond({ error: "Dati mancanti." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 150_000) { await reader.cancel(); return respond({ error: "Preventivo troppo lungo." }, 413); }
      chunks.push(value);
    }
    input = QuoteInputSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch { return respond({ error: "Controlla i dati del preventivo." }, 400); }
  try {
    const quote = await updateQuote(id.data, input);
    return respond({ ok: true, id: quote.id, number: quoteNumber(quote) });
  } catch (error) {
    return respond({ error: error instanceof QuoteUpdateError ? error.message : "Impossibile salvare le modifiche. Riprova tra poco." }, error instanceof QuoteUpdateError ? 409 : 500);
  }
}
