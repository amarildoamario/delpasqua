export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { rateLimitOrThrow } from "@/lib/server/rateLimit";

function getIP(req: Request) {
    const xf = req.headers.get("x-forwarded-for");
    return (xf?.split(",")[0] ?? "unknown").trim();
}

export async function POST(req: Request) {
    try {
        rateLimitOrThrow({ key: `promo-validate:${getIP(req)}`, limit: 20, windowSeconds: 60 });

        const json = await req.json().catch(() => null);
        if (!json || typeof json.code !== "string") {
            return Response.json({ valid: false, reason: "Codice non valido." }, { status: 400 });
        }

        const code = String(json.code).trim().toUpperCase();
        if (code.length < 2 || code.length > 40) {
            return Response.json({ valid: false, reason: "Codice non valido." }, { status: 400 });
        }

        const subtotalCents = Number(json.subtotalCents ?? 0);

        const promo = await prisma.promotion.findUnique({ where: { code } });

        if (!promo || !promo.isActive) {
            return Response.json({ valid: false, reason: "Codice sconto non trovato o non attivo." });
        }

        const now = new Date();
        if (promo.startsAt && promo.startsAt > now) {
            return Response.json({ valid: false, reason: "Il codice non è ancora attivo." });
        }
        if (promo.endsAt && promo.endsAt < now) {
            return Response.json({ valid: false, reason: "Il codice sconto è scaduto." });
        }
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return Response.json({ valid: false, reason: "Codice sconto non valido." });
        }
        if (promo.minOrderCents && subtotalCents < promo.minOrderCents) {
            const minEur = (promo.minOrderCents / 100).toFixed(2).replace(".", ",");
            return Response.json({
                valid: false,
                reason: `Ordine minimo di ${minEur} € richiesto per questo codice.`,
            });
        }

        let discountCents = 0;
        if (promo.type === "percent" && promo.percent) {
            discountCents = Math.round((subtotalCents * promo.percent) / 100);
        } else if (promo.type === "fixed" && promo.amountCents) {
            discountCents = promo.amountCents;
        }
        discountCents = Math.max(0, Math.min(discountCents, subtotalCents));

        return Response.json({
            valid: true,
            code: promo.code,
            type: promo.type,
            percent: promo.percent ?? null,
            amountCents: promo.amountCents ?? null,
            freeShipping: promo.freeShipping,
            discountCents,
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
