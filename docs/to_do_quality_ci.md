# TODO Qualita, Test e CI

Data audit: 2026-05-29

## Agent Status

- FileStatus: COMPLETED
- LastVerified: 2026-06-08
- OpenItems: 0
- AgentAction: trattare questo file come archivio completato; riaprirlo solo se una regressione futura riapre test server, servizi condivisi o invarianti ordine.
- Note: `typecheck`, `lint` e `test:server` sono stati rieseguiti anche il 2026-06-08 con esito positivo. La copertura critica server, l'estrazione dei servizi residui e gli invarianti ordine minimi sono ora chiusi.

## Stato verifiche

- `npm run typecheck`: passa con 0 errori.
- `npm run lint`: passa con successo con 0 errori e 0 warning (con il flag severo `--max-warnings=0`).
- `npm run test:server`: passa con 31 test verdi distribuiti sulle suite server critiche.

## [RISOLTO] P0 - Test mancanti sui flussi critici

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
- Aggiornato il 2026-06-07:
  - aggiunti test server su carrello stock-aware (`stock - reserved`)
  - aggiunto test server su saturation promo `usageLimit`
  - aggiunto test server su transizioni e invarianti ordine minime
  - aggiunto test flow-level su due checkout concorrenti con ultima unita disponibile
  - aggiunta suite server dedicata a retry/idempotenza webhook Stripe
- Verificato il 2026-06-07:
  - Aggiunti ed eseguiti i test di compensazione ordine `FAILED` in `orderRoute.test.ts` con mock completi di Stripe e Prisma.
  - I test coprono il rilascio dello stock, il cambio di stato a `FALLITO`, l'intercettazione dei fallimenti di creazione coupon/sessione, e l'invalidazione della sessione Stripe se la persistenza locale fallisce.
  - La suite compila senza errori e rispetta le regole strict del linter.
- Richiuso il 2026-06-08:
  - aggiunta suite `src/lib/server/tastingBooking.test.ts`;
  - coperta la race condition su `/api/tasting/book` con due richieste concorrenti sullo stesso slot: una sola arriva a checkout, l'altra riceve `409`;
  - coperto anche il cleanup del booking degustazione se la creazione della sessione Stripe fallisce;
  - rieseguiti con esito positivo `npm run typecheck`, `npm run lint` e `npm run test:server`.

## [RISOLTO] P1 - CI deve separare app e script storici

Stato:
- Risolto il 2026-05-30. Tutta la codebase, compresi gli script e la cartella `scratch`, è stata ripulita da tutti gli errori e i warning. Non c'è più bisogno di escluderli poiché ora l'intera repo passa il lint senza alcun errore.

Problema:
- `npm run lint` fallisce anche per `scratch` e script di migrazione.

Fix richiesto:
- Decidere se `scratch` e parte della qualita CI.
- Se no, escluderlo in ESLint.
- Se si, pulire errori e warnings.

## [RISOLTO] P1 - Servizi business da estrarre

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
- Aggiornato il 2026-06-07:
  - estratti `src/lib/server/promotionUsage.ts` e `src/lib/server/cartValidation.ts`
  - il tema aperto qui si restringe soprattutto a eventuale ulteriore riuso client/server della normalizzazione carrello
- Richiuso il 2026-06-08:
  - estratto `src/lib/cartNormalization.ts` come modulo puro condiviso per normalizzazione righe carrello, alias catalogo, clamp quantita` e notice di migrazione/rimozione;
  - `src/context/CartContext.tsx` usa ora il modulo condiviso invece di mantenere la logica annidata nel provider;
  - `src/lib/server/cartValidation.ts` riusa ora lo stesso `clampCartQty`, riducendo divergenze client/server sul limite quantita`;
  - aggiunta suite `src/lib/server/cartNormalization.test.ts` per merge righe duplicate, remap alias legacy, clamp su availability e notice di catalogo.

Verifica repo 2026-06-02:
- `orderPayment.ts`, `inventory.ts` e `settings.ts` esistono gia come blocchi separati.
- Non esiste ancora un servizio esplicito dedicato per `promotionUsageService` o `cartValidationService`; parte della logica e` ancora distribuita tra `src/app/api/order/route.ts`, `src/context/CartContext.tsx` e `src/lib/server/pricing.ts`.

## [RISOLTO] P2 - Definizione invarianti ordine

Da documentare e testare:
- Un ordine `PAID` deve avere `paidAt`, `orderNumber`, stock scalato o reservation committed.
- Un ordine `REFUNDED` deve avere riferimento a rimborso Stripe o nota manuale tracciata.
- Un ordine `SHIPPED` deve passare da `PREPARING`.
- Un ordine con payment provider Stripe deve avere `stripeCheckoutSessionId` o motivo `FAILED`.
- Un ordine cliente linkabile deve usare token pubblico, non ID tecnico.

Verifica repo 2026-06-02:
- Le invarianti `PAID` sono gia implementate e testate in `applyPaidOrderInvariantsTx`.
- Le invarianti `REFUNDED` restano incomplete finche non esiste un vero refund flow Stripe.
- Aggiornato il 2026-06-07:
  - aggiunto `src/lib/server/orderStatus.ts` con transizioni permesse e check di invarianti minime
  - coperti a test almeno: `IN_PREPARAZIONE -> SPEDITO`, blocco `PAGATO -> SPEDITO` diretto e requisiti minimi per ordini Stripe/customer-linkable
- Richiuso il 2026-06-08:
  - aggiunto `assertOrderInvariants(...)` e `OrderInvariantError` in `src/lib/server/orderStatus.ts`;
  - rafforzati i check per `SPEDITO` / `CONSEGNATO` con timestamp minimi (`preparingAt`, `shippedAt`, `deliveredAt`);
  - un ordine Stripe `FALLITO` senza `stripeCheckoutSessionId` richiede ora una ragione tracciata in `notes`;
  - `applyPaidOrderInvariantsTx` e `applyStripeRefundToOrderTx` verificano ora attivamente le invarianti finali prima di confermare il flusso;
  - le route admin stato/rimborso intercettano le violazioni e rispondono con `409 ORDER_INVARIANT_VIOLATION` invece di lasciare stati incoerenti;
  - estesi i test server su ordini Stripe incoerenti, shipping timestamps e fallback reason per i fallimenti.
