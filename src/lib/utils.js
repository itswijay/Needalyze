import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/** Tailwind class merge helper used by the shadcn/ui primitives. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
