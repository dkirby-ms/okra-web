import { Card, CardContent } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { ProgressInput } from './ProgressInput'
import type { KeyResult } from '@/types/key-result'
import { cn } from '@/lib/utils'

interface KeyResultCardProps {
  keyResult: KeyResult
  isReadOnly?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onProgressUpdate?: (currentValue: number) => void
}

export function KeyResultCard({
  keyResult,
  isReadOnly = false,
  onEdit,
  onDelete,
  onProgressUpdate,
}: KeyResultCardProps) {
  // Calculate progress if not provided or if NaN
  const progress = 
    keyResult.progress != null && !Number.isNaN(keyResult.progress)
      ? keyResult.progress
      : keyResult.targetValue > 0
        ? (keyResult.currentValue / keyResult.targetValue) * 100
        : 0
  const isOverAchieved = progress > 100

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium">{keyResult.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {keyResult.currentValue} / {keyResult.targetValue}
              {isOverAchieved && (
                <span className="ml-2 text-green-600">(Over-achieved!)</span>
              )}
            </p>
          </div>
          <span
            className={cn(
              'text-lg font-bold tabular-nums',
              isOverAchieved && 'text-green-600'
            )}
          >
            {Math.round(progress)}%
          </span>
        </div>

        <div className="mt-3">
          <ProgressBar value={progress} showLabel={false} size="sm" />
        </div>

        {!isReadOnly && (
          <div className="mt-4 flex items-center justify-between">
            {onProgressUpdate && (
              <ProgressInput
                currentValue={keyResult.currentValue}
                targetValue={keyResult.targetValue}
                onSave={onProgressUpdate}
              />
            )}
            <div className="flex gap-2 text-sm">
              {onEdit && (
                <button onClick={onEdit} className="text-primary hover:underline">
                  Edit
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete} className="text-destructive hover:underline">
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
