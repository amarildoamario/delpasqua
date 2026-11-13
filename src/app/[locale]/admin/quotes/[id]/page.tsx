import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import { QuoteInputSchema, quoteNumber } from "@/lib/server/quotes";
import { readCatalog } from "@/lib/server/catalog";
import QuoteEditor from "../QuoteEditor";

export const dynamic = "force-dynamic";
export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const quote = await prisma.quote.findUnique({ where: { id: (await params).id } });
  if (!quote) notFound();
  const input = QuoteInputSchema.parse({
    requestId: quote.requestId, fullName: quote.fullName, email: quote.email, phone: quote.phone,
    addressLine1: quote.addressLine1, addressLine2: quote.addressLine2, city: quote.city,
    postalCode: quote.postalCode, province: quote.province, countryCode: quote.countryCode,
    paymentTerms: quote.paymentTerms, shippingTerms: quote.shippingTerms, notes: quote.notes, validUntil: quote.validUntil.toISOString().slice(0, 10),
    items: (quote.items as Record<string, unknown>[]).map(({ productId, variantId, sku, title, variantLabel, qty, unitPriceCents }) => ({ productId, variantId, sku, title, variantLabel, qty, unitPriceCents })),
    discountCents: quote.discountCents, shippingCents: quote.shippingCents,
  });
  const catalog = await readCatalog();
  const options = catalog.filter((p) => p.isTestProduct !== true && p.isPublished !== false).flatMap((p) =>
    p.variants.map((v) => ({ productId: p.id, variantId: v.id, title: p.title || p.id, variantLabel: v.label || v.id, sku: v.sku || `${p.id}:${v.id}`, unitPriceCents: v.priceCents || 0 })));
  const downloads = await prisma.quoteEvent.count({ where: { quoteId: quote.id, type: "PDF_DOWNLOAD_REQUESTED" } });
  return <div className="mx-auto max-w-6xl space-y-4"><Link className="text-sm underline" href="/admin/quotes">Torna ai preventivi</Link>
    <QuoteEditor readOnly={databaseReadOnly} locked={!!quote.paidAt || !!quote.checkoutOrderId} options={options} validUntil={input.validUntil} vatRate={quote.vatRate} initial={{ ...input, id: quote.id, number: quoteNumber(quote) }} />
    <p className="text-xs text-neutral-500">PDF preparati su richiesta: {downloads}. Conteggio distinto dalla creazione del preventivo; non conferma il salvataggio sul dispositivo.</p>
  </div>;
}
