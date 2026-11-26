import { Resend } from "resend";

/**
 * Debug philosophy:
 * - Mai "silenzioso": se non invia, ritorna reason/error.
 * - Logga SEMPRE (server) i campi essenziali: to/from/bookingId.
 * - In DEV include nel risultato anche i destinatari "to" e info env "safe".
 */

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fmtIt(d: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function isDev() {
  // dev "vera": local + preview; prod: no
  return process.env.NODE_ENV !== "production";
}

function maskEmail(email: string) {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length !== 2) return "***";
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local.slice(1, -1).replace(/./g, "*")}${local[local.length - 1]}@${domain}`;
}

function maskName(name: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts.map((part) => part.length > 1 ? `${part[0]}***` : "*").join(" ");
}

function adminRecipients(): string[] {
  const raw =
    process.env.TASTINGS_ADMIN_EMAILS ||
    process.env.EMAIL_NOTIFY ||
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_NOTIFY_EMAIL || // ✅ tua env
    "";

  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return list;
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

type MailOk = {
  ok: true;
  status: "sent" | "skipped";
  messageId?: string | null;
  reason?: string;
  // debug-only fields
  to?: string[];
  from?: string;
  env?: {
    NODE_ENV?: string;
    hasResendKey?: boolean;
    hasFrom?: boolean;
    hasAdminRecipients?: boolean;
  };
};

type MailFail = {
  ok: false;
  status: "failed";
  error?: string;
  // debug-only fields
  to?: string[];
  from?: string;
  env?: {
    NODE_ENV?: string;
    hasResendKey?: boolean;
    hasFrom?: boolean;
    hasAdminRecipients?: boolean;
  };
};

type ResendSendResponseLike = {
  id?: unknown;
};

function getResendMessageId(res: unknown): string | null {
  if (!res || typeof res !== "object") return null;
  const id = (res as ResendSendResponseLike).id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

function devExtras(args: {
  to: string[];
  from: string | undefined;
  hasResendKey: boolean;
  hasFrom: boolean;
  hasAdminRecipients: boolean;
}) {
  if (!isDev()) return {};
  return {
    to: args.to.map(maskEmail),
    from: args.from,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasResendKey: args.hasResendKey,
      hasFrom: args.hasFrom,
      hasAdminRecipients: args.hasAdminRecipients,
    },
  };
}

type ErrLike = {
  message?: unknown;
  error?: { message?: unknown };
  name?: unknown;
  statusCode?: unknown;
  code?: unknown;
  details?: unknown;
};

function asErrLike(e: unknown): ErrLike | null {
  return typeof e === "object" && e !== null ? (e as ErrLike) : null;
}

function getErrText(e: unknown, fallback = "Email send failed"): string {
  if (typeof e === "string") return e;
  if (e instanceof Error && e.message) return e.message;

  const o = asErrLike(e);
  const msg = o?.message ?? o?.error?.message;

  return typeof msg === "string" && msg.trim() ? msg : fallback;
}

function getErrRaw(e: unknown) {
  const o = asErrLike(e);
  if (!o) return undefined;

  return {
    name: typeof o.name === "string" ? o.name : undefined,
    statusCode: typeof o.statusCode === "number" ? o.statusCode : undefined,
    code: o.code,
    details: o.details,
  };
}

/**
 * ✅ EMAIL ADMIN — notifica nuova prenotazione
 */
export function buildTastingBookingAdminEmailContent(args: {
  id: string;
  status: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  children?: number | null;
  fullName: string;
  email: string;
  phone: string;
  notes?: string | null;
  viaVoucher?: boolean;
}) {
  const url = baseUrl();
  const title = args.viaVoucher ? "Nuova richiesta degustazione con voucher" : "Nuova prenotazione degustazione";
  const subject = `${title} — ${args.fullName}`;

  const text = [
    title,
    `ID: ${args.id}`,
    `Stato: ${args.status}`,
    `Slot: ${fmtIt(args.slotStart)} → ${fmtIt(args.slotEnd)}`,
    `Tipo: ${args.tastingType}`,
    `Persone: ${args.people}`,
    args.children ? `Bambini: ${args.children}` : "",
    `Nome: ${args.fullName}`,
    `Email: ${args.email}`,
    `Telefono: ${args.phone}`,
    args.notes ? `Note: ${args.notes}` : "",
    `Admin: ${url}/admin/degustazioni`,
  ]
    .filter(Boolean)
    .join("\n");

  const statusLabel = args.status === "PENDING" ? "In attesa di conferma" : args.status;
  const statusBg = args.status === "PENDING" ? "#fef3c7" : "#ecfdf5";
  const statusColor = args.status === "PENDING" ? "#92400e" : "#065f46";
  const participants = args.children
    ? `${args.people} ${args.people === 1 ? "adulto" : "adulti"} · ${args.children} ${args.children === 1 ? "bambino" : "bambini"}`
    : `${args.people} ${args.people === 1 ? "adulto" : "adulti"}`;

  const html = `<!doctype html>
<html lang="it">
<body style="margin:0;padding:0;background:#f5f5f2;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.55;color:#1c1917;">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px;">
    <div style="background:#ffffff;border:1px solid #e7e5e4;border-radius:5px;overflow:hidden;">
      <div style="padding:22px 24px 18px;border-bottom:1px solid #e7e5e4;background:#fafaf9;">
        <div style="margin-bottom:10px;">
          <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;border-radius:5px;background:${args.viaVoucher ? "#e8f0e6" : "#f5f5f4"};color:${args.viaVoucher ? "#274c34" : "#57534e"};">
            ${args.viaVoucher ? "Riscatto Voucher" : "Degustazione"}
          </span>
          <span style="display:inline-block;margin-left:6px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:5px;background:${statusBg};color:${statusColor};">
            ${escapeHtml(statusLabel)}
          </span>
        </div>
        <h2 style="margin:0;font-size:20px;line-height:1.3;font-weight:700;color:#111827;">${escapeHtml(title)}</h2>
        <p style="margin:6px 0 0;font-size:13px;color:#57534e;">ID prenotazione: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#292524;">${escapeHtml(args.id)}</span></p>
      </div>

      <div style="padding:22px 24px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">Dettagli richiesta</p>
        <table role="presentation" style="width:100%;border-collapse:collapse;background:#fafaf9;border:1px solid #e7e5e4;border-radius:5px;">
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:13px;color:#78716c;width:130px;vertical-align:top;">Data e orario</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:14px;font-weight:600;color:#111827;">${escapeHtml(fmtIt(args.slotStart))}<br/><span style="font-weight:400;color:#57534e;font-size:13px;">fino a ${escapeHtml(fmtIt(args.slotEnd))}</span></td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:13px;color:#78716c;vertical-align:top;">Esperienza</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:14px;font-weight:600;color:#111827;">${escapeHtml(args.tastingType)}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;color:#78716c;vertical-align:top;">Partecipanti</td>
            <td style="padding:10px 14px;font-size:14px;color:#111827;">${escapeHtml(participants)}</td>
          </tr>
        </table>

        <p style="margin:20px 0 10px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">Contatto cliente</p>
        <table role="presentation" style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e7e5e4;border-radius:5px;">
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:13px;color:#78716c;width:130px;">Nome</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:14px;font-weight:600;color:#111827;">${escapeHtml(args.fullName)}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:13px;color:#78716c;">Email</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e7e5e4;font-size:14px;"><a href="mailto:${escapeHtml(args.email)}" style="color:#274c34;text-decoration:none;font-weight:500;">${escapeHtml(args.email)}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-size:13px;color:#78716c;">Telefono</td>
            <td style="padding:10px 14px;font-size:14px;"><a href="tel:${escapeHtml(args.phone)}" style="color:#111827;text-decoration:none;">${escapeHtml(args.phone)}</a></td>
          </tr>
        </table>

        ${
          args.notes
            ? `<div style="margin-top:16px;padding:12px 14px;background:#fafaf9;border:1px solid #e7e5e4;border-left:3px solid #274c34;border-radius:5px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">Note del cliente</p>
                <p style="margin:0;font-size:14px;color:#292524;">${escapeHtml(args.notes)}</p>
              </div>`
            : ""
        }

        <div style="margin-top:22px;">
          <a href="${escapeHtml(
            url + "/admin/degustazioni"
          )}" style="display:inline-block;background:#1c1917;color:#ffffff;text-decoration:none;padding:11px 18px;border-radius:5px;font-size:14px;font-weight:600;">Gestisci in Admin</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

export async function sendTastingBookingAdminEmail(args: {
  id: string;
  status: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  children?: number | null;
  fullName: string;
  email: string;
  phone: string;
  notes?: string | null;
  viaVoucher?: boolean;
}): Promise<MailOk | MailFail> {
  const to = adminRecipients();
  const from = process.env.EMAIL_FROM;
  const resend = getResend();

  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const hasFrom = Boolean(from);
  const hasAdminRecipients = to.length > 0;

  // ✅ log SERVER sempre
  console.log("[TASTING][EMAIL][ADMIN] preflight", {
    bookingId: args.id,
    to: to.map(maskEmail),
    from,
    hasResendKey,
    hasFrom,
    hasAdminRecipients,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!hasAdminRecipients) {
    const res: MailOk = {
      ok: true,
      status: "skipped",
      reason:
        "No admin recipients configured. Set one of: TASTINGS_ADMIN_EMAILS, EMAIL_NOTIFY, ADMIN_EMAIL, ADMIN_NOTIFY_EMAIL",
      ...devExtras({ to, from, hasResendKey, hasFrom, hasAdminRecipients }),
    };
    console.warn("[TASTING][EMAIL][ADMIN] skipped", res);
    return res;
  }

  if (!from) {
    const res: MailFail = {
      ok: false,
      status: "failed",
      error: "Missing EMAIL_FROM",
      ...devExtras({ to, from, hasResendKey, hasFrom, hasAdminRecipients }),
    };
    console.error("[TASTING][EMAIL][ADMIN] failed", res);
    return res;
  }

  if (!resend) {
    const res: MailFail = {
      ok: false,
      status: "failed",
      error: "Missing RESEND_API_KEY",
      ...devExtras({ to, from, hasResendKey, hasFrom, hasAdminRecipients }),
    };
    console.error("[TASTING][EMAIL][ADMIN] failed", res);
    return res;
  }

  const { subject, text, html } = buildTastingBookingAdminEmailContent(args);

  console.log("[TASTING][EMAIL][ADMIN] sending", {
    bookingId: args.id,
    to: to.map(maskEmail),
    from,
    subject: subject.replace(args.fullName, maskName(args.fullName)),
  });

  try {
    const res = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
    });

    const out: MailOk = {
      ok: true,
      status: "sent",
      messageId: getResendMessageId(res),
      ...devExtras({ to, from, hasResendKey, hasFrom, hasAdminRecipients }),
    };

    console.log("[TASTING][EMAIL][ADMIN] sent", out);
    return out;
  } catch (e: unknown) {
    const errText = getErrText(e);

    const out: MailFail = {
      ok: false,
      status: "failed",
      error: errText,
      ...devExtras({ to, from, hasResendKey, hasFrom, hasAdminRecipients }),
    };

    console.error("[TASTING][EMAIL][ADMIN] failed", {
      ...out,
      raw: isDev() ? getErrRaw(e) : undefined,
    });

    return out;
  }
}

/**
 * ✅ EMAIL CLIENTE — inviata quando l'admin cancella (CANCELED)
 */
export function buildTastingCanceledCustomerEmailContent(args: {
  fullName: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  children?: number | null;
  viaVoucher?: boolean;
}) {
  const url = baseUrl();
  const subject = `Prenotazione degustazione annullata — ${fmtIt(args.slotStart)}`;
  const rebooking = args.viaVoucher
    ? "Il tuo voucher è di nuovo utilizzabile. Puoi usare lo stesso codice per richiedere una nuova data."
    : "Se vuoi, puoi prenotare un nuovo slot dal sito.";

  const text = [
    `Ciao ${args.fullName},`,
    "",
    "la tua prenotazione per la degustazione è stata annullata ❌",
    "",
    `Quando: ${fmtIt(args.slotStart)} → ${fmtIt(args.slotEnd)}`,
    `Tipo: ${args.tastingType}`,
    `Persone: ${args.people}`,
    args.children ? `Bambini: ${args.children}` : "",
    "",
    rebooking,
    "",
    `${url}/degustazioni`,
    "",
    "A presto!",
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui;line-height:1.6;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:18px;">
      <h2 style="margin:0 0 10px 0;">Prenotazione annullata ❌</h2>
      <p style="margin:0 0 14px 0;">Ciao <b>${escapeHtml(args.fullName)}</b>,</p>
      <div style="padding:14px;border:1px solid #e5e7eb;border-radius:5px;background:#f9fafb;">
        <p style="margin:0 0 8px 0;"><b>Quando:</b> ${escapeHtml(fmtIt(args.slotStart))} → ${escapeHtml(
    fmtIt(args.slotEnd)
  )}</p>
        <p style="margin:0 0 8px 0;"><b>Tipo:</b> ${escapeHtml(args.tastingType)}</p>
        <p style="margin:0 ${args.children ? "0 8px 0" : ""};"><b>Persone:</b> ${args.people}</p>
        ${
          args.children
            ? `<p style="margin:0;"><b>Bambini:</b> ${args.children}</p>`
            : ""
        }
      </div>
      <p style="margin:14px 0 0 0;">${escapeHtml(rebooking)}</p>
      <div style="margin-top:14px;">
        <a href="${escapeHtml(
          url + "/degustazioni"
        )}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:5px;font-weight:700;">Prenota una nuova degustazione</a>
      </div>
    </div>
  </body></html>`;

  return { subject, text, html };
}

export async function sendTastingCanceledCustomerEmail(args: {
  toEmail: string;
  fullName: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  children?: number | null;
  viaVoucher?: boolean;
}): Promise<MailOk | MailFail> {
  const from = process.env.EMAIL_FROM;
  const resend = getResend();

  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const hasFrom = Boolean(from);

  console.log("[TASTING][EMAIL][CUSTOMER][CANCELED] preflight", {
    to: maskEmail(args.toEmail),
    from,
    hasResendKey,
    hasFrom,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!from) {
    const out: MailFail = {
      ok: false,
      status: "failed",
      error: "Missing EMAIL_FROM",
      ...(isDev()
        ? {
            to: [maskEmail(args.toEmail)],
            from,
            env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom },
          }
        : {}),
    };
    console.error("[TASTING][EMAIL][CUSTOMER][CANCELED] failed", out);
    return out;
  }

  if (!resend) {
    const out: MailFail = {
      ok: false,
      status: "failed",
      error: "Missing RESEND_API_KEY",
      ...(isDev()
        ? {
            to: [maskEmail(args.toEmail)],
            from,
            env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom },
          }
        : {}),
    };
    console.error("[TASTING][EMAIL][CUSTOMER][CANCELED] failed", out);
    return out;
  }

  const { subject, text, html } = buildTastingCanceledCustomerEmailContent(args);

  console.log("[TASTING][EMAIL][CUSTOMER][CANCELED] sending", {
    to: maskEmail(args.toEmail),
    from,
    subject,
  });

  try {
    const res = await resend.emails.send({
      from,
      to: [args.toEmail],
      subject,
      text,
      html,
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
    });

    const out: MailOk = {
      ok: true,
      status: "sent",
      messageId: getResendMessageId(res),
      ...(isDev()
        ? {
            to: [maskEmail(args.toEmail)],
            from,
            env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom },
          }
        : {}),
    };

    console.log("[TASTING][EMAIL][CUSTOMER][CANCELED] sent", out);
    return out;
  } catch (e: unknown) {
    const errText = getErrText(e);

    const out: MailFail = {
      ok: false,
      status: "failed",
      error: errText,
      ...(isDev()
        ? {
            to: [maskEmail(args.toEmail)],
            from,
            env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom },
          }
        : {}),
    };

    console.error("[TASTING][EMAIL][CUSTOMER][CANCELED] failed", out);
    return out;
  }
}

/**
 * ✅ EMAIL CLIENTE — inviata a conferma prenotazione (CONFIRMED)
 */
export function buildTastingConfirmedCustomerEmailContent(args: {
  fullName: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  children?: number | null;
}) {
  const url = baseUrl();
  const subject = `Prenotazione degustazione confermata — ${fmtIt(args.slotStart)}`;

  const text = [
    `Ciao ${args.fullName},`,
    "",
    "la tua prenotazione per la degustazione è confermata ✅",
    "",
    `Quando: ${fmtIt(args.slotStart)} → ${fmtIt(args.slotEnd)}`,
    `Tipo: ${args.tastingType}`,
    `Persone: ${args.people}`,
    args.children ? `Bambini: ${args.children}` : "",
    "",
    "Se hai domande, rispondi a questa email.",
    "",
    "A presto!",
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui;line-height:1.6;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:18px;">
      <h2 style="margin:0 0 10px 0;">Prenotazione confermata ✅</h2>
      <p style="margin:0 0 14px 0;">Ciao <b>${escapeHtml(args.fullName)}</b>,</p>
      <div style="padding:14px;border:1px solid #e5e7eb;border-radius:5px;background:#f9fafb;">
        <p style="margin:0 0 8px 0;"><b>Quando:</b> ${escapeHtml(fmtIt(args.slotStart))} → ${escapeHtml(
    fmtIt(args.slotEnd)
  )}</p>
        <p style="margin:0 0 8px 0;"><b>Tipo:</b> ${escapeHtml(args.tastingType)}</p>
        <p style="margin:0 ${args.children ? "0 8px 0" : ""};"><b>Persone:</b> ${args.people}</p>
        ${
          args.children
            ? `<p style="margin:0;"><b>Bambini:</b> ${args.children}</p>`
            : ""
        }
      </div>
      <p style="margin:14px 0 0 0;">Se hai domande, rispondi a questa email.</p>
      <div style="margin-top:14px;">
        <a href="${escapeHtml(
          url
        )}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:5px;font-weight:700;">Vai al sito</a>
      </div>
    </div>
  </body></html>`;

  return { subject, text, html };
}

export async function sendTastingConfirmedCustomerEmail(args: {
  toEmail: string;
  fullName: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  children?: number | null;
}): Promise<MailOk | MailFail> {
  const from = process.env.EMAIL_FROM;
  const resend = getResend();

  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const hasFrom = Boolean(from);

  console.log("[TASTING][EMAIL][CUSTOMER] preflight", {
    to: maskEmail(args.toEmail),
    from,
    hasResendKey,
    hasFrom,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!from) {
    const out: MailFail = {
      ok: false,
      status: "failed",
      error: "Missing EMAIL_FROM",
      ...(isDev()
        ? { to: [maskEmail(args.toEmail)], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
        : {}),
    };
    console.error("[TASTING][EMAIL][CUSTOMER] failed", out);
    return out;
  }

  if (!resend) {
    const out: MailFail = {
      ok: false,
      status: "failed",
      error: "Missing RESEND_API_KEY",
      ...(isDev()
        ? { to: [maskEmail(args.toEmail)], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
        : {}),
    };
    console.error("[TASTING][EMAIL][CUSTOMER] failed", out);
    return out;
  }

  const { subject, text, html } = buildTastingConfirmedCustomerEmailContent(args);

  console.log("[TASTING][EMAIL][CUSTOMER] sending", {
    to: maskEmail(args.toEmail),
    from,
    subject,
  });

  try {
    const res = await resend.emails.send({
      from,
      to: [args.toEmail],
      subject,
      text,
      html,
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
    });

    const out: MailOk = {
      ok: true,
      status: "sent",
      messageId: getResendMessageId(res),
      ...(isDev()
        ? { to: [maskEmail(args.toEmail)], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
        : {}),
    };

    console.log("[TASTING][EMAIL][CUSTOMER] sent", out);
    return out;
  } catch (e: unknown) {
    const errText = getErrText(e);

    const out: MailFail = {
      ok: false,
      status: "failed",
      error: errText,
      ...(isDev()
        ? { to: [maskEmail(args.toEmail)], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
        : {}),
    };

    console.error("[TASTING][EMAIL][CUSTOMER] failed", out);
    return out;
  }
}
