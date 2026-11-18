import { isSitePage } from "@/lib/analytics/acquisition";
import { locales, localizedPathnames, type Locale } from "@/i18n/pathnames";
import { excludedCheckout } from "./checkoutAudience";

export type HistoricalCustomerRowInput = {
  email: string;
  firstOrderAt: Date | string;
};

export type V6EventInput = {
  type: string;
  createdAt: Date;
  visitorId: string;
  sessionId: string;
  cartId?: string | null;
  orderId?: string | null;
  path?: string | null;
  productKey?: string | null;
  variantKey?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  data?: unknown;
};

export type V6OrderInput = {
  id: string;
  quoteId?: string | null;
  userAgent?: string | null;
  email?: string | null;
  totalCents?: number;
  isTest: boolean;
  createdAt: Date;
  paidAt: Date | null;
  stripeCheckoutSessionId: string | null;
  status?: string;
  updatedAt?: Date;
  events: { metaJson: string | null; type?: string; createdAt?: Date; toStatus?: string | null }[];
};

const ROME_DAY_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Rome",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const ROME_WEEKDAY_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Rome",
  weekday: "short",
});

const WEEKDAY_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const siteLocales: ReadonlySet<string> = new Set(locales);

export function toRomeDateISO(date: Date): string {
  const parts = ROME_DAY_FMT.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function romeWeekdayIndex(date: Date): number {
  const wd = ROME_WEEKDAY_FMT.formatToParts(date).find((p) => p.type === "weekday")!.value;
  return WEEKDAY_EN.indexOf(wd);
}

function listCalendarDays(startISO: string, endISO: string): string[] {
  const days: string[] = [];
  const cur = new Date(`${startISO}T12:00:00Z`);
  const end = new Date(`${endISO}T12:00:00Z`);
  while (cur <= end && days.length <= 400) {
    days.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

export function canonicalizeSitePath(rawPath?: string | null): {
  rawPath: string;
  canonicalPath: string;
  locale: Locale;
  pageCategory: "blog" | "shop_list" | "product_detail" | "cart" | "other";
} {
  const raw = (rawPath ?? "/").split(/[?#]/, 1)[0] || "/";
  const trimmed = raw.replace(/\/+$/, "") || "/";
  const firstSegment = trimmed.split("/", 2)[1];
  const hasLocale = siteLocales.has(firstSegment);
  const locale = hasLocale ? firstSegment as Locale : "it";
  const withoutLocale = hasLocale ? trimmed.slice(locale.length + 1) || "/" : trimmed;
  const shopPath = localizedPathnames["/shop"][locale];
  const cartPath = localizedPathnames["/cart"][locale];
  let canonicalPath = withoutLocale;

  let pageCategory: "blog" | "shop_list" | "product_detail" | "cart" | "other" = "other";
  if (withoutLocale === "/blog" || withoutLocale.startsWith("/blog/")) {
    pageCategory = "blog";
  } else if (withoutLocale === shopPath || withoutLocale === "/shop") {
    pageCategory = "shop_list";
    canonicalPath = "/shop";
  } else if (withoutLocale.startsWith(`${shopPath}/`) || withoutLocale.startsWith("/shop/")) {
    pageCategory = "product_detail";
    canonicalPath = `/shop${withoutLocale.slice(withoutLocale.indexOf("/", 1))}`;
  } else if (withoutLocale === cartPath || withoutLocale === "/cart") {
    pageCategory = "cart";
    canonicalPath = "/cart";
  }

  return { rawPath: raw, canonicalPath, locale, pageCategory };
}

function orderContext(order: V6OrderInput, includeInternal: boolean): { visitorId: string; sessionId: string } | null {
  for (const event of order.events) {
    if (event.type && event.type !== "ANALYTICS_CONTEXT") continue;
    try {
      const value = JSON.parse(event.metaJson ?? "null");
      if (
        typeof value?.visitorId === "string" &&
        typeof value.sessionId === "string" &&
        (includeInternal || value.env === "prod")
      ) {
        return { visitorId: value.visitorId, sessionId: value.sessionId };
      }
    } catch {
      /* Ignore malformed context */
    }
  }
  return null;
}

function parseAddedQty(data: unknown): number {
  const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const qty = obj.qty === undefined ? 1 : obj.qty;
  return typeof qty === "number" && Number.isSafeInteger(qty) && qty > 0 && qty <= 10000 ? qty : 0;
}

export function computeFunnelsAndSeries(args: {
  orders: V6OrderInput[];
  events: V6EventInput[];
  history?: V6EventInput[];
  start: Date;
  endExclusive: Date;
  startISO: string;
  endISO: string;
  now?: Date;
  includeInternal?: boolean;
}) {
  const {
    orders,
    events,
    history = [],
    start,
    endExclusive,
    startISO,
    endISO,
    now = new Date(),
    includeInternal = false,
  } = args;

  const inRange = (d: Date) => d >= start && d < endExclusive;
  const todayISO = toRomeDateISO(now);

  // Deduplicate commercial orders
  const uniqueOrders = [...new Map(orders.filter((o) => !o.isTest).map((o) => [o.id, o])).values()];
  const paidOrders = uniqueOrders.filter((o) => o.paidAt && inRange(o.paidAt));
  const createdOrders = uniqueOrders.filter((o) => inRange(o.createdAt) && !excludedCheckout(o));
  const stripeCohort = createdOrders.filter((o) => Boolean(o.stripeCheckoutSessionId));

  // Build session cohort S: sessions with at least one site page_view in [start, endExclusive)
  const sessionFirstPageView = new Map<string, V6EventInput>();
  const visitorAllPageViews = new Map<string, V6EventInput[]>();
  for (const ev of [...history, ...events]) {
    if (ev.type !== "page_view" || !isSitePage(ev.path) || !ev.visitorId || ev.createdAt >= endExclusive) continue;
    const vList = visitorAllPageViews.get(ev.visitorId) ?? [];
    vList.push(ev);
    visitorAllPageViews.set(ev.visitorId, vList);
    if (inRange(ev.createdAt) && ev.sessionId) {
      const prev = sessionFirstPageView.get(ev.sessionId);
      if (!prev || ev.createdAt < prev.createdAt) sessionFirstPageView.set(ev.sessionId, ev);
    }
  }

  const cohortSessionIds = new Set(sessionFirstPageView.keys());

  // Track per-session timestamps for ordered step checks
  const blogSessionFirstAt = new Map<string, number>();
  const shopSessionSet = new Set<string>();
  const shopSessionsByLocale = new Map<Locale, { list: Set<string>; details: Set<string> }>();
  const productDetailFirstAt = new Map<string, number>();
  const addToCartLastAt = new Map<string, number>();
  const addToCartSessionSet = new Set<string>();
  const cartViewedSessionSet = new Set<string>();
  const checkoutClickedSessionSet = new Set<string>();
  const contactClickedSessionSet = new Set<string>();

  // Product & Variant session-level tracking
  const prodStats = new Map<string, {
    viewEvents: number;
    viewSessions: Set<string>;
    firstViewBySession: Map<string, number>;
    addEvents: number;
    addedUnits: number;
    addSessions: Set<string>;
    lastAddBySession: Map<string, number>;
  }>();

  const varStats = new Map<string, {
    productKey: string;
    variantKey: string;
    viewEvents: number;
    viewSessions: Set<string>;
    selectionEvents: number;
    selectionSessions: Set<string>;
    firstSelectionBySession: Map<string, number>;
    addEvents: number;
    addedUnits: number;
    addSessions: Set<string>;
    lastAddBySession: Map<string, number>;
  }>();

  const getProd = (pk: string) => {
    let entry = prodStats.get(pk);
    if (!entry) {
      entry = {
        viewEvents: 0,
        viewSessions: new Set(),
        firstViewBySession: new Map(),
        addEvents: 0,
        addedUnits: 0,
        addSessions: new Set(),
        lastAddBySession: new Map(),
      };
      prodStats.set(pk, entry);
    }
    return entry;
  };

  const getVar = (pk: string, vk: string) => {
    const key = `${pk}::${vk}`;
    let entry = varStats.get(key);
    if (!entry) {
      entry = {
        productKey: pk,
        variantKey: vk,
        viewEvents: 0,
        viewSessions: new Set(),
        selectionEvents: 0,
        selectionSessions: new Set(),
        firstSelectionBySession: new Map(),
        addEvents: 0,
        addedUnits: 0,
        addSessions: new Set(),
        lastAddBySession: new Map(),
      };
      varStats.set(key, entry);
    }
    return entry;
  };

  // Cart cohort C: distinct cartIds with add_to_cart in period
  const cartFirstAddAt = new Map<string, { at: number; dateISO: string; sessionId: string }>();
  const cartViewedSet = new Set<string>();
  const cartLastCheckoutClickAt = new Map<string, number>();
  const sessionCarts = new Map<string, Set<string>>();

  for (const ev of events) {
    if (!inRange(ev.createdAt)) continue;
    const t = ev.createdAt.getTime();
    const sid = ev.sessionId;
    const inCohort = Boolean(sid && cohortSessionIds.has(sid));

    if (ev.cartId && sid) {
      const set = sessionCarts.get(sid) ?? new Set<string>();
      set.add(ev.cartId);
      sessionCarts.set(sid, set);
    }

    if (ev.type === "page_view" && isSitePage(ev.path) && inCohort) {
      const { pageCategory, locale } = canonicalizeSitePath(ev.path);
      if (pageCategory === "shop_list" || pageCategory === "product_detail") {
        let sessions = shopSessionsByLocale.get(locale);
        if (!sessions) {
          sessions = { list: new Set(), details: new Set() };
          shopSessionsByLocale.set(locale, sessions);
        }
        (pageCategory === "shop_list" ? sessions.list : sessions.details).add(sid);
        shopSessionSet.add(sid);
      }
      if (pageCategory === "blog") {
        const prev = blogSessionFirstAt.get(sid);
        if (prev === undefined || t < prev) blogSessionFirstAt.set(sid, t);
      } else if (pageCategory === "product_detail") {
        const prev = productDetailFirstAt.get(sid);
        if (prev === undefined || t < prev) productDetailFirstAt.set(sid, t);
      } else if (pageCategory === "cart") {
        cartViewedSessionSet.add(sid);
      }
    }

    if (ev.type === "product_view" && ev.productKey && ev.productKey !== "prodotto-test") {
      if (inCohort) {
        shopSessionSet.add(sid);
        const prev = productDetailFirstAt.get(sid);
        if (prev === undefined || t < prev) productDetailFirstAt.set(sid, t);
      }
      const p = getProd(ev.productKey);
      p.viewEvents++;
      if (sid) {
        p.viewSessions.add(sid);
        const prev = p.firstViewBySession.get(sid);
        if (prev === undefined || t < prev) p.firstViewBySession.set(sid, t);
      }
      if (ev.variantKey) {
        const v = getVar(ev.productKey, ev.variantKey);
        v.viewEvents++;
        if (sid) v.viewSessions.add(sid);
      }
    }

    if (ev.type === "select_variant" && ev.productKey && ev.productKey !== "prodotto-test") {
      const vk = ev.variantKey ?? "default";
      const v = getVar(ev.productKey, vk);
      v.selectionEvents++;
      if (sid) {
        v.selectionSessions.add(sid);
        const prev = v.firstSelectionBySession.get(sid);
        if (prev === undefined || t < prev) v.firstSelectionBySession.set(sid, t);
      }
    }

    if (ev.type === "add_to_cart" && ev.productKey && ev.productKey !== "prodotto-test") {
      const qty = parseAddedQty(ev.data);
      if (qty > 0) {
        if (inCohort) {
          addToCartSessionSet.add(sid);
          const prev = addToCartLastAt.get(sid);
          if (prev === undefined || t > prev) addToCartLastAt.set(sid, t);
        }
        if (ev.cartId) {
          const prevCart = cartFirstAddAt.get(ev.cartId);
          if (!prevCart || t < prevCart.at) {
            cartFirstAddAt.set(ev.cartId, { at: t, dateISO: toRomeDateISO(ev.createdAt), sessionId: sid });
          }
        }
        const p = getProd(ev.productKey);
        p.addEvents++;
        p.addedUnits += qty;
        if (sid) {
          p.addSessions.add(sid);
          const prev = p.lastAddBySession.get(sid);
          if (prev === undefined || t > prev) p.lastAddBySession.set(sid, t);
        }
        const vk = ev.variantKey ?? "default";
        const v = getVar(ev.productKey, vk);
        v.addEvents++;
        v.addedUnits += qty;
        if (sid) {
          v.addSessions.add(sid);
          const prev = v.lastAddBySession.get(sid);
          if (prev === undefined || t > prev) v.lastAddBySession.set(sid, t);
        }
      }
    }

    if (ev.type === "view_cart") {
      if (inCohort) cartViewedSessionSet.add(sid);
      if (ev.cartId) cartViewedSet.add(ev.cartId);
    }

    if (ev.type === "checkout_click" || ev.type === "begin_checkout") {
      if (inCohort) checkoutClickedSessionSet.add(sid);
      if (ev.cartId) {
        const prev = cartLastCheckoutClickAt.get(ev.cartId);
        if (prev === undefined || t > prev) cartLastCheckoutClickAt.set(ev.cartId, t);
      }
    }

    if (ev.type === "contact_click" && inCohort) {
      contactClickedSessionSet.add(sid);
    }
  }

  // Ordered session transitions in cohort S
  let addToCartAfterProductViewSessions = 0;
  for (const sid of addToCartSessionSet) {
    const firstProd = productDetailFirstAt.get(sid);
    const lastAdd = addToCartLastAt.get(sid);
    if (firstProd !== undefined && lastAdd !== undefined && firstProd <= lastAdd) {
      addToCartAfterProductViewSessions++;
    }
  }

  let blogToProductSessions = 0;
  for (const [sid, blogAt] of blogSessionFirstAt.entries()) {
    const prodAt = productDetailFirstAt.get(sid);
    if (prodAt !== undefined && blogAt <= prodAt) {
      blogToProductSessions++;
    }
  }

  // Link orders to cohort sessions and carts
  const checkoutStartedSessionSet = new Set<string>();
  const purchasingSessionSet = new Set<string>();
  const paidCartSet = new Set<string>();
  const legacyPurchaseByOrder = new Map(
    events.filter((e) => e.type === "purchase" && e.orderId).map((e) => [e.orderId!, e]),
  );

  for (const order of createdOrders) {
    const ctx = orderContext(order, includeInternal);
    if (ctx?.sessionId && cohortSessionIds.has(ctx.sessionId)) {
      checkoutStartedSessionSet.add(ctx.sessionId);
    }
  }

  for (const order of paidOrders) {
    const ctx = orderContext(order, includeInternal);
    const legacy = legacyPurchaseByOrder.get(order.id);
    const sid = ctx?.sessionId ?? legacy?.sessionId;
    if (sid && cohortSessionIds.has(sid)) {
      purchasingSessionSet.add(sid);
    }
    if (legacy?.cartId && cartFirstAddAt.has(legacy.cartId)) {
      paidCartSet.add(legacy.cartId);
    } else if (sid && sessionCarts.has(sid)) {
      for (const cid of sessionCarts.get(sid)!) {
        if (cartFirstAddAt.has(cid)) paidCartSet.add(cid);
      }
    }
  }

  const totalSessions = cohortSessionIds.size;
  const blogSessionsCount = blogSessionFirstAt.size;
  const shopSessionsCount = shopSessionSet.size;
  const productDetailSessionsCount = productDetailFirstAt.size;
  const addToCartSessionsCount = addToCartSessionSet.size;
  const checkoutStartedSessionsCount = checkoutStartedSessionSet.size;
  const purchasingSessionsCount = purchasingSessionSet.size;

  const sessionFunnel = {
    cohortDefinition: "sessions_with_site_page_view_in_period",
    sessions: totalSessions,
    blogSessions: blogSessionsCount,
    shopSessions: shopSessionsCount,
    shopByLocale: locales.map((locale) => {
      const sessions = shopSessionsByLocale.get(locale);
      return {
        locale,
        shopListSessions: sessions?.list.size ?? 0,
        productDetailSessions: sessions?.details.size ?? 0,
      };
    }),
    productDetailSessions: productDetailSessionsCount,
    addToCartSessions: addToCartSessionsCount,
    addToCartAfterProductViewSessions,
    directAddToCartSessions: addToCartSessionsCount - addToCartAfterProductViewSessions,
    blogToProductSessions,
    cartViewedSessions: cartViewedSessionSet.size,
    checkoutClickedSessions: checkoutClickedSessionSet.size,
    checkoutStartedSessions: checkoutStartedSessionsCount,
    purchasingSessions: purchasingSessionsCount,
    productReachRate: totalSessions > 0 ? productDetailSessionsCount / totalSessions : null,
    productToCartRate: productDetailSessionsCount > 0 ? addToCartAfterProductViewSessions / productDetailSessionsCount : null,
    sessionAddToCartRate: totalSessions > 0 ? addToCartSessionsCount / totalSessions : null,
    blogToProductRate: blogSessionsCount > 0 ? blogToProductSessions / blogSessionsCount : null,
    purchaseRate: totalSessions > 0 ? purchasingSessionsCount / totalSessions : null,
  };

  // Cart Funnel on cohort C (carts with add_to_cart in period)
  let cartsViewedInCohort = 0;
  let cartsWithCheckoutClick = 0;
  let cartsBypassingCartView = 0;
  for (const [cid, info] of cartFirstAddAt.entries()) {
    const viewed = cartViewedSet.has(cid);
    if (viewed) cartsViewedInCohort++;
    const clickAt = cartLastCheckoutClickAt.get(cid);
    if (clickAt !== undefined && clickAt >= info.at) {
      cartsWithCheckoutClick++;
      if (!viewed) cartsBypassingCartView++;
    }
  }
  const cartsWithAdditionsCount = cartFirstAddAt.size;
  const cartsWithPaidOrderCount = paidCartSet.size;

  const cartFunnel = {
    cohortDefinition: "carts_with_add_to_cart_in_period",
    cartsWithAdditions: cartsWithAdditionsCount,
    cartsViewed: cartsViewedInCohort,
    cartsWithCheckoutClick,
    cartsBypassingCartView,
    cartsWithPaidOrder: cartsWithPaidOrderCount,
    checkoutStartRate: cartsWithAdditionsCount > 0 ? cartsWithCheckoutClick / cartsWithAdditionsCount : null,
    purchaseRate: cartsWithAdditionsCount > 0 ? cartsWithPaidOrderCount / cartsWithAdditionsCount : null,
  };

  // Checkout Cohort State Breakdown (P1: separare aperto, ritorno cancel_url, scaduto, fallito, annullato, pagato, recuperato)
  const cancelReturnOrderIds = new Set(
    events.filter((e) => e.type === "checkout_canceled" && e.orderId && inRange(e.createdAt)).map((e) => e.orderId!),
  );
  let openPending = 0;
  let canceledReturnOpen = 0;
  let expiredUnpaid = 0;
  let failedUnpaid = 0;
  let canceledUnpaid = 0;
  let cohortPaidCount = 0;
  let recoveredCount = 0;

  for (const order of stripeCohort) {
    const isPaidInWindow = Boolean(order.paidAt && order.paidAt < endExclusive);
    const hasCancelReturn = cancelReturnOrderIds.has(order.id);
    const hasExpiredEv = order.events.some(
      (ev) => ev.createdAt && ev.createdAt >= order.createdAt && ev.createdAt < endExclusive &&
        (ev.type === "ORDER_EXPIRED" || ev.toStatus === "SCADUTO"),
    ) || (order.status === "SCADUTO" && Boolean(order.updatedAt && order.updatedAt < endExclusive));
    const hasFailedEv = order.events.some(
      (ev) => ev.createdAt && ev.createdAt >= order.createdAt && ev.createdAt < endExclusive &&
        (ev.type === "STRIPE_SESSION_FAILED" || ev.toStatus === "FALLITO"),
    ) || (order.status === "FALLITO" && Boolean(order.updatedAt && order.updatedAt < endExclusive));
    const hasCanceledEv = order.events.some(
      (ev) => ev.createdAt && ev.createdAt >= order.createdAt && ev.createdAt < endExclusive &&
        (ev.type === "ORDER_CANCELED" || ev.toStatus === "ANNULLATO"),
    ) || (order.status === "ANNULLATO" && Boolean(order.updatedAt && order.updatedAt < endExclusive));

    if (isPaidInWindow) {
      cohortPaidCount++;
      if (hasCancelReturn || hasExpiredEv || hasFailedEv || hasCanceledEv) {
        recoveredCount++;
      }
    } else if (hasFailedEv) {
      failedUnpaid++;
    } else if (hasCanceledEv) {
      canceledUnpaid++;
    } else if (hasExpiredEv) {
      expiredUnpaid++;
    } else if (hasCancelReturn) {
      canceledReturnOpen++;
    } else {
      openPending++;
    }
  }

  const definitiveClosedUnpaid = expiredUnpaid + failedUnpaid + canceledUnpaid;
  const checkoutCohort = {
    ordersCreated: createdOrders.length,
    storefrontOrdersCreated: createdOrders.filter((o) => !o.quoteId).length,
    quoteOrdersCreated: createdOrders.filter((o) => Boolean(o.quoteId)).length,
    stripeCheckoutsStarted: stripeCohort.length,
    openPending,
    canceledReturnOpen,
    expiredUnpaid,
    failedUnpaid,
    canceledUnpaid,
    definitiveClosedUnpaid,
    paid: cohortPaidCount,
    recoveredAfterCancelOrClose: recoveredCount,
    paidRate: stripeCohort.length > 0 ? cohortPaidCount / stripeCohort.length : null,
    definitiveCloseRate: stripeCohort.length > 0 ? definitiveClosedUnpaid / stripeCohort.length : null,
    unpaidAtObservationRate: stripeCohort.length > 0 ? (stripeCohort.length - cohortPaidCount) / stripeCohort.length : null,
  };

  // Product Funnel & Variant Funnel (with distinct sessions vs repeated clicks!)
  const productFunnel = [...prodStats.entries()]
    .map(([productKey, st]) => {
      let viewThenAddSessions = 0;
      for (const [sid, addAt] of st.lastAddBySession.entries()) {
        const viewAt = st.firstViewBySession.get(sid);
        if (viewAt !== undefined && viewAt <= addAt) viewThenAddSessions++;
      }
      const viewSessionsN = st.viewSessions.size;
      const addSessionsN = st.addSessions.size;
      return {
        productKey,
        viewEvents: st.viewEvents,
        viewSessions: viewSessionsN,
        addEvents: st.addEvents,
        addedUnits: st.addedUnits,
        addSessions: addSessionsN,
        viewThenAddSessions,
        eventCartToDetailRate: st.viewEvents > 0 ? +(st.addEvents / st.viewEvents).toFixed(4) : null,
        productToCartRate: viewSessionsN > 0 ? +(viewThenAddSessions / viewSessionsN).toFixed(4) : null,
      };
    })
    .sort((a, b) => b.viewSessions - a.viewSessions || b.viewEvents - a.viewEvents);

  const variantFunnel = [...varStats.values()]
    .map((st) => {
      let selectionThenAddSessions = 0;
      let defaultVariantAddSessions = 0;
      for (const [sid, addAt] of st.lastAddBySession.entries()) {
        const selAt = st.firstSelectionBySession.get(sid);
        if (selAt !== undefined && selAt <= addAt) selectionThenAddSessions++;
        else defaultVariantAddSessions++;
      }
      const selectionSessionsN = st.selectionSessions.size;
      return {
        productKey: st.productKey,
        variantKey: st.variantKey,
        viewEvents: st.viewEvents,
        viewSessions: st.viewSessions.size,
        selectionEvents: st.selectionEvents,
        selectionSessions: selectionSessionsN,
        addEvents: st.addEvents,
        addedUnits: st.addedUnits,
        addSessions: st.addSessions.size,
        selectionThenAddSessions,
        defaultVariantAddSessions,
        selectionToCartRate: selectionSessionsN > 0 ? +(selectionThenAddSessions / selectionSessionsN).toFixed(4) : null,
      };
    })
    .sort((a, b) => b.selectionSessions - a.selectionSessions || b.addSessions - a.addSessions || b.viewSessions - a.viewSessions);

  // Daily series in Europe/Rome
  const calendarDays = listCalendarDays(startISO, endISO);
  type DayBucket = {
    date: string;
    weekday: string;
    weekdayIndex: number;
    isPartial: boolean;
    isObserved: boolean;
    sessions: number;
    activeSessionsSet: Set<string>;
    visitorsSet: Set<string>;
    pageViews: number;
    blogSessions: number;
    shopSessions: number;
    productDetailSessions: number;
    addToCartSessions: number;
    carts: number;
    checkoutsStarted: number;
    paidOrders: number;
    storefrontPaidOrders: number;
    quotePaidOrders: number;
    revenueCents: number;
    attributedPaidOrders: number;
  };

  const dailyMap = new Map<string, DayBucket>();
  for (const dayISO of calendarDays) {
    const refDate = new Date(`${dayISO}T12:00:00Z`);
    const wdIdx = romeWeekdayIndex(refDate);
    const isObserved = dayISO <= todayISO;
    const isPartial = dayISO > todayISO || (dayISO === todayISO && now < endExclusive);
    dailyMap.set(dayISO, {
      date: dayISO,
      weekday: WEEKDAY_IT[wdIdx] ?? "—",
      weekdayIndex: wdIdx,
      isPartial,
      isObserved,
      sessions: 0,
      activeSessionsSet: new Set(),
      visitorsSet: new Set(),
      pageViews: 0,
      blogSessions: 0,
      shopSessions: 0,
      productDetailSessions: 0,
      addToCartSessions: 0,
      carts: 0,
      checkoutsStarted: 0,
      paidOrders: 0,
      storefrontPaidOrders: 0,
      quotePaidOrders: 0,
      revenueCents: 0,
      attributedPaidOrders: 0,
    });
  }

  // Assign each session in cohort S to its local start date (strictly additive across period!)
  for (const [sid, firstEv] of sessionFirstPageView.entries()) {
    const dISO = toRomeDateISO(firstEv.createdAt);
    const bucket = dailyMap.get(dISO);
    if (!bucket) continue;
    bucket.sessions++;
    if (blogSessionFirstAt.has(sid)) bucket.blogSessions++;
    if (shopSessionSet.has(sid)) bucket.shopSessions++;
    if (productDetailFirstAt.has(sid)) bucket.productDetailSessions++;
    if (addToCartSessionSet.has(sid)) bucket.addToCartSessions++;
  }

  // Pageviews, active sessions, active visitors per day
  for (const ev of events) {
    if (!inRange(ev.createdAt) || ev.type !== "page_view" || !isSitePage(ev.path)) continue;
    const dISO = toRomeDateISO(ev.createdAt);
    const bucket = dailyMap.get(dISO);
    if (!bucket) continue;
    bucket.pageViews++;
    if (ev.sessionId) bucket.activeSessionsSet.add(ev.sessionId);
    if (ev.visitorId) bucket.visitorsSet.add(ev.visitorId);
  }

  // Carts assigned to their first add_to_cart date in the period
  for (const info of cartFirstAddAt.values()) {
    const bucket = dailyMap.get(info.dateISO);
    if (bucket) bucket.carts++;
  }

  // Checkouts created per day
  for (const order of stripeCohort) {
    const dISO = toRomeDateISO(order.createdAt);
    const bucket = dailyMap.get(dISO);
    if (bucket) bucket.checkoutsStarted++;
  }

  // Paid orders and revenue per payment day
  for (const order of paidOrders) {
    const dISO = toRomeDateISO(order.paidAt!);
    const bucket = dailyMap.get(dISO);
    if (!bucket) continue;
    bucket.paidOrders++;
    if (order.quoteId) bucket.quotePaidOrders++;
    else bucket.storefrontPaidOrders++;
    bucket.revenueCents += order.totalCents ?? 0;

    const ctx = orderContext(order, includeInternal);
    const legacy = legacyPurchaseByOrder.get(order.id);
    const sid = ctx?.sessionId;
    const vid = ctx?.visitorId ?? legacy?.visitorId;
    const hasAttribution = Boolean(
      (sid && sessionFirstPageView.has(sid)) ||
      (vid && (visitorAllPageViews.get(vid)?.length ?? 0) > 0),
    );
    if (hasAttribution) bucket.attributedPaidOrders++;
  }

  const daily = [...dailyMap.values()].map((b) => ({
    date: b.date,
    weekday: b.weekday,
    isPartial: b.isPartial,
    isObserved: b.isObserved,
    sessions: b.sessions,
    activeSessions: b.activeSessionsSet.size,
    uniqueVisitors: b.visitorsSet.size,
    pageViews: b.pageViews,
    blogSessions: b.blogSessions,
    shopSessions: b.shopSessions,
    productDetailSessions: b.productDetailSessions,
    addToCartSessions: b.addToCartSessions,
    carts: b.carts,
    checkoutsStarted: b.checkoutsStarted,
    paidOrders: b.paidOrders,
    storefrontPaidOrders: b.storefrontPaidOrders,
    quotePaidOrders: b.quotePaidOrders,
    revenueEur: +(b.revenueCents / 100).toFixed(2),
    attributedPaidOrders: b.attributedPaidOrders,
    attributionCoverage: b.paidOrders > 0 ? +(b.attributedPaidOrders / b.paidOrders).toFixed(4) : null,
  }));

  // Weekday Exposure (comparing e.g. 2 Tuesdays vs 1 Wednesday fairly)
  const weekdayExposure = WEEKDAY_IT.map((label, idx) => {
    const matchingDays = [...dailyMap.values()].filter((d) => d.weekdayIndex === idx);
    const calendarDaysCount = matchingDays.length;
    const completeDaysCount = matchingDays.filter((d) => !d.isPartial && d.isObserved).length;
    const partialDaysCount = matchingDays.filter((d) => d.isPartial && d.isObserved).length;
    const visits = matchingDays.reduce((s, d) => s + d.sessions, 0);
    const carts = matchingDays.reduce((s, d) => s + d.carts, 0);
    const ordersCount = matchingDays.reduce((s, d) => s + d.paidOrders, 0);
    const completeVisits = matchingDays.filter((d) => !d.isPartial && d.isObserved).reduce((s, d) => s + d.sessions, 0);
    const completeOrders = matchingDays.filter((d) => !d.isPartial && d.isObserved).reduce((s, d) => s + d.paidOrders, 0);
    return {
      label,
      calendarDays: calendarDaysCount,
      completeDays: completeDaysCount,
      partialDays: partialDaysCount,
      visits,
      carts,
      orders: ordersCount,
      avgVisitsPerCalendarDay: calendarDaysCount > 0 ? +(visits / calendarDaysCount).toFixed(2) : null,
      avgVisitsPerCompleteDay: completeDaysCount > 0 ? +(completeVisits / completeDaysCount).toFixed(2) : null,
      avgOrdersPerCalendarDay: calendarDaysCount > 0 ? +(ordersCount / calendarDaysCount).toFixed(2) : null,
      avgOrdersPerCompleteDay: completeDaysCount > 0 ? +(completeOrders / completeDaysCount).toFixed(2) : null,
    };
  });

  // Forecast / Baseline on complete calendar days (Section 9)
  const completeDayRows = daily.filter((d) => !d.isPartial && d.isObserved);
  const completeDaysN = completeDayRows.length;
  const completeSessionsSum = completeDayRows.reduce((s, d) => s + d.sessions, 0);
  const completeOrdersSum = completeDayRows.reduce((s, d) => s + d.paidOrders, 0);
  const avgDailySessions = completeDaysN > 0 ? +(completeSessionsSum / completeDaysN).toFixed(2) : null;
  const projected30dSessionsBaseline = avgDailySessions !== null ? Math.round(avgDailySessions * 30) : null;

  const forecasts = {
    completeDaysSample: completeDaysN,
    trafficBaseline: avgDailySessions !== null ? {
      avgSessionsPerCompleteDay: avgDailySessions,
      projected30dSessionsAtConstantPace: projected30dSessionsBaseline,
      note: "Proiezione lineare a ritmo costante sui giorni completi osservati; non e una stima della crescita SEO.",
    } : null,
    trafficGrowthEstimate: null,
    trafficGrowthStatus: completeDaysN < 14 ? "insufficient_history" : "requires_previous_period_comparison",
    orderBaseline: completeDaysN > 0 ? {
      observedPaidOrdersInCompleteDays: completeOrdersSum,
      avgOrdersPerCompleteDay: +(completeOrdersSum / completeDaysN).toFixed(3),
      sampleWarning: paidOrders.length < 5 ? "Campione ordini ridotto: non proiettare lo scontrino o il tasso come stabili." : null,
    } : null,
    scenarioAssumptions: [],
    predictionIntervals: null,
  };

  const contactsSummary = {
    sessionsWithContactClick: contactClickedSessionSet.size,
    contactSessionRate: totalSessions > 0 ? +(contactClickedSessionSet.size / totalSessions).toFixed(4) : null,
  };

  return {
    sessionFunnel,
    cartFunnel,
    checkoutCohort,
    productFunnel,
    variantFunnel,
    daily,
    weekdayExposure,
    forecasts,
    contactsSummary,
  };
}

export function computeHistoricalCustomerRetention(
  paidOrdersInPeriod: { email?: string | null; totalCents?: number; paidAt: Date | null }[],
  historicalCustomerRows: HistoricalCustomerRowInput[],
  start: Date,
) {
  const historicalFirstByEmail = new Map<string, string>();
  for (const row of historicalCustomerRows) {
    const firstISO = row.firstOrderAt instanceof Date ? toRomeDateISO(row.firstOrderAt) : String(row.firstOrderAt).slice(0, 10);
    historicalFirstByEmail.set(row.email.trim().toLowerCase(), firstISO);
  }
  const startDayISO = toRomeDateISO(start);
  const periodCustomers = new Map<string, { count: number; totalCents: number; minPaidAt: Date }>();
  for (const o of paidOrdersInPeriod) {
    if (!o.email || !o.paidAt) continue;
    const em = o.email.trim().toLowerCase();
    if (!em) continue;
    const cur = periodCustomers.get(em);
    if (!cur) {
      periodCustomers.set(em, { count: 1, totalCents: o.totalCents ?? 0, minPaidAt: o.paidAt });
    } else {
      cur.count++;
      cur.totalCents += o.totalCents ?? 0;
      if (o.paidAt < cur.minPaidAt) cur.minPaidAt = o.paidAt;
    }
  }

  let historicalReturningCustomers = 0;
  let historicalReturningRevenueCents = 0;
  let firstTimeRevenueCents = 0;

  for (const [email, info] of periodCustomers.entries()) {
    const firstOrderISO = historicalFirstByEmail.get(email);
    const hadPriorOrder = firstOrderISO !== undefined && firstOrderISO < startDayISO;
    if (hadPriorOrder) {
      historicalReturningCustomers++;
      historicalReturningRevenueCents += info.totalCents;
    } else {
      firstTimeRevenueCents += info.totalCents;
    }
  }

  const totalCustomers = periodCustomers.size;
  const historicalFirstTimeCustomers = totalCustomers - historicalReturningCustomers;
  const historicalReturningCustomerRate = totalCustomers > 0
    ? historicalReturningCustomers / totalCustomers
    : null;

  return {
    uniquePayingCustomers: totalCustomers,
    historicalReturningCustomers,
    historicalFirstTimeCustomers,
    historicalReturningCustomerRate,
    historicalReturningCustomerRatePct:
      historicalReturningCustomerRate !== null ? +(historicalReturningCustomerRate * 100).toFixed(1) : null,
    historicalReturningRevenueEur: +(historicalReturningRevenueCents / 100).toFixed(2),
    historicalFirstTimeRevenueEur: +(firstTimeRevenueCents / 100).toFixed(2),
  };
}
