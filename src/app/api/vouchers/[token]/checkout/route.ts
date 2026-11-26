import { NextResponse } from "next/server";
import { getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { requestCheckoutExcluded } from "@/lib/server/checkoutAudience";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { startVoucherCheckout, VoucherCheckoutError, voucherCheckoutMode } from "@/lib/server/tastingVoucherPayment";
import { quoteAppOrigin } from "@/lib/server/quoteCheckout";
import { VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const url = new URL(req.url);
  const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
  if (!VoucherProposalIdSchema.safeParse(token).success || !voucherCheckoutMode()) {
    return NextResponse.json({ error: "Checkout non disponibile." }, { status: 404, headers });
  }
  if (req.headers.get("origin") !== url.origin) {
    return NextResponse.json({ error: "Origine della richiesta non valida." }, { status: 403, headers });
  }
  const back = (state: string, attempt?: string) => {
    const returnUrl = new URL(`/voucher/${token}/`, url);
    returnUrl.searchParams.set("checkout", state);
    if (attempt) returnUrl.searchParams.set("attempt", attempt);
    return NextResponse.redirect(returnUrl, { status: 303, headers });
  };
  const limit = await rateLimit({ key: `voucher-checkout:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 15, windowSeconds: 60 });
  if (!limit.ok) return back("rate");
  try {
    const internal = await requestCheckoutExcluded(prisma, req);
    const checkoutUrl = await startVoucherCheckout(token, internal, quoteAppOrigin(req));
    return NextResponse.redirect(checkoutUrl, { status: 303, headers });
  } catch (error) {
    return error instanceof VoucherCheckoutError ? back(error.code, error.attemptId) : back("unavailable");
  }
}
