# AGENT.md

## Scopo
- Configurazione centralizzata locale/routing per `next-intl`.

## Regole
- Qualsiasi nuova lingua richiede aggiornamento coerente di routing, request config e file `messages`.
- Usa i wrapper esportati qui per link/router locale-aware.
- Mantieni `defaultLocale` allineata alla strategia SEO e contenutistica del progetto.

## Attenzioni
- Cambiare qui ha impatto trasversale su routing, navbar, pagine e fallback not-found.
