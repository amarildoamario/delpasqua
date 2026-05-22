# AGENT.md

## Scopo
- Codice sorgente applicativo canonico.

## Regole
- `src/lib` è la libreria condivisa da preferire per logica riusabile.
- `src/app/lib` appare come duplicazione legacy: non aggiungere nuovo codice lì salvo compatibilità mirata.
- Mantieni separati frontend, route handlers e logica server.

## Mappa
- `app`: pagine e API App Router.
- `components`: UI riusabile e sezioni di pagina.
- `context`: stato React cross-page.
- `db`: catalogo JSON locale.
- `i18n`: routing/request locale.
- `lib`: logica business/shared.
- `generated`: codice generato, non manuale.
