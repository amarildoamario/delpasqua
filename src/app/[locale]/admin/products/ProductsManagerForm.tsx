"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { adminFetch } from "@/lib/client/adminFetch";
import DoubleConfirmDialog from "@/components/DoubleConfirmDialog";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronDown,
  Search,
  Check,
  Save,
  ExternalLink,
  Package,
  Layers,
  Sparkles,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  Copy,
  Eye,
  AlertCircle,
  FileText,
  Boxes,
  X,
  ShoppingBag,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type SpecsRow = { _rid: string; k: string; v: string };

type PurchaseInfo = {
  caratteristiche?: string;
  imballaggio?: string;
  spedizione?: string;
  resi?: string;
};

type Variant = {
  _uid?: string;
  _specRows?: SpecsRow[];
  _priceText?: string;
  id: string;
  label?: string;
  priceCents?: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  specs?: Record<string, string>;
  description?: string;
  [k: string]: unknown;
};

type Product = {
  _uid?: string;
  _specRows?: SpecsRow[];
  id: string;
  slug?: string;
  title?: string;
  category?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  isPublished?: boolean;
  isPurchasable?: boolean;
  excludeFromSeo?: boolean;
  specsTitle?: string;
  specs?: Record<string, string>;
  purchaseInfo?: PurchaseInfo;
  variants: Variant[];
  [k: string]: unknown;
};

/* =========================
   SPECS PRESETS
========================= */

const COMMON_SPECS_PRESETS = [
  "Origine",
  "Cultivar",
  "Acidità",
  "Raccolta",
  "Estrazione",
  "Formato",
  "Conservazione",
  "Profumo",
  "Gusto",
  "Abbinamento",
];

/* =========================
   UTILS
========================= */

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `uid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeId(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

function normalizeSpecs(specs: unknown): Record<string, string> {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(specs)) {
    const kk = String(k || "").trim();
    const vv = v == null ? "" : String(v).trim();
    if (!kk || !vv) continue;
    out[kk] = vv;
  }
  return out;
}

function specsToRows(specs: unknown): SpecsRow[] {
  const obj = normalizeSpecs(specs);
  return Object.entries(obj).map(([k, v]) => ({ _rid: uid(), k, v }));
}

function rowsToSpecs(rows: SpecsRow[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of rows || []) {
    const k = String(r.k || "").trim();
    const v = String(r.v || "").trim();
    if (!k || !v) continue;
    out[k] = v;
  }
  return out;
}

function parseEuroTextToCents(text: string): number | null {
  const t = String(text ?? "").trim();
  if (!t) return null;
  if (!/^[0-9.,]+$/.test(t)) return null;

  const lastDot = t.lastIndexOf(".");
  const lastComma = t.lastIndexOf(",");
  const decPos = Math.max(lastDot, lastComma);

  let normalized: string;
  if (decPos >= 0) {
    const intPart = t.slice(0, decPos).replace(/[.,]/g, "");
    const decPart = t.slice(decPos + 1).replace(/[.,]/g, "");
    normalized = intPart + "." + decPart;
  } else {
    normalized = t.replace(/[.,]/g, "");
  }

  if (!normalized || normalized === ".") return null;
  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

function centsToEuroText(cents?: number) {
  const v = typeof cents === "number" ? cents : 0;
  return (v / 100).toFixed(2);
}

function formatCentsToEuroDisplay(cents?: number) {
  const v = typeof cents === "number" ? cents : 0;
  return (v / 100).toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function makeSuggestedSku(productId: string, variantId: string) {
  const cleanPart = (value: string) =>
    value
      .trim()
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toUpperCase();

  const productPart = cleanPart(productId) || "PRODUCT";
  const variantPart = cleanPart(variantId) || "VARIANT";
  return `${productPart}-${variantPart}`;
}

/* =========================
   UI HELPERS & CONVERTERS
========================= */

function withUids(catalog: Record<string, unknown>[]): Product[] {
  return (catalog || []).map((p) => {
    const next: Record<string, unknown> = { ...p };
    next._uid = next._uid || uid();
    next._specRows = specsToRows(next.specs);

    next.variants = ((next.variants as Record<string, unknown>[]) || []).map((v) => ({
      ...v,
      _uid: v._uid || uid(),
      _specRows: specsToRows(v.specs),
      _priceText: typeof v._priceText === "string" ? v._priceText : centsToEuroText(v.priceCents as number | undefined),
    }));

    return next as unknown as Product;
  });
}

function stripUis(p: Product): Product {
  const next = clone(p);
  delete (next as { _uid?: string })._uid;
  delete (next as { _specRows?: SpecsRow[] })._specRows;

  next.variants = (next.variants || []).map((v) => {
    const vv = { ...v };
    delete (vv as { _uid?: string })._uid;
    delete (vv as { _specRows?: SpecsRow[] })._specRows;
    delete (vv as { _priceText?: string })._priceText;
    return vv;
  });

  return next;
}

function makeNewProductTemplate(forcedId?: string, title?: string, category?: string): Product {
  const id = forcedId ? normalizeId(forcedId) : `nuovo-prodotto-${Date.now()}`;
  const firstVariantId = "var-1";

  const prod: Product = {
    _uid: uid(),
    id,
    slug: id,
    category: category || "Olio",
    title: title || "Nuovo Prodotto",
    subtitle: "",
    badge: "",
    imageSrc: "",
    imageAlt: "",
    isPublished: true,
    isPurchasable: true,
    excludeFromSeo: false,
    description: "",
    specsTitle: "Specifiche",
    specs: {},
    _specRows: [],
    purchaseInfo: {
      caratteristiche:
        "Olio extravergine di oliva ottenuto direttamente dalle olive e unicamente mediante processi meccanici. Acidità <0,3%. Lavorato a freddo per preservare tutte le proprietà organolettiche.",
      imballaggio:
        "Bottiglia in vetro scuro per proteggere dall'ossidazione. Confezione riciclabile e protettiva.",
      spedizione:
        "Consegna in 2-3 giorni lavorativi. Tracking in tempo reale. Spedizione gratuita per ordini sopra i 50€.",
      resi: "Reso gratuito entro 14 giorni. Rimborso completo senza domande.",
    },
    variants: [
      {
        _uid: uid(),
        id: firstVariantId,
        label: "Bottiglia 500 ml",
        priceCents: 1500,
        _priceText: "15.00",
        sku: makeSuggestedSku(id, firstVariantId),
        imageSrc: "",
        imageAlt: "",
        specs: {},
        _specRows: [],
      },
    ],
  };

  (prod as { _specRows?: SpecsRow[] })._specRows = specsToRows(prod.specs);
  prod.variants = prod.variants.map((v) => ({
    ...v,
    _specRows: specsToRows(v.specs),
    _priceText: centsToEuroText(v.priceCents),
  }));

  return prod;
}

function makeNewVariantTemplate(productId: string, existingIds: Set<string>): Variant {
  let id = `var-${Date.now()}`;
  let i = 1;
  while (existingIds.has(id)) id = `var-${Date.now()}-${i++}`;

  const v: Variant = {
    _uid: uid(),
    id,
    label: "Nuovo Formato",
    priceCents: 0,
    _priceText: "0.00",
    sku: makeSuggestedSku(productId, id),
    imageSrc: "",
    imageAlt: "",
    specs: {},
    _specRows: [],
  };

  v._specRows = specsToRows(v.specs);
  v._priceText = centsToEuroText(v.priceCents);
  return v;
}

/* =========================
   FORM COMPONENTS (CLEAN, SOLID, ELEGANT)
========================= */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
  icon,
  rightAction,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          {label}
        </label>
        {rightAction}
      </div>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-neutral-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border border-neutral-200 bg-white py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-400 ${
            icon ? "pl-9 pr-3.5" : "px-3.5"
          }`}
        />
      </div>
      {hint && <p className="text-xs text-neutral-500 leading-snug">{hint}</p>}
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          {label}
        </label>
        {value.length > 0 && (
          <span className="text-xs text-neutral-400 font-mono">{value.length} car.</span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed"
      />
      {hint && <p className="text-xs text-neutral-500 leading-snug">{hint}</p>}
    </div>
  );
}

function SwitchToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`group flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
        checked
          ? "border-neutral-300 bg-white shadow-xs"
          : "border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            {label}
          </span>
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
              checked ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {checked ? "ATTIVO" : "DISATTIVO"}
          </span>
        </div>
        <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{description}</p>
      </div>

      {/* Switch pill */}
      <div
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-neutral-900" : "bg-neutral-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export default function ProductsManagerForm({ initialCatalog }: { initialCatalog: Product[] }) {
  const [catalog, setCatalog] = useState<Product[]>(() => withUids(initialCatalog || []));
  const [viewMode, setViewMode] = useState<"grid" | "edit">("grid");
  const [selectedId, setSelectedId] = useState<string>(() => String(withUids(initialCatalog || [])[0]?.id || ""));
  const [draft, setDraft] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "variants" | "specs" | "purchase">("general");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Filtri & ricerca
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft">("all");

  // Specifiche in bozza
  const [productSpecsRows, setProductSpecsRows] = useState<SpecsRow[]>([]);

  // Dialogs
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({ id: "", title: "", category: "Olio" });
  const [deleteProductStep, setDeleteProductStep] = useState<0 | 1 | 2>(0);
  const [deleteVariantStep, setDeleteVariantStep] = useState<0 | 1 | 2>(0);
  const [pendingDeleteVariantId, setPendingDeleteVariantId] = useState<string | null>(null);

  // Varianti espanse
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

  const toggleVariantExpanded = (id: string) => {
    setExpandedVariants((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Categorie uniche estratte dal catalogo
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const p of catalog) {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    }
    return Array.from(set);
  }, [catalog]);

  // Lista filtrata
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return catalog.filter((p) => {
      // Testo di ricerca
      if (qq) {
        const t = String(p?.title || "").toLowerCase();
        const id = String(p?.id || "").toLowerCase();
        const slug = String(p?.slug || "").toLowerCase();
        const cat = String(p?.category || "").toLowerCase();
        const skus = (p?.variants || []).map((v) => String(v.sku || "").toLowerCase()).join(" ");
        const match = t.includes(qq) || id.includes(qq) || slug.includes(qq) || cat.includes(qq) || skus.includes(qq);
        if (!match) return false;
      }
      // Filtro categoria
      if (selectedCategory !== "all" && String(p?.category || "").trim() !== selectedCategory) {
        return false;
      }
      // Filtro stato
      if (selectedStatus === "published" && p.isPublished === false) return false;
      if (selectedStatus === "draft" && p.isPublished !== false) return false;

      return true;
    });
  }, [catalog, q, selectedCategory, selectedStatus]);

  const selected = useMemo(() => {
    return catalog.find((p) => String(p?.id) === String(selectedId)) || null;
  }, [catalog, selectedId]);

  // Sincronizzazione draft con selezione
  useEffect(() => {
    if (!selected) {
      setDraft(null);
      setProductSpecsRows([]);
      return;
    }
    const d = clone(selected);
    setDraft(d);
    setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || specsToRows(d.specs));
  }, [selected, selectedId]);

  // Sincronizzazione specs nel draft
  useEffect(() => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      (next as { _specRows?: SpecsRow[] })._specRows = productSpecsRows;
      next.specs = rowsToSpecs(productSpecsRows);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(productSpecsRows)]);

  // Calcolo se ci sono modifiche non salvate (dirty)
  const dirty = useMemo(() => {
    if (!selected && !draft) return false;
    if (!selected || !draft) return true;
    return JSON.stringify(stripUis(selected)) !== JSON.stringify(stripUis(draft));
  }, [selected, draft]);

  function patchDraft(patch: Partial<Product>) {
    setDraft((prev) => (prev ? ({ ...prev, ...patch } as Product) : prev));
  }

  function patchVariant(variantId: string, patch: Partial<Variant>) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.variants = (next.variants || []).map((v) =>
        String(v.id) === String(variantId) ? ({ ...v, ...patch } as Variant) : v
      );
      return next;
    });
  }

  // Chiamate API
  async function persistCatalog(nextCatalog: Product[]) {
    const payloadCatalog = (nextCatalog || []).map((p) => stripUis(p));
    const res = await adminFetch("/api/admin/catalog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "saveCatalog", catalog: payloadCatalog }),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    return { catalog: withUids(json.catalog || []), backupName: json.backupName as string | undefined };
  }

  async function moveProduct(productId: string, dir: -1 | 1, e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (busy) return;
    if (q.trim() || selectedCategory !== "all" || selectedStatus !== "all") {
      setMsg({ text: "Disattiva i filtri per riordinare la posizione nel catalogo.", type: "error" });
      return;
    }

    const from = catalog.findIndex((p) => String(p.id) === String(productId));
    if (from < 0) return;
    const to = from + dir;
    if (to < 0 || to >= catalog.length) return;

    const prev = catalog;
    const next = clone(catalog);
    const tmp = next[from];
    next[from] = next[to];
    next[to] = tmp;

    setCatalog(next);
    setMsg(null);
    setBusy(true);
    try {
      const saved = await persistCatalog(next);
      setCatalog(saved.catalog);
      setMsg({ text: "Ordine prodotti salvato.", type: "success" });
    } catch (err: unknown) {
      setCatalog(prev);
      setMsg({ text: (err as Error)?.message || "Errore salvataggio ordine.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  function moveVariant(variantId: string, dir: -1 | 1) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const idx = (next.variants || []).findIndex((v) => String(v.id) === String(variantId));
      if (idx < 0) return prev;
      const j = idx + dir;
      if (j < 0 || j >= (next.variants || []).length) return prev;
      const arr = [...(next.variants || [])];
      const t = arr[idx];
      arr[idx] = arr[j];
      arr[j] = t;
      next.variants = arr;
      return next;
    });
  }

  function addVariantLocal() {
    if (!draft) return;
    const ids = new Set((draft.variants || []).map((v) => String(v.id)));
    const v = makeNewVariantTemplate(String(draft.id || ""), ids);
    setDraft((prev) => (prev ? { ...prev, variants: [...(prev.variants || []), v] } : prev));
    setExpandedVariants((prev) => ({ ...prev, [v.id]: true }));
  }

  function duplicateVariantLocal(variantId: string) {
    if (!draft) return;
    const target = (draft.variants || []).find((v) => String(v.id) === String(variantId));
    if (!target) return;

    const ids = new Set((draft.variants || []).map((v) => String(v.id)));
    let newId = `${target.id}-copia`;
    let i = 1;
    while (ids.has(newId)) newId = `${target.id}-copia-${i++}`;

    const newV: Variant = {
      ...clone(target),
      _uid: uid(),
      id: newId,
      label: `${target.label || "Variante"} (Copia)`,
      sku: makeSuggestedSku(String(draft.id || ""), newId),
      _priceText: target._priceText ?? centsToEuroText(target.priceCents),
    };

    setDraft((prev) => (prev ? { ...prev, variants: [...(prev.variants || []), newV] } : prev));
    setExpandedVariants((prev) => ({ ...prev, [newId]: true }));
    setMsg({ text: `Variante "${target.label || target.id}" duplicata.`, type: "success" });
  }

  function askDeleteVariant(variantId: string) {
    setPendingDeleteVariantId(variantId);
    setDeleteVariantStep(1);
  }

  function deleteVariantLocal(variantId: string) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.variants = (next.variants || []).filter((v) => String(v.id) !== String(variantId));
      return next;
    });
    setPendingDeleteVariantId(null);
    setDeleteVariantStep(0);
  }

  const saveProduct = useCallback(async () => {
    if (!draft || !selected) return;

    if (!draft.id || !draft.id.trim()) {
      setMsg({ text: "Errore: l'ID del prodotto è obbligatorio.", type: "error" });
      return;
    }
    if (!draft.variants || draft.variants.length === 0) {
      setMsg({ text: "Errore: il prodotto deve contenere almeno una variante/formato.", type: "error" });
      return;
    }

    const ids = new Set<string>();
    const skus = new Set<string>();
    for (const v of draft.variants) {
      if (!v.id || !String(v.id).trim()) {
        setMsg({ text: "Errore: ogni variante deve avere un ID valido.", type: "error" });
        return;
      }
      const key = String(v.id);
      if (ids.has(key)) {
        setMsg({ text: `Errore: ID variante duplicato (${key}).`, type: "error" });
        return;
      }
      ids.add(key);

      const sku = String(v.sku || "").trim();
      if (!sku) {
        setMsg({ text: `Errore: SKU mancante per il formato "${v.label || key}".`, type: "error" });
        return;
      }
      if (skus.has(sku)) {
        setMsg({ text: `Errore: SKU duplicato (${sku}).`, type: "error" });
        return;
      }
      skus.add(sku);
    }

    setBusy(true);
    setMsg(null);

    try {
      const d2 = clone(draft);
      d2.specs = rowsToSpecs(productSpecsRows);

      d2.variants = (d2.variants || []).map((v) => {
        const vv = { ...v };
        if (typeof vv._priceText === "string") {
          const cents = parseEuroTextToCents(vv._priceText);
          if (typeof cents === "number") vv.priceCents = cents;
        }
        if (Array.isArray(vv._specRows)) vv.specs = rowsToSpecs(vv._specRows);
        return vv;
      });

      const payload = stripUis(d2);

      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "updateProduct", productId: selected.id, patch: payload }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      const next = withUids(json.catalog || []);
      setCatalog(next);

      const newId = String(payload.id);
      setSelectedId(newId);

      const updated = next.find((p: Product) => String(p?.id) === newId) || null;
      if (updated) {
        const d = clone(updated);
        setDraft(d);
        setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || []);
      }

      setMsg({
        text: json.backupName
          ? `Prodotto "${payload.title || payload.id}" salvato. Backup: ${json.backupName}`
          : `Prodotto "${payload.title || payload.id}" salvato correttamente.`,
        type: "success",
      });
    } catch (err: unknown) {
      setMsg({ text: (err as Error)?.message || "Errore durante il salvataggio.", type: "error" });
    } finally {
      setBusy(false);
    }
  }, [draft, selected, productSpecsRows]);

  // Gestione tasti rapidi: Ctrl+S o Cmd+S per salvare quando in modalità edit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        if (viewMode === "edit" && dirty && !busy) {
          e.preventDefault();
          saveProduct();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, dirty, busy, saveProduct]);

  async function handleCreateProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newProductForm.title.trim()) {
      setMsg({ text: "Inserisci un titolo per il prodotto.", type: "error" });
      return;
    }

    const forcedId = newProductForm.id.trim()
      ? normalizeId(newProductForm.id)
      : normalizeId(newProductForm.title);

    if (!forcedId) {
      setMsg({ text: "Impossibile generare un ID valido.", type: "error" });
      return;
    }

    if (catalog.some((p) => p.id === forcedId)) {
      setMsg({ text: `Esiste già un prodotto con ID "${forcedId}". Scegline un altro.`, type: "error" });
      return;
    }

    setBusy(true);
    setMsg(null);

    try {
      const product = makeNewProductTemplate(forcedId, newProductForm.title, newProductForm.category);

      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "createProduct", product: stripUis(product) }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      const next = withUids(json.catalog || []);
      setCatalog(next);

      const created = next.find((p) => String(p.id) === String(product.id)) || next[0] || null;
      if (created) {
        setSelectedId(String(created.id));
        const d = clone(created);
        setDraft(d);
        setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || []);
      }

      setNewProductModalOpen(false);
      setNewProductForm({ id: "", title: "", category: "Olio" });
      setViewMode("edit");
      setActiveTab("general");
      setMsg({ text: `Prodotto "${product.title}" creato con successo.`, type: "success" });
    } catch (err: unknown) {
      setMsg({ text: (err as Error)?.message || "Errore durante la creazione del prodotto.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function deleteSelectedProduct() {
    if (!selected) return;
    setBusy(true);
    setMsg(null);

    try {
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "deleteProduct", productId: selected.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      const next = withUids(json.catalog || []);
      setCatalog(next);

      const nextId = next[0]?.id || "";
      setSelectedId(nextId);

      const nextSelected = next.find((p) => String(p?.id) === String(nextId)) || null;
      if (nextSelected) {
        const d = clone(nextSelected);
        setDraft(d);
        setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || []);
      } else {
        setDraft(null);
        setProductSpecsRows([]);
      }

      setViewMode("grid");
      setMsg({ text: "Prodotto eliminato con successo dal catalogo.", type: "success" });
    } catch (err: unknown) {
      setMsg({ text: (err as Error)?.message || "Errore durante l'eliminazione del prodotto.", type: "error" });
    } finally {
      setBusy(false);
      setDeleteProductStep(0);
    }
  }

  function handleOpenEdit(id: string) {
    setSelectedId(id);
    const prod = catalog.find((p) => String(p.id) === String(id));
    if (prod) {
      const d = clone(prod);
      setDraft(d);
      setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || specsToRows(d.specs));
    }
    setViewMode("edit");
    setActiveTab("general");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Generatore di slug automatico dal titolo
  function generateSlugFromTitle() {
    if (!draft?.title) return;
    const generated = normalizeId(draft.title);
    patchDraft({ slug: generated });
  }

  // Aggiungi una riga specifica suggerita
  function addPresetSpec(key: string) {
    if (productSpecsRows.some((r) => r.k.toLowerCase() === key.toLowerCase())) return;
    setProductSpecsRows((prev) => [...prev, { _rid: uid(), k: key, v: "" }]);
  }

  // Conteggi per le card
  const totalPublishedCount = useMemo(() => catalog.filter((p) => p.isPublished !== false).length, [catalog]);
  const totalVariantsCount = useMemo(
    () => catalog.reduce((acc, p) => acc + (p.variants?.length || 0), 0),
    [catalog]
  );

  return (
    <div className="space-y-4 font-sans antialiased">
      {/* =========================================================
          BANNER NOTIFICA DI STATO
      ========================================================= */}
      {msg && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all animate-in fade-in duration-200 ${
            msg.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {msg.type === "success" ? (
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
          <button
            onClick={() => setMsg(null)}
            className="rounded-lg p-1 text-neutral-400 hover:bg-black/5 hover:text-neutral-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================
          VISTA 1: CATALOGO A BOX / GRIGLIA PRODOTTI
      ========================================================= */}
      {viewMode === "grid" && (
        <div className="space-y-4">
          {/* Header Barra Strumenti & Filtri */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3.5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Statistiche rapide sobrie */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-800">
                  <Boxes className="h-3.5 w-3.5 text-neutral-500" />
                  {catalog.length} Prodotti
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                  <Eye className="h-3.5 w-3.5 text-emerald-600" />
                  {totalPublishedCount} Pubblicati
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-700">
                  <Package className="h-3.5 w-3.5 text-neutral-500" />
                  {totalVariantsCount} Formati Totali
                </span>
              </div>

              {/* Pulsante Nuovo Prodotto Elegante Scuro */}
              <button
                onClick={() => {
                  setNewProductForm({ id: "", title: "", category: "Olio" });
                  setNewProductModalOpen(true);
                }}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Nuovo Prodotto</span>
              </button>
            </div>

            {/* Barra Ricerca & Filtri Categoria / Stato */}
            <div className="grid gap-2.5 sm:grid-cols-1 md:grid-cols-[1fr,auto,auto]">
              {/* Input Cerca */}
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cerca per titolo, ID, slug o SKU…"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 pl-9.5 pr-8 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                />
                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="absolute right-2.5 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filtro Categoria */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Tutte le Categorie
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filtro Stato Pubblicato/Bozza */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                <button
                  onClick={() => setSelectedStatus("all")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === "all" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Tutti
                </button>
                <button
                  onClick={() => setSelectedStatus("published")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === "published"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Pubblicati
                </button>
                <button
                  onClick={() => setSelectedStatus("draft")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === "draft"
                      ? "bg-white text-neutral-800 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Bozze
                </button>
              </div>
            </div>
          </div>

          {/* Griglia a Box dei Prodotti */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
              <Package className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
              <h3 className="text-base font-bold text-neutral-800">Nessun prodotto trovato</h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                Nessun prodotto corrisponde ai criteri di ricerca o ai filtri selezionati. Prova a rimuovere i filtri.
              </p>
              {(q || selectedCategory !== "all" || selectedStatus !== "all") && (
                <button
                  onClick={() => {
                    setQ("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reimposta filtri
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => {
                const idx = catalog.findIndex((x) => String(x.id) === String(p.id));
                const canReorder = !busy && !q.trim() && selectedCategory === "all" && selectedStatus === "all";
                const canUp = canReorder && idx > 0;
                const canDown = canReorder && idx >= 0 && idx < catalog.length - 1;

                // Calcolo range prezzi varianti
                const prices = (p.variants || [])
                  .map((v) => (typeof v.priceCents === "number" ? v.priceCents : parseEuroTextToCents(v._priceText || "") || 0))
                  .filter((pr) => pr > 0);
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

                const isPublished = p.isPublished !== false;
                const isPurchasable = p.isPurchasable !== false;

                return (
                  <div
                    key={String(p.id)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
                  >
                    {/* Header Card: Immagine + Categoria/Badge */}
                    <div>
                      <div className="relative mb-3 flex items-start gap-3">
                        {/* Thumbnail Immagine */}
                        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                          {p.imageSrc || p.variants?.[0]?.imageSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.imageSrc || p.variants?.[0]?.imageSrc}
                              alt={p.imageAlt || p.title || "Prodotto"}
                              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-300">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                          {/* Badge Ordine Posizione */}
                          <span className="absolute bottom-1 right-1 rounded-md bg-neutral-900/80 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Titolo e Categoria */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {p.category && (
                              <span className="inline-flex rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-700">
                                {p.category}
                              </span>
                            )}
                            {p.badge && (
                              <span className="inline-flex rounded-md bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-800">
                                {p.badge}
                              </span>
                            )}
                          </div>

                          <h4
                            onClick={() => handleOpenEdit(String(p.id))}
                            className="mt-1 line-clamp-1 text-sm font-extrabold tracking-tight text-neutral-900 group-hover:text-neutral-700 cursor-pointer"
                            title={p.title || p.id}
                          >
                            {p.title || p.id}
                          </h4>

                          <div className="mt-0.5 flex items-center gap-1 text-[11px] font-mono text-neutral-400 truncate">
                            <span>{p.id}</span>
                            {p.slug && p.slug !== p.id && (
                              <>
                                <span>•</span>
                                <span className="truncate">/{p.slug}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pill Stato Visibilità */}
                      <div className="mb-3 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isPublished ? "bg-emerald-500" : "bg-neutral-400"
                            }`}
                          />
                          {isPublished ? "Pubblicato" : "Bozza"}
                        </span>

                        {isPurchasable ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/50 px-2 py-0.5 text-[10px] font-bold">
                            <ShoppingBag className="h-3 w-3" />
                            Acquistabile
                          </span>
                        ) : null}

                        {p.excludeFromSeo && (
                          <span className="inline-flex items-center rounded-lg bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500">
                            No-SEO
                          </span>
                        )}
                      </div>

                      {/* Info Prezzo e Varianti Formato */}
                      <div className="rounded-xl bg-neutral-50 p-2.5 mb-3 flex items-center justify-between gap-2 border border-neutral-100">
                        <div className="min-w-0">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Prezzo
                          </span>
                          <span className="text-xs font-extrabold text-neutral-900">
                            {minPrice === 0
                              ? "—"
                              : minPrice === maxPrice
                              ? formatCentsToEuroDisplay(minPrice)
                              : `${formatCentsToEuroDisplay(minPrice)} – ${formatCentsToEuroDisplay(maxPrice)}`}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Formati
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700">
                            <Layers className="h-3 w-3 text-neutral-400" />
                            {(p.variants || []).length} {p.variants?.length === 1 ? "var." : "var."}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Card: Azioni Rapide */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                      {/* Pulsante Modifica principale */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(String(p.id))}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-neutral-800 active:scale-98 cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Modifica</span>
                      </button>

                      {/* Riordino su/giù */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title={canReorder ? "Sposta su" : "Disattiva filtri per riordinare"}
                          disabled={!canUp}
                          onClick={(e) => moveProduct(String(p.id), -1, e)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 transition-all cursor-pointer font-bold"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title={canReorder ? "Sposta giù" : "Disattiva filtri per riordinare"}
                          disabled={!canDown}
                          onClick={(e) => moveProduct(String(p.id), 1, e)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 transition-all cursor-pointer font-bold"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          VISTA 2: MODALITÀ MODIFICA PRODOTTO (ELEGANTE & PULITA)
      ========================================================= */}
      {viewMode === "edit" && draft && (
        <div className="space-y-4">
          {/* Header Azioni & Navigazione (NON-STICKY) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Sinistra: Torna indietro + Titolo + Dropdown cambio rapido */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Lista</span>
              </button>

              <div className="h-4 w-px bg-neutral-200" />

              {/* Selettore cambio rapido prodotto */}
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline text-xs font-bold text-neutral-500">Prodotto:</span>
                <select
                  value={String(draft.id)}
                  onChange={(e) => handleOpenEdit(e.target.value)}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-extrabold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer max-w-[200px] truncate"
                >
                  {catalog.map((prod) => (
                    <option key={String(prod.id)} value={String(prod.id)}>
                      {prod.title || prod.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Indicatore di stato salvataggio */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                {dirty ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 font-bold text-amber-700 border border-amber-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Modifiche non salvate
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                    <Check className="h-3 w-3" />
                    Salvato
                  </span>
                )}
              </div>
            </div>

            {/* Destra: Pulsanti Salva / Vedi nello Shop / Elimina */}
            <div className="flex items-center gap-2">
              {draft.slug && (
                <a
                  href={`/shop/${draft.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Vedi nello Shop</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setDeleteProductStep(1)}
                disabled={busy || !selected}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Elimina</span>
              </button>

              <button
                type="button"
                onClick={saveProduct}
                disabled={busy || !dirty || !draft}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold text-white shadow-xs transition-all active:scale-98 cursor-pointer ${
                  dirty
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    : "bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50"
                }`}
              >
                <Save className="h-3.5 w-3.5" />
                <span>Salva Modifiche</span>
              </button>
            </div>
          </div>

          {/* Schede di Navigazione dell'Editor */}
          <div className="flex border-b border-neutral-200 bg-white px-3 pt-2 rounded-t-2xl overflow-x-auto no-scrollbar gap-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "general"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>1. Dati Principali & Visibilità</span>
            </button>

            <button
              onClick={() => setActiveTab("variants")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "variants"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>2. Formati & Prezzi</span>
              <span className="ml-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
                {(draft.variants || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "specs"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>3. Scheda Tecnica & Specifiche</span>
              <span className="ml-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
                {productSpecsRows.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("purchase")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "purchase"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>4. Info Acquisto & Spedizione</span>
            </button>
          </div>

          {/* Contenuto Tab Attiva */}
          <div className="rounded-b-2xl rounded-tr-none border border-t-0 border-neutral-200 bg-white p-5 shadow-xs">
            {/* ----------------------------------------------------
                TAB 1: DATI GENERALI & VISIBILITÀ
            ---------------------------------------------------- */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Dati Anagrafici Prodotto */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <h3 className="text-sm font-extrabold text-neutral-900">Anagrafica Prodotto</h3>
                    <span className="text-[11px] text-neutral-400 font-mono">ID: {draft.id}</span>
                  </div>

                  <div className="grid gap-3.5 md:grid-cols-2">
                    <FormInput
                      label="Titolo Prodotto *"
                      value={String(draft.title || "")}
                      onChange={(v) => patchDraft({ title: v })}
                      placeholder="Es: Olio EVO 500 ml"
                    />

                    <FormInput
                      label="Categoria"
                      value={String(draft.category || "")}
                      onChange={(v) => patchDraft({ category: v })}
                      placeholder="Es: Olio, Condimenti, Pacchi Regalo"
                    />

                    <FormInput
                      label="Sottotitolo / Didascalia"
                      value={String(draft.subtitle || "")}
                      onChange={(v) => patchDraft({ subtitle: v })}
                      placeholder="Es: Olio extravergine di oliva toscano"
                    />

                    <FormInput
                      label="Badge Etichetta (in evidenza)"
                      value={String(draft.badge || "")}
                      onChange={(v) => patchDraft({ badge: v })}
                      placeholder="Es: EVO, BIO, NOVITÀ"
                    />

                    <FormInput
                      label="ID Prodotto (Univoco Interno) *"
                      value={String(draft.id || "")}
                      onChange={(v) => patchDraft({ id: normalizeId(v) })}
                      hint="Identificatore univoco nel database. Non usare spazi."
                    />

                    <FormInput
                      label="Slug URL Pubblico *"
                      value={String(draft.slug || "")}
                      onChange={(v) => patchDraft({ slug: normalizeId(v) })}
                      hint="Indirizzo URL della pagina: /shop/[slug]"
                      rightAction={
                        <button
                          type="button"
                          onClick={generateSlugFromTitle}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        >
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          Genera da titolo
                        </button>
                      }
                    />
                  </div>
                </div>

                {/* Immagine Principale con Anteprima */}
                <div className="space-y-3.5 border-t border-neutral-100 pt-5">
                  <h3 className="text-sm font-extrabold text-neutral-900">Immagine Principale del Prodotto</h3>
                  <div className="grid gap-4 md:grid-cols-[120px,1fr]">
                    {/* Visual Preview */}
                    <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center shrink-0">
                      {draft.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={draft.imageSrc}
                          alt={draft.imageAlt || draft.title || "Anteprima"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center p-2 text-neutral-300">
                          <ImageIcon className="mx-auto h-6 w-6 mb-1" />
                          <span className="text-[9px] font-bold">Nessuna foto</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <FormInput
                        label="Percorso / URL Immagine"
                        value={String(draft.imageSrc || "")}
                        onChange={(v) => patchDraft({ imageSrc: v })}
                        placeholder="Es: /products/EVO-750-ml-gpt.png o URL esterno"
                        hint="Inserisci il percorso relativo in /public o un link immagine completo."
                      />
                      <FormInput
                        label="Testo Alternativo (Alt per accessibilità e SEO)"
                        value={String(draft.imageAlt || "")}
                        onChange={(v) => patchDraft({ imageAlt: v })}
                        placeholder="Es: Bottiglia di Olio EVO Del Pasqua da 500 ml"
                      />
                    </div>
                  </div>
                </div>

                {/* Descrizione Prodotto */}
                <div className="space-y-3 border-t border-neutral-100 pt-5">
                  <h3 className="text-sm font-extrabold text-neutral-900">Descrizione del Prodotto</h3>
                  <FormTextarea
                    label="Testo descrittivo completo"
                    value={String(draft.description || "")}
                    onChange={(v) => patchDraft({ description: v })}
                    placeholder="Descrivi dettagliatamente il prodotto, la lavorazione, le note olfattive e di gusto..."
                    rows={4}
                    hint="Questo testo apparirà nella scheda prodotto sotto il titolo principale."
                  />
                </div>

                {/* Visibilità & Indicizzazione (Toggle Switch) */}
                <div className="space-y-3 border-t border-neutral-100 pt-5">
                  <h3 className="text-sm font-extrabold text-neutral-900">Visibilità & Impostazioni Negozio</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <SwitchToggle
                      label="Pubblicato"
                      description="Se attivo, il prodotto è visibile nello shop e nel catalogo."
                      checked={draft.isPublished !== false}
                      onChange={(val) => patchDraft({ isPublished: val })}
                    />

                    <SwitchToggle
                      label="Acquistabile"
                      description="Permette ai clienti di aggiungere il prodotto al carrello e fare il checkout."
                      checked={draft.isPurchasable !== false}
                      onChange={(val) => patchDraft({ isPurchasable: val })}
                    />

                    <SwitchToggle
                      label="Indicizzato SEO"
                      description="Consente a Google e motori di ricerca di indicizzare la scheda prodotto."
                      checked={draft.excludeFromSeo !== true}
                      onChange={(val) => patchDraft({ excludeFromSeo: !val })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 2: FORMATI & VARIANTI
            ---------------------------------------------------- */}
            {activeTab === "variants" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-900">Formati e Varianti del Prodotto</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Ogni prodotto può avere più formati (es. 500ml, Latta 3L, Latta 5L) con prezzo e SKU specifici.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantLocal}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-neutral-800 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Aggiungi Formato</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {(draft.variants || []).map((v, vi) => {
                    const isOpen = expandedVariants[v.id] !== false;
                    const priceStr = String(v._priceText ?? centsToEuroText(v.priceCents));
                    const centsVal = parseEuroTextToCents(priceStr) ?? (v.priceCents || 0);

                    return (
                      <div
                        key={String(v._uid || v.id)}
                        className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/30 transition-all duration-200 hover:border-neutral-300 hover:shadow-xs"
                      >
                        {/* Header Riga Formato */}
                        <div
                          onClick={() => toggleVariantExpanded(String(v.id))}
                          className="flex cursor-pointer items-center justify-between gap-3 bg-white px-4 py-3 select-none hover:bg-neutral-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 font-extrabold text-xs shrink-0">
                              {vi + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neutral-900 truncate">
                                  {v.label || "Nuovo Formato"}
                                </span>
                                {v.sku && (
                                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-neutral-600 uppercase">
                                    {v.sku}
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                                <span>ID: {v.id}</span>
                                <span>•</span>
                                <span className="font-bold text-neutral-900 font-sans">
                                  {formatCentsToEuroDisplay(centsVal)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Azioni rapide formato: su/giù, duplica, elimina, toggle */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => duplicateVariantLocal(String(v.id))}
                              title="Duplica questo formato"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 transition-all cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveVariant(String(v.id), -1)}
                              disabled={busy || vi === 0}
                              title="Sposta su"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 transition-all cursor-pointer"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveVariant(String(v.id), 1)}
                              disabled={busy || vi === (draft.variants || []).length - 1}
                              title="Sposta giù"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 transition-all cursor-pointer"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => askDeleteVariant(String(v.id))}
                              disabled={busy || (draft.variants || []).length <= 1}
                              title={(draft.variants || []).length <= 1 ? "Il prodotto deve avere almeno 1 formato" : "Elimina"}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-30 transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            <div className="ml-1 flex h-7 w-7 items-center justify-center text-neutral-400">
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Corpo Formato Dettaglio (Espandibile) */}
                        {isOpen && (
                          <div className="p-4 bg-white border-t border-neutral-100 space-y-4">
                            <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
                              <FormInput
                                label="Nome / Label Formato *"
                                value={String(v.label || "")}
                                placeholder="Es: Bottiglia 500 ml, Latta 3 L"
                                onChange={(val) => patchVariant(String(v.id), { label: val })}
                              />

                              {/* Input Prezzo con simbolo Euro */}
                              <FormInput
                                label="Prezzo al pubblico (€) *"
                                value={priceStr}
                                placeholder="Es: 15.00"
                                onChange={(val) => patchVariant(String(v.id), { _priceText: val })}
                                icon={<span className="font-bold text-xs text-neutral-600">€</span>}
                                hint={`Corrisponde a: ${formatCentsToEuroDisplay(centsVal)}`}
                              />

                              <FormInput
                                label="SKU Commerciale *"
                                value={String(v.sku || "")}
                                placeholder="Es: EVO-B-500ML"
                                onChange={(val) => patchVariant(String(v.id), { sku: val })}
                                rightAction={
                                  <button
                                    type="button"
                                    onClick={() =>
                                      patchVariant(String(v.id), {
                                        sku: makeSuggestedSku(String(draft.id || ""), String(v.id)),
                                      })
                                    }
                                    className="text-[10px] font-bold text-neutral-500 hover:text-neutral-900"
                                  >
                                    Auto-SKU
                                  </button>
                                }
                              />

                              <FormInput
                                label="ID Variante (univoco) *"
                                value={String(v.id || "")}
                                placeholder="Es: 500ml, 3lt, latta-5l"
                                onChange={(val) => patchVariant(String(v.id), { id: normalizeId(val) })}
                              />

                              <FormInput
                                label="Titolo Custom Variante (opzionale)"
                                value={String(v.title || "")}
                                placeholder="Es: Olio EVO in Latta da 3 Litri"
                                onChange={(val) => patchVariant(String(v.id), { title: val })}
                              />

                              <FormInput
                                label="URL Immagine Variante (opzionale)"
                                value={String(v.imageSrc || "")}
                                placeholder="Es: /products/EVO-latta-3lt.png"
                                onChange={(val) => patchVariant(String(v.id), { imageSrc: val })}
                              />
                            </div>

                            {/* Anteprima Miniatura Immagine Variante */}
                            {v.imageSrc && (
                              <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-2.5">
                                <div className="h-10 w-10 overflow-hidden rounded-lg border border-neutral-200 bg-white shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={v.imageSrc}
                                    alt={v.imageAlt || v.label || "Immagine variante"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="block text-[10px] font-bold uppercase text-neutral-500">
                                    Immagine dedicata formato
                                  </span>
                                  <span className="block text-[11px] text-neutral-700 truncate font-mono">
                                    {v.imageSrc}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Specifiche specifiche per questo formato */}
                            <div className="pt-3 border-t border-neutral-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-700">
                                  Specifiche dedicate formato (opzionali)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const curr = Array.isArray(v._specRows) ? v._specRows : specsToRows(v.specs);
                                    patchVariant(String(v.id), {
                                      _specRows: [...curr, { _rid: uid(), k: "", v: "" }],
                                    });
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-200 bg-neutral-50 px-2 py-1 rounded-lg"
                                >
                                  <Plus className="h-3 w-3" />
                                  Aggiungi Specifica
                                </button>
                              </div>

                              {(Array.isArray(v._specRows) ? v._specRows : specsToRows(v.specs)).map((r, sidx, arr) => (
                                <div key={r._rid} className="grid grid-cols-[1fr,1fr,auto] gap-2 mb-2">
                                  <input
                                    value={r.k}
                                    onChange={(e) => {
                                      const next = clone(arr);
                                      next[sidx].k = e.target.value;
                                      patchVariant(String(v.id), { _specRows: next });
                                    }}
                                    placeholder="Parametro (es: Peso netto)"
                                    className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs focus:border-neutral-900 focus:outline-none"
                                  />
                                  <input
                                    value={r.v}
                                    onChange={(e) => {
                                      const next = clone(arr);
                                      next[sidx].v = e.target.value;
                                      patchVariant(String(v.id), { _specRows: next });
                                    }}
                                    placeholder="Valore (es: 460 g)"
                                    className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs focus:border-neutral-900 focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = arr.filter((x) => x._rid !== r._rid);
                                      patchVariant(String(v.id), { _specRows: next });
                                    }}
                                    className="rounded-xl border border-red-200 bg-red-50 px-2 text-xs font-bold text-red-600 hover:bg-red-100"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 3: SPECIFICHE TECNICHE
            ---------------------------------------------------- */}
            {activeTab === "specs" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-900">
                      Scheda Tecnica & Specifiche del Prodotto
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Inserisci i parametri organolettici e tecnici visibili nella tabella della scheda prodotto.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProductSpecsRows((prev) => [...prev, { _rid: uid(), k: "", v: "" }])}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-neutral-800 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Aggiungi Riga</span>
                  </button>
                </div>

                {/* Titolo Personalizzato della Sezione Specifiche */}
                <div className="max-w-md">
                  <FormInput
                    label="Titolo Sezione Specifiche (su Scheda Prodotto)"
                    value={String(draft.specsTitle || "")}
                    onChange={(v) => patchDraft({ specsTitle: v })}
                    placeholder="Specifiche Tecniche (default)"
                    hint="Puoi personalizzare il titolo del blocco (es. 'Caratteristiche Organolettiche')."
                  />
                </div>

                {/* Suggerimenti Rapidi Chiavi Comuni (Click to Add) */}
                <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Parametri suggeriti a 1 click:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SPECS_PRESETS.map((preset) => {
                      const alreadyAdded = productSpecsRows.some(
                        (r) => r.k.toLowerCase() === preset.toLowerCase()
                      );
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => addPresetSpec(preset)}
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            alreadyAdded
                              ? "bg-neutral-200/60 text-neutral-400 cursor-default"
                              : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white shadow-2xs"
                          }`}
                        >
                          + {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tabella Righe Specifiche */}
                <div className="space-y-2.5">
                  {productSpecsRows.map((r, idx) => (
                    <div
                      key={r._rid}
                      className="grid grid-cols-[1fr,1.5fr,auto] items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white p-2.5"
                    >
                      <input
                        value={r.k}
                        onChange={(e) => {
                          const next = clone(productSpecsRows);
                          next[idx].k = e.target.value;
                          setProductSpecsRows(next);
                        }}
                        placeholder="Nome parametro (es: Cultivar)"
                        className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                      />
                      <input
                        value={r.v}
                        onChange={(e) => {
                          const next = clone(productSpecsRows);
                          next[idx].v = e.target.value;
                          setProductSpecsRows(next);
                        }}
                        placeholder="Valore (es: Frantoio, Moraiolo, Leccino)"
                        className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProductSpecsRows((prev) => prev.filter((x) => x._rid !== r._rid));
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {productSpecsRows.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-xs text-neutral-500">
                      Nessuna specifica tecnica aggiunta. Usa i pulsanti suggeriti in alto o clicca su &quot;Aggiungi Riga&quot;.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 4: INFO ACQUISTO & SPEDIZIONE
            ---------------------------------------------------- */}
            {activeTab === "purchase" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-neutral-100 pb-3">
                  <h3 className="text-sm font-extrabold text-neutral-900">
                    Testi delle Schede d&apos;Acquisto (Purchase Info)
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Questi 4 box informativi appaiono nelle tab riassuntive sotto il pulsante d&apos;acquisto nella pagina shop.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Caratteristiche */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-800">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span>Caratteristiche Principali</span>
                    </div>
                    <FormTextarea
                      label="Testo scheda"
                      value={String(draft.purchaseInfo?.caratteristiche || "")}
                      onChange={(v) =>
                        patchDraft({
                          purchaseInfo: { ...draft.purchaseInfo, caratteristiche: v },
                        })
                      }
                      rows={3}
                      placeholder="Descrivi l'estrazione, l'acidità e le proprietà..."
                    />
                  </div>

                  {/* Imballaggio */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-800">
                      <Package className="h-4 w-4 text-amber-600" />
                      <span>Imballaggio e Protezione</span>
                    </div>
                    <FormTextarea
                      label="Testo scheda"
                      value={String(draft.purchaseInfo?.imballaggio || "")}
                      onChange={(v) =>
                        patchDraft({
                          purchaseInfo: { ...draft.purchaseInfo, imballaggio: v },
                        })
                      }
                      rows={3}
                      placeholder="Descrivi il contenitore (vetro scuro, latta) e la confezione..."
                    />
                  </div>

                  {/* Spedizione */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-800">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Spedizione e Tempi di Consegna</span>
                    </div>
                    <FormTextarea
                      label="Testo scheda"
                      value={String(draft.purchaseInfo?.spedizione || "")}
                      onChange={(v) =>
                        patchDraft({
                          purchaseInfo: { ...draft.purchaseInfo, spedizione: v },
                        })
                      }
                      rows={3}
                      placeholder="Tempi di consegna, tracking e soglia spedizione gratuita..."
                    />
                  </div>

                  {/* Resi */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-800">
                      <RotateCcw className="h-4 w-4 text-indigo-600" />
                      <span>Politica Resi e Garanzia</span>
                    </div>
                    <FormTextarea
                      label="Testo scheda"
                      value={String(draft.purchaseInfo?.resi || "")}
                      onChange={(v) =>
                        patchDraft({
                          purchaseInfo: { ...draft.purchaseInfo, resi: v },
                        })
                      }
                      rows={3}
                      placeholder="Giorni per il reso, condizioni di rimborso..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MODALE CREAZIONE NUOVO PRODOTTO
      ========================================================= */}
      {newProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">Nuovo Prodotto</h3>
                  <p className="text-xs text-neutral-500">Aggiungi un nuovo prodotto al catalogo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewProductModalOpen(false)}
                className="rounded-xl p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4">
              <FormInput
                label="Titolo Prodotto *"
                value={newProductForm.title}
                onChange={(v) => {
                  setNewProductForm((prev) => ({
                    ...prev,
                    title: v,
                    id: prev.id ? prev.id : normalizeId(v),
                  }));
                }}
                placeholder="Es: Fruttato Intenso 750 ml"
              />

              <FormInput
                label="ID Univoco (Slug)"
                value={newProductForm.id}
                onChange={(v) => setNewProductForm((prev) => ({ ...prev, id: normalizeId(v) }))}
                placeholder="Es: fruttato-intenso-750ml"
                hint="Se lasciato vuoto, verrà generato automaticamente dal titolo."
              />

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Categoria
                </label>
                <input
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Es: Olio"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
                {allCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] text-neutral-400">Esistenti:</span>
                    {allCategories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewProductForm((prev) => ({ ...prev, category: c }))}
                        className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-600 hover:bg-neutral-200"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setNewProductModalOpen(false)}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy || !newProductForm.title.trim()}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Crea e Modifica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALI DI CONFERMA ELIMINAZIONE
      ========================================================= */}
      <DoubleConfirmDialog
        open={deleteProductStep !== 0}
        title="Eliminare definitivamente il prodotto?"
        step={(deleteProductStep === 2 ? 2 : 1) as 1 | 2}
        step1Text={`Stai per eliminare "${selected?.title || selected?.id}" dal catalogo del gestionale. Premi "ELIMINA" per confermare.`}
        step2Text={`ATTENZIONE: questa operazione rimuoverà il prodotto "${selected?.title || selected?.id}" e tutte le sue varianti. Confermi?`}
        confirmLabel={deleteProductStep === 2 ? "ELIMINA DEFINITIVAMENTE" : "Conferma"}
        cancelLabel="Annulla"
        onCancel={() => setDeleteProductStep(0)}
        onBack={() => setDeleteProductStep(1)}
        onConfirm={() => {
          if (deleteProductStep === 1) setDeleteProductStep(2);
          else deleteSelectedProduct();
        }}
      />

      <DoubleConfirmDialog
        open={deleteVariantStep !== 0}
        title="Eliminare questo formato/variante?"
        step={(deleteVariantStep === 2 ? 2 : 1) as 1 | 2}
        step1Text="Stai per rimuovere questa variante dal prodotto. Premi 'ELIMINA' per continuare."
        step2Text="CONFERMA FINALE: eliminare definitivamente la variante?"
        confirmLabel={deleteVariantStep === 2 ? "ELIMINA" : "Conferma"}
        cancelLabel="Annulla"
        onCancel={() => {
          setDeleteVariantStep(0);
          setPendingDeleteVariantId(null);
        }}
        onBack={() => setDeleteVariantStep(1)}
        onConfirm={() => {
          if (deleteVariantStep === 1) setDeleteVariantStep(2);
          else if (pendingDeleteVariantId) deleteVariantLocal(pendingDeleteVariantId);
        }}
      />
    </div>
  );
}
