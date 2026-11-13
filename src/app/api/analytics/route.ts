import { prisma } from "@/lib/server/prisma";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AnalyticsPayloadSchema } from "@/lib/server/schemas";
import { allowAnalyticsRequest, saveAnalyticsBatch } from "@/lib/server/analyticsIngest";
import { hasAnalyticsExclusion } from "@/lib/analytics/exclusion";

export const runtime = "nodejs";
const MAX_BYTES = 60_000;

export async function POST(req: Request) {
  if (hasAnalyticsExclusion(req.headers.get("cookie") ?? "")) return new Response(null, { status: 204 });
  // Retain an explicit kill switch without treating discarded events as delivered.
  if (process.env.ANALYTICS_DB_ENABLED !== "true") return new Response("Disabled", { status: 503 });
  const origin = req.headers.get("origin");
  if ((origin && origin !== new URL(req.url).origin) || req.headers.get("sec-fetch-site") === "cross-site") {
    return new Response("Forbidden", { status: 403 });
  }
  if (!allowAnalyticsRequest(req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown")) {
    return new Response("Too Many Requests", { status: 429, headers: { "Retry-After": "60" } });
  }
  try {
    enforceBodyLimit(req, MAX_BYTES);
    // Bound streamed bodies too; Content-Length is optional for fetch/beacon.
    const reader = req.body?.getReader();
    if (!reader) return new Response("Bad Request", { status: 400 });
    const decoder = new TextDecoder();
    let raw = "";
    let bytes = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) { await reader.cancel(); return new Response("Payload Too Large", { status: 413 }); }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    const parsed = AnalyticsPayloadSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return new Response("Bad Request", { status: 400 });
    const events = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
    await saveAnalyticsBatch(prisma, events, req);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof SyntaxError) return new Response("Bad Request", { status: 400 });
    if ((error as { status?: number }).status === 413) return new Response("Payload Too Large", { status: 413 });
    console.error("[ANALYTICS] Batch could not be saved");
    return new Response("Server Error", { status: 500 });
  }
}
