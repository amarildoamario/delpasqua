import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FunnelChart } from "@/components/ui/charts";
import type { readCommercialFunnel } from "@/lib/server/commercialFunnel";

export default function CommercialFunnelCard({ funnel }: {
  funnel: Awaited<ReturnType<typeof readCommercialFunnel>>;
}) {
  const chartData = [
    { label: "Sessioni totali", value: funnel.sessions },
    { label: "Sessioni sullo shop", value: funnel.shop },
    { label: "Schede prodotto", value: funnel.product },
    { label: "Aggiunta al carrello", value: funnel.cart },
    { label: "Checkout Stripe", value: funnel.checkout },
    { label: "Acquisto sullo shop", value: funnel.purchase },
  ];

  return (
    <Card role="region" aria-labelledby="commercial-funnel-title" className="rounded-2xl border-neutral-200 bg-white">
      <CardHeader className="p-4 sm:px-6 sm:pt-5 sm:pb-4">
        <h2 id="commercial-funnel-title" className="text-base font-bold text-neutral-900">Funnel commerciale</h2>
        <p className="text-sm text-neutral-600">
          {funnel.sessions === 0
            ? "Nessuna sessione nel periodo selezionato"
            : `${new Intl.NumberFormat("it-IT").format(funnel.sessions)} ${funnel.sessions === 1 ? "sessione complessiva" : "sessioni complessive"} · coorte del sito`}
        </p>
      </CardHeader>
      <CardContent className="px-4 pt-2 pb-3 sm:px-6">
        <FunnelChart ariaLabel="Stadi del funnel commerciale" color="var(--chart-1)" data={chartData} />
      </CardContent>
      <CardFooter className="border-t border-neutral-100 px-4 py-3 text-xs text-neutral-600 sm:px-6">
        <p>Le aggiunte dirette dall’elenco prodotti possono saltare la scheda prodotto. Le percentuali si riferiscono alle sessioni totali del sito.</p>
      </CardFooter>
    </Card>
  );
}
