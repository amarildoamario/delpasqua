CREATE TABLE "TastingVoucherProposal" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "tastingType" TEXT NOT NULL,
    "tastingTitle" TEXT NOT NULL,
    "people" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TastingVoucherProposal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TastingVoucherProposalEmail" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "replyTo" TEXT,
    "filename" TEXT NOT NULL,
    "pdf" BYTEA NOT NULL,
    "emailId" TEXT,
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TastingVoucherProposalEmail_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TastingVoucherProposal_requestId_key" ON "TastingVoucherProposal"("requestId");
CREATE INDEX "TastingVoucherProposal_createdAt_id_idx" ON "TastingVoucherProposal"("createdAt", "id");
CREATE UNIQUE INDEX "TastingVoucherProposalEmail_idempotencyKey_key" ON "TastingVoucherProposalEmail"("idempotencyKey");
CREATE INDEX "TastingVoucherProposalEmail_proposalId_createdAt_idx" ON "TastingVoucherProposalEmail"("proposalId", "createdAt");

ALTER TABLE "TastingVoucherProposalEmail" ADD CONSTRAINT "TastingVoucherProposalEmail_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "TastingVoucherProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
