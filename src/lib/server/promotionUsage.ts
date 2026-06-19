import type { Promotion } from "@/generated/prisma/client";

type PromotionReader = {
  promotion: {
    findUnique: (args: { where: { code: string } }) => Promise<Promotion | null>;
  };
  order: {
    count: (args: { where: { promotionCode: string; status: "IN_ATTESA" } }) => Promise<number>;
  };
};

type PromotionLockingReader = {
  $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
};

export type PromotionEligibilityReason =
  | "MISSING_CODE"
  | "NOT_FOUND"
  | "NOT_ACTIVE"
  | "NOT_STARTED"
  | "EXPIRED"
  | "MIN_ORDER_NOT_MET"
  | "USAGE_LIMIT_REACHED";

export type PromotionEligibility =
  | {
      ok: true;
      code: string;
      promo: Promotion;
      pendingCount: number;
    }
  | {
      ok: false;
      code: string;
      reason: PromotionEligibilityReason;
      promo: Promotion | null;
      pendingCount: number;
    };

export function normalizePromotionCode(code: string | null | undefined) {
  return String(code || "").trim().toUpperCase();
}

export async function lockPromotionRow(
  db: PromotionLockingReader,
  code: string
) {
  const normalizedCode = normalizePromotionCode(code);
  if (!normalizedCode) return;

  await db.$executeRaw`
    SELECT 1 FROM "Promotion"
    WHERE "code" = ${normalizedCode}
    FOR UPDATE
  `;
}

export async function evaluatePromotionEligibility(
  db: PromotionReader,
  args: {
    code: string | null | undefined;
    subtotalCents: number;
    now?: Date;
  }
): Promise<PromotionEligibility> {
  const code = normalizePromotionCode(args.code);
  if (!code) {
    return {
      ok: false,
      code,
      reason: "MISSING_CODE",
      promo: null,
      pendingCount: 0,
    };
  }

  const promo = await db.promotion.findUnique({ where: { code } });
  if (!promo) {
    return {
      ok: false,
      code,
      reason: "NOT_FOUND",
      promo: null,
      pendingCount: 0,
    };
  }

  if (!promo.isActive) {
    return {
      ok: false,
      code,
      reason: "NOT_ACTIVE",
      promo,
      pendingCount: 0,
    };
  }

  const now = args.now ?? new Date();
  if (promo.startsAt && promo.startsAt > now) {
    return {
      ok: false,
      code,
      reason: "NOT_STARTED",
      promo,
      pendingCount: 0,
    };
  }

  if (promo.endsAt && promo.endsAt < now) {
    return {
      ok: false,
      code,
      reason: "EXPIRED",
      promo,
      pendingCount: 0,
    };
  }

  if (promo.minOrderCents && args.subtotalCents < promo.minOrderCents) {
    return {
      ok: false,
      code,
      reason: "MIN_ORDER_NOT_MET",
      promo,
      pendingCount: 0,
    };
  }

  const pendingCount = await db.order.count({
    where: {
      promotionCode: code,
      status: "IN_ATTESA",
    },
  });

  if (promo.usageLimit != null && promo.usedCount + pendingCount >= promo.usageLimit) {
    return {
      ok: false,
      code,
      reason: "USAGE_LIMIT_REACHED",
      promo,
      pendingCount,
    };
  }

  return {
    ok: true,
    code,
    promo,
    pendingCount,
  };
}
