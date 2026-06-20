import Link from "next/link";
import type { ReactNode } from "react";
import { AtSign, Clock, ExternalLink, Inbox, Search, Send, UserRound } from "lucide-react";
import PageHeader from "../_components/PageHeader";
import MessageStatusActions from "./MessageStatusActions";
import { prisma } from "@/lib/server/prisma";
import type { ContactMessageStatus, ContactNotificationStatus } from "@/generated/prisma";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<ContactMessageStatus, string> = {
  UNREAD: "Non letto",
  READ: "Letto",
  ARCHIVED: "Archiviato",
};

function fmtTs(d: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function statusTone(status: ContactMessageStatus) {
  if (status === "UNREAD") return "bg-amber-100 text-amber-900";
  if (status === "ARCHIVED") return "bg-neutral-100 text-neutral-600";
  return "bg-emerald-100 text-emerald-800";
}

function notificationTone(status: ContactNotificationStatus) {
  if (status === "sent") return "bg-emerald-50 text-emerald-700";
  if (status === "failed") return "bg-red-50 text-red-700";
  if (status === "skipped") return "bg-amber-50 text-amber-800";
  return "bg-neutral-100 text-neutral-700";
}

function notificationLabel(status: ContactNotificationStatus) {
  if (status === "sent") return "Notifica inviata";
  if (status === "failed") return "Notifica fallita";
  if (status === "skipped") return "Notifica saltata";
  return "Notifica in attesa";
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

function StatusPill({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedStatus = ["UNREAD", "READ", "ARCHIVED"].includes(params.status ?? "")
    ? (params.status as ContactMessageStatus)
    : undefined;
  const q = params.q?.trim() || "";

  const where = {
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { subject: { contains: q, mode: "insensitive" as const } },
            { message: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [messages, counts] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.contactMessage.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countByStatus = new Map(counts.map((row) => [row.status, row._count._all]));
  const unread = countByStatus.get("UNREAD") ?? 0;
  const read = countByStatus.get("READ") ?? 0;
  const archived = countByStatus.get("ARCHIVED") ?? 0;

  function filterHref(status?: ContactMessageStatus) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const query = params.toString();
    return query ? `/admin/messages?${query}` : "/admin/messages";
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Messaggi"
        subtitle="Mailbox interna dei messaggi ricevuti dal form contatti."
        meta={`Mostrati ${messages.length} messaggi su un massimo di 100 risultati.`}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Inbox className="h-4 w-4 text-amber-600" />
            Non letti
          </div>
          <div className="mt-2 text-2xl font-bold text-neutral-900">{unread}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <UserRound className="h-4 w-4 text-emerald-700" />
            Letti
          </div>
          <div className="mt-2 text-2xl font-bold text-neutral-900">{read}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Send className="h-4 w-4 text-neutral-600" />
            Archiviati
          </div>
          <div className="mt-2 text-2xl font-bold text-neutral-900">{archived}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={filterHref()}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              selectedStatus ? "border border-neutral-200 bg-white text-neutral-900" : "bg-neutral-900 text-white"
            }`}
          >
            Tutti
          </Link>
          {(["UNREAD", "READ", "ARCHIVED"] as ContactMessageStatus[]).map((status) => (
            <Link
              key={status}
              href={filterHref(status)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                selectedStatus === status
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              {STATUS_LABELS[status]}
            </Link>
          ))}

          <form className="ml-auto flex min-w-[260px] max-w-md flex-1 gap-2" action="/admin/messages">
            {selectedStatus ? <input type="hidden" name="status" value={selectedStatus} /> : null}
            <input
              name="q"
              defaultValue={q}
              placeholder="Cerca nome, email, oggetto..."
              className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              <Search className="h-3.5 w-3.5" />
              Cerca
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((message) => {
          const source = compactSource(message.sourcePath);
          const isUnread = message.status === "UNREAD";

          return (
            <article
              key={message.id}
              className={[
                "overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md",
                isUnread ? "border-amber-200 ring-1 ring-amber-100" : "border-neutral-200",
              ].join(" ")}
            >
              <div className={isUnread ? "h-1 bg-amber-400" : "h-1 bg-neutral-200"} />

              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <div
                      className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                        isUnread ? "bg-amber-100 text-amber-900" : "bg-neutral-100 text-neutral-700",
                      ].join(" ")}
                    >
                      {initials(message.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill className={statusTone(message.status)}>
                          {STATUS_LABELS[message.status]}
                        </StatusPill>
                        <StatusPill className={notificationTone(message.notificationStatus)}>
                          {notificationLabel(message.notificationStatus)}
                        </StatusPill>
                      </div>

                      <h2 className="mt-3 text-xl font-extrabold leading-tight text-neutral-950">
                        {message.subject}
                      </h2>

                      <div className="mt-3 grid gap-2 text-sm text-neutral-700 md:grid-cols-2 xl:grid-cols-4">
                        <div className="flex min-w-0 items-center gap-2">
                          <UserRound className="h-4 w-4 shrink-0 text-neutral-400" />
                          <span className="truncate font-semibold text-neutral-900">{message.name}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-2">
                          <AtSign className="h-4 w-4 shrink-0 text-neutral-400" />
                          <a className="truncate underline hover:text-neutral-900" href={`mailto:${message.email}`}>
                            {message.email}
                          </a>
                        </div>
                        <div className="flex min-w-0 items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 text-neutral-400" />
                          <span className="truncate">{fmtTs(message.createdAt)}</span>
                        </div>
                        {source ? (
                          <div className="flex min-w-0 items-center gap-2">
                            <ExternalLink className="h-4 w-4 shrink-0 text-neutral-400" />
                            <span className="truncate">{source}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <MessageStatusActions id={message.id} status={message.status} />
                </div>

                <div className="mt-5 border-t border-neutral-100 pt-5">
                  <div className="whitespace-pre-wrap rounded-xl bg-[#fbfaf7] px-5 py-4 text-[15px] leading-7 text-neutral-800 shadow-inner ring-1 ring-neutral-100">
                    {message.message}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                  <span className="font-mono">ID {message.id}</span>
                  {message.readAt ? <span>Letto: {fmtTs(message.readAt)}</span> : null}
                  {message.archivedAt ? <span>Archiviato: {fmtTs(message.archivedAt)}</span> : null}
                  {message.notificationSentAt ? (
                    <span>Notifica: {fmtTs(message.notificationSentAt)}</span>
                  ) : null}
                </div>

                {message.notificationError ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    Notifica e-mail: {message.notificationError}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}

        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
            <Inbox className="mx-auto h-8 w-8 text-neutral-300" />
            <div className="mt-3 text-sm font-semibold text-neutral-900">Nessun messaggio trovato</div>
            <div className="mt-1 text-sm text-neutral-500">Prova a cambiare filtro o ricerca.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
