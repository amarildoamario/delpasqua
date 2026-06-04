/**
 * @file test-06-catalog.mjs
 * @description Test delle API di gestione del catalogo prodotti.
 * Verifica il caricamento dell'intero catalogo, le azioni di inserimento (createProduct),
 * aggiornamento (updateProduct), cancellazione (deleteProduct), la prevenzione di cancellazioni massive,
 * il rifiuto di ID duplicati e i controlli di autenticazione.
 */

import { createTestAdminSession, deleteTestAdminSession, adminFetch, assert, assertEqual } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const TEST_PRODUCT_ID = "__test__gestionale-catalog-prod";

function testProduct(overrides = {}) {
  return {
    id: TEST_PRODUCT_ID,
    name: "Prodotto di Test Gestionale",
    slug: "prodotto-test-gestionale",
    variants: [
      { id: "v1", name: "Variante A", priceCents: 1000 },
    ],
    ...overrides,
  };
}

async function cleanupTestProduct(session) {
  // Try to delete the test product if it exists
  await adminFetch("/api/admin/catalog", session, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "deleteProduct", productId: TEST_PRODUCT_ID }),
  }).catch(() => {});
  // Also cleanup a "renamed" variant in case rename test ran
  await adminFetch("/api/admin/catalog", session, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "deleteProduct", productId: "__test__renamed-prod" }),
  }).catch(() => {});
}

export async function run() {
  let session;

  try {
    session = await createTestAdminSession();

    // Make sure we start clean
    await cleanupTestProduct(session);

    // --------------------------------------------------
    // TEST 1: Auth guard - no session
    // --------------------------------------------------
    console.log("👉 Test 1: Fetching GET /api/admin/catalog without session");
    console.log(`   [Request] GET ${BASE_URL}/api/admin/catalog`);
    const noAuth = await fetch(`${BASE_URL}/api/admin/catalog`);
    console.log(`   [Response] Status: ${noAuth.status}`);
    console.log(`   [Assert] Checking status === 401`);
    assertEqual(noAuth.status, 401, "Unauthenticated GET /catalog should return 401");
    console.log("✅ Test 1 PASSED: unauthenticated request blocked (401)");

    // --------------------------------------------------
    // TEST 2: GET catalog returns array
    // --------------------------------------------------
    console.log("👉 Test 2: GET catalog returns array");
    console.log(`   [Request] GET /api/admin/catalog`);
    const getRes = await adminFetch("/api/admin/catalog", session, { method: "GET" });
    console.log(`   [Response] Status: ${getRes.status}`);
    assertEqual(getRes.status, 200, "GET /catalog should return 200");
    const getBody = await getRes.json();
    console.log(`   [Response JSON] Catalog contains ${getBody.catalog?.length ?? 0} item(s)`);
    console.log(`   [Assert] Checking response ok === true`);
    assert(getBody.ok === true, "Catalog GET should have ok:true");
    console.log(`   [Assert] Checking response.catalog is array`);
    assert(Array.isArray(getBody.catalog), "catalog should be an array");
    const initialCount = getBody.catalog.length;
    console.log(`✅ Test 2 PASSED: catalog GET returned ${initialCount} products`);

    // --------------------------------------------------
    // TEST 3: createProduct - success
    // --------------------------------------------------
    console.log("👉 Test 3: createProduct - success");
    console.log(`   [Request] POST /api/admin/catalog`);
    console.log(`   [Body] { action: "createProduct", product: { id: "${TEST_PRODUCT_ID}", ... } }`);
    const createRes = await adminFetch("/api/admin/catalog", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createProduct", product: testProduct() }),
    });
    console.log(`   [Response] Status: ${createRes.status}`);
    assertEqual(createRes.status, 200, "createProduct should return 200");
    const createBody = await createRes.json();
    console.log(`   [Response JSON] Catalog now contains ${createBody.catalog?.length ?? 0} item(s)`);
    console.log(`   [Assert] Checking response ok === true`);
    assert(createBody.ok === true, "createProduct response should have ok:true");
    console.log(`   [Assert] Checking new product is present in catalog`);
    const found = createBody.catalog.find((p) => p.id === TEST_PRODUCT_ID);
    assert(found !== undefined, "New product should appear in returned catalog");
    console.log("✅ Test 3 PASSED: product created successfully");

    // --------------------------------------------------
    // TEST 4: createProduct - duplicate ID → 409
    // --------------------------------------------------
    console.log("👉 Test 4: createProduct - duplicate ID → 409");
    console.log(`   [Request] POST /api/admin/catalog`);
    console.log(`   [Body] { action: "createProduct", product: { id: "${TEST_PRODUCT_ID}", ... } }`);
    const dupRes = await adminFetch("/api/admin/catalog", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createProduct", product: testProduct() }),
    });
    console.log(`   [Response] Status: ${dupRes.status}`);
    console.log(`   [Assert] Checking status === 409`);
    assertEqual(dupRes.status, 409, "Duplicate product ID should return 409");
    console.log("✅ Test 4 PASSED: duplicate product ID rejected (409)");

    // --------------------------------------------------
    // TEST 5: updateProduct - change name
    // --------------------------------------------------
    console.log("👉 Test 5: updateProduct - change name");
    console.log(`   [Request] POST /api/admin/catalog`);
    console.log(`   [Body] { action: "updateProduct", productId: "${TEST_PRODUCT_ID}", patch: { name: "Nome Aggiornato" } }`);
    const updateRes = await adminFetch("/api/admin/catalog", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateProduct",
        productId: TEST_PRODUCT_ID,
        patch: testProduct({ name: "Nome Aggiornato" }),
      }),
    });
    console.log(`   [Response] Status: ${updateRes.status}`);
    assertEqual(updateRes.status, 200, "updateProduct should return 200");
    const updateBody = await updateRes.json();
    console.log(`   [Assert] Checking response ok === true`);
    assert(updateBody.ok === true, "updateProduct response should have ok:true");
    console.log(`   [Assert] Finding updated product in catalog`);
    const updated = updateBody.catalog.find((p) => p.id === TEST_PRODUCT_ID);
    assert(updated !== undefined, "Updated product should still be in catalog");
    console.log(`   [Assert] Checking updated product name === "Nome Aggiornato"`);
    assertEqual(updated.name, "Nome Aggiornato", "Product name should be updated");
    console.log("✅ Test 5 PASSED: product name updated successfully");

    // --------------------------------------------------
    // TEST 6: updateProduct - product not found → 404
    // --------------------------------------------------
    console.log("👉 Test 6: updateProduct - product not found → 404");
    console.log(`   [Request] POST /api/admin/catalog`);
    console.log(`   [Body] { action: "updateProduct", productId: "__test__non-existent-id", ... }`);
    const notFoundRes = await adminFetch("/api/admin/catalog", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateProduct",
        productId: "__test__non-existent-id",
        patch: testProduct({ id: "__test__non-existent-id" }),
      }),
    });
    console.log(`   [Response] Status: ${notFoundRes.status}`);
    console.log(`   [Assert] Checking status === 404`);
    assertEqual(notFoundRes.status, 404, "updateProduct on non-existent product should return 404");
    console.log("✅ Test 6 PASSED: updateProduct on non-existent ID returns 404");

    // --------------------------------------------------
    // TEST 7: deleteProduct - success
    // --------------------------------------------------
    console.log("👉 Test 7: deleteProduct - success");
    console.log(`   [Request] POST /api/admin/catalog`);
    console.log(`   [Body] { action: "deleteProduct", productId: "${TEST_PRODUCT_ID}" }`);
    const deleteRes = await adminFetch("/api/admin/catalog", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteProduct", productId: TEST_PRODUCT_ID }),
    });
    console.log(`   [Response] Status: ${deleteRes.status}`);
    assertEqual(deleteRes.status, 200, "deleteProduct should return 200");
    const deleteBody = await deleteRes.json();
    console.log(`   [Assert] Checking response ok === true`);
    assert(deleteBody.ok === true, "deleteProduct response should have ok:true");
    console.log(`   [Assert] Checking product is gone from catalog`);
    const stillThere = deleteBody.catalog.find((p) => p.id === TEST_PRODUCT_ID);
    assert(stillThere === undefined, "Deleted product should not appear in catalog");
    const afterCount = deleteBody.catalog.length;
    console.log(`   [Assert] Checking catalog count matches initialCount (${initialCount})`);
    assertEqual(afterCount, initialCount, "Catalog count should be back to original after delete");
    console.log("✅ Test 7 PASSED: product deleted, catalog restored to original size");

    // --------------------------------------------------
    // TEST 8: Invalid action → 400
    // --------------------------------------------------
    console.log("👉 Test 8: Invalid action → 400");
    console.log(`   [Request] POST /api/admin/catalog`);
    console.log(`   [Body] { action: "deleteEverything" }`);
    const badActionRes = await adminFetch("/api/admin/catalog", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteEverything" }),
    });
    console.log(`   [Response] Status: ${badActionRes.status}`);
    console.log(`   [Assert] Checking status === 400`);
    assertEqual(badActionRes.status, 400, "Invalid action should return 400");
    console.log("✅ Test 8 PASSED: invalid action rejected (400)");

    console.log("\n🎉 test-06-catalog: all tests passed.");

  } finally {
    // Safety cleanup
    console.log("🧹 Performing safety cleanup of test products from catalog...");
    if (session) {
      await cleanupTestProduct(session).catch(() => {});
      console.log(`   [DB] Deleting session for token: ${session.token.substring(0, 8)}...`);
      await deleteTestAdminSession(session.token);
    }
  }
}
