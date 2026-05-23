import { Link } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: locale === "en" ? "Checkout" : "Checkout",
    description: locale === "en" ? "Checkout utility page." : "Pagina utility checkout.",
    path: "/checkout/",
    locale,
    index: false,
    hreflang: false,
  });
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <main className="min-h-[70vh] bg-zinc-50 px-6 py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Checkout
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
          {isEn ? "Continue from your cart" : "Continua dal carrello"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          {isEn
            ? "The payment session is created from the cart after product and stock validation."
            : "La sessione di pagamento viene creata dal carrello dopo la validazione di prodotti e disponibilita."}
        </p>
        <Link
          href="/cart"
          className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          {isEn ? "Open cart" : "Apri carrello"}
        </Link>
      </div>
    </main>
  );
}
