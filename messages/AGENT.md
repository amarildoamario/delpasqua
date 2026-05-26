# AGENT.md

## Scopo
- File JSON di traduzione per `next-intl`.
- Ogni file corrisponde a una locale definita in `src/i18n/routing.ts`.

## Regole
- Mantieni la stessa struttura chiavi in tutte le lingue.
- Usa `it.json` come baseline semantica se devi aggiungere nuove chiavi.
- Evita rinominare namespace esistenti senza aggiornare tutti i `useTranslations(...)`.
- Mantieni JSON valido e formattato in modo consistente.

## Attenzioni
- Le label di navigazione, checkout, admin e degustazioni hanno impatto diretto su UX e SEO.
- Se aggiungi una nuova locale, devi aggiornare anche `src/i18n/routing.ts`, eventuali link lingua e middleware/request config.

## Supporto
- Mantieni eventuali aggiornamenti massivi delle traduzioni espliciti e verificabili prima del commit.
