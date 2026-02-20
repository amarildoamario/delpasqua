"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";

type SettingsMap = Record<string, string>;

function Row({
  label,
  k,
  value,
  onChange,
  hint,
}: {
  label: string;
  k: string;
  value: string;
  onChange: (k: string, v: string) => void;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/40">
      <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</div>
      {hint ? <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</div> : null}
      <input
        value={value}
        onChange={(e) => onChange(k, e.target.value)}
        className="mt-3 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
      />
      <div className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">Key: {k}</div>
    </div>
  );
}

export default function SettingsForm({ initial }: { initial: SettingsMap }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [values, setValues] = useState<SettingsMap>({
    storeName: initial.storeName ?? "Del Pasqua",
    supportEmail: initial.supportEmail ?? "",
    shippingFlatCents: initial.shippingFlatCents ?? "0",
    freeShippingThresholdCents: initial.freeShippingThresholdCents ?? "0",
    vatRatePercent: initial.vatRatePercent ?? "0",
    orderNotificationEmail: initial.orderNotificationEmail ?? "",
    ...initial, // tiene eventuali chiavi custom
  });

  function set(k: string, v: string) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function save() {
    setSaving(true);
    try {
      // salviamo tutte le chiavi presenti
      await adminFetch("/api/admin/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Impostazioni principali
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Row label="Nome negozio" k="storeName" value={values.storeName ?? ""} onChange={set} />
          <Row label="Email supporto" k="supportEmail" value={values.supportEmail ?? ""} onChange={set} />
          <Row
            label="Costo spedizione flat (cents)"
            k="shippingFlatCents"
            value={values.shippingFlatCents ?? ""}
            onChange={set}
          />
          <Row
            label="Soglia spedizione gratuita (cents)"
            k="freeShippingThresholdCents"
            value={values.freeShippingThresholdCents ?? ""}
            onChange={set}
          />
          <Row label="IVA (%)" k="vatRatePercent" value={values.vatRatePercent ?? ""} onChange={set} />
          <Row
            label="Email notifiche ordini (opz.)"
            k="orderNotificationEmail"
            value={values.orderNotificationEmail ?? ""}
            onChange={set}
            hint="Se la userai più avanti per inviare notifiche quando arriva un ordine."
          />
        </div>

        <div className="mt-4">
          <button
            disabled={saving}
            onClick={save}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            Salva impostazioni
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Chiavi custom</div>
        <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Puoi aggiungere nuove chiavi direttamente qui (es: “analyticsProvider”, “bannerText”, ecc.)
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <AddKey onAdd={(k) => set(k, values[k] ?? "")} />
        </div>
      </div>
    </div>
  );
}

function AddKey({ onAdd }: { onAdd: (k: string) => void }) {
  const [k, setK] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={k}
        onChange={(e) => setK(e.target.value)}
        placeholder="nuovaKey"
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
      />
      <button
        type="button"
        onClick={() => {
          const kk = k.trim();
          if (!kk) return;
          onAdd(kk);
          setK("");
        }}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Aggiungi
      </button>
    </div>
  );
}
