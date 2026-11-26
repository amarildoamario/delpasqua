import { readFile } from "node:fs/promises";
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import path from "node:path";
import { Resend } from "resend";
import { companyInfo } from "@/lib/companyInfo";
import { prisma } from "./prisma";
import { buildPrintPdfAttachment } from "./orderPdf";
import { voucherCodeDigest, voucherNumber, voucherRedemptionCode, voucherEmailAllowed, voucherSecret } from "./tastingVoucherPayment";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
);

function attachmentKey() {
  const secret = voucherSecret();
  if (!secret) throw new Error("Chiave degli allegati voucher non disponibile");
  return createHmac("sha256", secret).update("voucher-pdf-v1").digest();
}

function encryptAttachment(pdf: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", attachmentKey(), iv);
  const encrypted = Buffer.concat([cipher.update(pdf), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]);
}

function decryptAttachment(encrypted: Uint8Array) {
  const decipher = createDecipheriv("aes-256-gcm", attachmentKey(), encrypted.subarray(0, 12));
  decipher.setAuthTag(encrypted.subarray(12, 28));
  return Buffer.concat([decipher.update(encrypted.subarray(28)), decipher.final()]);
}

export function renderVoucherHtml(voucher: {
  logoSrc: string; number: string; title: string; people: number; children: number; code: string; bookingUrl: string; isTest: boolean;
}) {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>Voucher ${escapeHtml(voucher.number)}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #192b20; font: 13px/1.5 Arial, sans-serif; }
  main { padding: 30px 34px; border: 2px solid #374c32; background: #f8f7f1; text-align: center; }
  header { display: flex; align-items: center; justify-content: space-between; text-align: left; gap: 16px; }
  header img { width: 84px; height: 54px; object-fit: contain; }
  header div { text-align: right; color: #344430; }
  header strong { display: block; font-size: 15px; }
  .experience { border-top: 1px solid #bec4ab; padding-top: 28px; margin-top: 20px; }
  h1 { font: 700 34px/1.15 Georgia, serif; margin: 10px 0; overflow-wrap: anywhere; }
  .code { margin: 28px 0 20px; padding: 16px 20px; border-block: 1px solid #bec4ab; }
  .code strong { display: block; font: 700 24px/1.5 Consolas, monospace; }
  a { color: #274c34; text-decoration: underline; font-weight: 700; }
  .test { color: #7a3226; font-weight: 700; }
  p { margin: 8px 0; }
</style>
</head>
<body>
  <main>
    <header>
      <img alt="${escapeHtml(companyInfo.brandName)}" src="${escapeHtml(voucher.logoSrc)}">
      <div>Voucher degustazione<strong>${escapeHtml(voucher.number)}</strong></div>
    </header>
    <section class="experience">
      <p>${escapeHtml(companyInfo.brandName)}</p>
      <h1>${escapeHtml(voucher.title)}</h1>
      <p>Adulti ${voucher.people} · Bambini ${voucher.children}</p>
      ${voucher.isTest ? '<p class="test">Voucher di prova</p>' : ""}
    </section>
    <div class="code">Codice di riscatto<strong>${escapeHtml(voucher.code)}</strong></div>
    <p>Il voucher non ha scadenza. Scegli la data e attendi la conferma del Frantoio.</p>
    <p><a href="${escapeHtml(voucher.bookingUrl)}">Prenota la degustazione</a></p>
  </main>
</body>
</html>`;
}

export function buildTastingVoucherEmailContent(args: {
  number: string; tastingTitle: string; bookingUrl: string; isTest: boolean;
}) {
  const subject = `${args.isTest ? "[Prova] " : ""}Il tuo voucher degustazione ${args.number}`;
  const body = `Buongiorno,\n\nIn allegato trovi il voucher per ${args.tastingTitle}.\n\nIl voucher non ha scadenza. Puoi scegliere una data dalla pagina Degustazioni e attendere la conferma del Frantoio.\n\n${args.bookingUrl}\n\nA presto,\n${companyInfo.brandName}`;
  return { subject, body };
}

export async function deliverTastingVoucher(voucherId: string) {
  const { RESEND_API_KEY: apiKey, EMAIL_FROM: from, EMAIL_REPLY_TO: replyTo } = process.env;
  if (!apiKey || !from) throw new Error("Invio voucher non configurato");
  const voucher = await prisma.tastingVoucher.findUnique({
    where: { id: voucherId },
    include: { checkout: { include: { proposal: true } }, delivery: true },
  });
  if (!voucher) throw new Error("Voucher non disponibile per l'invio");
  if (voucher.delivery?.providerId) return;
  if (!voucherEmailAllowed(voucher.isTest, voucher.email)) throw new Error("Destinatario di prova non abilitato");

  let delivery = voucher.delivery;
  if (!delivery) {
    const { proposal } = voucher.checkout;
    const number = voucherNumber(voucher, proposal.people);
    const code = voucherRedemptionCode(voucher.id);
    if (voucherCodeDigest(code) !== voucher.codeDigest) throw new Error("Il codice del voucher non corrisponde alla configurazione di emissione");
    const bookingUrl = new URL("/degustazioni/", process.env.NEXT_PUBLIC_APP_URL || "https://delpasqua.com").href;
    const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
    const pdf = await buildPrintPdfAttachment(renderVoucherHtml({
      logoSrc: `data:image/png;base64,${logo.toString("base64")}`,
      number, title: proposal.tastingTitle, people: proposal.people, children: proposal.children, code, bookingUrl, isTest: voucher.isTest,
    }), `voucher-${number}.pdf`);
    const { subject, body } = buildTastingVoucherEmailContent({
      number, tastingTitle: proposal.tastingTitle, bookingUrl, isTest: voucher.isTest,
    });
    await prisma.tastingVoucherDelivery.createMany({ data: {
      voucherId, from, replyTo, recipient: voucher.email, subject, body,
      filename: pdf.filename, pdfEncrypted: new Uint8Array(encryptAttachment(pdf.content)),
    }, skipDuplicates: true });
    delivery = await prisma.tastingVoucherDelivery.findUniqueOrThrow({ where: { voucherId } });
  }
  if (delivery.providerId) return;
  // Keep retries inside the provider's idempotency window.
  if (Date.now() - delivery.createdAt.getTime() > 23 * 60 * 60 * 1000) throw new Error("Verificare l'invio voucher prima di riprovare");
  const result = await new Resend(apiKey).emails.send({
    from: delivery.from, to: delivery.recipient, subject: delivery.subject, text: delivery.body,
    ...(delivery.replyTo ? { replyTo: delivery.replyTo } : {}),
    attachments: [{ filename: delivery.filename, content: decryptAttachment(delivery.pdfEncrypted), contentType: "application/pdf" }],
  }, { idempotencyKey: `voucher-delivery/${voucherId}` });
  if (result.error || !result.data?.id) throw new Error("Invio voucher non confermato dal servizio email");
  await prisma.tastingVoucherDelivery.update({ where: { voucherId }, data: { providerId: result.data.id, sentAt: new Date() } });
}
