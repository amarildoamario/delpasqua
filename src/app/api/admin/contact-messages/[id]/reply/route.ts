export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/server/prisma";
import { getClientIpFromHeaders, requireAdminApi } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { Id64Schema } from "@/lib/server/schemas";
import { buildContactReply, ContactReplySchema } from "@/lib/server/contactReply";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;
  const respond = (body: object, status = 200) => guard.attach(NextResponse.json(body, { status }));
  const { id } = await ctx.params;
  if (!Id64Schema.safeParse(id).success) return respond({ error: "Messaggio non valido." }, 400);
  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const rl = await rateLimit({ key: `admin:contact-reply:${ip}`, limit: 10, windowSeconds: 60 });
  if (!rl.ok) return respond({ error: "Troppi invii. Attendi un minuto e riprova." }, 429);

  // Bound the actual stream as well as Content-Length (which may be absent).
  const reader = req.body?.getReader();
  if (!reader) return respond({ error: "Risposta non valida." }, 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 100_000) {
      await reader.cancel();
      return respond({ error: "Risposta troppo lunga." }, 413);
    }
    chunks.push(value);
  }
  let body: unknown;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
  } catch {
    return respond({ error: "Risposta non valida." }, 400);
  }
  const parsed = ContactReplySchema.safeParse(body);
  if (!parsed.success) return respond({ error: "Inserisci oggetto e testo validi (massimo 20.000 caratteri)." }, 400);
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return respond({ error: "Invio email non configurato. Contatta l'amministratore." }, 503);
  }

  try {
    const message = await prisma.contactMessage.findUnique({ where: { id }, select: { id: true, email: true } });
    if (!message) return respond({ error: "Messaggio non trovato." }, 404);
    const { payload, idempotencyKey } = buildContactReply(message, parsed.data, {
      from: process.env.EMAIL_FROM,
      replyTo: process.env.EMAIL_REPLY_TO || undefined,
    });
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send(payload, { idempotencyKey });
    if (result.error || !result.data?.id) {
      console.error("[CONTACT_REPLY] provider rejected", { messageId: id, code: result.error?.name });
      return respond({ error: "Invio non riuscito. La risposta resta aperta: riprova tra poco." }, 502);
    }
    // A database failure after acceptance must never appear as a send failure.
    let readAt: string | null = null;
    try {
      const now = new Date();
      const updated = await prisma.contactMessage.updateMany({ where: { id, status: "UNREAD" }, data: { status: "READ", readAt: now } });
      if (updated.count) readAt = now.toISOString();
    } catch {
      console.error("[CONTACT_REPLY] read status update failed", { messageId: id, emailId: result.data.id });
    }
    console.info("[CONTACT_REPLY] accepted", { messageId: id, emailId: result.data.id });
    return respond({ ok: true, emailId: result.data.id, from: payload.from, readAt });
  } catch {
    console.error("[CONTACT_REPLY] request failed", { messageId: id });
    return respond({ error: "Impossibile confermare l'invio. Riprova senza cambiare il testo per evitare duplicati." }, 502);
  }
}
