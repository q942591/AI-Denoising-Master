"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

// Variants
const accordionRootVariants = cva("", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "",
      outline: "space-y-2",
      solid: "space-y-2",
    },
  },
});

const accordionItemVariants = cva("", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "border-b border-border",
      outline: "rounded-lg border border-border px-4",
      solid: "rounded-lg bg-accent/70 px-4",
    },
  },
});

const accordionTriggerVariants = cva(
  `
    flex flex-1 cursor-pointer items-center justify-between gap-2.5 py-4
    font-medium text-foreground transition-all
    [&[data-state=open]>svg]:rotate-180
  `,
  {
    defaultVariants: {
      indicator: "arrow",
      variant: "default",
    },
    variants: {
      indicator: {
        arrow: "",
        none: "",
        plus: `
          [&>svg>path:last-child]:origin-center
          [&>svg>path:last-child]:transition-all
          [&>svg>path:last-child]:duration-200
          [&[data-state=open]>svg]:rotate-180
          [&[data-state=open]>svg>path:last-child]:rotate-90
          [&[data-state=open]>svg>path:last-child]:opacity-0
        `,
      },
      variant: {
        default: "",
        outline: "",
        solid: "",
      },
    },
  }
);

const accordionContentVariants = cva(
  `
    overflow-hidden text-sm text-accent-foreground transition-all
    data-[state=closed]:animate-accordion-up
    data-[state=open]:animate-accordion-down
  `,
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "",
        outline: "",
        solid: "",
      },
    },
  }
);

// Context
interface AccordionContextType {
  indicator?: "arrow" | "none" | "plus";
  variant?: "default" | "outline" | "solid";
}

const AccordionContext = React.createContext<AccordionContextType>({
  indicator: "arrow",
  variant: "default",
});

// Components
function Accordion(
  props: React.ComponentProps<typeof AccordionPrimitive.Root> &
    VariantProps<typeof accordionRootVariants> & {
      indicator?: "arrow" | "plus";
    }
) {
  const {
    children,
    className,
    indicator = "arrow",
    variant = "default",
    ...rest
  } = props;

  return (
    <AccordionContext value={{ indicator, variant: variant || "default" }}>
      <AccordionPrimitive.Root
        className={cn(accordionRootVariants({ variant }), className)}
        data-slot="accordion"
        {...rest}
      >
        {children}
      </AccordionPrimitive.Root>
    </AccordionContext>
  );
}

function AccordionContent(
  props: React.ComponentProps<typeof AccordionPrimitive.Content>
) {
  const { children, className, ...rest } = props;
  const { variant } = React.use(AccordionContext);

  return (
    <AccordionPrimitive.Content
      className={cn(accordionContentVariants({ variant }), className)}
      data-slot="accordion-content"
      {...rest}
    >
      <div className={cn("pt-0 pb-5", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

function AccordionItem(
  props: React.ComponentProps<typeof AccordionPrimitive.Item>
) {
  const { children, className, ...rest } = props;
  const { variant } = React.use(AccordionContext);

  return (
    <AccordionPrimitive.Item
      className={cn(accordionItemVariants({ variant }), className)}
      data-slot="accordion-item"
      {...rest}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

function AccordionTrigger(
  props: React.ComponentProps<typeof AccordionPrimitive.Trigger>
) {
  const { children, className, ...rest } = props;
  const { indicator, variant } = React.use(AccordionContext);

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          accordionTriggerVariants({ indicator, variant }),
          className
        )}
        data-slot="accordion-trigger"
        {...rest}
      >
        {children}
        {indicator === "plus" && (
          <Plus
            className="size-4 shrink-0 transition-transform duration-200"
            strokeWidth={1}
          />
        )}
        {indicator === "arrow" && (
          <ChevronDown
            className="size-4 shrink-0 transition-transform duration-200"
            strokeWidth={1}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// Exports
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
