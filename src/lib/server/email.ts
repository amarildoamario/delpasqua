import { Resend } from "resend";
import { prisma } from "@/lib/server/prisma";
import type { TransactionalEmailType } from "@/generated/prisma/client";

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
  return process.env.EMAIL_BRAND_NAME || "Frantoio Del Pasqua";
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

type EmailOrderItem = {
  title: string;
  variantLabel: string;
  qty: number;
  unitPriceCents: number;
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
    `Privacy: ${url}/privacy-policy/`,
    `Termini: ${url}/condizioni-generali-di-vendita/`,
  ].join("\n");
}

/** ---------- HTML TEMPLATE HELPERS ---------- **/

function css() {
  // Inline + embedded CSS: robusto per client email (Gmail/Apple Mail/Outlook web)
  return `
  <style>
    html,body{margin:0;padding:0;background:#f3f3ef;font-family:Arial,Helvetica,sans-serif;color:#282d25;}
    *{box-sizing:border-box;}
    .wrapper{width:100%;background:#f3f3ef;padding:32px 16px;}
    .container{max-width:600px;margin:0 auto;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid #e4e6de;}
    .header{padding:28px 32px 24px;border-bottom:1px solid #e8eae3;}
    .brand{font-size:22px;font-weight:700;color:#334a37;letter-spacing:-.5px;}
    .tag{font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:#7a8175;margin-top:8px;}
    .content{padding:30px 32px 24px;}
    .h1{font-size:25px;line-height:1.25;margin:0 0 12px;color:#282d25;font-weight:600;letter-spacing:-.6px;}
    .p{font-size:14px;line-height:1.75;margin:0 0 16px;color:#282d25;}
    .muted{color:#72786b;}
    .card{padding:0;margin:24px 0;}
    .order-details{border-top:1px solid #e4e6de;border-bottom:1px solid #e4e6de;margin:26px 0;padding:18px 0 0;}
    .order-summary{width:100%;border-collapse:collapse;margin-bottom:16px;}
    .order-summary td{vertical-align:top;}
    .shipping{border-top:1px solid #e4e6de;padding-top:22px;}
    .row{display:flex;gap:12px;flex-wrap:wrap;}
    .col{flex:1;min-width:220px;}
    .kv{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#7a8175;margin:0 0 7px;}
    .vv{font-size:14px;color:#282d25;margin:0;font-weight:600;}
    .table{width:100%;border-collapse:collapse;margin-top:10px;}
    .th{font-size:11px;font-weight:400;text-align:left;color:#72786b;padding:12px 0;border-bottom:1px solid #e8eae3;}
    .td{font-size:13px;line-height:1.5;color:#282d25;padding:14px 0;border-bottom:1px solid #eff0eb;}
    .td:first-child{padding-right:12px;}
    .table tr:last-child .td{border-bottom:0;}
    .right{text-align:right;}
    .btnWrap{margin:16px 0 4px;}
    .btn{display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:700;font-size:14px;}
    .btnSecondary{display:inline-block;background:#ffffff;color:#111827;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:700;font-size:14px;border:1px solid #eef0f5;}
    .footer{padding:22px 32px;background:#fafbf7;border-top:1px solid #e8eae3;}
    .footlinks a{color:#57634e;text-decoration:underline;font-size:11px;margin-right:14px;line-height:2;}
    .small{font-size:11px;color:#7a8175;line-height:1.7;margin:12px 0 0;}
    @media (max-width: 480px){
      .wrapper{padding:16px 10px;}
      .content{padding:24px 20px 20px;}
      .header{padding:22px 20px;}
      .footer{padding:20px;}
      .h1{font-size:23px;}
      .brand{font-size:21px;}
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
            <div class="tag">Dal nostro frantoio, a casa tua</div>
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
              <a href="${url}/privacy-policy/">Privacy</a>
              <a href="${url}/condizioni-generali-di-vendita/">Termini</a>
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

  return `
    <table class="order-summary" role="presentation">
      <tr>
        <td>
          <p class="kv">Numero ordine</p>
          <p class="vv">${orderNumber}</p>
        </td>
        <td class="right">
          <p class="kv">Totale</p>
          <p class="vv">${total}</p>
        </td>
      </tr>
    </table>
  `;
}

function shippingCardHtml(o: unknown) {
  const ship = escapeHtml(formatShipping(o)).replaceAll("\n", "<br/>");
  return `
    <div class="card shipping">
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
  `;
}

function orderDetailsHtml(o: TransactionalEmailPreviewPayload) {
  return `<div class="order-details">${orderSummaryCardHtml(o)}${itemsTableHtml(o.items)}</div>`;
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

export type TransactionalEmailPreviewPayload = {
  isTest?: boolean;
  id: string;
  orderNumber: string | null;
  status: string;
  email: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  city: string;
  province: string | null;
  countryCode: string;
  phone: string | null;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  items: EmailOrderItem[];
};

export type BuiltTransactionalEmail = {
  subject: string;
  html: string;
  text: string;
};

export const PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES = [
  "ORDER_PAID",
  "ORDER_SHIPPED",
  "ORDER_REFUNDED",
] as const satisfies readonly TransactionalEmailType[];

function buildEmail(type: TransactionalEmailType, o: TransactionalEmailPreviewPayload): BuiltTransactionalEmail {
  const orderNumber = String(o.orderNumber ?? o.id);

  const itemsText = itemsToText(o.items ?? []);
  const totalsText = totalsToText(o);
  const shippingText = formatShipping(o);

  if (type === "ORDER_PAID") {
    const subject = `Ordine ricevuto • ${orderNumber}`;
    const title = "Grazie per il tuo ordine.";
    const intro = "Grazie per aver scelto Frantoio Del Pasqua. Il pagamento è confermato: prepariamo con cura il tuo ordine e ti avviseremo appena sarà spedito.";

    const html = htmlShell({
      title,
      intro,
      bodyHtml:
        orderDetailsHtml(o) +
        totalsCardHtml(o) +
        shippingCardHtml(o) +
        (o.isTest ? "" : `<p class="p muted">In allegato trovi il riepilogo del tuo ordine in PDF.</p>`) +
        `<p class="p muted">Per qualsiasi domanda, rispondi a questa email. Saremo felici di aiutarti.</p>`,
      footerNote: "Conserva questa email come ricevuta d’ordine.",
    });

    const text = [
      `Ciao ${o.fullName || ""},`,
      "",
      intro,
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
      ...(o.isTest ? [] : ["", "In allegato trovi il riepilogo del tuo ordine in PDF."]),
      policiesFooterText(),
    ]
      .filter(Boolean)
      .join("\n");

    return { subject, html, text };
  }

  if (type === "ORDER_SHIPPED") {
    const subject = `Il tuo ordine è stato spedito • ${orderNumber}`;
    const title = "Il tuo ordine è in viaggio.";
    const intro = "Il tuo ordine è stato spedito. Qui trovi i dettagli e l’indirizzo di consegna.";

    const html = htmlShell({
      title,
      intro,
      bodyHtml: orderDetailsHtml(o) + shippingCardHtml(o),
      footerNote: "Grazie per aver scelto Frantoio Del Pasqua.",
    });

    const text = [
      `Ciao ${o.fullName || ""},`,
      "",
      "Il tuo ordine è stato spedito. Grazie per aver scelto Frantoio Del Pasqua.",
      `Numero ordine: ${orderNumber}`,
      "",
      "Articoli:",
      itemsText,
      "",
      "Spedizione a:",
      shippingText,
      "",
      policiesFooterText(),
    ]
      .filter(Boolean)
      .join("\n");

    return { subject, html, text };
  }

  if (type === "ORDER_REFUNDED") {
    const subject = `Rimborso effettuato • ${orderNumber}`;
    const title = "Il rimborso è stato effettuato.";
    const intro = "Abbiamo registrato un rimborso relativo al tuo ordine.";

    const html = htmlShell({
      title,
      intro,
      bodyHtml: orderDetailsHtml(o) + totalsCardHtml(o),
      footerNote: "I tempi di accredito dipendono dal metodo di pagamento e dalla banca.",
    });

    const text = [
      `Ciao ${o.fullName || ""},`,
      "",
      "Abbiamo registrato un rimborso per il tuo ordine.",
      `Numero ordine: ${orderNumber}`,
      "",
      "Articoli:",
      itemsText,
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

export function buildTransactionalEmailPreview(
  type: (typeof PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES)[number],
  payload?: Partial<TransactionalEmailPreviewPayload>
): BuiltTransactionalEmail {
  const sampleOrder: TransactionalEmailPreviewPayload = {
    id: "ord_preview_20260529",
    orderNumber: "DP-2026-0042",
    status:
      type === "ORDER_SHIPPED" ? "SPEDITO" : type === "ORDER_REFUNDED" ? "RIMBORSATO" : "PAGATO",
    email: "cliente@example.com",
    fullName: "Mario Rossi",
    addressLine1: "Via delle Colline 15",
    addressLine2: "Interno 4",
    postalCode: "70121",
    city: "Bari",
    province: "BA",
    countryCode: "IT",
    phone: "+39 333 123 4567",
    subtotalCents: 7800,
    discountCents: 900,
    shippingCents: 0,
    taxCents: 0,
    totalCents: 6900,
    items: [
      {
        title: "Olio EVO Fruttato Medio",
        variantLabel: "Bottiglia 500 ml",
        qty: 2,
        unitPriceCents: 1450,
      },
      {
        title: "Olio EVO Fruttato Intenso",
        variantLabel: "Bottiglia 750 ml",
        qty: 1,
        unitPriceCents: 4000,
      },
      {
        title: "Olio al Limone",
        variantLabel: "Bottiglia 250 ml",
        qty: 1,
        unitPriceCents: 900,
      },
    ],
  };

  const merged: TransactionalEmailPreviewPayload = {
    ...sampleOrder,
    ...payload,
    items: payload?.items ?? sampleOrder.items,
  };

  return buildEmail(type, merged);
}

/** ---------- SENDER + LOGGING ---------- **/

type SendResult = { ok: true; messageId?: string | null } | { ok: false; error: string };

async function sendViaResend(args: { to: string; subject: string; text: string; html: string; idempotencyKey: string; attachments?: Array<{ filename: string; content: Buffer; contentType: string }> }): Promise<SendResult> {
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
      ...(args.attachments?.length ? { attachments: args.attachments } : {}),
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
    }, { idempotencyKey: args.idempotencyKey });

    if (res.error) return { ok: false, error: res.error.message };
    if (!res.data?.id) return { ok: false, error: "Email provider returned no message ID" };
    return { ok: true, messageId: res.data.id };
  } catch (e: unknown) {
    return { ok: false, error: getErrText(e, "Email send failed") };
  }
}

export async function sendTransactionalEmail(args: {
  type: TransactionalEmailType;
  orderId: string;
}): Promise<{ ok: boolean; status: "sent" | "failed" | "skipped"; messageId?: string | null; error?: string }> {
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
      items: { orderBy: { title: "asc" } },
    },
  });

  if (!order) return { ok: false, status: "failed", error: "Order not found" };

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

  // Use the same renderer as the admin print sheet; no print/audit or fiscal counters are mutated.
  let attachments: Array<{ filename: string; content: Buffer; contentType: string }> | undefined;
  if (type === "ORDER_PAID" && !order.isTest) {
    try {
      const { buildOrderPdfAttachment } = await import("@/lib/server/orderPdf");
      attachments = [await buildOrderPdfAttachment(order)];
    } catch {
      const error = "Unable to generate order PDF attachment";
      await prisma.transactionalEmailLog.upsert({
        where: { orderId_type: { orderId, type } },
        create: { orderId, type, status: "failed", toEmail: to, error },
        update: { status: "failed", toEmail: to, error },
      });
      return { ok: false, status: "failed", error };
    }
  }

  const result = await sendViaResend({
    to,
    subject: built.subject,
    text: built.text,
    html: built.html,
    idempotencyKey: `order-email/${orderId}/${type}`,
    attachments,
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

  return { ok: false, status: "failed", error: result.error };
}
