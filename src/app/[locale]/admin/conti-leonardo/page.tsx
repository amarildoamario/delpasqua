"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/app/[locale]/admin/_components/PageHeader";
import {
  ArrowRight,
  Calculator,
  Calendar,
  CheckCircle,
  Coins,
  FileText,
  Info,
  Loader2,
  Upload,
} from "lucide-react";
import { adminFetch } from "@/lib/client/adminFetch";

declare global {
  interface Window {
    pdfjsLib: {
      GlobalWorkerOptions: { workerSrc: string };
      getDocument: (options: { data: Uint8Array }) => {
        promise: Promise<{
          numPages: number;
          getPage: (page: number) => Promise<{
            getTextContent: () => Promise<{ items: Array<{ str: string }> }>;
          }>;
        }>;
      };
    };
  }
}

type MonthData = {
  autoGrossCents: number;
  autoShippingCents: number;
  autoVatCents: number;
  autoStripeFeeCents: number;
  orderCount: number;
};

type OverrideData = {
  manualGrossCents?: number;
  manualVatCents?: number;
  manualStripeFeeCents?: number;
  manualGlsCents?: number;
  pdfGlsFileName?: string;
  pdfGlsTotalCents?: number;
};

type EditableField =
  | "manualGrossCents"
  | "manualVatCents"
  | "manualStripeFeeCents"
  | "manualGlsCents";

type ParsedGlsInvoice = {
  invoiceNumber: string;
  invoiceDate: string;
  taxableCents: number;
  vatCents: number;
  totalCents: number;
  fileName: string;
};

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function centsToInputValue(cents: number, allowEmpty = false) {
  if (allowEmpty && cents === 0) return "";
  return (cents / 100).toFixed(2);
}

export default function ContiLeonardoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");

  const [monthsData, setMonthsData] = useState<Record<string, MonthData>>({});
  const [overrides, setOverrides] = useState<Record<string, OverrideData>>({});
  const [vatRatePercent, setVatRatePercent] = useState(4);

  const [parsedGls, setParsedGls] = useState<ParsedGlsInvoice | null>(null);
  const [targetGlsMonth, setTargetGlsMonth] = useState("");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.pdfjsLib) return;

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    };
    document.head.appendChild(script);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/conti-leonardo");
      const json = await res.json();
      if (json.ok) {
        setMonthsData(json.monthsData || {});
        setOverrides(json.overrides || {});
        setVatRatePercent(json.vatRate || 4);
      }
    } catch (error) {
      console.error("Errore fetch dati conti leonardo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveOverrides = async (updatedOverrides: typeof overrides) => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/conti-leonardo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: updatedOverrides }),
      });
    } catch (error) {
      console.error("Errore salvataggio conti leonardo:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleOverrideChange = (
    month: string,
    field: EditableField,
    valueStr: string
  ) => {
    const cleanStr = valueStr.replace(/[^\d,.]/g, "").replace(",", ".").trim();
    const valueNum = parseFloat(cleanStr);
    const valueCents = Number.isNaN(valueNum) ? undefined : Math.round(valueNum * 100);

    const nextMonthOverrides: OverrideData = {
      ...(overrides[month] || {}),
      [field]: valueCents,
    };

    if (nextMonthOverrides[field] === undefined) {
      delete nextMonthOverrides[field];
    }

    const updatedOverrides = { ...overrides };
    if (Object.keys(nextMonthOverrides).length === 0) {
      delete updatedOverrides[month];
    } else {
      updatedOverrides[month] = nextMonthOverrides;
    }

    setOverrides(updatedOverrides);
    saveOverrides(updatedOverrides);
  };

  const allMonths = useMemo(() => {
    const monthsSet = new Set<string>([
      ...Object.keys(monthsData),
      ...Object.keys(overrides),
    ]);
    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  }, [monthsData, overrides]);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allMonths.forEach((month) => years.add(month.split("-")[0]));
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [allMonths]);

  const filteredMonths = useMemo(() => {
    if (selectedYear === "all") return allMonths;
    return allMonths.filter((month) => month.startsWith(selectedYear));
  }, [allMonths, selectedYear]);

  useEffect(() => {
    if (filteredMonths.length > 0 && !targetGlsMonth) {
      setTargetGlsMonth(filteredMonths[0]);
    }
  }, [filteredMonths, targetGlsMonth]);

  const financialDetails = useMemo(() => {
    return filteredMonths.map((month) => {
      const db = monthsData[month] || {
        autoGrossCents: 0,
        autoShippingCents: 0,
        autoVatCents: 0,
        autoStripeFeeCents: 0,
        orderCount: 0,
      };

      const ov = overrides[month] || {};
      const actualGrossCents =
        ov.manualGrossCents !== undefined ? ov.manualGrossCents : db.autoGrossCents;
      const actualShippingCents =
        ov.manualGlsCents !== undefined ? ov.manualGlsCents : db.autoShippingCents;
      const actualVatCents =
        ov.manualVatCents !== undefined ? ov.manualVatCents : db.autoVatCents;
      const actualStripeCents =
        ov.manualStripeFeeCents !== undefined
          ? ov.manualStripeFeeCents
          : db.autoStripeFeeCents;

      return {
        month,
        orderCount: db.orderCount,
        autoGrossCents: db.autoGrossCents,
        actualGrossCents,
        isGrossOverridden: ov.manualGrossCents !== undefined,
        autoShippingCents: db.autoShippingCents,
        actualShippingCents,
        isShippingOverridden: ov.manualGlsCents !== undefined,
        autoVatCents: db.autoVatCents,
        actualVatCents,
        isVatOverridden: ov.manualVatCents !== undefined,
        autoStripeCents: db.autoStripeFeeCents,
        actualStripeCents,
        isStripeOverridden: ov.manualStripeFeeCents !== undefined,
        leonardoShareCents: Math.round(actualGrossCents * 0.1),
        pdfGlsFileName: ov.pdfGlsFileName,
      };
    });
  }, [filteredMonths, monthsData, overrides]);

  const totals = useMemo(() => {
    let autoGross = 0;
    let actualGross = 0;
    let autoShipping = 0;
    let actualShipping = 0;
    let autoVat = 0;
    let actualVat = 0;
    let autoStripe = 0;
    let actualStripe = 0;
    let leonardoShare = 0;
    let ordersCount = 0;

    financialDetails.forEach((detail) => {
      autoGross += detail.autoGrossCents;
      actualGross += detail.actualGrossCents;
      autoShipping += detail.autoShippingCents;
      actualShipping += detail.actualShippingCents;
      autoVat += detail.autoVatCents;
      actualVat += detail.actualVatCents;
      autoStripe += detail.autoStripeCents;
      actualStripe += detail.actualStripeCents;
      leonardoShare += detail.leonardoShareCents;
      ordersCount += detail.orderCount;
    });

    return {
      autoGross,
      actualGross,
      autoShipping,
      actualShipping,
      autoVat,
      actualVat,
      autoStripe,
      actualStripe,
      leonardoShare,
      ordersCount,
    };
  }, [financialDetails]);

  const cleanAndParseNumber = (str: string) => {
    const clean = str.replace(/[^\d,.]/g, "").trim();
    if (clean.includes(",") && clean.includes(".")) {
      const commaIndex = clean.indexOf(",");
      const periodIndex = clean.indexOf(".");
      if (commaIndex > periodIndex) {
        return parseFloat(clean.replace(/\./g, "").replace(",", "."));
      }
      return parseFloat(clean.replace(/,/g, ""));
    }
    if (clean.includes(",")) {
      return parseFloat(clean.replace(",", "."));
    }
    return parseFloat(clean);
  };

  const parseGlsInvoiceText = (text: string, fileName: string) => {
    try {
      const numMatch = text.match(
        /(?:Fattura\s+n\.|Fattura\s+Numero|Doc\.\s+n\.|N\.\s+Fattura|Documento\s+n\.)\s*[:\-\s]*\s*([0-9\/\-_]+)/i
      );
      const invoiceNumber = numMatch ? numMatch[1].trim() : "Non trovato";

      const dateMatch = text.match(
        /(?:del|data|in\s+data|del\s+giorno)\s*[:\-\s]*\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i
      );
      const invoiceDate = dateMatch ? dateMatch[1].trim() : "Non trovata";

      const matches: string[] = [];
      const regexTotal =
        /(?:totale|competenze|imponibile|dovuto|da\s+pagare|netto\s+a\s+pagare)\s*[:\-\s]*\s*([0-9.\s]*,[0-9]{2})/gi;

      let match: RegExpExecArray | null;
      while ((match = regexTotal.exec(text)) !== null) {
        matches.push(match[1]);
      }

      let totalCents = 0;
      let taxableCents = 0;
      let vatCents = 0;

      if (matches.length > 0) {
        const numbers = matches
          .map((value) => cleanAndParseNumber(value))
          .filter((value) => !Number.isNaN(value) && value > 0);
        const uniqueNumbers = Array.from(new Set(numbers)).sort((a, b) => b - a);

        if (uniqueNumbers.length > 0) {
          const maxVal = uniqueNumbers[0];
          const expectedTaxable = maxVal / 1.22;
          const closestTaxable = uniqueNumbers.find(
            (value) => Math.abs(value - expectedTaxable) < 5
          );

          if (closestTaxable) {
            taxableCents = Math.round(closestTaxable * 100);
            totalCents = Math.round(maxVal * 100);
            vatCents = totalCents - taxableCents;
          } else {
            totalCents = Math.round(maxVal * 100);
            taxableCents = Math.round((maxVal / 1.22) * 100);
            vatCents = totalCents - taxableCents;
          }
        }
      }

      if (totalCents === 0) {
        const generalAmountMatch = text.match(/([\d.,]+)\s*€/i);
        if (generalAmountMatch) {
          const parsedVal = cleanAndParseNumber(generalAmountMatch[1]);
          if (!Number.isNaN(parsedVal) && parsedVal > 0) {
            totalCents = Math.round(parsedVal * 100);
            taxableCents = Math.round((parsedVal / 1.22) * 100);
            vatCents = totalCents - taxableCents;
          }
        }
      }

      setParsedGls({
        invoiceNumber,
        invoiceDate,
        taxableCents,
        vatCents,
        totalCents,
        fileName,
      });
    } catch (error) {
      console.error("Errore parsing testo GLS:", error);
      alert("Errore nel riconoscimento dei dati. Compilali a mano.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Carica solo file in formato PDF.");
      return;
    }
    if (!window.pdfjsLib) {
      alert("La libreria PDF sta ancora caricando. Riprova tra qualche secondo.");
      return;
    }

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = async function onLoad() {
      try {
        const typedArray = new Uint8Array(this.result as ArrayBuffer);
        const loadingTask = window.pdfjsLib.getDocument({ data: typedArray });
        const pdf = await loadingTask.promise;

        let fullText = "";
        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
          const page = await pdf.getPage(pageIndex);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item) => item.str).join(" ");
          fullText += "\n";
        }

        parseGlsInvoiceText(fullText, file.name);
      } catch (error) {
        console.error("Errore lettura PDF:", error);
        alert("Errore durante la lettura del PDF. Riprova con un altro file.");
        setIsParsing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const applyGlsToMonth = () => {
    if (!parsedGls || !targetGlsMonth) return;

    const updatedOverrides = {
      ...overrides,
      [targetGlsMonth]: {
        ...(overrides[targetGlsMonth] || {}),
        manualGlsCents: parsedGls.totalCents,
        pdfGlsFileName: parsedGls.fileName,
        pdfGlsTotalCents: parsedGls.totalCents,
      },
    };

    setOverrides(updatedOverrides);
    saveOverrides(updatedOverrides);
    setUploadSuccessMsg(
      `Fattura GLS applicata a ${targetGlsMonth}: ${euro(parsedGls.totalCents)}`
    );
    setParsedGls(null);

    setTimeout(() => {
      setUploadSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Conti Leonardo"
          subtitle="Fatturato, spedizioni, IVA, Stripe e quota Leonardo con gerarchia manuale > automatico."
        />

        <div className="flex items-center gap-2 self-start rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 shadow-sm sm:self-center">
          {saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500" />
              <span>Salvataggio...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>Tutti i dati sono salvati</span>
            </>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <Upload className="h-5 w-5 text-neutral-500" />
              Caricamento Fattura GLS
            </h3>
            <p className="max-w-xl text-sm text-neutral-500">
              Carica il PDF della fattura GLS mensile. Il totale spedizioni estratto
              viene applicato come valore manuale e quindi ha priorita sui dati automatici.
            </p>
          </div>

          <label className="relative flex max-w-sm cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-neutral-400 hover:bg-neutral-100">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isParsing}
            />
            <div className="flex flex-col items-center gap-2 text-center">
              {isParsing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                  <span className="text-xs font-semibold text-neutral-600">
                    Analisi in corso...
                  </span>
                </>
              ) : (
                <>
                  <FileText className="h-6 w-6 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-700">
                    Trascina o scegli un PDF
                  </span>
                </>
              )}
            </div>
          </label>
        </div>

        {uploadSuccessMsg ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
            <span>{uploadSuccessMsg}</span>
          </div>
        ) : null}

        {parsedGls ? (
          <div className="mt-6 border-t border-neutral-100 pt-6">
            <div className="space-y-4 rounded-2xl bg-neutral-900 p-5 text-white">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-400">
                  <Calculator className="h-4 w-4 text-neutral-400" />
                  Fattura GLS riconosciuta
                </h4>
                <button
                  onClick={() => setParsedGls(null)}
                  className="text-xs font-bold text-neutral-400 hover:text-white"
                >
                  Annulla
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">
                    File
                  </div>
                  <div className="mt-0.5 truncate text-sm font-semibold">
                    {parsedGls.fileName}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">
                    Fattura Numero
                  </div>
                  <div className="mt-0.5 text-sm font-semibold">
                    {parsedGls.invoiceNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">
                    Data Documento
                  </div>
                  <div className="mt-0.5 text-sm font-semibold">
                    {parsedGls.invoiceDate}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">
                    Totale Spedizioni
                  </div>
                  <div className="mt-0.5 text-lg font-extrabold text-amber-400">
                    {euro(parsedGls.totalCents)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-neutral-400">
                    Applica questo costo al mese:
                  </label>
                  <select
                    value={targetGlsMonth}
                    onChange={(event) => setTargetGlsMonth(event.target.value)}
                    className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    {filteredMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={applyGlsToMonth}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-extrabold text-neutral-900 transition-colors hover:bg-amber-400"
                >
                  <span>Applica Spesa GLS</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-neutral-400">
            <span>Fatturato</span>
            <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-extrabold text-neutral-700">
              Auto {euro(totals.autoGross)}
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            {euro(totals.actualGross)}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Totale effettivo su {totals.ordersCount} ordini
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-neutral-400">
            <span>Costo Spedizioni</span>
            <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-extrabold text-neutral-700">
              Auto {euro(totals.autoShipping)}
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            {euro(totals.actualShipping)}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            GLS/manuale batte il valore automatico
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-neutral-400">
            <span>IVA</span>
            <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-extrabold text-neutral-700">
              Auto {euro(totals.autoVat)}
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            {euro(totals.actualVat)}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Sul venduto prodotti al {vatRatePercent}%
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-neutral-400">
            <span>Stripe</span>
            <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-extrabold text-neutral-700">
              Auto {euro(totals.autoStripe)}
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-rose-700">
            {euro(totals.actualStripe)}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Fee reali da Stripe con fallback automatico
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500 bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-lg shadow-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-100">
            <span>Quota Leonardo</span>
            <Coins className="h-4 w-4" />
          </div>
          <div className="mt-4 text-4xl font-black tracking-tight text-white">
            {euro(totals.leonardoShare)}
          </div>
          <div className="mt-3 border-t border-white/10 pt-2.5 text-xs font-extrabold tracking-wide text-emerald-100">
            10% del fatturato lordo effettivo
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-neutral-950">
              Registro Mensile Contabilita
            </h3>
            <p className="text-xs font-semibold text-neutral-600">
              Ogni input manuale sovrascrive il dato automatico del mese.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase text-neutral-700">
              Filtra per Anno:
            </label>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-extrabold text-neutral-950 shadow-sm focus:border-neutral-950 focus:outline-none"
            >
              <option value="all">Tutti gli anni</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-500">
              Caricamento in corso...
            </span>
          </div>
        ) : filteredMonths.length === 0 ? (
          <div className="py-20 text-center text-sm font-semibold text-neutral-500">
            Nessun dato registrato nel periodo selezionato.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-300 text-xs font-extrabold uppercase tracking-wider text-neutral-950">
                  <th className="py-3.5 pl-2 pr-4 text-black">Mese</th>
                  <th className="py-3.5 pr-4 text-center text-black">Ordini</th>
                  <th className="py-3.5 pr-4 text-right text-black">Fatturato</th>
                  <th className="py-3.5 pr-4 text-right text-black">Spedizioni</th>
                  <th className="py-3.5 pr-4 text-right text-black">IVA</th>
                  <th className="py-3.5 pr-4 text-right text-black">Stripe</th>
                  <th className="py-3.5 pr-2 text-right text-black">Leonardo 10%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-black">
                {financialDetails.map((detail) => (
                  <tr
                    key={detail.month}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/75"
                  >
                    <td className="flex items-center gap-2 py-4.5 pl-2 pr-4 text-sm font-black text-black">
                      <Calendar className="h-4.5 w-4.5 shrink-0 text-neutral-900" />
                      <span>{detail.month}</span>
                    </td>

                    <td className="py-4.5 pr-4 text-center text-sm font-black text-black">
                      {detail.orderCount}
                    </td>

                    <td className="py-4.5 pr-4 text-right">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-neutral-500">
                          Auto {euro(detail.autoGrossCents)}
                        </div>
                        <input
                          key={`${detail.month}-gross-${detail.actualGrossCents}`}
                          type="text"
                          defaultValue={centsToInputValue(detail.actualGrossCents)}
                          onBlur={(event) =>
                            handleOverrideChange(
                              detail.month,
                              "manualGrossCents",
                              event.target.value
                            )
                          }
                          className={`w-28 rounded-xl border border-neutral-300 bg-white px-2.5 py-1.5 text-right text-xs font-black text-black transition-colors focus:border-black focus:outline-none ${
                            detail.isGrossOverridden
                              ? "border-amber-500 bg-amber-50 text-amber-950"
                              : ""
                          }`}
                          title={
                            detail.isGrossOverridden
                              ? "Valore manuale inserito"
                              : "Valore automatico"
                          }
                        />
                      </div>
                    </td>

                    <td className="py-4.5 pr-4 text-right">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-neutral-500">
                          Auto {euro(detail.autoShippingCents)}
                        </div>
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            key={`${detail.month}-shipping-${detail.actualShippingCents}`}
                            type="text"
                            placeholder="0.00"
                            defaultValue={centsToInputValue(
                              detail.actualShippingCents,
                              true
                            )}
                            onBlur={(event) =>
                              handleOverrideChange(
                                detail.month,
                                "manualGlsCents",
                                event.target.value
                              )
                            }
                            className={`w-28 rounded-xl border border-neutral-300 bg-white px-2.5 py-1.5 text-right text-xs font-black text-black transition-colors focus:border-black focus:outline-none ${
                              detail.pdfGlsFileName
                                ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                                : detail.isShippingOverridden
                                  ? "border-amber-500 bg-amber-50 text-amber-950"
                                  : ""
                            }`}
                            title={
                              detail.isShippingOverridden
                                ? "Valore manuale inserito"
                                : "Valore automatico"
                            }
                          />
                          {detail.pdfGlsFileName ? (
                            <span
                              className="shrink-0 cursor-help select-none text-xs font-bold text-emerald-800"
                              title={`Caricata fattura GLS: ${detail.pdfGlsFileName}`}
                            >
                              PDF
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="py-4.5 pr-4 text-right">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-neutral-500">
                          Auto {euro(detail.autoVatCents)}
                        </div>
                        <input
                          key={`${detail.month}-vat-${detail.actualVatCents}`}
                          type="text"
                          defaultValue={centsToInputValue(detail.actualVatCents)}
                          onBlur={(event) =>
                            handleOverrideChange(
                              detail.month,
                              "manualVatCents",
                              event.target.value
                            )
                          }
                          className={`w-28 rounded-xl border border-neutral-300 bg-white px-2.5 py-1.5 text-right text-xs font-black text-black transition-colors focus:border-black focus:outline-none ${
                            detail.isVatOverridden
                              ? "border-amber-500 bg-amber-50 text-amber-950"
                              : ""
                          }`}
                          title={
                            detail.isVatOverridden
                              ? "Valore manuale inserito"
                              : "Valore automatico"
                          }
                        />
                      </div>
                    </td>

                    <td className="py-4.5 pr-4 text-right">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-neutral-500">
                          Auto {euro(detail.autoStripeCents)}
                        </div>
                        <input
                          key={`${detail.month}-stripe-${detail.actualStripeCents}`}
                          type="text"
                          defaultValue={centsToInputValue(detail.actualStripeCents)}
                          onBlur={(event) =>
                            handleOverrideChange(
                              detail.month,
                              "manualStripeFeeCents",
                              event.target.value
                            )
                          }
                          className={`w-28 rounded-xl border border-neutral-300 bg-white px-2.5 py-1.5 text-right text-xs font-black text-black transition-colors focus:border-black focus:outline-none ${
                            detail.isStripeOverridden
                              ? "border-amber-500 bg-amber-50 text-amber-950"
                              : ""
                          }`}
                          title={
                            detail.isStripeOverridden
                              ? "Valore manuale inserito"
                              : "Valore automatico"
                          }
                        />
                      </div>
                    </td>

                    <td className="py-4.5 pr-2 text-right">
                      <span className="text-sm font-black text-emerald-700">
                        {euro(detail.leonardoShareCents)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-start gap-4 rounded-3xl border border-neutral-200 bg-neutral-100 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wide text-neutral-700">
            Logica Contabile
          </h4>
          <p className="text-xs leading-relaxed text-neutral-600">
            Manuale batte automatico. Il fatturato e le fee Stripe arrivano in
            automatico da Stripe quando recuperabili, con fallback ai dati ordine e alla
            stima fee. Le spedizioni usano il valore automatico dell&apos;ordine finche non
            inserisci un costo GLS/manuale. L&apos;IVA resta calcolata sul venduto come ora,
            e la quota Leonardo e sempre il 10% del fatturato lordo effettivo del mese.
          </p>
        </div>
      </div>
    </div>
  );
}
