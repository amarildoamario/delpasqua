"use client";

import { useCallback, useState } from "react";
import { Info } from "lucide-react";
import { autoUpdate, flip, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from "@floating-ui/react";

export default function InfoTooltip({ label, description }: { label: string; description: string }) {
  const [open, setOpen] = useState(false);
  const { refs: anchors, floatingStyles, context } = useFloating({ open, onOpenChange: setOpen, placement: "top", whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 12 })] });
  const hover = useHover(context, { move: false, delay: { open: 100 } });
  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, click, dismiss, role]);
  const setReference = useCallback((node: HTMLButtonElement | null) => anchors.setReference(node), [anchors]);
  const setFloating = useCallback((node: HTMLDivElement | null) => anchors.setFloating(node), [anchors]);
  return <>
    <button ref={setReference} type="button" aria-label={`Informazioni: ${label}`} {...getReferenceProps()}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
      <Info className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
    {open ? <FloatingPortal><div ref={setFloating} style={floatingStyles} {...getFloatingProps()}
      className="z-[100] w-72 max-w-[calc(100vw-24px)] rounded-xl bg-neutral-900 px-3.5 py-3 text-xs font-normal leading-relaxed tracking-normal text-white shadow-xl normal-case">
      {description}
    </div></FloatingPortal> : null}
  </>;
}
