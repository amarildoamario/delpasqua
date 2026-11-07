"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Truck,
  Printer,
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Mail,
  Calendar,
  ListTodo,
  ExternalLink,
  Phone,
  MapPin,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Boxes,
  Send,
} from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";
import type { OrderStatus } from "@/generated/prisma/client";

// Types for serialization from Server Component
export type SerializedOrderItem = {
  id: string;
  sku: string;
  title: string;
  variantLabel: string;
  qty: number;
  unitPriceCents: number;
  lineTotalCents: number;
  imageUrl?: string | null;
};

export type SerializedOrder = {
  id: string;
  orderNumber: string | null;
  status: OrderStatus;
  fullName: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  zip: string;
  province: string;
  countryCode: string;
  shippingNotes: string | null;
  totalCents: number;
  subtotalCents: number;
  paidAt: string | null;
  createdAt: string;
  items: SerializedOrderItem[];
};

export type LowStockItem = {
  sku: string;
  productTitle: string;
  variantLabel: string;
  category?: string;
  stock: number;
  updatedAt: string;
};

export type SerializedMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type SerializedTasting = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  slotStart: string;
  slotEnd: string;
  tastingType: string;
  people: number;
  children: number;
  fullName: string;
  email: string;
  phone: string;
  notes: string | null;
};

type Props = {
  initialOrders: SerializedOrder[];
  initialLowStock: LowStockItem[];
  initialMessages: SerializedMessage[];
  initialTastings: SerializedTasting[];
  shippedTodayCount: number;
  pendingOldCount: number;
  attentionOrdersCount: number;
};

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function timeAgo(dateString: string | null) {
  if (!dateString) return "-";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 2) return "Adesso";
  if (diffMins < 60) return `${diffMins}m fa`;
  if (diffHours < 24) return `${diffHours}h fa`;
  if (diffDays === 1) return "Ieri";
  return `${diffDays}g fa`;
}

function fmtDateTime(dStr: string) {
  const d = new Date(dStr);
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

const DEFAULT_CHECKLIST = [
  { id: "1", text: "Stampa bolle e fogli di prelievo ordini", done: false },
  { id: "2", text: "Preparazione e imballaggio bottiglie/latte EVO", done: false },
  { id: "3", text: "Applicazione etichette e lettere di vettura corriere", done: false },
  { id: "4", text: "Controllo scorte magazzino e livelli cisterne", done: false },
  { id: "5", text: "Ritiro spedizioni con il corriere (GLS / BRT)", done: false },
  { id: "6", text: "Riscontro e risposta ai messaggi/email dei clienti", done: false },
];

export default function OperationsCockpit({
  initialOrders,
  initialLowStock,
  initialMessages,
  initialTastings,
  shippedTodayCount,
  pendingOldCount,
  attentionOrdersCount,
}: Props) {
  const router = useRouter();

  // Local state for optimistic updates
  const [orders, setOrders] = useState<SerializedOrder[]>(initialOrders);
  const [lowStock, setLowStock] = useState<LowStockItem[]>(initialLowStock);
  const [messages, setMessages] = useState<SerializedMessage[]>(initialMessages);
  const [tastings, setTastings] = useState<SerializedTasting[]>(initialTastings);

  // Sync state if props change from router.refresh()
  useEffect(() => setOrders(initialOrders), [initialOrders]);
  useEffect(() => setLowStock(initialLowStock), [initialLowStock]);
  useEffect(() => setMessages(initialMessages), [initialMessages]);
  useEffect(() => setTastings(initialTastings), [initialTastings]);

  // Tab filter
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "stock" | "messages" | "tastings" | "checklist">("all");

  const [loadingOrders, setLoadingOrders] = useState<Record<string, boolean>>({});
  const [loadingStock, setLoadingStock] = useState<Record<string, boolean>>({});
  const [loadingMessages, setLoadingMessages] = useState<Record<string, boolean>>({});
  const [loadingTastings, setLoadingTastings] = useState<Record<string, boolean>>({});
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});

  // Expanded cards
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Operational checklist in localStorage
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newChecklistTask, setNewChecklistTask] = useState("");

  useEffect(() => {
    try {
      const todayKey = `delpasqua_ops_checklist_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        setChecklist(JSON.parse(saved));
      } else {
        setChecklist(DEFAULT_CHECKLIST);
      }
    } catch {
      setChecklist(DEFAULT_CHECKLIST);
    }
  }, []);

  const saveChecklist = (items: { id: string; text: string; done: boolean }[]) => {
    setChecklist(items);
    try {
      const todayKey = `delpasqua_ops_checklist_${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const toggleChecklistItem = (id: string) => {
    const next = checklist.map((it) => (it.id === id ? { ...it, done: !it.done } : it));
    saveChecklist(next);
  };

  const addCustomChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTask.trim()) return;
    const next = [...checklist, { id: String(Date.now()), text: newChecklistTask.trim(), done: false }];
    saveChecklist(next);
    setNewChecklistTask("");
  };

  const resetChecklist = () => {
    saveChecklist(DEFAULT_CHECKLIST);
  };

  // Counts & stats
  const toPrepareCount = useMemo(() => orders.filter((o) => o.status === "PAGATO").length, [orders]);
  const preparingCount = useMemo(() => orders.filter((o) => o.status === "IN_PREPARAZIONE").length, [orders]);
  const urgentOrdersCount = useMemo(() => {
    const cutoff48h = Date.now() - 48 * 3600 * 1000;
    return orders.filter((o) => o.paidAt && new Date(o.paidAt).getTime() < cutoff48h).length;
  }, [orders]);

  const totalUrgentTasks =
    orders.length + lowStock.length + messages.length + tastings.filter((t) => t.status === "PENDING").length;

  // Actions: Order Preparation
  async function setOrderPreparing(orderId: string) {
    if (loadingOrders[orderId]) return;
    setLoadingOrders((prev) => ({ ...prev, [orderId]: true }));
    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "IN_PREPARAZIONE" }),
      });

      if (r.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "IN_PREPARAZIONE" as OrderStatus } : o))
        );
      }
      router.refresh();
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  // Actions: Order Ship (Direct one-click fulfillment)
  async function shipOrder(orderId: string) {
    if (loadingOrders[orderId]) return;
    setLoadingOrders((prev) => ({ ...prev, [orderId]: true }));

    try {
      const r = await adminFetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ shipped: true }),
      });

      if (r.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
      router.refresh();
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  // Actions: Stock Adjust
  async function adjustStock(sku: string, delta: number) {
    if (loadingStock[sku]) return;
    setLoadingStock((prev) => ({ ...prev, [sku]: true }));
    try {
      const r = await adminFetch(`/api/admin/inventory`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "adjust", sku, delta }),
      });

      if (r.ok) {
        setLowStock((prev) =>
          prev
            .map((it) => (it.sku === sku ? { ...it, stock: Math.max(0, it.stock + delta) } : it))
            .filter((it) => it.stock <= 5)
        );
      }
      router.refresh();
    } finally {
      setLoadingStock((prev) => ({ ...prev, [sku]: false }));
    }
  }

  // Actions: Set Custom Stock
  async function setCustomStock(sku: string) {
    const val = stockInputs[sku];
    if (typeof val !== "number" || val < 0 || loadingStock[sku]) return;
    setLoadingStock((prev) => ({ ...prev, [sku]: true }));
    try {
      const r = await adminFetch(`/api/admin/inventory`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "set", sku, stock: val }),
      });

      if (r.ok) {
        setLowStock((prev) =>
          prev
            .map((it) => (it.sku === sku ? { ...it, stock: val } : it))
            .filter((it) => it.stock <= 5)
        );
      }
      router.refresh();
    } finally {
      setLoadingStock((prev) => ({ ...prev, [sku]: false }));
    }
  }

  // Actions: Mark Message as Read
  async function markMessageRead(messageId: string) {
    if (loadingMessages[messageId]) return;
    setLoadingMessages((prev) => ({ ...prev, [messageId]: true }));
    try {
      const r = await adminFetch(`/api/admin/contact-messages/${messageId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });

      if (r.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
      router.refresh();
    } finally {
      setLoadingMessages((prev) => ({ ...prev, [messageId]: false }));
    }
  }

  // Actions: Tasting Confirmation
  async function updateTastingStatus(id: string, nextStatus: "CONFIRMED" | "CANCELED") {
    if (loadingTastings[id]) return;
    setLoadingTastings((prev) => ({ ...prev, [id]: true }));
    try {
      const r = await adminFetch(`/api/admin/tastings/status`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });

      if (r.ok) {
        setTastings((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
        );
      }
      router.refresh();
    } finally {
      setLoadingTastings((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Balanced Ticker Strip (Bright White Cards + Colored Icon Accents) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Card 1: Da Evadere */}
        <div
          onClick={() => setActiveTab("orders")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all bg-white shadow-xs hover:border-neutral-300 ${
            activeTab === "orders" ? "ring-2 ring-neutral-900 border-neutral-900" : "border-neutral-200/90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Da Evadere
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900">{orders.length}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <span>{toPrepareCount} da prep.</span>
            <span>·</span>
            <span>{preparingCount} in lav.</span>
            {urgentOrdersCount > 0 && (
              <span className="rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px] font-bold">
                {urgentOrdersCount} &gt;48h
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Scorte Critiche */}
        <div
          onClick={() => setActiveTab("stock")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all bg-white shadow-xs hover:border-neutral-300 ${
            activeTab === "stock" ? "ring-2 ring-neutral-900 border-neutral-900" : "border-neutral-200/90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Allerte Scorte
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900">{lowStock.length}</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">
            {lowStock.filter((s) => s.stock === 0).length > 0 ? (
              <span className="font-bold text-rose-600">
                {lowStock.filter((s) => s.stock === 0).length} esauriti (0 pz)
              </span>
            ) : (
              "Sotto soglia (<= 5 pz)"
            )}
          </div>
        </div>

        {/* Card 3: Messaggi & Richieste */}
        <div
          onClick={() => setActiveTab("messages")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all bg-white shadow-xs hover:border-neutral-300 ${
            activeTab === "messages" ? "ring-2 ring-neutral-900 border-neutral-900" : "border-neutral-200/90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Messaggi Inbox
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900">{messages.length}</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">
            {messages.length === 1 ? "1 non letto" : `${messages.length} non letti`}
          </div>
        </div>

        {/* Card 4: Evasi Oggi / Degustazioni */}
        <div
          onClick={() => setActiveTab("tastings")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all bg-white shadow-xs hover:border-neutral-300 ${
            activeTab === "tastings" ? "ring-2 ring-neutral-900 border-neutral-900" : "border-neutral-200/90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Degustazioni
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900">{tastings.length}</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">
            <span>{shippedTodayCount} evasi oggi</span>
          </div>
        </div>
      </div>

      {/* Action Filters Bar with Colored Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "all"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
            }`}
          >
            <span>Tutto Subito</span>
            {totalUrgentTasks > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "all" ? "bg-neutral-700 text-white" : "bg-neutral-300 text-neutral-800"
                }`}
              >
                {totalUrgentTasks}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "orders"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
            }`}
          >
            <Package className="h-3.5 w-3.5 text-sky-500" />
            <span>Ordini da Evadere</span>
            {orders.length > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "orders" ? "bg-neutral-700 text-white" : "bg-sky-100 text-sky-800 font-bold"
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stock")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "stock"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
            }`}
          >
            <Boxes className="h-3.5 w-3.5 text-amber-500" />
            <span>Scorte Critiche</span>
            {lowStock.length > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "stock" ? "bg-neutral-700 text-white" : "bg-amber-100 text-amber-900 font-bold"
                }`}
              >
                {lowStock.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "messages"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
            }`}
          >
            <Mail className="h-3.5 w-3.5 text-indigo-500" />
            <span>Messaggi</span>
            {messages.length > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "messages" ? "bg-neutral-700 text-white" : "bg-indigo-100 text-indigo-800 font-bold"
                }`}
              >
                {messages.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tastings")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "tastings"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
            <span>Degustazioni</span>
            {tastings.length > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "tastings" ? "bg-neutral-700 text-white" : "bg-emerald-100 text-emerald-800 font-bold"
                }`}
              >
                {tastings.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "checklist"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
            }`}
          >
            <ListTodo className="h-3.5 w-3.5 text-neutral-600" />
            <span>Checklist Turno</span>
          </button>
        </div>

        {/* Global Batch Print & Refresh */}
        <div className="flex items-center gap-2">
          {orders.length > 0 && (
            <a
              href="/api/admin/print-todo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-900 shadow-xs hover:bg-neutral-50 transition"
              title="Stampa fogli di prelievo consolidati per tutti gli ordini pronti"
            >
              <Printer className="h-3.5 w-3.5 text-neutral-600" />
              <span>Stampa Tutti ({orders.length})</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
            title="Aggiorna dati in tempo reale"
          >
            <RefreshCw className="h-3.5 w-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Aggiorna</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: ORDERS FULFILLMENT QUEUE                      */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "orders") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                <Package className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Ordini da Preparare & Spedire ({orders.length})
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
            >
              Tutti gli ordini <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {(pendingOldCount > 0 || attentionOrdersCount > 0) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <strong>Controlli consigliati</strong>
                  <div className="mt-0.5 text-amber-800">
                    {pendingOldCount > 0 ? `${pendingOldCount} in attesa di pagamento da oltre 48 ore` : null}
                    {pendingOldCount > 0 && attentionOrdersCount > 0 ? " · " : null}
                    {attentionOrdersCount > 0 ? `${attentionOrdersCount} con stato o dati da verificare` : null}
                  </div>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="font-bold text-amber-900 underline hover:text-amber-950 shrink-0 text-xs"
              >
                Apri controlli &rarr;
              </Link>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-10 text-center shadow-xs">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <h3 className="mt-2 text-sm font-bold text-neutral-900">Nessun ordine da eseguire</h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                Qui compariranno gli ordini pagati; quelli avviati resteranno visibili fino alla spedizione.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => {
                const isPreparing = order.status === "IN_PREPARAZIONE";
                const isPaid = order.status === "PAGATO";
                const isUrgent = order.paidAt && Date.now() - new Date(order.paidAt).getTime() > 48 * 3600 * 1000;
                const isExpanded = expandedOrders[order.id] ?? true;
                const loading = loadingOrders[order.id] ?? false;

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs transition hover:border-neutral-300"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-mono text-sm font-extrabold text-neutral-900 hover:underline"
                          >
                            {order.orderNumber || `#${order.id.slice(0, 8)}`}
                          </Link>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isPreparing
                                ? "bg-sky-50 text-sky-700 border border-sky-200/80"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                            }`}
                          >
                            {isPreparing ? "In Preparazione" : "Pagato"}
                          </span>

                          {/* Delay indicator */}
                          {isUrgent && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200/80">
                              <AlertCircle className="h-3 w-3 text-amber-600" />
                              &gt;48h
                            </span>
                          )}

                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-500 font-medium" title={order.paidAt || order.createdAt}>
                            {timeAgo(order.paidAt || order.createdAt)}
                          </span>
                        </div>

                        {/* Customer & Location Line */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                          <span className="font-bold text-neutral-900">{order.fullName}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 text-neutral-500">
                            <MapPin className="h-3 w-3 text-neutral-400" />
                            {order.city ? `${order.city} (${order.province || order.countryCode})` : order.address}
                          </span>
                          <span>·</span>
                          <span className="font-extrabold text-neutral-900">{euro(order.totalCents)}</span>
                        </div>
                      </div>

                      {/* Right Direct Action Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isPaid && (
                          <button
                            type="button"
                            onClick={() => setOrderPreparing(order.id)}
                            disabled={loading}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition disabled:opacity-50"
                          >
                            {loading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Package className="h-3.5 w-3.5" />
                            )}
                            <span>Inizia Preparazione</span>
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            type="button"
                            onClick={() => shipOrder(order.id)}
                            disabled={loading}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition disabled:opacity-50"
                          >
                            {loading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Truck className="h-3.5 w-3.5" />
                            )}
                            <span>Segna come Spedito</span>
                          </button>
                        )}

                        <a
                          href={`/api/admin/print-todo?id=${order.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 shadow-xs transition"
                          title="Stampa foglio d'ordine"
                        >
                          <Printer className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Stampa</span>
                        </a>

                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                        >
                          <span>Dettagli</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedOrders((prev) => ({ ...prev, [order.id]: !isExpanded }))
                          }
                          className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Items Grid & Customer Note */}
                    {isExpanded && (
                      <div className="mt-3 border-t border-neutral-100 pt-3 space-y-2.5">
                        {order.shippingNotes && (
                          <div className="text-xs text-neutral-600">
                            <strong className="text-neutral-900">Nota consegna del cliente:</strong>{" "}
                            <span>{order.shippingNotes}</span>
                          </div>
                        )}

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-2.5 text-xs"
                            >
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-black text-white">
                                {item.qty}x
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-neutral-900 truncate" title={item.title}>
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-neutral-500 truncate">
                                  {item.variantLabel || item.sku}
                                </div>
                              </div>
                              <div className="text-right text-[11px] font-bold text-neutral-700 shrink-0">
                                {euro(item.lineTotalCents)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: LOW STOCK RADAR & INSTANT RESTOCK             */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "stock") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Boxes className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Allerte Scorte Magazzino ({lowStock.length})
              </h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
            >
              Gestione magazzino <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-8 text-center shadow-xs">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              <h3 className="mt-2 text-sm font-bold text-neutral-900">Scorte a livelli ottimali</h3>
              <p className="mt-1 text-xs text-neutral-500">Nessun prodotto esaurito o sotto scorta (&lt;= 5 pz).</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lowStock.map((item) => {
                const isOutOfStock = item.stock === 0;
                const loading = loadingStock[item.sku] ?? false;

                return (
                  <div
                    key={item.sku}
                    className={`rounded-2xl border bg-white p-4 shadow-xs flex flex-col justify-between ${
                      isOutOfStock ? "border-rose-200" : "border-amber-200/80"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isOutOfStock
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isOutOfStock ? "🚨 Esaurito (0 pz)" : `⚠️ Scorta: ${item.stock} pz`}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400 truncate">{item.sku}</span>
                      </div>

                      <div className="mt-2 font-bold text-neutral-900 text-sm">{item.productTitle}</div>
                      <div className="text-xs text-neutral-500">{item.variantLabel}</div>
                    </div>

                    {/* Quick Restock Actions */}
                    <div className="mt-4 border-t border-neutral-100 pt-3 space-y-2">
                      <div className="text-[11px] font-semibold text-neutral-500">Reintegro rapido:</div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustStock(item.sku, 10)}
                          disabled={loading}
                          className="rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition disabled:opacity-50"
                        >
                          +10 pz
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustStock(item.sku, 50)}
                          disabled={loading}
                          className="rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition disabled:opacity-50"
                        >
                          +50 pz
                        </button>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            placeholder="Set"
                            value={stockInputs[item.sku] ?? ""}
                            onChange={(e) =>
                              setStockInputs((prev) => ({
                                ...prev,
                                [item.sku]: parseInt(e.target.value, 10) || 0,
                              }))
                            }
                            className="w-14 rounded-xl border border-neutral-200 px-2 py-1 text-xs text-center font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => setCustomStock(item.sku)}
                            disabled={loading || typeof stockInputs[item.sku] !== "number"}
                            className="rounded-xl bg-neutral-900 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition disabled:opacity-50"
                          >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Salva"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: UNREAD CONTACT MESSAGES                       */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "messages") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Richieste Clienti in Sospeso ({messages.length})
              </h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
            >
              Tutti i messaggi <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-8 text-center shadow-xs">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              <h3 className="mt-2 text-sm font-bold text-neutral-900">Nessun messaggio in sospeso</h3>
              <p className="mt-1 text-xs text-neutral-500">Tutti i messaggi sono stati letti.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {messages.map((msg) => {
                const loading = loadingMessages[msg.id] ?? false;

                return (
                  <div
                    key={msg.id}
                    className="rounded-2xl border border-indigo-200/70 bg-white p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200/80">
                          Non Letto
                        </span>
                        <span className="text-[11px] text-neutral-400">{timeAgo(msg.createdAt)}</span>
                      </div>

                      <div className="mt-2 font-bold text-neutral-900 text-sm">{msg.subject}</div>
                      <div className="text-xs text-neutral-500">
                        Da: <strong className="text-neutral-800">{msg.name}</strong> ({msg.email})
                      </div>
                      <p className="mt-2 text-xs text-neutral-700 line-clamp-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                        {msg.message}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent("Re: " + msg.subject)}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
                      >
                        <Send className="h-3 w-3" />
                        <span>Rispondi via Mail</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => markMessageRead(msg.id)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3 text-emerald-600" />
                        )}
                        <span>Segna Letto</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: UPCOMING TASTINGS / BOOKINGS                  */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "tastings") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Degustazioni & Visite in Frantoio ({tastings.length})
              </h2>
            </div>
            <Link
              href="/admin/degustazioni"
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
            >
              Tutte le prenotazioni <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {tastings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-8 text-center shadow-xs">
              <Calendar className="h-7 w-7 text-neutral-400" />
              <h3 className="mt-2 text-sm font-bold text-neutral-900">Nessun appuntamento in programma</h3>
              <p className="mt-1 text-xs text-neutral-500">Nessuna degustazione imminente nei prossimi giorni.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {tastings.map((tasting) => {
                const isPending = tasting.status === "PENDING";
                const loading = loadingTastings[tasting.id] ?? false;

                return (
                  <div
                    key={tasting.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isPending
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {isPending ? "⏳ In Attesa" : "✅ Confermato"}
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                          {fmtDateTime(tasting.slotStart)}
                        </span>
                      </div>

                      <div className="mt-2 font-bold text-neutral-900 text-sm">{tasting.tastingType}</div>
                      <div className="text-xs text-neutral-600 mt-0.5">
                        Cliente: <strong>{tasting.fullName}</strong> · {tasting.people} adulti
                        {tasting.children > 0 && ` + ${tasting.children} bambini`}
                      </div>

                      {tasting.notes && (
                        <div className="mt-2 text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                          <strong>Note:</strong> {tasting.notes}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between border-t border-neutral-100 pt-3 gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${tasting.phone}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                        >
                          <Phone className="h-3 w-3 text-neutral-500" />
                          <span>{tasting.phone}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => updateTastingStatus(tasting.id, "CONFIRMED")}
                            disabled={loading}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                            <span>Conferma</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => updateTastingStatus(tasting.id, "CANCELED")}
                          disabled={loading}
                          className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                        >
                          Annulla
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: DAILY OPERATIONAL CHECKLIST                   */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "checklist") && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <ListTodo className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">Checklist Operativa di Turno</h2>
                <p className="text-xs text-neutral-500">
                  Progresso: {checklist.filter((i) => i.done).length} di {checklist.length} mansioni completate
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetChecklist}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-700"
            >
              Reimposta
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${
                  checklist.length > 0
                    ? Math.round((checklist.filter((i) => i.done).length / checklist.length) * 100)
                    : 0
                }%`,
              }}
            />
          </div>

          <div className="space-y-2">
            {checklist.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs transition ${
                  item.done
                    ? "border-emerald-200 bg-emerald-50/40 text-neutral-400 line-through"
                    : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="h-4 w-4 rounded-md border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold">{item.text}</span>
              </label>
            ))}
          </div>

          {/* Add custom item */}
          <form onSubmit={addCustomChecklistItem} className="flex gap-2 pt-2 border-t border-neutral-100">
            <input
              type="text"
              value={newChecklistTask}
              onChange={(e) => setNewChecklistTask(e.target.value)}
              placeholder="Aggiungi una nota / mansione per oggi..."
              className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Aggiungi</span>
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
