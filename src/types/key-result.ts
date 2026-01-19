import { z } from 'zod'

// Zod schemas
export const keyResultSchema = z.object({
  id: z.string().uuid(),
  objectiveId: z.string().uuid(),
  title: z.string().min(1).max(200),
  targetValue: z.number().positive(),
  currentValue: z.number().min(0),
  progress: z.number().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createKeyResultSchema = z.object({
  objectiveId: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  targetValue: z.number().positive('Target value must be greater than 0'),
  currentValue: z.number().min(0, 'Current value must be 0 or greater').optional().default(0),
})

export const updateKeyResultSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  targetValue: z.number().positive().optional(),
  currentValue: z.number().min(0).optional(),
})

export const updateKeyResultProgressSchema = z.object({
  currentValue: z.number().min(0, 'Current value must be 0 or greater'),
})

// TypeScript types derived from schemas
export type KeyResult = z.infer<typeof keyResultSchema>
export type CreateKeyResultDto = z.infer<typeof createKeyResultSchema>
export type UpdateKeyResultDto = z.infer<typeof updateKeyResultSchema>
export type UpdateKeyResultProgressDto = z.infer<typeof updateKeyResultProgressSchema>
