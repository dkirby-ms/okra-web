import { api } from './client'
import type { ProgressSummary, StatusDistribution } from '@/types/api'

export const reportsApi = {
  getProgressSummary: () => api.get<ProgressSummary>('/reports/progress-summary'),

  getStatusDistribution: () => api.get<StatusDistribution>('/reports/status-distribution'),
}
