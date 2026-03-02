import PageHeader from "@/app/[locale]/admin/_components/PageHeader";
import ProductsManagerForm from "./ProductsManagerForm";
import { readCatalog } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // IMPORTANT: read from filesystem at request-time (NOT a bundled JSON import)
  const catalog = await readCatalog();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Prodotti"
        subtitle={
          <>
            Gestione prodotti dal gestionale: modifica campi + varianti, aggiungi/rimuovi e salva.
          </>
        }
      />
      {/* @ts-expect-error Type discrepancy on specs */}
      <ProductsManagerForm initialCatalog={catalog} />
    </div>
  );
}