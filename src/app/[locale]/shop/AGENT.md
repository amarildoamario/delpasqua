# AGENT.md

## Scopo
- Catalogo shop, schede prodotto e componenti locali di acquisto.

## Regole
- La fonte dati è il catalogo/reader server e il JSON prodotti, non stato hardcoded nella pagina.
- Mantieni stabili slug prodotto, variant ID e mapping immagini.
- Le informazioni prezzo/stock mostrate al client sono indicative finché non validate lato server.

## Attenzioni
- Cambiare shape prodotto impatta card, PDP, cart, checkout, admin catalog e inventory.
