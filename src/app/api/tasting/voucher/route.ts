import { NextResponse } from "next/server";
import { getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit } from "@/lib/server/rateLimit";
import { readVoucherRequest } from "@/lib/server/tastingVoucherProposal";
import { findRedeemableVoucher, VoucherBookingError, VoucherCodeInput } from "@/lib/server/tastingVoucherRedemption";

export async function POST(req: Request) {
  const respond = (body: object, status = 200) =>
    NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
  const limit = await rateLimit({ key: `voucher-redeem:${getClientIpFromHeaders(req.headers) || "unknown"}`, limit: 12, windowSeconds: 60 });
  if (!limit.ok) return respond({ code: "VOUCHER_RATE" }, 429);
  const input = await readVoucherRequest(req, 256);
  const parsed = VoucherCodeInput.safeParse(input && typeof input === "object" && "code" in input ? input.code : null);
  if (!parsed.success) return respond({ code: "VOUCHER_INVALID" }, 400);
  try {
    const result = await findRedeemableVoucher(prisma, parsed.data);
    return respond({ tastingTypeId: result.type.id, people: result.people, children: result.children });
  } catch (error) {
    if (error instanceof VoucherBookingError) return respond({ code: error.code }, error.status);
    return respond({ code: "VOUCHER_ERROR" }, 503);
  }
}
