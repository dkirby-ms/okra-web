import type { Objective } from '@/types/objective'
import type { TimePeriod } from '@/types/time-period'
import type { ObjectiveStatus } from '@/types/api'

/**
 * Calculate the status of an objective based on time elapsed vs progress achieved.
 *
 * Status logic:
 * - If no time period: 'no-period'
 * - If actual/expected >= 0.9: 'on-track'
 * - If actual/expected >= 0.5: 'at-risk'
 * - Otherwise: 'behind'
 */
export function calculateObjectiveStatus(
  objective: Objective,
  timePeriod: TimePeriod | null | undefined,
  now: Date = new Date()
): ObjectiveStatus {
  if (!timePeriod) {
    return 'no-period'
  }

  const startDate = new Date(timePeriod.startDate)
  const endDate = new Date(timePeriod.endDate)

  // If the period hasn't started yet, consider it on-track
  if (now < startDate) {
    return 'on-track'
  }

  // If the period has ended, check final progress
  if (now > endDate) {
    return objective.progress >= 100 ? 'on-track' : 'behind'
  }

  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100)

  // Avoid division by zero
  if (expectedProgress === 0) {
    return 'on-track'
  }

  const ratio = objective.progress / expectedProgress

  if (ratio >= 0.9) {
    return 'on-track'
  }
  if (ratio >= 0.5) {
    return 'at-risk'
  }
  return 'behind'
}
