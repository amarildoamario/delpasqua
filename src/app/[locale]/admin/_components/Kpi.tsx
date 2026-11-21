import type { ReactNode } from "react";
import InfoTooltip from "./InfoTooltip";
import { METRIC_DESCRIPTIONS } from "./metricDescriptions";

const funnelBorder = "border-transparent bg-[linear-gradient(#fff,#fff),linear-gradient(120deg,#3b82f6,#ef4444)] [background-clip:padding-box,border-box] [background-origin:border-box]";
export const KPI_VALUE_CLASS = "text-base font-extrabold tabular-nums sm:text-xl";

export default function Kpi({ title, value, subtitle, description, funnel = false }: {
  title: string;
  value: ReactNode;
  subtitle?: string;
  description?: string;
  funnel?: boolean;
}) {
  return (
    <div className={`flex min-w-0 flex-col justify-between rounded-2xl border bg-white p-2.5 shadow-xs sm:p-3.5 ${funnel ? funnelBorder : "border-neutral-200"}`}>
      <div className="flex items-start justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-neutral-500 leading-tight">
        <span className={funnel && description ? undefined : "line-clamp-2"}>{title}</span>
        {(!funnel || description) && <InfoTooltip label={title} description={description ?? METRIC_DESCRIPTIONS[title] ?? subtitle ?? title} />}
      </div>
      <div className={`mt-1 truncate text-neutral-900 ${KPI_VALUE_CLASS}`}>{value}</div>
      {subtitle ? <div className="mt-0.5 text-[10px] sm:text-[11px] text-neutral-500 leading-tight line-clamp-2">{subtitle}</div> : null}
    </div>
  );
}
