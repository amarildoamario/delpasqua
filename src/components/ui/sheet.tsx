"use client"

import * as React from "react"
import { DrawerPreview as Drawer } from "@base-ui/react/drawer"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = Drawer.Root
const SheetTrigger = Drawer.Trigger
const SheetClose = Drawer.Close

type SheetContentProps = React.ComponentPropsWithoutRef<typeof Drawer.Popup> & {
  side?: "top" | "right" | "bottom" | "left"
  hideClose?: boolean
}

const sheetSideClasses: Record<NonNullable<SheetContentProps["side"]>, string> = {
  top: "inset-x-0 top-0 border-b",
  right: "inset-y-0 right-0 h-full w-full max-w-sm border-l sm:max-w-md",
  bottom: "inset-x-0 bottom-0 border-t",
  left: "inset-y-0 left-0 h-full w-full max-w-sm border-r sm:max-w-md",
}

const sheetMotionClasses: Record<NonNullable<SheetContentProps["side"]>, string> = {
  top: "-translate-y-6",
  right: "translate-x-8",
  bottom: "translate-y-6",
  left: "-translate-x-8",
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = "right", hideClose = false, ...props }, ref) => (
    <Drawer.Portal>
      <Drawer.Backdrop
        className={({ transitionStatus }: { transitionStatus?: "starting" | "ending" | "idle" }) =>
          cn(
            "fixed inset-0 z-[70] bg-stone-950/35 backdrop-blur-sm transition-opacity duration-300",
            transitionStatus === "starting" && "opacity-0",
            transitionStatus === "ending" && "opacity-0",
            transitionStatus === "idle" && "opacity-100"
          )
        }
      />
      <Drawer.Popup
        ref={ref}
        data-side={side}
        className={({ transitionStatus }: { transitionStatus?: "starting" | "ending" | "idle" }) =>
          cn(
            "fixed z-[80] bg-white shadow-2xl outline-none transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "flex flex-col",
            sheetSideClasses[side],
            (transitionStatus === "starting" || transitionStatus === "ending") && sheetMotionClasses[side],
            transitionStatus === "starting" && "opacity-0",
            transitionStatus === "ending" && "opacity-0",
            transitionStatus === "idle" && "opacity-100 translate-x-0 translate-y-0",
            className
          )
        }
        {...props}
      >
        <Drawer.Content className="flex h-full flex-col">
          {children}
          {!hideClose ? (
            <Drawer.Close
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </Drawer.Close>
          ) : null}
        </Drawer.Content>
      </Drawer.Popup>
    </Drawer.Portal>
  )
)
SheetContent.displayName = "SheetContent"

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof Drawer.Title>>(
  ({ className, ...props }, ref) => (
    <Drawer.Title ref={ref} className={cn("text-lg font-semibold text-stone-950", className)} {...props} />
  )
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Description>
>(({ className, ...props }, ref) => (
  <Drawer.Description ref={ref} className={cn("text-sm text-stone-500", className)} {...props} />
))
SheetDescription.displayName = "SheetDescription"

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger }
