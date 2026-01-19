import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { timePeriodsApi } from '@/api/time-periods'
import type { CreateTimePeriodDto, UpdateTimePeriodDto } from '@/types/time-period'
import { objectiveKeys } from './useObjectives'

export const timePeriodKeys = {
  all: ['timePeriods'] as const,
  lists: () => [...timePeriodKeys.all, 'list'] as const,
  list: () => [...timePeriodKeys.lists(), 'all'] as const,
  details: () => [...timePeriodKeys.all, 'detail'] as const,
  detail: (id: string) => [...timePeriodKeys.details(), id] as const,
}

export function useTimePeriods() {
  return useQuery({
    queryKey: timePeriodKeys.list(),
    queryFn: () => timePeriodsApi.list(),
  })
}

export function useTimePeriod(id: string) {
  return useQuery({
    queryKey: timePeriodKeys.detail(id),
    queryFn: () => timePeriodsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateTimePeriod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTimePeriodDto) => timePeriodsApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: timePeriodKeys.lists() })
    },
  })
}

export function useUpdateTimePeriod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimePeriodDto }) =>
      timePeriodsApi.update(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: timePeriodKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: timePeriodKeys.detail(variables.id) })
    },
  })
}

export function useArchiveTimePeriod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => timePeriodsApi.archive(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: timePeriodKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: timePeriodKeys.detail(id) })
      // Objectives in this time period are now read-only, refresh them
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}

export function useDeleteTimePeriod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => timePeriodsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: timePeriodKeys.lists() })
      // Objectives may be affected
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}
