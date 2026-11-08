import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  buildTransactionalEmailPreview,
  PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES,
} from "@/lib/server/email";
import { pageMetadata } from "@/lib/seo";
import EmailPreview from "./EmailPreview";

const TEMPLATE_LABELS: Record<(typeof PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES)[number], string> = {
  ORDER_PAID: "Ordine ricevuto",
  ORDER_SHIPPED: "Ordine spedito",
  ORDER_REFUNDED: "Rimborso effettuato",
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return pageMetadata({
    title: "Anteprima email",
    description: "Anteprima dei template email transazionali.",
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
  const template = PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES.find((type) => type === requested) ?? "ORDER_PAID";
  const preview = buildTransactionalEmailPreview(template);

  return (
    <main className="min-h-screen bg-[#f5f5f2] px-4 py-8 text-stone-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-8 border-b border-stone-200 pb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Delpasqua / Email</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Anteprima email</h1>
          <p className="mt-3 text-sm leading-6 text-stone-500">I messaggi che accompagnano ogni ordine. Dati di esempio, nessun invio.</p>
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:sticky lg:top-8">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">Template disponibili</h2>
            <nav aria-label="Template email" className="grid gap-1.5">
              {PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES.map((type, index) => (
                <Link
                  key={type}
                  href={`?template=${type}`}
                  aria-current={type === template ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 rounded-[5px] border px-3.5 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700",
                    type === template
                      ? "border-stone-800 bg-stone-800 font-medium text-white"
                      : "border-transparent text-stone-600 hover:border-stone-200 hover:bg-white",
                  ].join(" ")}
                >
                  <span aria-hidden="true" className="text-xs text-stone-400">0{index + 1}</span>
                  {TEMPLATE_LABELS[type]}
                </Link>
              ))}
            </nav>
            <p className="mt-5 hidden border-t border-stone-200 pt-4 text-xs leading-5 text-stone-400 lg:block">Seleziona un messaggio per visualizzare il contenuto completo.</p>
          </aside>

          <section className="min-w-0" aria-label={TEMPLATE_LABELS[template]}>
            <div className="overflow-hidden rounded-[5px] border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-5 py-5 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{TEMPLATE_LABELS[template]}</h2>
                  <span className="text-[11px] text-stone-400">Anteprima del messaggio</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600"><span className="mr-2 text-stone-400">Oggetto</span>{preview.subject}</p>
              </div>
              <EmailPreview html={preview.html} title={`Email: ${TEMPLATE_LABELS[template]}`} />
              {template === "ORDER_PAID" && (
                <div className="border-t border-stone-200 px-5 py-4 text-xs text-stone-500 sm:px-7">
                  <span className="mr-2 font-medium text-stone-700">Allegato PDF</span>
                  ordine-DP-2026-0042.pdf
                </div>
              )}
            </div>

            <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
              <details className="py-4">
                <summary className="cursor-pointer text-sm font-medium text-stone-600">Versione testo</summary>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[5px] bg-white p-5 text-xs leading-6 text-stone-600">{preview.text}</pre>
              </details>
              <details className="py-4">
                <summary className="cursor-pointer text-sm font-medium text-stone-600">Codice HTML</summary>
                <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap break-all rounded-[5px] bg-stone-900 p-5 text-xs leading-6 text-stone-200">{preview.html}</pre>
              </details>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
