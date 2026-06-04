# AGENT.md - Script di Sviluppo, Manutenzione e SEO Audit

## Scopo
La cartella `/scripts` contiene script di supporto allo sviluppo ed utilità operative. Tutti gli script correlati alla SEO e alla migrazione sono raggruppati nella sotto-cartella dedicata `/scripts/seo/`. Questa separazione pulita garantisce ordine e chiarezza nello spazio di sviluppo.

## Regole Globali per gli Script
1. **Idempotenza**: Qualsiasi script di manutenzione deve poter essere eseguito più volte senza danneggiare lo stato dei file o del database.
2. **Esplicitezza**: Se uno script effettua modifiche o tocca servizi esterni (come effettuare scraping o chiamare API reali), deve stampare a console in modo chiaro ed evidente cosa sta facendo.
3. **Isolamento della Logica**: La logica business riusabile e le configurazioni di dominio principali devono rimanere in `/src/lib`. Gli script devono limitarsi a consumare queste librerie.

---

## Struttura della Cartella `/scripts`

```text
scripts/
├── AGENT.md                         # Questo file di documentazione
├── popola-prodotto-test.ts          # Popolamento db prisma locale con prodotto test
├── verifica-migrazione.mjs          # Controllo generale migrazione sul campo
├── gestionale/                      # Cartella dedicata alla Suite di Test del Gestionale Admin
│   ├── runner.mjs                   # Orchestratore/runner dei test del gestionale (npm run test:gestionale)
│   ├── utils.mjs                    # Utility e mock authentication per i test del gestionale
│   ├── populate-dashboard-data.mjs  # Popolamento dati demo per grafici dashboard
│   ├── seed.mjs                     # Inserimento prodotti reali e impostazioni base nel db locale
│   └── test-*.mjs                   # I 12 script di test specifici (auth, catalog, orders, ecc.)
└── seo/                             # Cartella dedicata alla Suite SEO e Migrazione
    ├── avvia-suite-seo.ts           # Coordinatore principale della suite SEO
    ├── confronta-sitemaps.mjs       # Confronto sitemap Live vs Progetto
    ├── verifica-canonical.mjs       # Controllo tag canonical
    ├── verifica-hreflang.mjs        # Controllo tag hreflang e x-default
    ├── verifica-rotte-legacy.mjs    # Controllo redirect storici (301/308)
    ├── verifica-lingue-locali.mjs   # Controllo traduzione e testi UI
    ├── verifica-rotte-noindex.mjs   # Controllo rotte tecniche e noindex
    ├── verifica-sitemap.mjs         # Controllo sitemap locali e child sitemaps
    ├── diagnostica-conteggi-sitemap.ts # Conteggi e corrispondenza database (TS)
    ├── diagnostica-conteggi-sitemap.mjs # Runner JS per la diagnostica conteggi
    └── suite/                       # Moduli interni di architettura della suite SEO
        ├── costanti.ts              # Target di rete, redirect storici e parole proibite
        ├── verifiche.ts             # Implementazione dettagliata dei singoli test
        ├── reportistica.ts          # Formattazione report finale e blockers go-live
        ├── tipi.ts                  # Definizioni e interfacce TypeScript
        └── utilita.ts               # Client HTTP resiliente, helper e logging
```

---

## Catalogo degli Script Operativi (Gestionale Admin)

Tutti questi script si trovano sotto `/scripts/gestionale/` e permettono il controllo e la simulazione del pannello amministrativo:

* **`runner.mjs`** (npm run `test:gestionale`):
  Orchestra ed esegue sequenzialmente tutti i 12 test di integrità del gestionale admin. Genera un report unificato in `/scratch/gestionale-risultati/report.txt`.
* **`populate-dashboard-data.mjs`** (npm run `dashboard:populate-demo`):
  Popola il database locale con ordini, clienti e analytics simulati degli ultimi 30 giorni per il corretto rendering dei grafici in dashboard. Può essere ripulito tramite `--clean` (o `npm run dashboard:clear-demo`).
* **`seed.mjs`** (npm run `gestionale:seed`):
  Popola il database locale con i prodotti reali presi dal file JSON e configura le impostazioni di default del negozio.

---

## Catalogo degli Script Operativi (SEO & Migrazione)

Tutti questi script si trovano sotto `/scripts/seo/` e possono essere avviati tramite i comandi npm dedicati:

### Il Runner Principale della Suite SEO
* **`avvia-suite-seo.ts`** (npm run `seo:all`):
  È l'entrypoint della suite SEO. Coordina ed esegue in sequenza tutti i test di migrazione e i controlli SEO (13 task in totale). Genera un report dettagliato salvato in `/scratch/seo-risultati/seo-suite-report.txt` e compie verifiche conclusive sul deployment.

### Script di Audit SEO Specifici (Standalone)
* **`confronta-sitemaps.mjs`** (npm run `seo:compare-sitemaps`):
  Esegue un confronto puntuale tra la sitemap prodotta sul server locale (Next.js) e l'inventario del sito WordPress attualmente live. Salva i file di log dettagliati in `/scratch/seo-risultati/seo-compare/`.
* **`verifica-canonical.mjs`** (npm run `seo:audit-canonical`):
  Valida i tag `<link rel="canonical">` delle pagine per assicurarsi che siano unici, assoluti, coerenti con la lingua, con trailing slash corretti e con status code HTTP 200.
* **`verifica-hreflang.mjs`** (npm run `seo:audit-hreflang`):
  Controlla la corretta implementazione dei tag hreflang, inclusa la presenza del tag `x-default`, la self-reference, l'uso di URL assoluti e la reciprocità/bidirezionalità delle lingue.
* **`verifica-rotte-legacy.mjs`** (npm run `seo:audit-legacy-routes`):
  Testa tutti i redirect storici e i percorsi legacy, inclusi i **42 URL WordPress storici** precedentemente indicizzati su Google, verificando i redirect 301/308 corretti.
* **`verifica-lingue-locali.mjs`** (npm run `seo:audit-locales`):
  Scansiona le rotte localizzate per rilevare stringhe dell'interfaccia utente nella lingua errata (es. testi IT nella versione DE).
* **`verifica-sitemap.mjs`** (npm run `seo:audit-sitemap`):
  Scansiona la sitemap locale principale e le child sitemaps, controllando l'accessibilità degli URL ed escludendo percorsi privati o proibiti.
* **`verifica-rotte-noindex.mjs`** (npm run `seo:audit-noindex`):
  Verifica che le pagine sensibili (carrello, checkout, account) abbiano il tag `noindex` attivo, non contengano canonical o hreflang e siano escluse dalle sitemap.
* **`diagnostica-conteggi-sitemap.ts`** (npm run `seo:debug-sitemap-counts`):
  Esegue una diagnostica incrociata dei conteggi degli URL presenti nelle sitemap confrontandoli con il database prodotti JSON e gli articoli del blog.

---

## Script Generali (nella radice `/scripts`)

* **`verifica-migrazione.mjs`** (npm run `verify:migration`):
  Utility per verificare sul campo gli esiti delle migrazioni.
* **`popola-prodotto-test.ts`**:
  Script per caricare prodotti di test all'interno del database Prisma locale durante lo sviluppo della logica di shop e checkout.
