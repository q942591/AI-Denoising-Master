"use client";

import type * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "~/lib/utils";

const dialogContentVariants = cva(
  `
    fixed z-50 flex flex-col border border-border bg-background p-6 shadow-lg
    shadow-black/5 outline-0 duration-200
    data-[state=closed]:animate-out data-[state=closed]:fade-out-0
    data-[state=closed]:zoom-out-95
    data-[state=open]:animate-in data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95
    sm:rounded-lg
  `,
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: `
          top-[50%] left-[50%] w-full max-w-lg translate-x-[-50%]
          translate-y-[-50%]
        `,
        fullscreen: "inset-5",
      },
    },
  }
);

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogContent({
  children,
  className,
  close = true,
  overlay = true,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    close?: boolean;
    overlay?: boolean;
  }) {
  return (
    <DialogPortal>
      {overlay && <DialogOverlay />}
      <DialogPrimitive.Content
        className={cn(dialogContentVariants({ variant }), className)}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {close && (
          <DialogClose
            className={`
              absolute end-5 top-5 cursor-pointer rounded-sm opacity-60
              ring-offset-background outline-0 transition-opacity
              hover:opacity-100
              focus:outline-hidden
              disabled:pointer-events-none
              data-[state=open]:bg-accent
              data-[state=open]:text-muted-foreground
            `}
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        `
          fixed inset-0 z-50 bg-black/30
          [backdrop-filter:blur(4px)]
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          data-[state=open]:animate-in data-[state=open]:fade-in-0
        `,
        className
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export default DialogContent;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `
        mb-5 flex flex-col space-y-1 text-center
        sm:text-start
      `,
      className
    )}
    data-slot="dialog-header"
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `
        flex flex-col-reverse pt-5
        sm:flex-row sm:justify-end sm:space-x-2.5
      `,
      className
    )}
    data-slot="dialog-footer"
    {...props}
  />
);

function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg leading-none font-semibold tracking-tight",
        className
      )}
      data-slot="dialog-title"
      {...props}
    />
  );
}

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grow", className)} data-slot="dialog-body" {...props} />
);

function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
