# AGENT.md

## Scopo
- Asset statici serviti direttamente da Next.js.
- Include immagini hero, blog, prodotti, storia, frantoio e logo.

## Regole
- I path pubblici sono API implicite: non rinominare o spostare file senza aggiornare tutti i riferimenti.
- Mantieni naming coerente e leggibile; evita duplicati quasi identici se non necessari.
- Preferisci formati ottimizzati e dimensioni ragionevoli, ma senza rompere URL esistenti.

## Attenzioni
- Le immagini blog e prodotti sono referenziate anche da contenuti in `src/lib/blog-data.ts` e `src/db/products.json`.
- Su sistemi case-sensitive il casing dei filename conta: mantienilo stabile.
