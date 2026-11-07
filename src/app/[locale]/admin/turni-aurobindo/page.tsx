import PageHeader from "@/app/[locale]/admin/_components/PageHeader";
import TurniAurobindoManager from "./TurniAurobindoManager";

export const dynamic = "force-dynamic";

export default function TurniAurobindoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Turni Aurobindo"
        subtitle="Pianificazione rapida dei turni di lavoro e calcolo del tempo di trasporto (Auto-Fill Lunedì-Venerdì)."
      />

      <TurniAurobindoManager />
    </div>
  );
}
