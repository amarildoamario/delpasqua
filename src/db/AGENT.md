# AGENT.md

## Scopo
- Dati locali del catalogo prodotti e backup JSON.

## Regole
- `products.json` è una fonte dati operativa: modifica con attenzione.
- Conserva stabili `id`, `slug`, `variants[].id` e, se possibile, `sku`.
- Preferisci aggiornamenti incrementali ai prodotti esistenti invece di rinomine distruttive.

## Attenzioni
- Gli ID qui sono riusati da pricing, ordini, inventory, shop, admin e analytics.
- I file `products.backup.*.json` sono snapshot storici: non usarli come fonte attiva.
