# AGENT.md

## Scopo
- Libreria condivisa canonica dell'applicazione.

## Regole
- Metti qui logica riusabile, pure functions, adapter client e servizi server.
- Evita dipendenze cicliche tra `server`, `client`, `analytics`, `shop`, `tasting`.
- Se una regola di business è usata in più posti, centralizzala qui invece di duplicarla in route o componenti.

## Mappa
- `server`: Prisma, auth admin, pricing, inventory, email, outbox, catalogo.
- `client`: helper browser-side e fetch wrapper.
- `analytics`: tracking e identità anonime.
- `tasting`: logica slot e tipi degustazione.
- `theme`: helper tema residui, ma il sito è attualmente light-first.

## Attenzioni
- Preferisci questa subtree a `src/app/lib`, che appare legacy.
