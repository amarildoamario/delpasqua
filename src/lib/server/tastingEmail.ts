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
    to: args.to,
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
export async function sendTastingBookingAdminEmail(args: {
  id: string;
  status: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  fullName: string;
  email: string;
  phone: string;
  notes?: string | null;
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
    to,
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

  const url = baseUrl();
  const subject = `Nuova prenotazione degustazione — ${args.fullName}`;

  const text = [
    "Nuova prenotazione degustazione",
    `ID: ${args.id}`,
    `Stato: ${args.status}`,
    `Slot: ${fmtIt(args.slotStart)} → ${fmtIt(args.slotEnd)}`,
    `Tipo: ${args.tastingType}`,
    `Persone: ${args.people}`,
    `Nome: ${args.fullName}`,
    `Email: ${args.email}`,
    `Telefono: ${args.phone}`,
    args.notes ? `Note: ${args.notes}` : "",
    `Admin: ${url}/admin/degustazioni`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui;line-height:1.5;color:#111827;">
    <h2 style="margin:0 0 10px 0;">Nuova prenotazione degustazione</h2>
    <div style="padding:14px;border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;max-width:640px;">
      <p style="margin:0 0 8px 0;"><b>ID:</b> ${escapeHtml(args.id)}</p>
      <p style="margin:0 0 8px 0;"><b>Stato:</b> ${escapeHtml(args.status)}</p>
      <p style="margin:0 0 8px 0;"><b>Slot:</b> ${escapeHtml(fmtIt(args.slotStart))} → ${escapeHtml(
        fmtIt(args.slotEnd)
      )}</p>
      <p style="margin:0 0 8px 0;"><b>Tipo:</b> ${escapeHtml(args.tastingType)}</p>
      <p style="margin:0 0 8px 0;"><b>Persone:</b> ${args.people}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;" />
      <p style="margin:0 0 6px 0;"><b>Nome:</b> ${escapeHtml(args.fullName)}</p>
      <p style="margin:0 0 6px 0;"><b>Email:</b> ${escapeHtml(args.email)}</p>
      <p style="margin:0 0 6px 0;"><b>Telefono:</b> ${escapeHtml(args.phone)}</p>
      ${
        args.notes
          ? `<p style="margin:10px 0 0 0;"><b>Note:</b><br/>${escapeHtml(args.notes)}</p>`
          : ""
      }
      <div style="margin-top:14px;">
        <a href="${escapeHtml(
          url + "/admin/degustazioni"
        )}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:12px;font-weight:700;">Apri in Admin</a>
      </div>
    </div>
  </body></html>`;

  console.log("[TASTING][EMAIL][ADMIN] sending", {
    bookingId: args.id,
    to,
    from,
    subject,
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
export async function sendTastingCanceledCustomerEmail(args: {
  toEmail: string;
  fullName: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
}): Promise<MailOk | MailFail> {
  const from = process.env.EMAIL_FROM;
  const resend = getResend();

  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const hasFrom = Boolean(from);

  console.log("[TASTING][EMAIL][CUSTOMER][CANCELED] preflight", {
    to: args.toEmail,
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
            to: [args.toEmail],
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
            to: [args.toEmail],
            from,
            env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom },
          }
        : {}),
    };
    console.error("[TASTING][EMAIL][CUSTOMER][CANCELED] failed", out);
    return out;
  }

  const url = baseUrl();
  const subject = `Prenotazione degustazione annullata — ${fmtIt(args.slotStart)}`;

  const text = [
    `Ciao ${args.fullName},`,
    "",
    "la tua prenotazione per la degustazione è stata annullata ❌",
    "",
    `Quando: ${fmtIt(args.slotStart)} → ${fmtIt(args.slotEnd)}`,
    `Tipo: ${args.tastingType}`,
    `Persone: ${args.people}`,
    "",
    "Se vuoi, puoi prenotare un nuovo slot dal sito.",
    "",
    `${url}/degustazioni`,
    "",
    "A presto!",
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui;line-height:1.6;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:18px;">
      <h2 style="margin:0 0 10px 0;">Prenotazione annullata ❌</h2>
      <p style="margin:0 0 14px 0;">Ciao <b>${escapeHtml(args.fullName)}</b>,</p>
      <div style="padding:14px;border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;">
        <p style="margin:0 0 8px 0;"><b>Quando:</b> ${escapeHtml(fmtIt(args.slotStart))} → ${escapeHtml(
    fmtIt(args.slotEnd)
  )}</p>
        <p style="margin:0 0 8px 0;"><b>Tipo:</b> ${escapeHtml(args.tastingType)}</p>
        <p style="margin:0;"><b>Persone:</b> ${args.people}</p>
      </div>
      <p style="margin:14px 0 0 0;">Se vuoi, puoi prenotare un nuovo slot dal sito.</p>
      <div style="margin-top:14px;">
        <a href="${escapeHtml(
          url + "/degustazioni"
        )}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:12px;font-weight:700;">Prenota una nuova degustazione</a>
      </div>
    </div>
  </body></html>`;

  console.log("[TASTING][EMAIL][CUSTOMER][CANCELED] sending", {
    to: args.toEmail,
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
            to: [args.toEmail],
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
            to: [args.toEmail],
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
export async function sendTastingConfirmedCustomerEmail(args: {
  toEmail: string;
  fullName: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
}): Promise<MailOk | MailFail> {
  const from = process.env.EMAIL_FROM;
  const resend = getResend();

  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const hasFrom = Boolean(from);

  console.log("[TASTING][EMAIL][CUSTOMER] preflight", {
    to: args.toEmail,
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
        ? { to: [args.toEmail], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
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
        ? { to: [args.toEmail], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
        : {}),
    };
    console.error("[TASTING][EMAIL][CUSTOMER] failed", out);
    return out;
  }

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
    "",
    "Se hai domande, rispondi a questa email.",
    "",
    "A presto!",
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui;line-height:1.6;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:18px;">
      <h2 style="margin:0 0 10px 0;">Prenotazione confermata ✅</h2>
      <p style="margin:0 0 14px 0;">Ciao <b>${escapeHtml(args.fullName)}</b>,</p>
      <div style="padding:14px;border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;">
        <p style="margin:0 0 8px 0;"><b>Quando:</b> ${escapeHtml(fmtIt(args.slotStart))} → ${escapeHtml(
    fmtIt(args.slotEnd)
  )}</p>
        <p style="margin:0 0 8px 0;"><b>Tipo:</b> ${escapeHtml(args.tastingType)}</p>
        <p style="margin:0;"><b>Persone:</b> ${args.people}</p>
      </div>
      <p style="margin:14px 0 0 0;">Se hai domande, rispondi a questa email.</p>
      <div style="margin-top:14px;">
        <a href="${escapeHtml(
          url
        )}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:12px;font-weight:700;">Vai al sito</a>
      </div>
    </div>
  </body></html>`;

  console.log("[TASTING][EMAIL][CUSTOMER] sending", {
    to: args.toEmail,
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
        ? { to: [args.toEmail], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
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
        ? { to: [args.toEmail], from, env: { NODE_ENV: process.env.NODE_ENV, hasResendKey, hasFrom } }
        : {}),
    };

    console.error("[TASTING][EMAIL][CUSTOMER] failed", out);
    return out;
  }
}