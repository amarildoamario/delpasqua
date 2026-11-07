import PageHeader from "../_components/PageHeader";
import { prisma } from "@/lib/server/prisma";
import MessagesManager, { type SerializedContactMessage } from "./MessagesManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const serializedMessages: SerializedContactMessage[] = messages.map((m) => ({
    id: m.id,
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
        subtitle="Mailbox interna dei messaggi inviati dagli utenti tramite il modulo contatti."
        meta={`Caricati ${serializedMessages.length} messaggi recenti.`}
      />

      <MessagesManager initialMessages={serializedMessages} />
    </div>
  );
}
