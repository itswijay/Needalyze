"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import { XIcon } from "lucide-react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Radix unmounts its content the instant `open` flips false, which leaves no
 * frame for an exit animation to play in. The fix is `forceMount` plus an
 * AnimatePresence that owns the unmount — but that means DialogContent has to
 * know whether the dialog is open, and Radix exposes no public hook for it.
 * Hence this context: the Dialog wrapper mirrors the open state, in both the
 * controlled and uncontrolled cases, and publishes it downwards.
 */
const DialogOpenContext = React.createContext(false)

function Dialog({ open, defaultOpen, onOpenChange, children, ...props }) {
  const isControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  )
  const actualOpen = isControlled ? open : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (next) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <DialogOpenContext.Provider value={actualOpen}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={actualOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogOpenContext.Provider>
  );
}

function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[var(--surface-overlay)] backdrop-blur-sm",
        className
      )}
      {...props} />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  const open = React.useContext(DialogOpenContext)
  const m = useMotion()

  return (
    <AnimatePresence>
      {open && (
        <DialogPortal forceMount data-slot="dialog-portal">
          <DialogOverlay forceMount asChild>
            <motion.div
              variants={m.overlay}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
          </DialogOverlay>

          <DialogPrimitive.Content
            data-slot="dialog-content"
            forceMount
            asChild
            {...props}
          >
            {/* Centred with `inset-0 m-auto h-fit` rather than the usual
                top/left 50% plus a -50% translate. Framer writes the whole
                transform property when it animates scale, so a translate-based
                centring would be wiped out on the first frame. */}
            <motion.div
              variants={m.dialog}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "fixed inset-0 z-50 m-auto grid h-fit w-full max-w-[calc(100%-2rem)] gap-4",
                "rounded-2xl border border-border bg-surface-raised p-6 shadow-xl sm:max-w-lg",
                className
              )}
            >
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close
                  data-slot="dialog-close"
                  className="absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground opacity-80 transition-[color,background-color,opacity] hover:bg-surface-hover hover:text-foreground hover:opacity-100 focus:ring-2 focus:ring-ring/50 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                  <XIcon />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPortal>
      )}
    </AnimatePresence>
  );
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props} />
  );
}

function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props} />
  );
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold tracking-tight", className)}
      {...props} />
  );
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
