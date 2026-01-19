import { useState } from 'react'
import { useObjectives, useCreateObjective, useUpdateObjective, useDeleteObjective } from '@/hooks/useObjectives'
import { useTimePeriods } from '@/hooks/useTimePeriods'
import { ObjectiveList } from './ObjectiveList'
import { ObjectiveForm } from './ObjectiveForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Objective, CreateObjectiveDto } from '@/types/objective'

export function ObjectivesPage() {
  const [timePeriodFilter, setTimePeriodFilter] = useState<string>('all')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null)
  const [deletingObjective, setDeletingObjective] = useState<Objective | null>(null)

  const { data: objectives, isLoading } = useObjectives(timePeriodFilter === 'all' ? undefined : timePeriodFilter)
  const { data: timePeriods } = useTimePeriods()
  // Handle both array and wrapped object responses
  const timePeriodsArray = Array.isArray(timePeriods) ? timePeriods : []
  const objectivesArray = Array.isArray(objectives) ? objectives : []
  const createMutation = useCreateObjective()
  const updateMutation = useUpdateObjective()
  const deleteMutation = useDeleteObjective()

  const handleOpenCreate = () => {
    setEditingObjective(null)
    setSheetOpen(true)
  }

  const handleEdit = (objective: Objective) => {
    setEditingObjective(objective)
    setSheetOpen(true)
  }

  const handleSubmit = (data: CreateObjectiveDto) => {
    if (editingObjective) {
      updateMutation.mutate(
        { id: editingObjective.id, data },
        {
          onSuccess: () => {
            toast.success('Objective updated successfully')
            setSheetOpen(false)
            setEditingObjective(null)
          },
          onError: (error) => {
            toast.error(`Failed to update objective: ${error.message}`)
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Objective created successfully')
          setSheetOpen(false)
        },
        onError: (error) => {
          toast.error(`Failed to create objective: ${error.message}`)
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingObjective) return

    deleteMutation.mutate(deletingObjective.id, {
      onSuccess: () => {
        toast.success('Objective deleted successfully')
        setDeletingObjective(null)
      },
      onError: (error) => {
        toast.error(`Failed to delete objective: ${error.message}`)
      },
    })
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Objectives</h1>
          <p className="text-muted-foreground">Manage your objectives and track progress</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Objective
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-64">
          <Select value={timePeriodFilter} onValueChange={setTimePeriodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time periods</SelectItem>
              {timePeriodsArray.map((tp) => (
                <SelectItem key={tp.id} value={tp.id}>
                  {tp.name} {tp.status === 'archived' && '(Archived)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ObjectiveList
        objectives={objectivesArray}
        timePeriods={timePeriodsArray}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeletingObjective}
        emptyAction={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Objective
          </Button>
        }
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingObjective ? 'Edit Objective' : 'New Objective'}</SheetTitle>
            <SheetDescription>
              {editingObjective
                ? 'Make changes to your objective below'
                : 'Fill in the details to create a new objective'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ObjectiveForm
              objective={editingObjective ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSheetOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deletingObjective}
        onOpenChange={(open) => !open && setDeletingObjective(null)}
        title="Delete Objective"
        description={`Are you sure you want to delete "${deletingObjective?.title}"? This action cannot be undone and will also delete all associated key results.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
