# AGENT.md

## Scopo
- Checkout UI e pagine `success` / `cancel`.

## Regole
- Non duplicare nel client la logica autorevole di pricing, VAT, promo o inventory.
- Le pagine post-pagamento devono trattare i dati ordine come sensibili e verificati server-side.
- Mantieni tracking analytics coerente ma non invasivo.

## Attenzioni
- Le route di successo/cancellazione sono collegate a Stripe e agli stati ordine. Modifiche qui vanno pensate insieme a webhook e API order.
