import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format an ISO date string to a human-readable format
 */
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatStr)
  } catch {
    return dateString
  }
}

/**
 * Format a date range
 */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}
