import { z } from "zod";

/**
 * =========================
 * COMMON / SHARED
 * =========================
 */
export const Id64Schema = z.string().trim().min(1).max(64);

export const AdminLoginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

/**
 * =========================
 * SHOP / CHECKOUT
 * =========================
 */
export const CartLineSchema = z.object({
  productId: z.string().min(1).max(64),
  variantId: z.string().min(1).max(64),
  qty: z.coerce.number().int().min(1).max(99),
});

export const CheckoutSchema = z.object({
  items: z.array(CartLineSchema).min(1).max(50),
  promotionCode: z.string().trim().min(2).max(40).optional(),
});

// ✅ customer non più obbligatorio (Stripe Checkout lo raccoglie)
export const CustomerSchema = z
  .object({
    fullName: z.string().trim().min(3).max(120).optional(),
    email: z.string().trim().email().max(200).optional(),

    addressLine1: z.string().trim().min(3).max(200).optional(),
    addressLine2: z.string().trim().max(200).optional(),

    city: z.string().trim().min(2).max(120).optional(),
    province: z.string().trim().min(2).max(120).optional(),

    postalCode: z.string().trim().min(4).max(20).optional(),
    countryCode: z
      .string()
      .trim()
      .toUpperCase()
      .refine((v) => ["IT"].includes(v), "Unsupported country")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(25)
      .regex(/^[+()0-9\s-]+$/, "Invalid phone")
      .optional(),

    notes: z.string().trim().max(300).optional(),
  })
  .optional();

export const CreateOrderSchema = z.object({
  items: z.array(CartLineSchema).min(1).max(50),
  customer: CustomerSchema, // ✅ ora opzionale
  promotionCode: z.string().trim().min(2).max(40).optional(),
});

/**
 * =========================
 * ADMIN / BACKOFFICE
 * =========================
 */

// Settings: accettiamo una mappa di valori, ma limitiamo chiavi/valori
const SettingKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[A-Za-z0-9_.:-]+$/, "Invalid setting key");

const SettingValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]).transform((v) => {
  if (v === null) return "";
  return String(v);
});

export const AdminSettingsUpdateSchema = z.object({
  values: z.record(SettingKeySchema, SettingValueSchema).default({}),
});

// Promotions
export const PromotionTypeSchema = z.enum(["percent", "fixed", "free_shipping"]);

export const AdminPromotionCreateSchema = z
  .object({
    code: z.string().trim().min(2).max(40).transform((s) => s.toUpperCase()),
    description: z.string().trim().max(300).nullable().optional(),
    type: PromotionTypeSchema.default("percent"),

    percent: z.coerce.number().min(0).max(100).nullable().optional(),
    amountCents: z.coerce.number().int().min(0).nullable().optional(),

    freeShipping: z.coerce.boolean().default(false),

    minOrderCents: z.coerce.number().int().min(0).nullable().optional(),
    usageLimit: z.coerce.number().int().min(0).nullable().optional(),

    isActive: z.coerce.boolean().default(true),

    startsAt: z
      .union([z.string(), z.date()])
      .nullable()
      .optional()
      .transform((v) => {
        if (!v) return null;
        const d = typeof v === "string" ? new Date(v) : v;
        return Number.isNaN(d.getTime()) ? null : d;
      }),

    endsAt: z
      .union([z.string(), z.date()])
      .nullable()
      .optional()
      .transform((v) => {
        if (!v) return null;
        const d = typeof v === "string" ? new Date(v) : v;
        return Number.isNaN(d.getTime()) ? null : d;
      }),
  })
  .superRefine((data, ctx) => {
    if (data.startsAt && data.endsAt && data.startsAt.getTime() > data.endsAt.getTime()) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "Invalid date range" });
    }

    // coerenza minima
    if (data.type === "percent") {
      // percent deve esserci o può essere null (ma se null, promo inutile)
      if (data.percent == null && !data.freeShipping) {
        // ok comunque (puoi avere promo “0” e freeShipping false, ma è inutile; non blocchiamo)
      }
    }
    if (data.type === "fixed") {
      // amountCents dovrebbe esserci (ma non blocchiamo duro)
    }
    if (data.type === "free_shipping") {
      // free_shipping => freeShipping true (se no forziamo nella route)
    }
  });

export const AdminPromotionDeleteQuerySchema = z.object({
  id: z.string().trim().min(1).max(64),
});

/**
 * Promotions UPDATE (aggiunta)
 * - per PUT/PATCH su /api/admin/promotions/[id]
 */
export const AdminPromotionUpdateSchema = z
  .object({
    isActive: z.coerce.boolean().optional(),
    description: z.string().trim().max(300).nullable().optional(),
    percent: z.coerce.number().min(0).max(100).nullable().optional(),
    amountCents: z.coerce.number().int().min(0).nullable().optional(),
    minOrderCents: z.coerce.number().int().min(0).nullable().optional(),
    usageLimit: z.coerce.number().int().min(0).nullable().optional(),
  })
  .strict();

// Order status patch
export const OrderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "EXPIRED",
  "FAILED",
]);

export const AdminOrderStatusPatchSchema = z.object({
  restore: z.boolean().optional(),
  status: OrderStatusSchema.optional(),

  actor: z.string().trim().min(1).max(120).optional().nullable(),
  message: z.string().trim().min(1).max(400).optional().nullable(),

  notes: z.string().max(5000).optional(),
  isFlagged: z.boolean().optional(),
  riskScore: z.coerce.number().min(0).max(100).optional(),
});

export const AdminOrderShipSchema = z.object({
  shipped: z.boolean(),
  actor: z.string().trim().min(1).max(120).optional().nullable(),
});

// Outbox retry
export const AdminOutboxRetrySchema = z.object({
  outboxId: z.string().trim().min(1).max(64),
});

/**
 * Outbox LIST query (aggiunta)
 * - per GET /api/admin/outbox?take=...&status=...
 */
export const AdminOutboxQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(400).default(200),
  status: z.enum(["pending", "processing", "done", "failed"]).optional(),
});

// Report query
export const AdminReportMonthQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Expected YYYY-MM"),
});


export const AdminSalesPatchSchema = z
  .object({
    productKey: z.string().trim().min(1).max(128),

    showInHome: z.coerce.boolean().default(false),
    homeRank: z.coerce.number().int().min(0).max(9999).default(0),
    isBestSeller: z.coerce.boolean().default(false),

    badge: z.string().trim().max(60).nullable().optional(),
    promoLabel: z.string().trim().max(80).nullable().optional(),

    // sconto: o percent o cents (non entrambi)
    discountPercent: z.coerce.number().min(0).max(100).nullable().optional(),
    discountCents: z.coerce.number().int().min(0).nullable().optional(),

    startsAt: z
      .union([z.string(), z.date()])
      .nullable()
      .optional()
      .transform((v) => {
        if (!v) return null;
        const d = typeof v === "string" ? new Date(v) : v;
        return Number.isNaN(d.getTime()) ? null : d;
      }),

    endsAt: z
      .union([z.string(), z.date()])
      .nullable()
      .optional()
      .transform((v) => {
        if (!v) return null;
        const d = typeof v === "string" ? new Date(v) : v;
        return Number.isNaN(d.getTime()) ? null : d;
      }),
  })
  .superRefine((data, ctx) => {
    if (data.startsAt && data.endsAt && data.startsAt.getTime() > data.endsAt.getTime()) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "Invalid date range" });
    }
    if (data.discountPercent != null && data.discountCents != null) {
      ctx.addIssue({
        code: "custom",
        path: ["discountCents"],
        message: "Use either discountPercent or discountCents (not both)",
      });
    }
  });


/**
 * Report CSV query (aggiunta)
 * - per GET /api/admin/report.csv?start=...&end=...
 */
export const AdminReportCsvQuerySchema = z
  .object({
    start: z.string().trim().optional().nullable(),
    end: z.string().trim().optional().nullable(),
  })
  .transform((v) => {
    const start = v.start ? new Date(v.start) : null;
    const end = v.end ? new Date(v.end) : null;
    return {
      start: start && !Number.isNaN(start.getTime()) ? start : null,
      end: end && !Number.isNaN(end.getTime()) ? end : null,
    };
  })
  .superRefine((v, ctx) => {
    if (v.start && v.end && v.start.getTime() > v.end.getTime()) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "Invalid date range" });
    }
  });

// Cron / outbox limit param
export const CronLimitQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/**
 * Cron expire-pending query (aggiunta)
 * - per POST /api/cron/expire-pending?limit=...&minutes=...
 */
export const CronExpirePendingQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  minutes: z.coerce.number().int().min(1).max(365 * 24 * 60).default(7 * 24 * 60),
});

/**
 * =========================
 * ANALYTICS
 * =========================
 */
const AnalyticsIdSchema = z.string().trim().min(6).max(128);

export const AnalyticsEventSchema = z.object({
  type: z.string().trim().min(1).max(64),
  visitorId: AnalyticsIdSchema,
  sessionId: AnalyticsIdSchema,

  path: z.string().trim().max(300).optional().nullable(),
  referrer: z.string().trim().max(500).optional().nullable(),
  pageId: z.string().trim().max(128).optional().nullable(),
  durationMs: z.coerce.number().int().min(0).max(2 * 60 * 60 * 1000).optional().nullable(),

  productKey: z.string().trim().max(128).optional().nullable(),
  variantKey: z.string().trim().max(128).optional().nullable(),

  cartId: z.string().trim().max(128).optional().nullable(),
  orderId: z.string().trim().max(128).optional().nullable(),

  env: z.string().trim().max(32).optional().nullable(),
  isInternal: z.boolean().optional().nullable(),

  data: z.unknown().optional(),
});

export const AnalyticsPayloadSchema = z.union([
  AnalyticsEventSchema,
  z.array(AnalyticsEventSchema).min(1).max(50),
]);
