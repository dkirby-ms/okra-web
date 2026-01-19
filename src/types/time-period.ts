import { z } from 'zod'

// Zod schemas
export const timePeriodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  startDate: z.string(), // ISO 8601 date string
  endDate: z.string(), // ISO 8601 date string
  isArchived: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createTimePeriodSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return end > start
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )

export const updateTimePeriodSchema = z
  .object({
    name: z.string().min(1).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate)
        const end = new Date(data.endDate)
        return end > start
      }
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )

// TypeScript types derived from schemas
export type TimePeriod = z.infer<typeof timePeriodSchema>
export type CreateTimePeriodDto = z.infer<typeof createTimePeriodSchema>
export type UpdateTimePeriodDto = z.infer<typeof updateTimePeriodSchema>
