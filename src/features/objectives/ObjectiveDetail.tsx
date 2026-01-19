import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useObjective } from '@/hooks/useObjectives'
import { useKeyResultsByObjective, useCreateKeyResult, useUpdateKeyResult, useUpdateKeyResultProgress, useDeleteKeyResult } from '@/hooks/useKeyResults'
import { useTimePeriod } from '@/hooks/useTimePeriods'
import { KeyResultList } from '@/features/key-results/KeyResultList'
import { KeyResultForm } from '@/features/key-results/KeyResultForm'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { calculateObjectiveStatus } from '@/lib/status-calculator'
import { formatDateRange } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ArrowLeft, Calendar, Plus, Archive } from 'lucide-react'
import { toast } from 'sonner'
import type { KeyResult } from '@/types/key-result'

export function ObjectiveDetail() {
  const { id } = useParams<{ id: string }>()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingKeyResult, setEditingKeyResult] = useState<KeyResult | null>(null)
  const [deletingKeyResult, setDeletingKeyResult] = useState<KeyResult | null>(null)

  const { data: objective, isLoading: isLoadingObjective } = useObjective(id!)
  const { data: keyResults, isLoading: isLoadingKeyResults } = useKeyResultsByObjective(id!)
  const { data: timePeriod } = useTimePeriod(objective?.timePeriodId ?? '')
  // Handle both array and wrapped object responses
  const keyResultsArray = Array.isArray(keyResults) ? keyResults : []

  const createMutation = useCreateKeyResult()
  const updateMutation = useUpdateKeyResult()
  const updateProgressMutation = useUpdateKeyResultProgress()
  const deleteMutation = useDeleteKeyResult()

  const isReadOnly = timePeriod?.isArchived ?? false
  const status = objective ? calculateObjectiveStatus(objective, timePeriod) : 'no-period'

  const handleOpenCreate = () => {
    setEditingKeyResult(null)
    setSheetOpen(true)
  }

  const handleEdit = (keyResult: KeyResult) => {
    setEditingKeyResult(keyResult)
    setSheetOpen(true)
  }

  const handleSubmit = (data: { title: string; targetValue: number; currentValue: number }) => {
    if (editingKeyResult) {
      updateMutation.mutate(
        { id: editingKeyResult.id, data },
        {
          onSuccess: () => {
            toast.success('Key result updated successfully')
            setSheetOpen(false)
            setEditingKeyResult(null)
          },
          onError: (error) => {
            toast.error(`Failed to update key result: ${error.message}`)
          },
        }
      )
    } else {
      createMutation.mutate(
        { ...data, objectiveId: id! },
        {
          onSuccess: () => {
            toast.success('Key result created successfully')
            setSheetOpen(false)
          },
          onError: (error) => {
            toast.error(`Failed to create key result: ${error.message}`)
          },
        }
      )
    }
  }

  const handleProgressUpdate = (keyResult: KeyResult, currentValue: number) => {
    updateProgressMutation.mutate(
      { id: keyResult.id, data: { currentValue } },
      {
        onSuccess: () => {
          toast.success('Progress updated')
        },
        onError: (error) => {
          toast.error(`Failed to update progress: ${error.message}`)
        },
      }
    )
  }

  const handleDelete = () => {
    if (!deletingKeyResult) return

    deleteMutation.mutate(
      { id: deletingKeyResult.id, objectiveId: id! },
      {
        onSuccess: () => {
          toast.success('Key result deleted successfully')
          setDeletingKeyResult(null)
        },
        onError: (error) => {
          toast.error(`Failed to delete key result: ${error.message}`)
        },
      }
    )
  }

  if (isLoadingObjective) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (!objective) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Objective not found</p>
        <Button variant="link" asChild className="mt-2 p-0">
          <Link to="/objectives">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to objectives
          </Link>
        </Button>
      </div>
    )
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/objectives">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to objectives</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{objective.title}</h1>
          {objective.description && (
            <p className="mt-1 text-muted-foreground">{objective.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isReadOnly && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Archive className="h-4 w-4" />
              <span>Archived</span>
            </div>
          )}
          <StatusBadge status={status} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar value={objective.progress} size="lg" />
          {timePeriod && (
            <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{timePeriod.name}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{formatDateRange(timePeriod.startDate, timePeriod.endDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Key Results</h2>
          {!isReadOnly && (
            <Button onClick={handleOpenCreate} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Key Result
            </Button>
          )}
        </div>

        <KeyResultList
          keyResults={keyResultsArray}
          isLoading={isLoadingKeyResults}
          isReadOnly={isReadOnly}
          onEdit={handleEdit}
          onDelete={setDeletingKeyResult}
          onProgressUpdate={handleProgressUpdate}
          emptyAction={
            !isReadOnly ? (
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Key Result
              </Button>
            ) : undefined
          }
        />
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingKeyResult ? 'Edit Key Result' : 'New Key Result'}</SheetTitle>
            <SheetDescription>
              {editingKeyResult
                ? 'Make changes to your key result below'
                : 'Fill in the details to create a new key result'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <KeyResultForm
              keyResult={editingKeyResult ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSheetOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deletingKeyResult}
        onOpenChange={(open) => !open && setDeletingKeyResult(null)}
        title="Delete Key Result"
        description={`Are you sure you want to delete "${deletingKeyResult?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
