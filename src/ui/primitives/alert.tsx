import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type * as React from "react";

import { cn } from "~/lib/utils";
import { Button } from "~/ui/primitives/button";

const alertVariants = cva(
  `
    flex w-full items-stretch gap-2
    group-[.toaster]:w-(--width)
  `,
  {
    compoundVariants: [
      {
        appearance: "solid",
        className:
          `
            bg-muted text-foreground
            *:data-alert-close:text-foreground
          `,
        variant: "secondary",
      },
      {
        appearance: "solid",
        className:
          `
            bg-primary text-primary-foreground
            *:data-alert-close:text-primary-foreground
          `,
        variant: "primary",
      },
      {
        appearance: "solid",
        className:
          `
            bg-destructive text-destructive-foreground
            *:data-alert-close:text-destructive-foreground
          `,
        variant: "destructive",
      },
      {
        appearance: "solid",
        className: `
          bg-green-500 text-white
          *:data-alert-close:text-white
        `,
        variant: "success",
      },
      {
        appearance: "solid",
        className: `
          bg-violet-600 text-white
          *:data-alert-close:text-white
        `,
        variant: "info",
      },
      {
        appearance: "solid",
        className: `
          bg-yellow-500 text-white
          *:data-alert-close:text-white
        `,
        variant: "warning",
      },
      {
        appearance: "solid",
        className:
          `
            bg-zinc-950 text-white
            *:data-alert-close:text-white
            dark:bg-zinc-300 dark:text-black dark:*:data-alert-close:text-black
          `,
        variant: "mono",
      },

      {
        appearance: "outline",
        className:
          `
            border border-border bg-background text-foreground
            *:data-alert-close:text-foreground
          `,
        variant: "secondary",
      },
      {
        appearance: "outline",
        className:
          `
            border border-border bg-background text-primary
            *:data-alert-close:text-foreground
          `,
        variant: "primary",
      },
      {
        appearance: "outline",
        className:
          `
            border border-border bg-background text-destructive
            *:data-alert-close:text-foreground
          `,
        variant: "destructive",
      },
      {
        appearance: "outline",
        className:
          `
            border border-border bg-background text-green-500
            *:data-alert-close:text-foreground
          `,
        variant: "success",
      },
      {
        appearance: "outline",
        className:
          `
            border border-border bg-background text-violet-600
            *:data-alert-close:text-foreground
          `,
        variant: "info",
      },
      {
        appearance: "outline",
        className:
          `
            border border-border bg-background text-yellow-500
            *:data-alert-close:text-foreground
          `,
        variant: "warning",
      },
      {
        appearance: "outline",
        className:
          `
            border border-border bg-background text-foreground
            *:data-alert-close:text-foreground
          `,
        variant: "mono",
      },

      {
        appearance: "stroke",
        className:
          `
            border border-border bg-background
            [&>div:first-of-type>svg]:text-foreground
          `,
        variant: "secondary",
      },
      {
        appearance: "stroke",
        className:
          `
            border border-border bg-background
            [&>div:first-of-type>svg]:text-primary
          `,
        variant: "primary",
      },
      {
        appearance: "stroke",
        className:
          `
            border border-border bg-background
            [&>div:first-of-type>svg]:text-destructive
          `,
        variant: "destructive",
      },
      {
        appearance: "stroke",
        className:
          `
            border border-border bg-background
            [&>div:first-of-type>svg]:text-green-500
          `,
        variant: "success",
      },
      {
        appearance: "stroke",
        className:
          `
            border border-border bg-background
            [&>div:first-of-type>svg]:text-violet-600
          `,
        variant: "info",
      },
      {
        appearance: "stroke",
        className:
          `
            border border-border bg-background
            [&>div:first-of-type>svg]:text-yellow-500
          `,
        variant: "warning",
      },
      {
        appearance: "stroke",
        className:
          `
            border border-border bg-background
            [&>div:first-of-type>svg]:text-foreground
          `,
        variant: "mono",
      },

      {
        appearance: "light",
        className: "border border-border bg-muted text-foreground",
        variant: "secondary",
      },
      {
        appearance: "light",
        className:
          `
            border border-primary/10 bg-primary/5 text-foreground
            [&>div:first-of-type>svg]:text-primary
          `,
        variant: "primary",
      },
      {
        appearance: "light",
        className:
          `
            border border-destructive/10 bg-destructive/5 text-foreground
            [&>div:first-of-type>svg]:text-destructive
          `,
        variant: "destructive",
      },
      {
        appearance: "light",
        className:
          `
            border border-green-200 bg-green-50 text-foreground
            dark:border-green-950/50 dark:bg-green-950/30
            [&>div:first-of-type>svg]:text-green-500
          `,
        variant: "success",
      },
      {
        appearance: "light",
        className:
          `
            border border-violet-200 bg-violet-50 text-foreground
            dark:border-violet-950/50 dark:bg-violet-950/30
            [&>div:first-of-type>svg]:text-violet-600
          `,
        variant: "info",
      },
      {
        appearance: "light",
        className:
          `
            border border-yellow-200 bg-yellow-50 text-foreground
            dark:border-yellow-950/50 dark:bg-yellow-950/30
            [&>div:first-of-type>svg]:text-yellow-500
          `,
        variant: "warning",
      },

      {
        className: "[&>div:first-of-type>svg]:text-primary",
        icon: 'primary',
        variant: "mono",
      },
      {
        className: "[&>div:first-of-type>svg]:text-yellow-500",
        icon: 'warning',
        variant: "mono",
      },
      {
        className: "[&>div:first-of-type>svg]:text-green-500",
        icon: 'success',
        variant: "mono",
      },
      {
        className: "[&>div:first-of-type>svg]:text-destructive",
        icon: 'destructive',
        variant: "mono",
      },
      {
        className: "[&>div:first-of-type>svg]:text-violet-600',
        icon: 'info',
        variant: 'mono",
      },
    ],
    defaultVariants: {
      appearance: 'solid',
      size: 'md',
      variant: "secondary",
    },
    variants: {
      appearance: {
        light: '',
        outline: '",
        solid: '',
        stroke: 'text-foreground",
      },
      icon: {
        destructive: '',
        info: '',
        primary: '',
        success: '',
        warning: '',
      },
      size: {
        lg: `
          gap-3 rounded-lg p-4 text-base
          *:data-slot=alert-close:-me-0.5 *:data-slot=alert-close:mt-0.5
          *:data-slot=alert-icon:mt-0
          [&>[data-slot=alert-icon]>svg]:size-6
        `,
        md: `
          gap-2.5 rounded-lg p-3.5 text-sm
          *:data-slot=alert-close:-me-0.5 *:data-slot=alert-icon:mt-0
          [&>[data-slot=alert-icon]>svg]:size-5
        `,
        sm: `
          gap-2 rounded-md px-3 py-2.5 text-xs
          *:data-alert-icon:mt-0.5 *:data-slot=alert-close:-me-0.5
          [&>[data-slot=alert-close]>svg]:size-3.5!
          [&>[data-slot=alert-icon]>svg]:size-4
        `,
      },
      variant: {
        destructive: "',
        info: '',
        mono: '',
        primary: '',
        secondary: "',
        success: '',
        warning: '',
      },
    },
  },
);

interface AlertIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  close?: boolean;
  onClose?: () => void;
}

function Alert({
  appearance,
  children,
  className,
  close = false,
  icon,
  onClose,
  size,
  variant,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        alertVariants({ appearance, icon, size, variant }),
        className,
      )}
      data-slot="alert"
      role="alert"
      {...props}
    >
      {children}
      {close && (
        <Button
          aria-label="Dismiss"
          className={cn("group size-4 shrink-0")}
          data-alert-close="true"
          mode="icon"
          onClick={onClose}
          size="sm"
          variant="inverse"
        >
          <X
            className={`
            size-4! opacity-60!
            group-hover:opacity-100!
          `}
          />
        </Button>
      )}
    </div>
  );
}

function AlertContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn(
        `
          space-y-2
          [&_[data-slot=alert-title]]:font-semibold
        `,
        className,
      )}
      data-slot="alert-content"
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn(
        `
        text-sm
        [&_p]:mb-2 [&_p]:leading-relaxed
      `,
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

function AlertIcon({ children, className, ...props }: AlertIconProps) {
  return (
    <div
      className={cn("shrink-0", className)}
      data-slot="alert-icon"
      {...props}
    >
      {children}
    </div>
  );
}

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div
      className={cn("grow tracking-tight", className)}
      data-slot="alert-title"
      {...props}
    />
  );
}

function AlertToolbar({ children, className, ...props }: AlertIconProps) {
  return (
    <div className={cn(className)} data-slot="alert-toolbar" {...props}>
      {children}
    </div>
  );
}

export {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
};
