import { prisma } from "@/lib/server/prisma";
import SalesTable from "./sales-table";
import productsJson from "@/db/products.json";
import PageHeader from "../_components/PageHeader";


export const dynamic = "force-dynamic";

type ProductVariant = { id: string; label: string; priceCents: number };
type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  badge?: string;
  variants: ProductVariant[];
};

function minVariantPriceCents(p: Product) {
  return Math.min(...p.variants.map((v) => v.priceCents));
}

export default async function AdminSalesPage() {
  const products = productsJson as unknown as Product[];

  const merch = await prisma.productMerch.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const merchByKey = new Map(merch.map((m) => [m.productKey, m]));

  const rows = products.map((p) => {
    const m = merchByKey.get(p.id) ?? null; // usiamo product.id come chiave
    return {
      productKey: p.id,
      slug: p.slug,
      title: p.title,
      basePriceCents: minVariantPriceCents(p),
      merch: m
        ? {
            showInHome: m.showInHome,
            homeRank: m.homeRank,
            isBestSeller: m.isBestSeller,
            badge: m.badge ?? "",
            promoLabel: m.promoLabel ?? "",
            discountPercent: m.discountPercent ?? 0,
            discountCents: m.discountCents ?? 0,
            startsAt: m.startsAt ? m.startsAt.toISOString() : null,
            endsAt: m.endsAt ? m.endsAt.toISOString() : null,
          }
        : null,
    };
  });

  return (
    <div className="space-y-4">
      <PageHeader
  title="Merchandising"
  subtitle="Spingi prodotti con badge, “mostra in home”, priorità e sconti per-prodotto (programmabili con range date)."
/>
     

      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-6 py-5">
          <h2 className="text-base font-extrabold text-neutral-900">Prodotti</h2>
        </div>

        <SalesTable rows={rows} />
      </div>
    </div>
  );
}
