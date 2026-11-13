import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { prepareQuoteCheckout, quoteAppOrigin, QuoteCheckoutError } from "@/lib/server/quoteCheckout";
import { orderAnalyticsContext } from "@/lib/server/orderAnalytics";

export const runtime = "nodejs";
export const maxDuration = 60;
// The unguessable PDF link is the capability for direct checkout. No session,
// price or customer fields are accepted from the URL.
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return NextResponse.json({ error: "Preventivo non disponibile." }, { status: 404, headers });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await rateLimit({ key: `quote-checkout:${ip}`, limit: 10, windowSeconds: 60 });
  if (!limit.ok) return NextResponse.redirect(new URL(`/preventivo/${token}/?error=rate`, req.url), { status: 303, headers });
  return startCheckout(req, token);
}
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const respond = (message: string, status: number) => NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return respond("Preventivo non disponibile.", 404);
  if (req.headers.get("origin") !== new URL(req.url).origin) return respond("Richiesta non autorizzata.", 403);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await rateLimit({ key: `quote-checkout:${ip}`, limit: 10, windowSeconds: 60 });
  if (!limit.ok) return respond("Troppi tentativi. Attendi un minuto.", 429);
  const reader = req.body?.getReader();
  if (!reader) return respond("Conferma le condizioni per proseguire.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 1024) { await reader.cancel(); return respond("Richiesta troppo lunga.", 413); }
    chunks.push(value);
  }
  if (new URLSearchParams(Buffer.concat(chunks).toString("utf8")).get("accepted") !== "yes") return respond("Conferma le condizioni per proseguire.", 400);
  return startCheckout(req, token);
}

async function startCheckout(req: Request, token: string) {
  const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
  try {
    const quote = await prisma.quote.findUnique({ where: { paymentToken: token }, select: { id: true } });
    if (!quote) return NextResponse.json({ error: "Preventivo non disponibile." }, { status: 404, headers });
    const result = await prepareQuoteCheckout({ quoteId: quote.id, origin: quoteAppOrigin(req), accept: true, analytics: orderAnalyticsContext(req) });
    return new NextResponse(null, { status: 303, headers: { ...headers, Location: result.checkoutUrl } });
  } catch (error) {
    const code = error instanceof QuoteCheckoutError ? error.code : "unavailable";
    return NextResponse.redirect(new URL(`/preventivo/${token}/?error=${code}`, req.url), { status: 303, headers });
  }
}
