"use client";

import { useTranslations } from "next-intl";
import { PUBLIC_PAYMENT_METHOD_BADGES } from "@/lib/paymentMethods";

type BadgeProps = {
  className?: string;
  dark?: boolean;
  collapsible?: boolean;
};

function ApplePayLogo({ dark }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 52 20" width="40" height="15" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={dark ? "#FFFFFF" : "#111111"}
        d="M13.3 10.8c0 2 1.7 2.7 1.8 2.7-.1.2-.4 1-.9 1.8-.5.8-1.1 1.5-1.9 1.5-.8 0-1-.5-2-.5s-1.3.5-2.1.5c-.8 0-1.5-.8-2-1.6-1.1-1.6-1.9-4.4-.8-6.4.6-1 1.6-1.6 2.6-1.6.8 0 1.6.5 2 .5.5 0 1.4-.7 2.4-.6.4 0 1.6.2 2.3 1.3-.1 0-1.4.8-1.4 2.4Zm-1.8-4.9c.4-.5.7-1.3.6-2-.6 0-1.4.4-1.8 1-.4.5-.8 1.2-.7 2 .7.1 1.5-.4 1.9-1Zm7.7 8.7V6.1h3.2c1.7 0 2.8 1.2 2.8 2.8 0 1.7-1.2 2.8-2.9 2.8h-1.9v2.9h-1.2Zm1.2-7.5v3.5h1.7c1.3 0 2-.7 2-1.8s-.7-1.8-2-1.8h-1.7Zm9.2 7.7c-.8 0-1.4-.2-1.8-.7-.4-.4-.7-1-.7-1.6 0-1 .6-1.7 1.8-1.8l2-.1v-.6c0-.8-.5-1.2-1.4-1.2-.7 0-1.3.3-1.4.9H27c.1-1.2 1.1-2 2.7-2 1.7 0 2.7.9 2.7 2.3v4.7h-1.1v-1.1h-.1c-.4.7-1.1 1.2-2 1.2Zm.3-1c.6 0 1.1-.2 1.5-.6.4-.4.6-.8.6-1.3v-.5l-1.8.1c-.9.1-1.4.4-1.4 1.1 0 .4.1.7.4.9.2.2.5.3.9.3Zm5.2 3.3c-.3 0-.5 0-.7-.1v-1c.1 0 .3.1.6.1.4 0 .8-.2 1-.8l.2-.6-2.5-7h1.2l1.9 5.7h.1l1.9-5.7h1.2l-2.6 7.3c-.5 1.5-1.2 2.1-2.3 2.1Zm8.2-2.3V6.1h3.1c1.5 0 2.4.9 2.4 2.2 0 .9-.5 1.6-1.4 1.9v.1c1.1.2 1.8 1 1.8 2.1 0 1.4-1.1 2.4-2.8 2.4h-3.1Zm1.2-4.9h1.4c1.1 0 1.7-.5 1.7-1.3 0-.8-.6-1.3-1.6-1.3h-1.5v2.6Zm0 3.9h1.7c1.2 0 1.8-.5 1.8-1.4 0-.9-.7-1.4-1.9-1.4h-1.6v2.8Z"
      />
    </svg>
  );
}

function GooglePayLogo() {
  return (
    <svg viewBox="0 0 64 24" width="48" height="18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M18.52 9.76c0-.66-.06-1.3-.17-1.9H9.6v3.59h5.02a4.29 4.29 0 0 1-1.86 2.81v2.34h3.01c1.76-1.62 2.75-4 2.75-6.84Z"/>
      <path fill="#34A853" d="M9.6 18.8c2.49 0 4.58-.82 6.11-2.2l-3.01-2.34c-.84.56-1.9.89-3.1.89-2.38 0-4.4-1.61-5.12-3.77H1.37v2.44A9.22 9.22 0 0 0 9.6 18.8Z"/>
      <path fill="#FBBC04" d="M4.48 11.38a5.54 5.54 0 0 1 0-3.55V5.39H1.37a9.22 9.22 0 0 0 0 8.43l3.11-2.44Z"/>
      <path fill="#EA4335" d="M9.6 4.06c1.35 0 2.56.46 3.52 1.38l2.63-2.63C14.18 1.34 12.09.5 9.6.5A9.22 9.22 0 0 0 1.37 5.39l3.11 2.44c.72-2.16 2.74-3.77 5.12-3.77Z"/>
      <path fill="#5F6368" d="M27.96 8.1c-2.42 0-4.38 1.9-4.38 4.43 0 2.51 1.96 4.43 4.38 4.43 2.42 0 4.38-1.92 4.38-4.43 0-2.53-1.96-4.43-4.38-4.43Zm0 7.16c-1.32 0-2.45-1.09-2.45-2.73 0-1.65 1.13-2.73 2.45-2.73 1.31 0 2.45 1.08 2.45 2.73 0 1.64-1.14 2.73-2.45 2.73Z"/>
      <path fill="#5F6368" d="M37.55 8.1c-2.42 0-4.38 1.9-4.38 4.43 0 2.51 1.96 4.43 4.38 4.43 2.42 0 4.38-1.92 4.38-4.43 0-2.53-1.96-4.43-4.38-4.43Zm0 7.16c-1.32 0-2.45-1.09-2.45-2.73 0-1.65 1.13-2.73 2.45-2.73 1.31 0 2.45 1.08 2.45 2.73 0 1.64-1.14 2.73-2.45 2.73Z"/>
      <path fill="#5F6368" d="M51.1 8.36v.7h-.07c-.43-.52-1.25-.96-2.28-.96-2.16 0-4.14 1.89-4.14 4.44 0 2.53 1.98 4.42 4.14 4.42 1.03 0 1.85-.44 2.28-.98h.07v.62c0 1.65-.88 2.54-2.31 2.54-1.16 0-1.89-.83-2.18-1.54l-1.68.7c.48 1.16 1.76 2.59 3.86 2.59 2.25 0 4.14-1.32 4.14-4.55V8.36H51.1Zm-2.18 6.9c-1.32 0-2.43-1.11-2.43-2.72 0-1.63 1.11-2.74 2.43-2.74 1.3 0 2.35 1.11 2.35 2.74 0 1.61-1.05 2.72-2.35 2.72Z"/>
      <path fill="#5F6368" d="M56.06 3.7h-1.89v12.99h1.89Z"/>
      <path fill="#5F6368" d="M61.26 15.26c-.97 0-1.65-.44-2.09-1.31l5.92-2.45-.2-.48c-.37-.99-1.5-2.92-3.81-2.92-2.29 0-4.2 1.8-4.2 4.43 0 2.48 1.88 4.43 4.42 4.43 2.05 0 3.24-1.25 3.73-1.98l-1.46-.98c-.49.72-1.15 1.26-2.31 1.26Zm-.14-5.53c.77 0 1.42.39 1.64.93l-4 1.66c-.05-1.78 1.32-2.59 2.36-2.59Z"/>
    </svg>
  );
}

function CardLogo({ dark }: { dark: boolean }) {
  const stroke = dark ? "#FFFFFF" : "#2F2F2F";
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke={stroke} strokeWidth="1.8" />
      <path d="M3 9.5h18" fill="none" stroke={stroke} strokeWidth="1.8" />
      <path d="M7 15h4" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 32 12" width="34" height="13" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="#1434CB" d="M13.43 11.56H10.7l1.71-10.9h2.73l-1.71 10.9Zm11.47-10.63a6.8 6.8 0 0 0-2.45-.43c-2.7 0-4.6 1.43-4.62 3.49-.02 1.52 1.36 2.36 2.39 2.86 1.05.51 1.4.84 1.39 1.3 0 .7-.84 1.02-1.62 1.02-1.08 0-1.66-.17-2.55-.56l-.35-.16-.38 2.39c.63.29 1.8.54 3 .55 2.87 0 4.74-1.42 4.76-3.62.01-1.2-.72-2.11-2.3-2.86-.96-.47-1.55-.78-1.54-1.25 0-.42.47-.87 1.5-.87.85-.01 1.47.18 1.95.39l.23.11.35-2.32Zm3.62 6.78c.23-.62 1.11-3 1.11-3s.23-.62.37-1.03l.19.93s.53 2.58.64 3.1h-2.31Zm3.37-7.05h-2.11c-.65 0-1.13.19-1.42.88l-4.05 10.02h2.86s.47-1.33.57-1.62h3.5c.08.38.33 1.62.33 1.62h2.52L31.89.66ZM8.43.66 5.76 8.08 5.48 6.7C4.99 5.04 3.46 3.24 1.75 2.34l2.44 9.2h2.88L11.35.66H8.43Z" />
      <path fill="#F7A600" d="M3.29.66H.02L0 .82c2.55.65 4.24 2.23 4.94 4.12L4.23 1.32c-.12-.68-.59-.63-.94-.66Z" />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 24 16" width="26" height="16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="8" r="5.2" fill="#EB001B" />
      <circle cx="15" cy="8" r="5.2" fill="#F79E1B" />
      <path fill="#FF5F00" d="M12 3.3a5.16 5.16 0 0 0 0 9.4 5.16 5.16 0 0 0 0-9.4Z" />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg viewBox="0 0 40 16" width="38" height="15" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="16" rx="2" fill="#006FCF" />
      <path fill="#FFF" d="M4 11.8V4.2h6.8l.74.85.77-.85H36v2.05h-2.09l1.2 1.34-1.2 1.37H36v2.82H24.56l-.79-.9-.8.9H4Zm2.2-1.74h3.08V8.88H6.2v1.18Zm0-2.82h3.19V6.05H6.2v1.19Zm5.75 2.82h2.46l.45-.54.45.54h4.8V8.82H16.8V7.64h3.39V6.45H15.8l-1.39 1.61-1.28-1.61h-1.18v3.61Zm10.79 0h1.4V6.86h-1.4v3.2Zm2.43 0h2.28V8.96h-1.4v-.63h1.36V7.3h-1.36v-.62h1.4V5.64h-2.28v4.42Zm3.33 0h1.1l1.75-2.03v2.03h1.88V5.64h-1.1l-1.74 2.01V5.64H30.5v4.42Z" />
    </svg>
  );
}

function SepaLogo({ dark }: { dark: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`text-[10px] font-extrabold italic tracking-tight ${dark ? "text-[#8CC7FF]" : "text-[#0055A5]"}`}>SEPA</span>
      <span className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[8px] font-bold text-white ${dark ? "bg-[#3B82F6]" : "bg-[#0055A5]"}`}>E</span>
    </div>
  );
}

function PaymentMethodLogo({ id, dark }: { id: string; dark: boolean }) {
  switch (id) {
    case "apple-pay":
      return <ApplePayLogo dark={dark} />;
    case "google-pay":
      return <GooglePayLogo />;
    case "sepa":
      return <SepaLogo dark={dark} />;
    case "card":
      return <CardLogo dark={dark} />;
    case "visa":
      return <VisaLogo />;
    case "mastercard":
      return <MastercardLogo />;
    case "amex":
      return <AmexLogo />;
    default:
      return null;
  }
}

export default function PaymentMethodsBadges({
  className = "",
  dark = false,
  collapsible = false,
}: BadgeProps) {
  const t = useTranslations("Common.footer.bottom");

  const badgeClass = `flex h-10 min-w-[52px] items-center justify-center rounded-md px-2.5 shadow-sm transition-all ${
    dark
      ? "bg-[#0d0d0d] border border-stone-800 hover:bg-[#141414]"
      : "border border-neutral-200 bg-white hover:border-neutral-300"
  }`;

  return (
    <div className={className}>
      <p className={`mb-4.5 text-center text-[10px] font-medium uppercase tracking-widest ${dark ? "text-stone-500" : "text-neutral-400"}`}>
        {t("secure_payments")}
      </p>

      <div className={`flex flex-wrap items-center justify-center transition-all duration-300 ${collapsible ? "gap-2 md:gap-2.5" : "gap-2.5 md:gap-3"}`}>
        {PUBLIC_PAYMENT_METHOD_BADGES.map((method) => (
          <div key={method.id} className={badgeClass} title={method.label} aria-label={method.label}>
            <PaymentMethodLogo id={method.id} dark={dark} />
          </div>
        ))}
      </div>
    </div>
  );
}
