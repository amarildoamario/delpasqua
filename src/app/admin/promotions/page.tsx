import { prisma } from "@/lib/server/prisma";
import PromotionForm from "./promotion-form";
import PromotionsTable from "./promotions-table";
import PageHeader from "../_components/PageHeader";


export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const promos = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  // serializzo Date -> string per passarle al client component
  const rows = promos.map((p) => ({
    id: p.id,
    code: p.code,
    description: p.description,
    type: p.type,
    percent: p.percent,
    amountCents: p.amountCents,
    freeShipping: p.freeShipping,
    minOrderCents: p.minOrderCents,
    usageLimit: p.usageLimit,
    usedCount: p.usedCount,
    startsAt: p.startsAt ? p.startsAt.toISOString() : null,
    endsAt: p.endsAt ? p.endsAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    isActive: p.isActive,
  }));

  return (
    <div className="space-y-4">
      <PageHeader
  title="Promozioni"
  subtitle="Crea codici sconto programmabili (range date), con sconto percentuale/fisso e spedizione gratis."
  
  
/>
      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="px-6 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              
              
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
              Tip test Stripe: <b>99%</b> + <b>spedizione gratis</b> (totale &gt; 0).
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-neutral-200 px-6 py-5 dark:border-neutral-800">
          <PromotionForm />
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
            Codici esistenti
          </h2>
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {rows.length} totali
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800">
          <PromotionsTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
