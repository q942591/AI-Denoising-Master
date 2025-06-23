import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, type LucideIcon } from "lucide-react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  `
    group inline-flex cursor-pointer items-center justify-center text-sm
    font-medium whitespace-nowrap ring-offset-background
    transition-[color,box-shadow]
    focus-visible:outline-hidden
    disabled:pointer-events-none disabled:opacity-60
    has-data-[arrow=true]:justify-between
    [&_svg]:shrink-0
  `,
  {
    compoundVariants: [
      // Icons opacity for default mode
      {
        className: "[&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        mode: "default",
        variant: "ghost",
      },
      {
        className: "[&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        mode: "default",
        variant: "outline",
      },
      {
        className: "[&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        mode: "default",
        variant: "dashed",
      },
      {
        className: "[&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        mode: "default",
        variant: "secondary",
      },

      // Icons opacity for default mode
      {
        className: "[&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        mode: "input",
        variant: "outline",
      },
      {
        className: "[&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        mode: "icon",
        variant: "outline",
      },

      // Auto height
      {
        autoHeight: true,
        className: "h-auto min-h-8.5",
        size: "md",
      },
      {
        autoHeight: true,
        className: "h-auto min-h-7",
        size: "sm",
      },
      {
        autoHeight: true,
        className: "h-auto min-h-10",
        size: "lg",
      },

      // Shadow support
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "default",
        variant: "primary",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "default",
        variant: "mono",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "default",
        variant: "secondary",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "default",
        variant: "outline",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "default",
        variant: "dashed",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "default",
        variant: "destructive",
      },

      // Shadow support
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "icon",
        variant: "primary",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "icon",
        variant: "mono",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "icon",
        variant: "secondary",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "icon",
        variant: "outline",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "icon",
        variant: "dashed",
      },
      {
        appearance: "default",
        className: "shadow-xs shadow-black/5",
        mode: "icon",
        variant: "destructive",
      },

      // Link
      {
        className: `
          font-medium text-primary
          hover:text-primary/90 hover:underline hover:decoration-solid
          hover:underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underline: "solid",
        variant: "primary",
      },
      {
        className: `
          font-medium text-primary decoration-1
          hover:text-primary/90 hover:underline hover:decoration-dashed
          hover:underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underline: "dashed",
        variant: "primary",
      },
      {
        className: `
          font-medium text-primary underline decoration-solid underline-offset-4
          hover:text-primary/90
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underlined: "solid",
        variant: "primary",
      },
      {
        className: `
          font-medium text-primary underline decoration-dashed decoration-1
          underline-offset-4
          hover:text-primary/90
          [&_svg]:opacity-60
        `,
        mode: "link",
        underlined: "dashed",
        variant: "primary",
      },

      {
        className: `
          font-medium text-inherit
          hover:underline hover:decoration-solid hover:underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underline: "solid",
        variant: "inverse",
      },
      {
        className: `
          font-medium text-inherit decoration-1
          hover:underline hover:decoration-dashed hover:underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underline: "dashed",
        variant: "inverse",
      },
      {
        className: `
          font-medium text-inherit underline decoration-solid underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underlined: "solid",
        variant: "inverse",
      },
      {
        className: `
          font-medium text-inherit underline decoration-dashed decoration-1
          underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underlined: "dashed",
        variant: "inverse",
      },

      {
        className: `
          font-medium text-foreground
          hover:underline hover:decoration-solid hover:underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underline: "solid",
        variant: "foreground",
      },
      {
        className: `
          font-medium text-foreground decoration-1
          hover:underline hover:decoration-dashed hover:underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underline: "dashed",
        variant: "foreground",
      },
      {
        className: `
          font-medium text-foreground underline decoration-solid
          underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underlined: "solid",
        variant: "foreground",
      },
      {
        className: `
          font-medium text-foreground underline decoration-dashed decoration-1
          underline-offset-4
          [&_svg:not([role=img]):not([class*=text-])]:opacity-60
        `,
        mode: "link",
        underlined: "dashed",
        variant: "foreground",
      },

      // Ghost
      {
        appearance: "ghost",
        className: `
          bg-transparent text-primary/90
          hover:bg-primary/5
          data-[state=open]:bg-primary/5
        `,
        variant: "primary",
      },
      {
        appearance: "ghost",
        className: `
          bg-transparent text-destructive/90
          hover:bg-destructive/5
          data-[state=open]:bg-destructive/5
        `,
        variant: "destructive",
      },
      {
        className: "text-muted-foreground",
        mode: "icon",
        variant: "ghost",
      },

      // Size
      {
        className: `
          [[&_svg:not([class*=size-])]:size-3.5
          h-7 w-7 p-0
        `,
        mode: "icon",
        size: "sm",
      },
      {
        className: `
          h-8.5 w-8.5 p-0
          [&_svg:not([class*=size-])]:size-4
        `,
        mode: "icon",
        size: "md",
      },
      {
        className: `
          h-10 w-10 p-0
          [&_svg:not([class*=size-])]:size-4
        `,
        mode: "icon",
        size: "lg",
      },

      // Input mode
      {
        className: "font-normal text-muted-foreground",
        mode: "input",
        placeholder: true,
        variant: "outline",
      },
      {
        className: "gap-1.25",
        mode: "input",
        size: "sm",
        variant: "outline",
      },
      {
        className: "gap-1.5",
        mode: "input",
        size: "md",
        variant: "outline",
      },
      {
        className: "gap-1.5",
        mode: "input",
        size: "lg",
        variant: "outline",
      },
    ],
    defaultVariants: {
      appearance: "default",
      mode: "default",
      shape: "default",
      size: "md",
      variant: "primary",
    },
    variants: {
      appearance: {
        default: "",
        ghost: "",
      },
      autoHeight: {
        false: "",
        true: "",
      },
      mode: {
        default: `
          focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2
        `,
        icon: `
          focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2
        `,
        input: `
          justify-start font-normal
          hover:bg-background
          focus-visible:border-ring focus-visible:ring-[3px]
          focus-visible:ring-ring/30 focus-visible:outline-hidden
          in-data-[invalid=true]:border-destructive/60
          in-data-[invalid=true]:ring-destructive/10
          aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10
          data-[state=open]:bg-background
          dark:in-data-[invalid=true]:border-destructive
          dark:in-data-[invalid=true]:ring-destructive/20
          dark:aria-invalid:border-destructive
          dark:aria-invalid:ring-destructive/20
          [&_svg]:transition-colors [&_svg]:hover:text-foreground
          [[data-state=open]>&]:border-ring [[data-state=open]>&]:ring-[3px]
          [[data-state=open]>&]:ring-ring/30
          [[data-state=open]>&]:outline-hidden
        `,
        link: `
          h-auto rounded-none bg-transparent p-0 text-primary
          hover:bg-transparent
          data-[state=open]:bg-transparent
        `,
      },
      placeholder: {
        false: "",
        true: "text-muted-foreground",
      },
      shape: {
        circle: "rounded-full",
        default: "",
      },
      size: {
        lg: `
          h-10 gap-1.5 rounded-md px-4 text-sm
          [&_svg:not([class*=size-])]:size-4
        `,
        md: `
          h-8.5 gap-1.5 rounded-md px-3 text-[0.8125rem]
          leading-(--text-sm--line-height)
          [&_svg:not([class*=size-])]:size-4
        `,
        sm: `
          h-7 gap-1.25 rounded-md px-2.5 text-xs
          [&_svg:not([class*=size-])]:size-3.5
        `,
      },
      underline: {
        dashed: "",
        solid: "",
      },
      underlined: {
        dashed: "",
        solid: "",
      },
      variant: {
        dashed: `
          border border-dashed border-input bg-background text-accent-foreground
          hover:bg-accent hover:text-accent-foreground
          data-[state=open]:text-accent-foreground
        `,
        destructive: `
          bg-destructive text-destructive-foreground
          hover:bg-destructive/90
          data-[state=open]:bg-destructive/90
        `,
        dim: `
          text-muted-foreground
          hover:text-foreground
          data-[state=open]:text-foreground
        `,
        foreground: "",
        ghost: `
          text-accent-foreground
          hover:bg-accent hover:text-accent-foreground
          data-[state=open]:bg-accent data-[state=open]:text-accent-foreground
        `,
        inverse: "",
        mono: `
          bg-zinc-950 text-white
          hover:bg-zinc-950/90
          data-[state=open]:bg-zinc-950/90
          dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-300/90
          dark:data-[state=open]:bg-zinc-300/90
        `,
        outline: `
          border border-input bg-background text-accent-foreground
          hover:bg-accent
          data-[state=open]:bg-accent
        `,
        primary: `
          bg-primary text-primary-foreground
          hover:bg-primary/90
          data-[state=open]:bg-primary/90
        `,
        secondary: `
          bg-secondary text-secondary-foreground
          hover:bg-secondary/90
          data-[state=open]:bg-secondary/90
        `,
      },
    },
  }
);

interface ButtonArrowProps extends React.SVGProps<SVGSVGElement> {
  icon?: LucideIcon; // Allows passing any Lucide icon
}

function Button({
  appearance,
  asChild = false,
  autoHeight,
  className,
  mode,
  placeholder = false,
  selected,
  shape,
  size,
  underline,
  underlined,
  variant,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    selected?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        buttonVariants({
          appearance,
          autoHeight,
          className,
          mode,
          placeholder,
          shape,
          size,
          underline,
          underlined,
          variant,
        }),
        asChild && props.disabled && "pointer-events-none opacity-50"
      )}
      data-slot="button"
      {...(selected && { "data-state": "open" })}
      {...props}
    />
  );
}

function ButtonArrow({
  className,
  icon: Icon = ChevronDown,
  ...props
}: ButtonArrowProps) {
  return (
    <Icon
      className={cn("ms-auto -me-1", className)}
      data-slot="button-arrow"
      {...props}
    />
  );
}

export { Button, ButtonArrow, buttonVariants };
