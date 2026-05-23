"use client"

import * as React from "react"
import { Menu } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"

const DropdownMenu = Menu.Root
const DropdownMenuTrigger = Menu.Trigger

type DropdownMenuContentProps = React.ComponentPropsWithoutRef<typeof Menu.Popup> & {
  sideOffset?: number
  align?: "start" | "center" | "end"
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, sideOffset = 8, align = "end", ...props }, ref) => (
    <Menu.Portal>
      <Menu.Positioner sideOffset={sideOffset} align={align} style={{ zIndex: 9999 }}>
        <Menu.Popup
          ref={ref}
          className={({ transitionStatus }) =>
            cn(
              "z-[80] min-w-32 overflow-hidden rounded-[5px] border border-stone-200/80 bg-white/95 p-1.5 text-stone-900 shadow-2xl backdrop-blur-xl outline-none",
              "transition duration-200 ease-out",
              transitionStatus === "starting" && "opacity-0 scale-95 -translate-y-1",
              transitionStatus === "ending" && "opacity-0 scale-95 -translate-y-1",
              transitionStatus === "idle" && "opacity-100 scale-100 translate-y-0",
              className
            )
          }
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Menu.Item>>(
  ({ className, ...props }, ref) => (
    <Menu.Item
      ref={ref}
      className={({ highlighted, disabled }) =>
        cn(
          "flex cursor-default items-center gap-2 rounded-[3px] px-3 py-2.5 text-xs font-medium uppercase tracking-[0.14em] outline-none transition-colors",
          highlighted ? "bg-stone-100 text-stone-950" : "text-stone-600",
          disabled && "pointer-events-none opacity-50",
          className
        )
      }
      {...props}
    />
  )
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLinkItem = React.forwardRef<Element, React.ComponentPropsWithoutRef<typeof Menu.LinkItem>>(
  ({ className, ...props }, ref) => (
    <Menu.LinkItem
      ref={ref}
      className={({ highlighted }) =>
        cn(
          "flex items-center gap-2 rounded-[3px] px-3 py-2.5 text-xs font-medium uppercase tracking-[0.14em] outline-none transition-colors",
          highlighted ? "bg-stone-100 text-stone-950" : "text-stone-600",
          className
        )
      }
      {...props}
    />
  )
)
DropdownMenuLinkItem.displayName = "DropdownMenuLinkItem"

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("my-1 h-px bg-stone-200", className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
}
