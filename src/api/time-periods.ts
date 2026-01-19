import { api } from './client'
import type { TimePeriod, CreateTimePeriodDto, UpdateTimePeriodDto } from '@/types/time-period'

interface ListResponse<T> {
  data: T[]
}

export const timePeriodsApi = {
  list: async (): Promise<TimePeriod[]> => {
    const response = await api.get<ListResponse<TimePeriod>>('/time-periods')
    return response.data
  },

  get: (id: string) => api.get<TimePeriod>(`/time-periods/${id}`),

  create: (data: CreateTimePeriodDto) => api.post<TimePeriod>('/time-periods', data),

  update: (id: string, data: UpdateTimePeriodDto) =>
    api.patch<TimePeriod>(`/time-periods/${id}`, data),

  archive: (id: string) => api.post<TimePeriod>(`/time-periods/${id}/archive`),

  delete: (id: string) => api.delete<void>(`/time-periods/${id}`),
}
