import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Nome troppo corto").max(120, "Nome troppo lungo"),
  email: z.string().trim().email("Email non valida").max(200, "Email troppo lunga"),
  subject: z.string().trim().min(2, "Oggetto troppo corto").max(200, "Oggetto troppo lungo"),
  message: z.string().trim().min(5, "Messaggio troppo corto").max(5000, "Messaggio troppo lungo"),
  consent: z.boolean(),
});

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const xr = req.headers.get("x-real-ip");
  return xr ?? "unknown";
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = ContactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message, consent } = parsed.data;

    if (!consent) {
      return NextResponse.json(
        { ok: false, error: "Consenso privacy obbligatorio" },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM;
    const ADMIN_TO = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_NOTIFY;

    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY mancante in env" },
        { status: 500 }
      );
    }
    if (!EMAIL_FROM) {
      return NextResponse.json(
        { ok: false, error: "EMAIL_FROM mancante in env" },
        { status: 500 }
      );
    }
    if (!ADMIN_TO) {
      return NextResponse.json(
        { ok: false, error: "ADMIN_NOTIFY_EMAIL (o EMAIL_NOTIFY) mancante in env" },
        { status: 500 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const ip = getClientIp(req);
    const ua = req.headers.get("user-agent") ?? "unknown";
    const now = new Date().toISOString();

    const adminSubject = `📩 Contatti — ${subject}`;

    const text = `Nuovo messaggio dal form Contatti

Nome: ${name}
Email: ${email}
Oggetto: ${subject}

Messaggio:
${message}

---
Meta:
IP: ${ip}
UA: ${ua}
Time: ${now}
`;

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5">
        <h2 style="margin:0 0 12px 0;">Nuovo messaggio dal form Contatti</h2>
        <p style="margin:0 0 6px 0;"><b>Nome:</b> ${escapeHtml(name)}</p>
        <p style="margin:0 0 6px 0;"><b>Email:</b> ${escapeHtml(email)}</p>
        <p style="margin:0 0 14px 0;"><b>Oggetto:</b> ${escapeHtml(subject)}</p>

        <div style="padding:12px 14px; background:#f6f6f6; border-radius:12px; white-space:pre-wrap">
          ${escapeHtml(message)}
        </div>

        <hr style="margin:18px 0; border:none; border-top:1px solid #e5e5e5" />
        <p style="margin:0; color:#666; font-size:12px">
          <b>IP:</b> ${escapeHtml(ip)}<br/>
          <b>UA:</b> ${escapeHtml(ua)}<br/>
          <b>Time:</b> ${escapeHtml(now)}
        </p>
      </div>
    `;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_TO,
      subject: adminSubject,
      text,
      html,
      // IMPORTANTISSIMO: così l'admin può cliccare "Rispondi" e rispondere al cliente
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg =
      (e as Error)?.message ||
      (e as { error?: { message?: string } })?.error?.message ||
      (typeof e === "string" ? e : null) ||
      "Errore invio email";

    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}