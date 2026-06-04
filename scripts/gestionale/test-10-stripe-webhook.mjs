/**
 * @file test-10-stripe-webhook.mjs
 * @description Test di integrazione dei webhook di Stripe.
 * Simula l'evento "checkout.session.completed" di Stripe firmando il payload,
 * invia la richiesta all'endpoint /api/webhooks/stripe e verifica la corretta transizione dell'ordine da
 * IN_ATTESA a PAGATO e il collegamento dell'intent di pagamento.
 */

import crypto from "crypto";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import { getPrisma, closePrisma, randomToken, assert, assertEqual } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function createTestOrder(prisma, orderId, stripeSessionId) {
  const ikey = `test-stripe-ord-${randomToken(16)}`;
  const now = new Date();

  // Insert mock order that corresponds to the stripe session
  await prisma.$executeRaw`
    INSERT INTO "Order" (
      id, "idempotencyKey", status, currency,
      "subtotalCents", "vatCents", "shippingCents", "totalCents",
      "fullName", email, address, city, zip, "updatedAt",
      "stripeSessionId"
    ) VALUES (
      ${orderId}, ${ikey}, 'PENDING', 'EUR',
      1800, 200, 0, 2000,
      'Stripe Webhook Buyer', 'stripe-bot@gestionale.local',
      'Stripe Street 42', 'StripeCity', '12345', ${now},
      ${stripeSessionId}
    )
  `;
}

async function deleteTestOrder(prisma, orderId) {
  await prisma.$executeRaw`DELETE FROM "OrderEvent" WHERE "orderId" = ${orderId}`;
  await prisma.$executeRaw`DELETE FROM "InventoryReservation" WHERE "orderId" = ${orderId}`;
  await prisma.$executeRaw`DELETE FROM "Order" WHERE id = ${orderId}`;
}

export async function run() {
  console.log("👉 Running Test 10: Stripe Webhook Simulator");

  const db = getPrisma();
  const testOrderId = `ord_test_${crypto.randomUUID()}`;
  const testSessionId = `cs_test_${crypto.randomUUID()}`;
  const testIntentId = `pi_test_${crypto.randomUUID()}`;

  try {
    // 0. Setup state
    console.log("   - Setup: Creating test IN_ATTESA order in DB...");
    await createTestOrder(db, testOrderId, testSessionId);
    console.log(`     [DB] Created Order ID: ${testOrderId} with stripeCheckoutSessionId: ${testSessionId}`);

    // 1. Construct Mock Stripe Event
    console.log("   - Case 1: Constructing checkout.session.completed event");
    const stripeEvent = {
      id: `evt_test_${crypto.randomUUID()}`,
      object: "event",
      type: "checkout.session.completed",
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      data: {
        object: {
          id: testSessionId,
          object: "checkout.session",
          payment_status: "paid",
          payment_intent: testIntentId,
          payment_method_types: ["card"],
          customer_details: {
            email: "stripe-bot@gestionale.local",
            name: "Stripe Webhook Buyer",
            phone: "+393333333333",
            address: {
              line1: "Stripe Street 42",
              line2: null,
              city: "StripeCity",
              state: "StripeState",
              postal_code: "12345",
              country: "IT"
            }
          },
          metadata: {
            orderId: testOrderId
          }
        }
      }
    };

    const payloadString = JSON.stringify(stripeEvent);

    // 2. Generate stripe signature header
    console.log("   - Case 2: Signing Stripe payload with webhook secret");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    });

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: process.env.STRIPE_WEBHOOK_SECRET,
      timestamp: Math.floor(Date.now() / 1000),
    });

    console.log(`     [Signature] x-stripe-signature: ${signature.substring(0, 40)}...`);

    // 3. Post to webhook endpoint
    console.log("   - Case 3: Sending signature verified POST to /api/webhooks/stripe");
    const res = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": signature
      },
      body: payloadString
    });

    console.log(`     [Response] Status: ${res.status}`);
    const json = await res.json();
    console.log(`     [Response JSON]`, JSON.stringify(json));
    
    console.log(`     [Assert] checking response status === 200`);
    assertEqual(res.status, 200, "Webhook endpoint should process request successfully");
    console.log(`     [Assert] checking response received === true`);
    assertEqual(json.received, true, "Response should have received: true");

    // 4. Verify DB order transition to PAGATO
    console.log("   - Case 4: Checking order status transition in DB");
    console.log(`     [DB Query] SELECT status, "stripePaymentIntentId" FROM "Order" WHERE id = "${testOrderId}"`);
    const dbRows = await db.$queryRaw`SELECT status::text as status, "stripePaymentIntentId" FROM "Order" WHERE id = ${testOrderId}`;
    console.log(`     [DB Result]`, JSON.stringify(dbRows));

    console.log(`     [Assert] Checking status === "PAID"`);
    assertEqual(dbRows[0].status, "PAID", "Order status should be updated to PAID");
    console.log(`     [Assert] Checking stripePaymentIntentId === "${testIntentId}"`);
    assertEqual(dbRows[0].stripePaymentIntentId, testIntentId, "Payment Intent ID should be linked");

    console.log("     ✅ Order successfully transitioned to PAGATO via simulated webhook");

  } finally {
    // 5. Cleanup order and webhook event logs
    console.log("🧹 Cleaning up webhook simulation database rows...");
    console.log(`   [DB] Deleting order and events for ID: ${testOrderId}`);
    await deleteTestOrder(db, testOrderId).catch(() => {});
    console.log(`   [DB] Deleting StripeWebhookEvent rows for cs_test session`);
    await db.$executeRaw`DELETE FROM "StripeWebhookEvent" WHERE "sessionId" = ${testSessionId}`.catch(() => {});
    await db.$executeRaw`DELETE FROM "StripeWebhookEvent" WHERE "eventId" LIKE 'evt_test_%'`.catch(() => {});
    console.log("   ✅ Cleanup complete");
  }

  console.log("✅ Test 10: Stripe Webhook Simulator PASSED\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  run()
    .then(async () => {
      await closePrisma();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Test 10 FAILED:", err);
      await closePrisma();
      process.exit(1);
    });
}
