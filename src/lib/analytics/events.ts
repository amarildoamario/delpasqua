export const ANALYTICS_TYPES = [
  "page_view", "page_leave", "product_view", "product_click", "select_variant",
  "view_item_list", "filter_apply", "promo_view", "promo_click", "add_to_cart",
  "remove_from_cart", "update_cart_quantity", "clear_cart", "view_cart",
  "checkout_click", "begin_checkout", "checkout_canceled", "purchase",
] as const;

export type AnalyticsType = typeof ANALYTICS_TYPES[number];
export type AnalyticsEvent = {
  eventId: string;
  occurredAt: string;
  type: AnalyticsType;
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
  env?: string | null;
  isInternal?: boolean | null;
  data?: unknown;
};

export function analyticsPath(path: string) {
  // Never retain checkout tokens or arbitrary query strings.
  return path.split(/[?#]/, 1)[0].slice(0, 300);
}

export function isAdminPath(path: string) {
  return /^\/(?:[a-z]{2}\/)?(?:admin|developer)(?:\/|$)/.test(path);
}
