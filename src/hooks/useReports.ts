import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '@/api/reports'

export const reportKeys = {
  all: ['reports'] as const,
  progressSummary: () => [...reportKeys.all, 'progressSummary'] as const,
  statusDistribution: () => [...reportKeys.all, 'statusDistribution'] as const,
}

export function useProgressSummary() {
  return useQuery({
    queryKey: reportKeys.progressSummary(),
    queryFn: () => reportsApi.getProgressSummary(),
  })
}

export function useStatusDistribution() {
  return useQuery({
    queryKey: reportKeys.statusDistribution(),
    queryFn: () => reportsApi.getStatusDistribution(),
  })
}
