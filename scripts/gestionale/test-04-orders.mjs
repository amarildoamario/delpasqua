/**
 * @file test-04-orders.mjs
 * @description Test delle API di gestione degli ordini del gestionale admin.
 * Verifica le transizioni di stato consentite e bloccate (es. IN_ATTESA → PAGATO → IN_PREPARAZIONE → SPEDITO → CONSEGNATO),
 * l'annullamento e il ripristino di un ordine, l'aggiornamento dei metadati (note, contrassegno di rischio, risk score)
 * e i relativi controlli di autenticazione.
 */

import crypto from "crypto";
import { createTestAdminSession, deleteTestAdminSession, adminFetch, getPrisma, assert, assertEqual, randomToken } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";


async function createTestOrder(prisma, randomToken) {
  const id = crypto.randomUUID();
  const ikey = `test-order-${randomToken(16)}`;
  const now = new Date();

  // Use raw SQL to bypass the `promotionCode` column in schema.prisma
  // that was never added to the live DB via a migration.
  await prisma.$executeRaw`
    INSERT INTO "Order" (
      id, "idempotencyKey", status, currency,
      "subtotalCents", "vatCents", "shippingCents", "totalCents",
      "fullName", email, address, city, zip, "updatedAt"
    ) VALUES (
      ${id}, ${ikey}, 'PENDING', 'EUR',
      900, 100, 0, 1000,
      'Test Orders', 'test-orders@gestionale.local',
      'Via Test 1', 'TestCity', '00100', ${now}
    )
  `;

  return { id };
}

async function createTestPaidOrder(prisma, randomToken) {
  const id = crypto.randomUUID();
  const ikey = `test-order-${randomToken(16)}`;
  const orderNumber = `DP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();

  await prisma.$executeRaw`
    INSERT INTO "Order" (
      id, "idempotencyKey", status, currency,
      "subtotalCents", "vatCents", "shippingCents", "totalCents",
      "fullName", email, address, city, zip, "updatedAt", "orderNumber"
    ) VALUES (
      ${id}, ${ikey}, 'PAID', 'EUR',
      900, 100, 0, 1000,
      'Test Progress Flow', 'test-progress@gestionale.local',
      'Via Test 2', 'TestCity2', '00200', ${now}, ${orderNumber}
    )
  `;

  return { id, orderNumber };
}

async function deleteTestOrder(prisma, orderId) {
  // Use raw SQL - prisma.order.delete() also tries to SELECT promotionCode
  await prisma.$executeRaw`DELETE FROM "OrderEvent" WHERE "orderId" = ${orderId}`;
  await prisma.$executeRaw`DELETE FROM "InventoryReservation" WHERE "orderId" = ${orderId}`;
  await prisma.$executeRaw`DELETE FROM "Order" WHERE id = ${orderId}`;
}

export async function run() {
  const db = getPrisma();
  let session;
  let testOrderId;
  let progressOrderId;

  try {
    session = await createTestAdminSession();
    const order = await createTestOrder(db, randomToken);
    testOrderId = order.id;

    // --------------------------------------------------
    // TEST 1: Auth guard - no session
    // --------------------------------------------------
    console.log("👉 Test 1: Fetching PATCH /api/admin/orders/[id]/status without session");
    console.log(`   [Request] PATCH ${BASE_URL}/api/admin/orders/${testOrderId}/status`);
    console.log(`   [Body] { status: "PAGATO" }`);
    const noAuth = await fetch(`${BASE_URL}/api/admin/orders/${testOrderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAGATO" }),
    });
    console.log(`   [Response] Status: ${noAuth.status}`);
    console.log(`   [Assert] checking status === 401`);
    assertEqual(noAuth.status, 401, "Unauthenticated PATCH should return 401");
    console.log("✅ Test 1 PASSED: unauthenticated request blocked (401)");

    // --------------------------------------------------
    // TEST 2: Update metadata (notes, isFlagged, riskScore) without status change
    // --------------------------------------------------
    console.log("👉 Test 2: Update metadata (notes, isFlagged, riskScore) without status change");
    console.log(`   [Request] PATCH /api/admin/orders/${testOrderId}/status`);
    console.log(`   [Body] { notes: "Ordine di test", isFlagged: true, riskScore: 42 }`);
    const metaRes = await adminFetch(`/api/admin/orders/${testOrderId}/status`, session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "Ordine di test", isFlagged: true, riskScore: 42 }),
    });
    console.log(`   [Response] Status: ${metaRes.status}`);
    assertEqual(metaRes.status, 200, "Metadata update should return 200");
    const metaBody = await metaRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(metaBody));
    console.log(`   [Assert] checking response ok === true`);
    assert(metaBody.ok === true, "Metadata response should have ok:true");
    console.log(`   [Assert] checking response order.notes === "Ordine di test"`);
    assert(metaBody.order.notes === "Ordine di test", "Notes should be updated");
    console.log(`   [Assert] checking response order.isFlagged === true`);
    assert(metaBody.order.isFlagged === true, "isFlagged should be true");
    console.log(`   [Assert] checking response order.riskScore === 42`);
    assert(metaBody.order.riskScore === 42, "riskScore should be 42");
    console.log("✅ Test 2 PASSED: metadata updated (notes, isFlagged, riskScore)");

    // --------------------------------------------------
    // TEST 3: Invalid transition IN_ATTESA → CONSEGNATO (not allowed)
    // --------------------------------------------------
    console.log("👉 Test 3: Invalid transition IN_ATTESA → CONSEGNATO (not allowed)");
    console.log(`   [Request] PATCH /api/admin/orders/${testOrderId}/status`);
    console.log(`   [Body] { status: "CONSEGNATO" }`);
    const badTransition = await adminFetch(`/api/admin/orders/${testOrderId}/status`, session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONSEGNATO" }),
    });
    console.log(`   [Response] Status: ${badTransition.status}`);
    console.log(`   [Assert] checking status === 400`);
    assert(badTransition.status === 400, `Invalid transition should return 400 (got ${badTransition.status})`);
    console.log("✅ Test 3 PASSED: invalid transition IN_ATTESA→CONSEGNATO rejected (400)");

    // --------------------------------------------------
    // TEST 4: Valid transition IN_ATTESA → ANNULLATO
    // --------------------------------------------------
    console.log("👉 Test 4: Valid transition IN_ATTESA → ANNULLATO");
    console.log(`   [Request] PATCH /api/admin/orders/${testOrderId}/status`);
    console.log(`   [Body] { status: "ANNULLATO", actor: "test-suite", message: "Cancellato dal test" }`);
    const cancelRes = await adminFetch(`/api/admin/orders/${testOrderId}/status`, session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ANNULLATO", actor: "test-suite", message: "Cancellato dal test" }),
    });
    console.log(`   [Response] Status: ${cancelRes.status}`);
    assertEqual(cancelRes.status, 200, "ANNULLATO transition should return 200");
    const cancelBody = await cancelRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(cancelBody));
    console.log(`   [Assert] checking order status in response is "ANNULLATO"`);
    assertEqual(cancelBody.order.status, "ANNULLATO", "Order status should be ANNULLATO");
    console.log("✅ Test 4 PASSED: order ANNULLATO successfully");

    // --------------------------------------------------
    // TEST 5: Restore an ANNULLATO order
    // --------------------------------------------------
    console.log("👉 Test 5: Restore an ANNULLATO order");
    console.log(`   [Request] PATCH /api/admin/orders/${testOrderId}/status`);
    console.log(`   [Body] { restore: true, actor: "test-suite" }`);
    const restoreRes = await adminFetch(`/api/admin/orders/${testOrderId}/status`, session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restore: true, actor: "test-suite" }),
    });
    console.log(`   [Response] Status: ${restoreRes.status}`);
    assertEqual(restoreRes.status, 200, "Restore should return 200");
    const restoreBody = await restoreRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(restoreBody));
    console.log(`   [Assert] checking response ok === true`);
    assert(restoreBody.ok === true, "Restore response should have ok:true");
    console.log(`   [Assert] checking response order.status !== "ANNULLATO"`);
    assert(restoreBody.order.status !== "ANNULLATO", "Restored order should not be ANNULLATO");
    console.log(`✅ Test 5 PASSED: order restored to status=${restoreBody.order.status}`);

    // --------------------------------------------------
    // TEST 6: Refund endpoint returns 400 with special error code
    // --------------------------------------------------
    console.log("👉 Test 6: Refund endpoint returns 400 with special error code");
    console.log(`   [Request] PATCH /api/admin/orders/${testOrderId}/status`);
    console.log(`   [Body] { status: "RIMBORSATO" }`);
    const refundRes = await adminFetch(`/api/admin/orders/${testOrderId}/status`, session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RIMBORSATO" }),
    });
    console.log(`   [Response] Status: ${refundRes.status}`);
    assertEqual(refundRes.status, 400, "RIMBORSATO status should return 400");
    const refundBody = await refundRes.json();
    console.log(`   [Response JSON]`, JSON.stringify(refundBody));
    console.log(`   [Assert] checking response.error === "USE_STRIPE_REFUND_ENDPOINT"`);
    assert(refundBody.error === "USE_STRIPE_REFUND_ENDPOINT", "Should return USE_STRIPE_REFUND_ENDPOINT code");
    console.log("✅ Test 6 PASSED: RIMBORSATO status blocked, redirects to Stripe endpoint");

    // --------------------------------------------------
    // TEST 7: Order events were created
    // --------------------------------------------------
    console.log("👉 Test 7: Order events were created");
    console.log(`   [DB Query] SELECT id FROM "OrderEvent" WHERE "orderId" = "${testOrderId}"`);
    const events = await db.$queryRaw`SELECT id FROM "OrderEvent" WHERE "orderId" = ${testOrderId}`;
    console.log(`   [DB Result] Found ${events.length} order event(s)`);
    console.log(`   [Assert] checking events.length >= 2`);
    assert(events.length >= 2, `Expected at least 2 order events, got ${events.length}`);
    console.log(`✅ Test 7 PASSED: ${events.length} order events logged correctly`);

    // --------------------------------------------------
    // TEST 8: Full order status progression flow (PAGATO -> IN_PREPARAZIONE -> SPEDITO -> CONSEGNATO)
    // --------------------------------------------------
    console.log("👉 Test 8: Full order status progression flow (PAGATO -> IN_PREPARAZIONE -> SPEDITO -> CONSEGNATO)");
    const paidOrder = await createTestPaidOrder(db, randomToken);
    progressOrderId = paidOrder.id;

    // 1. Transition PAGATO → IN_PREPARAZIONE
    console.log(`   [Request] PATCH /api/admin/orders/${progressOrderId}/status`);
    console.log(`   [Body] { status: "IN_PREPARAZIONE" }`);
    const prepRes = await adminFetch(`/api/admin/orders/${progressOrderId}/status`, session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "IN_PREPARAZIONE" }),
    });
    console.log(`   [Response] Status: ${prepRes.status}`);
    assertEqual(prepRes.status, 200, "Transition to IN_PREPARAZIONE should return 200");
    const prepBody = await prepRes.json();
    assertEqual(prepBody.order.status, "IN_PREPARAZIONE", "Order status should be IN_PREPARAZIONE");

    // Verify preparingAt is set in DB
    const dbPrepOrder = await db.order.findUnique({ where: { id: progressOrderId } });
    assert(dbPrepOrder.preparingAt !== null, "preparingAt timestamp should be set in DB");
    console.log(`   ✅ Order is in preparation. Timestamp: ${dbPrepOrder.preparingAt}`);

    // 2. Transition IN_PREPARAZIONE → SPEDITO
    console.log(`   [Request] POST /api/admin/orders/${progressOrderId}/ship`);
    console.log(`   [Body] { shipped: true }`);
    const shipRes = await adminFetch(`/api/admin/orders/${progressOrderId}/ship`, session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipped: true, actor: "test-suite" }),
    });
    console.log(`   [Response] Status: ${shipRes.status}`);
    assertEqual(shipRes.status, 200, "Transition to SPEDITO should return 200");
    const shipBody = await shipRes.json();
    assertEqual(shipBody.order.status, "SPEDITO", "Order status should be SPEDITO");

    // Verify shippedAt is set in DB
    const dbShipOrder = await db.order.findUnique({ where: { id: progressOrderId } });
    assert(dbShipOrder.shippedAt !== null, "shippedAt timestamp should be set in DB");
    console.log(`   ✅ Order shipped. Timestamp: ${dbShipOrder.shippedAt}`);

    // 3. Transition SPEDITO → CONSEGNATO
    console.log(`   [Request] PATCH /api/admin/orders/${progressOrderId}/status`);
    console.log(`   [Body] { status: "CONSEGNATO" }`);
    const delivRes = await adminFetch(`/api/admin/orders/${progressOrderId}/status`, session, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONSEGNATO" }),
    });
    console.log(`   [Response] Status: ${delivRes.status}`);
    assertEqual(delivRes.status, 200, "Transition to CONSEGNATO should return 200");
    const delivBody = await delivRes.json();
    assertEqual(delivBody.order.status, "CONSEGNATO", "Order status should be CONSEGNATO");

    // Verify deliveredAt is set in DB
    const dbDelivOrder = await db.order.findUnique({ where: { id: progressOrderId } });
    assert(dbDelivOrder.deliveredAt !== null, "deliveredAt timestamp should be set in DB");
    console.log(`   ✅ Order delivered. Timestamp: ${dbDelivOrder.deliveredAt}`);

    console.log("✅ Test 8 PASSED: full status progression completed and verified");

    // --------------------------------------------------
    // TEST 9: Dashboard page filtering and search
    // --------------------------------------------------
    console.log("👉 Test 9: Dashboard page filtering and search");

    // Fetch the list of orders with the query parameter 'q' targeting our order
    const listPath = `/it/admin/orders?q=${paidOrder.orderNumber}`;
    console.log(`   [Request] GET ${listPath}`);
    const searchRes = await adminFetch(listPath, session);
    console.log(`   [Response] Status: ${searchRes.status}`);
    assertEqual(searchRes.status, 200, "GET orders list with search query should return 200");
    const htmlOutput = await searchRes.text();

    // The returned HTML must contain the order details
    assert(htmlOutput.includes(paidOrder.orderNumber), "Search results should contain the order number");
    assert(htmlOutput.includes("Test Progress Flow"), "Search results should contain the customer name");
    console.log("   ✅ Search by orderNumber / customer name verified");

    // Test search with a non-existent value
    const emptyListPath = `/it/admin/orders?q=non-existent-order-number-xyz`;
    console.log(`   [Request] GET ${emptyListPath}`);
    const emptySearchRes = await adminFetch(emptyListPath, session);
    assertEqual(emptySearchRes.status, 200);
    const emptyHtmlOutput = await emptySearchRes.text();
    assert(!emptyHtmlOutput.includes("Test Progress Flow"), "Empty search results should not contain the customer name");
    assert(emptyHtmlOutput.includes("Nessun ordine trovato"), "Should display empty table message");
    console.log("   ✅ Non-matching query yields empty results verified");

    // Test filter by status
    const statusFilterPath = `/it/admin/orders?status=CONSEGNATO`;
    console.log(`   [Request] GET ${statusFilterPath}`);
    const statusRes = await adminFetch(statusFilterPath, session);
    assertEqual(statusRes.status, 200);
    const statusHtmlOutput = await statusRes.text();
    assert(statusHtmlOutput.includes(paidOrder.orderNumber), "Filtered page for CONSEGNATO should contain our order");

    const wrongStatusFilterPath = `/it/admin/orders?status=PAGATO`;
    console.log(`   [Request] GET ${wrongStatusFilterPath}`);
    const wrongStatusRes = await adminFetch(wrongStatusFilterPath, session);
    assertEqual(wrongStatusRes.status, 200);
    const wrongStatusHtmlOutput = await wrongStatusRes.text();
    assert(!wrongStatusHtmlOutput.includes(paidOrder.orderNumber), "Filtered page for PAGATO should NOT contain our order");
    console.log("   ✅ Filtering by status verified");

    console.log("✅ Test 9 PASSED: dashboard page search and filtering verified");

    console.log("\n🎉 test-04-orders: all tests passed.");

  } finally {
    // Cleanup
    console.log("🧹 Cleaning up after test suite run...");
    if (testOrderId) {
      console.log(`   [DB] Deleting order and dependencies for test order ID: ${testOrderId}`);
      await deleteTestOrder(db, testOrderId);
      console.log(`   ✅ Test order deleted`);
    }
    if (progressOrderId) {
      console.log(`   [DB] Deleting order and dependencies for test order ID: ${progressOrderId}`);
      await deleteTestOrder(db, progressOrderId);
      console.log(`   ✅ Test order deleted`);
    }
    if (session) {
      console.log(`   [DB] Deleting session for token: ${session.token.substring(0, 8)}...`);
      await deleteTestAdminSession(session.token);
      console.log(`   ✅ Session deleted`);
    }
  }
}
