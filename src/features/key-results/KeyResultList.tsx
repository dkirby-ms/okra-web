import { KeyResultCard } from './KeyResultCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { KeyResult } from '@/types/key-result'
import { ListChecks } from 'lucide-react'

interface KeyResultListProps {
  keyResults: KeyResult[] | undefined
  isLoading: boolean
  isReadOnly?: boolean
  onEdit?: (keyResult: KeyResult) => void
  onDelete?: (keyResult: KeyResult) => void
  onProgressUpdate?: (keyResult: KeyResult, currentValue: number) => void
  emptyAction?: React.ReactNode
}

export function KeyResultList({
  keyResults,
  isLoading,
  isReadOnly = false,
  onEdit,
  onDelete,
  onProgressUpdate,
  emptyAction,
}: KeyResultListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-1/4 rounded bg-muted" />
            <div className="mt-4 h-2 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (!keyResults || keyResults.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No key results"
        description="Add key results to measure progress toward this objective"
        action={emptyAction}
      />
    )
  }

  return (
    <div className="space-y-4">
      {keyResults.map((keyResult) => (
        <KeyResultCard
          key={keyResult.id}
          keyResult={keyResult}
          isReadOnly={isReadOnly}
          onEdit={onEdit ? () => onEdit(keyResult) : undefined}
          onDelete={onDelete ? () => onDelete(keyResult) : undefined}
          onProgressUpdate={
            onProgressUpdate ? (value) => onProgressUpdate(keyResult, value) : undefined
          }
        />
      ))}
    </div>
  )
}
