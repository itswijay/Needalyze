import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // The pill shape is the app's established field idiom — every auth and
        // wizard screen was appending `rounded-full` by hand. It lives here now.
        "flex h-11 w-full min-w-0 rounded-full border border-border bg-surface-sunken px-4 py-1 text-base",
        "text-foreground placeholder:text-muted-foreground/80 placeholder:text-sm",
        "selection:bg-primary selection:text-primary-foreground",
        "transition-[color,background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out-expo)]",
        "outline-none focus-visible:border-primary-300 focus-visible:bg-surface-raised focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Input }
