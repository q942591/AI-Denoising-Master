"use client";

import type * as React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";

import { cn } from "~/lib/utils";

// Define the variants for the Checkbox using cva.
const checkboxVariants = cva(
  `
    group peer shrink-0 rounded-md border border-input bg-background
    ring-offset-background
    dark:[[data-invalid=true]_&]:ring-destructive/20,
    dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    dark:[[data-invalid=true]_&]:border-destructive
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    focus-visible:outline-none
    disabled:cursor-not-allowed disabled:opacity-50
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10
    data-[state=checked]:border-primary data-[state=checked]:bg-primary
    data-[state=checked]:text-primary-foreground
    data-[state=indeterminate]:border-primary
    data-[state=indeterminate]:bg-primary
    data-[state=indeterminate]:text-primary-foreground
    [[data-invalid=true]_&]:border-destructive/60
    [[data-invalid=true]_&]:ring-destructive/10
  `,
  {
    defaultVariants: {
      size: "md",
    },
    variants: {
      size: {
        lg: `
          size-5.5
          [&_svg]:size-4
        `,
        md: `
          size-5
          [&_svg]:size-3.5
        `,
        sm: `
          size-4.5
          [&_svg]:size-3
        `,
      },
    },
  }
);

function Checkbox({
  className,
  size,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxVariants({ size }), className)}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="group-data-[state=indeterminate]:hidden" />
        <Minus
          className={`
          hidden
          group-data-[state=indeterminate]:block
        `}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
