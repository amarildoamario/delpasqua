import { prisma } from "@/lib/server/prisma";
import SettingsForm from "./SettingsForm";
import PageHeader from "../_components/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rows = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;

  return (
    <div className="space-y-4">
      <PageHeader
  title="Impostazioni"
  subtitle="Config “light” in DB (key/value). Puoi aggiungere nuove chiavi quando vuoi."
/>
      

      <SettingsForm initial={map} />
    </div>
  );
}
