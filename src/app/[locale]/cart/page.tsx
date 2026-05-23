import { pageMetadata } from "@/lib/seo";
import CartPageClient from "./CartPageClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: locale === "en" ? "Cart" : "Carrello",
    description: locale === "en" ? "Your Del Pasqua cart." : "Il tuo carrello Del Pasqua.",
    path: locale === "it" ? "/carrello/" : "/cart/",
    locale,
    index: false,
    hreflang: false,
  });
}

export default function CartPage() {
  return <CartPageClient />;
}
