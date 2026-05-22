# AGENT.md

## Scopo
- Subtree legacy/duplicata rispetto a `src/lib`.

## Regole
- Non aggiungere nuovo codice qui se puoi usare `src/lib`.
- Se devi toccare questi file per compatibilità, valuta prima se esiste già l'equivalente canonico in `src/lib`.
- Evita di introdurre nuovi import verso `@/app/lib/...`.

## Attenzioni
- Questa cartella contiene versioni alternative di helper server/client; usarla per nuovo sviluppo aumenterebbe la duplicazione.
