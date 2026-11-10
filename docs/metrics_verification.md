# Verifica nuove metriche — 9 novembre 2026

## Revisione istogrammi — 10 novembre 2026

- Il grafico orario e i suoi contatori usano esclusivamente il giorno finale del filtro, indicato nel sottotitolo, dalle 00:00 alla mezzanotte successiva in Europe/Rome. Sessioni e carrelli sono deduplicati nel giorno, indipendentemente dalla prima comparsa nel periodo complessivo.
- Il grafico settimanale resta sull'intero periodo selezionato. Riquadri separati, sottotitoli distinti, colori pieni blu/arancio/verde e larghezza minima oraria ridotta da 1232 a 680 pixel; le serie a zero non occupano spazi vuoti fra le barre. Le ore e i giorni senza attività restano sull'asse temporale.
- Test sui confini di mezzanotte, fine intervallo esclusa e cambi di ora legale (giorni di 23/25 ore). Verifica browser con fixture a 1440 e 390 pixel, nessun overflow della pagina e tabelle espandibili funzionanti. Immagini in `scratch/gestionale-risultati/metrics-1440.png` e `metrics-390.png`.
- Lint e typecheck superati. Modifica locale, senza pubblicazione o mutazioni di dati commerciali.

Verifica del working tree rispetto a `origin/main` (`45ac4c4`). Eseguita in locale, senza push o deploy e senza creare ordini, messaggi o prenotazioni.

## Correzioni

- Le aggiunte al carrello sono registrate dopo l'esito e con `addedQty`, nei componenti prodotto e nei suggerimenti del carrello. Le richieste rifiutate non generano domanda. La pagina prodotto attende l'esito prima di mostrare il successo.
- Litri, formati, valore delle aggiunte e conteggi per prodotto usano una funzione condivisa tra pannello ed export. Il conteggio prodotto non dipende più dalle prime 20 varianti mostrate in tabella.
- La bottiglia da 1 L non viene classificata come latta; la latta da 750 ml viene riconosciuta. La lettura del volume usa unità complete, senza confondere 1500 ml con 500 ml o 15 L con 5 L.
- Eliminati i prezzi di ripiego fissi, già diversi dal catalogo. Prezzi storici mancanti o non validi rendono valore e media non disponibili; l'export espone `unpricedUnits`. Quantità non valide vengono scartate; i formati sconosciuti sono separati.
- La media delle aggiunte usa i carrelli con aggiunte, senza includere carrelli con solo checkout. Il rapporto sessioni con aggiunte usa l'intersezione con le sessioni effettivamente misurate nelle visite; senza visite è non disponibile.
- Il valore dei checkout non pagati non ricade più sulla sottrazione fra aggiunte e incassi. `lostCartRevenueEur` è `null`: le due popolazioni non permettono di calcolare ricavi persi.
- I riordini normalizzano le email ed escludono email vuote. Il titolo precisa che si tratta di riordini nello stesso periodo. Le combinazioni olio/vino includono anche tartufo, peperoncino e gli SKU storici.
- Tracciati entrambi i collegamenti WhatsApp e tutti i link telefono/email della pagina contatti, oltre al footer. Ripristinati i caratteri UTF-8 alterati nelle modifiche iniziali.
- L'export verifica direttamente la sessione admin e applica l'eventuale rotazione cookie. Il layout admin non protegge da solo una route HTTP.

## Esiti

| Verifica | Esito |
| --- | --- |
| `npm run test:server` | PASS, 64 test |
| Confronto KPI pagina/export con gli stessi dati | PASS, incluso nei test server |
| Schema pubblico e ingestione di `contact_click` | PASS, incluso nei test server |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS, 1524 pagine statiche generate |
| `node scripts/verify-metrics-browser.mjs http://localhost:3091` | PASS, Chromium sul server production locale |
| `git diff --check` | PASS |

Il test browser verifica sette collegamenti contatto, consegna tramite beacon, rifiuto del tracciamento, export anonimo con risposta 401 e aggiunte prodotto con stock che passa da 10 a 2 oppure a 0. Le consegne analytics e le risposte disponibilità sono intercettate; nessun errore JavaScript rilevato. Per ripeterlo: avviare `npm run build` e `npm run start -- -p 3091`, poi eseguire il comando browser in un altro terminale.

## Significato e limiti dei dati

- Il valore delle aggiunte misura domanda lorda: rimozioni, modifiche quantità e nuove aggiunte successive non costituiscono il saldo finale del carrello.
- Il valore dei checkout non pagati include quelli ancora in corso e non equivale ad abbandoni definitivi.
- I ricavi sono il totale degli ordini con `paidAt` nel periodo, con gli importi dell'ordine; i rimborsi successivi non sono sottratti da questa metrica storica.
- Il riordino considera almeno due pagamenti nello stesso periodo, non la cronologia completa del cliente.
- Non è possibile ricostruire retroattivamente click di contatto mai registrati, prezzi mancanti o correggere con certezza vecchie aggiunte tracciate prima di un rifiuto.
- Il database reale e l'intero percorso analytics sul dominio production restano da collaudare dopo il deploy. Le query e i risultati del report sono coperti con fixture; il browser verifica la generazione e consegna degli eventi sul server locale.

## Estensione: acquisizione, Stripe, decisione, LTV e fasce orarie

Implementata il 9 novembre 2026, mantenendo le modifiche già presenti nel working tree.

- Solo Metrics contiene `CommerceInsights` e i dettagli sono disponibili nel suo export v5. La dashboard mantiene i propri riepiloghi senza duplicare queste sezioni, anche nel report JSON. Le query non richiedono migrazioni.
- Acquisizione: indizi specifici Instagram, Facebook e Google nel browser, oppure dominio referrer. Chrome da solo non implica Google. Referrer iniziale conservato per sessione anche dopo reload; firma UA elaborata dal server senza salvare nuove impronte o URL di campagne. I 187 domini Google provengono dall'elenco ufficiale `https://www.google.com/supported_domains`; nessuna richiesta esterna a runtime. Nessun indizio significa “Diretto / sconosciuto”. Gli eventi precedenti conservano solo gli indizi che erano stati effettivamente registrati.
- Fuga Stripe osservata: coorte di ordini commerciali con sessione Stripe creata nel periodo. Numeratore: checkout con ritorno `checkout_canceled` misurato nel periodo, ancora non pagati alla fine del periodo. Denominatore: questi checkout più quelli della stessa coorte pagati entro la fine del periodo. Recuperati (annullati e poi pagati) contati una volta tra i pagati; in corso/senza ritorno esclusi dal rapporto e mostrati separatamente. Zero esiti osservabili produce `null`, non 0%. Non è una stima degli abbandoni senza ritorno al sito.
- Ingestione cancel: chiave stabile per ordine, verificato commercialmente e con sessione Stripe nel database. Reload e retry non gonfiano il conteggio. `purchase` resta validato contro `Order.paidAt`.
- Decisione: `ANALYTICS_CONTEXT` con soli ID anonimi validati viene salvato atomicamente insieme all'ordine, rispettando opt-out/internal e isolando l'ambiente. Le visite precedenti al periodo sono recuperate tramite visitorId; conteggio sessioni distinte e giorni fino al pagamento. Gli eventi purchase storici possono fornire un collegamento di ripiego. Ordini senza storia non diventano campioni a zero giorni: vengono esclusi con copertura esplicita. Non ricostruisce cookie cancellati, altri dispositivi o visite mai registrate.
- LTV: tutti i pagamenti EUR fino a oggi, email normalizzate prima del raggruppamento, ordini test/impagati esclusi. Mostrati lordo, rimborsi e netto; non dipende dalle date della dashboard. Il CSV comprende tutta la popolazione e il segmento scelto, protegge le celle formula e resta admin-only/no-store.
- Segmenti esclusivi: dormienti da almeno 180 giorni (priorità), VIP con almeno 10 L storici di olio in latta e LTV positivo, nuovi con un solo pagamento negli ultimi 30 giorni, altri attivi. Le latte degli ordini interamente rimborsati non qualificano per VIP; per i rimborsi parziali non è ricostruibile quali articoli siano stati restituiti. Soglie in `CUSTOMER_RULES`, dichiarate nella UI. Nessun contatto automatico inviato.
- Grafici: 24 ore e lunedì–domenica, fuso Europe/Rome con ora legale. Ogni sessione/carrello viene assegnato alla sua prima fascia osservata nel periodo; ordini distinti alla data effettiva di pagamento. Tabelle espandibili, picchi e tooltip contengono i valori esatti.
- Bandiere: 257 SVG locali da flag-icons 7.6.0, licenza MIT inclusa; indipendenti dal supporto emoji di Windows. Coprono anche paesi fuori dall'elenco commerciale. Nazione sconosciuta: globo accessibile, senza inventare una localizzazione.
- Metriche esistenti: filtri sito estesi a tutte le lingue, durate pesate sul numero effettivo di osservazioni, checkout click limitati ai carrelli misurati. Corretto “Vedi ordini” dal cliente: filtro email senza distinzione maiuscole, cronologia completa senza limite implicito degli ultimi 30 giorni.

### Verifiche dell'estensione

| Verifica | Esito |
| --- | --- |
| `npm run test:server` | PASS, 78 test: include coorti Stripe, recuperi, deduplica, acquisti senza success page, storia pre-periodo, domini ingannevoli, ora legale, rimborsi, segmenti e CSV autenticato |
| `npm run typecheck` e `npm run lint` | PASS |
| `npm run build` | PASS, 1524 pagine generate |
| `node scripts/verify-metrics-browser.mjs http://localhost:3000` | PASS: contatti/carrello e referrer + ID anonimi conservati dopo reload; consegne intercettate, nessuna scrittura commerciale |
| `node --import tsx scripts/verify-commerce-insights.tsx http://localhost:3000` | PASS: fixture con componenti reali/CSS locale, desktop 1440 px e mobile 390 px, SVG inclusa Malta, tabelle espandibili, nessun overflow della pagina/pageerror |
| `node --import tsx scripts/verify-commerce-data.ts` | PASS: transazione RepeatableRead + READ ONLY, riconciliazione con aggregati indipendenti, nessuna PII stampata |

Il database configurato al momento del controllo contiene 36 visite misurate e una coorte Stripe di un checkout; nessun cliente o ordine commerciale pagato disponibile. Totali vendite/LTV a zero riconciliati con il database; i casi non vuoti sono verificati tramite fixture. Il collaudo di un pagamento reale sul dominio pubblicato resta successivo al deploy. Screenshot di prova in `scratch/gestionale-risultati/metrics-1440.png` e `metrics-390.png`.

## Rifiniture richieste e filtri temporali — 9 novembre 2026

- Rimosso l'intero blocco duplicato dalla dashboard e dal suo report; Metriche conserva acquisizione, Stripe, decisione, LTV, segmenti e istogrammi.
- Tutti i 28 KPI di Metriche e le sette sezioni/indicatori aggiunti hanno una “i” con descrizione. Tooltip portale con posizione corretta vicino ai bordi, attivazione hover/clic/focus e chiusura Escape.
- Istogrammi su tutta la larghezza: barre orarie di almeno 11 px, gradienti, asse numerico, griglia, totali per serie, stato vuoto esplicito, tabella e picchi espandibili. Bandiere rettangolari senza arrotondamento.
- Date invertite riordinate nello stesso modo in URL e selettore. Il menu anni include anche l'anno del periodo aperto. Il campo mese resta vuoto sui periodi personalizzati, così si può scegliere lo stesso mese e tornare al mese completo.
- Trend giornaliero dashboard/report raggruppato nel fuso Europe/Rome, evitando di attribuire al giorno UTC precedente gli ordini vicini alla mezzanotte italiana.
- Suite server ampliata a 80 test, inclusi date invertite, anno bisestile, trimestre e semestre. Lint, TypeScript e build production locale superati.
- Verifica autenticata con `scripts/verify-admin-metrics-ui.mjs`: cambi mese/anno/trimestre/semestre, giorno singolo, date invertite, conservazione filtri mercato/internal, coerenza export e intervallo, desktop/mobile e tooltip. Browser impostato su America/Los_Angeles per controllare l'indipendenza dal fuso del dispositivo. Solo sessioni di login/logout; nessun dato commerciale scritto.
