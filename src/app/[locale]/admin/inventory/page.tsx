import productsRaw from "@/db/products.json";
import PageHeader from "@/app/[locale]/admin/_components/PageHeader";
import { prisma } from "@/lib/server/prisma";
import InventoryManager from "./InventoryManager";

export const dynamic = "force-dynamic";

type CatalogProduct = {
  id: string;
  title?: string;
  category?: string;
  variants: {
    id: string;
    label?: string;
    priceCents?: number;
    sku?: string;
  }[];
};

function makeSku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export default async function AdminInventoryPage() {
  const catalog = productsRaw as CatalogProduct[];
  const skus: string[] = [];
  for (const p of catalog) {
    for (const v of p.variants || []) {
      if (!p?.id || !v?.id) continue;
      skus.push(makeSku(p.id, v.id));
    }
  }

  const rows = await prisma.inventoryItem.findMany({
    where: { sku: { in: skus } },
    select: { sku: true, stock: true, updatedAt: true },
  });

  const map: Record<string, { stock: number; updatedAt: string }> = {};
  for (const r of rows) {
    map[r.sku] = {
      stock: r.stock,
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Magazzino"
        subtitle={
          <>
            Gestisci le scorte per ogni variante (SKU interno: <code>productId:variantId</code>). <br />
            Bottoni rapidi: <b>Rimuovi scorte</b> (−1) e <b>Setta disponibili a 50</b>.
          </>
        }
      />

      <InventoryManager initialCatalog={catalog} initialInventory={map} />
    </div>
  );
}