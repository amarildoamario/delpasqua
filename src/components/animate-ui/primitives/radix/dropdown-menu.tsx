'use client';

import * as React from 'react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';

import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from '@/components/animate-ui/primitives/effects/highlight';
import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';
import { useDataState } from '@/hooks/use-data-state';

type DropdownMenuContextType = {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  highlightedValue: string | null;
  setHighlightedValue: (value: string | null) => void;
};

type DropdownMenuSubContextType = {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
};

const [DropdownMenuProvider, useDropdownMenu] =
  getStrictContext<DropdownMenuContextType>('DropdownMenuContext');

const [DropdownMenuSubProvider, useDropdownMenuSub] =
  getStrictContext<DropdownMenuSubContextType>('DropdownMenuSubContext');

type DropdownMenuProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Root
>;

function DropdownMenu({ modal = false, ...props }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });
  const [highlightedValue, setHighlightedValue] = React.useState<string | null>(
    null,
  );

  return (
    <DropdownMenuProvider
      value={{ isOpen, setIsOpen, highlightedValue, setHighlightedValue }}
    >
      <DropdownMenuPrimitive.Root
        data-slot="dropdown-menu"
        modal={modal}
        {...props}
        onOpenChange={setIsOpen}
      />
    </DropdownMenuProvider>
  );
}

type DropdownMenuTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Trigger
>;

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={className}
    data-slot="dropdown-menu-trigger"
    {...props}
  />
));
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

type DropdownMenuPortalProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Portal
>;

function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

type DropdownMenuGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Group
>;

const DropdownMenuGroup = React.forwardRef<
  HTMLDivElement,
  DropdownMenuGroupProps
>((props, ref) => (
  <DropdownMenuPrimitive.Group ref={ref} data-slot="dropdown-menu-group" {...props} />
));
DropdownMenuGroup.displayName = 'DropdownMenuGroup';

type DropdownMenuSubProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Sub
>;

function DropdownMenuSub(props: DropdownMenuSubProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });

  return (
    <DropdownMenuSubProvider value={{ isOpen, setIsOpen }}>
      <DropdownMenuPrimitive.Sub
        data-slot="dropdown-menu-sub"
        {...props}
        onOpenChange={setIsOpen}
      />
    </DropdownMenuSubProvider>
  );
}

type DropdownMenuRadioGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioGroup
>;

const DropdownMenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  DropdownMenuRadioGroupProps
>((props, ref) => (
  <DropdownMenuPrimitive.RadioGroup
    ref={ref}
    data-slot="dropdown-menu-radio-group"
    {...props}
  />
));
DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

type DropdownMenuSubTriggerProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>,
  'asChild'
> &
  HTMLMotionProps<'div'>;

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(({ disabled, textValue, ...props }, ref) => {
  const { setHighlightedValue } = useDropdownMenu();
  const [highlighted, highlightedRef] = useDataState<HTMLDivElement>('highlighted');

  React.useEffect(() => {
    if (highlighted === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  }, [highlighted, setHighlightedValue, highlightedRef]);

  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (highlightedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
    },
    [ref, highlightedRef],
  );

  return (
    <DropdownMenuPrimitive.SubTrigger ref={combinedRef} disabled={disabled} textValue={textValue} asChild>
      <motion.div data-slot="dropdown-menu-sub-trigger" data-disabled={disabled} {...props} />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

type DropdownMenuSubContentProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>,
  'forceMount' | 'asChild'
> &
  Omit<
    React.ComponentProps<typeof DropdownMenuPrimitive.Portal>,
    'forceMount'
  > &
  HTMLMotionProps<'div'>;

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(({
  loop,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  sideOffset,
  alignOffset,
  avoidCollisions,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  hideWhenDetached,
  transition = { duration: 0.2 },
  style,
  container,
  ...props
}, ref) => {
  const { isOpen } = useDropdownMenuSub();

  return (
    <AnimatePresence>
      {isOpen && (
        <DropdownMenuPortal container={container}>
          <DropdownMenuPrimitive.SubContent ref={ref} forceMount loop={loop} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} onFocusOutside={onFocusOutside} onInteractOutside={onInteractOutside} sideOffset={sideOffset} alignOffset={alignOffset} avoidCollisions={avoidCollisions} collisionBoundary={collisionBoundary} collisionPadding={collisionPadding} arrowPadding={arrowPadding} sticky={sticky} hideWhenDetached={hideWhenDetached} asChild>
            <motion.div key="dropdown-menu-sub-content" data-slot="dropdown-menu-sub-content" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={transition} style={{ willChange: 'opacity, transform', ...style }} {...props} />
          </DropdownMenuPrimitive.SubContent>
        </DropdownMenuPortal>
      )}
    </AnimatePresence>
  );
});
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

type DropdownMenuHighlightProps = Omit<
  HighlightProps,
  'controlledItems' | 'enabled' | 'hover'
> & {
  animateOnHover?: boolean;
};

function DropdownMenuHighlight({
  transition = { type: 'spring', stiffness: 350, damping: 35 },
  ...props
}: DropdownMenuHighlightProps) {
  const { highlightedValue } = useDropdownMenu();

  return (
    <Highlight
      data-slot="dropdown-menu-highlight"
      click={false}
      controlledItems
      transition={transition}
      value={highlightedValue}
      {...props}
    />
  );
}

type DropdownMenuContentProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.Content>,
  'forceMount' | 'asChild'
> &
  Omit<
    React.ComponentProps<typeof DropdownMenuPrimitive.Portal>,
    'forceMount'
  > &
  HTMLMotionProps<'div'>;

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({
  loop,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  side,
  sideOffset,
  align,
  alignOffset,
  avoidCollisions,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  hideWhenDetached,
  transition = { duration: 0.2 },
  style,
  container,
  ...props
}, ref) => {
  const { isOpen } = useDropdownMenu();

  return (
    <AnimatePresence>
      {isOpen && (
        <DropdownMenuPortal container={container}>
          <DropdownMenuPrimitive.Content ref={ref} forceMount loop={loop} onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} onFocusOutside={onFocusOutside} onInteractOutside={onInteractOutside} side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} avoidCollisions={avoidCollisions} collisionBoundary={collisionBoundary} collisionPadding={collisionPadding} arrowPadding={arrowPadding} sticky={sticky} hideWhenDetached={hideWhenDetached} asChild>
            <motion.div key="dropdown-menu-content" data-slot="dropdown-menu-content" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={transition} style={{ willChange: 'opacity, transform', ...style }} {...props} />
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPortal>
      )}
    </AnimatePresence>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

type DropdownMenuHighlightItemProps = HighlightItemProps;

function DropdownMenuHighlightItem(props: DropdownMenuHighlightItemProps) {
  return <HighlightItem data-slot="dropdown-menu-highlight-item" {...props} />;
}

type DropdownMenuItemProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.Item>,
  'asChild'
> &
  HTMLMotionProps<'div'>;

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ disabled, onSelect, textValue, ...props }, ref) => {
  const { setHighlightedValue } = useDropdownMenu();
  const [highlighted, highlightedRef] = useDataState<HTMLDivElement>('highlighted');

  React.useEffect(() => {
    if (highlighted === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  }, [highlighted, setHighlightedValue, highlightedRef]);

  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (highlightedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
    },
    [ref, highlightedRef],
  );

  return (
    <DropdownMenuPrimitive.Item ref={combinedRef} disabled={disabled} onSelect={onSelect} textValue={textValue} asChild>
      <motion.div data-slot="dropdown-menu-item" data-disabled={disabled} {...props} />
    </DropdownMenuPrimitive.Item>
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

type DropdownMenuCheckboxItemProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>,
  'asChild'
> &
  HTMLMotionProps<'div'>;

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(({ checked, onCheckedChange, disabled, onSelect, textValue, ...props }, ref) => {
  const { setHighlightedValue } = useDropdownMenu();
  const [highlighted, highlightedRef] = useDataState<HTMLDivElement>('highlighted');

  React.useEffect(() => {
    if (highlighted === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  }, [highlighted, setHighlightedValue, highlightedRef]);

  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (highlightedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
    },
    [ref, highlightedRef],
  );

  return (
    <DropdownMenuPrimitive.CheckboxItem ref={combinedRef} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} onSelect={onSelect} textValue={textValue} asChild>
      <motion.div data-slot="dropdown-menu-checkbox-item" data-disabled={disabled} {...props} />
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

type DropdownMenuRadioItemProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>,
  'asChild'
> &
  HTMLMotionProps<'div'>;

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(({ value, disabled, onSelect, textValue, ...props }, ref) => {
  const { setHighlightedValue } = useDropdownMenu();
  const [highlighted, highlightedRef] = useDataState<HTMLDivElement>('highlighted');

  React.useEffect(() => {
    if (highlighted === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  }, [highlighted, setHighlightedValue, highlightedRef]);

  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (highlightedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
    },
    [ref, highlightedRef],
  );

  return (
    <DropdownMenuPrimitive.RadioItem ref={combinedRef} value={value} disabled={disabled} onSelect={onSelect} textValue={textValue} asChild>
      <motion.div data-slot="dropdown-menu-radio-item" data-disabled={disabled} {...props} />
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

type DropdownMenuLabelProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
>;

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>((props, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} data-slot="dropdown-menu-label" {...props} />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>;

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>((props, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

type DropdownMenuShortcutProps = React.ComponentProps<'span'>;

function DropdownMenuShortcut(props: DropdownMenuShortcutProps) {
  return <span data-slot="dropdown-menu-shortcut" {...props} />;
}

type DropdownMenuItemIndicatorProps = Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.ItemIndicator>,
  'asChild'
> &
  HTMLMotionProps<'div'>;

const DropdownMenuItemIndicator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemIndicatorProps
>((props, ref) => (
  <DropdownMenuPrimitive.ItemIndicator data-slot="dropdown-menu-item-indicator" asChild>
    <motion.div ref={ref} {...props} />
  </DropdownMenuPrimitive.ItemIndicator>
));
DropdownMenuItemIndicator.displayName = 'DropdownMenuItemIndicator';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuHighlight,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuHighlightItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  useDropdownMenu,
  useDropdownMenuSub,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuHighlightProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuItemIndicatorProps,
  type DropdownMenuHighlightItemProps,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuShortcutProps,
  type DropdownMenuGroupProps,
  type DropdownMenuPortalProps,
  type DropdownMenuSubProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuSubTriggerProps,
  type DropdownMenuRadioGroupProps,
  type DropdownMenuContextType,
  type DropdownMenuSubContextType,
};
