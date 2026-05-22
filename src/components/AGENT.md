# AGENT.md

## Scopo
- Componenti UI riusabili, sezioni home/marketing, componenti commerce e analytics wrappers.

## Regole
- I componenti dovrebbero ricevere dati via props o hook dedicati, non incorporare business logic server.
- Mantieni la direzione visiva già presente: premium, artigianale, light-only, con molta cura per spacing e imagery.
- Se un componente è generico, tienilo realmente riusabile; se è di dominio, rendilo esplicito nel nome.

## Attenzioni
- Navbar, cart drawer, add-to-cart e hero incidono molto su UX mobile: testa sempre con attenzione.
- `components/ui` contiene primitive stilistiche; evita di inserirci dipendenze di dominio.
