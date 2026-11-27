"use client";

import { useId, useState } from "react";
import { worldCountries } from "./data/world-countries";
import MapViewport from "./MapViewport";

const number = new Intl.NumberFormat("it-IT");
const muted = "#e6ebef";
const colors = ["#c4e0fc", "#83baf0", "#427dc4", "#184b87"];
const countries = worldCountries.map(([code, name, path, point]) => ({
  code, name, path, point,
}));
const countryByCode = new Map(countries.map((country) => [country.code, country]));

function visitorLabel(count: number) {
  return `${number.format(count)} ${count === 1 ? "visitatore unico" : "visitatori unici"}`;
}

export default function ChoroplethChart({ visitors }: { visitors: readonly { label: string; value: number }[] }) {
  const selectorId = useId();
  const [hovered, setHovered] = useState("");
  const [selected, setSelected] = useState("");
  const counts = new Map(visitors.map(({ label, value }) => [label, value]));
  const mapped = visitors.filter(({ label, value }) => value > 0 && countryByCode.has(label));
  const max = mapped.reduce((highest, { value }) => Math.max(highest, value), 0);
  const low = Math.max(2, Math.round(max ** 0.25));
  const medium = Math.max(low + 1, Math.round(max ** 0.5));
  const high = Math.max(medium + 1, Math.round(max ** 0.75));
  const starts = [1, low, medium, high];
  const active = countryByCode.get(hovered || selected);
  const selectedCountry = countryByCode.get(selected);
  const unknown = counts.get("ND") ?? 0;
  const unmapped = visitors.reduce((total, { label, value }) =>
    label !== "ND" && !countryByCode.has(label) ? total + value : total, 0);
  const knownCountries = visitors.filter(({ label, value }) => label !== "ND" && value > 0).length;
  const total = visitors.reduce((sum, { value }) => sum + value, 0);

  function countryColor(code: string) {
    const count = counts.get(code) ?? 0;
    const tier = starts.findLastIndex((minimum) => count >= minimum);
    return tier < 0 ? muted : colors[tier];
  }

  return (
    <>
      <MapViewport tooltip={active && (
        <div
          aria-hidden="true"
          data-country-tooltip
          className="pointer-events-none absolute top-2 right-2 w-max max-w-[48%] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm sm:top-3 sm:right-3"
        >
          <strong className="block text-slate-900">{active.name}</strong>
          <span className="tabular-nums">{visitorLabel(counts.get(active.code) ?? 0)}</span>
        </div>
      )}>
          {countries.map(({ code, path }) => (
            <path
              key={code}
              data-country={code}
              fill={countryColor(code)}
              fillRule="evenodd"
              stroke="#f8fafc"
              strokeWidth="0.65"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              d={path}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(code); }}
              onPointerLeave={() => setHovered("")}
              onClick={() => setSelected(code)}
            />
          ))}
          {countries.map(({ code, point }) => point && (counts.get(code) ?? 0) > 0 ? (
            <circle
              key={code}
              cx={point[0]}
              cy={point[1]}
              r="2.9"
              fill={countryColor(code)}
              stroke="#f8fafc"
              strokeWidth="0.7"
              onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(code); }}
              onPointerLeave={() => setHovered("")}
              onClick={() => setSelected(code)}
            />
          ) : null)}
          {active && (
            <g pointerEvents="none" fill="none" stroke="#0f2d53">
              <path d={active.path} strokeWidth="1.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {active.point && <circle cx={active.point[0]} cy={active.point[1]} r="4" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />}
            </g>
          )}
      </MapViewport>

      <ul aria-label="Fasce dei visitatori" role="list" className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-neutral-700">
        <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-3 rounded-sm" style={{ background: muted }} />0</li>
        {starts.map((min, index) => {
          const upper = starts[index + 1] - 1;
          const label = index === starts.length - 1 ? `≥ ${number.format(min)}`
            : min === upper ? number.format(min) : `${number.format(min)}–${number.format(upper)}`;
          return <li key={min} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-sm" style={{ background: colors[index] }} />{label}
          </li>;
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
        <label htmlFor={selectorId} className="text-xs font-semibold text-neutral-700">
          Esplora un paese
          <select
            id={selectorId}
            value={selected}
            onChange={(event) => { setHovered(""); setSelected(event.target.value); }}
            className="mt-1 block w-full max-w-64 rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-sm text-neutral-900"
          >
            <option value="">Seleziona un paese</option>
            {countries.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <p aria-live="polite" className="pb-1 text-sm text-neutral-700">
          {selectedCountry && <><strong>{selectedCountry.name}</strong> · {visitorLabel(counts.get(selected) ?? 0)}</>}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
        <p><strong className="text-neutral-900">{visitorLabel(total)}</strong> · {number.format(knownCountries)} {knownCountries === 1 ? "paese" : "paesi"}</p>
        {unknown > 0 && <p>Paese non attribuito · {number.format(unknown)}</p>}
        {unmapped > 0 && <p>Paese fuori mappa · {number.format(unmapped)}</p>}
      </div>
    </>
  );
}
