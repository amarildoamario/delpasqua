export const runtime = "nodejs";

import { computeOrderPricing } from "@/lib/server/pricing";
import { prisma } from "@/lib/server/prisma";
import { evaluatePromotionEligibility } from "@/lib/server/promotionUsage";
import { rateLimitOrThrow } from "@/lib/server/rateLimit";
import { PromotionValidateSchema } from "@/lib/server/schemas";

function getIP(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] ?? "unknown").trim();
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow({ key: `promo-validate:${getIP(req)}`, limit: 20, windowSeconds: 60 });

    const json = await req.json().catch(() => null);
    const parsed = PromotionValidateSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ valid: false, reason: "Codice non valido." }, { status: 400 });
    }

    const code = parsed.data.code.trim().toUpperCase();
    const basePricing = await computeOrderPricing({ lines: parsed.data.items });
    const subtotalCents = basePricing.subtotalCents;

    const eligibility = await evaluatePromotionEligibility(prisma, {
      code,
      subtotalCents,
    });

    if (!eligibility.ok) {
      if (eligibility.reason === "MIN_ORDER_NOT_MET" && eligibility.promo?.minOrderCents) {
        const minEur = (eligibility.promo.minOrderCents / 100).toFixed(2).replace(".", ",");
        return Response.json({
          valid: false,
          reason: `Ordine minimo di ${minEur} EUR richiesto per questo codice.`,
        });
      }

      const reasonByFailure: Partial<Record<typeof eligibility.reason, string>> = {
        NOT_FOUND: "Codice sconto non trovato o non attivo.",
        NOT_ACTIVE: "Codice sconto non trovato o non attivo.",
        NOT_STARTED: "Il codice non e ancora attivo.",
        EXPIRED: "Il codice sconto e scaduto.",
        USAGE_LIMIT_REACHED: "Codice sconto non valido.",
        MISSING_CODE: "Codice sconto non valido.",
      };

      return Response.json({
        valid: false,
        reason: reasonByFailure[eligibility.reason] ?? "Codice sconto non valido.",
      });
    }

    const pricing = await computeOrderPricing({
      lines: parsed.data.items,
      promotionCode: code,
    });

    if (!pricing.promotionApplied) {
      return Response.json({ valid: false, reason: "Codice sconto non valido." });
    }

    return Response.json({
      valid: true,
      code: pricing.promotionApplied.code,
      type: pricing.promotionApplied.type,
      percent: pricing.promotionApplied.percent ?? null,
      amountCents: pricing.promotionApplied.amountCents ?? null,
      freeShipping: pricing.promotionApplied.freeShipping ?? false,
      discountCents: pricing.discountCents,
    });
  } catch (e: unknown) {
    const err = e as Error & { status?: number; retryAfterSec?: number };
    if (err?.status === 429) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(err.retryAfterSec ?? 30) },
      });
    }
    return new Response("Server Error", { status: 500 });
  }
}
