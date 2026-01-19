import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { KeyResult } from '@/types/key-result'
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

// Form schema uses strings for number inputs, then converts on submit
const keyResultFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  targetValue: z.string().min(1, 'Target value is required'),
  currentValue: z.string(),
})

type KeyResultFormData = z.infer<typeof keyResultFormSchema>

interface KeyResultFormProps {
  keyResult?: KeyResult
  onSubmit: (data: { title: string; targetValue: number; currentValue: number }) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function KeyResultForm({
  keyResult,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: KeyResultFormProps) {
  const form = useForm<KeyResultFormData>({
    resolver: zodResolver(keyResultFormSchema),
    defaultValues: {
      title: keyResult?.title ?? '',
      targetValue: String(keyResult?.targetValue ?? 100),
      currentValue: String(keyResult?.currentValue ?? 0),
    },
  })

  const handleFormSubmit = (data: KeyResultFormData) => {
    const targetValue = Number(data.targetValue)
    const currentValue = Number(data.currentValue)

    if (isNaN(targetValue) || targetValue <= 0) {
      form.setError('targetValue', { message: 'Target value must be greater than 0' })
      return
    }

    if (isNaN(currentValue) || currentValue < 0) {
      form.setError('currentValue', { message: 'Current value must be 0 or greater' })
      return
    }

    onSubmit({
      title: data.title,
      targetValue,
      currentValue,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter key result title" {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Value</FormLabel>
                <FormControl>
                  <Input type="number" min={0} placeholder="0" {...field} />
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
            {isSubmitting ? 'Saving...' : keyResult ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
