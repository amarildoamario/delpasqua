/**
 * @file test-11-exports.mjs
 * @description Test per le funzioni di esportazione contabile e dei dati amministrativi del gestionale.
 * Verifica il corretto scaricamento dei CSV dei clienti e delle spedizioni, l'esportazione delle fatture in formato JSON,
 * e il recupero e l'aggiornamento dei dati e dei valori manuali per la contabilità finanziaria (Leonardo Conti).
 */

import { createTestAdminSession, deleteTestAdminSession, adminFetch, getPrisma, assert, assertEqual } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function run() {
  const db = getPrisma();
  let session;

  try {
    session = await createTestAdminSession();
    console.log(`[DB] Created test admin session. Token: ${session.token.substring(0, 8)}...`);

    // --------------------------------------------------
    // TEST 1: Customers CSV Export (GET /api/admin/customers.csv)
    // --------------------------------------------------
    console.log("👉 Test 1: Fetching GET /api/admin/customers.csv");
    const custRes = await adminFetch("/api/admin/customers.csv", session, { method: "GET" });
    console.log(`   [Response] Status: ${custRes.status}`);
    assertEqual(custRes.status, 200, "GET /customers.csv should return 200");
    const custCsv = await custRes.text();
    console.log(`   [CSV Preview] First 150 chars: ${custCsv.substring(0, 150).replace(/\n/g, " [NL] ")}...`);
    assert(custCsv.includes("email,orders,spentCents"), "CSV should contain customer export headers");
    console.log("✅ Test 1 PASSED: customers CSV exported successfully");

    // --------------------------------------------------
    // TEST 2: Shipping CSV Export (GET /api/admin/shipping.csv)
    // --------------------------------------------------
    console.log("👉 Test 2: Fetching GET /api/admin/shipping.csv");
    const shipRes = await adminFetch("/api/admin/shipping.csv", session, { method: "GET" });
    console.log(`   [Response] Status: ${shipRes.status}`);
    assertEqual(shipRes.status, 200, "GET /shipping.csv should return 200");
    const shipCsv = await shipRes.text();
    console.log(`   [CSV Preview] First 150 chars: ${shipCsv.substring(0, 150).replace(/\n/g, " [NL] ")}...`);
    assert(shipCsv.includes("orderNumber,paidAt,fullName,email,address,city,zip,items"), "CSV should contain shipping export headers");
    console.log("✅ Test 2 PASSED: shipping CSV exported successfully");

    // --------------------------------------------------
    // TEST 3: Invoices JSON Export (GET /api/admin/invoices.json?mode=shipping)
    // --------------------------------------------------
    console.log("👉 Test 3: Fetching GET /api/admin/invoices.json?mode=shipping");
    const invRes = await adminFetch("/api/admin/invoices.json?mode=shipping", session, { method: "GET" });
    console.log(`   [Response] Status: ${invRes.status}`);
    assertEqual(invRes.status, 200, "GET /invoices.json?mode=shipping should return 200");
    const invData = await invRes.json();
    console.log(`   [JSON Response] ok: ${invData.ok}, count: ${invData.count}`);
    assert(invData.ok === true, "Response should be ok");
    assert(Array.isArray(invData.invoices), "invoices field should be an array");
    if (invData.invoices.length > 0) {
      const inv = invData.invoices[0];
      console.log(`   [Sample Invoice] Num: ${inv.invoiceNumber}, Year: ${inv.invoiceYear}, Date: ${inv.invoiceDate}`);
      assert(inv.invoiceNumber, "Invoice should have a number");
      assert(inv.billing, "Invoice should have billing section");
      assert(inv.totalsComputed, "Invoice should have totals computed");
      assert(inv.order, "Invoice should include raw order details");
    }
    console.log("✅ Test 3 PASSED: invoices JSON exported successfully");

    // --------------------------------------------------
    // TEST 4: Leonardo Conti GET (GET /api/admin/conti-leonardo)
    // --------------------------------------------------
    console.log("👉 Test 4: Fetching GET /api/admin/conti-leonardo");
    const contiGet = await adminFetch("/api/admin/conti-leonardo", session, { method: "GET" });
    console.log(`   [Response] Status: ${contiGet.status}`);
    assertEqual(contiGet.status, 200, "GET /conti-leonardo should return 200");
    const contiData = await contiGet.json();
    console.log(`   [Response Keys]`, Object.keys(contiData).join(", "));
    assert(contiData.ok === true, "GET response should be ok");
    assert(typeof contiData.monthsData === "object", "monthsData should be an object");
    assert(typeof contiData.overrides === "object", "overrides should be an object");
    console.log("✅ Test 4 PASSED: Leonardo Conti ledger data retrieved successfully");

    // --------------------------------------------------
    // TEST 5: Leonardo Conti POST (POST /api/admin/conti-leonardo)
    // --------------------------------------------------
    console.log("👉 Test 5: Updating overrides via POST /api/admin/conti-leonardo");
    const mockOverrides = {
      "2026-05": {
        manualGrossCents: 500000,
        manualGlsCents: 10000,
        manualVatCents: 20000,
        manualStripeFeeCents: 7500
      }
    };
    const contiPost = await adminFetch("/api/admin/conti-leonardo", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ overrides: mockOverrides }),
    });
    console.log(`   [Response] Status: ${contiPost.status}`);
    assertEqual(contiPost.status, 200, "POST /conti-leonardo should return 200");
    const postJson = await contiPost.json();
    assert(postJson.ok === true, "POST response should have ok:true");

    // Verify it was saved
    console.log("   [DB Check] Verifying settings table for key 'leonardo_conti_data'");
    const dbVal = await db.setting.findUnique({ where: { key: "leonardo_conti_data" } });
    assert(dbVal !== null, "Setting 'leonardo_conti_data' should be in DB");
    const parsedOverrides = JSON.parse(dbVal.value);
    assertEqual(parsedOverrides["2026-05"].manualGrossCents, 500000, "Saved gross value should match mock");
    console.log("✅ Test 5 PASSED: Leonardo Conti overrides updated and verified in DB");

    console.log("\n🎉 test-11-exports: all tests passed.");

  } finally {
    // Cleanup setting from DB if we set it
    console.log("🧹 Cleaning up exports test resources...");
    await db.setting.deleteMany({ where: { key: "leonardo_conti_data" } }).catch(() => {});
    if (session) {
      console.log(`   [DB] Deleting session for token: ${session.token.substring(0, 8)}...`);
      await deleteTestAdminSession(session.token);
    }
  }
}
