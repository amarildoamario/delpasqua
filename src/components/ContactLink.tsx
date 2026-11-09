"use client";

import type { ComponentProps } from "react";
import { track } from "@/lib/analytics/track";

type Props = ComponentProps<"a"> & {
  channel: "phone" | "email" | "whatsapp";
  source: string;
};

export default function ContactLink({ channel, source, onClick, ...props }: Props) {
  return <a {...props} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented) track({ type: "contact_click", productKey: channel, variantKey: source });
  }} />;
}
