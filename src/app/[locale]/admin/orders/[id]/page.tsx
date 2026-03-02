import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/server/prisma";
import ShipToggleButton from "@/app/[locale]/admin/orders/ship/ShipToggleButton";
import OrderStatusActions from "@/app/[locale]/admin/orders/[id]/OrderStatusActions";
import PrintButton from "./PrintButton";
import type * as Prisma from "@/generated/prisma/client";
import PageHeader from "../../_components/PageHeader";

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
  order.events.find((e) => e.toStatus === "PREPARING")?.createdAt ??
  null;

  return (
    <div className="space-y-4 print-area">
      {/* ✅ NO styled-jsx: style normale */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print-hidden { display: none !important; }
          .print-area { padding: 0 !important; margin: 0 !important; }
          a[href]:after { content: "" !important; }
        }
      `}</style>

      {/* Header */}
     <PageHeader
  title={`Ordine ${order.orderNumber ?? order.id}`}
  subtitle={
    <div className="space-y-1">
      <div className="text-xs text-neutral-500 print-hidden">
        <Link href="/admin/orders" className="hover:underline">
          ← Torna agli ordini
        </Link>
        <span className="ml-2">·</span>
        <span className="ml-2">id: {order.id}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-neutral-700">
        <span>
          Creato: <b>{new Date(order.createdAt).toLocaleString("it-IT")}</b>
        </span>
        {order.paidAt ? (
          <span>
            • Pagato: <b>{new Date(order.paidAt).toLocaleString("it-IT")}</b>
          </span>
        ) : null}
        <span>
          • Stato: <b>{order.status}</b>
        </span>
        <span>
          • Pagamento: <b>{order.paymentMethod ?? "—"}</b>
        </span>
      </div>
    </div>
  }
  actions={
    <div className="flex items-center gap-2 print-hidden">
      <PrintButton />
      <ShipToggleButton orderId={order.id} shipped={!!order.shippedAt} status={order.status} />
    </div>
  }
/>


      {/* Cards */}
      <div className="grid gap-3 lg:grid-cols-3">
        {/* Cliente */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500">Cliente</div>
          <div className="mt-2 text-sm text-neutral-900">
            <div className="font-semibold">{order.fullName}</div>
            <div className="text-neutral-600">{order.email}</div>

            <div className="mt-3 text-neutral-700">
            <div className="font-semibold">Spedizione</div>
            <div>{order.address}</div>
            <div>
              {order.zip} {order.city}
            </div>

            {order.phone ? (
              <div className="mt-1">
                <span className="font-semibold">Telefono: </span>
                <span>{order.phone}</span>
              </div>
            ) : null}
          </div>
          </div>
        </div>

        {/* Totali */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500">Totali</div>
          <div className="mt-3 space-y-1 text-sm text-neutral-800">
            <Row label="Subtotale" value={euro(order.subtotalCents)} />
            <Row label="IVA" value={euro(order.vatCents)} />
            <Row label="Spedizione" value={euro(order.shippingCents)} />
            <div className="my-2 border-t border-neutral-200" />
            <Row label="Totale" value={euro(order.totalCents)} strong />
          </div>
        </div>

        {/* Spedizione */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500">Spedizione</div>
          <div className="mt-2 text-sm text-neutral-800">
            <div>
              Spedito: <b>{order.shippedAt ? `Sì (${new Date(order.shippedAt).toLocaleString("it-IT")})` : "No"}</b>
            </div>
            
          </div>

          {order.status !== "PREPARING" ? (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Nota: puoi segnare “spedito” solo se lo stato è <b>PREPARING</b>.
            </div>
          ) : null}
        </div>
      </div>

      {/* Azioni + Audit */}
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="text-xs font-semibold text-neutral-500">Azioni ordine</div>
          <div className="mt-3">
            <OrderStatusActions
              orderId={order.id}
              status={order.status}
              isFlagged={order.isFlagged}
              riskScore={order.riskScore}
              notes={order.notes}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500">Audit & Timeline</div>
          <div className="mt-3 space-y-2 text-sm text-neutral-800">
            <div>Numero ordine: <b>{order.orderNumber ?? "—"}</b></div>
            <div className="break-all">Public token: <b>{order.orderPublicToken ?? "—"}</b></div>
            <div>Provider: <b>{order.paymentProvider ?? "stripe"}</b></div>

            <div className="pt-2 border-t border-neutral-200" />

            <div>paidAt: <b>{order.paidAt ? new Date(order.paidAt).toLocaleString("it-IT") : "—"}</b></div>
            <div>preparingAt: <b>{preparedAt ? new Date(preparedAt).toLocaleString("it-IT") : "—"}</b></div>
            <div>shippedAt: <b>{order.shippedAt ? new Date(order.shippedAt).toLocaleString("it-IT") : "—"}</b></div>
            <div>deliveredAt: <b>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString("it-IT") : "—"}</b></div>
            <div>canceledAt: <b>{order.canceledAt ? new Date(order.canceledAt).toLocaleString("it-IT") : "—"}</b></div>
            <div>refundedAt: <b>{order.refundedAt ? new Date(order.refundedAt).toLocaleString("it-IT") : "—"}</b></div>

            <div className="pt-2 border-t border-neutral-200" />

            <div>ip: <b>{order.ipAddress ?? "—"}</b></div>
            <div className="break-all">ua: <b>{order.userAgent ?? "—"}</b></div>
            <div>risk: <b>{order.riskScore}</b> • flagged: <b>{order.isFlagged ? "Sì" : "No"}</b></div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900">
          Articoli ({order.items.length})
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-600">
            <tr>
              <th className="px-4 py-3">Prodotto</th>
              <th className="px-4 py-3">Variante</th>
              <th className="px-4 py-3 text-right">Prezzo</th>
              <th className="px-4 py-3 text-right">Q.tà</th>
              <th className="px-4 py-3 text-right">Totale riga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {order.items.map((it: Item) => (
              <tr key={it.id}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-neutral-900">{it.title}</div>
                  <div className="text-xs text-neutral-500">
                    productId: {it.productId} • variantId: {it.variantId}
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-700">{it.variantLabel}</td>
                <td className="px-4 py-3 text-right text-neutral-700">{euro(it.unitPriceCents)}</td>
                <td className="px-4 py-3 text-right text-neutral-700">{it.qty}</td>
                <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                  {euro(it.lineTotalCents)}
                </td>
              </tr>
            ))}

            {order.items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-600" colSpan={5}>
                  Nessun item associato a questo ordine.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

     {/* Storico azioni */}
<div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
  <div className="flex items-center justify-between gap-3">
    <div>
      <div className="text-sm font-semibold text-neutral-900">Storico azioni</div>
      <div className="mt-1 text-xs text-neutral-500">
        Timeline operativa (stampabile). Mostra cosa è successo, quando e da chi.
      </div>
    </div>
  </div>

  <div className="mt-4 space-y-3">
    {order.events.length ? (
      order.events.map((ev) => {
        const when = new Date(ev.createdAt).toLocaleString("it-IT");
        const transition =
          ev.fromStatus || ev.toStatus ? `${ev.fromStatus ?? "—"} → ${ev.toStatus ?? "—"}` : null;

        return (
          <div
            key={ev.id}
            className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                  {ev.type}
                </span>
                {transition ? (
                  <span className="text-xs font-semibold text-neutral-600">{transition}</span>
                ) : null}
              </div>

              <div className="text-xs text-neutral-500">
                {when}
                {ev.actor ? (
                  <>
                    {" "}• <span className="font-semibold">{ev.actor}</span>
                  </>
                ) : null}
              </div>
            </div>

            {ev.message ? (
              <div className="mt-2 text-sm text-neutral-900">
                {ev.message}
              </div>
            ) : (
              <div className="mt-2 text-sm text-neutral-500">—</div>
            )}

            {/* Meta (se presente) in modo non invadente */}
            {ev.metaJson ? (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-neutral-600">
                  Dettagli tecnici
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-neutral-50 p-3 text-xs text-neutral-800">
              {safePrettyJson(ev.metaJson)}
                </pre>
              </details>
            ) : null}
          </div>
        );
      })
    ) : (
      <div className="text-sm text-neutral-500">Nessun evento registrato.</div>
    )}
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


function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-600">{label}</span>
      <span className={strong ? "font-bold text-neutral-900" : "text-neutral-900"}>
        {value}
      </span>
    </div>
  );
}
