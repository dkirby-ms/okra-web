import { useState } from 'react'
import {
  useTimePeriods,
  useCreateTimePeriod,
  useUpdateTimePeriod,
  useArchiveTimePeriod,
  useDeleteTimePeriod,
} from '@/hooks/useTimePeriods'
import { TimePeriodList } from './TimePeriodList'
import { TimePeriodForm } from './TimePeriodForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { TimePeriod, CreateTimePeriodDto } from '@/types/time-period'

export function TimePeriodsPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTimePeriod, setEditingTimePeriod] = useState<TimePeriod | null>(null)
  const [archivingTimePeriod, setArchivingTimePeriod] = useState<TimePeriod | null>(null)
  const [deletingTimePeriod, setDeletingTimePeriod] = useState<TimePeriod | null>(null)

  const { data: timePeriods, isLoading } = useTimePeriods()
  // Handle both array and wrapped object responses
  const timePeriodsArray = Array.isArray(timePeriods) ? timePeriods : []
  const createMutation = useCreateTimePeriod()
  const updateMutation = useUpdateTimePeriod()
  const archiveMutation = useArchiveTimePeriod()
  const deleteMutation = useDeleteTimePeriod()

  const handleOpenCreate = () => {
    setEditingTimePeriod(null)
    setSheetOpen(true)
  }

  const handleEdit = (timePeriod: TimePeriod) => {
    setEditingTimePeriod(timePeriod)
    setSheetOpen(true)
  }

  const handleSubmit = (data: CreateTimePeriodDto) => {
    if (editingTimePeriod) {
      updateMutation.mutate(
        { id: editingTimePeriod.id, data: { ...data, version: editingTimePeriod.version } },
        {
          onSuccess: () => {
            toast.success('Time period updated successfully')
            setSheetOpen(false)
            setEditingTimePeriod(null)
          },
          onError: (error) => {
            toast.error(`Failed to update time period: ${error.message}`)
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Time period created successfully')
          setSheetOpen(false)
        },
        onError: (error) => {
          toast.error(`Failed to create time period: ${error.message}`)
        },
      })
    }
  }

  const handleArchive = () => {
    if (!archivingTimePeriod) return

    archiveMutation.mutate(archivingTimePeriod.id, {
      onSuccess: () => {
        toast.success('Time period archived successfully')
        setArchivingTimePeriod(null)
      },
      onError: (error) => {
        toast.error(`Failed to archive time period: ${error.message}`)
      },
    })
  }

  const handleDelete = () => {
    if (!deletingTimePeriod) return

    deleteMutation.mutate(deletingTimePeriod.id, {
      onSuccess: () => {
        toast.success('Time period deleted successfully')
        setDeletingTimePeriod(null)
      },
      onError: (error) => {
        toast.error(`Failed to delete time period: ${error.message}`)
      },
    })
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Time Periods</h1>
          <p className="text-muted-foreground">Manage your OKR time periods</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Period
        </Button>
      </div>

      <TimePeriodList
        timePeriods={timePeriodsArray}
        isLoading={isLoading}
        onEdit={handleEdit}
        onArchive={setArchivingTimePeriod}
        onDelete={setDeletingTimePeriod}
        emptyAction={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Period
          </Button>
        }
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingTimePeriod ? 'Edit Time Period' : 'New Time Period'}</SheetTitle>
            <SheetDescription>
              {editingTimePeriod
                ? 'Make changes to your time period below'
                : 'Fill in the details to create a new time period'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <TimePeriodForm
              timePeriod={editingTimePeriod ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSheetOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!archivingTimePeriod}
        onOpenChange={(open) => !open && setArchivingTimePeriod(null)}
        title="Archive Time Period"
        description={`Are you sure you want to archive "${archivingTimePeriod?.name}"? Objectives in this time period will become read-only.`}
        confirmLabel="Archive"
        onConfirm={handleArchive}
        isLoading={archiveMutation.isPending}
        variant="default"
      />

      <ConfirmDialog
        open={!!deletingTimePeriod}
        onOpenChange={(open) => !open && setDeletingTimePeriod(null)}
        title="Delete Time Period"
        description={`Are you sure you want to delete "${deletingTimePeriod?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
