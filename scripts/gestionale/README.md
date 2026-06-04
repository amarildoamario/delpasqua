# Suite di Test del Gestionale Admin (Suite Standalone)

Questa cartella contiene una suite di test automatici focalizzati sul corretto funzionamento del pannello amministrativo (gestionale) di Frantoio Del Pasqua.

## Architettura dei Test

La suite è composta da script indipendenti e leggeri (`test-*.mjs`) e da un file di utilità condiviso (`utils.mjs`). Per eseguire i test, è necessario che il server locale di sviluppo sia attivo su `http://localhost:3000` (o configurato tramite la variabile d'ambiente `BASE_URL`).

### Autenticazione nei Test

Le rotte del pannello di amministrazione e le relative API sono protette da controlli severi sui cookie di sessione (`admin_session`), cookie CSRF (`admin_csrf`), header CSRF (`x-csrf-token`) e controlli referer/origin.

Per evitare l'uso di credenziali reali durante i test automatici e garantire l'indipendenza e la ripetibilità di ogni test case:
1. Prima di ogni test, l'helper `utils.mjs` genera una sessione amministrativa fittizia inserendola direttamente nel database locale (PostgreSQL) tramite il client Prisma.
2. Recupera i token generati (sessione + CSRF) e li espone come cookie e header HTTP per le successive richieste fetch.
3. Al termine di ogni script (anche in caso di fallimento o errore), la sessione di test creata viene revocata ed eliminata dal database, garantendo la pulizia dello stato.

## Come Eseguire i Test

1. Assicurarsi che il server Next.js locale sia avviato:
   ```bash
   npm run dev
   ```

2. Avviare la suite di test del gestionale:
   ```bash
   npm run test:gestionale
   ```

## Catalogo degli Script

* **`runner.mjs`**: L'orchestratore principale. Scansiona ed esegue in sequenza tutti i test presenti nella cartella.
* **`utils.mjs`**: Contiene gli helper per effettuare chiamate HTTP autenticate ed interfacciarsi con il database di Prisma.
* **`test-01-auth.mjs`**: Convalida i meccanismi di autenticazione e sicurezza (blocco rotte protette, tentativi di login errati, e controlli CSRF).
