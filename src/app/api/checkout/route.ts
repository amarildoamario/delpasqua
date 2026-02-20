import products from "@/db/products.json";
import type { Product } from "@/lib/shopTypes";
import { CheckoutSchema } from "@/lib/server/schemas";
import { rateLimitOrThrow } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { calcVatCentsFromSubtotal } from "@/lib/server/vat";

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

    const catalog = products as Product[];
    let subtotalCents = 0;

    const items = parsed.data.items.map((it) => {
      const p = catalog.find((x) => x.id === it.productId);
      if (!p) throw Object.assign(new Error("Product not found"), { status: 400 });

      const v = p.variants.find((vv) => vv.id === it.variantId);
      if (!v) throw Object.assign(new Error("Variant not found"), { status: 400 });

      const lineTotalCents = v.priceCents * it.qty;
      subtotalCents += lineTotalCents;

      return {
        productId: it.productId,
        variantId: it.variantId,
        qty: it.qty,
        title: p.title,
        variantLabel: v.label,
        unitPriceCents: v.priceCents,
        lineTotalCents
      };
    });

    const vatCents = calcVatCentsFromSubtotal(subtotalCents);
    const shippingCents = subtotalCents >= 6900 ? 0 : 590;
    const totalCents = subtotalCents + vatCents + shippingCents;

    return Response.json({ items, subtotalCents, vatCents, shippingCents, totalCents }, { status: 200 });
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
