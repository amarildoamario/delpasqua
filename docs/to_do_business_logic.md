# TODO Business Logic Robustezza

Data audit: 2026-05-29

Legenda priorita:
- P0 = rischio diretto su ordini, pagamenti, stock, dati cliente o incasso.
- P1 = incoerenza operativa che puo creare errori o costi manuali.
- P2 = debito tecnico/UX che puo diventare bug.

## [✅ RISOLTO] P0 - Quantita carrello non vincolata allo stock

Problema:
- La PDP limitava la quantita allo stock, ma il carrello tornava a un limite generico di 99.
- `CartContext` sommava le quantita senza conoscere sempre la disponibilita reale.
- `CartDrawer`, `CartPageClient` e i quick add listing potevano incrementare oltre lo stock.
- Le raccomandazioni e le card prodotto facevano quick add senza un controllo stock affidabile fuori dal contesto del carrello.

Impatto:
- L'utente poteva vedere "50 disponibili" e arrivare molto oltre nel carrello.
- Il checkout server poteva bloccare, ma troppo tardi e con UX pessima.

Stato:
- Risolto il 2026-05-30.
- `src/context/CartContext.tsx` mantiene una availability map per SKU, normalizza centralmente le righe e valida anche i quick add fuori dal carrello interrogando l'availability reale della SKU quando non e ancora nota.
- `CartContext.add` e asincrono e restituisce ora un esito esplicito (`added`, `adjusted`, `rejected`) cosi PDP, product card e card raccomandate possono mostrare feedback immediato.
- `CartDrawer` e `CartPageClient` leggono il massimo reale per bloccare l'incremento e mostrano un messaggio esplicito quando una riga viene ridotta o rimossa per esaurimento stock.
- `ProductPurchaseBox.client.tsx` e `AddToCartPanel.tsx` tengono conto anche della quantita gia presente nel carrello per non proporre un add oltre la disponibilita residua.
- La refresh availability del carrello usa `/api/inventory/availability` con `cache: "no-store"`.
- Regressione corretta il 2026-05-29: la lookup availability usa lo SKU interno inventario `productId:variantId` invece dello SKU commerciale.
- Migliorata la UX listing il 2026-05-29: la shop page espone una card per variante invece di una card aggregata multi-formato, cosi il quick add della card e univoco.

Fix richiesto:
- Introdurre una normalizzazione carrello lato client basata su availability per SKU.
- Validare tutte le righe carrello quando si apre drawer/cart e prima di checkout.
- `CartContext.add` deve clampare la quantita totale esistente + nuova alla disponibilita nota.
- Il server resta fonte di verita: la UI non deve sostituire il controllo server.

## [✅ RISOLTO] P0 - Anti-oversell non realmente risolto

Problema:
- `reserveStockOrThrow` controllava ma non riservava davvero lo stock.
- Lo stock veniva scalato solo dopo il pagamento Stripe.
- Due clienti potevano creare due checkout sullo stesso stock prima del decremento reale.

Impatto:
- Overselling reale possibile.
- Il vecchio `to_do_list.txt` marcava P0.06 come DONE, ma il comportamento non era una vera riserva.

Stato:
- Slice 1 implementata il 2026-05-29.
- Aggiunti `InventoryItem.reserved` e tabella `InventoryReservation` in Prisma.
- `reserveStockOrThrow` effettua una riserva atomica per `orderId`.
- `commitReservedToSoldOrThrow` converte `reserved -> sold`.
- `releaseReserved` rilascia davvero le reservation su `cancel`, `expired` e `failed`.
- Il flusso e integrato in `src/app/api/order/route.ts`, `src/app/api/webhooks/stripe/route.ts`, `src/lib/server/expirePending.ts`, `src/app/[locale]/checkout/cancel/page.tsx`, `src/app/api/admin/orders/[id]/status/route.ts`.
- Risolto definitivamente il 2026-05-30:
  - aggiunto test concorrente in `src/lib/server/orderFlow.test.ts` con due tentativi simultanei sull'ultima unita;
  - aggiunta osservabilita operativa con eventi ordine `INVENTORY_RESERVED`, `INVENTORY_COMMITTED`, `INVENTORY_RELEASED` in `src/lib/server/inventory.ts`.

Fix richiesto:
- Aggiungere una colonna `reserved` o una tabella `InventoryReservation`.
- In creazione ordine: update atomico `stock - reserved >= qty`, poi incrementare `reserved`.
- In pagamento confermato: decrementare stock e liberare reserved.
- In cancel/expired/failed: liberare reserved.
- Aggiungere test di concorrenza: due ordini simultanei sull'ultima unita.

## [✅ RISOLTO] P0 - Stato PAID manuale non applica invarianti di pagamento

Problema:
- `src/app/api/admin/orders/[id]/status/route.ts` permetteva il passaggio admin a `PAID`.
- In quel flusso mancavano commit stock, `orderNumber`, fattura ed enqueue `ORDER_PAID`.
- Il flusso Stripe faceva questi passaggi nel webhook, ma il flusso admin li saltava.

Stato:
- Risolto operativamente il 2026-05-29 nella prima slice.
- Estratto servizio condiviso `src/lib/server/orderPayment.ts` con `applyPaidOrderInvariantsTx`.
- Il webhook Stripe e il passaggio admin `PENDING -> PAID` usano lo stesso servizio per:
  - commit reservation su stock
  - assegnazione `orderNumber`
  - assegnazione fattura
  - enqueue `ORDER_PAID`

Impatto:
- Ordine marcato pagato senza stock scalato.
- Possibile ordine pagato senza numero ordine/fattura/email coerenti.

Fix richiesto:
- Separare "mark paid manually" in un servizio server unico con gli stessi invarianti del webhook.
- Oppure vietare `PENDING -> PAID` manuale e introdurre una procedura esplicita con conferma doppia.

## [✅ RISOLTO] P0 - Promozioni non atomiche rispetto a usageLimit

Stato:
- Risolto il 2026-05-30. Introdotta una transazione DB con lock pessimistico `FOR UPDATE` in `src/app/api/order/route.ts` per controllare e incrementare in modo atomico l'utilizzo del coupon (`usedCount`), garantendo che il limite promozionale (`usageLimit`) venga rispettato in modo rigoroso e prevenendo sottomissioni concorrenti non autorizzate.

Problema:
- `src/lib/server/pricing.ts` controllava `promo.usedCount < promo.usageLimit`.
- `usedCount` veniva incrementato solo dopo pagamento in `src/app/api/webhooks/stripe/route.ts`.
- Non c'era una riserva o incremento condizionale atomico quando si creava il checkout.

Impatto:
- Se rimane 1 utilizzo, piu checkout paralleli potevano ottenere lo sconto.
- Alla fine tutti i pagati incrementavano `usedCount`, superando il limite.

Fix richiesto:
- Prenotare l'uso promo a creazione ordine, con rilascio su expire/cancel.
- Oppure incrementare atomicamente con `where usedCount < usageLimit` e collegare l'uso a ordine/idempotency.

## [✅ RISOLTO] P1 - Cache promo stale dopo modifiche admin

Stato:
- Risolto il 2026-05-30. Rimossa la cache promo in-memory dal pricing critico: `src/lib/server/pricing.ts` legge sempre la promo live da database, e `src/app/api/promotions/validate/route.ts` usa la stessa lettura server-side aggiornata.

Problema:
- `src/lib/server/pricing.ts` usava una cache in-memory TTL 60s.
- Se l'admin disattivava o modificava una promo, il checkout poteva applicare ancora la versione vecchia fino a 60 secondi.

Impatto:
- Codici appena disattivati potevano restare validi temporaneamente.
- In ambiente serverless multi-istanza la cache non era coerente tra istanze.

Fix richiesto:
- Rimuovere la cache per pricing critico o invalidarla dopo mutation admin.
- Per performance, usare cache con versioning DB o breve TTL solo su letture non critiche.

## [✅ RISOLTO] P1 - IVA calcolata prima dello sconto e gestione IVA inclusa

Stato:
- Risolto il 2026-05-30. L'IVA viene calcolata sul netto scontato reale proporzionalmente allocato sulle singole righe, e il sistema e stato convertito all'IVA inclusa (scorporata) al 4%, salvata a database per fini amministrativi.

Problema:
- `src/lib/server/pricing.ts` calcolava IVA su `subtotalCents`.
- Lo sconto veniva sottratto dopo nel totale.

Impatto:
- Se il regime fiscale richiedeva IVA sul netto scontato, totale e fatture risultavano errati.

Fix richiesto:
- Decidere regola fiscale con commercialista.
- Se lo sconto riduce imponibile, calcolare IVA su `subtotalCents - discountCents`.
- Aggiornare anche export fatture e snapshot pricing.

## [✅ RISOLTO] P1 - Impostazioni admin spedizione/IVA non usate dal pricing

Stato:
- Risolto il 2026-05-30. Creato il servizio centralizzato `src/lib/server/settings.ts` per recuperare i parametri di spedizione e aliquota IVA in tempo reale da database. Integrato in `src/lib/server/pricing.ts` e aggiornato `calcVatCentsFromSubtotal`.

Problema:
- L'admin salvava `shippingFlatCents`, `freeShippingThresholdCents`, `vatRatePercent`.
- Il pricing usava valori hardcoded e IVA da env.

Impatto:
- L'admin credeva di modificare il checkout, ma non cambiava nulla.

Fix richiesto:
- Creare un servizio `getStoreSettings()` server-side.
- Usarlo in pricing, cart totals, copy UI e admin.
- Validare e mostrare chiaramente quali impostazioni sono effettive.

## [✅ RISOLTO] P1 - Soglia spedizione gratuita incoerente

Stato:
- Risolto il 2026-05-30. Unificata la soglia di spedizione gratuita a 50 EUR (5000 centesimi) sia nel database come default sia come costante condivisa in `src/lib/constants.ts`. Calcoli client-side e testi coerenti.

Problema:
- Business/server: soglia EUR 69 in pricing e cart drawer.
- Testi prodotto/catalogo parlavano di EUR 50.

Impatto:
- Promessa commerciale sbagliata.
- Possibili contestazioni cliente.

Fix richiesto:
- Unificare soglia in una sola fonte dati.
- Generare i testi da settings o da una costante condivisa.

## [✅ RISOLTO] P1 - Sconti ProductMerch non applicati al checkout

Stato:
- Risolto il 2026-05-30. `ProductMerch` e stato trattato come prezzo reale: `src/lib/server/pricing.ts` applica `discountPercent` / `discountCents` attivi per prodotto, salva il dettaglio nello snapshot pricing e propaga il prezzo corretto a `/api/checkout` e alla sessione Stripe.

Problema:
- Admin sales gestiva `discountPercent` e `discountCents` in `ProductMerch`.
- Il pricing server non li leggeva, quindi gli sconti merchandising non impattavano il pagamento.

Impatto:
- Admin poteva configurare sconti visibili/operativi che non venivano applicati al pagamento.

Fix richiesto:
- Decidere se `ProductMerch` e solo marketing o prezzo reale.
- Se e prezzo reale, applicarlo in `computeOrderPricing` e nello snapshot ordine.

## [✅ RISOLTO] P1 - Endpoint promo validate usa subtotal client

Stato:
- Risolto il 2026-05-30. `src/app/api/promotions/validate/route.ts` non accetta piu `subtotalCents` dal browser: riceve le righe carrello, ricalcola il subtotale server-side con `computeOrderPricing`, considera anche eventuali sconti `ProductMerch` attivi, e risponde in coerenza con `/api/checkout` e `/api/order`.

Problema:
- L'endpoint promo validate accettava `subtotalCents` dal browser.
- Il checkout finale ricalcolava lato server, ma la validazione promo client poteva dire "valida" quando il carrello reale non raggiungeva il minimo.

Impatto:
- UX incoerente e possibile enumerazione/abuso promo.

Fix richiesto:
- Far ricevere all'endpoint le righe carrello e calcolare subtotal server-side.
- Oppure usare `/api/checkout` come unica validazione promo.
