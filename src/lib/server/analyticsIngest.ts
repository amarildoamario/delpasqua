import { randomUUID } from "node:crypto";
import type { z } from "zod";
import { analyticsPath, isAdminPath } from "@/lib/analytics/events";
import type { AnalyticsEventSchema } from "@/lib/server/schemas";
import { normalizeTrafficCountry } from "@/lib/server/trafficGeography";
import { acquisitionSource } from "@/lib/analytics/acquisition";
import { hasAnalyticsExclusion } from "@/lib/analytics/exclusion";

type IncomingEvent = z.infer<typeof AnalyticsEventSchema>;
type Writer = { $executeRaw: (sql: TemplateStringsArray, ...values: unknown[]) => Promise<number> };
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const windows = new Map<string, { count: number; until: number }>();

// No database-backed limiter: that would consume a query even for rejected traffic.
// This is an instance-local abuse guard, not a global spending cap.
export function allowAnalyticsRequest(key: string, now = Date.now()) {
  const current = windows.get(key);
  if (current && current.until > now) return ++current.count <= 60;
  if (windows.size >= 2000) {
    for (const [id, entry] of windows) if (entry.until <= now) windows.delete(id);
    if (windows.size >= 2000) return false;
  }
  windows.set(key, { count: 1, until: now + 60_000 });
  return true;
}

function deviceFromUA(ua: string) {
  if (/bot|spider|crawl|headless|playwright|puppeteer|simuser\//i.test(ua)) return "bot";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

export function prepareAnalyticsEvents(events: IncomingEvent[], req: Request, now = Date.now()) {
  if (hasAnalyticsExclusion(req.headers.get("cookie") ?? "")) return [];
  const ua = req.headers.get("user-agent") ?? "";
  const device = deviceFromUA(ua);
  if (device === "bot") return [];
  const host = new URL(req.url).hostname;
  const isProductionHost = host === "delpasqua.com" || host === "www.delpasqua.com";
  const countryCode = normalizeTrafficCountry(req.headers.get("x-vercel-ip-country"));
  const unique = new Map<string, Record<string, unknown>>();
  for (const event of events) {
    const path = analyticsPath(event.path ?? "/");
    if (isAdminPath(path) || event.productKey === "prodotto-test") continue;
    if (event.isInternal || (isProductionHost && event.env && event.env !== "prod")) continue;
    const createdAt = event.occurredAt ? Date.parse(event.occurredAt) : now;
    if (!Number.isFinite(createdAt) || createdAt < now - MAX_AGE_MS || createdAt > now + 60_000) continue;
    const env = isProductionHost ? "prod" : "dev";
    const data: Record<string, unknown> = {};
    const source = event.data && typeof event.data === "object" ? event.data as Record<string, unknown> : {};
    for (const key of ["qty", "unitPriceCents", "totalCents", "itemsCount", "fromQty", "toQty", "delta", "resultsCount"]) {
      if (typeof source[key] === "number" && Number.isFinite(source[key])) data[key] = source[key];
    }
    data.meta = { source: "web", trafficType: "real", env, isInternal: false, device, countryCode, acquisition: acquisitionSource(ua, event.referrer) };
    const id = event.type === "purchase" ? `ana-purchase-${event.orderId ?? "missing"}` :
      event.type === "checkout_canceled" && event.orderId ? `ana-cancel-${event.orderId}` :
      event.type === "page_leave" && event.pageId ? `ana-leave-${event.visitorId}-${event.pageId}` :
      `ana-${event.eventId ?? randomUUID()}`;
    unique.set(id, {
      id, createdAt: new Date(Math.min(createdAt, now)).toISOString(), type: event.type,
      visitorId: event.visitorId, sessionId: event.sessionId, path,
      referrer: event.referrer ? analyticsPath(event.referrer) : null,
      pageId: event.pageId ?? null,
      durationMs: event.type === "page_leave" ? Math.min(event.durationMs ?? 0, 20 * 60_000) : null,
      productKey: event.productKey ?? null, variantKey: event.variantKey ?? null,
      cartId: event.cartId ?? null, orderId: event.orderId ?? null,
      device, env, isInternal: !isProductionHost, data,
    });
  }
  return [...unique.values()];
}

export async function saveAnalyticsBatch(db: Writer, events: IncomingEvent[], req: Request, now = Date.now()) {
  const rows = prepareAnalyticsEvents(events, req, now);
  if (!rows.length) return 0;
  // Exactly one parameterized SQL statement per nonempty batch. Existing primary
  // keys deduplicate retries; no read-before-write and no schema migration needed.
  // Purchases must reference a paid commercial order, checked inside the same query.
  return db.$executeRaw`
    WITH incoming AS (
      SELECT * FROM jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) AS e(
        id text, "createdAt" timestamp, type text, "visitorId" text, "sessionId" text,
        path text, referrer text, "pageId" text, "durationMs" integer,
        "productKey" text, "variantKey" text, "cartId" text, "orderId" text,
        device text, env text, "isInternal" boolean, data jsonb
      )
    )
    INSERT INTO "AnalyticsEvent" AS existing (
      id, "createdAt", type, "visitorId", "sessionId", path, referrer, "pageId",
      "durationMs", "productKey", "variantKey", "cartId", "orderId", device, env, "isInternal", data
    )
    SELECT e.id, CASE WHEN e.type = 'purchase' THEN o."paidAt" ELSE e."createdAt" END,
      e.type, e."visitorId", e."sessionId", e.path, e.referrer, e."pageId",
      e."durationMs", e."productKey", e."variantKey", e."cartId", e."orderId",
      e.device, e.env, e."isInternal", e.data
    FROM incoming e
    LEFT JOIN "Order" o ON e.type IN ('purchase', 'checkout_canceled') AND o.id = e."orderId"
    WHERE NOT EXISTS (
      SELECT 1 FROM "AnalyticsEvent" excluded
      WHERE excluded.id = 'ana-excluded-' || e.env || '-' || e."visitorId"
        AND excluded.type = 'analytics_excluded' AND excluded."isInternal" = true
    ) AND ((e.type NOT IN ('purchase', 'checkout_canceled'))
      OR (e.type = 'purchase' AND o."isTest" = false AND o."paidAt" IS NOT NULL)
      OR (e.type = 'checkout_canceled' AND o."isTest" = false AND o."stripeSessionId" IS NOT NULL))
    ON CONFLICT (id) DO UPDATE SET "durationMs" = GREATEST(existing."durationMs", EXCLUDED."durationMs")
    WHERE existing.type = 'page_leave' AND EXCLUDED.type = 'page_leave'
      AND existing."visitorId" = EXCLUDED."visitorId" AND existing."pageId" = EXCLUDED."pageId"
      AND EXCLUDED."durationMs" > existing."durationMs"
  `;
}
