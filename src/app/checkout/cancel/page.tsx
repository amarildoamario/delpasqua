import Stripe from "stripe";
import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import { releaseReserved } from "@/lib/server/inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripeOrNull() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) return null;
  return new Stripe(key);
}

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function clampId(id: string) {
  if (id.length <= 18) return id;
  return `${id.slice(0, 8)}…${id.slice(-8)}`;
}

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function CancelPage({
  searchParams,
}: {
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await Promise.resolve(searchParams);
  const sessionId = getOne(sp.session_id) ?? null;

  // 1) tenta a recuperare orderId dalla session Stripe
  let orderId: string | null = null;
  let stripeCustomerEmail: string | null = null;

  if (sessionId) {
    const stripe = getStripeOrNull();
    if (stripe) {
      try {
        const s = await stripe.checkout.sessions.retrieve(sessionId);
        orderId =
          (s.metadata?.orderId as string | undefined) ??
          (s.client_reference_id as string | null) ??
          null;
        stripeCustomerEmail = (s.customer_details?.email as string | null) ?? null;
      } catch {
        // ignore
      }
    }
  }

  // 2) trova ordine
  const order = await prisma.order.findFirst({
    where: orderId
      ? { id: orderId }
      : sessionId
        ? { stripeCheckoutSessionId: sessionId }
        : { id: "__missing__" },
    include: { items: true },
  });

  // 3) se trovato e annullabile, marca CANCELED + rilascia reserved
  if (order && order.status === "PENDING") {
    await prisma.$transaction(async (tx) => {
      await releaseReserved(
        tx,
        order.items.map((it) => ({ sku: it.sku, qty: it.qty }))
      );

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELED",
          canceledAt: new Date(),
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          type: "ORDER_CANCELED",
          message: "Pagamento annullato dall'utente (redirect da Stripe)",
          metaJson: JSON.stringify({ stripeCheckoutSessionId: sessionId }),
        },
      });
    });
  }

  const visibleId = order?.orderNumber
    ? `#${order.orderNumber}`
    : order?.id
      ? clampId(order.id)
      : null;

  const itemsCount = order?.items?.reduce((sum, it) => sum + it.qty, 0) ?? 0;

  return (
    <main className="min-h-[75vh] bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-12">
        {/* Header mini */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-xs tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
            CHECKOUT
          </div>
          {/* se hai ThemeToggle qui nel progetto puoi metterlo, altrimenti lascia così */}
          {/* <ThemeToggle /> */}
        </div>

        {/* Card principale */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* top ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-neutral-900 dark:to-white" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Left */}
              <div className="min-w-0">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:ring-rose-900">
                    <CancelIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                      Pagamento annullato
                    </h1>

                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                      Nessun addebito è stato effettuato.
                      {visibleId ? (
                        <>
                          {" "}
                          Il tuo ordine{" "}
                          <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                            {visibleId}
                          </code>{" "}
                          è stato annullato.
                        </>
                      ) : null}
                    </p>

                    <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
                      <div className="flex items-start gap-3">
                        <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
                        <div className="space-y-1">
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            Il carrello è stato mantenuto
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-300">
                            Puoi tornare indietro, modificare quantità o riprovare il pagamento quando vuoi.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Extra tip */}
                    <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                      Se hai annullato per errore, puoi riprovare: il checkout si riapre in pochi secondi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right (mini riepilogo) */}
              <div className="w-full lg:w-[320px]">
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                  <div className="text-xs font-semibold tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    RIEPILOGO
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 dark:text-neutral-300">Stato</span>
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:ring-rose-900">
                        Annullato
                      </span>
                    </div>

                    {order ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600 dark:text-neutral-300">Articoli</span>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {itemsCount}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600 dark:text-neutral-300">Totale ordine</span>
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {euro(order.totalCents)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Dettagli ordine non disponibili.
                      </div>
                    )}

                    {stripeCustomerEmail ? (
                      <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        Email:{" "}
                        <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                          {stripeCustomerEmail}
                        </code>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-3">
                    <Link
                      href="/cart"
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
                    >
                      Torna al carrello
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800/60"
                    >
                      Continua lo shopping
                    </Link>
                  </div>

                  {/* micro note */}
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                    <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
                    <p>
                      Nessun pagamento completato. Se hai visto una notifica bancaria, potrebbe essere solo una
                      pre-autorizzazione che verrà rilasciata automaticamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800/60"
              >
                Modifica carrello
              </Link>
              <Link
                href="/support"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-medium text-white hover:opacity-90 dark:bg-rose-500"
              >
                Serve aiuto?
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Se hai annullato volontariamente, tutto ok 🙂 Il carrello resta lì pronto per quando vuoi riprovare.
        </p>
      </div>
    </main>
  );
}

/* ---------- Icons ---------- */

function CancelIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
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
      <path d="M12 10v7" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
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
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
      <path d="M6 11h12v10H6z" />
    </svg>
  );
}