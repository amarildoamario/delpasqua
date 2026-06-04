/**
 * @file test-03-promotions.mjs
 * @description Test delle operazioni amministrative sulle promozioni (creazione, aggiornamento, attivazione/disattivazione e rimozione codici sconto).
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
  console.log("👉 Running Test 03: Admin Promotions Operations");

  const sessionData = await createTestAdminSession();
  const db = getPrisma();
  const testPromoCode = "PROMO_TEST_AUTO";

  try {
    // 0. Ensure clean state
    console.log(`   - Setup: Cleaning up any pre-existing mock promotion with code ${testPromoCode} from DB`);
    const deleteCount = await db.promotion.deleteMany({ where: { code: testPromoCode } });
    console.log(`     [DB] Deleted ${deleteCount.count} existing mock promotions`);

    // 1. Create a promotion using POST /api/admin/promotions
    console.log(`   - Case 1: Creating promo code ${testPromoCode} (10% off)`);
    console.log(`     [Request] POST /api/admin/promotions`);
    console.log(`     [Body] { code: "${testPromoCode}", percent: 10, type: "percent", ... }`);
    const createRes = await adminFetch("/api/admin/promotions", sessionData, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: testPromoCode,
        description: "Automated test promo code",
        type: "percent",
        percent: 10,
        amountCents: null,
        freeShipping: false,
        minOrderCents: 1500,
        usageLimit: 100,
        isActive: true,
      }),
    });
    console.log(`     [Response] Status: ${createRes.status}`);
    assertEqual(createRes.status, 200, "Expected 200 OK for creating promotion");
    const createJson = await createRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(createJson));
    console.log(`     [Assert] checking response ok === true`);
    assertEqual(createJson.ok, true, "Response ok should be true");
    console.log(`     [Assert] checking promo.code === "${testPromoCode}"`);
    assertEqual(createJson.promo.code, testPromoCode, "Promo code should match");
    console.log(`     [Assert] checking promo.percent === 10`);
    assertEqual(createJson.promo.percent, 10, "Percent should be 10");

    const promoId = createJson.promo.id;
    console.log(`     [Assert] checking promo.id is generated`);
    assert(promoId, "Promotion ID should be returned");
    console.log(`     ✅ Case 1 passed: Promotion created successfully via API`);

    // 2. Verify creation in database
    console.log("   - Case 2: Reading created promo code from DB");
    console.log(`     [DB Query] db.promotion.findUnique({ where: { id: "${promoId}" } })`);
    const promoFromDb = await db.promotion.findUnique({ where: { id: promoId } });
    console.log(`     [DB Result]`, JSON.stringify(promoFromDb));
    console.log(`     [Assert] checking promo exists in DB`);
    assert(promoFromDb, "Promo should exist in DB");
    console.log(`     [Assert] checking DB code === "${testPromoCode}"`);
    assertEqual(promoFromDb.code, testPromoCode, "DB code should match");
    console.log(`     [Assert] checking DB percent === 10`);
    assertEqual(promoFromDb.percent, 10, "DB percent should match");
    console.log(`     [Assert] checking DB isActive === true`);
    assertEqual(promoFromDb.isActive, true, "DB isActive should be true");
    console.log(`     ✅ Case 2 passed: Promotion record verified in database`);

    // 3. Update the promotion using PUT /api/admin/promotions/[id]
    console.log(`   - Case 3: Disabling promo code ${testPromoCode} and updating details`);
    console.log(`     [Request] PUT /api/admin/promotions/${promoId}`);
    console.log(`     [Body] { isActive: false, description: "...", percent: 15 }`);
    const updateRes = await adminFetch(`/api/admin/promotions/${promoId}`, sessionData, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isActive: false,
        description: "Updated description via automated test",
        percent: 15,
      }),
    });
    console.log(`     [Response] Status: ${updateRes.status}`);
    assertEqual(updateRes.status, 200, "Expected 200 OK for updating promotion");
    const updateJson = await updateRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(updateJson));
    console.log(`     [Assert] checking response isActive === false`);
    assertEqual(updateJson.isActive, false, "Promotion should be deactivated");
    console.log(`     [Assert] checking response percent === 15`);
    assertEqual(updateJson.percent, 15, "Promotion percent should be updated to 15");
    console.log(`     ✅ Case 3 passed: Promotion updated successfully via API`);

    // 4. Verify updates in DB
    console.log("   - Case 4: Checking updated values in DB");
    console.log(`     [DB Query] db.promotion.findUnique({ where: { id: "${promoId}" } })`);
    const updatedFromDb = await db.promotion.findUnique({ where: { id: promoId } });
    console.log(`     [DB Result]`, JSON.stringify(updatedFromDb));
    console.log(`     [Assert] checking DB isActive === false`);
    assertEqual(updatedFromDb.isActive, false, "DB isActive should be updated to false");
    console.log(`     [Assert] checking DB percent === 15`);
    assertEqual(updatedFromDb.percent, 15, "DB percent should be updated to 15");
    console.log(`     [Assert] checking DB description matches updated description`);
    assertEqual(updatedFromDb.description, "Updated description via automated test", "Description should match");
    console.log(`     ✅ Case 4 passed: Updated values verified in database`);

    // 5. Delete the promotion using DELETE /api/admin/promotions/[id]
    console.log(`   - Case 5: Deleting promo code ${testPromoCode}`);
    console.log(`     [Request] DELETE /api/admin/promotions/${promoId}`);
    const deleteRes = await adminFetch(`/api/admin/promotions/${promoId}`, sessionData, {
      method: "DELETE",
    });
    console.log(`     [Response] Status: ${deleteRes.status}`);
    assertEqual(deleteRes.status, 200, "Expected 200 OK for deletion");
    const deleteJson = await deleteRes.json();
    console.log(`     [Response JSON]`, JSON.stringify(deleteJson));
    console.log(`     [Assert] checking response ok === true`);
    assertEqual(deleteJson.ok, true, "Delete response should be ok: true");
    console.log(`     ✅ Case 5 passed: Promotion deleted successfully via API`);

    // 6. Verify deletion from DB
    console.log("   - Case 6: Verifying promotion is gone from DB");
    console.log(`     [DB Query] db.promotion.findUnique({ where: { id: "${promoId}" } })`);
    const deletedFromDb = await db.promotion.findUnique({ where: { id: promoId } });
    console.log(`     [Assert] checking DB record is null`);
    assert(!deletedFromDb, "Promo code should be deleted from DB");
    console.log(`     ✅ Case 6 passed: Promotion is confirmed deleted in database`);

  } finally {
    // Cleanup: Ensure test promo code is removed and session is revoked
    console.log("   - Cleanup: Ensuring promo code is deleted and test session revoked");
    console.log(`     [DB] Deleting promotion row with code ${testPromoCode}`);
    const cleanDb = await db.promotion.deleteMany({ where: { code: testPromoCode } }).catch(() => {});
    console.log(`     [DB] Cleaned up promotions count: ${cleanDb?.count ?? 0}`);
    console.log(`     [Request] Revoking test session via POST /api/auth/logout`);
    await adminFetch("/api/auth/logout", sessionData, { method: "POST" }).catch(() => {});
    console.log(`     [DB] Deleting session record`);
    await deleteTestAdminSession(sessionData.token).catch(() => {});
    console.log(`     ✅ Cleanup finished`);
  }

  console.log("✅ Test 03: Admin Promotions Operations PASSED\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  run()
    .then(async () => {
      await closePrisma();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Test 03 FAILED:", err);
      await closePrisma();
      process.exit(1);
    });
}
