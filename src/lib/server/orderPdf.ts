import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@/generated/prisma/client";
import { renderOrderPrintHtml } from "@/lib/server/orderPrint";

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export type OrderPdfAttachment = { filename: string; content: Buffer; contentType: string };

export async function buildOrderPdfAttachment(order: OrderWithItems): Promise<OrderPdfAttachment> {
  if (order.isTest) throw new Error("Commercial order documents are not generated for test orders");
  const logo = await readFile(path.join(process.cwd(), "public", "logo.png"));
  const html = renderOrderPrintHtml(
    [{ ...order, previousPrintCount: 0, lastPrintedAt: null }],
    `data:image/png;base64,${logo.toString("base64")}`,
  );
  const reference = (order.orderNumber || order.id).replace(/[^a-zA-Z0-9_-]/g, "_");
  return buildPrintPdfAttachment(html, `ordine-${reference}.pdf`);
}

export async function buildPrintPdfAttachment(html: string, filename: string): Promise<OrderPdfAttachment> {
  const puppeteer = await import("puppeteer-core");
  let executablePath: string;
  let args: string[] = [];
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const { default: chromium } = await import("@sparticuz/chromium");
    executablePath = await chromium.executablePath();
    args = chromium.args;
  } else {
    const { chromium } = await import("playwright");
    executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || chromium.executablePath();
  }
  const browser = await puppeteer.launch({ executablePath, args, headless: true });
  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().startsWith("data:") || request.url() === "about:blank") void request.continue();
      else void request.abort();
    });
    await page.setContent(html, { waitUntil: "load", timeout: 20_000 });
    await page.emulateMediaType("print");
    const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
    return { filename, content: Buffer.from(pdf), contentType: "application/pdf" };
  } finally {
    await browser.close();
  }
}
