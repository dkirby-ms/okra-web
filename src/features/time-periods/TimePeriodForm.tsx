import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTimePeriodSchema, type TimePeriod } from '@/types/time-period'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TimePeriodFormData {
  name: string
  startDate: string
  endDate: string
}

interface TimePeriodFormProps {
  timePeriod?: TimePeriod
  onSubmit: (data: TimePeriodFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

function formatDateForInput(dateString: string): string {
  // If already in YYYY-MM-DD format, return as-is (avoid timezone issues)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  // Otherwise, try to extract the date portion
  try {
    // For ISO datetime strings, just take the date part
    const datePart = dateString.split('T')[0]
    if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart
    }
    return dateString
  } catch {
    return dateString
  }
}

export function TimePeriodForm({
  timePeriod,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TimePeriodFormProps) {
  const form = useForm<TimePeriodFormData>({
    resolver: zodResolver(createTimePeriodSchema),
    defaultValues: {
      name: timePeriod?.name ?? '',
      startDate: timePeriod ? formatDateForInput(timePeriod.startDate) : '',
      endDate: timePeriod ? formatDateForInput(timePeriod.endDate) : '',
    },
  })

  const handleSubmit = form.handleSubmit(onSubmit)

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Q1 2026" {...field} autoFocus />
              </FormControl>
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
            {isSubmitting ? 'Saving...' : timePeriod ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
