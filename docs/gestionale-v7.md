# DEL PASQUA — Analytics & Management Dashboard V7

## Stato e aggiornamenti

Specifica di lavoro per il gestionale V7. La riconciliazione degli incassi e delle serie temporali è il primo intervento previsto. I risultati del dataset di riferimento sono criteri di collaudo.

Aggiungi qui le prossime segnalazioni con il periodo osservato, il dato rilevato e il risultato atteso. Per le metriche economiche indica anche la fonte usata per il confronto tra dashboard, JSON, database e Stripe.

| Data | Area | Miglioramento o evidenza | Stato |
| --- | --- | --- | --- |
| 27/11/2026 | Specifica V7 | Raccolti requisiti, anomalie e casi di test nelle sezioni qui sotto. | Implementato (V7) |
| 27/11/2026 | Sorgente commerciale, serie giornaliere, CRM, export V7 e UI | Consolidata `commercialTransactions.ts`, fissata esclusione voucher in `commerceInsights.ts`, aggiornato CRM multicanale, schema `metrics-export-v7`, controlli automatici di riconciliazione, forecast post-lancio (`2026-11-08`), UI `V7EconomicsSection.tsx` e 20 casi di test finanziari. | Verificato |

Per ripetere la riconciliazione storica serve il file `metrics_2026-10-28_to_2026-11-27(1).json` citato nella specifica.

## Obiettivo

Evolvere l'attuale sistema `metrics-export-v6` alla versione V7 del gestionale Del Pasqua.

L'intervento deve concentrarsi su:

- Consistenza e affidabilità delle metriche.
- Corretta determinazione degli incassi e dei ricavi.
- Riconciliazione delle vendite tra dashboard, database, Stripe ed esportazione JSON.
- Separazione dei canali commerciali.
- Correzione delle aggregazioni temporali.
- Correttezza dei funnel.
- Miglioramento della dashboard amministrativa esistente.

File di riferimento:

`metrics_2026-10-28_to_2026-11-27(1).json`

Analizzare preliminarmente `metricsAnalyticsV6.ts`, le relative dipendenze, il database, le API, i webhook Stripe e tutti i componenti frontend della dashboard.

Non riscrivere inutilmente le funzionalità già operative.

---

## 1. Sorgente unica dei dati commerciali

Implementare o consolidare una sorgente centralizzata e normalizzata delle transazioni commerciali.

La sorgente deve comprendere:

- Ordini ecommerce.
- Ordini tramite preventivo.
- Voucher degustazione.
- Degustazioni pagate direttamente, se supportate.
- Eventuali altri canali commerciali già implementati.

Ogni transazione deve avere un'identità univoca e, dove disponibili:

- ID della transazione.
- Canale commerciale.
- ID ordine o voucher.
- ID Stripe Checkout Session.
- ID Stripe Payment Intent.
- Data di creazione.
- Data di pagamento.
- Stato.
- Importo originario.
- Importo effettivamente pagato.
- Importo rimborsato.
- Imponibile.
- IVA.
- Spedizione.
- Sconti.
- Valuta.
- Cliente.
- Contesto analytics.

I dati finanziari devono provenire dal backend e dalle transazioni effettive, non dagli eventi analytics del browser.

Utilizzare importi interi in centesimi.

Evitare doppi conteggi quando lo stesso pagamento è rappresentato in più entità del database.

I webhook devono essere idempotenti.

---

## 2. Revisione completa delle metriche economiche

**Priorità massima.**

Verificare tutte le metriche economiche visualizzate nella dashboard e presenti nell'esportazione JSON.

### 2.1 Incassi commerciali lordi

Definire l'incasso commerciale lordo come la somma degli importi effettivamente pagati nel periodo, prima degli eventuali rimborsi.

Utilizzare la data di pagamento `paidAt`, non la data di creazione dell'ordine.

Non includere:

- Ordini non pagati.
- Preventivi non accettati o non pagati.
- Carrelli.
- Checkout non completati.
- Prenotazioni non pagate.
- Transazioni di test.
- Pagamenti duplicati.

Valori attesi sul dataset di riferimento:

- Ecommerce: 0 EUR.
- Preventivi: 300 EUR.
- Voucher degustazioni: 70 EUR.
- Totale incassi commerciali lordi: 370 EUR.
- Transazioni pagate: 2.
- Incasso medio per transazione: 185 EUR.

### 2.2 Incassi per canale

Implementare o consolidare una struttura `revenueByChannel`.

Canali:

- `storefront`
- `quote`
- `voucher`
- `tasting`
- Eventuali ulteriori canali effettivamente supportati.

Ogni canale deve riportare:

- Numero transazioni pagate.
- Incassi lordi.
- Rimborsi.
- Incassi al netto dei rimborsi, secondo la definizione temporale adottata.
- Importo medio delle transazioni.

La somma degli incassi lordi dei canali deve coincidere con il totale commerciale globale.

Garantire che ogni pagamento sia classificato una sola volta.

L'emissione o l'utilizzo di un voucher già pagato non deve generare un secondo incasso per lo stesso importo.

### 2.3 Rimborsi

Separare:

- Incassi lordi.
- Rimborsi effettuati nel periodo.
- Incassi netti dei rimborsi.

Per le metriche di flusso finanziario utilizzare:

`netCash = grossPaymentsInPeriod - refundsInPeriod`

Per le analisi delle coorti di ordini utilizzare invece i rimborsi associati agli ordini della specifica coorte.

Non confondere le due definizioni.

Gestire:

- Rimborsi parziali.
- Rimborsi totali.
- Rimborsi successivi alla data di acquisto.
- Rimborsi riferiti a ordini pagati in periodi precedenti.

Non cancellare retroattivamente la registrazione dell'incasso originale.

Se il sistema non dispone delle informazioni necessarie per determinare correttamente i rimborsi, indicare il dato come non disponibile.

### 2.4 Fatturato contabile, IVA e spedizioni

Verificare i campi disponibili nel database e nelle informazioni fiscali degli ordini.

Distinguere, dove determinabili:

- Incassi lordi.
- Ricavi dei prodotti.
- Ricavi delle degustazioni e dei servizi.
- Importi dei voucher.
- Ricavi delle spedizioni.
- Imponibile.
- IVA.
- Sconti.
- Rimborsi.

Non utilizzare indistintamente il termine fatturato per qualsiasi importo pagato.

Se non sono disponibili dati fiscali sufficienti, mostrare la metrica come "Incassi commerciali" invece di "Fatturato netto".

Non presumere che tutti i prodotti abbiano la stessa aliquota IVA.

Non sottrarre gli sconti due volte se l'importo pagato li include già.

Utilizzare i prezzi storici delle transazioni, non i prezzi correnti del catalogo.

Non assumere che l'incasso di un voucher equivalga automaticamente al riconoscimento del relativo ricavo contabile.

### 2.5 Margine di contribuzione

Nella versione attuale:

```txt
commercial.netGoodsRevenueEur = 300
commercial.estimatedContributionMarginEur = 180
```

Verificare esattamente come vengono determinati questi valori.

Controllare se il margine di 180 EUR deriva da costi effettivi oppure da una percentuale stimata applicata ai ricavi.

Se viene utilizzata una percentuale del 60%, documentarne esplicitamente la natura ipotetica e la configurazione.

Non presentare un margine stimato come utile effettivo.

Per un margine di contribuzione determinato attraverso costi reali, considerare, quando disponibili:

- Ricavi al netto dell'IVA.
- Costo dei prodotti venduti.
- Costi di confezionamento.
- Costi di spedizione sostenuti dall'azienda.
- Commissioni Stripe.
- Costi variabili delle degustazioni.
- Altri costi variabili effettivamente registrati.

Gestire correttamente i rimborsi.

Non sottrarre due volte IVA, sconti o spedizioni.

Distinguere chiaramente:

- Margine effettivo.
- Margine stimato.
- Margine non disponibile.

Se i costi non sono disponibili, non inventarli.

Non applicare automaticamente il margine dei prodotti ai voucher o alle degustazioni.

### 2.6 Valore medio delle vendite

Mantenere separati:

- Incasso medio commerciale complessivo.
- Scontrino medio ecommerce.
- Importo medio dei preventivi pagati.
- Importo medio dei voucher.
- Valore medio dei carrelli.

Nel dataset attuale:

```txt
Commercial average transaction = 185 EUR
Storefront AOV = null
Quote average transaction = 300 EUR
Voucher average transaction = 70 EUR
```

Se non esistono ordini pagati per un canale, il relativo valore medio deve essere `null`, non zero.

---

## 3. Correzione aggregazioni temporali

**BUG CONFERMATO.**

La versione V6 include il voucher da 70 EUR nel totale commerciale globale, ma non nelle aggregazioni giornaliere.

Risultato attuale:

```txt
Global paid transactions = 2
Global realized revenue = 370 EUR

Sum daily paid transactions = 1
Sum daily revenue = 300 EUR
```

Il voucher pagato il 27 novembre 2026 risulta assente dalla serie giornaliera.

Utilizzare la sorgente commerciale centralizzata per generare:

- KPI globali.
- Serie orarie.
- Serie giornaliere.
- Serie settimanali.
- Serie mensili.
- Distribuzione per giorno della settimana.
- Confronti tra periodi.
- Metriche per canale commerciale.

Timezone:

`Europe/Rome`

Utilizzare correttamente gli intervalli temporali con inizio incluso e fine esclusa, rispettando il limite di osservazione delle giornate parziali.

Risultati attesi:

```txt
2026-11-16:
paidOrders = 1
quotePaidOrders = 1
revenueEur = 300

2026-11-27:
paidOrders = 1
voucherPaidOrders = 1
revenueEur = 70

Total:
paidOrders = 2
revenueEur = 370
```

Verificare la coerenza di:

- `series.daily`
- `insights.daily`
- `insights.hourly`
- `insights.weekdays`
- `insights.weekdayExposure`
- `commercial`
- `kpis`

Le serie devono contenere, dove appropriato, la ripartizione degli incassi per canale.

---

## 4. Checkout e ricavi potenziali

Attualmente:

```txt
Stripe checkouts started = 7
Paid checkouts = 2
Definitively closed unpaid = 5

potentialCheckoutRevenueEur = 615.70
lostCheckoutRevenueEur = 245.70
```

Verificare questi importi a livello delle singole transazioni.

Il valore dei checkout avviati deve essere determinato utilizzando gli importi storici associati alla rispettiva Checkout Session o all'entità commerciale collegata.

Separare gli stati:

- Pagato.
- Aperto.
- Scaduto.
- Annullato.
- Fallito definitivamente.
- Recuperato.
- Sconosciuto.

Separare inoltre:

- Valore dei checkout avviati.
- Valore dei checkout pagati.
- Valore dei checkout ancora aperti.
- Valore dei checkout definitivamente chiusi e non pagati.

Tutte queste metriche devono riferirsi alla medesima coorte di checkout.

Non utilizzare automaticamente gli incassi pagati nel periodo come valore pagato della coorte di checkout creati nel periodo.

Sono due finestre temporali differenti.

Gestire eventuali Checkout Session multiple create per lo stesso ordine, distinguendo gli importi delle singole sessioni dalle opportunità commerciali univoche.

Evitare che un tentativo scaduto venga classificato come perdita commerciale definitiva se lo stesso ordine è successivamente pagato attraverso un nuovo tentativo.

Non utilizzare il termine "fatturato perso" per importi che rappresentano soltanto intenzioni di acquisto.

Preferire:

"Valore checkout chiusi non pagati".

---

## 5. Valore dei carrelli

Nella V6:

```txt
potentialCartRevenueEur = 190
avgCartValueEur = 23.75
cartsWithAdditions = 8
lostCartRevenueEur = null
```

Il valore di 190 EUR rappresenta il totale lordo degli eventi di aggiunta al carrello.

Non rappresenta necessariamente il valore finale dei carrelli.

Mantenere separati:

- Valore lordo delle aggiunte.
- Valore lordo medio delle aggiunte per carrello.
- Saldo effettivo dei carrelli, se ricostruibile.
- Valore dei carrelli inattivi, se disponibile.
- Valore dei checkout non pagati.

Considerare eventuali:

- Rimozioni.
- Cambi di quantità.
- Modifiche delle varianti.
- Sconti.
- Carrelli svuotati.
- Carrelli convertiti.

Se non esistono dati sufficienti per ricostruire lo stato finale del carrello, mantenere il dato non disponibile.

Non sommare il valore lordo dei carrelli e quello dei checkout non pagati per calcolare ricavi potenziali o perduti.

---

## 6. Verifica clienti e Customer Lifetime Value

È presente una differenza tra la sezione commerciale e la sezione clienti.

Attualmente:

```txt
commercial.uniquePayingCustomers = 2
commercial.historicalFirstTimeCustomers = 2
commercial.newRevenueEur = 370

customers.totalCustomers = 1
customers.totalLtvCents = 30000
```

Verificare se il CRM esclude intenzionalmente i clienti che hanno acquistato voucher degustazioni.

Se il CRM rappresenta tutti i clienti commerciali, includere anche i clienti dei voucher e degli altri canali pagati, quando identificabili.

Se il CRM rappresenta esclusivamente gli acquirenti di prodotti, mantenere tale perimetro ma specificarlo chiaramente nella dashboard.

Distinguere:

- Clienti commerciali complessivi.
- Clienti ecommerce.
- Clienti acquisiti tramite preventivo.
- Clienti delle degustazioni.
- Acquirenti di voucher.
- Beneficiari dei voucher.
- Clienti nuovi.
- Clienti di ritorno.

L'acquirente e il beneficiario di un voucher non devono essere automaticamente considerati la stessa persona.

Utilizzare identificatori affidabili per deduplicare i clienti.

Il Customer Lifetime Value deve essere calcolato utilizzando le transazioni storiche effettive del cliente, al netto dei rimborsi secondo la definizione adottata.

Non confrontare direttamente un LTV storico con gli incassi di un periodo limitato senza uniformare il perimetro.

Verificare anche la coerenza dei segmenti CRM.

---

## 7. Funnel delle varianti prodotto

Anomalia rilevata:

Tutte le combinazioni prodotto-variante hanno:

```txt
selectionThenAddSessions = 0
```

Tutte le 10 unità aggiunte al carrello risultano riferite a varianti predefinite.

Sono presenti numerose selezioni di formati da 3 e 5 litri senza aggiunte successive.

Verificare se si tratta di comportamento reale degli utenti oppure di un problema tecnico.

Controllare l'intera sequenza:

```txt
product_view
select_variant
add_to_cart
```

Verificare:

- Stato della variante selezionata nel frontend.
- Aggiornamento del prezzo.
- Aggiornamento della quantità e del formato.
- Coerenza di `productKey` e `variantKey`.
- Persistenza della variante nel carrello.
- Variante effettivamente trasmessa al backend.
- Variante riportata nella Checkout Session Stripe.
- Coerenza di sessionId e cartId.
- Timestamp e ordinamento degli eventi.
- Gestione delle query string `?v=`.
- Race condition.
- Eventuali problemi di normalizzazione degli identificatori.

Eseguire test funzionali su:

- Variante predefinita.
- Variante non predefinita.
- Cambio ripetuto di variante.
- Aggiunta al carrello dopo la selezione.
- Modifica della variante nel carrello.
- Avvio checkout.

Verificare che prodotto, formato, quantità e prezzo siano coerenti in tutti i passaggi.

Non correggere artificialmente gli eventi storici se non ricostruibili.

---

## 8. Attribuzione delle vendite

Attualmente:

```txt
paidOrders = 2
ordersWithSession = 0
ordersWithoutSession = 2
sessionCoverage = 0
sourceCoverage = 0
deviceCoverage = 0
```

Verificare la propagazione del contesto analytics lungo il processo commerciale.

Quando disponibile e consentito, mantenere:

- visitorId
- sessionId
- cartId
- source
- device
- landingPage
- UTM parameters
- Contesto di acquisizione.
- Contesto di pagamento.

Verificare i flussi relativi a:

- Ecommerce.
- Preventivi PDF.
- Voucher.
- Degustazioni.
- Stripe Checkout.
- Webhook Stripe.

Non forzare l'attribuzione di ordini offline o preventivi pagati attraverso link diretti.

Distinguere la sessione di acquisizione dalla sessione di pagamento.

Le vendite non attribuibili devono rimanere classificate come `unattributed` o `unknown`.

Gli incassi effettivi non devono essere esclusi soltanto perché privi di attribuzione analytics.

---

## 9. Conversioni e funnel commerciali

Non utilizzare il funnel legacy come rappresentazione di un percorso strettamente sequenziale.

Utilizzare i funnel già implementati:

```txt
sessionFunnel
cartFunnel
checkoutCohort
checkoutCohort.byChannel
productFunnel
variantFunnel
```

Separare le entità:

- Visitatori.
- Sessioni.
- Eventi.
- Carrelli.
- Checkout.
- Ordini.
- Pagamenti.

### Conversione sessioni

```txt
purchasingSessions / sessions
```

### Rapporto commerciale ordini/sessioni

```txt
paidOrders / uniqueSessions
```

Attualmente:

```txt
Session purchase rate = 0%
Commercial orders/sessions ratio = 0.35%
Storefront paid orders = 0
```

Non presentare lo 0,35% come conversione ecommerce.

Mantenere lo stato di attribuzione incompleta quando appropriato.

Separare i funnel commerciali dello shop, dei preventivi e dei voucher.

Preservare la distinzione tra:

- Aggiunta al carrello dopo visita prodotto.
- Aggiunta diretta dalla lista.

Non rappresentare come sequenziali coorti che non lo sono.

---

## 10. Forecast e periodi operativi

Mantenere le funzionalità previsionali esistenti.

Distinguere:

- Periodo temporale selezionato.
- Giorni completi.
- Giorni parziali.
- Giorni operativi successivi al lancio.
- Giorni con tracking non disponibile.

Data di lancio del nuovo sito:

`2026-11-08`

La baseline operativa deve poter utilizzare esclusivamente i giorni completi successivi al lancio.

Sul dataset attuale:

```txt
Complete operational days = 19
Sessions = 541
Average sessions per day = 28.47
Projected 30-day sessions = 854.21
```

Conservare comunque la baseline del periodo selezionato, se utile, indicandone chiaramente la definizione.

Non eliminare i giorni a zero visite successivi al lancio.

Non alterare lo storico.

Non introdurre modelli predittivi arbitrari.

---

## 11. Revisione semantica delle metriche

Applicare le definizioni già presenti nella `migrationMap` V6.

Correggere le etichette della dashboard.

### CTR lista prodotti

```txt
listViews = 197
productClicks = 94
listCtrPct = 47.72
```

Utilizzare:

"Rapporto clic / visualizzazioni lista (eventi)".

Non presentarlo come CTR individuale per utente o sessione.

### Carrelli

Utilizzare:

"Valore lordo delle aggiunte al carrello".

Non utilizzare:

"Fatturato perso" oppure "Scontrino medio".

### Clienti ricorrenti

Distinguere i clienti con più acquisti nel periodo dai clienti che avevano già effettuato acquisti in periodi precedenti.

### Dati mancanti

Distinguere sempre:

- Valore zero.
- Valore non disponibile.
- Campione insufficiente.
- Attribuzione incompleta.

Non trasformare automaticamente `null` in `0` nel frontend.

---

## 12. Dashboard amministrativa V7

Evolvere la dashboard esistente mantenendone il design system.

Non realizzare una nuova UI indipendente dal gestionale attuale.

Organizzare le sezioni secondo le seguenti aree funzionali.

### A. Overview

Mostrare:

- Incassi commerciali complessivi.
- Transazioni pagate.
- Incasso medio per transazione.
- Visitatori unici.
- Sessioni.
- Conversione ecommerce.
- Clienti paganti.

### B. Performance economica

Mostrare:

- Incassi lordi.
- Rimborsi.
- Incassi netti dei rimborsi.
- Ripartizione economica per canale.
- Ricavi prodotti, se determinabili.
- Ricavi servizi, se determinabili.
- Imponibile e IVA, se determinabili.
- Margine effettivo o stimato, chiaramente identificato.

Aggiungere o aggiornare un grafico temporale degli incassi per canale.

I totali del grafico devono essere riconciliabili con i KPI.

### C. Ecommerce

Mostrare:

- Ordini storefront.
- Scontrino medio storefront.
- Conversione storefront.
- Funnel delle sessioni.
- Funnel carrelli.
- Checkout ecommerce.
- Valore checkout non pagati.
- Performance prodotti e varianti.

### D. Preventivi e degustazioni

Mostrare separatamente:

- Preventivi generati.
- Preventivi pagati.
- Incassi da preventivi.
- Voucher generati.
- Voucher pagati.
- Incassi voucher.
- Prenotazioni degustazioni.
- Degustazioni pagate direttamente.

Mostrare solo metriche supportate dai dati effettivamente disponibili.

Non confondere prenotazioni, voucher e incassi.

### E. Traffico e acquisizione

Mantenere:

- Sessioni.
- Visitatori.
- Pagine visualizzate.
- Sorgenti.
- Dispositivi.
- Paesi.
- Lingue.
- Landing page.
- Performance SEO disponibili.
- Forecast operativo.

### F. Blog

Preservare integralmente:

- Performance degli articoli.
- Funnel blog-prodotto.
- Confronto prima/dopo introduzione delle card.
- Click per posizione.
- Click per articolo.
- Sessioni che raggiungono un prodotto.

Non alterare le definizioni già correttamente implementate.

### G. Clienti

Mostrare:

- Clienti paganti identificati.
- Clienti nuovi.
- Clienti di ritorno.
- Segmentazione.
- LTV.
- Ripartizione per canale, se disponibile.
- Copertura dell'identificazione dei clienti.

### H. Data Quality

Inserire una sezione tecnica compatta, preferibilmente espandibile, contenente:

- Versione dello schema.
- Data ultimo aggiornamento.
- Copertura attribuzione.
- Periodo osservato.
- Stato riconciliazioni.
- Metriche non disponibili.
- Eventuali incoerenze rilevate automaticamente.

Evitare di appesantire l'overview con informazioni tecniche.

---

## 13. Requisiti grafici e UX

Mantenere uno stile professionale, sobrio e coerente con il gestionale.

Evitare:

- Interfacce con estetica generica da AI.
- Gradienti decorativi.
- Colori eccessivi.
- Card inutilmente grandi.
- Badge ridondanti.
- Animazioni decorative.
- KPI duplicati senza necessità.

Utilizzare:

- Gerarchia tipografica chiara.
- Tabelle compatte.
- Importi allineati.
- Formattazione monetaria italiana.
- Tooltip per le definizioni delle metriche.
- Grafici leggibili.
- Filtri temporali condivisi.
- Layout responsive.
- Indicatori discreti per dati incompleti.

Tutti i componenti devono utilizzare lo stesso periodo selezionato, salvo sezioni esplicitamente storiche come il LTV.

Preservare le funzionalità amministrative esistenti.

---

## 14. Controlli automatici di consistenza

Implementare controlli automatici e regression test.

### Incassi

A parità di periodo, timezone e perimetro:

```txt
grossRevenue = SUM(revenueByChannel.grossRevenue)

grossRevenue = SUM(daily.grossRevenue)

paidTransactions = SUM(revenueByChannel.paidTransactions)

paidTransactions = SUM(daily.paidTransactions)

netCash = grossPayments - refunds
```

### Checkout

```txt
started =
paid +
open +
definitivelyClosedUnpaid +
otherMutuallyExclusiveStatuses
```

Verificare anche la riconciliazione degli importi per stato all'interno della stessa coorte.

I recuperi devono essere rappresentati come informazione storica o di transizione, non come uno stato corrente aggiuntivo che produce doppi conteggi.

### Sessioni e funnel

```txt
SUM(acquisition.sessions) = sessionFunnel.sessions

shopSessions =
listOnly + listAndDetail + detailOnly

productDetailSessions =
listAndDetail + detailOnly

addToCartSessions =
addToCartAfterProductViewSessions +
directAddToCartSessions
```

Verificare la riconciliazione delle sessioni giornaliere tenendo conto delle sessioni a cavallo dei confini temporali.

Non sommare i visitatori unici giornalieri per ottenere quelli complessivi.

### Attribuzione

```txt
paidOrders =
ordersWithSession + ordersWithoutSession

paidOrders =
ordersWithSource + unattributedOrders

paidOrders =
ordersWithDevice + unknownDeviceOrders
```

### Alias JSON

Tutte le aggregazioni duplicate devono provenire dalla stessa sorgente.

Verificare la coerenza tra sezioni top-level e `insights`.

### Coerenza frontend

Verificare che:

- I KPI della dashboard coincidano con quelli delle API.
- Le API coincidano con l'esportazione JSON.
- I grafici coincidano con le rispettive aggregazioni.
- I filtri temporali agiscano correttamente.
- Gli importi non vengano ricalcolati in modo divergente nel frontend.

---

## 15. Casi di test finanziari obbligatori

Implementare test che coprano almeno:

1. Ordine ecommerce pagato.
2. Preventivo pagato.
3. Voucher pagato.
4. Voucher successivamente utilizzato.
5. Checkout scaduto.
6. Checkout ancora aperto.
7. Ordine con più tentativi di checkout.
8. Ordine recuperato dopo checkout scaduto.
9. Rimborso parziale.
10. Rimborso totale.
11. Rimborso di un ordine di un periodo precedente.
12. Webhook Stripe duplicato.
13. Ordine pagato senza sessione analytics.
14. Ordine creato in un periodo e pagato nel successivo.
15. Ordine con spedizione, IVA e sconto.
16. Cliente presente in più canali commerciali.
17. Ordine di test da escludere.
18. Pagamento vicino alla mezzanotte locale.
19. Giornata parziale.
20. Selezione variante non predefinita e successivo acquisto.

Utilizzare fixture o ambiente di test, senza alterare dati commerciali reali.

---

## 16. Versionamento V7

Aggiornare lo schema a:

```txt
metrics-export-v7
```

Se opportuno, introdurre un modulo:

```txt
metricsAnalyticsV7.ts
```

Riutilizzare le aggregazioni V6 già affidabili.

Preservare la compatibilità con i consumer esistenti mediante alias o una `migrationMap` documentata.

Non eliminare campi pubblici senza gestirne la migrazione.

Aggiornare:

- Tipi TypeScript.
- Schema delle API.
- Esportazione JSON.
- Componenti della dashboard.
- Documentazione delle metriche.
- Regression test.
- Eventuali cache coinvolte.

Evitare migrazioni distruttive del database.

---

## 17. Risultati attesi sul dataset attuale

La nuova versione deve riconciliare almeno:

```txt
Gross commercial payments: 370.00 EUR
Storefront payments: 0.00 EUR
Quote payments: 300.00 EUR
Voucher payments: 70.00 EUR

Paid transactions: 2
Storefront paid orders: 0
Quote paid orders: 1
Voucher paid orders: 1

Average commercial transaction: 185.00 EUR

Daily revenue total: 370.00 EUR
Daily paid transactions total: 2

Unique visitors: 503
Sessions: 572
Page views: 1392

Shop sessions: 105
Product detail sessions: 63
Add-to-cart sessions: 8
Storefront checkout sessions: 4
Storefront purchasing sessions: 0

Blog sessions: 292
Blog-to-product sessions: 11
Blog card clicks: 8
```

I valori dei checkout non pagati, dei margini, del CRM e degli eventuali rimborsi devono essere verificati sulle sorgenti originali prima di essere considerati definitivamente corretti.

Non hardcodare questi valori nell'implementazione.

Utilizzarli esclusivamente come riferimento di riconciliazione del dataset storico.

---

## 18. Output finale richiesto

Procedere con l'implementazione completa della V7.

Al termine fornire:

- Cause delle incongruenze individuate.
- File modificati.
- Formule economiche utilizzate.
- Sorgenti dei dati commerciali.
- Confronto V6/V7.
- Risultati dei test.
- Eventuali limitazioni residue.
- Nuova esportazione JSON.
- Dashboard amministrativa aggiornata.

L'obiettivo non è aumentare il numero di metriche, ma rendere il gestionale affidabile, coerente e utilizzabile per prendere decisioni commerciali.

Non introdurre dati inventati, stime non dichiarate o aggregazioni non verificabili.