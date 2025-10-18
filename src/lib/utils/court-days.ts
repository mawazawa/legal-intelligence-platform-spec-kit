/**
 * Court Day Calculation Utilities
 * Pure functions for calculating court deadlines (excluding weekends)
 */

/**
 * Calculate a date X court days before a hearing date
 * Court days exclude weekends (Saturday and Sunday)
 *
 * @param hearingDate - The hearing date
 * @param daysNeeded - Number of court days before hearing
 * @returns Date that is X court days before hearing
 *
 * @example
 * // If hearing is Monday Jan 15, and we need 5 court days
 * // Result will be Monday Jan 8 (skipping weekend)
 * const deadline = calculateCourtDays(new Date('2024-01-15'), 5)
 */
export function calculateCourtDays(hearingDate: Date, daysNeeded: number): Date {
  const result = new Date(hearingDate)
  let daysSubtracted = 0

  while (daysSubtracted < daysNeeded) {
    result.setDate(result.getDate() - 1)
    const dayOfWeek = result.getDay()
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysSubtracted++
    }
  }

  return result
}

/**
 * Calculate days remaining until a hearing date (excluding weekends)
 *
 * @param hearingDate - The hearing date
 * @param fromDate - Starting date (defaults to today)
 * @returns Number of court days until hearing
 */
export function calculateDaysUntilHearing(
  hearingDate: Date,
  fromDate: Date = new Date()
): number {
  let days = 0
  const current = new Date(fromDate)
  const target = new Date(hearingDate)

  // Normalize to midnight for accurate comparison
  current.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  while (current < target) {
    current.setDate(current.getDate() + 1)
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++
    }
  }

  return days
}

/**
 * Check if a date falls on a weekend
 *
 * @param date - Date to check
 * @returns True if Saturday or Sunday
 */
export function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}
