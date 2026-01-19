import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { TimePeriod } from '@/types/time-period'
import { formatDateRange } from '@/lib/utils'
import { Archive, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimePeriodCardProps {
  timePeriod: TimePeriod
  onEdit?: () => void
  onArchive?: () => void
  onDelete?: () => void
}

export function TimePeriodCard({
  timePeriod,
  onEdit,
  onArchive,
  onDelete,
}: TimePeriodCardProps) {
  const isArchived = timePeriod.isArchived

  return (
    <Card className={cn(isArchived && 'opacity-60')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium">{timePeriod.name}</h3>
              {isArchived && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  <Archive className="h-3 w-3" />
                  Archived
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateRange(timePeriod.startDate, timePeriod.endDate)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {!isArchived && (
            <>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Edit
                </Button>
              )}
              {onArchive && (
                <Button variant="outline" size="sm" onClick={onArchive}>
                  Archive
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
