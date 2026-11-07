# Registro Test E Audit

Registro centrale delle verifiche del progetto `delpasqua`. Questo file indica quali suite esistono, dove si trovano gli ultimi risultati e quando devono essere rieseguite. I report dettagliati restano nelle cartelle di origine; questo documento e` l'indice operativo autorevole.

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-08-18
- OpenItems: 9
- AgentAction: non lanciare test senza richiesta esplicita; prima del go-live rieseguire i gate locali, poi completare i test production solo dopo piano database, deploy e collegamento del dominio.
- Note: gli esiti sotto sono storici e non certificano automaticamente il commit o il deployment corrente. Registrare ogni nuova esecuzione nella tabella, indicando ambiente, data ed esito.

## Regole Del Registro

- Non segnare `PASS` senza un'esecuzione reale completata.
- Distinguere sempre `local`, `production locale`, `preview Vercel` e `production delpasqua.com`.
- Per ogni esecuzione annotare data, commit o deployment, comando, esito e percorso del report.
- Non eseguire suite che modificano database o servizi esterni senza verificare prima ambiente e dati coinvolti.
- I test production con pagamenti, email o database reali vanno eseguiti soltanto nella finestra di collaudo concordata.
- Gli eventuali problemi trovati vanno registrati nel relativo `docs/to_do_*.md`; questo file conserva lo stato delle verifiche, non il backlog dei fix.

## Ultimi Esiti Registrati

| Area | Comando o verifica | Ambiente registrato | Ultimo esito documentato | Stato per go-live | Evidenza |
| --- | --- | --- | --- | --- | --- |
| TypeScript | `npm run typecheck` | locale | PASS, 0 errori, 2026-06-08 | Da rieseguire sul codice finale | `docs/to_do_quality_ci.md` |
| ESLint | `npm run lint` | locale | PASS, 0 errori e 0 warning, 2026-06-08 | Da rieseguire sul codice finale | `docs/to_do_quality_ci.md` |
| Test server critici | `npm run test:server` | locale | PASS, 35 test, 2026-08-18 | Da rieseguire sul codice finale | `docs/to_do_quality_ci.md` |
| Build Next.js | `npm run build` | production locale | PASS documentato, 2026-06-28 | Da rieseguire sul codice finale | `docs/to_do_performance.md` |
| Gestionale admin | `npm run test:gestionale` | locale con DB di test | PASS, 12/12 script, 2026-06-03 | Da valutare/rieseguire su ambiente sicuro | `scratch/gestionale-risultati/report.txt` |
| Audit SEO completo | `npm run seo:all` | localhost + WordPress live dell'epoca | PASS, 13/13 task, 2026-05-31 | Da rieseguire dopo il cambio dominio | `scratch/seo-risultati/seo-suite-report.txt` |
| Traduzioni blog | `npm run check:blog-translations` | locale | PASS, 51/51 post completi, 2026-06-04 | Rieseguire solo se cambiano contenuti/traduzioni | `docs/blog-translation-check.md` |
| Migrazione database | `npm run verify:migration` | dipende dalla configurazione | Nessun esito recente centralizzato | Da eseguire sul database production con cautela | `package.json` |
| Collaudo end-to-end | ordine, Stripe, email, stock e gestionale | production `delpasqua.com` | Non eseguito sul dominio finale | Bloccante dopo collegamento dominio | `docs/to_check_live/README.md` |

## Gate Prima Del Deploy Production

- [ ] Registrare commit o stato del codice candidato al go-live.
- [ ] Eseguire `npm run typecheck` e registrare l'esito.
- [ ] Eseguire `npm run lint` e registrare l'esito.
- [ ] Eseguire `npm run test:server` e registrare numero di test passati/falliti.
- [ ] Eseguire `npm run build` e registrare l'esito della build production.
- [ ] Valutare `npm run test:gestionale` su database non production o con dati di test controllati.
- [ ] Verificare la migrazione sul database corretto prima di accettare traffico reale.

## Gate Dopo Il Collegamento Del Dominio

- [ ] Rieseguire l'audit SEO completo contro il dominio finale e salvare il report aggiornato.
- [ ] Completare e registrare il collaudo production definito in `docs/to_check_live/README.md`.

## Scheda Per Le Prossime Esecuzioni

Copiare una riga per ogni nuova esecuzione senza cancellare lo storico utile.

| Data | Commit/deployment | Ambiente | Test/comando | Esito | Dettagli o report | Eseguito da |
| --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | commit o URL deployment | local/preview/production | comando o verifica | PASS/FAIL/PARZIALE | percorso o nota breve | nome/agent |
| 2026-11-07 | Working tree, secondo aumento scala bottiglie | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning | Codex |
| 2026-11-07 | Working tree, secondo aumento scala bottiglie | local | Controllo browser shop e suggerimenti olio-toscano | PASS | Bottiglie dal 80% al 84%, aromatizzati dal 76% al 80%; quattro viste desktop/mobile con prodotto entro i bordi. `scratch/bottle-card-scale-v2/report.json` e screenshot | Codex |
| 2026-11-07 | Working tree, scala bottiglie nelle card | local | `npm run lint`, `npm run typecheck` e verifica browser della scala foto | PASS | Bottiglie 80%, aromatizzati 76%; home/shop e tre landing controllate su desktop/mobile, scheda EVO ancora intera. Report e screenshot in `scratch/evo-photo-framing/` e `scratch/bottle-card-scale/` | Codex |
| 2026-11-07 | Working tree, inquadratura EVO e suggerimenti landing | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning dopo le modifiche finali | Codex |
| 2026-11-07 | Working tree, inquadratura EVO e suggerimenti landing | local | `node scratch/verify-evo-photo-framing.cjs` | PASS | 8 viste desktop/mobile: EVO 500 ml intera con margine; suggerimenti di olio-toscano, olio-biologico e nuovo-raccolto con sfondo bianco e scala condivisa. Nessun pageerror o overflow. `scratch/evo-photo-framing/report.json` e screenshot | Codex |
| 2026-11-07 | Working tree, pulizia cartella prodotti | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning dopo l'aggiornamento delle riscritture | Codex |
| 2026-11-07 | Working tree, pulizia cartella prodotti | local | `node scratch/verify-product-cleanup.cjs` | PASS | 27 immagini in `public/products`, 29 URL attivi e 9 URL storici verificati; home/shop/schede senza immagini rotte o pageerror. Hash di 296 file archiviati e 27 immagini conservate verificati. Report in `archivio/immagini-prodotti/2026-11-07-pulizia/` | Codex |
| 2026-11-07 | Working tree, carrello laterale e rifiniture shop | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning, dopo le modifiche finali | Codex |
| 2026-11-07 | Working tree, carrello laterale e rifiniture shop | local | `node scratch/verify-cart-drawer-regression.cjs` | PASS | Bug riprodotto prima della correzione; dopo il fix passano rimozioni multiple, reinserimento, reload e reinserimento dopo svuotamento. `scratch/ux-refinements/cart-regression.json` | Codex |
| 2026-11-07 | Working tree, carrello laterale e rifiniture shop | local | `node scratch/verify-shop-ux.cjs` e `node --import tsx --test src/lib/server/cartNormalization.test.ts` | PASS | Titoli home/shop coerenti con profilo fruttato, hover di 2 px, animazioni da sinistra progressive e ripetibili, supporto movimento ridotto; 3 test normalizzazione passati. `scratch/ux-refinements/shop-menu-verification.json` e screenshot | Codex |
| 2026-11-07 | Working tree, nomi oli e home | local | `npm run lint`, `npm run typecheck`, `node --import tsx --test src/lib/homeMerch.test.ts` | PASS | 0 errori/warning, 2 test ordinamento passati | Codex |
| 2026-11-07 | Working tree, nomi oli e home | local + database configurato | Audit catalogo/inventario e `node scratch/verify-catalog-brands.cjs` | PASS | 28 SKU presenti, foto esistenti, chiavi/prezzi conservati, 8 traduzioni allineate, cambi formato, home desktop/mobile e collegamento EVO 750 ml. `archivio/immagini-prodotti/2026-11-07-catalogo/verifica.json` | Codex |
| 2026-11-07 | Working tree, correzione immagini EVO | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori; ESLint senza warning | Codex |
| 2026-11-07 | Working tree, correzione immagini EVO | local, localhost:3000 | `node scratch/verify-evo-images.cjs` | PASS | Quattro formati selezionabili, sei URL precedenti identici ai nuovi asset, pagina 5 L, mobile senza overflow, nessun pageerror. `archivio/immagini-prodotti/2026-11-07-evo/verifica.json` e screenshot | Codex |

## Ordine Consigliato

1. Chiudere piano, fatturazione, regione e backup del database production.
2. Sul codice finale eseguire typecheck, lint, test server e build.
3. Verificare migrazioni e variabili production senza riportare segreti nei file.
4. Fare deploy production e collegare il dominio.
5. Eseguire smoke test pubblico e audit SEO sul dominio finale.
6. Configurare e verificare Stripe e Resend.
7. Attivare `?test_mode=1`, eseguire un ordine reale controllato e verificare tutti gli effetti nel gestionale senza alimentare GA4.
8. Disattivare il prodotto test e ripetere i controlli di esposizione pubblica.
9. Disattivare la modalita` interna con `?test_mode=0` e monitorare production per almeno 48 ore.
