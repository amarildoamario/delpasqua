# AGENT.md

## Scopo
- Stato React condiviso cross-tree. Attualmente soprattutto carrello.

## Regole
- Mantieni questa cartella piccola e focalizzata su state management, non logica server.
- Cura bene hydration, localStorage e fallback SSR-safe.
- Qualsiasi cambio allo shape del carrello va coordinato con componenti shop/cart/checkout.
