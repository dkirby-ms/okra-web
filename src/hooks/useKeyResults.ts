import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { keyResultsApi } from '@/api/key-results'
import type {
  CreateKeyResultDto,
  UpdateKeyResultDto,
  UpdateKeyResultProgressDto,
} from '@/types/key-result'
import { objectiveKeys } from './useObjectives'

export const keyResultKeys = {
  all: ['keyResults'] as const,
  lists: () => [...keyResultKeys.all, 'list'] as const,
  list: () => [...keyResultKeys.lists(), 'all'] as const,
  byObjective: (objectiveId: string) => [...keyResultKeys.lists(), { objectiveId }] as const,
  details: () => [...keyResultKeys.all, 'detail'] as const,
  detail: (id: string) => [...keyResultKeys.details(), id] as const,
}

export function useKeyResults() {
  return useQuery({
    queryKey: keyResultKeys.list(),
    queryFn: () => keyResultsApi.list(),
  })
}

export function useKeyResultsByObjective(objectiveId: string) {
  return useQuery({
    queryKey: keyResultKeys.byObjective(objectiveId),
    queryFn: () => keyResultsApi.listByObjective(objectiveId),
    enabled: !!objectiveId,
  })
}

export function useKeyResult(id: string) {
  return useQuery({
    queryKey: keyResultKeys.detail(id),
    queryFn: () => keyResultsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateKeyResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateKeyResultDto) => keyResultsApi.create(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: keyResultKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: keyResultKeys.byObjective(variables.objectiveId),
      })
      // Also invalidate the parent objective as its progress may have changed
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.detail(variables.objectiveId) })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}

export function useUpdateKeyResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKeyResultDto }) =>
      keyResultsApi.update(id, data),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: keyResultKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: keyResultKeys.byObjective(result.objectiveId),
      })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.detail(result.objectiveId) })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}

export function useUpdateKeyResultProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKeyResultProgressDto }) =>
      keyResultsApi.updateProgress(id, data),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: keyResultKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: keyResultKeys.byObjective(result.objectiveId),
      })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.detail(result.objectiveId) })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}

export function useDeleteKeyResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, objectiveId }: { id: string; objectiveId: string }) =>
      keyResultsApi.delete(id).then(() => objectiveId),
    onSuccess: (objectiveId) => {
      void queryClient.invalidateQueries({ queryKey: keyResultKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: keyResultKeys.byObjective(objectiveId) })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.detail(objectiveId) })
      void queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() })
    },
  })
}
