"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { contactCountry, getCountryCallingCode, normalizeContactPhone, PHONE_COUNTRIES, type CountryCode } from "@/lib/contactPhone";
import CountryFlag from "@/components/CountryFlag";
import { ChevronDown } from "lucide-react";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm({ initialCountry = "IT" }: { initialCountry?: CountryCode }) {
  const t = useTranslations("ContactPage.form");
  const locale = useLocale();
  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const countryPicker = useRef<HTMLDetailsElement>(null);
  const [phone, setPhone] = useState("");
  const phoneOptions = useMemo(() => {
    const names = new Intl.DisplayNames([locale === "us" ? "en-US" : locale], { type: "region" });
    return PHONE_COUNTRIES.map((code) => ({ code, name: names.of(code) || code, prefix: getCountryCallingCode(code) }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);
  const normalizedPhone = normalizeContactPhone(phone, country);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const canSubmit = useMemo(() => {
    if (status === "sending") return false;
    if (name.trim().length < 2) return false;
    if (!email.includes("@")) return false;
    if (!normalizedPhone) return false;
    if (subject.trim().length < 2) return false;
    if (message.trim().length < 5) return false;
    if (!consent) return false;
    return true;
  }, [status, name, email, normalizedPhone, subject, message, consent]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: normalizedPhone,
          subject,
          message,
          consent,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setStatus("error");
        setError(data?.error || "Invio fallito. Riprova.");
        return;
      }

      setStatus("ok");
      // reset campi
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setConsent(false);
    } catch (err: unknown) {
      setStatus("error");
      setError((err as Error)?.message || "Errore di rete. Riprova.");
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
            {t("name_label")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder={t("name_placeholder")}
            className="mt-2 w-full rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#3D5A3D] focus:outline-none focus:ring-1 focus:ring-[#3D5A3D]"
            required
            minLength={2}
            maxLength={120}
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
            {t("email_label")}
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            placeholder="nome@email.com"
            className="mt-2 w-full rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#3D5A3D] focus:outline-none focus:ring-1 focus:ring-[#3D5A3D]"
            required
            maxLength={200}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          {t("phone_label")} *
        </label>
        <div className="mt-2 flex gap-2">
          <details ref={countryPicker} className="relative w-[108px] shrink-0"
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false; }}
            onKeyDown={(e) => { if (e.key === "Escape") { e.currentTarget.open = false; countryPicker.current?.querySelector("summary")?.focus(); } }}>
            <summary aria-label={t("phone_country_label")} className="flex h-full cursor-pointer list-none items-center justify-between gap-1.5 rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-2.5 py-3 text-sm text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#3D5A3D] [&::-webkit-details-marker]:hidden">
              <CountryFlag code={country} />
              <span>+{getCountryCallingCode(country)}</span>
              <ChevronDown aria-hidden="true" className="h-3 w-3 shrink-0" />
            </summary>
            <div role="group" aria-label={t("phone_country_label")} className="absolute left-0 top-full z-30 mt-1 max-h-64 w-64 overflow-y-auto rounded-[5px] border border-[#E7E5E4] bg-white p-1 shadow-lg">
              {phoneOptions.map((option) => <button key={option.code} type="button" aria-pressed={country === option.code}
                onClick={() => { setCountry(contactCountry(option.code)); if (countryPicker.current) countryPicker.current.open = false; countryPicker.current?.querySelector("summary")?.focus(); }}
                className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-sm text-[#1C1917] hover:bg-stone-100 focus:bg-stone-100 focus:outline-none">
                <CountryFlag code={option.code} /><span className="w-12 shrink-0">+{option.prefix}</span><span>{option.name}</span>
              </button>)}
            </div>
          </details>
          <input type="hidden" name="phoneCountry" value={country} />
          <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national"
            value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={64}
            placeholder={t("phone_placeholder")}
            className="min-w-0 flex-1 rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#3D5A3D]" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          {t("subject_label")}
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          name="subject"
          placeholder={t("subject_placeholder")}
          className="mt-2 w-full rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#3D5A3D] focus:outline-none focus:ring-1 focus:ring-[#3D5A3D]"
          required
          minLength={2}
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          {t("message_label")}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          rows={5}
          placeholder={t("message_placeholder")}
          className="mt-2 w-full rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#3D5A3D] focus:outline-none focus:ring-1 focus:ring-[#3D5A3D]"
          required
          minLength={5}
          maxLength={5000}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-[#57534E]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded-[5px] border-[#E7E5E4] text-[#3D5A3D] focus:ring-[#3D5A3D]"
          required
        />
        <span>
          {t("privacy_consent")}
        </span>
      </label>

      {status === "ok" && (
        <div className="rounded-[5px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {t("success_msg")} ✅
        </div>
      )}

      {status === "error" && (
        <div className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {t("error_prefix")}: {error || t("error_fallback")}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-[5px] bg-[#1C1917] px-8 py-3 text-xs font-medium tracking-[0.2em] text-white transition hover:bg-[#3D5A3D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? t("button_sending") : t("button_idle")}
        </button>
      </div>
    </form>
  );
}
