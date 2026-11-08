export function normalizeTrafficCountry(value: unknown) {
  if (typeof value !== "string") return "ND";
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : "ND";
}

export function getAnalyticsCountryCode(data: unknown) {
  if (!data || typeof data !== "object") return "ND";
  const meta = (data as { meta?: unknown }).meta;
  if (!meta || typeof meta !== "object") return "ND";
  return normalizeTrafficCountry((meta as { countryCode?: unknown }).countryCode);
}

type TrafficEvent = {
  type: string;
  visitorId: string;
  sessionId: string;
  createdAt: Date;
  data: unknown;
};

export function summarizeTrafficGeography(events: TrafficEvent[]) {
  const visitors = new Map<string, string>();
  const sessions = new Map<string, string>();
  const pages = events.filter((event) => event.type === "page_view")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const assign = (map: Map<string, string>, id: string, country: string) => {
    if (!id) return;
    // Attribute each unique identity once, to its first known country in-period.
    // A later valid location may resolve an initially unknown location.
    if (!map.has(id) || map.get(id) === "ND") map.set(id, country);
  };
  for (const event of pages) {
    const country = getAnalyticsCountryCode(event.data);
    assign(visitors, event.visitorId, country);
    assign(sessions, event.sessionId, country);
  }
  const rows = (identities: Map<string, string>) => {
    const counts = new Map<string, number>();
    for (const country of identities.values()) counts.set(country, (counts.get(country) ?? 0) + 1);
    return [...counts].map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  };
  return {
    uniqueVisitorsCount: visitors.size,
    uniqueSessionsCount: sessions.size,
    visitorCountriesData: rows(visitors),
    sessionCountriesData: rows(sessions),
  };
}
