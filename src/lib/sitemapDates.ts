export function latestSitemapDate(...dates: unknown[]) {
  const times = dates.flatMap((date) => {
    if (typeof date !== "string" && !(date instanceof Date)) return [];
    const time = new Date(date).getTime();
    return Number.isFinite(time) ? [time] : [];
  });
  return times.length ? new Date(Math.max(...times)).toISOString().slice(0, 10) : undefined;
}
