import { readFile } from "node:fs/promises";
import path from "node:path";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  buildTransactionalEmailPreview,
  PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES,
} from "@/lib/server/email";
import { renderVoucherProposalPrintHtml } from "@/lib/server/orderPrint";
import {
  buildTastingBookingAdminEmailContent,
  buildTastingCanceledCustomerEmailContent,
  buildTastingConfirmedCustomerEmailContent,
} from "@/lib/server/tastingEmail";
import {
  buildTastingVoucherEmailContent,
  renderVoucherHtml,
} from "@/lib/server/tastingVoucherEmail";
import { pageMetadata } from "@/lib/seo";
import EmailPreview from "./EmailPreview";

type OrderTemplateId = (typeof PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES)[number];
type VoucherTemplateId =
  | "VOUCHER_PROPOSAL"
  | "VOUCHER_PAID"
  | "VOUCHER_BOOKING_ADMIN"
  | "VOUCHER_BOOKING_CONFIRMED"
  | "VOUCHER_BOOKING_CANCELED";
type TemplateId = OrderTemplateId | VoucherTemplateId;

type TemplateDef = {
  id: TemplateId;
  group: "orders" | "vouchers";
  label: string;
  recipient: string;
  trigger: string;
};

const TEMPLATES: TemplateDef[] = [
  {
    id: "ORDER_PAID",
    group: "orders",
    label: "Ordine ricevuto",
    recipient: "Cliente",
    trigger: "Webhook Stripe (ordine pagato) via outbox",
  },
  {
    id: "ORDER_SHIPPED",
    group: "orders",
    label: "Ordine spedito",
    recipient: "Cliente",
    trigger: "Cambio stato ordine a SPEDITO da Admin",
  },
  {
    id: "ORDER_REFUNDED",
    group: "orders",
    label: "Rimborso effettuato",
    recipient: "Cliente",
    trigger: "Rimborso ordine da Admin",
  },
  {
    id: "VOUCHER_PROPOSAL",
    group: "vouchers",
    label: "Proposta voucher",
    recipient: "Cliente (inserito da Admin)",
    trigger: "Invio manuale da Admin prima del pagamento",
  },
  {
    id: "VOUCHER_PAID",
    group: "vouchers",
    label: "Ricezione voucher",
    recipient: "Cliente (email Stripe Checkout)",
    trigger: "Webhook Stripe (voucher pagato) via outbox",
  },
  {
    id: "VOUCHER_BOOKING_ADMIN",
    group: "vouchers",
    label: "Richiesta data con voucher",
    recipient: "Admin",
    trigger: "Riscatto voucher dal cliente su /degustazioni/",
  },
  {
    id: "VOUCHER_BOOKING_CONFIRMED",
    group: "vouchers",
    label: "Degustazione confermata",
    recipient: "Cliente",
    trigger: "Conferma prenotazione da Admin",
  },
  {
    id: "VOUCHER_BOOKING_CANCELED",
    group: "vouchers",
    label: "Degustazione annullata",
    recipient: "Cliente",
    trigger: "Annullamento prenotazione da Admin (voucher riutilizzabile)",
  },
];

type PreviewData = {
  subject: string;
  text: string;
  html: string | null;
  attachment?: {
    filename: string;
    html?: string;
  };
};

async function getLogoDataUri(): Promise<string> {
  try {
    const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
    return `data:image/png;base64,${logo.toString("base64")}`;
  } catch {
    return "/logo.png";
  }
}

async function buildPreview(templateId: TemplateId): Promise<PreviewData> {
  if (
    templateId === "ORDER_PAID" ||
    templateId === "ORDER_SHIPPED" ||
    templateId === "ORDER_REFUNDED"
  ) {
    const preview = buildTransactionalEmailPreview(templateId);
    return {
      subject: preview.subject,
      text: preview.text,
      html: preview.html,
      ...(templateId === "ORDER_PAID"
        ? { attachment: { filename: "ordine-DP-2026-0042.pdf" } }
        : {}),
    };
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://delpasqua.com").replace(/\/$/, "");
  const sampleSlotStart = new Date("2026-06-14T10:30:00+02:00");
  const sampleSlotEnd = new Date("2026-06-14T12:00:00+02:00");

  switch (templateId) {
    case "VOUCHER_PROPOSAL": {
      const proposalId = "7f3a9c12-4b8e-4d1a-9f02-123456789abc";
      const tastingTitle = "Degustazione Intermedia";
      const paymentUrl = `${appUrl}/voucher/${proposalId}/`;
      const logoSrc = await getLogoDataUri();
      const pdfHtml = renderVoucherProposalPrintHtml(
        {
          id: proposalId,
          tastingType: "intermedia",
          tastingTitle,
          people: 2,
          children: 1,
          totalCents: 7000,
          createdAt: new Date("2026-05-18T11:20:00+02:00"),
        },
        logoSrc,
        paymentUrl,
      );
      return {
        subject: "Proposta degustazione | Frantoio Del Pasqua",
        text: `Buongiorno,\n\nin allegato trova la proposta per ${tastingTitle}. Nel PDF trova il riepilogo e il link della proposta.\n\nA presto,\nFrantoio Del Pasqua`,
        html: null,
        attachment: {
          filename: `proposta-degustazione-${proposalId.slice(0, 8)}.pdf`,
          html: pdfHtml,
        },
      };
    }

    case "VOUCHER_PAID": {
      const number = "DP26-02P-0518-0014";
      const tastingTitle = "Degustazione Intermedia";
      const bookingUrl = `${appUrl}/degustazioni/`;
      const logoSrc = await getLogoDataUri();
      const { subject, body } = buildTastingVoucherEmailContent({
        number,
        tastingTitle,
        bookingUrl,
        isTest: false,
      });
      const pdfHtml = renderVoucherHtml({
        logoSrc,
        number,
        title: tastingTitle,
        people: 2,
        children: 1,
        code: "A4F9-2C8E-7B1D-09E3",
        bookingUrl,
        isTest: false,
      });
      return {
        subject,
        text: body,
        html: null,
        attachment: {
          filename: `voucher-${number}.pdf`,
          html: pdfHtml,
        },
      };
    }

    case "VOUCHER_BOOKING_ADMIN":
      return buildTastingBookingAdminEmailContent({
        id: "tb_demo_0042",
        status: "PENDING",
        slotStart: sampleSlotStart,
        slotEnd: sampleSlotEnd,
        tastingType: "Degustazione Intermedia",
        people: 2,
        children: 1,
        fullName: "Giulia Ferretti",
        email: "giulia.ferretti@example.com",
        phone: "+39 333 1234567",
        notes: "Nessuna allergia, preferenza per l'olio monocultivar.",
        viaVoucher: true,
      });

    case "VOUCHER_BOOKING_CONFIRMED":
      return buildTastingConfirmedCustomerEmailContent({
        fullName: "Giulia Ferretti",
        slotStart: sampleSlotStart,
        slotEnd: sampleSlotEnd,
        tastingType: "Degustazione Intermedia",
        people: 2,
        children: 1,
      });

    case "VOUCHER_BOOKING_CANCELED":
      return buildTastingCanceledCustomerEmailContent({
        fullName: "Giulia Ferretti",
        slotStart: sampleSlotStart,
        slotEnd: sampleSlotEnd,
        tastingType: "Degustazione Intermedia",
        people: 2,
        children: 1,
        viaVoucher: true,
      });
  }
}

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return pageMetadata({
    title: "Anteprima email",
    description: "Anteprima dei template email transazionali, voucher e degustazioni.",
    path: "/developer/email-template/",
    locale,
    index: false,
    hreflang: false,
  });
}

export default async function DeveloperEmailTemplatePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const requested = Array.isArray(sp.template) ? sp.template[0] : sp.template;
  const active = TEMPLATES.find((item) => item.id === requested) ?? TEMPLATES[0];
  const preview = await buildPreview(active.id);

  const orderTemplates = TEMPLATES.filter((t) => t.group === "orders");
  const voucherTemplates = TEMPLATES.filter((t) => t.group === "vouchers");
  const htmlCode = preview.html ?? preview.attachment?.html ?? null;

  const renderNavLink = (item: TemplateDef, index: number) => (
    <Link
      key={item.id}
      href={`?template=${item.id}`}
      aria-current={item.id === active.id ? "page" : undefined}
      className={[
        "flex items-center gap-3 rounded-[5px] border px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700",
        item.id === active.id
          ? "border-stone-800 bg-stone-800 font-medium text-white"
          : "border-transparent text-stone-600 hover:border-stone-200 hover:bg-white",
      ].join(" ")}
    >
      <span aria-hidden="true" className="text-xs text-stone-400">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="leading-snug">{item.label}</span>
    </Link>
  );

  return (
    <main className="min-h-screen bg-[#f5f5f2] px-4 py-8 text-stone-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-8 border-b border-stone-200 pb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Delpasqua / Email</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Anteprima email</h1>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            I messaggi di ordini, voucher e degustazioni. Dati di esempio, nessun invio.
          </p>
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="space-y-6 lg:sticky lg:top-8">
            <div>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                Ordini e-commerce
              </h2>
              <nav aria-label="Template email ordini" className="grid gap-1.5">
                {orderTemplates.map((item, idx) => renderNavLink(item, idx))}
              </nav>
            </div>

            <div>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                Voucher e degustazioni
              </h2>
              <nav aria-label="Template email voucher e degustazioni" className="grid gap-1.5">
                {voucherTemplates.map((item, idx) => renderNavLink(item, orderTemplates.length + idx))}
              </nav>
            </div>

            <p className="hidden border-t border-stone-200 pt-4 text-xs leading-5 text-stone-400 lg:block">
              Seleziona un messaggio per visualizzare contenuto, trigger e allegati.
            </p>
          </aside>

          <section className="min-w-0" aria-label={active.label}>
            <div className="overflow-hidden rounded-[5px] border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-5 py-5 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{active.label}</h2>
                  <span className="text-[11px] text-stone-400">
                    {preview.html ? "Email HTML" : "Email solo testo + PDF"}
                  </span>
                </div>
                <dl className="mt-3 grid gap-1.5 text-sm leading-6 text-stone-600">
                  <div>
                    <dt className="inline mr-2 text-stone-400">Oggetto</dt>
                    <dd className="inline font-medium text-stone-800">{preview.subject}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-stone-500">
                    <div>
                      <dt className="inline mr-1.5 text-stone-400">Destinatario</dt>
                      <dd className="inline">{active.recipient}</dd>
                    </div>
                    <div>
                      <dt className="inline mr-1.5 text-stone-400">Trigger</dt>
                      <dd className="inline">{active.trigger}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              {preview.html ? (
                <EmailPreview html={preview.html} title={`Email: ${active.label}`} />
              ) : (
                <div className="bg-stone-50/70 px-5 py-6 sm:px-7">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Corpo email (testo semplice)
                  </p>
                  <pre className="whitespace-pre-wrap rounded-[5px] border border-stone-200 bg-white p-5 font-sans text-sm leading-7 text-stone-800">
                    {preview.text}
                  </pre>
                </div>
              )}

              {preview.attachment && (
                <div className="border-t border-stone-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-50 px-5 py-3.5 text-xs text-stone-600 sm:px-7">
                    <div>
                      <span className="mr-2 font-semibold text-stone-700">Allegato PDF</span>
                      <code className="rounded bg-stone-200/70 px-1.5 py-0.5 text-[11px] text-stone-800">
                        {preview.attachment.filename}
                      </code>
                    </div>
                    {preview.attachment.html && (
                      <span className="text-[11px] text-stone-400">Anteprima grafica del PDF allegato</span>
                    )}
                  </div>
                  {preview.attachment.html && (
                    <div className="border-t border-stone-200 bg-white p-4 sm:p-6">
                      <EmailPreview
                        html={preview.attachment.html}
                        title={`PDF allegato: ${preview.attachment.filename}`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
              <details className="py-4">
                <summary className="cursor-pointer text-sm font-medium text-stone-600">Versione testo</summary>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[5px] bg-white p-5 text-xs leading-6 text-stone-600">
                  {preview.text}
                </pre>
              </details>
              {htmlCode && (
                <details className="py-4">
                  <summary className="cursor-pointer text-sm font-medium text-stone-600">
                    {preview.html ? "Codice HTML" : "Codice HTML (PDF allegato)"}
                  </summary>
                  <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap break-all rounded-[5px] bg-stone-900 p-5 text-xs leading-6 text-stone-200">
                    {htmlCode}
                  </pre>
                </details>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
