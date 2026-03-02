import { Resend } from "resend";
import { prisma } from "@/lib/server/prisma";
import type { TransactionalEmailType, Prisma } from "@/generated/prisma/client";

/**
 * NOTE:
 * - Prima avevi: new Resend(process.env.RESEND_API_KEY!) => ok TS, ma rischi runtime.
 * - Ora: resend può essere null e sendViaResend gestisce la mancanza di key.
 */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function eur(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function brandName() {
  return process.env.EMAIL_BRAND_NAME || "Delpasqua";
}

function supportEmail() {
  return process.env.EMAIL_SUPPORT || process.env.EMAIL_REPLY_TO || "";
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** ----------- ERROR HELPERS (fix TS unknown) ----------- */

type ErrLike = { message?: unknown; error?: { message?: unknown } };

function getErrText(e: unknown, fallback = "Email send failed"): string {
  if (typeof e === "string") return e;
  if (e instanceof Error && e.message) return e.message;

  if (typeof e === "object" && e !== null) {
    const o = e as ErrLike;
    const msg = o.message ?? o.error?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

/** ----------- SAFE GETTERS (NO any) ----------- */

function getStr(o: unknown, key: string, fallback = ""): string {
  if (!o || typeof o !== "object") return fallback;
  const v = (o as Record<string, unknown>)[key];
  return typeof v === "string" ? v : fallback;
}

function getOptStr(o: unknown, key: string): string {
  return getStr(o, key, "");
}

function getNum(o: unknown, key: string, fallback = 0): number {
  if (!o || typeof o !== "object") return fallback;
  const v = (o as Record<string, unknown>)[key];
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** ----------- ITEMS HELPERS (fix TS unknown[]) ----------- */

type ItemLike = {
  title?: unknown;
  variantLabel?: unknown;
  qty?: unknown;
  unitPriceCents?: unknown;
};

function asItemLike(x: unknown): ItemLike {
  return (typeof x === "object" && x !== null ? (x as ItemLike) : {}) as ItemLike;
}

function normalizeItems(items: unknown): ItemLike[] {
  if (!Array.isArray(items)) return [];
  return items.map(asItemLike);
}

/** ----------- TEXT HELPERS ----------- */

function formatShipping(o: unknown) {
  const fullName = getStr(o, "fullName");
  const addressLine1 = getStr(o, "addressLine1");
  const addressLine2 = getOptStr(o, "addressLine2");
  const postalCode = getStr(o, "postalCode");
  const city = getStr(o, "city");
  const province = getOptStr(o, "province");
  const countryCode = getStr(o, "countryCode");
  const phone = getOptStr(o, "phone");

  const line2 = addressLine2 ? `, ${addressLine2}` : "";
  const prov = province ? ` (${province})` : "";
  const phoneTxt = phone ? ` • Tel: ${phone}` : "";
  return `${fullName}\n${addressLine1}${line2}\n${postalCode} ${city}${prov}\n${countryCode}${phoneTxt}`;
}

function itemsToText(items: unknown) {
  const list = normalizeItems(items);

  return list
    .map((it) => {
      const title = String(it.title ?? "");
      const variantLabel = String(it.variantLabel ?? "");
      const qty = Number(it.qty ?? 0);
      const unit = Number(it.unitPriceCents ?? 0);
      return `- ${title} (${variantLabel}) x${qty} — ${eur(unit * qty)}`;
    })
    .join("\n");
}

function totalsToText(o: unknown) {
  const rows: string[] = [];
  const subtotalCents = getNum(o, "subtotalCents");
  const discountCents = getNum(o, "discountCents");
  const shippingCents = getNum(o, "shippingCents");
  const taxCents = getNum(o, "taxCents");
  const totalCents = getNum(o, "totalCents");

  rows.push(`Subtotale: ${eur(subtotalCents)}`);
  if (discountCents) rows.push(`Sconto: -${eur(discountCents)}`);
  rows.push(`Spedizione: ${eur(shippingCents)}`);
  if (taxCents) rows.push(`Tasse: ${eur(taxCents)}`);
  rows.push(`Totale: ${eur(totalCents)}`);
  return rows.join("\n");
}

function policiesFooterText() {
  const url = baseUrl();
  return [
    "\n---\n",
    "Assistenza: rispondi a questa email oppure usa i link qui sotto.",
    `Spedizioni: ${url}/spedizioni`,
    `Resi e rimborsi: ${url}/resi`,
    `Privacy: ${url}/privacy`,
    `Termini: ${url}/termini`,
  ].join("\n");
}

/** ---------- HTML TEMPLATE HELPERS ---------- **/

function css() {
  // Inline + embedded CSS: robusto per client email (Gmail/Apple Mail/Outlook web)
  return `
  <style>
    html,body{margin:0;padding:0;background:#f6f7fb;}
    .wrapper{width:100%;background:#f6f7fb;padding:24px 12px;}
    .container{max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eef0f5;}
    .header{padding:20px 20px 10px 20px;}
    .brand{font-size:18px;font-weight:700;color:#111827;letter-spacing:.2px;}
    .tag{font-size:12px;color:#6b7280;margin-top:6px;}
    .content{padding:20px;}
    .h1{font-size:20px;line-height:1.2;margin:0 0 8px;color:#111827;}
    .p{font-size:14px;line-height:1.55;margin:0 0 12px;color:#111827;}
    .muted{color:#6b7280;}
    .card{background:#f9fafb;border:1px solid #eef0f5;border-radius:14px;padding:14px;margin:14px 0;}
    .row{display:flex;gap:12px;flex-wrap:wrap;}
    .col{flex:1;min-width:220px;}
    .kv{font-size:12px;color:#6b7280;margin:0 0 4px;}
    .vv{font-size:14px;color:#111827;margin:0;font-weight:600;}
    .table{width:100%;border-collapse:collapse;margin-top:10px;}
    .th{font-size:12px;text-align:left;color:#6b7280;padding:10px 0;border-bottom:1px solid #eef0f5;}
    .td{font-size:14px;color:#111827;padding:10px 0;border-bottom:1px solid #eef0f5;}
    .right{text-align:right;}
    .btnWrap{margin:16px 0 4px;}
    .btn{display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:700;font-size:14px;}
    .btnSecondary{display:inline-block;background:#ffffff;color:#111827;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:700;font-size:14px;border:1px solid #eef0f5;}
    .footer{padding:16px 20px;background:#fbfbfd;border-top:1px solid #eef0f5;}
    .footlinks a{color:#111827;text-decoration:none;font-size:12px;margin-right:12px;}
    .small{font-size:12px;color:#6b7280;line-height:1.5;margin:8px 0 0;}
    @media (max-width: 480px){
      .wrapper{padding:18px 10px;}
      .content{padding:16px;}
      .header{padding:16px 16px 8px;}
      .footer{padding:14px 16px;}
      .h1{font-size:18px;}
    }
  </style>
  `;
}

function htmlShell(args: {
  title: string;
  intro: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  footerNote?: string;
}) {
  const url = baseUrl();
  const support = supportEmail();
  const brand = brandName();

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      ${css()}
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="brand">${escapeHtml(brand)}</div>
            <div class="tag">Aggiornamento ordine</div>
          </div>

          <div class="content">
            <h1 class="h1">${escapeHtml(args.title)}</h1>
            <p class="p muted">${escapeHtml(args.intro)}</p>

            ${args.bodyHtml}

            ${
              args.cta
                ? `<div class="btnWrap"><a class="btn" href="${escapeHtml(args.cta.href)}">${escapeHtml(
                    args.cta.label
                  )}</a></div>`
                : ""
            }
            ${
              args.secondaryCta
                ? `<div class="btnWrap"><a class="btnSecondary" href="${escapeHtml(
                    args.secondaryCta.href
                  )}">${escapeHtml(args.secondaryCta.label)}</a></div>`
                : ""
            }

            ${
              args.footerNote
                ? `<p class="p muted" style="margin-top:14px;">${escapeHtml(args.footerNote)}</p>`
                : ""
            }
          </div>

          <div class="footer">
            <div class="footlinks">
              <a href="${url}/spedizioni">Spedizioni</a>
              <a href="${url}/resi">Resi</a>
              <a href="${url}/privacy">Privacy</a>
              <a href="${url}/termini">Termini</a>
            </div>
            <p class="small">
              ${
                support
                  ? `Assistenza: <a href="mailto:${escapeHtml(support)}">${escapeHtml(support)}</a>`
                  : "Assistenza: rispondi a questa email"
              }
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function orderSummaryCardHtml(o: unknown) {
  const orderNumber = escapeHtml(String(getOptStr(o, "orderNumber") || getOptStr(o, "id")));
  const total = escapeHtml(eur(getNum(o, "totalCents")));
  const status = escapeHtml(getOptStr(o, "status"));
  const email = escapeHtml(getOptStr(o, "email"));

  return `
    <div class="card">
      <div class="row">
        <div class="col">
          <p class="kv">Numero ordine</p>
          <p class="vv">${orderNumber}</p>
        </div>
        <div class="col">
          <p class="kv">Totale</p>
          <p class="vv">${total}</p>
        </div>
      </div>
      <div class="row" style="margin-top:10px;">
        <div class="col">
          <p class="kv">Stato</p>
          <p class="vv">${status}</p>
        </div>
        <div class="col">
          <p class="kv">Email</p>
          <p class="vv">${email || "—"}</p>
        </div>
      </div>
    </div>
  `;
}

function shippingCardHtml(o: unknown) {
  const ship = escapeHtml(formatShipping(o)).replaceAll("\n", "<br/>");
  return `
    <div class="card">
      <p class="kv">Spedizione a</p>
      <p class="p" style="margin:0;">${ship}</p>
    </div>
  `;
}

function itemsTableHtml(items: unknown) {
  const list = normalizeItems(items);

  const rows = list
    .map((it) => {
      const title = escapeHtml(String(it.title ?? ""));
      const varLabel = escapeHtml(String(it.variantLabel ?? ""));
      const qty = Number(it.qty ?? 0);
      const price = escapeHtml(eur(Number(it.unitPriceCents ?? 0) * qty));

      return `
        <tr>
          <td class="td">${title}<div class="muted" style="font-size:12px;margin-top:2px;">${varLabel}</div></td>
          <td class="td right">x${qty}</td>
          <td class="td right">${price}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="card">
      <table class="table" role="presentation">
        <thead>
          <tr>
            <th class="th">Articolo</th>
            <th class="th right">Qtà</th>
            <th class="th right">Totale</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function totalsCardHtml(o: unknown) {
  const subtotalCents = getNum(o, "subtotalCents");
  const discountCents = getNum(o, "discountCents");
  const shippingCents = getNum(o, "shippingCents");
  const taxCents = getNum(o, "taxCents");
  const totalCents = getNum(o, "totalCents");

  const rows: Array<{ k: string; v: string; strong?: boolean }> = [
    { k: "Subtotale", v: eur(subtotalCents) },
    ...(discountCents ? [{ k: "Sconto", v: `-${eur(discountCents)}` }] : []),
    { k: "Spedizione", v: eur(shippingCents) },
    ...(taxCents ? [{ k: "Tasse", v: eur(taxCents) }] : []),
    { k: "Totale", v: eur(totalCents), strong: true },
  ];

  const htmlRows = rows
    .map(
      (r) => `
      <tr>
        <td class="td ${r.strong ? "" : "muted"}" style="${r.strong ? "font-weight:700;" : ""}">${escapeHtml(
          r.k
        )}</td>
        <td class="td right" style="${r.strong ? "font-weight:700;" : ""}">${escapeHtml(r.v)}</td>
      </tr>`
    )
    .join("");

  return `
    <div class="card">
      <table class="table" role="presentation">
        <tbody>
          ${htmlRows}
        </tbody>
      </table>
    </div>
  `;
}

/** ---------- BUILD EMAILS (HTML + TEXT) ---------- **/

type OrderEmailPayload = Prisma.OrderGetPayload<{
  include: {
    items: { select: { title: true; variantLabel: true; qty: true; unitPriceCents: true } };
  };
}>;

function buildEmail(type: TransactionalEmailType, o: OrderEmailPayload) {
  const orderNumber = String(o.orderNumber ?? o.id);
  const url = baseUrl();

  const itemsText = itemsToText(o.items ?? []);
  const totalsText = totalsToText(o);
  const shippingText = formatShipping(o);

  if (type === "ORDER_PAID") {
    const subject = `Pagamento confermato • ${orderNumber}`;
    const title = "Pagamento confermato ✅";
    const intro = "Abbiamo ricevuto il pagamento. Prepariamo il tuo ordine e ti aggiorniamo appena viene spedito.";

    const html = htmlShell({
      title,
      intro,
      bodyHtml:
        orderSummaryCardHtml(o) +
        itemsTableHtml(o.items ?? []) +
        totalsCardHtml(o) +
        shippingCardHtml(o) +
        `<p class="p muted">Se hai inserito note per la consegna, le abbiamo ricevute.</p>`,
      cta: { label: "Vedi dettagli ordine", href: `${url}/orders/${encodeURIComponent(orderNumber)}` },
      footerNote: "Conserva questa email come ricevuta d’ordine.",
    });

    const text = [
      `Ciao ${o.fullName || ""},`,
      "",
      "Pagamento confermato ✅. Prepariamo il tuo ordine.",
      `Numero ordine: ${orderNumber}`,
      "",
      "Articoli:",
      itemsText,
      "",
      "Totali:",
      totalsText,
      "",
      "Spedizione a:",
      shippingText,
      policiesFooterText(),
    ]
      .filter(Boolean)
      .join("\n");

    return { subject, html, text };
  }

  if (type === "ORDER_SHIPPED") {
    const subject = `PACCO SPEDITO • ${orderNumber}`;
    const title = "Il tuo pacco è stato spedito 🚚";
    const intro = "Il tuo ordine è stato spedito. Qui trovi i dettagli e l’indirizzo di consegna.";

    const html = htmlShell({
      title,
      intro,
      bodyHtml: orderSummaryCardHtml(o) + shippingCardHtml(o),
      cta: { label: "Vedi dettagli ordine", href: `${url}/orders/${encodeURIComponent(orderNumber)}` },
      footerNote: "Conserva questa email per riferimento.",
    });

    const text = [
      `Ciao ${o.fullName || ""},`,
      "",
      "Il tuo pacco è stato spedito 🚚.",
      `Numero ordine: ${orderNumber}`,
      "",
      "Spedizione a:",
      shippingText,
      "",
      "Se vuoi, puoi rivedere i dettagli dal tuo account/ordine.",
      `${url}/orders/${encodeURIComponent(orderNumber)}`,
      policiesFooterText(),
    ]
      .filter(Boolean)
      .join("\n");

    return { subject, html, text };
  }

  if (type === "ORDER_REFUNDED") {
    const subject = `Rimborso effettuato • ${orderNumber}`;
    const title = "Rimborso effettuato 💸";
    const intro = "Abbiamo registrato un rimborso relativo al tuo ordine.";

    const html = htmlShell({
      title,
      intro,
      bodyHtml: orderSummaryCardHtml(o) + totalsCardHtml(o),
      cta: { label: "Vedi dettagli ordine", href: `${url}/orders/${encodeURIComponent(orderNumber)}` },
      footerNote: "I tempi di accredito dipendono dal metodo di pagamento e dalla banca.",
    });

    const text = [
      `Ciao ${o.fullName || ""},`,
      "",
      "Abbiamo registrato un rimborso per il tuo ordine.",
      `Numero ordine: ${orderNumber}`,
      "",
      "Totali ordine:",
      totalsText,
      "",
      "Nota: i tempi di accredito dipendono dal metodo di pagamento.",
      policiesFooterText(),
    ]
      .filter(Boolean)
      .join("\n");

    return { subject, html, text };
  }

  // fallback (non dovrebbe servire)
  return {
    subject: `Aggiornamento ordine • ${orderNumber}`,
    html: htmlShell({
      title: "Aggiornamento ordine",
      intro: "Ci sono novità sul tuo ordine.",
      bodyHtml: orderSummaryCardHtml(o),
    }),
    text: [`Ciao ${o.fullName || ""}`, "", `Aggiornamento sul tuo ordine ${orderNumber}.`, policiesFooterText()].join(
      "\n"
    ),
  };
}

/** ---------- SENDER + LOGGING ---------- **/

type SendResult = { ok: true; messageId?: string | null } | { ok: false; error: string };

type ResendSendResponseLike = { id?: unknown };
function getResendMessageId(res: unknown): string | null {
  if (!res || typeof res !== "object") return null;
  const id = (res as ResendSendResponseLike).id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

async function sendViaResend(args: { to: string; subject: string; text: string; html: string }): Promise<SendResult> {
  const from = process.env.EMAIL_FROM;
  if (!from) return { ok: false, error: "Missing EMAIL_FROM" };
  if (!resend) return { ok: false, error: "Missing RESEND_API_KEY" };

  try {
    const res = await resend.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      text: args.text,
      html: args.html,
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
    });

    return { ok: true, messageId: getResendMessageId(res) };
  } catch (e: unknown) {
    return { ok: false, error: getErrText(e, "Email send failed") };
  }
}

export async function sendTransactionalEmail(args: {
  type: TransactionalEmailType;
  orderId: string;
}): Promise<{ ok: boolean; status: "sent" | "failed" | "skipped"; messageId?: string | null }> {
  const { type, orderId } = args;

  const existing = await prisma.transactionalEmailLog
    .findUnique({ where: { orderId_type: { orderId, type } } })
    .catch(() => null);

  if (existing?.status === "sent") {
    return { ok: true, status: "skipped", messageId: existing.messageId ?? null };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { select: { title: true, variantLabel: true, qty: true, unitPriceCents: true } },
    },
  });

  if (!order) return { ok: false, status: "failed" };

  const to = String(order.email ?? "").trim();
  if (!to) {
    await prisma.transactionalEmailLog.upsert({
      where: { orderId_type: { orderId, type } },
      create: { orderId, type, status: "skipped", toEmail: "(missing)" },
      update: { status: "skipped", toEmail: "(missing)" },
    });
    return { ok: true, status: "skipped" };
  }

  const built = buildEmail(type, order);

  const result = await sendViaResend({
    to,
    subject: built.subject,
    text: built.text,
    html: built.html,
  });

  if (result.ok) {
    await prisma.transactionalEmailLog.upsert({
      where: { orderId_type: { orderId, type } },
      create: { orderId, type, status: "sent", toEmail: to, messageId: result.messageId ?? null },
      update: { status: "sent", toEmail: to, messageId: result.messageId ?? null, error: null },
    });
    return { ok: true, status: "sent", messageId: result.messageId ?? null };
  }

  await prisma.transactionalEmailLog.upsert({
    where: { orderId_type: { orderId, type } },
    create: { orderId, type, status: "failed", toEmail: to, error: result.error },
    update: { status: "failed", toEmail: to, error: result.error },
  });

  return { ok: false, status: "failed" };
}