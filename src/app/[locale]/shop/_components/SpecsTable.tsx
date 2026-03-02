import React from "react";

type Specs = Record<string, string | undefined>;

function rowsFromSpecs(specs?: Specs) {
  if (!specs) return [];
  return Object.entries(specs)
    .filter(([, v]) => v != null && String(v).trim().length > 0)
    .map(([k, v]) => ({ k, v: String(v) }));
}

export function SpecsTable({
  title = "Dettagli",
  leftSpecs,
  rightSpecs,
}: {
  title?: string;
  leftSpecs?: Specs;   // es: variant specs (Weight, Dimensions)
  rightSpecs?: Specs;  // es: product specs (Harvest, Certification)
}) {
  const left = rowsFromSpecs(leftSpecs);
  const right = rowsFromSpecs(rightSpecs);

  // Merge mantenendo ordine "variant prima, poi product"
  const rows = [...left, ...right];

  if (rows.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
        {title}
      </h3>

      <div className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {rows.map((r) => (
          <div
            key={r.k}
            className="grid grid-cols-2 gap-4 px-4 py-3 text-sm"
          >
            <div className="text-neutral-700">{r.k}</div>
            <div className="text-right text-neutral-900">{r.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
