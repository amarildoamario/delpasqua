export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";


function isISODateOnly(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function parseDateOnly(s?: string | null) {
  if (!s || !isISODateOnly(s)) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function escapePdfText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(pages: string[]) {
  // PDF minimale: 1 pagina per ordine con testo (placeholder)
  const objs: string[] = [];
  const offsets: number[] = [];

  const pushObj = (s: string) => {
    offsets.push(0); // placeholder, calc dopo
    objs.push(s);
  };

  // 1) Catalog, 2) Pages, 3) Font
  // Mettiamo font come obj 3
  pushObj(`1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
`);

  // Pages object lo inseriamo dopo aver creato tutte le page references
  // placeholder per ora
  pushObj(`2 0 obj
<< /Type /Pages /Kids [ ] /Count 0 >>
endobj
`);

  pushObj(`3 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
`);

  // Per ogni pagina: Page obj + Content obj
  const pageObjIds: number[] = [];
  const contentObjIds: number[] = [];

  // Primo id disponibile
  let nextId = 4;

  for (const text of pages) {
    const pageId = nextId++;
    const contentId = nextId++;
    pageObjIds.push(pageId);
    contentObjIds.push(contentId);

    pushObj(`${pageId} 0 obj
<< /Type /Page
   /Parent 2 0 R
   /MediaBox [0 0 595 842]
   /Resources << /Font << /F1 3 0 R >> >>
   /Contents ${contentId} 0 R
>>
endobj
`);

    const lines = text.split("\n");
    const fontSize = 12;
    const startX = 50;
    const startY = 800;

    // Costruiamo content stream con righe
    let stream = `BT\n/F1 ${fontSize} Tf\n${startX} ${startY} Td\n`;
    for (let i = 0; i < lines.length; i++) {
      const line = escapePdfText(lines[i]);
      stream += `(${line}) Tj\n`;
      if (i !== lines.length - 1) stream += `0 -16 Td\n`;
    }
    stream += `ET\n`;

    const len = Buffer.byteLength(stream, "utf8");

    pushObj(`${contentId} 0 obj
<< /Length ${len} >>
stream
${stream}endstream
endobj
`);
  }

  // Ora patchiamo l'oggetto Pages (obj 2) con Kids & Count
  const kids = pageObjIds.map((id) => `${id} 0 R`).join(" ");
  objs[1] = `2 0 obj
<< /Type /Pages /Kids [ ${kids} ] /Count ${pageObjIds.length} >>
endobj
`;

  // Compiliamo il PDF calcolando offset
  let out = "%PDF-1.4\n";
  for (let i = 0; i < objs.length; i++) {
    offsets[i] = Buffer.byteLength(out, "utf8");
    out += objs[i];
  }

  const xrefStart = Buffer.byteLength(out, "utf8");

  // xref: include oggetto 0
  out += `xref
0 ${objs.length + 1}
0000000000 65535 f \n`;

  for (let i = 0; i < offsets.length; i++) {
    out += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  out += `trailer
<< /Size ${objs.length + 1}
   /Root 1 0 R
>>
startxref
${xrefStart}
%%EOF
`;

  return Buffer.from(out, "utf8");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "range"; // "range" | "shipping"

  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);

  const start = parseDateOnly(startParam) ?? defaultStart;
  const end = parseDateOnly(endParam) ?? today;

  const endExclusive = new Date(end);
  endExclusive.setDate(end.getDate() + 1);

type OrderWhereInput = NonNullable<Parameters<typeof prisma.order.findMany>[0]>["where"];
const where: NonNullable<OrderWhereInput> = {};

if (mode === "shipping") {
  // ✅ stesso set della pagina Spedizioni (da fare)
  where.shippedAt = null;
  where.status = { in: ["PAID", "PREPARING"] };
} else {
  // range classico
  where.createdAt = { gte: start, lt: endExclusive };
  where.status = "PAID";
}

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "asc" },
    take: 2000,
    select: {
      id: true,
      createdAt: true,
      paidAt: true,
      fullName: true,
      email: true,
      totalCents: true,
      paymentMethod: true,
    },
  });

  const pages = orders.map((o, idx) => {
    const created = new Date(o.createdAt).toLocaleString("it-IT");
    const paid = o.paidAt ? new Date(o.paidAt).toLocaleString("it-IT") : "—";
    return [
      `FATTURA (placeholder) — ${idx + 1}/${orders.length}`,
      ``,
      `Ordine: ${o.id}`,
      `Data ordine: ${created}`,
      `Data pagamento: ${paid}`,
      ``,
      `Cliente: ${o.fullName}`,
      `Email: ${o.email}`,
      ``,
      `Pagamento: ${o.paymentMethod ?? "—"}`,
      `Totale: ${(o.totalCents / 100).toFixed(2)} EUR`,
      ``,
      `NOTE: struttura fattura da definire (verrà aggiornata).`,
    ].join("\n");
  });

  const pdf = buildPdf(pages.length ? pages : ["Nessuna fattura trovata per i filtri selezionati."]);

  const filename =
    mode === "shipping"
      ? `fatture_spedizioni_${new Date().toISOString().slice(0, 10)}.pdf`
      : `fatture_${startParam ?? "start"}_${endParam ?? "end"}.pdf`;

  return new Response(pdf, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
