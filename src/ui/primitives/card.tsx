"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

// Define CardContext
interface CardContextType {
  variant: "accent" | "default";
}

const CardContext = React.createContext<CardContextType>({
  variant: "default", // Default value
});

// Hook to use CardContext
const useCardContext = () => {
  const context = React.use(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a Card component");
  }
  return context;
};

// Variants
const cardVariants = cva(
  "flex flex-col items-stretch rounded-xl text-card-foreground",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        accent: "bg-muted p-1 shadow-xs",
        default: "black/5 border border-border bg-card shadow-xs",
      },
    },
  }
);

const cardHeaderVariants = cva(
  "flex min-h-14 flex-wrap items-center justify-between gap-2.5 px-5",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        accent: "",
        default: "border-b border-border",
      },
    },
  }
);

const cardContentVariants = cva("grow p-5", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      accent: `
        rounded-t-xl bg-card
        [&:last-child]:rounded-b-xl
      `,
      default: "",
    },
  },
});

const cardTableVariants = cva("grid grow", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      accent: "rounded-xl bg-card",
      default: "",
    },
  },
});

const cardFooterVariants = cva("flex min-h-14 items-center px-5", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      accent: "mt-[2px] rounded-b-xl bg-card",
      default: "border-t border-border",
    },
  },
});

// Card Component
function Card({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return (
    <CardContext value={{ variant: variant || "default" }}>
      <div
        className={cn(cardVariants({ variant }), className)}
        data-slot="card"
        {...props}
      />
    </CardContext>
  );
}

// CardContent Component
function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardContentVariants({ variant }), className)}
      data-slot="card-content"
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

// CardFooter Component
function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardFooterVariants({ variant }), className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

// CardHeader Component
function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardHeaderVariants({ variant }), className)}
      data-slot="card-header"
      {...props}
    />
  );
}

// Other Components
function CardHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-1", className)}
      data-slot="card-heading"
      {...props}
    />
  );
}

// CardTable Component
function CardTable({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      className={cn(cardTableVariants({ variant }), className)}
      data-slot="card-table"
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base leading-none font-semibold tracking-tight",
        className
      )}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardToolbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2.5", className)}
      data-slot="card-toolbar"
      {...props}
    />
  );
}

// Exports
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardTitle,
  CardToolbar,
};
