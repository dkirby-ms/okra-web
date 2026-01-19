import { z } from 'zod'

// Zod schemas
export const keyResultSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  progress: z.number(),
})

export const objectiveSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().nullable(),
  timePeriodId: z.string().uuid().nullable(),
  progress: z.number().min(0),
  keyResults: z.array(keyResultSummarySchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createObjectiveSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().optional(),
  timePeriodId: z.string().uuid().optional(),
})

export const updateObjectiveSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  timePeriodId: z.string().uuid().nullable().optional(),
})

// TypeScript types derived from schemas
export type KeyResultSummary = z.infer<typeof keyResultSummarySchema>
export type Objective = z.infer<typeof objectiveSchema>
export type CreateObjectiveDto = z.infer<typeof createObjectiveSchema>
export type UpdateObjectiveDto = z.infer<typeof updateObjectiveSchema>
