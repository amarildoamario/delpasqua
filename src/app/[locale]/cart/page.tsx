import { pageMetadata } from "@/lib/seo";
import CartPageClient from "./CartPageClient";
import { cartStatusTemplates, labels, countries } from "./cartData";

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

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const statusTemplates = cartStatusTemplates[locale as keyof typeof cartStatusTemplates] ?? cartStatusTemplates.it;
  const shippingLabels = labels[locale as keyof typeof labels] ?? labels.it;
  const countryList = countries.map((c) => ({
    code: c.code,
    flag: c.flag,
    name: c.name[locale as keyof typeof c.name] ?? c.name.en,
  }));

  return (
    <CartPageClient 
      statusTemplates={statusTemplates}
      shippingLabels={shippingLabels}
      countryList={countryList}
    />
  );
}
