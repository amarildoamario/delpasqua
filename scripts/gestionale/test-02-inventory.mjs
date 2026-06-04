/**
 * @file test-02-inventory.mjs
 * @description Test delle operazioni di gestione dell'inventario e di aggiornamento stock dei prodotti.
 */

import { fileURLToPath } from "url";
import {
  createTestAdminSession,
  deleteTestAdminSession,
  adminFetch,
  assert,
  assertEqual,
  getPrisma,
  closePrisma,
} from "./utils.mjs";

export async function run() {
  console.log("👉 Running Test 02: Admin Inventory Operations");

  const sessionData = await createTestAdminSession();
  const db = getPrisma();
  const testSku1 = "test-only-sku-1";
  const testSku2 = "test-only-sku-2";

  try {
    // 0. Ensure clean state
    console.log(`   - Setup: Cleaning up any pre-existing mock SKU entries (${testSku1}, ${testSku2}) from DB`);
    const deleteCount = await db.inventoryItem.deleteMany({ where: { sku: { in: [testSku1, testSku2] } } });
    console.log(`     [DB] Deleted ${deleteCount.count} existing mock inventory records`);

    // 1. Set inventory using POST /api/admin/inventory (action: set)
    console.log(`   - Case 1: Setting stock of ${testSku1} to 150 units`);
    console.log(`     [Request] POST /api/admin/inventory`);
    console.log(`     [Body] { action: "set", sku: "${testSku1}", stock: 150 }`);
    const setRes = await adminFetch("/api/admin/inventory", sessionData, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "set",
        sku: testSku1,
        stock: 150,
      }),
    });
    console.log(`     [Response] Status: ${setRes.status}`);
    assertEqual(setRes.status, 200, "Expected 200 OK for setting inventory");
    const setJson = await setRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(setJson));
    console.log(`     [Assert] checking response ok === true`);
    assertEqual(setJson.ok, true, "Response ok should be true");
    console.log(`     [Assert] checking response item.sku === "${testSku1}"`);
    assertEqual(setJson.item.sku, testSku1, "SKU should match");
    console.log(`     [Assert] checking response item.stock === 150`);
    assertEqual(setJson.item.stock, 150, "Stock should be 150");
    console.log(`     ✅ Case 1 passed: Stock set successfully`);

    // 2. Retrieve stock using GET /api/admin/inventory?skus=...
    console.log(`   - Case 2: Fetching stock for SKU ${testSku1}`);
    console.log(`     [Request] GET /api/admin/inventory?skus=${testSku1}`);
    const getRes = await adminFetch(`/api/admin/inventory?skus=${testSku1}`, sessionData, {
      method: "GET",
    });
    console.log(`     [Response] Status: ${getRes.status}`);
    assertEqual(getRes.status, 200, "Expected 200 OK for retrieving inventory");
    const getJson = await getRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(getJson));
    console.log(`     [Assert] checking response ok === true`);
    assertEqual(getJson.ok, true, "Response ok should be true");
    console.log(`     [Assert] checking key "${testSku1}" exists in items`);
    assert(getJson.items[testSku1], "Sku entry should exist");
    console.log(`     [Assert] checking items["${testSku1}"].stock === 150`);
    assertEqual(getJson.items[testSku1].stock, 150, "Fetched stock should match expected (150)");
    console.log(`     ✅ Case 2 passed: Fetched stock matches expectation`);

    // 3. Adjust inventory using POST /api/admin/inventory (action: adjust)
    console.log(`   - Case 3: Adjusting stock of ${testSku1} by -40 units (delta)`);
    console.log(`     [Request] POST /api/admin/inventory`);
    console.log(`     [Body] { action: "adjust", sku: "${testSku1}", delta: -40 }`);
    const adjustRes = await adminFetch("/api/admin/inventory", sessionData, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adjust",
        sku: testSku1,
        delta: -40,
      }),
    });
    console.log(`     [Response] Status: ${adjustRes.status}`);
    assertEqual(adjustRes.status, 200, "Expected 200 OK for adjusting inventory");
    const adjustJson = await adjustRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(adjustJson));
    console.log(`     [Assert] checking response item.stock === 110 (150 - 40)`);
    assertEqual(adjustJson.item.stock, 110, "Stock should be 110 after adjustment");
    console.log(`     ✅ Case 3 passed: Stock adjusted correctly`);

    // 4. Bulk set multiple SKUs (action: bulkSet)
    console.log(`   - Case 4: Bulk setting stock for ${testSku1} (80) and ${testSku2} (200)`);
    console.log(`     [Request] POST /api/admin/inventory`);
    console.log(`     [Body] { action: "bulkSet", items: [{ sku: "${testSku1}", stock: 80 }, { sku: "${testSku2}", stock: 200 }] }`);
    const bulkRes = await adminFetch("/api/admin/inventory", sessionData, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "bulkSet",
        items: [
          { sku: testSku1, stock: 80 },
          { sku: testSku2, stock: 200 },
        ],
      }),
    });
    console.log(`     [Response] Status: ${bulkRes.status}`);
    assertEqual(bulkRes.status, 200, "Expected 200 OK for bulk setting inventory");
    const bulkJson = await bulkRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(bulkJson));
    console.log(`     ✅ Case 4 passed: Bulk inventory set executed`);

    // 5. Verify bulk results
    console.log("   - Case 5: Verifying bulk settings");
    console.log(`     [Request] GET /api/admin/inventory?skus=${testSku1},${testSku2}`);
    const verifyRes = await adminFetch(`/api/admin/inventory?skus=${testSku1},${testSku2}`, sessionData, {
      method: "GET",
    });
    console.log(`     [Response] Status: ${verifyRes.status}`);
    assertEqual(verifyRes.status, 200, "Expected 200 OK");
    const verifyJson = await verifyRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(verifyJson));
    console.log(`     [Assert] checking items["${testSku1}"].stock === 80`);
    assertEqual(verifyJson.items[testSku1].stock, 80, `Expected 80 stock for ${testSku1}`);
    console.log(`     [Assert] checking items["${testSku2}"].stock === 200`);
    assertEqual(verifyJson.items[testSku2].stock, 200, `Expected 200 stock for ${testSku2}`);
    console.log(`     ✅ Case 5 passed: Bulk settings verified successfully`);

  } finally {
    // Cleanup: Delete mock items and revoke session
    console.log("   - Cleanup: Removing test inventory items and test session");
    console.log(`     [DB] Deleting inventory item rows for: ${testSku1}, ${testSku2}`);
    const cleanInv = await db.inventoryItem.deleteMany({ where: { sku: { in: [testSku1, testSku2] } } }).catch(() => {});
    console.log(`     [DB] Cleaned up inventory rows count: ${cleanInv?.count ?? 0}`);
    console.log(`     [Request] Revoking test session via POST /api/auth/logout`);
    await adminFetch("/api/auth/logout", sessionData, { method: "POST" }).catch(() => {});
    console.log(`     [DB] Deleting session record`);
    await deleteTestAdminSession(sessionData.token).catch(() => {});
    console.log(`     ✅ Cleanup finished`);
  }

  console.log("✅ Test 02: Admin Inventory Operations PASSED\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  run()
    .then(async () => {
      await closePrisma();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Test 02 FAILED:", err);
      await closePrisma();
      process.exit(1);
    });
}
