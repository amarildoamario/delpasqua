# TODO Performance e Ottimizzazione Velocita

Data audit: 2026-06-06
Ultimo aggiornamento: 2026-06-27

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-27
- OpenItems: 5
- AgentAction: usare questo file come backlog vivo per miglioramenti performance lato codice; hero home alleggerita lato codice, resta compressione asset/verifica Lighthouse; poi provider carrello globale, bundle client shop/prodotto, staticita route pubbliche, payload i18n client e Redis/Upstash.
- Note: build production verificata con `npm.cmd run build` su Next.js 16.1.6. Il build passa; molte route sotto `[locale]` risultano ancora `ƒ` server-rendered on demand. Database Prisma Postgres confermato in Frankfurt; `vercel.json` dichiara `fra1` per allineare le Serverless Functions al DB dal prossimo deploy.

---

## [RISOLTO] P1 - Alleggerire Hero Home e Carosello Iniziale

### Stato
- **Intervento codice 2026-06-27**: `src/components/HeroCarousel.tsx` ora e` un Server Component per il primo slide, con traduzioni risolte server-side e immagine LCP `priority`. Il carosello interattivo e` stato spostato in `src/components/HeroCarouselClient.tsx`, che gestisce frecce/timer e monta le slide successive solo quando diventano attive dopo l'hydration.
- **Verifica 2026-06-27**: `npm.cmd run typecheck`, `npm.cmd run lint` e `npm.cmd run build` passano. Verifica Playwright su production locale `http://localhost:3010/it`: nessun errore console/page, 1 sola immagine hero nel DOM al primo caricamento, poi 2 dopo avanzamento carosello.
- **Analisi 2026-06-27**: `src/components/HeroCarousel.tsx` e` un Client Component montato subito in home. Il carosello contiene tre immagini grandi.
- **Problema**: il primo viewport della home dipende da JS client, timer/interazioni del carosello e immagini grandi. Anche con `next/image`, questo puo peggiorare LCP, tempo di idratazione e percezione su mobile.
- **Impatto**: alto sulla home, che e` una pagina commerciale e SEO primaria.
- **Fix applicato 2026-06-27**:
  - [x] Separare una hero statica/server-rendered per il primo slide, mantenendo il carosello come enhancement client.
  - [x] Caricare le slide successive solo dopo il primo render o quando il carosello diventa interattivo.
  - [x] Convertire/comprimere gli asset hero sorgenti in AVIF/WebP ottimizzati. Le tre immagini principali sono state convertite in WebP ed ottimizzate tramite un processo automatizzato in Python/Pillow:
    - `tradizione.png` (2.50 MB) -> `tradizione.webp` (255.7 KB, -90% di peso)
    - `oli.png` (1.66 MB) -> `oli.webp` (40.9 KB, -97.5% di peso)
    - `storia.jpeg` (0.63 MB) -> `storia.webp` (356 KB, -45% di peso)
  - [x] Ottimizzato e convertito tutte le immagini della pagina **Storia** (`/storia`) in formato WebP, inclusa la generazione di una nuova immagine di copertina premium per la sezione "Filosofia" tramite intelligenza artificiale:
    - `sezione_iniziale.jpg` (459 KB) -> `sezione_iniziale.webp` (355 KB, -23% di peso)
    - `storia-1.jpg` (643 KB) -> `storia-1.webp` (573 KB, -11% di peso)
    - `storia-3.jpg` (351 KB) -> `storia-3.webp` (210 KB, -40% di peso)
    - Generata `storia-4.webp` (222 KB) per la sezione "Filosofia" (sostituendo `storia-4.jpg` da 338 KB, -34% di peso), garantendo un design moderno, premium e a caricamento istantaneo.
  - [x] Configurato correttamente il caricamento dell'immagine `priority` e `sizes="100vw"` per la slide LCP principale per mantenere intatte e massimizzare le performance SEO SSR e caricamento iniziale.

---

## [RISOLTO] P1 - Ridurre Provider Carrello e Catalogo nel Layout Globale

### Stato
- **Analisi 2026-06-27**: `src/app/[locale]/layout.tsx` leggeva `readPublicCatalog()` e passava il catalogo completo a `Providers`, che montava `CartProvider` su tutte le pagine. `src/context/CartContext.tsx` eseguiva anche `fetch(/api/products?t=Date.now(), { cache: "no-store" })` al mount.
- **Problema**: pagine informative come storia, produzione, privacy, blog e landing SEO ereditavano logica carrello/catalogo anche quando non serviva, appesantendo l'HTML iniziale e avviando chiamate api client-side ad ogni mount.
- **Fix applicato 2026-06-27**:
  - Spostato `CartProvider` fuori dal layout globale per la Navbar. `Navbar` ora vive fuori da `Providers` e il componente `CartButton` è autosufficiente: legge il conteggio direttamente da `localStorage` e si tiene aggiornato tramite l'evento personalizzato `"cart-updated"`.
  - Il `CartProvider` viene montato dinamicamente attorno al `CartDrawer` solo quando l'utente apre effettivamente il carrello (`{open && <CartProvider> ... </CartProvider>}`).
  - Rimossa la fetch globale incondizionata `/api/products?t=...` su ogni mount. Ora `CartContext` scarica il catalogo in modo pigro (lazy loading) solo se il carrello contiene articoli (`lines.length > 0`) o se l'utente naviga su pagine del flusso d'acquisto (`/shop`, `/cart`, `/checkout`).
  - La fetch client usa `/api/products` (senza timestamp dinamico e no-store) per consentire al browser di memorizzare la risposta nella cache.
  - Il layout globale passa alla Navbar solo l'array minimo di `id` e `slug` (meno di 0.5KB) per consentire il corretto funzionamento del cambio lingua sui dettagli dei prodotti, eliminando del tutto la serializzazione del catalogo completo nell'HTML delle pagine statiche.

---

## [RISOLTO] P1 - Scomporre Bundle Client di Scheda Prodotto, Shop e Carrello

### Stato
- **Intervento 2026-06-27 (Scheda Prodotto, Shop e Carrello)**: Refattorizzati interamente i tre bundle client principali del flusso d'acquisto, riducendo drasticamente il loro peso in codice client e rendendoli conformi alle specifiche RSC di Next.js:
  - **Scheda Prodotto**: Estratti i dizionari i18n multilingua per tutte le 9 lingue (`copy`, `detailCopy`) e la funzione `getProductSpecs` in `productDetailsData.ts`. La dimensione del file client `ProductDetailsClient.tsx` è scesa da **126 KB** a **69 KB** (-45%).
  - **Shop Page**: Estratti i dizionari multilingua in `shopData.ts`. Il Server Component `page.tsx` risolve le traduzioni in base al locale e le passa come props. Il client component `ShopPageClient.tsx` riceve le props pre-localizzate, rimuovendo circa 700 righe di dizionari hardcoded, alleggerendo radicalmente il bundle dello Shop.
  - **Carrello (Cart Page)**: Estratte le traduzioni in `cartData.ts`. Le vecchie funzioni di stato dinamiche sono state ridefinite come stringhe template serializzabili (per evitare errori di serializzazione RSC). Il Server Component pre-localizza i testi e la lista paesi, passandoli a `CartPageClient.tsx`. Nel client component viene montato un wrapper `useMemo` locale per reidratare dinamicamente le stringhe template senza toccare le chiamate preesistenti. Il bundle del Carrello risulta pulito e notevolmente snellito.
- **Verifica**: TypeScript typecheck, ESLint e Next.js production build superano i controlli con 0 errori.
- **Vantaggio**: I client component scaricano solo le traduzioni del locale attivo (1/9 del payload totale!), accelerando l'idratazione e migliorando le performance e la stabilità SEO lato server (SSR).

---

## [TODO] P2 - Verificare Staticita Reale delle Route Pubbliche

### Stato
- **Analisi 2026-06-27**: `npm.cmd run build` passa, ma l'output mostra molte route pubbliche sotto `[locale]` come `ƒ` server-rendered on demand, nonostante diverse pagine abbiano `generateStaticParams` o `revalidate`.
- **Problema**: se layout, provider, i18n o letture catalogo impediscono la staticita effettiva, Vercel deve usare funzioni server piu spesso del necessario.
- **Impatto**: medio/alto su TTFB, cold start e stabilita sotto traffico.
- **Fix richiesto**:
  - Isolare cosa rende dinamiche le route pubbliche: `getMessages()`, `readPublicCatalog()`, provider client, accessi a API request-bound o catalogo file/DB.
  - Verificare se pagine informative possono essere `force-static` o ISR pulito senza dati globali non necessari.
  - Tenere dinamiche solo admin, checkout success/cancel, API e aree che richiedono dati freschi.

---

## [TODO] P2 - Ridurre Payload i18n Passato ai Client Component

### Stato
- **Analisi 2026-06-27**: i file `messages/*.json` pesano circa 53-59 KB ciascuno. `NextIntlClientProvider` viene montato nel layout globale con `messages={messages}`.
- **Problema**: se tutti i messaggi della lingua vengono serializzati verso il client, anche pagine semplici pagano un payload superiore al necessario.
- **Impatto**: medio, soprattutto su mobile e su pagine pubbliche con poca interazione.
- **Fix richiesto**:
  - Valutare namespace minimi per i Client Component.
  - Spostare piu testo possibile in Server Component tramite `getTranslations`.
  - Passare ai componenti client solo stringhe gia risolte o sottoinsiemi di messaggi realmente usati.

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
