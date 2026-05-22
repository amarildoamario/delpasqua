# AGENT.md

## Scopo
- Entry point App Router: route UI, route API e layout.

## Regole
- Le route UI localizzate stanno principalmente in `src/app/[locale]`.
- Le route API stanno in `src/app/api` e dovrebbero delegare la business logic a `src/lib/server`.
- Evita di duplicare validazione/pricing/inventory direttamente nelle page o nei route handler.

## Attenzioni
- Esiste anche `src/app/degustazioni/page.tsx`: trattala come eccezione/alias e verifica sempre la relazione con la versione localizzata.
- `src/app/lib` non sembra il path canonico corrente: preferisci `src/lib`.
