# AGENT.md - Tool e Utility Operative

## Scopo
La cartella `/tools` ospita utility stabili e tool operativi ricorrenti utilizzati per la manutenzione ordinaria degli asset fisici del sito (immagini, traduzioni attive, simulazione di carico) e per l'automazione di compiti ripetitivi.

## Regole Globali per i Tool
1. **Nessun Side Effect Imprevisto**: Ogni tool che tocca o aggiorna servizi esterni (es. download/upload di immagini o scraping) deve chiarire a console quali modifiche sta per apportare e su quale ambiente opera (produzione o locale).
2. **Ambiente Dev vs Prod**: I tool sensibili che agiscono su asset condivisi devono prevedere flag o controlli per evitare di sovrascrivere dati in produzione per errore.
3. **Log Chiari ed Evidenti**: I log devono evidenziare il successo delle operazioni e tracciare in modo trasparente l'esito dei task (es. quante immagini ottimizzate, quante traduzioni mancanti rilevate).

---

## Catalogo dei Tool Operativi

### Gestione Traduzioni Blog
- **`controlla-traduzioni-blog.ts`** (ex `check-blog-translations.ts`): È uno strumento avanzato di analisi statica che controlla lo stato delle traduzioni del blog rispetto agli articoli in italiano. 
  * Identifica post privi di traduzione per le lingue target (`en`, `de`, `nl`, `da`, `no`).
  * Rileva campi mancanti (titolo, estratto, slug, categoria) o quando il corpo del testo cade nel fallback in italiano.
  * Genera un report dettagliato in formato Markdown (solitamente salvato in `/docs/blog-translation-check.md`) o in formato JSON.
  * Può essere lanciato con diversi argomenti (es. `--locale de --full --out <path>`).

### Ottimizzazione e Sincronizzazione Asset
- **`ottimizza-immagini.py`** (ex `optimize-images.py`): Script in Python che analizza le immagini del sito e le ottimizza riducendone il peso senza comprometterne la qualità visiva, supportando formati moderni e garantendo caricamenti rapidi (best practice SEO).
- **`sincronizza-immagini-blog.ts`** (ex `sync-blog-images.ts`): Utility per sincronizzare in locale le immagini collegate ai post del blog, scaricandole o associandole correttamente alle cartelle dei contenuti localized.
- **`sincronizza-immagini-prodotti.mjs`** (ex `sync-product-images.mjs`): Script specifico per sincronizzare le immagini dei prodotti del catalogo, assicurando che ciascuna variante o ID prodotto abbia l'immagine corrispondente nella cartella pubblica.

### Test e Simulazione
- **`simula-utenti.mjs`** (ex `simulate-users.mjs`): Script di simulazione del comportamento degli utenti sul sito. Esegue flussi di navigazione tipici, simulando l'interazione con il catalogo prodotti, il carrello e le pagine del brand. Utilissimo per testare la stabilità delle sessioni, la resilienza del server sotto carico e il corretto tracciamento degli analytics in tempo reale.
