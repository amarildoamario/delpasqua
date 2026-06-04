/**
 * @file populate-dashboard-data.mjs
 * @description Popola il database con dati demo realistici (ordini, articoli, eventi e analytics)
 * distribuiti negli ultimi 30 giorni. Tutti i dati generati sono tracciati con email che terminano
 * in "@delpasqua.demo" e visitorId che iniziano con "demo_vis_" in modo da poter essere
 * eliminati in blocco usando il flag "--clean" (oppure con il comando npm run dashboard:clear-demo).
 */

import { createRequire } from "module";
import crypto from "crypto";
import { getPrisma, closePrisma } from "./utils.mjs";

const require = createRequire(import.meta.url);
const fs = require("fs");
const path = require("path");

const COUNTRIES = ["IT", "US", "DE", "FR", "GB", "NL", "ES"];
const STATUSES = ["PAGATO", "IN_PREPARAZIONE", "SPEDITO", "CONSEGNATO", "ANNULLATO", "IN_ATTESA"];
const ORDER_STATUS_DB = {
  IN_ATTESA: "PENDING",
  PAGATO: "PAID",
  IN_PREPARAZIONE: "PREPARING",
  SPEDITO: "SHIPPED",
  CONSEGNATO: "DELIVERED",
  ANNULLATO: "CANCELED",
  RIMBORSATO: "REFUNDED",
  PARZIALMENTE_RIMBORSATO: "PARTIALLY_REFUNDED",
  SCADUTO: "EXPIRED",
  FALLITO: "FAILED",
};
const PAYMENT_METHODS = [
  { provider: "stripe", label: "Visa **** 4242" },
  { provider: "stripe", label: "Mastercard **** 4444" },
  { provider: "stripe", label: "Apple Pay" },
  { provider: "stripe", label: "Google Pay" },
];
const SHIPPING_NOTES = [
  null,
  null,
  "Lasciare il pacco al vicino se assente.",
  "Citofono scala B.",
  "Consegna preferibilmente nel pomeriggio.",
  "Chiamare 10 minuti prima della consegna.",
];
const ADDRESS_PRESETS = {
  IT: [
    { city: "Arezzo", province: "AR", postalCode: "52100", street: "Via Guido Monaco", phonePrefix: "+39 333 71" },
    { city: "Firenze", province: "FI", postalCode: "50123", street: "Via de' Tornabuoni", phonePrefix: "+39 333 72" },
  ],
  US: [
    { city: "New York", province: "NY", postalCode: "10001", street: "West 34th Street", phonePrefix: "+1 212 555 01" },
    { city: "Austin", province: "TX", postalCode: "78701", street: "Congress Ave", phonePrefix: "+1 512 555 01" },
  ],
  DE: [
    { city: "Berlin", province: "BE", postalCode: "10115", street: "Friedrichstrasse", phonePrefix: "+49 1512 55" },
    { city: "Munich", province: "BY", postalCode: "80331", street: "Sendlinger Strasse", phonePrefix: "+49 1512 56" },
  ],
  FR: [
    { city: "Paris", province: "IDF", postalCode: "75008", street: "Rue du Faubourg Saint-Honore", phonePrefix: "+33 6 44 10" },
    { city: "Lyon", province: "ARA", postalCode: "69002", street: "Rue de Brest", phonePrefix: "+33 6 44 20" },
  ],
  GB: [
    { city: "London", province: "LND", postalCode: "SW1A 1AA", street: "Victoria Street", phonePrefix: "+44 7700 90" },
    { city: "Manchester", province: "MAN", postalCode: "M1 1AE", street: "Deansgate", phonePrefix: "+44 7700 91" },
  ],
  NL: [
    { city: "Amsterdam", province: "NH", postalCode: "1012 JS", street: "Prinsengracht", phonePrefix: "+31 6 18 20" },
    { city: "Rotterdam", province: "ZH", postalCode: "3011 AA", street: "Coolsingel", phonePrefix: "+31 6 18 30" },
  ],
  ES: [
    { city: "Madrid", province: "MD", postalCode: "28013", street: "Gran Via", phonePrefix: "+34 612 88" },
    { city: "Barcelona", province: "CT", postalCode: "08002", street: "Carrer de Ferran", phonePrefix: "+34 612 89" },
  ],
};

// Load products to use real data
const rawCatalog = fs.readFileSync(path.join(process.cwd(), "src", "db", "products.json"), "utf8");
const catalog = JSON.parse(rawCatalog);

function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function calcIncludedVatCents(amountCents, rate = 0.04) {
  return Math.round((amountCents * rate) / (1 + rate));
}

function buildShippingProfile(country) {
  const presets = ADDRESS_PRESETS[country] ?? ADDRESS_PRESETS.IT;
  const preset = pick(presets);
  const addressLine1 = `${preset.street} ${randInt(1, 180)}`;
  const addressLine2 = Math.random() < 0.25 ? `Interno ${randInt(1, 12)}` : null;
  return {
    addressLine1,
    addressLine2,
    address: [addressLine1, addressLine2].filter(Boolean).join(", "),
    city: preset.city,
    province: preset.province,
    postalCode: preset.postalCode,
    zip: preset.postalCode,
    countryCode: country,
    phone: `${preset.phonePrefix}${randInt(1000, 9999)}`,
    shippingNotes: pick(SHIPPING_NOTES),
  };
}

async function cleanData(db) {
  console.log("🧹 Cleaning up previously populated demo dashboard data...");

  // Delete OrderEvents linked to demo orders
  const eventClean = await db.orderEvent.deleteMany({
    where: {
      order: {
        email: { endsWith: "@delpasqua.demo" }
      }
    }
  });
  console.log(`   - Deleted ${eventClean.count} OrderEvent rows`);

  // Delete InventoryReservations linked to demo orders
  const resClean = await db.inventoryReservation.deleteMany({
    where: {
      order: {
        email: { endsWith: "@delpasqua.demo" }
      }
    }
  });
  console.log(`   - Deleted ${resClean.count} InventoryReservation rows`);

  // Delete OrderItems linked to demo orders
  const itemClean = await db.orderItem.deleteMany({
    where: {
      order: {
        email: { endsWith: "@delpasqua.demo" }
      }
    }
  });
  console.log(`   - Deleted ${itemClean.count} OrderItem rows`);

  // Delete demo orders
  const orderClean = await db.order.deleteMany({
    where: {
      email: { endsWith: "@delpasqua.demo" }
    }
  });
  console.log(`   - Deleted ${orderClean.count} Order rows`);

  // Delete demo analytics events
  const analyticsClean = await db.analyticsEvent.deleteMany({
    where: {
      visitorId: { startsWith: "demo_vis_" }
    }
  });
  console.log(`   - Deleted ${analyticsClean.count} AnalyticsEvent rows`);

  // Delete any lingering demo outbox events
  const outboxClean = await db.outboxEvent.deleteMany({
    where: {
      payload: {
        path: ["orderId"],
        string_contains: "demo_ord_"
      }
    }
  });
  console.log(`   - Deleted ${outboxClean.count} OutboxEvent rows`);

  console.log("✅ Cleanup complete!");
}

async function populateData(db) {
  console.log("🚀 Starting simulation & database population for dashboard demo...");

  let orderCounter = 1000;
  const now = new Date();

  let totalOrdersCreated = 0;
  let totalRevenueCents = 0;
  let totalEventsCreated = 0;

  // Let's populate data over the last 30 days
  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - daysAgo);

    // Randomize time of day slightly
    dayDate.setHours(randInt(8, 22), randInt(0, 59), randInt(0, 59));

    // Simulate between 5 and 15 visitors per day
    const visitorsCount = randInt(5, 15);
    console.log(`   📅 Day -${daysAgo} (${dayDate.toISOString().split("T")[0]}): Simulating ${visitorsCount} visitors...`);

    for (let v = 0; v < visitorsCount; v++) {
      const visitorId = `demo_vis_${crypto.randomUUID()}`;
      const sessionId = `demo_ses_${crypto.randomUUID()}`;
      const country = pick(COUNTRIES);
      const isBot = Math.random() < 0.15;
      const device = isBot ? "bot" : pick(["mobile", "desktop", "tablet"]);

      // 1. Analytics Events (Page Views and Product Views)
      const pageViewsCount = randInt(1, 4);
      for (let p = 0; p < pageViewsCount; p++) {
        const pageDate = new Date(dayDate);
        pageDate.setMinutes(dayDate.getMinutes() + p * 3);

        const paths = ["/", "/shop", "/cart", "/about", "/checkout", "/blog/benvenuti"];
        const pathChosen = pick(paths);

        await db.analyticsEvent.create({
          data: {
            type: "page_view",
            visitorId,
            sessionId,
            path: pathChosen,
            device,
            env: "prod",
            isInternal: false,
            createdAt: pageDate,
            data: {
              meta: {
                schema: "analytics-meta-v1",
                source: isBot ? "playwright" : "web",
                trafficType: isBot ? "bot" : "real",
                env: "prod",
                isInternal: false,
                device,
                countryCode: country
              }
            }
          }
        });
        totalEventsCreated++;
      }

      // Product views
      const productViewsCount = randInt(1, 3);
      for (let pr = 0; pr < productViewsCount; pr++) {
        const prodDate = new Date(dayDate);
        prodDate.setMinutes(dayDate.getMinutes() + pr * 5);
        const product = pick(catalog);

        await db.analyticsEvent.create({
          data: {
            type: "product_view",
            visitorId,
            sessionId,
            path: `/shop/${product.slug}`,
            productKey: product.id,
            device,
            env: "prod",
            isInternal: false,
            createdAt: prodDate,
            data: {
              meta: {
                schema: "analytics-meta-v1",
                source: isBot ? "playwright" : "web",
                trafficType: isBot ? "bot" : "real",
                env: "prod",
                isInternal: false,
                device,
                countryCode: country
              }
            }
          }
        });
        totalEventsCreated++;
      }

      // 2. Decide if this visitor performs a purchase (bot does not buy, only real users)
      if (!isBot && Math.random() < 0.25) {
        // Yes, purchase!
        const status = pick(STATUSES);
        const dbStatus = ORDER_STATUS_DB[status];
        const orderId = `demo_ord_${crypto.randomUUID()}`;
        const stripeSessionId = `cs_demo_${crypto.randomUUID()}`;
        const stripePaymentIntentId = `pi_demo_${crypto.randomUUID()}`;
        const idempotencyKey = `ikey_demo_${crypto.randomUUID()}`;
        const orderPublicToken = crypto.randomUUID().replace(/-/g, "");
        const shipping = buildShippingProfile(country);
        const isPaidLike = ["PAGATO", "IN_PREPARAZIONE", "SPEDITO", "CONSEGNATO"].includes(status);
        const payment = isPaidLike ? pick(PAYMENT_METHODS) : null;

        // Choose 1 to 3 order items
        const itemCount = randInt(1, 3);
        let subtotalCents = 0;
        let vatCents = 0;
        const itemsToCreate = [];

        for (let i = 0; i < itemCount; i++) {
          const product = pick(catalog);
          const variant = pick(product.variants);
          const qty = randInt(1, 3);
          const priceCents = variant.priceCents || 1500;
          const lineTotal = priceCents * qty;
          const lineVatCents = calcIncludedVatCents(lineTotal);

          subtotalCents += lineTotal;
          vatCents += lineVatCents;

          itemsToCreate.push({
            id: `demo_item_${crypto.randomUUID()}`,
            productId: product.id,
            variantId: variant.id,
            sku: variant.sku || `${product.id}:${variant.id}`,
            title: product.title,
            variantLabel: variant.label || variant.id,
            unitPriceCents: priceCents,
            qty,
            lineTotalCents: lineTotal,
            lineSubtotalCents: lineTotal,
            lineDiscountCents: 0,
            lineVatCents,
            lineTaxCents: 0
          });
        }

        const shippingCents = subtotalCents > 5000 ? 0 : 600;
        const totalCents = subtotalCents + shippingCents;

        // Canceled checkouts might have null orderNumber
        const isCanceledCheckout = status === "ANNULLATO" && Math.random() < 0.5;
        const orderNumber = isCanceledCheckout ? null : `DEMO-2026-${String(orderCounter++).padStart(4, "0")}`;

        const purchaseDate = new Date(dayDate);
        purchaseDate.setMinutes(dayDate.getMinutes() + 15);

        // Insert Order
        await db.$executeRaw`
          INSERT INTO "Order" (
            id,
            "idempotencyKey",
            status,
            "orderNumber",
            "orderPublicToken",
            currency,
            "subtotalCents",
            "vatCents",
            "shippingCents",
            "totalCents",
            "fullName",
            email,
            address,
            city,
            zip,
            "addressLine1",
            "addressLine2",
            province,
            "postalCode",
            "countryCode",
            phone,
            "shippingNotes",
            "stripeSessionId",
            "stripePaymentIntentId",
            "stripeFeeCents",
            "paymentProvider",
            "paymentMethod",
            "createdAt",
            "updatedAt",
            "paidAt",
            "shippedAt",
            "deliveredAt"
          ) VALUES (
            ${orderId},
            ${idempotencyKey},
            ${dbStatus},
            ${orderNumber},
            ${orderPublicToken},
            ${"EUR"},
            ${subtotalCents},
            ${vatCents},
            ${shippingCents},
            ${totalCents},
            ${`Demo Buyer ${totalOrdersCreated + 1}`},
            ${`buyer-${totalOrdersCreated + 1}@delpasqua.demo`},
            ${shipping.address},
            ${shipping.city},
            ${shipping.zip},
            ${shipping.addressLine1},
            ${shipping.addressLine2},
            ${shipping.province},
            ${shipping.postalCode},
            ${country},
            ${shipping.phone},
            ${shipping.shippingNotes},
            ${stripeSessionId},
            ${stripePaymentIntentId},
            ${Math.round(totalCents * 0.015 + 25)},
            ${payment?.provider ?? "stripe"},
            ${payment?.label ?? null},
            ${purchaseDate},
            ${purchaseDate},
            ${isPaidLike ? purchaseDate : null},
            ${["SPEDITO", "CONSEGNATO"].includes(status) ? new Date(purchaseDate.getTime() + 24 * 3600 * 1000) : null},
            ${status === "CONSEGNATO" ? new Date(purchaseDate.getTime() + 48 * 3600 * 1000) : null}
          )
        `;

        // Insert Order Items
        for (const item of itemsToCreate) {
          await db.orderItem.create({
            data: {
              ...item,
              orderId
            }
          });
        }

        // Insert Order Events
        await db.orderEvent.create({
          data: {
            orderId,
            type: "ORDER_CREATED",
            actor: "system_demo",
            message: "Ordine demo inserito dal simulatore",
            createdAt: purchaseDate
          }
        });

        if (isPaidLike) {
          await db.orderEvent.create({
            data: {
              orderId,
              type: "STRIPE_CHECKOUT_COMPLETED",
              actor: "stripe_webhook",
              message: "Pagamento registrato correttamente via Stripe Webhook",
              createdAt: purchaseDate
            }
          });
        }

        totalOrdersCreated++;
        if (isPaidLike) {
          totalRevenueCents += totalCents;
        }
      }
    }
  }

  console.log("\n==================================================");
  console.log("📊 DEMO POPULATION SUMMARY");
  console.log("==================================================");
  console.log(`` + `✅ Total Analytics Events Created: ${totalEventsCreated}`);
  console.log(`✅ Total Demo Orders Created:      ${totalOrdersCreated}`);
  console.log(`✅ Total Paid Revenue Simulated:   ${(totalRevenueCents / 100).toFixed(2)} €`);
  console.log("==================================================");
  console.log("💡 all demo data has email ending in '@delpasqua.demo'");
  console.log("💡 all analytics events start with visitorId: 'demo_vis_'");
  console.log("👉 run 'npm run dashboard:clear-demo' to wipe out this data");
  console.log("==================================================\n");
}

async function main() {
  const db = getPrisma();
  const clean = process.argv.includes("--clean");

  try {
    if (clean) {
      await cleanData(db);
    } else {
      // First clean to avoid accumulative duplications
      await cleanData(db);
      console.log("");
      await populateData(db);
    }
  } catch (err) {
    console.error("❌ Fatal error during population script execution:", err);
    process.exit(1);
  } finally {
    await closePrisma();
    process.exit(0);
  }
}

main();
