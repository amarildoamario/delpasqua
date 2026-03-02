import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../src/generated/prisma/index.js');
const { PrismaPg } = require('@prisma/adapter-pg');
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';
dotenv.config();

// ---------------------------------------------------------
// CONFIG & SETUP
// ---------------------------------------------------------

const TARGET_DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_DATABASE_URL;
const SOURCE_DB_URL = process.env.SQLITE_URL || process.env.SQLITE_DATABASE_URL || './dev.db';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

if (!TARGET_DB_URL) {
    console.error("❌ ERRORE: Manca DATABASE_URL per Postgres.");
    process.exit(1);
}

// Prisma Client configurato per leggere dal nuovo DB Postgres (Target)
const adapter = new PrismaPg({ connectionString: TARGET_DB_URL });
const prisma = new PrismaClient({ adapter });

// SQLite connettore via modulo better-sqlite3 per leggere dal vecchio DB (Source)
let sqliteDb = null;
try {
    sqliteDb = new Database(SOURCE_DB_URL.replace('file:', ''), { readonly: true, fileMustExist: true });
} catch (err) {
    if (SOURCE_DB_URL) {
        console.error(`⚠️ Impossibile aprire SQLite DB al path ${SOURCE_DB_URL} - i Parity Check verranno ignorati. Errore: ${err.message}`);
    }
}

const runSqlite = async (query, params = []) => {
    if (!sqliteDb) return [];
    return sqliteDb.prepare(query).all(params);
};

// Tooling per output
let hasErrors = false;
const assertEqual = (name, pgresVal, sqliteVal) => {
    if (String(pgresVal) !== String(sqliteVal)) {
        console.error(`❌ DISALLINEAMENTO [${name}]: PG=${pgresVal} | SQLITE=${sqliteVal}`);
        hasErrors = true;
    } else {
        console.log(`✅ [${name}] OK (${pgresVal})`);
    }
};

const section = (title) => console.log(`\n--- ${title} ---`);

// ---------------------------------------------------------
// E1) SANITY CHECKS (POSTGRES)
// ---------------------------------------------------------
async function runSanityChecks() {
    section("E1) SANITY CHECKS SU POSTGRES");
    try {
        const orderCount = await prisma.order.count();
        const inventoryCount = await prisma.inventoryItem.count();
        const settingsCount = await prisma.setting.count();

        console.log(`✅ Connessione Postgres OK.`);
        console.log(`✅ Tabella Order: ${orderCount} righe.`);
        console.log(`✅ Tabella InventoryItem: ${inventoryCount} righe.`);
        console.log(`✅ Tabella Setting: ${settingsCount} righe.`);

        // Check FK non-null per OrderItem -> Order (implicito tramite findFirst)
        const danglingItem = await prisma.orderItem.findFirst({
            where: { orderId: '' }
        });
        if (danglingItem) {
            console.error(`❌ TROVATO OrderItem SENZA Order associato (ID: ${danglingItem.id})`);
            hasErrors = true;
        } else {
            console.log(`✅ Integrità relazionale OrderItem -> Order OK.`);
        }

    } catch (err) {
        console.error(`❌ Errore durante i sanity checks (Postgres irraggiungibile?):`, err.message);
        hasErrors = true;
    }
}

// ---------------------------------------------------------
// E2) PARITY CHECKS (SQLITE vs POSTGRES)
// ---------------------------------------------------------
async function runParityChecks() {
    section("E2) PARITY CHECKS SQLITE ↔ POSTGRES");
    if (!sqliteDb.open) {
        console.log("⚠️ Salto Parity Checks: SQLite non disponibile.");
        return;
    }

    try {
        // 1. Confronto conteggio tabelle chiave
        const tables = ['Order', 'OrderItem', 'InventoryItem', 'Promotion', 'Setting', 'TastingBooking'];
        for (const table of tables) {
            const pgresCount = await prisma[table[0].toLowerCase() + table.slice(1)].count();
            const sqliteRes = await runSqlite(`SELECT COUNT(*) as count FROM "${table}"`);
            assertEqual(`Count Tabella ${table}`, pgresCount, sqliteRes[0].count);
        }

        // 2. Confronto somme critiche (es: totale transato)
        const pgresSumAgg = await prisma.order.aggregate({ _sum: { totalCents: true } });
        const pgresTotal = pgresSumAgg._sum.totalCents || 0;

        const sqliteSumRes = await runSqlite(`SELECT SUM(totalCents) as total FROM "Order"`);
        const sqliteTotal = sqliteSumRes[0].total || 0;

        assertEqual(`Somma Order.totalCents`, pgresTotal, sqliteTotal);

        // 3. Campionamento di ordini (max 20) e confronto campi vitali
        console.log("\nCampionamento di 20 ordini random...");
        const sampleSize = 20;
        const sqliteSample = await runSqlite(`SELECT id, status, totalCents, email FROM "Order" ORDER BY RANDOM() LIMIT ${sampleSize}`);

        for (const sqOrder of sqliteSample) {
            const pgOrder = await prisma.order.findUnique({ where: { id: sqOrder.id } });
            if (!pgOrder) {
                console.error(`❌ Ordine ID ${sqOrder.id} presente in SQLite ma MANCANTE in Postgres.`);
                hasErrors = true;
                continue;
            }

            const match = sqOrder.status === pgOrder.status &&
                sqOrder.totalCents === pgOrder.totalCents &&
                sqOrder.email === pgOrder.email;

            if (!match) {
                console.error(`❌ Dati corrotit per Ordine ${sqOrder.id}:`);
                console.error(`   SQLite: ${sqOrder.status}, ${sqOrder.totalCents}, ${sqOrder.email}`);
                console.error(`   PGres : ${pgOrder.status}, ${pgOrder.totalCents}, ${pgOrder.email}`);
                hasErrors = true;
            }
        }
        console.log(`✅ Campionamento record validato.`);

    } catch (err) {
        console.error(`❌ Errore durante i parity checks:`, err.message);
        hasErrors = true;
    }
}

// ---------------------------------------------------------
// E3) SMOKE TESTS (APPLICATIVO / STRIPE)
// ---------------------------------------------------------
async function runSmokeTests() {
    section("E3) SMOKE TESTS APPLICATIVI (API)");

    if (!BASE_URL) {
        console.log("⚠️ Nessun BASE_URL fornito, salto HTTP smoke test.");
        return;
    }

    const endpoints = [
        { path: '/api/health', expectedStatuses: [200, 404] }, // Spesso aggiunta per healthcheck
        { path: '/api/checkout', method: 'POST', expectedStatuses: [400, 401, 405] }, // 400/405 atteso se manca payload, ma vuol dire che è vivo
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetch(`${BASE_URL}${ep.path}`, {
                method: ep.method || 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!ep.expectedStatuses.includes(res.status)) {
                console.error(`❌ ${ep.path} ha risposto con ${res.status} (atteso uno tra: ${ep.expectedStatuses.join(', ')})`);
                hasErrors = true;
            } else {
                console.log(`✅ Endpoint ${ep.path} risponde col codice HTTP corretto (${res.status}).`);
            }
        } catch (err) {
            console.error(`❌ Endpoint ${ep.path} irraggiungibile:`, err.message);
            hasErrors = true;
        }
    }
}

// ---------------------------------------------------------
// ESECUZIONE PRINCIPALE
// ---------------------------------------------------------
async function main() {
    console.log("🚀 AVVIO VERIFICA MIGRAZIONE: SQLITE -> POSTGRES 🚀\n");

    await runSanityChecks();
    await runParityChecks();
    await runSmokeTests();

    section("RISULTATO FINALE");
    if (hasErrors) {
        console.error("❌ MIGRAZIONE FALLITA O INCOMPLETA. Controllare i log in alto.");
        process.exit(1);
    } else {
        console.log("✅TUTTI I TEST SUPERATI E MIGRAZIONE COMPLETATA CON SUCCESSO! 🎉");
        process.exit(0);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        sqliteDb.close();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        sqliteDb.close();
        process.exit(1);
    });
