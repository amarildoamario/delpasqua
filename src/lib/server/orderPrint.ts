import { companyInfo } from "@/lib/companyInfo";
import type * as Prisma from "@/generated/prisma/client";
import { formatMoney } from "@/lib/money";
import { storedCheckoutPayment } from "./checkoutPayment";

type OrderWithItems = Prisma.Prisma.OrderGetPayload<{ include: { items: true } }>;
export type PrintableOrder = Pick<OrderWithItems,
  "id" | "orderNumber" | "status" | "createdAt" | "fullName" | "email" | "phone" |
  "address" | "addressLine1" | "addressLine2" | "city" | "zip" | "postalCode" | "province" |
  "countryCode" | "paymentMethod" | "paymentProvider" | "paidAt" | "shippingNotes" |
  "subtotalCents" | "discountCents" | "shippingCents" | "vatCents" | "totalCents"
> & {
  paymentPricing?: OrderWithItems["paymentPricing"];
  items: Pick<OrderWithItems["items"][number], "sku" | "title" | "variantLabel" | "qty" | "unitPriceCents" | "lineVatCents" | "lineTotalCents">[];
  previousPrintCount: number;
  lastPrintedAt: Date | null;
};

const DB_STATUS_LABEL: Record<string, string> = {
  IN_ATTESA: "IN ATTESA",
  PAGATO: "PAGATO",
  IN_PREPARAZIONE: "IN PREPARAZIONE",
  SPEDITO: "SPEDITO",
  CONSEGNATO: "CONSEGNATO",
  ANNULLATO: "ANNULLATO",
  RIMBORSATO: "RIMBORSATO",
  PARZIALMENTE_RIMBORSATO: "PARZ. RIMBORSATO",
  SCADUTO: "SCADUTO",
  FALLITO: "FALLITO",
  PENDING: "IN ATTESA",
  PAID: "PAGATO",
  PREPARING: "IN PREPARAZIONE",
  SHIPPED: "SPEDITO",
  DELIVERED: "CONSEGNATO",
  CANCELED: "ANNULLATO",
  REFUNDED: "RIMBORSATO",
  PARTIALLY_REFUNDED: "PARZ. RIMBORSATO",
  EXPIRED: "SCADUTO",
  FAILED: "FALLITO",
};

function euro(cents: number) {
  return `&euro; ${(cents / 100).toFixed(2)}`;
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPrintLetterhead(logoSrc: string) {
  return `<div style="display: flex; gap: 12px; align-items: center;">
    <img src="${escapeHtml(logoSrc)}" alt="Logo" style="width: 48px; height: 48px; object-fit: contain;" onerror="this.style.display='none'">
    <div>
      <h2 style="margin: 0; font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: #171717;">${escapeHtml(companyInfo.brandName)}</h2>
      <div style="font-size: 10px; line-height: 1.35; color: #555; margin-top: 2px;">
        ${escapeHtml(companyInfo.companyName)} · ${escapeHtml(companyInfo.addressSingleLine)}<br>
        Tel. ${escapeHtml(companyInfo.phone)} · ${escapeHtml(companyInfo.email)}
      </div>
    </div>
  </div>`;
}

function renderPrintHeader(logoSrc: string, titleHtml: string, reference: string, detailsHtml: string, date: string) {
  return `<div class="document-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 2px solid #171717; padding-bottom: 12px; margin-bottom: 18px;">
    ${renderPrintLetterhead(logoSrc)}
    <div style="text-align: right; min-width: 160px;">
      <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #737373; font-weight: 700;">${titleHtml}</div>
      <div style="font-size: 16px; font-weight: 800; color: #171717; margin-top: 1px;">${escapeHtml(reference)}</div>
      ${detailsHtml ? `<div style="font-size: 10.5px; color: #333; margin-top: 2px;">${detailsHtml}</div>` : ""}
      <div style="font-size: 9.5px; color: #666;">${escapeHtml(date)}</div>
    </div>
  </div>`;
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAddressLine(order: {
  addressLine1: string;
  addressLine2: string | null;
  address: string;
}) {
  const primary = order.addressLine1.trim() || order.address.trim() || "Indirizzo non disponibile";
  return order.addressLine2?.trim() ? `${primary}, ${order.addressLine2.trim()}` : primary;
}

function formatCityLine(order: {
  postalCode: string;
  zip: string;
  city: string;
  province: string;
}) {
  const postalCode = order.postalCode.trim() || order.zip.trim();
  const city = order.city.trim();
  const province = order.province.trim();
  const base = [postalCode, city].filter(Boolean).join(" ");
  return province ? `${base} (${province})` : base || "Località non disponibile";
}

function formatPaymentMethod(order: {
  paymentMethod: string | null;
  paymentProvider: string;
}) {
  if (order.paymentMethod?.trim()) return order.paymentMethod.trim();
  if (order.paymentProvider === "stripe") return "Carta / Stripe";
  return order.paymentProvider || "-";
}

export type PrintDocumentOptions = { kind?: "quote"; validUntil?: Date; notes?: string; vatRate?: number; paymentUrl?: string; shippingTerms?: string };

function renderPrintInfoColumns(leftTitle: string, leftHtml: string, rightTitle: string, rightHtml: string) {
  const headingStyle = "font-size: 10px; text-transform: uppercase; font-weight: 700; color: #737373; margin-bottom: 4px; letter-spacing: 0.04em;";
  return `<div class="document-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 18px; font-size: 12px;">
    <div><div style="${headingStyle}">${escapeHtml(leftTitle)}</div>${leftHtml}</div>
    <div><div style="${headingStyle}">${escapeHtml(rightTitle)}</div>${rightHtml}</div>
  </div>`;
}

function renderQuoteDetails(dateLabel: string, date: string, paymentMethod: string) {
  return `<div style="display: grid; grid-template-columns: 100px minmax(0, 1fr); column-gap: 8px; row-gap: 8px; font-size: 11px; color: #444; line-height: 1.5;">
    <strong>${escapeHtml(dateLabel)}:</strong><span>${escapeHtml(date)}</span>
    <strong>Pagamento:</strong><span>${escapeHtml(paymentMethod)}</span>
  </div>`;
}

function renderPrintItemRow(reference: string, title: string, detailHtml: string, quantity: number, extraHtml: string, totalHtml: string, totalNote = "") {
  return `<tr>
    <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; font-family: monospace; font-size: 11px; color: #555;">${escapeHtml(reference)}</td>
    <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5;"><strong style="color: #111; font-size: 12px;">${escapeHtml(title)}</strong>${detailHtml}</td>
    <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; text-align: center; font-weight: 700; font-size: 13px;">${quantity}</td>
    <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; text-align: right; font-size: 12px; color: #444;">${extraHtml}</td>
    <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; text-align: right; font-size: 12px; font-weight: 600;">
      <div>${totalHtml}</div>
      ${totalNote}
    </td>
  </tr>`;
}

function renderPrintItems(quoteStyles: boolean, columns: readonly [string, string, string, string, string], rows: string) {
  const directions = ["left", "left", "center", "right", "right"];
  return `<table class="document-items" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
    ${quoteStyles ? '<colgroup><col style="width: 17%"><col style="width: 39%"><col style="width: 8%"><col style="width: 18%"><col style="width: 18%"></colgroup>' : ""}
    <thead><tr style="background: #f5f5f5; text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; color: #555;">
      ${columns.map((label, index) => `<th scope="col" style="padding: 6px 8px; border-bottom: 1.5px solid #ccc; text-align: ${directions[index]};">${escapeHtml(label)}</th>`).join("")}
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderPrintSummary(quoteStyles: boolean, rows: string, notes = "") {
  return `<div class="document-summary" style="display: flex; justify-content: flex-end; gap: 24px; font-size: 11.5px; margin-top: 6px; ${quoteStyles ? "break-inside: avoid;" : ""}">
    ${notes ? `<div style="flex: 1; min-width: 0; font-size: 11px; white-space: pre-wrap; overflow-wrap: anywhere;"><strong>Note e condizioni</strong><br>${escapeHtml(notes)}</div>` : ""}
    <table style="width: 250px; flex-shrink: 0; border-collapse: collapse;">${rows}</table>
  </div>`;
}

function renderPrintTotal(label: string, totalHtml: string) {
  return `<tr style="font-weight: 800; border-top: 1.5px solid #171717; font-size: 13.5px;">
    <td style="padding: 6px 0 0 0; color: #171717;">${escapeHtml(label)}:</td>
    <td style="text-align: right; padding: 6px 0 0 0; color: #171717;">${totalHtml}</td>
  </tr>`;
}

function renderPrintAcceptance(title: string, conditions: string, paymentText: string, paymentUrl?: string) {
  return `<div class="quote-acceptance" style="margin-top: 28px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 11px; line-height: 1.65; break-inside: avoid;">
    <strong>${escapeHtml(title)}</strong><br>${escapeHtml(conditions)}
    ${paymentUrl ? `<p style="margin: 14px 0;">${escapeHtml(paymentText)}</p>
      <a href="${escapeHtml(paymentUrl)}" style="color: #1d4ed8; font-weight: 700; overflow-wrap: anywhere;">Vai al pagamento &rarr;</a><br>
      <span style="font-size: 9px; overflow-wrap: anywhere;">${escapeHtml(paymentUrl)}</span>` : ""}
  </div>`;
}

export function renderOrderPrintHtml(orders: PrintableOrder[], logoSrc = "/logo.png", options: PrintDocumentOptions = {}) {
  const isQuote = options.kind === "quote";
  const reprintedCount = orders.filter((order) => order.previousPrintCount > 0).length;
  const firstPrintCount = orders.length - reprintedCount;

  const htmlItems = orders
    .map((order, idx) => {
      const payment = storedCheckoutPayment(order.paymentPricing);
      const itemsHtml = order.items
        .map((item) => {
          const variantLabel = item.variantLabel
            ? `<div style="font-size: 11px; color: #666; margin-top: 2px;">${escapeHtml(item.variantLabel)}</div>`
            : "";
          const lineVatNote =
            item.lineVatCents > 0
              ? `<div style="font-size: 10px; color: #888; margin-top: 1px;">IVA incl.: ${euro(item.lineVatCents)}</div>`
              : "";

          return renderPrintItemRow(item.sku, item.title, variantLabel, item.qty, euro(item.unitPriceCents), euro(item.lineTotalCents), lineVatNote);
        })
        .join("");

      const printWarning =
        order.previousPrintCount > 0
          ? `
            <div class="no-print" style="margin: 0 0 12px 0; padding: 6px 10px; color: #737373; font-size: 11px;">
              <strong>Ristampa:</strong> già stampato ${order.previousPrintCount} ${
                order.previousPrintCount === 1 ? "volta" : "volte"
              } (ultimo: ${escapeHtml(formatDate(order.lastPrintedAt))}).
            </div>
          `
          : "";

      return `
        ${printWarning}
        <div class="order-sheet${isQuote ? " quote-sheet" : ""}">
          ${renderPrintHeader(
            logoSrc,
            isQuote ? '<span style="color: #b91c1c; font-size: 17px; font-weight: 900;">PREVENTIVO</span>' : `Ordine ${idx + 1} di ${orders.length}`,
            order.orderNumber ?? order.id.slice(0, 8),
            isQuote ? `<strong>Valido fino al:</strong> ${escapeHtml(options.validUntil?.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }) ?? "-")}` : `<strong>Stato:</strong> ${escapeHtml(DB_STATUS_LABEL[order.status] ?? order.status)}`,
            formatDate(order.createdAt),
          )}

          ${renderPrintInfoColumns("Destinatario Spedizione", `
              <div style="font-size: 13px; font-weight: 700; color: #111;">
                ${escapeHtml(order.fullName || "Nominativo non specificato")}
              </div>
              <div style="color: #333; margin-top: 2px; line-height: 1.35;">
                ${escapeHtml(formatAddressLine(order))}<br>
                ${escapeHtml(formatCityLine(order))}<br>
                ${escapeHtml(order.countryCode || "IT")}
              </div>
              <div style="margin-top: 4px; font-size: 11px; color: #555;">
                <strong>Tel:</strong> ${escapeHtml(order.phone || "-")} · <strong>Email:</strong> ${escapeHtml(order.email || "-")}
              </div>
          `, "Dettagli Spedizione & Pagamento", `
              ${isQuote ? renderQuoteDetails("Data Preventivo", formatDate(order.createdAt), formatPaymentMethod(order))
                : `<div style="font-size: 11px; color: #444; line-height: 1.4;">
                <strong>Data Ordine:</strong> ${escapeHtml(formatDate(order.createdAt))}<br>
                <strong>Pagamento:</strong> ${escapeHtml(formatPaymentMethod(order))}<br>
                <strong>Data Pagamento:</strong> ${escapeHtml(formatDate(order.paidAt))}
              </div>`}
              ${
                order.shippingNotes
                  ? `
                <div style="margin-top: 6px; font-size: 11px; color: #111; line-height: 1.35;">
                  <strong>Note Consegna:</strong> ${escapeHtml(order.shippingNotes)}
                </div>
              `
                  : ""
              }
          `)}

          ${renderPrintItems(isQuote, ["SKU", "Prodotto / Referenza", "Qtà", "Prezzo unit.", "Totale"], itemsHtml)}

          ${renderPrintSummary(isQuote, `
              <tr>
                <td style="padding: 2px 0; color: #555;">Subtotale prodotti:</td>
                <td style="text-align: right; padding: 2px 0; font-weight: 500;">${euro(order.subtotalCents)}</td>
              </tr>
              <tr>
                <td style="padding: 2px 0; color: #777;">di cui IVA ${isQuote ? String(Math.round((options.vatRate ?? 0.04) * 10000) / 100) : "4"}% incl.:</td>
                <td style="text-align: right; padding: 2px 0; color: #777;">${euro(order.vatCents)}</td>
              </tr>
              ${
                order.discountCents > 0
                  ? `
                <tr>
                  <td style="padding: 2px 0; color: #b91c1c;">Sconto:</td>
                  <td style="text-align: right; padding: 2px 0; color: #b91c1c;">-&euro; ${(order.discountCents / 100).toFixed(2)}</td>
                </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 2px 0; color: #555;">Spedizione:</td>
                <td style="text-align: right; padding: 2px 0; font-weight: 500;">${euro(order.shippingCents)}</td>
              </tr>
              ${renderPrintTotal(isQuote ? "Totale Preventivo" : "Totale Ordine", euro(order.totalCents))}
              ${payment ? `<tr>
                <td style="padding-top: 4px;">Importo Stripe (${payment.currency})</td>
                <td style="text-align: right; padding-top: 4px;">${escapeHtml(formatMoney(payment.totalCents, payment.currency))}</td>
              </tr>` : ""}
          `, isQuote ? options.notes : undefined)}
          ${isQuote ? renderPrintAcceptance(
            "Condizioni di spedizione",
            options.shippingTerms || "Spedizione all'indirizzo indicato, ai costi concordati.",
            "Se accetti il preventivo e le condizioni di spedizione e confermi che l'indirizzo indicato è corretto, apri il link seguente per procedere al pagamento sicuro con Stripe. Prodotti, importi e dati di spedizione sono già predisposti per questo preventivo.",
            options.paymentUrl,
          ) : ""}
        </div>
      `;
    })
    .join("");

  return renderPrintPage(isQuote ? "Preventivo" : "Stampa Ordini Evasione", isQuote, `
    <div class="no-print" style="background: #ffffff; padding: 12px 20px; border-radius: 10px; border: 1px solid #e4e4e7; display: flex; justify-content: space-between; align-items: center; gap: 16px; max-width: 800px; margin: 0 auto 20px auto; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
      <div>
        <span style="font-size: 13.5px; font-weight: 700; color: #18181b;">${orders.length} ${orders.length === 1 ? "ordine pronto" : "ordini pronti per la stampa"}</span>
        <div style="font-size: 11px; color: #71717a; margin-top: 1px;">
          ${firstPrintCount} prime stampe · ${reprintedCount} ristampe
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="window.print()" style="background: #18181b; color: #ffffff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
          🖨️ Stampa Adesso
        </button>
        <button onclick="window.close()" style="background: #ffffff; color: #3f3f46; border: 1px solid #d4d4d8; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
          Chiudi
        </button>
      </div>
    </div>
    ${htmlItems}
    <script>
      window.addEventListener("load", () => {
        setTimeout(() => {
          window.print();
        }, 350);
      });
    </script>
  `);
}

function renderPrintPage(title: string, quoteStyles: boolean, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <title>${escapeHtml(title)} - Frantoio Del Pasqua</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: #f4f4f5;
          margin: 0;
          padding: 24px;
          color: #18181b;
          -webkit-font-smoothing: antialiased;
        }
        .order-sheet {
          background: #ffffff;
          max-width: 800px;
          margin: 0 auto 28px auto;
          padding: 24px 28px;
          border-radius: 8px;
          border: 1px solid #e4e4e7;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }

        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }

        @media print {
          html, body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .order-sheet {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .order-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
        ${quoteStyles ? `
          .quote-sheet { overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
          .quote-sheet .document-header { padding-bottom: 20px !important; margin-bottom: 28px !important; }
          .quote-sheet .document-info { gap: 32px !important; margin-bottom: 30px !important; line-height: 1.55; }
          .quote-sheet .document-info > div > div:first-child { margin-bottom: 8px !important; }
          .quote-sheet .document-items { table-layout: fixed; margin-bottom: 28px !important; }
          .quote-sheet .document-items th { padding-top: 10px !important; padding-bottom: 10px !important; }
          .quote-sheet .document-items th:nth-child(3) { padding-inline: 4px; white-space: nowrap; }
          .quote-sheet .document-items td { vertical-align: top; font-size: 12px !important; padding-top: 13px !important; padding-bottom: 13px !important; line-height: 1.45; }
          .quote-sheet .document-items th:first-child, .quote-sheet .document-items td:first-child { padding-left: 0 !important; }
          .quote-sheet .document-items th:last-child, .quote-sheet .document-items td:last-child { padding-right: 0 !important; }
          .quote-sheet .document-items td:nth-child(n+3) { white-space: nowrap; }
          .quote-sheet .document-summary { display: grid !important; grid-template-columns: minmax(0, 1fr) 280px; gap: 32px !important; align-items: start; margin-top: 28px !important; }
          .quote-sheet .document-summary > table { grid-column: 2; width: 100% !important; }
          .quote-sheet .document-summary td { padding-top: 5px !important; padding-bottom: 5px !important; }
          .quote-sheet .document-summary td:last-child { white-space: nowrap; }
          .quote-sheet .document-summary tr:last-child td { padding-top: 12px !important; }
          .quote-sheet .document-summary strong, .quote-acceptance > strong { display: inline-block; margin-bottom: 6px; }
          @media print { .quote-sheet { break-inside: auto !important; page-break-inside: auto !important; } tr { break-inside: avoid; } thead { display: table-header-group; } }
        ` : ""}
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

}

export function renderVoucherProposalPrintHtml(
  proposal: { id: string; tastingType: string; tastingTitle: string; people: number; children: number; totalCents: number; createdAt: Date },
  logoSrc: string,
  paymentUrl: string,
) {
  const date = proposal.createdAt.toLocaleString("it-IT", {
    timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const total = escapeHtml(formatMoney(proposal.totalCents, "EUR"));
  const tastingRow = renderPrintItemRow(proposal.tastingType, proposal.tastingTitle, "", proposal.people, String(proposal.children), total);
  return renderPrintPage("Proposta voucher", true, `
    <div class="order-sheet quote-sheet">
      ${renderPrintHeader(
        logoSrc,
        '<span style="color: #b91c1c; font-size: 17px; font-weight: 900;">PROPOSTA VOUCHER</span>',
        proposal.id.slice(0, 8).toUpperCase(),
        "<strong>Stato:</strong> Da pagare",
        date,
      )}
      ${renderPrintInfoColumns("Degustazione", `
        <div style="font-size: 13px; font-weight: 700; color: #111;">${escapeHtml(proposal.tastingTitle)}</div>
        <div style="color: #333; margin-top: 2px; line-height: 1.35;">${escapeHtml(companyInfo.brandName)}</div>
      `, "Dettagli proposta & pagamento", renderQuoteDetails("Data proposta", date, "Online con Stripe"))}
      ${renderPrintItems(true, ["Rif.", "Tipologia di degustazione", "Adulti", "Bambini", "Totale"], tastingRow)}
      ${renderPrintSummary(true, renderPrintTotal("Prezzo totale", total), "Il voucher non ha scadenza. La data della degustazione si sceglie dopo l’emissione, previa conferma del Frantoio.")}
      ${renderPrintAcceptance(
        "Pagamento della proposta",
        "Il voucher verrà inviato via email dopo la conferma del pagamento.",
        "Apri il link seguente per procedere al pagamento.",
        paymentUrl,
      )}
    </div>
  `);
}
