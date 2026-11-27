import type { CSSProperties } from "react";
import styles from "./funnel-chart.module.css";

export type FunnelStage = {
  label: string;
  value: number;
  displayValue?: string;
};

const number = new Intl.NumberFormat("it-IT");
const percent = new Intl.NumberFormat("it-IT", {
  style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function FunnelChart({ ariaLabel, color, data, layers = 3 }: {
  ariaLabel: string;
  color: string;
  data: readonly FunnelStage[];
  layers?: number;
}) {
  const baseline = data[0]?.value ?? 0;
  const shares = data.map(({ value }) => baseline > 0 ? value / baseline : 0);
  const extents = shares.map((share) => share > 0 ? 10 + 90 * Math.sqrt(Math.min(1, share)) : 0);

  return (
    <ol
      role="list"
      aria-label={ariaLabel}
      className={styles.chart}
      style={{ "--funnel-color": color, "--funnel-stages": data.length } as CSSProperties}
    >
      {data.map(({ label, value, displayValue }, index) => (
        <li key={label} className={styles.stage} style={{
          "--funnel-start": `${extents[index]}%`,
          "--funnel-end": `${extents[index + 1] ?? extents[index]}%`,
        } as CSSProperties}>
          <div className={styles.plot} aria-hidden="true" data-empty={value === 0 || undefined}>
            <span className={styles.segment} />
            {value > 0 && Array.from({ length: layers }, (_, layer) => (
              <span key={layer} className={styles.halo} style={{ "--halo-index": layer } as CSSProperties} />
            ))}
            <span className={styles.rim} />
          </div>
          <div className={styles.caption}>
            <span className="block text-xs font-semibold leading-snug text-neutral-700">{label}</span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <strong className="text-xl leading-none font-extrabold text-neutral-950 tabular-nums">{displayValue ?? number.format(value)}</strong>
              <span className="text-xs font-medium text-neutral-600 tabular-nums">{percent.format(shares[index])}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
