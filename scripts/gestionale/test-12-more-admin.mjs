/**
 * @file test-12-more-admin.mjs
 * @description Test per endpoint amministrativi aggiuntivi e avanzati del gestionale.
 * Verifica la generazione delle fatture in PDF, la visualizzazione HTML per la stampa degli ordini da fare,
 * i report mensili JSON e CSV, e la gestione della coda outbox (recupero e tentativi di retry degli eventi falliti).
 */

import { createTestAdminSession, deleteTestAdminSession, adminFetch, getPrisma, assert, assertEqual } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function run() {
  const db = getPrisma();
  let session;
  let dummyOutboxId = "test-outbox-event-12345";

  try {
    session = await createTestAdminSession();
    console.log(`[DB] Created test admin session. Token: ${session.token.substring(0, 8)}...`);

    // --------------------------------------------------
    // TEST 1: PDF Export Unauthorized vs Authorized
    // --------------------------------------------------
    console.log("👉 Test 1: Fetching GET /api/admin/invoices.pdf (Unauthorized)");
    const pdfUnauth = await fetch(`${BASE_URL}/api/admin/invoices.pdf?mode=shipping`);
    console.log(`   [Response] Status: ${pdfUnauth.status}`);
    assert(pdfUnauth.status === 401 || pdfUnauth.status === 307 || pdfUnauth.status === 403, "Should fail authorization");

    console.log("👉 Test 2: Fetching GET /api/admin/invoices.pdf (Authorized)");
    const pdfAuth = await adminFetch("/api/admin/invoices.pdf?mode=shipping", session);
    console.log(`   [Response] Status: ${pdfAuth.status}`);
    assertEqual(pdfAuth.status, 200, "GET /api/admin/invoices.pdf should succeed");
    const pdfContentType = pdfAuth.headers.get("content-type");
    console.log(`   [Content-Type] ${pdfContentType}`);
    assert(pdfContentType && pdfContentType.includes("application/pdf"), "Should return PDF mimetype");
    const pdfBuffer = await pdfAuth.arrayBuffer();
    console.log(`   [PDF Size] ${pdfBuffer.byteLength} bytes`);
    assert(pdfBuffer.byteLength > 0, "PDF should not be empty");
    console.log("✅ Test 1 & 2 PASSED: PDF invoices security and download verified");

    // --------------------------------------------------
    // TEST 3: Print Todo Export (GET /api/admin/print-todo)
    // --------------------------------------------------
    console.log("👉 Test 3: Fetching GET /api/admin/print-todo (Authorized)");
    const printTodoAuth = await adminFetch("/api/admin/print-todo", session);
    console.log(`   [Response] Status: ${printTodoAuth.status}`);
    assertEqual(printTodoAuth.status, 200, "GET /api/admin/print-todo should succeed");
    const printTodoContentType = printTodoAuth.headers.get("content-type");
    console.log(`   [Content-Type] ${printTodoContentType}`);
    assert(printTodoContentType && printTodoContentType.includes("html"), "Should return HTML content-type");
    const htmlText = await printTodoAuth.text();
    console.log(`   [HTML Preview] First 100 chars: ${htmlText.substring(0, 100).trim()}`);
    assert(htmlText.includes("<!DOCTYPE html>"), "Should return HTML document");
    console.log("✅ Test 3 PASSED: print-todo HTML view verified");

    // --------------------------------------------------
    // TEST 4: Monthly Report JSON (GET /api/admin/report)
    // --------------------------------------------------
    console.log("👉 Test 4: Fetching GET /api/admin/report?month=2026-05 (Authorized)");
    const reportAuth = await adminFetch("/api/admin/report?month=2026-05", session);
    console.log(`   [Response] Status: ${reportAuth.status}`);
    assertEqual(reportAuth.status, 200, "GET /api/admin/report should succeed");
    const reportJson = await reportAuth.json();
    assert(reportJson.ok === true, "JSON ok should be true");
    assert(Array.isArray(reportJson.rows), "rows should be an array");
    console.log(`   [Report Rows Count] ${reportJson.rows.length}`);

    console.log("👉 Test 5: Fetching GET /api/admin/report?month=invalid-date");
    const reportInvalid = await adminFetch("/api/admin/report?month=invalid-date", session);
    console.log(`   [Response] Status: ${reportInvalid.status}`);
    assertEqual(reportInvalid.status, 400, "Should return 400 Bad Request");
    console.log("✅ Test 4 & 5 PASSED: JSON monthly reports verified");

    // --------------------------------------------------
    // TEST 6: Report CSV (GET /api/admin/report.csv)
    // --------------------------------------------------
    console.log("👉 Test 7: Fetching GET /api/admin/report.csv?start=2026-05-01&end=2026-06-01 (Authorized)");
    const csvAuth = await adminFetch("/api/admin/report.csv?start=2026-05-01&end=2026-06-01", session);
    console.log(`   [Response] Status: ${csvAuth.status}`);
    assertEqual(csvAuth.status, 200, "GET /api/admin/report.csv should succeed");
    const csvText = await csvAuth.text();
    console.log(`   [CSV Header] ${csvText.split("\n")[0]}`);
    assert(csvText.includes("orderNumber,status,createdAt,paidAt,fullName,email,totalCents,itemsCount"), "CSV header should contain expected columns");
    console.log("✅ Test 6 PASSED: report CSV verified");

    // --------------------------------------------------
    // TEST 7: Outbox Events list & Retry
    // --------------------------------------------------
    console.log("👉 Test 8: Fetching GET /api/admin/outbox (Authorized)");
    const outboxRes = await adminFetch("/api/admin/outbox?take=10", session);
    console.log(`   [Response] Status: ${outboxRes.status}`);
    assertEqual(outboxRes.status, 200, "GET /api/admin/outbox should succeed");
    const outboxJson = await outboxRes.json();
    assert(Array.isArray(outboxJson.rows), "outbox rows should be an array");

    console.log("👉 Test 9: Posting POST /api/admin/outbox/retry with invalid outboxId");
    const retryInvalid = await adminFetch("/api/admin/outbox/retry", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outboxId: "non-existent-uuid" }),
    });
    console.log(`   [Response] Status: ${retryInvalid.status}`);
    assertEqual(retryInvalid.status, 404, "Invalid outbox ID retry should return 404");

    // Let's create a dummy outbox event to test retry
    console.log("   [DB] Creating dummy failed outbox event...");
    await db.outboxEvent.create({
      data: {
        id: dummyOutboxId,
        type: "ORDER_SYNC",
        payload: { orderId: "test-order-999" },
        status: "failed",
        attempts: 1,
        lastError: "Connection failed",
      },
    });

    console.log("👉 Test 10: Posting POST /api/admin/outbox/retry with valid outboxId");
    const retryValid = await adminFetch("/api/admin/outbox/retry", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outboxId: dummyOutboxId }),
    });
    console.log(`   [Response] Status: ${retryValid.status}`);
    assertEqual(retryValid.status, 200, "Valid outbox retry should return 200");
    const retryJson = await retryValid.json();
    assert(retryJson.ok === true, "Retry response ok should be true");

    // Check DB state
    const updatedEvent = await db.outboxEvent.findUnique({ where: { id: dummyOutboxId } });
    console.log(`   [DB Status] status: ${updatedEvent.status}, lastError: ${updatedEvent.lastError}`);
    // Since processOutboxBatch executes, it might fail/pass depending on payload, but status should be pending or updated
    assert(updatedEvent.status !== "failed", "OutboxEvent status should be updated from 'failed'");

    console.log("✅ Test 7 PASSED: Outbox listing and retry flow verified");

    console.log("\n🎉 test-12-more-admin: all tests passed.");

  } finally {
    console.log("🧹 Cleaning up more-admin test resources...");
    await db.outboxEvent.deleteMany({ where: { id: dummyOutboxId } }).catch(() => {});
    if (session) {
      console.log(`   [DB] Deleting session for token: ${session.token.substring(0, 8)}...`);
      await deleteTestAdminSession(session.token);
    }
  }
}
