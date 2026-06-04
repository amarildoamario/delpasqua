# TODO Qualita, Test e CI

Data audit: 2026-05-29

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-02
- OpenItems: 3
- AgentAction: usare questo file come backlog tecnico di test e rifinitura architetturale; i gate base oggi passano.
- Note: `typecheck`, `lint` e `test:server` sono stati rieseguiti il 2026-06-02 con esito positivo.

## Stato verifiche

- `npm run typecheck`: passa con 0 errori.
- `npm run lint`: passa con successo con 0 errori e 0 warning (con il flag severo `--max-warnings=0`).
- `npm run test:server`: passa con 8 test verdi su `src/lib/server/orderFlow.test.ts`.

## [⚠️ PARZIALE] P0 - Test mancanti sui flussi critici

Flussi da coprire:
- Due checkout simultanei con stock 1: uno solo deve passare.
- Carrello con quantita superiore allo stock: clamp UI e blocco server.
- Promo con `usageLimit = 1`: un solo pagamento puo usarla.
- Webhook Stripe duplicato: idempotente e senza doppio decremento stock.
- Webhook Stripe con errore DB temporaneo: deve essere ritentato.
- Admin `PENDING -> PAID`: deve applicare tutti gli invarianti o essere vietato.
- Cancel/expired: deve liberare reserved stock e stato ordine.
- Tasting booking simultaneo sullo stesso slot: uno solo deve passare.

Stato:
- Avanzato il 2026-05-29.
- Aggiunto comando `npm run test:server`.
- Aggiunto test file `src/lib/server/orderFlow.test.ts`.
- Coperti oggi:
  - reservation creata una sola volta per stesso ordine
  - secondo ordine bloccato sull'ultima unita gia riservata
  - release della reservation su stock
  - invarianti `PENDING -> PAID` con commit stock, numero ordine, fattura e outbox
- Restano ancora da aggiungere i test di concorrenza reale multi-checkout, webhook retry/idempotenza, promo `usageLimit`, carrello stock-aware e tasting slot race.

Verifica repo 2026-06-02:
- I test oggi presenti in `src/lib/server/orderFlow.test.ts` coprono reservation, oversell sull'ultima unita, release stock, invarianti `PENDING -> PAID`, incremento promo e expire pending.
- Dopo la patch Stripe del 2026-06-02 manca ancora copertura specifica per:
  - replay di eventi `failed_processing` nel webhook Stripe;
  - fallback `metadata.orderId` / `client_reference_id` nel webhook;
  - compensazione ordine `FAILED` se coupon/session/persistenza Stripe falliscono.

## [✅ RISOLTO] P1 - CI deve separare app e script storici

Stato:
- Risolto il 2026-05-30. Tutta la codebase, compresi gli script e la cartella `scratch`, è stata ripulita da tutti gli errori e i warning. Non c'è più bisogno di escluderli poiché ora l'intera repo passa il lint senza alcun errore.

Problema:
- `npm run lint` fallisce anche per `scratch` e script di migrazione.

Fix richiesto:
- Decidere se `scratch` e parte della qualita CI.
- Se no, escluderlo in ESLint.
- Se si, pulire errori e warnings.

## [⚠️ PARZIALE] P1 - Servizi business da estrarre

Servizi consigliati:
- `cartValidationService`: normalizza linee, merge duplicati, controlla stock.
- `inventoryReservationService`: reserve/commit/release atomici.
- `orderPaymentService`: transizione a paid con stock, numero ordine, fattura, outbox.
- `promotionUsageService`: uso promo atomico e rilascio su scadenza.
- `storeSettingsService`: IVA, shipping, soglie, payment methods.
- `publicRouteService`: URL cliente per ordini/supporto localizzati.

Stato:
- Avviato il 2026-05-29.
- Implementato il servizio `orderPayment.ts` per condividere gli invarianti `PENDING -> PAID`.
- Il layer `inventory.ts` e stato riallineato a un vero flusso di reservation atomica con supporto `reserve/commit/release`.
- Restano da estrarre promo usage, store settings e validazione carrello centralizzata.

Verifica repo 2026-06-02:
- `orderPayment.ts`, `inventory.ts` e `settings.ts` esistono gia come blocchi separati.
- Non esiste ancora un servizio esplicito dedicato per `promotionUsageService` o `cartValidationService`; parte della logica e` ancora distribuita tra `src/app/api/order/route.ts`, `src/context/CartContext.tsx` e `src/lib/server/pricing.ts`.

## [⏳ TODO] P2 - Definizione invarianti ordine

Da documentare e testare:
- Un ordine `PAID` deve avere `paidAt`, `orderNumber`, stock scalato o reservation committed.
- Un ordine `REFUNDED` deve avere riferimento a rimborso Stripe o nota manuale tracciata.
- Un ordine `SHIPPED` deve passare da `PREPARING`.
- Un ordine con payment provider Stripe deve avere `stripeCheckoutSessionId` o motivo `FAILED`.
- Un ordine cliente linkabile deve usare token pubblico, non ID tecnico.

Verifica repo 2026-06-02:
- Le invarianti `PAID` sono gia implementate e testate in `applyPaidOrderInvariantsTx`.
- Le invarianti `REFUNDED` restano incomplete finche non esiste un vero refund flow Stripe.
