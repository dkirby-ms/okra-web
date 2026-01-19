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
      timePeriodId: objective?.timePeriodId ?? undefined,
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

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
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">No time period</SelectItem>
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
