// Persist only validated anonymous IDs. No tokens, referrer URL or raw fingerprint.
export function orderAnalyticsContext(req: Request) {
  const cookies = new Map((req.headers.get("cookie") ?? "").split(/;\s*/).map((entry) => {
    const index = entry.indexOf("=");
    try { return [entry.slice(0, index), decodeURIComponent(entry.slice(index + 1))] as const; }
    catch { return [entry.slice(0, index), ""] as const; }
  }));
  if (cookies.get("analytics_consent") === "0" || cookies.get("internal") === "1") return null;
  const visitorId = cookies.get("v_id"), sessionId = cookies.get("s_id");
  const valid = (value?: string) => !!value && /^[a-zA-Z0-9_-]{6,128}$/.test(value);
  if (!valid(visitorId) || !valid(sessionId)) return null;
  const host = new URL(req.url).hostname;
  return { visitorId: visitorId!, sessionId: sessionId!, env: ["delpasqua.com", "www.delpasqua.com"].includes(host) ? "prod" : "dev" };
}
