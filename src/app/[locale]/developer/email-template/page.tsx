import { setRequestLocale } from 'next-intl/server';
import Link from "next/link";
import {
  buildTransactionalEmailPreview,
  PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES,
} from "@/lib/server/email";
import { pageMetadata } from "@/lib/seo";

const TEMPLATE_LABELS: Record<(typeof PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES)[number], string> = {
  ORDER_PAID: "Ordine pagato",
  ORDER_SHIPPED: "Ordine spedito",
  ORDER_REFUNDED: "Ordine rimborsato",
};

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return pageMetadata({
    title: "Developer Email Template Preview",
    description: "Preview locale dei template email transazionali.",
    path: "/developer/email-template/",
    locale,
    index: false,
    hreflang: false,
  });
}

async function DeveloperEmailTemplatePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const requested = getOne(sp.template);
  const template = PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES.includes(
    requested as (typeof PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES)[number]
  )
    ? (requested as (typeof PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES)[number])
    : "ORDER_PAID";

  const preview = buildTransactionalEmailPreview(template);

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Developer
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Email template preview</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
            Questa pagina usa i template reali del backend. Se modifichi gli stili o il contenuto in
            <code className="mx-1 rounded bg-stone-200 px-1.5 py-0.5 text-[13px]">src/lib/server/email.ts</code>
            qui vedi subito il risultato.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-stone-900">Template</h2>
            <nav className="mt-4 grid gap-2">
              {PREVIEWABLE_TRANSACTIONAL_EMAIL_TYPES.map((type) => {
                const active = type === template;
                return (
                  <Link
                    key={type}
                    href={`/developer/email-template?template=${type}`}
                    className={[
                      "rounded-2xl border px-4 py-3 text-sm transition",
                      active
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
                    ].join(" ")}
                  >
                    <div className="font-medium">{TEMPLATE_LABELS[type]}</div>
                    <div className={active ? "mt-1 text-xs text-stone-300" : "mt-1 text-xs text-stone-500"}>
                      {type}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="grid gap-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {TEMPLATE_LABELS[template]}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                  {template}
                </span>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Subject</div>
                  <p className="mt-2 text-sm font-medium text-stone-900">{preview.subject}</p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Note</div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Il CTA ordine e stato rimosso. La preview mostra il contenuto reale inviato via email.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">Render HTML</h2>
                  <p className="text-sm text-stone-500">Anteprima visiva del template email.</p>
                </div>
                <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-500">
                  600px email container
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 p-3">
                <iframe
                  title={`Preview ${template}`}
                  srcDoc={preview.html}
                  className="min-h-[1100px] w-full rounded-2xl border border-stone-200 bg-white"
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-900">Versione testo</h2>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-stone-950 p-4 text-sm leading-6 text-stone-100">
                  {preview.text}
                </pre>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-900">HTML sorgente</h2>
                <pre className="mt-4 max-h-[560px] overflow-auto rounded-2xl bg-stone-950 p-4 text-xs leading-6 text-stone-100">
                  {preview.html}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function DeveloperEmailTemplatePageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <DeveloperEmailTemplatePage {...props} />;
}
