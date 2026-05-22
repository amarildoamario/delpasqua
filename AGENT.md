# AGENT.md

## Scopo
- Repo Next.js 16 con App Router per sito e-commerce multilingua di un frantoio.
- Domini principali: catalogo prodotti, carrello/checkout, area admin, degustazioni, analytics, Stripe, email, Prisma/Postgres.

## Regole globali
- Considera `src/lib` come libreria canonica condivisa. `src/app/lib` sembra legacy e non va estesa salvo necessità di compatibilità.
- Non modificare a mano `src/generated/prisma`: è output generato da Prisma.
- Il catalogo prodotto vive in `src/db/products.json`; ID, slug e variant ID sono chiavi operative usate da shop, ordini, inventario e analytics.
- L'app è impostata come light-only. Non reintrodurre dark mode o toggle tema salvo richiesta esplicita.
- Le route admin e webhook hanno effetti collaterali reali: privilegia idempotenza, controlli input, rate limit e log leggibili.
- Per decisioni o modifiche security-sensitive, il riferimento principale è `src/lib/server/AGENT.md`.

## Stack e convenzioni
- UI: React 19, Next.js App Router, Tailwind 4, `next-intl`.
- Backend applicativo: route handlers in `src/app/api`, logica server in `src/lib/server`.
- DB: Prisma client generato in `src/generated/prisma`, datasource Postgres via variabili ambiente.
- Analytics ed eventi client stanno in `src/lib/analytics`.

## Quando fai modifiche
- Mantieni la logica business fuori da page/component quando può vivere in `src/lib`.
- Se tocchi testi tradotti, allinea le chiavi in `messages/*.json`.
- Se tocchi schema o modelli dati, aggiorna anche migrazioni, codice Prisma e impatti su admin/export/webhook.
- Non spostare asset pubblici senza aggiornare tutti i riferimenti.

## Validazione
- Esegui almeno `npm run lint` e `npm run typecheck` per cambiamenti applicativi.
- `next.config.ts` ignora errori TS/eslint in build: non usare `npm run build` come unica verifica di correttezza.

## Mappa rapida
- `src/app`: entrypoint App Router, pagine e API.
- `src/components`: componenti UI e sezioni marketing/shop.
- `src/lib`: logica condivisa canonica.
- `src/db`: catalogo JSON e backup locali.
- `messages`: traduzioni `next-intl`.
- `prisma`: schema e migrazioni.
- `tools` / `scripts`: utility operative e manutenzione.
