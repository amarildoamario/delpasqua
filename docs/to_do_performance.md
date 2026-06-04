# TODO Performance e Ottimizzazione Velocità

Data audit: 2026-06-04

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-04
- OpenItems: 2
- AgentAction: Eseguite ottimizzazioni di performance su Vercel (generazione statica, revalidate/ISR, client-side calendar, formato AVIF).
- Note: Verificate con build di produzione locale e typecheck superati.

---

## [✅ RISOLTO] P1 - Generazione Statica del Locale in Layout principale

### Stato:
- **Analisi**: `src/app/[locale]/layout.tsx` gestisce il parametro dinamico del locale, ma non definisce `generateStaticParams`.
- **Problema**: Senza `generateStaticParams` nel layout principale, Next.js è costretto a trattare tutte le pagine nidificate sotto `[locale]` come dinamiche a runtime su richiesta, impedendo la compilazione statica del sito al build time.
- **Impatto**: Latenza più alta, cold start del serverless di Vercel, e carico inutile sulle funzioni lato server.
- **Fix richiesto**:
  - Esportare la funzione `generateStaticParams` in `src/app/[locale]/layout.tsx` restituendo la lista dei locali supportati da `routing.locales` (es. `it`, `en`, `de`, `nl`, `da`, `no`).
  ```typescript
  import { routing } from '@/i18n/routing';

  export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
  }
  ```

---

## [✅ RISOLTO] P1 - Rimuovere "force-dynamic" e passare a ISR (Incremental Static Regeneration)

### Stato:
- **Analisi**: La Home (`src/app/[locale]/page.tsx`), lo Shop (`src/app/[locale]/shop/page.tsx`), e la pagina Acquista (`src/app/[locale]/acquista/page.tsx`) utilizzano `export const dynamic = "force-dynamic"`.
- **Problema**: L'istruzione `force-dynamic` forza Next.js a ignorare qualsiasi cache o pre-generazione statica, costringendo Vercel ad avviare una Serverless Function ad ogni singolo caricamento di pagina da parte degli utenti.
- **Impatto**: Tempo di caricamento iniziale (TTFB) alto per gli utenti, impossibilità di servire le pagine staticamente dalla rete Edge CDN globale di Vercel.
- **Fix richiesto**:
  - Rimuovere `export const dynamic = "force-dynamic"` dalle pagine pubbliche di marketing.
  - Sostituire con `export const revalidate = 3600` (o un tempo adeguato) per consentire a Next.js di pre-renderizzare le pagine e rigenerarle in background a intervalli periodici.
  - Implementare opzionalmente la revalidazione on-demand (`revalidatePath` o `revalidateTag`) nelle Server Actions dell'admin quando si modifica il catalogo, i prodotti o le promozioni per propagare all'istante le modifiche sul sito pubblico senza attendere lo scadere della cache.

---

## [✅ RISOLTO] P1 - Ottimizzazione della Pagina "Degustazioni" tramite Client-Side Fetching

### Stato:
- **Analisi**: La pagina degustazioni (`src/app/[locale]/degustazioni/page.tsx`) usa `force-dynamic` a causa del calcolo della data di inizio settimana (`new Date()`) e della lettura diretta delle prenotazioni via Prisma a runtime.
- **Problema**: Eseguire la query sul database in modo sincrono durante il rendering del server ritarda la risposta iniziale della pagina intera.
- **Impatto**: L'utente vede una pagina bianca mentre il server esegue la query nel database e calcola gli slot liberi.
- **Fix richiesto**:
  - Rimuovere `export const dynamic = "force-dynamic"` dalla pagina.
  - Rendere statica la struttura principale e i testi informativi della pagina degustazioni.
  - Modificare il componente `TastingsCalendar` affinché carichi gli slot e le prenotazioni effettive lato client (es. tramite un hook `useEffect` o librerie come SWR / React Query) puntando all'endpoint `/api/tasting/availability`.
  - Mostrare uno scheletro di caricamento (Skeleton UI) per la parte del calendario mentre i dati vengono recuperati asincronamente.

---

## [✅ RISOLTO] P2 - Parametri Statici per Blog e Prodotti (generateStaticParams)

### Stato:
- **Analisi**: Le rotte dei singoli post del blog (`src/app/[locale]/blog/[slug]/page.tsx`) e del dettaglio prodotto (`src/app/[locale]/shop/[prodotto]/page.tsx`) non hanno `generateStaticParams` esportato.
- **Problema**: Ciascun articolo del blog o dettaglio prodotto viene generato on-demand ad ogni visita.
- **Impatto**: Prestazioni inferiori e caricamento lento per le pagine più importanti a livello SEO e vendite (schede prodotto e articoli di divulgazione).
- **Fix richiesto**:
  - Esportare `generateStaticParams` in `src/app/[locale]/blog/[slug]/page.tsx` leggendo tutti i post del blog disponibili tramite `getBlogPosts(locale)`.
  - Esportare `generateStaticParams` in `src/app/[locale]/shop/[prodotto]/page.tsx` leggendo la lista dei prodotti dal catalogo JSON (`src/db/products.json`).

---

## [✅ RISOLTO] P2 - Configurazione Formato Immagine AVIF nel Config di Next.js

### Stato:
- **Analisi**: `next.config.ts` configura l'ottimizzazione immagini standard ma non forza formati avanzati di compressione.
- **Problema**: Le immagini vengono servite di default in WebP o formato originale, mancando i vantaggi del formato AVIF.
- **Impatto**: File di dimensioni maggiori per i clienti da mobile e di conseguenza caricamento più lento (LCP più alto).
- **Fix richiesto**:
  - Aggiungere il supporto per il formato immagine `image/avif` nella sezione `images` di `next.config.ts`.
  ```typescript
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [ ... ]
  }
  ```

---

## [⏳ TODO] P2 - Allineamento Geografico Database e Serverless Functions di Vercel

### Stato:
- **Analisi**: Dipendenza da database relazionali e query Prisma eseguite lato server.
- **Problema**: Se il database in produzione è situato in una regione diversa da quella predefinita di Vercel (es. database in USA `us-east-1` e serverless Vercel a Francoforte/Milano, o viceversa), ogni chiamata al database ha un costo di rete di oltre 100ms.
- **Impatto**: Ritardo accumulato nel rendering del server (TTFB rallentato).
- **Fix richiesto**:
  - Verificare la regione di deploy delle funzioni su Vercel (dal pannello *Settings > Functions* della dashboard di Vercel) e assicurarsi che corrisponda alla regione fisica del database ospitato (es. AWS Frankfurt `eu-central-1` / Milan `eu-south-1` se si usa Supabase, Neon o PostgreSQL).

---

## [⏳ TODO] P3 - Integrazione di Redis (Upstash) per caching dati dinamici

### Stato:
- **Analisi**: Nel `package.json` sono già installate le dipendenze `@upstash/redis` e `@upstash/ratelimit`.
- **Problema**: Non tutte le query dinamiche possono essere eliminate facilmente (es. sconti in tempo reale o statistiche dell'admin).
- **Impatto**: Il database relazionale riceve un carico di query ripetitivo per dati che cambiano raramente.
- **Fix richiesto**:
  - Utilizzare Upstash Redis per creare un layer di caching intorno ai dati del catalogo calcolato (es. `readCatalogWithMerch`) quando non è possibile usare l'ISR a livello di intera pagina.
