import { createHash } from "node:crypto";
import { z } from "zod";

export const ContactReplySchema = z.object({
  subject: z.string().trim().min(1).max(200).regex(/^[^\r\n]+$/),
  body: z.string().trim().min(1).max(20_000),
  requestId: z.string().uuid(),
}).strict();

export type ContactReplyInput = z.infer<typeof ContactReplySchema>;

export function buildContactReply(
  message: { id: string; email: string },
  input: ContactReplyInput,
  config: { from: string; replyTo?: string },
) {
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  // The recipient comes only from the stored contact. Retries of the same
  // submission reuse Resend's key; editing the content creates a distinct send.
  const digest = createHash("sha256").update(JSON.stringify([message.id, input])).digest("hex");
  return {
    payload: {
      from: config.from,
      to: z.email().parse(message.email),
      ...(config.replyTo ? { replyTo: config.replyTo } : {}),
      subject: input.subject,
      text: input.body,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-wrap">${escapeHtml(input.body)}</div>`,
    },
    idempotencyKey: `contact-reply/${digest}`,
  };
}
