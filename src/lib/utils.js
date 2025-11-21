import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format numbers with standard international commas (every 3 digits)
export function formatNumber(num) {
  if (!num && num !== 0) return '';
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) return '';
  
  return new Intl.NumberFormat('en-US').format(numValue);
}

// Format currency with standard international numbering (120,000, 9,000,000)
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '';
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
  
  return `Rs. ${formatted}`;
}
