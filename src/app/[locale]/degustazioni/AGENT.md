# AGENT.md

## Scopo
- Landing e booking flow delle degustazioni.

## Regole
- Slot, disponibilità e tipi degustazione derivano dalla logica condivisa in `src/lib/tasting`.
- Le richieste utente devono restare validate server-side.
- Mantieni copy e UX orientati a prenotazione semplice e rassicurante.

## Attenzioni
- Questa area tocca email admin e stato `TastingBooking`: ogni cambio dati va coordinato con API e admin.
