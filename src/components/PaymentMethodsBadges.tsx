"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { PUBLIC_PAYMENT_METHOD_BADGES } from "@/lib/paymentMethods";

type BadgeProps = {
  className?: string;
  dark?: boolean;
  collapsible?: boolean;
};

export default function PaymentMethodsBadges({
  className = "",
  dark = false,
  collapsible = false,
}: BadgeProps) {
  const t = useTranslations("Common.footer.bottom");

  return (
    <div className={className}>
      <p className={`mb-4.5 text-center text-[10px] font-medium uppercase tracking-widest ${dark ? "text-stone-500" : "text-neutral-400"}`}>
        {t("secure_payments")}
      </p>

      <div className={`flex flex-wrap items-center justify-center ${collapsible ? "gap-2 md:gap-2.5" : "gap-2.5 md:gap-3"}`}>
        {PUBLIC_PAYMENT_METHOD_BADGES.map((method) => (
          <div
            key={method.id}
            className={`h-10 w-[60px] shrink-0 overflow-hidden rounded-md bg-white ring-1 ${dark ? "ring-white/15" : "ring-neutral-200"}`}
            title={method.label}
          >
            <Image
              src={`/payments/${method.id}.svg`}
              alt={method.label}
              width={60}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
