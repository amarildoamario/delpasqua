# AGENT.md

## Scopo
- UI del pannello amministrazione.

## Regole
- L'accesso server-side passa da `requireAdminPage(...)`.
- I componenti client che chiamano API admin devono usare helper coerenti con `adminFetch`.
- Mantieni chiara la distinzione tra viste operative, metriche, catalogo e sistema.

## Attenzioni
- Le pagine admin leggono dati reali di ordini, clienti e spedizioni: evita regressioni di stato o rendering fuorviante.
- Le badge nel layout sono cache-izzate in memoria; non spostare quella logica senza motivo.
