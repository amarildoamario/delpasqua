"use client";

import { useState, useMemo } from "react";
import {
  AtSign,
  Clock,
  ExternalLink,
  Inbox,
  Search,
  Mail,
  MailCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Reply,
  Copy,
  Check,
  Phone,
  Sparkles,
  LayoutList,
  LayoutGrid,
  MailOpen,
  Archive,
  RotateCcw,
  X,
  ChevronRight,
  Send,
} from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";
import type { ContactMessageStatus, ContactNotificationStatus } from "@/generated/prisma";

/* =========================
   TYPES
========================= */

export type SerializedContactMessage = {
  id: string;
  status: ContactMessageStatus;
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  sourcePath: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  notificationStatus: ContactNotificationStatus;
  notificationSentAt: string | null;
  notificationError: string | null;
  readAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/* =========================
   TEMPLATE RISPOSTE RAPIDE
========================= */

const QUICK_REPLY_TEMPLATES = [
  {
    id: "thanks",
    title: "Ringraziamento Standard",
    subject: "Grazie per aver contattato Del Pasqua",
    body: (name: string) =>
      `Gentile ${name},\n\nGrazie per averci contattato. Abbiamo ricevuto la sua richiesta e siamo a completa disposizione per qualsiasi informazione sui nostri oli extravergine di oliva e sulla nostra produzione.\n\nCordiali saluti,\nFamiglia Del Pasqua\nhttps://delpasqua.it`,
  },
  {
    id: "quote",
    title: "Info Disponibilità & Formati",
    subject: "Informazioni formati e disponibilità olio EVO",
    body: (name: string) =>
      `Gentile ${name},\n\nIn merito alla sua richiesta, le confermiamo la disponibilità dei nostri formati di olio extravergine di oliva (bottiglie da 500ml e 750ml, latte da 3L e 5L).\n\nPuò visualizzare tutti i dettagli e i formati disponibili direttamente sul nostro sito web: https://delpasqua.it/shop\n\nRestiamo a disposizione per ordini personalizzati o maggiori informazioni.\n\nUn cordiale saluto,\nFrantoio Del Pasqua`,
  },
  {
    id: "shipping",
    title: "Tempi & Costi di Spedizione",
    subject: "Info su spedizioni e consegne - Del Pasqua",
    body: (name: string) =>
      `Gentile ${name},\n\nLa informiamo che le nostre spedizioni vengono effettuate tramite corriere espresso con consegna in tutta Italia entro 2-3 giorni lavorativi. L'imballaggio è appositamente studiato per proteggere le bottiglie in vetro.\n\nLa spedizione è gratuita per ordini superiori a 50€.\n\nNon esiti a ricontattarci per ulteriori chiarimenti.\n\nCordiali saluti,\nServizio Clienti Del Pasqua`,
  },
];

/* =========================
   HELPERS
========================= */

function fmtDateTime(isoStr: string) {
  const d = new Date(isoStr);
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function timeAgo(isoStr: string) {
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Adesso";
  if (diffMin < 60) return `${diffMin}m fa`;
  if (diffHours < 24) return `${diffHours}h fa`;
  if (diffDays === 1) return "Ieri";
  if (diffDays < 7) return `${diffDays}gg fa`;
  return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short" }).format(d);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const value = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}` || "?";
  return value.toUpperCase();
}

function compactSource(sourcePath: string | null) {
  if (!sourcePath) return null;
  try {
    const url = new URL(sourcePath);
    return `${url.hostname}${url.pathname}`;
  } catch {
    return sourcePath;
  }
}

// Estrazione numero di telefono eventuale dal testo
function detectPhoneNumber(text: string): string | null {
  const match = text.match(/(?:\+39|0039)?[\s.-]?(?:3\d{2}|0\d{1,3})[\s.-]?\d{3}[\s.-]?\d{3,4}/);
  return match ? match[0].replace(/\s+/g, "") : null;
}

// Riconoscimento tematica / tag intelligente
function detectTopicTag(text: string, subject: string): { label: string; tone: string } | null {
  const combined = `${subject} ${text}`.toLowerCase();
  if (combined.includes("preventivo") || combined.includes("prezzo") || combined.includes("costo") || combined.includes("quantità")) {
    return { label: "Preventivo / Ordine", tone: "bg-blue-50 text-blue-700 border-blue-200/80" };
  }
  if (combined.includes("spedizione") || combined.includes("consegna") || combined.includes("tracking") || combined.includes("corriere")) {
    return { label: "Spedizioni & Consegna", tone: "bg-amber-50 text-amber-800 border-amber-200/80" };
  }
  if (combined.includes("olio") || combined.includes("evo") || combined.includes("latta") || combined.includes("bottiglia") || combined.includes("raccolta")) {
    return { label: "Prodotti & Formati", tone: "bg-emerald-50 text-emerald-800 border-emerald-200/80" };
  }
  if (combined.includes("degustazione") || combined.includes("visita") || combined.includes("frantoio")) {
    return { label: "Visite & Degustazioni", tone: "bg-purple-50 text-purple-800 border-purple-200/80" };
  }
  return null;
}

/* =========================
   COMPONENTE PRINCIPALE
========================= */

export default function MessagesManager({
  initialMessages,
}: {
  initialMessages: SerializedContactMessage[];
}) {
  const [messages, setMessages] = useState<SerializedContactMessage[]>(initialMessages);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ContactMessageStatus>("ALL");
  const [viewMode, setViewMode] = useState<"expanded" | "compact">("expanded");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // Copia feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modale Risposta Rapida
  const [replyModalMessage, setReplyModalMessage] = useState<SerializedContactMessage | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("thanks");
  const [customReplySubject, setCustomReplySubject] = useState("");
  const [customReplyBody, setCustomReplyBody] = useState("");

  // Calcolo statistiche
  const stats = useMemo(() => {
    let unread = 0;
    let read = 0;
    let archived = 0;
    for (const m of messages) {
      if (m.status === "UNREAD") unread++;
      else if (m.status === "READ") read++;
      else if (m.status === "ARCHIVED") archived++;
    }
    return { unread, read, archived, total: messages.length };
  }, [messages]);

  // Lista filtrata
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return messages.filter((m) => {
      if (statusFilter !== "ALL" && m.status !== statusFilter) return false;
      if (query) {
        const matchName = m.name.toLowerCase().includes(query);
        const matchEmail = m.email.toLowerCase().includes(query);
        const matchSubject = m.subject.toLowerCase().includes(query);
        const matchBody = m.message.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchSubject && !matchBody) return false;
      }
      return true;
    });
  }, [messages, q, statusFilter]);

  // Messaggio attivo per visualizzazione cassetto in vista compatta
  const activeMessage = useMemo(() => {
    if (!selectedMessageId) return null;
    return messages.find((m) => m.id === selectedMessageId) || null;
  }, [messages, selectedMessageId]);

  // Aggiornamento stato del messaggio (Ottimistico + Chiamata API)
  async function updateMessageStatus(id: string, nextStatus: ContactMessageStatus) {
    const prevMessages = messages;
    const nowIso = new Date().toISOString();

    // Aggiornamento locale immediato
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          status: nextStatus,
          readAt: nextStatus === "READ" ? nowIso : nextStatus === "UNREAD" ? null : m.readAt,
          archivedAt: nextStatus === "ARCHIVED" ? nowIso : null,
        };
      })
    );

    try {
      const res = await adminFetch(`/api/admin/contact-messages/${id}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Errore durante il cambio di stato.");
      }
    } catch {
      // Rollback se fallisce
      setMessages(prevMessages);
      alert("Impossibile aggiornare lo stato del messaggio.");
    }
  }

  // Copia negli appunti con feedback visivo
  function handleCopy(text: string, id: string) {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  }

  // Apertura modale di risposta rapida
  function openReplyModal(m: SerializedContactMessage) {
    setReplyModalMessage(m);
    setSelectedTemplateId("thanks");
    const tpl = QUICK_REPLY_TEMPLATES[0];
    setCustomReplySubject(`Re: ${m.subject || "Contatto Del Pasqua"}`);
    setCustomReplyBody(tpl.body(m.name));
  }

  function handleSelectTemplate(tplId: string) {
    if (!replyModalMessage) return;
    setSelectedTemplateId(tplId);
    const tpl = QUICK_REPLY_TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setCustomReplySubject(`Re: ${replyModalMessage.subject || tpl.subject}`);
      setCustomReplyBody(tpl.body(replyModalMessage.name));
    }
  }

  return (
    <div className="space-y-4 font-sans antialiased">
      {/* =========================================================
          CONTATORI RAPIDI INTERATTIVI (CLICK TO FILTER)
      ========================================================= */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Da Leggere */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === "UNREAD" ? "ALL" : "UNREAD")}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all shadow-xs cursor-pointer ${
            statusFilter === "UNREAD"
              ? "border-amber-300 bg-amber-50/80 ring-2 ring-amber-400/30"
              : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <Inbox className="h-3.5 w-3.5 text-amber-600" />
              <span>Da Leggere</span>
            </div>
            <div className="mt-1 text-2xl font-extrabold text-neutral-900">{stats.unread}</div>
          </div>
          {stats.unread > 0 && (
            <span className="flex h-6 px-2 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-white shadow-xs animate-pulse">
              Nuovi
            </span>
          )}
        </button>

        {/* Letti */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === "READ" ? "ALL" : "READ")}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all shadow-xs cursor-pointer ${
            statusFilter === "READ"
              ? "border-emerald-300 bg-emerald-50/80 ring-2 ring-emerald-400/30"
              : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Letti</span>
            </div>
            <div className="mt-1 text-2xl font-extrabold text-neutral-900">{stats.read}</div>
          </div>
        </button>

        {/* Archiviati */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === "ARCHIVED" ? "ALL" : "ARCHIVED")}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all shadow-xs cursor-pointer ${
            statusFilter === "ARCHIVED"
              ? "border-neutral-400 bg-neutral-100 ring-2 ring-neutral-400/30"
              : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <Archive className="h-3.5 w-3.5 text-neutral-600" />
              <span>Archiviati</span>
            </div>
            <div className="mt-1 text-2xl font-extrabold text-neutral-900">{stats.archived}</div>
          </div>
        </button>
      </div>

      {/* =========================================================
          BARRA STRUMENTI, RICERCA & TOGGLE VISTA
      ========================================================= */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Filtri pill di stato */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Tutti ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("UNREAD")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "UNREAD"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Non letti ({stats.unread})
            </button>
            <button
              onClick={() => setStatusFilter("READ")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "READ"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Letti ({stats.read})
            </button>
            <button
              onClick={() => setStatusFilter("ARCHIVED")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "ARCHIVED"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Archiviati ({stats.archived})
            </button>
          </div>

          {/* Destra: Switch Vista Compatta / Espansa */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-neutral-100 p-1 border border-neutral-200/80">
              <button
                type="button"
                onClick={() => setViewMode("expanded")}
                title="Vista Completa Espansa"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "expanded"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Espansa</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                title="Vista Compatta Inbox"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "compact"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Compatta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Input Ricerca Istantanea */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca istantaneamente per mittente, email, oggetto o contenuto del messaggio..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 pl-9.5 pr-8 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2.5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          VISTA 1: VISTA ESPANSA (CARD COMPLETE DI DETTAGLI)
      ========================================================= */}
      {viewMode === "expanded" && (
        <div className="space-y-3.5">
          {filtered.map((m) => {
            const isUnread = m.status === "UNREAD";
            const source = compactSource(m.sourcePath);
            const phone = detectPhoneNumber(m.message);
            const topic = detectTopicTag(m.message, m.subject);

            return (
              <article
                key={m.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-200 hover:border-neutral-300 hover:shadow-md ${
                  isUnread
                    ? "border-amber-300/90 bg-gradient-to-br from-amber-50/25 via-white to-white ring-1 ring-amber-200/60"
                    : "border-neutral-200"
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Riga Superiore: Mittente + Badge + Azioni Toolbar */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Avatar */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-black shadow-2xs ${
                          isUnread
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                        }`}
                      >
                        {initials(m.name)}
                      </div>

                      {/* Info Mittente & Badges */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-neutral-900 truncate">
                            {m.name}
                          </span>

                          {/* Pill Stato */}
                          {isUnread ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/80 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Non letto
                            </span>
                          ) : m.status === "ARCHIVED" ? (
                            <span className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-bold text-neutral-600">
                              Archiviato
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              Letto
                            </span>
                          )}

                          {/* Tag Tematico Riconosciuto */}
                          {topic && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${topic.tone}`}
                            >
                              <Sparkles className="h-3 w-3" />
                              {topic.label}
                            </span>
                          )}

                          {/* Notifica Email */}
                          {m.notificationStatus === "sent" && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <MailCheck className="h-3 w-3 text-emerald-600" />
                              Notifica Inviata
                            </span>
                          )}
                        </div>

                        {/* Contatti & Data */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-neutral-500">
                          <div className="flex items-center gap-1">
                            <AtSign className="h-3 w-3 text-neutral-400" />
                            <a
                              href={`mailto:${m.email}`}
                              className="text-neutral-700 hover:text-neutral-950 font-semibold underline decoration-neutral-300 hover:decoration-neutral-900 transition-colors truncate"
                            >
                              {m.email}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(m.email, `email-${m.id}`)}
                              className="ml-1 text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
                              title="Copia indirizzo email"
                            >
                              {copiedId === `email-${m.id}` ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>

                          {phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-neutral-400" />
                              <a
                                href={`tel:${phone}`}
                                className="text-neutral-700 hover:text-neutral-950 font-semibold underline decoration-neutral-300"
                              >
                                {phone}
                              </a>
                              <a
                                href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 hover:bg-emerald-200"
                              >
                                WhatsApp
                              </a>
                            </div>
                          )}

                          <span className="flex items-center gap-1 text-neutral-400">
                            <Clock className="h-3 w-3" />
                            <span>{fmtDateTime(m.createdAt)} ({timeAgo(m.createdAt)})</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toolbar Azioni del Messaggio */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-1 md:pt-0">
                      {/* Rispondi Veloce con Template */}
                      <button
                        type="button"
                        onClick={() => openReplyModal(m)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs cursor-pointer"
                        title="Apri pannello di risposta rapida con template"
                      >
                        <Reply className="h-3.5 w-3.5 text-blue-600" />
                        <span>Rispondi</span>
                      </button>

                      {/* Segna Letto / Non Letto */}
                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => updateMessageStatus(m.id, "READ")}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-2xs cursor-pointer"
                        >
                          <MailOpen className="h-3.5 w-3.5" />
                          <span>Segna Letto</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateMessageStatus(m.id, "UNREAD")}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-all shadow-2xs cursor-pointer"
                        >
                          <Mail className="h-3.5 w-3.5 text-amber-600" />
                          <span>Non Letto</span>
                        </button>
                      )}

                      {/* Archivia / Ripristina */}
                      {m.status !== "ARCHIVED" ? (
                        <button
                          type="button"
                          onClick={() => updateMessageStatus(m.id, "ARCHIVED")}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-all shadow-2xs cursor-pointer"
                          title="Archivia messaggio"
                        >
                          <Archive className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="hidden lg:inline">Archivia</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateMessageStatus(m.id, "READ")}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-all shadow-2xs cursor-pointer"
                          title="Ripristina nei letti"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="hidden lg:inline">Ripristina</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Oggetto Messaggio */}
                  {m.subject && (
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-neutral-900">
                        <MessageSquare className="h-4 w-4 text-neutral-400 shrink-0" />
                        <span>{m.subject}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(m.message, `body-${m.id}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
                        title="Copia l'intero testo del messaggio"
                      >
                        {copiedId === `body-${m.id}` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600">Testo Copiato!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-neutral-400" />
                            <span>Copia Testo</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Corpo del Messaggio */}
                  <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-4 text-sm font-normal text-neutral-800 leading-relaxed whitespace-pre-wrap selection:bg-neutral-900 selection:text-white">
                    {m.message}
                  </div>

                  {/* Footer Dettagli: Origine, ID, Timestamp lettura */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100 text-[11px] text-neutral-400 font-mono">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>ID: {m.id}</span>
                      {source && (
                        <span className="inline-flex items-center gap-1 text-neutral-500 font-sans">
                          <ExternalLink className="h-3 w-3" />
                          <span>Modulo: {source}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-neutral-400">
                      {m.readAt && <span>Letto: {fmtDateTime(m.readAt)}</span>}
                      {m.archivedAt && <span>Archiviato: {fmtDateTime(m.archivedAt)}</span>}
                    </div>
                  </div>

                  {/* Errore notifica se presente */}
                  {m.notificationError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                      <span>Errore notifica server: {m.notificationError}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================
          VISTA 2: VISTA COMPATTA (INBOX TABLE / MASTER-DETAIL)
      ========================================================= */}
      {viewMode === "compact" && (
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
          <div className="divide-y divide-neutral-100">
            {filtered.map((m) => {
              const isUnread = m.status === "UNREAD";
              const topic = detectTopicTag(m.message, m.subject);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMessageId(m.id)}
                  className={`group flex items-center justify-between gap-3 p-3.5 sm:px-4 cursor-pointer transition-all hover:bg-neutral-50/80 ${
                    isUnread ? "bg-amber-50/30 font-semibold" : "bg-white font-normal"
                  }`}
                >
                  {/* Sinistra: Pallino unread + Avatar + Mittente + Anteprima Oggetto */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Indicatore Non Letto */}
                    <div className="w-2 shrink-0 flex items-center justify-center">
                      {isUnread && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                    </div>

                    {/* Avatar Compatto */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-black ${
                        isUnread
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {initials(m.name)}
                    </div>

                    {/* Dati Mittente e Preview Oggetto / Messaggio */}
                    <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-[180px,1fr] gap-1 md:gap-4 items-center">
                      <div className="truncate">
                        <span className="text-xs font-bold text-neutral-900 block truncate">
                          {m.name}
                        </span>
                        <span className="text-[11px] text-neutral-400 truncate block">
                          {m.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0 truncate">
                        {topic && (
                          <span
                            className={`hidden sm:inline-flex rounded-md border px-1.5 py-0.2 text-[9px] font-bold shrink-0 ${topic.tone}`}
                          >
                            {topic.label}
                          </span>
                        )}
                        <span className="text-xs text-neutral-800 font-extrabold truncate shrink-0">
                          {m.subject || "Nessun oggetto"}
                        </span>
                        <span className="text-xs text-neutral-400 truncate hidden lg:inline">
                          — {m.message.replace(/\s+/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Destra: Data + Icona freccia */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-neutral-400 font-mono whitespace-nowrap">
                      {timeAgo(m.createdAt)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stato Nessun Messaggio */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-xs">
          <Mail className="mx-auto h-9 w-9 text-neutral-300 mb-2" />
          <div className="text-base font-extrabold text-neutral-800">Nessun messaggio trovato</div>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
            Nessuna richiesta corrisponde ai filtri di stato o ai criteri di ricerca impostati.
          </p>
          {(q || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setQ("");
                setStatusFilter("ALL");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reimposta filtri
            </button>
          )}
        </div>
      )}

      {/* =========================================================
          CASSETTO DETTAGLIO MESSAGGIO (SLIDE-OVER PER VISTA COMPATTA)
      ========================================================= */}
      {viewMode === "compact" && activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative h-full w-full max-w-xl bg-white p-6 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200 border-l border-neutral-200">
            {/* Header Cassetto */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Dettaglio Messaggio
                </span>
                <span className="font-mono text-xs text-neutral-400">ID {activeMessage.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessageId(null)}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dati Mittente */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-black text-neutral-800">
                {initials(activeMessage.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-neutral-900">{activeMessage.name}</h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                  <a href={`mailto:${activeMessage.email}`} className="underline hover:text-black">
                    {activeMessage.email}
                  </a>
                  <span>•</span>
                  <span>{fmtDateTime(activeMessage.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Oggetto & Corpo */}
            <div className="space-y-2">
              <div className="text-sm font-extrabold text-neutral-900">{activeMessage.subject}</div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap font-normal">
                {activeMessage.message}
              </div>
            </div>

            {/* Azioni Rapide del Cassetto */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={() => openReplyModal(activeMessage)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <Reply className="h-4 w-4 text-blue-400" />
                <span>Rispondi al Messaggio</span>
              </button>

              <div className="flex items-center gap-1.5">
                {activeMessage.status === "UNREAD" ? (
                  <button
                    type="button"
                    onClick={() => updateMessageStatus(activeMessage.id, "READ")}
                    className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    <MailOpen className="h-3.5 w-3.5" />
                    <span>Segna Letto</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateMessageStatus(activeMessage.id, "UNREAD")}
                    className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Segna Non Letto</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => updateMessageStatus(activeMessage.id, "ARCHIVED")}
                  className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>Archivia</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALE RISPOSTA RAPIDA CON TEMPLATE
      ========================================================= */}
      {replyModalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            {/* Header Modale */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
                  <Reply className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">Risposta Rapida</h3>
                  <p className="text-xs text-neutral-500">Destinatario: {replyModalMessage.name} ({replyModalMessage.email})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalMessage(null)}
                className="rounded-xl p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Selezione Template Risposta */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Template di Risposta Rapida:</span>
              </label>
              <div className="grid gap-1.5 sm:grid-cols-3">
                {QUICK_REPLY_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`rounded-xl border p-2 text-left text-xs font-bold transition-all cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Oggetto Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Oggetto Email:
              </label>
              <input
                value={customReplySubject}
                onChange={(e) => setCustomReplySubject(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {/* Corpo Testo Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Testo del Messaggio:
              </label>
              <textarea
                value={customReplyBody}
                onChange={(e) => setCustomReplyBody(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 leading-relaxed focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {/* Footer Azioni */}
            <div className="flex items-center justify-between gap-2 border-t border-neutral-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (navigator?.clipboard) {
                    navigator.clipboard.writeText(customReplyBody);
                    alert("Testo risposta copiato negli appunti!");
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copia Testo</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReplyModalMessage(null)}
                  className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Chiudi
                </button>
                <a
                  href={`mailto:${replyModalMessage.email}?subject=${encodeURIComponent(
                    customReplySubject
                  )}&body=${encodeURIComponent(customReplyBody)}`}
                  onClick={() => {
                    // Segna anche come letto in automatico quando risponde
                    if (replyModalMessage.status === "UNREAD") {
                      updateMessageStatus(replyModalMessage.id, "READ");
                    }
                    setReplyModalMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Invia con il tuo Client Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
