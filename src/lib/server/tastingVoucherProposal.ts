import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { z } from "zod";
import type { TastingVoucherProposal } from "@/generated/prisma/client";
import { ContactReplySchema } from "./contactReply";
import { buildPrintPdfAttachment } from "./orderPdf";
import { renderVoucherProposalPrintHtml } from "./orderPrint";
import { prisma } from "./prisma";

export const VoucherProposalIdSchema = z.uuid();
export const VoucherProposalInput = z.strictObject({
  requestId: z.uuid(),
  tastingType: z.string().trim().min(1).max(100),
  people: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10).default(0),
  totalCents: z.number().int().min(50).max(99_999_999),
});
export const VoucherProposalEmailInput = ContactReplySchema.extend({
  recipient: z.string().trim().email().max(254),
});

export async function readVoucherRequest(req: Request, maxBytes: number): Promise<unknown> {
  const reader = req.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

export function voucherProposalUrl(origin: string, id: string) {
  return new URL(`/voucher/${id}/`, origin).href;
}

export function voucherProposalFilename(id: string) {
  return `proposta-degustazione-${id.slice(0, 8)}.pdf`;
}

export async function buildVoucherProposalPdf(proposal: TastingVoucherProposal, origin: string) {
  const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
  const html = renderVoucherProposalPrintHtml(proposal, `data:image/png;base64,${logo.toString("base64")}`, voucherProposalUrl(origin, proposal.id));
  return buildPrintPdfAttachment(html, voucherProposalFilename(proposal.id));
}

export class VoucherProposalEmailError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function sendVoucherProposalEmail(
  proposalId: string,
  input: z.infer<typeof VoucherProposalEmailInput>,
  origin: string,
) {
  const { RESEND_API_KEY: apiKey, EMAIL_FROM: from, EMAIL_REPLY_TO: replyTo } = process.env;
  if (!apiKey || !from) throw new VoucherProposalEmailError("Invio email non configurato.", 503);
  const idempotencyKey = `voucher-proposal/${proposalId}/${input.requestId}`;
  let saved = await prisma.tastingVoucherProposalEmail.findUnique({ where: { idempotencyKey } });
  if (!saved) {
    const proposal = await prisma.tastingVoucherProposal.findUnique({ where: { id: proposalId } });
    if (!proposal) throw new VoucherProposalEmailError("Proposta non trovata.", 404);
    const attachment = await buildVoucherProposalPdf(proposal, origin);
    const { recipient, subject, body } = input;
    await prisma.tastingVoucherProposalEmail.createMany({
      data: { proposalId, idempotencyKey, recipient, subject, body, from, replyTo,
        filename: attachment.filename, pdf: new Uint8Array(attachment.content) },
      skipDuplicates: true,
    });
    saved = await prisma.tastingVoucherProposalEmail.findUniqueOrThrow({ where: { idempotencyKey } });
  }
  if (saved.recipient !== input.recipient || saved.subject !== input.subject || saved.body !== input.body) {
    throw new VoucherProposalEmailError("Riapri il modulo per inviare una nuova email con dati diversi.", 409);
  }
  if (saved.emailId) return;
  if (Date.now() - saved.createdAt.getTime() > 23 * 60 * 60 * 1000) {
    throw new VoucherProposalEmailError("Verifica l'invio precedente nel servizio email prima di riprovare.", 409);
  }

  const result = await new Resend(apiKey).emails.send({
    from: saved.from,
    to: saved.recipient,
    subject: saved.subject,
    text: saved.body,
    ...(saved.replyTo ? { replyTo: saved.replyTo } : {}),
    attachments: [{ filename: saved.filename, content: Buffer.from(saved.pdf), contentType: "application/pdf" }],
  }, { idempotencyKey });
  if (result.error || !result.data?.id) {
    const failed = await prisma.tastingVoucherProposalEmail.updateMany({
      where: { id: saved.id, emailId: null },
      data: { lastError: "Invio non confermato dal servizio email." },
    });
    if (!failed.count) {
      const current = await prisma.tastingVoucherProposalEmail.findUnique({ where: { id: saved.id }, select: { emailId: true } });
      if (current?.emailId) return;
      if (!current) throw new VoucherProposalEmailError("La proposta è stata eliminata durante l'invio.", 409);
    }
    throw new VoucherProposalEmailError("Invio non confermato. Il tentativo è in archivio. Puoi riprovare con gli stessi dati.", 502);
  }
  const recorded = await prisma.tastingVoucherProposalEmail.updateMany({
    where: { id: saved.id }, data: { emailId: result.data.id, sentAt: new Date(), lastError: null },
  });
  if (!recorded.count) {
    throw new VoucherProposalEmailError("Email accettata dal servizio di invio. La proposta è stata eliminata nel frattempo.", 409);
  }
}
