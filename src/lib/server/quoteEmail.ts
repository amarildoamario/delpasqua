import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { prisma } from "./prisma";
import { ContactReplySchema } from "./contactReply";
import { prepareQuoteCheckout, QuoteCheckoutError } from "./quoteCheckout";
import { buildPrintPdfAttachment } from "./orderPdf";
import { renderQuoteHtml, quoteNumber } from "./quotes";

export const QuoteEmailSchema = ContactReplySchema;
export class QuoteEmailError extends Error {
  constructor(message: string, public status = 409) { super(message); }
}

export async function sendQuoteEmail(quoteId: string, input: ReturnType<typeof QuoteEmailSchema.parse>, origin: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new QuoteEmailError("Invio email non configurato.", 503);
  const idempotencyKey = `quote-email/${quoteId}/${input.requestId}`;
  let saved = await prisma.quoteEmail.findUnique({ where: { idempotencyKey } });
  if (!saved) {
    let prepared;
    try { prepared = await prepareQuoteCheckout({ quoteId, origin }); }
    catch (error) {
      if (error instanceof QuoteCheckoutError) throw new QuoteEmailError(error.message);
      throw error;
    }
    const { quote, paymentUrl } = prepared;
    const number = quoteNumber(quote);
    const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
    const attachment = await buildPrintPdfAttachment(renderQuoteHtml(quote, `data:image/png;base64,${logo.toString("base64")}`, paymentUrl), `preventivo-${number}.pdf`);
    // Persist the exact attachment and text before sending; retries always use this snapshot.
    saved = await prisma.quoteEmail.upsert({ where: { idempotencyKey }, update: {}, create: {
      quoteId, idempotencyKey, recipient: quote.email, recipientName: quote.fullName, quoteNumber: number,
      subject: input.subject, body: input.body, from: process.env.EMAIL_FROM,
      replyTo: process.env.EMAIL_REPLY_TO || null, filename: attachment.filename, pdf: new Uint8Array(attachment.content),
    } });
  }
  if (saved.subject !== input.subject || saved.body !== input.body) throw new QuoteEmailError("Il tentativo di invio contiene un testo diverso. Riapri il modulo per una nuova email.");
  if (saved.emailId) return { id: saved.id, emailId: saved.emailId, historySaved: true };
  if (Date.now() - saved.createdAt.getTime() > 23 * 60 * 60 * 1000) throw new QuoteEmailError("Invio precedente da verificare nel servizio email prima di riprovare.");
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: saved.from, to: saved.recipient, subject: saved.subject, text: saved.body,
    ...(saved.replyTo ? { replyTo: saved.replyTo } : {}),
    attachments: [{ filename: saved.filename, content: Buffer.from(saved.pdf), contentType: "application/pdf" }],
  }, { idempotencyKey });
  if (result.error || !result.data?.id) {
    await prisma.quoteEmail.update({ where: { id: saved.id }, data: { lastError: "Invio non confermato dal servizio email." } });
    throw new QuoteEmailError("Invio non riuscito. Testo e allegato sono salvati in Messaggi; puoi riprovare senza cambiare il testo.", 502);
  }
  let historySaved = true;
  try {
    await prisma.quoteEmail.update({ where: { id: saved.id }, data: { emailId: result.data.id, sentAt: new Date(), lastError: null } });
  } catch {
    historySaved = false;
    console.error("[QUOTE_EMAIL] receipt persistence failed", { id: saved.id, emailId: result.data.id });
  }
  return { id: saved.id, emailId: result.data.id, historySaved };
}
