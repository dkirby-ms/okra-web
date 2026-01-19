import { ObjectiveCard } from './ObjectiveCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Objective } from '@/types/objective'
import type { TimePeriod } from '@/types/time-period'
import { Target } from 'lucide-react'

interface ObjectiveListProps {
  objectives: Objective[] | undefined
  timePeriods: TimePeriod[] | undefined
  isLoading: boolean
  onEdit?: (objective: Objective) => void
  onDelete?: (objective: Objective) => void
  emptyAction?: React.ReactNode
}

export function ObjectiveList({
  objectives,
  timePeriods,
  isLoading,
  onEdit,
  onDelete,
  emptyAction,
}: ObjectiveListProps) {
  // Handle both array and wrapped object responses
  const timePeriodsArray = Array.isArray(timePeriods) ? timePeriods : []
  const timePeriodMap = new Map(timePeriodsArray.map((tp) => [tp.id, tp]))

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
            <div className="mt-4 h-2 w-full rounded bg-muted" />
            <div className="mt-3 h-4 w-1/4 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (!objectives || objectives.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No objectives found"
        description="Get started by creating your first objective"
        action={emptyAction}
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {objectives.map((objective) => (
        <ObjectiveCard
          key={objective.id}
          objective={objective}
          timePeriod={objective.timePeriodId ? timePeriodMap.get(objective.timePeriodId) : null}
          onEdit={onEdit ? () => onEdit(objective) : undefined}
          onDelete={onDelete ? () => onDelete(objective) : undefined}
        />
      ))}
    </div>
  )
}
