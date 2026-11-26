"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TastingType } from "@/lib/tasting/slots";
import { cn } from "@/lib/utils";

export type AppliedVoucher = { code: string; tastingTypeId: string; people: number; children: number };

const voucherTriggerClass = "h-12 max-w-full cursor-pointer gap-2 rounded-[5px] bg-[#3D5A3D] px-5 text-base font-semibold whitespace-normal text-white shadow-sm hover:bg-[#2D4A2D] hover:shadow-md sm:h-14 sm:px-6 lg:hover:-translate-y-0.5";

export function TastingVoucherLink() {
  const t = useTranslations("TastingsCalendar.voucher");
  return (
    <a href="#calendario-degustazioni" className={cn(buttonVariants(), voucherTriggerClass)}>
      <Ticket className="size-5" aria-hidden />{t("load")}
    </a>
  );
}

export function useVoucherErrorMessage() {
  const t = useTranslations("TastingsCalendar.voucher");
  return (code?: string) => {
    switch (code) {
      case "VOUCHER_INVALID": return t("invalid");
      case "VOUCHER_USED": return t("used");
      case "VOUCHER_SLOT": return t("slot_error");
      case "VOUCHER_RATE": return t("rate");
      default: return t("error");
    }
  };
}

export function TastingVoucherEntry({ tastingTypes, voucher, onVoucherChange }: {
  tastingTypes: Pick<TastingType, "id" | "title">[];
  voucher: AppliedVoucher | null;
  onVoucherChange: (voucher: AppliedVoucher | null) => void;
}) {
  const t = useTranslations("TastingsCalendar");
  const errorMessage = useVoucherErrorMessage();
  const [isOpen, setIsOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const field = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (isOpen) field.current?.focus({ preventScroll: true });
  }, [isOpen]);

  function close() {
    if (checking) return;
    setIsOpen(false);
    setError("");
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking) return;
    setChecking(true);
    setError("");
    const code = input.trim();
    try {
      const response = await fetch("/api/tasting/voucher/", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(errorMessage(result.code));
        return;
      }
      onVoucherChange({ code, tastingTypeId: result.tastingTypeId, people: result.people, children: result.children });
      setInput("");
      setIsOpen(false);
    } catch {
      setError(t("voucher.error"));
    } finally {
      setChecking(false);
    }
  }

  if (voucher) return (
    <div className="flex w-full max-w-md flex-wrap items-start justify-between gap-3 rounded-[5px] border border-emerald-200 bg-emerald-50 px-4 py-3">
      <div role="status" className="text-sm text-emerald-900">
        <p className="font-semibold">{t("voucher.verified")}</p>
        <p className="mt-1">{tastingTypes.find(({ id }) => id === voucher.tastingTypeId)?.title} · {t("voucher.group", { adults: voucher.people, children: voucher.children })}</p>
      </div>
      <button type="button" onClick={() => onVoucherChange(null)} className="text-sm font-medium text-emerald-900 underline">
        {t("voucher.remove")}
      </button>
    </div>
  );

  return <>
    <Button
      ref={trigger}
      type="button"
      aria-expanded={isOpen}
      aria-controls={isOpen ? `${id}-form` : undefined}
      disabled={checking}
      onClick={() => isOpen ? close() : setIsOpen(true)}
      className={cn(voucherTriggerClass, isOpen && "lg:hidden")}
    >
      <Ticket className="size-5" aria-hidden />{t("voucher.load")}
      <ChevronDown className="hidden size-4 lg:block" aria-hidden />
    </Button>
    {isOpen && <form id={`${id}-form`} onSubmit={verify} method="post"
      onKeyDown={(event) => { if (event.key === "Escape") close(); }}
      className="mt-4 w-full max-w-md space-y-2 rounded-[5px] lg:mt-0">
      <Label htmlFor={`${id}-code`}>{t("voucher.code")}</Label>
      <Input ref={field} id={`${id}-code`} value={input} onChange={(event) => { setInput(event.target.value); setError(""); }}
        className="w-full rounded-[5px] bg-white font-mono tracking-widest" inputMode="numeric" autoComplete="off" spellCheck={false}
        placeholder="123456" maxLength={16} required disabled={checking} />
      <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
        <Button type="submit" disabled={checking} className="h-10 cursor-pointer rounded-[5px] bg-[#3D5A3D] px-3 text-sm text-white hover:bg-[#2D4A2D] hover:shadow-sm">
          {checking ? t("voucher.checking") : t("voucher.check")}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={checking} onClick={close}
          className="h-9 cursor-pointer rounded-[5px] px-2 text-xs text-[#44403C] hover:bg-[#3D5A3D]/10">
          {t("modal.close")}
        </Button>
      </div>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    </form>}
  </>;
}
