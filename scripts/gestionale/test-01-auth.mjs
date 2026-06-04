/**
 * @file test-01-auth.mjs
 * @description Test dei meccanismi di autenticazione amministrativa e delle difese CSRF del gestionale.
 */

import { fileURLToPath } from "url";
import {
  createTestAdminSession,
  deleteTestAdminSession,
  adminFetch,
  assert,
  assertEqual,
  closePrisma,
} from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function run() {
  console.log("👉 Running Test 01: Admin Authentication and CSRF Guards");

  // Step 1: Unauthenticated request to admin API should return 401
  console.log("   - Case 1: Fetching /api/admin/settings without session");
  console.log("     [Request] GET /api/admin/settings (No session cookies or headers)");
  const resNoAuth = await adminFetch("/api/admin/settings", null, { method: "GET" });
  console.log(`     [Response] Status: ${resNoAuth.status}`);
  console.log(`     [Assert] Checking status === 401`);
  assertEqual(resNoAuth.status, 401, "Expected 401 Unauthorized for unauthenticated GET");
  console.log("     ✅ Case 1 passed: Unauthenticated request blocked correctly");

  // Step 2: Failed login request
  console.log("   - Case 2: Attempting login with invalid credentials");
  console.log(`     [Request] POST ${BASE_URL}/api/auth/login`);
  console.log(`     [Body] { email: "invalid@example.com", password: "wrong-password" }`);
  const resBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "invalid@example.com", password: "wrong-password" }),
  });
  console.log(`     [Response] Status: ${resBadLogin.status}`);
  console.log(`     [Assert] Checking status === 401`);
  assertEqual(resBadLogin.status, 401, "Expected 401 Unauthorized for invalid credentials");
  console.log("     ✅ Case 2 passed: Invalid credentials login rejected correctly");

  // Step 3: Create a mock admin session in database
  console.log("   - Case 3: Generating test admin session in DB");
  const sessionData = await createTestAdminSession();
  console.log(`     [DB] Created AdminSession row with:`);
  console.log(`       - Token (Raw): ${sessionData.token.substring(0, 10)}...`);
  console.log(`       - CSRF (Raw): ${sessionData.csrf.substring(0, 10)}...`);
  console.log(`       - Session ID in DB: ${sessionData.session.id}`);
  assert(sessionData.token, "Token should be generated");
  assert(sessionData.csrf, "CSRF token should be generated");
  console.log("     ✅ Case 3 passed: Mock admin session created in database");

  try {
    // Step 4: Authenticated GET request (bypasses CSRF check)
    console.log("   - Case 4: Fetching /api/admin/settings with session token (GET - CSRF bypassed)");
    console.log(`     [Request] GET /api/admin/settings`);
    console.log(`     [Cookies] admin_session=${sessionData.token.substring(0, 8)}...`);
    const resAuthGet = await adminFetch("/api/admin/settings", sessionData, { method: "GET" });
    console.log(`     [Response] Status: ${resAuthGet.status}`);
    console.log(`     [Assert] Checking status === 200`);
    assertEqual(resAuthGet.status, 200, "Expected 200 OK for authenticated GET request");
    console.log("     ✅ Case 4 passed: Authenticated GET request succeeded");

    // Step 5: Authenticated POST request with missing/incorrect CSRF token/header
    console.log("   - Case 5: Fetching /api/admin/settings without CSRF headers (POST - CSRF enforced)");
    console.log(`     [Request] POST /api/admin/settings`);
    console.log(`     [Cookies] admin_session=${sessionData.token.substring(0, 8)}...`);
    console.log(`     [Cookies] admin_csrf=wrong-csrf-token`);
    console.log(`     [Headers] x-csrf-token = wrong-csrf-token`);
    const badSessionData = { token: sessionData.token, csrf: "wrong-csrf-token" };
    const resAuthPostNoCsrf = await adminFetch("/api/admin/settings", badSessionData, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: {} }),
    });
    console.log(`     [Response] Status: ${resAuthPostNoCsrf.status}`);
    console.log(`     [Assert] Checking status === 403`);
    assertEqual(resAuthPostNoCsrf.status, 403, "Expected 403 Forbidden when CSRF fails");
    console.log("     ✅ Case 5 passed: Request rejected with 403 due to mismatched/missing CSRF");

    // Step 6: Authenticated POST request with correct CSRF token/header (but empty body)
    console.log("   - Case 6: Fetching /api/admin/settings with CSRF headers (POST)");
    console.log(`     [Request] POST /api/admin/settings`);
    console.log(`     [Cookies] admin_session=${sessionData.token.substring(0, 8)}...`);
    console.log(`     [Cookies] admin_csrf=${sessionData.csrf.substring(0, 8)}...`);
    console.log(`     [Headers] x-csrf-token = ${sessionData.csrf.substring(0, 8)}...`);
    console.log(`     [Body] { values: {} }`);
    const resAuthPostWithCsrf = await adminFetch("/api/admin/settings", sessionData, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: {} }),
    });
    console.log(`     [Response] Status: ${resAuthPostWithCsrf.status}`);
    console.log(`     [Assert] Checking status is 200 or 400 (auth guard passed, body validation checked)`);
    assert(
      resAuthPostWithCsrf.status === 200 || resAuthPostWithCsrf.status === 400,
      `Expected 200 or 400, got ${resAuthPostWithCsrf.status}`
    );
    console.log(`     ✅ Case 6 passed: Authentication and CSRF guards passed with status ${resAuthPostWithCsrf.status}`);

  } finally {
    // Step 7: Call the logout API endpoint to invalidate the session and the cache
    console.log("   - Case 7: Calling /api/auth/logout to revoke session");
    console.log(`     [Request] POST /api/auth/logout`);
    try {
      const resLogout = await adminFetch("/api/auth/logout", sessionData, { method: "POST" });
      console.log(`     [Response] Status: ${resLogout.status}`);
      console.log(`     [Assert] Checking status === 200`);
      assertEqual(resLogout.status, 200, "Expected 200 OK for logout");
      console.log(`     ✅ Session logout API returned success`);
    } catch (e) {
      console.warn("     ⚠️ Warning: Logout API call failed, but will proceed with DB cleanup. Error:", e.message);
    }

    // Step 7.5: Clean up the test session from the database
    console.log("   - Cleanup: Deleting test session from DB");
    console.log(`     [DB] Deleting session with token hash corresponding to: ${sessionData.token.substring(0, 8)}...`);
    await deleteTestAdminSession(sessionData.token);
    console.log("     ✅ Session deleted from database");
  }

  // Step 8: Post-cleanup verification (should return 401 again)
  console.log("   - Case 8: Fetching /api/admin/settings using revoked token");
  console.log(`     [Request] GET /api/admin/settings (using the deleted token)`);
  const resRevoked = await adminFetch("/api/admin/settings", sessionData, { method: "GET" });
  console.log(`     [Response] Status: ${resRevoked.status}`);
  console.log(`     [Assert] Checking status === 401`);
  assertEqual(resRevoked.status, 401, "Expected 401 Unauthorized for revoked session");
  console.log("     ✅ Case 8 passed: Request blocked with 401 using revoked session");

  console.log("✅ Test 01: Admin Authentication and CSRF Guards PASSED\n");
}

// Support running the file directly
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  run()
    .then(async () => {
      await closePrisma();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Test 01 FAILED:", err);
      await closePrisma();
      process.exit(1);
    });
}
