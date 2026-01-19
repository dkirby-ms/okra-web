import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createObjectiveSchema, type CreateObjectiveDto, type Objective } from '@/types/objective'
import { useTimePeriods } from '@/hooks/useTimePeriods'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

// Default owner ID - in a real app, this would come from auth context
// Must be a valid UUID v4 format (version 4, variant 1)
const DEFAULT_OWNER_ID = 'a0000000-0000-4000-8000-000000000001'

interface ObjectiveFormProps {
  objective?: Objective
  onSubmit: (data: CreateObjectiveDto) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ObjectiveForm({
  objective,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ObjectiveFormProps) {
  const { data: timePeriods } = useTimePeriods()
  // Handle both array and wrapped object responses
  const timePeriodsArray = Array.isArray(timePeriods) ? timePeriods : []
  const activeTimePeriods = timePeriodsArray.filter((tp) => tp.status !== 'archived')

  const form = useForm<CreateObjectiveDto>({
    resolver: zodResolver(createObjectiveSchema),
    defaultValues: {
      title: objective?.title ?? '',
      description: objective?.description ?? '',
      ownerType: objective?.ownerType ?? 'user',
      ownerId: objective?.ownerId ?? DEFAULT_OWNER_ID,
      timePeriodId: objective?.timePeriodId ?? undefined,
      startDate: objective?.startDate ?? '',
      endDate: objective?.endDate ?? '',
    },
  })

  // Ensure ownerId and ownerType are always set
  useEffect(() => {
    const currentOwnerId = form.getValues('ownerId')
    const currentOwnerType = form.getValues('ownerType')
    if (!currentOwnerId) {
      form.setValue('ownerId', DEFAULT_OWNER_ID)
    }
    if (!currentOwnerType) {
      form.setValue('ownerType', 'user')
    }
  }, [form])

  const selectedTimePeriodId = form.watch('timePeriodId')

  // Auto-fill dates from selected time period
  useEffect(() => {
    if (selectedTimePeriodId) {
      const timePeriod = timePeriodsArray.find((tp) => tp.id === selectedTimePeriodId)
      if (timePeriod) {
        const currentStartDate = form.getValues('startDate')
        const currentEndDate = form.getValues('endDate')
        // Only auto-fill if dates are empty
        if (!currentStartDate) {
          form.setValue('startDate', timePeriod.startDate)
        }
        if (!currentEndDate) {
          form.setValue('endDate', timePeriod.endDate)
        }
      }
    }
  }, [selectedTimePeriodId, timePeriodsArray, form])

  const handleSubmit = form.handleSubmit(
    (data) => {
      // Ensure owner fields are set
      const submitData: CreateObjectiveDto = {
        ...data,
        ownerType: data.ownerType || 'user',
        ownerId: data.ownerId || DEFAULT_OWNER_ID,
      }
      onSubmit(submitData)
    },
    (errors) => {
      console.error('Form validation errors:', errors)
      console.log('Form values at error:', form.getValues())
    }
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter objective title" {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description for this objective"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timePeriodId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Period (optional)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}
                value={field.value ?? 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No time period</SelectItem>
                  {activeTimePeriods.map((tp) => (
                    <SelectItem key={tp.id} value={tp.id}>
                      {tp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : objective ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
