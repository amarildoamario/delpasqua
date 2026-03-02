"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function isValidDate(d: Date) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

function lastDayOfMonth(year: number, month1to12: number) {
  // month1to12: 1..12
  return new Date(year, month1to12, 0).getDate(); // day 0 of next month
}

function setQueryParams(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: URLSearchParams,
  updates: Record<string, string | null>
) {
  const next = new URLSearchParams(searchParams.toString());
  for (const [k, v] of Object.entries(updates)) {
    if (v === null) next.delete(k);
    else next.set(k, v);
  }
  router.push(`${pathname}?${next.toString()}`);
}

function isFirstDay(d: Date) {
  return d.getDate() === 1;
}

function isLastDayOfThisMonth(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return d.getDate() === lastDayOfMonth(y, m);
}

export default function RangePicker({
  startISO,
  endISO,
}: {
  startISO: string;
  endISO: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const startDate = useMemo(() => new Date(`${startISO}T00:00:00`), [startISO]);
  const endDate = useMemo(() => new Date(`${endISO}T00:00:00`), [endISO]);

  // valori "derivati" (niente setState in useEffect)
  const year = isValidDate(startDate) ? startDate.getFullYear() : new Date().getFullYear();
  const monthValue = isValidDate(startDate) ? `${year}-${pad2(startDate.getMonth() + 1)}` : `${year}-01`;

  const { quarter, semester } = useMemo(() => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) return { quarter: "", semester: "" };

    // mese completo?
    const sameMonth =
      startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth();

    if (sameMonth && isFirstDay(startDate) && isLastDayOfThisMonth(endDate)) {
      // lascia come "mese" (quarter/semester vuoti)
      return { quarter: "", semester: "" };
    }

    // trimestre o semestre completi?
    if (isFirstDay(startDate) && isLastDayOfThisMonth(endDate) && startDate.getFullYear() === endDate.getFullYear()) {
      const sm = startDate.getMonth() + 1; // 1..12
      const em = endDate.getMonth() + 1;

      // trimestre
      const isQuarterStart = [1, 4, 7, 10].includes(sm);
      if (isQuarterStart && em === sm + 2) {
        const q = String((sm - 1) / 3 + 1) as "1" | "2" | "3" | "4";
        return { quarter: (`Q${q}` as const), semester: "" };
      }

      // semestre
      if ((sm === 1 && em === 6) || (sm === 7 && em === 12)) {
        return { quarter: "", semester: sm === 1 ? "H1" : "H2" };
      }
    }

    return { quarter: "", semester: "" };
  }, [startDate, endDate]);

  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y, y - 1, y - 2, y - 3, y - 4];
  }, []);

  function applyRange(start: Date, end: Date) {
    if (!isValidDate(start) || !isValidDate(end)) return;

    // se l’utente inverte le date, le riordiniamo
    const s = start.getTime() <= end.getTime() ? start : end;
    const e = start.getTime() <= end.getTime() ? end : start;

    setQueryParams(router, pathname, sp, {
      start: isoDate(s),
      end: isoDate(e),
    });
  }

  function onChangeStart(v: string) {
    const s = new Date(`${v}T00:00:00`);
    applyRange(s, endDate);
  }

  function onChangeEnd(v: string) {
    const e = new Date(`${v}T00:00:00`);
    applyRange(startDate, e);
  }

  function onSelectMonth(v: string) {
    if (!v || !/^\d{4}-\d{2}$/.test(v)) return;
    const [yy, mm] = v.split("-").map(Number);
    if (!yy || !mm) return;

    const start = new Date(yy, mm - 1, 1);
    const end = new Date(yy, mm - 1, lastDayOfMonth(yy, mm));
    applyRange(start, end);
  }

  function onSelectQuarter(v: string) {
    if (!v) return;
    const q = Number(v.replace("Q", ""));
    if (![1, 2, 3, 4].includes(q)) return;

    const startMonth = (q - 1) * 3 + 1;
    const endMonth = startMonth + 2;

    const start = new Date(year, startMonth - 1, 1);
    const end = new Date(year, endMonth - 1, lastDayOfMonth(year, endMonth));
    applyRange(start, end);
  }

  function onSelectSemester(v: string) {
    if (!v) return;

    const startMonth = v === "H1" ? 1 : v === "H2" ? 7 : 0;
    const endMonth = v === "H1" ? 6 : v === "H2" ? 12 : 0;
    if (!startMonth || !endMonth) return;

    const start = new Date(year, startMonth - 1, 1);
    const end = new Date(year, endMonth - 1, lastDayOfMonth(year, endMonth));
    applyRange(start, end);
  }

  function onYearChange(v: string) {
    const yy = Number(v);
    if (!yy || !isValidDate(startDate) || !isValidDate(endDate)) return;

    // Mantieni "modalità" corrente: semestre > trimestre > mese
    if (semester) {
      const startMonth = semester === "H1" ? 1 : 7;
      const endMonth = semester === "H1" ? 6 : 12;

      const start = new Date(yy, startMonth - 1, 1);
      const end = new Date(yy, endMonth - 1, lastDayOfMonth(yy, endMonth));
      return applyRange(start, end);
    }

    if (quarter) {
      const q = Number(quarter.replace("Q", ""));
      if (![1, 2, 3, 4].includes(q)) return;

      const startMonth = (q - 1) * 3 + 1;
      const endMonth = startMonth + 2;

      const start = new Date(yy, startMonth - 1, 1);
      const end = new Date(yy, endMonth - 1, lastDayOfMonth(yy, endMonth));
      return applyRange(start, end);
    }

    // default: stesso mese (intero)
    const mm = startDate.getMonth() + 1;
    const start = new Date(yy, mm - 1, 1);
    const end = new Date(yy, mm - 1, lastDayOfMonth(yy, mm));
    return applyRange(start, end);
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-neutral-500">Da</label>
          <input
            type="date"
            value={startISO}
            onChange={(e) => onChangeStart(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-neutral-500">A</label>
          <input
            type="date"
            value={endISO}
            onChange={(e) => onChangeEnd(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div className="hidden h-10 w-px bg-neutral-200 sm:block" />

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-neutral-500">Mese</label>
          <input
            type="month"
            value={monthValue}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-neutral-500">Anno</label>
          <select
            value={String(year)}
            onChange={(e) => onYearChange(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
          >
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-neutral-500">Trimestre</label>
          <select
            value={quarter}
            onChange={(e) => onSelectQuarter(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
          >
            <option value="">—</option>
            <option value="Q1">Q1 (Gen–Mar)</option>
            <option value="Q2">Q2 (Apr–Giu)</option>
            <option value="Q3">Q3 (Lug–Set)</option>
            <option value="Q4">Q4 (Ott–Dic)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-neutral-500">Semestre</label>
          <select
            value={semester}
            onChange={(e) => onSelectSemester(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
          >
            <option value="">—</option>
            <option value="H1">H1 (Gen–Giu)</option>
            <option value="H2">H2 (Lug–Dic)</option>
          </select>
        </div>
      </div>

      <div className="mt-3 text-xs text-neutral-500">
        Mese / trimestre / semestre aggiornano automaticamente il range delle date.
      </div>
    </div>
  );
}
