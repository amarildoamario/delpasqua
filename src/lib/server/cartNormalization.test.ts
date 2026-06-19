import assert from "node:assert/strict";
import test from "node:test";
import {
  buildVariantLocationByKey,
  clampCartQty,
  getCatalogNormalizationNotice,
  normalizeCartLines,
} from "@/lib/cartNormalization";
import type { Product } from "@/lib/shopTypes";

const catalog: Product[] = [
  {
    id: "olio-evo",
    slug: "olio-evo",
    title: "Olio EVO",
    subtitle: "Fruttato medio",
    imageSrc: "/olio.jpg",
    imageAlt: "Olio EVO",
    description: "Test",
    variants: [
      {
        id: "bottiglia-500",
        label: "500 ml",
        priceCents: 1200,
        sku: "EVO-500",
        cartAliases: [{ productId: "olio-evo-legacy", variantId: "500" }],
      },
    ],
  },
];

test("normalizeCartLines remaps legacy aliases, merges duplicates and clamps to availability", () => {
  const variantLocationByKey = buildVariantLocationByKey(catalog);

  const lines = normalizeCartLines({
    candidateLines: [
      { productId: "olio-evo", variantId: "bottiglia-500", qty: 2 },
      { productId: "olio-evo-legacy", variantId: "500", qty: 3 },
      { productId: "olio-evo", variantId: "bottiglia-500", qty: 1 },
    ],
    availability: { "EVO-500": 4 },
    variantLocationByKey,
  });

  assert.deepEqual(lines, [{ productId: "olio-evo", variantId: "bottiglia-500", qty: 4 }]);
});

test("getCatalogNormalizationNotice reports migrated and invalid cart lines", () => {
  const variantLocationByKey = buildVariantLocationByKey(catalog);
  let noticeId = 0;

  const migrated = getCatalogNormalizationNotice({
    candidateLines: [{ productId: "olio-evo-legacy", variantId: "500", qty: 1 }],
    variantLocationByKey,
    nextNoticeId: () => ++noticeId,
  });

  assert.deepEqual(migrated, {
    id: 1,
    kind: "migrated",
    productId: "olio-evo",
    variantId: "bottiglia-500",
    previousProductId: "olio-evo-legacy",
    previousVariantId: "500",
    prevQty: 1,
    nextQty: 1,
    availableQty: 0,
  });

  const invalid = getCatalogNormalizationNotice({
    candidateLines: [{ productId: "missing", variantId: "ghost", qty: 2 }],
    variantLocationByKey,
    nextNoticeId: () => ++noticeId,
  });

  assert.deepEqual(invalid, {
    id: 2,
    kind: "invalid_removed",
    productId: "missing",
    variantId: "ghost",
    prevQty: 2,
    nextQty: 0,
    availableQty: 0,
  });
});

test("clampCartQty rejects invalid values and caps excessive quantities", () => {
  assert.equal(clampCartQty(-1), 0);
  assert.equal(clampCartQty(Number.NaN), 0);
  assert.equal(clampCartQty(3.9), 3);
  assert.equal(clampCartQty(999), 99);
});
