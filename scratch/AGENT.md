# AGENT.md - Scratchpad, Archivio e Risultati Test

## Scopo
La cartella `/scratch` funge da area temporanea per esperimenti, script usa-e-getta (one-shot) e, soprattutto, da contenitore ordinato sia per la memoria storica del progetto (`/scratch/archivio/`) sia per i report dinamici generati attivamente dalla Suite SEO (`/scratch/seo-risultati/`).

## Regole di Utilizzo
1. **Nessun Import nel Codice Core**: Nessun file situato all'interno di `/scratch` deve mai essere importato o utilizzato dal codice dell'applicazione (situato in `/src`). Questa cartella deve rimanere totalmente isolata dall'applicazione in produzione.
2. **Niente Dati Sensibili**: Non committare credenziali personali, chiavi Stripe reali, password o dati sensibili non mascherati.
3. **Mantenimento dell'Ordine**: 
   * Gli script storici obsoleti vanno conservati nella sotto-cartella `/scratch/archivio/`.
   * Tutti i risultati e i report generati dai test SEO confluiscono automaticamente in `/scratch/seo-risultati/`.

---

## Struttura della Cartella `/scratch`

```text
scratch/
├── AGENT.md                 # Questo file di documentazione
├── archivio/                # Archivio storico di script e migrazioni completate
└── seo-risultati/           # Cartella pulita con tutti i risultati attivi dei test SEO
    ├── seo-suite-report.txt # Report finale cumulativo dei 13 test SEO
    ├── url-outcomes.csv     # Tabella CSV dei redirect e delle classificazioni URL
    ├── url-outcomes.json    # JSON strutturato dei redirect e delle classificazioni URL
    └── seo-compare/         # File txt dettagliati del confronto sitemap Live vs Progetto
```

---

## 📂 1. Cartella Risultati SEO (`/scratch/seo-risultati/`)

Tutti i risultati generati dai comandi SEO (`npm run seo:all` e `npm run seo:compare-sitemaps`) vengono convogliati qui per non sporcare lo spazio di sviluppo:
* **`seo-suite-report.txt`**: Il report testuale completo generato dal runner principale. Elenca i blocker per il go-live e il superamento delle 13 verifiche.
* **`url-outcomes.csv` / `url-outcomes.json`**: Mappatura dettagliata e classificazione di tutti gli URL (sia locali che storici WordPress) con i relativi redirect.
* **`seo-compare/`**: Cartella contenente i file txt di reportistica del confronto sitemap (es. `live-all-paths.txt`, `only-live-paths.txt`, `only-project-paths.txt`, `common-paths.txt`).

---

## 📦 2. Indice dei File Archiviati (`/scratch/archivio/`)

Per evitare che la cartella diventi caotica ma al contempo preservare la memoria storica delle attività di migrazione, tutti i vecchi script e file diagnostici sono stati organizzati nella sotto-cartella `/scratch/archivio/` (interamente rinominata in italiano):

### Script di Migrazione e Correzione Traduzioni (Blog)
* **`correggi-traduzioni-blog-step1.py`** fino a **`correggi-traduzioni-blog-step8.py`** (ex `fix_translations*.py`): Serie progressiva di script Python utilizzati per normalizzare, validare e formattare le traduzioni del blog (nelle lingue EN, DE, NL, DA, NO) allineandole alla struttura del progetto Next.js.
* **`correzione-corpo-post-blog.py`** (ex `fix_post_use_1.py`): Script di utilità per correggere usi specifici o formattazioni residue all'interno del corpo dei post del blog.
* **`pulisci-traduzioni-blog.ts`** (ex `clean-translations.ts`): Script TypeScript per la pulizia di chiavi duplicate o non necessarie all'interno delle traduzioni JSON e dei file markdown localized.

### Script di Migrazione dei Contenuti e Categorie
* **`standardizza-categorie-blog.ts`** (ex `standardize_categories.ts`): Script per standardizzare i nomi e gli slug delle categorie del blog nelle varie lingue.
* **`verifica-categorie-blog.ts`** (ex `check_categories.ts`): Utility per verificare la coerenza delle categorie assegnate a ciascun articolo del blog.
* **`elimina-contenuti-statici-obsoleti.ts`** e **`elimina-contenuti-statici-obsoleti-finale.ts`** (ex `clear-static-contents*.ts`): Script one-shot utilizzati per rimuovere vecchi file statici o placeholder non più necessari dopo il completamento dell'App Router.
* **`migrazione-db-step1.ts`**, **`migrazione-db-step2.ts`** e **`migrazione-db-step3-finale.ts`** (ex `migrate*.ts`): Script progressivi per la migrazione e l'importazione iniziale dei dati dal vecchio database WordPress al database Prisma/Postgres locale.

### Utility Diagnostiche Storiche
* **`controlla-connessione-db.mjs`** (ex `check-db.mjs`): Semplice script per verificare la connessione locale al database e contare i record inseriti durante i test.
* **`formatta-lista-todo.js`** (ex `format_todo.js`): Utility per formattare i file di to-do e allineare i contrassegni grafici di avanzamento.
