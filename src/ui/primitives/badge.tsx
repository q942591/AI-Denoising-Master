import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

export interface BadgeButtonProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeButtonVariants> {
  asChild?: boolean;
}

export type BadgeDotProps = React.HTMLAttributes<HTMLSpanElement>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  disabled?: boolean;
  dotClassName?: string;
}

const badgeVariants = cva(
  `
    inline-flex items-center justify-center border font-medium
    focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden
    [&_svg]:-ms-px [&_svg]:shrink-0
  `,
  {
    compoundVariants: [
      {
        appearance: "outline",
        className: "border-primary/10 bg-primary/10 text-primary",
        variant: "primary",
      },
      {
        appearance: "outline",
        className: `
          border-border bg-secondary text-secondary-foreground
          dark:bg-secondary/50
        `,
        variant: "secondary",
      },
      {
        appearance: "outline",
        className: `
          border border-green-200 bg-green-100 text-green-700
          dark:border-green-950 dark:bg-green-950/50 dark:text-green-600
        `,
        variant: "success",
      },
      {
        appearance: "outline",
        className: `
          border border-yellow-200 bg-yellow-100 text-yellow-700
          dark:border-yellow-950 dark:bg-yellow-950/50 dark:text-yellow-600
        `,
        variant: "warning",
      },
      {
        appearance: "outline",
        className: `
          border border-violet-200 bg-violet-100 text-violet-700
          dark:border-violet-950 dark:bg-violet-950/50 dark:text-violet-600
        `,
        variant: "info",
      },
      {
        appearance: "outline",
        className: `
          border-zinc-300 bg-zinc-100 text-zinc-950
          dark:border-zinc-300/10 dark:bg-zinc-300/10 dark:text-zinc-200
        `,
        variant: "mono",
      },
      {
        appearance: "outline",
        className: "border-destructive/10 bg-destructive/10 text-destructive",
        variant: "destructive",
      },

      {
        appearance: "light",
        className: "bg-primary/10 text-primary",
        variant: "primary",
      },
      {
        appearance: "light",
        className: `
          bg-secondary text-secondary-foreground
          dark:bg-secondary/50
        `,
        variant: "secondary",
      },
      {
        appearance: "light",
        className: `
          border bg-green-100 text-green-700
          dark:bg-green-950/50 dark:text-green-600
        `,
        variant: "success",
      },
      {
        appearance: "light",
        className: `
          border bg-yellow-100 text-yellow-700
          dark:bg-yellow-950/50 dark:text-yellow-600
        `,
        variant: "warning",
      },
      {
        appearance: "light",
        className: `
          border bg-violet-100 text-violet-700
          dark:bg-violet-950/50 dark:text-violet-600
        `,
        variant: "info",
      },
      {
        appearance: "light",
        className: `
          bg-zinc-200 text-zinc-950
          dark:bg-zinc-300/10 dark:text-zinc-200
        `,
        variant: "mono",
      },
      {
        appearance: "light",
        className: "bg-destructive/10 text-destructive",
        variant: "destructive",
      },

      {
        appearance: "ghost",
        className: "text-primary",
        variant: "primary",
      },
      {
        appearance: "ghost",
        className: "text-secondary-foreground",
        variant: "secondary",
      },
      {
        appearance: "ghost",
        className: "text-green-500",
        variant: "success",
      },
      {
        appearance: "ghost",
        className: "text-yellow-500",
        variant: "warning",
      },
      { appearance: "ghost", className: "text-violet-500", variant: "info" },
      { appearance: "ghost", className: "text-foreground", variant: "mono" },
      {
        appearance: "ghost",
        className: "text-destructive",
        variant: "destructive",
      },

      { appearance: "ghost", className: "px-0", size: "lg" },
      { appearance: "ghost", className: "px-0", size: "md" },
      { appearance: "ghost", className: "px-0", size: "sm" },
      { appearance: "ghost", className: "px-0", size: "xs" },
    ],
    defaultVariants: {
      appearance: "solid",
      size: "md",
      variant: "secondary",
    },
    variants: {
      appearance: {
        ghost: "border-transparent bg-transparent",
        light: "",
        outline: "",
        solid: "border-transparent",
        stroke: "border border-border bg-transparent text-secondary-foreground",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
      },
      shape: {
        circle: "rounded-full",
        default: "",
      },
      size: {
        lg: `
          h-7 min-w-7 gap-1.5 rounded-md px-[0.5rem] text-xs
          [&_svg]:size-3.5
        `,
        md: `
          h-6 min-w-6 gap-1.5 rounded-md px-[0.45rem] text-xs
          [&_svg]:size-3.5
        `,
        sm: `
          h-5 min-w-5 gap-1 rounded-sm px-[0.325rem] text-[0.6875rem]
          leading-[0.75rem]
          [&_svg]:size-3
        `,
        xs: `
          h-4 min-w-4 gap-1 rounded-sm px-[0.25rem] text-[0.625rem]
          leading-[0.5rem]
          [&_svg]:size-3
        `,
      },
      variant: {
        destructive: "bg-destructive text-destructive-foreground",
        info: "bg-violet-500 text-white",
        mono: `
          bg-zinc-950 text-white
          dark:bg-zinc-300 dark:text-black
        `,
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
      },
    },
  }
);

const badgeButtonVariants = cva(
  `
    -me-0.5 inline-flex size-3.5 cursor-pointer items-center justify-center
    rounded-md p-0 leading-none opacity-60 transition-all
    hover:opacity-100
    [&>svg]:size-3.5 [&>svg]:opacity-100!
  `,
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "",
      },
    },
  }
);

function Badge({
  appearance,
  asChild = false,
  className,
  disabled,
  shape,
  size,
  variant,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      className={cn(
        badgeVariants({ appearance, disabled, shape, size, variant }),
        className
      )}
      data-slot="badge"
      {...props}
    />
  );
}

function BadgeButton({
  asChild = false,
  className,
  variant,
  ...props
}: BadgeButtonProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      className={cn(badgeButtonVariants({ className, variant }))}
      data-slot="badge-button"
      role="button"
      {...props}
    />
  );
}

function BadgeDot({ className, ...props }: BadgeDotProps) {
  return (
    <span
      className={cn(
        "size-1.5 rounded-full bg-[currentColor] opacity-75",
        className
      )}
      data-slot="badge-dot"
      {...props}
    />
  );
}

export { Badge, BadgeButton, BadgeDot, badgeVariants };
