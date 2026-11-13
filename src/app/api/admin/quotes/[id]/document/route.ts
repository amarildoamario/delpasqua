import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { Id64Schema } from "@/lib/server/schemas";
import { buildPrintPdfAttachment } from "@/lib/server/orderPdf";
import { renderQuoteHtml, quoteNumber } from "@/lib/server/quotes";
import { prepareQuoteCheckout, quoteAppOrigin, QuoteCheckoutError } from "@/lib/server/quoteCheckout";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (error: string, status: number) => guard.attach(NextResponse.json({ error }, { status }));
  const id = Id64Schema.safeParse((await params).id);
  if (!id.success) return respond("Preventivo non valido.", 400);
  const limit = await rateLimit({ key: `admin:quote-pdf:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 10, windowSeconds: 60 });
  if (!limit.ok) return respond("Troppi download. Attendi un minuto.", 429);
  try {
    const stored = await prisma.quote.findUnique({ where: { id: id.data } });
    if (!stored) return respond("Preventivo non trovato.", 404);
    const origin = quoteAppOrigin(req);
    const { quote, paymentUrl } = stored.paymentToken && (stored.paidAt || stored.validUntil.getTime() <= Date.now())
      ? { quote: stored, paymentUrl: `${origin}/preventivo/${stored.paymentToken}/` }
      : await prepareQuoteCheckout({ quoteId: id.data, origin });
    const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
    const attachment = await buildPrintPdfAttachment(renderQuoteHtml(quote, `data:image/png;base64,${logo.toString("base64")}`, paymentUrl), `preventivo-${quoteNumber(quote)}.pdf`);
    // Separate from CREATED: records successful PDF generation for an explicit download request.
    // It does not claim that the browser has written the file to disk.
    await prisma.quoteEvent.create({ data: { quoteId: quote.id, type: "PDF_DOWNLOAD_REQUESTED" } });
    return guard.attach(new NextResponse(new Uint8Array(attachment.content), { headers: {
      "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${attachment.filename}"`, "Cache-Control": "private, no-store",
    } }));
  } catch (error) {
    if (error instanceof QuoteCheckoutError) return respond(error.message, 409);
    return respond("Impossibile predisporre il pagamento e il PDF. Il preventivo resta salvato; riprova tra poco.", 500);
  }
}
