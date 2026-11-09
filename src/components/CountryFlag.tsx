import Image from "next/image";
import { Globe2 } from "lucide-react";
import { COUNTRY_FLAGS } from "@/lib/countryFlags";

const countryNames = new Intl.DisplayNames(["it"], { type: "region" });
export default function CountryFlag({ code }: { code: string }) {
  const normalized = code.trim().toUpperCase();
  if (!COUNTRY_FLAGS.has(normalized)) return <span title={normalized ? "Nazione non disponibile" : "Tutti i paesi"}><Globe2 className="inline-block h-4 w-5" aria-label={normalized ? "Nazione non disponibile" : "Tutti i paesi"} /></span>;
  const name = countryNames.of(normalized) ?? normalized;
  return <Image src={`/flags/${normalized.toLowerCase()}.svg`} width={24} height={18} alt={name} title={name} className="inline-block h-[18px] w-6 object-cover ring-1 ring-black/10" unoptimized />;
}
