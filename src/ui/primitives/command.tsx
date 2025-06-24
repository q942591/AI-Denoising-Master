"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import type React from "react";

import { Command as CommandPrimitive } from "cmdk";
import { Check, type LucideIcon, Search } from "lucide-react";

import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "~/ui/primitives/dialog";

type CommandDialogProps = DialogProps & { className?: string };

function Command({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        `
          flex h-full w-full flex-col overflow-hidden rounded-md bg-popover
          text-popover-foreground
        `,
        className
      )}
      {...props}
    />
  );
}

const CommandDialog = ({
  children,
  className,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className={cn("overflow-hidden p-0 shadow-lg", className)}>
        <DialogTitle className="hidden" />
        <Command
          className={`
            [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium
            [&_[cmdk-group-heading]]:text-muted-foreground
            [&_[cmdk-group]]:px-2
            [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0
            [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5
            [&_[cmdk-input]]:h-12
            [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3
            [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5
          `}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

function CommandEmpty({
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className="py-6 text-center text-sm"
      data-slot="command-empty"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        `
          overflow-hidden p-1.5 text-foreground
          [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5
          [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium
          [&_[cmdk-group-heading]]:text-muted-foreground
        `,
        className
      )}
      data-slot="command-group"
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>) {
  return (
    <div
      className="flex items-center border-b border-border px-3"
      cmdk-input-wrapper=""
      data-slot="command-input"
    >
      <Search className="me-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        className={cn(
          `
            flex h-11 w-full rounded-md bg-transparent py-3 text-sm
            text-foreground outline-hidden
            placeholder:text-muted-foreground
            disabled:cursor-not-allowed disabled:opacity-50
          `,
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        `
          relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5
          text-sm text-foreground outline-hidden select-none
          data-[disabled=true]:pointer-events-none
          data-[disabled=true]:opacity-50
          data-[selected=true]:bg-accent
          [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
        `,
        className
      )}
      data-slot="command-item"
      {...props}
    />
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn(
        "max-h-[300px] overflow-x-hidden overflow-y-auto",
        className
      )}
      data-slot="command-list"
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("-mx-1.5 h-px bg-border", className)}
      data-slot="command-separator"
      {...props}
    />
  );
}

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      data-slot="command-shortcut"
      {...props}
    />
  );
};

interface ButtonArrowProps extends React.SVGProps<SVGSVGElement> {
  icon?: LucideIcon; // Allows passing any Lucide icon
}

function CommandCheck({
  className,
  icon: Icon = Check,
  ...props
}: ButtonArrowProps) {
  return (
    <Icon
      className={cn("ms-auto size-4 text-primary", className)}
      data-check="true"
      data-slot="command-check"
      {...props}
    />
  );
}

export {
  Command,
  CommandCheck,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
