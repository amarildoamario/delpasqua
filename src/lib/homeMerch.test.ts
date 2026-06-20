import test from "node:test";
import assert from "node:assert/strict";
import { pickHomeMerchSlots } from "./homeMerch";

test("pickHomeMerchSlots compresses gaps into real consecutive ranks", () => {
  const products = [
    { id: "evo", slug: "evo", showInHome: true, homeRank: 1 },
    { id: "medio", slug: "fruttato-medio", showInHome: true, homeRank: 3 },
    { id: "intenso", slug: "fruttato-intenso", showInHome: null, homeRank: 0 },
    { id: "tartufo", slug: "tartufo", showInHome: null, homeRank: 0 },
  ];

  assert.deepEqual(
    pickHomeMerchSlots(products).map(({ item, rank }) => [item.id, rank]),
    [
      ["evo", 1],
      ["medio", 2],
      ["intenso", 3],
      ["tartufo", 4],
    ]
  );
});

test("pickHomeMerchSlots resolves duplicate ranks by catalog order", () => {
  const products = [
    { id: "a", slug: "a", showInHome: true, homeRank: 1 },
    { id: "b", slug: "b", showInHome: true, homeRank: 3 },
    { id: "c", slug: "c", showInHome: true, homeRank: 3 },
    { id: "d", slug: "d", showInHome: true, homeRank: 4 },
  ];

  assert.deepEqual(
    pickHomeMerchSlots(products).map(({ item, rank }) => [item.id, rank]),
    [
      ["a", 1],
      ["b", 2],
      ["c", 3],
      ["d", 4],
    ]
  );
});
