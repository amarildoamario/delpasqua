# AGENT.md

## Scopo
- API del pannello amministrazione: ordini, promozioni, inventory, export, report, impostazioni, outbox.

## Regole
- Ogni endpoint deve passare da `requireAdminApi(...)` salvo motivazione esplicita.
- Mantieni CSRF, rate limit e audit trail coerenti con l'implementazione esistente.
- Se un endpoint muta stato ordine o outbox, considera effetti su email, analytics e dashboard badge.

## Attenzioni
- Le route con export (`csv`, `json`, `xml`, `pdf`) sono contratti consumati da operatori: non cambiare shape o naming con leggerezza.
