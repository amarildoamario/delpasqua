"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full min-w-0 rounded-xl border border-[#E7E5E4] bg-white px-4 py-3 text-[16px] text-[#1C1917] shadow-[0_1px_0_rgba(28,25,23,0.03)] outline-none transition placeholder:text-[#A8A29E] focus-visible:border-[#3D5A3D] focus-visible:ring-2 focus-visible:ring-[#3D5A3D]/15 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
