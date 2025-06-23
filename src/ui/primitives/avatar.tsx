"use client";

import type * as React from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const avatarStatusVariants = cva(
  "flex size-2 items-center rounded-full border-2 border-background",
  {
    defaultVariants: {
      variant: "online",
    },
    variants: {
      variant: {
        away: "bg-blue-600",
        busy: "bg-yellow-600",
        offline: `
          bg-zinc-600
          dark:bg-zinc-300
        `,
        online: "bg-green-600",
      },
    },
  }
);

function Avatar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex size-10 shrink-0", className)}
      data-slot="avatar"
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        `
          flex h-full w-full items-center justify-center rounded-full border
          border-border bg-accent text-xs text-accent-foreground
        `,
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <div className={cn("relative overflow-hidden rounded-full", className)}>
      <AvatarPrimitive.Image
        className={cn("aspect-square h-full w-full")}
        data-slot="avatar-image"
        {...props}
      />
    </div>
  );
}

function AvatarIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute flex size-6 items-center justify-center",
        className
      )}
      data-slot="avatar-indicator"
      {...props}
    />
  );
}

function AvatarStatus({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof avatarStatusVariants>) {
  return (
    <div
      className={cn(avatarStatusVariants({ variant }), className)}
      data-slot="avatar-status"
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
  avatarStatusVariants,
};
