CREATE TABLE "ContactReply" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "from" TEXT NOT NULL,
  "emailId" TEXT,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactReply_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ContactReply_idempotencyKey_key" ON "ContactReply"("idempotencyKey");
CREATE UNIQUE INDEX "ContactReply_emailId_key" ON "ContactReply"("emailId");
CREATE INDEX "ContactReply_messageId_createdAt_idx" ON "ContactReply"("messageId", "createdAt");
ALTER TABLE "ContactReply" ADD CONSTRAINT "ContactReply_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
