"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { worldMapSize } from "./data/world-countries";

const { width } = worldMapSize;
const height = width * 9 / 16;
const mapInsetY = (height - worldMapSize.height) / 2;
const center = { x: width / 2, y: height / 2 };
const home = { x: 0, y: 0, scale: 1 };
const maxScale = 8;
const zoomStep = 1.5;
const buttonClass = "grid size-9 place-items-center text-slate-700 hover:bg-slate-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-blue-700 disabled:text-slate-300";
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

type Point = { x: number; y: number };
type View = Point & { scale: number };

function svgPoint(svg: SVGSVGElement, screen: Point): Point {
  const rect = svg.getBoundingClientRect();
  return { x: (screen.x - rect.left) * width / rect.width, y: (screen.y - rect.top) * height / rect.height };
}

function zoomAt(view: View, scale: number, from: Point, to = from): View {
  const next = clamp(scale, home.scale, maxScale);
  const ratio = next / view.scale;
  return { scale: next, x: to.x - (from.x - view.x) * ratio, y: to.y - (from.y - view.y) * ratio };
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export default function MapViewport({ children, tooltip }: { children: ReactNode; tooltip: ReactNode }) {
  const hint = useId();
  const svg = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const moved = useRef(false);
  const current = useRef<View>(home);
  const [view, setView] = useState<View>(home);
  const [dragging, setDragging] = useState(false);
  const commit = useCallback((next: View) => {
    const marginX = width * 0.08;
    const marginY = height * 0.08;
    const bounded = {
      scale: next.scale,
      x: clamp(next.x, width * (1 - next.scale) - marginX, marginX),
      y: clamp(next.y, height * (1 - next.scale) - marginY, marginY),
    };
    current.current = bounded;
    setView(bounded);
  }, []);

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const before = current.current;
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 120 : 1;
      const factor = Math.exp(-clamp(event.deltaY * units, -250, 250) * 0.0025);
      const point = svgPoint(element, { x: event.clientX, y: event.clientY });
      const next = zoomAt(before, before.scale * factor, point);
      if (next.scale === before.scale) return;
      commit(next);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [commit]);

  function move(event: PointerEvent<SVGSVGElement>) {
    const tracked = pointers.current;
    const previous = tracked.get(event.pointerId);
    if (!previous) return;
    if (event.pointerType === "touch" && tracked.size === 1 && current.current.scale === home.scale) return;
    const next = { x: event.clientX, y: event.clientY };
    const distance = Math.hypot(next.x - previous.x, next.y - previous.y);
    if (tracked.size === 1 && !moved.current && distance < 4) return;
    const element = event.currentTarget;
    if (!moved.current) {
      moved.current = true;
      setDragging(true);
      for (const id of tracked.keys()) element.setPointerCapture(id);
    }

    const before = current.current;
    const other = [...tracked].find(([id]) => id !== event.pointerId)?.[1];
    if (other) {
      const oldGap = Math.hypot(other.x - previous.x, other.y - previous.y);
      const newGap = Math.hypot(other.x - next.x, other.y - next.y);
      const from = svgPoint(element, midpoint(previous, other));
      const to = svgPoint(element, midpoint(next, other));
      commit(zoomAt(before, before.scale * newGap / Math.max(1, oldGap), from, to));
    } else {
      const from = svgPoint(element, previous);
      const to = svgPoint(element, next);
      commit({ ...before, x: before.x + to.x - from.x, y: before.y + to.y - from.y });
    }
    tracked.set(event.pointerId, next);
  }

  function finish(event: PointerEvent<SVGSVGElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0) setDragging(false);
  }

  return (
    <>
      <div className="relative mx-auto w-full max-w-[88.89svh] overflow-hidden">
        <svg
          ref={svg}
          role="img"
          aria-label="Mappa mondiale dei visitatori unici per paese"
          aria-describedby={hint}
          tabIndex={0}
          viewBox={`0 0 ${width} ${height}`}
          className={`block h-auto w-full select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 ${view.scale === 1 ? "touch-pan-y" : "touch-none"} ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          onDoubleClick={(event) => {
            const before = current.current;
            const point = svgPoint(event.currentTarget, { x: event.clientX, y: event.clientY });
            commit(zoomAt(before, before.scale * zoomStep, point));
          }}
          onPointerDown={(event) => {
            if (event.button !== 0 || pointers.current.size >= 2) return;
            if (!pointers.current.size) moved.current = false;
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            if (moved.current) event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={move}
          onPointerUp={finish}
          onPointerCancel={finish}
          onLostPointerCapture={(event) => { if (event.target === event.currentTarget) finish(event); }}
          onPointerLeave={(event) => { if (!moved.current) finish(event); }}
          onClickCapture={(event) => { if (moved.current) event.stopPropagation(); }}
          onKeyDown={(event) => {
            const before = current.current;
            const step = 40;
            switch (event.key) {
              case "+": case "=": commit(zoomAt(before, before.scale * zoomStep, center)); break;
              case "-": commit(zoomAt(before, before.scale / zoomStep, center)); break;
              case "ArrowLeft": commit({ ...before, x: before.x - step }); break;
              case "ArrowRight": commit({ ...before, x: before.x + step }); break;
              case "ArrowUp": commit({ ...before, y: before.y - step }); break;
              case "ArrowDown": commit({ ...before, y: before.y + step }); break;
              case "Home": case "Escape": commit(home); break;
              default: return;
            }
            event.preventDefault();
          }}
        >
          <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
            <g transform={`translate(0 ${mapInsetY})`}>{children}</g>
          </g>
        </svg>

        <div role="group" aria-label="Comandi della mappa" className="absolute top-2 left-2 flex divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm sm:top-3 sm:left-3">
          <button type="button" className={buttonClass} aria-label="Ingrandisci mappa" disabled={view.scale >= maxScale}
            onClick={() => commit(zoomAt(view, view.scale * zoomStep, center))}><Plus size={16} aria-hidden="true" /></button>
          <button type="button" className={buttonClass} aria-label="Riduci mappa" disabled={view.scale <= home.scale}
            onClick={() => commit(zoomAt(view, view.scale / zoomStep, center))}><Minus size={16} aria-hidden="true" /></button>
          <button type="button" className={buttonClass} aria-label="Ripristina vista mappa" disabled={view.scale === 1 && view.x === 0 && view.y === 0}
            onClick={() => commit(home)}><RotateCcw size={14} aria-hidden="true" /></button>
        </div>
        {!dragging && tooltip}
      </div>
      <p id={hint} className="mt-2 text-xs text-neutral-600">
        Trascina per spostarti. Usa la rotella, due dita o i pulsanti per ingrandire.
        <span className="sr-only"> Da tastiera usa le frecce, più, meno e Home per ripristinare.</span>
      </p>
    </>
  );
}
