import type { Column } from "@tanstack/react-table";
import type * as React from "react";

import { Check, CirclePlus } from "lucide-react";

import { cn } from "~/lib/utils";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/ui/primitives/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/ui/primitives/popover";
import { Separator } from "~/ui/primitives/separator";

interface DataGridColumnFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  options: {
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }[];
  title?: string;
}

function DataGridColumnFilter<TData, TValue>({
  column,
  options,
  title,
}: DataGridColumnFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <CirclePlus className="size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator className="mx-2 h-4" orientation="vertical" />
              <Badge
                className={`
                  rounded-sm px-1 font-normal
                  lg:hidden
                `}
                variant="secondary"
              >
                {selectedValues.size}
              </Badge>
              <div
                className={`
                hidden space-x-1
                lg:flex
              `}
              >
                {selectedValues.size > 2 ? (
                  <Badge
                    className="rounded-sm px-1 font-normal"
                    variant="secondary"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        className="rounded-sm px-1 font-normal"
                        key={option.value}
                        variant="secondary"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        `
                          me-2 flex h-4 w-4 items-center justify-center
                          rounded-sm border border-primary
                        `,
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : `
                            opacity-50
                            [&_svg]:invisible
                          `
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon
                        className={`
                        mr-2 h-4 w-4 text-muted-foreground
                      `}
                      />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span
                        className={`
                        ms-auto flex h-4 w-4 items-center justify-center
                        font-mono text-xs
                      `}
                      >
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center text-center"
                    onSelect={() => column?.setFilterValue(undefined)}
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { DataGridColumnFilter, type DataGridColumnFilterProps };
