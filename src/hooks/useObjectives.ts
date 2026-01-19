import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { objectivesApi } from '@/api/objectives'
import type { CreateObjectiveDto, UpdateObjectiveDto } from '@/types/objective'

export const objectiveKeys = {
  all: ['objectives'] as const,
  lists: () => [...objectiveKeys.all, 'list'] as const,
  list: (timePeriodId?: string) => [...objectiveKeys.lists(), { timePeriodId }] as const,
  details: () => [...objectiveKeys.all, 'detail'] as const,
  detail: (id: string) => [...objectiveKeys.details(), id] as const,
}

export function useObjectives(timePeriodId?: string) {
  return useQuery({
    queryKey: objectiveKeys.list(timePeriodId),
    queryFn: () => objectivesApi.list(timePeriodId),
  })
}

export function useObjective(id: string) {
  return useQuery({
    queryKey: objectiveKeys.detail(id),
    queryFn: () => objectivesApi.get(id),
    enabled: !!id,
  })
}

export function useCreateObjective() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateObjectiveDto) => objectivesApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}

export function useUpdateObjective() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateObjectiveDto }) =>
      objectivesApi.update(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.detail(variables.id) })
    },
  })
}

export function useDeleteObjective() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => objectivesApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}
