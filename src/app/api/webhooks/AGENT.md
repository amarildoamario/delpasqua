# AGENT.md

## Scopo
- Ingressi da provider esterni, soprattutto Stripe.

## Regole
- Preserva verifiche firma, idempotenza e tracciamento eventi.
- Ogni nuova side effect deve essere safe su retry del provider.
- Se cambi payload handling, aggiorna anche persistenza `StripeWebhookEvent` e outbox correlata.

## Attenzioni
- Un bug qui impatta pagamenti, stato ordini, inventory e fatturazione. Preferisci cambi minimi e verificabili.
