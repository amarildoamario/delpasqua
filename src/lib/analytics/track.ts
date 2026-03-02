"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Track = {
  type: string;
  path?: string | null;
  productKey?: string | null;
  variantKey?: string | null;
  cartId?: string | null;
  orderId?: string | null;
  data?: unknown;
};

function safeObj(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  return v as Record<string, unknown>;
}

function centsToNumber(cents: unknown): number | undefined {
  const n = typeof cents === "number" ? cents : Number(cents);
  if (!Number.isFinite(n)) return undefined;
  return Math.round(n) / 100;
}

function buildItemFromTrack(e: Track) {
  const d = safeObj(e.data);

  const qty = typeof d.qty === "number" ? d.qty : undefined;
  const price = centsToNumber(d.unitPriceCents);

  const variantLabel =
    typeof d.variantLabel === "string" && d.variantLabel.trim() ? d.variantLabel.trim() : undefined;

  const slug = typeof d.slug === "string" ? d.slug : undefined;

  return {
    item_id: e.productKey ?? undefined,
    item_variant: variantLabel ?? (e.variantKey ?? undefined),
    item_name: slug ?? e.productKey ?? undefined,
    quantity: qty,
    price,
  };
}

function gtagEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  window.gtag("event", name, params ?? {});
}

export function track(e: Track) {
  // Se GA non è configurato, non fare nulla
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) return;

  const d = safeObj(e.data);

  switch (e.type) {
    // =========================
    // DISCOVERY / SHOP
    // =========================
    case "view_item_list": {
      const listId = typeof d.listId === "string" ? d.listId : "shop";
      const itemsShown = Array.isArray(d.itemsShown) ? d.itemsShown : [];
      const items = itemsShown
        .map((raw, index: number) => {
          const x = safeObj(raw);
          const productKey = typeof x.productKey === "string" ? x.productKey : undefined;
          const slug = typeof x.slug === "string" ? x.slug : undefined;

          return {
            item_id: productKey,
            item_name: slug ?? productKey,
            index,
          };
        })
        .filter((it) => Boolean(it.item_id || it.item_name));

      gtagEvent("view_item_list", {
        item_list_id: listId,
        item_list_name: listId,
        items,
      });
      return;
    }

    case "product_click": {
      // GA4 recommended: select_item
      const item = buildItemFromTrack(e);
      gtagEvent("select_item", {
        item_list_id: "shop",
        items: [item].filter(Boolean),
      });
      return;
    }

    case "product_view": {
      // GA4 recommended: view_item
      const item = buildItemFromTrack(e);
      gtagEvent("view_item", {
        currency: "EUR",
        items: [item].filter(Boolean),
      });
      return;
    }

    case "filter_apply": {
      // Custom event + parametri utili
      gtagEvent("filter_apply", {
        filter_id: d.filterId ?? undefined,
        filter_label: d.filterLabel ?? undefined,
        results_count: d.resultsCount ?? undefined,
        item_list_id: d.listId ?? "shop",
      });
      return;
    }

    case "promo_view": {
      // GA4 recommended: view_promotion
      gtagEvent("view_promotion", {
        promotion_id: d.promotionId ?? "home_best_sellers",
        promotion_name: d.promotionName ?? undefined,
        items: Array.isArray(d.items) ? d.items : undefined,
      });
      return;
    }

    case "promo_click": {
      // GA4 recommended: select_promotion
      gtagEvent("select_promotion", {
        promotion_id: d.promotionId ?? "home_best_sellers",
        promotion_name: d.promotionName ?? undefined,
        items: d.item ? [d.item] : undefined,
      });
      return;
    }

    // =========================
    // CART / CHECKOUT
    // =========================
    case "add_to_cart": {
      // GA4 recommended: add_to_cart
      const item = buildItemFromTrack(e);
      gtagEvent("add_to_cart", {
        currency: "EUR",
        value:
          typeof item.price === "number" && typeof item.quantity === "number"
            ? item.price * item.quantity
            : undefined,
        items: [item].filter(Boolean),
      });
      return;
    }

    case "remove_from_cart": {
      // GA4 recommended: remove_from_cart
      const item = buildItemFromTrack(e);
      const qty = typeof d.qty === "number" ? d.qty : item.quantity;
      gtagEvent("remove_from_cart", {
        currency: "EUR",
        value:
          typeof item.price === "number" && typeof qty === "number" ? item.price * qty : undefined,
        items: [
          {
            ...item,
            quantity: qty ?? item.quantity,
          },
        ].filter(Boolean),
      });
      return;
    }

    case "update_cart_quantity": {
      // Custom (molto utile per capire frizioni)
      gtagEvent("update_cart_quantity", {
        item_id: e.productKey ?? undefined,
        item_variant: e.variantKey ?? undefined,
        from_qty: d.fromQty ?? undefined,
        to_qty: d.toQty ?? undefined,
        delta: d.delta ?? undefined,
        unit_price: centsToNumber(d.unitPriceCents),
      });
      return;
    }

    case "clear_cart": {
      // Custom
      gtagEvent("clear_cart", {
        items_count: d.itemsCount ?? undefined,
        value: centsToNumber(d.totalCents),
        currency: "EUR",
      });
      return;
    }

    case "view_cart": {
      gtagEvent("view_cart", {
        items_count: typeof d.itemsCount === "number" ? d.itemsCount : undefined,
      });
      return;
    }

    case "begin_checkout": {
      gtagEvent("begin_checkout", {
        items_count: typeof d.itemsCount === "number" ? d.itemsCount : undefined,
        value: centsToNumber(d.totalCents),
        currency: "EUR",
      });
      return;
    }

    case "checkout_canceled": {
      gtagEvent("checkout_canceled", {
        order_id: e.orderId ?? undefined,
        items_count: d.itemsCount ?? undefined,
        value: centsToNumber(d.totalCents),
        currency: typeof d.currency === "string" ? d.currency : "EUR",
      });
      return;
    }

    // =========================
    // PURCHASE
    // =========================
    case "purchase": {
      const transactionId = e.orderId ?? e.cartId ?? undefined;

      const value = centsToNumber(d.totalCents);
      const currency = typeof d.currency === "string" ? d.currency.toUpperCase() : "EUR";

      const items = Array.isArray(d.items)
        ? d.items
            .map((raw) => {
              const it = safeObj(raw);

              const itemId =
                typeof it.item_id === "string"
                  ? it.item_id
                  : typeof it.sku === "string"
                  ? it.sku
                  : undefined;

              const itemName =
                typeof it.item_name === "string"
                  ? it.item_name
                  : typeof it.title === "string"
                  ? it.title
                  : undefined;

              const itemVariant =
                typeof it.item_variant === "string"
                  ? it.item_variant
                  : typeof it.variantLabel === "string"
                  ? it.variantLabel
                  : undefined;

              const price = centsToNumber(it.priceCents ?? it.unitPriceCents);

              const quantity =
                typeof it.quantity === "number"
                  ? it.quantity
                  : typeof it.qty === "number"
                  ? it.qty
                  : undefined;

              return {
                item_id: itemId,
                item_name: itemName,
                item_variant: itemVariant,
                price,
                quantity,
              };
            })
            .filter((x) => Boolean(x.item_id || x.item_name))
        : [];

      gtagEvent("purchase", {
        transaction_id: transactionId,
        value,
        currency,
        items,
      });
      return;
    }

    // =========================
    // FALLBACK
    // =========================
    default: {
      gtagEvent(e.type, {
        path: e.path ?? undefined,
        product_key: e.productKey ?? undefined,
        variant_key: e.variantKey ?? undefined,
        cart_id: e.cartId ?? undefined,
        order_id: e.orderId ?? undefined,
        ...d,
      });
      return;
    }
  }
}