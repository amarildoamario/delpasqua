# AGENT.md

## Scopo
- Utility operative più “forti”: reset DB, sync immagini, bootstrap inventory, simulazioni.

## Regole
- Tratta questa cartella come area a rischio side effects.
- Ogni comando distruttivo deve avere guardrail espliciti contro produzione.
- Logga in modo chiaro cosa viene fatto e su quale ambiente.

## Attenzioni
- `reset-db.ts` e strumenti inventory non vanno resi più permissivi senza motivo.
- Se aggiungi nuovi tool che parlano con DB o asset pubblici, rendi evidente se sono safe in dev e unsafe in prod.
