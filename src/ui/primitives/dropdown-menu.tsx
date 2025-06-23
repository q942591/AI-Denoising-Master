"use client";

import type * as React from "react";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "~/lib/utils";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        `
          relative flex cursor-default items-center rounded-md py-1.5 ps-8 pe-2
          text-sm outline-hidden transition-colors select-none
          focus:bg-accent focus:text-accent-foreground
          data-disabled:pointer-events-none data-disabled:opacity-50
        `,
        className
      )}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span
        className={`
          absolute start-2 flex h-3.5 w-3.5 items-center justify-center
          text-muted-foreground
        `}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-primary" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          `
            z-50 min-w-[8rem] space-y-0.5 overflow-hidden rounded-md border
            border-border bg-popover p-2 text-popover-foreground shadow-md
            shadow-black/5
            data-[side=bottom]:slide-in-from-top-2
            data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2
            data-[side=top]:slide-in-from-bottom-2
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:animate-in data-[state=open]:fade-in-0
            data-[state=open]:zoom-in-95
          `,
          className
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        `
          relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5
          text-sm text-foreground outline-hidden transition-colors select-none
          data-disabled:pointer-events-none data-disabled:opacity-50
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*=size-])]:size-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        "focus:bg-accent focus:text-foreground",
        "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        inset && "ps-8",
        variant === "destructive" &&
          `
            text-destructive
            hover:bg-destructive/5 hover:text-destructive
            focus:bg-destructive/5 focus:text-destructive
            data-[active=true]:bg-destructive/5
          `,
        className
      )}
      data-slot="dropdown-menu-item"
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        inset && "ps-8",
        className
      )}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        `
          relative flex cursor-default items-center rounded-md py-1.5 ps-6 pe-2
          text-sm outline-hidden transition-colors select-none
          focus:bg-accent focus:text-accent-foreground
          data-disabled:pointer-events-none data-disabled:opacity-50
        `,
        className
      )}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span
        className={`
          absolute start-1.5 flex h-3.5 w-3.5 items-center justify-center
        `}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-1.5 w-1.5 fill-primary stroke-primary" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-2 my-1.5 h-px bg-muted", className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ms-auto text-xs tracking-widest opacity-60", className)}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        `
          z-50 min-w-[8rem] space-y-0.5 overflow-hidden rounded-md border
          border-border bg-popover p-2 text-popover-foreground shadow-md
          shadow-black/5
          data-[side=bottom]:slide-in-from-top-2
          data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2
          data-[side=top]:slide-in-from-bottom-2
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          data-[state=closed]:zoom-out-95
          data-[state=open]:animate-in data-[state=open]:fade-in-0
          data-[state=open]:zoom-in-95
        `,
        className
      )}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
}

function DropdownMenuSubTrigger({
  children,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        `
          flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm
          outline-hidden select-none
        `,
        "focus:bg-accent focus:text-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-foreground",
        "data-[here=true]:bg-accent data-[here=true]:text-foreground",
        `
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
          [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0
        `,
        inset && "ps-8",
        className
      )}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRight
        className={`
          ms-auto size-3.5!
          rtl:rotate-180
        `}
        data-slot="dropdown-menu-sub-trigger-indicator"
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      className="select-none"
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
