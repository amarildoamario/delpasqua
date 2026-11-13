import { NextResponse } from "next/server";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { QuoteInputSchema, calculateQuote, quoteNumber, quotePayloadHash, oneCalendarMonthFrom } from "@/lib/server/quotes";
import { getStoreSettings } from "@/lib/server/settings";
import { readCatalog } from "@/lib/server/catalog";
import { makeInventorySku } from "@/lib/inventorySku";

export async function POST(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (body: object, status = 200) => guard.attach(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } }));
  const limit = await rateLimit({ key: `admin:quotes:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 20, windowSeconds: 60 });
  if (!limit.ok) return respond({ error: "Troppi salvataggi. Riprova tra un minuto." }, 429);
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
  } catch { return respond({ error: "Controlla i dati del preventivo, le righe e la data di validità." }, 400); }
  let totals;
  try { totals = calculateQuote(input, (await getStoreSettings()).vatRatePercent / 100); }
  catch (e) { return respond({ error: e instanceof Error ? e.message : "Importi non validi." }, 400); }
  const payloadHash = quotePayloadHash(input);
  try {
    const catalog = await readCatalog();
    const items = totals.items.map((line) => {
      const product = catalog.find((p) => p.id === line.productId && p.isTestProduct !== true);
      const variant = product?.variants.find((v) => v.id === line.variantId);
      if (!product || !variant) throw new Error("QUOTE_CATALOG_LINE");
      return { ...line, sku: makeInventorySku(product.id, variant.id, variant.sku) };
    });
    // A retry of the same save never creates a second quote or a second creation event.
    const { items: _items, validUntil: _validUntil, ...fields } = input;
    void _items;
    void _validUntil;
    const now = new Date();
    const quote = await prisma.quote.upsert({ where: { requestId: input.requestId }, update: {}, create: {
      ...fields, ...totals, items, payloadHash, createdAt: now, validUntil: oneCalendarMonthFrom(now),
      events: { create: { type: "CREATED" } },
    } });
    if (quote.payloadHash !== payloadHash) return respond({ error: "Salvataggio già usato con dati diversi. Ricarica la pagina prima di creare un nuovo preventivo." }, 409);
    return respond({ ok: true, id: quote.id, number: quoteNumber(quote) });
  } catch (error) {
    if (error instanceof Error && error.message === "QUOTE_CATALOG_LINE") return respond({ error: "Seleziona un prodotto del catalogo per ogni riga: serve per collegare pagamento e magazzino." }, 400);
    return respond({ error: "Impossibile salvare il preventivo. Riprova senza cambiare i dati." }, 500);
  }
}
