"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildVariantLocationByKey,
  clampCartQty,
  getCatalogNormalizationNotice as buildCatalogNormalizationNotice,
  getCartLineSku,
  normalizeAvailableQty,
  normalizeCartLines,
} from "@/lib/cartNormalization";
import type { AvailabilityMap, CartAvailabilityNotice } from "@/lib/cartNormalization";
import type { CartLine, Product } from "@/lib/shopTypes";

export type CartAddResult = {
  status: "added" | "adjusted" | "rejected";
  productId: string;
  variantId: string;
  requestedQty: number;
  addedQty: number;
  finalQty: number;
  availableQty: number | null;
};
export type { CartAvailabilityNotice } from "@/lib/cartNormalization";

type CartState = {
  lines: CartLine[];
  add: (line: CartLine) => Promise<CartAddResult>;
  remove: (productId: string, variantId: string) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  clear: () => void;
  getAvailableQty: (productId: string, variantId: string) => number | null;
  getLineQty: (productId: string, variantId: string) => number;
  refreshAvailability: () => Promise<void>;
  count: number;
  catalog: Product[];
  lastAvailabilityNotice: CartAvailabilityNotice | null;
  clearAvailabilityNotice: () => void;
};

const CartContext = createContext<CartState | null>(null);
const LS_KEY = "dp_cart_v1";

function sameLines(a: CartLine[], b: CartLine[]) {
  if (a.length !== b.length) return false;
  return a.every((line, index) => {
    const other = b[index];
    return (
      line?.productId === other?.productId &&
      line?.variantId === other?.variantId &&
      line?.qty === other?.qty
    );
  });
}

export function CartProvider({
  children,
  initialCatalog,
}: {
  children: React.ReactNode;
  initialCatalog: Product[] | unknown[];
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [availabilityBySku, setAvailabilityBySku] = useState<AvailabilityMap>({});
  const [catalog, setCatalog] = useState<Product[]>(initialCatalog as Product[]);
  const [lastAvailabilityNotice, setLastAvailabilityNotice] = useState<CartAvailabilityNotice | null>(null);

  const linesRef = useRef<CartLine[]>([]);
  const availabilityRef = useRef<AvailabilityMap>({});
  const noticeSeqRef = useRef(0);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useEffect(() => {
    availabilityRef.current = availabilityBySku;
  }, [availabilityBySku]);

  useEffect(() => {
    let alive = true;
    fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (alive && Array.isArray(data)) {
          setCatalog(data);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const variantLocationByKey = useMemo(() => buildVariantLocationByKey(catalog), [catalog]);

  const getSku = useCallback(
    (productId: string, variantId: string) => {
      return getCartLineSku(productId, variantId, variantLocationByKey);
    },
    [variantLocationByKey]
  );

  const getCatalogNormalizationNotice = useCallback(
    (candidateLines: CartLine[]) => {
      return buildCatalogNormalizationNotice({
        candidateLines,
        variantLocationByKey,
        nextNoticeId: () => ++noticeSeqRef.current,
      });
    },
    [variantLocationByKey]
  );

  const fetchAvailabilityForSkus = useCallback(async (skus: string[]) => {
    const normalized = [...new Set(skus.map((sku) => sku.trim()).filter(Boolean))].slice(0, 200);
    if (normalized.length === 0) return {} as AvailabilityMap;

    const response = await fetch(`/api/inventory/availability?skus=${encodeURIComponent(normalized.join(","))}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Availability request failed");
    }

    const data = await response.json().catch(() => null);
    return (data?.availability ?? {}) as AvailabilityMap;
  }, []);

  const mergeAvailability = useCallback((patch: AvailabilityMap) => {
    if (Object.keys(patch).length === 0) return availabilityRef.current;
    const next = { ...availabilityRef.current, ...patch };
    availabilityRef.current = next;
    setAvailabilityBySku(next);
    return next;
  }, []);

  const buildAddResult = useCallback(
    (args: {
      prevLines: CartLine[];
      nextLines: CartLine[];
      line: CartLine;
      availability: AvailabilityMap;
    }): CartAddResult => {
      const { prevLines, nextLines, line, availability } = args;
      const requestedQty = clampCartQty(line.qty);
      const prevQty =
        prevLines.find((item) => item.productId === line.productId && item.variantId === line.variantId)?.qty ?? 0;
      const finalQty =
        nextLines.find((item) => item.productId === line.productId && item.variantId === line.variantId)?.qty ?? 0;
      const addedQty = Math.max(0, finalQty - prevQty);
      const sku = getSku(line.productId, line.variantId);
      const availableQty = sku ? normalizeAvailableQty(availability[sku]) : null;

      return {
        status: addedQty <= 0 ? "rejected" : addedQty < requestedQty ? "adjusted" : "added",
        productId: line.productId,
        variantId: line.variantId,
        requestedQty,
        addedQty,
        finalQty,
        availableQty,
      };
    },
    [getSku]
  );

  const getLineQty = useCallback((productId: string, variantId: string) => {
    return (
      linesRef.current.find((line) => line.productId === productId && line.variantId === variantId)?.qty ?? 0
    );
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const decoded: unknown = JSON.parse(raw);
          const parsed = Array.isArray(decoded) ? (decoded as CartLine[]) : [];
          const next = normalizeCartLines({
            candidateLines: parsed,
            availability: {},
            variantLocationByKey,
          });
          const notice = getCatalogNormalizationNotice(parsed);
          linesRef.current = next;
          setLines(next);
          if (notice) setLastAvailabilityNotice((current) => current ?? notice);
        }
      } catch {}
      setHydrated(true);
    });
  }, [getCatalogNormalizationNotice, variantLocationByKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(lines));
    } catch {}
  }, [hydrated, lines]);

  const refreshAvailability = useCallback(async () => {
    if (!hydrated) return;

    const skus = [...new Set(
      linesRef.current
        .map((line) => getSku(line.productId, line.variantId))
        .filter((sku): sku is string => Boolean(sku))
    )];

    if (skus.length === 0) {
      availabilityRef.current = {};
      setAvailabilityBySku({});
      return;
    }

    try {
      const nextAvailability = await fetchAvailabilityForSkus(skus);
      mergeAvailability(nextAvailability);
    } catch {
      // ignore
    }
  }, [fetchAvailabilityForSkus, getSku, hydrated, mergeAvailability]);

  useEffect(() => {
    if (!hydrated) return;
    queueMicrotask(() => {
      void refreshAvailability();
    });
  }, [hydrated, refreshAvailability]);

  useEffect(() => {
    if (!hydrated) return;
    queueMicrotask(() => {
      const prev = linesRef.current;
      const next = normalizeCartLines({
        candidateLines: prev,
        availability: availabilityBySku,
        variantLocationByKey,
      });
      if (sameLines(prev, next)) return;

      const nextByKey = new Map(next.map((line) => [`${line.productId}::${line.variantId}`, line.qty] as const));
      const firstChanged = prev.find((line) => {
        const nextQty = nextByKey.get(`${line.productId}::${line.variantId}`) ?? 0;
        return nextQty < line.qty;
      });

      if (firstChanged) {
        const nextQty = nextByKey.get(`${firstChanged.productId}::${firstChanged.variantId}`) ?? 0;
        const sku = getSku(firstChanged.productId, firstChanged.variantId);
        const availableQty = sku ? normalizeAvailableQty(availabilityBySku[sku]) ?? 0 : 0;
        setLastAvailabilityNotice((current) => current ?? {
          id: ++noticeSeqRef.current,
          kind: nextQty > 0 ? "reduced" : "removed",
          productId: firstChanged.productId,
          variantId: firstChanged.variantId,
          prevQty: firstChanged.qty,
          nextQty,
          availableQty,
        });
      }

      linesRef.current = next;
      setLines(next);
    });
  }, [availabilityBySku, getSku, hydrated, variantLocationByKey]);

  const getAvailableQty = useCallback(
    (productId: string, variantId: string) => {
      const sku = getSku(productId, variantId);
      if (!sku) return null;
      return normalizeAvailableQty(availabilityRef.current[sku]);
    },
    [getSku]
  );

  const add = useCallback(
    async (line: CartLine) => {
      const sku = getSku(line.productId, line.variantId);
      let mergedAvailability = availabilityRef.current;

      if (sku && typeof mergedAvailability[sku] !== "number") {
        try {
          const fetched = await fetchAvailabilityForSkus([sku]);
          mergedAvailability = mergeAvailability(fetched);
        } catch {
          mergedAvailability = availabilityRef.current;
        }
      }

      const prev = linesRef.current;
      const idx = prev.findIndex(
        (item) => item.productId === line.productId && item.variantId === line.variantId
      );
      const candidate = [...prev];
      if (idx >= 0) {
        candidate[idx] = { ...candidate[idx], qty: candidate[idx].qty + line.qty };
      } else {
        candidate.push(line);
      }

      const next = normalizeCartLines({
        candidateLines: candidate,
        availability: mergedAvailability,
        variantLocationByKey,
      });
      linesRef.current = next;
      setLines(next);

      return buildAddResult({
        prevLines: prev,
        nextLines: next,
        line,
        availability: mergedAvailability,
      });
    },
    [buildAddResult, fetchAvailabilityForSkus, getSku, mergeAvailability, variantLocationByKey]
  );

  const remove = useCallback((productId: string, variantId: string) => {
    const next = linesRef.current.filter(
      (line) => !(line.productId === productId && line.variantId === variantId)
    );
    linesRef.current = next;
    setLines(next);
  }, []);

  const setQty = useCallback(
    (productId: string, variantId: string, qty: number) => {
      const next = normalizeCartLines({
        candidateLines: linesRef.current.map((line) =>
          line.productId === productId && line.variantId === variantId ? { ...line, qty } : line
        ),
        availability: availabilityRef.current,
        variantLocationByKey,
      });
      linesRef.current = next;
      setLines(next);
    },
    [variantLocationByKey]
  );

  const clear = useCallback(() => {
    linesRef.current = [];
    availabilityRef.current = {};
    setLines([]);
    setAvailabilityBySku({});
    setLastAvailabilityNotice(null);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  }, []);

  const clearAvailabilityNotice = useCallback(() => {
    setLastAvailabilityNotice(null);
  }, []);

  const count = useMemo(
    () => (hydrated ? lines.reduce((sum, line) => sum + line.qty, 0) : 0),
    [hydrated, lines]
  );

  const value = useMemo(
    () => ({
      lines: hydrated ? lines : [],
      add,
      remove,
      setQty,
      clear,
      getAvailableQty,
      getLineQty,
      refreshAvailability,
      count,
      catalog,
      lastAvailabilityNotice,
      clearAvailabilityNotice,
    }),
    [
      add,
      catalog,
      clear,
      clearAvailabilityNotice,
      count,
      getAvailableQty,
      getLineQty,
      hydrated,
      lastAvailabilityNotice,
      lines,
      refreshAvailability,
      remove,
      setQty,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
