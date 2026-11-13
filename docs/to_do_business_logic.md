# TODO Business Logic Robustezza

Data audit: 2026-05-29

## Agent Status

- FileStatus: COMPLETED
- LastVerified: 2026-06-02
- OpenItems: 0
- AgentAction: trattare questo file come archivio completato; riaprirlo solo se una regressione futura riapre uno dei punti sotto.
- Note: nonostante il nome `to_do_*`, questo file non contiene piu task aperte.

Legenda priorita:
- P0 = rischio diretto su ordini, pagamenti, stock, dati cliente o incasso.
- P1 = incoerenza operativa che puo creare errori o costi manuali.
- P2 = debito tecnico/UX che puo diventare bug.

## [✅ RISOLTO] Timeframe attività e ordinamenti pagine — 2026-11-10

- Due grafici settimanali equidimensionali per visite e ordini, stessa scala e colonne a zero preservate.
- Periodi rapidi nel grafico temporale: ultima ora, giorno, 7/30/90 giorni. Fasce consecutive di ampiezza adeguata al periodo; filtro generale preservato.
- Pagine ordinabili per visite, tempo totale, media pesata e visita più lunga, con ricerca e scelta del numero di risultati. Classifiche calcolate sull'intero dataset del periodo.
- 93 test server, lint, typecheck e prova browser desktop/mobile superati. Dettagli e limiti in `docs/metrics_verification.md`.

## [✅ RISOLTO] Apertura mobile menu e carrello — 2026-11-10

- Apertura dei pannelli mobile rallentata a 650 ms con decelerazione morbida. Il carrello, montato solo quando aperto, usa un ingresso CSS esplicito per evitare l'apparizione immediata.
- Nel menu le voci entrano in sequenza; su successiva richiesta le frecce sono anticipate a 420 ms con intervalli di 25 ms e rotazione di 300 ms. Movimento ridotto rispettato; tempi desktop invariati.
- Verifica Chromium a 390×844: durata pannello, ritardi e visibilità finale frecce, apertura carrello, chiusura/riapertura e `prefers-reduced-motion`. Lint e typecheck superati. Modifiche locali, non pubblicate.

## [✅ RISOLTO] Risposta diretta ai contatti dal gestionale — 2026-11-10

- Sostituito il link `mailto:` della risposta rapida con POST admin protetto da sessione, CSRF, limite richieste e validazione del corpo effettivo.
- Invio tramite Resend con `EMAIL_FROM` del dominio; destinatario letto dal contatto nel database. Nessuna risposta reale inviata durante lo sviluppo.
- Testo preservato sugli errori, pulsante bloccato durante l'invio, chiave idempotente sui retry e ricevuta con ID Resend. La conferma indica accettazione del provider, non consegna o lettura.
- Il contatto viene segnato letto solo dopo accettazione. Un errore DB successivo non trasforma una spedizione riuscita in un fallimento apparente.
- Nessuna migrazione o modifica alle notifiche del form pubblico. Il recapito amministrativo configurato su `email.it`, risultato respinto, resta da correggere separatamente.
- Verifiche: test di composizione/validazione e route con provider/database simulati; lint e typecheck. Modifica locale, non pubblicata.

## [✅ RISOLTO] Metriche commerciali e clienti — 2026-11-09

- Aggiunti acquisizione automatica Instagram/Facebook/Google, fuga Stripe osservata per coorte, tempo dalla prima visita misurata, LTV storico e segmenti clienti, attività 24h e settimana.
- Corrette esclusioni checkout nelle lingue, medie durata pesate e collegamento allo storico cliente. Dashboard con bandiere SVG locali.
- Fonte delle vendite confermate: pagamenti del database. Gli esiti Stripe senza ritorno misurato e gli ordini senza storia visite non producono stime inventate.
- Verifiche e limiti documentati in `docs/metrics_verification.md`; riconciliazione database in sola lettura e casi non vuoti coperti da fixture. Nessuna migrazione/deploy eseguita.
- Rifinitura successiva: dettagli solo in Metriche, tooltip informativi, istogrammi più larghi e bandiere squadrate. Filtri con date invertite, scelta del mese intero e trend su calendario italiano verificati; 80 test server.

## [✅ RISOLTO] P0 - Quantita carrello non vincolata allo stock

Regressione pannello laterale corretta il 2026-11-07:
- `CartButton` montava un secondo `CartProvider` al momento dell'apertura: le rimozioni aggiornavano il carrello del pannello e lo storage, mentre le card conservavano la vecchia lista nel provider globale.
- Riprodotta la sequenza con tre prodotti: rimossi Cavaliere e Musico, aggiungere Musico faceva riapparire Cavaliere e portava Musico a quantità 2.
- Il pulsante e il drawer usano ora lo stesso provider globale delle card. Il contatore legge direttamente `useCart().count`, eliminando la seconda copia ricostruita da localStorage.
- Test di regressione browser in `scratch/verify-cart-drawer-regression.cjs`: rimozioni multiple, reinserimento, ricaricamento e reinserimento dopo svuotamento. Nessuna creazione di ordini o mutazione di magazzino.

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

## [? RISOLTO] Storico risposte sotto al contatto ? 2026-11-13

- Riquadro ?La tua risposta? sotto al messaggio, in vista completa e dettaglio compatto: testo, oggetto, mittente e data, aggiornato subito dopo l?invio.
- Tabella ContactReply e migrazione 20261113190000_add_contact_replies: testo persistito prima dell?invio, ricevuta salvata dopo accettazione; retry confermati senza nuovo invio. Tentativi ambigui oltre 23 ore bloccati per evitare duplicati dopo scadenza idempotenza provider.
- Invio senza ricevuta DB segnalato come da verificare, senza perdere il testo. ?Inviata? significa accettazione provider, non consegna o lettura.
- Recupero storico: `node --import tsx scripts/import-contact-reply.ts <email-id>` controlla il match univoco contatto/email/oggetto/data; `--apply` importa senza inviare. Per la risposta del 13 novembre: ID Resend `01a1d5e4-0cb5-7903-b337-eecc2d307630`.
- Test mirati composizione/route superati (4), typecheck e lint superati; schema Prisma valido. Recupero storico verificato in sola lettura: corrispondenza univoca trovata per la risposta reale. Modifiche locali: migrazione, import storico e deploy non eseguiti.

## [IMPLEMENTATO IN LOCALE] Preventivi e PDF separato - 2026-11-13

- Nuova voce Preventivi nel gestionale, creazione con cliente e spedizione, righe da catalogo o personalizzate, opzioni libere, prezzi concordati IVA inclusa, sconto prodotti, spedizione esplicita, validita e condizioni. Elenco degli ultimi 100 preventivi e dettaglio riapribile.
- Numerazione PRE-anno-progressivo indipendente dagli ordini. Snapshot immutabile dei prezzi e dell'aliquota del negozio; importi ricalcolati sul server e salvataggio idempotente per requestId/hash.
- Il PDF usa lo stesso renderer e motore PDF dell'ordine, con PREVENTIVO rosso, validita, totale preventivo e note. Download solo su pulsante separato, anche dopo riapertura del dettaglio.
- QuoteEvent CREATED distinto da PDF_DOWNLOAD_REQUESTED: quest'ultimo viene salvato dopo generazione PDF riuscita per una richiesta autenticata. Non certifica la scrittura sul dispositivo. Nessun evento vendita o metrica commerciale aggiunto.
- API protette da sessione admin, CSRF, limiti richieste e corpo effettivo. Nessuna email o ordine creato. Le opzioni personalizzate restano testo; codice riscattabile, checkout, stock e metriche specifiche saranno implementati nella fase successiva secondo le indicazioni utente.
- Migrazione predisposta: prisma/migrations/20261113200000_add_quotes. Non applicata al database e nessun deploy eseguito.
- Verifica: 105 test server superati, lint e typecheck superati, schema Prisma valido. Test quote su prezzi/arrotondamenti, sanitizzazione PDF, autorizzazione, CSRF, salvataggio idempotente e separazione eventi. Prova Chromium del componente desktop/mobile, inserimento, salvataggio e download separato con API/router simulati, nessun overflow o errore JS. PDF dimostrativo renderizzato e controllato visivamente in output/pdf/preventivo-demo.pdf; verificato anche un preventivo da 30 righe su due pagine, intestazioni tabella ripetute e note accanto ai totali senza pagina finale orfana. Persistenza completa e funnel live da collaudare dopo migrazione; collegamento al carrello ancora da implementare.

## [IMPLEMENTATO IN LOCALE] Link dal PDF al pagamento del preventivo - 2026-11-13

- Modello grafico unico ordine/preventivo mantenuto. PDF con PREVENTIVO rosso, scadenza sopra e, sotto, condizioni di spedizione, testo di accettazione e link cliccabile dedicato.
- Validita automatica di un mese di calendario, con fine mese e fine giornata Europe/Rome (DST incluso). Il server decide la data; il campo gestionale e di sola lettura. Nessun rinnovo della validita scaricando di nuovo.
- Generazione PDF: prepara customer e Checkout Stripe con prezzi, sconto, spedizione e indirizzo del preventivo, quindi inserisce un link stabile /preventivo/<token>. Stripe ha una sessione a durata limitata: il link recupera o rinnova la sessione entro la validita. Negli ultimi minuti, Stripe concede la finestra tecnica minima di 30 minuti a un checkout accettato prima della scadenza.
- Il cliente vede riepilogo e indirizzo e deve confermare esplicitamente accettazione delle condizioni e correttezza dell'indirizzo prima del POST stesso dominio. GET e scansioni del link non creano ordini e non riservano stock.
- L'ordine ordinario, il collegamento quoteId, l'evento di accettazione e la riserva stock vengono creati solo al passaggio al pagamento. Snapshot del preventivo senza ricalcolo dal catalogo. Righe necessariamente collegate a catalogo/SKU; opzioni e prezzi restano concordabili. Corretto il cap silenzioso a 99 della normalizzazione stock, per supportare le quantita dei preventivi.
- Lock sul preventivo e riuso sessione/ordine impediscono duplicazioni ai retry. Sessioni complete e preventivi pagati bloccano un secondo checkout. Sessioni scadute liberano le riserve del vecchio tentativo prima del rinnovo; errori di persistenza dopo predisposizione Stripe scadono la sessione interessata.
- Webhook e flusso ORDER_PAID esistenti: quote.paidAt e evento PAID nella stessa transazione dell'ordine; stock, numerazione ed email seguono il flusso ordinario. Indirizzo di spedizione confermato preservato anche se la fatturazione Stripe differisce.
- Pagina privata non indicizzabile e senza referrer; token oscurato dai percorsi analytics. Contesto anonimo ordine preservato, nessuna nuova dashboard/metrica specifica aggiunta.
- Migrazione aggiuntiva 20261113210000_quote_payments predisposta, non applicata. Nessun deploy, nessuna chiamata Stripe reale e nessun pagamento reale eseguiti.
- Verifica: 109 test server superati, lint e typecheck. Prove con Stripe/DB simulati per preparazione, retry concorrenti, importi, stock oltre 99, scadenza/rinnovo, blocco pagato, mese civile, consenso/Origin e conferma ordine/email idempotente. Browser desktop/mobile: modulo admin e pagina cliente con accettazione obbligatoria prima del POST; servizi simulati. PDF reale renderizzato e verificato, inclusa annotazione cliccabile. Anteprima output/pdf/preventivo-demo.pdf con link dimostrativo NON attivo. Collaudo completo reale da eseguire dopo migrazione e pubblicazione.

### Email preventivi con PDF e storico in Messaggi - 2026-11-13

- Lista preventivi: azione "Invia per email", destinatario dal preventivo e oggetto/testo modificabili. PDF con link diretto al pagamento generato e allegato lato server; nessun invio automatico dal semplice salvataggio.
- QuoteEmail conserva prima dell'invio destinatario, mittente, testo e bytes del PDF. Retry con lo stesso identificativo usa lo stesso allegato e la stessa chiave Resend; invii confermati non vengono ripetuti. Tentativi ambigui oltre 23 ore richiedono verifica. Un errore nel salvataggio della ricevuta dopo accettazione non viene presentato come mancato invio.
- Messaggi: sezione "Email preventivi", elenco con data/stato, testo espandibile e download autenticato del PDF storico, senza rigenerazione da un preventivo eventualmente modificato. Accettazione del provider distinta da consegna/lettura.
- API admin con autenticazione, CSRF, limiti di frequenza e dimensione; allegati scaricabili solo da amministratori. Migrazione additiva 20261114000000_quote_emails applicata esclusivamente a delpasqua_dev locale; client Prisma rigenerato. Avviso nel compositore: il link localhost nel PDF non è utilizzabile da clienti esterni.
- Verifica: invii simulati, deduplicazione, errori provider/ricevuta, limiti, auth/CSRF e download esatto del PDF. Chromium su modulo e lista Messaggi con riga dimostrativa temporanea poi rimossa dal solo database locale; screenshot scratch/quote-email-composer.png e scratch/quote-email-history.png. Download autenticato 200, anonimo 401. Nessuna email reale o deploy eseguiti.

### Apertura diretta Stripe dal PDF - 2026-11-13

- Il link stabile /preventivo/<token> apre direttamente il checkout Stripe tramite GET dedicata con token non indovinabile, rate limit e calcoli solo lato server. Nessun modulo intermedio; ordine e riserva stock predisposti al passaggio verso Stripe, con riuso idempotente del tentativo aperto.
- Pagina riepilogo conservata per errori, scadenza, pagamento ricevuto e ritorno dopo annullamento. Cancel URL con cancelled=1 per evitare cicli di redirect. PDF aggiornato con etichetta "Vai al pagamento"; funzionano anche i link nei PDF già generati.
- Verifica locale: link 307, endpoint 303 verso checkout.stripe.com in modalità test. Sei test checkout/route/PDF, typecheck e lint superati. Nessun pagamento o deploy eseguito.

### Correzione invio al pagamento dal preventivo - 2026-11-13

- La policy referrer della pagina cliente passa da no-referrer a same-origin: il modulo HTML invia un Origin valido al checkout, mentre il token privato non viene trasmesso a siti esterni. Il redirect verso Stripe conserva no-referrer e il controllo Origin della POST resta rigoroso.
- Verifica Chromium reale: consenso e clic sul pulsante producono Origin http://localhost:3000; POST intercettata prima di modificare ordine/stock. Test route conferma il rifiuto di origini esterne, null e mancanti. Typecheck superato.

### Modifica preventivo salvato - 2026-11-13

- Pulsante in alto "Modifica preventivo" nel gestionale, con riapertura dei campi e salvataggio sullo stesso numero. Catalogo disponibile anche nel dettaglio.
- PATCH autenticata con CSRF, limite dimensione e frequenza; ricalcolo importi lato server. Numero, scadenza e link pubblico preservati. Prima della modifica viene scaduto il precedente checkout Stripe; nuovi customer e sconti usano chiavi idempotenti per versione dei dati.
- Modifiche bloccate per preventivi già accettati, pagati o con checkout completato. Un errore nella chiusura del checkout impedisce il salvataggio.
- Verifica: test aggiornamento e checkout superati, prova HTTP locale del dettaglio, PATCH e rigenerazione PDF con Stripe test (tutti 200), senza cambiare i contenuti del preventivo esistente. Nessun deploy.

### Rifinitura visiva preventivo - 2026-11-13

- Colonne prodotto a larghezza fissa, prima riga di prodotto/quantita/prezzo/totale sulla stessa baseline; cifre tabulari e importi a destra. Allineati anche i valori dei campi Data Preventivo e Pagamento.
- Link di accettazione blu, titolo PREVENTIVO sempre rosso. Spazi aumentati tra intestazione, dati, tabella, riepilogo e condizioni. Modifiche CSS limitate al preventivo, nel renderer condiviso.
- Anteprima con tre prodotti su una pagina, verificata visivamente e tramite coordinate PDF (baseline identica dei quattro campi). Lint, typecheck e tre test composizione preventivo superati. PDF locale aggiornato; nessun deploy o pagamento eseguito.
