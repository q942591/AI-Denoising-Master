"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

interface AccordionMenuClassNames {
  group?: string;
  indicator?: string;
  item?: string;
  label?: string;
  root?: string;
  separator?: string;
  sub?: string;
  subContent?: string;
  subTrigger?: string;
  subWrapper?: string;
}

interface AccordionMenuContextValue {
  classNames?: AccordionMenuClassNames;
  matchPath: (href: string) => boolean;
  nestedStates: Record<string, string | string[]>;
  onItemClick?: (value: string, event: React.MouseEvent) => void;
  selectedValue: string | undefined;
  setNestedStates: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface AccordionMenuProps {
  classNames?: AccordionMenuClassNames;
  matchPath?: (href: string) => boolean;
  onItemClick?: (value: string, event: React.MouseEvent) => void;
  selectedValue?: string;
}

const AccordionMenuContext = React.createContext<AccordionMenuContextValue>({
  matchPath: () => false,
  nestedStates: {},
  selectedValue: "",
  setNestedStates: () => {},
  setSelectedValue: () => {},
});

type AccordionMenuGroupProps = React.ComponentPropsWithoutRef<"div">;

type AccordionMenuLabelProps = React.ComponentPropsWithoutRef<"div">;

type AccordionMenuSeparatorProps = React.ComponentPropsWithoutRef<"div">;

function AccordionMenu({
  children,
  className,
  classNames,
  matchPath = () => false,
  onItemClick,
  selectedValue,
  ...props
}: AccordionMenuProps &
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>) {
  const [internalSelectedValue, setInternalSelectedValue] = React.useState<
    string | undefined
  >(selectedValue);
  React.useEffect(() => {
    setInternalSelectedValue(selectedValue);
  }, [selectedValue]);

  const initialNestedStates = React.useMemo(() => {
    const getActiveChain = (
      nodes: React.ReactNode,
      chain: string[] = []
    ): string[] => {
      let result: string[] = [];
      React.Children.forEach(nodes, (node) => {
        if (React.isValidElement(node)) {
          const { children, value } = node.props as {
            children?: React.ReactNode;
            value?: string;
          };
          const newChain = value ? [...chain, value] : chain;
          if (value && (value === selectedValue || matchPath(value))) {
            result = newChain;
          } else if (children) {
            const childChain = getActiveChain(children, newChain);
            if (childChain.length > 0) {
              result = childChain;
            }
          }
        }
      });
      return result;
    };

    const chain = getActiveChain(children);
    const trimmedChain =
      chain.length > 1 ? chain.slice(0, chain.length - 1) : chain;
    const mapping: Record<string, string | string[]> = {};
    if (trimmedChain.length > 0) {
      if (props.type === "multiple") {
        mapping["root"] = trimmedChain;
      } else {
        mapping["root"] = trimmedChain[0];
        for (let i = 0; i < trimmedChain.length - 1; i++) {
          mapping[trimmedChain[i]] = trimmedChain[i + 1];
        }
      }
    }
    return mapping;
  }, [children, matchPath, selectedValue, props.type]);

  const [nestedStates, setNestedStates] =
    React.useState<Record<string, string | string[]>>(initialNestedStates);
  const multipleValue = (
    Array.isArray(nestedStates["root"])
      ? nestedStates["root"]
      : typeof nestedStates["root"] === "string"
      ? [nestedStates["root"]]
      : []
  ) as string[];
  const singleValue = (nestedStates["root"] ?? "") as string;

  return (
    <AccordionMenuContext
      value={{
        classNames,
        matchPath,
        nestedStates,
        onItemClick,
        selectedValue: internalSelectedValue,
        setNestedStates,
        setSelectedValue: setInternalSelectedValue,
      }}
    >
      {props.type === "single" ? (
        <AccordionPrimitive.Root
          className={cn("w-full", classNames?.root, className)}
          data-slot="accordion-menu"
          onValueChange={(value: string) =>
            setNestedStates((prev) => ({ ...prev, root: value }))
          }
          value={singleValue}
          {...props}
          role="menu"
        >
          {children}
        </AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root
          className={cn("w-full", classNames?.root, className)}
          data-slot="accordion-menu"
          onValueChange={(value: string | string[]) =>
            setNestedStates((prev) => ({ ...prev, root: value }))
          }
          value={multipleValue}
          {...props}
          role="menu"
        >
          {children}
        </AccordionPrimitive.Root>
      )}
    </AccordionMenuContext>
  );
}

function AccordionMenuGroup({
  children,
  className,
  ...props
}: AccordionMenuGroupProps) {
  const { classNames } = React.use(AccordionMenuContext);
  return (
    <div
      className={cn("space-y-0.5", classNames?.group, className)}
      data-slot="accordion-menu-group"
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

function AccordionMenuLabel({
  children,
  className,
  ...props
}: AccordionMenuLabelProps) {
  const { classNames } = React.use(AccordionMenuContext);

  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        classNames?.label,
        className
      )}
      data-slot="accordion-menu-label"
      role="presentation"
      {...props}
    >
      {children}
    </div>
  );
}

function AccordionMenuSeparator({
  className,
  ...props
}: AccordionMenuSeparatorProps) {
  const { classNames } = React.use(AccordionMenuContext);
  return (
    <div
      className={cn("my-1 h-px bg-border", classNames?.separator, className)}
      data-slot="accordion-menu-separator"
      role="separator"
      {...props}
    />
  );
}

const itemVariants = cva(
  `
    relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-2
    py-1.5 text-start text-sm text-foreground outline-hidden transition-colors
    select-none
    hover:bg-accent hover:text-accent-foreground
    focus-visible:bg-accent focus-visible:text-accent-foreground
    disabled:bg-transparent disabled:opacity-50
    data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground
    [&_a]:flex
    [&_a,&>div]:w-full [&_a,&>div]:items-center [&_a,&>div]:gap-2
    [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:opacity-60
    [&_svg:not([class*=size-])]:size-4
  `,
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "",
        destructive: `
          text-destructive
          hover:bg-destructive/5 hover:text-destructive
          focus:bg-destructive/5 focus:text-destructive
          data-[active=true]:bg-destructive/5
        `,
      },
    },
  }
);

type AccordionMenuIndicatorProps = React.ComponentPropsWithoutRef<"span">;

type AccordionMenuSubContentProps = {
  parentValue: string;
} & (
  | (React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
      collapsible: boolean;
      defaultValue?: string;
      type: "single";
    })
  | (React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
      collapsible?: boolean;
      defaultValue?: string | string[];
      type: "multiple";
    })
);

function AccordionMenuIndicator({
  className,
  ...props
}: AccordionMenuIndicatorProps) {
  const { classNames } = React.use(AccordionMenuContext);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ms-auto flex items-center font-medium",
        classNames?.indicator,
        className
      )}
      data-slot="accordion-menu-indicator"
      {...props}
    />
  );
}

function AccordionMenuItem({
  asChild,
  children,
  className,
  onClick,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  VariantProps<typeof itemVariants> & {
    onClick?: React.MouseEventHandler<HTMLElement>;
  }) {
  const { classNames, matchPath, onItemClick, selectedValue } =
    React.use(AccordionMenuContext);
  return (
    <AccordionPrimitive.Item className="flex" {...props}>
      <AccordionPrimitive.Header className="flex w-full">
        <AccordionPrimitive.Trigger
          asChild={asChild}
          className={cn(itemVariants({ variant }), classNames?.item, className)}
          data-selected={
            matchPath(props.value as string) || selectedValue === props.value
              ? "true"
              : undefined
          }
          data-slot="accordion-menu-item"
          onClick={(e) => {
            if (onItemClick) {
              onItemClick(props.value, e);
            }

            if (onClick) {
              onClick(e);
            }
            e.preventDefault();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const target = e.currentTarget as HTMLElement;
              const firstChild = target.firstElementChild as HTMLElement | null;
              if (firstChild) {
                firstChild.click();
              }
            }
          }}
        >
          {children}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </AccordionPrimitive.Item>
  );
}

function AccordionMenuSub({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  const { classNames } = React.use(AccordionMenuContext);
  return (
    <AccordionPrimitive.Item
      className={cn(classNames?.sub, className)}
      data-slot="accordion-menu-sub"
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

function AccordionMenuSubContent({
  children,
  className,
  collapsible,
  defaultValue,
  parentValue,
  type,
  ...props
}: AccordionMenuSubContentProps) {
  const { classNames, nestedStates, setNestedStates } =
    React.use(AccordionMenuContext);
  let currentValue;
  if (type === "multiple") {
    const stateValue = nestedStates[parentValue];
    if (Array.isArray(stateValue)) {
      currentValue = stateValue;
    } else if (typeof stateValue === "string") {
      currentValue = [stateValue];
    } else if (defaultValue) {
      currentValue = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue];
    } else {
      currentValue = [];
    }
  } else {
    currentValue = nestedStates[parentValue] ?? defaultValue ?? "";
  }

  return (
    <AccordionPrimitive.Content
      className={cn(
        "ps-5",
        `
          overflow-hidden transition-all
          data-[state=closed]:animate-accordion-up
          data-[state=open]:animate-accordion-down
        `,
        classNames?.subContent,
        className
      )}
      data-slot="accordion-menu-sub-content"
      {...props}
    >
      {type === "multiple" ? (
        <AccordionPrimitive.Root
          className={cn("w-full py-0.5", classNames?.subWrapper)}
          data-slot="accordion-menu-sub-wrapper"
          onValueChange={(value: string | string[]) => {
            const newValue = Array.isArray(value) ? value : [value];
            setNestedStates((prev) => ({ ...prev, [parentValue]: newValue }));
          }}
          role="menu"
          type="multiple"
          value={currentValue as string[]}
        >
          {children}
        </AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root
          className={cn("w-full py-0.5", classNames?.subWrapper)}
          collapsible={collapsible}
          data-slot="accordion-menu-sub-wrapper"
          onValueChange={(value: string | string[]) =>
            setNestedStates((prev) => ({ ...prev, [parentValue]: value }))
          }
          role="menu"
          type="single"
          value={currentValue as string}
        >
          {children}
        </AccordionPrimitive.Root>
      )}
    </AccordionPrimitive.Content>
  );
}

function AccordionMenuSubTrigger({
  children,
  className,
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  const { classNames } = React.use(AccordionMenuContext);
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          `
            relative flex w-full cursor-pointer items-center gap-2 rounded-lg
            px-2 py-1.5 text-start text-sm text-foreground outline-hidden
            transition-colors select-none
            hover:bg-accent hover:text-accent-foreground
            focus-visible:bg-accent focus-visible:text-accent-foreground
            [&_svg]:pointer-events-none [&_svg]:shrink-0
            [&_svg:not([class*=size-])]:size-4
            [&_svg:not([role=img]):not([class*=text-])]:opacity-60
          `,
          classNames?.subTrigger,
          className
        )}
        data-slot="accordion-menu-sub-trigger"
      >
        <>
          {children}
          <ChevronDown
            className={cn(
              `
                ms-auto size-3.5! shrink-0 text-muted-foreground
                transition-transform duration-200
                [[data-state=open]>&]:-rotate-180
              `
            )}
            data-slot="accordion-menu-sub-indicator"
          />
        </>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export {
  AccordionMenu,
  type AccordionMenuClassNames,
  AccordionMenuGroup,
  AccordionMenuIndicator,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
};
