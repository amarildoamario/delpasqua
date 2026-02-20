import Link from "next/link";
import Stripe from "stripe";
import ThemeToggle from "@/components/theme/ThemeToggle";
import CopyField from "./CopyField";
import SuccessAutoRefresh from "./SuccessAutoRefresh";
import { prisma } from "@/lib/server/prisma";
import type * as Prisma from "@/generated/prisma/client";
import SuccessTrackPurchase from "./SuccessTrackPurchase";

type OrderWithItems = Prisma.Prisma.OrderGetPayload<{ include: { items: true } }>;
type Item = OrderWithItems["items"][number];
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getStripeOrNull() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) return null;
  return new Stripe(key);
}

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}
function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
function clampId(id: string) {
  if (id.length <= 18) return id;
  return `${id.slice(0, 8)}…${id.slice(-8)}`;
}

function inferPaymentMethodLabel(methodTypes: string[] | null | undefined) {
  const types = (methodTypes ?? []).map((x) => x.toLowerCase());

  // ⚠️ Stripe può rappresentare “bonifico/bank transfer” in modi diversi a seconda della configurazione.
  // Questi sono i casi più comuni:
  if (types.includes("customer_balance")) return "Bonifico / Bank transfer (customer balance)";
  if (types.includes("us_bank_account")) return "Bonifico bancario (US bank account)";
  if (types.includes("sepa_debit")) return "Addebito SEPA (pagamento non immediato)";
  if (types.includes("bank_transfer")) return "Bonifico / Bank transfer";
  if (types.includes("card")) return "Carta";
  if (types.includes("paypal")) return "PayPal";

  return types.length ? types.join(", ") : "—";
}

function isLikelyDelayed(methodTypes: string[] | null | undefined, paymentStatus?: string | null) {
  const status = (paymentStatus ?? "").toLowerCase();
  if (status === "paid") return false;

  // se Stripe dice unpaid/processing -> trattiamo come potenzialmente delayed
  if (status === "unpaid" || status === "processing" || status === "requires_payment_method") {
    return true;
  }

  const types = (methodTypes ?? []).map((x) => x.toLowerCase());
  // metodi spesso non “istantanei”
  if (types.includes("customer_balance")) return true;
  if (types.includes("us_bank_account")) return true;
  if (types.includes("sepa_debit")) return true;
  if (types.includes("bank_transfer")) return true;

  return false;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await Promise.resolve(searchParams);
  let orderId = getOne(sp.orderId);
  const sessionId = getOne(sp.session_id);

  // 1) Stripe: recupera session + (se possibile) payment_intent per capire meglio metodo
  let stripeSession: Stripe.Checkout.Session | null = null;
  let paymentMethodTypes: string[] | null | undefined;
  let stripePaymentStatus: string | null = null;

  const stripe = sessionId ? getStripeOrNull() : null;
  if (sessionId && stripe) {
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent"],
      });
      orderId = orderId ?? stripeSession.metadata?.orderId;

      stripePaymentStatus = stripeSession.payment_status ?? null;

      // method types possono stare sulla session o sul payment_intent (dipende dai casi)
      paymentMethodTypes =
        stripeSession.payment_method_types ??
        (typeof stripeSession.payment_intent === "object"
          ? (stripeSession.payment_intent?.payment_method_types as string[] | undefined)
          : undefined);
    } catch {
      // ignore
    }
  }

  if (!orderId && !sessionId) {
    return (
      <main className="min-h-[70vh] bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Pagamento completato
                </h1>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  Manca{" "}
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                    orderId
                  </code>{" "}
                  o{" "}
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                    session_id
                  </code>.
                </p>
              </div>
              <ThemeToggle />
            </div>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
              >
                Torna allo shop
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 2) DB: prima per orderId, altrimenti per stripeSessionId
  let order =
    orderId
      ? await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
      : null;



order = await prisma.order.findFirst({
  where: { stripeCheckoutSessionId: sessionId },
  include: { items: true },
});

 if (!order) {
  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Pagamento completato
              </h1>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                Non riesco a recuperare i dettagli dell’ordine.
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl bg-neutral-50 p-4 text-sm dark:bg-neutral-950">
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-600 dark:text-neutral-300">orderId</span>
              <code className="rounded bg-white px-2 py-1 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                {orderId ?? "—"}
              </code>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-600 dark:text-neutral-300">session_id</span>
              <code className="rounded bg-white px-2 py-1 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                {sessionId ?? "—"}
              </code>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              Torna allo shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


  // ✅ Fonte di verità per OK: DB status
  const isPaid = order.status === "PAID";

  const methodLabel = inferPaymentMethodLabel(paymentMethodTypes);
  const delayed = isLikelyDelayed(paymentMethodTypes, stripePaymentStatus);

  // Se è delayed, auto-refresh breve (inutile refreshare per giorni)
  const maxAutoSeconds = delayed ? 20 : 120;

  const statusPill = isPaid
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"
    : "bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900";

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-12">
         <SuccessTrackPurchase orderId={order.id} isPaid={isPaid} />
        {!isPaid && (
          <SuccessAutoRefresh
            orderId={order.id}
            isPaid={isPaid}
            stripePaymentStatus={stripePaymentStatus}
            delayed={delayed}
            maxAutoSeconds={maxAutoSeconds}
          />
        )}

        <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "grid h-11 w-11 place-items-center rounded-2xl ring-1",
                      isPaid
                        ? "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"
                        : "bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900",
                    ].join(" ")}
                  >
                    <span className="text-xl">{isPaid ? "✓" : "⏳"}</span>
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                      {isPaid ? "Pagamento riuscito" : "Ordine ricevuto"}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                      Ordine{" "}
                      <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                        {clampId(order.id)}
                      </code>
                      {order.paidAt ? (
                        <>
                          {" "}
                          • pagato il{" "}
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {new Date(order.paidAt).toLocaleString("it-IT")}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>

                {!isPaid ? (
                  <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-200">
                    {delayed ? (
                      <>
                        Hai scelto un metodo di pagamento <b>non immediato</b> (es. bonifico). L’ordine è stato registrato,
                        ma la conferma può arrivare anche dopo <b>1–3 giorni lavorativi</b>.
                        Quando Stripe confermerà i fondi, ti invieremo un’email di riepilogo e l’ordine passerà in lavorazione/spedizione.
                      </>
                    ) : (
                      <>
                        Stiamo confermando il pagamento. Di solito ci mette pochi secondi.
                      </>
                    )}
                  </p>
                ) : null}
              </div>

              <div className="shrink-0 sm:min-w-[240px]">
                <div className="flex items-center justify-between gap-4">
                  <ThemeToggle />
                  <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusPill}`}>
                    {isPaid ? "Confermato" : "In attesa"}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-right dark:bg-neutral-950">
                  <div className="text-xs text-neutral-600 dark:text-neutral-300">Totale</div>
                  <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {euro(order.totalCents)}
                  </div>

                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Metodo:{" "}
                    <code className="rounded bg-white px-1.5 py-0.5 dark:bg-neutral-900">
                      {methodLabel}
                    </code>
                  </div>

                  {stripePaymentStatus ? (
                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Stripe:{" "}
                      <code className="rounded bg-white px-1.5 py-0.5 dark:bg-neutral-900">
                        {stripePaymentStatus}
                      </code>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CopyField label="ID ordine" value={order.id} />
              {sessionId ? <CopyField label="Session ID" value={sessionId} /> : null}
            </div>
          </div>
        </div>

        {/* Riepilogo acquisto (stesso stile di prima, qui lo tengo essenziale) */}
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-neutral-100">
              Riepilogo acquisto
            </h2>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {order.items.length} {order.items.length === 1 ? "articolo" : "articoli"}
            </span>
          </div>

          <div className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {order.items.map((it: Item) => (
              <div key={it.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">{it.title}</div>
                  <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{it.variantLabel}</div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    <span>{it.qty}×</span>
                    <span>{euro(it.unitPriceCents)}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">{euro(it.lineTotalCents)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              Continua gli acquisti
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
