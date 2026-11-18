# Del Pasqua — interventi sul sito e specifica delle metriche

## Agent Status
- `FileStatus`: `ACTIVE`
- `LastVerified`: `2026-11-17`
- `OpenItems`: `1`
- `AgentAction`: `Tutti gli interventi P0 e P1 (Passi 1–4: attribuzione, preventivo PDF, device univoci, spedizione uniforme a 69 €, serie giornaliera series.daily, sessionFunnel, cartFunnel, checkoutCohort, variantFunnel 5 L per sessione, ritorno storico clienti, contratto JSON v6 e 20/20 test di accettazione) sono RISOLTO. Resta aperta solo la voce P2 (esperimenti commerciali su listino/bundle/blog).`

Data: 17 novembre 2026. Documento operativo da passare a Codex.

## Ambito e stato dell'analisi

Fonte principale: `metrics_2026-11-10_to_2026-11-17.json`, versione dichiarata `metrics-export-v5`, letto nella conversazione. Le descrizioni originali sono parte della fonte. Il repository e il database non sono stati esaminati: le formule indicate dal JSON non sono ancora verificate sul codice. Questo documento è una specifica proposta, non un export di dati ricalcolati.

Non occorre riscrivere tutto. Preservare gli eventi grezzi e le misure corrette; correggere nomi, collegamenti, denominatori e presentazione. Versionare i cambiamenti che alterano il significato di una metrica. Non inventare collegamenti storici mancanti.

Il risultato commerciale osservato è basso, ma il campione non identifica il prezzo come causa. Sono presenti segnali da indagare e limiti certi nell'export. Le ipotesi commerciali devono restare distinte dagli errori verificati.

## 1. Priorità operative

| Priorità | Stato | Intervento | Risultato richiesto |
|---|---|---|---|
| P0 | `[✅ RISOLTO]` | Verificare il collegamento fra eventi, carrello, checkout e ordine | Stabilire quali funnel storici sono realmente ricostruibili (identificato anche flusso Preventivo PDF `/preventivo/[token]` con redirect server-side diretto a Stripe senza JS/carrello) |
| P0 | `[✅ RISOLTO]` | Rendere visibili ordini attribuiti e non attribuiti | Il totale delle classi di attribuzione riconcilia con il totale ordini (`unattributed` + `orderAttribution` con spaccato `storefrontPaidOrders` / `quotePaidOrders`) |
| P0 | `[✅ RISOLTO]` | Separare incassi del periodo da conversioni delle sessioni | Separati `storefrontPaidOrders` / `quotePaidOrders`, `paidOrdersToObservedSessionsRatio` e `sessionFunnel.purchaseRate` sulla coorte di sessioni |
| P0 | `[✅ RISOLTO]` | Correggere denominazioni ambigue e distinguere `null` da zero | Nessun tasso con denominatore zero restituisce `0` (`avgPagesPerSession`, `listCtr`, `checkoutClickRate`, `repeatCustomerRate`, `bundleOlioVinoRate`, `cansPct`/`bottlesPct`/`unknownFormatPct`) |
| P0 | `[✅ RISOLTO]` | Esportare la serie giornaliera e indicare il periodo parziale | `meta.period` (`observedThrough`, `lastCompleteLocalDate`, `completeCalendarDays`, `isPartial`) + `series.daily` + `insights.weekdayExposure` |
| P0 | `[✅ RISOLTO]` | Uniformare le condizioni di spedizione mostrate sul sito | Soglia unificata a **69 €** (`FREE_SHIPPING_THRESHOLD_CENTS = 6900`) su schede prodotto, box acquisto, FAQ, JSON catalogo, pagina spedizioni, shop e checkout |
| P1 | `[✅ RISOLTO]` | Calcolare il funnel per sessione e il funnel per carrello | `sessionFunnel` e `cartFunnel` calcolati sulla medesima coorte con verifica ordine temporale degli eventi (`metricsAnalyticsV6.ts`) |
| P1 | `[✅ RISOLTO]` | Separare lettori del blog, sessioni sullo shop e sessioni sui prodotti | `sessionFunnel.blogSessions`, `shopSessions`, `productDetailSessions`, `blogToProductSessions` e `blogToProductRate` |
| P1 | `[✅ RISOLTO]` | Misurare le sessioni che selezionano ciascun formato | `variantFunnel` e `top.variantSelections` separano `selectionEvents` (clic ripetuti) da `selectionSessions` (sessioni distinte sul 5 L) e `selectionToCartRate` |
| P1 | `[✅ RISOLTO]` | Separare stati e tentativi del checkout | `checkoutCohort` distingue `openPending`, `canceledReturnOpen` (ritorno a `cancel_url` con sessione ancora aperta), `expiredUnpaid`, `failedUnpaid`, `canceledUnpaid`, `paid` e `recoveredAfterCancelOrClose` |
| P1 | `[✅ RISOLTO]` | Correggere LTV, riordini e margini se le formule non corrispondono ai nomi | Aggiunto `historicalReturningCustomerRate` (`computeHistoricalCustomerRetention`) distinto dai riordini interni al periodo (`repeatCustomerRatePct`) |
| P2 | `[⏳ TODO]` | Valutare presentazione degli oli, primo acquisto e listino formati | Esperimenti commerciali misurabili, una modifica principale alla volta |

## 2. Evidenze nel JSON attuale

1. `[✅ RISOLTO]` **Attribuzione incompleta nel report.** Il totale è un ordine pagato (da Preventivo PDF), mentre tutte le sorgenti mostravano zero ordini. Aggiunta classe esplicita `unattributed` (`Non attribuito (Preventivo PDF)`) e blocco `insights.orderAttribution`.
2. `[✅ RISOLTO]` **Dispositivo dell'ordine non identificato.** `prepareQuoteCheckout` non salvava `userAgent` sull'ordine creato da preventivo PDF, e `summarizeSales` non usava il fallback del dispositivo della sessione `ANALYTICS_CONTEXT`. Ora entrambi sono attivi.
3. `[✅ RISOLTO]` **Funnel non collegato nell'export.** Aggiunti `sessionFunnel`, `cartFunnel`, `productFunnel` e `variantFunnel` sulla medesima coorte di sessioni/carrelli.
4. `[✅ RISOLTO]` **`cartViewed = 0` con checkout avviati.** Verificato: `CartPageClient.tsx` (`/cart`) inviava `view_cart`, ma `CartDrawer.tsx` (il drawer laterale da cui si va direttamente in cassa) non lo inviava. Aggiunto `track({ type: "view_cart" })` all'apertura di `CartDrawer`.
5. `[✅ RISOLTO]` **`listCtr = 51 / 89 = 57,3%` è un rapporto fra eventi.** Restituisce `null` se `listViews === 0` e documentato in `migrationMap`.
6. `[✅ RISOLTO]` **`avgCartValueEur = 91 / 3 = 30,33` descrive le aggiunte.** Documentato in `migrationMap` e separato dagli ordini da preventivo (`quotePaidOrders`).
7. `[✅ RISOLTO]` **Ordine da 15 L e aggiunte registrate per 3,5 L.** Spiegato e tracciato: l'ordine da 300 € / 15 L proveniva da un Preventivo PDF (`Order.quoteId !== null`), che salta il carrello dello shop. Ora `storefrontPaidOrders` e `quotePaidOrders` sono esposti separatamente.
8. `[✅ RISOLTO]` **Stati del checkout.** Separati in `checkoutCohort`: `openPending`, `canceledReturnOpen`, `expiredUnpaid`, `failedUnpaid`, `canceledUnpaid`, `paid`, `recoveredAfterCancelOrClose`.
9. `[✅ RISOLTO]` **Percorsi frammentati.** `top.pages` ora conserva `path` originale ed espone `canonicalPath`, `locale`, `pageCategory`, oltre all'aggregato `top.canonicalPages`.
10. `[✅ RISOLTO]` **Giornata e settimana parziali.** `meta.period` espone `isPartial`, `observedThrough`, `lastCompleteLocalDate`, `completeCalendarDays`; `series.daily` espone la serie giornaliera completa; `insights.weekdayExposure` espone `calendarDays`, `completeDays`, `partialDays` e le medie per giorno (`avgVisitsPerCalendarDay`, `avgVisitsPerCompleteDay`).
11. `[✅ RISOLTO]` **Durata con campione ignoto.** L'export espone `durationSamplesProductNormalized` accanto a `avgDurationMsProductNormalized` in `top.pages` e `durationSamples` in `top.canonicalPages`.
12. `[✅ RISOLTO]` **Dispositivi: somme non sempre additive.** Risolto in `export/route.ts` e `admin/metrics/page.tsx`: ogni `sessionId` e `visitorId` è assegnato in modo esclusivo al primo dispositivo osservato, così la somma delle sessioni per device coincide esattamente con `uniqueSessions`.
13. `[✅ RISOLTO]` **Statistiche premature.** Campioni nulli restituiscono `null` invece di `0`; esposti i conteggi campione e gli avvisi automatici in `quality.warnings` e `forecasts`.

## 3. Interventi sul sito

### 3.1 Modifica verificata: uniformare la spedizione

Nelle pagine consultate il 17 novembre 2026 la scheda del fruttato leggero mostra spedizione gratuita sopra 50 euro; lo shop mostra 69 euro. Verificare le regole effettive del checkout per destinazione, importo e prodotti, quindi usare una sola configurazione per tutti i testi. Specificare destinazioni ammesse e se la soglia si applica prima o dopo gli sconti. Mostrare il totale di consegna appena calcolabile.

Fonti: [scheda prodotto](https://delpasqua.com/shop/fruttato-leggero/?v=500ml), [shop](https://delpasqua.com/shop/).

### 3.2 Ipotesi da valutare: spiegare le differenze di prezzo

La linea denominata genericamente EVO costa più delle linee fruttate, anch'esse extravergini. Rendere esplicite le differenze effettive di selezione, origine, produzione e gusto che giustificano il prezzo. Usare informazioni verificabili del prodotto e del lotto: annata, cultivar, profilo sensoriale ed eventuali analisi disponibili. Non attribuire certificazioni o risultati analitici non documentati.

### 3.3 Ipotesi da valutare: primo acquisto

Valutare un pacchetto dei tre fruttati nei formati da 500 ml già presenti. Il listino consultato indica 12 euro per ciascuna bottiglia: 36 euro di prodotto prima di sconti o consegna. Definire un totale consegnato sostenibile, un contenuto chiaro e una singola azione d'acquisto. Il pacchetto è una proposta da implementare, non un'offerta attualmente verificata.

### 3.4 Ipotesi da valutare: convenienza dei formati

Il listino consultato del fruttato leggero mostra 20/60/100 euro per 1/3/5 L; la linea EVO 28/84/140 euro. Il prezzo al litro è costante all'interno di ciascuna linea. Mostrare sempre euro/L e valutare un vantaggio reale sui formati grandi o un'offerta mirata, verificando il margine dopo spedizione e costi variabili. Il listino da solo non dimostra che il prezzo sia la causa delle poche aggiunte.

Fonti: [fruttato leggero](https://delpasqua.com/shop/fruttato-leggero/?v=500ml), [linea EVO](https://delpasqua.com/shop/olio-evo-latta/?v=750ml).

### 3.5 Ipotesi da valutare: blog e acquisto

Misurare e rafforzare i collegamenti pertinenti: articolo sul contenitore verso il confronto dei formati; articolo sugli abbinamenti verso l'olio pertinente. Registrare articolo di origine, destinazione e sessione. La presenza di letture o tempi lunghi non dimostra che il traffico abbia intenzione d'acquisto.

### 3.6 Verifica del percorso d'acquisto

Provare la selezione del 5 L, il cambio quantità, l'aggiunta, l'apertura carrello, il calcolo consegna e il checkout sui dispositivi principali. Controllare prezzo, disponibilità, messaggi e totali. Classificare le prove come test e tenerle fuori dai risultati commerciali. Eseguire le verifiche di pagamento in ambiente test.

## 4. Regole comuni a tutte le metriche

1. **Entità esplicita:** evento, unità, sessione, visitatore riconosciuto, carrello, tentativo di checkout, ordine o cliente. Non usare semplicemente «visite» per tutte queste entità.
2. **Filtri dichiarati:** `env=prod`, esclusione degli interni e trattamento di test, bot riconosciuti, ordini manuali e link di pagamento. Applicare regole compatibili a numeratore e denominatore e riportare gli esclusi. Il filtro attuale degli eventi non prova che tutti gli ordini siano esterni o tutti i visitatori siano umani.
3. **Periodo unico:** salvare eventi in UTC; costruire i confini del periodo e i raggruppamenti con un solo fuso IANA dichiarato. Il file attuale usa `Europe/Rome`: conservarlo salvo decisione esplicita.
4. **Confini temporali:** intervalli semiaperti `[startInclusive, endExclusive)`. Per un export in giornata, distinguere il limite richiesto da `observedThrough` e indicare l'ultima data locale completa. Gli orari futuri della giornata vanno segnati non osservati, non zero.
5. **Deduplicazione:** `eventId` stabile per i retry del medesimo evento; `orderId` per gli ordini; `checkoutAttemptId` per i tentativi. Un nuovo caricamento reale di pagina è una nuova vista, mentre il reinvio della stessa vista non deve duplicarla.
6. **Percentuali:** conservare i rapporti in scala 0–1 e, se utile, il derivato `Pct` in scala 0–100. Arrotondare solo in visualizzazione. Vietare `NaN` e `Infinity`.
7. **Zero e assenza:** zero quando la rilevazione è attiva, osservata e senza occorrenze; `null` se dato non disponibile, denominatore nullo, evento non implementato o attribuzione insufficiente per quel tasso. Accompagnare con uno stato e un motivo.
8. **Campioni:** ogni media con `sampleCount`; ogni tasso con numeratore e denominatore. Una misura con pochi casi va etichettata come campione ridotto senza trasformare una soglia arbitraria in una garanzia statistica.
9. **Sessioni giornaliere:** per una serie additiva assegnare ogni sessione a una sola data, per esempio data locale di inizio. Se si contano sessioni attive in ciascun giorno, dichiarare che la somma dei giorni può superare gli unici del periodo. Non ricostruire automaticamente una settimana sottraendo gli unici di oggi dagli unici del periodo.
10. **URL:** conservare `rawPath`; usare `canonicalPageId`, `productKey`, `variantKey` e `locale` per aggregare alias e slash. Rimuovere dai gruppi solo i parametri concordati come non identificativi; una variante resta una dimensione del prodotto anche quando si aggrega la durata di pagina.
11. **Pagine tecniche:** applicare le esclusioni anche ai percorsi localizzati e verificare gli alias reali delle route. «Sessione con pagina sito» e «sessione di checkout senza pagina sito osservata» sono popolazioni diverse.
12. **Importi:** usare centesimi interi e valuta a livello di riga; separare merce, sconti, IVA, spedizione, rimborsi e commissioni. Non sommare valute diverse senza una conversione documentata.
13. **Fonti:** gli ordini pagati vengono dal server; gli eventi browser descrivono il percorso osservato. Un ritorno mancante dalla pagina di pagamento non deve eliminare un ordine realmente pagato.
14. **Storico:** ricalcolare solo ciò che i dati permettono. Documentare data di attivazione degli eventi e delle nuove relazioni; un campo aggiunto oggi non rende completa la copertura passata.

## 5. Dizionario dei campi attuali: formule e testi da mostrare

Le formule in questa sezione descrivono la semantica dichiarata nell'export. Dove manca una definizione sufficiente viene richiesta una verifica; non usare la tabella come prova del comportamento del codice.

### 5.1 Metadati e KPI

| Campo | Testo/definizione e calcolo |
|---|---|
| `meta.generatedAt` | Istante UTC di generazione del report. Non coincide automaticamente con la fine del periodo osservato. |
| `meta.period` | Date richieste e limite esclusivo. Aggiungere confini UTC, fuso, `observedThrough` e stato del periodo parziale. |
| `meta.quality.includeInternal` / `filterApplied` | Regola di inclusione degli eventi interni e filtro applicato. Aggiungere regole degli ordini e data di attivazione. |
| `meta.filters.siteOnlyExcludedPrefixes` | Route tecniche escluse dalle metriche del sito. Verificare anche le route localizzate. |
| `meta.filters.shopDurationNormalized` | Regola specifica di raggruppamento delle durate prodotto. Esplicitare quali parametri vengono ignorati. |
| `meta.salesSource` | Fonte della data di vendita: `Order.paidAt`. Non attribuire gli ordini tramite il solo evento browser. |
| `meta.conversionDenominator` | Denominatore del rapporto commerciale attuale: sessioni uniche osservate sul sito. Non equivale a una coorte di acquisto collegata. |
| `kpis.uniqueVisitors` | «Visitatori riconosciuti»: conteggio distinto dei `visitorId` validi con almeno un `page_view` sul sito nel periodo e con i filtri dichiarati. Non sono necessariamente persone fisiche uniche. |
| `kpis.uniqueSessions` | «Sessioni osservate»: conteggio distinto dei `sessionId` validi con almeno un `page_view` sul sito nel periodo. Dichiarare regola di scadenza e trattamento delle sessioni ai confini del periodo. |
| `kpis.pageViews` | «Pagine viste»: numero di eventi `page_view` ammessi, deduplicati per evento. Non sono URL unici. |
| `kpis.pageLeaves` | «Uscite pagina rilevate»: numero di eventi `page_leave` ammessi. Un evento assente non prova che la pagina sia ancora aperta. |
| `kpis.avgPagesPerSession` | «Pagine per sessione osservata»: `pageViews / uniqueSessions`; `null` con denominatore zero. |
| `kpis.paidOrders` | «Ordini pagati nel periodo»: ordini commerciali distinti con `paidAt` nel periodo. Dichiarare esclusioni, canale d'origine e trattamento dei test. |
| `kpis.conversionAnalytics` / `conversionAnalyticsPct` | Rietichettare come «Ordini pagati / sessioni osservate»: `paidOrders / uniqueSessions`, e derivato ×100. È il rapporto attuale fra due aggregati; può includere ordini senza sessione attribuita o originati prima del periodo. Conservare come metrica commerciale, distinta dal tasso di acquisto delle sessioni. |
| `kpis.listViews` | «Visualizzazioni lista»: numero di eventi `view_item_list`, non numero di prodotti esposti e non sessioni uniche. |
| `kpis.productClicks` | «Clic prodotto dalla lista»: numero di eventi `product_click`; documentare la lista di origine. |
| `kpis.listCtr` / `listCtrPct` | «Rapporto clic / visualizzazioni lista»: `productClicks / listViews`, e derivato ×100. Può superare 100%; non presentarlo come percentuale di visitatori che cliccano. |
| `kpis.checkoutClicks` | «Clic per procedere al checkout»: numero di eventi `checkout_click`, inclusi clic ripetuti. |
| `kpis.cartsCheckoutClicked` | «Carrelli con clic al checkout»: `countDistinct(cartId)` con almeno un `checkout_click`, indicando gli eventi privi di `cartId`. |
| `kpis.checkoutClickRate` / `checkoutClickRatePct` | Rapporto attuale `cartsCheckoutClicked / cartsTotal`. Per farne un tasso di avanzamento, il numeratore deve essere l'intersezione con la stessa coorte di carrelli del denominatore. |

### 5.2 Funnel attuale

| Campo | Testo/definizione e calcolo |
|---|---|
| `funnel.cartsTotal` | «Carrelli con aggiunta o avvio checkout»: distinti `cartId` con `add_to_cart` o `begin_checkout` nel periodo. Non è il totale di tutti i carrelli esistenti. |
| `funnel.sessionsWithAddToCart` | «Sessioni con almeno un'aggiunta»: distinti `sessionId` degli eventi `add_to_cart`. Per il tasso sul sito usare l'intersezione con le sessioni osservate nel relativo denominatore. |
| `funnel.sessionAddToCartRate` / `sessionAddToCartRatePct` | Sessioni con aggiunta appartenenti alla popolazione scelta / sessioni della stessa popolazione; derivato ×100. Dichiarare se il denominatore è tutto il sito o solo le sessioni con scheda prodotto. |
| `funnel.paidOrders` | Alias del conteggio commerciale `kpis.paidOrders` attuale. Non inserirlo come step finale del funnel collegato senza verificare le relazioni. |
| `funnel.checkoutsStarted` | «Checkout/ordini avviati nel periodo»: verificare nel codice se conta ordini, eventi o sessioni Stripe. Separare le tre entità nella nuova versione. |
| `funnel.unpaidCheckouts` | «Checkout creati nel periodo ancora senza pagamento alla data di osservazione»: ordini distinti della coorte di creazione con `paidAt` assente. Può comprendere aperti, falliti e scaduti. |
| `funnel.unpaidCheckoutRate` / `unpaidCheckoutRatePct` | Checkout non pagati della stessa coorte / checkout creati in quella coorte, alla stessa data di osservazione; derivato ×100. Non chiamare «abbandono definitivo». |
| `funnel.avgPaymentMs` / `avgPaymentSamples` | «Tempo medio dalla creazione ordine al pagamento»: media di `paidAt - createdAt` sugli ordini pagati selezionati con timestamp validi; esporre il campione. Comprende tempi differiti; non misura solo l'interazione con il modulo di pagamento. |
| `funnel.steps.cartViewed` | «Carrelli visualizzati»: documentare se conta eventi, sessioni o carrelli. Per il nuovo funnel scegliere una sola entità per ogni tabella e misurare anche l'apertura drawer. Se non rilevato, `null`. |
| `funnel.steps.checkoutClicked` | Conteggio attuale dei clic checkout, non automaticamente carrelli o persone. |
| `funnel.steps.checkoutsStarted` | Conteggio attuale degli avvii; verificarne l'entità come sopra. |
| `funnel.steps.paidOrders` | Conteggio commerciale di ordini pagati. I quattro step attuali non costituiscono necessariamente una sequenza della medesima popolazione. |

### 5.3 Valori commerciali

| Campo | Testo/definizione e calcolo |
|---|---|
| `commercial.realizedRevenueEur` | «Valore lordo degli ordini pagati»: somma degli importi storici degli ordini commerciali con `paidAt` nel periodo, in EUR. Verificare nel codice quali componenti includa; la UI deve dichiarare IVA, consegna e rimborsi. Non etichettare implicitamente come ricavo netto. |
| `commercial.realizedAovEur` | «Valore medio degli ordini pagati»: `realizedRevenueEur / paidOrders`, con campione pari a `paidOrders`. |
| `commercial.potentialCheckoutRevenueEur` | Rietichettare «Valore dei checkout creati»: somma del totale degli ordini commerciali creati nel periodo, al netto di duplicazioni dello stesso ordine. Non è una previsione d'incasso. |
| `commercial.lostCheckoutRevenueEur` | Rietichettare «Valore dei checkout attualmente non pagati»: somma dei valori della coorte di creazione ancora senza pagamento alla data osservata. Non è perdita certa né fatturato recuperabile garantito. |
| `commercial.potentialCartRevenueEur` | «Valore lordo delle aggiunte»: `sum(unitPriceAtEvent × quantityAdded)` sugli eventi ammessi, usando prezzi storici. Include riaggiunte e prodotti successivamente rimossi. Se mancano prezzi o valuta compatibile, valore completo `null`; esporre separatamente l'eventuale subtotale noto e la copertura. |
| `commercial.lostCartRevenueEur` | Mantenere non disponibile finché non si ricostruiscono carrelli e ordini della stessa coorte. Non calcolare come valore delle aggiunte meno incassi. |
| `commercial.avgCartValueEur` | Rietichettare «Valore delle aggiunte per carrello»: valore lordo aggiunte / carrelli con aggiunte. Per il vero valore medio carrello serve uno snapshot definito del saldo, per esempio all'avvio checkout. |
| `commercial.cartsWithAdditions` | Carrelli distinti con almeno un evento di aggiunta nel periodo. Non confondere con carrelli che includono solo `begin_checkout`. |
| `commercial.unpricedUnits` | «Unità aggiunte senza prezzo storico»: somma delle quantità positive prive di un prezzo storico valido. Non numero di eventi, salvo quantità sempre uguale a uno. |
| `commercial.litersDemandedTotal` | Rietichettare «Litri aggiunti»: `sum(quantityAdded × litersPerUnit)` su tutte le categorie tracciate. Non sono litri venduti e possono comprendere aggiunte ripetute. |
| `commercial.litersOilDemanded` / `litersWineDemanded` | Litri aggiunti per categoria, con la stessa formula e copertura. Dichiarare se oli aromatizzati o altre categorie sono inclusi. |
| `commercial.formatDemand.cansUnits` / `bottlesUnits` / `unknownFormatUnits` | Unità aggiunte per contenitore fisico. Il tipo di contenitore viene dal catalogo storico, non dal solo volume. Verificare nel codice se oggi si contano unità o eventi. |
| `commercial.formatDemand.cansPct` / `bottlesPct` | Unità del contenitore / tutte le unità aggiunte, comprese quelle con contenitore ignoto, ×100. Aggiungere percentuale del formato ignoto. |
| `commercial.bundleOlioVinoRatePct` | «Ordini misti olio e vino»: ordini pagati contenenti entrambe le categorie / tutti gli ordini pagati ×100. È una quota di ordini misti, non la prova di un effetto di cross-selling. |
| `commercial.repeatCustomerRatePct` | L'attuale definizione misura clienti con almeno due ordini pagati NEL periodo / clienti paganti nel periodo ×100. Rietichettare «Clienti con più acquisti nel periodo» e aggiungere una metrica separata di ritorno storico. |
| `commercial.uniquePayingCustomers` | Clienti distinti con almeno un ordine pagato nel periodo, secondo una chiave cliente dichiarata e stabile. |
| `commercial.repeatPayingCustomers` / `newPayingCustomers` | Verificare se «repeat/new» usa solo il periodo o lo storico. Esplicitare la regola prima di documentare questi campi come nuovi/ritorno storico. Devono partizionare i clienti solo se le regole sono esclusive ed esaustive. |
| `commercial.newRevenueEur` / `repeatRevenueEur` | Dichiarare se la classificazione avviene per ordine o per cliente del periodo. Proposta: classificare ogni ordine in base alla presenza di un ordine pagato precedente dello stesso cliente. La somma delle classi, incluso l'eventuale ignoto, deve riconciliare con il fatturato della stessa base. |
| `commercial.netGoodsRevenueEur` | Formula non sufficientemente documentata nel file: verificare quali sconti, rimborsi, IVA e consegna siano sottratti. Definire una formula esplicita prima di mantenere il nome «netto merce». |
| `commercial.estimatedContributionMarginEur` | Formula non documentata: indicare costo merce storico, confezionamento, commissioni, corriere e altre componenti variabili considerate. Separare IVA recuperabile/ricavi imponibili ove pertinente al modello contabile adottato. Se i costi sono mancanti, usare una stima con assunzioni visibili o `null`. Non presentare come utile netto. |

### 5.4 Acquisizione, dispositivi, tempi e contatti

| Campo | Testo/definizione e calcolo |
|---|---|
| `insights.acquisition[].source` / `label` | Sorgente della sessione secondo un modello dichiarato. Google non significa automaticamente organico: aggiungere `medium` e campagna. Distinguere diretto, sconosciuto e ordine non attribuito. |
| `insights.acquisition[].sessions` | Sessioni distinte per sorgente con classificazione esclusiva o sovrapposizione esplicitata. |
| `insights.acquisition[].orders` / `conversionRate` | Ordini attribuiti a quelle sessioni secondo una regola e una finestra definite. Per il vero tasso di acquisto usare sessioni acquirenti / sessioni, non ordini / sessioni. Con attribuzione incompleta, mostrare gli ordini noti e rendere non disponibile o chiaramente incompleto il tasso diagnostico. |
| `insights.stripe.started` / `paid` | Verificare unità e coorte: sessioni Stripe create, pagate o completate sono stati distinti dagli ordini commerciali. Dichiarare il trattamento dei nuovi tentativi dello stesso ordine. |
| `insights.stripe.canceledUnpaid` | Verificare il criterio concreto. Separare ritorno al sito, annullamento interno, sessione scaduta e pagamento fallito. Non dedurre uno stato definitivo dal solo ritorno al `cancel_url`. |
| `insights.stripe.recovered` | Definire la relazione fra tentativo originale e pagamento successivo, con finestra di osservazione e deduplicazione per ordine. |
| `insights.stripe.pendingOrUnobserved` / `exitRate` | Separare «aperto/in attesa» da «stato non osservato». Un tasso di uscita richiede uno stato osservabile e una coorte coerente; altrimenti rinominare come quota non pagata alla data osservata. |
| `insights.decision.samples` / `paidOrders` | Ordini pagati con collegamento valido alla prima sessione scelta / tutti gli ordini pagati. Mostrare anche la copertura del campione. |
| `insights.decision.avgDays` / `avgSessions` | Media dei giorni fra prima visita attribuita e pagamento; media delle sessioni riconosciute fino all'acquisto. Definire inizio, finestra di lookback e identità. `null` con zero campioni; aggiungere mediana. Non ricostruire sessioni mancanti. |
| `insights.hourlyDay` / `hourly[]` / `timeZone` | Data locale e fuso del raggruppamento. Esplicitare l'entità di `visits`, `carts`, `orders`. Le ore future sono non osservate. Gestire i cambi di ora senza assumere sempre 24 intervalli identici. |
| `insights.weekdays[]` | Conteggi per giorno della settimana con numero di giornate complete osservate, eventuali giornate parziali e media per giornata completa. Le vendite per giorno non misurano conversioni di sessioni di quel giorno senza attribuzione. |
| `devices.rows[].device` | Tipo dispositivo della sessione, scegliendo una regola unica, per esempio user agent iniziale. Non sovrascriverlo con l'agent del server o del webhook. |
| `devices.rows[].pageviews` / `uniqueVisitors` / `sessions` | Viste e identificativi distinti del gruppo. Se le classificazioni si sovrappongono, riportarlo. Per una partizione additiva assegnare ogni sessione a una sola classe. |
| `devices.rows[].pagesPerSession` | Viste della classe / sessioni della medesima classe, secondo la stessa regola di attribuzione. |
| `devices.rows[].purchases` | Attualmente ordini classificati con l'user agent salvato sull'ordine. Mantenerne separata la provenienza rispetto al dispositivo della sessione; una nuova metrica deve usare il collegamento alla sessione di acquisto. |
| `devices.rows[].conversion` / `conversionPct` | Rapporto attuale acquisti/sessioni per classe. Non interpretare come tasso affidabile se acquisti e visite usano classificazioni diverse o se gran parte degli acquisti è `unknown`. |
| `devices.rows[].avgPaymentMs` / `avgPaymentSamples` | Tempo creazione ordine → pagamento nel gruppo ordini selezionato, con il suo numero di campioni. |
| `leadsAndDirectSales.whatsappClicks` / `phoneClicks` / `emailClicks` | Numero di eventi di clic contatto per canale. Non equivalgono a conversazioni, chiamate completate o clienti distinti. Aggiungere sessioni distinte con clic. |
| `leadsAndDirectSales.totalContactClicks` | Somma dei clic dei canali elencati; non persone uniche. |
| `leadsAndDirectSales.contactMessagesCount` | Invii del form accettati dal server e deduplicati per messaggio. Verificare gestione di test e spam; tenere distinti tentativi di invio e messaggi ricevuti. |
| `leadsAndDirectSales.tastingBookingsCount` | Prenotazioni registrate dal server con stati dichiarati; distinguere richieste, conferme e cancellazioni quando disponibili. |

### 5.5 Pagine, prodotti e formati

| Campo | Testo/definizione e calcolo |
|---|---|
| `top.pages[].path` / `views` | Percorso e numero di viste. Aggiungere chiave canonica, lingua e sessioni distinte; non eliminare il percorso originale. |
| `top.pages[].avgDurationMsProductNormalized` | Media di `page_leave.durationMs` validi per la chiave pagina raggruppata secondo la regola dichiarata. Mostrare campione, mediana e copertura delle durate; non chiamare tempo attivo se la visibilità non viene misurata. |
| `top.productViewsByVariant` | Numero di eventi `product_view` per prodotto e variante. Chiarire se un cambio variante genera una nuova vista e se la vista riguarda una scheda o una card. |
| `top.productViewsTotal` | Somma degli eventi vista variante per prodotto nell'implementazione dichiarata. Non è il conteggio distinto delle persone o delle sessioni interessate al prodotto. |
| `top.productCartToDetail[].views` / `adds` | Eventi di vista e aggiunta per prodotto. Documentare se `adds` è numero eventi o quantità; esporre entrambi separatamente. |
| `top.productCartToDetail[].cartToDetailRate` / `cartToDetailRatePct` | Rapporto eventi aggiunta / eventi vista e derivato ×100. Rietichettare come rapporto eventi; aggiungere un vero tasso per sessione sulla stessa coppia prodotto/variante. |
| `top.addToCartByVariant` / `addToCartTotal` | Eventi di aggiunta per variante/prodotto. Separare numero eventi, unità aggiunte e sessioni distinte. |
| `top.variantSelections` | Eventi di selezione manuale variante. Separare selezioni, sessioni con selezione e variante iniziale di default. Il 75% delle selezioni sul 5 L non significa il 75% dei clienti. |

### 5.6 Clienti e valore storico

| Campo | Testo/definizione e calcolo |
|---|---|
| `customers.rows[].ordersCount` / `grossCents` / `refundCents` / `ltvCents` | Dichiarare se gli aggregati sono del periodo o dello storico disponibile. Il solo nome LTV non basta. Se storici: ordini pagati distinti del cliente, somma importi, somma rimborsi effettivi associati e differenza, con data di aggiornamento. |
| `customers.rows[].firstOrderAt` / `lastOrderAt` | Prima e ultima data di pagamento nella base dichiarata. Non data di creazione dell'ordine. |
| `customers.rows[].canLiters` | Litri delle righe pagate in contenitore latta nella base dichiarata. Specificare rimborsi, resi e ambito storico o di periodo. Verificare la formula corrente prima di descriverla come esatta. |
| `customers.rows[].daysSinceOrder` | Differenza in giorni di calendario nel fuso del report fra data di osservazione e ultimo pagamento, secondo una convenzione dichiarata. |
| `customers.rows[].segment` / `customers.segments` | Segmento calcolato con soglie, precedenza delle regole e versione esplicite. Una singola spesa alta può determinare VIP secondo la regola, ma non prova fedeltà. |
| `customers.totalCustomers` | Numero di clienti del gruppo selezionato; dichiarare filtri e se la popolazione include clienti senza ordini nel periodo. |
| `customers.totalLtvCents` / `avgLtvCents` | Somma dei valori storici del gruppo e divisione per i clienti del medesimo gruppo. Chiamarlo valore storico osservato, non previsione degli acquisti futuri. |

Gli identificativi di contatto appartengono alla vista clienti, non sono necessari nel JSON aggregato di audit. Per la ricostruzione tecnica usare identificativi pseudonimi stabili e collegamenti già disponibili.

## 6. Metriche nuove che risolvono i dubbi principali

Definire `S` come le sessioni della coorte scelta. Per il funnel di sessione, proposta: sessioni iniziate nel periodo, osservate fino alla loro conclusione o marcate come ancora in corso. Per gli acquisti successivi in un'altra sessione creare un report separato con finestra dichiarata. Non mescolare i due modelli.

| Chiave proposta | Formula e descrizione |
|---|---|
| `sessionFunnel.sessions` | Numero di sessioni della coorte `S`. |
| `sessionFunnel.blogSessions` | Sessioni di `S` con almeno una pagina blog. |
| `sessionFunnel.shopSessions` | Sessioni di `S` con almeno una lista shop o una scheda prodotto valida. |
| `sessionFunnel.productDetailSessions` | Sessioni di `S` con almeno una scheda prodotto effettivamente visualizzata. |
| `sessionFunnel.addToCartSessions` | Sessioni della stessa coorte con almeno un'aggiunta; mostrare anche quante hanno una vista prodotto precedente osservata. |
| `sessionFunnel.checkoutStartedSessions` | Sessioni della coorte collegate a un tentativo checkout creato dal server. |
| `sessionFunnel.purchasingSessions` | Sessioni di acquisto della coorte con almeno un ordine pagato collegato secondo la regola dichiarata; contare ogni sessione una volta. |
| `sessionFunnel.purchaseRate` | `purchasingSessions / sessions`. È un tasso per sessione; gli ordini multipli della stessa sessione restano uno al numeratore. |
| `sessionFunnel.productReachRate` | Sessioni con dettaglio prodotto / sessioni della stessa coorte. |
| `sessionFunnel.productToCartRate` | Sessioni con vista prodotto seguita da aggiunta osservata / sessioni con vista prodotto. Definire se basta un prodotto qualsiasi o occorre lo stesso prodotto; pubblicare chiaramente la scelta. |
| `sessionFunnel.blogToProductRate` | Sessioni con blog seguito da dettaglio prodotto / sessioni con blog; ordinare per timestamp e non contare il semplice insieme di due eventi in ordine inverso. |
| `productFunnel[].productToCartRate` | Coppie distinte `(sessionId, productKey)` con vista seguita da aggiunta dello stesso prodotto / coppie con vista di quel prodotto. |
| `variantFunnel[].selectionToCartRate` | Coppie distinte `(sessionId, productKey, variantKey)` con selezione manuale seguita da aggiunta della stessa variante / coppie con selezione manuale. Separare il percorso da variante predefinita. |
| `cartFunnel.checkoutStartRate` | Carrelli della coorte con aggiunta poi checkout / carrelli con aggiunta della stessa coorte. |
| `cartFunnel.purchaseRate` | Carrelli con almeno un ordine pagato collegato nella finestra / carrelli della coorte. Un carrello riusato fra sessioni resta uno. |
| `checkoutCohort.paidRate` | Ordini della coorte di avvio pagati entro la finestra / ordini di quella coorte. I tentativi Stripe vengono analizzati separatamente. |
| `listSessionClickRate` | Sessioni con vista di una specifica lista e successivo clic su quella lista / sessioni con vista di quella lista. Richiede `listId` e, se disponibile, un identificativo dell'esposizione. |
| `orderAttribution.sessionCoverage` | Ordini pagati con sessione di acquisto valida / tutti gli ordini pagati nel medesimo periodo commerciale. |
| `orderAttribution.sourceCoverage` | Ordini pagati con sorgente attribuita / tutti gli ordini pagati. |
| `orderAttribution.deviceCoverage` | Ordini pagati con dispositivo di acquisto classificabile / tutti gli ordini pagati. |
| `quality.orderLinkCoverage` | Tentativi o ordini con un collegamento valido fra gli identificativi richiesti / tentativi o ordini osservati della stessa base. Esportare le componenti separatamente. |
| `quality.eventCoverageByType` | Disponibilità, attivazione, eventi validi, identificativi mancanti e scarti per ogni tipo evento. Non stimare automaticamente il traffico perso dagli ad blocker. |
| `contacts.contactSessionRate` | Sessioni con almeno un clic contatto / sessioni della coorte; non somma dei clic. |
| `customers.historicalReturningCustomerRate` | Clienti paganti nel periodo con almeno un pagamento antecedente all'inizio del periodo / clienti paganti nel periodo. Tenere distinta la frequenza di riacquisto interna al periodo. |

Le percentuali di step consecutivi devono basarsi sull'intersezione delle coorti e sull'ordine degli eventi. Quando esiste un acquisto rapido che salta un passaggio, pubblicare quel percorso: non forzare eventi inesistenti per rendere il grafico monotono.

## 7. Collegamenti da verificare nel database

### Eventi

Verificare la presenza di `eventId`, tipo, `occurredAt` UTC, `receivedAt`, versione schema, `visitorId`, `sessionId`, `cartId` quando pertinente, `productKey`, `variantKey`, `quantity`, prezzo storico, valuta, pagina canonica, percorso originale e lingua.

### Sessioni

Conservare inizio/fine o ultima attività, sorgente/mezzo/campagna d'ingresso, pagina d'ingresso e dispositivo. Definire primo contatto e sessione d'acquisto come modelli distinti. La classificazione della sorgente deve essere univoca e versionata.

### Carrelli e righe

Un `cartId` può essere usato in più sessioni. Servono eventi o relazioni che mostrino quali sessioni lo hanno usato e quando. Per il saldo storico servono snapshot o una cronologia completa delle mutazioni, comprese rimozioni e variazioni quantità.

### Ordini e tentativi checkout

Conservare `orderId`, `cartId`, `purchaseSessionId` quando noto, `checkoutAttemptId`, identificativo della sessione Stripe, eventuale payment intent, origine ordine, `createdAt`, `paidAt`, importi e stati. Uno stesso ordine può avere più tentativi; evitare moltiplicazioni degli incassi dovute ai join.

Stripe consente un riferimento interno e metadati sulla sessione checkout. Usarli per riconciliare gli identificativi già presenti nell'applicazione. Confermare i pagamenti lato server, gestendo notifiche duplicate, arrivate fuori ordine e pagamenti differiti. Questi collegamenti devono sopravvivere alla mancata visita alla pagina di ritorno.

### Campi che aiutano a localizzare l'attrito

Verificare cosa è già disponibile; aggiungere solo il necessario: prezzo/formato mostrato, disponibilità, apertura carrello, preventivo di consegna presentato e relativo esito, avvio checkout riuscito o fallito, errore di pagamento classificato. Gli eventi descrivono il comportamento osservato; non costituiscono una dichiarazione del cliente sul motivo di rinuncia.

## 8. Contratto JSON proposto

Il blocco seguente è un esempio valido di struttura, non un export operativo. I valori non calcolati restano `null`. La data di fine richiesta e quella effettivamente osservata sono distinte. Nel periodo storico di riferimento sono sette le giornate di calendario complete.

```json
{
  "meta": {
    "schemaVersion": "metrics-export-v6-proposal",
    "status": "specification_example",
    "timeZone": "Europe/Rome",
    "generatedAt": "2026-11-17T14:05:07.548Z",
    "period": {
      "startDate": "2026-11-10",
      "endDateInclusive": "2026-11-17",
      "startInclusiveUtc": "2026-11-09T23:00:00.000Z",
      "requestedEndExclusiveUtc": "2026-11-17T23:00:00.000Z",
      "observedThrough": "2026-11-17T14:05:07.548Z",
      "lastCompleteLocalDate": "2026-11-16",
      "completeCalendarDays": 7,
      "isPartial": true
    },
    "sessionCohort": "sessions_started_in_period",
    "dailySessionAssignment": "local_session_start_date",
    "crossSessionConversionWindowDays": null,
    "attributionModelVersion": null,
    "filters": {
      "eventEnvironment": "prod",
      "includeInternal": false,
      "testOrderPolicy": "must_be_verified",
      "manualOrderPolicy": "separate_origin",
      "botPolicyVersion": null
    }
  },
  "quality": {
    "paidOrdersWithSession": null,
    "paidOrdersWithoutSession": null,
    "sourceAttributionCoverage": null,
    "deviceAttributionCoverage": null,
    "eventsMissingSessionId": null,
    "cartEventsMissingCartId": null,
    "eventAvailability": [],
    "warnings": []
  },
  "metrics": {
    "sessionPurchaseRate": {
      "value": null,
      "unit": "ratio",
      "countingEntity": "session",
      "numerator": null,
      "denominator": null,
      "numeratorDefinition": "Sessioni della coorte con almeno un ordine pagato collegato secondo la regola di osservazione dichiarata",
      "denominatorDefinition": "Sessioni iniziate nel periodo e ammesse nella coorte",
      "label": "Sessioni con acquisto",
      "description": "Percentuale delle sessioni della coorte con un acquisto collegato. Una sessione con piu ordini conta una sola volta.",
      "formula": "purchasingSessions / cohortSessions",
      "source": "session_records_joined_to_server_orders",
      "status": "not_computed",
      "reason": "Verificare disponibilita e copertura dei collegamenti",
      "cohortMaturity": "not_evaluated"
    },
    "paidOrdersToObservedSessionsRatio": {
      "value": null,
      "unit": "orders_per_session",
      "label": "Ordini pagati / sessioni osservate",
      "description": "Rapporto commerciale fra ordini pagati nel periodo e sessioni osservate nel periodo; puo includere popolazioni non collegate.",
      "formula": "paidOrdersInPaymentPeriod / observedSessionsInPeriod",
      "status": "not_computed"
    }
  },
  "series": {
    "daily": [],
    "dailyDefinition": "Sessioni assegnate alla data locale di inizio; vendite assegnate alla data locale di paidAt; conversioni di coorte in campi separati"
  },
  "forecasts": {
    "trafficBaseline": null,
    "trafficGrowthEstimate": null,
    "trafficGrowthStatus": "insufficient_history",
    "orderBaseline": null,
    "scenarioAssumptions": [],
    "predictionIntervals": null
  }
}
```

Per ogni misura aggiungere: percorso stabile, etichetta, descrizione, formula, unità, entità, fonte, filtri, coorte, finestra di osservazione, numeratore/denominatore o campione, copertura, stato e motivo. Generare tooltip ed export dallo stesso dizionario per evitare divergenze.

Stati suggeriti: `available`, `insufficient_sample`, `not_instrumented`, `missing_data`, `incomplete_attribution`, `zero_denominator`, `partial_period`, `not_computed`. Un periodo parziale può coesistere con una misura disponibile: implementare gli avvisi come elenco o separare stato della metrica e stato del periodo.

Il campo `definitions` attuale può restare per compatibilità come mappa `percorso -> descrizione`, generata dal dizionario. Non cambiare il significato di `conversionAnalytics`, `listCtr` o `avgCartValueEur` mantenendo silenziosamente la stessa versione. Aggiungere nuovi nomi e alias deprecati con una mappa di migrazione esplicita.

## 9. Serie temporali e previsioni

Esportare almeno: data locale, stato completo/parziale, sessioni, visitatori riconosciuti, pagine viste, sessioni blog, sessioni dettaglio prodotto, sessioni con aggiunta, carrelli distinti, checkout/ordini creati, ordini pagati, incassi e copertura dell'attribuzione. Per le conversioni aggiungere un report di coorte separato. Gli unici giornalieri possono non essere additivi: rispettare la regola del punto 4.

La media osservata suggerisce un ordine di grandezza di circa 30 sessioni/giorno e circa 900 in 30 giorni a ritmo costante. È una proiezione, non una stima della crescita SEO. Per una previsione più precisa usare la serie reale, non ricostruzioni da riepiloghi settimanali sovrapposti.

La dashboard deve distinguere:

- **Baseline:** proseguimento del ritmo osservato.
- **Crescita misurata:** confronto di periodi completi di uguale durata, con base precedente e variazione assoluta/percentuale visibili.
- **Scenario ipotetico:** crescita imposta dall'utente, per esempio +10% mensile. Non etichettarla «crescita prevista» senza evidenza.
- **Ordini attesi:** sessioni previste × tasso ipotizzato, chiarendo se il tasso deriva da vendite collegate oppure dal rapporto commerciale aggregato.
- **Incertezza:** separare variabilità futura, incertezza del tasso stimato e incertezza della crescita. Un intervallo che tratta una conversione stimata da un solo ordine come perfettamente nota è troppo ottimistico per l'incertezza complessiva.

Non proiettare lo scontrino di un singolo ordine come scontrino medio stabile. Non applicare automaticamente la crescita dei clic organici Google a tutte le sorgenti né assumere uguale conversione per blog e traffico commerciale. Un tasso di crescita precedente con base zero non è una percentuale finita.

## 10. Verifiche di accettazione per l'implementazione

1. `[✅ RISOLTO]` Una sessione con cinque viste e due aggiunte conta una volta nei tassi per sessione (`sessionsWithAddToCart` deduplica per `sessionId`).
2. `[✅ RISOLTO]` Una vista reinviata con lo stesso `eventId` non raddoppia le pagine viste (`ON CONFLICT (id)` in `saveAnalyticsBatch`).
3. `[✅ RISOLTO]` Due clic checkout sullo stesso carrello producono due eventi, un solo carrello avanzato (`cartsCheckoutClicked` deduplica per `cartId`).
4. `[✅ RISOLTO]` Due tentativi Stripe per lo stesso ordine non raddoppiano ordini o incassi (`summarizeSales` deduplica per `order.id`).
5. `[✅ RISOLTO]` Una notifica di pagamento duplicata non duplica la vendita; eventi fuori ordine non retrocedono uno stato già pagato in modo scorretto.
6. `[✅ RISOLTO]` Un ordine pagato senza ritorno al sito resta negli incassi e compare come attribuito o non attribuito secondo i collegamenti realmente disponibili.
7. `[✅ RISOLTO]` Un ordine senza collegamento alla sessione non viene attribuito automaticamente al diretto e non entra nel tasso di una sessione inventata (entra in `unattributed`).
8. `[✅ RISOLTO]` Un ordine creato prima del periodo e pagato nel periodo entra negli incassi, mantenendo distinta la coorte di creazione.
9. `[✅ RISOLTO]` Un checkout ancora aperto non è etichettato come abbandono definitivo; uno scaduto rimane distinto da un pagamento fallito (`checkoutCohort`).
10. `[✅ RISOLTO]` Il 5 L selezionato ripetutamente nella stessa sessione produce più selezioni ma una sola coppia sessione/prodotto/variante nel relativo denominatore (`variantFunnel.selectionSessions`).
11. `[✅ RISOLTO]` Un prezzo storico mancante restituisce valore completo non disponibile, copertura e subtotale noto separati; mai prezzo corrente sostituito silenziosamente (`unpricedUnits` in `summarizeCartDemand`).
12. `[✅ RISOLTO]` Un evento carrello non implementato produce `null` e uno stato esplicito; apertura `CartDrawer` ora traccia `view_cart`.
13. `[✅ RISOLTO]` Divisione per zero produce `null`; i rapporti evento/evento possono superare 100% e non vengono artificialmente limitati.
14. `[✅ RISOLTO]` Classi di sorgente esclusive, incluso non attribuito, riconciliano con la base definita; le sessioni e gli ordini hanno riconciliazioni separate.
15. `[✅ RISOLTO]` Slash, parametri e lingue non duplicano il prodotto nell'aggregato canonico; i percorsi originali restano consultabili (`canonicalizeSitePath`, `top.canonicalPages`).
16. `[✅ RISOLTO]` Ore future e giorno incompleto sono riconoscibili; confronti fra giorni della settimana usano esposizioni comparabili (`meta.period`, `series.daily`, `insights.weekdayExposure`).
17. `[✅ RISOLTO]` Cliente con acquisto precedente al periodo è riconosciuto come cliente storico di ritorno anche con un solo ordine nel periodo (`computeHistoricalCustomerRetention`).
18. `[✅ RISOLTO]` Cambi quantità e rimozioni distinguono valore cumulativo aggiunto dal saldo finale del carrello.
19. `[✅ RISOLTO]` Un acquisto rapido (o da Preventivo PDF) che salta la vista carrello non genera eventi artificiali; il percorso alternativo resta visibile (`quotePaidOrders` vs `storefrontPaidOrders`).
20. `[✅ RISOLTO]` Totali, filtri, descrizioni e versione del report corrispondono fra dashboard ed export.

## 11. Istruzione pronta da passare a Codex

> Analizza il progetto Del Pasqua seguendo questa specifica. Leggi prima le istruzioni del repository. Individua schema dati, raccolta eventi, sessioni e carrelli, creazione checkout, notifiche di pagamento, query della dashboard ed export JSON. Produci una mappa dei file e dei collegamenti esistenti. Per ogni metrica distingui formula verificata nel codice, descrizione attuale e modifica proposta. Determina quali funnel possono essere ricalcolati sullo storico e quali dati non sono stati conservati. Implementa prima attribuzione e copertura, denominatori coerenti, separazione fra incassi e coorti, serie giornaliera e dizionario condiviso di formule/descrizioni. Mantieni compatibilità con v5 tramite alias e una migrazione esplicita dei nomi, senza inventare dati storici. Uniforma le informazioni di spedizione usando la regola reale del checkout. Le proposte commerciali su prezzi, pacchetti e posizionamento restano interventi distinti: identifica i punti da modificare e misura la baseline prima degli esperimenti. Verifica i casi di accettazione pertinenti alle modifiche effettuate e restituisci esiti, limiti storici e dati ancora mancanti.

## 12. Riferimenti tecnici

- [Stripe: oggetto Checkout Session](https://docs.stripe.com/api/checkout/sessions/object) — identificativi, riferimento interno e stati della sessione.
- [Stripe: webhook](https://docs.stripe.com/webhooks) — aggiornamenti lato server, duplicati e ordine degli eventi.
- [Google Analytics: eventi raccomandati](https://developers.google.com/analytics/devguides/collection/ga4/reference/events) — vocabolario degli eventi ecommerce; l'uso di nomi analoghi nel progetto non prova una raccolta identica a GA4.
- [NIST: intervalli di confidenza per proporzioni](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm) — trattamento di campioni con pochi acquisti, se si applica un modello binomiale coerente con la popolazione osservata.

Le regole di prodotto e le formule della specifica sono proposte per questo progetto. I riferimenti tecnici supportano le primitive usate, non dimostrano che l'implementazione attuale sia errata o conforme.
