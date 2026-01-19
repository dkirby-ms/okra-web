import { z } from 'zod'

// Zod schemas
export const keyResultSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  progress: z.number(),
})

export const objectiveSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().nullable(),
  ownerType: z.enum(['user', 'team', 'organization']),
  ownerId: z.string().uuid(),
  timePeriodId: z.string().uuid().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  progress: z.number().min(0),
  version: z.number().min(1),
  keyResults: z.array(keyResultSummarySchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createObjectiveSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  description: z.string().optional(),
  ownerType: z.enum(['user', 'team', 'organization']),
  ownerId: z.string().uuid(),
  timePeriodId: z.string().uuid().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
})

export const updateObjectiveSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  timePeriodId: z.string().uuid().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  version: z.number().min(1),
})

// TypeScript types derived from schemas
export type KeyResultSummary = z.infer<typeof keyResultSummarySchema>
export type Objective = z.infer<typeof objectiveSchema>
export type CreateObjectiveDto = z.infer<typeof createObjectiveSchema>
export type UpdateObjectiveDto = z.infer<typeof updateObjectiveSchema>
