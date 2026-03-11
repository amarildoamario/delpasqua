"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const timeInputClasses =
    type === "time"
      ? "max-w-full overflow-hidden pr-3 text-left [appearance:none] [-webkit-appearance:none] [color-scheme:light] [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:shrink-0 [&::-webkit-date-and-time-value]:min-w-0 [&::-webkit-date-and-time-value]:text-left [&::-webkit-datetime-edit]:min-w-0 [&::-webkit-datetime-edit-fields-wrapper]:min-w-0"
      : ""

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-[#E7E5E4] bg-white px-4 py-2.5 text-[16px] text-[#1C1917] shadow-[0_1px_0_rgba(28,25,23,0.03)] outline-none transition placeholder:text-[#A8A29E] focus-visible:border-[#3D5A3D] focus-visible:ring-2 focus-visible:ring-[#3D5A3D]/15 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:py-3",
        timeInputClasses,
        className
      )}
      {...props}
    />
  )
}

export { Input }
