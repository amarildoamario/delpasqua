# AGENT.md

## Scopo
- Utility operative per sync immagini, simulazioni e manutenzione asset.

## Regole
- Tratta questa cartella come area con side effects possibili.
- Ogni comando che tocca servizi esterni o asset condivisi deve rendere esplicito cosa aggiorna.
- Logga in modo chiaro cosa viene fatto e su quale ambiente.

## Attenzioni
- Se aggiungi nuovi tool che parlano con asset pubblici o servizi esterni, rendi evidente se sono safe in dev e unsafe in prod.
