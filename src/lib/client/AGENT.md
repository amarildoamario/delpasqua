# AGENT.md

## Scopo
- Helper client-side: fetch verso API, redirect checkout, hook browser-only.

## Regole
- Nessun import di moduli server-only o Prisma.
- Incapsula qui header, CSRF e parsing di risposte condivisi.
- Se una chiamata API viene usata da più componenti client, centralizzala qui.

## Attenzioni
- Gestisci errori utente in modo traducibile e coerente con UI cart/admin/checkout.
