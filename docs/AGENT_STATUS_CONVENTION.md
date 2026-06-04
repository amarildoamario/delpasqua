# Docs Status Convention

Questa cartella usa una convenzione esplicita per evitare che un agent debba inferire lo stato dal nome del file.

## Agent Status

Ogni file operativo dovrebbe avere in alto una sezione con queste chiavi:

- `FileStatus`: `ACTIVE` oppure `COMPLETED`
- `LastVerified`: data dell'ultima verifica reale sul repo o sull'ambiente
- `OpenItems`: numero di task ancora `TODO` o `PARZIALE`
- `AgentAction`: cosa deve fare il prossimo agent

## Regole di lettura

- Se `FileStatus: COMPLETED`, il file va trattato come archivio anche se il nome inizia con `to_do_`.
- Se `FileStatus: ACTIVE`, il file va trattato come backlog vivo.
- Nei titoli task, la parte autorevole e` la keyword ASCII `TODO`, `PARZIALE` o `RISOLTO`; l'emoji iniziale e` solo decorativa.
- Le sole voci da implementare sono quelle che contengono `TODO` o `PARZIALE` nel titolo task.
- Le voci che contengono `RISOLTO` sono storiche e servono come contesto, regressioni note e riferimenti ai file toccati.

## Regole di aggiornamento

- Quando un task cambia stato, aggiornare sia il titolo del task sia la sezione `Agent Status` del file.
- Se un file arriva a `OpenItems: 0`, cambiare `FileStatus` a `COMPLETED` e aggiungere una nota che il file e` archiviato.
- Se restano solo task manuali o go-live, scriverlo esplicitamente per evitare che il prossimo agent li tratti come task puramente di codice.
