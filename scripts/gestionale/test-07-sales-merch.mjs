/**
 * @file test-07-sales-merch.mjs
 * @description Test delle API di merchandising e sconti (sales).
 * Verifica le operazioni di associazione dati promozionali a un prodotto (upsert),
 * impostazione badge (es. NOVITÀ, BEST SELLER), ordinamento in home (homeRank), percentuali di sconto
 * e convalida dei permessi amministrativi.
 */

import { createTestAdminSession, deleteTestAdminSession, adminFetch, getPrisma, assert, assertEqual } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const TEST_PRODUCT_KEY = "__gestionale_test_merch_product__";

export async function run() {
  const db = getPrisma();
  let session;

  try {
    session = await createTestAdminSession();

    // --------------------------------------------------
    // TEST 1: Auth guard - no session
    // --------------------------------------------------
    console.log("👉 Test 1: Fetching PATCH /api/admin/sales without session");
    console.log(`   [Request] PATCH ${BASE_URL}/api/admin/sales`);
    console.log(`   [Body] { productKey: "${TEST_PRODUCT_KEY}" }`);
    const noAuth = await fetch(`${BASE_URL}/api/admin/sales`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productKey: TEST_PRODUCT_KEY }),
    });
    console.log(`   [Response] Status: ${noAuth.status}`);
    console.log(`   [Assert] Checking status === 401`);
    assertEqual(noAuth.status, 401, "Unauthenticated PATCH /sales should return 401");
    console.log("✅ Test 1 PASSED: unauthenticated request blocked (401)");

    // --------------------------------------------------
    // TEST 2: Invalid body (missing productKey) → 400
    // --------------------------------------------------
    console.log("👉 Test 2: Invalid body (missing productKey) → 400");
    console.log(`   [Request] PATCH /api/admin/sales`);
    console.log(`   [Body] { isBestSeller: true }`);
    const badBody = await adminFetch("/api/admin/sales", session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBestSeller: true }), // missing productKey
    });
    console.log(`   [Response] Status: ${badBody.status}`);
    console.log(`   [Assert] Checking status === 400`);
    assertEqual(badBody.status, 400, "Missing productKey should return 400");
    console.log("✅ Test 2 PASSED: invalid body rejected (400)");

    // --------------------------------------------------
    // TEST 3: Create merch record (upsert)
    // --------------------------------------------------
    console.log("👉 Test 3: Create merch record (upsert)");
    console.log(`   [Request] PATCH /api/admin/sales`);
    console.log(`   [Body] { productKey: "${TEST_PRODUCT_KEY}", showInHome: true, homeRank: 5, isBestSeller: true, badge: "NOVITÀ", discountPercent: 10 }`);
    const createRes = await adminFetch("/api/admin/sales", session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productKey: TEST_PRODUCT_KEY,
        showInHome: true,
        homeRank: 5,
        isBestSeller: true,
        badge: "NOVITÀ",
        promoLabel: "Offerta Gestionale",
        discountPercent: 10,
      }),
    });
    console.log(`   [Response] Status: ${createRes.status}`);
    assertEqual(createRes.status, 200, "Valid PATCH /sales should return 200");
    const createBody = await createRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(createBody));
    console.log(`   [Assert] Checking response ok === true`);
    assert(createBody.ok === true, "Sales PATCH response should have ok:true");
    console.log(`   [Assert] Checking response.merch is defined`);
    assert(createBody.merch !== undefined, "Response should include merch object");
    console.log(`   [Assert] Checking response.merch.productKey === "${TEST_PRODUCT_KEY}"`);
    assertEqual(createBody.merch.productKey, TEST_PRODUCT_KEY, "productKey should match");
    console.log(`   [Assert] Checking response.merch.isBestSeller === true`);
    assertEqual(createBody.merch.isBestSeller, true, "isBestSeller should be true");
    console.log(`   [Assert] Checking response.merch.badge === "NOVITÀ"`);
    assertEqual(createBody.merch.badge, "NOVITÀ", "Badge should be saved");
    console.log(`   [Assert] Checking response.merch.homeRank === 5`);
    assertEqual(createBody.merch.homeRank, 5, "homeRank should be 5");
    console.log("✅ Test 3 PASSED: merch record created with all fields");

    // --------------------------------------------------
    // TEST 4: Verify record in DB
    // --------------------------------------------------
    console.log("👉 Test 4: Verify record in DB");
    console.log(`   [DB Query] db.productMerch.findUnique({ where: { productKey: "${TEST_PRODUCT_KEY}" } })`);
    const dbRecord = await db.productMerch.findUnique({ where: { productKey: TEST_PRODUCT_KEY } });
    console.log(`   [DB Result]`, JSON.stringify(dbRecord));
    console.log(`   [Assert] Checking dbRecord !== null`);
    assert(dbRecord !== null, "Merch record should exist in DB");
    console.log(`   [Assert] Checking dbRecord.badge === "NOVITÀ"`);
    assertEqual(dbRecord.badge, "NOVITÀ", "DB badge should match");
    console.log(`   [Assert] Checking dbRecord.discountPercent === 10`);
    assertEqual(dbRecord.discountPercent, 10, "DB discountPercent should be 10");
    console.log("✅ Test 4 PASSED: merch record verified in DB");

    // --------------------------------------------------
    // TEST 5: Update merch record (same key)
    // --------------------------------------------------
    console.log("👉 Test 5: Update merch record (same key)");
    console.log(`   [Request] PATCH /api/admin/sales`);
    console.log(`   [Body] { productKey: "${TEST_PRODUCT_KEY}", showInHome: false, homeRank: 1, isBestSeller: false, badge: null, discountPercent: 0 }`);
    const updateRes = await adminFetch("/api/admin/sales", session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productKey: TEST_PRODUCT_KEY,
        showInHome: false,
        homeRank: 1,
        isBestSeller: false,
        badge: null,
        discountPercent: 0,
      }),
    });
    console.log(`   [Response] Status: ${updateRes.status}`);
    assertEqual(updateRes.status, 200, "Update PATCH /sales should return 200");
    const updateBody = await updateRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(updateBody));
    console.log(`   [Assert] Checking response.merch.isBestSeller === false`);
    assertEqual(updateBody.merch.isBestSeller, false, "isBestSeller should now be false");
    console.log(`   [Assert] Checking response.merch.badge === null`);
    assertEqual(updateBody.merch.badge, null, "Badge should be null after update");
    console.log(`   [Assert] Checking response.merch.homeRank === 1`);
    assertEqual(updateBody.merch.homeRank, 1, "homeRank should be updated to 1");
    console.log("✅ Test 5 PASSED: merch record updated correctly");

    // --------------------------------------------------
    // TEST 6: discountPercent=0 → stored as null (per route logic)
    // --------------------------------------------------
    console.log("👉 Test 6: discountPercent=0 → stored as null (per route logic)");
    console.log(`   [DB Query] db.productMerch.findUnique({ where: { productKey: "${TEST_PRODUCT_KEY}" } })`);
    const dbUpdated = await db.productMerch.findUnique({ where: { productKey: TEST_PRODUCT_KEY } });
    console.log(`   [DB Result]`, JSON.stringify(dbUpdated));
    console.log(`   [Assert] Checking dbUpdated.discountPercent === null`);
    assert(dbUpdated.discountPercent === null, "discountPercent of 0 should be stored as null");
    console.log("✅ Test 6 PASSED: discountPercent=0 correctly stored as null");

    console.log("\n🎉 test-07-sales-merch: all tests passed.");

  } finally {
    // Cleanup test ProductMerch row
    console.log("🧹 Cleaning up sales/merchandising test rows...");
    console.log(`   [DB] Deleting productMerch rows with productKey: ${TEST_PRODUCT_KEY}`);
    const cleanDb = await db.productMerch.deleteMany({ where: { productKey: TEST_PRODUCT_KEY } }).catch(() => {});
    console.log(`   [DB] Cleaned up count: ${cleanDb?.count ?? 0}`);
    if (session) {
      console.log(`   [DB] Deleting session for token: ${session.token.substring(0, 8)}...`);
      await deleteTestAdminSession(session.token);
    }
  }
}
