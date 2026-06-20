# TODO Checkout, Pagamenti, Ordini

Data audit: 2026-05-29

## Agent Status

- FileStatus: PARTIAL
- LastVerified: 2026-06-20
- OpenItems: 1
- AgentAction: Aggiunto controllo go-live bloccante per endpoint Stripe live, dominio finale e signing secret produzione.
- Note: i flussi Stripe checkout, webhook e refund sono stati richiusi il 2026-06-02; resta da verificare la configurazione reale Stripe/Vercel al go-live.

## [⏳ TODO] P0 Go-live - Riallineare Stripe webhook e dominio production

Problema:
- Stripe live ha segnalato errori sull'endpoint `https://delpasqua.com/api/webhooks/stripe`.
- Dalla mail Stripe: 52 richieste hanno restituito HTTP 404 dopo il primo fallimento del 26 maggio 2026 alle 23:37:17 UTC.
- Durante lo sviluppo alcuni esiti pagamento/webhook sono stati fatti puntare al dominio attuale mentre il backend effettivo era in un altro ambiente.

Impatto:
- Se `checkout.session.completed` non arriva al backend production corretto, un pagamento puo essere incassato ma l'ordine puo restare non aggiornato o incompleto.
- Possibili mancati aggiornamenti di stato, stock, email ordine, fattura e dashboard gestionale.

Fix richiesto:
- Collegare `delpasqua.com` al deployment Vercel corretto prima dei test live.
- Verificare che `https://delpasqua.com/api/webhooks/stripe` risponda in produzione e non ritorni 404.
- In Stripe Dashboard live, configurare un solo endpoint webhook corretto per production: `https://delpasqua.com/api/webhooks/stripe`.
- Rimuovere o disattivare endpoint live vecchi, duplicati, preview o puntati ad ambienti non production.
- Configurare in Vercel production il `STRIPE_WEBHOOK_SECRET` corrispondente esattamente all'endpoint live.
- Verificare che `STRIPE_SECRET_KEY`, `STRIPE_LIVEMODE_EXPECTED`, `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `NEXT_PUBLIC_APP_URL` e `APP_ORIGIN` siano coerenti con il dominio finale.
- Eseguire un ordine test live a basso importo/prodotto test e verificare in Stripe Dashboard che il webhook riceva risposta 2xx.
- Verificare nel gestionale che l'ordine passi allo stato pagato e che stock/email/fattura/outbox siano coerenti.
- Per sviluppo o preview, usare endpoint separati o Stripe CLI, senza far puntare i webhook live all'ambiente di sviluppo.

## [✅ RISOLTO] P0 - Webhook Stripe assorbe errori con HTTP 200

Problema:
- Il catch finale in `src/app/api/webhooks/stripe/route.ts:545` marca l'evento come `review`, ma ritorna comunque `200` a Stripe.
- Se fallisce un passaggio critico dopo il pagamento, Stripe non ritenta automaticamente.

Stato:
- Migliorato il 2026-05-29 nella slice 1.
- Il catch runtime del webhook ora ritorna `500`, quindi Stripe puo ritentare sugli errori non gestiti.
- Richiuso il 2026-06-02:
  - il catch finale di `src/app/api/webhooks/stripe/route.ts` salva ora `failed_processing` e ritorna `500`, quindi Stripe ritenta davvero sugli errori runtime;
  - la registrazione evento e` stata resa replay-safe: se un evento era gia` finito in `failed_processing`, il webhook lo riprocessa invece di marcarlo semplicemente `duplicate`;
  - la lookup ordine recupera anche via `metadata.orderId` / `client_reference_id`, riducendo i falsi `review` nel caso in cui la sessione Stripe esista ma il DB non abbia ancora `stripeCheckoutSessionId`.

Verifica repo 2026-06-02:
- `src/app/api/webhooks/stripe/route.ts` contiene ora `registerIncomingWebhookEvent`, `loadOrderForSession` e il ritorno `500` con `retry: true`.

Impatto:
- Pagamento incassato ma ordine non aggiornato a `PAID`.
- Stock non scalato, email non inviata, fattura non assegnata.

Fix richiesto:
- Distinguere errori recuperabili da errori non recuperabili.
- Per errori transienti su DB/outbox/inventory, ritornare `500` a Stripe per far ritentare.
- Mantenere idempotenza via `StripeWebhookEvent`.

## [✅ RISOLTO] P0 - Creazione ordine prima della sessione Stripe lascia ordini orfani

Problema:
- `src/app/api/order/route.ts` crea ordine e item prima di creare la sessione Stripe.
- Se `stripe.checkout.sessions.create` fallisce dopo la transazione DB, resta un ordine `PENDING` senza checkout session.

Stato:
- Parzialmente risolto il 2026-05-29 nella slice 1.
- Se la creazione della sessione Stripe fallisce prima che la session esista/persa, l'ordine viene marcato `FAILED` e la reservation viene rilasciata.
- Se esiste gia un ordine con la stessa `Idempotency-Key` ma senza sessione, l'API risponde ora con `409` esplicito invece di arrivare a errore DB implicito.
- Avanzato il 2026-06-02:
  - se fallisce `stripe.coupons.create`, la compensazione marca l'ordine `FAILED` e rilascia la reservation;
  - se fallisce `stripe.checkout.sessions.create`, idem;
  - se Stripe crea la sessione ma manca `session.url`, il codice prova a scadere la sessione Stripe e compensa localmente;
  - se Stripe crea la sessione ma fallisce la persistenza locale del `stripeCheckoutSessionId`, il codice prova a scadere la sessione Stripe e compensa l'ordine;
  - il webhook puo recuperare ordini via `metadata.orderId` / `client_reference_id`, quindi il caso di inconsistenza DB locale e` meno fragile.
- Richiuso il 2026-06-02:
  - se fallisce la registrazione degli eventi `ORDER_CREATED` / `RISK_EVALUATED` dopo la creazione dell'ordine ma prima della sessione Stripe, l'ordine viene marcato `FAILED` e la reservation viene rilasciata;
  - se un retry con la stessa `Idempotency-Key` trova un ordine ancora `PENDING` senza sessione Stripe, l'API lo compensa prima di restituire `409 ORDER_SESSION_INCOMPLETE`;
  - se l'evento audit `STRIPE_SESSION_CREATED` fallisce dopo la persistenza della sessione, la checkout URL viene comunque restituita al client e l'errore resta solo nei log tecnici.

Verifica repo 2026-06-02:
- `src/app/api/order/route.ts` contiene ora `failPendingOrderWithoutCheckoutSession`, `expireStripeSessionBestEffort`, compensazione degli eventi pre-sessione e recupero idempotente degli ordini `PENDING` senza sessione.

Impatto:
- Ordini tecnici sporchi in admin.
- Il rate/anti-frode e le metriche possono includere tentativi non pagabili.
- Retry con stessa idempotency key puo non recuperare sessione.

Fix applicato:
- L'ordine resta creato prima della sessione Stripe per preservare snapshot, stock reservation e `client_reference_id`, ma ogni errore prima della sessione persistita compensa localmente con stato `FAILED` e release della reservation.
- L'idempotency key che ritrova un ordine `PENDING` senza sessione attiva il recupero compensativo invece di lasciare indefinitamente l'ordine orfano.

## [✅ RISOLTO] P0 - Metodi pagamento mostrati diversi da quelli abilitati

Stato:
- Risolto il 2026-05-30. Abbiamo introdotto una configurazione unica in `src/lib/paymentMethods.ts` con `CHECKOUT_PAYMENT_METHOD_TYPES = ["card"]`, riutilizzata sia dal checkout ordini (`src/app/api/order/route.ts`) sia dal checkout degustazioni (`src/app/api/tasting/book/route.ts`).
- `src/components/PaymentMethodsBadges.tsx` non pubblicizza piu PayPal, SEPA, Revolut o altri metodi non attivi, ma mostra solo il badge generico `CARD`, coerente con quanto Stripe espone davvero in cassa.

Problema:
- `src/components/PaymentMethodsBadges.tsx` mostrava Visa, Mastercard, Revolut, PayPal, SEPA e molti altri.
- `src/app/api/order/route.ts` creava Stripe Checkout con `payment_method_types: ["card"]`.
- Anche degustazioni usava solo `["card"]`: `src/app/api/tasting/book/route.ts`.

Impatto:
- L'utente vedeva metodi che poi non trovava in cassa.
- Rischio commerciale e supporto inutile.

Fix richiesto:
- O abilitare realmente i metodi su Stripe e nella sessione, o mostrare solo `card`.
- Idealmente leggere i metodi abilitati da configurazione unica.

## [✅ RISOLTO] P0 - Righe Stripe non includono sconti/IVA per riga (IVA inclusa e rimossa)

Stato:
- Risolto il 2026-05-30. I prezzi finiti inviati a Stripe includono gia l'IVA al 4% al loro interno, ed e stata rimossa la riga dell'IVA separata dal checkout Stripe per evitare doppie tassazioni. Gli sconti coupon sono allineati correttamente per riga nel pricing snapshot.

Problema:
- In `src/app/api/order/route.ts` Stripe line item usa `unit_amount: it.unitPriceCents` e quantity.
- IVA e spedizione sono righe separate; lo sconto e un coupon globale.
- Lo snapshot ordine ha allocazioni per riga, ma Stripe mostra una struttura diversa.

Impatto:
- Possibile differenza tra riepilogo ordine/fattura e visualizzazione Stripe.
- Piu complesso riconciliare rimborsi parziali o fatture per aliquote diverse.

Fix richiesto:
- Valutare se mantenere la struttura attuale o passare a prezzi netti/IVA coerenti per riga.
- Documentare chiaramente la regola fiscale scelta.

## [✅ RISOLTO] P1 - Success page e email linkano una pagina ordini mancante

Stato:
- Risolto operativamente il 2026-05-29 rimuovendo i link rotti a `/orders` dalla success page e dai template email.
- Aggiunta pagina preview template email per revisione manuale: `/developer/email-template`.

Problema:
- In precedenza email e success page puntavano a `/orders/...`.
- Non esiste una route pubblica/localizzata `/orders`; esiste `my-account`.

Impatto:
- Chiuso perche il cliente non riceve piu CTA verso route mancanti.

Fix richiesto:
- Nessuna azione urgente.
- Se in futuro si vuole mostrare il dettaglio ordine al cliente, creare una route pubblica con token sicuro.

## [✅ RISOLTO] P1 - Cancel page linka `/support` inesistente

Stato:
- Risolto il 2026-05-29: `src/app/[locale]/checkout/cancel/page.tsx` ora linka `/contatti` tramite `Link` localizzato.

Problema:
- In precedenza `src/app/[locale]/checkout/cancel/page.tsx:265` linkava `/support`.
- Non esiste una pagina `[locale]/support`; il CTA ora punta a `/contatti`.

Impatto:
- Chiuso.

Fix richiesto:
- Nessuna azione ulteriore su questo punto, salvo futura introduzione di una vera pagina supporto.

## [✅ RISOLTO] P1 - Ordini PENDING hanno TTL di 7 giorni

Stato:
- Risolto il 2026-05-30. Abbiamo centralizzato il TTL in `src/lib/constants.ts` con `ORDER_PENDING_TTL_MINUTES = 60`, riutilizzandolo dal job di expiry (`src/lib/server/expirePending.ts`) e dal cron (`src/app/api/cron/expire-pending/route.ts`).
- Il checkout ordini Stripe ora imposta anche `expires_at` in `src/app/api/order/route.ts`, cosi la sessione Stripe e la scadenza locale restano allineate sullo stesso orizzonte di 60 minuti.

Problema:
- `src/lib/server/expirePending.ts:13` usa 7 giorni.
- Con vera riserva stock sarebbe troppo lungo per un checkout non pagato.

Impatto:
- Se si introduce reserved stock, prodotti bloccati troppo a lungo.

Fix richiesto:
- Allineare TTL a scadenza Stripe session, per esempio 30-60 minuti.
- Distinguere ordine pending con sessione attiva da ordine operativo.

## [✅ RISOLTO] P1 - Refund flow incompleto rispetto a Stripe

Problema:
- Admin puo impostare `REFUNDED` da `src/app/api/admin/orders/[id]/status/route.ts:153`.
- Questo sembra aggiornare solo DB/email, non crea un rimborso Stripe.

Impatto:
- Stato admin "rimborsato" puo non corrispondere a rimborso reale.

Fix richiesto:
- Implementare API refund Stripe e webhook per `charge.refunded`/`refund.updated`.
- Bloccare lo status manuale se non c'e operazione Stripe associata.

Verifica repo 2026-06-02:
- `src/app/api/admin/orders/[id]/status/route.ts` consente ancora `REFUNDED` come transizione applicando DB/eventi/outbox, ma non chiama Stripe Refund API.
- `src/app/api/webhooks/stripe/route.ts` non gestisce ancora eventi `charge.refunded` o `refund.updated`.

Stato:
- Risolto il 2026-06-02.
- Il cambio stato manuale `REFUNDED` da `/api/admin/orders/[id]/status` e` stato bloccato: il gestionale deve usare l'endpoint dedicato `/api/admin/orders/[id]/refund`.
- L'endpoint admin refund chiama Stripe Refund API, richiede conferma esplicita nel payload e sincronizza poi `refundCents`, `refundedAt`, `REFUNDED` / `PARTIALLY_REFUNDED` tramite `applyStripeRefundToOrderTx`.
- La pagina dettaglio ordine mostra il rimborso nei totali e il bottone `Rimborsa con Stripe` apre una conferma prima di creare il refund reale.
- Il webhook Stripe gestisce `charge.refunded` e `refund.updated`, quindi anche un refund eseguito da Stripe Dashboard aggiorna il gestionale.
- Aggiunti test server per partial refund, full refund e idempotenza dell'outbox `ORDER_REFUNDED`.
