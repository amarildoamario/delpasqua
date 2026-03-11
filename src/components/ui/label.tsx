"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "block text-[10px] font-medium uppercase tracking-[0.18em] text-[#8B7355]",
        className
      )}
      {...props}
    />
  )
}

export { Label }
