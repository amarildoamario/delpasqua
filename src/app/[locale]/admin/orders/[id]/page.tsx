import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/server/prisma";
import ShipToggleButton from "@/app/[locale]/admin/orders/ship/ShipToggleButton";
import OrderStatusActions, { OrderInternalControls } from "@/app/[locale]/admin/orders/[id]/OrderStatusActions";
import PrintButton from "./PrintButton";
import type * as Prisma from "@/generated/prisma/client";
import PageHeader from "../../_components/PageHeader";
import { getFlagEmoji } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Calendar,
  Activity,
  Package,
  ShieldCheck,
  Building,
  Terminal,
  Globe,
  Info,
  ChevronLeft,
  DollarSign,
  Clock,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

type OrderWithItemsAndEvents = Prisma.Prisma.OrderGetPayload<{
  include: { items: true; events: true };
}>;
type Item = OrderWithItemsAndEvents["items"][number];

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      events: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) return notFound();

  const preparedAt =
    order.preparingAt ??
    order.events.find((e) => e.toStatus === "IN_PREPARAZIONE")?.createdAt ??
    null;

  return (
    <div className="space-y-6 print-area max-w-7xl mx-auto">
      <style>{`
        @media print {
          body { background: white !important; }
          .print-hidden { display: none !important; }
          .print-area { padding: 0 !important; margin: 0 !important; }
          a[href]:after { content: "" !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="text-xs text-neutral-500 print-hidden flex items-center gap-1.5">
          <Link href="/admin/orders" className="hover:text-neutral-900 transition flex items-center gap-0.5 font-medium">
            <ChevronLeft className="h-3.5 w-3.5" />
            Torna agli ordini
          </Link>
          <span className="text-neutral-300">|</span>
          <span className="text-neutral-400">id: {order.id}</span>
        </div>

        <PageHeader
          title={`Ordine ${order.orderNumber ?? order.id.slice(0, 8)}`}
          subtitle={
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-600 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                Creato: <b className="text-neutral-800">{new Date(order.createdAt).toLocaleString("it-IT")}</b>
              </span>
              {order.paidAt ? (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
                  Pagato: <b className="text-neutral-800">{new Date(order.paidAt).toLocaleString("it-IT")}</b>
                </span>
              ) : null}
              <span className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-neutral-400" />
                Metodo: <b className="text-neutral-800">{order.paymentMethod ?? "—"}</b>
              </span>
            </div>
          }
          actions={
            <div className="flex items-center gap-2 print-hidden">
              <PrintButton orderId={order.id} />
              <ShipToggleButton orderId={order.id} shipped={!!order.shippedAt} status={order.status} />
            </div>
          }
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content (Left Column - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Order Stepper */}
          <OrderStatusActions
            orderId={order.id}
            status={order.status}
            totalCents={order.totalCents}
            refundCents={order.refundCents}
            stripePaymentIntentId={order.stripePaymentIntentId}
          />

          {/* Purchased Items Table */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
            <div className="border-b border-neutral-100 px-5 py-4 flex items-center justify-between bg-neutral-50/50">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-neutral-600" />
                Articoli acquistati ({order.items.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead className="bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-100">
                  <tr>
                    <th className="px-5 py-3 font-bold">Prodotto</th>
                    <th className="px-5 py-3 font-bold">Variante</th>
                    <th className="px-5 py-3 text-right font-bold">Prezzo Unitario</th>
                    <th className="px-5 py-3 text-right font-bold">Q.tà</th>
                    <th className="px-5 py-3 text-right font-bold">Totale Riga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {order.items.map((it: Item) => (
                    <tr key={it.id} className="hover:bg-neutral-50/60 transition duration-150">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-neutral-900 leading-tight">{it.title}</div>
                        <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                          PID: {it.productId.slice(0, 8)}… · VID: {it.variantId?.slice(0, 8) ?? "—"}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-neutral-600 font-medium">
                        {it.variantLabel ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right text-neutral-600 font-medium">
                        {euro(it.unitPriceCents)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-neutral-900 font-bold">
                        {it.qty}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-neutral-900">
                        {euro(it.lineTotalCents)}
                      </td>
                    </tr>
                  ))}

                  {order.items.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-neutral-500" colSpan={5}>
                        Nessun articolo associato a questo ordine.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Timeline Feed */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-neutral-600" />
                Storico Attività
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">Timeline operativa registrata.</p>
            </div>

            <div className="mt-6 relative pl-6 border-l-2 border-neutral-100 ml-3 space-y-6">
              {order.events.length ? (
                order.events.map((ev) => {
                  const when = new Date(ev.createdAt).toLocaleString("it-IT");
                  const transition =
                    ev.fromStatus || ev.toStatus ? `${ev.fromStatus ?? "—"} → ${ev.toStatus ?? "—"}` : null;

                  return (
                    <div key={ev.id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-neutral-200 bg-white group-hover:border-neutral-900 transition-colors" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                            {ev.type}
                          </span>
                          {transition ? (
                            <span className="text-xs font-semibold text-neutral-500 font-mono">
                              {transition}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-neutral-300" />
                          {when}
                          {ev.actor ? (
                            <>
                              {" "}· <span className="font-semibold text-neutral-500">{ev.actor}</span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {ev.message ? (
                        <div className="mt-2 text-sm text-neutral-800 bg-neutral-50/50 rounded-xl p-3 border border-neutral-100 font-medium leading-relaxed">
                          {ev.message}
                        </div>
                      ) : null}

                      {ev.metaJson ? (
                        <details className="mt-2 group/meta">
                          <summary className="cursor-pointer text-[10px] font-bold text-neutral-400 uppercase tracking-wider hover:text-neutral-600 select-none">
                            Dettagli Tecnici
                          </summary>
                          <pre className="mt-2 overflow-x-auto rounded-xl bg-neutral-900 p-3.5 text-xs text-neutral-200 font-mono">
                            {safePrettyJson(ev.metaJson)}
                          </pre>
                        </details>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-neutral-500 py-2">Nessun evento registrato per questo ordine.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Content (Right Column - 1/3) */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-neutral-600" />
              Dettagli Cliente
            </h3>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-neutral-400 uppercase font-semibold tracking-wider">Nome</div>
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                    <span className="truncate">{order.fullName}</span>
                    {order.countryCode ? (
                      <span title={order.countryCode} className="text-base select-none shrink-0" aria-label={`Bandiera nazione: ${order.countryCode}`}>
                        {getFlagEmoji(order.countryCode)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-neutral-400 uppercase font-semibold tracking-wider">Email</div>
                  <a
                    href={`mailto:${order.email}`}
                    className="font-semibold text-neutral-900 hover:text-neutral-700 hover:underline mt-0.5 block truncate"
                  >
                    {order.email}
                  </a>
                </div>
              </div>

              {order.phone ? (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-neutral-400 uppercase font-semibold tracking-wider">Telefono</div>
                    <a
                      href={`tel:${order.phone}`}
                      className="font-semibold text-neutral-900 hover:text-neutral-700 hover:underline mt-0.5 block"
                    >
                      {order.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="border-t border-neutral-100 pt-3 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-neutral-800">
                  <div className="text-xs text-neutral-400 uppercase font-semibold tracking-wider">Indirizzo di Spedizione</div>
                  <div className="font-semibold mt-1 leading-normal text-neutral-900">
                    <div>{order.address}</div>
                    <div>
                      {order.zip} {order.city}
                    </div>
                    {order.countryCode ? <div className="text-xs text-neutral-500 mt-0.5">{order.countryCode}</div> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket totals / Receipt summary */}
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-950 text-white p-5 shadow-lg relative overflow-hidden">
            {/* Aesthetic receipt top edge pattern */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-800 opacity-20 flex justify-between px-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-neutral-950 -mt-1" />
              ))}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3 mt-1 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-neutral-400" />
              Riepilogo Totale
            </h3>

            <div className="mt-4 space-y-2.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotale</span>
                <span className="font-semibold text-white">{euro(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA</span>
                <span className="font-semibold text-white">{euro(order.vatCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Spedizione</span>
                <span className="font-semibold text-white">{euro(order.shippingCents)}</span>
              </div>

              <div className="border-t border-neutral-800 my-3.5 pt-3.5 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Totale Ordine</span>
                <span className="text-lg font-extrabold text-emerald-400">{euro(order.totalCents)}</span>
              </div>

              {order.refundCents > 0 ? (
                <div className="flex justify-between text-red-400 border-t border-dashed border-neutral-800 pt-2 mt-2">
                  <span>Rimborsato</span>
                  <span className="font-bold">-{euro(order.refundCents)}</span>
                </div>
              ) : null}

              <div className="border-t border-neutral-800 pt-3 mt-4 text-[10px] text-neutral-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Metodo pagamento:</span>
                  <span className="font-bold text-white uppercase">{order.paymentMethod ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-bold text-white uppercase">{order.paymentProvider ?? "stripe"}</span>
                </div>
                {order.stripePaymentIntentId ? (
                  <div className="pt-1.5">
                    <span className="block text-neutral-500">Stripe Payment Intent:</span>
                    <span className="block font-mono text-neutral-300 select-all break-all mt-0.5">
                      {order.stripePaymentIntentId}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Internal Notes & Fraud prevention */}
          <OrderInternalControls
            orderId={order.id}
            notes={order.notes ?? ""}
            isFlagged={Boolean(order.isFlagged)}
            riskScore={Number(order.riskScore ?? 0)}
          />

          {/* Technical Details Audit Section */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm space-y-4">
            <details className="group/tech">
              <summary className="cursor-pointer list-none flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 select-none">
                <span className="flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5" />
                  Dettagli Sistema (Audit)
                </span>
                <span className="text-neutral-400 group-open/tech:rotate-180 transition-transform duration-200">▼</span>
              </summary>

              <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-700 space-y-2.5 leading-relaxed font-medium">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Order Number:</span>
                  <span className="font-bold">{order.orderNumber ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Public Token:</span>
                  <span className="font-mono text-neutral-600 truncate max-w-[120px]" title={order.orderPublicToken ?? "—"}>
                    {order.orderPublicToken ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Indirizzo IP:</span>
                  <span className="font-mono text-neutral-800">{order.ipAddress ?? "—"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">User Agent:</span>
                  <span className="font-mono text-neutral-600 block leading-tight text-[10px] break-all bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    {order.userAgent ?? "—"}
                  </span>
                </div>

                <div className="border-t border-neutral-100 pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">paidAt:</span>
                    <span>{order.paidAt ? new Date(order.paidAt).toLocaleString("it-IT") : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">preparingAt:</span>
                    <span>{preparedAt ? new Date(preparedAt).toLocaleString("it-IT") : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">shippedAt:</span>
                    <span>{order.shippedAt ? new Date(order.shippedAt).toLocaleString("it-IT") : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">deliveredAt:</span>
                    <span>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString("it-IT") : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">canceledAt:</span>
                    <span>{order.canceledAt ? new Date(order.canceledAt).toLocaleString("it-IT") : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">refundedAt:</span>
                    <span>{order.refundedAt ? new Date(order.refundedAt).toLocaleString("it-IT") : "—"}</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

function safePrettyJson(metaJson: string) {
  try {
    const obj = JSON.parse(metaJson);
    return JSON.stringify(obj, null, 2);
  } catch {
    return metaJson;
  }
}
