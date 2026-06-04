"use client";

import * as React from "react";
import type * as Prisma from "@/generated/prisma/client";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/components/animate-ui/primitives/animate/tooltip";

const STATUS_DESCRIPTIONS: Record<Prisma.OrderStatus, string> = {
  IN_ATTESA: "L'ordine è stato creato ed è in attesa del pagamento (ad esempio tramite Stripe o bonifico).",
  PAGATO: "Il pagamento dell'ordine è stato confermato con successo.",
  IN_PREPARAZIONE: "L'ordine è in fase di preparazione e confezionamento da parte dello staff.",
  SPEDITO: "L'ordine è stato affidato al corriere ed è in viaggio verso il cliente.",
  CONSEGNATO: "Il corriere ha consegnato con successo l'ordine al destinatario.",
  ANNULLATO: "L'ordine è stato annullato (dall'utente o dall'amministratore).",
  RIMBORSATO: "L'ordine è stato interamente rimborsato al cliente.",
  PARZIALMENTE_RIMBORSATO: "L'ordine è stato rimborsato parzialmente per alcuni articoli.",
  SCADUTO: "L'ordine in attesa non è stato pagato entro i limiti di tempo ed è scaduto.",
  FALLITO: "Il tentativo di pagamento per l'ordine è fallito o è stato rifiutato.",
};

export default function OrderStatusBadge({ status }: { status: Prisma.OrderStatus }) {
  const desc = STATUS_DESCRIPTIONS[status] || "Stato dell'ordine non definito.";

  return (
    <TooltipProvider openDelay={200} closeDelay={150}>
      <Tooltip side="top" sideOffset={6} align="center">
        <TooltipTrigger asChild>
          <span
            className={[
              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold cursor-help select-none transition-colors",
              status === "IN_PREPARAZIONE"
                ? "bg-sky-200 text-sky-900 hover:bg-sky-300"
                : status === "SPEDITO" || status === "CONSEGNATO"
                  ? "bg-emerald-200 text-emerald-900 hover:bg-emerald-300"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
            ].join(" ")}
          >
            {status}
          </span>
        </TooltipTrigger>
        <TooltipContent className="z-50 max-w-[260px] bg-neutral-900 text-white text-[11px] font-normal px-3 py-2 rounded-xl shadow-lg border border-neutral-800 text-center leading-relaxed antialiased">
          {desc}
          <TooltipArrow className="fill-neutral-900" tipRadius={2} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
