import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../src/generated/prisma/index.js');
const { PrismaPg } = require('@prisma/adapter-pg');
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';
dotenv.config();

const TARGET_DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_DATABASE_URL;
const SOURCE_DB_URL = process.env.SQLITE_URL || process.env.SQLITE_DATABASE_URL || './dev.db';

if (!TARGET_DB_URL) {
    console.error("❌ ERRORE: Manca DATABASE_URL per Postgres nel file .env.");
    process.exit(1);
}

process.env.DATABASE_URL = TARGET_DB_URL;
const adapter = new PrismaPg({ connectionString: TARGET_DB_URL });
const prisma = new PrismaClient({ adapter });

let sqliteDb = null;
try {
    sqliteDb = new Database(SOURCE_DB_URL.replace('file:', ''), { readonly: true, fileMustExist: true });
} catch (err) {
    console.error(`❌ Impossibile caricare DB SQLite da: ${SOURCE_DB_URL}. Dettagli: ${err.message}`);
    process.exit(1);
}

// Ordine ESATTO per rispettare le Foreign Keys
const TABLES_TO_MIGRATE = [
    'Setting',
    'InventoryItem',
    'Promotion',
    'ProductMerch',
    'TastingBooking',
    'OutboxEvent',
    'AdminSession',
    'RateLimitCounter',
    'StripeWebhookEvent',
    'AnalyticsEvent',
    'Order',             // Order deve esistere prima di OrderItem e OrderEvent
    'OrderItem',
    'OrderEvent',
    'TransactionalEmailLog'
];

async function main() {
    console.log('🚀 AVVIO MIGRAZIONE DATI: SQLite -> Postgres');

    for (const table of TABLES_TO_MIGRATE) {
        console.log(`\n⏳ Migrazione tabella: ${table}...`);

        // Leggiamo da SQLite
        const rows = sqliteDb.prepare(`SELECT * FROM "${table}"`).all();
        console.log(`   Trovati ${rows.length} record in SQLite.`);

        if (rows.length === 0) {
            console.log(`   Skip ${table}, nessun dato.`);
            continue;
        }

        // Prisma: Model identifier (la stringa in camelCase o lowercase)
        const modelName = table[0].toLowerCase() + table.slice(1);

        try {
            // Inseriamo in Postgres con createMany
            // Trasformiamo i boolean se SQLite li ha salvati come 0/1, anche se Prisma spesso lo gestisce.
            // Se c'è un campo JSON o Date bisogna fare attenzione, Prisma in createMany si aspetta i tipi corretti.
            // Eseguiamo a blocchi di 500 per sicurezza per non sforare i limiti delle query in Prisma
            const chunkSize = 500;
            let inserted = 0;
            for (let i = 0; i < rows.length; i += chunkSize) {
                const chunk = rows.slice(i, i + chunkSize);

                // Conversione tipi base (SQLite a volte ha date come string/number e bool come 1/0)
                const parsedChunk = chunk.map(row => {
                    const parsed = { ...row };
                    // Risoluzione campi DateTime memorizzati in SQLite come UNIX ms o stringhe ISO (dipende da Prisma)
                    // E.g. createdAt, updatedAt (Prisma solitamente li legge/scrive come Date object / ISO in node)
                    for (const key in parsed) {
                        if (['createdAt', 'updatedAt', 'paidAt', 'shippedAt', 'deliveredAt', 'canceledAt', 'refundedAt', 'expiresAt', 'revokedAt', 'receivedAt', 'processedAt', 'runAt', 'startsAt', 'endsAt', 'slotStart', 'slotEnd'].includes(key) && parsed[key]) {
                            parsed[key] = new Date(parsed[key]);
                        }
                        if (['isFlagged', 'freeShipping', 'showInHome', 'isBestSeller', 'isActive', 'livemode', 'isInternal'].includes(key) && typeof parsed[key] === 'number') {
                            parsed[key] = parsed[key] === 1;
                        }
                        if (['productSnapshot', 'pricingSnapshot', 'payload', 'data'].includes(key) && typeof parsed[key] === 'string') {
                            try { parsed[key] = JSON.parse(parsed[key]); } catch { }
                        }
                    }
                    return parsed;
                });

                const result = await prisma[modelName].createMany({
                    data: parsedChunk,
                    skipDuplicates: true // Utile in caso di fallimenti parziali (idempotenza)
                });
                inserted += result.count;
            }

            console.log(`   ✅ Inseriti ${inserted} record in Postgres per la tabella ${table}.`);

        } catch (err) {
            console.error(`   ❌ Fallimento per ${table}:`, err.message);
            // Fallback: visualizza primo record problematico
            console.log("   Primo record della table:", rows[0]);
        }
    }

    console.log('\n🎉 ETL COMPLETATO!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        sqliteDb.close();
    })
    .catch(async (err) => {
        console.error(err);
        await prisma.$disconnect();
        sqliteDb.close();
        process.exit(1);
    });
