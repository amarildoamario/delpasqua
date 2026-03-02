export const runtime = "nodejs";

import { CheckoutSchema } from "@/lib/server/schemas";
import { rateLimitOrThrow } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { computeOrderPricing } from "@/lib/server/pricing";

function getIP(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] ?? "unknown").trim();
}

export async function POST(req: Request) {
  try {
    enforceBodyLimit(req, 30_000);
    rateLimitOrThrow({ key: `checkout:${getIP(req)}`, limit: 30, windowSeconds: 60 });

    const json = await req.json().catch(() => null);
    const parsed = CheckoutSchema.safeParse(json);
    if (!parsed.success) return new Response("Bad Request", { status: 400 });

    const pricing = await computeOrderPricing({
      lines: parsed.data.items,
      promotionCode: parsed.data.promotionCode,
    });

    return Response.json(
      {
        subtotalCents: pricing.subtotalCents,
        discountCents: pricing.discountCents,
        vatCents: pricing.vatCents,
        shippingCents: pricing.shippingCents,
        totalCents: pricing.totalCents,
        promotionApplied: pricing.promotionApplied,
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    const err = e as Error & { status?: number; retryAfterSec?: number };

    if (err.status === 429) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(err.retryAfterSec ?? 30) },
      });
    }
    if (err.status === 413) return new Response("Payload Too Large", { status: 413 });
    if (err.status === 400) return new Response(err.message ?? "Bad Request", { status: 400 });
    return new Response("Server Error", { status: 500 });
  }
}

