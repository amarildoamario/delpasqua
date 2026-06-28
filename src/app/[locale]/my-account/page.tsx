import { setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return pageMetadata({
    title: isEn ? "My Account" : "Area clienti",
    description: isEn ? "Account utility page." : "Pagina tecnica dell'area clienti.",
    path: "/my-account/",
    locale,
    index: false,
    hreflang: false,
  });
}

async function MyAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <main className="min-h-[70vh] bg-zinc-50 px-6 py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          {isEn ? "Account" : "Area clienti"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
          {isEn ? "Customer account" : "Area clienti"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          {isEn
            ? "The customer account area is not active yet. You can continue shopping or contact us for order support."
            : "L'area account cliente non e ancora attiva. Puoi continuare lo shopping o contattarci per supporto sugli ordini."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            {isEn ? "Open shop" : "Vai allo shop"}
          </Link>
          <Link
            href="/contatti"
            className="inline-flex rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            {isEn ? "Contact us" : "Contattaci"}
          </Link>
        </div>
      </div>
    </main>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function MyAccountPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <MyAccountPage {...props} />;
}
