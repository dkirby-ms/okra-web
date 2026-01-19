import { api } from './client'
import type { Objective, CreateObjectiveDto, UpdateObjectiveDto } from '@/types/objective'

interface ListResponse<T> {
  data: T[]
  cursor: string | null
  hasMore: boolean
}

export const objectivesApi = {
  list: async (timePeriodId?: string): Promise<Objective[]> => {
    const params = timePeriodId ? `?timePeriodId=${timePeriodId}` : ''
    const response = await api.get<ListResponse<Objective>>(`/objectives${params}`)
    return response.data
  },

  get: (id: string) => api.get<Objective>(`/objectives/${id}`),

  create: (data: CreateObjectiveDto) => api.post<Objective>('/objectives', data),

  update: (id: string, data: UpdateObjectiveDto) => api.patch<Objective>(`/objectives/${id}`, data),

  delete: (id: string) => api.delete<void>(`/objectives/${id}`),
}
