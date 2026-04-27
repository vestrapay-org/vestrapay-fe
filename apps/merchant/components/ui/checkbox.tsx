"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "peer size-4 shrink-0 rounded border border-[#D1D5DB] bg-white shadow-xs outline-none transition-shadow",
      "focus-visible:border-[#0C0644] focus-visible:ring-[3px] focus-visible:ring-[#0C0644]/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-[#0C0644] data-[state=checked]:bg-[#0C0644] data-[state=checked]:text-white",
      "data-[state=indeterminate]:border-[#0C0644] data-[state=indeterminate]:bg-[#0C0644] data-[state=indeterminate]:text-white",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current transition-none"
    >
      <Check className="size-3.5 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
