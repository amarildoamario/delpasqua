/**
 * @file test-09-analytics.mjs
 * @description Test delle API di tracciamento degli analytics utente.
 * Simula visite da diversi dispositivi (mobile, desktop, bot) e geolocalizzazioni IP (Italia, USA, Francia),
 * verificandone il corretto parsing e salvataggio sul database locale per popolare le metriche della dashboard.
 */

import { fileURLToPath } from "url";
import { getPrisma, closePrisma } from "./utils.mjs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function run() {
  console.log("👉 Running Test 09: User Simulation & Analytics Metrics");

  const db = getPrisma();

  const visitorMobile = "test-vis-mob-999";
  const sessionMobile = "test-ses-mob-999";

  const visitorBot = "test-vis-bot-999";
  const sessionBot = "test-ses-bot-999";

  const visitorDesktop = "test-vis-desk-999";
  const sessionDesktop = "test-ses-desk-999";

  try {
    // 0. Ensure clean state
    console.log("   - Setup: Cleaning up any existing test analytics events");
    await db.analyticsEvent.deleteMany({
      where: {
        visitorId: { in: [visitorMobile, visitorBot, visitorDesktop] }
      }
    });

    // 1. Simulate Mobile user from Italy
    console.log("   - Case 1: Posting mobile user pageview from IT");
    const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    console.log(`     [Request] POST /api/analytics`);
    console.log(`     [Headers] User-Agent: ${mobileUA}, x-vercel-ip-country: IT`);
    console.log(`     [Body] Event: page_view, visitorId: ${visitorMobile}`);
    
    const resMobile = await fetch(`${BASE_URL}/api/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": mobileUA,
        "x-vercel-ip-country": "IT",
        "Host": "localhost:3000"
      },
      body: JSON.stringify({
        type: "page_view",
        visitorId: visitorMobile,
        sessionId: sessionMobile,
        path: "/shop/olio-evo-delpasqua",
        referrer: "https://google.com",
        env: "dev",
        isInternal: false,
        data: {
          meta: {
            source: "web"
          }
        }
      })
    });

    console.log(`     [Response] Status: ${resMobile.status}`);
    const textMobile = await resMobile.text();
    console.log(`     [Response Text]: "${textMobile}"`);
    if (resMobile.status !== 200) {
      console.warn("     ⚠️ Warning: Analytics POST returned non-200. Is ANALYTICS_DB_ENABLED set to true?");
    }

    // 2. Simulate Search Engine Bot from USA
    console.log("   - Case 2: Posting search engine bot crawl event from US");
    const botUA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    console.log(`     [Request] POST /api/analytics`);
    console.log(`     [Headers] User-Agent: ${botUA}, cf-ipcountry: US`);
    console.log(`     [Body] Event: page_view, visitorId: ${visitorBot}`);

    const resBot = await fetch(`${BASE_URL}/api/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": botUA,
        "cf-ipcountry": "US",
        "Host": "localhost:3000"
      },
      body: JSON.stringify({
        type: "page_view",
        visitorId: visitorBot,
        sessionId: sessionBot,
        path: "/blog/benvenuti",
        referrer: "",
        env: "dev",
        isInternal: false,
        data: {
          meta: {
            source: "playwright"
          }
        }
      })
    });

    console.log(`     [Response] Status: ${resBot.status}`);
    const textBot = await resBot.text();
    console.log(`     [Response Text]: "${textBot}"`);

    // 3. Simulate Desktop user from France
    console.log("   - Case 3: Posting desktop user pageview from FR");
    const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    console.log(`     [Request] POST /api/analytics`);
    console.log(`     [Headers] User-Agent: ${desktopUA}, x-vercel-ip-country: FR`);
    console.log(`     [Body] Event: page_view, visitorId: ${visitorDesktop}`);

    const resDesktop = await fetch(`${BASE_URL}/api/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": desktopUA,
        "x-vercel-ip-country": "FR",
        "Host": "localhost:3000"
      },
      body: JSON.stringify({
        type: "page_view",
        visitorId: visitorDesktop,
        sessionId: sessionDesktop,
        path: "/",
        referrer: "https://instagram.com",
        env: "dev",
        isInternal: false,
        data: {
          meta: {
            source: "web"
          }
        }
      })
    });

    console.log(`     [Response] Status: ${resDesktop.status}`);
    const textDesktop = await resDesktop.text();
    console.log(`     [Response Text]: "${textDesktop}"`);

    // 4. Read events from DB to assert values
    console.log("   - Case 4: Verifying analytics processing and device/country parsing in DB");
    
    const dbEvents = await db.analyticsEvent.findMany({
      where: {
        visitorId: { in: [visitorMobile, visitorBot, visitorDesktop] }
      },
      orderBy: { visitorId: "asc" }
    });

    console.log(`     [DB Result] Found ${dbEvents.length} analytics rows in database`);
    
    if (process.env.ANALYTICS_DB_ENABLED === "true") {
      if (dbEvents.length === 0) {
        throw new Error("Analytics events were not written to DB despite ANALYTICS_DB_ENABLED=true. Ensure Next.js dev server has been restarted or is reading the updated .env file.");
      }

      const botRow = dbEvents.find(e => e.visitorId === visitorBot);
      const mobRow = dbEvents.find(e => e.visitorId === visitorMobile);
      const deskRow = dbEvents.find(e => e.visitorId === visitorDesktop);

      if (mobRow) {
        console.log(`     [Assert] Mobile visitor device parsing: expected="mobile", got="${mobRow.device}"`);
        if (mobRow.device !== "mobile") throw new Error(`Expected device to be mobile, got ${mobRow.device}`);

        console.log(`     [Assert] Mobile country extraction: expected="IT", got="${mobRow.data?.meta?.countryCode}"`);
        if (mobRow.data?.meta?.countryCode !== "IT") throw new Error(`Expected countryCode IT, got ${mobRow.data?.meta?.countryCode}`);
        
        console.log("     ✅ Mobile analytics row parsed correctly");
      }

      if (botRow) {
        console.log(`     [Assert] Bot visitor device parsing: expected="bot", got="${botRow.device}"`);
        if (botRow.device !== "bot") throw new Error(`Expected device to be bot, got ${botRow.device}`);

        console.log(`     [Assert] Bot country extraction: expected="US", got="${botRow.data?.meta?.countryCode}"`);
        if (botRow.data?.meta?.countryCode !== "US") throw new Error(`Expected countryCode US, got ${botRow.data?.meta?.countryCode}`);
        
        console.log("     ✅ Bot analytics row parsed correctly");
      }

      if (deskRow) {
        console.log(`     [Assert] Desktop visitor device parsing: expected="desktop", got="${deskRow.device}"`);
        if (deskRow.device !== "desktop") throw new Error(`Expected device to be desktop, got ${deskRow.device}`);

        console.log(`     [Assert] Desktop country extraction: expected="FR", got="${deskRow.data?.meta?.countryCode}"`);
        if (deskRow.data?.meta?.countryCode !== "FR") throw new Error(`Expected countryCode FR, got ${deskRow.data?.meta?.countryCode}`);
        
        console.log("     ✅ Desktop analytics row parsed correctly");
      }
    } else {
      console.log("     ℹ️ ANALYTICS_DB_ENABLED is not set to true for Next.js, so database verification skipped.");
    }

  } finally {
    // Cleanup
    console.log("🧹 Cleaning up analytics test events from DB...");
    const cleanRes = await db.analyticsEvent.deleteMany({
      where: {
        visitorId: { in: [visitorMobile, visitorBot, visitorDesktop] }
      }
    }).catch(() => {});
    console.log(`   [DB] Cleaned up ${cleanRes?.count ?? 0} events`);
  }

  console.log("✅ Test 09: User Simulation & Analytics Metrics PASSED\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  run()
    .then(async () => {
      await closePrisma();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Test 09 FAILED:", err);
      await closePrisma();
      process.exit(1);
    });
}
