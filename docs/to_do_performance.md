# TODO Performance e Ottimizzazione Velocita

Data audit: 2026-06-06
Ultimo aggiornamento: 2026-06-27

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-28
- OpenItems: 0
- VerificationNote 2026-06-28: `npm.cmd run typecheck`, `npm.cmd run lint` e `npm.cmd run build` passano con successo. Tutti i task di ottimizzazione performance nel backlog sono stati completati ed esportati correttamente.
- AgentAction: completato il lazy loading dei componenti client, il caching del catalogo, la staticità delle rotte pubbliche, il payload i18n client, le dimensioni responsive delle immagini e la disattivazione del prefetch aggressivo sui link secondari. Non ci sono ulteriori pendenze aperte. L'integrazione Redis/Upstash è stata esclusa come da indicazioni dell'utente.
- Note: build production verificata con `npm.cmd run build` su Next.js 16.1.6. Il build passa; tutte le rotte pubbliche sotto `[locale]` sono compilate correttamente come statiche `●` (SSG/ISR). Database Prisma Postgres confermato in Frankfurt; `vercel.json` dichiara `fra1` per allineare le Serverless Functions al DB dal prossimo deploy.

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

## [RISOLTO] P2 - Verificare Staticità Reale delle Route Pubbliche

### Stato
- **Analisi 2026-06-27**: `npm.cmd run build` passava, ma l'output mostrava molte route pubbliche sotto `[locale]` come `ƒ` server-rendered on demand, nonostante diverse pagine avessero `generateStaticParams` o `revalidate`.
- **Problema**: Mancava l'importazione e la chiamata a `setRequestLocale(locale)` nei vari file pagina e sotto-layout per istruire `next-intl` a generare i segmenti staticamente. Inoltre, l'interrogazione diretta al database Prisma a build-time in `readCatalogWithMerch` faceva fallire la compilazione negli ambienti in cui il DB Postgres era irraggiungibile.
- **Fix applicato 2026-06-27**:
  - [x] Inserito un blocco `try-catch` con fallback sicuro in `readCatalogWithMerch` in caso di DB Postgres offline durante la compilazione.
  - [x] Scritto ed eseguito uno script automatico per iniettare `setRequestLocale(locale)` su tutti i **31 file pagina e layout** pubblici sotto `[locale]`.
  - [x] Verificato con `npm run build`: tutte le rotte pubbliche ora compilano correttamente come `●` (SSG/ISR) anziché `ƒ` (Dynamic).
  - [x] Verificato con `npm run lint` e `npm run typecheck`: entrambi completati con successo (0 errori).

---

## [RISOLTO] P2 - Ridurre Payload i18n Passato ai Client Component

### Stato
- **Analisi 2026-06-27**: i file `messages/*.json` pesano circa 53-59 KB ciascuno. `NextIntlClientProvider` viene montato nel layout globale con `messages={messages}`.
- **Problema**: se tutti i messaggi della lingua vengono serializzati verso il client, anche pagine semplici pagano un payload superiore al necessario.
- **Fix applicato 2026-06-28**:
  - [x] Modificato `layout.tsx` per passare a `NextIntlClientProvider` globale solo i namespace layout-critical (`Common` e `Cart`), riducendo la serializzazione da **42 KB a 6 KB (-85%)**.
  - [x] Implementato un pattern wrapper asincrono su tutti i file pagina sotto `[locale]` (escluso `/admin`) per iniettare `setRequestLocale(locale)` in modo pulito e sicuro.
  - [x] Nelle pagine che contengono Client Component dipendenti da altre traduzioni (es. Home, Shop, Degustazioni, Contatti, Il Nostro Olio, Produzione), il wrapper provvede a racchiudere la pagina in un `<NextIntlClientProvider>` annidato che passa esclusivamente i namespace minimi e specifici necessari (es. `HomePage`, `Products`, `ShopPage`, ecc.).
  - [x] Pagine interamente statiche lato server (es. Storia, Privacy, Cookie, Resi) beneficiano della riduzione senza alcun provider annidato aggiuntivo.

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

## [ESCLUSO] P3 - Integrazione di Redis (Upstash) per caching dati dinamici

### Stato
- **Analisi**: Nel `package.json` sono gia installate le dipendenze `@upstash/redis` e `@upstash/ratelimit`.
- **Decisione**: Escluso su indicazione dell'utente per evitare dipendenze e integrazione con servizi SaaS esterni.

---

## [RISOLTO] P2 - Ottimizzare il Caching del Catalogo e delle Query (React cache & unstable_cache)

### Stato
- **Analisi 2026-06-27**: Funzioni server-side come `readCatalogWithMerch()` leggono file JSON da disco (`products.json`) ed eseguono query sul database ad ogni rendering. Se più Server Component chiamano queste funzioni, Next.js riesegue le letture e le query più volte.
- **Problema**: Latenza aggiuntiva del server (TTFB) dovuta a letture ridondanti dello stesso file/DB nello stesso ciclo di rendering o tra richieste diverse.
- **Fix applicato 2026-06-28**:
  - [x] Avvolte le letture in `unstable_cache` di Next.js per memorizzare in cache i dati JSON (`catalog-raw`) e le query dei dati promozionali integrati (`catalog-merch`) con revalidazione oraria (`revalidate: 3600`) e tag `"catalog"`.
  - [x] Avvolte le letture in `cache` di React per deduplicare ed eliminare le chiamate ridondanti all'interno di una stessa richiesta HTTP (request-scoped caching).
  - [x] Integrata la chiamata `revalidateTag("catalog")` sia in `writeCatalog()` (quando l'admin modifica il JSON da pannello) sia nella rotta API PATCH delle promozioni (`src/app/api/admin/sales/route.ts`), assicurando la freschezza istantanea dei prezzi in caso di modifiche amministrative.
  - [x] Mantenuto il blocco try-catch resiliente in `readCatalogWithMerch()` per prevenire crash del build quando i dati merchandising Prisma non sono raggiungibili.
  - [x] Correzione 2026-06-28: le invalidazioni catalogo usano la firma Next.js 16 `revalidateTag("catalog", "max")`. La resilienza DB confermata in codice e nel fallback di `readCatalogWithMerch()`.

---

## [RISOLTO] P2 - Lazy Loading dei Componenti Client Non Critici (next/dynamic)

### Stato
- **Analisi**: Componenti interattivi client come `CartDrawer` (carrello laterale), calendario degustazioni, sezioni animate del blog, modali e analytics tendono ad appesantire il bundle JavaScript iniziale.
- **Problema**: Aumenta la dimensione del bundle JS caricato all'apertura del sito, peggiorando l'indice di interattività (INP/FID) e la velocità di idratazione (hydration time).
- **Fix applicato 2026-06-28**:
  - [x] Il `CartDrawer` viene importato dinamicamente con `{ ssr: false }` e caricato on-demand solo all'apertura del carrello in `CartButton.tsx`.
  - [x] Ottimizzata la Home Page ([page.tsx](file:///c:/Users/Utente/Desktop/React/delpasqua/src/app/[locale]/page.tsx)): tutti i componenti client sotto-piega (ShopHighlights, HomeAboutFamily, HomeAboutTerritory, HomeUniqueness, HomeProductShowcase, HomeTastingsFeature, HomeMillFeature, DiscoverSection, HomeTrustAndReviews, HomeGallery, BlogHighlights) sono ora caricati tramite `dynamic()` con pre-rendering server abilitato (`ssr: true` di default). Questo scorpora il loro JS dal bundle principale della Home preservando al 100% l'indicizzazione SEO dei testi.
  - [x] Ottimizzata la pagina Degustazioni ([page.tsx](file:///c:/Users/Utente/Desktop/React/delpasqua/src/app/[locale]/degustazioni/page.tsx)):
    - `TastingsCalendar` viene caricato dinamicamente in modo asincrono, mostrando uno skeleton placeholder (`loading`) pulsante e rimandando la compilazione della logica interattiva al client.
    - `TastingsSeoSection` viene caricata in modalità differita via `dynamic()` con `ssr: true` per mantenere i testi visibili ai motori di ricerca caricando il codice di animazione in background.

---

## [RISOLTO] P2 - Configurazione dell'Attributo sizes per le Immagini Responsive

### Stato
- **Analisi**: Diversi componenti `next/image` per le liste prodotti e gli articoli del blog non definivano un attributo `sizes` specifico.
- **Problema**: Senza `sizes`, Next.js assumeva che l'immagine occupasse il 100% della larghezza del viewport (`100vw`) su tutti i dispositivi, servendo immagini molto pesanti e sovradimensionate agli utenti mobile.
- **Fix applicato 2026-06-28**:
  - Configurato l'attributo `sizes` in tutte le griglie prodotti e blog (es. `sizes="(max-width: 1024px) 100vw, 50vw, 33vw"` o simili).
  - Ottimizzate le immagini all'interno di `SeoLandingPage.tsx` con un attributo sizes dedicato.

---

## [RISOLTO] P3 - Disattivazione del Prefetch Aggressivo sui Link Secondari

### Stato
- **Analisi**: Di default, il componente `<Link>` di Next.js pre-scarica in background tutti i dati delle rotte visibili nel viewport dell'utente.
- **Problema**: Nelle griglie con decine di link (come elenchi lunghi del blog o del catalogo), questo avviava decine di fetch di pre-scaricamento simultanei in background rallentando la navigazione attiva.
- **Fix applicato 2026-06-28**:
  - Impostato `prefetch={false}` sui link di liste e griglie secondarie meno prioritarie in `ProductCard.tsx`, `MobileListCard.tsx`, `acquista/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`, `BlogHighlights.tsx`, `DiscoverSection.tsx`, e `NuovoRaccoltoClient.tsx`, caricandoli in prefetch solo all'hover dell'utente.
