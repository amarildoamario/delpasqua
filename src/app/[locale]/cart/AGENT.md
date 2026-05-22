# AGENT.md

## Scopo
- Esperienza carrello e validazione pre-checkout.

## Regole
- Lo stato client del carrello vive nel context dedicato; non creare copie concorrenti.
- Pricing, promo e availability vanno confermati server-side; il client non è fonte di verità.
- Mantieni messaggi errore traducibili e coerenti tra drawer e pagina cart.

## Attenzioni
- Se tocchi payload item/cart, allinea `CartContext`, API checkout/order e componenti acquisto.
