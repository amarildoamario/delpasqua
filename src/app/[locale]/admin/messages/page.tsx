import PageHeader from "../_components/PageHeader";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import MessagesManager, { type SerializedContactMessage } from "./MessagesManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  // Select metadata only; PDF bytes are downloaded through an authenticated endpoint.
  const quoteEmails = await prisma.quoteEmail.findMany({
    orderBy: { createdAt: "desc" }, take: 100,
    select: { id: true, quoteId: true, quoteNumber: true, recipient: true, recipientName: true, subject: true, body: true, from: true, filename: true, emailId: true, sentAt: true, createdAt: true, lastError: true },
  }).catch((error: unknown) => {
    if (databaseReadOnly && typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return [];
    throw error;
  });
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });

  const serializedMessages: SerializedContactMessage[] = messages.map((m) => ({
    id: m.id,
    replies: m.replies.map((r) => ({ id: r.id, subject: r.subject, body: r.body, from: r.from, emailId: r.emailId, sentAt: r.sentAt?.toISOString() ?? null, createdAt: r.createdAt.toISOString() })),
    status: m.status,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    consent: m.consent,
    sourcePath: m.sourcePath,
    ipAddress: m.ipAddress,
    userAgent: m.userAgent,
    notificationStatus: m.notificationStatus,
    notificationSentAt: m.notificationSentAt ? m.notificationSentAt.toISOString() : null,
    notificationError: m.notificationError,
    readAt: m.readAt ? m.readAt.toISOString() : null,
    archivedAt: m.archivedAt ? m.archivedAt.toISOString() : null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Messaggi & Richieste"
        subtitle="Messaggi dei clienti, risposte e preventivi inviati per email."
        meta={`Caricati ${serializedMessages.length} messaggi recenti.`}
      />

      <section className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-bold">Email preventivi</h2>
        <p className="mt-1 text-sm text-neutral-500">Oggetto, testo e copia del PDF allegato a ogni invio.</p>
        {!quoteEmails.length ? <p className="mt-4 text-sm text-neutral-500">Nessun preventivo inviato per email.</p> : <div className="mt-4 divide-y divide-neutral-200">{quoteEmails.map((email) => <details key={email.id} className="py-4">
          <summary className="cursor-pointer rounded-lg text-sm focus-visible:outline-2 focus-visible:outline-sky-600"><span className="font-semibold">{email.subject}</span><span className={`ml-3 inline-block text-xs font-medium ${email.sentAt ? "text-emerald-800" : "text-amber-800"}`}>{email.sentAt ? "Inviata" : email.lastError ? "Invio non confermato" : "In preparazione / da verificare"}</span><span className="mt-1 block break-words pl-4 text-xs text-neutral-500">A {email.recipientName} · {email.recipient} · {(email.sentAt || email.createdAt).toLocaleString("it-IT", { timeZone: "Europe/Rome" })}</span></summary>
          <div className="ml-4 mt-3 space-y-3 rounded-lg bg-neutral-50 p-4 text-sm"><p className="break-words text-xs text-neutral-500">Da: {email.from}</p><p className="whitespace-pre-wrap break-words leading-relaxed">{email.body}</p><div className="flex flex-wrap gap-4"><a href={`/api/admin/quote-emails/${email.id}/attachment/`} className="break-all font-semibold text-sky-700 underline">Scarica {email.filename}</a><Link href={`/admin/quotes/${email.quoteId}`} className="text-sky-700 underline">Apri preventivo {email.quoteNumber}</Link></div><p className="text-xs text-neutral-500">{email.sentAt ? "Accettata dal servizio email; consegna e lettura non verificate qui." : "Non risulta ancora una conferma di invio. Verifica prima di inviare una nuova email."}</p></div>
        </details>)}</div>}
      </section>
      <MessagesManager initialMessages={serializedMessages} />
    </div>
  );
}
