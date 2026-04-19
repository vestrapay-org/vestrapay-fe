import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../../lib/utils";

export const buttonVariants = cva("vp-btn", {
  variants: {
    variant: {
      default: "vp-btn-default",
      outline: "vp-btn-outline",
      secondary: "vp-btn-secondary",
      ghost: "vp-btn-ghost",
      destructive: "vp-btn-destructive",
      link: "vp-btn-link",
    },
    size: {
      default: "vp-btn-md",
      xs: "vp-btn-xs",
      sm: "vp-btn-sm",
      lg: "vp-btn-lg",
      icon: "vp-btn-icon",
      "icon-xs": "vp-btn-icon-xs",
      "icon-sm": "vp-btn-icon-sm",
      "icon-lg": "vp-btn-icon-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
