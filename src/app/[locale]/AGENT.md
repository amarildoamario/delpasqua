# AGENT.md

## Scopo
- Pagine user-facing localizzate con `next-intl`.

## Regole
- Usa i wrapper di navigazione da `@/i18n/routing`, non link hardcoded locale-sensitive.
- I testi UI dovrebbero vivere in `messages/*.json`, non inline, salvo copy molto locale a una singola pagina.
- Mantieni il tono editoriale coerente con brand artigianale/premium.
- Le page dovrebbero orchestrare dati e componenti, non contenere business logic complessa.

## Attenzioni
- Layout globale, navbar, analytics e provider passano da questa subtree.
- Molte pagine sono marketing/statiche; evita di complicarle con stato o fetch non necessario.
