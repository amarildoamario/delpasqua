# AGENT.md

## Scopo
- Fonte autorevole del modello dati Prisma e delle migrazioni.
- Cubre ordini, inventory, promozioni, sessioni admin, analytics, outbox e degustazioni.

## Regole
- `schema.prisma` è il contratto dati principale: ogni cambiamento qui va valutato su API, admin, export ed email.
- Non editare il client generato in `src/generated/prisma`; rigeneralo tramite workflow Prisma.
- Mantieni migrazioni additive e leggibili; non riscrivere vecchie migrazioni già tracciate.
- Il runtime reale usa Postgres via env, anche se esistono file locali legacy come `dev.db`.

## Attenzioni
- Cambiare enum/status può rompere route admin, webhook Stripe e dashboard.
- Campi come `productId`, `variantId`, `sku`, `orderNumber`, `orderPublicToken` e token sessione sono chiavi operative: trattali come stabili.

## Verifica
- Dopo modifiche schema: valida generazione Prisma e controlla il codice che importa `@/generated/prisma`.
