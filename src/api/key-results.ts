import { api } from './client'
import type {
  KeyResult,
  CreateKeyResultDto,
  UpdateKeyResultDto,
  UpdateKeyResultProgressDto,
} from '@/types/key-result'

interface ListResponse<T> {
  data: T[]
}

export const keyResultsApi = {
  list: async (): Promise<KeyResult[]> => {
    const response = await api.get<ListResponse<KeyResult>>('/key-results')
    return response.data
  },

  listByObjective: async (objectiveId: string): Promise<KeyResult[]> => {
    const response = await api.get<ListResponse<KeyResult>>(`/objectives/${objectiveId}/key-results`)
    return response.data
  },

  get: (id: string) => api.get<KeyResult>(`/key-results/${id}`),

  create: (data: CreateKeyResultDto) => api.post<KeyResult>('/key-results', data),

  update: (id: string, data: UpdateKeyResultDto) =>
    api.patch<KeyResult>(`/key-results/${id}`, data),

  updateProgress: (id: string, data: UpdateKeyResultProgressDto) =>
    api.patch<KeyResult>(`/key-results/${id}/progress`, data),

  delete: (id: string) => api.delete<void>(`/key-results/${id}`),
}
