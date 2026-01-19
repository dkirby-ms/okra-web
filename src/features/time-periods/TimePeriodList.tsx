import { TimePeriodCard } from './TimePeriodCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { TimePeriod } from '@/types/time-period'
import { Calendar } from 'lucide-react'

interface TimePeriodListProps {
  timePeriods: TimePeriod[] | undefined
  isLoading: boolean
  onEdit?: (timePeriod: TimePeriod) => void
  onArchive?: (timePeriod: TimePeriod) => void
  onDelete?: (timePeriod: TimePeriod) => void
  emptyAction?: React.ReactNode
}

export function TimePeriodList({
  timePeriods,
  isLoading,
  onEdit,
  onArchive,
  onDelete,
  emptyAction,
}: TimePeriodListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-16 rounded bg-muted" />
              <div className="h-8 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!timePeriods || timePeriods.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No time periods"
        description="Create time periods to organize your objectives"
        action={emptyAction}
      />
    )
  }

  // Sort: active periods first (by start date desc), then archived
  const sortedPeriods = [...timePeriods].sort((a, b) => {
    const aArchived = a.status === 'archived'
    const bArchived = b.status === 'archived'
    if (aArchived !== bArchived) {
      return aArchived ? 1 : -1
    }
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedPeriods.map((timePeriod) => (
        <TimePeriodCard
          key={timePeriod.id}
          timePeriod={timePeriod}
          onEdit={onEdit ? () => onEdit(timePeriod) : undefined}
          onArchive={onArchive ? () => onArchive(timePeriod) : undefined}
          onDelete={onDelete ? () => onDelete(timePeriod) : undefined}
        />
      ))}
    </div>
  )
}
