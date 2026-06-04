/**
 * @file test-08-tastings.mjs
 * @description Test delle API di gestione dello stato delle degustazioni (tastings).
 * Verifica le transizioni di stato per le prenotazioni (PENDING → CONFIRMED → CANCELED → PENDING),
 * il comportamento con parametri non validi o ID inesistenti e i controlli di sicurezza.
 */

import { createTestAdminSession, deleteTestAdminSession, adminFetch, getPrisma, assert, assertEqual } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function createTestTastingBooking(prisma) {
  // Random offset to avoid unique constraint (slotStart, slotEnd) on repeated test runs
  const offset = Math.floor(Math.random() * 1000000) * 1000;
  const slotStart = new Date(Date.now() + 7 * 24 * 3600 * 1000 + offset);
  const slotEnd = new Date(slotStart.getTime() + 2 * 3600 * 1000);
  const now = new Date();

  // Use raw SQL to avoid the `children` column that is in schema.prisma
  // but does not exist in the live DB (migration mismatch).
  await prisma.$executeRaw`
    INSERT INTO "TastingBooking" (id, status, "slotStart", "slotEnd", "tastingType", people, "fullName", email, phone, "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid()::text,
      'PENDING',
      ${slotStart},
      ${slotEnd},
      'VINO',
      2,
      'Test Tastings User',
      'test-tastings@gestionale.local',
      '+390000000000',
      ${now},
      ${now}
    )
  `;

  // Retrieve the record with raw SQL to avoid the missing `children` column
  const rows = await prisma.$queryRaw`
    SELECT id, status::text as status
    FROM "TastingBooking"
    WHERE email = 'test-tastings@gestionale.local'
      AND "slotStart" = ${slotStart}
    ORDER BY "createdAt" DESC
    LIMIT 1
  `;
  return rows[0];
}

export async function run() {
  const db = getPrisma();
  let session;
  let bookingId;

  try {
    session = await createTestAdminSession();

    // Create a booking to manipulate
    const booking = await createTestTastingBooking(db);
    bookingId = booking.id;

    // --------------------------------------------------
    // TEST 1: Auth guard - no session
    // --------------------------------------------------
    console.log("👉 Test 1: Fetching POST /api/admin/tastings/status without session");
    console.log(`   [Request] POST ${BASE_URL}/api/admin/tastings/status`);
    console.log(`   [Body] { id: "${bookingId}", status: "CONFIRMED" }`);
    const noAuth = await fetch(`${BASE_URL}/api/admin/tastings/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, status: "CONFIRMED" }),
    });
    console.log(`   [Response] Status: ${noAuth.status}`);
    console.log(`   [Assert] Checking status === 401`);
    assert(noAuth.status === 401, `Unauthenticated POST should return 401 (got ${noAuth.status})`);
    console.log("✅ Test 1 PASSED: unauthenticated request blocked (401)");

    // --------------------------------------------------
    // TEST 2: Invalid body (missing id) → 400
    // --------------------------------------------------
    console.log("👉 Test 2: Invalid body (missing id) → 400");
    console.log(`   [Request] POST /api/admin/tastings/status`);
    console.log(`   [Body] { status: "CONFIRMED" }`);
    const badBody = await adminFetch("/api/admin/tastings/status", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    console.log(`   [Response] Status: ${badBody.status}`);
    console.log(`   [Assert] Checking status === 400`);
    assertEqual(badBody.status, 400, "Missing id should return 400");
    console.log("✅ Test 2 PASSED: invalid body (missing id) rejected (400)");

    // --------------------------------------------------
    // TEST 3: Non-existent booking → 404
    // --------------------------------------------------
    console.log("👉 Test 3: Non-existent booking → 404");
    console.log(`   [Request] POST /api/admin/tastings/status`);
    console.log(`   [Body] { id: "non-existent-booking-id-xyz", status: "CONFIRMED" }`);
    const notFoundRes = await adminFetch("/api/admin/tastings/status", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "non-existent-booking-id-xyz", status: "CONFIRMED" }),
    });
    console.log(`   [Response] Status: ${notFoundRes.status}`);
    console.log(`   [Assert] Checking status === 404`);
    assertEqual(notFoundRes.status, 404, "Non-existent booking should return 404");
    console.log("✅ Test 3 PASSED: non-existent booking returns 404");

    // --------------------------------------------------
    // TEST 4: PENDING → CONFIRMED
    // --------------------------------------------------
    console.log("👉 Test 4: PENDING → CONFIRMED");
    console.log(`   [Request] POST /api/admin/tastings/status`);
    console.log(`   [Body] { id: "${bookingId}", status: "CONFIRMED" }`);
    const confirmRes = await adminFetch("/api/admin/tastings/status", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, status: "CONFIRMED" }),
    });
    console.log(`   [Response] Status: ${confirmRes.status}`);
    assertEqual(confirmRes.status, 200, "CONFIRMED transition should return 200");
    const confirmBody = await confirmRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(confirmBody));
    console.log(`   [Assert] Checking response ok === true`);
    assert(confirmBody.ok === true, "Confirm response should have ok:true");
    console.log(`   [Assert] Checking response.status === "CONFIRMED"`);
    assertEqual(confirmBody.status, "CONFIRMED", "Booking status should be CONFIRMED");
    console.log("✅ Test 4 PASSED: tasting PENDING → CONFIRMED");

    // --------------------------------------------------
    // TEST 5: CONFIRMED → CANCELED
    // --------------------------------------------------
    console.log("👉 Test 5: CONFIRMED → CANCELED");
    console.log(`   [Request] POST /api/admin/tastings/status`);
    console.log(`   [Body] { id: "${bookingId}", status: "CANCELED" }`);
    const cancelRes = await adminFetch("/api/admin/tastings/status", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, status: "CANCELED" }),
    });
    console.log(`   [Response] Status: ${cancelRes.status}`);
    assertEqual(cancelRes.status, 200, "CANCELED transition should return 200");
    const cancelBody = await cancelRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(cancelBody));
    console.log(`   [Assert] Checking response.status === "CANCELED"`);
    assertEqual(cancelBody.status, "CANCELED", "Booking status should be CANCELED");
    console.log("✅ Test 5 PASSED: tasting CONFIRMED → CANCELED");

    // --------------------------------------------------
    // TEST 6: CANCELED → PENDING (restore, no mail expected)
    // --------------------------------------------------
    console.log("👉 Test 6: CANCELED → PENDING (restore, no mail expected)");
    console.log(`   [Request] POST /api/admin/tastings/status`);
    console.log(`   [Body] { id: "${bookingId}", status: "PENDING" }`);
    const restoreRes = await adminFetch("/api/admin/tastings/status", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, status: "PENDING" }),
    });
    console.log(`   [Response] Status: ${restoreRes.status}`);
    assertEqual(restoreRes.status, 200, "Restore to PENDING should return 200");
    const restoreBody = await restoreRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(restoreBody));
    console.log(`   [Assert] Checking response.status === "PENDING"`);
    assertEqual(restoreBody.status, "PENDING", "Booking status should be restored to PENDING");
    console.log("✅ Test 6 PASSED: tasting CANCELED → PENDING (restore, no mail)");

    // --------------------------------------------------
    // TEST 7: Verify final DB state
    // --------------------------------------------------
    console.log("👉 Test 7: Verify final DB state");
    console.log(`   [DB Query] SELECT status FROM "TastingBooking" WHERE id = "${bookingId}" LIMIT 1`);
    const dbRows = await db.$queryRaw`SELECT status FROM "TastingBooking" WHERE id = ${bookingId} LIMIT 1`;
    console.log(`   [DB Result]`, JSON.stringify(dbRows));
    console.log(`   [Assert] Checking dbRows.length === 1`);
    assert(dbRows.length === 1, "Booking should exist in DB");
    console.log(`   [Assert] Checking dbRows[0].status === "PENDING"`);
    assertEqual(dbRows[0].status, "PENDING", "DB booking should be PENDING after restore");
    console.log("✅ Test 7 PASSED: DB state verified — booking is PENDING");

    console.log("\n🎉 test-08-tastings: all tests passed.");

  } finally {
    // Cleanup test booking
    console.log("🧹 Cleaning up tasting test resources...");
    if (bookingId) {
      console.log(`   [DB] Deleting TastingBooking row: ${bookingId}`);
      await db.$executeRaw`DELETE FROM "TastingBooking" WHERE id = ${bookingId}`.catch(() => {});
    }
    if (session) {
      console.log(`   [DB] Deleting session for token: ${session.token.substring(0, 8)}...`);
      await deleteTestAdminSession(session.token);
    }
  }
}
