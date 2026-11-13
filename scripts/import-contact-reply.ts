/** Import a historical sent reply without sending email. Defaults to read-only.
 * node --import tsx scripts/import-contact-reply.ts <Resend email UUID> [--apply]
 * Run after the ContactReply migration. Env follows the application's .env loading.
 */
import "dotenv/config";
import { Resend } from "resend";
import { z } from "zod";
import { prisma } from "../src/lib/server/prisma";

async function main() {
  const emailId = z.uuid().parse(process.argv[2]);
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");
  console.log("Reading the historical email from Resend; no email will be sent.");
  const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.get(emailId);
  if (error || !data) throw new Error("Unable to retrieve the sent email");
  const email = z.object({
    id: z.uuid(), to: z.array(z.email()).length(1), from: z.string().min(1),
    subject: z.string().min(1), text: z.string().min(1), created_at: z.string(),
    last_event: z.enum(["sent", "delivered", "delivery_delayed", "opened", "clicked", "bounced", "complained"]),
  }).parse(data);
  const sentAt = new Date(email.created_at);
  if (!Number.isFinite(sentAt.getTime()) || !/^re:\s*/i.test(email.subject)) throw new Error("Not a dated reply");
  const contacts = await prisma.contactMessage.findMany({ where: {
    email: { equals: email.to[0], mode: "insensitive" },
    subject: email.subject.replace(/^re:\s*/i, ""), createdAt: { lte: sentAt },
  }, select: { id: true }, take: 2 });
  if (contacts.length !== 1) throw new Error("No unique matching contact; manual reconciliation required");
  console.log({ contactId: contacts[0].id, emailId, sentAt: sentAt.toISOString(), apply: process.argv.includes("--apply") });
  if (!process.argv.includes("--apply")) return;
  await prisma.contactReply.upsert({ where: { emailId }, update: {}, create: {
    messageId: contacts[0].id, idempotencyKey: `import/${emailId}`, emailId,
    subject: email.subject, body: email.text, from: email.from, sentAt, createdAt: sentAt,
  } });
  console.log("Historical reply saved. No email sent.");
}
main().catch(() => { console.error("Import failed; check configuration and unique contact match."); process.exitCode = 1; }).finally(async () => {
  await prisma.$disconnect();
  // The shared application module also owns a pg pool; this one-shot command must exit.
  process.exit(process.exitCode ?? 0);
});
