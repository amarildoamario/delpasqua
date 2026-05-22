# AGENT.md

## Scopo
- Script di manutenzione e supporto allo sviluppo, tipicamente one-shot.

## Regole
- Scrivi script idempotenti quando possibile.
- Se uno script muta file in blocco, stampa cosa tocca ed evita side effect nascosti.
- Qui stanno bene utility semplici su filesystem/contenuti; la logica di dominio riusabile resta in `src/lib`.

## Attenzioni
- Se tocchi traduzioni o migrazioni tramite script, preserva formato e ordine chiavi quanto possibile.
