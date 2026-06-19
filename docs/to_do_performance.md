# TODO Performance e Ottimizzazione Velocita

Data audit: 2026-06-06

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-06
- OpenItems: 1
- AgentAction: Resta aperta solo la valutazione Redis/Upstash per cache dati dinamici.
- Note: Database Prisma Postgres confermato in Frankfurt; `vercel.json` dichiara `fra1` per allineare le Serverless Functions al DB dal prossimo deploy. Questo file non contiene piu fix P0/P1 di performance obbligatori prima del go-live.

---

## [RISOLTO] P1 - Generazione Statica del Locale in Layout principale

### Stato
- **Analisi**: `src/app/[locale]/layout.tsx` gestisce il parametro dinamico del locale, ma non definiva `generateStaticParams`.
- **Problema**: Senza `generateStaticParams` nel layout principale, Next.js era costretto a trattare tutte le pagine nidificate sotto `[locale]` come dinamiche a runtime su richiesta, impedendo la compilazione statica del sito al build time.
- **Impatto**: Latenza piu alta, cold start del serverless di Vercel, e carico inutile sulle funzioni lato server.
- **Fix applicato**:
  - Esportata la funzione `generateStaticParams` in `src/app/[locale]/layout.tsx` restituendo la lista dei locali supportati da `routing.locales`.

---

## [RISOLTO] P1 - Rimuovere "force-dynamic" e passare a ISR (Incremental Static Regeneration)

### Stato
- **Analisi**: La Home (`src/app/[locale]/page.tsx`), lo Shop (`src/app/[locale]/shop/page.tsx`) e la pagina Acquista (`src/app/[locale]/acquista/page.tsx`) usavano `export const dynamic = "force-dynamic"`.
- **Problema**: L'istruzione `force-dynamic` forzava Next.js a ignorare cache e pre-generazione statica, costringendo Vercel ad avviare una Serverless Function ad ogni caricamento.
- **Impatto**: TTFB piu alto e impossibilita di servire le pagine staticamente dalla Edge CDN globale di Vercel.
- **Fix applicato**:
  - Rimosso `export const dynamic = "force-dynamic"` dalle pagine pubbliche di marketing.
  - Aggiunto `export const revalidate = 3600` dove necessario per consentire ISR.

---

## [RISOLTO] P1 - Ottimizzazione della Pagina "Degustazioni" tramite Client-Side Fetching

### Stato
- **Analisi**: La pagina degustazioni (`src/app/[locale]/degustazioni/page.tsx`) usava `force-dynamic` a causa del calcolo della data di inizio settimana (`new Date()`) e della lettura diretta delle prenotazioni via Prisma a runtime.
- **Problema**: Eseguire la query sul database durante il rendering server ritardava la risposta iniziale della pagina intera.
- **Impatto**: L'utente vedeva la pagina solo dopo query DB e calcolo slot liberi.
- **Fix applicato**:
  - Rimossa la dipendenza dal rendering dinamico della pagina.
  - Resa statica la struttura principale.
  - Spostato il caricamento di slot e disponibilita su fetch client verso `/api/tasting/availability`.
  - Aggiunto stato di caricamento per la parte calendario.

---

## [RISOLTO] P2 - Parametri Statici per Blog e Prodotti (generateStaticParams)

### Stato
- **Analisi**: Le rotte dei singoli post del blog (`src/app/[locale]/blog/[slug]/page.tsx`) e del dettaglio prodotto (`src/app/[locale]/shop/[prodotto]/page.tsx`) non avevano `generateStaticParams`.
- **Problema**: Articoli blog e schede prodotto venivano generati on-demand.
- **Impatto**: Prestazioni inferiori sulle pagine piu importanti per SEO e vendite.
- **Fix applicato**:
  - Esportato `generateStaticParams` nelle rotte blog e prodotto.

---

## [RISOLTO] P2 - Configurazione Formato Immagine AVIF nel Config di Next.js

### Stato
- **Analisi**: `next.config.ts` configurava l'ottimizzazione immagini standard ma non forzava formati avanzati di compressione.
- **Problema**: Le immagini potevano essere servite in WebP o formato originale, perdendo i vantaggi del formato AVIF.
- **Impatto**: File piu pesanti da mobile e LCP piu alto.
- **Fix applicato**:
  - Aggiunto `image/avif` prima di `image/webp` in `next.config.ts`.

---

## [RISOLTO] P2 - Allineamento Geografico Database e Serverless Functions di Vercel

### Stato
- **Analisi**: Il progetto usa Prisma Postgres via `DATABASE_URL`/`DIRECT_URL` e funzioni Node.js su Vercel.
- **Problema**: Se il database e le Serverless Functions sono in regioni diverse, ogni chiamata DB aggiunge latenza di rete evitabile.
- **Impatto**: TTFB piu alto sulle route server e API che interrogano Prisma.
- **Verifica effettuata**:
  - Il deployment production Vercel letto durante l'audit risultava in regione `iad1`.
  - Il database Prisma Postgres e` stato confermato operativo in Frankfurt.
  - `vercel.json` ora dichiara esplicitamente `"regions": ["fra1"]`, cosi il prossimo deploy production sposta le funzioni Vercel in Frankfurt.
  - Prisma Postgres usa `db.prisma.io`; la connection string non espone la regione dal repo o dalle API Vercel, quindi la regione DB va verificata in Prisma Console.
- **Nota operativa**:
  - Se in Prisma Console il database viene spostato o ricreato in un'altra regione, aggiornare anche `vercel.json` con la regione Vercel corrispondente.

---

## [TODO] P3 - Integrazione di Redis (Upstash) per caching dati dinamici

### Stato
- **Analisi**: Nel `package.json` sono gia installate le dipendenze `@upstash/redis` e `@upstash/ratelimit`.
- **Problema**: Non tutte le query dinamiche possono essere eliminate facilmente, ad esempio sconti in tempo reale o statistiche dell'admin.
- **Impatto**: Il database relazionale riceve query ripetitive per dati che cambiano raramente.
- **Fix richiesto**:
  - Utilizzare Upstash Redis per creare un layer di caching intorno ai dati del catalogo calcolato, ad esempio `readCatalogWithMerch`, quando non e` possibile usare l'ISR a livello di intera pagina.
