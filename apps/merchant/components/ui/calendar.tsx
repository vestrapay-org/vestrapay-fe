"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "./button";
import { cn } from "../../lib/utils";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-[#111827]",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "absolute left-1 h-7 w-7 rounded-md p-0 text-[#6B7280] opacity-80 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "absolute right-1 h-7 w-7 rounded-md p-0 text-[#6B7280] opacity-80 hover:opacity-100",
        ),
        month_caption: "flex items-center justify-center h-7",
        weekdays: "flex",
        weekday: "w-9 text-[0.8rem] font-medium text-[#6B7280]",
        week: "mt-1 flex w-full",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-[#111827] aria-selected:opacity-100 hover:bg-[#F3F4F6]",
        ),
        day_button: "h-9 w-9",
        day_selected:
          "bg-[#0C0644] text-white hover:bg-[#0C0644] hover:text-white focus:bg-[#0C0644] focus:text-white",
        day_today: "bg-[#F3F4F6] text-[#111827]",
        day_outside: "text-[#9CA3AF] aria-selected:bg-[#F3F4F6] aria-selected:text-[#9CA3AF]",
        day_disabled: "text-[#D1D5DB] opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
