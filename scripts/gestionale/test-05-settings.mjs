/**
 * @file test-05-settings.mjs
 * @description Test delle API delle impostazioni (settings) del gestionale.
 * Verifica il recupero della mappa chiave-valore delle impostazioni, la creazione e l'aggiornamento (upsert)
 * delle configurazioni generali del negozio, la convalida del corpo della richiesta e i controlli di sicurezza.
 */

import { createTestAdminSession, deleteTestAdminSession, adminFetch, getPrisma, assert, assertEqual } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const TEST_KEY = "__gestionale_test_setting__";

export async function run() {
  const db = getPrisma();
  let session;

  try {
    session = await createTestAdminSession();
    console.log(`[DB] Created test admin session. Token: ${session.token.substring(0, 8)}...`);

    // --------------------------------------------------
    // TEST 1: Unauthenticated GET should fail
    // --------------------------------------------------
    console.log("👉 Test 1: Fetching GET /api/admin/settings without session");
    console.log(`   [Request] GET ${BASE_URL}/api/admin/settings`);
    const noAuth = await fetch(`${BASE_URL}/api/admin/settings`);
    console.log(`   [Response] Status: ${noAuth.status}`);
    console.log(`   [Assert] Checking status === 401`);
    assertEqual(noAuth.status, 401, "Unauthenticated GET /settings should return 401");
    console.log("✅ Test 1 PASSED: unauthenticated GET blocked (401)");

    // --------------------------------------------------
    // TEST 2: GET returns a key-value map
    // --------------------------------------------------
    console.log("👉 Test 2: GET returns a key-value map");
    console.log(`   [Request] GET /api/admin/settings`);
    const getRes = await adminFetch("/api/admin/settings", session, { method: "GET" });
    console.log(`   [Response] Status: ${getRes.status}`);
    assertEqual(getRes.status, 200, "Authenticated GET /settings should return 200");
    const getBody = await getRes.json();
    console.log(`   [Response JSON] Keys found: ${Object.keys(getBody).join(", ") || "(none)"}`);
    console.log(`   [Assert] checking type of body is object`);
    assert(typeof getBody === "object" && !Array.isArray(getBody), "Settings should be a plain object map");
    console.log(`✅ Test 2 PASSED: GET settings returned ${Object.keys(getBody).length} key(s)`);

    // --------------------------------------------------
    // TEST 3: POST invalid body → 400
    // --------------------------------------------------
    console.log("👉 Test 3: POST invalid body → 400");
    console.log(`   [Request] POST /api/admin/settings`);
    console.log(`   [Body] { values: "NOT_AN_OBJECT" }`);
    const badBody = await adminFetch("/api/admin/settings", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: "NOT_AN_OBJECT" }),
    });
    console.log(`   [Response] Status: ${badBody.status}`);
    console.log(`   [Assert] checking status === 400`);
    assertEqual(badBody.status, 400, "Invalid body should return 400");
    console.log("✅ Test 3 PASSED: invalid body rejected (400)");

    // --------------------------------------------------
    // TEST 4: POST valid settings upsert
    // --------------------------------------------------
    console.log("👉 Test 4: POST valid settings upsert");
    console.log(`   [Request] POST /api/admin/settings`);
    console.log(`   [Body] { values: { "${TEST_KEY}": "valore-di-test" } }`);
    const postRes = await adminFetch("/api/admin/settings", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: { [TEST_KEY]: "valore-di-test" } }),
    });
    console.log(`   [Response] Status: ${postRes.status}`);
    assertEqual(postRes.status, 200, "Valid POST /settings should return 200");
    const postBody = await postRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(postBody));
    console.log(`   [Assert] checking response ok === true`);
    assert(postBody.ok === true, "POST response should have ok:true");
    console.log("✅ Test 4 PASSED: setting upserted successfully");

    // --------------------------------------------------
    // TEST 5: Verify setting was actually written to DB
    // --------------------------------------------------
    console.log("👉 Test 5: Verify setting was actually written to DB");
    console.log(`   [DB Query] db.setting.findUnique({ where: { key: "${TEST_KEY}" } })`);
    const dbSetting = await db.setting.findUnique({ where: { key: TEST_KEY } });
    console.log(`   [DB Result]`, JSON.stringify(dbSetting));
    console.log(`   [Assert] checking setting !== null`);
    assert(dbSetting !== null, "Setting should exist in DB after upsert");
    console.log(`   [Assert] checking dbSetting.value === "valore-di-test"`);
    assertEqual(dbSetting.value, "valore-di-test", "DB value should match what was sent");
    console.log("✅ Test 5 PASSED: setting persisted correctly in DB");

    // --------------------------------------------------
    // TEST 6: POST overwrite same key
    // --------------------------------------------------
    console.log("👉 Test 6: POST overwrite same key");
    console.log(`   [Request] POST /api/admin/settings`);
    console.log(`   [Body] { values: { "${TEST_KEY}": "valore-aggiornato" } }`);
    const overwriteRes = await adminFetch("/api/admin/settings", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: { [TEST_KEY]: "valore-aggiornato" } }),
    });
    console.log(`   [Response] Status: ${overwriteRes.status}`);
    assertEqual(overwriteRes.status, 200, "Overwrite POST should return 200");
    console.log(`   [DB Query] db.setting.findUnique({ where: { key: "${TEST_KEY}" } })`);
    const dbUpdated = await db.setting.findUnique({ where: { key: TEST_KEY } });
    console.log(`   [DB Result]`, JSON.stringify(dbUpdated));
    console.log(`   [Assert] checking dbUpdated.value === "valore-aggiornato"`);
    assertEqual(dbUpdated.value, "valore-aggiornato", "DB value should be updated after overwrite");
    console.log("✅ Test 6 PASSED: setting overwritten correctly");

    console.log("\n🎉 test-05-settings: all tests passed.");

  } finally {
    // Cleanup test setting from DB
    console.log("🧹 Cleaning up settings test resources...");
    console.log(`   [DB] Deleting setting keys like: ${TEST_KEY}`);
    const cleanSet = await db.setting.deleteMany({ where: { key: TEST_KEY } }).catch(() => {});
    console.log(`   [DB] Cleaned setting count: ${cleanSet?.count ?? 0}`);
    if (session) {
      console.log(`   [DB] Deleting session for token: ${session.token.substring(0, 8)}...`);
      await deleteTestAdminSession(session.token);
    }
  }
}
