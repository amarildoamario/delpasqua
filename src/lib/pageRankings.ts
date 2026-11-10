export type PageRanking = { path: string; views: number; totalMs: number | null; averageMs: number | null; longestMs: number | null; samples: number };
export type PageSort = "views" | "totalMs" | "averageMs" | "longestMs";
type ViewGroup = { path: string | null; _count: { path: number } };
type DurationGroup = { path: string | null; _sum: { durationMs: number | null }; _count: { durationMs: number }; _max: { durationMs: number | null } };
const normalize = (path: string) => path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";

export function summarizePageRankings(views: ViewGroup[], durations: DurationGroup[]): PageRanking[] {
  const pages = new Map<string, PageRanking>();
  const get = (path: string) => {
    const key = normalize(path);
    if (!pages.has(key)) pages.set(key, { path: key, views: 0, totalMs: null, averageMs: null, longestMs: null, samples: 0 });
    return pages.get(key)!;
  };
  for (const row of views) if (row.path) get(row.path).views += row._count.path;
  for (const row of durations) {
    if (!row.path || !row._count.durationMs) continue;
    const page = get(row.path);
    page.totalMs = (page.totalMs ?? 0) + (row._sum.durationMs ?? 0);
    page.samples += row._count.durationMs;
    if (row._max.durationMs !== null) page.longestMs = Math.max(page.longestMs ?? 0, row._max.durationMs);
  }
  for (const page of pages.values()) if (page.samples) page.averageMs = page.totalMs! / page.samples;
  return [...pages.values()];
}

export function rankPages(rows: PageRanking[], sort: PageSort, search = "") {
  return rows.filter((row) => row.path.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) =>
    (b[sort] ?? -1) - (a[sort] ?? -1) || b.views - a.views || a.path.localeCompare(b.path));
}

export function formatPageTime(ms: number | null) {
  if (ms === null) return "—";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
