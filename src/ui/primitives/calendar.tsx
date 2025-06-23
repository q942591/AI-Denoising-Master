"use client";

import type * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/ui/primitives/button";

const ChevronComponent = (props: {
  className?: string;
  disabled?: boolean;
  orientation?: "down" | "left" | "right" | "up";
  size?: number;
}) => {
  if (props.orientation === "left") {
    return (
      <ChevronLeft
        className={`
          h-4 w-4
          rtl:rotate-180
        `}
      />
    );
  }
  return (
    <ChevronRight
      className={`
        h-4 w-4
        rtl:rotate-180
      `}
    />
  );
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn("p-3", className)}
      classNames={{
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          `
            size-8 p-0 text-muted-foreground/80
            hover:text-foreground
          `
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          `
            size-8 p-0 text-muted-foreground/80
            hover:text-foreground
          `
        ),
        caption_label: "text-sm font-medium",
        day: "group size-8 px-0 py-px text-sm",
        day_button:
          "cursor-pointer relative flex size-8 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground transition-200 group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-accent group-data-selected:bg-primary hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground group-data-disabled:text-foreground/30 group-data-disabled:line-through group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-accent group-[.range-middle]:group-data-selected:text-foreground",
        hidden: "invisible",
        month: "w-full",
        month_caption:
          "relative mx-10 mb-1 flex h-8 items-center justify-center z-20",
        months: "relative flex flex-col sm:flex-row gap-4",
        nav: "absolute top-0 flex w-full justify-between z-10",
        outside:
          "text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground",
        range_end: "range-end",
        range_middle: "range-middle",
        range_start: "range-start",
        today:
          "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 rtl:*:after:translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
        week_number: "size-8 p-0 text-xs font-medium text-muted-foreground/80",
        weekday: "size-8 p-0 text-xs font-medium text-muted-foreground/80",
        ...classNames,
      }}
      components={{
        Chevron: ChevronComponent,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

export { Calendar };
