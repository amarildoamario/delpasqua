# TODO Checkout, Pagamenti, Ordini

Data audit: 2026-05-29

## [⚠️ PARZIALE] P0 - Webhook Stripe assorbe errori con HTTP 200

Problema:
- Il catch finale in `src/app/api/webhooks/stripe/route.ts:545` marca l'evento come `review`, ma ritorna comunque `200` a Stripe.
- Se fallisce un passaggio critico dopo il pagamento, Stripe non ritenta automaticamente.

Stato:
- Migliorato il 2026-05-29 nella slice 1.
- Il catch runtime del webhook ora ritorna `500`, quindi Stripe puo ritentare sugli errori non gestiti.
- Restano ancora da distinguere in modo piu fine errori transienti vs non recuperabili.

Impatto:
- Pagamento incassato ma ordine non aggiornato a `PAID`.
- Stock non scalato, email non inviata, fattura non assegnata.

Fix richiesto:
- Distinguere errori recuperabili da errori non recuperabili.
- Per errori transienti su DB/outbox/inventory, ritornare `500` a Stripe per far ritentare.
- Mantenere idempotenza via `StripeWebhookEvent`.

## [⚠️ PARZIALE] P0 - Creazione ordine prima della sessione Stripe lascia ordini orfani

Problema:
- `src/app/api/order/route.ts` crea ordine e item prima di creare la sessione Stripe.
- Se `stripe.checkout.sessions.create` fallisce dopo la transazione DB, resta un ordine `PENDING` senza checkout session.

Stato:
- Parzialmente risolto il 2026-05-29 nella slice 1.
- Se la creazione della sessione Stripe fallisce prima che la session esista/persa, l'ordine viene marcato `FAILED` e la reservation viene rilasciata.
- Se esiste gia un ordine con la stessa `Idempotency-Key` ma senza sessione, l'API risponde ora con `409` esplicito invece di arrivare a errore DB implicito.
- Resta aperto l'edge case in cui Stripe crei la sessione ma fallisca la persistenza locale del `stripeCheckoutSessionId`.

Impatto:
- Ordini tecnici sporchi in admin.
- Il rate/anti-frode e le metriche possono includere tentativi non pagabili.
- Retry con stessa idempotency key puo non recuperare sessione.

Fix richiesto:
- O creare sessione prima salvando poi ordine in stato coerente, oppure marcare subito `FAILED` se Stripe fallisce.
- Gestire idempotency anche per ordini creati senza sessione.

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

## [⏳ TODO] P1 - Refund flow incompleto rispetto a Stripe

Problema:
- Admin puo impostare `REFUNDED` da `src/app/api/admin/orders/[id]/status/route.ts:153`.
- Questo sembra aggiornare solo DB/email, non crea un rimborso Stripe.

Impatto:
- Stato admin "rimborsato" puo non corrispondere a rimborso reale.

Fix richiesto:
- Implementare API refund Stripe e webhook per `charge.refunded`/`refund.updated`.
- Bloccare lo status manuale se non c'e operazione Stripe associata.
