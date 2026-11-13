import { NextResponse } from "next/server";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { Id64Schema } from "@/lib/server/schemas";
import { quoteAppOrigin } from "@/lib/server/quoteCheckout";
import { QuoteEmailSchema, QuoteEmailError, sendQuoteEmail } from "@/lib/server/quoteEmail";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (body: object, status = 200) => guard.attach(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } }));
  const id = Id64Schema.safeParse((await params).id);
  if (!id.success) return respond({ error: "Preventivo non valido." }, 400);
  const limit = await rateLimit({ key: `admin:quote-email:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 10, windowSeconds: 60 });
  if (!limit.ok) return respond({ error: "Troppi invii. Attendi un minuto." }, 429);
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
      if (size > 100_000) { await reader.cancel(); return respond({ error: "Email troppo lunga." }, 413); }
      chunks.push(value);
    }
    input = QuoteEmailSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch { return respond({ error: "Inserisci oggetto e testo validi (massimo 20.000 caratteri)." }, 400); }
  try {
    const result = await sendQuoteEmail(id.data, input, quoteAppOrigin(req));
    return respond({ ok: true, ...result });
  } catch (error) {
    if (error instanceof QuoteEmailError) return respond({ error: error.message }, error.status);
    console.error("[QUOTE_EMAIL] request failed", { quoteId: id.data });
    return respond({ error: "Impossibile confermare l'invio. Riprova senza cambiare il testo per evitare duplicati." }, 502);
  }
}
