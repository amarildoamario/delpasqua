import Link from "next/link";
import Image from "next/image";
import Stripe from "stripe";
import ThemeToggle from "@/components/theme/ThemeToggle";
import SuccessAutoRefresh from "./SuccessAutoRefresh";
import { prisma } from "@/lib/server/prisma";
import type * as Prisma from "@/generated/prisma/client";
import SuccessTrackPurchase from "./SuccessTrackPurchase";
import ClearCartOnSuccess from "./ClearCartOnSuccess"; // <— se il file si chiama ClearCartOnSuccess.tsx lascia il tuo import
import Footer from "@/components/Footer";

// ✅ aggiunti per fallback immagini
import products from "@/db/products.json";
import type { Product } from "@/lib/shopTypes";

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

function inferPaymentMethodLabel(methodTypes: string[] | null | undefined) {
  const types = (methodTypes ?? []).map((x) => x.toLowerCase());
  if (types.includes("customer_balance")) return "Bonifico / Bank transfer";
  if (types.includes("us_bank_account")) return "Bonifico bancario";
  if (types.includes("sepa_debit")) return "Addebito SEPA (non immediato)";
  if (types.includes("bank_transfer")) return "Bonifico / Bank transfer";
  if (types.includes("card")) return "Carta";
  if (types.includes("paypal")) return "PayPal";
  return types.length ? types.join(", ") : "—";
}

function isLikelyDelayed(methodTypes: string[] | null | undefined, paymentStatus?: string | null) {
  const status = (paymentStatus ?? "").toLowerCase();
  if (status === "paid") return false;

  if (status === "unpaid" || status === "processing" || status === "requires_payment_method") {
    return true;
  }

  const types = (methodTypes ?? []).map((x) => x.toLowerCase());
  if (types.includes("customer_balance")) return true;
  if (types.includes("us_bank_account")) return true;
  if (types.includes("sepa_debit")) return true;
  if (types.includes("bank_transfer")) return true;

  return false;
}

function formatDateTime(d: Date | string | null | undefined) {
  if (!d) return null;
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("it-IT");
}

function sumQty(items: Item[]) {
  return items.reduce((s, it) => s + (it.qty ?? 0), 0);
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

  // ✅ catalog per fallback
  const catalog = products as Product[];

  // 1) Stripe session (per payment_status e metodo)
  let stripeSession: Stripe.Checkout.Session | null = null;
  let paymentMethodTypes: string[] | null | undefined;
  let stripePaymentStatus: string | null = null;

  const stripe = sessionId ? getStripeOrNull() : null;
  if (sessionId && stripe) {
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent"],
      });

      orderId = orderId ?? stripeSession.metadata?.orderId ?? undefined;
      stripePaymentStatus = stripeSession.payment_status ?? null;

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
      <>
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
        <Footer />
      </>
    );
  }

  // 2) DB: prima per orderId, altrimenti per stripeSessionId
  let order = orderId
    ? await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    : null;

  if (!order && sessionId) {
    order = await prisma.order.findFirst({
      where: { stripeCheckoutSessionId: sessionId },
      include: { items: true },
    });
  }

  if (!order) {
    return (
      <>
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
        <Footer />
      </>
    );
  }

  const isPaid = order.status === "PAID";
  const shouldClearCart = isPaid || (stripePaymentStatus ?? "").toLowerCase() === "paid";

  const methodLabel = inferPaymentMethodLabel(paymentMethodTypes);
  const delayed = isLikelyDelayed(paymentMethodTypes, stripePaymentStatus);
  const maxAutoSeconds = delayed ? 20 : 120;

  const qtyTotal = sumQty(order.items);

  const statusPillClass = isPaid
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"
    : "bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900";

  return (
    <>
      <main className="min-h-[75vh] bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-12">
          <SuccessTrackPurchase orderId={order.id} isPaid={isPaid} />
          <ClearCartOnSuccess shouldClear={shouldClearCart} />

          {!isPaid && (
            <SuccessAutoRefresh
              orderId={order.id}
              isPaid={isPaid}
              stripePaymentStatus={stripePaymentStatus}
              delayed={delayed}
              maxAutoSeconds={maxAutoSeconds}
            />
          )}

          {/* TOP CARD */}
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-emerald-300 to-neutral-900 dark:to-white" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* LEFT */}
                <div className="min-w-0">
                  <div className="flex items-start gap-4">
                    <div
                      className={[
                        "grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1",
                        isPaid
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"
                          : "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900",
                      ].join(" ")}
                    >
                      {isPaid ? <CheckIcon className="h-6 w-6" /> : <ClockIcon className="h-6 w-6" />}
                    </div>

                    <div className="min-w-0">
                      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        {isPaid ? "Pagamento riuscito" : "Ordine ricevuto"}
                      </h1>

                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                        {isPaid ? (
                          <>
                            Grazie! Il tuo ordine è confermato
                            {order.orderNumber ? (
                              <>
                                {" "}
                                • Numero ordine{" "}
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                  #{order.orderNumber}
                                </span>
                              </>
                            ) : null}
                          </>
                        ) : (
                          <>Abbiamo registrato l’ordine. Stiamo confermando il pagamento.</>
                        )}
                      </p>

                      {order.paidAt ? (
                        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                          Pagato il{" "}
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {formatDateTime(order.paidAt)}
                          </span>
                        </p>
                      ) : null}

                      {!isPaid ? (
                        <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
                          {delayed ? (
                            <>
                              Metodo di pagamento non immediato (es. bonifico): la conferma può arrivare anche dopo{" "}
                              <b>1–3 giorni lavorativi</b>.
                            </>
                          ) : (
                            <>Di solito la conferma arriva in pochi secondi.</>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[320px]">
                  <div className="flex items-center justify-between gap-4">
                    <ThemeToggle />
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusPillClass}`}>
                      {isPaid ? "Confermato" : "In attesa"}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="text-xs font-semibold tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                      RIEPILOGO
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600 dark:text-neutral-300">Articoli</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {qtyTotal}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600 dark:text-neutral-300">Totale</span>
                        <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          {euro(order.totalCents)}
                        </span>
                      </div>

                      <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        Metodo:{" "}
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {methodLabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <Link
                        href="/"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
                      >
                        Continua gli acquisti
                      </Link>

                      <Link
                        href="/orders"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800/60"
                      >
                        I miei ordini
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LISTA PRODOTTI */}
          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-neutral-100">
                Prodotti acquistati
              </h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {order.items.length} {order.items.length === 1 ? "riga" : "righe"}
              </span>
            </div>

            <div className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              {order.items.map((it: any) => {
                // ✅ fallback robusto: order.imageUrl -> snapshot.variantImageSrc -> catalog variant -> snapshot.imageSrc -> catalog product
                const snap = it.productSnapshot ?? null;

                const p = catalog.find((x) => x.id === it.productId);
                const v = p?.variants.find((vv) => vv.id === it.variantId);

                const img =
                  it.imageUrl ??
                  snap?.variantImageSrc ??
                  (v as any)?.imageSrc ??
                  snap?.imageSrc ??
                  (p as any)?.imageSrc ??
                  null;

                return (
                  <div key={it.id} className="flex items-start gap-4 p-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
                      {img ? (
                        <Image
                          src={img}
                          alt={it.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-neutral-100 dark:bg-neutral-900" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                            {it.title}
                          </div>
                          <div className="mt-1 truncate text-sm text-neutral-600 dark:text-neutral-300">
                            {it.variantLabel}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {euro(it.lineTotalCents)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                        <span>Qtà {it.qty}</span>
                        <span>•</span>
                        <span>{euro(it.unitPriceCents)} / cad.</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              Riceverai una conferma via email con i dettagli dell’ordine.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ---------- Icons ---------- */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}