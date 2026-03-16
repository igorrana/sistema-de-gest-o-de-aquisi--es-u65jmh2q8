/* General utility functions (exposes cn) */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates remaining days for a deadline based on calendar days.
 * @returns number of days left (negative if overdue, 0 if due today), or null if missing inputs
 */
export function calculateDeadlineDays(
  statusChangedAt: string | null | undefined,
  maxDays: number | null | undefined,
): number | null {
  if (maxDays == null || !statusChangedAt) return null

  const start = new Date(statusChangedAt)
  start.setHours(0, 0, 0, 0)

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const deadline = new Date(start)
  deadline.setDate(deadline.getDate() + maxDays)

  const diffMs = deadline.getTime() - now.getTime()
  return Math.round(diffMs / 86400000) // 86400000 ms in a day
}
