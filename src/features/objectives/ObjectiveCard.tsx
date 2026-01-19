import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { calculateObjectiveStatus } from '@/lib/status-calculator'
import type { Objective } from '@/types/objective'
import type { TimePeriod } from '@/types/time-period'
import { formatDateRange } from '@/lib/utils'
import { Calendar, Archive } from 'lucide-react'

interface ObjectiveCardProps {
  objective: Objective
  timePeriod?: TimePeriod | null
  onEdit?: () => void
  onDelete?: () => void
}

export function ObjectiveCard({ objective, timePeriod, onEdit, onDelete }: ObjectiveCardProps) {
  const status = calculateObjectiveStatus(objective, timePeriod)
  const isArchived = timePeriod?.status === 'archived'

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link
              to={`/objectives/${objective.id}`}
              className="block truncate font-medium hover:text-primary"
            >
              {objective.title}
            </Link>
            {objective.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {objective.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isArchived && (
              <Archive className="h-4 w-4 text-muted-foreground" aria-label="Archived" />
            )}
            <StatusBadge status={status} />
          </div>
        </div>

        {timePeriod && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{timePeriod.name}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{formatDateRange(timePeriod.startDate, timePeriod.endDate)}</span>
          </div>
        )}

        <div className="mt-3">
          <ProgressBar value={objective.progress} size="sm" />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {objective.keyResults?.length ?? 0} key result
            {(objective.keyResults?.length ?? 0) !== 1 ? 's' : ''}
          </span>
          {!isArchived && (onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onEdit()
                  }}
                  className="text-primary hover:underline"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete()
                  }}
                  className="text-destructive hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
