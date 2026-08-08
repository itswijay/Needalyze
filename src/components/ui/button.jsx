import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "cursor-pointer select-none",
    // Colour and shadow move quickly, transform a touch quicker still, so a
    // press reads as immediate while the hover fill stays smooth.
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-expo)]",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  ),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-500 hover:shadow-md",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-error-500 hover:shadow-md focus-visible:ring-destructive/30",
        outline:
          "border border-border bg-surface-raised text-foreground shadow-xs hover:bg-surface-hover hover:border-primary-200 hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85 hover:shadow-md",
        ghost:
          "hover:bg-surface-hover hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline active:scale-100",
        // The blue ramp the form wizard has always used for Back / Next /
        // Submit. Kept under the name `gradient` so the ~10 existing call
        // sites keep their meaning; only the hardcoded hex moved to tokens.
        gradient:
          "bg-gradient-brand-horizontal text-white shadow-md hover:shadow-lg hover:brightness-110",
        // The brand navy, for primary actions on the marketing and auth
        // surfaces.
        brand:
          "bg-gradient-brand-horizontal text-white shadow-md hover:shadow-lg hover:brightness-110",
        // The green accent, reserved for create/confirm actions — the
        // Create New Link CTA and user approval.
        accent:
          "bg-gradient-accent text-white shadow-md hover:shadow-lg hover:brightness-110",
        success:
          "bg-success-300 text-white shadow-sm hover:bg-success-400 hover:shadow-md",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3.5 text-xs has-[>svg]:px-3",
        lg: "h-12 px-7 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
