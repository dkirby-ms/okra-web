import { z } from 'zod'

// Progress Summary
export const progressSummarySchema = z.object({
  totalObjectives: z.number(),
  completedObjectives: z.number(),
  averageProgress: z.number(),
  totalKeyResults: z.number(),
  completedKeyResults: z.number(),
})

export type ProgressSummary = z.infer<typeof progressSummarySchema>

// Status Distribution
export const objectiveStatusSchema = z.enum(['on-track', 'at-risk', 'behind', 'no-period'])

export type ObjectiveStatus = z.infer<typeof objectiveStatusSchema>

export const statusBucketSchema = z.object({
  status: objectiveStatusSchema,
  count: z.number(),
  percentage: z.number(),
})

export const statusDistributionSchema = z.object({
  totalObjectives: z.number(),
  distribution: z.array(statusBucketSchema),
})

export type StatusBucket = z.infer<typeof statusBucketSchema>
export type StatusDistribution = z.infer<typeof statusDistributionSchema>

// Error Response
export const errorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
})

export const errorResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
  details: z.array(errorDetailSchema).optional(),
})

export type ErrorDetail = z.infer<typeof errorDetailSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>

// API Error class for throwing typed errors
export class ApiError extends Error {
  statusCode: number
  error: string
  details?: ErrorDetail[]

  constructor(statusCode: number, message: string, error: string, details?: ErrorDetail[]) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.error = error
    this.details = details
  }

  static fromResponse(response: ErrorResponse): ApiError {
    return new ApiError(response.statusCode, response.message, response.error, response.details)
  }
}
