export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AnalyticsPayloadSchema } from "@/lib/server/schemas";

type IncomingEvent = {
  type: string;

  visitorId: string;
  sessionId: string;

  path?: string | null;
  referrer?: string | null;
  pageId?: string | null;
  durationMs?: number | null;

  productKey?: string | null;
  variantKey?: string | null;

  cartId?: string | null;
  orderId?: string | null;

  env?: string | null; // "prod" | "dev" | "preview" | ...
  isInternal?: boolean | null;

  data?: unknown;
};

function deviceFromUA(ua: string) {
  const s = (ua || "").toLowerCase();

  if (
    s.includes("bot") ||
    s.includes("spider") ||
    s.includes("crawl") ||
    s.includes("headless") ||
    s.includes("playwright") ||
    s.includes("puppeteer") ||
    s.includes("simuser/")
  ) {
    return "bot";
  }

  if (s.includes("ipad") || s.includes("tablet")) return "tablet";
  if (s.includes("mobi") || s.includes("android") || s.includes("iphone")) return "mobile";
  return "desktop";
}

function clampDurationMs(v: unknown, type?: string | null) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  const cap = type === "page_leave" ? 20 * 60 * 1000 : 2 * 60 * 60 * 1000;
  return Math.max(0, Math.min(Math.round(n), cap));
}

function asStr(v: unknown) {
  return typeof v === "string" ? v : null;
}

function asObj(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function normalizeData({
  incomingData,
  ua,
  device,
  env,
  isInternal,
}: {
  incomingData: unknown;
  ua: string;
  device: string;
  env: string;
  isInternal: boolean;
}) {
  const obj = asObj(incomingData) ?? {};
  const meta = asObj(obj.meta) ?? {};

  const source =
    typeof meta.source === "string"
      ? meta.source
      : device === "bot" || ua.toLowerCase().includes("simuser/")
        ? "playwright"
        : "web";

  const trafficType =
    typeof meta.trafficType === "string"
      ? meta.trafficType
      : device === "bot" || source === "playwright"
        ? "bot"
        : isInternal
          ? "internal"
          : "real";

  return {
    ...obj,
    meta: {
      schema: "analytics-meta-v1",
      source,
      trafficType,
      env,
      isInternal,
      device,
      uaHint: ua ? ua.slice(0, 120) : null,
      ...meta,
    },
  };
}

export async function POST(req: Request) {
  // OTTIMIZZAZIONE: se ANALYTICS_DB_ENABLED non è "true", risponde OK senza
  // toccare il DB. Il frontend usa GA4 tramite track.ts, non questa route.
  // Per riabilitare la scrittura analitica su DB: ANALYTICS_DB_ENABLED=true
  if (process.env.ANALYTICS_DB_ENABLED !== "true") {
    return new Response("OK", { status: 200 });
  }

  const ua = req.headers.get("user-agent") ?? "";
  const device = deviceFromUA(ua);

  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").toLowerCase();
  const serverThinksInternal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.endsWith(".local") ||
    host.endsWith(".internal");

  try {
    enforceBodyLimit(req, 120_000);

    const raw = await req.json().catch(() => null);

    // ✅ VALIDAZIONE ZOD (singolo evento o array max 50)
    const parsed = AnalyticsPayloadSchema.safeParse(raw);
    if (!parsed.success) return new Response("Bad Request", { status: 400 });

    const events: IncomingEvent[] = Array.isArray(parsed.data) ? parsed.data : [parsed.data];

    const rows = events
      .map((e) => {
        const type = asStr(e.type);
        const visitorId = asStr(e.visitorId);
        const sessionId = asStr(e.sessionId);
        if (!type || !visitorId || !sessionId) return null;

        const env = (asStr(e.env) ?? (process.env.NODE_ENV === "production" ? "prod" : "dev")).slice(0, 32);
        const isInternal = Boolean(e.isInternal) || serverThinksInternal || env !== "prod";

        const data = normalizeData({ incomingData: e.data, ua, device, env, isInternal });

        return {
          type,
          visitorId,
          sessionId,

          path: asStr(e.path) ?? null,
          referrer: asStr(e.referrer) ?? null,
          pageId: asStr(e.pageId) ?? null,
          durationMs: clampDurationMs(e.durationMs, type),

          productKey: asStr(e.productKey) ?? null,
          variantKey: asStr(e.variantKey) ?? null,

          cartId: asStr(e.cartId) ?? null,
          orderId: asStr(e.orderId) ?? null,

          device,
          userAgent: ua,

          env,
          isInternal,

          data,
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));

    if (!rows.length) return new Response("No events", { status: 200 });

    // ✅ Dedup page_leave
    const leaves = rows.filter((r) => r.type === "page_leave" && r.pageId);
    const others = rows.filter((r) => !(r.type === "page_leave" && r.pageId));

    if (leaves.length) {
      const pageIds = Array.from(new Set(leaves.map((r) => r.pageId).filter(Boolean))) as string[];
      const existing = await prisma.analyticsEvent.findMany({
        where: { type: "page_leave", pageId: { in: pageIds } },
        select: { pageId: true },
      });
      const existingSet = new Set(existing.map((x) => x.pageId).filter(Boolean) as string[]);
      const filteredLeaves = leaves.filter((r) => r.pageId && !existingSet.has(r.pageId));

      const data = [...others, ...filteredLeaves];
      if (data.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await prisma.analyticsEvent.createMany({ data: data as any });
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prisma.analyticsEvent.createMany({ data: rows as any });
    }

    return new Response("OK", { status: 200 });
  } catch (e: unknown) {
    const err = e as Error & { status?: number };
    if (err.status === 413) return new Response("Payload Too Large", { status: 413 });
    return new Response("Server Error", { status: 500 });
  }
}
